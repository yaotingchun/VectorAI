export type TabId =
  | 'dashboard'
  | 'aicontrol'
  | 'vfactory'
  | 'products'
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
    id: 'aicontrol',
    label: 'Command Center',
    code: 'AI // ORCH',
    num: '02',
    description: 'Multi-agent factory intelligence, autonomous collaboration, and operational rerouting.',
    badge: 'LIVE',
  },
  {
    id: 'vfactory',
    label: 'v-Factory',
    code: 'TWIN // V-FACT',
    num: '03',
    description: 'Digital twin simulation, spatial floor mapping, and multi-line visualizer.',
  },
  {
    id: 'products',
    label: 'Products',
    code: 'PROD // CATALOG',
    num: '04',
    description: 'Product catalog, batch genealogy, recipe tracking, and production yield management.',
  },
  {
    id: 'machines',
    label: 'Machines',
    code: 'NODE // MACH',
    num: '05',
    description: 'CNC clusters, sensor node telemetry, spindle vibration, and power monitoring.',
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
