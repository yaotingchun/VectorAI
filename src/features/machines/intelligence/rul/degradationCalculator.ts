// =========================================================================
// VECTOR.AI — DETERMINISTIC DEGRADATION CALCULATOR
// Computes Normalized Physical Degradation (0.0 = Healthy, 1.0 = Critical End of Life)
// =========================================================================

import { ThresholdDirection } from '../types/intelligence';

export interface DegradationCalcResult {
  degradation: number; // Clamped strictly between 0.0 and 1.0
  rawScore: number;
  direction: ThresholdDirection;
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Computes individual normalized degradation for a single sensor parameter.
 * Strictly deterministic without ML, neural networks, or statistical regression.
 *
 * @param currentValue Current telemetry value
 * @param healthyLimit Baseline healthy limit (0.0 degradation)
 * @param criticalLimit Critical failure boundary limit (1.0 degradation)
 * @param direction 'HIGHER_IS_WORSE' or 'LOWER_IS_WORSE'
 */
export function calculateIndividualDegradation(
  currentValue: number,
  healthyLimit: number,
  criticalLimit: number,
  direction: ThresholdDirection
): DegradationCalcResult {
  // Validate limits
  if (healthyLimit === criticalLimit) {
    return {
      degradation: 0.0,
      rawScore: 0.0,
      direction,
      isValid: false,
      errorMessage: `Invalid RUL configuration: healthyLimit (${healthyLimit}) cannot equal criticalLimit (${criticalLimit}).`
    };
  }

  let rawScore = 0.0;

  if (direction === 'HIGHER_IS_WORSE') {
    if (criticalLimit <= healthyLimit) {
      return {
        degradation: 0.0,
        rawScore: 0.0,
        direction,
        isValid: false,
        errorMessage: `For HIGHER_IS_WORSE, criticalLimit (${criticalLimit}) must be greater than healthyLimit (${healthyLimit}).`
      };
    }
    rawScore = (currentValue - healthyLimit) / (criticalLimit - healthyLimit);
  } else {
    // LOWER_IS_WORSE
    if (criticalLimit >= healthyLimit) {
      return {
        degradation: 0.0,
        rawScore: 0.0,
        direction,
        isValid: false,
        errorMessage: `For LOWER_IS_WORSE, criticalLimit (${criticalLimit}) must be less than healthyLimit (${healthyLimit}).`
      };
    }
    rawScore = (healthyLimit - currentValue) / (healthyLimit - criticalLimit);
  }

  // Strictly clamp between 0.0 and 1.0
  const clampedDegradation = Math.max(0.0, Math.min(1.0, rawScore));

  return {
    degradation: clampedDegradation,
    rawScore,
    direction,
    isValid: true
  };
}
