// =========================================================================
// VECTOR.AI — ASSISTANT TOOL LAYER
// Controlled Wrappers Around Existing RAG, Live Telemetry, RUL & Machine Agent
// =========================================================================

import { MachineTypeId } from '../../machines/data/machineTypes';
import { Machine } from '../../machines/types/machine';
import { 
  ragVectorIndex, 
  RagSearchFilter, 
  analyzeMachine,
  MachineAgentAnalysis,
  calculateDeterministicRul,
  getRulModelForMachine
} from '../../machines/intelligence';
import { getMachines, getMachineById } from '../../machines/services/machineApi';
import { SEED_MACHINES } from '../../machines/data/seedMachines';
import { AssistantSourceCitation, AssistantLiveDataBadge } from '../types/assistant';

/**
 * 1. SEARCH KNOWLEDGE BASE (GLOBAL RAG)
 * Reuses the existing shared 215-chunk RagVectorIndex without creating a second vector DB.
 */
export function searchKnowledgeBase(
  query: string,
  filter?: RagSearchFilter
): AssistantSourceCitation[] {
  const results = ragVectorIndex.search(query, {
    maxResults: filter?.maxResults || 4,
    minScore: filter?.minScore || 0.05,
    knowledgeType: filter?.knowledgeType,
    machineType: filter?.machineType,
    documentId: filter?.documentId,
    sourceName: filter?.sourceName,
    section: filter?.section
  });

  return results.map(r => ({
    id: r.chunk.chunkId,
    knowledgeType: r.chunk.knowledgeType,
    sourceName: r.chunk.sourceName,
    section: r.chunk.section,
    title: r.chunk.title,
    contentSnippet: r.chunk.content,
    similarityScore: r.similarityScore,
    documentId: r.chunk.documentId,
    manualId: r.chunk.manualId,
    machineType: r.chunk.machineType
  }));
}

function normalizeMachineType(rawCategoryOrType?: string, machineId?: string): MachineTypeId {
  if (machineId) {
    const id = machineId.toUpperCase();
    if (id.startsWith('DIC')) return 'wafer_dicing';
    if (id.startsWith('DA')) return 'die_attacher';
    if (id.startsWith('WB')) return 'wire_bonder';
    if (id.startsWith('MOLD')) return 'molding';
    if (id.startsWith('ATE')) return 'ic_tester';
  }
  if (!rawCategoryOrType) return 'wire_bonder';
  const c = rawCategoryOrType.toLowerCase();
  if (c.includes('dice') || c.includes('dicing') || c === 'dicing') return 'wafer_dicing';
  if (c.includes('attach') || c === 'die_attach') return 'die_attacher';
  if (c.includes('bond') || c === 'wire_bond') return 'wire_bonder';
  if (c.includes('mold') || c === 'molding') return 'molding';
  if (c.includes('ate') || c.includes('test') || c === 'ate_sort') return 'ic_tester';
  return 'wire_bonder';
}

export function getMachineHealth(m: any): number {
  if (typeof m.healthScore === 'number' && m.healthScore > 0) return m.healthScore;
  if (m.healthTrend?.['24h']?.[0]?.health) return m.healthTrend['24h'][0].health;
  if (m.rul?.value) return Math.min(99, Math.round((m.rul.value / (m.rul.criticalThresholdHours || 50)) * 25));
  return 95;
}

export function getMachineRul(m: any): number {
  if (typeof m.currentRul === 'number' && m.currentRul > 0) return m.currentRul;
  if (m.rul?.value) return m.rul.value;
  if (m.rul?.estimatedDays) return Math.round(m.rul.estimatedDays * 24);
  return 1200;
}

/**
 * 2. GET ALL MACHINES (LIVE DATA)
 * Returns current machine fleet list from memory / active state.
 */
export async function getFleetMachines(liveMachinesOverride?: Machine[]): Promise<Machine[]> {
  if (liveMachinesOverride && liveMachinesOverride.length > 0) {
    return liveMachinesOverride;
  }
  const machines = await getMachines();
  return machines.length > 0 ? machines : SEED_MACHINES;
}

/**
 * 3. GET SINGLE MACHINE (LIVE DATA)
 */
export async function getMachine(
  machineId: string,
  liveMachinesOverride?: Machine[]
): Promise<Machine | null> {
  const normId = machineId.trim().toUpperCase();
  if (liveMachinesOverride && liveMachinesOverride.length > 0) {
    const found = liveMachinesOverride.find(m => m.id.toUpperCase() === normId);
    if (found) return found;
  }
  return await getMachineById(normId);
}

/**
 * 4. GET LATEST SENSOR READINGS (LIVE DATA)
 */
export async function getLatestSensorValues(
  machineId: string,
  liveMachinesOverride?: Machine[]
): Promise<{ machine: Machine; sensors: AssistantLiveDataBadge[] } | null> {
  const machine = await getMachine(machineId, liveMachinesOverride);
  if (!machine) return null;

  const badges: AssistantLiveDataBadge[] = (machine.sensors || []).map((s: any) => {
    let stat: 'normal' | 'warning' | 'critical' = 'normal';
    if (s.status) {
      stat = s.status.toLowerCase() === 'critical' ? 'critical' : s.status.toLowerCase() === 'warning' ? 'warning' : 'normal';
    } else if (s.deviation !== undefined) {
      stat = s.deviation >= 80 ? 'critical' : s.deviation >= 50 ? 'warning' : 'normal';
    }

    return {
      machineId: machine.id,
      machineName: machine.name,
      metric: s.name,
      value: s.value,
      unit: s.unit || '',
      status: stat,
      timestamp: (s as any).lastUpdated || new Date().toISOString()
    };
  });

  return { machine, sensors: badges };
}

/**
 * 5. GET FORMULA-BASED RUL (DETERMINISTIC RUL SERVICE)
 * Strictly uses existing formula-based linear degradation calculation. No ML fabrication.
 */
export async function getMachineRulData(
  machineId: string,
  liveMachinesOverride?: Machine[]
): Promise<{ machine: Machine; rulHours: number; healthScore: number; degradationPercentage: number; modelReliability: string; formula: string } | null> {
  const machine = await getMachine(machineId, liveMachinesOverride);
  if (!machine) return null;

  const machineType = normalizeMachineType((machine as any).category || machine.machineType, machine.id);
  const rulModel = getRulModelForMachine(machineType);
  const sensorInputs = (machine.sensors || []).map((s: any) => ({
    sensorId: s.sensorId || s.name,
    value: s.value,
    name: s.name,
    unit: s.unit || ''
  }));

  const rulCalculation = calculateDeterministicRul(
    machine.id,
    machineType,
    sensorInputs,
    rulModel
  );

  const finalRul = (machine as any).currentRul !== undefined ? (machine as any).currentRul : Math.round(rulCalculation.rulHours);

  return {
    machine,
    rulHours: Math.round(finalRul),
    healthScore: machine.healthScore || Math.round(rulCalculation.remainingLifeRatio * 100),
    degradationPercentage: Math.round(rulCalculation.degradationScore * 100),
    modelReliability: rulCalculation.reliability.status,
    formula: rulCalculation.formula
  };
}

/**
 * 6. RUN MACHINE DIAGNOSIS (MACHINE AGENT)
 * Reuses the authoritative Machine Agent: Section 10 Symptoms & Section 11 Failure Scenarios -> RAG Fallback.
 */
export async function runMachineDiagnosis(
  machineId: string,
  liveMachinesOverride?: Machine[]
): Promise<MachineAgentAnalysis | null> {
  const machine = await getMachine(machineId, liveMachinesOverride);
  if (!machine) return null;

  return analyzeMachine(machine);
}

/**
 * 7. RESOLVE MACHINE IDENTIFIER FROM TEXT OR CONTEXT
 * Maps "WB-001", "wire bonder", "this machine", "it" into exact Machine ID and MachineTypeId.
 */
export function resolveMachineReference(
  query: string,
  contextMachineId?: string | null,
  previousMachineId?: string | null
): { machineId?: string; machineType?: MachineTypeId; confidence: 'EXPLICIT_ID' | 'TYPE_MATCH' | 'CONTEXT' | 'NONE' } {
  const normQuery = query.toLowerCase();

  // 1. Check for explicit machine ID patterns (e.g. DIC-001, DA-001, WB-001, MOLD-001, ATE-001)
  const idRegex = /\b(DIC-\d{3}|DA-\d{3}|WB-\d{3}|MOLD-\d{3}|ATE-\d{3})\b/i;
  const match = normQuery.match(idRegex);
  if (match) {
    const machineId = match[1].toUpperCase();
    let machineType: MachineTypeId | undefined;
    if (machineId.startsWith('DIC')) machineType = 'wafer_dicing';
    else if (machineId.startsWith('DA')) machineType = 'die_attacher';
    else if (machineId.startsWith('WB')) machineType = 'wire_bonder';
    else if (machineId.startsWith('MOLD')) machineType = 'molding';
    else if (machineId.startsWith('ATE')) machineType = 'ic_tester';

    return { machineId, machineType, confidence: 'EXPLICIT_ID' };
  }

  // 2. Check for machine type names
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

  // 3. Pronoun / Context Resolution ("it", "this machine", "its vibration", "that anomaly")
  const isAnaphoric = /\b(it|its|this|that|current machine|the machine|the tool)\b/i.test(normQuery);
  if (isAnaphoric) {
    if (contextMachineId) {
      let mType: MachineTypeId | undefined;
      if (contextMachineId.startsWith('DIC')) mType = 'wafer_dicing';
      else if (contextMachineId.startsWith('DA')) mType = 'die_attacher';
      else if (contextMachineId.startsWith('WB')) mType = 'wire_bonder';
      else if (contextMachineId.startsWith('MOLD')) mType = 'molding';
      else if (contextMachineId.startsWith('ATE')) mType = 'ic_tester';
      return { machineId: contextMachineId, machineType: mType, confidence: 'CONTEXT' };
    }
    if (previousMachineId) {
      let mType: MachineTypeId | undefined;
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
