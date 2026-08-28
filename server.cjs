const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = parseInt(process.env.PORT || '8080', 10);
const DIST_DIR = path.resolve(__dirname, 'dist');
const MANUALS_DIR = path.resolve(__dirname, 'manuals');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8'
};

let tokenCache = null;

function createJwt(serviceAccount, scope) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: serviceAccount.client_email,
    scope: scope,
    aud: serviceAccount.token_uri || 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedClaim = Buffer.from(JSON.stringify(claim)).toString('base64url');
  const signatureInput = `${encodedHeader}.${encodedClaim}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  const signature = signer.sign(serviceAccount.private_key, 'base64url');
  return `${signatureInput}.${signature}`;
}

async function getAccessToken() {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now + 60000) {
    return tokenCache.token;
  }

  // 1. Try credentials/google.json or credentials/firebase.json
  const credsPaths = [
    path.resolve(__dirname, 'credentials/google.json'),
    path.resolve(__dirname, 'credentials/firebase.json')
  ];

  for (const credsPath of credsPaths) {
    if (fs.existsSync(credsPath)) {
      try {
        const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
        if (creds.client_email && creds.private_key) {
          const jwt = createJwt(creds, 'https://www.googleapis.com/auth/cloud-platform');
          const res = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
              assertion: jwt
            })
          });
          const data = await res.json();
          if (data.access_token) {
            tokenCache = {
              token: data.access_token,
              projectId: creds.project_id,
              expiresAt: now + (data.expires_in || 3600) * 1000
            };
            return tokenCache.token;
          }
        }
      } catch (e) {
        console.warn(`[Auth] Failed to load creds from ${credsPath}:`, e.message);
      }
    }
  }

  // 2. Try GCP Compute / Cloud Run Metadata server
  try {
    const metaRes = await fetch('http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token', {
      headers: { 'Metadata-Flavor': 'Google' },
      signal: AbortSignal.timeout(1500)
    });
    if (metaRes.ok) {
      const metaData = await metaRes.json();
      if (metaData.access_token) {
        tokenCache = {
          token: metaData.access_token,
          expiresAt: now + (metaData.expires_in || 3600) * 1000
        };
        return tokenCache.token;
      }
    }
  } catch (_) {
    // Not running on GCP or metadata server not accessible
  }

  return null;
}

function getProjectId() {
  if (tokenCache && tokenCache.projectId) return tokenCache.projectId;
  if (process.env.GOOGLE_CLOUD_PROJECT) return process.env.GOOGLE_CLOUD_PROJECT;
  if (process.env.GCP_PROJECT) return process.env.GCP_PROJECT;

  const credsPath = path.resolve(__dirname, 'credentials/google.json');
  if (fs.existsSync(credsPath)) {
    try {
      const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
      if (creds.project_id) return creds.project_id;
    } catch (_) {}
  }
  return 'vectorai-506214';
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // Health check endpoint
  if (pathname === '/healthz' || pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }

  // API Proxy endpoint: /api/gemini/generate
  if (pathname === '/api/gemini/generate' && req.method === 'POST') {
    let bodyStr = '';
    req.on('data', chunk => { bodyStr += chunk; });
    req.on('end', async () => {
      try {
        const body = JSON.parse(bodyStr || '{}');
        const promptText = body.prompt || (body.contents?.[0]?.parts?.[0]?.text) || '';

        const token = await getAccessToken();
        const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
        const projectId = getProjectId();

        let generatedText = '';

        if (token) {
          // Use Vertex AI endpoint with token
          const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/gemini-2.5-flash:generateContent`;
          const vertexRes = await fetch(vertexUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: promptText }] }]
            })
          });

          const vertexData = await vertexRes.json();
          if (vertexRes.status !== 200) {
            res.writeHead(vertexRes.status, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: vertexData }));
            return;
          }
          generatedText = vertexData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } else if (geminiApiKey) {
          // Fallback to Google Generative AI API with API key
          const genAiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
          const genRes = await fetch(genAiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: promptText }] }]
            })
          });
          const genData = await genRes.json();
          if (genRes.status !== 200) {
            res.writeHead(genRes.status, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: genData }));
            return;
          }
          generatedText = genData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } else {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'No GCP Service Account token or Gemini API key configured.' }));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ text: generatedText, success: true }));
      } catch (err) {
        console.error('[GeminiProxy Error]', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
      }
    });
    return;
  }

  // Static file serving: /manuals/*
  if (pathname.startsWith('/manuals/')) {
    const manualFilePath = path.join(MANUALS_DIR, pathname.replace(/^\/manuals\//, ''));
    if (fs.existsSync(manualFilePath) && fs.statSync(manualFilePath).isFile()) {
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'public, max-age=86400'
      });
      fs.createReadStream(manualFilePath).pipe(res);
      return;
    }
  }

  // Static file serving: dist files
  const filePath = path.join(DIST_DIR, pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    const isImmutable = pathname.startsWith('/assets/');
    res.writeHead(200, {
      'Content-Type': mime,
      'Cache-Control': isImmutable ? 'public, max-age=31536000, immutable' : 'public, max-age=3600'
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // SPA Fallback: Serve dist/index.html
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(indexPath).pipe(res);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[VectorAI Server] Running on http://0.0.0.0:${PORT}`);
});
