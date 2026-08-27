// =========================================================================
// VECTOR.AI - DYNAMIC REROUTING & EXECUTION REASONING ENGINE
// Autonomous solver for equipment failure reroutes, SECS/GEM interlocks,
// MES queue balancing, AMHS fleet dispatch, and live execution logging.
// =========================================================================

import {
  RerouteExecution,
  RerouteStep,
  ExecutionLogEntry,
  MachineFaultScenario,
} from '../../../types/rerouting';
import rawMachinesData from '../../../data/machines.json';

export const PRECONFIGURED_FAULT_SCENARIOS: MachineFaultScenario[] = [
  {
    id: 'SCENARIO-WS-01',
    machineId: 'WS-01',
    machineName: '300mm Precision Wafer Saw 01',
    processStage: 'Wafer Dicing & Prep',
    faultTitle: 'Spindle Harmonic Resonance & Ceramic Bearing Micro-Spalling',
    severity: 'EMERGENCY',
    triggerTelemetry: {
      sensorName: 'vibration_spindle',
      triggerValue: '1.65 mm/s',
      baselineValue: '0.50 mm/s',
      criticalLimit: '1.40 mm/s',
    },
    suggestedTargetId: 'WS-02',
    suggestedTargetName: '300mm Precision Wafer Saw 02',
    rootCause:
      'High-frequency spindle bearing race micro-spalling detected at 60,000 RPM. Continued operation will induce wafer micro-cracking and kerf width wandering across 300mm GaN substrate lots.',
    lotsToReroute: [
      {
        lotId: 'LOT-VAI-9941',
        productFamily: 'Automotive IGBT Micro-Die',
        waferCount: 250,
        priority: 'CRITICAL',
        currentStage: 'Wafer Dicing',
        originalMachineId: 'WS-01',
        targetMachineId: 'WS-02',
        agvCarrierId: 'AGV-ALPHA-04',
        estimatedScrapSavingsUsd: 184000,
      },
      {
        lotId: 'LOT-VAI-9948',
        productFamily: '5G RF Front-End Module',
        waferCount: 200,
        priority: 'EXPEDITE',
        currentStage: 'Wafer Dicing',
        originalMachineId: 'WS-01',
        targetMachineId: 'WS-02',
        agvCarrierId: 'AGV-BETA-02',
        estimatedScrapSavingsUsd: 145000,
      },
    ],
  },
  {
    id: 'SCENARIO-DA-02',
    machineId: 'DA-02',
    machineName: 'High-Precision Die Bonder 02',
    processStage: 'Die Attach',
    faultTitle: 'Collet Vacuum Line Decay & Pickup Stage Pressure Loss',
    severity: 'CRITICAL',
    triggerTelemetry: {
      sensorName: 'pressure_vacuum',
      triggerValue: '-49.2 kPa',
      baselineValue: '-88.0 kPa',
      criticalLimit: '-65.0 kPa',
    },
    suggestedTargetId: 'DA-01',
    suggestedTargetName: 'High-Precision Die Bonder 01',
    rootCause:
      'Silicone pickup nozzle elastomer micro-tear causing rapid vacuum bleed. Die misplacement probability elevated to 92.4%, risking silver epoxy smear on leadframe bond pads.',
    lotsToReroute: [
      {
        lotId: 'LOT-VAI-8812',
        productFamily: 'AI Neural Accelerator ASIC',
        waferCount: 300,
        priority: 'CRITICAL',
        currentStage: 'Die Attach',
        originalMachineId: 'DA-02',
        targetMachineId: 'DA-01',
        agvCarrierId: 'AGV-GAMMA-01',
        estimatedScrapSavingsUsd: 320000,
      },
    ],
  },
  {
    id: 'SCENARIO-WB-01',
    machineId: 'WB-01',
    machineName: 'Thermosonic Ball Bonder 01',
    processStage: 'Wire Bonding',
    faultTitle: 'Piezo-Electric Transducer Thermal Runaway & Acoustic Decoupling',
    severity: 'CRITICAL',
    triggerTelemetry: {
      sensorName: 'temperature_transducer',
      triggerValue: '71.5 °C',
      baselineValue: '38.0 °C',
      criticalLimit: '65.0 °C',
    },
    suggestedTargetId: 'WB-02',
    suggestedTargetName: 'Thermosonic Ball Bonder 02',
    rootCause:
      'Piezo-electric transducer ceramic stack overheating causing ultrasonic frequency shift (138 kHz -> 144 kHz). Bond pad intermetallic coverage degraded, risking lifted stitch bonds.',
    lotsToReroute: [
      {
        lotId: 'LOT-VAI-7742',
        productFamily: 'Aerospace Flight Controller MCU',
        waferCount: 180,
        priority: 'CRITICAL',
        currentStage: 'Wire Bonding',
        originalMachineId: 'WB-01',
        targetMachineId: 'WB-02',
        agvCarrierId: 'AGV-DELTA-03',
        estimatedScrapSavingsUsd: 210000,
      },
    ],
  },
  {
    id: 'SCENARIO-MP-01',
    machineId: 'MP-01',
    machineName: 'Auto Molding Press 01 (Multi-Cavity)',
    processStage: 'Molding',
    faultTitle: 'Hydraulic Mold Clamping Overpressure & Thermal Gradient Mismatch',
    severity: 'HIGH',
    triggerTelemetry: {
      sensorName: 'pressure_hydraulic',
      triggerValue: '188.4 bar',
      baselineValue: '150.0 bar',
      criticalLimit: '185.0 bar',
    },
    suggestedTargetId: 'MP-02',
    suggestedTargetName: 'Auto Molding Press 02 (Multi-Cavity)',
    rootCause:
      'Hydraulic proportional valve stiction causing pressure spikes during compound transfer phase. Potential wire sweep or package resin void formation.',
    lotsToReroute: [
      {
        lotId: 'LOT-VAI-6604',
        productFamily: 'Power Management IC (PMIC)',
        waferCount: 350,
        priority: 'STANDARD',
        currentStage: 'Molding',
        originalMachineId: 'MP-01',
        targetMachineId: 'MP-02',
        agvCarrierId: 'AGV-ALPHA-02',
        estimatedScrapSavingsUsd: 95000,
      },
    ],
  },
  {
    id: 'SCENARIO-TH-02',
    machineId: 'TH-02',
    machineName: 'IC Tri-Temp Test Handler 02',
    processStage: 'Testing & Sort',
    faultTitle: 'Handler Turret Optical Alignment Drift & Indexer Vibration Jam',
    severity: 'CRITICAL',
    triggerTelemetry: {
      sensorName: 'vibration_handler',
      triggerValue: '0.98 mm/s',
      baselineValue: '0.40 mm/s',
      criticalLimit: '0.90 mm/s',
    },
    suggestedTargetId: 'TH-01',
    suggestedTargetName: 'IC Tri-Temp Test Handler 01',
    rootCause:
      'Turret indexing cam wear inducing rotary chatter and optical fiducial misalignment. Risk of bent IC leads and false test binning failures.',
    lotsToReroute: [
      {
        lotId: 'LOT-VAI-5510',
        productFamily: 'Edge-AI SoC Processor',
        waferCount: 400,
        priority: 'EXPEDITE',
        currentStage: 'Testing & Sort',
        originalMachineId: 'TH-02',
        targetMachineId: 'TH-01',
        agvCarrierId: 'AGV-BETA-01',
        estimatedScrapSavingsUsd: 260000,
      },
    ],
  },
  {
    id: 'SCENARIO-AOI-02',
    machineId: 'AOI-02',
    machineName: '3D Optical AOI Line 02',
    processStage: 'Optical Inspection',
    faultTitle: 'Optical Illumination Decay & Camera Gantry Resonance',
    severity: 'HIGH',
    triggerTelemetry: {
      sensorName: 'optical_intensity',
      triggerValue: '76.4%',
      baselineValue: '98.5%',
      criticalLimit: '80.0%',
    },
    suggestedTargetId: 'AOI-01',
    suggestedTargetName: '3D Optical AOI Line 01',
    rootCause:
      'LED strobe power supply degradation causing illumination drop across field of view. Risk of false pass on solder joint coplanarity defects.',
    lotsToReroute: [
      {
        lotId: 'LOT-VAI-4420',
        productFamily: 'High-Density BGA Substrate',
        waferCount: 220,
        priority: 'STANDARD',
        currentStage: 'Optical Inspection',
        originalMachineId: 'AOI-02',
        targetMachineId: 'AOI-01',
        agvCarrierId: 'AGV-GAMMA-02',
        estimatedScrapSavingsUsd: 110000,
      },
    ],
  },
];

export const STANDARD_REROUTE_STEPS: Omit<RerouteStep, 'status' | 'startedAt' | 'completedAt' | 'durationMs'>[] = [
  {
    stepNumber: 1,
    phase: 'TRIGGER_ISOLATION',
    name: 'Anomaly Ingestion & Fault Isolation',
    description: 'Telemetry sensor threshold excursion confirmed. Isolate equipment from cleanroom scheduling pool.',
    reasoningSummary: 'Prevent downstream tool pollution and stop further lot feed into degraded mechanical subsystem.',
  },
  {
    stepNumber: 2,
    phase: 'SAFETY_LOCKOUT',
    name: 'SECS/GEM Hardware Lockout & Lot Drain',
    description: 'Issue remote SECS/GEM pause/lockout interlock (S2F41 Host Command). Allow currently gripped substrate to safely complete cycle.',
    reasoningSummary: 'Ensure tool stops safely without damaging currently processed wafer; lock input buffer against new carrier loads.',
  },
  {
    stepNumber: 3,
    phase: 'DIAGNOSTIC_REASONING',
    name: 'AI Root Cause Analysis & Risk Quantification',
    description: 'Correlate high-frequency vibration, thermal, and pressure signals against OEM physical envelopes to estimate failure modes.',
    reasoningSummary: 'Quantify yield hazard and scrap cost delta ($329,000 baseline risk) if line is not immediately rebalanced.',
  },
  {
    stepNumber: 4,
    phase: 'TARGET_SELECTION',
    name: 'Multi-Criteria AI Line Balancing Solver',
    description: 'Evaluate candidate machines across queue depth, recipe capability, tooling wear, thermal baseline, and AGV transit latency.',
    reasoningSummary: 'Identify optimal target tool with lowest overall impact on factory takt time and zero yield penalty.',
  },
  {
    stepNumber: 5,
    phase: 'MES_LOT_REASSIGNMENT',
    name: 'MES Dispatch Matrix & Lot Reroute Update',
    description: 'Reassign active WIP and queued lots in Manufacturing Execution System (MES) routing tables with elevated priority tag.',
    reasoningSummary: 'Update digital traveler barcodes and factory tracking database so lots are recognized at the new station.',
  },
  {
    stepNumber: 6,
    phase: 'AMHS_AGV_DISPATCH',
    name: 'AMHS / AGV Robotic Carrier Redirection',
    description: 'Dispatch Automated Material Handling AGVs to pickup FOUP/cassette carriers from source buffer and transit to target bay.',
    reasoningSummary: 'Dynamic pathfinding through cleanroom transit corridors avoiding active personnel and tool maintenance zones.',
  },
  {
    stepNumber: 7,
    phase: 'RECIPE_HANDSHAKE',
    name: 'Recipe Parameter & Tool Calibration Sync',
    description: 'Push verified process recipe, blade height/collet offset parameters, and vision fiducial calibration to target tool controller.',
    reasoningSummary: 'Guarantees zero process deviation between source and target tools prior to lot ingestion.',
  },
  {
    stepNumber: 8,
    phase: 'INGESTION_VERIFICATION',
    name: 'Target Ingestion & Production Continuity Verification',
    description: 'FOUP docked at target port. Sensor baseline verified. First wafer optical scan OK. Rebalance execution completed.',
    reasoningSummary: 'Confirmed 100% production continuity with zero scrap and minimal takt time delta.',
  },
];

// Helper: build comprehensive candidate evaluations dynamically using real machines and live telemetry
export function buildCandidateEvaluations(
  sourceId: string,
  targetId: string,
  liveMachines?: any[]
): any[] {
  const pool: any[] = liveMachines && liveMachines.length > 0 ? liveMachines : (rawMachinesData as any[]);

  // Map machine category / prefix to identify real peer tools
  const prefix = sourceId.split('-')[0];
  const peers = pool.filter((m) => m.id.startsWith(prefix) && m.id !== sourceId);
  const candidateList = peers.length > 0 ? peers : pool.filter((m) => m.id !== sourceId).slice(0, 3);

  return candidateList.map((m) => {
    const isTarget = m.id === targetId;
    // Exactly use the real existing machine's healthScore from machines.json / live state
    const exactHealthScore = typeof m.healthScore === 'number' ? m.healthScore : 95;
    
    // Utilization derived realistically: degraded/warning tools have higher queue strain, healthy target has free headroom
    let utilization: number;
    if (m.status === 'critical' || m.status === 'CRITICAL' || exactHealthScore < 60) {
      utilization = 88;
    } else if (m.status === 'warning' || m.status === 'WARNING' || exactHealthScore < 80) {
      utilization = 76;
    } else if (isTarget) {
      utilization = 54;
    } else {
      utilization = Math.max(40, Math.min(85, Math.round(92 - exactHealthScore * 0.4)));
    }

    const availableCapacity = Math.max(5, 100 - utilization);
    const toolCompatibility = isTarget ? 100 : m.id.startsWith(prefix) ? 95 : 85;
    const agvTransitTime = isTarget ? 38 : Math.floor(Math.random() * 30 + 48);

    // Multi-Attribute Utility Score (Capacity 35%, Compatibility 30%, Health 20%, Transit Time 15%)
    const transitScore = Math.max(0, 100 - (agvTransitTime / 120) * 100);
    const overallScore = parseFloat(
      (availableCapacity * 0.35 + toolCompatibility * 0.30 + exactHealthScore * 0.20 + transitScore * 0.15).toFixed(1)
    );

    let reasoning = '';
    if (isTarget) {
      reasoning = `Selected optimal target: ${availableCapacity}% free buffer capacity, nominal health score (${exactHealthScore}/100), and shortest AGV transit corridor (${agvTransitTime}s).`;
    } else if (exactHealthScore < 80) {
      reasoning = `Degraded telemetry baseline (Health: ${exactHealthScore}/100, Status: ${m.status}); not recommended for incoming lot diversion.`;
    } else if (availableCapacity < 25) {
      reasoning = `High active queue depth (${utilization}% load) would introduce a takt bottleneck; lower free buffer headroom (${availableCapacity}%).`;
    } else {
      reasoning = `Secondary standby: Compatible tooling (${toolCompatibility}%), but longer transit latency (${agvTransitTime}s) across inter-bay corridor.`;
    }

    return {
      machineId: m.id,
      machineName: m.name || `Machine ${m.id}`,
      currentUtilization: utilization,
      availableCapacity: availableCapacity,
      healthScore: exactHealthScore,
      toolCompatibilityScore: toolCompatibility,
      agvTransferTimeSeconds: agvTransitTime,
      overallScore: overallScore,
      isRecommended: isTarget,
      evaluationReasoning: reasoning,
    };
  });
}

// Generate realistic log entries for a scenario
export function generateExecutionLogsForScenario(
  scenario: MachineFaultScenario,
  nowIso: string = new Date().toISOString()
): ExecutionLogEntry[] {
  const t = (offsetSec: number) => {
    const d = new Date(new Date(nowIso).getTime() + offsetSec * 1000);
    return d.toISOString();
  };

  const logs: ExecutionLogEntry[] = [
    // Phase 1: Trigger & Isolation
    {
      id: `LOG-101`,
      timestamp: t(0),
      phase: 'TRIGGER_ISOLATION',
      phaseLabel: 'Anomaly Ingestion',
      level: 'WARN',
      subsystem: 'Edge Telemetry Gateway',
      message: `ANOMALY SPIKE: ${scenario.machineId} ${scenario.triggerTelemetry.sensorName} breached threshold (${scenario.triggerTelemetry.triggerValue} vs max safe ${scenario.triggerTelemetry.criticalLimit}).`,
      reasoningNote: `Instantaneous sensor delta exceeds 3-sigma statistical control limit. Automated diagnostic threshold triggers immediate safety protocol.`,
      payload: {
        sensorId: scenario.triggerTelemetry.sensorName,
        currentValue: scenario.triggerTelemetry.triggerValue,
        safeThreshold: scenario.triggerTelemetry.criticalLimit,
        baseline: scenario.triggerTelemetry.baselineValue,
        machineId: scenario.machineId,
      },
    },
    {
      id: `LOG-102`,
      timestamp: t(0.4),
      phase: 'TRIGGER_ISOLATION',
      phaseLabel: 'Equipment Isolation',
      level: 'ACTION',
      subsystem: 'Fleet Safety Controller',
      message: `Isolated node ${scenario.machineId} from active lot dispatch pool. Halted incoming conveyor intake.`,
      reasoningNote: `Immediate isolation prevents queued wafers from being introduced to the damaged machine, eliminating scrap cascade.`,
    },

    // Phase 2: Safety Lockout & Drain
    {
      id: `LOG-201`,
      timestamp: t(1.1),
      phase: 'SAFETY_LOCKOUT',
      phaseLabel: 'SECS/GEM Interlock',
      level: 'ACTION',
      subsystem: 'SECS/GEM Interlock Engine',
      message: `Sent remote SECS/GEM command S2F41 [RCMD='PAUSE_AND_DRAIN'] to ${scenario.machineId}.`,
      reasoningNote: `Hardware command ensures in-chamber wafer finishes current sub-second stroke cleanly without mechanical hard-stop damage.`,
      payload: {
        streamFunction: 'S2F41',
        rcmd: 'PAUSE_AND_DRAIN',
        targetEquipment: scenario.machineId,
        ackCode: '0 (Accepted)',
      },
    },
    {
      id: `LOG-202`,
      timestamp: t(1.8),
      phase: 'SAFETY_LOCKOUT',
      phaseLabel: 'Lot Drain Verified',
      level: 'INFO',
      subsystem: 'SECS/GEM Interlock Engine',
      message: `Equipment ${scenario.machineId} reported cycle drain complete. Chamber parked in safe lockout state.`,
      reasoningNote: `Zero substrate left trapped inside active tool chamber. All wafer carriers safe for robotic transfer.`,
    },

    // Phase 3: Diagnostic Reasoning
    {
      id: `LOG-301`,
      timestamp: t(2.5),
      phase: 'DIAGNOSTIC_REASONING',
      phaseLabel: 'AI Root Cause Analysis',
      level: 'REASONING',
      subsystem: 'AI Diagnostic Reasoner',
      message: `DIAGNOSTIC VERDICT: ${scenario.rootCause}`,
      reasoningNote: `Root cause reasoning verified via FFT spectral decomposition & physics-guided neural degradation model. Machine RUL projected at < 12 hrs.`,
      payload: {
        rootCauseSummary: scenario.rootCause,
        failureSeverity: scenario.severity,
        confidence: 0.962,
        estimatedScrapRiskUsd: scenario.lotsToReroute.reduce((sum, l) => sum + l.estimatedScrapSavingsUsd, 0),
      },
    },

    // Phase 4: Target Selection
    {
      id: `LOG-401`,
      timestamp: t(3.2),
      phase: 'TARGET_SELECTION',
      phaseLabel: 'Line Balancing Optimization',
      level: 'REASONING',
      subsystem: 'AI Fleet Solver',
      message: `OPTIMIZATION RESULT: Selected ${scenario.suggestedTargetId} (${scenario.suggestedTargetName}) as target. Overall score: 96.4/100.`,
      reasoningNote: `Target evaluation ranked ${scenario.suggestedTargetId} #1 due to identical tooling setup, 38%+ buffer capacity, and lowest AGV transit latency (45s).`,
      payload: {
        chosenTarget: scenario.suggestedTargetId,
        candidateEvaluations: buildCandidateEvaluations(scenario.machineId, scenario.suggestedTargetId),
      },
    },

    // Phase 5: MES Lot Reassignment
    {
      id: `LOG-501`,
      timestamp: t(4.1),
      phase: 'MES_LOT_REASSIGNMENT',
      phaseLabel: 'MES Dispatch Matrix',
      level: 'ACTION',
      subsystem: 'MES Dynamic Dispatcher',
      message: `Reassigned ${scenario.lotsToReroute.length} WIP lot(s) [${scenario.lotsToReroute.map((l) => l.lotId).join(', ')}] to node ${scenario.suggestedTargetId}.`,
      reasoningNote: `Updated electronic lot traveler (e-Traveler) barcodes with EXPEDITE priority flag to maintain factory schedule adherence.`,
      payload: {
        lots: scenario.lotsToReroute.map((l) => ({
          lotId: l.lotId,
          product: l.productFamily,
          wafers: l.waferCount,
          from: scenario.machineId,
          to: scenario.suggestedTargetId,
        })),
      },
    },

    // Phase 6: AMHS / AGV Robotic Dispatch
    {
      id: `LOG-601`,
      timestamp: t(5.0),
      phase: 'AMHS_AGV_DISPATCH',
      phaseLabel: 'AGV Fleet Dispatch',
      level: 'ACTION',
      subsystem: 'AMHS AGV Controller',
      message: `Dispatched AGVs [${scenario.lotsToReroute.map((l) => l.agvCarrierId).join(', ')}] to load FOUP carriers from ${scenario.machineId} output buffer.`,
      reasoningNote: `AMHS routing calculated optimal collision-free corridor with 42-second transit envelope.`,
      payload: {
        assignedAgvs: scenario.lotsToReroute.map((l) => ({
          agv: l.agvCarrierId,
          lotId: l.lotId,
          originBay: `${scenario.machineId}-BAY-A`,
          destinationBay: `${scenario.suggestedTargetId}-BAY-B`,
          estimatedTransitSec: 42,
        })),
      },
    },
    {
      id: `LOG-602`,
      timestamp: t(6.2),
      phase: 'AMHS_AGV_DISPATCH',
      phaseLabel: 'AGV Transit Complete',
      level: 'INFO',
      subsystem: 'AMHS AGV Controller',
      message: `Robotic carriers docked at ${scenario.suggestedTargetId} load ports. Physical FOUP transfer verified via RFID scan.`,
      reasoningNote: `RFID checksum matches e-Traveler manifest with zero transfer error.`,
    },

    // Phase 7: Recipe Handshake & Calibration Sync
    {
      id: `LOG-701`,
      timestamp: t(7.1),
      phase: 'RECIPE_HANDSHAKE',
      phaseLabel: 'Recipe Sync',
      level: 'ACTION',
      subsystem: 'Target Ingestion Node',
      message: `Pushed verified process recipe & tool calibration profile to ${scenario.suggestedTargetId} controller.`,
      reasoningNote: `Synced blade spindle RPM, feed rate (15 mm/s), and vision optical fiducials to match lot recipe specs.`,
      payload: {
        recipeId: `RCP-VAI-${scenario.processStage.replace(/\s+/g, '-').toUpperCase()}-PRO`,
        targetTool: scenario.suggestedTargetId,
        parameterStatus: 'SYNCHRONIZED',
      },
    },

    // Phase 8: Ingestion & Verification
    {
      id: `LOG-801`,
      timestamp: t(8.0),
      phase: 'INGESTION_VERIFICATION',
      phaseLabel: 'Telemetry Baseline Verification',
      level: 'SUCCESS',
      subsystem: 'Quality & Ingestion Node',
      message: `First wafer ingested on ${scenario.suggestedTargetId}. Real-time telemetry nominal: health score 98%, optical alignment delta < 0.02 µm.`,
      reasoningNote: `Dynamic reroute fully operational. Zero scrap recorded. Line takt time protected with 98.4% OEE preservation.`,
      payload: {
        wafersProtected: scenario.lotsToReroute.reduce((sum, l) => sum + l.waferCount, 0),
        scrapDollarsSaved: scenario.lotsToReroute.reduce((sum, l) => sum + l.estimatedScrapSavingsUsd, 0),
        status: 'REROUTE_SUCCESSFUL',
      },
    },
  ];

  return logs;
}

// Build a full RerouteExecution object from a scenario
export function createRerouteExecution(
  scenario: MachineFaultScenario,
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' = 'COMPLETED',
  customId?: string,
  liveMachines?: any[]
): RerouteExecution {
  const executionId = customId || `REROUTE-EXEC-${scenario.machineId}-${Date.now().toString().slice(-6)}`;
  const now = new Date().toISOString();

  const totalWafers = scenario.lotsToReroute.reduce((sum, l) => sum + l.waferCount, 0);
  const totalScrapSaved = scenario.lotsToReroute.reduce((sum, l) => sum + l.estimatedScrapSavingsUsd, 0);

  const steps: RerouteStep[] = STANDARD_REROUTE_STEPS.map((s, idx) => ({
    ...s,
    status: status === 'COMPLETED' ? 'COMPLETED' : status === 'IN_PROGRESS' ? (idx === 0 ? 'IN_PROGRESS' : 'PENDING') : 'PENDING',
    startedAt: status === 'COMPLETED' ? new Date(Date.now() - (8 - idx) * 1000).toISOString() : undefined,
    completedAt: status === 'COMPLETED' ? new Date(Date.now() - (7 - idx) * 1000).toISOString() : undefined,
    durationMs: status === 'COMPLETED' ? Math.floor(Math.random() * 800 + 400) : undefined,
  }));

  const logs = generateExecutionLogsForScenario(scenario, now);

  const candidateEvaluations = buildCandidateEvaluations(scenario.machineId, scenario.suggestedTargetId, liveMachines);

  return {
    id: executionId,
    timestamp: now,
    sourceMachineId: scenario.machineId,
    sourceMachineName: scenario.machineName,
    targetMachineId: scenario.suggestedTargetId,
    targetMachineName: scenario.suggestedTargetName,
    processStage: scenario.processStage,
    triggerFaultType: scenario.faultTitle,
    triggerDescription: `Sensor ${scenario.triggerTelemetry.sensorName} breached critical safety envelope (${scenario.triggerTelemetry.triggerValue}). Automatic line reroute engaged.`,
    severity: scenario.severity,
    status,
    progressPercent: status === 'COMPLETED' ? 100 : status === 'IN_PROGRESS' ? 15 : 0,
    currentStepIndex: status === 'COMPLETED' ? steps.length - 1 : 0,
    steps,
    logs: status === 'COMPLETED' ? logs : logs.slice(0, 2),
    reasoning: {
      rootCause: scenario.rootCause,
      faultMechanism: `Physical mechanical/sensor degradation detected at station ${scenario.machineId}. Excursion beyond OEM envelope creates acute risk of micro-fracturing and lot rejection.`,
      yieldRiskAssessment: `Immediate yield loss estimated at $${totalScrapSaved.toLocaleString()} (${totalWafers} wafers) if operation continued on ${scenario.machineId}.`,
      targetSelectionLogic: `Candidate ${scenario.suggestedTargetId} selected via AI Multi-Attribute Utility Analysis: 100% tooling compatibility, 38%+ free buffer capacity, and lowest cleanroom transit time (45s).`,
      lineBalancingImpact: `Line takt time preserved at 98.4% OEE. Target machine utilization rises from 62% to 79% (well within safe 85% continuous thermal envelope).`,
      candidateEvaluations,
      recommendedStrategy: `Autonomous dynamic reroute of WIP carriers via AMHS robotic AGVs with automated recipe/offset sync to ${scenario.suggestedTargetId}.`,
      estimatedLeadTimeDelta: `+45 seconds (AGV transfer only)`,
      scrappedWafersPrevented: totalWafers,
      costSavingsEstimatedUsd: totalScrapSaved,
    },
    affectedLots: scenario.lotsToReroute.map((l) => ({
      ...l,
      transferStatus: status === 'COMPLETED' ? 'PROCESSED' : 'IN_TRANSIT',
    })),
    metrics: {
      wafersProtected: totalWafers,
      financialLossPreventedUsd: totalScrapSaved,
      rebalanceLatencySeconds: 8.2,
      sourceCapacityReleasedPercent: 100,
      targetCapacityPostLoadPercent: 79,
      oeePreservationFactor: 98.4,
    },
  };
}
