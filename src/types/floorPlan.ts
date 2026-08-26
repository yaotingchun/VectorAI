// =========================================================================
// VECTOR.AI - 2D V-FACTORY ARCHITECTURAL FLOOR PLAN TYPES
// High-Fidelity Semiconductor Cleanroom & Backend OSAT Production Line
// =========================================================================

export type FloorAssetType =
  | 'wafer-saw'
  | 'die-attach'
  | 'plasma-cleaner'
  | 'wire-bonding'
  | 'molding-press'
  | 'ball-attach'
  | 'aoi-inspection'
  | 'x-ray-inspection'
  | 'laser-marking'
  | 'test-handler'
  | 'tape-reel'
  | 'robot-arm'
  | 'conveyor'
  | 'agv-station'
  | 'stocker';

export type StructureType =
  | 'wall'
  | 'door'
  | 'column'
  | 'rack'
  | 'workbench'
  | 'shipping-pallet'
  | 'air-shower'
  | 'gowning-bench'
  | 'sticky-mat'
  | 'pass-through';

export type MachineHealthStatus = 'healthy' | 'warning' | 'critical' | 'offline';
export type ProvisioningStatus = 'unprovisioned' | 'scanning' | 'verified' | 'provisioned';
export type SensorType = 'vibration' | 'temperature' | 'acoustic' | 'current' | 'pressure' | 'speed';
export type CleanroomClass = 'ISO 5 (Class 100)' | 'ISO 6 (Class 1,000)' | 'ISO 7 (Class 10,000)' | 'ISO 8 (Class 100,000)' | 'Sub-Fab Utility';

export type ToolMode = 'select' | 'pan' | 'fit' | 'zoom' | 'link' | 'text';

export interface RegisteredSensor {
  id: string; // e.g. "SEN-VIB-01"
  name: string; // e.g. "Spindle Tri-Axial Accelerometer"
  type: SensorType;
  samplingRate: string; // e.g. "20 kHz"
  range: string; // e.g. "±50g"
  status: 'active' | 'syncing' | 'offline';
  currentValue: number;
  unit: string; // e.g. "mm/s", "°C", "A", "kHz"
}

export interface RegisteredSensorKit {
  kitId: string; // e.g. "KIT-VEC-9482-TRI"
  nfcTagSerial: string; // e.g. "NFC-7E4A-9921-00FF"
  kitModel: string; // e.g. "Vector Edge Sentinel Tri-Axial Kit v2"
  description: string;
  provisionDate: string; // ISO or formatted date
  signalStrength: number; // 0 - 100 (%)
  firmwareVersion: string; // e.g. "v2.4.1-rc3"
  telemetryProtocol: 'OPC-UA' | 'MQTT-SN' | 'Modbus-TCP';
  sensors: RegisteredSensor[];
}

export interface FloorMachineAsset {
  id: string; // e.g. "WB-05"
  code: string; // e.g. "WB"
  name: string; // e.g. "Wire Bonding Machine"
  type: FloorAssetType;
  area: string; // e.g. "Bay 3: Wire Bonding (ISO 6)"
  cleanroomClass?: CleanroomClass;
  x: number;
  y: number;
  width: number;
  height: number;
  footprint: string; // e.g. "2.2 m x 1.8 m"
  power: string; // e.g. "3.2 kW"
  utility: string; // e.g. "Compressed Dry Air (CDA), N₂, VAC"
  status: MachineHealthStatus;
  oee: number; // e.g. 92.4
  isConfigured?: boolean; // false for newly placed empty machine instances
  provisioningStatus?: ProvisioningStatus;
  sensorKit?: RegisteredSensorKit | null;
  sensors?: RegisteredSensor[];
  telemetry: {
    temperature: number; // °C
    vibration: number; // mm/s
    healthScore: number; // 0-100
    powerConsumptionKw: number;
    rulHours: number;
    speedRpm?: number;
    pressureKpa?: number;
    cycleTimeSec?: number;
  };
  activeJob?: {
    lotId: string;
    productType: string;
    batchSize: number;
    completedUnits: number;
    progressPercentage: number;
    startedAt: string;
    estimatedCompletion: string;
  };
  connections: {
    input?: string; // e.g. "Die Attach (DA-04)"
    output?: string; // e.g. "Molding Press (MP-02)"
    conveyor?: string; // e.g. "CV-03 (SMEMA 9851)"
    agvAccess: boolean;
    ohtAccess?: boolean;
  };
  customNotes?: string;
}

export interface RoomZone {
  id: string;
  name: string;
  code: string;
  cleanroomClass: CleanroomClass;
  pressurePa: number; // e.g. +30 Pa (cascade positive pressure)
  tempTarget: string; // e.g. "21.5°C ± 0.5"
  humidityTarget: string; // e.g. "45% ± 3% RH"
  x: number;
  y: number;
  width: number;
  height: number;
  headerAlign?: 'center' | 'left';
  highlight?: boolean;
}

export interface OHTRailSegment {
  id: string;
  pathD: string;
  label?: string;
}

export interface OHTCarrier {
  id: string;
  type: 'foup' | 'magazine';
  payload: string; // e.g. "300mm GaN Lot #982"
  progress: number; // 0.0 to 1.0 along path
  speed: number;
  status: 'transporting' | 'loading' | 'unloading' | 'holding';
  source: string;
  destination: string;
}

export interface AGVRoutePath {
  id: string;
  pathD: string;
  label?: string;
}

export interface AGVVehicle {
  id: string;
  name: string;
  batteryLevel: number;
  payload: string;
  x: number;
  y: number;
  targetBay: string;
  status: 'delivering' | 'charging' | 'idle';
}

export interface UtilityPipeline {
  id: string;
  type: 'CDA' | 'N2' | 'Argon' | 'PCW' | 'VAC' | 'EXH';
  color: string;
  label: string;
  pressureOrFlow: string;
  pathD: string;
}

export interface ConveyorSegment {
  id: string;
  points: { x: number; y: number }[];
  pathD?: string;
  direction?: 'horizontal' | 'vertical' | 'complex';
  label?: string;
}

export interface ConveyorJunction {
  id: string;
  x: number;
  y: number;
  size: number;
  direction?: 'right' | 'left' | 'up' | 'down' | 'cross' | 't-junction';
}

export interface StructureAsset {
  id: string;
  type: StructureType;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  rotation?: number;
  rows?: number;
  cols?: number;
}

export interface AssetLibraryItem {
  id: string;
  type: FloorAssetType | StructureType;
  category: 'equipment' | 'structures';
  name: string;
  code: string;
  description: string;
  defaultFootprint: string;
  defaultPower: string;
  defaultUtility: string;
  cleanroomClass?: CleanroomClass;
}

export interface LayerVisibilityState {
  showZones: boolean;
  showOHT: boolean;
  showAGV: boolean;
  showUtilities: boolean;
  showSensors: boolean;
  showHeatmap: boolean;
  showLeadframeFlow: boolean;
}

export interface FloorPlanState {
  searchQuery: string;
  selectedAssetId: string | null;
  hoveredAssetId: string | null;
  activeTool: ToolMode;
  floor: number;
  area: string;
  gridVisible: boolean;
  snapToGrid: boolean;
  gridSize: number; // e.g. 20
  transform: {
    x: number;
    y: number;
    scale: number;
  };
  layers: LayerVisibilityState;
}

export type LayoutPresetId =
  | 'standard'
  | 'high-density-wb'
  | 'smt-molding'
  | 'blank-canvas';

export interface LayoutPreset {
  id: LayoutPresetId;
  name: string;
  category: string;
  description: string;
  machineCount: number;
  zoneCount: number;
  machines: FloorMachineAsset[];
  zones: RoomZone[];
  structures: StructureAsset[];
  junctions: ConveyorJunction[];
  ohtSegments?: OHTRailSegment[];
  utilityPipelines?: UtilityPipeline[];
}
