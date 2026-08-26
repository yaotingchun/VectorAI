// =========================================================================
// VECTOR.AI — DETERMINISTIC THRESHOLD ENGINE
// Evaluates Sensor Streams Against Machine Manual Operating Thresholds
// =========================================================================

import { 
  MachineSensorThreshold, 
  ThresholdType, 
  AnomalySeverity, 
  AnomalyRecord 
} from '../types/intelligence';

export interface SensorEvaluationResult {
  sensorId: string;
  sensorName: string;
  currentValue: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  thresholdType: ThresholdType;
  thresholdBreached?: number;
  anomaly?: AnomalyRecord;
}

/**
 * Deterministically evaluates a single sensor value against its threshold boundaries.
 * Does NOT use ML or heuristics.
 */
export function evaluateSensorThreshold(
  sensorId: string,
  currentValue: number,
  threshold: MachineSensorThreshold,
  machineId: string = 'UNKNOWN'
): SensorEvaluationResult {
  const { sensorName, unit, normal, warning, critical, direction } = threshold;

  let status: 'normal' | 'warning' | 'critical' = 'normal';
  let thresholdType: ThresholdType = 'NORMAL';
  let thresholdBreached: number | undefined = undefined;
  let severity: AnomalySeverity = 'low';

  if (direction === 'HIGHER_IS_WORSE') {
    if (currentValue >= critical.min) {
      status = 'critical';
      thresholdType = 'CRITICAL_HIGH';
      thresholdBreached = critical.min;
      severity = 'critical';
    } else if (currentValue >= warning.min) {
      status = 'warning';
      thresholdType = 'WARNING_HIGH';
      thresholdBreached = warning.min;
      severity = currentValue >= (warning.min + critical.min) / 2 ? 'high' : 'medium';
    } else if (currentValue < normal.min) {
      // Sub-nominal underflow
      status = 'warning';
      thresholdType = 'WARNING_LOW';
      thresholdBreached = normal.min;
      severity = 'low';
    } else {
      status = 'normal';
      thresholdType = 'NORMAL';
    }
  } else {
    // LOWER_IS_WORSE (e.g. pressure drops, coolant flow drops, vacuum decay towards 0)
    if (currentValue <= critical.max) {
      status = 'critical';
      thresholdType = 'CRITICAL_LOW';
      thresholdBreached = critical.max;
      severity = 'critical';
    } else if (currentValue <= warning.max) {
      status = 'warning';
      thresholdType = 'WARNING_LOW';
      thresholdBreached = warning.max;
      severity = currentValue <= (warning.max + critical.max) / 2 ? 'high' : 'medium';
    } else if (currentValue > normal.max) {
      // Super-nominal overflow
      status = 'warning';
      thresholdType = 'WARNING_HIGH';
      thresholdBreached = normal.max;
      severity = 'low';
    } else {
      status = 'normal';
      thresholdType = 'NORMAL';
    }
  }

  let anomaly: AnomalyRecord | undefined = undefined;

  if (status !== 'normal') {
    const timestamp = new Date().toISOString();
    const formattedVal = `${currentValue} ${unit}`;
    const limitVal = `${thresholdBreached} ${unit}`;
    
    anomaly = {
      id: `ANO-${machineId}-${sensorId}-${Date.now().toString().slice(-4)}`,
      machineId,
      sensorId,
      sensorName,
      currentValue,
      unit,
      thresholdValue: thresholdBreached ?? 0,
      thresholdType,
      severity,
      status: 'active',
      detectedAt: timestamp,
      description: status === 'critical'
        ? `CRITICAL EXCEEDANCE: ${sensorName} reached ${formattedVal}, breaching critical limit (${limitVal}).`
        : `WARNING DRIFT: ${sensorName} reached ${formattedVal}, exceeding warning threshold (${limitVal}).`
    };
  }

  return {
    sensorId,
    sensorName,
    currentValue,
    unit,
    status,
    thresholdType,
    thresholdBreached,
    anomaly
  };
}

/**
 * Evaluates an entire array of sensors for a machine against their threshold definitions.
 */
export function evaluateMachineSensors(
  machineId: string,
  sensors: { sensorId: string; value: number; name?: string; unit?: string }[],
  thresholds: MachineSensorThreshold[]
): {
  evaluations: SensorEvaluationResult[];
  anomalies: AnomalyRecord[];
  overallStatus: 'healthy' | 'warning' | 'critical';
  healthScore: number;
} {
  const thresholdMap = new Map<string, MachineSensorThreshold>();
  thresholds.forEach(t => thresholdMap.set(t.sensorId, t));

  const evaluations: SensorEvaluationResult[] = [];
  const anomalies: AnomalyRecord[] = [];

  let criticalCount = 0;
  let warningCount = 0;

  for (const s of sensors) {
    const thresh = thresholdMap.get(s.sensorId);
    if (!thresh) {
      // If no explicit threshold found, treat as normal
      evaluations.push({
        sensorId: s.sensorId,
        sensorName: s.name || s.sensorId,
        currentValue: s.value,
        unit: s.unit || '',
        status: 'normal',
        thresholdType: 'NORMAL'
      });
      continue;
    }

    const res = evaluateSensorThreshold(s.sensorId, s.value, thresh, machineId);
    evaluations.push(res);

    if (res.anomaly) {
      anomalies.push(res.anomaly);
      if (res.status === 'critical') criticalCount++;
      else if (res.status === 'warning') warningCount++;
    }
  }

  let overallStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
  let healthScore = 100;

  if (criticalCount > 0) {
    overallStatus = 'critical';
    healthScore = Math.max(25, 60 - criticalCount * 15 - warningCount * 5);
  } else if (warningCount > 0) {
    overallStatus = 'warning';
    healthScore = Math.max(65, 92 - warningCount * 8);
  } else {
    overallStatus = 'healthy';
    healthScore = 98;
  }

  return {
    evaluations,
    anomalies,
    overallStatus,
    healthScore
  };
}
