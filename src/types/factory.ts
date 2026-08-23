export type MachineCategory =
  | 'dicing'
  | 'die_attach'
  | 'wire_bond'
  | 'molding'
  | 'ate_sort';

export type MachineStatus =
  | 'HEALTHY'
  | 'WARNING'
  | 'CRITICAL'
  | 'OFFLINE'
  | 'MAINT';

export interface SensorReading {
  name: string;
  label: string;
  value: number;
  unit: string;
  baseline: number;
  threshold: number;
  deviation: number; // percentage deviation (0 to 100+)
}

export interface MaintenanceHistoryLog {
  id: string;
  timestamp: string;
  type: string; // 'Calibration' | 'Part Replacement' | 'Full Service'
  description: string;
  technician: string;
}

export interface Machine {
  id: string;
  name: string;
  category: MachineCategory;
  stage: string;
  location: string;
  healthScore: number; // 0 to 100
  status: MachineStatus;
  sensors: SensorReading[];
  timeSinceBaseline: number; // operating hours
  degradationRate: number; // deviation increase rate per hour (e.g. 0.05 to 0.8)
  currentRul: number; // predicted hours
  alerts: string[];
  maintenanceHistory: MaintenanceHistoryLog[];
  isSimulatingWear: boolean;
}

export interface ModelWeights {
  intercept: number;      // θ_intercept (max RUL, e.g. 2000 hours)
  devWeight: number;      // θ_dev (weight for max deviation, e.g. 15.0)
  rateWeight: number;     // θ_rate (weight for degradation rate, e.g. 400.0)
  timeWeight: number;     // θ_time (weight for operating hours, e.g. 1.2)
}

export interface MaintenanceTask {
  id: string;
  machineId: string;
  machineName: string;
  machineCategory: MachineCategory;
  scheduledTime: string; // ISO String or relative info
  predictedFailureTime: string; // ISO String or relative info
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
  technician: string;
  estimatedDuration: number; // hours
  partsRequired: string[];
}

export interface SystemEvent {
  id: string;
  timestamp: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SYSTEM' | 'REROUTE' | 'MAINTENANCE';
  message: string;
  machineId?: string;
}
