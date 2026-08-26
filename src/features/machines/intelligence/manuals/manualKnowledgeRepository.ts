// =========================================================================
// VECTOR.AI — MANUAL KNOWLEDGE REPOSITORY
// Single Source of Truth for Extracted Technical Manual Knowledge
// =========================================================================

import { MachineTypeId } from '../../data/machineTypes';
import { 
  StructuredMachineKnowledge, 
  RulModelDefinition, 
  MachineSensorThreshold,
  FailureScenario,
  TroubleshootingSymptom
} from '../types/intelligence';

// Import raw structured machine JSONs
import waferDicingJson from '../../../../../data/machines/wafer-dicing-machine.json';
import dieAttacherJson from '../../../../../data/machines/die-attacher.json';
import wireBonderJson from '../../../../../data/machines/wire-bonder.json';
import moldingJson from '../../../../../data/machines/molding-machine.json';
import icTesterJson from '../../../../../data/machines/ic-tester-sorter.json';

const KNOWLEDGE_REGISTRY: Record<MachineTypeId, StructuredMachineKnowledge> = {
  wafer_dicing: waferDicingJson as unknown as StructuredMachineKnowledge,
  die_attacher: dieAttacherJson as unknown as StructuredMachineKnowledge,
  wire_bonder: wireBonderJson as unknown as StructuredMachineKnowledge,
  molding: moldingJson as unknown as StructuredMachineKnowledge,
  ic_tester: icTesterJson as unknown as StructuredMachineKnowledge
};

/**
 * Retrieve complete structured knowledge for a given machine type.
 */
export function getMachineKnowledge(machineType: MachineTypeId): StructuredMachineKnowledge {
  const knowledge = KNOWLEDGE_REGISTRY[machineType];
  if (!knowledge) {
    throw new Error(`Machine knowledge not found for machine type: '${machineType}'`);
  }
  return knowledge;
}

/**
 * Retrieve the deterministic RUL model for a machine type.
 */
export function getRulModelForMachine(machineType: MachineTypeId): RulModelDefinition {
  const knowledge = getMachineKnowledge(machineType);
  const m = knowledge.rulModel;

  return {
    id: `RUL-MOD-${machineType.toUpperCase()}-V1`,
    machineType,
    modelName: `${knowledge.machine.name} Degradation Model`,
    formulaType: 'DETERMINISTIC_LINEAR_DEGRADATION',
    baseUsefulLifeHours: m.baseUsefulLifeHours,
    baseLifeUnit: 'hours',
    version: '1.0',
    weightsSum: m.weightsSum,
    parameters: m.parameters,
    formulaDescription: m.formulaDescription,
    source: 'Machine Manual & VectorAI Derived Degradation Model'
  };
}

/**
 * Retrieve sensor threshold specifications for a machine type.
 */
export function getThresholdsForMachine(machineType: MachineTypeId): MachineSensorThreshold[] {
  return getMachineKnowledge(machineType).thresholds;
}

/**
 * Retrieve failure scenarios (Section 11) for a machine type.
 */
export function getFailureScenariosForMachine(machineType: MachineTypeId): FailureScenario[] {
  return getMachineKnowledge(machineType).failureScenarios;
}

/**
 * Retrieve troubleshooting symptoms (Section 10) for a machine type.
 */
export function getSymptomsForMachine(machineType: MachineTypeId): TroubleshootingSymptom[] {
  return getMachineKnowledge(machineType).symptoms;
}

/**
 * List all available machine types in the knowledge repository.
 */
export function listAvailableKnowledgeMachineTypes(): MachineTypeId[] {
  return Object.keys(KNOWLEDGE_REGISTRY) as MachineTypeId[];
}
