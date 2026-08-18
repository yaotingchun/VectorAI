export type TabId = 
  | 'dashboard'
  | 'vfactory'
  | 'machines'
  | 'prediction'
  | 'maintenance'
  | 'configuration';

export interface NavItem {
  id: TabId;
  label: string;
  code: string;
  num: string;
  description: string;
  badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    code: 'SYS // DASH',
    num: '01',
    description: 'Central operations telemetry, real-time metrics, and factory health overview.',
  },
  {
    id: 'vfactory',
    label: 'v-Factory',
    code: 'TWIN // V-FACT',
    num: '02',
    description: 'Digital twin simulation, spatial floor mapping, and multi-line visualizer.',
  },
  {
    id: 'machines',
    label: 'Machines',
    code: 'NODE // MACH',
    num: '03',
    description: 'CNC clusters, sensor node telemetry, spindle vibration, and power monitoring.',
  },
  {
    id: 'prediction',
    label: 'Prediction',
    code: 'AI // PRED',
    num: '04',
    description: 'Neural anomaly detection, predictive failure models, and remaining useful life (RUL).',
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    code: 'MNTN // SRVC',
    num: '05',
    description: 'Work order automation, scheduled service matrix, and parts replacement registry.',
  },
  {
    id: 'configuration',
    label: 'Configuration',
    code: 'CONF // SYST',
    num: '06',
    description: 'Edge node protocols (MQTT / OPC-UA), security tokens, and system calibration.',
  },
];
