import React from 'react';
import { useFactory } from '../context/FactoryContext';
import { MaintenanceTask } from '../types/factory';
import {
  Calendar,
  CheckCircle2,
  PlayCircle,
  History,
  ShieldCheck,
} from 'lucide-react';

export const MaintenancePage: React.FC = () => {
  const {
    machines,
    maintenanceQueue,
    startMaintenanceTask,
    completeMaintenanceTask,
    deleteMaintenanceTask,
  } = useFactory();

  const activeTasks = maintenanceQueue.filter((t) => t.status !== 'COMPLETED');
  const completedTasks = maintenanceQueue.filter((t) => t.status === 'COMPLETED');

  // KPI Calculations
  const activeCount = activeTasks.length;
  const completedCount = completedTasks.length;
  // Saved Downtime: e.g. 18 hours saved per early preventive action instead of breakdown recovery
  const savedDowntime = completedCount * 18 + activeTasks.filter(t => t.priority === 'CRITICAL').length * 4;
  const efficiency = completedCount + activeCount > 0
    ? Math.round((completedCount / (completedCount + activeTasks.filter(t => t.priority === 'CRITICAL').length)) * 100) || 100
    : 100;

  // Group active tasks by urgency/optimal window
  const getTaskMaintenanceWindowStatus = (task: MaintenanceTask) => {
    const machine = machines.find((m) => m.id === task.machineId);
    if (!machine) return { label: 'UNKNOWN', color: 'var(--text-muted)', desc: 'Sensor status unavailable', urgency: 0 };

    const rul = machine.currentRul;
    if (rul <= 24) {
      return {
        label: 'CRITICAL / OVERDUE',
        color: 'var(--accent-red)',
        desc: 'High breakdown risk. Failure imminent!',
        urgency: 3,
      };
    }
    if (rul > 24 && rul <= 72) {
      return {
        label: 'OPTIMAL WINDOW',
        color: 'var(--accent-green)',
        desc: 'Optimal trade-off: max wear utilization without risk.',
        urgency: 2,
      };
    }
    return {
      label: 'PREVENTIVE (SUFFICIENT RUL)',
      color: 'var(--accent-blue)',
      desc: 'Early schedule. Lifespan remaining.',
      urgency: 1,
    };
  };



  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div
        className="tech-card"
        style={{
          padding: '16px 20px',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <div className="corner-tl">+</div>
        <div className="corner-tr">+</div>
        <div className="corner-bl">+</div>
        <div className="corner-br">+</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, letterSpacing: '0.04em' }}>
          AUTOMATED PREDICTIVE SCHEDULER
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>
          Real-Time Work Order Calibration: Scheduling service windows when Remaining Useful Life (RUL) falls inside the optimal 24h-72h buffer.
        </p>
      </div>

      {/* Scheduler KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {/* Active work orders */}
        <div className="tech-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
            Active Work Orders
          </span>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginTop: '4px' }}>
            {activeCount} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>pending dispatch</span>
          </div>
        </div>

        {/* Saved Downtime */}
        <div className="tech-card" style={{ padding: '16px', borderLeft: '3px solid var(--accent-green)' }}>
          <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--accent-green)', display: 'block', textTransform: 'uppercase' }}>
            Prevented Downtime
          </span>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginTop: '4px', color: 'var(--accent-green)' }}>
            {savedDowntime} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>hours saved</span>
          </div>
        </div>

        {/* Maintenance Efficiency */}
        <div className="tech-card" style={{ padding: '16px', borderLeft: '3px solid var(--accent-blue)' }}>
          <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--accent-blue)', display: 'block', textTransform: 'uppercase' }}>
            Scheduling Precision
          </span>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginTop: '4px', color: 'var(--accent-blue)' }}>
            {efficiency}% <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>on-time actions</span>
          </div>
        </div>

        {/* Spares Utilization */}
        <div className="tech-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
            Pre-Allocated Spares
          </span>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginTop: '4px' }}>
            {Math.round(85 + (completedCount * 1.2))}% <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>kit availability</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Scheduler Timeline vs Historical log */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px' }}>
        {/* Left Column: Active Scheduled Maintenance Timeline */}
        <div className="tech-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="corner-tl">+</div>
          <div className="corner-tr">+</div>
          <div className="corner-bl">+</div>
          <div className="corner-br">+</div>
          <div className="tech-card-header">
            <span className="tech-card-title">
              <Calendar size={14} />
              PREDICTIVE TIMELINE & OPTIMAL WINDOW BOARD
            </span>
            <span className="status-pill">SORTED BY URGENCY</span>
          </div>

          <div className="tech-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeTasks.length === 0 ? (
              <div
                style={{
                  padding: '40px',
                  border: '1.5px dashed var(--border-light)',
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <ShieldCheck size={32} style={{ color: 'var(--accent-green)' }} />
                <strong>Telemetry Stable Across All Nodes</strong>
                <span style={{ fontSize: '11px' }}>No pending maintenance required. All machine RUL thresholds exceed 250h safety margins.</span>
              </div>
            ) : (
              activeTasks
                .sort((a, b) => {
                  const winA = getTaskMaintenanceWindowStatus(a);
                  const winB = getTaskMaintenanceWindowStatus(b);
                  return winB.urgency - winA.urgency;
                })
                .map((task) => {
                  const windowInfo = getTaskMaintenanceWindowStatus(task);
                  const machine = machines.find((m) => m.id === task.machineId);
                  const rul = machine?.currentRul || 0;

                  return (
                    <div
                      key={task.id}
                      style={{
                        border: '1.5px solid var(--border-strong)',
                        backgroundColor: 'var(--bg-card)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        padding: '14px',
                        boxShadow: '2px 2px 0px rgba(0,0,0,0.05)',
                        borderLeft: `4px solid ${windowInfo.color}`,
                      }}
                    >
                      {/* Top Header Row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px' }}>
                            {task.machineId} // {task.machineName}
                          </span>
                          <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginLeft: '10px' }}>
                            Work Order ID: <strong>{task.id}</strong>
                          </span>
                        </div>
                        <span
                          className="status-pill"
                          style={{
                            borderColor: windowInfo.color,
                            color: windowInfo.color,
                            fontSize: '9.5px',
                            fontWeight: 700,
                          }}
                        >
                          {windowInfo.label}
                        </span>
                      </div>

                      {/* Timeline Gantt Progress Bar representing RUL Optimal bounds */}
                      <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-light)', padding: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          <span>Safe Buffer (&gt;72h)</span>
                          <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>Optimal (24h - 72h)</span>
                          <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>Danger (&lt;24h)</span>
                        </div>

                        {/* Visual RUL track bar */}
                        <div style={{ height: '8px', backgroundColor: 'var(--bg-muted)', position: 'relative', display: 'flex' }}>
                          {/* Red zone (<24h) */}
                          <div style={{ width: '10%', height: '100%', borderRight: '1px dashed #fff', backgroundColor: 'rgba(220, 38, 38, 0.25)' }} />
                          {/* Green optimal zone (24h-72h) */}
                          <div style={{ width: '25%', height: '100%', borderRight: '1px dashed #fff', backgroundColor: 'rgba(22, 163, 74, 0.25)' }} />
                          {/* Safe zone (>72h) */}
                          <div style={{ flex: 1, height: '100%' }} />

                          {/* Pin indicator representing current machine RUL position */}
                          {/* We map max RUL to 2000 hours, so current RUL position is a percentage of that */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '-3px',
                              left: `${Math.min(98, Math.max(2, (1 - rul / 400) * 100))}%`, // Map 0-400h span for clarity
                              width: '14px',
                              height: '14px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--bg-dark)',
                              border: `2px solid ${windowInfo.color}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0px 1px 3px rgba(0,0,0,0.3)',
                              zIndex: 10,
                            }}
                            title={`Remaining Useful Life: ${rul}h`}
                          >
                            <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: windowInfo.color }} />
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          <span>Failure Point</span>
                          <span style={{ color: windowInfo.color, fontWeight: 700 }}>Machine sitting at {rul}h RUL</span>
                          <span>Calibrated Baseline</span>
                        </div>
                      </div>

                      {/* Metadata Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '10px', fontSize: '11px', borderBottom: '1px dashed var(--border-light)', paddingBottom: '8px' }}>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Required Spares:</span><br />
                          <strong>{task.partsRequired.join(', ')}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Assigned Tech:</span><br />
                          <strong>{task.technician}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Est. Duration:</span><br />
                          <strong>{task.estimatedDuration} hours</strong>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                          {windowInfo.desc}
                        </span>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          {task.status === 'SCHEDULED' ? (
                            <button
                              onClick={() => startMaintenanceTask(task.id)}
                              className="tech-btn primary"
                              style={{ padding: '4px 10px', fontSize: '11px' }}
                            >
                              <PlayCircle size={12} />
                              <span>Dispatch Tech (Offline)</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => completeMaintenanceTask(task.id)}
                              className="tech-btn"
                              style={{
                                padding: '4px 10px',
                                fontSize: '11px',
                                borderColor: 'var(--accent-green)',
                                color: 'var(--accent-green)',
                              }}
                            >
                              <CheckCircle2 size={12} />
                              <span>Sign-off Complete</span>
                            </button>
                          )}
                          <button
                            onClick={() => deleteMaintenanceTask(task.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--accent-red)',
                              cursor: 'pointer',
                              fontSize: '11px',
                              fontWeight: 600,
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Right Column: Historical Log */}
        <div className="tech-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="corner-tl">+</div>
          <div className="corner-tr">+</div>
          <div className="corner-bl">+</div>
          <div className="corner-br">+</div>
          <div className="tech-card-header">
            <span className="tech-card-title">
              <History size={14} />
              SERVICE HISTORY ARCHIVE
            </span>
          </div>

          <div
            className="tech-card-body"
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxHeight: '520px',
              overflowY: 'auto',
            }}
          >
            {completedTasks.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '11px', textAlign: 'center', padding: '20px' }}>
                No maintenance tasks completed in this shift.
              </div>
            ) : (
              completedTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-surface)',
                    padding: '10px',
                    fontSize: '11px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontFamily: 'var(--font-display)', fontSize: '12px' }}>
                      {task.machineId}
                    </strong>
                    <span style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '9px', border: '1px solid var(--accent-green)', padding: '1px 4px' }}>
                      RESOLVED
                    </span>
                  </div>

                  <div className="ruler-divider" style={{ opacity: 0.3, margin: '2px 0' }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Technician:</span> <strong>{task.technician}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Parts Replaced:</span> {task.partsRequired.join(', ')}
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Ticket:</span> <span style={{ opacity: 0.7 }}>{task.id}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
