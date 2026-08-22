export type MachineTypeId = 
  | 'wafer_dicing'
  | 'die_attacher'
  | 'wire_bonder'
  | 'molding'
  | 'ic_tester';

export interface SensorSchema {
  id: string;
  name: string;
  unit: string;
  min: number;
  max: number;
  normalRange: [number, number];
  warningThreshold: { min?: number; max: number };
  criticalThreshold: { min?: number; max: number };
  description: string;
}

export interface MachineTypeDefinition {
  id: MachineTypeId;
  name: string;
  shortName: string;
  codePrefix: string;
  processStage: string;
  description: string;
  purpose: string;
  aiRelevance: string[];
  sensors: SensorSchema[];
}

export const MACHINE_TYPES: Record<MachineTypeId, MachineTypeDefinition> = {
  wafer_dicing: {
    id: 'wafer_dicing',
    name: 'Wafer Dicing Machine',
    shortName: 'Dicing',
    codePrefix: 'DIC',
    processStage: 'Wafer Prep',
    purpose: 'Cuts incoming silicon wafers into individual precision dies using high-speed diamond blade spindles.',
    description: 'Precision dicing system operating up to 60,000 RPM with deionized coolant delivery.',
    aiRelevance: [
      'Blade degradation tracking',
      'Spindle abnormality detection',
      'Motor load anomaly detection',
      'Vibration surge warning',
      'Remaining Useful Life (RUL) estimation'
    ],
    sensors: [
      {
        id: 'vibration_spindle',
        name: 'Spindle Vibration',
        unit: 'mm/s',
        min: 0.0,
        max: 2.0,
        normalRange: [0.1, 0.5],
        warningThreshold: { max: 0.8 },
        criticalThreshold: { max: 1.2 },
        description: 'High-frequency vibration on the primary cutting spindle bearing.'
      },
      {
        id: 'temperature_coolant',
        name: 'Coolant Temperature',
        unit: '°C',
        min: 10.0,
        max: 50.0,
        normalRange: [18.0, 24.0],
        warningThreshold: { max: 28.0 },
        criticalThreshold: { max: 35.0 },
        description: 'Temperature of the DI water jet cooling the blade/wafer interface.'
      },
      {
        id: 'load_motor',
        name: 'Motor Spindle Load',
        unit: '%',
        min: 0,
        max: 100,
        normalRange: [30, 65],
        warningThreshold: { max: 80 },
        criticalThreshold: { max: 92 },
        description: 'Current draw percentage of the high-torque spindle motor.'
      }
    ]
  },
  die_attacher: {
    id: 'die_attacher',
    name: 'Die Attacher',
    shortName: 'Die Attach',
    codePrefix: 'DA',
    processStage: 'Die Attach',
    purpose: 'Uses a high-speed pick-and-place mechanism with vacuum collets to bond individual dies to leadframes or substrates.',
    description: 'Ultra-precision die placement system with epoxy dispensing and heated bond-head control.',
    aiRelevance: [
      'Mechanical wear forecasting',
      'Pick-and-place arm vibration drift',
      'Vacuum seal degradation',
      'Epoxy change-point detection',
      'Placement tilt/drift anomaly detection'
    ],
    sensors: [
      {
        id: 'vibration_arm',
        name: 'Arm Vibration',
        unit: 'mm/s',
        min: 0.0,
        max: 2.0,
        normalRange: [0.1, 0.4],
        warningThreshold: { max: 0.7 },
        criticalThreshold: { max: 1.0 },
        description: 'Linear motor traverse vibration on the pick-and-place robotic arm.'
      },
      {
        id: 'pressure_vacuum',
        name: 'Collet Vacuum Pressure',
        unit: 'kPa',
        min: -100.0,
        max: 0.0,
        normalRange: [-85.0, -70.0],
        warningThreshold: { max: -60.0 },
        criticalThreshold: { max: -45.0 },
        description: 'Negative vacuum pressure holding the silicon die during transfer.'
      },
      {
        id: 'temperature_heater',
        name: 'Heater Block Temp',
        unit: '°C',
        min: 50.0,
        max: 260.0,
        normalRange: [140.0, 180.0],
        warningThreshold: { max: 195.0 },
        criticalThreshold: { max: 215.0 },
        description: 'Temperature of the substrate preheat and curing stage.'
      }
    ]
  },
  wire_bonder: {
    id: 'wire_bonder',
    name: 'Wire Bonder',
    shortName: 'Wire Bond',
    codePrefix: 'WB',
    processStage: 'Assembly',
    purpose: 'Creates microscopic interconnects between the die pads and leadframe fingers using gold or copper wire via ultrasonic energy.',
    description: 'Thermo-sonic ball-wedge bonder running at 138 kHz ultrasonic resonance with loop profiling.',
    aiRelevance: [
      'Ultrasonic transducer degradation',
      'Capillary mechanical wear',
      'Vibration frequency shift detection',
      'RUL prediction for bonding tools',
      'Dynamic process rerouting when degraded'
    ],
    sensors: [
      {
        id: 'vibration_ultrasonic',
        name: 'Ultrasonic Vibration',
        unit: 'mm/s',
        min: 0.0,
        max: 2.0,
        normalRange: [0.3, 0.5],
        warningThreshold: { max: 0.75 },
        criticalThreshold: { max: 1.1 },
        description: 'Harmonic vibration magnitude measured at the ultrasonic transducer horn.'
      },
      {
        id: 'load_clamp',
        name: 'Clamp Clamping Force',
        unit: 'N',
        min: 0,
        max: 120,
        normalRange: [55, 75],
        warningThreshold: { max: 82 },
        criticalThreshold: { max: 95 },
        description: 'Leadframe clamping force ensuring zero substrate micro-motion.'
      },
      {
        id: 'temperature_transducer',
        name: 'Transducer Temp',
        unit: '°C',
        min: 20.0,
        max: 80.0,
        normalRange: [42.0, 50.0],
        warningThreshold: { max: 58.0 },
        criticalThreshold: { max: 68.0 },
        description: 'Operating temperature of the piezo-electric bonding transducer stack.'
      }
    ]
  },
  molding: {
    id: 'molding',
    name: 'Molding Machine',
    shortName: 'Molding',
    codePrefix: 'MOLD',
    processStage: 'Encapsulation',
    purpose: 'Encapsulates the bonded semiconductor assembly in high-grade thermoset epoxy molding compound (EMC).',
    description: 'Automated multi-plunger transfer molding press with vacuum assist and mold heating.',
    aiRelevance: [
      'Hydraulic pressure deviation',
      'Plunger force and load anomalies',
      'Mold chase temperature gradient detection',
      'Void formation risk prediction',
      'RAG-assisted troubleshooting for mold sticking/bleed'
    ],
    sensors: [
      {
        id: 'temperature_mold',
        name: 'Mold Chase Temp',
        unit: '°C',
        min: 100.0,
        max: 230.0,
        normalRange: [165.0, 180.0],
        warningThreshold: { max: 190.0 },
        criticalThreshold: { max: 205.0 },
        description: 'Upper and lower mold chase heating plate temperature.'
      },
      {
        id: 'pressure_hydraulic',
        name: 'Hydraulic Pressure',
        unit: 'bar',
        min: 0,
        max: 250,
        normalRange: [120, 150],
        warningThreshold: { max: 175 },
        criticalThreshold: { max: 200 },
        description: 'Hydraulic system pressure driving the transfer ram during compound injection.'
      },
      {
        id: 'load_plunger',
        name: 'Plunger Force Load',
        unit: 'kN',
        min: 0.0,
        max: 50.0,
        normalRange: [18.0, 25.0],
        warningThreshold: { max: 30.0 },
        criticalThreshold: { max: 38.0 },
        description: 'Dynamic load exerted by the motorized multi-plunger system.'
      }
    ]
  },
  ic_tester: {
    id: 'ic_tester',
    name: 'IC Tester & Sorter',
    shortName: 'ATE / Sorter',
    codePrefix: 'ATE',
    processStage: 'Testing & Sort',
    purpose: 'Executes parametric electrical validation at speed and sorts verified chips into pass/fail/bin classes.',
    description: 'Automated test equipment (ATE) with high-speed pneumatic gravity/turret handler.',
    aiRelevance: [
      'Handler vibration anomaly',
      'Actuator load spikes during socketing',
      'Pogo pin contact degradation',
      'Bin sorting discrepancy detection',
      'Predictive maintenance scheduling for test sockets'
    ],
    sensors: [
      {
        id: 'vibration_handler',
        name: 'Handler Vibration',
        unit: 'mm/s',
        min: 0.0,
        max: 2.5,
        normalRange: [0.2, 0.6],
        warningThreshold: { max: 0.9 },
        criticalThreshold: { max: 1.3 },
        description: 'X/Y/Z vibration on the high-speed chip transfer handler carriage.'
      },
      {
        id: 'temperature_chamber',
        name: 'Test Chamber Temp',
        unit: '°C',
        min: -40.0,
        max: 150.0,
        normalRange: [22.0, 28.0],
        warningThreshold: { max: 35.0 },
        criticalThreshold: { max: 45.0 },
        description: 'Thermal condition inside the device-under-test (DUT) socket enclosure.'
      },
      {
        id: 'load_actuator',
        name: 'Socket Actuator Load',
        unit: 'N',
        min: 0,
        max: 120,
        normalRange: [40, 60],
        warningThreshold: { max: 75 },
        criticalThreshold: { max: 90 },
        description: 'Contact compression force exerted when seating chips into the test socket.'
      }
    ]
  }
};

export const MACHINE_TYPE_LIST = Object.values(MACHINE_TYPES);
