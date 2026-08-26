// =========================================================================
// VECTOR.AI — RAG FALLBACK DIAGNOSTIC ENGINE
// Fallback AI Diagnostic Reasoning from Semantic Technical Knowledge Base
// =========================================================================

import { MachineTypeId } from '../../data/machineTypes';
import { AnomalyRecord, DiagnosticResult } from '../types/intelligence';
import { ragVectorIndex } from '../rag/ragRetrievalService';
import { getMachineKnowledge } from '../manuals/manualKnowledgeRepository';

/**
 * Executes RAG-based diagnostic reasoning when no direct manual symptom/scenario matches.
 *
 * Always explicitly marks source as 'RAG' with confidence 'MEDIUM' or 'LOW' and an inference disclaimer.
 */
export function diagnoseFromRag(
  anomaly: AnomalyRecord,
  machineType: MachineTypeId
): DiagnosticResult {
  const knowledge = getMachineKnowledge(machineType);
  const manualMeta = knowledge.machine;

  // Search RAG knowledge chunks
  const searchQuery = `${anomaly.sensorName} ${anomaly.description} degradation failure`;
  const retrievalResults = ragVectorIndex.search(searchQuery, {
    machineType,
    maxResults: 3
  });

  const evidence: string[] = [
    `Sensor '${anomaly.sensorName}' triggered threshold exceedance (${anomaly.currentValue} ${anomaly.unit}, limit: ${anomaly.thresholdValue} ${anomaly.unit}).`,
    `No direct matching scenario was found in Section 11 of the primary manual; initiated RAG technical retrieval.`
  ];

  const possibleCauses: string[] = [];
  const recommendedActions: string[] = [];

  if (retrievalResults.length > 0) {
    for (const res of retrievalResults) {
      evidence.push(`[RAG Match - ${res.chunk.section}]: "${res.chunk.title}" (Relevance: ${Math.round(res.similarityScore * 100)}%)`);
      
      if (res.chunk.section.includes('Component') || res.chunk.section.includes('Degradation')) {
        possibleCauses.push(`Component degradation or stress affecting ${res.chunk.title.replace('Component Specification: ', '')}`);
      }
      if (res.chunk.section.includes('Maintenance')) {
        recommendedActions.push(`Perform preventive maintenance review per ${res.chunk.section}`);
      }
    }
  }

  if (possibleCauses.length === 0) {
    possibleCauses.push(
      `Gradual wear on mechanical/electrical sub-assembly related to ${anomaly.sensorName}`,
      'Sensor calibration drift or environmental cleanroom fluctuation'
    );
  }

  if (recommendedActions.length === 0) {
    recommendedActions.push(
      `Inspect ${anomaly.sensorName} sensor wiring and execute physical calibration test`,
      'Schedule precautionary tool inspection during next maintenance window'
    );
  }

  const confidenceScore = retrievalResults.length > 0 ? 0.68 : 0.45;
  const confidenceLevel = confidenceScore >= 0.60 ? 'MEDIUM' : 'LOW';

  return {
    anomalyId: anomaly.id,
    machineId: anomaly.machineId,
    sensorId: anomaly.sensorId,
    diagnosis: `Probable sub-system degradation related to ${anomaly.sensorName}`,
    source: 'RAG',
    confidence: confidenceLevel,
    confidenceScore,
    evidence,
    possibleCauses,
    recommendedActions,
    sourceDocument: {
      manualId: manualMeta.manualId,
      title: `${manualMeta.name} Technical Documentation`,
      section: 'RAG Semantic Index',
      url: `/manuals/${knowledge.filename}-manual.pdf`
    },
    disclaimer: 'This diagnosis is inferred from semantic knowledge base references and is not directly documented in the primary machine manual.',
    diagnosedAt: new Date().toISOString()
  };
}
