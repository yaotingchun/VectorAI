import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

// Let's test the assistant router and tool layer logic directly
import { routeUserQuery } from '../src/features/assistant/services/assistantRouter.ts';
import { resolveMachineReference } from '../src/features/assistant/tools/assistantTools.ts';

console.log('Testing Assistant Router & Entity Resolution:');

// Test 1: General Knowledge
const r1 = routeUserQuery('What is VectorAI?');
console.log('Test 1 [What is VectorAI?]:', r1.intent, 'requiresRAG:', r1.requiresRAG, 'requiresLive:', r1.requiresLiveTelemetry);
if (r1.intent !== 'GENERAL_KNOWLEDGE' || !r1.requiresRAG || r1.requiresLiveTelemetry) {
  throw new Error('FAIL: General Knowledge routing failed');
}

// Test 2: Machine Knowledge (without live status)
const r2 = routeUserQuery('What does the Wire Bonder manual say about vibration?');
console.log('Test 2 [Wire Bonder manual vibration]:', r2.intent, 'machineType:', r2.targetMachineType, 'scope:', r2.ragKnowledgeScope);
if (r2.intent !== 'MACHINE_KNOWLEDGE' || r2.targetMachineType !== 'wire_bonder' || r2.ragKnowledgeScope !== 'MACHINE_ONLY') {
  throw new Error('FAIL: Machine Knowledge routing failed');
}

// Test 3: Live Telemetry
const r3 = routeUserQuery("What is WB-001's current RUL?");
console.log('Test 3 [WB-001 current RUL]:', r3.intent, 'machineId:', r3.targetMachineId, 'requiresLive:', r3.requiresLiveTelemetry);
if (r3.intent !== 'LIVE_MACHINE_DATA' || r3.targetMachineId !== 'WB-001' || !r3.requiresLiveTelemetry) {
  throw new Error('FAIL: Live Machine Data routing failed');
}

// Test 4: Pure Machine Diagnosis
const r4 = routeUserQuery('Why is WB-001 abnormal?');
console.log('Test 4 [Why is WB-001 abnormal?]:', r4.intent, 'machineId:', r4.targetMachineId, 'requiresAgent:', r4.requiresMachineAgent);
if (r4.intent !== 'DIAGNOSTIC' || r4.targetMachineId !== 'WB-001' || !r4.requiresMachineAgent) {
  throw new Error('FAIL: Diagnostic routing failed');
}

// Test 5: Mixed Risk Question
const r5 = routeUserQuery('Why is WB-001 currently at risk?');
console.log('Test 5 [Why is WB-001 currently at risk?]:', r5.intent, 'requiresLive:', r5.requiresLiveTelemetry, 'requiresAgent:', r5.requiresMachineAgent, 'requiresRAG:', r5.requiresRAG);
if (r5.intent !== 'MIXED' || !r5.requiresLiveTelemetry || !r5.requiresMachineAgent || !r5.requiresRAG) {
  throw new Error('FAIL: Mixed routing failed');
}

// Test 6: Pronoun & Context Resolution
const r6 = routeUserQuery('Why is it abnormal?', { currentMachineId: 'WB-001', currentPage: '/machines/WB-001' });
console.log('Test 6 [Why is it abnormal? with currentMachineId=WB-001]:', r6.intent, 'resolvedMachineId:', r6.targetMachineId);
if (r6.targetMachineId !== 'WB-001' || r6.intent !== 'DIAGNOSTIC') {
  throw new Error('FAIL: Context pronoun resolution failed');
}

// Test 7: Fleet-wide Status Query
const r7 = routeUserQuery('Which machines are currently critical?');
console.log('Test 7 [Which machines are currently critical?]:', r7.intent, 'requiresLive:', r7.requiresLiveTelemetry);
if (r7.intent !== 'LIVE_MACHINE_DATA' || !r7.requiresLiveTelemetry) {
  throw new Error('FAIL: Fleet overview routing failed');
}

console.log('\nALL ROUTING & ORCHESTRATION TESTS PASSED 100%!');
