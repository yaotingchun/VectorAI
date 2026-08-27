import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Machine,
  MachineCategory,
  SensorReading,
  ModelWeights,
  MaintenanceTask,
  SystemEvent,
  MaintenanceHistoryLog,
  NotificationLog,
  DiagnosisReport,
  ProgressStep,
  CommunicationChannel,
} from '../types/factory';
import {
  RerouteExecution,
  MachineFaultScenario,
} from '../types/rerouting';
import {
  PRECONFIGURED_FAULT_SCENARIOS,
  createRerouteExecution,
  generateExecutionLogsForScenario,
} from '../features/rerouting/services/rerouteEngine';
import rawMachinesData from '../data/machines.json';

interface FactoryContextType {
  machines: Machine[];
  weights: ModelWeights;
  maintenanceQueue: MaintenanceTask[];
  events: SystemEvent[];
  rerouteExecutions: RerouteExecution[];
  activeExecutionId: string | null;
  setActiveExecutionId: (id: string | null) => void;
  triggerReroute: (scenarioOrMachineId: string | MachineFaultScenario, customTargetId?: string) => string;
  pauseExecution: (executionId: string) => void;
  resumeExecution: (executionId: string) => void;
  rollbackExecution: (executionId: string) => void;
  clearRerouteExecutions: () => void;
  simulateWear: (machineId: string) => void;
  stopWear: (machineId: string) => void;
  performMaintenance: (machineId: string, type: string, description: string, technician: string) => void;
  updateWeights: (newWeights: ModelWeights) => void;
  queryRAG: (machineCategory: MachineCategory, query: string) => Promise<string>;
  startMaintenanceTask: (taskId: string) => void;
  completeMaintenanceTask: (taskId: string) => void;
  deleteMaintenanceTask: (taskId: string) => void;
  triggerManualSensorSpike: (machineId: string, sensorName: string) => void;
  logSystemEvent: (type: SystemEvent['type'], message: string, machineId?: string) => void;
}

const FactoryContext = createContext<FactoryContextType | undefined>(undefined);

const DEFAULT_WEIGHTS: ModelWeights = {
  intercept: 2000,
  devWeight: 14.5,
  rateWeight: 420.0,
  timeWeight: 0.95,
};

// Exact sensor baseline, warning limit, and critical threshold from technical manuals
const sensorThresholds: Record<string, { baseline: number; warning: number; threshold: number; direction: 'HIGHER_IS_WORSE' | 'LOWER_IS_WORSE' }> = {
  // Wafer Dicing
  vibration_spindle: { baseline: 0.5, warning: 0.8, threshold: 1.4, direction: 'HIGHER_IS_WORSE' },
  temperature_coolant: { baseline: 20.0, warning: 22.0, threshold: 25.0, direction: 'HIGHER_IS_WORSE' },
  load_motor: { baseline: 5.5, warning: 7.5, threshold: 9.5, direction: 'HIGHER_IS_WORSE' },

  // Stocker & Transport
  vibration_crane: { baseline: 0.1, warning: 0.3, threshold: 0.6, direction: 'HIGHER_IS_WORSE' },
  pressure_n2: { baseline: 50.0, warning: 45.0, threshold: 30.0, direction: 'LOWER_IS_WORSE' },
  temp_stocker: { baseline: 21.0, warning: 24.0, threshold: 28.0, direction: 'HIGHER_IS_WORSE' },

  // Die Attacher
  vibration_arm: { baseline: 0.25, warning: 0.45, threshold: 0.75, direction: 'HIGHER_IS_WORSE' },
  pressure_vacuum: { baseline: -88.0, warning: -80.0, threshold: -65.0, direction: 'HIGHER_IS_WORSE' }, // -52 is critical
  temperature_heater: { baseline: 150.0, warning: 160.0, threshold: 175.0, direction: 'HIGHER_IS_WORSE' },

  // Plasma Cleaner
  vibration_vacuum_pump: { baseline: 0.15, warning: 0.35, threshold: 0.7, direction: 'HIGHER_IS_WORSE' },
  chamber_pressure: { baseline: 80.0, warning: 95.0, threshold: 120.0, direction: 'HIGHER_IS_WORSE' },
  rf_reflected_power: { baseline: 15.0, warning: 30.0, threshold: 50.0, direction: 'HIGHER_IS_WORSE' },

  // Wire Bonder
  vibration_ultrasonic: { baseline: 0.35, warning: 0.55, threshold: 0.85, direction: 'HIGHER_IS_WORSE' },
  temperature_transducer: { baseline: 38.0, warning: 45.0, threshold: 65.0, direction: 'HIGHER_IS_WORSE' }, // 69.4 is critical
  load_clamp: { baseline: 60.0, warning: 70.0, threshold: 85.0, direction: 'HIGHER_IS_WORSE' },

  // Molding Machine
  temperature_mold: { baseline: 172.0, warning: 180.0, threshold: 190.0, direction: 'HIGHER_IS_WORSE' },
  pressure_hydraulic: { baseline: 150.0, warning: 165.0, threshold: 185.0, direction: 'HIGHER_IS_WORSE' },
  load_plunger: { baseline: 28.0, warning: 35.0, threshold: 48.0, direction: 'HIGHER_IS_WORSE' },

  // 3D AOI Inspection
  vibration_camera_gantry: { baseline: 0.08, warning: 0.2, threshold: 0.5, direction: 'HIGHER_IS_WORSE' },
  temp_optics: { baseline: 22.0, warning: 28.0, threshold: 38.0, direction: 'HIGHER_IS_WORSE' },
  optical_intensity: { baseline: 98.0, warning: 90.0, threshold: 80.0, direction: 'LOWER_IS_WORSE' },

  // X-Ray NDT
  tube_voltage: { baseline: 130.0, warning: 145.0, threshold: 160.0, direction: 'HIGHER_IS_WORSE' },
  tube_temp: { baseline: 35.0, warning: 50.0, threshold: 70.0, direction: 'HIGHER_IS_WORSE' },
  vibration_stage: { baseline: 0.2, warning: 0.45, threshold: 0.8, direction: 'HIGHER_IS_WORSE' },

  // Laser Marking
  laser_power: { baseline: 30.0, warning: 25.0, threshold: 18.0, direction: 'LOWER_IS_WORSE' },
  galvo_temp: { baseline: 28.0, warning: 38.0, threshold: 52.0, direction: 'HIGHER_IS_WORSE' },
  exhaust_flow: { baseline: 11.0, warning: 8.0, threshold: 5.0, direction: 'LOWER_IS_WORSE' },

  // IC Tester & Handler
  vibration_handler: { baseline: 0.4, warning: 0.6, threshold: 0.9, direction: 'HIGHER_IS_WORSE' }, // 0.95 is critical
  temperature_chamber: { baseline: 25.0, warning: 28.0, threshold: 35.0, direction: 'HIGHER_IS_WORSE' },
  load_actuator: { baseline: 50.0, warning: 60.0, threshold: 75.0, direction: 'HIGHER_IS_WORSE' },

  // Tape & Reel
  vibration_indexer: { baseline: 0.3, warning: 0.55, threshold: 0.9, direction: 'HIGHER_IS_WORSE' },
  temp_sealer: { baseline: 175.0, warning: 190.0, threshold: 210.0, direction: 'HIGHER_IS_WORSE' },
  peel_force: { baseline: 0.45, warning: 0.7, threshold: 1.0, direction: 'HIGHER_IS_WORSE' },
};

const mapCategory = (type: string): MachineCategory => {
  switch (type) {
    case 'wafer-saw':
    case 'wafer_dicing':
    case 'stocker':
      return 'dicing';
    case 'die-attach':
    case 'die_attacher':
    case 'plasma-cleaner':
      return 'die_attach';
    case 'wire-bonding':
    case 'wire_bonder':
      return 'wire_bond';
    case 'molding-press':
    case 'molding':
      return 'molding';
    case 'aoi-inspection':
    case 'x-ray-inspection':
    case 'laser-marking':
    case 'test-handler':
    case 'tape-reel':
    case 'ic_tester':
      return 'ate_sort';
    default:
      return 'dicing';
  }
};

const statusMap = (s: string): Machine['status'] => {
  const up = (s || '').toUpperCase();
  if (up === 'MAINTENANCE') return 'MAINT';
  if (up === 'HEALTHY' || up === 'WARNING' || up === 'CRITICAL' || up === 'OFFLINE' || up === 'MAINT') {
    return up as Machine['status'];
  }
  return 'HEALTHY';
};

const getCategoryMetadata = (category: MachineCategory) => {
  switch (category) {
    case 'dicing':
      return { stage: 'Dicing', label: 'Wafer Dicing Machine' };
    case 'die_attach':
      return { stage: 'Die Attach', label: 'Die Attacher' };
    case 'wire_bond':
      return { stage: 'Wire Bond', label: 'Wire Bonder' };
    case 'molding':
      return { stage: 'Molding', label: 'Molding Machine' };
    case 'ate_sort':
      return { stage: 'Testing & Sort', label: 'IC Tester & Sorter' };
  }
};

const calculateDeviation = (val: number, base: number, thresh: number, sensorName: string): number => {
  if (sensorName === 'pressure_vacuum') {
    // vacuum pressure (e.g. -88 is baseline, -65 is threshold. -52 is exceeded)
    const totalSpan = thresh - base; // -65 - (-88) = 23
    const drift = val - base;        // -52 - (-88) = 36
    return Math.max(0, (drift / totalSpan) * 100);
  }
  
  // Normal sensors: higher is worse
  const totalSpan = thresh - base;
  const drift = val - base;
  return Math.max(0, (drift / totalSpan) * 100);
};

// Parse initial machines from firebase data
const createInitialMachines = (): Machine[] => {
  return (rawMachinesData as any[]).map((item) => {
    const category = mapCategory(item.machineType);
    const meta = getCategoryMetadata(category);

    const sensors: SensorReading[] = (item.sensors || []).map((s: any) => {
      const lookup = sensorThresholds[s.sensorId] || { baseline: 0, warning: 50, threshold: 100, direction: 'HIGHER_IS_WORSE' };
      const dev = calculateDeviation(s.value, lookup.baseline, lookup.threshold, s.sensorId);
      
      return {
        name: s.sensorId,
        label: s.name || s.sensorId,
        value: s.value,
        unit: s.unit || '',
        baseline: lookup.baseline,
        threshold: lookup.threshold,
        deviation: Math.round(dev),
      };
    });

    const alerts = (item.anomalies || []).map((an: any) => an.description || an.type || 'Anomaly detected');
    
    const maintenanceHistory: MaintenanceHistoryLog[] = item.maintenance ? [
      {
        id: `HIST-${item.id}-${Date.now()}`,
        timestamp: item.maintenance.lastMaintenanceDate || new Date().toISOString(),
        type: item.maintenance.type || 'Inspection',
        description: `Scheduled maintenance: ${item.maintenance.type || 'Preventive service'} by ${item.maintenance.technician || 'System Tech'}.`,
        technician: item.maintenance.technician || 'System Tech',
      }
    ] : [];

    const timeSinceBaseline = item.operatingHours ? (item.operatingHours % 400) : 100;
    const degradationRate = item.rul && item.rul.confidence ? parseFloat(((1 - item.rul.confidence) * 1.5).toFixed(3)) : 0.15;
    const initialRul = item.rul?.value ?? 1000;
    const status = statusMap(item.status);
    const healthScore = item.healthScore ?? 90;

    return {
      id: item.id,
      name: item.name || item.id,
      category,
      stage: meta?.stage || 'Dicing',
      location: item.location ? `${item.location.area || ''} • ${item.location.station || ''}` : 'Main Line',
      healthScore,
      status,
      sensors,
      timeSinceBaseline,
      degradationRate,
      currentRul: initialRul,
      alerts,
      maintenanceHistory,
      isSimulatingWear: false,
    };
  });
};

export const FactoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [weights, setWeights] = useState<ModelWeights>(DEFAULT_WEIGHTS);
  const [maintenanceQueue, setMaintenanceQueue] = useState<MaintenanceTask[]>([]);
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [rerouteExecutions, setRerouteExecutions] = useState<RerouteExecution[]>([]);
  const [activeExecutionId, setActiveExecutionId] = useState<string | null>(null);

  // Interval reference for live async reroute progression
  const rerouteIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize
  useEffect(() => {
    const initialMachines = createInitialMachines();
    setMachines(initialMachines);

    // Seed initial system logs using real existing machines
    const seedEvents: SystemEvent[] = [
      { id: 'EV-1', timestamp: new Date(Date.now() - 600000).toISOString(), type: 'SYSTEM', message: 'Vector.ai core telemetry interface online.' },
      { id: 'EV-2', timestamp: new Date(Date.now() - 400000).toISOString(), type: 'WARNING', message: 'TH-02: Handler turret vibration drift detected (0.95 mm/s).', machineId: 'TH-02' },
      { id: 'EV-3', timestamp: new Date(Date.now() - 250000).toISOString(), type: 'CRITICAL', message: 'DA-02: Collet vacuum pressure drop below safety limit (-52 kPa).', machineId: 'DA-02' },
    ];
    setEvents(seedEvents);

    // Seed initial completed reroute execution using actual real existing machines WS-01 and DA-02
    const initialExec1 = createRerouteExecution(PRECONFIGURED_FAULT_SCENARIOS[0], 'COMPLETED', 'REROUTE-EXEC-WS-01-INIT');
    const initialExec2 = createRerouteExecution(PRECONFIGURED_FAULT_SCENARIOS[1], 'COMPLETED', 'REROUTE-EXEC-DA-02-INIT');
    setRerouteExecutions([initialExec1, initialExec2]);
    setActiveExecutionId(initialExec1.id);
  }, []);

  const logSystemEvent = (type: SystemEvent['type'], message: string, machineId?: string) => {
    const newEvent: SystemEvent = {
      id: `EV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      type,
      message,
      machineId,
    };
    setEvents((prev) => [newEvent, ...prev].slice(0, 100)); // cap at 100 events
  };

  // Run simulation tick (every 4 seconds)
  useEffect(() => {
    if (machines.length === 0) return;

    const interval = setInterval(() => {
      setMachines((prevMachines) => {
        return prevMachines.map((m) => {
          if (m.status === 'OFFLINE' || m.status === 'MAINT') return m;

          // Only degrade if active wear simulation is enabled on this machine
          if (!m.isSimulatingWear) return m;

          // Accelerated wear simulation
          const speedMultiplier = 60;
          const hoursIncrement = 0.1 * speedMultiplier;
          const newTimeSinceBaseline = m.timeSinceBaseline + hoursIncrement;
          
          const updatedSensors = m.sensors.map((s) => {
            const span = s.threshold - s.baseline;
            const increment = span * 0.03 * (Math.random() * 0.7 + 0.3);
            const noise = (Math.random() - 0.5) * 0.02 * span;

            let newValue = s.value;
            if (s.name === 'pressure_vacuum') {
              newValue = Math.min(-45, s.value + increment + noise);
              newValue = Math.max(-95, newValue);
            } else {
              newValue = Math.min(s.threshold * 1.5, s.value + increment + noise);
              newValue = Math.max(s.baseline * 0.8, newValue);
            }

            const dev = calculateDeviation(newValue, s.baseline, s.threshold, s.name);

            return {
              ...s,
              value: parseFloat(newValue.toFixed(2)),
              deviation: Math.round(dev),
            };
          });

          const maxDev = Math.max(...updatedSensors.map((s) => s.deviation));
          const rul = Math.max(
            0,
            weights.intercept -
              weights.devWeight * maxDev -
              weights.rateWeight * m.degradationRate -
              weights.timeWeight * newTimeSinceBaseline
          );

          const roundedRul = Math.round(rul);
          let newStatus: Machine['status'] = 'HEALTHY';
          const newAlerts = [...m.alerts];

          if (roundedRul <= 48) {
            newStatus = 'CRITICAL';
          } else if (roundedRul <= 250) {
            newStatus = 'WARNING';
          }

          const healthScore = Math.max(0, Math.min(100, Math.round(100 - maxDev * 0.7 - (newTimeSinceBaseline / 1200) * 15)));

          return {
            ...m,
            timeSinceBaseline: parseFloat(newTimeSinceBaseline.toFixed(1)),
            sensors: updatedSensors,
            currentRul: roundedRul,
            status: newStatus,
            healthScore,
            alerts: newAlerts,
          };
        });
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [machines, weights]);

  // Helper: determine technician communication channel
  const getTechChannel = (tech: string, taskId: string, _machineId: string): CommunicationChannel => {
    if (tech.includes('Chen') || tech.includes('Sato')) {
      return {
        type: 'WHATSAPP',
        address: '+1-555-019-8834',
        label: 'WhatsApp (+1-555-019-8834)',
      };
    } else if (tech.includes('Kovacs')) {
      return {
        type: 'WEBSITE',
        address: `https://ops.vector.ai/dispatch/wo/${taskId.toLowerCase()}`,
        label: `Website (https://ops.vector.ai/dispatch/wo/${taskId.toLowerCase()})`,
      };
    } else {
      return {
        type: 'EMAIL',
        address: `sarah.jenkins@vectorai.internal`,
        label: `Email (sarah.jenkins@vectorai.internal)`,
      };
    }
  };

  // Helper: generate progress steps
  const buildProgressSteps = (): ProgressStep[] => [
    { label: 'Work Order Created & Technician Notified', status: 'DONE', completedAt: new Date().toISOString() },
    { label: 'Technician Acknowledged & En Route', status: 'ACTIVE' },
    { label: 'Machine Taken Offline / Locked Out', status: 'PENDING' },
    { label: 'Diagnosis & Fault Inspection', status: 'PENDING' },
    { label: 'Parts Replacement & Calibration', status: 'PENDING' },
    { label: 'Dry-Run Test & Sensor Verification', status: 'PENDING' },
    { label: 'Machine Returned to Production', status: 'PENDING' },
  ];

  // Helper: generate diagnosis report
  const buildDiagnosisReport = (m: Machine, parts: string[]): DiagnosisReport => {
    const rootCauseMap: Record<string, string> = {
      dicing: 'High-speed ceramic spindle bearing harmonic micro-spalling (3.6 mm/s at 60,000 RPM).',
      die_attach: 'Silicone vacuum pickup seal leakage (-52 kPa) and arm positioning micro-chatter.',
      wire_bond: 'Piezo-electric transducer thermal runaway (69.4°C) causing acoustic resonance decoupling.',
      molding: 'Hydraulic mold cavity seal wear and plunger seal micro-flash accumulation.',
      ate_sort: 'Carriage track alignment error & optical jitter drift causing turret micro-chatter (0.95 mm/s).',
    };

    return {
      generatedAt: new Date().toISOString(),
      faultSummary: `${m.name} (${m.id}) in ${m.status} state with RUL of ${m.currentRul}h. Root cause: ${rootCauseMap[m.category] || 'Sensor threshold excursion'}.`,
      estimatedRootCause: rootCauseMap[m.category] || 'Degradation detected across active telemetry channels.',
      sensorReadings: m.sensors.map(s => ({
        sensor: s.label,
        value: `${s.value.toFixed(2)} ${s.unit}`,
        status: s.deviation >= 80 ? 'CRITICAL' : s.deviation >= 40 ? 'WARNING' : 'OK',
      })),
      recommendedActions: [
        `Replace: ${parts.join(', ')}.`,
        'Recalibrate primary sensor channels against technical manual zero-point envelope.',
        'Execute dry-run diagnostic verification cycle before returning machine to active production.',
      ],
    };
  };

  // Helper: generate notification log
  const buildNotificationLog = (
    tech: string,
    taskId: string,
    machineName: string,
    machineId: string,
    priority: string,
    channel: CommunicationChannel
  ): NotificationLog[] => {
    const now = new Date();
    return [
      {
        channel: channel.type,
        channelAddress: channel.address,
        sentAt: now.toISOString(),
        recipient: `${tech} <${channel.address}>`,
        subject: `[${priority}] Auto-Dispatch: Work Order ${taskId} for ${machineId}`,
        body: `ATTENTION: ${tech}

Vector.AI Autonomous Dispatch System has scheduled maintenance for ${machineName} (${machineId}).
Work Order ID: ${taskId}
Priority: ${priority}
Dispatched via: ${channel.label}

Please inspect mechanical envelope and replace pre-allocated spare parts staged at cleanroom maintenance bay.`,
        delivered: true,
      },
    ];
  };

  // Automated Maintenance Task Scheduler
  useEffect(() => {
    if (machines.length === 0) return;

    setMaintenanceQueue((prevTasks) => {
      const updatedTasks = [...prevTasks];
      let queueChanged = false;

      machines.forEach((m) => {
        const existingTask = updatedTasks.find(
          (t) => t.machineId === m.id && (t.status === 'SCHEDULED' || t.status === 'IN_PROGRESS')
        );

        if (m.status === 'OFFLINE' || m.status === 'MAINT') {
          return;
        }

        if (m.currentRul <= 250 && !existingTask) {
          const hoursToFailure = m.currentRul;
          const scheduledHours = Math.max(6, Math.round(hoursToFailure - 24));
          const priority = m.currentRul <= 48 ? 'CRITICAL' : m.currentRul <= 150 ? 'HIGH' : 'MEDIUM';

          const techMap: Record<string, string> = {
            dicing: 'David Kim',
            die_attach: 'Sarah Jenkins',
            wire_bond: 'Kenji Sato',
            molding: 'Sarah Jenkins',
            ate_sort: 'Kenji Sato',
          };
          const tech = techMap[m.category] || 'Kenji Sato';

          let parts: string[] = [];
          if (m.category === 'dicing') parts = ['Diamond Dicing Blade (Hubbed)', 'Coolant Filter 2-micron'];
          else if (m.category === 'die_attach') parts = ['Silicone Pickup Nozzle 0.8mm', 'Vacuum Solenoid Valve ASCO-3'];
          else if (m.category === 'wire_bond') parts = ['Piezo Transducer Horn 138kHz', 'Ceramic Capillary Tip'];
          else if (m.category === 'molding') parts = ['Mold Cavity Seal Kit', 'Plunger Tip Ring'];
          else if (m.category === 'ate_sort') parts = ['High-Frequency Pogo Pin Block (128-pin)', 'Linear Guide Rail Grease'];

          const taskId = `WO-${Date.now()}-${m.id}`;
          const channel = getTechChannel(tech, taskId, m.id);

          const newTask: MaintenanceTask = {
            id: taskId,
            machineId: m.id,
            machineName: m.name,
            machineCategory: m.category,
            scheduledTime: `In ${scheduledHours} hours`,
            predictedFailureTime: `In ${m.currentRul} hours`,
            priority,
            status: 'SCHEDULED',
            technician: tech,
            communicationChannel: channel,
            estimatedDuration: m.category === 'molding' ? 3.5 : m.category === 'dicing' ? 1.5 : 2.0,
            partsRequired: parts,
            notificationLog: buildNotificationLog(tech, taskId, m.name, m.id, priority, channel),
            diagnosisReport: buildDiagnosisReport(m, parts),
            progressSteps: buildProgressSteps(),
            progressPercent: 14,
          };

          updatedTasks.push(newTask);
          queueChanged = true;
          logSystemEvent('SYSTEM', `AUTO-SCHEDULER: Created Work Order ${taskId} for ${m.id} (RUL: ${m.currentRul}h). Auto-dispatched via ${channel.label}.`, m.id);
        }
      });

      return queueChanged ? updatedTasks : prevTasks;
    });
  }, [machines]);

  // Trigger a new dynamic reroute execution (interactive or simulated)
  const triggerReroute = (
    scenarioOrMachineId: string | MachineFaultScenario,
    customTargetId?: string
  ): string => {
    let scenario: MachineFaultScenario;

    if (typeof scenarioOrMachineId === 'string') {
      const found = PRECONFIGURED_FAULT_SCENARIOS.find(
        (s) => s.machineId.toLowerCase() === scenarioOrMachineId.toLowerCase() || s.id === scenarioOrMachineId
      );
      if (found) {
        scenario = found;
      } else {
        const mach = machines.find((m) => m.id === scenarioOrMachineId) || machines[0];
        // Find real peer machine in same category/stage
        const peer = machines.find((m) => m.category === mach.category && m.id !== mach.id) || machines.find((m) => m.id !== mach.id) || machines[1];
        const defaultTargetId = customTargetId || (peer ? peer.id : 'WS-02');
        const defaultTargetName = peer ? peer.name : `Fleet Station ${defaultTargetId}`;

        scenario = {
          id: `SCENARIO-${mach.id}-${Date.now().toString().slice(-4)}`,
          machineId: mach.id,
          machineName: mach.name,
          processStage: mach.stage || 'Wafer Processing',
          faultTitle: `Critical Telemetry Excursion on ${mach.id}`,
          severity: 'CRITICAL',
          triggerTelemetry: {
            sensorName: mach.sensors[0]?.name || 'telemetry_vibration',
            triggerValue: 'Threshold Breached',
            baselineValue: 'Nominal Baseline',
            criticalLimit: 'Exceeded',
          },
          suggestedTargetId: defaultTargetId,
          suggestedTargetName: defaultTargetName,
          rootCause: `Degradation spike detected on ${mach.name} (${mach.id}). Autonomous cleanroom lot rerouting initiated to prevent wafer yield loss.`,
          lotsToReroute: [
            {
              lotId: `LOT-VAI-${Math.floor(Math.random() * 8000 + 1000)}`,
              productFamily: 'Cleanroom Semiconductor Substrate Lot',
              waferCount: 250,
              priority: 'CRITICAL',
              currentStage: mach.stage || 'Production Line',
              originalMachineId: mach.id,
              targetMachineId: defaultTargetId,
              agvCarrierId: `AGV-ALPHA-0${Math.floor(Math.random() * 4 + 1)}`,
              estimatedScrapSavingsUsd: 175000,
            },
          ],
        };
      }
    } else {
      scenario = scenarioOrMachineId;
    }

    if (customTargetId) {
      const targetMach = machines.find((m) => m.id === customTargetId);
      scenario = {
        ...scenario,
        suggestedTargetId: customTargetId,
        suggestedTargetName: targetMach ? targetMach.name : `Assigned Station ${customTargetId}`,
      };
    }

    const execId = `REROUTE-EXEC-${scenario.machineId}-${Date.now().toString().slice(-4)}`;
    const newExec = createRerouteExecution(scenario, 'IN_PROGRESS', execId, machines);

    // Replace previous execution for the same source tool so duplicate machine entries don't accumulate
    setRerouteExecutions((prev) => [newExec, ...prev.filter((e) => e.sourceMachineId !== scenario.machineId)]);
    setActiveExecutionId(execId);

    logSystemEvent(
      'REROUTE',
      `DYNAMIC REROUTE INITIATED: Diverting lots from ${scenario.machineId} to ${scenario.suggestedTargetId} (${scenario.faultTitle}).`,
      scenario.machineId
    );

    // Run progressive asynchronous step ticking (simulates multi-phase execution)
    let currentStep = 0;
    const allLogs = generateExecutionLogsForScenario(scenario);

    if (rerouteIntervalRef.current) {
      clearInterval(rerouteIntervalRef.current);
    }

    rerouteIntervalRef.current = setInterval(() => {
      currentStep++;
      setRerouteExecutions((prevExecs) => {
        return prevExecs.map((exec) => {
          if (exec.id !== execId || exec.status !== 'IN_PROGRESS') return exec;

          const updatedSteps = exec.steps.map((st, sIdx) => {
            if (sIdx < currentStep) {
              return { ...st, status: 'COMPLETED' as const, completedAt: new Date().toISOString() };
            } else if (sIdx === currentStep) {
              return { ...st, status: 'IN_PROGRESS' as const, startedAt: new Date().toISOString() };
            }
            return st;
          });

          const isFinished = currentStep >= exec.steps.length;
          const progress = Math.min(100, Math.round((currentStep / exec.steps.length) * 100));

          // Reveal logs up to current step
          const visibleLogs = allLogs.slice(0, Math.min(allLogs.length, (currentStep + 1) * 2));

          if (isFinished && rerouteIntervalRef.current) {
            clearInterval(rerouteIntervalRef.current);
            rerouteIntervalRef.current = null;
          }

          return {
            ...exec,
            status: isFinished ? 'COMPLETED' : 'IN_PROGRESS',
            progressPercent: progress,
            currentStepIndex: Math.min(exec.steps.length - 1, currentStep),
            steps: updatedSteps,
            logs: visibleLogs,
            affectedLots: exec.affectedLots.map((lot) => ({
              ...lot,
              transferStatus: isFinished ? 'PROCESSED' : currentStep >= 5 ? 'LOADED' : 'IN_TRANSIT',
            })),
          };
        });
      });
    }, 1200);

    return execId;
  };

  const pauseExecution = (executionId: string) => {
    if (rerouteIntervalRef.current) {
      clearInterval(rerouteIntervalRef.current);
      rerouteIntervalRef.current = null;
    }
    setRerouteExecutions((prev) =>
      prev.map((e) => (e.id === executionId ? { ...e, status: 'PAUSED' } : e))
    );
    logSystemEvent('REROUTE', `REROUTE EXECUTION PAUSED: ${executionId}`);
  };

  const resumeExecution = (executionId: string) => {
    setRerouteExecutions((prev) =>
      prev.map((e) => (e.id === executionId ? { ...e, status: 'IN_PROGRESS' } : e))
    );
    logSystemEvent('REROUTE', `REROUTE EXECUTION RESUMED: ${executionId}`);
  };

  const rollbackExecution = (executionId: string) => {
    if (rerouteIntervalRef.current) {
      clearInterval(rerouteIntervalRef.current);
      rerouteIntervalRef.current = null;
    }
    setRerouteExecutions((prev) =>
      prev.map((e) =>
        e.id === executionId
          ? {
              ...e,
              status: 'ROLLED_BACK',
              logs: [
                {
                  id: `LOG-ROLLBACK-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  phase: 'INGESTION_VERIFICATION',
                  phaseLabel: 'Rollback & Revert',
                  level: 'WARN',
                  subsystem: 'MES Supervisor',
                  message: `MANUAL ROLLBACK: Reverted lot routing back to default schedule. Safety interlock disengaged.`,
                  reasoningNote: `Operator requested rollback. Original routing tables restored and AGVs redirected to home staging bays.`,
                },
                ...e.logs,
              ],
            }
          : e
      )
    );
    logSystemEvent('REROUTE', `REROUTE EXECUTION ROLLED BACK: ${executionId}`);
  };

  const clearRerouteExecutions = () => {
    setRerouteExecutions([]);
    setActiveExecutionId(null);
  };

  const simulateWear = (machineId: string) => {
    setMachines((prev) =>
      prev.map((m) => (m.id === machineId ? { ...m, isSimulatingWear: true } : m))
    );
  };

  const stopWear = (machineId: string) => {
    setMachines((prev) =>
      prev.map((m) => (m.id === machineId ? { ...m, isSimulatingWear: false } : m))
    );
  };

  const performMaintenance = (machineId: string, type: string, description: string, technician: string) => {
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id !== machineId) return m;

        const resetSensors = m.sensors.map((s) => ({
          ...s,
          value: s.baseline,
          deviation: 0,
        }));

        const newLog: MaintenanceHistoryLog = {
          id: `HIST-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type,
          description,
          technician,
        };

        return {
          ...m,
          sensors: resetSensors,
          healthScore: 99,
          status: 'HEALTHY',
          timeSinceBaseline: 0,
          currentRul: 1500,
          alerts: [],
          maintenanceHistory: [newLog, ...m.maintenanceHistory],
          isSimulatingWear: false,
        };
      })
    );

    logSystemEvent('MAINTENANCE', `MAINTENANCE COMPLETE: ${machineId} reset to calibrated baseline.`, machineId);
  };

  const updateWeights = (newWeights: ModelWeights) => {
    setWeights(newWeights);
  };

  const startMaintenanceTask = (taskId: string) => {
    setMaintenanceQueue((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'IN_PROGRESS' } : t))
    );
  };

  const completeMaintenanceTask = (taskId: string) => {
    const task = maintenanceQueue.find((t) => t.id === taskId);
    if (task) {
      performMaintenance(task.machineId, 'Predictive Maintenance', `Completed order ${task.id}`, task.technician);
    }
    setMaintenanceQueue((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'COMPLETED' } : t))
    );
  };

  const deleteMaintenanceTask = (taskId: string) => {
    setMaintenanceQueue((prev) => prev.filter((t) => t.id !== taskId));
  };

  const triggerManualSensorSpike = (machineId: string, sensorName: string) => {
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id !== machineId) return m;
        const updatedSensors = m.sensors.map((s) => {
          if (s.name === sensorName) {
            const spikedValue = s.threshold * 1.25;
            return {
              ...s,
              value: parseFloat(spikedValue.toFixed(2)),
              deviation: 100,
            };
          }
          return s;
        });
        return {
          ...m,
          sensors: updatedSensors,
        };
      })
    );

    // Also trigger automated reroute execution
    triggerReroute(machineId);
  };

  const queryRAG = async (_category: MachineCategory, query: string): Promise<string> => {
    return `AI Diagnostic Grounding: Telemetry correlations match technical manual specifications for query "${query}".`;
  };

  return (
    <FactoryContext.Provider
      value={{
        machines,
        weights,
        maintenanceQueue,
        events,
        rerouteExecutions,
        activeExecutionId,
        setActiveExecutionId,
        triggerReroute,
        pauseExecution,
        resumeExecution,
        rollbackExecution,
        clearRerouteExecutions,
        simulateWear,
        stopWear,
        performMaintenance,
        updateWeights,
        queryRAG,
        startMaintenanceTask,
        completeMaintenanceTask,
        deleteMaintenanceTask,
        triggerManualSensorSpike,
        logSystemEvent,
      }}
    >
      {children}
    </FactoryContext.Provider>
  );
};

export const useFactory = (): FactoryContextType => {
  const context = useContext(FactoryContext);
  if (!context) {
    throw new Error('useFactory must be used within a FactoryProvider');
  }
  return context;
};
