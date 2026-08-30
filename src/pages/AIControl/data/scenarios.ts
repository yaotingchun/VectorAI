import { ScenarioDefinition } from '../types';

export const SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'scenario-demand-surge',
    title: 'Product B Demand Surge',
    code: 'SCEN-01 // SURGE',
    description: 'Product B demand has increased beyond the capacity of its primary production route (M-03).',
    severity: 'high',
    triggerEvent: 'ERP Order Surge: +50% Product B demand detected on Line 2',
    flowState: {
      product: 'Product B',
      primaryMachine: 'M-03',
      alternativeMachine: 'M-01',
      primaryLoadBefore: 96,
      primaryLoadAfter: 96,
      altLoadBefore: 58,
      altLoadAfter: 82,
      rerouteCapacity: '30 units/hr',
      duration: '8 hours',
    },
    steps: [
      {
        agentId: 'product',
        delayMs: 500,
        sequenceNum: 1,
        status: 'completed',
        message:
          'Product B demand has increased from 120 units/hr to 180 units/hr.\nCurrent Product B production capacity is insufficient to fulfill the new order demand.\nRequesting capacity optimization.',
        metrics: [
          { label: 'Demand Surge', value: '180 u/h', alert: true },
          { label: 'Baseline', value: '120 u/h' },
          { label: 'Deficit', value: '+60 u/h', alert: true },
        ],
        findingsSummary: 'Identified 60 units/hr capacity shortfall for Product B.',
      },
      {
        agentId: 'monitoring',
        delayMs: 1500,
        sequenceNum: 2,
        status: 'completed',
        message:
          'M-03 is currently operating at 96% utilization.\nThe machine is approaching its operational limit.\nAdditional production load is not recommended.',
        metrics: [
          { label: 'M-03 Load', value: '96.2%', alert: true },
          { label: 'Spindle Temp', value: '78.4°C', alert: true },
          { label: 'Vibration', value: '2.4 mm/s' },
        ],
        findingsSummary: 'Primary machine M-03 cannot accept additional production load.',
      },
      {
        agentId: 'prediction',
        delayMs: 2500,
        sequenceNum: 3,
        status: 'completed',
        message:
          'M-01 currently operates at 58% utilization.\nEstimated RUL is 28 hours.\nShort-term additional production is within the acceptable operating window.',
        metrics: [
          { label: 'M-01 Load', value: '58.0%' },
          { label: 'M-01 RUL', value: '28 Hours', badge: 'VIABLE' },
          { label: 'Failure Risk', value: 'LOW (0.04)' },
        ],
        findingsSummary: 'Alternative machine M-01 verified viable for short-term load.',
      },
      {
        agentId: 'maintenance',
        delayMs: 3500,
        sequenceNum: 4,
        status: 'completed',
        message:
          'M-01 has scheduled maintenance in 10 hours.\nExtended high-load operation is not recommended.\nAny rerouting should be temporary and completed before the maintenance window.',
        metrics: [
          { label: 'M-01 Service', value: 'In 10 Hours', alert: true },
          { label: 'Service Type', value: 'Spindle Lube & Calibration' },
          { label: 'Max Safe Run', value: '8.0 Hours' },
        ],
        findingsSummary: 'Hard constraint: Rerouting must complete within 8 hours before maintenance.',
      },
      {
        agentId: 'rerouting',
        delayMs: 4500,
        sequenceNum: 5,
        status: 'completed',
        message:
          'M-01 is compatible with Product B.\nAvailable short-term capacity: 30 units/hr.\nRecommend rerouting 30 units/hr of Product B to M-01.',
        metrics: [
          { label: 'Compatibility', value: 'Product B ✓', badge: 'VERIFIED' },
          { label: 'Allocated Flow', value: '30 units/hr' },
          { label: 'Buffer Line', value: 'Conveyor J-02' },
        ],
        findingsSummary: 'Calculated optimal temporary route: 30 units/hr to M-01.',
      },
    ],
    orchestratorDecision: {
      title: 'ORCHESTRATOR FINAL DECISION',
      statusText: 'REROUTING APPROVED',
      isApproved: true,
      synthesis:
        'Product B demand exceeds current production capacity by 60 units/hr.\nM-01 is compatible with Product B with sufficient short-term capacity, but has maintenance in 10 hours.\n\n→ Reroute 30 units/hr of Product B to M-01\n→ Continue remaining production through M-03\n→ Limit rerouting duration to 8 hours\n→ Preserve M-01 maintenance schedule',
      actionItems: [
        'Reroute 30 units/hr of Product B to M-01',
        'Continue remaining production through M-03 at current stable load',
        'Limit rerouting duration to 8 hours max',
        'Preserve M-01 scheduled maintenance window at T+10h',
      ],
      keyDetails: {
        product: 'Product B',
        source: 'M-03',
        alternative: 'M-01',
        reroutedCapacity: '30 units/hr',
        duration: '8 hours',
        reason:
          'Machine compatibility + available capacity + acceptable short-term health + upcoming maintenance constraint.',
      },
      confidence: 0.94,
    },
  },
  {
    id: 'scenario-failure-risk',
    title: 'Machine Failure Risk',
    code: 'SCEN-02 // HEALTH',
    description: 'M-03 vibration sensor anomaly detected, requiring emergency load reduction and production shift.',
    severity: 'critical',
    triggerEvent: 'Edge Sensor Alert: M-03 spindle bearing vibration exceeded 4.8 mm/s threshold',
    flowState: {
      product: 'Product B',
      primaryMachine: 'M-03',
      alternativeMachine: 'M-01',
      primaryLoadBefore: 96,
      primaryLoadAfter: 40,
      altLoadBefore: 58,
      altLoadAfter: 85,
      rerouteCapacity: '50 units/hr',
      duration: '6 hours',
    },
    steps: [
      {
        agentId: 'monitoring',
        delayMs: 500,
        sequenceNum: 1,
        status: 'completed',
        message:
          'High-frequency accelerometer on M-03 shows vibration spike to 4.92 mm/s.\nBearing temperature elevated to 84°C.\nImmediate load reduction required to prevent catastrophic spindle seizure.',
        metrics: [
          { label: 'Vibration', value: '4.92 mm/s', alert: true },
          { label: 'Threshold', value: '3.50 mm/s' },
          { label: 'Risk Level', value: 'CRITICAL', alert: true },
        ],
        findingsSummary: 'Detected acute mechanical fault on primary machine M-03.',
      },
      {
        agentId: 'prediction',
        delayMs: 1500,
        sequenceNum: 2,
        status: 'completed',
        message:
          'M-03 RUL dropped from 42h to 6.2h under current 96% load.\nReducing load by 50 units/hr extends RUL to 36 hours, preventing unrecoverable tool damage.',
        metrics: [
          { label: 'Degraded RUL', value: '6.2 Hours', alert: true },
          { label: 'Stabilized RUL', value: '36 Hours' },
          { label: 'MTBF Impact', value: '-85%' },
        ],
        findingsSummary: 'Predicted catastrophic failure within 6h if load is not reduced.',
      },
      {
        agentId: 'product',
        delayMs: 2500,
        sequenceNum: 3,
        status: 'completed',
        message:
          'Product B batch #89201 is high priority (Aerospace tier 1).\nTotal output rate must be maintained at minimum 110 units/hr across the cell.',
        metrics: [
          { label: 'Target Output', value: '120 u/h' },
          { label: 'Critical Min', value: '110 u/h' },
          { label: 'Batch Priority', value: 'TIER-1 VIP' },
        ],
        findingsSummary: 'Product B output cannot be halted; requires alternative routing.',
      },
      {
        agentId: 'maintenance',
        delayMs: 3500,
        sequenceNum: 4,
        status: 'completed',
        message:
          'Standby technician dispatched to inspect M-03 lubrication line.\nM-01 has 10h before service and can safely absorb emergency shift.',
        metrics: [
          { label: 'Tech Status', value: 'DISPATCHED' },
          { label: 'Work Order', value: 'WO-9842 (Urgent)' },
          { label: 'M-01 Readiness', value: 'STANDBY READY' },
        ],
        findingsSummary: 'Technician dispatched for M-03; M-01 authorized for emergency uptake.',
      },
      {
        agentId: 'rerouting',
        delayMs: 4500,
        sequenceNum: 5,
        status: 'completed',
        message:
          'Rerouting 50 units/hr of Product B from M-03 to M-01.\nConveyor switch J-01 -> J-02 engaged in divert mode.',
        metrics: [
          { label: 'Shift Volume', value: '50 units/hr' },
          { label: 'M-03 Reduced', value: '40% Load' },
          { label: 'M-01 Uptake', value: '85% Load' },
        ],
        findingsSummary: 'Validated 50 units/hr bypass route to preserve M-03 health.',
      },
    ],
    orchestratorDecision: {
      title: 'ORCHESTRATOR EMERGENCY DECISION',
      statusText: 'EMERGENCY REROUTING EXECUTED',
      isApproved: true,
      synthesis:
        'M-03 is exhibiting acute mechanical vibration risk and must be throttled immediately.\nM-01 has sufficient headroom and tooling compatibility to absorb 50 units/hr.\n\n→ Throttle M-03 load down to 40% immediately\n→ Divert 50 units/hr of Product B to M-01\n→ Dispatch maintenance crew for emergency lubrication on M-03\n→ Re-evaluate machine telemetry in 2 hours',
      actionItems: [
        'Throttle M-03 load down to 40% immediately',
        'Divert 50 units/hr of Product B to M-01 via Conveyor J-02',
        'Dispatch emergency technician team for M-03 spindle inspection',
        'Maintain Product B SLA without factory line stoppage',
      ],
      keyDetails: {
        product: 'Product B',
        source: 'M-03 (Fault Warning)',
        alternative: 'M-01',
        reroutedCapacity: '50 units/hr',
        duration: '6 hours',
        reason: 'Acute vibration anomaly on M-03 + RUL preservation + SLA continuity.',
      },
      confidence: 0.98,
    },
  },
  {
    id: 'scenario-maintenance-conflict',
    title: 'Maintenance Conflict Resolution',
    code: 'SCEN-03 // CONFLICT',
    description: 'Product B demand increases while M-01 has impending maintenance, requiring strictly bounded operations.',
    severity: 'medium',
    triggerEvent: 'Scheduler conflict: Surge request overlaps with mandatory 500-hour overhaul on M-01',
    flowState: {
      product: 'Product B',
      primaryMachine: 'M-03',
      alternativeMachine: 'M-01',
      primaryLoadBefore: 96,
      primaryLoadAfter: 96,
      altLoadBefore: 58,
      altLoadAfter: 78,
      rerouteCapacity: '25 units/hr',
      duration: '4 hours',
    },
    steps: [
      {
        agentId: 'product',
        delayMs: 500,
        sequenceNum: 1,
        status: 'completed',
        message:
          'Additional batch of 100 units Product B queued for rush delivery.\nRequires 25 units/hr extra capacity over next 4 hours.',
        metrics: [
          { label: 'Rush Order', value: '100 Units' },
          { label: 'Required Rate', value: '25 u/h' },
          { label: 'Horizon', value: '4 Hours' },
        ],
        findingsSummary: 'Short-duration 4-hour rush order detected.',
      },
      {
        agentId: 'maintenance',
        delayMs: 1500,
        sequenceNum: 2,
        status: 'completed',
        message:
          'M-01 mandatory 500-hour statutory maintenance starts in 6 hours.\nAny rerouting must conclude strictly 2 hours prior for cooldown and purge.',
        metrics: [
          { label: 'Maintenance At', value: 'T+6 Hours', alert: true },
          { label: 'Cooldown Buffer', value: '2 Hours' },
          { label: 'Max Active Window', value: '4.0 Hours' },
        ],
        findingsSummary: 'Hard cutoff: M-01 must shut down at T+4h for pre-service cooldown.',
      },
      {
        agentId: 'monitoring',
        delayMs: 2500,
        sequenceNum: 3,
        status: 'completed',
        message:
          'Current thermal stability on M-01 is nominal (62°C).\nOperating at +25 u/h for 4 hours will not breach safety envelope before service.',
        metrics: [
          { label: 'Temp Margin', value: '+18°C Safe' },
          { label: 'Current Load', value: '58%' },
          { label: 'Projected Load', value: '78%' },
        ],
        findingsSummary: 'Thermal margins confirmed safe for 4-hour transient run.',
      },
      {
        agentId: 'prediction',
        delayMs: 3500,
        sequenceNum: 4,
        status: 'completed',
        message:
          '4-hour load increase on M-01 will reduce tool life by only 1.2 hours, perfectly aligned with scheduled tool change.',
        metrics: [
          { label: 'Tool Life Delta', value: '-1.2 Hours' },
          { label: 'Scheduled Overhaul', value: 'Full Toolset Replacement' },
        ],
        findingsSummary: 'Tool wear will be immediately restored during upcoming maintenance.',
      },
      {
        agentId: 'rerouting',
        delayMs: 4500,
        sequenceNum: 5,
        status: 'completed',
        message:
          'Synthesized strict 4-hour time-boxed routing for 25 units/hr Product B to M-01.\nAuto-cutoff timer armed at T+4:00h.',
        metrics: [
          { label: 'Bounded Window', value: '4.0 Hours Max' },
          { label: 'Rate', value: '25 units/hr' },
          { label: 'Auto-Cutoff', value: 'ARMED' },
        ],
        findingsSummary: 'Engineered time-boxed 4-hour reroute with automated safety cutoff.',
      },
    ],
    orchestratorDecision: {
      title: 'ORCHESTRATOR TIME-BOXED DECISION',
      statusText: 'BOUNDED REROUTING APPROVED',
      isApproved: true,
      synthesis:
        'Rush demand requires 25 units/hr additional capacity.\n\nM-01 can support this demand safely, but must be offline in 4 hours for maintenance prep.\n\nTherefore:\n\n→ Approve 25 units/hr reroute to M-01 for EXACTLY 4 hours\n→ Enforce automated route termination at T+4:00h\n→ Protect M-01 statutory maintenance window at T+6:00h',
      actionItems: [
        'Approve 25 units/hr reroute to M-01 for exactly 4 hours',
        'Arm automated safety cutoff at T+4:00h',
        'Ensure 2-hour thermal cooldown buffer prior to technician arrival',
        'Preserve regulatory maintenance compliance',
      ],
      keyDetails: {
        product: 'Product B',
        source: 'M-03',
        alternative: 'M-01 (Time-Boxed)',
        reroutedCapacity: '25 units/hr',
        duration: '4 hours (Strict Cutoff)',
        reason: 'Demand surge satisfied while strictly protecting statutory maintenance window.',
      },
      confidence: 0.96,
    },
  },
];
