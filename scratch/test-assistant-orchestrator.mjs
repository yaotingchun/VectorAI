import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

// Helper to simulate router logic exactly
function resolveMachineReference(query, contextMachineId, previousMachineId) {
  const normQuery = query.toLowerCase();

  const idRegex = /\b(DIC-\d{3}|DA-\d{3}|WB-\d{3}|MOLD-\d{3}|ATE-\d{3})\b/i;
  const match = normQuery.match(idRegex);
  if (match) {
    const machineId = match[1].toUpperCase();
    let machineType;
    if (machineId.startsWith('DIC')) machineType = 'wafer_dicing';
    else if (machineId.startsWith('DA')) machineType = 'die_attacher';
    else if (machineId.startsWith('WB')) machineType = 'wire_bonder';
    else if (machineId.startsWith('MOLD')) machineType = 'molding';
    else if (machineId.startsWith('ATE')) machineType = 'ic_tester';
    return { machineId, machineType, confidence: 'EXPLICIT_ID' };
  }

  if (normQuery.includes('wire bonder') || normQuery.includes('wire bond') || normQuery.includes('bonder')) {
    return { machineId: 'WB-001', machineType: 'wire_bonder', confidence: 'TYPE_MATCH' };
  }
  if (normQuery.includes('die attach') || normQuery.includes('die attacher') || normQuery.includes('collet')) {
    return { machineId: 'DA-001', machineType: 'die_attacher', confidence: 'TYPE_MATCH' };
  }
  if (normQuery.includes('wafer dicing') || normQuery.includes('dicing saw') || normQuery.includes('spindle')) {
    return { machineId: 'DIC-001', machineType: 'wafer_dicing', confidence: 'TYPE_MATCH' };
  }
  if (normQuery.includes('molding') || normQuery.includes('mold press') || normQuery.includes('plunger')) {
    return { machineId: 'MOLD-001', machineType: 'molding', confidence: 'TYPE_MATCH' };
  }
  if (normQuery.includes('ic tester') || normQuery.includes('handler') || normQuery.includes('sorter') || normQuery.includes('ate')) {
    return { machineId: 'ATE-001', machineType: 'ic_tester', confidence: 'TYPE_MATCH' };
  }

  const isAnaphoric = /\b(it|its|this|that|current machine|the machine|the tool)\b/i.test(normQuery);
  if (isAnaphoric) {
    if (contextMachineId) {
      let mType;
      if (contextMachineId.startsWith('DIC')) mType = 'wafer_dicing';
      else if (contextMachineId.startsWith('DA')) mType = 'die_attacher';
      else if (contextMachineId.startsWith('WB')) mType = 'wire_bonder';
      else if (contextMachineId.startsWith('MOLD')) mType = 'molding';
      else if (contextMachineId.startsWith('ATE')) mType = 'ic_tester';
      return { machineId: contextMachineId, machineType: mType, confidence: 'CONTEXT' };
    }
    if (previousMachineId) {
      let mType;
      if (previousMachineId.startsWith('DIC')) mType = 'wafer_dicing';
      else if (previousMachineId.startsWith('DA')) mType = 'die_attacher';
      else if (previousMachineId.startsWith('WB')) mType = 'wire_bonder';
      else if (previousMachineId.startsWith('MOLD')) mType = 'molding';
      else if (previousMachineId.startsWith('ATE')) mType = 'ic_tester';
      return { machineId: previousMachineId, machineType: mType, confidence: 'CONTEXT' };
    }
  }

  return { confidence: 'NONE' };
}

function routeUserQuery(query, context, previousMachineId) {
  const norm = query.toLowerCase().trim();

  const resolved = resolveMachineReference(query, context?.currentMachineId, previousMachineId);
  const machineId = resolved.machineId;
  const machineType = resolved.machineType;

  const hasLiveKeywords = /\b(current|currently|now|latest|live|today|status|health score|value|how much|which machines|who is critical|show me telemetry|active alarms)\b/i.test(norm);
  const isFleetOverviewQuery = /\b(which machines|fleet health|fleet status|critical machines|machines at risk|all machines)\b/i.test(norm);
  const isDiagnosticQuery = /\b(why is|what caused|what is causing|abnormal|anomaly|defect|root cause|troubleshoot|diagnose|failure mode|drill down|why.*decreasing|why.*drop)\b/i.test(norm);
  const isMixedRiskQuery = (isDiagnosticQuery && hasLiveKeywords) || /\b(at risk|why.*critical|why.*warning|why is.*failing|investigate|assess condition)\b/i.test(norm);
  const isWebsiteQuery = /\b(how do i|where can i|how to use|dashboard tab|prediction tab|maintenance tab|documents tab|accelerated wear|simulate wear|toggle|filter machines|export|pdf viewer|website|ui|screen)\b/i.test(norm);
  const isRulMethodologyQuery = /\b(how (is|does|do we) (calculate|compute|work) rul|rul formula|rul methodology|without ml|zero ml|linear degradation formula)\b/i.test(norm);

  if (isMixedRiskQuery && machineId) {
    return {
      intent: 'MIXED',
      targetMachineId: machineId,
      targetMachineType: machineType,
      requiresLiveTelemetry: true,
      requiresMachineAgent: true,
      requiresRAG: true,
      ragKnowledgeScope: 'MACHINE_ONLY',
      cleanSearchQuery: `${machineType || ''} degradation symptom failure`
    };
  }

  if (isDiagnosticQuery && machineId) {
    return {
      intent: 'DIAGNOSTIC',
      targetMachineId: machineId,
      targetMachineType: machineType,
      requiresLiveTelemetry: true,
      requiresMachineAgent: true,
      requiresRAG: true,
      ragKnowledgeScope: 'MACHINE_ONLY',
      cleanSearchQuery: query
    };
  }

  if (isFleetOverviewQuery || (hasLiveKeywords && machineId)) {
    return {
      intent: 'LIVE_MACHINE_DATA',
      targetMachineId: machineId,
      targetMachineType: machineType,
      requiresLiveTelemetry: true,
      requiresMachineAgent: false,
      requiresRAG: false,
      cleanSearchQuery: query
    };
  }

  if (isWebsiteQuery && !machineId) {
    return {
      intent: 'WEBSITE_HELP',
      requiresLiveTelemetry: false,
      requiresMachineAgent: false,
      requiresRAG: true,
      ragKnowledgeScope: 'GLOBAL',
      cleanSearchQuery: query
    };
  }

  if (machineType && !hasLiveKeywords) {
    return {
      intent: 'MACHINE_KNOWLEDGE',
      targetMachineId: machineId,
      targetMachineType: machineType,
      requiresLiveTelemetry: false,
      requiresMachineAgent: false,
      requiresRAG: true,
      ragKnowledgeScope: 'MACHINE_ONLY',
      cleanSearchQuery: query
    };
  }

  if (isRulMethodologyQuery || !machineId) {
    return {
      intent: 'GENERAL_KNOWLEDGE',
      requiresLiveTelemetry: false,
      requiresMachineAgent: false,
      requiresRAG: true,
      ragKnowledgeScope: 'GLOBAL',
      cleanSearchQuery: query
    };
  }

  return {
    intent: 'UNKNOWN',
    requiresLiveTelemetry: false,
    requiresMachineAgent: false,
    requiresRAG: true,
    ragKnowledgeScope: 'GLOBAL',
    cleanSearchQuery: query
  };
}

console.log('--- RUNNING ORCHESTRATOR ROUTING TEST SUITE ---');

// Test 1: General Knowledge
const r1 = routeUserQuery('What is VectorAI?');
console.log('Test 1 [What is VectorAI?]:', r1.intent, '| RAG:', r1.requiresRAG, '| Live:', r1.requiresLiveTelemetry);
if (r1.intent !== 'GENERAL_KNOWLEDGE' || !r1.requiresRAG || r1.requiresLiveTelemetry) throw new Error('FAIL T1');

// Test 2: Machine Knowledge
const r2 = routeUserQuery('What does the Wire Bonder manual say about vibration?');
console.log('Test 2 [Wire Bonder manual vibration]:', r2.intent, '| MachineType:', r2.targetMachineType, '| Scope:', r2.ragKnowledgeScope);
if (r2.intent !== 'MACHINE_KNOWLEDGE' || r2.targetMachineType !== 'wire_bonder' || r2.ragKnowledgeScope !== 'MACHINE_ONLY') throw new Error('FAIL T2');

// Test 3: Live Telemetry
const r3 = routeUserQuery("What is WB-001's current RUL?");
console.log('Test 3 [WB-001 current RUL]:', r3.intent, '| MachineId:', r3.targetMachineId, '| Live:', r3.requiresLiveTelemetry);
if (r3.intent !== 'LIVE_MACHINE_DATA' || r3.targetMachineId !== 'WB-001' || !r3.requiresLiveTelemetry) throw new Error('FAIL T3');

// Test 4: Pure Machine Diagnosis
const r4 = routeUserQuery('Why is WB-001 abnormal?');
console.log('Test 4 [Why is WB-001 abnormal?]:', r4.intent, '| MachineId:', r4.targetMachineId, '| Agent:', r4.requiresMachineAgent);
if (r4.intent !== 'DIAGNOSTIC' || r4.targetMachineId !== 'WB-001' || !r4.requiresMachineAgent) throw new Error('FAIL T4');

// Test 5: Mixed Risk Question
const r5 = routeUserQuery('Why is WB-001 currently at risk?');
console.log('Test 5 [Why is WB-001 currently at risk?]:', r5.intent, '| Live:', r5.requiresLiveTelemetry, '| Agent:', r5.requiresMachineAgent, '| RAG:', r5.requiresRAG);
if (r5.intent !== 'MIXED' || !r5.requiresLiveTelemetry || !r5.requiresMachineAgent || !r5.requiresRAG) throw new Error('FAIL T5');

// Test 6: Pronoun & Context Resolution
const r6 = routeUserQuery('Why is it abnormal?', { currentMachineId: 'WB-001', currentPage: '/machines/WB-001' });
console.log('Test 6 [Why is it abnormal? with currentMachineId=WB-001]:', r6.intent, '| Resolved:', r6.targetMachineId);
if (r6.targetMachineId !== 'WB-001' || r6.intent !== 'DIAGNOSTIC') throw new Error('FAIL T6');

// Test 7: Fleet-wide Status Query
const r7 = routeUserQuery('Which machines are currently critical?');
console.log('Test 7 [Which machines are currently critical?]:', r7.intent, '| Live:', r7.requiresLiveTelemetry);
if (r7.intent !== 'LIVE_MACHINE_DATA' || !r7.requiresLiveTelemetry) throw new Error('FAIL T7');

console.log('\n>>> ALL 7 INTENT ROUTING SCENARIOS PASSED 100%! <<<');
