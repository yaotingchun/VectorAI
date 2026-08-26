// =========================================================================
// VECTOR.AI — FORMULA-BASED DETERMINISTIC RUL ENGINE
// 100% Deterministic, Explainable, Reproducible (NO MACHINE LEARNING)
// =========================================================================

import { MachineTypeId } from '../../data/machineTypes';
import { 
  RulModelDefinition, 
  RulCalculationResult, 
  ParameterContribution,
  ModelReliability
} from '../types/intelligence';
import { calculateIndividualDegradation } from './degradationCalculator';

export interface SensorValueInput {
  sensorId: string;
  value: number;
}

/**
 * Validates the structural integrity of a deterministic RUL model.
 */
export function validateRulModel(model: RulModelDefinition): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (model.baseUsefulLifeHours <= 0) {
    errors.push(`Base Useful Life must be positive (> 0), got: ${model.baseUsefulLifeHours}`);
  }

  if (!model.parameters || model.parameters.length === 0) {
    errors.push('RUL model has no parameters defined.');
    return { isValid: false, errors };
  }

  let totalWeight = 0;
  for (const p of model.parameters) {
    if (p.weight < 0) {
      errors.push(`Parameter '${p.parameter}' has negative weight: ${p.weight}`);
    }
    totalWeight += p.weight;

    if (p.healthyLimit === p.criticalLimit) {
      errors.push(`Parameter '${p.parameter}' healthyLimit equals criticalLimit (${p.healthyLimit})`);
    }

    if (p.direction === 'HIGHER_IS_WORSE' && p.criticalLimit <= p.healthyLimit) {
      errors.push(`Parameter '${p.parameter}' (HIGHER_IS_WORSE) criticalLimit (${p.criticalLimit}) must be > healthyLimit (${p.healthyLimit})`);
    }

    if (p.direction === 'LOWER_IS_WORSE' && p.criticalLimit >= p.healthyLimit) {
      errors.push(`Parameter '${p.parameter}' (LOWER_IS_WORSE) criticalLimit (${p.criticalLimit}) must be < healthyLimit (${p.healthyLimit})`);
    }
  }

  if (Math.abs(totalWeight - 1.00) > 0.0001) {
    errors.push(`RUL parameter weights must sum to 1.00 (100%), got: ${totalWeight.toFixed(4)}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Computes deterministic Remaining Useful Life (RUL) from current sensor values.
 *
 * Formula:
 * 1. For each parameter i: d_i = clamped((current - healthy) / (critical - healthy))
 * 2. Overall Degradation D = Σ (w_i * d_i)  [where Σ w_i = 1.00]
 * 3. Remaining Life Ratio = 1.0 - D
 * 4. RUL = max(0, BaseUsefulLife * (1.0 - D))
 */
export function calculateDeterministicRul(
  machineId: string,
  machineType: MachineTypeId,
  currentSensors: SensorValueInput[],
  model: RulModelDefinition
): RulCalculationResult {
  // Validate model structure
  const validation = validateRulModel(model);

  const sensorMap = new Map<string, number>();
  for (const s of currentSensors) {
    sensorMap.set(s.sensorId, s.value);
  }

  const parameterContributions: ParameterContribution[] = [];
  let availableSensorsCount = 0;
  let totalDegradation = 0.0;

  for (const param of model.parameters) {
    const sensorVal = sensorMap.get(param.sensorId);
    const hasValue = sensorVal !== undefined && !isNaN(sensorVal);

    if (hasValue) {
      availableSensorsCount++;
    }

    // Default to healthyLimit if sensor reading is missing
    const currentVal = hasValue ? sensorVal! : param.healthyLimit;

    const degResult = calculateIndividualDegradation(
      currentVal,
      param.healthyLimit,
      param.criticalLimit,
      param.direction
    );

    const individualDeg = degResult.degradation;
    const weightedContrib = individualDeg * param.weight;
    totalDegradation += weightedContrib;

    let paramStatus: 'normal' | 'warning' | 'critical' = 'normal';
    if (individualDeg >= 0.75) {
      paramStatus = 'critical';
    } else if (individualDeg >= 0.35) {
      paramStatus = 'warning';
    }

    parameterContributions.push({
      parameter: param.parameter,
      sensorId: param.sensorId,
      sensorName: param.sensorName,
      unit: param.unit,
      currentValue: currentVal,
      healthyLimit: param.healthyLimit,
      criticalLimit: param.criticalLimit,
      direction: param.direction,
      individualDegradation: Math.round(individualDeg * 1000) / 1000,
      weight: param.weight,
      weightedContribution: Math.round(weightedContrib * 1000) / 1000,
      percentageOfTotalWear: 0, // Computed below after total is known
      status: paramStatus
    });
  }

  // Calculate percentage share of total wear for each parameter
  for (const p of parameterContributions) {
    p.percentageOfTotalWear = totalDegradation > 0
      ? Math.round((p.weightedContribution / totalDegradation) * 1000) / 10
      : Math.round(p.weight * 1000) / 10;
  }

  // Clamp total degradation to [0.0, 1.0]
  const clampedTotalDegradation = Math.max(0.0, Math.min(1.0, totalDegradation));
  const remainingLifeRatio = Math.max(0.0, 1.0 - clampedTotalDegradation);

  // Compute final deterministic RUL hours
  const rawRulHours = model.baseUsefulLifeHours * remainingLifeRatio;
  const rulHours = Math.max(0, Math.round(rawRulHours));
  const estimatedDays = Math.round((rulHours / 24) * 10) / 10;

  // Determine Model Reliability based on sensor availability
  const sensorCompletenessRatio = model.parameters.length > 0
    ? availableSensorsCount / model.parameters.length
    : 0;

  let reliabilityStatus: ModelReliability = 'HIGH';
  let reliabilityReason = 'All telemetry sensor parameters verified and within mathematical limits.';

  if (!validation.isValid) {
    reliabilityStatus = 'LOW';
    reliabilityReason = `Model validation warning: ${validation.errors.join('; ')}`;
  } else if (sensorCompletenessRatio < 0.7) {
    reliabilityStatus = 'LOW';
    reliabilityReason = `Incomplete telemetry: only ${availableSensorsCount} of ${model.parameters.length} sensors reporting.`;
  } else if (sensorCompletenessRatio < 1.0) {
    reliabilityStatus = 'MEDIUM';
    reliabilityReason = `Partial telemetry: ${availableSensorsCount} of ${model.parameters.length} sensors active; missing parameters interpolated from baseline.`;
  }

  return {
    machineId,
    machineType,
    rulHours,
    estimatedDays,
    degradationScore: Math.round(clampedTotalDegradation * 1000) / 1000,
    remainingLifeRatio: Math.round(remainingLifeRatio * 1000) / 1000,
    baseUsefulLifeHours: model.baseUsefulLifeHours,
    modelVersion: model.version,
    formula: `RUL = BaseUsefulLife (${model.baseUsefulLifeHours} hrs) × (1.0 - Σ[w_i × d_i])`,
    parameters: parameterContributions,
    reliability: {
      status: reliabilityStatus,
      sensorCompletenessRatio,
      availableParametersCount: availableSensorsCount,
      requiredParametersCount: model.parameters.length,
      validationPassed: validation.isValid,
      reason: reliabilityReason
    },
    calculatedAt: new Date().toISOString(),
    isExplainable: true
  };
}
