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
  | 'tape-reel'
  | 'conveyor'
  | 'agv'
  | 'buffer-queue';

export type MachineCategory = 'backend' | 'transport';

export type MachineStatus = 'running' | 'idle' | 'warning' | 'error' | 'maintenance';

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
  id: string; // e.g. "WS-2000" or "M-01"
  code: string; // secondary code e.g. "WS-2000"
  type: MachineType;
  name: string; // e.g. "Wafer Saw"
  category: MachineCategory;
  stage: string; // e.g. "Stage 01: Wafer Prep"
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
