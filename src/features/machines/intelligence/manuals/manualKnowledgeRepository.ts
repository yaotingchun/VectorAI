// =========================================================================
// VECTOR.AI — MANUAL KNOWLEDGE REPOSITORY
// Single Source of Truth for Extracted Technical Manual Knowledge
// =========================================================================

import { MachineTypeId, MACHINE_TYPES } from '../../data/machineTypes';
import { 
  StructuredMachineKnowledge, 
  RulModelDefinition, 
  MachineSensorThreshold,
  FailureScenario,
  TroubleshootingSymptom
} from '../types/intelligence';

// Import raw structured machine JSONs for all 11 cleanroom equipment models
import waferSawJson from '../../../../../data/machines/wafer-saw.json';
import stockerJson from '../../../../../data/machines/stocker.json';
import dieAttachJson from '../../../../../data/machines/die-attach.json';
import plasmaCleanerJson from '../../../../../data/machines/plasma-cleaner.json';
import wireBondingJson from '../../../../../data/machines/wire-bonding.json';
import moldingPressJson from '../../../../../data/machines/molding-press.json';
import aoiInspectionJson from '../../../../../data/machines/aoi-inspection.json';
import xRayInspectionJson from '../../../../../data/machines/x-ray-inspection.json';
import laserMarkingJson from '../../../../../data/machines/laser-marking.json';
import testHandlerJson from '../../../../../data/machines/test-handler.json';
import tapeReelJson from '../../../../../data/machines/tape-reel.json';

const KNOWLEDGE_REGISTRY: Record<string, StructuredMachineKnowledge> = {
  // Canonical Cleanroom V-Factory Types (11 Models)
  'wafer-saw': waferSawJson as unknown as StructuredMachineKnowledge,
  'stocker': stockerJson as unknown as StructuredMachineKnowledge,
  'die-attach': dieAttachJson as unknown as StructuredMachineKnowledge,
  'plasma-cleaner': plasmaCleanerJson as unknown as StructuredMachineKnowledge,
  'wire-bonding': wireBondingJson as unknown as StructuredMachineKnowledge,
  'molding-press': moldingPressJson as unknown as StructuredMachineKnowledge,
  'aoi-inspection': aoiInspectionJson as unknown as StructuredMachineKnowledge,
  'x-ray-inspection': xRayInspectionJson as unknown as StructuredMachineKnowledge,
  'laser-marking': laserMarkingJson as unknown as StructuredMachineKnowledge,
  'test-handler': testHandlerJson as unknown as StructuredMachineKnowledge,
  'tape-reel': tapeReelJson as unknown as StructuredMachineKnowledge,

  // Legacy & Alias types for backward compatibility
  'wafer_dicing': waferSawJson as unknown as StructuredMachineKnowledge,
  'wafer-dicing-machine': waferSawJson as unknown as StructuredMachineKnowledge,
  'die_attacher': dieAttachJson as unknown as StructuredMachineKnowledge,
  'die-attacher': dieAttachJson as unknown as StructuredMachineKnowledge,
  'wire_bonder': wireBondingJson as unknown as StructuredMachineKnowledge,
  'wire-bonder': wireBondingJson as unknown as StructuredMachineKnowledge,
  'molding': moldingPressJson as unknown as StructuredMachineKnowledge,
  'molding-machine': moldingPressJson as unknown as StructuredMachineKnowledge,
  'ic_tester': testHandlerJson as unknown as StructuredMachineKnowledge,
  'ic-tester-sorter': testHandlerJson as unknown as StructuredMachineKnowledge,
  'tester': testHandlerJson as unknown as StructuredMachineKnowledge,
};

/**
 * Retrieve complete structured knowledge for a given machine type.
 */
export function getMachineKnowledge(machineType: MachineTypeId | string): StructuredMachineKnowledge {
  const normalizedKey = machineType.toLowerCase().replace(/_/g, '-');
  const knowledge = KNOWLEDGE_REGISTRY[machineType] || KNOWLEDGE_REGISTRY[normalizedKey] || KNOWLEDGE_REGISTRY['wire-bonding'];
  if (!knowledge) {
    return wireBondingJson as unknown as StructuredMachineKnowledge;
  }
  return knowledge;
}

/**
 * Retrieve the deterministic RUL model for a machine type.
 */
export function getRulModelForMachine(machineType: MachineTypeId | string): RulModelDefinition {
  const knowledge = getMachineKnowledge(machineType);
  const m = knowledge.rulModel;

  return {
    id: `RUL-MOD-${String(machineType).toUpperCase().replace(/-/g, '_')}-V1`,
    machineType: machineType as MachineTypeId,
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
 * Guarantees threshold objects exist for 100% of the machine's sensors.
 */
export function getThresholdsForMachine(machineType: MachineTypeId | string): MachineSensorThreshold[] {
  const knowledge = getMachineKnowledge(machineType);
  const existingThresholds: MachineSensorThreshold[] = knowledge.thresholds ? [...knowledge.thresholds] : [];
  const existingIds = new Set(existingThresholds.map((t) => t.sensorId));

  // Check knowledge.sensors for any sensors missing from thresholds
  if (knowledge.sensors && Array.isArray(knowledge.sensors)) {
    knowledge.sensors.forEach((s: any) => {
      const sId = s.sensorId || s.id;
      if (sId && !existingIds.has(sId)) {
        const normMin = Array.isArray(s.normalRange) ? s.normalRange[0] : 0;
        const normMax = Array.isArray(s.normalRange) ? s.normalRange[1] : 100;
        const warnMin = Array.isArray(s.warningRange) ? s.warningRange[0] : normMax;
        const warnMax = Array.isArray(s.warningRange) ? s.warningRange[1] : normMax * 1.2;
        const critMin = Array.isArray(s.criticalRange) ? s.criticalRange[0] : warnMax;
        const critMax = Array.isArray(s.criticalRange) ? s.criticalRange[1] : warnMax * 1.5;
        const direction = s.direction || 'HIGHER_IS_WORSE';

        existingThresholds.push({
          sensorId: sId,
          sensorName: s.name || sId,
          unit: s.unit || '',
          normal: { min: normMin, max: normMax, description: s.purpose || 'Nominal operating range' },
          warning: { min: warnMin, max: warnMax, description: 'Warning threshold drift' },
          critical: { min: critMin, max: critMax, description: 'Critical operating limit' },
          direction: direction as 'HIGHER_IS_WORSE' | 'LOWER_IS_WORSE'
        });
        existingIds.add(sId);
      }
    });
  }

  // Also check MACHINE_TYPES for any sensors defined in the schema
  const typeDef = MACHINE_TYPES[machineType as string] || MACHINE_TYPES[String(machineType).toLowerCase().replace(/_/g, '-')];
  if (typeDef && typeDef.sensors) {
    typeDef.sensors.forEach((s) => {
      if (!existingIds.has(s.id)) {
        const normMin = s.normalRange[0];
        const normMax = s.normalRange[1];
        const isLowerWorse = s.criticalThreshold.max < normMin || (s.warningThreshold.max < normMax && s.criticalThreshold.max <= s.warningThreshold.max);
        const direction = isLowerWorse ? 'LOWER_IS_WORSE' : 'HIGHER_IS_WORSE';

        existingThresholds.push({
          sensorId: s.id,
          sensorName: s.name,
          unit: s.unit,
          normal: { min: normMin, max: normMax, description: s.description || 'Nominal operating envelope' },
          warning: {
            min: isLowerWorse ? (s.warningThreshold.min ?? s.criticalThreshold.max) : (s.warningThreshold.min ?? normMax),
            max: s.warningThreshold.max,
            description: 'Warning threshold exceedance'
          },
          critical: {
            min: isLowerWorse ? (s.criticalThreshold.min ?? s.min) : (s.criticalThreshold.min ?? s.warningThreshold.max),
            max: s.criticalThreshold.max,
            description: 'Critical operating limit breach'
          },
          direction: direction as 'HIGHER_IS_WORSE' | 'LOWER_IS_WORSE'
        });
        existingIds.add(s.id);
      }
    });
  }

  return existingThresholds;
}

/**
 * Retrieve failure scenarios (Section 11) for a machine type.
 */
export function getFailureScenariosForMachine(machineType: MachineTypeId | string): FailureScenario[] {
  return getMachineKnowledge(machineType).failureScenarios;
}

/**
 * Retrieve troubleshooting symptoms (Section 10) for a machine type.
 */
export function getSymptomsForMachine(machineType: MachineTypeId | string): TroubleshootingSymptom[] {
  return getMachineKnowledge(machineType).symptoms;
}

/**
 * List all available machine types in the knowledge repository.
 */
export function listAvailableKnowledgeMachineTypes(): MachineTypeId[] {
  return Object.keys(KNOWLEDGE_REGISTRY) as MachineTypeId[];
}
