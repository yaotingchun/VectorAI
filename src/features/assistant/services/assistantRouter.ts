// =========================================================================
// VECTOR.AI — ASSISTANT INTENT ROUTER
// Fast Deterministic Query Classification & Scope Resolution
// =========================================================================

import { MachineTypeId } from '../../machines/data/machineTypes';
import { AssistantIntent, AssistantFrontendContext } from '../types/assistant';
import { resolveMachineReference } from '../tools/assistantTools';

export interface RouteAnalysis {
  intent: AssistantIntent;
  targetMachineId?: string;
  targetMachineType?: MachineTypeId;
  requiresLiveTelemetry: boolean;
  requiresMachineAgent: boolean;
  requiresRAG: boolean;
  ragKnowledgeScope?: 'GLOBAL' | 'MACHINE_ONLY';
  cleanSearchQuery: string;
}

/**
 * Classifies user prompt into precise operational intent and routing parameters.
 */
export function routeUserQuery(
  query: string,
  context?: AssistantFrontendContext,
  previousMachineId?: string | null
): RouteAnalysis {
  const norm = query.toLowerCase().trim();

  // 1. Resolve Machine Reference
  const resolved = resolveMachineReference(query, context?.currentMachineId, previousMachineId);
  const machineId = resolved.machineId;
  const machineType = resolved.machineType;

  // 2. Identify Live Status Intent Markers
  const hasLiveKeywords = /\b(current|currently|now|latest|live|today|status|health score|value|how much|who is critical|show me telemetry)\b/i.test(norm);
  const isAnomalyQuery = /\b(anomaly|anomalies|alarms?|alerts?|defects?|faults?|issues?|problems?|anything broken|anything wrong|any issue|any anomaly|what is happening|what is failing)\b/i.test(norm);
  const isFleetOverviewQuery = isAnomalyQuery || /\b(which machines|fleet health|fleet status|critical machines|machines at risk|all machines|fleet overview|plant status|factory status)\b/i.test(norm);

  // 3. Identify Diagnostic Intent Markers (Root Cause / Troubleshooting)
  const isDiagnosticQuery = /\b(why is|what caused|what is causing|abnormal|root cause|troubleshoot|diagnose|failure mode|drill down|why.*decreasing|why.*drop|explain fault)\b/i.test(norm);

  // 4. Identify Mixed Risk/Health Evaluation Markers
  const isMixedRiskQuery = (isDiagnosticQuery && hasLiveKeywords) || /\b(at risk|why.*critical|why.*warning|why is.*failing|investigate|assess condition)\b/i.test(norm);

  // 5. Identify Website Feature / UI Markers
  const isWebsiteQuery = /\b(how do i|where can i|how to use|dashboard tab|prediction tab|maintenance tab|documents tab|accelerated wear|simulate wear|toggle|filter machines|export|pdf viewer|website|ui|screen)\b/i.test(norm);

  // 6. Identify Formula RUL vs Live RUL
  const isRulMethodologyQuery = /\b(how (is|does|do we) (calculate|compute|work) rul|rul formula|rul methodology|without ml|zero ml|linear degradation formula)\b/i.test(norm);

  // ── ROUTING DECISION MATRIX ──

  // Case A: Mixed Risk Query with a specific machine
  if (isMixedRiskQuery && machineId) {
    return {
      intent: 'MIXED',
      targetMachineId: machineId,
      targetMachineType: machineType,
      requiresLiveTelemetry: true,
      requiresMachineAgent: true,
      requiresRAG: true,
      ragKnowledgeScope: 'MACHINE_ONLY',
      cleanSearchQuery: `${machineType || ''} degradation symptom failure`
    };
  }

  // Case B: Pure Machine Diagnosis
  if (isDiagnosticQuery && machineId) {
    return {
      intent: 'DIAGNOSTIC',
      targetMachineId: machineId,
      targetMachineType: machineType,
      requiresLiveTelemetry: true,
      requiresMachineAgent: true,
      requiresRAG: true,
      ragKnowledgeScope: 'MACHINE_ONLY',
      cleanSearchQuery: query
    };
  }

  // Case C: Live Telemetry / Fleet Status / Active Anomalies Query
  if (isFleetOverviewQuery || (hasLiveKeywords && (machineId || isAnomalyQuery))) {
    return {
      intent: 'LIVE_MACHINE_DATA',
      targetMachineId: machineId,
      targetMachineType: machineType,
      requiresLiveTelemetry: true,
      requiresMachineAgent: false,
      requiresRAG: true,
      ragKnowledgeScope: 'GLOBAL',
      cleanSearchQuery: query
    };
  }

  // Case D: Website Help & Navigation
  if (isWebsiteQuery && !machineId) {
    return {
      intent: 'WEBSITE_HELP',
      requiresLiveTelemetry: false,
      requiresMachineAgent: false,
      requiresRAG: true,
      ragKnowledgeScope: 'GLOBAL',
      cleanSearchQuery: query
    };
  }

  // Case E: Machine Manual Knowledge (without asking for live values)
  if (machineType && !hasLiveKeywords) {
    return {
      intent: 'MACHINE_KNOWLEDGE',
      targetMachineId: machineId,
      targetMachineType: machineType,
      requiresLiveTelemetry: false,
      requiresMachineAgent: false,
      requiresRAG: true,
      ragKnowledgeScope: 'MACHINE_ONLY',
      cleanSearchQuery: query
    };
  }

  // Case F: General Architecture / Predictive Maintenance / RUL Methodology
  if (isRulMethodologyQuery || !machineId) {
    return {
      intent: 'GENERAL_KNOWLEDGE',
      requiresLiveTelemetry: false,
      requiresMachineAgent: false,
      requiresRAG: true,
      ragKnowledgeScope: 'GLOBAL',
      cleanSearchQuery: query
    };
  }

  // Fallback: General Knowledge
  return {
    intent: 'UNKNOWN',
    requiresLiveTelemetry: false,
    requiresMachineAgent: false,
    requiresRAG: true,
    ragKnowledgeScope: 'GLOBAL',
    cleanSearchQuery: query
  };
}
