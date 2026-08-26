// =========================================================================
// VECTOR.AI - FACTORY TYPES DEFINITIONS
// Unified definitions for Factory Management, Predictive RUL & 2D V-Factory
// =========================================================================

// --- Main Factory & Predictive RUL Types ---

export type MachineCategory =
  | 'dicing'
  | 'die_attach'
  | 'wire_bond'
  | 'molding'
  | 'ate_sort'
  | 'backend'
  | 'transport';

export type MachineStatus =
  | 'HEALTHY'
  | 'WARNING'
  | 'CRITICAL'
  | 'OFFLINE'
  | 'MAINT'
  | 'running'
  | 'idle'
  | 'warning'
  | 'error'
  | 'maintenance';

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

export type CommunicationChannelType = 'EMAIL' | 'WHATSAPP' | 'WEBSITE';

export interface CommunicationChannel {
  type: CommunicationChannelType;
  address: string;
  label: string;
}

export interface NotificationLog {
  channel: CommunicationChannelType;
  channelAddress: string;    // email address, phone number, or URL
  sentAt: string;            // ISO timestamp
  recipient: string;         // tech name or target
  subject: string;
  body: string;
  delivered: boolean;
}

export interface ProgressStep {
  label: string;
  status: 'DONE' | 'ACTIVE' | 'PENDING';
  completedAt?: string;      // ISO timestamp when done
}

export interface DiagnosisReport {
  generatedAt: string;       // ISO timestamp
  faultSummary: string;
  sensorReadings: { sensor: string; value: string; status: 'OK' | 'WARNING' | 'CRITICAL' }[];
  recommendedActions: string[];
  estimatedRootCause: string;
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
  communicationChannel: CommunicationChannel;
  estimatedDuration: number; // hours
  partsRequired: string[];
  // Auto-dispatch notification log (only in saved communication channel)
  notificationLog: NotificationLog[];
  // Diagnosis PDF data
  diagnosisReport: DiagnosisReport;
  // Progress tracking steps
  progressSteps: ProgressStep[];
  progressPercent: number; // 0-100
}

export interface SystemEvent {
  id: string;
  timestamp: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SYSTEM' | 'REROUTE' | 'MAINTENANCE';
  message: string;
  machineId?: string;
}

// --- 2D V-Factory Digital Twin Schematic Types ---

export type MachineType =
  | 'wafer-saw'
  | 'die-attach'
  | 'wire-bonding'
  | 'molding-press'
  | 'ball-attach'
  | 'plasma-cleaner'
  | 'aoi-inspection'
  | 'x-ray-inspection'
  | 'laser-marking'
  | 'test-handler'
  | 'tape-reel'
  | 'stocker'
  | 'conveyor'
  | 'agv'
  | 'buffer-queue';

export interface TelemetryMetric {
  label: string;
  value: string | number;
  unit: string;
  status?: 'normal' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
}

export interface ActiveJob {
  lotId: string;
  productType: string;
  batchSize: number;
  completedUnits: number;
  progressPercentage: number;
  startedAt: string;
  estimatedCompletion: string;
}

export interface MachineData {
  id: string; // e.g. "WS-2001" or "M-01"
  code: string; // secondary code e.g. "SAW-01"
  type: MachineType;
  name: string; // e.g. "Wafer Saw 01"
  category: MachineCategory;
  stage: string; // e.g. "Stage 01: Wafer Dicing"
  status: MachineStatus;
  statusMessage: string;
  efficiency: number; // e.g. 0.95 (95%)
  
  // Canvas coordinate positioning
  x: number;
  y: number;
  width: number;
  height: number;

  // Live Telemetry
  telemetry: {
    oee: number;
    temperature: number; // °C
    vibration: number; // mm/s
    speedRpm?: number;
    pressureKpa?: number;
    powerConsumptionKw: number;
    cycleTimeSec: number;
    healthScore: number;
  };

  // Job & Production info
  activeJob?: ActiveJob;
  
  // Maintenance & Service
  maintenance: {
    lastServiced: string;
    nextServiceDue: string;
    operatingHours: number;
    mtbfHours: number;
  };

  // Upstream / Downstream connection node IDs
  connectionsTo?: string[];
  connectionType?: 'conveyor' | 'agv-path' | 'buffer-link';
}

export interface FactoryZone {
  id: string;
  name: string;
  code: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface CanvasTransform {
  x: number;
  y: number;
  scale: number;
}
