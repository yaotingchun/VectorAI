// =========================================================================
// VECTOR.AI — MANUAL-FIRST DIAGNOSTIC ENGINE
// Searches Machine Technical Manual Knowledge Base First
// =========================================================================

import { MachineTypeId } from '../../data/machineTypes';
import { 
  AnomalyRecord, 
  DiagnosticResult, 
  FailureScenario, 
  TroubleshootingSymptom 
} from '../types/intelligence';
import { getMachineKnowledge } from '../manuals/manualKnowledgeRepository';

/**
 * Normalizes a sensor name/id into search tokens for flexible cross-matching.
 * e.g., "Handler Vibration" or "vibration_handler" -> ["handler", "vibration", "vibration_handler", "handler vibration"]
 */
function getSensorSearchTokens(sensorId: string, sensorName: string): string[] {
  const tokens = new Set<string>();
  const sId = (sensorId || '').toLowerCase().trim();
  const sName = (sensorName || '').toLowerCase().trim();

  if (sId) {
    tokens.add(sId);
    tokens.add(sId.replace(/_/g, ' '));
    tokens.add(sId.replace(/\s+/g, '_'));
    sId.split(/[_\s]+/).forEach(t => t.length > 2 && tokens.add(t));
  }

  if (sName) {
    tokens.add(sName);
    tokens.add(sName.replace(/_/g, ' '));
    tokens.add(sName.replace(/\s+/g, '_'));
    sName.split(/[_\s]+/).forEach(t => t.length > 2 && tokens.add(t));
  }

  return Array.from(tokens);
}

/**
 * Searches the Machine Manual's documented symptoms and failure scenarios for a matching diagnosis.
 *
 * Returns a high-confidence MANUAL diagnosis if matched, or null if no documented match exists.
 */
export function diagnoseFromManual(
  anomaly: AnomalyRecord,
  machineType: MachineTypeId
): DiagnosticResult | null {
  const knowledge = getMachineKnowledge(machineType);
  const scenarios: FailureScenario[] = knowledge.failureScenarios || [];
  const symptoms: TroubleshootingSymptom[] = knowledge.symptoms || [];

  // Find canonical sensor definition in knowledge if available
  const canonicalSensor = knowledge.sensors.find(s => 
    s.sensorId.toLowerCase() === anomaly.sensorId.toLowerCase() ||
    s.name.toLowerCase() === anomaly.sensorName.toLowerCase() ||
    s.name.toLowerCase() === anomaly.sensorId.toLowerCase() ||
    s.sensorId.toLowerCase() === anomaly.sensorName.toLowerCase()
  );

  const searchTokens = getSensorSearchTokens(
    canonicalSensor ? canonicalSensor.sensorId : anomaly.sensorId,
    canonicalSensor ? canonicalSensor.name : anomaly.sensorName
  );

  const anomalyDesc = (anomaly.description || '').toLowerCase();
  const anomalyType = (anomaly.status || '').toLowerCase();

  // 1. First priority: Search Section 11 Failure Scenarios (>= 10-15 detailed scenarios)
  let matchedScenario: FailureScenario | null = null;
  let bestScenarioScore = 0;

  for (const sc of scenarios) {
    let score = 0;
    const pattern = sc.sensorPattern.toLowerCase();
    const scSymptom = sc.symptom.toLowerCase();
    const causes = (sc.possibleCauses || []).join(' ').toLowerCase();

    // Check if scenario explicitly mentions any of the sensor tokens
    let tokenMatches = 0;
    for (const token of searchTokens) {
      if (pattern.includes(token) || scSymptom.includes(token) || causes.includes(token)) {
        tokenMatches++;
      }
    }

    if (tokenMatches > 0) {
      score += Math.min(6, tokenMatches * 2);
    }

    // Check severity match
    if (sc.severity.toLowerCase() === anomaly.severity.toLowerCase()) {
      score += 2;
    } else if (
      (sc.severity.toLowerCase() === 'high' && anomaly.severity.toLowerCase() === 'medium') ||
      (sc.severity.toLowerCase() === 'critical' && anomaly.severity.toLowerCase() === 'critical')
    ) {
      score += 1;
    }

    // Keyword match from anomaly description or type
    if (anomalyDesc && (pattern.includes(anomalyDesc) || scSymptom.includes(anomalyDesc))) {
      score += 3;
    }
    if (scSymptom.includes(anomalyType)) {
      score += 2;
    }

    if (score > bestScenarioScore && score >= 4) {
      bestScenarioScore = score;
      matchedScenario = sc;
    }
  }

  if (matchedScenario) {
    const manualMeta = knowledge.machine;
    const sensorDisplayName = canonicalSensor ? canonicalSensor.name : anomaly.sensorName;
    const sensorUnit = canonicalSensor ? canonicalSensor.unit : anomaly.unit;

    return {
      anomalyId: anomaly.id,
      machineId: anomaly.machineId,
      sensorId: canonicalSensor ? canonicalSensor.sensorId : anomaly.sensorId,
      diagnosis: `Identified condition: ${matchedScenario.symptom}`,
      source: 'MANUAL',
      confidence: 'HIGH',
      confidenceScore: 0.95,
      evidence: [
        `Sensor '${sensorDisplayName}' (${anomaly.currentValue} ${sensorUnit}) breached documented ${anomaly.thresholdType.replace('_', ' ')} limit.`,
        `Directly corresponds to Machine Manual Section 11 Diagnostic Scenario '${matchedScenario.scenarioId}'.`,
        `Telemetry signature matches documented pattern: "${matchedScenario.sensorPattern}".`
      ],
      possibleCauses: matchedScenario.possibleCauses,
      recommendedActions: [
        matchedScenario.recommendedAction,
        ...(matchedScenario.verificationSteps ? matchedScenario.verificationSteps.map(step => `Verification: ${step}`) : [])
      ],
      matchedScenarioId: matchedScenario.scenarioId,
      sourceDocument: {
        manualId: manualMeta.manualId,
        title: `${manualMeta.name} Technical Manual`,
        section: `Section 11 — Scenario ${matchedScenario.scenarioId}`,
        url: `/manuals/${knowledge.filename}-manual.pdf`
      },
      diagnosedAt: new Date().toISOString()
    };
  }

  // 2. Second priority: Search Section 10 Troubleshooting Matrix
  let matchedSymptom: TroubleshootingSymptom | null = null;
  for (const sym of symptoms) {
    const related = sym.relatedSensors.map(s => s.toLowerCase());
    const symptomText = sym.symptom.toLowerCase();
    
    const isRelated = searchTokens.some(token => 
      related.includes(token) || 
      related.some(r => r.includes(token) || token.includes(r)) ||
      symptomText.includes(token)
    );

    if (isRelated) {
      matchedSymptom = sym;
      break;
    }
  }

  if (matchedSymptom) {
    const manualMeta = knowledge.machine;
    const sensorDisplayName = canonicalSensor ? canonicalSensor.name : anomaly.sensorName;
    const sensorUnit = canonicalSensor ? canonicalSensor.unit : anomaly.unit;

    return {
      anomalyId: anomaly.id,
      machineId: anomaly.machineId,
      sensorId: canonicalSensor ? canonicalSensor.sensorId : anomaly.sensorId,
      diagnosis: `Documented symptom: ${matchedSymptom.symptom}`,
      source: 'MANUAL',
      confidence: 'HIGH',
      confidenceScore: 0.88,
      evidence: [
        `Sensor '${sensorDisplayName}' recorded ${anomaly.currentValue} ${sensorUnit}, triggering threshold severity: ${anomaly.severity.toUpperCase()}.`,
        `Referenced in Machine Manual Section 10 Troubleshooting Matrix (Symptom ID: ${matchedSymptom.symptomId}).`
      ],
      possibleCauses: matchedSymptom.possibleCauses,
      recommendedActions: [matchedSymptom.recommendedAction],
      matchedScenarioId: matchedSymptom.symptomId,
      sourceDocument: {
        manualId: manualMeta.manualId,
        title: `${manualMeta.name} Technical Manual`,
        section: `Section 10 — Troubleshooting Matrix (${matchedSymptom.symptomId})`,
        url: `/manuals/${knowledge.filename}-manual.pdf`
      },
      diagnosedAt: new Date().toISOString()
    };
  }

  // No direct documented match found in manual; caller will trigger RAG fallback
  return null;
}
