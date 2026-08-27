import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function googleJsonGeminiPlugin(): Plugin {
  let tokenCache: { token: string; expiresAt: number } | null = null;

  function createJwt(serviceAccount: any, scope: string) {
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

  async function getAccessToken(creds: any): Promise<string> {
    const now = Date.now();
    if (tokenCache && tokenCache.expiresAt > now + 60000) {
      return tokenCache.token;
    }
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
    if (!data.access_token) {
      throw new Error(`Failed to get access token from google.json: ${JSON.stringify(data)}`);
    }
    tokenCache = {
      token: data.access_token,
      expiresAt: now + (data.expires_in || 3600) * 1000
    };
    return data.access_token;
  }

  return {
    name: 'google-json-gemini-proxy',
    configureServer(server) {
      server.middlewares.use('/api/gemini/generate', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let bodyStr = '';
        req.on('data', chunk => {
          bodyStr += chunk;
        });

        req.on('end', async () => {
          try {
            const body = JSON.parse(bodyStr || '{}');
            const credsPath = path.resolve(__dirname, 'credentials/google.json');
            if (!fs.existsSync(credsPath)) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'credentials/google.json not found' }));
              return;
            }

            const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
            const token = await getAccessToken(creds);

            const promptText = body.prompt || (body.contents?.[0]?.parts?.[0]?.text) || '';
            const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${creds.project_id}/locations/us-central1/publishers/google/models/gemini-2.5-flash:generateContent`;

            const vertexRes = await fetch(url, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                contents: [{
                  role: 'user',
                  parts: [{ text: promptText }]
                }]
              })
            });

            const vertexData = await vertexRes.json();
            if (vertexRes.status !== 200) {
              res.statusCode = vertexRes.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: vertexData }));
              return;
            }

            const generatedText = vertexData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ text: generatedText, success: true }));
          } catch (err: any) {
            console.error('[GeminiProxy] Error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
          }
        });
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), googleJsonGeminiPlugin()],
  server: {
    port: 3000,
    open: false,
    host: true,
  },
});
