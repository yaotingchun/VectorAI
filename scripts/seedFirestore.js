import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const credentialsPath = join(__dirname, '..', 'credentials', 'firebase.json');

if (!existsSync(credentialsPath)) {
  console.error(`Error: Firebase credentials not found at ${credentialsPath}`);
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(credentialsPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
  projectId: serviceAccount.project_id || 'vectorai-506214'
});

const db = getFirestore();

console.log(`[Seeder] Connecting to Firestore project: ${serviceAccount.project_id}...`);

const SEED_MACHINES = [
  // WB-024 (Wire Bonder - Warning Demo Unit)
  {
    id: 'WB-024',
    name: 'Wire Bonder 24',
    machineType: 'wire_bonder',
    processStage: 'Assembly',
    location: {
      facility: 'Fab 2 OSAT Hub',
      floor: 'Level 2 - Cleanroom ISO 5',
      area: 'Assembly Line A',
      line: 'Line A',
      station: 'Station 04',
      gridCoordinate: { x: 12, y: 8 }
    },
    status: 'warning',
    healthScore: 72,
    rul: {
      value: 186,
      unit: 'hours',
      confidence: 0.91,
      estimatedDays: 7.8,
      criticalThresholdHours: 48,
      degradationStage: 'Accelerated Wear'
    },
    operatingHours: 8426,
    installationDate: '2024-03-15',
    firmwareVersion: 'v4.12.8-RT',
    ipAddress: '10.24.112.24',
    lastTelemetryTimestamp: '2026-08-22T12:50:00Z',
    sensors: [
      {
        sensorId: 'vibration_ultrasonic',
        name: 'Ultrasonic Vibration',
        value: 0.88,
        unit: 'mm/s',
        status: 'warning',
        lastUpdated: '10s ago',
        history: [
          { timestamp: '12:00', value: 0.52 },
          { timestamp: '12:10', value: 0.61 },
          { timestamp: '12:20', value: 0.73 },
          { timestamp: '12:30', value: 0.79 },
          { timestamp: '12:40', value: 0.84 },
          { timestamp: '12:50', value: 0.88 }
        ]
      },
      {
        sensorId: 'load_clamp',
        name: 'Clamp Clamping Force',
        value: 84.0,
        unit: 'N',
        status: 'warning',
        lastUpdated: '10s ago',
        history: [
          { timestamp: '12:00', value: 68.0 },
          { timestamp: '12:10', value: 72.5 },
          { timestamp: '12:20', value: 77.0 },
          { timestamp: '12:30', value: 81.2 },
          { timestamp: '12:40', value: 83.5 },
          { timestamp: '12:50', value: 84.0 }
        ]
      },
      {
        sensorId: 'temperature_transducer',
        name: 'Transducer Temp',
        value: 48.1,
        unit: '°C',
        status: 'normal',
        lastUpdated: '10s ago',
        history: [
          { timestamp: '12:00', value: 46.2 },
          { timestamp: '12:10', value: 46.8 },
          { timestamp: '12:20', value: 47.4 },
          { timestamp: '12:30', value: 47.9 },
          { timestamp: '12:40', value: 48.0 },
          { timestamp: '12:50', value: 48.1 }
        ]
      }
    ],
    anomalies: [
      {
        id: 'ANO-WB24-001',
        timestamp: '2026-08-22 11:42',
        type: 'Ultrasonic Harmonics Drift',
        severity: 'medium',
        description: 'Ultrasonic vibration trend increasing beyond 0.85 mm/s. Horn resonance damping indicated.',
        sensor: 'Ultrasonic Vibration',
        confidence: 0.91,
        status: 'active',
        recommendedAction: 'Inspect piezo-electric transducer horn for micro-fissures or recalibrate bond force.'
      },
      {
        id: 'ANO-WB24-002',
        timestamp: '2026-08-21 14:32',
        type: 'Clamp Load Elevation',
        severity: 'medium',
        description: 'Leadframe clamping force sustained at 84N (+18% above nominal mean).',
        sensor: 'Clamp Clamping Force',
        confidence: 0.84,
        status: 'acknowledged',
        recommendedAction: 'Check pneumatic pressure regulator on station clamp cylinder.'
      },
      {
        id: 'ANO-WB24-003',
        timestamp: '2026-08-18 08:15',
        type: 'Minor Frequency Shift',
        severity: 'low',
        description: 'Transient 138kHz resonance frequency flutter during high-density BGA wire cycle.',
        sensor: 'Ultrasonic Vibration',
        confidence: 0.76,
        status: 'resolved',
        recommendedAction: 'Clean capillary tip with ultrasonic bath.'
      }
    ],
    maintenance: {
      lastMaintenanceDate: '2026-08-12',
      nextScheduledDate: '2026-08-28',
      status: 'scheduled',
      type: 'Preventive Inspection',
      technician: 'Marcus Vance (ID: TECH-48)',
      workOrderId: 'WO-2026-8841',
      notes: 'Scheduled for 8,500-hour bond head overhaul and piezo stack impedance tuning.',
      checklistCount: { completed: 8, total: 12 }
    },
    documents: [
      {
        id: 'DOC-WB24-01',
        title: 'Wire Bonder 24 Maintenance & Calibration Manual',
        type: 'PDF',
        category: 'Manual',
        updatedAt: '2026-08-10',
        size: '14.2 MB',
        tags: ['Maintenance', 'Transducer', 'Capillary']
      },
      {
        id: 'DOC-WB24-02',
        title: 'Wire Bonding Ultrasonic Resonance Troubleshooting Guide',
        type: 'PDF',
        category: 'Troubleshooting',
        updatedAt: '2026-08-03',
        size: '6.8 MB',
        tags: ['Diagnostics', 'Vibration', 'Rerouting']
      },
      {
        id: 'DOC-WB24-03',
        title: 'Transducer Stack Inspection & Alignment SOP (REV 4.2)',
        type: 'SOP',
        category: 'SOP',
        updatedAt: '2026-07-28',
        size: '3.1 MB',
        tags: ['SOP', 'Standard Procedure', 'Cleanroom']
      }
    ],
    healthTrend: {
      '24h': [
        { timestamp: '12h ago', health: 88 },
        { timestamp: '10h ago', health: 85 },
        { timestamp: '8h ago', health: 82 },
        { timestamp: '6h ago', health: 79 },
        { timestamp: '4h ago', health: 75 },
        { timestamp: '2h ago', health: 73 },
        { timestamp: 'Now', health: 72 }
      ],
      '7d': [
        { timestamp: 'Day 1', health: 94 },
        { timestamp: 'Day 2', health: 92 },
        { timestamp: 'Day 3', health: 89 },
        { timestamp: 'Day 4', health: 85 },
        { timestamp: 'Day 5', health: 80 },
        { timestamp: 'Day 6', health: 75 },
        { timestamp: 'Day 7', health: 72 }
      ],
      '30d': [
        { timestamp: 'Wk 1', health: 97 },
        { timestamp: 'Wk 2', health: 94 },
        { timestamp: 'Wk 3', health: 88 },
        { timestamp: 'Wk 4', health: 72 }
      ]
    }
  },

  // WB-001 (Wire Bonder - Healthy)
  {
    id: 'WB-001',
    name: 'Wire Bonder 01',
    machineType: 'wire_bonder',
    processStage: 'Assembly',
    location: {
      facility: 'Fab 2 OSAT Hub',
      floor: 'Level 2 - Cleanroom ISO 5',
      area: 'Assembly Line A',
      line: 'Line A',
      station: 'Station 01',
      gridCoordinate: { x: 3, y: 8 }
    },
    status: 'healthy',
    healthScore: 96,
    rul: {
      value: 1420,
      unit: 'hours',
      confidence: 0.94,
      estimatedDays: 59.1,
      criticalThresholdHours: 48,
      degradationStage: 'Normal'
    },
    operatingHours: 4120,
    installationDate: '2024-09-10',
    firmwareVersion: 'v4.12.8-RT',
    ipAddress: '10.24.112.1',
    lastTelemetryTimestamp: '2026-08-22T12:51:00Z',
    sensors: [
      {
        sensorId: 'vibration_ultrasonic',
        name: 'Ultrasonic Vibration',
        value: 0.38,
        unit: 'mm/s',
        status: 'normal',
        lastUpdated: '5s ago'
      },
      {
        sensorId: 'load_clamp',
        name: 'Clamp Clamping Force',
        value: 66.0,
        unit: 'N',
        status: 'normal',
        lastUpdated: '5s ago'
      },
      {
        sensorId: 'temperature_transducer',
        name: 'Transducer Temp',
        value: 44.5,
        unit: '°C',
        status: 'normal',
        lastUpdated: '5s ago'
      }
    ],
    anomalies: [],
    maintenance: {
      lastMaintenanceDate: '2026-08-01',
      nextScheduledDate: '2026-09-01',
      status: 'scheduled',
      type: 'Preventive Inspection',
      technician: 'Marcus Vance',
      workOrderId: 'WO-2026-8712'
    },
    documents: [
      {
        id: 'DOC-WB01-01',
        title: 'Wire Bonder 01 Operation & Safety Manual',
        type: 'PDF',
        category: 'Manual',
        updatedAt: '2026-07-15',
        size: '12.4 MB',
        tags: ['Manual', 'Operation']
      }
    ],
    healthTrend: {
      '24h': [{ timestamp: '12h ago', health: 97 }, { timestamp: 'Now', health: 96 }],
      '7d': [{ timestamp: 'Day 1', health: 98 }, { timestamp: 'Day 7', health: 96 }],
      '30d': [{ timestamp: 'Wk 1', health: 99 }, { timestamp: 'Wk 4', health: 96 }]
    }
  },

  // WB-002 (Wire Bonder - Healthy)
  {
    id: 'WB-002',
    name: 'Wire Bonder 02',
    machineType: 'wire_bonder',
    processStage: 'Assembly',
    location: {
      facility: 'Fab 2 OSAT Hub',
      floor: 'Level 2 - Cleanroom ISO 5',
      area: 'Assembly Line A',
      line: 'Line A',
      station: 'Station 02',
      gridCoordinate: { x: 6, y: 8 }
    },
    status: 'healthy',
    healthScore: 91,
    rul: {
      value: 1180,
      unit: 'hours',
      confidence: 0.88,
      estimatedDays: 49.1,
      criticalThresholdHours: 48,
      degradationStage: 'Normal'
    },
    operatingHours: 5890,
    installationDate: '2024-06-20',
    firmwareVersion: 'v4.12.8-RT',
    ipAddress: '10.24.112.2',
    lastTelemetryTimestamp: '2026-08-22T12:51:30Z',
    sensors: [
      {
        sensorId: 'vibration_ultrasonic',
        name: 'Ultrasonic Vibration',
        value: 0.42,
        unit: 'mm/s',
        status: 'normal',
        lastUpdated: '12s ago'
      },
      {
        sensorId: 'load_clamp',
        name: 'Clamp Clamping Force',
        value: 68.5,
        unit: 'N',
        status: 'normal',
        lastUpdated: '12s ago'
      },
      {
        sensorId: 'temperature_transducer',
        name: 'Transducer Temp',
        value: 45.2,
        unit: '°C',
        status: 'normal',
        lastUpdated: '12s ago'
      }
    ],
    anomalies: [],
    maintenance: {
      lastMaintenanceDate: '2026-07-20',
      nextScheduledDate: '2026-09-10',
      status: 'scheduled',
      type: 'Tool Calibration',
      technician: 'Marcus Vance',
      workOrderId: 'WO-2026-8550'
    },
    documents: [],
    healthTrend: {
      '24h': [{ timestamp: 'Now', health: 91 }],
      '7d': [{ timestamp: 'Day 1', health: 93 }, { timestamp: 'Day 7', health: 91 }],
      '30d': [{ timestamp: 'Wk 1', health: 95 }, { timestamp: 'Wk 4', health: 91 }]
    }
  },

  // WB-003 (Wire Bonder - Critical)
  {
    id: 'WB-003',
    name: 'Wire Bonder 03',
    machineType: 'wire_bonder',
    processStage: 'Assembly',
    location: {
      facility: 'Fab 2 OSAT Hub',
      floor: 'Level 2 - Cleanroom ISO 5',
      area: 'Assembly Line B',
      line: 'Line B',
      station: 'Station 01',
      gridCoordinate: { x: 3, y: 14 }
    },
    status: 'critical',
    healthScore: 41,
    rul: {
      value: 28,
      unit: 'hours',
      confidence: 0.96,
      estimatedDays: 1.1,
      criticalThresholdHours: 48,
      degradationStage: 'Imminent Failure'
    },
    operatingHours: 12450,
    installationDate: '2023-11-05',
    firmwareVersion: 'v4.11.2-RT',
    ipAddress: '10.24.112.3',
    lastTelemetryTimestamp: '2026-08-22T12:51:50Z',
    sensors: [
      {
        sensorId: 'vibration_ultrasonic',
        name: 'Ultrasonic Vibration',
        value: 1.25,
        unit: 'mm/s',
        status: 'critical',
        lastUpdated: '3s ago'
      },
      {
        sensorId: 'load_clamp',
        name: 'Clamp Clamping Force',
        value: 98.2,
        unit: 'N',
        status: 'critical',
        lastUpdated: '3s ago'
      },
      {
        sensorId: 'temperature_transducer',
        name: 'Transducer Temp',
        value: 69.4,
        unit: '°C',
        status: 'critical',
        lastUpdated: '3s ago'
      }
    ],
    anomalies: [
      {
        id: 'ANO-WB03-99',
        timestamp: '2026-08-22 12:10',
        type: 'Piezo Transducer Thermal Runaway',
        severity: 'critical',
        description: 'Transducer temperature surpassed critical limit (69.4°C). Ultrasonic vibration resonance decoupling.',
        sensor: 'Transducer Temp',
        confidence: 0.97,
        status: 'active',
        recommendedAction: 'Immediate emergency halt & reroute lots to WB-001 / WB-002.'
      }
    ],
    maintenance: {
      lastMaintenanceDate: '2026-06-15',
      nextScheduledDate: '2026-08-22',
      status: 'overdue',
      type: 'Spindle Rebuild',
      technician: 'Carlos Mendez',
      workOrderId: 'WO-2026-9001'
    },
    documents: [],
    healthTrend: {
      '24h': [{ timestamp: '12h ago', health: 65 }, { timestamp: 'Now', health: 41 }],
      '7d': [{ timestamp: 'Day 1', health: 80 }, { timestamp: 'Day 7', health: 41 }],
      '30d': [{ timestamp: 'Wk 1', health: 88 }, { timestamp: 'Wk 4', health: 41 }]
    }
  },

  // DIC-001 (Wafer Dicing - Healthy)
  {
    id: 'DIC-001',
    name: 'Wafer Dicing Unit 01',
    machineType: 'wafer_dicing',
    processStage: 'Wafer Prep',
    location: {
      facility: 'Fab 2 OSAT Hub',
      floor: 'Level 1 - Front Prep',
      area: 'Dicing Bay 1',
      line: 'Line Prep-1',
      station: 'Dicer-01',
      gridCoordinate: { x: 2, y: 2 }
    },
    status: 'healthy',
    healthScore: 94,
    rul: {
      value: 890,
      unit: 'hours',
      confidence: 0.89,
      estimatedDays: 37.0,
      criticalThresholdHours: 50,
      degradationStage: 'Normal'
    },
    operatingHours: 3210,
    installationDate: '2024-11-12',
    firmwareVersion: 'v2.8.4',
    ipAddress: '10.24.110.1',
    lastTelemetryTimestamp: '2026-08-22T12:51:15Z',
    sensors: [
      {
        sensorId: 'vibration_spindle',
        name: 'Spindle Vibration',
        value: 0.28,
        unit: 'mm/s',
        status: 'normal',
        lastUpdated: '8s ago'
      },
      {
        sensorId: 'temperature_coolant',
        name: 'Coolant Temperature',
        value: 20.4,
        unit: '°C',
        status: 'normal',
        lastUpdated: '8s ago'
      },
      {
        sensorId: 'load_motor',
        name: 'Motor Spindle Load',
        value: 48.0,
        unit: '%',
        status: 'normal',
        lastUpdated: '8s ago'
      }
    ],
    anomalies: [],
    maintenance: {
      lastMaintenanceDate: '2026-08-05',
      nextScheduledDate: '2026-09-05',
      status: 'scheduled',
      type: 'Tool Calibration',
      technician: 'David Kim'
    },
    documents: [
      {
        id: 'DOC-DIC01-01',
        title: 'Precision Diamond Dicing Blade Replacement SOP',
        type: 'SOP',
        category: 'SOP',
        updatedAt: '2026-06-12',
        size: '4.5 MB',
        tags: ['Dicing', 'Blade', 'Spindle']
      }
    ],
    healthTrend: {
      '24h': [{ timestamp: 'Now', health: 94 }],
      '7d': [{ timestamp: 'Day 1', health: 95 }, { timestamp: 'Day 7', health: 94 }],
      '30d': [{ timestamp: 'Wk 1', health: 96 }, { timestamp: 'Wk 4', health: 94 }]
    }
  },

  // DIC-002 (Wafer Dicing - Warning)
  {
    id: 'DIC-002',
    name: 'Wafer Dicing Unit 02',
    machineType: 'wafer_dicing',
    processStage: 'Wafer Prep',
    location: {
      facility: 'Fab 2 OSAT Hub',
      floor: 'Level 1 - Front Prep',
      area: 'Dicing Bay 1',
      line: 'Line Prep-1',
      station: 'Dicer-02',
      gridCoordinate: { x: 5, y: 2 }
    },
    status: 'warning',
    healthScore: 68,
    rul: {
      value: 142,
      unit: 'hours',
      confidence: 0.85,
      estimatedDays: 5.9,
      criticalThresholdHours: 50,
      degradationStage: 'Accelerated Wear'
    },
    operatingHours: 7650,
    installationDate: '2024-01-20',
    firmwareVersion: 'v2.8.4',
    ipAddress: '10.24.110.2',
    lastTelemetryTimestamp: '2026-08-22T12:51:25Z',
    sensors: [
      {
        sensorId: 'vibration_spindle',
        name: 'Spindle Vibration',
        value: 0.89,
        unit: 'mm/s',
        status: 'warning',
        lastUpdated: '6s ago'
      },
      {
        sensorId: 'temperature_coolant',
        name: 'Coolant Temperature',
        value: 26.8,
        unit: '°C',
        status: 'normal',
        lastUpdated: '6s ago'
      },
      {
        sensorId: 'load_motor',
        name: 'Motor Spindle Load',
        value: 78.0,
        unit: '%',
        status: 'warning',
        lastUpdated: '6s ago'
      }
    ],
    anomalies: [
      {
        id: 'ANO-DIC02-01',
        timestamp: '2026-08-22 09:18',
        type: 'Spindle Bearing Harmonic Anomaly',
        severity: 'medium',
        description: 'Vibration frequency analysis indicates micro-spalling on upper spindle ceramic bearings.',
        sensor: 'Spindle Vibration',
        confidence: 0.88,
        status: 'active',
        recommendedAction: 'Schedule diamond blade re-truing and spindle lubrication flush.'
      }
    ],
    maintenance: {
      lastMaintenanceDate: '2026-07-15',
      nextScheduledDate: '2026-08-25',
      status: 'scheduled',
      type: 'Spindle Rebuild',
      technician: 'David Kim'
    },
    documents: [],
    healthTrend: {
      '24h': [{ timestamp: '12h ago', health: 78 }, { timestamp: 'Now', health: 68 }],
      '7d': [{ timestamp: 'Day 1', health: 85 }, { timestamp: 'Day 7', health: 68 }],
      '30d': [{ timestamp: 'Wk 1', health: 92 }, { timestamp: 'Wk 4', health: 68 }]
    }
  },

  // DIC-003 (Wafer Dicing - Offline)
  {
    id: 'DIC-003',
    name: 'Wafer Dicing Unit 03',
    machineType: 'wafer_dicing',
    processStage: 'Wafer Prep',
    location: {
      facility: 'Fab 2 OSAT Hub',
      floor: 'Level 1 - Front Prep',
      area: 'Dicing Bay 2',
      line: 'Line Prep-2',
      station: 'Dicer-03',
      gridCoordinate: { x: 8, y: 2 }
    },
    status: 'offline',
    healthScore: 0,
    rul: {
      value: 0,
      unit: 'hours',
      confidence: 0.0,
      estimatedDays: 0,
      criticalThresholdHours: 50,
      degradationStage: 'Normal'
    },
    operatingHours: 6400,
    installationDate: '2024-04-10',
    firmwareVersion: 'v2.8.2',
    ipAddress: '10.24.110.3',
    lastTelemetryTimestamp: '2026-08-20T04:12:00Z',
    sensors: [
      {
        sensorId: 'vibration_spindle',
        name: 'Spindle Vibration',
        value: 0.0,
        unit: 'mm/s',
        status: 'normal',
        lastUpdated: '2d ago'
      },
      {
        sensorId: 'temperature_coolant',
        name: 'Coolant Temperature',
        value: 0.0,
        unit: '°C',
        status: 'normal',
        lastUpdated: '2d ago'
      },
      {
        sensorId: 'load_motor',
        name: 'Motor Spindle Load',
        value: 0.0,
        unit: '%',
        status: 'normal',
        lastUpdated: '2d ago'
      }
    ],
    anomalies: [
      {
        id: 'ANO-DIC03-01',
        timestamp: '2026-08-20 04:12',
        type: 'Telemetry Connection Lost',
        severity: 'medium',
        description: 'Edge MQTT Gateway disconnected. Hardware power shut off for cleanroom facility electrical upgrade.',
        sensor: 'System Gateway',
        confidence: 1.0,
        status: 'acknowledged'
      }
    ],
    maintenance: {
      lastMaintenanceDate: '2026-07-10',
      nextScheduledDate: '2026-08-24',
      status: 'scheduled',
      type: 'Preventive Inspection',
      technician: 'Facility Team'
    },
    documents: [],
    healthTrend: {
      '24h': [{ timestamp: 'Now', health: 0 }],
      '7d': [{ timestamp: 'Day 1', health: 91 }, { timestamp: 'Day 7', health: 0 }],
      '30d': [{ timestamp: 'Wk 1', health: 95 }, { timestamp: 'Wk 4', health: 0 }]
    }
  },

  // DA-001 (Die Attacher - Healthy)
  {
    id: 'DA-001',
    name: 'Die Attacher 01',
    machineType: 'die_attacher',
    processStage: 'Die Attach',
    location: {
      facility: 'Fab 2 OSAT Hub',
      floor: 'Level 2 - Cleanroom ISO 5',
      area: 'Die Bond Bay A',
      line: 'Line DA-1',
      station: 'Station DA-01',
      gridCoordinate: { x: 2, y: 5 }
    },
    status: 'healthy',
    healthScore: 95,
    rul: {
      value: 1350,
      unit: 'hours',
      confidence: 0.92,
      estimatedDays: 56.2,
      criticalThresholdHours: 40,
      degradationStage: 'Normal'
    },
    operatingHours: 5120,
    installationDate: '2024-05-18',
    firmwareVersion: 'v3.5.1',
    ipAddress: '10.24.111.1',
    lastTelemetryTimestamp: '2026-08-22T12:51:40Z',
    sensors: [
      {
        sensorId: 'vibration_arm',
        name: 'Arm Vibration',
        value: 0.22,
        unit: 'mm/s',
        status: 'normal',
        lastUpdated: '4s ago'
      },
      {
        sensorId: 'pressure_vacuum',
        name: 'Collet Vacuum Pressure',
        value: -82.4,
        unit: 'kPa',
        status: 'normal',
        lastUpdated: '4s ago'
      },
      {
        sensorId: 'temperature_heater',
        name: 'Heater Block Temp',
        value: 165.0,
        unit: '°C',
        status: 'normal',
        lastUpdated: '4s ago'
      }
    ],
    anomalies: [],
    maintenance: {
      lastMaintenanceDate: '2026-07-28',
      nextScheduledDate: '2026-09-02',
      status: 'scheduled',
      type: 'Preventive Inspection',
      technician: 'Sarah Jenkins'
    },
    documents: [
      {
        id: 'DOC-DA01-01',
        title: 'Die Attacher Collet Vacuum & Alignment Calibration Manual',
        type: 'PDF',
        category: 'Manual',
        updatedAt: '2026-05-20',
        size: '11.0 MB',
        tags: ['Die Attach', 'Collet', 'Vacuum']
      }
    ],
    healthTrend: {
      '24h': [{ timestamp: 'Now', health: 95 }],
      '7d': [{ timestamp: 'Day 1', health: 96 }, { timestamp: 'Day 7', health: 95 }],
      '30d': [{ timestamp: 'Wk 1', health: 97 }, { timestamp: 'Wk 4', health: 95 }]
    }
  },

  // DA-002 (Die Attacher - Critical)
  {
    id: 'DA-002',
    name: 'Die Attacher 02',
    machineType: 'die_attacher',
    processStage: 'Die Attach',
    location: {
      facility: 'Fab 2 OSAT Hub',
      floor: 'Level 2 - Cleanroom ISO 5',
      area: 'Die Bond Bay A',
      line: 'Line DA-1',
      station: 'Station DA-02',
      gridCoordinate: { x: 5, y: 5 }
    },
    status: 'critical',
    healthScore: 48,
    rul: {
      value: 42,
      unit: 'hours',
      confidence: 0.93,
      estimatedDays: 1.7,
      criticalThresholdHours: 40,
      degradationStage: 'Imminent Failure'
    },
    operatingHours: 9800,
    installationDate: '2023-12-01',
    firmwareVersion: 'v3.5.0',
    ipAddress: '10.24.111.2',
    lastTelemetryTimestamp: '2026-08-22T12:51:55Z',
    sensors: [
      {
        sensorId: 'vibration_arm',
        name: 'Arm Vibration',
        value: 1.12,
        unit: 'mm/s',
        status: 'critical',
        lastUpdated: '2s ago'
      },
      {
        sensorId: 'pressure_vacuum',
        name: 'Collet Vacuum Pressure',
        value: -52.0,
        unit: 'kPa',
        status: 'critical',
        lastUpdated: '2s ago'
      },
      {
        sensorId: 'temperature_heater',
        name: 'Heater Block Temp',
        value: 172.5,
        unit: '°C',
        status: 'normal',
        lastUpdated: '2s ago'
      }
    ],
    anomalies: [
      {
        id: 'ANO-DA02-01',
        timestamp: '2026-08-22 10:15',
        type: 'Collet Vacuum Seal Leakage & Arm Jerk',
        severity: 'critical',
        description: 'Vacuum pressure dropped to -52 kPa causing 3 die misalignment drop events in 30 mins.',
        sensor: 'Collet Vacuum Pressure',
        confidence: 0.95,
        status: 'active',
        recommendedAction: 'Halt line, replace silicone pickup tip, clean vacuum solenoid valve.'
      }
    ],
    maintenance: {
      lastMaintenanceDate: '2026-06-25',
      nextScheduledDate: '2026-08-23',
      status: 'scheduled',
      type: 'Sensor Replacement',
      technician: 'Sarah Jenkins'
    },
    documents: [],
    healthTrend: {
      '24h': [{ timestamp: '12h ago', health: 70 }, { timestamp: 'Now', health: 48 }],
      '7d': [{ timestamp: 'Day 1', health: 82 }, { timestamp: 'Day 7', health: 48 }],
      '30d': [{ timestamp: 'Wk 1', health: 90 }, { timestamp: 'Wk 4', health: 48 }]
    }
  },

  // MOLD-001 (Molding Machine - Healthy)
  {
    id: 'MOLD-001',
    name: 'Auto Molding Press 01',
    machineType: 'molding',
    processStage: 'Encapsulation',
    location: {
      facility: 'Fab 2 OSAT Hub',
      floor: 'Level 1 - Packaging Line',
      area: 'Molding Bay M1',
      line: 'Line Mold-1',
      station: 'Station M-01',
      gridCoordinate: { x: 2, y: 11 }
    },
    status: 'healthy',
    healthScore: 93,
    rul: {
      value: 1220,
      unit: 'hours',
      confidence: 0.90,
      estimatedDays: 50.8,
      criticalThresholdHours: 60,
      degradationStage: 'Normal'
    },
    operatingHours: 6200,
    installationDate: '2024-02-14',
    firmwareVersion: 'v5.0.2',
    ipAddress: '10.24.113.1',
    lastTelemetryTimestamp: '2026-08-22T12:51:10Z',
    sensors: [
      {
        sensorId: 'temperature_mold',
        name: 'Mold Chase Temp',
        value: 174.2,
        unit: '°C',
        status: 'normal',
        lastUpdated: '15s ago'
      },
      {
        sensorId: 'pressure_hydraulic',
        name: 'Hydraulic Pressure',
        value: 138.0,
        unit: 'bar',
        status: 'normal',
        lastUpdated: '15s ago'
      },
      {
        sensorId: 'load_plunger',
        name: 'Plunger Force Load',
        value: 21.5,
        unit: 'kN',
        status: 'normal',
        lastUpdated: '15s ago'
      }
    ],
    anomalies: [],
    maintenance: {
      lastMaintenanceDate: '2026-08-08',
      nextScheduledDate: '2026-09-08',
      status: 'scheduled',
      type: 'Preventive Inspection',
      technician: 'Elena Rostova'
    },
    documents: [
      {
        id: 'DOC-MOLD01-01',
        title: 'Molding System Hydraulic Pressure & Degassing Guide',
        type: 'PDF',
        category: 'Manual',
        updatedAt: '2026-04-10',
        size: '18.5 MB',
        tags: ['Molding', 'Hydraulics', 'Degassing']
      }
    ],
    healthTrend: {
      '24h': [{ timestamp: 'Now', health: 93 }],
      '7d': [{ timestamp: 'Day 1', health: 94 }, { timestamp: 'Day 7', health: 93 }],
      '30d': [{ timestamp: 'Wk 1', health: 96 }, { timestamp: 'Wk 4', health: 93 }]
    }
  },

  // MOLD-002 (Molding Machine - Maintenance)
  {
    id: 'MOLD-002',
    name: 'Auto Molding Press 02',
    machineType: 'molding',
    processStage: 'Encapsulation',
    location: {
      facility: 'Fab 2 OSAT Hub',
      floor: 'Level 1 - Packaging Line',
      area: 'Molding Bay M1',
      line: 'Line Mold-1',
      station: 'Station M-02',
      gridCoordinate: { x: 5, y: 11 }
    },
    status: 'maintenance',
    healthScore: 85,
    rul: {
      value: 950,
      unit: 'hours',
      confidence: 0.85,
      estimatedDays: 39.5,
      criticalThresholdHours: 60,
      degradationStage: 'Normal'
    },
    operatingHours: 7100,
    installationDate: '2024-02-14',
    firmwareVersion: 'v5.0.2',
    ipAddress: '10.24.113.2',
    lastTelemetryTimestamp: '2026-08-22T11:30:00Z',
    sensors: [
      {
        sensorId: 'temperature_mold',
        name: 'Mold Chase Temp',
        value: 170.0,
        unit: '°C',
        status: 'normal',
        lastUpdated: '1h ago'
      },
      {
        sensorId: 'pressure_hydraulic',
        name: 'Hydraulic Pressure',
        value: 142.0,
        unit: 'bar',
        status: 'normal',
        lastUpdated: '1h ago'
      },
      {
        sensorId: 'load_plunger',
        name: 'Plunger Force Load',
        value: 22.0,
        unit: 'kN',
        status: 'normal',
        lastUpdated: '1h ago'
      }
    ],
    anomalies: [],
    maintenance: {
      lastMaintenanceDate: '2026-08-22',
      nextScheduledDate: '2026-09-22',
      status: 'in_progress',
      type: 'Tool Calibration',
      technician: 'Elena Rostova',
      workOrderId: 'WO-2026-8910',
      notes: 'Active mold chase chemical cleaning and thermocouple recalibration in progress.'
    },
    documents: [],
    healthTrend: {
      '24h': [{ timestamp: 'Now', health: 85 }],
      '7d': [{ timestamp: 'Day 1', health: 88 }, { timestamp: 'Day 7', health: 85 }],
      '30d': [{ timestamp: 'Wk 1', health: 91 }, { timestamp: 'Wk 4', health: 85 }]
    }
  },

  // ATE-001 (IC Tester & Sorter - Healthy)
  {
    id: 'ATE-001',
    name: 'IC Test & Sort Cell 01',
    machineType: 'ic_tester',
    processStage: 'Testing & Sort',
    location: {
      facility: 'Fab 2 OSAT Hub',
      floor: 'Level 2 - Final Test Area',
      area: 'ATE Cell Bay 1',
      line: 'Test Line 1',
      station: 'Station T-01',
      gridCoordinate: { x: 2, y: 17 }
    },
    status: 'healthy',
    healthScore: 98,
    rul: {
      value: 1600,
      unit: 'hours',
      confidence: 0.95,
      estimatedDays: 66.6,
      criticalThresholdHours: 50,
      degradationStage: 'Normal'
    },
    operatingHours: 2900,
    installationDate: '2025-01-10',
    firmwareVersion: 'v8.1.0',
    ipAddress: '10.24.114.1',
    lastTelemetryTimestamp: '2026-08-22T12:51:05Z',
    sensors: [
      {
        sensorId: 'vibration_handler',
        name: 'Handler Vibration',
        value: 0.32,
        unit: 'mm/s',
        status: 'normal',
        lastUpdated: '5s ago'
      },
      {
        sensorId: 'temperature_chamber',
        name: 'Test Chamber Temp',
        value: 24.5,
        unit: '°C',
        status: 'normal',
        lastUpdated: '5s ago'
      },
      {
        sensorId: 'load_actuator',
        name: 'Socket Actuator Load',
        value: 48.0,
        unit: 'N',
        status: 'normal',
        lastUpdated: '5s ago'
      }
    ],
    anomalies: [],
    maintenance: {
      lastMaintenanceDate: '2026-08-15',
      nextScheduledDate: '2026-09-15',
      status: 'scheduled',
      type: 'Preventive Inspection',
      technician: 'Kenji Sato'
    },
    documents: [
      {
        id: 'DOC-ATE01-01',
        title: 'High-Speed Handler Pogo Pin Maintenance Guide',
        type: 'PDF',
        category: 'Manual',
        updatedAt: '2026-06-01',
        size: '9.2 MB',
        tags: ['ATE', 'Handler', 'Pogo Pins']
      }
    ],
    healthTrend: {
      '24h': [{ timestamp: 'Now', health: 98 }],
      '7d': [{ timestamp: 'Day 1', health: 99 }, { timestamp: 'Day 7', health: 98 }],
      '30d': [{ timestamp: 'Wk 1', health: 99 }, { timestamp: 'Wk 4', health: 98 }]
    }
  },

  // ATE-002 (IC Tester & Sorter - Warning)
  {
    id: 'ATE-002',
    name: 'IC Test & Sort Cell 02',
    machineType: 'ic_tester',
    processStage: 'Testing & Sort',
    location: {
      facility: 'Fab 2 OSAT Hub',
      floor: 'Level 2 - Final Test Area',
      area: 'ATE Cell Bay 1',
      line: 'Test Line 1',
      station: 'Station T-02',
      gridCoordinate: { x: 5, y: 17 }
    },
    status: 'warning',
    healthScore: 74,
    rul: {
      value: 210,
      unit: 'hours',
      confidence: 0.86,
      estimatedDays: 8.7,
      criticalThresholdHours: 50,
      degradationStage: 'Early Drift'
    },
    operatingHours: 6850,
    installationDate: '2024-04-22',
    firmwareVersion: 'v8.1.0',
    ipAddress: '10.24.114.2',
    lastTelemetryTimestamp: '2026-08-22T12:51:20Z',
    sensors: [
      {
        sensorId: 'vibration_handler',
        name: 'Handler Vibration',
        value: 0.95,
        unit: 'mm/s',
        status: 'warning',
        lastUpdated: '10s ago'
      },
      {
        sensorId: 'temperature_chamber',
        name: 'Test Chamber Temp',
        value: 29.8,
        unit: '°C',
        status: 'normal',
        lastUpdated: '10s ago'
      },
      {
        sensorId: 'load_actuator',
        name: 'Socket Actuator Load',
        value: 72.0,
        unit: 'N',
        status: 'normal',
        lastUpdated: '10s ago'
      }
    ],
    anomalies: [
      {
        id: 'ANO-ATE02-01',
        timestamp: '2026-08-22 07:44',
        type: 'Handler Turret Vibration Drift',
        severity: 'medium',
        description: 'Pneumatic carriage acceleration profile showing micro-chatter at pick index 4.',
        sensor: 'Handler Vibration',
        confidence: 0.86,
        status: 'active',
        recommendedAction: 'Inspect linear rails and clean optical index encoder.'
      }
    ],
    maintenance: {
      lastMaintenanceDate: '2026-07-20',
      nextScheduledDate: '2026-08-27',
      status: 'scheduled',
      type: 'Sensor Replacement',
      technician: 'Kenji Sato'
    },
    documents: [],
    healthTrend: {
      '24h': [{ timestamp: '12h ago', health: 82 }, { timestamp: 'Now', health: 74 }],
      '7d': [{ timestamp: 'Day 1', health: 88 }, { timestamp: 'Day 7', health: 74 }],
      '30d': [{ timestamp: 'Wk 1', health: 93 }, { timestamp: 'Wk 4', health: 74 }]
    }
  }
];

async function seed() {
  console.log(`[Seeder] Writing ${SEED_MACHINES.length} machines to Firestore "machines" collection...`);
  const batch = db.batch();

  for (const machine of SEED_MACHINES) {
    const docRef = db.collection('machines').doc(machine.id);
    batch.set(docRef, machine, { merge: true });
    console.log(`  + [${machine.id}] ${machine.name} (${machine.machineType}) -> ${machine.status.toUpperCase()}`);
  }

  await batch.commit();
  console.log(`\n[Seeder] SUCCESS: Successfully committed all ${SEED_MACHINES.length} machines to Firestore project "${serviceAccount.project_id}"!`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('[Seeder] Seeding failed:', err);
  process.exit(1);
});
