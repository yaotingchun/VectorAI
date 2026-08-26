import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const credentialsPath = join(__dirname, '..', 'credentials', 'firebase.json');

if (!existsSync(credentialsPath)) {
  console.error(`Error: Firebase credentials not found at ${credentialsPath}`);
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(credentialsPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
  projectId: serviceAccount.project_id || 'vectorai-506214'
});

const db = getFirestore();

async function seedAll() {
  console.log(`[Seeder] Connecting to Firestore project: ${serviceAccount.project_id}...`);
  
  // Read unified machines from src/features/machines/data/seedMachines.ts or generate_machines.js
  const genScriptPath = join(__dirname, '..', '..', '..', '.gemini', 'antigravity-ide', 'brain', '578f7563-a08b-4e2e-a6a6-88364d64834d', 'scratch', 'generate_machines.js');
  
  // First clear old machines in firestore
  const machinesCollection = db.collection('machines');
  const snapshot = await machinesCollection.get();
  console.log(`[Seeder] Deleting ${snapshot.size} existing machines from Firestore...`);
  
  const batch1 = db.batch();
  snapshot.docs.forEach(doc => {
    batch1.delete(doc.ref);
  });
  await batch1.commit();
  console.log('[Seeder] Cleared old collection.');

  // Run generate_machines.js first to ensure clean data in memory
  const machinesDataPath = join(__dirname, '..', 'src', 'data', 'machines.json');
  // Re-read or require
  const machines = JSON.parse(readFileSync(machinesDataPath, 'utf8'));
  
  console.log(`[Seeder] Uploading ${machines.length} unified machines to Firestore...`);
  const batch2 = db.batch();
  for (const m of machines) {
    const docRef = machinesCollection.doc(m.id);
    batch2.set(docRef, m);
  }
  await batch2.commit();
  console.log(`[Seeder] Successfully seeded ${machines.length} unified machines into Firestore!`);
}

seedAll().then(() => process.exit(0)).catch(err => {
  console.error('[Seeder Error]', err);
  process.exit(1);
});
