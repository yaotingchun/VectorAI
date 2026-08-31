export type AgentId =
  | 'product'
  | 'monitoring'
  | 'prediction'
  | 'maintenance'
  | 'rerouting'
  | 'orchestrator';

export type AgentStatus = 'waiting' | 'analyzing' | 'completed' | 'deciding';

export type SimulationStatus = 'idle' | 'running' | 'completed';

export interface AgentMetric {
  label: string;
  value: string;
  badge?: string;
  alert?: boolean;
}

export interface AgentDefinition {
  id: AgentId;
  name: string;
  code: string;
  role: string;
  responsibilities: string[];
  iconName: string;
  color: string;
}

export interface SimulationStep {
  agentId: AgentId;
  delayMs: number; // relative to simulation start
  sequenceNum: number;
  status: AgentStatus;
  message: string;
  metrics?: AgentMetric[];
  findingsSummary?: string;
}

export interface OrchestratorDecisionData {
  title: string;
  statusText: string;
  isApproved: boolean;
  synthesis: string;
  actionItems: string[];
  keyDetails: {
    product: string;
    source: string;
    alternative: string;
    reroutedCapacity: string;
    duration: string;
    reason: string;
  };
  confidence: number;
}

export interface ScenarioDefinition {
  id: string;
  title: string;
  code: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  triggerEvent: string;
  steps: SimulationStep[];
  orchestratorDecision: OrchestratorDecisionData;
  flowState: {
    product: string;
    primaryMachine: string;
    alternativeMachine: string;
    primaryLoadBefore: number;
    primaryLoadAfter: number;
    altLoadBefore: number;
    altLoadAfter: number;
    rerouteCapacity: string;
    duration: string;
  };
}

export interface FactoryMachineState {
  id: string;
  name: string;
  type: string;
  utilization: number;
  health: number;
  rulHours: number;
  compatibleProducts: string[];
  maintenanceInHours: number | null;
  status: 'optimal' | 'warning' | 'critical' | 'near_capacity';
  statusNote?: string;
}

export interface FactoryProductState {
  id: string;
  name: string;
  code: string;
  normalDemandPerHour: number;
  currentDemandPerHour: number;
  primaryMachine: string;
  alternativeMachine: string;
  compatibleMachines: string[];
}

export interface DecisionHistoryItem {
  id: string;
  date: string;
  time: string;
  scenarioTitle: string;
  outcome: string;
  isApproved: boolean;
  sourceMachine: string;
  targetMachine: string;
  product: string;
  capacityRerouted: string;
  duration: string;
  orchestratorConfidence: number;
}
