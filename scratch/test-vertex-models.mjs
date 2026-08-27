import fs from 'fs';
import crypto from 'crypto';

const creds = JSON.parse(fs.readFileSync('./credentials/google.json', 'utf8'));

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
  return data.access_token;
}

const modelsToTest = [
  'gemini-1.5-flash-001',
  'gemini-1.5-flash-002',
  'gemini-1.5-pro-001',
  'gemini-1.5-pro-002',
  'gemini-2.0-flash-001',
  'gemini-2.0-flash',
  'gemini-2.5-flash',
  'gemini-1.0-pro'
];

async function testAll() {
  const token = await getAccessToken();
  console.log('Got GCP OAuth2 Access Token successfully!');

  for (const model of modelsToTest) {
    const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${creds.project_id}/locations/us-central1/publishers/google/models/${model}:generateContent`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: 'Say HELLO from VectorAI Gemini in one word.' }]
          }]
        })
      });
      const data = await res.json();
      if (res.status === 200) {
        console.log(`>>> SUCCESS with model: ${model}! Response:`, data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim());
        return { success: true, model, token };
      } else {
        console.log(`Model ${model}: Status ${res.status} - ${data?.error?.message?.slice(0, 100)}`);
      }
    } catch (e) {
      console.log(`Error testing ${model}:`, e.message);
    }
  }
}

testAll();
