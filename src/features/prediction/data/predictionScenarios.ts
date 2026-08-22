import { Machine, SensorReading } from '../../machines/types/machine';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContributingFactor {
  name: string;
  pct: number;       // 0-100 percentage weight
  status: 'normal' | 'warning' | 'critical';
}

export interface TrendSensor {
  id: string;
  label: string;
  trend: 'up' | 'down' | 'stable';
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
}

export interface PredictionScenario {
  // Condition
  conditionLevel: 'healthy' | 'warning' | 'critical';

  // Derived metrics from real machine data
  failureRisk: number;       // 0-100
  rulHours: number;
  rulConfidence: number;     // 0-100

  // Text — varies by machine type + condition
  mainPrediction: string;
  predictedIssueDesc: string;
  expectedFailureWindow?: string;

  // Sensor trend data (from real sensors)
  trendSensors: TrendSensor[];

  // Analytics
  contributingFactors: ContributingFactor[];
  qualityRiskTitle: string;
  qualityRiskScore: number;
  qualityRiskExplanation: string;

  // Impact
  productionImpactDowntime: number;
  productionImpactThroughputLoss: number;

  // Action
  recommendedAction: string;
  documentLink?: { id: string; title: string };
}

// ─── Per-machine-type text configs ───────────────────────────────────────────

interface TypeConditionText {
  main: string;
  issue: string;
  action: string;
  qualityLabel: string;
  qualityExplanation: (sensors: SensorReading[]) => string;
}

type TypeConfig = Record<'healthy' | 'warning' | 'critical', TypeConditionText> & {
  docLink?: { id: string; title: string };
};

const TYPE_CONFIGS: Record<string, TypeConfig> = {
  wafer_dicing: {
    healthy: {
      main: 'Nominal Operation — All Parameters Stable',
      issue: 'All spindle and blade parameters are within normal tolerance. No anomalies detected.',
      action: 'Continue routine monitoring. Next scheduled inspection per maintenance plan.',
      qualityLabel: 'Wafer Quality Risk',
      qualityExplanation: () => 'Spindle vibration and motor load are nominal. Wafer quality risk is low.'
    },
    warning: {
      main: 'Early Blade / Spindle Drift Detected',
      issue: 'Elevated spindle vibration or motor load detected. Early-stage wear pattern forming.',
      action: 'Schedule blade inspection within 72 hours. Monitor spindle vibration closely.',
      qualityLabel: 'Wafer Damage Risk',
      qualityExplanation: (s) => `${s.find(x => x.status !== 'normal')?.name ?? 'Spindle parameter'} deviating from baseline — risk of micro-fracture during dicing if uncorrected.`
    },
    critical: {
      main: 'Blade / Spindle Degradation',
      issue: 'Blade wear and spindle degradation confirmed via elevated vibration and motor load.',
      action: 'Immediate cutting blade inspection required. Halt production if vibration exceeds critical threshold.',
      qualityLabel: 'Wafer Damage Risk',
      qualityExplanation: () => 'Elevated spindle vibration and motor load significantly raise risk of wafer micro-fracture and yield loss.'
    }
  },
  die_attacher: {
    healthy: {
      main: 'Normal Operation — All Systems Nominal',
      issue: 'Pick-and-place arm, vacuum, and heater all operating within normal parameters.',
      action: 'Continue routine monitoring per maintenance schedule.',
      qualityLabel: 'Die Placement Risk',
      qualityExplanation: () => 'Arm positioning and vacuum pressure are stable. Die placement risk is minimal.'
    },
    warning: {
      main: 'Arm Vibration / Vacuum Pressure Anomaly',
      issue: 'Arm vibration increasing or vacuum pressure becoming unstable. Mechanical wear pattern forming.',
      action: 'Inspect pick-up nozzle and vacuum lines within 48 hours.',
      qualityLabel: 'Die Placement Risk',
      qualityExplanation: (s) => `${s.find(x => x.status !== 'normal')?.name ?? 'Arm parameter'} deviating — increasing risk of die misplacement or drop events.`
    },
    critical: {
      main: 'Pick-and-Place Arm Mechanical Degradation',
      issue: 'Arm mechanical degradation and vacuum pressure instability confirmed.',
      action: 'Stop production for immediate nozzle and vacuum system inspection.',
      qualityLabel: 'Die Placement Risk',
      qualityExplanation: () => 'Combined arm vibration and vacuum instability indicate high probability of die misplacement and yield loss.'
    }
  },
  wire_bonder: {
    healthy: {
      main: 'Stable Bonding Process — Nominal Parameters',
      issue: 'Ultrasonic vibration, clamp load, and transducer temperature all within normal range.',
      action: 'Routine monitoring active. No maintenance action required at this time.',
      qualityLabel: 'Bond Quality Risk',
      qualityExplanation: () => 'All bonding parameters are stable. Wire bond quality and strength are at nominal levels.'
    },
    warning: {
      main: 'Bonding Head Early Drift Detected',
      issue: 'Transducer frequency or clamp load showing early drift from baseline.',
      action: 'Monitor transducer health closely. Plan inspection within 24 hours.',
      qualityLabel: 'Bond Quality Risk',
      qualityExplanation: (s) => `${s.find(x => x.status !== 'normal')?.name ?? 'Bonding parameter'} drifting — risk of marginal bond strength if degradation continues.`
    },
    critical: {
      main: 'Ultrasonic Transducer Degradation',
      issue: 'Transducer frequency drift and clamp load instability confirmed. Degradation rate: elevated.',
      action: 'Immediate transducer and capillary tool inspection required. Risk of wire bond failure.',
      qualityLabel: 'Bond Quality Risk',
      qualityExplanation: () => 'Increasing ultrasonic vibration and unstable clamp load indicate growing bonding-process instability and elevated wire bond failure risk.'
    }
  },
  molding: {
    healthy: {
      main: 'Nominal Mold Cycle — All Parameters Stable',
      issue: 'Hydraulic pressure, plunger load, and mold temperature all stable and within spec.',
      action: 'Continue routine monitoring per maintenance schedule.',
      qualityLabel: 'Encapsulation Risk',
      qualityExplanation: () => 'Hydraulic and plunger parameters are nominal. Encapsulation quality risk is low.'
    },
    warning: {
      main: 'Hydraulic / Plunger Early Anomaly',
      issue: 'Minor hydraulic pressure deviation or plunger load increase detected.',
      action: 'Inspect hydraulic fluid level and plunger condition within 36 hours.',
      qualityLabel: 'Encapsulation Risk',
      qualityExplanation: (s) => `${s.find(x => x.status !== 'normal')?.name ?? 'Hydraulic parameter'} deviating — risk of encapsulation void if pressure becomes unstable.`
    },
    critical: {
      main: 'Hydraulic System Degradation',
      issue: 'Hydraulic pressure deviation and plunger load increase confirmed.',
      action: 'Halt production. Immediate hydraulic system inspection and pressure adjustment required.',
      qualityLabel: 'Encapsulation Risk',
      qualityExplanation: () => 'Hydraulic pressure variation and plunger load increase significantly elevate risk of encapsulation voids and package defects.'
    },
    docLink: { id: 'DOC-MOLD-02', title: 'Hydraulic Pressure Troubleshooting Guide' }
  },
  ic_tester: {
    healthy: {
      main: 'Normal Test Operation — All Contacts Nominal',
      issue: 'All pogo pin contacts, handler, and actuator parameters are within nominal range.',
      action: 'Routine monitoring active. No maintenance required at this time.',
      qualityLabel: 'Test Reliability Risk',
      qualityExplanation: () => 'Pogo pin contact resistance and handler kinematics are nominal. Test reliability is high.'
    },
    warning: {
      main: 'Contact Mechanism Early Wear Detected',
      issue: 'Actuator load increasing or handler vibration elevated, indicating possible pogo pin wear.',
      action: 'Inspect pogo pin contacts within 24 hours.',
      qualityLabel: 'Test Reliability Risk',
      qualityExplanation: (s) => `${s.find(x => x.status !== 'normal')?.name ?? 'Actuator parameter'} indicating early pogo pin wear — risk of marginal test contact quality.`
    },
    critical: {
      main: 'Pogo Pin / Contact Mechanism Degradation',
      issue: 'Pogo pin contact wear confirmed via elevated actuator load and handler vibration.',
      action: 'Immediate pogo pin inspection required. Risk of test contact failure and false rejects.',
      qualityLabel: 'Test Reliability Risk',
      qualityExplanation: () => 'Contact mechanism degradation may cause unreliable test contacts, leading to false rejects and reduced test throughput.'
    },
    docLink: { id: 'DOC-ATE01-01', title: 'High-Speed Handler Pogo Pin Maintenance Guide' }
  }
};

// ─── Main derivation function ─────────────────────────────────────────────────

export function getPredictionScenario(machine: Machine): PredictionScenario {
  const { healthScore, rul, sensors, machineType } = machine;

  // ── 1. Condition level from health score ──
  const conditionLevel: 'healthy' | 'warning' | 'critical' =
    healthScore >= 80 ? 'healthy' : healthScore >= 60 ? 'warning' : 'critical';

  // ── 2. Failure risk from health + degradation stage ──
  const stageBoost: Record<string, number> = {
    'Normal': 0, 'Early Drift': 6, 'Accelerated Wear': 14, 'Imminent Failure': 24
  };
  const failureRisk = Math.min(97, Math.round(
    (100 - healthScore) * 0.72 + (stageBoost[rul.degradationStage] ?? 0)
  ));

  // ── 3. RUL in hours ──
  const rulHours = rul.unit === 'hours' ? Math.round(rul.value) : Math.round(rul.value * 24);
  const rulConfidence = Math.round(rul.confidence * 100);

  // ── 4. Expected failure window ──
  const expectedFailureWindow = conditionLevel === 'healthy' ? undefined
    : conditionLevel === 'warning'
      ? `${Math.round(rulHours * 0.7)}–${Math.round(rulHours * 1.1)} hours`
      : `${Math.round(rulHours * 0.6)}–${Math.round(rulHours * 0.9)} hours`;

  // ── 5. Text from type config ──
  const config = TYPE_CONFIGS[machineType] ?? TYPE_CONFIGS['ic_tester'];
  const textCfg = config[conditionLevel];

  // ── 6. Trend sensors from actual machine sensors ──
  const trendSensors: TrendSensor[] = sensors.map(s => ({
    id: s.sensorId,
    label: s.name,
    trend: s.status === 'critical' ? 'up'
         : s.status === 'warning'  ? 'up'
         : 'stable' as 'up' | 'down' | 'stable',
    value: s.value,
    unit: s.unit,
    status: s.status
  }));

  // ── 7. Contributing factors from actual sensor statuses ──
  const sensorWeights = sensors.map(s => {
    const w = s.status === 'critical' ? 3 : s.status === 'warning' ? 2 : 1;
    return { name: s.name, weight: w, status: s.status };
  });
  const totalWeight = sensorWeights.reduce((a, b) => a + b.weight, 0) || 1;
  const contributingFactors: ContributingFactor[] = sensorWeights.map(sw => ({
    name: sw.name,
    pct: Math.round((sw.weight / totalWeight) * 100),
    status: sw.status
  }));

  // ── 8. Quality risk scaled from health ──
  const qualityRiskScore = conditionLevel === 'critical'
    ? Math.min(90, Math.round(40 + (60 - healthScore) * 0.9))
    : conditionLevel === 'warning'
      ? Math.min(48, Math.round(15 + (80 - healthScore) * 0.85))
      : Math.min(18, Math.round(4 + (90 - healthScore) * 0.25));

  // ── 9. Production impact scaled from failure risk ──
  const productionImpactDowntime = conditionLevel === 'critical'
    ? Math.round((3.5 + failureRisk * 0.035) * 10) / 10
    : conditionLevel === 'warning'
      ? Math.round((0.8 + failureRisk * 0.02) * 10) / 10
      : 0.3;
  const productionImpactThroughputLoss = Math.round(failureRisk * 0.22);

  // ── 10. Document link only for relevant machine types ──
  const documentLink = (conditionLevel !== 'healthy' && config.docLink)
    ? config.docLink
    : undefined;

  return {
    conditionLevel,
    failureRisk,
    rulHours,
    rulConfidence,
    mainPrediction: textCfg.main,
    predictedIssueDesc: textCfg.issue,
    expectedFailureWindow,
    trendSensors,
    contributingFactors,
    qualityRiskTitle: textCfg.qualityLabel,
    qualityRiskScore,
    qualityRiskExplanation: textCfg.qualityExplanation(sensors),
    productionImpactDowntime,
    productionImpactThroughputLoss,
    recommendedAction: textCfg.action,
    documentLink
  };
}
