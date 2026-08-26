import { Machine, MachineCategory, MaintenanceTask, CommunicationChannelType } from '../../types/factory';

// ─── Types for Auto Maintenance Agent ────────────────────────────────────────

export type DiagnosisUrgency =
  | 'CRITICAL_BREAKDOWN'
  | 'OPTIMAL_WINDOW'
  | 'PREVENTIVE_WATCH'
  | 'HEALTHY'
  | 'OFFLINE_HALTED'
  | 'IN_MAINTENANCE';

export interface SensorDelta {
  sensorId: string;
  sensorName: string;
  currentValue: number;
  baseline: number;
  threshold: number;
  deviationPct: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
}

export interface AgentScenario {
  headline: string;
  whatHappened: string;
  physicalMechanism: string;
  riskProgression: string;
  scrapRiskEstimate: string;
  sopReference: string;
  recommendedAction: string;
  requiredParts: string[];
  assignedTechnician: string;
  technicianRole: string;
  communicationChannel: {
    type: CommunicationChannelType;
    label: string;
    address: string;
  };
  recommendedServiceDate: Date;
  recommendedServiceDateStr: string;
  estimatedDowntimeHours: number;
  // Exact Anomaly & Resolution Details Matching Machines Tab
  anomalyTitle?: string;
  anomalySeverity?: 'CRITICAL' | 'WARNING' | 'MEDIUM' | 'INFO';
  anomalySensor?: string;
  aiIdentifiedCondition?: string;
  aiManualReference?: string;
  rootCauseTags?: string[];
}

export interface MachineDiagnosis {
  machineId: string;
  machineName: string;
  machineCategory: string;
  processStage: string;
  location: string;
  healthScore: number;
  currentRul: number;
  status: Machine['status'];
  urgency: DiagnosisUrgency;
  urgencyLabel: string;
  urgencyColor: string;
  anomaliesDetected: {
    id: string;
    type: string;
    description: string;
    severity: string;
    sensor: string;
  }[];
  sensorDeltas: SensorDelta[];
  scenario: AgentScenario;
}

export interface AgentFacilityOverview {
  generatedAt: string;
  totalMachines: number;
  criticalCount: number;
  optimalWindowCount: number;
  healthyCount: number;
  offlineCount: number;
  preventedDowntimeHours: number;
  estimatedScrapRiskCost: string;
  executiveSummary: string;
  diagnoses: MachineDiagnosis[];
}

// ─── Machine Failure Dossier Knowledge Base from Technical Manuals ─────────────

const MACHINE_SCENARIOS: Record<string, Partial<AgentScenario>> = {
  'WB-04': {
    headline: 'Ultrasonic Transducer Resonance Drift & NSOP Risk',
    whatHappened:
      'Transducer head vibration reached 2.85 mm/s (warning threshold 1.2 mm/s) with resonance shift (+4.2 kHz) causing NSOP risk during 18µm Cu bonding.',
    physicalMechanism:
      'PZT piezo ceramic transducer resonance drift and capillary tool tip erosion from high-speed copper ball thermosonic bonding cycles.',
    riskProgression:
      'Non-stick on pad (NSOP), lifted ball bonds, and open-circuit micro-interconnect defects if capillary is not replaced and resonance retuned within 24h.',
    scrapRiskEstimate: '$28,000 in high-density multi-chip module lots',
    sopReference: 'SOP-WB-910: Ultrasonic Transducer & Capillary Replacement',
    recommendedAction:
      'Replace capillary tool (25µm ceramic), retune PZT piezo transducer stack resonance frequency at 138.4 kHz, and verify bond pull strength > 6.5g.',
    requiredParts: ['Capillary Tool 25µm Ceramic', 'PZT Transducer Stack Calibrator', 'High-Purity Au/Cu Calibration Wire'],
    assignedTechnician: 'Kenji Sato',
    technicianRole: 'Lead Ultrasonic Wire Bond Specialist',
    communicationChannel: {
      type: 'WHATSAPP',
      label: 'WhatsApp (+1-555-019-8834)',
      address: '+1-555-019-8834',
    },
    estimatedDowntimeHours: 2.5,
    anomalyTitle: 'Ultrasonic Transducer Resonance Drift',
    anomalySeverity: 'WARNING',
    anomalySensor: 'Ultrasonic Vibration (vibration_ultrasonic)',
    aiIdentifiedCondition: 'Ultrasonic Transducer Resonance Frequency Shift',
    aiManualReference: "Wire Bonder Manual Section 9 Diagnostic Scenario 'SCEN-WB-002'",
    rootCauseTags: ['Piezoelectric transducer drift', 'Capillary tip wear', 'Resonance mismatch'],
  },
  'WS-02': {
    headline: 'High-Speed Spindle Ceramic Bearing Harmonic Micro-Spalling',
    whatHappened:
      'Spindle radial vibration elevated to 0.42 mm/s at 30,000 RPM. Motor load elevated by 12% indicating early blade micro-binding.',
    physicalMechanism:
      'Micro-pitting on spindle air-bearing ceramic races caused by silicon slurry ingress past the labyrinth seal.',
    riskProgression:
      'Wafer backside chipping along die scribe lines and potential high-speed spindle wobble.',
    scrapRiskEstimate: '$31,000 in GaN power semiconductor wafers',
    sopReference: 'SOP-DIC-214: Spindle Bearing & Diamond Blade Re-Truing',
    recommendedAction:
      'Schedule maintenance within 24h window. Replace hubbed diamond dicing blade, flush deionized coolant flow, and balance spindle.',
    requiredParts: ['Resinoid Diamond Blade 2-inch Hubbed', 'Labyrinth Seal Gasket', 'High-Purity Spindle Synthetic Lubricant'],
    assignedTechnician: 'Kenji Sato',
    technicianRole: 'Precision Machining & Spindle Engineer',
    communicationChannel: {
      type: 'EMAIL',
      label: 'Email (kenji.sato@vectorai.internal)',
      address: 'kenji.sato@vectorai.internal',
    },
    estimatedDowntimeHours: 1.5,
    anomalyTitle: 'Spindle Bearing Harmonic Anomaly',
    anomalySeverity: 'WARNING',
    anomalySensor: 'Spindle Radial Vibration (vibration_spindle)',
    aiIdentifiedCondition: 'Ceramic Bearing Raceway Micro-Spalling',
    aiManualReference: "Wafer Saw Manual Section 7 Diagnostic Scenario 'SCEN-DIC-001'",
    rootCauseTags: ['Silicon slurry ingress past labyrinth seal', 'Ceramic ball abrasive wear', 'Blade hub deflection'],
  },
  'DA-02': {
    headline: 'Vacuum Collet Pickup Timing & Ejector Pin Calibration',
    whatHappened:
      'Collet vacuum pressure registered -80 kPa with slight pickup timing variance during multi-die transfer.',
    physicalMechanism:
      'Vacuum line micro-filter particulate loading and central ejector needle tip surface wear.',
    riskProgression:
      'Minor die placement tilt and epoxy bond-line thickness (BLT) variance if uncorrected.',
    scrapRiskEstimate: '$14,000 in flip-chip die assemblies',
    sopReference: 'SOP-DA-501: Wafer Table Ejector Mechanism & Coordinate Re-Teaching',
    recommendedAction:
      'Flush vacuum solenoid filter, re-teach pickup coordinates, and verify optical fiducial camera calibration.',
    requiredParts: ['Vacuum Line Filter Cartridge', 'Ejector Pin Set (0.3mm)', 'Silicone Pick-Up Collet'],
    assignedTechnician: 'Marcus Thorne',
    technicianRole: 'Die Attach Systems Specialist',
    communicationChannel: {
      type: 'EMAIL',
      label: 'Email (marcus.thorne@vectorai.internal)',
      address: 'marcus.thorne@vectorai.internal',
    },
    estimatedDowntimeHours: 1.0,
    anomalyTitle: 'Collet Vacuum Line Minor Variance',
    anomalySeverity: 'INFO',
    anomalySensor: 'Collet Vacuum Pressure (pressure_vacuum)',
    aiIdentifiedCondition: 'Vacuum Filter Particulate Buildup',
    aiManualReference: "Die Bonder Manual Section 11 Diagnostic Scenario 'SCEN-DA-005'",
    rootCauseTags: ['Vacuum line particulate accumulation', 'Ejector needle wear'],
  },
  'MP-02': {
    headline: 'Hydraulic Platen Ram Seal & Degate Trimmer Inspection',
    whatHappened:
      'Hydraulic clamp pressure stable at 138 bar; platen temperature registered 174.8°C with nominal transfer curve.',
    physicalMechanism:
      'Epoxy molding compound (EMC) resin flash micro-accumulation in mold chase air vents.',
    riskProgression: 'Controlled state: Routine preventive window approaching in 14 days.',
    scrapRiskEstimate: '$0 (Proactive Service)',
    sopReference: 'SOP-MOL-301: EMC Mold Cavity Descaling & Seal Inspection',
    recommendedAction:
      'Execute scheduled air vent descaling, inspect platen thermocouple calibration, and verify degassing vacuum.',
    requiredParts: ['Mold Cavity Release Agent (High Temp)', 'Hydraulic O-Ring Seal Kit'],
    assignedTechnician: 'Marcus Thorne',
    technicianRole: 'Encapsulation Systems Engineer',
    communicationChannel: {
      type: 'EMAIL',
      label: 'Email (marcus.thorne@vectorai.internal)',
      address: 'marcus.thorne@vectorai.internal',
    },
    estimatedDowntimeHours: 2.0,
    anomalyTitle: 'Routine Platen Descaling Scheduled',
    anomalySeverity: 'INFO',
    anomalySensor: 'Mold Platen Thermocouple (temperature_mold)',
    aiIdentifiedCondition: 'Preventive Interval Window Approaching',
    aiManualReference: 'Molding Technical Manual SOP-MOL-301',
    rootCauseTags: ['EMC resin flash micro-accumulation', 'Preventive interval trigger'],
  },
  'TH-01': {
    headline: 'Tri-Temp Test Soak Thermal Calibration & Socket Contact Check',
    whatHappened:
      'Thermal soak chamber temperature stable at +85°C. Handler vibration 0.52 mm/s (nominal).',
    physicalMechanism:
      'Kelvin socket probe contact cycle accumulation after 120,000 DUT touch-downs.',
    riskProgression: 'Nominal operation: Contact resistance within 25 mΩ specification.',
    scrapRiskEstimate: '$0 (Nominal Test)',
    sopReference: 'SOP-ATE-605: Handler Linear Rail & Pogo Pin Replacement',
    recommendedAction:
      'Clean Kelvin socket test pins with optical contact brush and verify soak chamber thermistor calibration.',
    requiredParts: ['Kelvin Test Socket Insert', 'Pogo Pin Contact Set (128-pin)', 'Optical Encoder Cleaner'],
    assignedTechnician: 'Kenji Sato',
    technicianRole: 'ATE Test Cell Automation Specialist',
    communicationChannel: {
      type: 'WHATSAPP',
      label: 'WhatsApp (+1-555-019-8834)',
      address: '+1-555-019-8834',
    },
    estimatedDowntimeHours: 1.0,
    anomalyTitle: 'Socket Contact Cycle Check',
    anomalySeverity: 'INFO',
    anomalySensor: 'Socket Actuator Load (load_actuator)',
    aiIdentifiedCondition: 'Routine Socket Inspection',
    aiManualReference: 'ATE Technical Manual SOP-ATE-605',
    rootCauseTags: ['DUT touch-down cycle count', 'Contact resistance check'],
  },
  'ATE-002': {
    headline: 'Carriage Track Alignment & Optical Jitter Drift',
    whatHappened:
      'Optical alignment sensor tracking error and pneumatic carriage micro-chatter during high-speed device binning cycle. Handler vibration reached 0.95 mm/s (critical limit 0.90 mm/s).',
    physicalMechanism:
      'Handler Theta Rotation Backlash & Misalignment (SCEN-ATE-009). Optical alignment sensor tracking error and theta stepper motor coupling set screw looseness with rotary optical home sensor contamination.',
    riskProgression:
      'Sorting accuracy theta error increases to ± 1.2 degrees, leading to false test binning rejects, package lead deformation, and DUT interface socket pogo pin wear.',
    scrapRiskEstimate: '$24,000 in false failure binning scrap',
    sopReference: 'SOP-ATE-605: Handler Linear Rail & Pogo Pin Replacement',
    recommendedAction:
      'Tighten motor shaft coupling set screw with threadlocker. Clean home optical sensor and replace pogo pin contact blocks.',
    requiredParts: ['High-Frequency Pogo Pin Block (128-pin)', 'Linear Guide Cleanroom Grease', 'Optical Encoder Cleaner'],
    assignedTechnician: 'Kenji Sato',
    technicianRole: 'ATE Test Cell Automation Specialist',
    communicationChannel: {
      type: 'WHATSAPP',
      label: 'WhatsApp (+1-555-019-8834)',
      address: '+1-555-019-8834',
    },
    estimatedDowntimeHours: 1.2,
    anomalyTitle: 'Carriage Track Alignment & Optical Jitter Drift',
    anomalySeverity: 'MEDIUM',
    anomalySensor: 'Optical Alignment Sensor / Handler Vibration',
    aiIdentifiedCondition: 'Handler Theta Rotation Backlash & Misalignment',
    aiManualReference: "Machine Manual Section 11 Diagnostic Scenario 'SCEN-ATE-009'",
    rootCauseTags: ['Harmonic drive theta gearbox wear', 'Theta stepper motor coupling set screw loose', 'Rotary optical home sensor dirty'],
  },
  'DA-002': {
    headline: 'Collet Vacuum Seal Leakage & Arm Jerk',
    whatHappened:
      'Vacuum pressure dropped to -52 kPa causing 3 die misalignment drop events in 30 mins.',
    physicalMechanism:
      'Wafer Ejector Pin Misalignment and Silicon Chipping (SCEN-DA-005). Central ejector pin tip bent from tape puncture collision and wafer expander ring tension relaxation.',
    riskProgression:
      'Imminent die cracking, scratched active passivated silicon layers, and catastrophic substrate misplacement if unaddressed.',
    scrapRiskEstimate: '$42,500 in 300mm diced wafer dies',
    sopReference: 'SOP-DA-501: Wafer Table Ejector Mechanism & Coordinate Re-Teaching',
    recommendedAction:
      'Replace 4-pin ejector set. Re-teach wafer table ejector X-Y-Z coordinates with alignment fixture.',
    requiredParts: ['4-Pin Ejector Needle Set (0.3mm)', 'Wafer Expander Grip Ring', 'Alignment Fixture Calibration Jig'],
    assignedTechnician: 'Sarah Jenkins',
    technicianRole: 'Senior Electro-Mechanical Specialist',
    communicationChannel: {
      type: 'EMAIL',
      label: 'Email (sarah.jenkins@vectorai.internal)',
      address: 'sarah.jenkins@vectorai.internal',
    },
    estimatedDowntimeHours: 1.5,
    anomalyTitle: 'Collet Vacuum Seal Leakage & Arm Jerk',
    anomalySeverity: 'CRITICAL',
    anomalySensor: 'Collet Vacuum Pressure (pressure_vacuum)',
    aiIdentifiedCondition: 'Wafer Ejector Pin Misalignment and Silicon Chipping',
    aiManualReference: "Machine Manual Section 11 Diagnostic Scenario 'SCEN-DA-005'",
    rootCauseTags: ['Central ejector pin tip bent from tape puncture collision', 'Wafer expander ring tension relaxed', 'Ejector Z-axis motor zero-position lost'],
  },
  'WB-003': {
    headline: 'Piezo-Electric Transducer Thermal Runaway & Acoustic Decoupling',
    whatHappened:
      'Transducer head temperature spiked to 69.4°C (critical limit 65.0°C). Ultrasonic resonance frequency decoupled at 138 kHz, causing incomplete gold ball stitch bonds.',
    physicalMechanism:
      'Thermal expansion inside the PZT ceramic ring stack causing acoustic impedance mismatch and high dielectric losses during continuous high-density bonding (SCEN-WB-002).',
    riskProgression:
      'Lifted stitch bonds, open-circuit package failures, and thermal cracking of wire bonder capillary horn.',
    scrapRiskEstimate: '$68,000 in BGA automotive substrate lots',
    sopReference: 'SOP-WB-910: Ultrasonic Transducer Emergency Replacement',
    recommendedAction:
      'Immediate emergency halt. Isolate WB-003, allow horn cooling, replace piezo transducer stack, and recalibrate resonance frequency at 138.4 kHz.',
    requiredParts: ['Piezoelectric Transducer Horn 138kHz', 'Ceramic Capillary Tip (Gold Wire)', 'Thermal Interface Paste'],
    assignedTechnician: 'Kenji Sato',
    technicianRole: 'Lead Ultrasonic Wire Bond Specialist',
    communicationChannel: {
      type: 'WHATSAPP',
      label: 'WhatsApp (+1-555-019-8834)',
      address: '+1-555-019-8834',
    },
    estimatedDowntimeHours: 2.0,
    anomalyTitle: 'Piezo Transducer Thermal Runaway',
    anomalySeverity: 'CRITICAL',
    anomalySensor: 'Transducer Horn Thermocouple (temperature_transducer)',
    aiIdentifiedCondition: 'Ultrasonic PZT Stack Thermal Saturation & Acoustic Decoupling',
    aiManualReference: "Machine Manual Section 9 Diagnostic Scenario 'SCEN-WB-002'",
    rootCauseTags: ['PZT ceramic ring stack dielectric loss', 'Thermal paste dry-out', 'Capillary horn acoustic impedance drift'],
  },
  'DIC-002': {
    headline: 'High-Speed Spindle Ceramic Bearing Harmonic Micro-Spalling',
    whatHappened:
      'Spindle vibration FFT analysis captured elevated 3.6 mm/s harmonics at 60,000 RPM (critical threshold 1.4 mm/s). Motor load elevated by 24% indicating blade binding.',
    physicalMechanism:
      'Micro-pitting and abrasive wear on the spindle ceramic ball bearings caused by fine silicon slurry ingress past the labyrinth seal (SCEN-DIC-001).',
    riskProgression:
      'Chipping along wafer scribe lines, silicon micro-cracking, and potential high-speed spindle seizure.',
    scrapRiskEstimate: '$31,000 in GaN power semiconductor wafers',
    sopReference: 'SOP-DIC-214: Spindle Bearing & Diamond Blade Re-Truing',
    recommendedAction:
      'Schedule maintenance within the 24h optimal window. Replace resinoid diamond dicing blade (hubbed), flush deionized coolant flow, and re-torque spindle bearings.',
    requiredParts: ['Resinoid Diamond Blade 2-inch Hubbed', 'Labyrinth Seal Gasket', 'High-Purity Spindle Synthetic Lubricant'],
    assignedTechnician: 'David Kim',
    technicianRole: 'Precision Machining & Spindle Engineer',
    communicationChannel: {
      type: 'EMAIL',
      label: 'Email (david.kim@vectorai.internal)',
      address: 'david.kim@vectorai.internal',
    },
    estimatedDowntimeHours: 2.5,
    anomalyTitle: 'Spindle Bearing Harmonic Anomaly',
    anomalySeverity: 'WARNING',
    anomalySensor: 'Spindle Radial Vibration (vibration_spindle)',
    aiIdentifiedCondition: 'Ceramic Bearing Raceway Micro-Spalling',
    aiManualReference: "Machine Manual Section 7 Diagnostic Scenario 'SCEN-DIC-001'",
    rootCauseTags: ['Silicon slurry ingress past labyrinth seal', 'Ceramic ball abrasive wear', 'Blade hub deflection'],
  },
  'WB-024': {
    headline: 'Leadframe Clamping Hydraulic Force & Ultrasonic Harmonic Drift',
    whatHappened:
      'Leadframe mechanical clamping force surged to 84 N (+18% above nominal mean). Ultrasonic vibration flutter detected during dense quad-flat wire bonding cycles.',
    physicalMechanism:
      'Pneumatic regulator pressure drift on clamp cylinder #2 and acoustic dampening caused by leadframe epoxy bleed residue on clamp anvils (SCEN-WB-005).',
    riskProgression:
      'Die substrate tilt, inconsistent wire loop heights, and package lead deformation.',
    scrapRiskEstimate: '$18,500 in quad-flat package assemblies',
    sopReference: 'SOP-WB-118: Clamp Anvil Calibration & Pneumatic Tuning',
    recommendedAction:
      'Perform scheduled maintenance in the next shift window. Clean clamp anvil surfaces with ultrasonic isopropyl bath, adjust pneumatic regulator, and check transducer torque.',
    requiredParts: ['Pneumatic Clamp Cylinder Seal Kit', 'Hardened Clamp Anvil Plate', 'Tension Gauge'],
    assignedTechnician: 'Kenji Sato',
    technicianRole: 'Lead Ultrasonic Wire Bond Specialist',
    communicationChannel: {
      type: 'WHATSAPP',
      label: 'WhatsApp (+1-555-019-8834)',
      address: '+1-555-019-8834',
    },
    estimatedDowntimeHours: 1.0,
    anomalyTitle: 'Ultrasonic Harmonics Drift & Clamp Elevation',
    anomalySeverity: 'WARNING',
    anomalySensor: 'Leadframe Clamp Load Cell (load_clamp)',
    aiIdentifiedCondition: 'Clamp Pressure Drift & Epoxy Bleed Dampening',
    aiManualReference: "Machine Manual Section 10 Diagnostic Scenario 'SCEN-WB-005'",
    rootCauseTags: ['Clamp cylinder #2 regulator drift', 'Epoxy bleed resin residue on anvil', 'Ultrasonic energy damping'],
  },
  'DIC-003': {
    headline: 'Edge Telemetry Gateway Power Offline // Cleanroom Electrical Maintenance',
    whatHappened:
      'Edge MQTT telemetry stream dropped to zero. Machine physical main breaker turned off for cleanroom facility power grid upgrade.',
    physicalMechanism:
      'Deliberate electrical lock-out / tag-out (LOTO) for scheduled power distribution sub-panel maintenance.',
    riskProgression: 'None (controlled offline state). Machine ready for post-power calibration once power restores.',
    scrapRiskEstimate: '$0 (Planned Downtime)',
    sopReference: 'SOP-FAC-012: Post-Power Substation Re-Commissioning',
    recommendedAction:
      'Verify power distribution sub-panel completion, re-engage circuit breakers, perform zero-point optical homing calibration, and verify MQTT gateway telemetry handshake.',
    requiredParts: ['Gateway Fuse 10A', 'Calibration Silicon Test Wafer'],
    assignedTechnician: 'David Kim',
    technicianRole: 'Facility & Equipment Engineer',
    communicationChannel: {
      type: 'EMAIL',
      label: 'Email (david.kim@vectorai.internal)',
      address: 'david.kim@vectorai.internal',
    },
    estimatedDowntimeHours: 0.5,
    anomalyTitle: 'Telemetry Connection Lost',
    anomalySeverity: 'CRITICAL',
    anomalySensor: 'Edge Gateway Telemetry Stream',
    aiIdentifiedCondition: 'Substation Electrical Lockout (Planned)',
    aiManualReference: 'Facility Substation Maintenance Protocol SOP-FAC-012',
    rootCauseTags: ['Facility electrical upgrade', 'Main power switch LOTO', 'Zero telemetry packet handshake'],
  },
  'MOLD-002': {
    headline: 'Scheduled Preventive Overhaul // Hydraulic Mold Cavity Degreasing',
    whatHappened:
      'Machine currently in offline maintenance mode. Technicians completing scheduled 1,000-hour preventive mold cavity cleaning and hydraulic seal inspection.',
    physicalMechanism:
      'Epoxy molding compound (EMC) resin flash build-up in mold cavity air vents and hydraulic piston rod seal wear.',
    riskProgression: 'In progress: Technicians completing final torque inspection and resin degassing check.',
    scrapRiskEstimate: '$0 (Proactive Service)',
    sopReference: 'SOP-MOL-301: EMC Mold Cavity Descaling & Seal Inspection',
    recommendedAction:
      'Complete final air vent cleanings, inspect hydraulic clamp pressure at 150 bar, execute 3 dry dummy cycles, and sign off service ticket.',
    requiredParts: ['Mold Cavity Release Agent (High Temp)', 'Hydraulic O-Ring Seal Kit', 'Filter Cartridge 5-micron'],
    assignedTechnician: 'Sarah Jenkins',
    technicianRole: 'Molding & Packaging Specialist',
    communicationChannel: {
      type: 'EMAIL',
      label: 'Email (sarah.jenkins@vectorai.internal)',
      address: 'sarah.jenkins@vectorai.internal',
    },
    estimatedDowntimeHours: 3.0,
    anomalyTitle: 'Scheduled Preventive Overhaul Active',
    anomalySeverity: 'INFO',
    anomalySensor: 'Preventive Operating Hours Tracker',
    aiIdentifiedCondition: '1,000-Hour Scheduled Mold Cavity Overhaul',
    aiManualReference: 'Molding Technical Manual SOP-MOL-301',
    rootCauseTags: ['EMC resin flash accumulation', 'Hydraulic plunger seal micro-wear', 'Preventive interval trigger'],
  },
};

// ─── Default Scenario Generator for Healthy / Stable Machines ─────────────────

function generateDefaultScenario(rul: number, category: string): AgentScenario {
  const isHealthy = rul > 250;

  const hoursToService = Math.max(12, rul - 24);
  const targetDate = new Date(Date.now() + hoursToService * 3600 * 1000);

  const partsMap: Record<string, string[]> = {
    dicing: ['Diamond Dicing Blade (Hubbed)', 'Coolant Filter 2-micron', 'Labyrinth Seal Gasket'],
    'wafer-saw': ['Diamond Dicing Blade (Hubbed)', 'Coolant Filter 2-micron', 'Labyrinth Seal Gasket'],
    stocker: ['AMHS Robot Gripper Belt', 'HEPA Fan Filter Cartridge', 'N2 Purge Valve Seal'],
    die_attach: ['Silicone Suction Collet', 'Vacuum Solenoid Valve', 'Epoxy Dispense Needle (30G)'],
    'die-attach': ['Silicone Suction Collet', 'Vacuum Solenoid Valve', 'Epoxy Dispense Needle (30G)'],
    'plasma-cleaner': ['Vacuum Chamber O-Ring', 'RF Matching Network Capacitor', 'Argon Gas Mass Flow Filter'],
    wire_bond: ['Ceramic Capillary Tip (Gold Wire)', 'Piezo Transducer Horn', 'Clamp Anvil Kit'],
    'wire-bonding': ['Ceramic Capillary Tip (Gold Wire)', 'Piezo Transducer Horn', 'Clamp Anvil Kit'],
    molding: ['Mold Cavity Seal O-Ring', 'Hydraulic Plunger Filter', 'Thermal Thermocouple Type-K'],
    'molding-press': ['Mold Cavity Seal O-Ring', 'Hydraulic Plunger Filter', 'Thermal Thermocouple Type-K'],
    ate_sort: ['Pogo Pin Contact Set (64-pin)', 'Linear Guide Rail Grease', 'Vacuum Sucker Cup'],
    'aoi-inspection': ['Telecentric Optical Lens Wipe', 'RGB+W LED Dome Array', 'Gantry Linear Guide Grease'],
    'x-ray-inspection': ['Microfocus X-Ray Target Gasket', 'High-Voltage Cable Insulator', 'Lead Shield Seal'],
    'laser-marking': ['Galvo Mirror Cleanroom Wipe', 'Fiber Laser Collimator', 'F-Theta Scan Lens Protector'],
    'test-handler': ['Kelvin Test Socket Insert', 'Pogo Pin Contact Set (128-pin)', 'Optical Encoder Cleaner'],
    'tape-reel': ['Carrier Tape Heat Seal Bar', 'Indexer Stepper Belt', 'Optical Pocket Sensor'],
  };

  const techMap: Record<string, { name: string; role: string; email: string }> = {
    dicing: { name: 'David Kim', role: 'Dicing & Spindle Engineer', email: 'david.kim@vectorai.internal' },
    'wafer-saw': { name: 'Kenji Sato', role: 'Precision Dicing Specialist', email: 'kenji.sato@vectorai.internal' },
    stocker: { name: 'Elena Vance', role: 'AMHS Automation Engineer', email: 'elena.vance@vectorai.internal' },
    die_attach: { name: 'Marcus Thorne', role: 'Die Attach Specialist', email: 'marcus.thorne@vectorai.internal' },
    'die-attach': { name: 'Marcus Thorne', role: 'Die Attach Specialist', email: 'marcus.thorne@vectorai.internal' },
    'plasma-cleaner': { name: 'Elena Vance', role: 'Plasma & Surface Treatment Engineer', email: 'elena.vance@vectorai.internal' },
    wire_bond: { name: 'Kenji Sato', role: 'Ultrasonic Wire Bond Lead', email: 'kenji.sato@vectorai.internal' },
    'wire-bonding': { name: 'Kenji Sato', role: 'Ultrasonic Wire Bond Lead', email: 'kenji.sato@vectorai.internal' },
    molding: { name: 'Marcus Thorne', role: 'Encapsulation Systems Engineer', email: 'marcus.thorne@vectorai.internal' },
    'molding-press': { name: 'Marcus Thorne', role: 'Encapsulation Systems Engineer', email: 'marcus.thorne@vectorai.internal' },
    ate_sort: { name: 'Kenji Sato', role: 'ATE Test Cell Specialist', email: 'kenji.sato@vectorai.internal' },
    'aoi-inspection': { name: 'Elena Vance', role: 'Vision Metrology Specialist', email: 'elena.vance@vectorai.internal' },
    'x-ray-inspection': { name: 'Elena Vance', role: 'NDT Radiography Engineer', email: 'elena.vance@vectorai.internal' },
    'laser-marking': { name: 'Marcus Thorne', role: 'Laser Systems Technician', email: 'marcus.thorne@vectorai.internal' },
    'test-handler': { name: 'Kenji Sato', role: 'ATE Test Handler Engineer', email: 'kenji.sato@vectorai.internal' },
    'tape-reel': { name: 'Marcus Thorne', role: 'Packaging Systems Specialist', email: 'marcus.thorne@vectorai.internal' },
  };

  const tech = techMap[category] || techMap.dicing;
  const parts = partsMap[category] || partsMap.dicing;

  if (isHealthy) {
    return {
      headline: `Nominal Operation // Telemetry Stabilized across All Channels`,
      whatHappened: `Machine operating within 100% nominal baselines. No acoustic, vibration, or thermal drift detected. Current RUL sits comfortably at ${rul} hours with high model confidence.`,
      physicalMechanism: `Standard operational wear rates across mechanical contacts, bearings, and thermal elements with no accelerated degradation vectors.`,
      riskProgression: `Zero immediate risk. Scheduled routine inspection is projected after ${rul - 48} operating hours.`,
      scrapRiskEstimate: `$0 (Clean Production Window)`,
      sopReference: `SOP-GEN-100: Routine Condition-Based Monitoring`,
      recommendedAction: `Continue normal production. Monitor telemetry streams every 3s. No maintenance intervention needed at this stage.`,
      requiredParts: parts,
      assignedTechnician: tech.name,
      technicianRole: tech.role,
      communicationChannel: {
        type: 'EMAIL',
        label: 'Email (Routine Watch)',
        address: tech.email,
      },
      recommendedServiceDate: targetDate,
      recommendedServiceDateStr: targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      estimatedDowntimeHours: 1.0,
      anomalyTitle: 'No Active Anomalies',
      anomalySeverity: 'INFO',
      aiIdentifiedCondition: 'Nominal Operational State',
      rootCauseTags: ['All sensor channels within normal envelope'],
    };
  }

  return {
    headline: `Approaching Optimal Replacement Window (RUL: ${rul}h)`,
    whatHappened: `Sensor deviation trends show gradual wear accumulation on consumable components. Machine is entering the cost-effective 24h-72h preventive service window.`,
    physicalMechanism: `Normal mechanical friction and thermal cycling causing slight baseline drift on primary tooling fixtures.`,
    riskProgression: `If deferred beyond ${rul} hours, wear will transition into exponential breakdown phase with increased micro-chatter and yield loss.`,
    scrapRiskEstimate: `$12,000 in prospective batch yield risk`,
    sopReference: `SOP-${category.toUpperCase()}-200: Preventive Wear Calibration`,
    recommendedAction: `Plan maintenance execution in the upcoming shift change to replace primary consumable fixtures before critical threshold is reached.`,
    requiredParts: parts,
    assignedTechnician: tech.name,
    technicianRole: tech.role,
    communicationChannel: {
      type: 'EMAIL',
      label: 'Email (Scheduled Notice)',
      address: tech.email,
    },
    recommendedServiceDate: targetDate,
    recommendedServiceDateStr: targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    estimatedDowntimeHours: 1.5,
  };
}

// ─── Main Auto Maintenance Agent Evaluation Function ─────────────────────────

export function runAutoMaintenanceAgent(machines: Machine[]): AgentFacilityOverview {
  const diagnoses: MachineDiagnosis[] = [];
  let criticalCount = 0;
  let optimalWindowCount = 0;
  let healthyCount = 0;
  let offlineCount = 0;
  let totalPreventedDowntime = 0;

  machines.forEach((machine) => {
    const rul = machine.currentRul;
    const isStatusOffline = machine.status === 'OFFLINE' || machine.status === 'error';
    const isStatusMaint = machine.status === 'MAINT' || machine.status === 'maintenance';

    // Determine Urgency Level based on RUL & Status
    let urgency: DiagnosisUrgency = 'HEALTHY';
    let urgencyLabel = 'HEALTHY // OPTIMAL';
    let urgencyColor = 'var(--accent-green)';

    if (isStatusOffline) {
      urgency = 'OFFLINE_HALTED';
      urgencyLabel = 'OFFLINE // HALTED';
      urgencyColor = 'var(--text-muted)';
      offlineCount++;
    } else if (isStatusMaint) {
      urgency = 'IN_MAINTENANCE';
      urgencyLabel = 'IN MAINTENANCE';
      urgencyColor = 'var(--accent-blue)';
    } else if (rul <= 48 || machine.status === 'CRITICAL') {
      urgency = 'CRITICAL_BREAKDOWN';
      urgencyLabel = 'CRITICAL // IMMINENT BREAKDOWN';
      urgencyColor = 'var(--accent-red)';
      criticalCount++;
      totalPreventedDowntime += 18;
    } else if (rul <= 250 || machine.status === 'WARNING') {
      urgency = 'OPTIMAL_WINDOW';
      urgencyLabel = 'OPTIMAL SERVICE WINDOW';
      urgencyColor = 'var(--accent-green)';
      optimalWindowCount++;
      totalPreventedDowntime += 8;
    } else {
      urgency = 'HEALTHY';
      urgencyLabel = 'TELEMETRY STABLE';
      urgencyColor = 'var(--accent-blue)';
      healthyCount++;
    }

    // Build Sensor Deltas with baselines and thresholds
    const sensorDeltas: SensorDelta[] = (machine.sensors || []).map((s) => {
      const dev = s.deviation || 0;
      let status: 'normal' | 'warning' | 'critical' = 'normal';
      if (dev > 75 || s.value >= s.threshold) status = 'critical';
      else if (dev > 35) status = 'warning';

      return {
        sensorId: s.name,
        sensorName: s.label || s.name,
        currentValue: s.value,
        baseline: s.baseline,
        threshold: s.threshold,
        deviationPct: Math.round(dev),
        unit: s.unit,
        status,
      };
    });

    // Detect Anomalies (from machine.alerts or lookup)
    const anomaliesDetected = (machine.alerts || []).map((alertStr, idx) => ({
      id: `ANO-${machine.id}-${idx + 1}`,
      type: alertStr.split(':')[0] || 'Sensor Anomaly',
      description: alertStr.split(':')[1]?.trim() || alertStr,
      severity: urgency === 'CRITICAL_BREAKDOWN' ? 'critical' : 'warning',
      sensor: machine.sensors?.[0]?.label || 'Telemetry Channel',
    }));

    // Merge Known Scenario or Build Fallback
    const customScenario = MACHINE_SCENARIOS[machine.id];
    const baseScenario = generateDefaultScenario(rul, machine.category);

    const hoursToTarget = Math.max(8, rul <= 48 ? 12 : rul - 24);
    const targetDate = new Date(Date.now() + hoursToTarget * 3600 * 1000);

    const scenario: AgentScenario = {
      headline: customScenario?.headline || baseScenario.headline,
      whatHappened: customScenario?.whatHappened || baseScenario.whatHappened,
      physicalMechanism: customScenario?.physicalMechanism || baseScenario.physicalMechanism,
      riskProgression: customScenario?.riskProgression || baseScenario.riskProgression,
      scrapRiskEstimate: customScenario?.scrapRiskEstimate || baseScenario.scrapRiskEstimate,
      sopReference: customScenario?.sopReference || baseScenario.sopReference,
      recommendedAction: customScenario?.recommendedAction || baseScenario.recommendedAction,
      requiredParts: customScenario?.requiredParts || baseScenario.requiredParts,
      assignedTechnician: customScenario?.assignedTechnician || baseScenario.assignedTechnician,
      technicianRole: customScenario?.technicianRole || baseScenario.technicianRole,
      communicationChannel: customScenario?.communicationChannel || baseScenario.communicationChannel,
      recommendedServiceDate: targetDate,
      recommendedServiceDateStr: targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      estimatedDowntimeHours: customScenario?.estimatedDowntimeHours || baseScenario.estimatedDowntimeHours,
      anomalyTitle: customScenario?.anomalyTitle,
      anomalySeverity: customScenario?.anomalySeverity,
      anomalySensor: customScenario?.anomalySensor,
      aiIdentifiedCondition: customScenario?.aiIdentifiedCondition,
      aiManualReference: customScenario?.aiManualReference,
      rootCauseTags: customScenario?.rootCauseTags,
    };

    diagnoses.push({
      machineId: machine.id,
      machineName: machine.name,
      machineCategory: machine.category,
      processStage: machine.stage,
      location: machine.location,
      healthScore: machine.healthScore,
      currentRul: machine.currentRul,
      status: machine.status,
      urgency,
      urgencyLabel,
      urgencyColor,
      anomaliesDetected,
      sensorDeltas,
      scenario,
    });
  });

  // Calculate scrap risk total
  const estimatedScrapCost = `$${(criticalCount * 42000 + optimalWindowCount * 14000).toLocaleString()}`;

  const executiveSummary =
    criticalCount > 0
      ? `ATTENTION: Autonomous Maintenance Agent has identified ${criticalCount} machine node(s) sitting in the CRITICAL / IMMINENT BREAKDOWN window (RUL ≤ 48h), including high-impact anomalies on Die Attacher 02 and Wire Bonder 03. Immediate technician dispatch is recommended to protect approximately ${estimatedScrapCost} in cleanroom wafer lots.`
      : `FACILITY OPERATIONAL STATUS: All active machine lines are operating within designated safety margins. ${optimalWindowCount} machine(s) are positioned within the optimal preventive maintenance window (24h-72h) for cost-effective calibration.`;

  return {
    generatedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
    totalMachines: machines.length,
    criticalCount,
    optimalWindowCount,
    healthyCount,
    offlineCount,
    preventedDowntimeHours: totalPreventedDowntime,
    estimatedScrapRiskCost: estimatedScrapCost,
    executiveSummary,
    diagnoses,
  };
}

// ─── Autonomous Work Order Generator ──────────────────────────────────────────

export function generateAutonomousWorkOrders(diagnoses: MachineDiagnosis[]): MaintenanceTask[] {
  const newTasks: MaintenanceTask[] = [];

  diagnoses.forEach((diag) => {
    if (diag.urgency === 'CRITICAL_BREAKDOWN' || diag.urgency === 'OPTIMAL_WINDOW') {
      const isCrit = diag.urgency === 'CRITICAL_BREAKDOWN';
      const taskId = `WO-AUTO-${diag.machineId}-${Date.now().toString().slice(-4)}`;

      const task: MaintenanceTask = {
        id: taskId,
        machineId: diag.machineId,
        machineName: diag.machineName,
        machineCategory: (diag.machineCategory || 'dicing') as MachineCategory,
        priority: isCrit ? 'CRITICAL' : 'HIGH',
        status: 'SCHEDULED',
        scheduledTime: isCrit ? 'Immediate (Next 2 Hours)' : `Optimal Window (${diag.scenario.recommendedServiceDateStr})`,
        predictedFailureTime: `${diag.currentRul} hours`,
        technician: diag.scenario.assignedTechnician,
        partsRequired: diag.scenario.requiredParts,
        estimatedDuration: diag.scenario.estimatedDowntimeHours,
        communicationChannel: {
          type: diag.scenario.communicationChannel.type,
          label: diag.scenario.communicationChannel.label,
          address: diag.scenario.communicationChannel.address,
        },
        notificationLog: [
          {
            channel: diag.scenario.communicationChannel.type,
            channelAddress: diag.scenario.communicationChannel.address,
            sentAt: new Date().toISOString(),
            recipient: diag.scenario.assignedTechnician,
            subject: `[AUTONOMOUS DISPATCH] ${isCrit ? 'CRITICAL' : 'PREVENTIVE'} Service Order for ${diag.machineId}`,
            body: `ATTENTION: ${diag.scenario.assignedTechnician} (${diag.scenario.technicianRole})

A Condition-Based Maintenance work order (${taskId}) has been automatically dispatched by Vector.AI Auto Maintenance Agent for node ${diag.machineId} (${diag.machineName}).

■ TARGET MACHINE: ${diag.machineId} // ${diag.machineName}
■ LOCATION: ${diag.location}
■ PREDICTED RUL: ${diag.currentRul} Hours (Urgency: ${isCrit ? 'CRITICAL BREAKDOWN RISK' : 'OPTIMAL SERVICE BUFFER'})
■ FAULT NARRATIVE:
${diag.scenario.whatHappened}

■ ROOT CAUSE DEGRADATION:
${diag.scenario.physicalMechanism}

■ REQUIRED CONSUMABLES / SPARE PARTS:
${diag.scenario.requiredParts.map(p => `  • ${p}`).join('\n')}

■ RECOMMENDED SOP PROTOCOL:
${diag.scenario.sopReference} — ${diag.scenario.recommendedAction}

Please acknowledge receipt and transition the machine into MAINTENANCE mode upon physical arrival at the station.`,
            delivered: true,
          },
        ],
        progressPercent: isCrit ? 15 : 0,
        progressSteps: [
          { label: 'Agent Anomaly Detection & RUL Ingestion', status: 'DONE', completedAt: new Date().toISOString() },
          { label: 'Work Order & Spare Parts Allocation', status: 'DONE', completedAt: new Date().toISOString() },
          { label: `Dispatch Notification via ${diag.scenario.communicationChannel.type}`, status: 'DONE', completedAt: new Date().toISOString() },
          { label: 'Physical Technician Arrival & Lock-Out/Tag-Out (LOTO)', status: 'ACTIVE' },
          { label: 'Component Replacement & Sensor Calibration', status: 'PENDING' },
          { label: 'Baseline Zero-Point Verification & Sign-Off', status: 'PENDING' },
        ],
        diagnosisReport: {
          generatedAt: new Date().toISOString(),
          faultSummary: diag.scenario.whatHappened,
          estimatedRootCause: diag.scenario.physicalMechanism,
          sensorReadings: diag.sensorDeltas.map(s => ({
            sensor: s.sensorName,
            value: `${s.currentValue} ${s.unit}`,
            status: s.status === 'critical' ? 'CRITICAL' : s.status === 'warning' ? 'WARNING' : 'OK',
          })),
          recommendedActions: [
            diag.scenario.recommendedAction,
            `Follow cleanroom standard protocol: ${diag.scenario.sopReference}.`,
            `Ensure all replaced parts are logged and verify post-maintenance sensor baselines.`,
          ],
        },
      };

      newTasks.push(task);
    }
  });

  return newTasks;
}
