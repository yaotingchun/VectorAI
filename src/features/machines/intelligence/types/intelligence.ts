// =========================================================================
// VECTOR.AI — MACHINE INTELLIGENCE TYPES
// Single-Source Typed Contracts for Deterministic RUL, Thresholds, & Diagnostics
// =========================================================================

import { MachineTypeId } from '../../data/machineTypes';

export type ThresholdDirection = 'HIGHER_IS_WORSE' | 'LOWER_IS_WORSE';

export type AnomalySeverity = 'low' | 'medium' | 'high' | 'critical';

export type ThresholdType = 'NORMAL' | 'WARNING_HIGH' | 'WARNING_LOW' | 'CRITICAL_HIGH' | 'CRITICAL_LOW';

export type DiagnosticSource = 'MANUAL' | 'RAG';

export type DiagnosticConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export type ModelReliability = 'HIGH' | 'MEDIUM' | 'LOW';

// -------------------------------------------------------------------------
// 1. SENSOR THRESHOLD DEFINITIONS
// -------------------------------------------------------------------------

export interface SensorThresholdBounds {
  min: number;
  max: number;
  description?: string;
}

export interface MachineSensorThreshold {
  sensorId: string;
  sensorName: string;
  unit: string;
  normal: SensorThresholdBounds;
  warning: SensorThresholdBounds;
  critical: SensorThresholdBounds;
  direction: ThresholdDirection;
}

// -------------------------------------------------------------------------
// 2. ANOMALY DETECTION CONTRACT
// -------------------------------------------------------------------------

export interface AnomalyRecord {
  id: string;
  machineId: string;
  sensorId: string;
  sensorName: string;
  currentValue: number;
  unit: string;
  thresholdValue: number;
  thresholdType: ThresholdType;
  severity: AnomalySeverity;
  status: 'active' | 'acknowledged' | 'resolved';
  detectedAt: string;
  description: string;
}

// -------------------------------------------------------------------------
// 3. DETERMINISTIC RUL MODEL CONTRACTS (NO MACHINE LEARNING)
// -------------------------------------------------------------------------

export interface RulModelParameter {
  parameter: string;
  sensorId: string;
  sensorName: string;
  unit: string;
  weight: number; // Sum of weights must equal 1.00
  healthyLimit: number;
  criticalLimit: number;
  direction: ThresholdDirection;
}

export interface RulModelDefinition {
  id: string;
  machineType: MachineTypeId;
  modelName: string;
  formulaType: 'DETERMINISTIC_LINEAR_DEGRADATION';
  baseUsefulLifeHours: number;
  baseLifeUnit: 'hours';
  version: string;
  weightsSum: number; // 1.00
  parameters: RulModelParameter[];
  formulaDescription: string;
  source: 'Machine Manual & VectorAI Derived Degradation Model';
}

export interface ParameterContribution {
  parameter: string;
  sensorId: string;
  sensorName: string;
  unit: string;
  currentValue: number;
  healthyLimit: number;
  criticalLimit: number;
  direction: ThresholdDirection;
  individualDegradation: number; // 0.0 (healthy) to 1.0 (critical)
  weight: number;                // e.g. 0.30
  weightedContribution: number;  // individualDegradation * weight
  percentageOfTotalWear: number; // percentage share of degradation
  status: 'normal' | 'warning' | 'critical';
}

export interface RulCalculationResult {
  machineId: string;
  machineType: MachineTypeId;
  rulHours: number;
  estimatedDays: number;
  degradationScore: number;      // 0.0 to 1.0 (e.g. 0.35 = 35% degraded)
  remainingLifeRatio: number;    // 1.0 - degradationScore
  baseUsefulLifeHours: number;
  modelVersion: string;
  formula: string;
  parameters: ParameterContribution[];
  reliability: {
    status: ModelReliability;
    sensorCompletenessRatio: number; // 1.0 = 100%
    availableParametersCount: number;
    requiredParametersCount: number;
    validationPassed: boolean;
    reason: string;
  };
  calculatedAt: string;
  isExplainable: true;
}

// -------------------------------------------------------------------------
// 4. DIAGNOSTIC CONTRACTS (MANUAL-FIRST + RAG FALLBACK)
// -------------------------------------------------------------------------

export interface FailureScenario {
  scenarioId: string;
  symptom: string;
  sensorPattern: string;
  possibleCauses: string[];
  severity: AnomalySeverity;
  recommendedAction: string;
  verificationSteps?: string[];
}

export interface TroubleshootingSymptom {
  symptomId: string;
  symptom: string;
  severity: string;
  relatedSensors: string[];
  possibleCauses: string[];
  recommendedAction: string;
}

export interface DiagnosticResult {
  anomalyId: string;
  machineId: string;
  sensorId: string;
  diagnosis: string;
  source: DiagnosticSource; // 'MANUAL' | 'RAG'
  confidence: DiagnosticConfidence; // 'HIGH' | 'MEDIUM' | 'LOW'
  confidenceScore: number; // 0.0 to 1.0
  evidence: string[];
  possibleCauses: string[];
  recommendedActions: string[];
  matchedScenarioId?: string;
  sourceDocument?: {
    manualId: string;
    title: string;
    section: string;
    url?: string;
  };
  disclaimer?: string;
  diagnosedAt: string;
}

// -------------------------------------------------------------------------
// 5. STRUCTURED MACHINE KNOWLEDGE CONTAINER
// -------------------------------------------------------------------------

export interface StructuredMachineKnowledge {
  filename: string;
  machine: {
    name: string;
    type: MachineTypeId;
    prototypeMachineId: string;
    manualId: string;
    version: string;
    generatedDate: string;
    documentStatus: string;
    purpose: string;
    disclaimer: string;
    processStage: string;
    description: string;
    manufacturingProcess: string;
    subsystems: string[];
  };
  components: {
    name: string;
    function: string;
    importantParameters: string;
    degradationIndicators: string;
  }[];
  sensors: {
    sensorId: string;
    name: string;
    unit: string;
    purpose: string;
    minScale: number;
    maxScale: number;
    normalRange: [number, number];
    warningRange: [number, number];
    criticalRange: [number, number];
    direction: ThresholdDirection;
  }[];
  thresholds: MachineSensorThreshold[];
  operatingConditions: {
    ambientTemperature: string;
    relativeHumidity: string;
    normalOperatingTemperature: string;
    normalOperatingPressure: string;
    normalOperatingSpeed: string;
    normalCycleTime: string;
    normalOperatingHours: string;
    recommendedOperatingConditions: string;
    maximumContinuousOperation: string;
  };
  maintenance: {
    component: string;
    recommendedMaintenanceIntervalHours: number;
    expectedServiceLifeHours: number;
    maintenanceAction: string;
    procedureSummary: string;
  }[];
  degradationIndicators: {
    parameter: string;
    normalCondition?: string;
    degradedCondition?: string;
    criticalCondition?: string;
    indicatorMechanism?: string;
    physicalPhenomenon?: string;
    measurableEffect?: string;
    degradationSignificance?: string;
    primarySensorId?: string;
  }[];
  rulModel: {
    baseUsefulLifeHours: number;
    formulaDescription: string;
    weightsSum: number;
    parameters: RulModelParameter[];
  };
  symptoms: TroubleshootingSymptom[];
  failureScenarios: FailureScenario[];
}

// -------------------------------------------------------------------------
// 6. UNIFIED MACHINE AGENT ANALYSIS STATE
// -------------------------------------------------------------------------

export interface MachineAgentAnalysis {
  machineId: string;
  machineType: MachineTypeId;
  machineName: string;
  status: 'healthy' | 'warning' | 'critical' | 'offline' | 'maintenance';
  healthScore: number;
  activeAnomaliesCount: number;
  anomalies: AnomalyRecord[];
  rul: RulCalculationResult;
  diagnoses: DiagnosticResult[];
  knowledgeBase: {
    manualId: string;
    title: string;
    pdfUrl: string;
    isIndexedForRag: boolean;
    scenariosCount: number;
  };
  recommendations: string[];
  analyzedAt: string;
}

// -------------------------------------------------------------------------
// 7. GLOBAL RAG & KNOWLEDGE LAYER CONTRACTS
// -------------------------------------------------------------------------

export type KnowledgeType = 'MACHINE' | 'SYSTEM' | 'WEBSITE' | 'TECHNICAL';

export interface GlobalKnowledgeSection {
  sectionId: string;
  sectionName: string;
  title: string;
  content: string;
  tags: string[];
}

export interface GlobalKnowledgeDocument {
  documentId: string;
  knowledgeType: KnowledgeType;
  sourceName: string;
  category: string;
  version: string;
  lastUpdated: string;
  title: string;
  description: string;
  sections: GlobalKnowledgeSection[];
}

export interface RagChunk {
  chunkId: string;
  knowledgeType: KnowledgeType;
  machineType?: MachineTypeId;
  manualId?: string;
  documentId?: string;
  sourceName: string;
  section: string;
  title: string;
  content: string;
  tags: string[];
  embedding?: number[];
}

export interface RagSearchFilter {
  knowledgeType?: KnowledgeType | KnowledgeType[];
  machineType?: MachineTypeId;
  documentId?: string;
  sourceName?: string;
  section?: string;
  maxResults?: number;
  minScore?: number;
}

export interface RagRetrievalResult {
  chunk: RagChunk;
  similarityScore: number; // 0.0 to 1.0
}

