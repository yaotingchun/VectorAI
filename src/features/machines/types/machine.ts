import { MachineTypeId } from '../data/machineTypes';

export type MachineStatus = 
  | 'healthy'
  | 'warning'
  | 'critical'
  | 'offline'
  | 'maintenance';

export interface MachineLocation {
  facility: string;
  floor: string;
  area: string;
  line: string;
  station: string;
  gridCoordinate?: { x: number; y: number };
}

export interface SensorReading {
  sensorId: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: string;
  history?: { timestamp: string; value: number }[];
}

export interface MachineRUL {
  value: number; // in hours
  unit: 'hours' | 'days';
  confidence: number; // 0 to 1
  estimatedDays: number;
  criticalThresholdHours: number;
  degradationStage: 'Normal' | 'Early Drift' | 'Accelerated Wear' | 'Imminent Failure';
}

export interface AnomalyEvent {
  id: string;
  timestamp: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  sensor: string;
  confidence: number; // 0 to 1
  status: 'active' | 'acknowledged' | 'resolved';
  recommendedAction?: string;
}

export interface MaintenanceRecord {
  lastMaintenanceDate: string;
  nextScheduledDate: string;
  status: 'completed' | 'scheduled' | 'overdue' | 'in_progress';
  type: 'Preventive Inspection' | 'Tool Calibration' | 'Sensor Replacement' | 'Spindle Rebuild' | 'Deep Clean';
  technician: string;
  workOrderId?: string;
  notes?: string;
  checklistCount?: { completed: number; total: number };
}

export interface MachineDocument {
  id: string;
  title: string;
  type: 'PDF' | 'DOC' | 'CAD' | 'SOP';
  category: 'Manual' | 'Troubleshooting' | 'SOP' | 'Datasheet' | 'Schematic';
  updatedAt: string;
  size: string;
  url?: string;
  tags: string[];
}

export interface HealthDataPoint {
  timestamp: string;
  health: number; // 0 to 100
}

export interface Machine {
  id: string;
  name: string;
  machineType: MachineTypeId;
  processStage: string;
  location: MachineLocation;
  status: MachineStatus;
  healthScore: number; // 0 to 100
  rul: MachineRUL;
  operatingHours: number;
  installationDate: string;
  firmwareVersion: string;
  ipAddress: string;
  sensors: SensorReading[];
  anomalies: AnomalyEvent[];
  maintenance: MaintenanceRecord;
  documents: MachineDocument[];
  knowledgeBaseRef?: string;
  manualId?: string;
  healthTrend?: {
    '24h': HealthDataPoint[];
    '7d': HealthDataPoint[];
    '30d': HealthDataPoint[];
  };
  lastTelemetryTimestamp: string;
}
