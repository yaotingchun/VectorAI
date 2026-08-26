// =========================================================================
// VECTOR.AI - 2D V-FACTORY ARCHITECTURAL FLOOR PLAN TYPES
// =========================================================================

export type FloorAssetType =
  | 'die-attach'
  | 'wire-bonding'
  | 'molding-press'
  | 'aoi-inspection'
  | 'x-ray-inspection'
  | 'laser-marking'
  | 'tape-reel'
  | 'test-handler'
  | 'robot-arm'
  | 'conveyor'
  | 'agv-station'
  | 'plasma-cleaner';

export type StructureType =
  | 'wall'
  | 'door'
  | 'column'
  | 'rack'
  | 'workbench'
  | 'shipping-pallet';

export type MachineHealthStatus = 'healthy' | 'warning' | 'critical' | 'offline';
export type ProvisioningStatus = 'unprovisioned' | 'scanning' | 'verified' | 'provisioned';
export type SensorType = 'vibration' | 'temperature' | 'acoustic' | 'current' | 'pressure' | 'speed';

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
  area: string; // e.g. "Wire Bonding"
  x: number;
  y: number;
  width: number;
  height: number;
  footprint: string; // e.g. "2.2 m x 1.8 m"
  power: string; // e.g. "3.2 kW"
  utility: string; // e.g. "Compressed Air, N₂"
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
  };
  connections: {
    input?: string; // e.g. "Die Attach (DA-08)"
    output?: string; // e.g. "Molding Press (MP-03)"
    conveyor?: string; // e.g. "CV-07"
    agvAccess: boolean;
  };
  customNotes?: string;
}

export interface RoomZone {
  id: string;
  name: string;
  code: string;
  x: number;
  y: number;
  width: number;
  height: number;
  headerAlign?: 'center' | 'left';
  highlight?: boolean;
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
  direction?: 'right' | 'down' | 'cross' | 't-junction';
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
}

