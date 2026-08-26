export type TabId =
  | 'dashboard'
  | 'vfactory'
  | 'rerouting'
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
    id: 'vfactory',
    label: 'v-Factory',
    code: 'TWIN // V-FACT',
    num: '02',
    description: 'Digital twin simulation, spatial floor mapping, and multi-line visualizer.',
  },
  {
    id: 'rerouting',
    label: 'Rerouting',
    code: 'ROUTE // DYN-FLOW',
    num: '03',
    description: 'Dynamic production rerouting, process line balancing, and automated lot redirection.',
  },
  {
    id: 'machines',
    label: 'Machines',
    code: 'NODE // MACH',
    num: '04',
    description: 'CNC clusters, sensor node telemetry, spindle vibration, and power monitoring.',
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
