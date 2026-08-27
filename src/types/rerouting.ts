// =========================================================================
// VECTOR.AI - DYNAMIC REROUTING & EXECUTION LOGS TYPE DEFINITIONS
// Real-time machine fault response, AI reasoning, and execution logs
// =========================================================================

export type RerouteSeverity = 'INFO' | 'WARN' | 'ACTION' | 'SUCCESS' | 'ERROR' | 'REASONING';

export type ReroutePhase =
  | 'TRIGGER_ISOLATION'
  | 'SAFETY_LOCKOUT'
  | 'DIAGNOSTIC_REASONING'
  | 'TARGET_SELECTION'
  | 'MES_LOT_REASSIGNMENT'
  | 'AMHS_AGV_DISPATCH'
  | 'RECIPE_HANDSHAKE'
  | 'INGESTION_VERIFICATION';

export type ExecutionStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'PAUSED'
  | 'ROLLED_BACK';

export interface LotInfo {
  lotId: string;
  productFamily: string;
  waferCount: number;
  priority: 'CRITICAL' | 'EXPEDITE' | 'STANDARD';
  currentStage: string;
  originalMachineId: string;
  targetMachineId: string;
  agvCarrierId: string;
  transferStatus: 'QUEUED' | 'IN_TRANSIT' | 'LOADED' | 'PROCESSED';
  estimatedScrapSavingsUsd: number;
}

export interface TargetEvaluationCandidate {
  machineId: string;
  machineName: string;
  currentUtilization: number; // 0 - 100%
  availableCapacity: number;  // 0 - 100%
  healthScore: number;        // 0 - 100
  toolCompatibilityScore: number; // 0 - 100
  agvTransferTimeSeconds: number;
  overallScore: number;       // 0 - 100
  isRecommended: boolean;
  evaluationReasoning: string;
}

export interface RerouteReasoning {
  rootCause: string;
  faultMechanism: string;
  yieldRiskAssessment: string;
  targetSelectionLogic: string;
  lineBalancingImpact: string;
  candidateEvaluations: TargetEvaluationCandidate[];
  recommendedStrategy: string;
  estimatedLeadTimeDelta: string;
  scrappedWafersPrevented: number;
  costSavingsEstimatedUsd: number;
}

export interface ExecutionLogEntry {
  id: string;
  timestamp: string; // ISO string or HH:mm:ss.SSS
  phase: ReroutePhase;
  phaseLabel: string;
  level: RerouteSeverity;
  subsystem: string; // 'SECS/GEM Interlock', 'MES Dynamic Dispatcher', 'AI Fleet Solver', 'AMHS AGV Controller', 'Target Ingestion Node'
  message: string;
  reasoningNote?: string; // Deep AI diagnostic or decision reasoning explanation
  payload?: Record<string, any>; // Technical payload details
}

export interface RerouteStep {
  stepNumber: number;
  phase: ReroutePhase;
  name: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  reasoningSummary?: string;
}

export interface RerouteExecution {
  id: string;
  timestamp: string;
  sourceMachineId: string;
  sourceMachineName: string;
  targetMachineId: string;
  targetMachineName: string;
  processStage: string;
  triggerFaultType: string;
  triggerDescription: string;
  severity: 'HIGH' | 'CRITICAL' | 'EMERGENCY';
  status: ExecutionStatus;
  progressPercent: number;
  currentStepIndex: number;
  steps: RerouteStep[];
  logs: ExecutionLogEntry[];
  reasoning: RerouteReasoning;
  affectedLots: LotInfo[];
  metrics: {
    wafersProtected: number;
    financialLossPreventedUsd: number;
    rebalanceLatencySeconds: number;
    sourceCapacityReleasedPercent: number;
    targetCapacityPostLoadPercent: number;
    oeePreservationFactor: number; // e.g. 98.4%
  };
}

export interface MachineFaultScenario {
  id: string;
  machineId: string;
  machineName: string;
  processStage: string;
  faultTitle: string;
  severity: 'HIGH' | 'CRITICAL' | 'EMERGENCY';
  triggerTelemetry: {
    sensorName: string;
    triggerValue: string;
    baselineValue: string;
    criticalLimit: string;
  };
  suggestedTargetId: string;
  suggestedTargetName: string;
  rootCause: string;
  lotsToReroute: Omit<LotInfo, 'transferStatus'>[];
}
