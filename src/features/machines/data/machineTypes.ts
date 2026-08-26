export type MachineTypeId = 
  | 'wafer-saw'
  | 'stocker'
  | 'die-attach'
  | 'plasma-cleaner'
  | 'wire-bonding'
  | 'molding-press'
  | 'aoi-inspection'
  | 'x-ray-inspection'
  | 'laser-marking'
  | 'test-handler'
  | 'tape-reel'
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

export const MACHINE_TYPES: Record<string, MachineTypeDefinition> = {
  'wafer-saw': {
    id: 'wafer-saw',
    name: '300mm Precision Wafer Saw',
    shortName: 'Wafer Saw',
    codePrefix: 'WS',
    processStage: 'Bay 1: Wafer Dicing & Prep',
    purpose: 'Cuts incoming 300mm silicon wafers into individual precision dies using high-speed diamond blade spindles.',
    description: 'Dual-spindle 300mm wafer dicing saw operating up to 60,000 RPM with deionized water cooling jets and sub-micron positioning.',
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

  'stocker': {
    id: 'stocker',
    name: 'AMHS Cleanroom FOUP Stocker',
    shortName: 'AMHS Stocker',
    codePrefix: 'STK',
    processStage: 'Bay 1: Wafer Dicing & Prep',
    purpose: 'Provides automated wafer FOUP and cassette buffering with continuous ultra-pure N2 purging.',
    description: 'Vertical cleanroom automated buffer stocker with robotic 2-axis crane for wafer FOUPs & magazines.',
    aiRelevance: [
      'AMHS robotic crane vibration monitoring',
      'N2 purge manifold pressure tracking',
      'Transfer cycle-time jitter forecasting',
      'Buffer slot capacity balancing'
    ],
    sensors: [
      {
        id: 'vibration_crane',
        name: 'Robotic Crane Vibration',
        unit: 'mm/s',
        min: 0.0,
        max: 1.5,
        normalRange: [0.05, 0.25],
        warningThreshold: { max: 0.45 },
        criticalThreshold: { max: 0.8 },
        description: 'Vibration of the automated 2-axis AMHS robotic transfer arm.'
      },
      {
        id: 'pressure_n2',
        name: 'N2 Purge Pressure',
        unit: 'kPa',
        min: 0.0,
        max: 100.0,
        normalRange: [40.0, 60.0],
        warningThreshold: { max: 75.0 },
        criticalThreshold: { max: 90.0 },
        description: 'Manifold pressure for ultra-clean N2 wafer FOUP purging.'
      },
      {
        id: 'temp_stocker',
        name: 'Internal Enclosure Temp',
        unit: '°C',
        min: 15.0,
        max: 35.0,
        normalRange: [20.0, 23.0],
        warningThreshold: { max: 26.0 },
        criticalThreshold: { max: 30.0 },
        description: 'Ambient temperature inside the ISO 5 cleanroom stocker cabinet.'
      }
    ]
  },

  'die-attach': {
    id: 'die-attach',
    name: 'High-Precision Die Bonder',
    shortName: 'Die Attach',
    codePrefix: 'DA',
    processStage: 'Bay 2: Die Attach & SMT',
    purpose: 'Bonds individual silicon dies to leadframes or organic substrates with micron-level epoxy placement.',
    description: 'Ultra-precision die placement system with epoxy dispensing, dual-collet heads, and heated bond-stage control.',
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

  'plasma-cleaner': {
    id: 'plasma-cleaner',
    name: 'RF Argon Plasma Cleaner',
    shortName: 'Plasma Cleaner',
    codePrefix: 'PC',
    processStage: 'Bay 3A: Plasma Activation',
    purpose: 'Activates die/leadframe bond pads and strips organic residues prior to wire bonding.',
    description: '13.56 MHz RF vacuum chamber for argon/O2 surface activation with mass flow gas delivery and RF impedance match network.',
    aiRelevance: [
      'RF forward/reflected power ratio anomalies',
      'Vacuum chamber pump-down degradation',
      'Mass flow controller drift',
      'Chamber seal wear forecasting'
    ],
    sensors: [
      {
        id: 'vibration_vacuum_pump',
        name: 'Vacuum Pump Vibration',
        unit: 'mm/s',
        min: 0.0,
        max: 2.0,
        normalRange: [0.1, 0.35],
        warningThreshold: { max: 0.65 },
        criticalThreshold: { max: 1.0 },
        description: 'Dry vacuum pump vibration during roughing and turbo cycling.'
      },
      {
        id: 'chamber_pressure',
        name: 'Vacuum Chamber Pressure',
        unit: 'kPa',
        min: 0.0,
        max: 120.0,
        normalRange: [70.0, 90.0],
        warningThreshold: { max: 100.0 },
        criticalThreshold: { max: 110.0 },
        description: 'Process vacuum chamber operating pressure during RF excitation.'
      },
      {
        id: 'rf_reflected_power',
        name: 'RF Reflected Power',
        unit: 'W',
        min: 0.0,
        max: 150.0,
        normalRange: [5.0, 25.0],
        warningThreshold: { max: 55.0 },
        criticalThreshold: { max: 85.0 },
        description: 'Reflected RF energy indicating impedance match tuning efficiency.'
      }
    ]
  },

  'wire-bonding': {
    id: 'wire-bonding',
    name: 'Thermosonic Ball Bonder',
    shortName: 'Wire Bonder',
    codePrefix: 'WB',
    processStage: 'Bay 3B: Wire Bonding Cleanroom',
    purpose: 'Creates microscopic interconnects between die pads and leadframe fingers using gold or copper wire via ultrasonic energy.',
    description: 'Ultra-high-speed ball bonder for Au and Cu micro-wire interconnects (up to 24 wires/sec) with 138 kHz ultrasonic resonance profiling.',
    aiRelevance: [
      'Ultrasonic transducer harmonic resonance degradation',
      'Capillary mechanical wear and loop drift',
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
        max: 3.5,
        normalRange: [0.3, 0.55],
        warningThreshold: { max: 1.2 },
        criticalThreshold: { max: 2.2 },
        description: 'Harmonic vibration magnitude measured at the ultrasonic transducer horn.'
      },
      {
        id: 'load_clamp',
        name: 'Leadframe Clamping Force',
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
        max: 85.0,
        normalRange: [42.0, 52.0],
        warningThreshold: { max: 62.0 },
        criticalThreshold: { max: 75.0 },
        description: 'Operating temperature of the piezo-electric bonding transducer stack.'
      }
    ]
  },

  'molding-press': {
    id: 'molding-press',
    name: 'Auto Molding Press',
    shortName: 'Molding Press',
    codePrefix: 'MP',
    processStage: 'Bay 4: Encapsulation & Mold Chase',
    purpose: 'Encapsulates the bonded semiconductor assembly in high-grade thermoset epoxy molding compound (EMC).',
    description: 'Multi-plunger epoxy mold encapsulation press with heated platens (175°C) and automated degate trimmer.',
    aiRelevance: [
      'Hydraulic pressure gradient deviation',
      'Plunger force and injection profile anomalies',
      'Mold chase temperature uniformity detection',
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
        normalRange: [170.0, 180.0],
        warningThreshold: { max: 190.0 },
        criticalThreshold: { max: 205.0 },
        description: 'Upper and lower mold chase heating platen temperature.'
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

  'aoi-inspection': {
    id: 'aoi-inspection',
    name: '3D Optical AOI Inspection',
    shortName: '3D AOI',
    codePrefix: 'AOI',
    processStage: 'Bay 5A: 3D Optical AOI Metrology',
    purpose: 'Inspects molded packages for surface defects, coplanarity, foreign material, and lead deformities in 3D.',
    description: 'Automated 3D optical metrology with multi-angle RGB+W dome illumination and high-speed line-scan sensor.',
    aiRelevance: [
      'Optical camera carriage tracking jitter',
      'Lighting LED array intensity decay',
      'False-reject rate anomaly detection',
      'Sub-micron metrology drift tracking'
    ],
    sensors: [
      {
        id: 'vibration_camera_gantry',
        name: 'Camera Gantry Vibration',
        unit: 'mm/s',
        min: 0.0,
        max: 1.0,
        normalRange: [0.04, 0.12],
        warningThreshold: { max: 0.25 },
        criticalThreshold: { max: 0.5 },
        description: 'Vibration of the high-speed optical line-scan gantry.'
      },
      {
        id: 'temp_optics',
        name: 'Optical Sensor Temp',
        unit: '°C',
        min: 15.0,
        max: 45.0,
        normalRange: [21.0, 25.0],
        warningThreshold: { max: 30.0 },
        criticalThreshold: { max: 38.0 },
        description: 'Thermal stabilization temperature of the line-scan CMOS sensor.'
      },
      {
        id: 'optical_intensity',
        name: 'Illumination Uniformity',
        unit: '%',
        min: 0.0,
        max: 100.0,
        normalRange: [95.0, 100.0],
        warningThreshold: { max: 90.0 },
        criticalThreshold: { max: 82.0 },
        description: 'Multi-angle RGB+W dome LED light calibration output.'
      }
    ]
  },

  'x-ray-inspection': {
    id: 'x-ray-inspection',
    name: 'Microfocus X-Ray NDT',
    shortName: 'X-Ray NDT',
    codePrefix: 'XR',
    processStage: 'Bay 5B: Lead-Shielded X-Ray',
    purpose: 'Performs non-destructive volumetric inspection for internal voiding, wire sweep, and package delamination.',
    description: 'Lead-shielded non-destructive microfocus X-ray inspection for solder voiding and wire sweep analysis.',
    aiRelevance: [
      'X-ray tube cathode current stability',
      'Detector cooler temperature regulation',
      'Lead shielding interlock integrity',
      'Automated void percentage calculation'
    ],
    sensors: [
      {
        id: 'tube_voltage',
        name: 'X-Ray Tube High Voltage',
        unit: 'kV',
        min: 0.0,
        max: 160.0,
        normalRange: [120.0, 140.0],
        warningThreshold: { max: 150.0 },
        criticalThreshold: { max: 158.0 },
        description: 'Microfocus tube acceleration potential.'
      },
      {
        id: 'tube_temp',
        name: 'X-Ray Tube Target Temp',
        unit: '°C',
        min: 20.0,
        max: 75.0,
        normalRange: [32.0, 42.0],
        warningThreshold: { max: 55.0 },
        criticalThreshold: { max: 68.0 },
        description: 'Tungsten target cooling water loop temperature.'
      },
      {
        id: 'vibration_stage',
        name: 'Sample Stage Vibration',
        unit: 'mm/s',
        min: 0.0,
        max: 1.5,
        normalRange: [0.1, 0.3],
        warningThreshold: { max: 0.6 },
        criticalThreshold: { max: 0.9 },
        description: '5-axis robotic sample stage manipulation jitter.'
      }
    ]
  },

  'laser-marking': {
    id: 'laser-marking',
    name: 'Galvo Fiber Laser Marker',
    shortName: 'Laser Marker',
    codePrefix: 'LM',
    processStage: 'Bay 5C: Laser Marking Cell',
    purpose: 'Engraves high-density 2D DataMatrix lot tracking codes and IC part numbers onto package tops.',
    description: 'Class 1 galvanometer fiber laser station for high-density 2D DataMatrix lot code engraving and vision mark verification.',
    aiRelevance: [
      'Fiber laser diode pump current tracking',
      'Galvo mirror galvanometer thermal drift',
      'Exhaust air velocity monitoring',
      'Mark contrast and OCR read rate tracking'
    ],
    sensors: [
      {
        id: 'laser_power',
        name: 'Fiber Laser Peak Power',
        unit: 'W',
        min: 0.0,
        max: 50.0,
        normalRange: [25.0, 35.0],
        warningThreshold: { max: 42.0 },
        criticalThreshold: { max: 48.0 },
        description: 'Fiber laser diode pump emission power.'
      },
      {
        id: 'galvo_temp',
        name: 'Galvo Head Temp',
        unit: '°C',
        min: 15.0,
        max: 50.0,
        normalRange: [25.0, 32.0],
        warningThreshold: { max: 38.0 },
        criticalThreshold: { max: 45.0 },
        description: 'Galvanometer mirror servo driver temperature.'
      },
      {
        id: 'exhaust_flow',
        name: 'Fume Exhaust Velocity',
        unit: 'm/s',
        min: 0.0,
        max: 20.0,
        normalRange: [8.0, 14.0],
        warningThreshold: { max: 6.0 },
        criticalThreshold: { max: 4.0 },
        description: 'Scrubber duct extraction velocity for vaporized epoxy resin.'
      }
    ]
  },

  'test-handler': {
    id: 'test-handler',
    name: 'IC Tri-Temp Test Handler',
    shortName: 'Test Handler',
    codePrefix: 'TH',
    processStage: 'Bay 6A: Tri-Temp Final Test',
    purpose: 'Executes parametric electrical validation across tri-temp (-55°C to +150°C) and sorts ICs into bins.',
    description: 'Automated IC pick-and-place handler with -55°C to +150°C thermal soak chamber and multi-bin sort.',
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
        name: 'Thermal Soak Temp',
        unit: '°C',
        min: -60.0,
        max: 165.0,
        normalRange: [-45.0, 95.0],
        warningThreshold: { max: 110.0 },
        criticalThreshold: { max: 140.0 },
        description: 'Thermal soak test chamber operational temperature.'
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
  },

  'tape-reel': {
    id: 'tape-reel',
    name: 'Tape & Reel Packaging System',
    shortName: 'Tape & Reel',
    codePrefix: 'TR',
    processStage: 'Bay 6B: Tape & Reel Packaging',
    purpose: 'Pockets tested IC devices into carrier tape with automated optical seal inspection and reel winders.',
    description: 'High-speed carrier tape packaging module with optical seal inspection and 13-inch ESD take-up reels.',
    aiRelevance: [
      'Carrier tape indexing stepper motor vibration',
      'Cover tape sealing bar heater drift',
      'Vacuum pocket pick-and-place seal integrity',
      'Carrier tape peel force consistency'
    ],
    sensors: [
      {
        id: 'vibration_indexer',
        name: 'Indexer Vibration',
        unit: 'mm/s',
        min: 0.0,
        max: 2.0,
        normalRange: [0.15, 0.45],
        warningThreshold: { max: 0.75 },
        criticalThreshold: { max: 1.1 },
        description: 'Carrier tape high-speed indexing motor vibration.'
      },
      {
        id: 'temp_sealer',
        name: 'Heat Seal Bar Temp',
        unit: '°C',
        min: 50.0,
        max: 240.0,
        normalRange: [165.0, 185.0],
        warningThreshold: { max: 198.0 },
        criticalThreshold: { max: 215.0 },
        description: 'Cover tape thermal pressure sealer temperature.'
      },
      {
        id: 'peel_force',
        name: 'Tape Peel Force',
        unit: 'N',
        min: 0.0,
        max: 2.0,
        normalRange: [0.2, 0.7],
        warningThreshold: { max: 1.1 },
        criticalThreshold: { max: 1.5 },
        description: 'Continuously monitored cover tape adhesion peel force.'
      }
    ]
  }
};

// Aliases for legacy snake_case IDs
MACHINE_TYPES['wafer_dicing'] = MACHINE_TYPES['wafer-saw'];
MACHINE_TYPES['die_attacher'] = MACHINE_TYPES['die-attach'];
MACHINE_TYPES['wire_bonder'] = MACHINE_TYPES['wire-bonding'];
MACHINE_TYPES['molding'] = MACHINE_TYPES['molding-press'];
MACHINE_TYPES['ic_tester'] = MACHINE_TYPES['test-handler'];

export const MACHINE_TYPE_LIST: MachineTypeDefinition[] = [
  MACHINE_TYPES['wafer-saw'],
  MACHINE_TYPES['stocker'],
  MACHINE_TYPES['die-attach'],
  MACHINE_TYPES['plasma-cleaner'],
  MACHINE_TYPES['wire-bonding'],
  MACHINE_TYPES['molding-press'],
  MACHINE_TYPES['aoi-inspection'],
  MACHINE_TYPES['x-ray-inspection'],
  MACHINE_TYPES['laser-marking'],
  MACHINE_TYPES['test-handler'],
  MACHINE_TYPES['tape-reel'],
];
