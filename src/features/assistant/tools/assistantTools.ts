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
    if (id.startsWith('AOI')) return 'aoi-inspection';
    if (id.startsWith('XR')) return 'x-ray-inspection';
    if (id.startsWith('LM')) return 'laser-marking';
    if (id.startsWith('TH') || id.startsWith('ATE')) return 'test-handler';
    if (id.startsWith('TR')) return 'tape-reel';
    if (id.startsWith('WS') || id.startsWith('DIC')) return 'wafer-saw';
    if (id.startsWith('STK')) return 'stocker';
    if (id.startsWith('PC')) return 'plasma-cleaner';
    if (id.startsWith('WB')) return 'wire-bonding';
    if (id.startsWith('MP') || id.startsWith('MOLD')) return 'molding-press';
    if (id.startsWith('DA')) return 'die-attach';
  }
  if (!rawCategoryOrType) return 'wire-bonding';
  const c = rawCategoryOrType.toLowerCase();
  if (c.includes('aoi') || c.includes('optical')) return 'aoi-inspection';
  if (c.includes('x-ray') || c.includes('xray') || c.includes('ndt')) return 'x-ray-inspection';
  if (c.includes('laser') || c.includes('marking')) return 'laser-marking';
  if (c.includes('stocker') || c.includes('amhs') || c.includes('foup')) return 'stocker';
  if (c.includes('plasma')) return 'plasma-cleaner';
  if (c.includes('tape') || c.includes('reel')) return 'tape-reel';
  if (c.includes('dice') || c.includes('dicing') || c.includes('saw') || c === 'wafer_dicing') return 'wafer-saw';
  if (c.includes('attach') || c === 'die_attach' || c === 'die_attacher') return 'die-attach';
  if (c.includes('bond') || c === 'wire_bond' || c === 'wire_bonder') return 'wire-bonding';
  if (c.includes('mold') || c === 'molding') return 'molding-press';
  if (c.includes('ate') || c.includes('test') || c === 'ate_sort' || c === 'ic_tester') return 'test-handler';
  return 'wire-bonding';
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

  // 1. Check for explicit machine ID patterns (e.g. AOI-01, AOI-001, XR-01, LM-01, TH-01, TR-01, WS-01, STK-01, PC-01, WB-01, MP-01, DA-01, DIC-001, MOLD-001, ATE-001)
  const idRegex = /\b(AOI|XR|LM|TH|TR|WS|STK|PC|WB|MP|DA|DIC|MOLD|ATE)-(\d{1,3})\b/i;
  const match = normQuery.match(idRegex);
  if (match) {
    const machineId = `${match[1].toUpperCase()}-${match[2]}`;
    const machineType = normalizeMachineType(undefined, machineId);
    return { machineId, machineType, confidence: 'EXPLICIT_ID' };
  }

  // 2. Check for machine type names
  if (normQuery.includes('aoi') || normQuery.includes('optical inspection') || normQuery.includes('metrology') || normQuery.includes('coplanarity')) {
    return { machineId: 'AOI-01', machineType: 'aoi-inspection', confidence: 'TYPE_MATCH' };
  }
  if (normQuery.includes('x-ray') || normQuery.includes('xray') || normQuery.includes('ndt') || normQuery.includes('microfocus')) {
    return { machineId: 'XR-01', machineType: 'x-ray-inspection', confidence: 'TYPE_MATCH' };
  }
  if (normQuery.includes('laser mark') || normQuery.includes('laser marker') || normQuery.includes('fiber laser') || normQuery.includes('serialization')) {
    return { machineId: 'LM-01', machineType: 'laser-marking', confidence: 'TYPE_MATCH' };
  }
  if (normQuery.includes('stocker') || normQuery.includes('amhs') || normQuery.includes('foup') || normQuery.includes('buffer stocker')) {
    return { machineId: 'STK-01', machineType: 'stocker', confidence: 'TYPE_MATCH' };
  }
  if (normQuery.includes('plasma cleaner') || normQuery.includes('plasma clean') || normQuery.includes('plasma activation') || normQuery.includes('surface activation')) {
    return { machineId: 'PC-01', machineType: 'plasma-cleaner', confidence: 'TYPE_MATCH' };
  }
  if (normQuery.includes('tape and reel') || normQuery.includes('tape & reel') || normQuery.includes('tape-reel') || normQuery.includes('carrier tape') || normQuery.includes('packaging cell')) {
    return { machineId: 'TR-01', machineType: 'tape-reel', confidence: 'TYPE_MATCH' };
  }
  if (normQuery.includes('wire bonder') || normQuery.includes('wire bond') || normQuery.includes('bonder') || normQuery.includes('capillary') || normQuery.includes('thermosonic')) {
    return { machineId: 'WB-01', machineType: 'wire-bonding', confidence: 'TYPE_MATCH' };
  }
  if (normQuery.includes('die attach') || normQuery.includes('die attacher') || normQuery.includes('die bonder') || normQuery.includes('collet')) {
    return { machineId: 'DA-01', machineType: 'die-attach', confidence: 'TYPE_MATCH' };
  }
  if (normQuery.includes('wafer saw') || normQuery.includes('wafer dicing') || normQuery.includes('dicing saw') || normQuery.includes('spindle')) {
    return { machineId: 'WS-01', machineType: 'wafer-saw', confidence: 'TYPE_MATCH' };
  }
  if (normQuery.includes('molding') || normQuery.includes('mold press') || normQuery.includes('plunger') || normQuery.includes('encapsulation')) {
    return { machineId: 'MP-01', machineType: 'molding-press', confidence: 'TYPE_MATCH' };
  }
  if (normQuery.includes('ic tester') || normQuery.includes('test handler') || normQuery.includes('handler') || normQuery.includes('sorter') || normQuery.includes('tri-temp') || normQuery.includes('ate')) {
    return { machineId: 'TH-01', machineType: 'test-handler', confidence: 'TYPE_MATCH' };
  }

  // 3. Pronoun / Context Resolution ("it", "this machine", "its vibration", "that anomaly")
  const isAnaphoric = /\b(it|its|this|that|current machine|the machine|the tool)\b/i.test(normQuery);
  if (isAnaphoric) {
    if (contextMachineId) {
      const mType = normalizeMachineType(undefined, contextMachineId);
      return { machineId: contextMachineId, machineType: mType, confidence: 'CONTEXT' };
    }
    if (previousMachineId) {
      const mType = normalizeMachineType(undefined, previousMachineId);
      return { machineId: previousMachineId, machineType: mType, confidence: 'CONTEXT' };
    }
  }

  return { confidence: 'NONE' };
}
