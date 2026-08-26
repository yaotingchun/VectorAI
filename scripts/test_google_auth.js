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
  const jwt = createJwt(creds, 'https://www.googleapis.com/auth/generative-language https://www.googleapis.com/auth/cloud-platform');
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

async function testGenerativeLanguage(token) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;
  console.log('Testing Generative Language API...');
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        role: 'user',
        parts: [{ text: 'Explain in one sentence why a wire bonder ultrasonic transducer might overheat.' }]
      }]
    })
  });
  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Response:', JSON.stringify(data, null, 2));
}

const token = await getAccessToken();
if (token) {
  await testGenerativeLanguage(token);
}
