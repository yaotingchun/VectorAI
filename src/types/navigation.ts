export type TabId =
  | 'dashboard'
  | 'monitoring'
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
    description: 'Executive factory overview, health distribution, prediction and maintenance summaries.',
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    code: 'CMD // FLOOR',
    num: '02',
    description: 'Factory floor command center, interactive machine map, real-time telemetry, and anomaly queue.',
  },
  {
    id: 'vfactory',
    label: 'v-Factory',
    code: 'TWIN // V-FACT',
    num: '03',
    description: 'Digital twin simulation, spatial floor mapping, and multi-line visualizer.',
  },
  {
    id: 'machines',
    label: 'Machines',
    code: 'NODE // MACH',
    num: '04',
    description: 'Machine cluster telemetry, spindle vibration, and sensor nodes.',
  },
  {
    id: 'prediction',
    label: 'Prediction',
    code: 'AI // PRED',
    num: '05',
    description: 'Neural anomaly detection, predictive failure models, and remaining useful life (RUL).',
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    code: 'MNTN // SRVC',
    num: '06',
    description: 'Work order automation, scheduled service matrix, and parts replacement registry.',
  },
  {
    id: 'configuration',
    label: 'Configuration',
    code: 'CONF // SYST',
    num: '07',
    description: 'Edge node protocols (MQTT / OPC-UA), security tokens, and system calibration.',
  },
];
