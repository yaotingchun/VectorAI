import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const credentialsPath = join(__dirname, '..', 'credentials', 'firebase.json');

if (!existsSync(credentialsPath)) {
  console.error(`[Error] Firebase credentials not found at ${credentialsPath}`);
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(credentialsPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
  projectId: serviceAccount.project_id || 'vectorai-506214'
});

const db = getFirestore();

const DATA_DIR = join(__dirname, '..', 'data', 'machines');

async function seedMachineData() {
  console.log('='.repeat(70));
  console.log('[Seeder] VectorAI — Seeding Machine Knowledge & Document Registrations');
  console.log('='.repeat(70));

  if (!existsSync(DATA_DIR)) {
    console.error(`[Error] Data directory not found: ${DATA_DIR}`);
    process.exit(1);
  }

  const files = readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  console.log(`Found ${files.length} machine knowledge definition files.`);

  for (const file of files) {
    const filePath = join(DATA_DIR, file);
    const content = JSON.parse(readFileSync(filePath, 'utf8'));
    const { machine, components, sensors, thresholds, operatingConditions, maintenance, degradationIndicators, rulModel, symptoms, failureScenarios } = content;

    const machineType = machine.type;
    const prototypeId = machine.prototypeMachineId;
    const manualId = machine.manualId;
    const pdfFilename = `${content.filename}-manual.pdf`;

    console.log(`\nProcessing: ${machine.name} (${prototypeId}) [${manualId}]`);

    // 1. Seed to 'machine_knowledge' collection (Keyed by machineType)
    const knowledgeRef = db.collection('machine_knowledge').doc(machineType);
    await knowledgeRef.set({
      machine,
      components,
      sensors,
      thresholds,
      operatingConditions,
      maintenance,
      degradationIndicators,
      rulModel,
      symptoms,
      failureScenarios,
      documentRegistration: {
        documentId: `DOC-${manualId}`,
        manualId,
        prototypeMachineId: prototypeId,
        machineType,
        title: `${machine.name} Technical Manual`,
        filename: pdfFilename,
        url: `/manuals/${pdfFilename}`,
        version: machine.version,
        type: 'SYNTHETIC_MACHINE_MANUAL',
        status: 'ACTIVE',
        updatedAt: new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log(`  [OK] Saved to collection "machine_knowledge" -> "${machineType}"`);

    // 2. Seed to 'machine_documents' collection
    const docRef = db.collection('machine_documents').doc(manualId);
    await docRef.set({
      manualId,
      documentId: `DOC-${manualId}`,
      machineId: prototypeId,
      machineType,
      title: `${machine.name} Technical Manual`,
      filename: pdfFilename,
      url: `/manuals/${pdfFilename}`,
      version: machine.version,
      category: 'Manual',
      type: 'PDF',
      documentStatus: 'SYNTHETIC_PROTOTYPE_MANUAL',
      disclaimer: machine.disclaimer,
      scenariosCount: failureScenarios.length,
      sensorsCount: sensors.length,
      rulParametersCount: rulModel.parameters.length,
      registeredAt: new Date().toISOString()
    }, { merge: true });
    console.log(`  [OK] Registered document in "machine_documents" -> "${manualId}"`);

    // 3. Upsert prototype machine record in 'machines' collection (e.g. DIC-001, DA-001, WB-001, MOLD-001, ATE-001)
    const machineDocRef = db.collection('machines').doc(prototypeId);
    const existingSnap = await machineDocRef.get();
    
    // Prepare initial telemetry sensors from sensor schema
    const initialSensors = sensors.map(s => ({
      sensorId: s.sensorId,
      name: s.name,
      value: (s.normalRange[0] + s.normalRange[1]) / 2,
      unit: s.unit,
      status: 'normal',
      lastUpdated: '1m ago',
      history: [
        { timestamp: '12:00', value: (s.normalRange[0] + s.normalRange[1]) / 2 },
        { timestamp: '12:30', value: (s.normalRange[0] + s.normalRange[1]) / 2 }
      ]
    }));

    const machinePayload = {
      id: prototypeId,
      name: `${machine.name} 01`,
      machineType: machineType,
      processStage: machine.processStage,
      location: {
        facility: 'Fab 2 OSAT Hub',
        floor: 'Level 2 - Cleanroom ISO 5',
        area: `${machine.processStage} Area`,
        line: 'Line 01',
        station: 'Station 01',
        gridCoordinate: { x: 10, y: 10 }
      },
      status: 'healthy',
      healthScore: 98,
      rul: {
        value: rulModel.baseUsefulLifeHours,
        unit: 'hours',
        confidence: 0.95,
        estimatedDays: Math.round((rulModel.baseUsefulLifeHours / 24) * 10) / 10,
        criticalThresholdHours: 48,
        degradationStage: 'Normal'
      },
      operatingHours: 1200,
      installationDate: '2025-01-10',
      firmwareVersion: 'v2.4.0-RT',
      ipAddress: `10.24.100.${prototypeId.replace(/[^0-9]/g, '') || '101'}`,
      lastTelemetryTimestamp: new Date().toISOString(),
      sensors: initialSensors,
      documents: [
        {
          id: `DOC-${manualId}`,
          title: `${machine.name} Technical Manual`,
          type: 'PDF',
          category: 'Manual',
          updatedAt: machine.generatedDate,
          size: '36 KB',
          url: `/manuals/${pdfFilename}`,
          tags: ['Manual', 'Thresholds', 'RUL', 'Diagnostics', 'Synthetic']
        }
      ]
    };

    if (!existingSnap.exists) {
      await machineDocRef.set(machinePayload);
      console.log(`  [OK] Created prototype machine in "machines" -> "${prototypeId}"`);
    } else {
      // Merge documents & metadata
      await machineDocRef.set({
        documents: machinePayload.documents,
        manualId: manualId,
        knowledgeBaseRef: `machine_knowledge/${machineType}`
      }, { merge: true });
      console.log(`  [OK] Updated existing machine in "machines" -> "${prototypeId}" with manual document registration.`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('[Seeder] Successfully seeded all machine knowledge & document registrations!');
  console.log('='.repeat(70));
}

seedMachineData().catch((err) => {
  console.error('[Fatal Error in Seeder]:', err);
  process.exit(1);
});
