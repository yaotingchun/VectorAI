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

export type ToolMode = 'select' | 'pan' | 'fit' | 'zoom' | 'link' | 'text';

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

