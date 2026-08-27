const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/User/Downloads/VectorAI';
const dataDir = path.join(projectRoot, 'data', 'machines');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const DISCLAIMER_TEXT = 
  "SYNTHETIC PROTOTYPE TECHNICAL MANUAL\n\n" +
  "This document is artificially generated for the VectorAI demonstration and software development.\n\n" +
  "The specifications, thresholds, service-life values, maintenance intervals, and operating parameters " +
  "are synthetic and must not be used for real industrial equipment operation or maintenance.";

const ALL_11_MACHINES = [
  // ── 1. WAFER SAW ─────────────────────────────────────────────────────────
  {
    filename: "wafer-saw",
    aliases: ["wafer-dicing-machine"],
    machine: {
      name: "300mm Precision Wafer Dicing Saw",
      type: "wafer-saw",
      prototypeMachineId: "WS-01",
      manualId: "VAI-MAN-WS-001",
      version: "1.0",
      generatedDate: "2026-08-27",
      documentStatus: "Synthetic Cleanroom Technical Manual",
      purpose: "VectorAI Demonstration and Operational Intelligence",
      disclaimer: DISCLAIMER_TEXT,
      processStage: "Bay 1: Wafer Dicing & Prep",
      description: "Dual-spindle 300mm wafer dicing system utilizing high-speed diamond blades (up to 60,000 RPM) with DI water cooling jets to singulate silicon, GaN, and GaAs wafers into discrete micro-dies.",
      manufacturingProcess: "Wafers mounted on UV dicing tape are placed on a porous ceramic vacuum chuck table. High-pressure DI water jets cool the blade kerf and flush silicon swarf while dual microscope cameras align scribe lanes with sub-micron precision.",
      subsystems: [
        "Air-Bearing High-Speed Spindle Assembly",
        "Porous Ceramic Vacuum Chuck & Work Stage",
        "DI Water Coolant Delivery & Jet Nozzle System",
        "High-Resolution Vision Alignment & Kerf Inspection Optical System",
        "Diamond Blade Flange & Auto-Contact Touch Sensor",
        "Dressing Board Mechanism for Blade Sharpening"
      ]
    },
    components: [
      { name: "Air-Bearing Spindle Assembly", function: "Drives diamond blade at 30,000 to 60,000 RPM with sub-micron radial runout.", importantParameters: "Spindle speed (RPM), radial vibration (mm/s), motor load (%).", degradationIndicators: "High-frequency harmonic vibration (>1.2 mm/s), bearing temperature rise." },
      { name: "Resinoid Diamond Blade", function: "Precision mechanical shearing along wafer scribe lines.", importantParameters: "Blade outer diameter, kerf width (µm), blade wear index (µm).", degradationIndicators: "Wafer backside chipping (>25µm), kerf widening, blade edge loading." },
      { name: "DI Water Coolant Delivery", function: "Cools cutting interface and evacuates silicon particulate swarf.", importantParameters: "Coolant temperature (°C), nozzle pressure (bar), resistivity (MΩ).", degradationIndicators: "Nozzle pressure drop (<1.5 bar), coolant temperature drift (>28°C)." },
      { name: "Porous Ceramic Vacuum Chuck", function: "Immobilizes wafer dicing tape carrier during high-velocity cutting.", importantParameters: "Holding vacuum (kPa), chuck table flatness (µm).", degradationIndicators: "Vacuum leakage (>-60 kPa), particulate clogging in ceramic pores." }
    ],
    sensors: [
      { sensorId: "vibration_spindle", name: "Spindle Radial Vibration", unit: "mm/s", purpose: "Monitors air-bearing dynamic stability and blade balance.", minScale: 0.0, maxScale: 3.0, normalRange: [0.1, 0.5], warningRange: [0.5, 1.2], criticalRange: [1.2, 3.0], direction: "HIGHER_IS_WORSE" },
      { sensorId: "temperature_coolant", name: "DI Water Coolant Temp", unit: "°C", purpose: "Measures coolant temperature delivered to cutting kerf.", minScale: 10.0, maxScale: 60.0, normalRange: [18.0, 24.0], warningRange: [24.0, 32.0], criticalRange: [32.0, 60.0], direction: "HIGHER_IS_WORSE" },
      { sensorId: "load_motor", name: "Spindle Motor Load", unit: "%", purpose: "Monitors electrical motor load percentage during cutting.", minScale: 0.0, maxScale: 100.0, normalRange: [30.0, 60.0], warningRange: [60.0, 75.0], criticalRange: [75.0, 100.0], direction: "HIGHER_IS_WORSE" },
      { sensorId: "pressure_coolant", name: "Coolant Jet Pressure", unit: "bar", purpose: "Monitors fluid pressure delivered to dual cutting nozzles.", minScale: 0.0, maxScale: 6.0, normalRange: [2.5, 4.0], warningRange: [1.5, 2.5], criticalRange: [0.0, 1.5], direction: "LOWER_IS_WORSE" }
    ],
    thresholds: [
      { sensorId: "vibration_spindle", sensorName: "Spindle Radial Vibration", unit: "mm/s", normal: { min: 0.1, max: 0.5, description: "Nominal air-bearing film" }, warning: { min: 0.5, max: 1.2, description: "Bearing raceway harmonic wear or blade unbalance" }, critical: { min: 1.2, max: 3.0, description: "Imminent air-bearing spindle crash" }, direction: "HIGHER_IS_WORSE" },
      { sensorId: "temperature_coolant", sensorName: "DI Water Coolant Temp", unit: "°C", normal: { min: 18.0, max: 24.0, description: "Optimal cutting kerf heat dissipation" }, warning: { min: 24.0, max: 32.0, description: "Chiller thermal exchange degradation" }, critical: { min: 32.0, max: 60.0, description: "Overheating kerf causing wafer thermal cracking" }, direction: "HIGHER_IS_WORSE" },
      { sensorId: "load_motor", sensorName: "Spindle Motor Load", unit: "%", normal: { min: 30.0, max: 60.0, description: "Nominal cutting drag" }, warning: { min: 60.0, max: 75.0, description: "Blade loading or feed rate mismatch" }, critical: { min: 75.0, max: 100.0, description: "Blade micro-binding and motor stall risk" }, direction: "HIGHER_IS_WORSE" }
    ],
    operatingConditions: {
      ambientTemperature: "21.0 - 23.0 °C (Cleanroom ISO 5)",
      relativeHumidity: "45.0 - 55.0 %",
      normalOperatingTemperature: "22.5 °C",
      normalOperatingPressure: "5.8 bar (CDA), -90 kPa (Vacuum)",
      normalOperatingSpeed: "30,000 - 45,000 RPM",
      normalCycleTime: "42.0 sec / 300mm wafer",
      normalOperatingHours: "24/7 continuous cleanroom operation",
      recommendedOperatingConditions: "Laminar DI water flow > 2.8 L/min, vacuum chuck > -85 kPa",
      maximumContinuousOperation: "120 continuous operating hours before blade touch-off calibration"
    },
    maintenance: [
      { component: "Resinoid Diamond Blade", recommendedMaintenanceIntervalHours: 72, expectedServiceLifeHours: 150, maintenanceAction: "Blade replacement & dressing stone re-sharpening", procedureSummary: "Unclamp blade flange, install calibrated 0.025mm blade, execute auto-contact touch-off sequence." },
      { component: "Air-Bearing Spindle Assembly", recommendedMaintenanceIntervalHours: 1500, expectedServiceLifeHours: 6000, maintenanceAction: "Dynamic spindle re-balancing & air filter replacement", procedureSummary: "Verify CDA dewpoint < -40°C, inspect labyrinth seal purge ring, run accelerometer FFT spectral check." }
    ],
    degradationIndicators: [
      { parameter: "Spindle Radial Vibration", physicalPhenomenon: "Ceramic ball race harmonic micro-spalling", measurableEffect: "12.4 kHz spectral peak elevation", degradationSignificance: "Causes wafer backside chipping along scribe line", primarySensorId: "vibration_spindle" },
      { parameter: "Coolant Temperature", physicalPhenomenon: "Chiller heat exchanger micro-fouling", measurableEffect: "Fluid return temp exceeds 32°C", degradationSignificance: "Thermal expansion causes blade kerf drift", primarySensorId: "temperature_coolant" }
    ],
    rulModel: {
      baseUsefulLifeHours: 2400,
      baseLifeUnit: "hours",
      modelName: "Wafer Saw Linear Weighted Degradation Model",
      formulaDescription: "RUL = BaseLife * (1 - (0.45*wear_vib + 0.30*wear_temp + 0.25*wear_load))",
      weightsSum: 1.0,
      parameters: [
        { parameter: "Spindle Vibration", sensorId: "vibration_spindle", sensorName: "Spindle Radial Vibration", unit: "mm/s", weight: 0.45, healthyLimit: 0.4, criticalLimit: 1.4, direction: "HIGHER_IS_WORSE" },
        { parameter: "Coolant Temp", sensorId: "temperature_coolant", sensorName: "DI Water Coolant Temp", unit: "°C", weight: 0.30, healthyLimit: 23.0, criticalLimit: 38.0, direction: "HIGHER_IS_WORSE" },
        { parameter: "Motor Load", sensorId: "load_motor", sensorName: "Spindle Motor Load", unit: "%", weight: 0.25, healthyLimit: 50.0, criticalLimit: 85.0, direction: "HIGHER_IS_WORSE" }
      ]
    },
    symptoms: [
      { symptomId: "SYM-WS-001", symptom: "Wafer Backside Chipping Exceeds 25µm", severity: "high", relatedSensors: ["vibration_spindle", "load_motor"], possibleCauses: ["Diamond blade edge loading", "Spindle bearing vibration harmonic", "Feed rate excessive"], recommendedAction: "Dress blade with silicon carbide dressing stick and verify spindle vibration < 0.5 mm/s." },
      { symptomId: "SYM-WS-002", symptom: "Kerf Width Drift > 5µm", severity: "medium", relatedSensors: ["temperature_coolant", "pressure_coolant"], possibleCauses: ["Coolant nozzle misalignment", "DI water temperature drift", "Chuck vacuum leak"], recommendedAction: "Re-align coolant spray nozzle directly on blade tangent and purge vacuum line filter." }
    ],
    failureScenarios: [
      { scenarioId: "SCEN-WS-001", symptom: "High-Speed Spindle Harmonic Micro-Spalling", severity: "warning", sensorPattern: "vibration_spindle > 1.2 mm/s, load_motor > 70%", possibleCauses: ["Silicon slurry ingress past labyrinth seal", "Air-bearing hydrodynamic film breakdown"], recommendedAction: "Replace diamond blade, flush DI coolant circuit, and dynamic-balance spindle rotor.", verificationSteps: ["Execute LOTO", "Inspect spindle runout with dial gauge (< 0.5µm)", "Perform 5-wafer test cut and inspect kerf under microscope"] }
    ]
  },

  // ── 2. STOCKER ───────────────────────────────────────────────────────────
  {
    filename: "stocker",
    aliases: [],
    machine: {
      name: "AMHS Automated Cleanroom FOUP Stocker",
      type: "stocker",
      prototypeMachineId: "STK-01",
      manualId: "VAI-MAN-STK-001",
      version: "1.0",
      generatedDate: "2026-08-27",
      documentStatus: "Synthetic Cleanroom Technical Manual",
      purpose: "VectorAI Demonstration and Operational Intelligence",
      disclaimer: DISCLAIMER_TEXT,
      processStage: "Bay 1: Wafer Dicing & Prep",
      description: "Automated Material Handling System (AMHS) cleanroom stocker for storing, buffering, and N2-purging 300mm Front Opening Unified Pods (FOUPs) between wafer prep and assembly bays.",
      manufacturingProcess: "Overhead Hoist Transport (OHT) vehicles deposit FOUP carriers at load ports. A high-speed dual-axis Cartesian robotic crane transfers cassettes into storage bays while ultra-pure N2 purge nozzles prevent surface oxidation and moisture adsorption.",
      subsystems: [
        "Dual-Axis Cartesian Robotic Crane & Gripper",
        "Ultra-High-Purity N2 Purge Gas Manifold",
        "FOUP Smart Load Port & RFID Cassette Reader",
        "Ceiling OHT Vehicle Rail Interface & Buffer Station",
        "Laminar Airflow Fan Filter Unit (FFU) & Particle Ionizer"
      ]
    },
    components: [
      { name: "Robotic Crane Gripper", function: "Transfers 300mm FOUPs between load ports and storage shelving.", importantParameters: "Crane velocity (m/s), vibration (mm/s), gripper clamping force (N).", degradationIndicators: "Crane track chatter (>0.3 mm/s), gripper timing delays." },
      { name: "N2 Purge Manifold", function: "Delivers continuous 99.999% purity N2 gas into FOUP purge ports.", importantParameters: "N2 purge pressure (kPa), mass flow rate (SLPM), moisture (ppb).", degradationIndicators: "Purge pressure drop (<40 kPa), manifold solenoid valve leakage." },
      { name: "Load Port Docking Mechanism", function: "Clamps FOUP and opens automated door under ISO 1 mini-environment.", importantParameters: "Door seal vacuum level (kPa), latch actuation torque (Nm).", degradationIndicators: "Door seal vacuum drop, latch alignment timeout." }
    ],
    sensors: [
      { sensorId: "vibration_crane", name: "Robotic Crane Vibration", unit: "mm/s", purpose: "Monitors crane linear guide rail vibration and bearing smoothness.", minScale: 0.0, maxScale: 1.5, normalRange: [0.05, 0.25], warningRange: [0.25, 0.60], criticalRange: [0.60, 1.5], direction: "HIGHER_IS_WORSE" },
      { sensorId: "pressure_n2", name: "N2 Purge Pressure", unit: "kPa", purpose: "Monitors nitrogen purge line pressure delivered to stored FOUPs.", minScale: 0.0, maxScale: 100.0, normalRange: [45.0, 60.0], warningRange: [30.0, 45.0], criticalRange: [0.0, 30.0], direction: "LOWER_IS_WORSE" },
      { sensorId: "temp_stocker", name: "Internal Enclosure Temp", unit: "°C", purpose: "Measures ambient temperature within sealed stocker bay.", minScale: 15.0, maxScale: 35.0, normalRange: [20.0, 23.0], warningRange: [23.0, 26.0], criticalRange: [26.0, 35.0], direction: "HIGHER_IS_WORSE" }
    ],
    thresholds: [
      { sensorId: "vibration_crane", sensorName: "Robotic Crane Vibration", unit: "mm/s", normal: { min: 0.05, max: 0.25, description: "Smooth linear motion" }, warning: { min: 0.25, max: 0.60, description: "Rail particulate or guide wheel flat spot" }, critical: { min: 0.60, max: 1.5, description: "Imminent crane jam or motor bearing failure" }, direction: "HIGHER_IS_WORSE" },
      { sensorId: "pressure_n2", sensorName: "N2 Purge Pressure", unit: "kPa", normal: { min: 45.0, max: 60.0, description: "Optimal N2 purge barrier" }, warning: { min: 30.0, max: 45.0, description: "Purge manifold pressure drop" }, critical: { min: 0.0, max: 30.0, description: "Loss of N2 purge: Wafer oxidation risk" }, direction: "LOWER_IS_WORSE" }
    ],
    operatingConditions: {
      ambientTemperature: "20.5 - 22.0 °C (Cleanroom ISO 5)",
      relativeHumidity: "40.0 - 50.0 %",
      normalOperatingTemperature: "21.2 °C",
      normalOperatingPressure: "52.0 kPa (N2 Purge)",
      normalOperatingSpeed: "600 mm/s (Crane Transfer)",
      normalCycleTime: "15.0 sec / FOUP transfer",
      normalOperatingHours: "24/7 continuous automated buffer",
      recommendedOperatingConditions: "N2 purity > 99.999%, cleanroom class ISO 1 inside enclosure",
      maximumContinuousOperation: "720 hours before crane track optical inspection"
    },
    maintenance: [
      { component: "Crane Linear Guide Rail", recommendedMaintenanceIntervalHours: 720, expectedServiceLifeHours: 8000, maintenanceAction: "Linear guide rail wipe and cleanroom perfluoropolyether grease lube", procedureSummary: "Clean stainless steel guide rail with lint-free wipes and apply vacuum-grade PFPE grease." },
      { component: "N2 Mass Flow Filter", recommendedMaintenanceIntervalHours: 2160, expectedServiceLifeHours: 8760, maintenanceAction: "Filter cartridge replacement & seal integrity leak test", procedureSummary: "Isolate N2 supply, swap 0.003µm particulate filter, verify zero pressure drop across manifold." }
    ],
    degradationIndicators: [
      { parameter: "Crane Vibration", physicalPhenomenon: "Guide wheel polymer roller delamination", measurableEffect: "Vibration amplitude spikes during acceleration", degradationSignificance: "Risk of FOUP cassette micro-shaking and wafer scuffing", primarySensorId: "vibration_crane" },
      { parameter: "N2 Purge Pressure", physicalPhenomenon: "Purge nozzle seal O-ring wear", measurableEffect: "Line pressure decays below 40 kPa", degradationSignificance: "Oxygen concentration in FOUP rises above 5 ppm", primarySensorId: "pressure_n2" }
    ],
    rulModel: {
      baseUsefulLifeHours: 4500,
      baseLifeUnit: "hours",
      modelName: "Stocker Crane & Purge RUL Model",
      formulaDescription: "RUL = BaseLife * (1 - (0.55*wear_crane_vib + 0.45*wear_n2_press))",
      weightsSum: 1.0,
      parameters: [
        { parameter: "Crane Vibration", sensorId: "vibration_crane", sensorName: "Robotic Crane Vibration", unit: "mm/s", weight: 0.55, healthyLimit: 0.15, criticalLimit: 0.80, direction: "HIGHER_IS_WORSE" },
        { parameter: "N2 Purge Pressure", sensorId: "pressure_n2", sensorName: "N2 Purge Pressure", unit: "kPa", weight: 0.45, healthyLimit: 52.0, criticalLimit: 25.0, direction: "LOWER_IS_WORSE" }
      ]
    },
    symptoms: [
      { symptomId: "SYM-STK-001", symptom: "Crane Positioning Timeout / Jitter", severity: "high", relatedSensors: ["vibration_crane"], possibleCauses: ["Linear encoder glass scale dirt", "Drive belt tension loss", "Guide roller flat spot"], recommendedAction: "Clean optical encoder scale with isopropanol and adjust timing belt tension." }
    ],
    failureScenarios: [
      { scenarioId: "SCEN-STK-001", symptom: "Crane Guide Rail Roller Wear & Micro-Chatter", severity: "warning", sensorPattern: "vibration_crane > 0.45 mm/s", possibleCauses: ["Urethane drive roller wear", "Rail alignment deviation"], recommendedAction: "Replace crane guide roller assemblies and execute dynamic axis calibration.", verificationSteps: ["Inspect roller surface", "Run 10-cycle automated pickup repeatability test (< 0.1mm tolerance)"] }
    ]
  },

  // ── 3. DIE ATTACH ────────────────────────────────────────────────────────
  {
    filename: "die-attach",
    aliases: ["die-attacher"],
    machine: {
      name: "High-Precision Epoxy & Eutectic Die Bonder",
      type: "die-attach",
      prototypeMachineId: "DA-01",
      manualId: "VAI-MAN-DA-001",
      version: "1.0",
      generatedDate: "2026-08-27",
      documentStatus: "Synthetic Cleanroom Technical Manual",
      purpose: "VectorAI Demonstration and Operational Intelligence",
      disclaimer: DISCLAIMER_TEXT,
      processStage: "Bay 2: Die Attach & SMT",
      description: "Dual-head high-precision die attach system designed for bonding semiconductor micro-dies onto copper leadframes, organic substrates, and BGA interposers with sub-micron placement accuracy.",
      manufacturingProcess: "A wafer ring expander presents singulated dies. An ejector needle pushes the target die upward, where a vacuum pickup collet retrieves it, performs in-flight vision alignment, and places it onto epoxy-dispensed substrate pads under controlled force and thermal conditions.",
      subsystems: [
        "High-Speed Dual-Collet Pick & Place Arm",
        "Pneumatic Jet Valve Epoxy Dispensing System",
        "Substrate Heated Bond Platen & Indexer",
        "Wafer Table Ring Expander & Multi-Needle Ejector",
        "High-Magnification PR Optical Fiducial Camera"
      ]
    },
    components: [
      { name: "Vacuum Pick-up Collet", function: "Grips die surface securely without inducing mechanical stress.", importantParameters: "Vacuum pressure (-kPa), collet tip wear (µm), contact angle.", degradationIndicators: "Vacuum pressure drop (>-60 kPa), die pickup tilt." },
      { name: "Wafer Ejector Needle Mechanism", function: "Pushes die upward from dicing tape carrier.", importantParameters: "Needle tip radius (µm), stroke height (mm), sync timing (ms).", degradationIndicators: "Needle tip bluntness, tape puncture, die cracking." },
      { name: "Epoxy Jet Dispense Valve", function: "Dispenses micro-droplets of conductive/non-conductive epoxy.", importantParameters: "Dispense pressure (bar), nozzle temp (°C), dot volume (nL).", degradationIndicators: "Nozzle clogging, dot diameter variance (>10%)." },
      { name: "Heated Workholder Platen", function: "Heats substrate to promote epoxy wetting and curing.", importantParameters: "Platen temperature (°C), vacuum hold-down (kPa).", degradationIndicators: "Thermal gradient (>3°C across strip), heater burnout." }
    ],
    sensors: [
      { sensorId: "vibration_arm", name: "Bond Arm Vibration", unit: "mm/s", purpose: "Monitors placement arm mechanical jitter and bearing smoothness.", minScale: 0.0, maxScale: 2.0, normalRange: [0.1, 0.45], warningRange: [0.45, 0.85], criticalRange: [0.85, 2.0], direction: "HIGHER_IS_WORSE" },
      { sensorId: "pressure_vacuum", name: "Collet Vacuum Pressure", unit: "kPa", purpose: "Measures negative suction pressure holding die on collet tip.", minScale: -100.0, maxScale: 0.0, normalRange: [-90.0, -78.0], warningRange: [-78.0, -60.0], criticalRange: [-60.0, 0.0], direction: "HIGHER_IS_WORSE" },
      { sensorId: "temperature_heater", name: "Heater Block Temp", unit: "°C", purpose: "Monitors substrate heating platen temperature.", minScale: 20.0, maxScale: 250.0, normalRange: [155.0, 175.0], warningRange: [175.0, 195.0], criticalRange: [195.0, 250.0], direction: "HIGHER_IS_WORSE" }
    ],
    thresholds: [
      { sensorId: "vibration_arm", sensorName: "Bond Arm Vibration", unit: "mm/s", normal: { min: 0.1, max: 0.45, description: "Sub-micron placement stability" }, warning: { min: 0.45, max: 0.85, description: "Arm bearing wear or linear motor jitter" }, critical: { min: 0.85, max: 2.0, description: "Severe placement tilt & die cracking risk" }, direction: "HIGHER_IS_WORSE" },
      { sensorId: "pressure_vacuum", sensorName: "Collet Vacuum Pressure", unit: "kPa", normal: { min: -90.0, max: -78.0, description: "Firm die suction" }, warning: { min: -78.0, max: -60.0, description: "Collet seal leakage or filter loading" }, critical: { min: -60.0, max: 0.0, description: "Die drop & BLT placement defect" }, direction: "HIGHER_IS_WORSE" },
      { sensorId: "temperature_heater", sensorName: "Heater Block Temp", unit: "°C", normal: { min: 155.0, max: 175.0, description: "Optimal epoxy wetting" }, warning: { min: 175.0, max: 195.0, description: "Heater controller drift" }, critical: { min: 195.0, max: 250.0, description: "Epoxy premature cross-linking" }, direction: "HIGHER_IS_WORSE" }
    ],
    operatingConditions: {
      ambientTemperature: "21.0 - 23.0 °C (Cleanroom ISO 6)",
      relativeHumidity: "45.0 - 55.0 %",
      normalOperatingTemperature: "165.0 °C (Platen)",
      normalOperatingPressure: "-82.0 kPa (Collet Vacuum), 6.0 bar (CDA)",
      normalOperatingSpeed: "1,800 UPH (Units Per Hour)",
      normalCycleTime: "28.0 sec / leadframe strip",
      normalOperatingHours: "24/7 continuous assembly operation",
      recommendedOperatingConditions: "Collet vacuum > -80 kPa, epoxy pot life < 8 hours",
      maximumContinuousOperation: "168 hours before collet tip replacement"
    },
    maintenance: [
      { component: "Silicone Pick-up Collet Tip", recommendedMaintenanceIntervalHours: 120, expectedServiceLifeHours: 250, maintenanceAction: "Collet tip replacement and optical touch-off", procedureSummary: "Swap silicone collet, clean vacuum channel, perform PR fiducial camera offset teaching." },
      { component: "Ejector Needle Assembly", recommendedMaintenanceIntervalHours: 240, expectedServiceLifeHours: 500, maintenanceAction: "Needle tip height calibration and microscopic wear check", procedureSummary: "Measure needle tip protrusion under vision scope, adjust Z-height offset to 0.15mm." }
    ],
    degradationIndicators: [
      { parameter: "Collet Vacuum Pressure", physicalPhenomenon: "Solenoid valve particulate loading & rubber tip wear", measurableEffect: "Vacuum decays from -84 kPa to -54 kPa", degradationSignificance: "Causes die pickup skew and bond-line thickness (BLT) variance", primarySensorId: "pressure_vacuum" },
      { parameter: "Bond Arm Vibration", physicalPhenomenon: "Voice coil motor (VCM) bearing micro-play", measurableEffect: "Vibration amplitude exceeds 0.65 mm/s", degradationSignificance: "Die placement position error exceeds ± 12µm", primarySensorId: "vibration_arm" }
    ],
    rulModel: {
      baseUsefulLifeHours: 1580,
      baseLifeUnit: "hours",
      modelName: "Die Bonder Multi-Axis Degradation Model",
      formulaDescription: "RUL = BaseLife * (1 - (0.50*wear_vacuum + 0.30*wear_vib + 0.20*wear_temp))",
      weightsSum: 1.0,
      parameters: [
        { parameter: "Collet Vacuum", sensorId: "pressure_vacuum", sensorName: "Collet Vacuum Pressure", unit: "kPa", weight: 0.50, healthyLimit: -82.0, criticalLimit: -50.0, direction: "HIGHER_IS_WORSE" },
        { parameter: "Arm Vibration", sensorId: "vibration_arm", sensorName: "Bond Arm Vibration", unit: "mm/s", weight: 0.30, healthyLimit: 0.35, criticalLimit: 0.90, direction: "HIGHER_IS_WORSE" },
        { parameter: "Heater Temp", sensorId: "temperature_heater", sensorName: "Heater Block Temp", unit: "°C", weight: 0.20, healthyLimit: 165.0, criticalLimit: 200.0, direction: "HIGHER_IS_WORSE" }
      ]
    },
    symptoms: [
      { symptomId: "SYM-DA-001", symptom: "Die Placement Tilt / BLT Uneven", severity: "high", relatedSensors: ["pressure_vacuum", "vibration_arm"], possibleCauses: ["Collet vacuum seal leak", "Ejector pin bent", "Epoxy dot volume mismatch"], recommendedAction: "Flush vacuum filter, replace pick collet, and verify epoxy dispense weight." }
    ],
    failureScenarios: [
      { scenarioId: "SCEN-DA-001", symptom: "Collet Vacuum Seal Leakage & Ejector Pin Timing Drift", severity: "warning", sensorPattern: "pressure_vacuum > -60 kPa, vibration_arm > 0.6 mm/s", possibleCauses: ["Collet rubber micro-tear", "Vacuum line solenoid clogging"], recommendedAction: "Flush vacuum solenoid filter, replace silicone collet, and re-teach ejector needle Z-height.", verificationSteps: ["Perform vacuum hold test", "Run 20-die dummy placement and measure BLT with laser profiler (< 2µm variance)"] }
    ]
  },

  // ── 4. PLASMA CLEANER ────────────────────────────────────────────────────
  {
    filename: "plasma-cleaner",
    aliases: [],
    machine: {
      name: "RF Argon & Oxygen Plasma Surface Activation Chamber",
      type: "plasma-cleaner",
      prototypeMachineId: "PC-01",
      manualId: "VAI-MAN-PC-001",
      version: "1.0",
      generatedDate: "2026-08-27",
      documentStatus: "Synthetic Cleanroom Technical Manual",
      purpose: "VectorAI Demonstration and Operational Intelligence",
      disclaimer: DISCLAIMER_TEXT,
      processStage: "Bay 3A: Plasma Activation",
      description: "Low-pressure 13.56 MHz RF plasma treatment chamber for micro-cleaning organic contaminants and activating metal bond pads (Au, Cu, Al) on die-attached leadframes prior to wire bonding.",
      manufacturingProcess: "Magazines of leadframes are loaded into an automated vacuum chamber. A dry mechanical pump evicts air down to < 10 Pa. Pure argon and oxygen gases are energized by a 13.56 MHz RF match network into a glow-discharge plasma, stripping organic monolayers and increasing copper surface energy to > 72 dyn/cm.",
      subsystems: [
        "13.56 MHz RF Generator & Solid-State Auto-Match Network",
        "Stainless Steel Vacuum Process Chamber with Fluoroelastomer Seals",
        "Dry Roots Vacuum Pump & Roughing Valve Manifold",
        "High-Precision Gas Mass Flow Controllers (MFCs for Ar, O2, H2)",
        "Optical Emission Spectroscopy (OES) Plasma Density Endpoint Sensor"
      ]
    },
    components: [
      { name: "RF Auto-Match Network", function: "Matches generator 50Ω impedance to dynamic plasma chamber impedance.", importantParameters: "Reflected power (W), forward power (W), tune/load capacitor pos (%).", degradationIndicators: "Reflected power surge (>30W), tuning hunt time (>5s)." },
      { name: "Dry Vacuum Pump Stack", function: "Evacuates chamber down to operating base pressure (10-100 Pa).", importantParameters: "Chamber base pressure (Pa), pump vibration (mm/s), pump temp (°C).", degradationIndicators: "Pump vibration rise (>0.4 mm/s), base pressure degradation." },
      { name: "Process Gas MFCs", function: "Regulates precise mass flow of ultra-pure Argon (Ar) and Oxygen (O2).", importantParameters: "Flow rate (sccm), gas inlet pressure (bar).", degradationIndicators: "MFC flow hunt, solenoid response drift." },
      { name: "Chamber Door Fluoroelastomer Seal", function: "Maintains hermetic vacuum seal during high-frequency plasma cycle.", importantParameters: "Chamber leak-up rate (Pa/min), door clamp pressure.", degradationIndicators: "Leak rate > 2 Pa/min, visual elastomer cracking." }
    ],
    sensors: [
      { sensorId: "vibration_vacuum_pump", name: "Vacuum Pump Vibration", unit: "mm/s", purpose: "Monitors dry vacuum pump rotor bearing condition.", minScale: 0.0, maxScale: 2.0, normalRange: [0.08, 0.30], warningRange: [0.30, 0.70], criticalRange: [0.70, 2.0], direction: "HIGHER_IS_WORSE" },
      { sensorId: "chamber_pressure", name: "Chamber Pressure", unit: "kPa", purpose: "Measures vacuum chamber process pressure during plasma glow.", minScale: 0.0, maxScale: 150.0, normalRange: [70.0, 95.0], warningRange: [95.0, 120.0], criticalRange: [120.0, 150.0], direction: "HIGHER_IS_WORSE" },
      { sensorId: "rf_reflected_power", name: "RF Reflected Power", unit: "W", purpose: "Measures reflected electromagnetic power from plasma impedance mismatch.", minScale: 0.0, maxScale: 100.0, normalRange: [5.0, 22.0], warningRange: [22.0, 38.0], criticalRange: [38.0, 100.0], direction: "HIGHER_IS_WORSE" }
    ],
    thresholds: [
      { sensorId: "rf_reflected_power", sensorName: "RF Reflected Power", unit: "W", normal: { min: 5.0, max: 22.0, description: "Nominal RF energy transfer (>95% efficiency)" }, warning: { min: 22.0, max: 38.0, description: "Impedance auto-match capacitor drift" }, critical: { min: 38.0, max: 100.0, description: "Plasma de-energized: Insufficient surface activation" }, direction: "HIGHER_IS_WORSE" },
      { sensorId: "chamber_pressure", sensorName: "Chamber Pressure", unit: "kPa", normal: { min: 70.0, max: 95.0, description: "Optimal argon glow pressure" }, warning: { min: 95.0, max: 120.0, description: "Chamber vacuum micro-leak or MFC drift" }, critical: { min: 120.0, max: 150.0, description: "Severe vacuum seal failure" }, direction: "HIGHER_IS_WORSE" }
    ],
    operatingConditions: {
      ambientTemperature: "21.0 - 23.0 °C (Cleanroom ISO 6)",
      relativeHumidity: "40.0 - 50.0 %",
      normalOperatingTemperature: "42.0 °C (Chamber electrode)",
      normalOperatingPressure: "85.0 kPa (Operating glow regime)",
      normalOperatingSpeed: "RF 13.56 MHz (300W Forward Power)",
      normalCycleTime: "65.0 sec / magazine batch",
      normalOperatingHours: "24/7 continuous inline batch operation",
      recommendedOperatingConditions: "Argon gas purity > 99.999%, reflected power < 20W",
      maximumContinuousOperation: "250 hours before chamber electrode cleaning"
    },
    maintenance: [
      { component: "RF Auto-Match Capacitor", recommendedMaintenanceIntervalHours: 720, expectedServiceLifeHours: 4000, maintenanceAction: "Impedance match capacitor tuning & contact deoxidation", procedureSummary: "Inspect variable capacitor stepper motor, verify 50Ω load balance with dummy RF load." },
      { component: "Fluoroelastomer Chamber O-Ring", recommendedMaintenanceIntervalHours: 360, expectedServiceLifeHours: 1500, maintenanceAction: "O-ring replacement and vacuum grease application", procedureSummary: "Remove chamber door O-ring, inspect groove for particulates, apply high-vacuum Krytox grease." }
    ],
    degradationIndicators: [
      { parameter: "RF Reflected Power", physicalPhenomenon: "Auto-match vacuum variable capacitor dielectric wear", measurableEffect: "Reflected power surges to 42W", degradationSignificance: "Reduces surface activation energy below 50 dyn/cm, leading to bond lift-off", primarySensorId: "rf_reflected_power" },
      { parameter: "Vacuum Pump Vibration", physicalPhenomenon: "Pump mechanical bearing micro-flaking", measurableEffect: "Vibration amplitude climbs above 0.50 mm/s", degradationSignificance: "Pump motor seizure risk during high-vacuum pump-down", primarySensorId: "vibration_vacuum_pump" }
    ],
    rulModel: {
      baseUsefulLifeHours: 2800,
      baseLifeUnit: "hours",
      modelName: "RF Plasma Activation Degradation Model",
      formulaDescription: "RUL = BaseLife * (1 - (0.50*wear_rf_refl + 0.30*wear_press + 0.20*wear_pump_vib))",
      weightsSum: 1.0,
      parameters: [
        { parameter: "RF Reflected Power", sensorId: "rf_reflected_power", sensorName: "RF Reflected Power", unit: "W", weight: 0.50, healthyLimit: 18.0, criticalLimit: 45.0, direction: "HIGHER_IS_WORSE" },
        { parameter: "Chamber Pressure", sensorId: "chamber_pressure", sensorName: "Chamber Pressure", unit: "kPa", weight: 0.30, healthyLimit: 85.0, criticalLimit: 125.0, direction: "HIGHER_IS_WORSE" },
        { parameter: "Pump Vibration", sensorId: "vibration_vacuum_pump", sensorName: "Vacuum Pump Vibration", unit: "mm/s", weight: 0.20, healthyLimit: 0.20, criticalLimit: 0.80, direction: "HIGHER_IS_WORSE" }
      ]
    },
    symptoms: [
      { symptomId: "SYM-PC-001", symptom: "Low Surface Energy (< 52 dyn/cm on Copper)", severity: "high", relatedSensors: ["rf_reflected_power", "chamber_pressure"], possibleCauses: ["RF match network out of tune", "Chamber O-ring leak", "O2 gas MFC blocked"], recommendedAction: "Tune RF matching network and measure contact angle with goniometer." }
    ],
    failureScenarios: [
      { scenarioId: "SCEN-PC-001", symptom: "RF Auto-Match Capacitor Drift & Vacuum O-Ring Degradation", severity: "warning", sensorPattern: "rf_reflected_power > 35W, chamber_pressure > 105 kPa", possibleCauses: ["Vacuum variable capacitor electrode oxidation", "Chamber seal micro-permeation"], recommendedAction: "Re-tune RF matching network capacitor and replace fluoroelastomer chamber seal.", verificationSteps: ["Execute helium leak detector test (< 1x10^-8 mbar*L/s)", "Run water droplet contact angle test (< 15 degrees)"] }
    ]
  },

  // ── 5. WIRE BONDING ──────────────────────────────────────────────────────
  {
    filename: "wire-bonding",
    aliases: ["wire-bonder"],
    machine: {
      name: "High-Speed Thermosonic Ball Bonder",
      type: "wire-bonding",
      prototypeMachineId: "WB-01",
      manualId: "VAI-MAN-WB-001",
      version: "1.0",
      generatedDate: "2026-08-27",
      documentStatus: "Synthetic Cleanroom Technical Manual",
      purpose: "VectorAI Demonstration and Operational Intelligence",
      disclaimer: DISCLAIMER_TEXT,
      processStage: "Bay 3B: Wire Bonding Cleanroom",
      description: "Ultra-high-speed thermosonic ball bonder designed for creating interconnecting micro-wires (18µm - 32µm gold and copper) between die bond pads and leadframe fingers at speeds up to 24 wires/second.",
      manufacturingProcess: "An Electronic Flame-Off (EFO) spark creates a Free Air Ball (FAB) at the tip of the ceramic capillary. The ultrasonic horn clamps the ball onto the die pad under controlled force and 138 kHz ultrasonic acoustic vibration. The capillary loops over to the leadframe stitch, forms the tail bond, and severs the wire.",
      subsystems: [
        "PZT Piezoelectric Transducer & Ultrasonic Horn",
        "Micro-Ceramic Capillary Tool & Wire Clamp Assembly",
        "Electronic Flame-Off (EFO) Spark Generator & Wand",
        "Heated Workholder Platen & Forming Gas Manifold (N2/H2 95/5)",
        "Non-Stick On Pad (NSOP) High-Speed Optical Detector"
      ]
    },
    components: [
      { name: "Ultrasonic Transducer Stack", function: "Converts 138 kHz electrical drive into mechanical acoustic shearing energy.", importantParameters: "Acoustic resonance frequency (kHz), vibration amplitude (mm/s), PZT temperature (°C).", degradationIndicators: "Resonance frequency shift (>2.0 kHz), vibration spike (>2.0 mm/s), thermal runaway." },
      { name: "Ceramic Capillary Tool", function: "Guides wire, shapes initial ball bond, and stitches second bond.", importantParameters: "Hole diameter (µm), tip chamfer angle, capillary wear index (µm).", degradationIndicators: "Capillary tip erosion, wire drag, golf-ball FAB shape." },
      { name: "EFO Spark Electrode", function: "Discharges high-voltage arc to melt wire tail into uniform spherical ball.", importantParameters: "Spark voltage (V), spark current (mA), arc gap distance (mm).", degradationIndicators: "EFO firing timeouts, oxidized Free Air Ball (FAB)." },
      { name: "Workholder Heater Block", function: "Maintains leadframe temperature at 150-220°C for intermetallic bonding.", importantParameters: "Platen temperature (°C), leadframe clamping force (N).", degradationIndicators: "Thermal fluctuation, leadframe micro-bouncing during ultrasonic burst." }
    ],
    sensors: [
      { sensorId: "vibration_ultrasonic", name: "Ultrasonic Vibration", unit: "mm/s", purpose: "Measures acoustic transducer horn vibration amplitude.", minScale: 0.0, maxScale: 5.0, normalRange: [0.35, 0.65], warningRange: [0.65, 1.8], criticalRange: [1.8, 5.0], direction: "HIGHER_IS_WORSE" },
      { sensorId: "load_clamp", name: "Clamping Force", unit: "N", purpose: "Monitors dynamic force exerted by capillary on die pad.", minScale: 0.0, maxScale: 120.0, normalRange: [60.0, 75.0], warningRange: [75.0, 85.0], criticalRange: [85.0, 120.0], direction: "HIGHER_IS_WORSE" },
      { sensorId: "temperature_transducer", name: "Transducer Head Temp", unit: "°C", purpose: "Measures piezoelectric transducer core operating temperature.", minScale: 20.0, maxScale: 100.0, normalRange: [40.0, 52.0], warningRange: [52.0, 65.0], criticalRange: [65.0, 100.0], direction: "HIGHER_IS_WORSE" }
    ],
    thresholds: [
      { sensorId: "vibration_ultrasonic", sensorName: "Ultrasonic Vibration", unit: "mm/s", normal: { min: 0.35, max: 0.65, description: "Nominal 138.4 kHz acoustic coupling" }, warning: { min: 0.65, max: 1.8, description: "Piezo resonance drift or capillary loose" }, critical: { min: 1.8, max: 5.0, description: "Acoustic decoupling: Severe NSOP defect risk" }, direction: "HIGHER_IS_WORSE" },
      { sensorId: "temperature_transducer", sensorName: "Transducer Head Temp", unit: "°C", normal: { min: 40.0, max: 52.0, description: "Stable PZT thermal equilibrium" }, warning: { min: 52.0, max: 65.0, description: "Transducer thermal accumulation" }, critical: { min: 65.0, max: 100.0, description: "PZT thermal runaway and Curie point degradation" }, direction: "HIGHER_IS_WORSE" }
    ],
    operatingConditions: {
      ambientTemperature: "21.0 - 23.0 °C (Cleanroom ISO 6)",
      relativeHumidity: "45.0 - 55.0 %",
      normalOperatingTemperature: "46.0 °C (Transducer), 180.0 °C (Heater)",
      normalOperatingPressure: "Forming gas 95/5 N2/H2 at 0.5 bar",
      normalOperatingSpeed: "22 - 24 wires / second",
      normalCycleTime: "18.0 sec / 300-wire module",
      normalOperatingHours: "24/7 continuous high-speed bonding",
      recommendedOperatingConditions: "Forming gas flow > 0.8 L/min, capillary tip cleaned every 10,000 bonds",
      maximumContinuousOperation: "80 operating hours before capillary tool replacement"
    },
    maintenance: [
      { component: "Ceramic Capillary Tool", recommendedMaintenanceIntervalHours: 48, expectedServiceLifeHours: 120, maintenanceAction: "Capillary replacement & resonance frequency retuning", procedureSummary: "Remove worn 25µm capillary, install new ceramic tool with torque wrench, run auto-resonance sweep at 138.4 kHz." },
      { component: "PZT Transducer Stack", recommendedMaintenanceIntervalHours: 1000, expectedServiceLifeHours: 3500, maintenanceAction: "Piezo horn impedance check and ultrasonic calibrator verification", procedureSummary: "Verify transducer electrical impedance at resonance (< 15Ω) and check acoustic amplitude with laser vibrometer." }
    ],
    degradationIndicators: [
      { parameter: "Ultrasonic Vibration", physicalPhenomenon: "PZT crystal polarization decay and thermal decoupling", measurableEffect: "Vibration spikes from 0.45 mm/s to > 3.0 mm/s", degradationSignificance: "Causes non-stick on pad (NSOP) and lifted ball bonds", primarySensorId: "vibration_ultrasonic" },
      { parameter: "Transducer Head Temp", physicalPhenomenon: "Internal dielectric loss and heat dissipation loss", measurableEffect: "Temperature climbs to > 68°C", degradationSignificance: "Shifts mechanical resonance frequency outside generator lock range", primarySensorId: "temperature_transducer" }
    ],
    rulModel: {
      baseUsefulLifeHours: 1650,
      baseLifeUnit: "hours",
      modelName: "Wire Bonder Acoustic & Thermal Degradation Model",
      formulaDescription: "RUL = BaseLife * (1 - (0.55*wear_vib + 0.30*wear_temp + 0.15*wear_clamp))",
      weightsSum: 1.0,
      parameters: [
        { parameter: "Ultrasonic Vibration", sensorId: "vibration_ultrasonic", sensorName: "Ultrasonic Vibration", unit: "mm/s", weight: 0.55, healthyLimit: 0.50, criticalLimit: 2.50, direction: "HIGHER_IS_WORSE" },
        { parameter: "Transducer Temp", sensorId: "temperature_transducer", sensorName: "Transducer Head Temp", unit: "°C", weight: 0.30, healthyLimit: 48.0, criticalLimit: 68.0, direction: "HIGHER_IS_WORSE" },
        { parameter: "Clamp Force", sensorId: "load_clamp", sensorName: "Clamping Force", unit: "N", weight: 0.15, healthyLimit: 68.0, criticalLimit: 90.0, direction: "HIGHER_IS_WORSE" }
      ]
    },
    symptoms: [
      { symptomId: "SYM-WB-001", symptom: "Non-Stick On Pad (NSOP) Defect Rate > 0.05%", severity: "critical", relatedSensors: ["vibration_ultrasonic", "temperature_transducer"], possibleCauses: ["Capillary tip erosion", "PZT resonance frequency shift", "Bond pad oxidation"], recommendedAction: "Perform emergency capillary tool replacement and execute 138.4 kHz frequency auto-tune." }
    ],
    failureScenarios: [
      { scenarioId: "SCEN-WB-001", symptom: "PZT Transducer Thermal Runaway & Acoustic Resonance Decoupling", severity: "critical", sensorPattern: "vibration_ultrasonic > 2.5 mm/s, temperature_transducer > 65°C", possibleCauses: ["Piezoelectric crystal thermal stress", "Capillary loose in horn clamp"], recommendedAction: "Immediate tool stop: Replace 25µm capillary tool and recalibrate transducer stack at 138.4 kHz.", verificationSteps: ["Verify transducer resonance impedance curve", "Execute wire pull test (> 6.5g) and ball shear test (> 25g)"] }
    ]
  },

  // ── 6. MOLDING PRESS ─────────────────────────────────────────────────────
  {
    filename: "molding-press",
    aliases: ["molding-machine"],
    machine: {
      name: "Multi-Cavity Auto Molding Encapsulation Press",
      type: "molding-press",
      prototypeMachineId: "MP-01",
      manualId: "VAI-MAN-MP-001",
      version: "1.0",
      generatedDate: "2026-08-27",
      documentStatus: "Synthetic Cleanroom Technical Manual",
      purpose: "VectorAI Demonstration and Operational Intelligence",
      disclaimer: DISCLAIMER_TEXT,
      processStage: "Bay 4: Encapsulation & Mold Chase",
      description: "Automated multi-plunger encapsulation press utilizing Epoxy Molding Compound (EMC) pellets to hermetically seal wire-bonded semiconductor assemblies at 175°C under high hydraulic transfer pressure.",
      manufacturingProcess: "Wire-bonded leadframes are loaded into precision-machined upper and lower mold chases. Pre-heated solid EMC pellets are injected by multi-plunger hydraulic rams into runner channels, encapsulating chips without wire sweep. Degassing vacuum prevents internal micro-voiding.",
      subsystems: [
        "Multi-Plunger Servo-Hydraulic Injection Ram",
        "Precision Upper & Lower Mold Chases with Cartridge Heaters",
        "Automated Degate Trimmer & Leadframe Separator",
        "Mold Cavity Vacuum Degassing Manifold",
        "Pellet Loading Shuttle & Top-Bottom Ejector Pin Bar"
      ]
    },
    components: [
      { name: "Hydraulic Transfer Plunger", function: "Compresses melted EMC resin pellets into mold cavities under 120-180 bar.", importantParameters: "Ram pressure (bar), transfer velocity (mm/s), plunger load (kN).", degradationIndicators: "Hydraulic pressure surge (>165 bar), piston seal leakage, plunger friction." },
      { name: "Mold Chase Heater Platens", function: "Maintains upper and lower mold cavities at 170-180°C curing temp.", importantParameters: "Platen temperature (°C), temperature uniformity across chase (±2°C).", degradationIndicators: "Thermal gradient (>5°C), heater cartridge resistance drift." },
      { name: "Mold Cavity Air Vents", function: "Allows trapped air to escape during resin transfer to prevent voids.", importantParameters: "Vent depth (µm), vent vacuum level (kPa).", degradationIndicators: "Resin flash accumulation in vents, mold void defects." }
    ],
    sensors: [
      { sensorId: "temperature_mold", name: "Mold Chase Temp", unit: "°C", purpose: "Measures mold platen surface temperature.", minScale: 100.0, maxScale: 250.0, normalRange: [170.0, 180.0], warningRange: [180.0, 192.0], criticalRange: [192.0, 250.0], direction: "HIGHER_IS_WORSE" },
      { sensorId: "pressure_hydraulic", name: "Hydraulic Pressure", unit: "bar", purpose: "Monitors transfer plunger hydraulic line pressure.", minScale: 0.0, maxScale: 250.0, normalRange: [120.0, 150.0], warningRange: [150.0, 175.0], criticalRange: [175.0, 250.0], direction: "HIGHER_IS_WORSE" },
      { sensorId: "load_plunger", name: "Plunger Load", unit: "kN", purpose: "Measures mechanical force applied to epoxy transfer plunger.", minScale: 0.0, maxScale: 60.0, normalRange: [18.0, 30.0], warningRange: [30.0, 42.0], criticalRange: [42.0, 60.0], direction: "HIGHER_IS_WORSE" }
    ],
    thresholds: [
      { sensorId: "pressure_hydraulic", sensorName: "Hydraulic Pressure", unit: "bar", normal: { min: 120.0, max: 150.0, description: "Smooth EMC resin transfer" }, warning: { min: 150.0, max: 175.0, description: "Vent resin buildup or high viscosity" }, critical: { min: 175.0, max: 250.0, description: "Plunger binding and severe wire sweep risk" }, direction: "HIGHER_IS_WORSE" },
      { sensorId: "temperature_mold", sensorName: "Mold Chase Temp", unit: "°C", normal: { min: 170.0, max: 180.0, description: "Optimal EMC cross-linking" }, warning: { min: 180.0, max: 192.0, description: "Platen thermal gradient" }, critical: { min: 192.0, max: 250.0, description: "Epoxy premature gelation" }, direction: "HIGHER_IS_WORSE" }
    ],
    operatingConditions: {
      ambientTemperature: "21.0 - 23.0 °C (Cleanroom ISO 7)",
      relativeHumidity: "40.0 - 50.0 %",
      normalOperatingTemperature: "175.0 °C (Mold Platen)",
      normalOperatingPressure: "135.0 bar (Hydraulic Transfer)",
      normalOperatingSpeed: "140 sec / transfer cycle",
      normalCycleTime: "140.0 sec / mold shot",
      normalOperatingHours: "24/7 continuous molding operation",
      recommendedOperatingConditions: "Mold release agent applied every 25 shots, vacuum < 1 kPa",
      maximumContinuousOperation: "250 operating hours before ultrasonic mold chase cleaning"
    },
    maintenance: [
      { component: "Mold Chase Air Vents", recommendedMaintenanceIntervalHours: 120, expectedServiceLifeHours: 600, maintenanceAction: "Air vent ultrasonic cleaning and resin flash descaling", procedureSummary: "Remove mold insert plates, immerse in ultrasonic cleaning bath with alkaline solvent." },
      { component: "Hydraulic Ram Piston Seals", recommendedMaintenanceIntervalHours: 1000, expectedServiceLifeHours: 4000, maintenanceAction: "Piston seal ring inspection and hydraulic fluid replacement", procedureSummary: "Inspect polyurethane seal rings for extrusion wear, flush hydraulic reservoir with ISO VG 46 oil." }
    ],
    degradationIndicators: [
      { parameter: "Hydraulic Pressure", physicalPhenomenon: "Cylinder seal friction & resin vent obstruction", measurableEffect: "Ram pressure spikes to 178 bar", degradationSignificance: "Causes incomplete filling (short shot) and leadframe flash bleed", primarySensorId: "pressure_hydraulic" },
      { parameter: "Mold Chase Temp", physicalPhenomenon: "Cartridge heater aging and thermocouple thermal lag", measurableEffect: "Temperature gradient exceeds 188°C", degradationSignificance: "Non-uniform cure causing package warpage and delamination", primarySensorId: "temperature_mold" }
    ],
    rulModel: {
      baseUsefulLifeHours: 1980,
      baseLifeUnit: "hours",
      modelName: "Molding Press Hydraulic & Thermal Degradation Model",
      formulaDescription: "RUL = BaseLife * (1 - (0.50*wear_hyd_press + 0.30*wear_temp + 0.20*wear_plunger))",
      weightsSum: 1.0,
      parameters: [
        { parameter: "Hydraulic Pressure", sensorId: "pressure_hydraulic", sensorName: "Hydraulic Pressure", unit: "bar", weight: 0.50, healthyLimit: 135.0, criticalLimit: 185.0, direction: "HIGHER_IS_WORSE" },
        { parameter: "Mold Temp", sensorId: "temperature_mold", sensorName: "Mold Chase Temp", unit: "°C", weight: 0.30, healthyLimit: 175.0, criticalLimit: 195.0, direction: "HIGHER_IS_WORSE" },
        { parameter: "Plunger Load", sensorId: "load_plunger", sensorName: "Plunger Load", unit: "kN", weight: 0.20, healthyLimit: 25.0, criticalLimit: 50.0, direction: "HIGHER_IS_WORSE" }
      ]
    },
    symptoms: [
      { symptomId: "SYM-MP-001", symptom: "Resin Flash Bleed & Incomplete Cavity Fill", severity: "high", relatedSensors: ["pressure_hydraulic", "temperature_mold"], possibleCauses: ["Mold air vent blockage", "Hydraulic pressure surge", "Heater temperature non-uniformity"], recommendedAction: "Clean mold chase vents and inspect hydraulic plunger seal rings." }
    ],
    failureScenarios: [
      { scenarioId: "SCEN-MP-001", symptom: "Hydraulic Transfer Ram Pressure Spike & Mold Vent Flash", severity: "warning", sensorPattern: "pressure_hydraulic > 170 bar, load_plunger > 40 kN", possibleCauses: ["Cylinder piston ring wear", "Resin flash accumulation in vents"], recommendedAction: "Ultrasonic clean mold chase vents and replace hydraulic piston seal rings.", verificationSteps: ["Verify hydraulic pressure profile curve during transfer", "Inspect encapsulated package cross-section for wire sweep (< 3%)"] }
    ]
  },

  // ── 7. AOI INSPECTION ────────────────────────────────────────────────────
  {
    filename: "aoi-inspection",
    aliases: [],
    machine: {
      name: "3D Optical AOI Metrology & Coplanarity System",
      type: "aoi-inspection",
      prototypeMachineId: "AOI-01",
      manualId: "VAI-MAN-AOI-001",
      version: "1.0",
      generatedDate: "2026-08-27",
      documentStatus: "Synthetic Cleanroom Technical Manual",
      purpose: "VectorAI Demonstration and Operational Intelligence",
      disclaimer: DISCLAIMER_TEXT,
      processStage: "Bay 5A: 3D Optical AOI Metrology",
      description: "High-speed automated optical inspection and 3D laser profilometry line for inspecting molded IC package surface defects, lead coplanarity, ball grid height, and package dimensional tolerances.",
      manufacturingProcess: "Molded leadframe strips or BGA trays travel along a dual-lane SMEMA conveyor. Multi-wavelength RGB+W dome illumination and dual-telecentric cameras capture 100MP images while 3D laser triangulation sensors reconstruct micron-level height maps of leads and solder balls.",
      subsystems: [
        "Dual-Telecentric 100MP High-Resolution Imaging Camera",
        "High-Speed 3D Laser Triangulation Profilometer",
        "Multi-Angle RGBW Programmable Dome Strobe Illuminator",
        "Granite Base Air-Bearing Linear Motion Gantry",
        "Automated SMEMA Dual-Lane Cassette Indexer"
      ]
    },
    components: [
      { name: "3D Laser Triangulation Head", function: "Scans package surface height and lead coplanarity at 50 kHz.", importantParameters: "Height measurement resolution (0.1µm), laser power (mW), sensor temp (°C).", degradationIndicators: "Laser diode power decay, height measurement noise." },
      { name: "Camera Motion Gantry", function: "Translates optical sensor across package matrix at high speed.", importantParameters: "Gantry acceleration (G), vibration (mm/s), position jitter (µm).", degradationIndicators: "Gantry vibration rise (>0.2 mm/s), position encoder error." },
      { name: "RGBW LED Dome Illuminator", function: "Provides structured multi-angle illumination for defect contrast.", importantParameters: "Illumination uniformity (%), LED pulse timing (µs).", degradationIndicators: "Brightness decay (>10%), strobe timing jitter." }
    ],
    sensors: [
      { sensorId: "vibration_camera_gantry", name: "Camera Gantry Vibration", unit: "mm/s", purpose: "Monitors optical gantry motion vibration and rail smoothness.", minScale: 0.0, maxScale: 1.0, normalRange: [0.02, 0.15], warningRange: [0.15, 0.35], criticalRange: [0.35, 1.0], direction: "HIGHER_IS_WORSE" },
      { sensorId: "temp_optics", name: "Optical Sensor Temp", unit: "°C", purpose: "Measures CMOS image sensor and laser diode temperature.", minScale: 15.0, maxScale: 50.0, normalRange: [20.0, 26.0], warningRange: [26.0, 34.0], criticalRange: [34.0, 50.0], direction: "HIGHER_IS_WORSE" },
      { sensorId: "optical_intensity", name: "Illumination Uniformity", unit: "%", purpose: "Monitors calibrated brightness uniformity of LED dome lights.", minScale: 50.0, maxScale: 100.0, normalRange: [95.0, 100.0], warningRange: [85.0, 95.0], criticalRange: [50.0, 85.0], direction: "LOWER_IS_WORSE" }
    ],
    thresholds: [
      { sensorId: "vibration_camera_gantry", sensorName: "Camera Gantry Vibration", unit: "mm/s", normal: { min: 0.02, max: 0.15, description: "Sub-micron optical sharpness" }, warning: { min: 0.15, max: 0.35, description: "Gantry bearing wear or belt looseness" }, critical: { min: 0.35, max: 1.0, description: "Image blur causing false defect classification" }, direction: "HIGHER_IS_WORSE" },
      { sensorId: "optical_intensity", sensorName: "Illumination Uniformity", unit: "%", normal: { min: 95.0, max: 100.0, description: "Calibrated optical illumination" }, warning: { min: 85.0, max: 95.0, description: "LED strobe aging" }, critical: { min: 50.0, max: 85.0, description: "Severe defect escape risk" }, direction: "LOWER_IS_WORSE" }
    ],
    operatingConditions: {
      ambientTemperature: "21.0 - 22.5 °C (Cleanroom ISO 6)",
      relativeHumidity: "45.0 - 55.0 %",
      normalOperatingTemperature: "23.0 °C",
      normalOperatingPressure: "6.0 bar (Clean CDA for air-bearings)",
      normalOperatingSpeed: "12 sec / strip scan",
      normalCycleTime: "12.0 sec / leadframe strip",
      normalOperatingHours: "24/7 continuous inline QA",
      recommendedOperatingConditions: "Optical lenses free of dust, calibration target scanned every 24h",
      maximumContinuousOperation: "360 hours before optical recalibration"
    },
    maintenance: [
      { component: "Optical Telecentric Lens", recommendedMaintenanceIntervalHours: 360, expectedServiceLifeHours: 8000, maintenanceAction: "Lens optical cleaning and 3D target calibration", procedureSummary: "Clean front telecentric element with optical lens paper, run 3D grid calibration target." }
    ],
    degradationIndicators: [
      { parameter: "Gantry Vibration", physicalPhenomenon: "Linear guide bearing race micro-pitting", measurableEffect: "Vibration amplitude climbs above 0.20 mm/s", degradationSignificance: "Causes motion blur and false coplanarity rejections", primarySensorId: "vibration_camera_gantry" }
    ],
    rulModel: {
      baseUsefulLifeHours: 3200,
      baseLifeUnit: "hours",
      modelName: "3D Optical AOI Degradation Model",
      formulaDescription: "RUL = BaseLife * (1 - (0.50*wear_gantry_vib + 0.30*wear_opt_temp + 0.20*wear_light))",
      weightsSum: 1.0,
      parameters: [
        { parameter: "Gantry Vibration", sensorId: "vibration_camera_gantry", sensorName: "Camera Gantry Vibration", unit: "mm/s", weight: 0.50, healthyLimit: 0.10, criticalLimit: 0.40, direction: "HIGHER_IS_WORSE" },
        { parameter: "Optics Temp", sensorId: "temp_optics", sensorName: "Optical Sensor Temp", unit: "°C", weight: 0.30, healthyLimit: 23.0, criticalLimit: 35.0, direction: "HIGHER_IS_WORSE" },
        { parameter: "Light Intensity", sensorId: "optical_intensity", sensorName: "Illumination Uniformity", unit: "%", weight: 0.20, healthyLimit: 98.0, criticalLimit: 80.0, direction: "LOWER_IS_WORSE" }
      ]
    },
    symptoms: [
      { symptomId: "SYM-AOI-001", symptom: "False Defect Classification Rate > 1.5%", severity: "medium", relatedSensors: ["vibration_camera_gantry", "optical_intensity"], possibleCauses: ["Gantry rail vibration", "LED strobe brightness decay", "Lens dust"], recommendedAction: "Clean telecentric lens and execute standard 3D target calibration." }
    ],
    failureScenarios: [
      { scenarioId: "SCEN-AOI-001", symptom: "Camera Gantry Motion Jitter & Optical Blur", severity: "warning", sensorPattern: "vibration_camera_gantry > 0.25 mm/s", possibleCauses: ["Linear motor bearing wear", "Air-bearing pressure drop"], recommendedAction: "Inspect air-bearing CDA pressure and calibrate linear motion encoder.", verificationSteps: ["Verify gantry repeatability (< 0.5µm)", "Inspect test target resolution chart"] }
    ]
  },

  // ── 8. X-RAY INSPECTION ──────────────────────────────────────────────────
  {
    filename: "x-ray-inspection",
    aliases: [],
    machine: {
      name: "Lead-Shielded Microfocus X-Ray NDT Cell",
      type: "x-ray-inspection",
      prototypeMachineId: "XR-01",
      manualId: "VAI-MAN-XR-001",
      version: "1.0",
      generatedDate: "2026-08-27",
      documentStatus: "Synthetic Cleanroom Technical Manual",
      purpose: "VectorAI Demonstration and Operational Intelligence",
      disclaimer: DISCLAIMER_TEXT,
      processStage: "Bay 5B: Lead-Shielded X-Ray",
      description: "Non-destructive testing (NDT) microfocus X-ray inspection station for detecting internal die-attach voids, wire bond sweeps, bridging, and solder ball voids within encapsulated IC packages.",
      manufacturingProcess: "A 130 kV open microfocus X-ray tube emits high-energy X-ray photons through encapsulated packages onto a high-resolution flat panel detector (FPD). A 5-axis motorized manipulator tilts and rotates the sample to generate 3D computed tomography (CT) slices.",
      subsystems: [
        "130 kV Open Microfocus High-Voltage X-Ray Source",
        "High-Resolution Digital Flat Panel Detector (FPD)",
        "5-Axis Precision Sample Manipulator Stage",
        "Lead-Shielded Radiation Enclosure with Safety Interlocks",
        "Closed-Loop Water Chiller Tube Cooling System"
      ]
    },
    components: [
      { name: "130 kV Microfocus Tube", function: "Generates sub-micron focal spot X-ray beam.", importantParameters: "High voltage (kV), target current (µA), target temp (°C).", degradationIndicators: "Filament current degradation, target pitting, voltage arc." },
      { name: "Flat Panel Detector (FPD)", function: "Converts X-ray photons into high-contrast digital radiograph.", importantParameters: "Detector temperature (°C), pixel defect count, frame rate (fps).", degradationIndicators: "Detector temperature rise, dead pixel cluster accumulation." },
      { name: "5-Axis Manipulator Stage", function: "Positions and rotates IC packages in X/Y/Z/Tilt/Rotate axes.", importantParameters: "Stage vibration (mm/s), rotation backlash (arcsec).", degradationIndicators: "Manipulator mechanical chatter, positional drift." }
    ],
    sensors: [
      { sensorId: "tube_voltage", name: "Tube High Voltage", unit: "kV", purpose: "Measures acceleration voltage supplied to microfocus X-ray tube.", minScale: 0.0, maxScale: 160.0, normalRange: [120.0, 135.0], warningRange: [135.0, 148.0], criticalRange: [148.0, 160.0], direction: "HIGHER_IS_WORSE" },
      { sensorId: "tube_temp", name: "Target Anode Temp", unit: "°C", purpose: "Measures tungsten target anode cooling temperature.", minScale: 15.0, maxScale: 70.0, normalRange: [30.0, 42.0], warningRange: [42.0, 55.0], criticalRange: [55.0, 70.0], direction: "HIGHER_IS_WORSE" },
      { sensorId: "vibration_stage", name: "Manipulator Vibration", unit: "mm/s", purpose: "Monitors mechanical vibration of 5-axis sample manipulator.", minScale: 0.0, maxScale: 1.5, normalRange: [0.1, 0.35], warningRange: [0.35, 0.70], criticalRange: [0.70, 1.5], direction: "HIGHER_IS_WORSE" }
    ],
    thresholds: [
      { sensorId: "tube_voltage", sensorName: "Tube High Voltage", unit: "kV", normal: { min: 120.0, max: 135.0, description: "Nominal X-ray photon energy" }, warning: { min: 135.0, max: 148.0, description: "High-voltage generator load drift" }, critical: { min: 148.0, max: 160.0, description: "Tube arcing & filament burnout risk" }, direction: "HIGHER_IS_WORSE" },
      { sensorId: "tube_temp", sensorName: "Target Anode Temp", unit: "°C", normal: { min: 30.0, max: 42.0, description: "Stable chiller thermal dissipation" }, warning: { min: 42.0, max: 55.0, description: "Cooling fluid flow restriction" }, critical: { min: 55.0, max: 70.0, description: "Tungsten target thermal melting" }, direction: "HIGHER_IS_WORSE" }
    ],
    operatingConditions: {
      ambientTemperature: "21.0 - 22.5 °C (Cleanroom ISO 6)",
      relativeHumidity: "40.0 - 50.0 %",
      normalOperatingTemperature: "34.8 °C (Target Anode)",
      normalOperatingPressure: "Atmospheric inside chamber, < 10^-4 Pa inside tube",
      normalOperatingSpeed: "45 sec / 3D CT scan",
      normalCycleTime: "45.0 sec / sample tray",
      normalOperatingHours: "24/7 continuous volumetric QA",
      recommendedOperatingConditions: "Chiller water flow > 3.0 L/min, radiation leakage < 0.5 µSv/h",
      maximumContinuousOperation: "500 hours before filament cathode replacement"
    },
    maintenance: [
      { component: "Tungsten Filament Cathode", recommendedMaintenanceIntervalHours: 500, expectedServiceLifeHours: 1200, maintenanceAction: "Filament replacement and vacuum tube roughing", procedureSummary: "Vent tube, replace tungsten filament hairpin, pump down to < 1x10^-4 Pa." }
    ],
    degradationIndicators: [
      { parameter: "Tube Anode Temp", physicalPhenomenon: "Cooling water circuit micro-calcification", measurableEffect: "Target temperature exceeds 45°C", degradationSignificance: "Accelerates target surface pitting and reduces image resolution", primarySensorId: "tube_temp" }
    ],
    rulModel: {
      baseUsefulLifeHours: 2450,
      baseLifeUnit: "hours",
      modelName: "Microfocus X-Ray Tube & Stage Degradation Model",
      formulaDescription: "RUL = BaseLife * (1 - (0.50*wear_tube_temp + 0.30*wear_voltage + 0.20*wear_stage_vib))",
      weightsSum: 1.0,
      parameters: [
        { parameter: "Tube Temp", sensorId: "tube_temp", sensorName: "Target Anode Temp", unit: "°C", weight: 0.50, healthyLimit: 35.0, criticalLimit: 60.0, direction: "HIGHER_IS_WORSE" },
        { parameter: "Tube Voltage", sensorId: "tube_voltage", sensorName: "Tube High Voltage", unit: "kV", weight: 0.30, healthyLimit: 130.0, criticalLimit: 155.0, direction: "HIGHER_IS_WORSE" },
        { parameter: "Stage Vibration", sensorId: "vibration_stage", sensorName: "Manipulator Vibration", unit: "mm/s", weight: 0.20, healthyLimit: 0.25, criticalLimit: 0.80, direction: "HIGHER_IS_WORSE" }
      ]
    },
    symptoms: [
      { symptomId: "SYM-XR-001", symptom: "Radiographic Image Contrast Loss / Noise", severity: "high", relatedSensors: ["tube_voltage", "tube_temp"], possibleCauses: ["Tungsten target pitting", "Chiller cooling restriction", "FPD detector gain drift"], recommendedAction: "Rotate target to fresh spot and verify chiller coolant flow." }
    ],
    failureScenarios: [
      { scenarioId: "SCEN-XR-001", symptom: "X-Ray Target Anode Overheating & Voltage Instability", severity: "warning", sensorPattern: "tube_temp > 45°C, tube_voltage > 140 kV", possibleCauses: ["Chiller heat exchanger fouling", "Filament emission drift"], recommendedAction: "Flush tube cooling chiller and calibrate filament emission current.", verificationSteps: ["Measure cooling flow rate (> 3.2 L/min)", "Verify image resolution with JIMA resolution test chart (< 2µm)"] }
    ]
  },

  // ── 9. LASER MARKING ─────────────────────────────────────────────────────
  {
    filename: "laser-marking",
    aliases: [],
    machine: {
      name: "Galvo Fiber Laser Serialization Marker",
      type: "laser-marking",
      prototypeMachineId: "LM-01",
      manualId: "VAI-MAN-LM-001",
      version: "1.0",
      generatedDate: "2026-08-27",
      documentStatus: "Synthetic Cleanroom Technical Manual",
      purpose: "VectorAI Demonstration and Operational Intelligence",
      disclaimer: DISCLAIMER_TEXT,
      processStage: "Bay 5C: Laser Marking Cell",
      description: "Pulsed 30W fiber laser marking and serialization system for inscribing high-contrast 2D DataMatrix barcodes, human-readable alphanumeric text, and lot codes onto molded package surfaces.",
      manufacturingProcess: "A 1064nm pulsed MOPA fiber laser delivers focused beam pulses through a dual-axis galvanometer scanner head and telecentric F-theta lens, vaporizing top epoxy resin monolayers without compromising package internal integrity.",
      subsystems: [
        "30W Pulsed MOPA Fiber Laser Source (1064 nm)",
        "Dual-Axis High-Speed Galvanometer Scanner",
        "F-Theta Telecentric Quartz Scanning Lens",
        "Fume Extraction Duct & Dual HEPA Filter Manifold",
        "High-Speed 2D DataMatrix OCR Verification Camera"
      ]
    },
    components: [
      { name: "MOPA Fiber Laser Source", function: "Emits 30W pulsed 1064nm laser beam.", importantParameters: "Average power (W), pulse frequency (kHz), diode pump current (A).", degradationIndicators: "Laser power degradation (<26W), pulse shape instability." },
      { name: "Galvo Scanner Mirrors", function: "Steers laser beam in X/Y axes at velocities up to 8,000 mm/s.", importantParameters: "Galvo motor temp (°C), position feedback error (µrad).", degradationIndicators: "Galvo temp rise (>35°C), barcode edge distortion." },
      { name: "F-Theta Scan Lens", function: "Focuses laser beam into flat focal plane across entire package strip.", importantParameters: "Focal length (mm), optical transmission (%).", degradationIndicators: "Epoxy fume residue on lens, beam spot widening." }
    ],
    sensors: [
      { sensorId: "laser_power", name: "Fiber Laser Power", unit: "W", purpose: "Measures optical output power delivered by fiber laser.", minScale: 0.0, maxScale: 40.0, normalRange: [28.0, 32.0], warningRange: [22.0, 28.0], criticalRange: [0.0, 22.0], direction: "LOWER_IS_WORSE" },
      { sensorId: "galvo_temp", name: "Galvo Head Temp", unit: "°C", purpose: "Measures galvanometer scanner servo motor temperature.", minScale: 15.0, maxScale: 60.0, normalRange: [24.0, 32.0], warningRange: [32.0, 42.0], criticalRange: [42.0, 60.0], direction: "HIGHER_IS_WORSE" },
      { sensorId: "exhaust_flow", name: "Exhaust Air Velocity", unit: "m/s", purpose: "Measures fume extraction air velocity at marking nozzle.", minScale: 0.0, maxScale: 20.0, normalRange: [10.0, 14.0], warningRange: [6.0, 10.0], criticalRange: [0.0, 6.0], direction: "LOWER_IS_WORSE" }
    ],
    thresholds: [
      { sensorId: "laser_power", sensorName: "Fiber Laser Power", unit: "W", normal: { min: 28.0, max: 32.0, description: "Nominal mark depth and contrast" }, warning: { min: 22.0, max: 28.0, description: "Pump diode degradation" }, critical: { min: 0.0, max: 22.0, description: "Unreadable 2D barcode marking" }, direction: "LOWER_IS_WORSE" },
      { sensorId: "galvo_temp", sensorName: "Galvo Head Temp", unit: "°C", normal: { min: 24.0, max: 32.0, description: "Stable mirror positioning" }, warning: { min: 32.0, max: 42.0, description: "Galvo driver thermal stress" }, critical: { min: 42.0, max: 60.0, description: "Thermal drift and mark distortion" }, direction: "HIGHER_IS_WORSE" }
    ],
    operatingConditions: {
      ambientTemperature: "21.0 - 23.0 °C (Cleanroom ISO 7)",
      relativeHumidity: "40.0 - 50.0 %",
      normalOperatingTemperature: "28.5 °C (Galvo)",
      normalOperatingPressure: "Exhaust duct air velocity > 10.0 m/s",
      normalOperatingSpeed: "5.0 sec / leadframe strip",
      normalCycleTime: "5.0 sec / strip serialization",
      normalOperatingHours: "24/7 continuous inline marking",
      recommendedOperatingConditions: "F-theta lens cleaned every 500 hours, exhaust filter checked weekly",
      maximumContinuousOperation: "500 hours before scheduled optical calibration"
    },
    maintenance: [
      { component: "F-Theta Quartz Scan Lens", recommendedMaintenanceIntervalHours: 500, expectedServiceLifeHours: 8000, maintenanceAction: "Optical window cleaning & 2D DataMatrix OCR calibration", procedureSummary: "Wipe lens with spectroscopic-grade methanol, verify barcode grade A on ISO/IEC 15415 standard." }
    ],
    degradationIndicators: [
      { parameter: "Laser Output Power", physicalPhenomenon: "Fiber pump laser diode emission decay", measurableEffect: "Power drops from 30W to < 24W", degradationSignificance: "Causes shallow marks and OCR verification failures", primarySensorId: "laser_power" }
    ],
    rulModel: {
      baseUsefulLifeHours: 3500,
      baseLifeUnit: "hours",
      modelName: "Laser Marker Optical & Thermal Degradation Model",
      formulaDescription: "RUL = BaseLife * (1 - (0.50*wear_laser_power + 0.30*wear_galvo_temp + 0.20*wear_exhaust))",
      weightsSum: 1.0,
      parameters: [
        { parameter: "Laser Power", sensorId: "laser_power", sensorName: "Fiber Laser Power", unit: "W", weight: 0.50, healthyLimit: 30.0, criticalLimit: 20.0, direction: "LOWER_IS_WORSE" },
        { parameter: "Galvo Temp", sensorId: "galvo_temp", sensorName: "Galvo Head Temp", unit: "°C", weight: 0.30, healthyLimit: 28.0, criticalLimit: 45.0, direction: "HIGHER_IS_WORSE" },
        { parameter: "Exhaust Flow", sensorId: "exhaust_flow", sensorName: "Exhaust Air Velocity", unit: "m/s", weight: 0.20, healthyLimit: 12.0, criticalLimit: 5.0, direction: "LOWER_IS_WORSE" }
      ]
    },
    symptoms: [
      { symptomId: "SYM-LM-001", symptom: "2D DataMatrix Barcode Readability Grade < B", severity: "high", relatedSensors: ["laser_power", "exhaust_flow"], possibleCauses: ["F-theta lens smoke residue", "Laser power drop", "Exhaust filter loaded"], recommendedAction: "Wipe scan lens and replace fume extraction pre-filter." }
    ],
    failureScenarios: [
      { scenarioId: "SCEN-LM-001", symptom: "Planned Optical Window Cleaning & F-Theta Calibration", severity: "low", sensorPattern: "laser_power == 0 W (Machine offline)", possibleCauses: ["Scheduled 500-hour preventive maintenance interval"], recommendedAction: "Complete optical lens wipe and run 2D DataMatrix verification target lot.", verificationSteps: ["Verify laser power with thermal power meter (> 29.5W)", "Scan verification target sheet (Grade A verified)"] }
    ]
  },

  // ── 10. TEST HANDLER ─────────────────────────────────────────────────────
  {
    filename: "test-handler",
    aliases: ["ic-tester-sorter"],
    machine: {
      name: "Tri-Temp High-Throughput IC Test Handler",
      type: "test-handler",
      prototypeMachineId: "TH-01",
      manualId: "VAI-MAN-TH-001",
      version: "1.0",
      generatedDate: "2026-08-27",
      documentStatus: "Synthetic Cleanroom Technical Manual",
      purpose: "VectorAI Demonstration and Operational Intelligence",
      disclaimer: DISCLAIMER_TEXT,
      processStage: "Bay 6A: Tri-Temp Final Test",
      description: "Automated tri-temperature IC test handler for presenting packaged semiconductor devices to Automated Test Equipment (ATE) at hot (+150°C), ambient (+25°C), and cold (-40°C) conditions.",
      manufacturingProcess: "Packaged ICs are loaded into soak chambers where LN2 injection or electric heaters stabilize device temperature. High-speed pick-and-place arms insert devices into Kelvin contact sockets. ATE testers execute parametric and functional tests, and the handler sorts ICs into Pass, Fail, and Speed bins.",
      subsystems: [
        "Tri-Temp (-40°C to +150°C) Thermal Conditioning Soak Chamber",
        "High-Frequency Kelvin Contact Socket & Actuator",
        "Rotary High-Speed Pick-and-Place Theta Arm",
        "Liquid Nitrogen (LN2) Cryo-Injection Valve & CDA Manifold",
        "Multi-Category Automated Device Binning Shuttle"
      ]
    },
    components: [
      { name: "Kelvin Test Socket Contactor", function: "Provides low-resistance electrical contact to IC pins during testing.", importantParameters: "Contact resistance (mΩ), pogo pin force (N), contact cycle count.", degradationIndicators: "Contact resistance spike (>50 mΩ), false failure rejections." },
      { name: "Tri-Temp Thermal Soak Chamber", function: "Stabilizes IC package temperature at -40°C to +150°C.", importantParameters: "Chamber temperature (°C), LN2 flow rate, heater output (%).", degradationIndicators: "Temperature oscillation (>±2°C), LN2 valve icing." },
      { name: "Pick-and-Place Theta Arm", function: "Inserts and extracts devices into test socket with high speed.", importantParameters: "Arm vibration (mm/s), theta rotation angle, cycle time (sec).", degradationIndicators: "Arm vibration rise (>0.7 mm/s), socket insertion misalignment." }
    ],
    sensors: [
      { sensorId: "vibration_handler", name: "Handler Vibration", unit: "mm/s", purpose: "Monitors handler pick-and-place linear guide and theta arm vibration.", minScale: 0.0, maxScale: 2.0, normalRange: [0.1, 0.55], warningRange: [0.55, 1.1], criticalRange: [1.1, 2.0], direction: "HIGHER_IS_WORSE" },
      { sensorId: "temperature_chamber", name: "Soak Chamber Temp", unit: "°C", purpose: "Measures device thermal soak chamber temperature.", minScale: -50.0, maxScale: 160.0, normalRange: [80.0, 90.0], warningRange: [90.0, 105.0], criticalRange: [105.0, 160.0], direction: "HIGHER_IS_WORSE" },
      { sensorId: "load_actuator", name: "Socket Actuator Load", unit: "N", purpose: "Monitors dynamic force applied to seat device into Kelvin socket.", minScale: 0.0, maxScale: 120.0, normalRange: [40.0, 60.0], warningRange: [60.0, 80.0], criticalRange: [80.0, 120.0], direction: "HIGHER_IS_WORSE" }
    ],
    thresholds: [
      { sensorId: "vibration_handler", sensorName: "Handler Vibration", unit: "mm/s", normal: { min: 0.1, max: 0.55, description: "Smooth pick-and-place transfer" }, warning: { min: 0.55, max: 1.1, description: "Theta arm bearing wear or guide rail friction" }, critical: { min: 1.1, max: 2.0, description: "Device jam and socket pin bending risk" }, direction: "HIGHER_IS_WORSE" },
      { sensorId: "load_actuator", sensorName: "Socket Actuator Load", unit: "N", normal: { min: 40.0, max: 60.0, description: "Nominal socket contact force" }, warning: { min: 60.0, max: 80.0, description: "Socket pogo pin contamination" }, critical: { min: 80.0, max: 120.0, description: "Pogo pin crushing and package lead damage" }, direction: "HIGHER_IS_WORSE" }
    ],
    operatingConditions: {
      ambientTemperature: "21.0 - 23.0 °C (Cleanroom ISO 7)",
      relativeHumidity: "40.0 - 50.0 %",
      normalOperatingTemperature: "85.0 °C (Hot Soak) / -40.0 °C (Cold Soak)",
      normalOperatingPressure: "6.0 bar (CDA), 2.5 bar (LN2 line)",
      normalOperatingSpeed: "1,200 UPH (Units Per Hour)",
      normalCycleTime: "8.0 sec / test insertion",
      normalOperatingHours: "24/7 continuous final test",
      recommendedOperatingConditions: "Socket pogo pins cleaned every 20,000 insertions, chamber calibrated weekly",
      maximumContinuousOperation: "120,000 test insertions before socket contactor block replacement"
    },
    maintenance: [
      { component: "Kelvin Pogo Pin Contactor Block", recommendedMaintenanceIntervalHours: 200, expectedServiceLifeHours: 600, maintenanceAction: "Pogo pin contact resistance check & socket insert replacement", procedureSummary: "Swap 128-pin high-frequency contact block, clean optical alignment theta sensor." }
    ],
    degradationIndicators: [
      { parameter: "Socket Actuator Load", physicalPhenomenon: "Pogo pin spring fatigue & solder oxide accumulation", measurableEffect: "Contact resistance exceeds 65 mΩ", degradationSignificance: "Causes false parametric test rejects and yield loss", primarySensorId: "load_actuator" }
    ],
    rulModel: {
      baseUsefulLifeHours: 2100,
      baseLifeUnit: "hours",
      modelName: "Test Handler Mechanical & Contact Degradation Model",
      formulaDescription: "RUL = BaseLife * (1 - (0.50*wear_handler_vib + 0.30*wear_actuator + 0.20*wear_chamber_temp))",
      weightsSum: 1.0,
      parameters: [
        { parameter: "Handler Vibration", sensorId: "vibration_handler", sensorName: "Handler Vibration", unit: "mm/s", weight: 0.50, healthyLimit: 0.50, criticalLimit: 1.20, direction: "HIGHER_IS_WORSE" },
        { parameter: "Actuator Load", sensorId: "load_actuator", sensorName: "Socket Actuator Load", unit: "N", weight: 0.30, healthyLimit: 50.0, criticalLimit: 85.0, direction: "HIGHER_IS_WORSE" },
        { parameter: "Chamber Temp", sensorId: "temperature_chamber", sensorName: "Soak Chamber Temp", unit: "°C", weight: 0.20, healthyLimit: 85.0, criticalLimit: 110.0, direction: "HIGHER_IS_WORSE" }
      ]
    },
    symptoms: [
      { symptomId: "SYM-TH-001", symptom: "Parametric Test False-Reject Spike > 1.2%", severity: "high", relatedSensors: ["load_actuator", "vibration_handler"], possibleCauses: ["Kelvin socket pogo pin contamination", "Socket actuator force drift", "Theta positioning error"], recommendedAction: "Replace pogo pin contactor block and clean optical theta encoder." }
    ],
    failureScenarios: [
      { scenarioId: "SCEN-TH-001", symptom: "Kelvin RF Socket Pogo Pin Contact Resistance Elevation", severity: "warning", sensorPattern: "load_actuator > 65 N, vibration_handler > 0.70 mm/s", possibleCauses: ["Pogo pin oxide buildup after 120,000 cycles", "Actuator guide friction"], recommendedAction: "Replace 128-pin Kelvin high-frequency contactor block and clean optical rotary encoder.", verificationSteps: ["Verify 4-wire Kelvin contact resistance (< 25 mΩ)", "Run 50-device golden unit verification test (100% pass)"] }
    ]
  },

  // ── 11. TAPE & REEL ──────────────────────────────────────────────────────
  {
    filename: "tape-reel",
    aliases: [],
    machine: {
      name: "Automated High-Speed Tape & Reel Packaging Cell",
      type: "tape-reel",
      prototypeMachineId: "TR-01",
      manualId: "VAI-MAN-TR-001",
      version: "1.0",
      generatedDate: "2026-08-27",
      documentStatus: "Synthetic Cleanroom Technical Manual",
      purpose: "VectorAI Demonstration and Operational Intelligence",
      disclaimer: DISCLAIMER_TEXT,
      processStage: "Bay 6B: Tape & Reel Packaging",
      description: "Automated tape and reel packaging system for loading tested IC packages into carrier tape pockets, sealing anti-static cover tape, and winding completed reels for customer shipping.",
      manufacturingProcess: "Tested IC devices are picked from test trays and placed into embossed carrier tape pockets with orientation verified by vision cameras. A constant-temperature floating heat seal bar seals anti-static cover tape over carrier pockets, and finished tape is wound onto 13-inch ESD reels.",
      subsystems: [
        "Rotary Component Pickup & Orientation Check Vision System",
        "Embossed Carrier Tape Indexer & Sprocket Drive",
        "Constant-Temperature Floating Heat Seal Bar Mechanism",
        "Cover Tape Tensioner & Dynamic Peel Force Sensor",
        "13-Inch ESD Reel Stacker & Automatic Winder"
      ]
    },
    components: [
      { name: "Heat Seal Bar", function: "Applies controlled heat and pressure to seal cover tape over carrier pockets.", importantParameters: "Seal bar temp (°C), seal pressure (bar), dwell time (ms).", degradationIndicators: "Temperature fluctuation (>±3°C), heater element resistance drift." },
      { name: "Tape Indexer Sprocket Drive", function: "Indexes carrier tape pocket-by-pocket with high precision.", importantParameters: "Indexer vibration (mm/s), step positioning accuracy (µm).", degradationIndicators: "Indexer mechanical vibration (>0.5 mm/s), pocket pitch drift." },
      { name: "Cover Tape Tensioner & Peel Sensor", function: "Maintains uniform tape tension and verifies peel strength compliance.", importantParameters: "Tape peel force (N), tensioner spring load (N).", degradationIndicators: "Peel force out of 0.3 - 0.7N EIA-481 spec, tape tearing." }
    ],
    sensors: [
      { sensorId: "vibration_indexer", name: "Indexer Vibration", unit: "mm/s", purpose: "Monitors carrier tape indexing motor and sprocket bearing vibration.", minScale: 0.0, maxScale: 1.5, normalRange: [0.1, 0.38], warningRange: [0.38, 0.75], criticalRange: [0.75, 1.5], direction: "HIGHER_IS_WORSE" },
      { sensorId: "temp_sealer", name: "Heat Seal Bar Temp", unit: "°C", purpose: "Measures continuous sealing temperature on cover tape.", minScale: 100.0, maxScale: 240.0, normalRange: [168.0, 182.0], warningRange: [182.0, 200.0], criticalRange: [200.0, 240.0], direction: "HIGHER_IS_WORSE" },
      { sensorId: "peel_force", name: "Tape Peel Force", unit: "N", purpose: "Measures dynamic cover tape peel strength compliance per EIA-481.", minScale: 0.0, maxScale: 2.0, normalRange: [0.35, 0.55], warningRange: [0.55, 0.85], criticalRange: [0.85, 2.0], direction: "HIGHER_IS_WORSE" }
    ],
    thresholds: [
      { sensorId: "temp_sealer", sensorName: "Heat Seal Bar Temp", unit: "°C", normal: { min: 168.0, max: 182.0, description: "Optimal EIA-481 seal adhesion" }, warning: { min: 182.0, max: 200.0, description: "Cover tape melting risk" }, critical: { min: 200.0, max: 240.0, description: "Carrier pocket distortion and component damage" }, direction: "HIGHER_IS_WORSE" },
      { sensorId: "peel_force", sensorName: "Tape Peel Force", unit: "N", normal: { min: 0.35, max: 0.55, description: "Compliant peel strength" }, warning: { min: 0.55, max: 0.85, description: "Peel strength approaching upper specification limit" }, critical: { min: 0.85, max: 2.0, description: "Non-compliant seal: Customer feeder jam risk" }, direction: "HIGHER_IS_WORSE" }
    ],
    operatingConditions: {
      ambientTemperature: "21.0 - 23.0 °C (Cleanroom ISO 7)",
      relativeHumidity: "40.0 - 50.0 %",
      normalOperatingTemperature: "175.0 °C (Seal Bar)",
      normalOperatingPressure: "6.0 bar (CDA), -85 kPa (Vacuum)",
      normalOperatingSpeed: "4.0 sec / pocket index",
      normalCycleTime: "4.0 sec / packaging cycle",
      normalOperatingHours: "24/7 continuous packaging",
      recommendedOperatingConditions: "EIA-481 peel force between 0.3 - 0.6 N, seal blade cleaned daily",
      maximumContinuousOperation: "300 hours before seal blade de-gunking"
    },
    maintenance: [
      { component: "Floating Heat Seal Blade", recommendedMaintenanceIntervalHours: 250, expectedServiceLifeHours: 2000, maintenanceAction: "Seal blade residue removal & thermocouple calibration", procedureSummary: "Clean brass seal blade with non-abrasive brass brush, calibrate surface pyrometer." }
    ],
    degradationIndicators: [
      { parameter: "Heat Seal Bar Temp", physicalPhenomenon: "Cartridge heater aging & thermocouple detachment", measurableEffect: "Seal temperature drifts above 185°C", degradationSignificance: "Causes cover tape over-sealing and peel force violation", primarySensorId: "temp_sealer" }
    ],
    rulModel: {
      baseUsefulLifeHours: 2400,
      baseLifeUnit: "hours",
      modelName: "Tape & Reel Packaging Degradation Model",
      formulaDescription: "RUL = BaseLife * (1 - (0.45*wear_temp_sealer + 0.35*wear_peel + 0.20*wear_vib))",
      weightsSum: 1.0,
      parameters: [
        { parameter: "Seal Temp", sensorId: "temp_sealer", sensorName: "Heat Seal Bar Temp", unit: "°C", weight: 0.45, healthyLimit: 175.0, criticalLimit: 205.0, direction: "HIGHER_IS_WORSE" },
        { parameter: "Peel Force", sensorId: "peel_force", sensorName: "Tape Peel Force", unit: "N", weight: 0.35, healthyLimit: 0.45, criticalLimit: 0.90, direction: "HIGHER_IS_WORSE" },
        { parameter: "Indexer Vibration", sensorId: "vibration_indexer", sensorName: "Indexer Vibration", unit: "mm/s", weight: 0.20, healthyLimit: 0.30, criticalLimit: 0.85, direction: "HIGHER_IS_WORSE" }
      ]
    },
    symptoms: [
      { symptomId: "SYM-TR-001", symptom: "Cover Tape Peel Force Out of EIA-481 Spec", severity: "high", relatedSensors: ["temp_sealer", "peel_force"], possibleCauses: ["Seal bar temperature drift", "Seal pressure misalignment", "Cover tape adhesive degradation"], recommendedAction: "Calibrate seal bar temperature and inspect floating pressure springs." }
    ],
    failureScenarios: [
      { scenarioId: "SCEN-TR-001", symptom: "Cover Tape Seal Bar Temp Fluctuation & Peel Force Variance", severity: "warning", sensorPattern: "temp_sealer > 185°C, peel_force > 0.65 N", possibleCauses: ["Heater thermocouple contact degradation", "Adhesive residue on seal bar"], recommendedAction: "Clean brass seal blade and recalibrate temperature controller PID loop.", verificationSteps: ["Execute 10-meter peel force test on calibrated pull tester (0.35-0.55N verified)", "Inspect pocket seal width under optical comparator"] }
    ]
  }
];

// Write all JSONs
for (const m of ALL_11_MACHINES) {
  const primaryPath = path.join(dataDir, `${m.filename}.json`);
  fs.writeFileSync(primaryPath, JSON.stringify(m, null, 2), 'utf8');
  console.log(`Generated Knowledge JSON: ${primaryPath}`);

  for (const alias of m.aliases) {
    const aliasPath = path.join(dataDir, `${alias}.json`);
    fs.writeFileSync(aliasPath, JSON.stringify(m, null, 2), 'utf8');
    console.log(`  -> Alias JSON: ${aliasPath}`);
  }
}

console.log(`\nSuccessfully created all ${ALL_11_MACHINES.length} Cleanroom Knowledge JSON files!`);
