// =========================================================================
// VECTOR.AI — MASTER MACHINE AGENT SERVICE
// Orchestrates Sensor Monitoring, Threshold Anomalies, Formula RUL, & Diagnostics
// =========================================================================

import { MachineTypeId } from '../../data/machineTypes';
import { Machine } from '../../types/machine';
import { 
  MachineAgentAnalysis, 
  DiagnosticResult, 
  AnomalyRecord 
} from '../types/intelligence';
import { evaluateMachineSensors } from '../thresholds/thresholdEngine';
import { calculateDeterministicRul } from '../rul/rulEngine';
import { 
  getMachineKnowledge, 
  getRulModelForMachine, 
  getThresholdsForMachine 
} from '../manuals/manualKnowledgeRepository';
import { diagnoseFromManual } from '../diagnostics/manualDiagnosticEngine';
import { diagnoseFromRag } from '../diagnostics/ragDiagnosticEngine';

/**
 * Analyzes a machine entity through the complete Machine Agent intelligence pipeline:
 * 1. Deterministic threshold evaluation -> Anomaly detection
 * 2. Deterministic formula RUL -> Degradation breakdown
 * 3. Manual-First Diagnosis -> RAG Fallback
 */
export function analyzeMachine(machine: Machine): MachineAgentAnalysis {
  const machineType = machine.machineType as MachineTypeId;
  const knowledge = getMachineKnowledge(machineType);
  const thresholds = getThresholdsForMachine(machineType);
  const rulModel = getRulModelForMachine(machineType);

  // 1. Evaluate Sensor Thresholds & Detect Anomalies
  const sensorInputs = machine.sensors.map(s => ({
    sensorId: s.sensorId,
    value: s.value,
    name: s.name,
    unit: s.unit
  }));

  const { anomalies: detectedAnomalies, overallStatus, healthScore } = evaluateMachineSensors(
    machine.id,
    sensorInputs,
    thresholds
  );

  // Merge with existing machine anomalies if any, ensuring uniqueness by sensorId
  const allAnomalies: AnomalyRecord[] = [...detectedAnomalies];
  if (machine.anomalies && machine.anomalies.length > 0) {
    for (const existing of machine.anomalies) {
      if (!allAnomalies.some(a => a.sensorId.toLowerCase() === existing.sensor.toLowerCase() || a.id === existing.id)) {
        allAnomalies.push({
          id: existing.id,
          machineId: machine.id,
          sensorId: existing.sensor,
          sensorName: existing.sensor,
          currentValue: machine.sensors.find(s => s.name === existing.sensor)?.value || 0,
          unit: machine.sensors.find(s => s.name === existing.sensor)?.unit || '',
          thresholdValue: 0,
          thresholdType: existing.severity === 'critical' ? 'CRITICAL_HIGH' : 'WARNING_HIGH',
          severity: existing.severity,
          status: existing.status,
          detectedAt: existing.timestamp,
          description: existing.description
        });
      }
    }
  }

  // 2. Compute Deterministic Formula-Based RUL
  const rulResult = calculateDeterministicRul(
    machine.id,
    machineType,
    sensorInputs,
    rulModel
  );

  // 3. Diagnose all active anomalies: MANUAL FIRST -> RAG FALLBACK
  const diagnoses: DiagnosticResult[] = [];

  for (const anomaly of allAnomalies) {
    // Step A: Search Machine Manual
    let diag = diagnoseFromManual(anomaly, machineType);

    // Step B: Fallback to RAG if no manual match
    if (!diag) {
      diag = diagnoseFromRag(anomaly, machineType);
    }

    diagnoses.push(diag);
  }

  // 4. Generate Machine Agent Actionable Recommendations
  const recommendations: string[] = [];
  if (allAnomalies.length > 0) {
    for (const d of diagnoses) {
      if (d.recommendedActions.length > 0) {
        recommendations.push(d.recommendedActions[0]);
      }
    }
  } else if (rulResult.rulHours < rulModel.baseUsefulLifeHours * 0.25) {
    recommendations.push(
      `Plan preventive overhaul for ${knowledge.machine.name}: remaining useful life is under 25% of baseline.`
    );
  } else {
    recommendations.push(
      `Operating within nominal technical limits. Next preventive inspection at ${knowledge.maintenance[0]?.recommendedMaintenanceIntervalHours || 500} operating hours.`
    );
  }

  return {
    machineId: machine.id,
    machineType,
    machineName: machine.name || knowledge.machine.name,
    status: overallStatus,
    healthScore,
    activeAnomaliesCount: allAnomalies.length,
    anomalies: allAnomalies,
    rul: rulResult,
    diagnoses,
    knowledgeBase: {
      manualId: knowledge.machine.manualId,
      title: `${knowledge.machine.name} Technical Manual`,
      pdfUrl: `/manuals/${knowledge.filename}-manual.pdf`,
      isIndexedForRag: true,
      scenariosCount: knowledge.failureScenarios.length
    },
    recommendations,
    analyzedAt: new Date().toISOString()
  };
}
