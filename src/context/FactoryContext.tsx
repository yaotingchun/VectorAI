import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Machine,
  MachineCategory,
  SensorReading,
  ModelWeights,
  MaintenanceTask,
  SystemEvent,
  MaintenanceHistoryLog,
} from '../types/factory';
import rawMachinesData from '../data/machines.json';

interface FactoryContextType {
  machines: Machine[];
  weights: ModelWeights;
  maintenanceQueue: MaintenanceTask[];
  events: SystemEvent[];
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

const sensorThresholds: Record<string, { baseline: number; threshold: number }> = {
  vibration_spindle: { baseline: 1.2, threshold: 4.5 },
  temperature_coolant: { baseline: 18.0, threshold: 28.0 },
  load_motor: { baseline: 2.5, threshold: 6.0 },
  vibration_arm: { baseline: 0.8, threshold: 3.5 },
  pressure_vacuum: { baseline: -85.0, threshold: -55.0 },
  temperature_heater: { baseline: 150.0, threshold: 180.0 },
  vibration_ultrasonic: { baseline: 2.0, threshold: 6.0 },
  load_clamp: { baseline: 15.0, threshold: 35.0 },
  temperature_transducer: { baseline: 45.0, threshold: 85.0 },
  temperature_mold: { baseline: 175.0, threshold: 190.0 },
  pressure_hydraulic: { baseline: 120.0, threshold: 180.0 },
  load_plunger: { baseline: 8.5, threshold: 15.0 },
  vibration_handler: { baseline: 1.5, threshold: 5.0 },
  temperature_chamber: { baseline: 85.0, threshold: 120.0 },
  load_actuator: { baseline: 12.0, threshold: 30.0 },
};

const mapCategory = (type: string): MachineCategory => {
  switch (type) {
    case 'wafer_dicing': return 'dicing';
    case 'die_attacher': return 'die_attach';
    case 'wire_bonder': return 'wire_bond';
    case 'molding': return 'molding';
    case 'ic_tester': return 'ate_sort';
    default: return 'dicing';
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

// Parse initial machines from firebase data
const createInitialMachines = (): Machine[] => {
  return (rawMachinesData as any[]).map((item) => {
    const category = mapCategory(item.machineType);
    const meta = getCategoryMetadata(category);

    const sensors: SensorReading[] = (item.sensors || []).map((s: any) => {
      const lookup = sensorThresholds[s.sensorId] || { baseline: 0, threshold: 100 };
      
      // Dynamic adjustments for values exceeding standard limits
      let threshold = lookup.threshold;
      if (s.value > threshold && item.status === 'healthy') {
        threshold = Math.max(threshold, s.value * 1.3);
      }
      
      const dev = calculateDeviation(s.value, lookup.baseline, threshold, s.sensorId);
      
      return {
        name: s.sensorId,
        label: s.name || s.sensorId,
        value: s.value,
        unit: s.unit || '',
        baseline: lookup.baseline,
        threshold: threshold,
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
    const initialRul = item.rul?.value || 1000;
    const status = statusMap(item.status);

    const maxDev = Math.max(...sensors.map((s) => s.deviation), 0);
    const healthScore = item.healthScore || Math.max(0, Math.min(100, Math.round(100 - maxDev * 0.7 - (timeSinceBaseline / 1000) * 15)));

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

const calculateDeviation = (val: number, base: number, thresh: number, sensorName: string): number => {
  if (sensorName === 'pressure_vacuum') {
    // vacuum pressure (e.g. -85 is baseline, -55 is threshold. -52 is exceeded)
    // deviation is how far we drifted from -85 towards -55
    const totalSpan = thresh - base; // -55 - (-85) = 30
    const drift = val - base;        // -70 - (-85) = 15
    return Math.max(0, (drift / totalSpan) * 100);
  }
  
  // Normal sensors: higher is worse
  const totalSpan = thresh - base;
  const drift = val - base;
  return Math.max(0, (drift / totalSpan) * 100);
};

export const FactoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [weights, setWeights] = useState<ModelWeights>(DEFAULT_WEIGHTS);
  const [maintenanceQueue, setMaintenanceQueue] = useState<MaintenanceTask[]>([]);
  const [events, setEvents] = useState<SystemEvent[]>([]);

  // Initialize
  useEffect(() => {
    const initialMachines = createInitialMachines();
    setMachines(initialMachines);

    // Seed initial system logs
    const seedEvents: SystemEvent[] = [
      { id: 'EV-1', timestamp: new Date(Date.now() - 600000).toISOString(), type: 'SYSTEM', message: 'Vector.ai core telemetry interface online.' },
      { id: 'EV-2', timestamp: new Date(Date.now() - 400000).toISOString(), type: 'WARNING', message: 'ATE-002: Handler turret vibration drift detected.', machineId: 'ATE-002' },
      { id: 'EV-3', timestamp: new Date(Date.now() - 250000).toISOString(), type: 'CRITICAL', message: 'DA-002: Collet vacuum pressure drop below safety limit (-52 kPa).', machineId: 'DA-002' },
    ];
    setEvents(seedEvents);
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

  // Run simulation tick (every 3 seconds)
  useEffect(() => {
    if (machines.length === 0) return;

    const interval = setInterval(() => {
      setMachines((prevMachines) => {
        return prevMachines.map((m) => {
          if (m.status === 'OFFLINE' || m.status === 'MAINT') return m;

          // Compute wear updates
          const speedMultiplier = m.isSimulatingWear ? 60 : 1; // Accelerated wear fast-forwards degradation
          const hoursIncrement = 0.1 * speedMultiplier;
          const newTimeSinceBaseline = m.timeSinceBaseline + hoursIncrement;
          
          // Gradually wear sensors based on degradationRate
          const updatedSensors = m.sensors.map((s) => {
            let increment = 0;
            
            if (m.isSimulatingWear) {
              // High wear: push values close to or beyond threshold
              const span = s.threshold - s.baseline;
              increment = span * 0.03 * (Math.random() * 0.7 + 0.3);
            } else {
              // Normal wear
              const span = s.threshold - s.baseline;
              increment = span * (m.degradationRate / 500) * (Math.random() * 0.6 + 0.7);
            }

            // Add telemetry micro-noise (+/- 1% of threshold span)
            const span = s.threshold - s.baseline;
            const noise = (Math.random() - 0.5) * 0.02 * span;

            let newValue = s.value;
            if (s.name === 'pressure_vacuum') {
              // vacuum pressure rises from -85 to -55 (meaning it becomes less negative)
              newValue = Math.min(-45, s.value + increment + noise);
            } else {
              newValue = Math.min(s.threshold * 1.5, s.value + increment + noise);
            }

            // Keep within bounds
            if (s.name === 'pressure_vacuum') {
              newValue = Math.max(-95, newValue);
            } else {
              newValue = Math.max(s.baseline * 0.8, newValue);
            }

            const dev = calculateDeviation(newValue, s.baseline, s.threshold, s.name);

            return {
              ...s,
              value: parseFloat(newValue.toFixed(2)),
              deviation: Math.round(dev),
            };
          });

          // Regression inputs
          const maxDev = Math.max(...updatedSensors.map((s) => s.deviation));
          
          // Regression formula: RUL = intercept - devWeight * D_max - rateWeight * R_deg - timeWeight * T_ops
          const rul = Math.max(
            0,
            weights.intercept -
              weights.devWeight * maxDev -
              weights.rateWeight * m.degradationRate -
              weights.timeWeight * newTimeSinceBaseline
          );

          const roundedRul = Math.round(rul);
          
          // Determine status
          let newStatus: Machine['status'] = 'HEALTHY';
          const newAlerts = [...m.alerts];

          if (roundedRul <= 48) {
            newStatus = 'CRITICAL';
          } else if (roundedRul <= 250) {
            newStatus = 'WARNING';
          }

          // Trigger state transition alerts & log events
          if (newStatus !== m.status) {
            if (newStatus === 'CRITICAL') {
              const alertMsg = `${m.id} RUL degraded to ${roundedRul} hours. Critical maintenance required.`;
              newAlerts.push(alertMsg);
              logSystemEvent('CRITICAL', `EQUIPMENT ALARM: ${m.name} (${m.id}) entered CRITICAL state. RUL: ${roundedRul}h`, m.id);

              // Wire Bonder Dynamic Process Rerouting Trigger
              if (m.category === 'wire_bond') {
                const targetBonder = prevMachines.find(
                  (other) => other.category === 'wire_bond' && other.id !== m.id && other.status === 'HEALTHY'
                );
                if (targetBonder) {
                  logSystemEvent(
                    'REROUTE',
                    `DYNAMIC REROUTING: Transducer degraded on ${m.id} (${roundedRul}h RUL). Instantly rerouting active production batch to parallel lane ${targetBonder.id}.`,
                    m.id
                  );
                  newAlerts.push(`BATCH REROUTED: Production diverted to ${targetBonder.id} due to ultrasonic transducer wear.`);
                }
              }
            } else if (newStatus === 'WARNING') {
              logSystemEvent('WARNING', `PREDICTIVE ALERT: ${m.name} (${m.id}) RUL estimated at ${roundedRul}h. Scheduling maintenance.`, m.id);
            }
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
    }, 3000);

    return () => clearInterval(interval);
  }, [machines, weights]);

  // Automated Maintenance Task Scheduler
  useEffect(() => {
    if (machines.length === 0) return;

    setMaintenanceQueue((prevTasks) => {
      const updatedTasks = [...prevTasks];
      let queueChanged = false;

      machines.forEach((m) => {
        // Schedule if RUL is warning/critical and no active task exists for this machine
        const existingTask = updatedTasks.find(
          (t) => t.machineId === m.id && (t.status === 'SCHEDULED' || t.status === 'IN_PROGRESS')
        );

        if (m.status === 'OFFLINE' || m.status === 'MAINT') {
          return;
        }

        // We auto-schedule if RUL falls below 250 hours (Warning zone)
        if (m.currentRul <= 250 && !existingTask) {
          const hoursToFailure = m.currentRul;
          const scheduledHours = Math.max(6, Math.round(hoursToFailure - 24)); // Schedule 24h before predicted failure

          const priority = m.currentRul <= 48 ? 'CRITICAL' : m.currentRul <= 120 ? 'HIGH' : 'MEDIUM';

          const technicians = ['Tech J. Miller', 'Tech A. Chen', 'Tech R. Kovacs', 'Tech M. Patel'];
          const randomTech = technicians[Math.floor(Math.random() * technicians.length)];

          let parts: string[] = [];
          if (m.category === 'dicing') parts = ['Diamond Blade Code-D3', 'Coolant Filter'];
          else if (m.category === 'die_attach') parts = ['Vacuum Seal Ring', 'Bonding Collet H2'];
          else if (m.category === 'wire_bond') parts = ['Ultrasonic Transducer Tip', 'Wire Clamp Assembly'];
          else if (m.category === 'molding') parts = ['Hydraulic Seal Kit', 'Plunger Tip Ring'];
          else if (m.category === 'ate_sort') parts = ['Contact Test Pins', 'Pneumatic Carriage Seals'];

          const newTask: MaintenanceTask = {
            id: `WO-${Date.now()}-${m.id}`,
            machineId: m.id,
            machineName: m.name,
            machineCategory: m.category,
            scheduledTime: `In ${scheduledHours} hours`,
            predictedFailureTime: `In ${m.currentRul} hours`,
            priority,
            status: 'SCHEDULED',
            technician: randomTech,
            estimatedDuration: m.category === 'molding' ? 3.5 : m.category === 'dicing' ? 1.5 : 2.0,
            partsRequired: parts,
          };

          updatedTasks.push(newTask);
          queueChanged = true;
          logSystemEvent('SYSTEM', `AUTO-SCHEDULER: Created preventive Maintenance Work Order ${newTask.id} for ${m.id} (RUL: ${m.currentRul}h).`, m.id);
        } else if (existingTask && existingTask.status === 'SCHEDULED') {
          // Dynamic priority update if RUL drops further
          const correctPriority = m.currentRul <= 48 ? 'CRITICAL' : m.currentRul <= 120 ? 'HIGH' : 'MEDIUM';
          if (existingTask.priority !== correctPriority) {
            existingTask.priority = correctPriority;
            existingTask.predictedFailureTime = `In ${m.currentRul} hours`;
            queueChanged = true;
          }
        }
      });

      return queueChanged ? updatedTasks : prevTasks;
    });
  }, [machines]);

  // Actions
  const simulateWear = (machineId: string) => {
    setMachines((prev) =>
      prev.map((m) => (m.id === machineId ? { ...m, isSimulatingWear: true } : m))
    );
    logSystemEvent('SYSTEM', `SIMULATION: Accelerated wear model enabled on ${machineId}. Sensor values degrading rapidly.`, machineId);
  };

  const stopWear = (machineId: string) => {
    setMachines((prev) =>
      prev.map((m) => (m.id === machineId ? { ...m, isSimulatingWear: false } : m))
    );
    logSystemEvent('SYSTEM', `SIMULATION: Wear model returned to normal on ${machineId}.`, machineId);
  };

  const performMaintenance = (
    machineId: string,
    type: string = 'Full Service',
    description: string = 'Routine preventive service',
    technician: string = 'Tech Admin'
  ) => {
    // Reset machine state
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id !== machineId) return m;

        // Reset sensors to baseline
        const resetSensors = m.sensors.map((s) => ({
          ...s,
          value: s.baseline,
          deviation: 0,
        }));

        // Log history entry
        const historyEntry: MaintenanceHistoryLog = {
          id: `HIST-${m.id}-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type,
          description,
          technician,
        };

        const initialRul = Math.round(
          weights.intercept -
            weights.devWeight * 0 -
            weights.rateWeight * m.degradationRate -
            weights.timeWeight * 0
        );

        return {
          ...m,
          timeSinceBaseline: 0,
          sensors: resetSensors,
          currentRul: initialRul,
          status: 'HEALTHY',
          healthScore: 100,
          alerts: [],
          isSimulatingWear: false,
          maintenanceHistory: [historyEntry, ...m.maintenanceHistory],
        };
      })
    );

    // Complete related tasks in queue
    setMaintenanceQueue((prev) =>
      prev.map((t) =>
        t.machineId === machineId && t.status !== 'COMPLETED'
          ? { ...t, status: 'COMPLETED' }
          : t
      )
    );

    logSystemEvent('MAINTENANCE', `COMPLETED SERVICE: Machine ${machineId} underwent ${type} by ${technician}. Consumables replaced, sensors recalibrated to baseline.`, machineId);
  };

  const updateWeights = (newWeights: ModelWeights) => {
    setWeights(newWeights);
    logSystemEvent('SYSTEM', `CONFIGURATION: RUL Regression Model weights updated. Coefficients: Intercept=${newWeights.intercept}, Dev=${newWeights.devWeight}, Rate=${newWeights.rateWeight}, Time=${newWeights.timeWeight}`);
  };

  // Mock RAG Knowledge Base for Molding troubleshooting
  const queryRAG = async (category: MachineCategory, query: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cleaned = query.toLowerCase();
        if (category === 'molding' && (cleaned.includes('hydraulic') || cleaned.includes('pressure') || cleaned.includes('cavity'))) {
          resolve(`[VECTOR RAG ASSISTANT // RETRIEVAL COMPLETE]
SOURCE: SECTION 4.2 - ENCAPSULATION PLUNGER HYDRAULIC MANUAL (REV-2025)

SUMMARY: Troubleshooting Mold Cavity Pressure Drops:
1. CHECK RAM SEALS: Hydraulic pressure drops below 110 bar during injection suggest a cylinder piston bypass leak. Inspect O-ring seal part #MOL-SEAL-88.
2. CALIBRATE PLUNGER: Inspect plunger face for molding resin build-up. Plunger load deviations can cause high resistance, resulting in clamp pressure drops.
3. MONITOR CAVITY TEMP: If temperature falls below 170°C, resin viscosity increases exponentially, elevating plunger resistance and hydraulic strain. Increase temperature of Heater Block Lane C.
4. RECOMMENDED ACTION: Schedule hydraulic seal kit replacement (Part #MOL-HYD-KIT-9) and run pressure test cycle.`);
        } else if (cleaned.includes('blade') || cleaned.includes('dicing') || cleaned.includes('blunt')) {
          resolve(`[VECTOR RAG ASSISTANT // RETRIEVAL COMPLETE]
SOURCE: WAFER SAWING OPERATIONS SPECIFICATION v14

SUMMARY: Blade Bluntness & Micro-vibrations:
1. BLADE WEAR TELEMETRY: Bluntness manifests as a joint spike in spindle vibration (>3.5 mm/s) and motor load current (>4.5 A).
2. ACTION SPEC: Immediately initiate spindle wash cycle. If load remains >4.8 A, blade replacement is mandatory (Blade Code-D3).
3. SILICON DANGER: Operating with >85% deviation risks micro-cracking and chipping along die borders, causing test-sort failure.`);
        } else {
          resolve(`[VECTOR RAG ASSISTANT // RETRIEVAL COMPLETE]
SOURCE: STANDARD OPERATING PROCEDURES (SOP-ALL-BACKEND)

No specific manuals matched your exact query, but matching telemetry guides recommend:
1. Check sensor calibration to baseline.
2. Inspect physical wear on mechanical joints.
3. Verify predicted Remaining Useful Life (RUL) and schedule maintenance.
4. Consult manufacturer documentation for code-specific hardware alarms.`);
        }
      }, 800);
    });
  };

  const startMaintenanceTask = (taskId: string) => {
    setMaintenanceQueue((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'IN_PROGRESS' } : t))
    );
    // Find task's machine id
    const task = maintenanceQueue.find((t) => t.id === taskId);
    if (task) {
      setMachines((prev) =>
        prev.map((m) => (m.id === task.machineId ? { ...m, status: 'MAINT' } : m))
      );
      logSystemEvent('MAINTENANCE', `SERVICE IN PROGRESS: Technician started maintenance work order ${taskId} on ${task.machineId}. Machine taken offline.`, task.machineId);
    }
  };

  const completeMaintenanceTask = (taskId: string) => {
    const task = maintenanceQueue.find((t) => t.id === taskId);
    if (task) {
      performMaintenance(
        task.machineId,
        'Full Service',
        `Completed preventive scheduling order ${taskId}. Replaced required parts: ${task.partsRequired.join(', ')}.`,
        task.technician
      );
    }
  };

  const deleteMaintenanceTask = (taskId: string) => {
    setMaintenanceQueue((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Sudden Sensor Spike (e.g. contact pin wear on ATE, collet leak on Die Attacher, etc.)
  const triggerManualSensorSpike = (machineId: string, sensorName: string) => {
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id !== machineId) return m;

        const updatedSensors = m.sensors.map((s) => {
          if (s.name !== sensorName) return s;

          // Spike value directly to 120% of threshold
          const span = s.threshold - s.baseline;
          let spikedValue = s.baseline + span * 1.25;
          if (s.name === 'pressure_vacuum') {
            spikedValue = -50.0; // pressure loss
          }

          const dev = calculateDeviation(spikedValue, s.baseline, s.threshold, s.name);
          return {
            ...s,
            value: parseFloat(spikedValue.toFixed(2)),
            deviation: Math.round(dev),
          };
        });

        const maxDev = Math.max(...updatedSensors.map((s) => s.deviation));
        const rul = Math.max(
          0,
          weights.intercept -
            weights.devWeight * maxDev -
            weights.rateWeight * m.degradationRate -
            weights.timeWeight * m.timeSinceBaseline
        );

        const spikedSensor = updatedSensors.find((x) => x.name === sensorName);
        const sensorLabel = spikedSensor ? spikedSensor.label : sensorName;
        const sensorVal = spikedSensor ? spikedSensor.value : '';
        const sensorUnit = spikedSensor ? spikedSensor.unit : '';

        let newStatus: Machine['status'] = 'CRITICAL';
        const newAlerts = [...m.alerts];
        const alertMsg = `SUDDEN SENSOR SPIKE: ${sensorLabel} exceeded safety threshold. Immediate inspection required!`;
        newAlerts.push(alertMsg);

        logSystemEvent(
          'CRITICAL',
          `TELEMETRY ANOMALY: Sudden sensor spike detected on ${m.id} - ${sensorLabel}: ${sensorVal}${sensorUnit}`,
          m.id
        );

        return {
          ...m,
          sensors: updatedSensors,
          currentRul: Math.round(rul),
          status: newStatus,
          alerts: newAlerts,
          healthScore: Math.max(10, Math.round(100 - maxDev * 0.9)),
        };
      })
    );
  };

  return (
    <FactoryContext.Provider
      value={{
        machines,
        weights,
        maintenanceQueue,
        events,
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

export const useFactory = () => {
  const context = useContext(FactoryContext);
  if (context === undefined) {
    throw new Error('useFactory must be used within a FactoryProvider');
  }
  return context;
};
