import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const credentialsPath = join(__dirname, '..', 'credentials', 'firebase.json');
const serviceAccount = JSON.parse(readFileSync(credentialsPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
  projectId: serviceAccount.project_id || 'vectorai-506214'
});

const db = getFirestore();

async function verify() {
  const snapshot = await db.collection('machines').get();
  console.log(`[Firestore Verification] Total documents in "machines" collection: ${snapshot.size}`);
  snapshot.forEach((doc) => {
    const data = doc.data();
    console.log(`  - ${doc.id}: ${data.name} | Type: ${data.machineType} | Status: ${data.status} | Health: ${data.healthScore} | RUL: ${data.rul?.value} hrs`);
  });
}

verify().catch(console.error);
