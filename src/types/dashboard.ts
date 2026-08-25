import { TabId } from './navigation';

export type MachineStatus = 'healthy' | 'warning' | 'critical' | 'offline';

export type MachineType = 
  | 'Wafer Dicing Machine'
  | 'Die Attacher'
  | 'Wire Bonder'
  | 'Molding Machine'
  | 'IC Tester & Sorter';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface MachineTelemetry {
  vibration: number;       // mm/s
  vibrationThreshold: number;
  temperature: number;     // °C
  tempThreshold: number;
  powerDraw: number;       // kW
  cycleTime: number;       // sec/unit
  oee: number;             // %
}

export interface MachineIssue {
  id: string;
  title: string;
  description: string;
  detectedAt: string;
  severity: MachineStatus;
  component: string;
}

export interface MachineNode {
  id: string;
  code: string;
  name: string;
  type: MachineType;
  typeShort: 'WD' | 'DA' | 'WB' | 'MD' | 'TS';
  bay: 'Bay A' | 'Bay B' | 'Bay C' | 'Bay D';
  line: string;
  position: { x: number; y: number }; // Relative coordinates on the floor map grid
  status: MachineStatus;
  healthScore: number;       // 0 - 100
  rulHours: number;          // Remaining Useful Life in operating hours
  riskLevel: RiskLevel;
  primaryIssue?: MachineIssue;
  recommendedAction?: string;
  actionUrgencyHours?: number;
  telemetry: MachineTelemetry;
  lastServiceDate: string;
  productionImpact: string;
}

export interface AlertItem {
  id: string;
  machineId: string;
  machineName: string;
  machineType: MachineType;
  bay: string;
  line: string;
  healthScore: number;
  rulHours: number;
  severity: 'critical' | 'warning';
  riskLevel: RiskLevel;
  issue: string;
  component: string;
  detectedTime: string;
  productionImpact: string;
  recommendedAction: string;
  actionUrgency: string;
}

export interface ProductionLineStatus {
  lineId: string;
  lineName: string;
  bay: string;
  targetUph: number;
  currentUph: number;
  efficiency: number; // %
  yieldRate: number;  // %
  status: 'optimal' | 'at-risk' | 'degraded';
  riskFactor?: string;
}

export interface ProductionStatusData {
  currentThroughput: number;   // UPH
  targetThroughput: number;    // UPH
  yieldPercentage: number;     // %
  targetYieldPercentage: number; // %
  activeLinesCount: number;
  totalLinesCount: number;
  linesAtRiskCount: number;
  throughputAtRiskPercentage: number;
  lines: ProductionLineStatus[];
}

export interface TrendDataPoint {
  timestamp: string;
  label: string;
  factoryHealth: number;
  healthyCount: number;
  warningCount: number;
  criticalCount: number;
}

export type TrendTimeRange = '24H' | '7D' | '30D';

export interface MaintenanceTask {
  id: string;
  machineId: string;
  machineType: MachineType;
  location: string;
  taskTitle: string;
  category: 'Predictive Service' | 'Component Replacement' | 'Calibration' | 'Overhaul';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  dueDate: string;
  estimatedDuration: string;
  assignedTechnician?: string;
  status: 'due_today' | 'due_week' | 'overdue' | 'in_progress' | 'completed';
}

export interface MaintenanceSummary {
  dueToday: number;
  dueThisWeek: number;
  overdue: number;
  inProgress: number;
  recentlyCompleted: number;
  priorityTasks: MaintenanceTask[];
}

export interface FactoryOverviewKpiData {
  factoryHealthScore: number;
  healthScoreDelta: number; // e.g. +1.4% vs previous period
  totalMachines: number;
  healthyMachines: number;
  warningMachines: number;
  criticalMachines: number;
  offlineMachines: number;
  criticalRiskCount: number;
  minRulHours: number;
  minRulMachineId: string;
  minRulMachineType: MachineType;
  productionRiskLevel: RiskLevel;
  productionRiskDescription: string;
  capacityAtRiskPercentage: number;
}

export interface DashboardData {
  overview: FactoryOverviewKpiData;
  machines: MachineNode[];
  production: ProductionStatusData;
  alerts: AlertItem[];
  healthTrends: Record<TrendTimeRange, TrendDataPoint[]>;
  maintenance: MaintenanceSummary;
}

export interface DashboardProps {
  onNavigate?: (tab: TabId, machineId?: string) => void;
}
