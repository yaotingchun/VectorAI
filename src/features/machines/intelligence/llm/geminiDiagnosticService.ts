// =========================================================================
// VECTOR.AI — LIVE GEMINI LLM DIAGNOSTIC SERVICE
// Hybrid Two-Layer Generative Reasoning (Layer 1: Manual-Grounded | Layer 2: RAG Inferred)
// =========================================================================

import { GoogleGenAI } from '@google/genai';
import { MachineTypeId } from '../../data/machineTypes';
import { 
  AnomalyRecord, 
  DiagnosticResult, 
  FailureScenario, 
  TroubleshootingSymptom 
} from '../types/intelligence';
import { getMachineKnowledge } from '../manuals/manualKnowledgeRepository';
import { ragVectorIndex } from '../rag/ragRetrievalService';

const GEMINI_STORAGE_KEY = 'vectorai_gemini_api_key';

/**
 * Gets the configured Gemini API key from environment variable or localStorage.
 */
export function getGeminiApiKey(): string | null {
  const envKey = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim() !== '') {
    return envKey.trim();
  }
  if (typeof window !== 'undefined') {
    const localKey = localStorage.getItem(GEMINI_STORAGE_KEY);
    if (localKey && localKey.trim() !== '') {
      return localKey.trim();
    }
  }
  return null;
}

/**
 * Sets the Gemini API key in localStorage for browser runtime sessions.
 */
export function setGeminiApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem(GEMINI_STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(GEMINI_STORAGE_KEY);
    }
  }
}

/**
 * Executes live Generative AI diagnostic reasoning using Google Gemini,
 * maintaining strict two-layer architecture (Manual First -> RAG Fallback).
 */
export async function generateGeminiDiagnosis(
  anomaly: AnomalyRecord,
  machineType: MachineTypeId,
  apiKeyOverride?: string
): Promise<DiagnosticResult> {
  const apiKey = apiKeyOverride || getGeminiApiKey();
  const knowledge = getMachineKnowledge(machineType);
  const scenarios: FailureScenario[] = knowledge.failureScenarios || [];
  const symptoms: TroubleshootingSymptom[] = knowledge.symptoms || [];

  // ─────────────────────────────────────────────────────────────────────────
  // LAYER 1 CHECK: Search Machine Manual Failure Scenarios first
  // ─────────────────────────────────────────────────────────────────────────
  const targetSensorId = anomaly.sensorId.toLowerCase();
  const anomalyDesc = anomaly.description.toLowerCase();

  let matchedManualScenario: FailureScenario | null = null;
  for (const sc of scenarios) {
    const pattern = sc.sensorPattern.toLowerCase();
    const scSymptom = sc.symptom.toLowerCase();
    if (pattern.includes(targetSensorId) || scSymptom.includes(anomaly.sensorName.toLowerCase()) || anomalyDesc.includes(scSymptom)) {
      matchedManualScenario = sc;
      break;
    }
  }

  let matchedSymptom: TroubleshootingSymptom | null = null;
  if (!matchedManualScenario) {
    for (const sym of symptoms) {
      if (sym.relatedSensors.some(s => s.toLowerCase().includes(targetSensorId) || targetSensorId.includes(s.toLowerCase()))) {
        matchedSymptom = sym;
        break;
      }
    }
  }

  const isLayer1Manual = !!matchedManualScenario || !!matchedSymptom;

  // ─────────────────────────────────────────────────────────────────────────
  // LAYER 2 RAG CHUNK RETRIEVAL:
  // ─────────────────────────────────────────────────────────────────────────
  const ragChunks = ragVectorIndex.search(`${anomaly.sensorName} ${anomaly.description} failure`, {
    knowledgeType: 'MACHINE',
    machineType,
    maxResults: 3
  });

  // Construct LLM Prompt
  const promptContext = {
    machine: {
      id: anomaly.machineId,
      name: knowledge.machine.name,
      type: machineType,
      manualId: knowledge.machine.manualId
    },
    activeAnomaly: {
      sensorName: anomaly.sensorName,
      sensorId: anomaly.sensorId,
      currentValue: `${anomaly.currentValue} ${anomaly.unit}`,
      thresholdValue: `${anomaly.thresholdValue} ${anomaly.unit}`,
      thresholdType: anomaly.thresholdType,
      severity: anomaly.severity,
      description: anomaly.description
    },
    layer: isLayer1Manual ? 'LAYER_1_MANUAL_FIRST' : 'LAYER_2_RAG_FALLBACK',
    groundedManualEvidence: matchedManualScenario
      ? {
          scenarioId: matchedManualScenario.scenarioId,
          symptom: matchedManualScenario.symptom,
          sensorPattern: matchedManualScenario.sensorPattern,
          possibleCauses: matchedManualScenario.possibleCauses,
          recommendedAction: matchedManualScenario.recommendedAction,
          verificationSteps: matchedManualScenario.verificationSteps
        }
      : matchedSymptom
      ? {
          symptomId: matchedSymptom.symptomId,
          symptom: matchedSymptom.symptom,
          possibleCauses: matchedSymptom.possibleCauses,
          recommendedAction: matchedSymptom.recommendedAction
        }
      : null,
    retrievedRagTechnicalChunks: ragChunks.map(r => ({
      section: r.chunk.section,
      title: r.chunk.title,
      content: r.chunk.content,
      relevance: `${Math.round(r.similarityScore * 100)}%`
    }))
  };

  const systemInstruction = `You are the VectorAI Industrial Machine Intelligence Diagnostic Agent for semiconductor & advanced packaging equipment.
Your task is to analyze telemetry anomalies and provide an authoritative, highly professional engineering root-cause diagnosis.

CRITICAL ARCHITECTURE RULES:
1. LAYER 1 (MANUAL-FIRST): If 'layer' is 'LAYER_1_MANUAL_FIRST', your diagnosis is strictly grounded in the official Machine Technical Manual.
   - Set "source" to "MANUAL".
   - Set "confidence" to "HIGH" (score 0.90 - 0.98).
   - Directly cite the manual Scenario ID or Symptom ID.
   - Ground causes and SOP actions in the provided manual evidence.
2. LAYER 2 (RAG-FALLBACK): If 'layer' is 'LAYER_2_RAG_FALLBACK', no direct manual scenario matches.
   - Set "source" to "RAG".
   - Set "confidence" to "MEDIUM" or "LOW" (score 0.50 - 0.75).
   - Set "disclaimer" to: "This diagnosis is inferred by Gemini AI from semantic knowledge base references and is not directly documented in the primary machine manual."
   - Synthesize probable component wear mechanisms from the retrieved technical chunks.

OUTPUT FORMAT:
Respond with ONLY a valid, raw JSON object (no markdown code blocks, no backticks):
{
  "diagnosis": "Concise 1-sentence technical diagnosis",
  "source": "MANUAL" or "RAG",
  "confidence": "HIGH" or "MEDIUM" or "LOW",
  "confidenceScore": 0.95,
  "evidence": ["Bullet 1 with exact telemetry and limits", "Bullet 2 citing manual section or RAG reference", "Bullet 3"],
  "possibleCauses": ["Cause 1", "Cause 2", "Cause 3"],
  "recommendedActions": ["Primary corrective SOP action", "Verification step"],
  "matchedScenarioId": "${matchedManualScenario?.scenarioId || matchedSymptom?.symptomId || ''}",
  "disclaimer": "${isLayer1Manual ? '' : 'This diagnosis is inferred by Gemini AI from semantic knowledge base references and is not directly documented in the primary machine manual.'}"
}`;

  try {
    let responseText = '';
    const fullPrompt = `${systemInstruction}\n\nANOMALY TELEMETRY & KNOWLEDGE CONTEXT:\n${JSON.stringify(promptContext, null, 2)}`;

    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: fullPrompt }]
          }
        ]
      });
      responseText = response.text || '';
    } else {
      // Call local backend proxy powered by credentials/google.json!
      const proxyRes = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt })
      });
      const proxyData = await proxyRes.json();
      if (!proxyRes.ok || !proxyData.success) {
        throw new Error(proxyData.error?.message || proxyData.error || 'Failed to call Gemini AI proxy');
      }
      responseText = proxyData.text || '';
    }

    // Safely extract and parse JSON object from Gemini response
    let cleanedJson = responseText.trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedJson = jsonMatch[0];
    }
    const parsed = JSON.parse(cleanedJson);

    return {
      anomalyId: anomaly.id,
      machineId: anomaly.machineId,
      sensorId: anomaly.sensorId,
      diagnosis: parsed.diagnosis || `Identified condition for ${anomaly.sensorName}`,
      source: parsed.source || (isLayer1Manual ? 'MANUAL' : 'RAG'),
      confidence: parsed.confidence || (isLayer1Manual ? 'HIGH' : 'MEDIUM'),
      confidenceScore: parsed.confidenceScore || (isLayer1Manual ? 0.94 : 0.68),
      evidence: Array.isArray(parsed.evidence) && parsed.evidence.length > 0 ? parsed.evidence : [
        `Sensor '${anomaly.sensorName}' reached ${anomaly.currentValue} ${anomaly.unit}, breaching threshold.`,
        `Grounded in ${knowledge.machine.name} authoritative RAG technical manual.`
      ],
      possibleCauses: Array.isArray(parsed.possibleCauses) && parsed.possibleCauses.length > 0 ? parsed.possibleCauses : (matchedManualScenario?.possibleCauses || ['Subsystem parameter drift']),
      recommendedActions: Array.isArray(parsed.recommendedActions) && parsed.recommendedActions.length > 0 ? parsed.recommendedActions : [matchedManualScenario?.recommendedAction || 'Inspect sensor channel and verify operational tolerances.'],
      matchedScenarioId: parsed.matchedScenarioId || matchedManualScenario?.scenarioId || matchedSymptom?.symptomId,
      sourceDocument: {
        manualId: knowledge.machine.manualId,
        title: `${knowledge.machine.name} Technical Manual`,
        section: isLayer1Manual ? `Section 11 — Scenario ${matchedManualScenario?.scenarioId || 'Diagnostic Matrix'}` : 'Machine RAG Knowledge Base',
        url: `/manuals/${knowledge.filename}-manual.pdf`
      },
      diagnosedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('[GeminiDiagnostic] Error calling Gemini API:', error);
    throw error;
  }
}
