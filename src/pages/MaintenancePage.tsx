import React, { useState } from 'react';
import { useFactory } from '../context/FactoryContext';
import { MaintenanceTask } from '../types/factory';
import {
  Calendar,
  CalendarDays,
  CheckCircle2,
  PlayCircle,
  History,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Bell,
  Clock,
  Wrench,
} from 'lucide-react';

export const MaintenancePage: React.FC = () => {
  const {
    machines,
    maintenanceQueue,
    startMaintenanceTask,
    completeMaintenanceTask,
    deleteMaintenanceTask,
  } = useFactory();

  // Calendar State
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());

  const activeTasks = maintenanceQueue.filter((t) => t.status !== 'COMPLETED');
  const completedTasks = maintenanceQueue.filter((t) => t.status === 'COMPLETED');

  // KPI Calculations
  const activeCount = activeTasks.length;
  const completedCount = completedTasks.length;
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

  // Calendar Helpers
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Monday start (0: Mon, 6: Sun)

  const handlePrevMonth = () => {
    setCurrentCalendarDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentCalendarDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  // Collect scheduled reminders for each date
  interface DayReminder {
    machineId: string;
    machineName: string;
    type: 'CRITICAL' | 'OPTIMAL' | 'PREVENTIVE' | 'SCHEDULED';
    title: string;
    parts: string[];
    dateStr: string;
    urgencyText: string;
  }

  const getRemindersForDate = (dayNum: number): DayReminder[] => {
    const targetDate = new Date(year, month, dayNum);
    const reminders: DayReminder[] = [];

    // Map active tasks by estimated scheduled time
    activeTasks.forEach((task) => {
      const machine = machines.find((m) => m.id === task.machineId);
      const rulHours = machine?.currentRul || 48;
      const scheduledDate = new Date(Date.now() + rulHours * 3600 * 1000);

      if (
        scheduledDate.getFullYear() === targetDate.getFullYear() &&
        scheduledDate.getMonth() === targetDate.getMonth() &&
        scheduledDate.getDate() === dayNum
      ) {
        reminders.push({
          machineId: task.machineId,
          machineName: task.machineName,
          type: task.priority === 'CRITICAL' ? 'CRITICAL' : task.priority === 'HIGH' ? 'OPTIMAL' : 'PREVENTIVE',
          title: `Predicted Service Window (RUL: ${rulHours}h)`,
          parts: task.partsRequired,
          dateStr: scheduledDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          urgencyText: task.priority === 'CRITICAL' ? 'IMMINENT BREAKDOWN RISK' : 'OPTIMAL REPLACEMENT WINDOW',
        });
      }
    });

    // Also check machines requiring calibration
    machines.forEach((m) => {
      if (m.currentRul <= 250 && !activeTasks.some(t => t.machineId === m.id)) {
        const estDate = new Date(Date.now() + m.currentRul * 3600 * 1000);
        if (
          estDate.getFullYear() === targetDate.getFullYear() &&
          estDate.getMonth() === targetDate.getMonth() &&
          estDate.getDate() === dayNum
        ) {
          reminders.push({
            machineId: m.id,
            machineName: m.name,
            type: m.currentRul <= 48 ? 'CRITICAL' : 'OPTIMAL',
            title: `Recommended Service (RUL: ${m.currentRul}h)`,
            parts: ['Standard Calibration Kit'],
            dateStr: estDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            urgencyText: m.currentRul <= 48 ? 'CRITICAL' : 'OPTIMAL PREVENTIVE',
          });
        }
      }
    });

    return reminders;
  };

  // Find all dates in the current month that have maintenance events
  const monthMaintenanceDays = new Set<number>();
  for (let d = 1; d <= daysInMonth; d++) {
    if (getRemindersForDate(d).length > 0) {
      monthMaintenanceDays.add(d);
    }
  }

  // Selected date reminders list
  const selectedDateReminders = selectedDay ? getRemindersForDate(selectedDay) : [];

  // Next upcoming reminder
  const allUpcomingReminders: (DayReminder & { day: number })[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const rems = getRemindersForDate(d);
    rems.forEach(r => allUpcomingReminders.push({ ...r, day: d }));
  }

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

      {/* Main Grid: Active Scheduler Timeline vs Right Column (Calendar + Historical Log) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr', gap: '20px' }}>
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
                          <div
                            style={{
                              position: 'absolute',
                              top: '-3px',
                              left: `${Math.min(98, Math.max(2, (1 - rul / 400) * 100))}%`,
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

        {/* Right Column: Calendar Reminders & Historical Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* 1. Maintenance Calendar & Schedule Reminder Card (ABOVE ARCHIVE) */}
          <div className="tech-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="corner-tl">+</div>
            <div className="corner-tr">+</div>
            <div className="corner-bl">+</div>
            <div className="corner-br">+</div>
            <div className="tech-card-header">
              <span className="tech-card-title">
                <CalendarDays size={14} />
                MAINTENANCE SCHEDULE CALENDAR
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  onClick={handlePrevMonth}
                  className="tech-btn"
                  style={{ padding: '2px 6px', fontSize: '10px' }}
                  title="Previous Month"
                >
                  <ChevronLeft size={12} />
                </button>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, minWidth: '90px', textAlign: 'center' }}>
                  {currentCalendarDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="tech-btn"
                  style={{ padding: '2px 6px', fontSize: '10px' }}
                  title="Next Month"
                >
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>

            <div className="tech-card-body" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Calendar Days of Week Header */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
                {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map((d) => (
                  <span key={d} style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-muted)' }}>
                    {d}
                  </span>
                ))}
              </div>

              {/* Calendar Days Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {/* Empty cells before the first day */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} style={{ height: '32px', opacity: 0.2 }} />
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const isToday =
                    new Date().getDate() === dayNum &&
                    new Date().getMonth() === month &&
                    new Date().getFullYear() === year;

                  const isSelected = selectedDay === dayNum;
                  const hasEvent = monthMaintenanceDays.has(dayNum);
                  const reminders = getRemindersForDate(dayNum);
                  const hasCritical = reminders.some(r => r.type === 'CRITICAL');

                  return (
                    <button
                      key={`day-${dayNum}`}
                      onClick={() => setSelectedDay(dayNum)}
                      style={{
                        height: '32px',
                        border: isSelected
                          ? '1.5px solid var(--border-strong)'
                          : isToday
                          ? '1px dashed var(--accent-blue)'
                          : '1px solid var(--border-light)',
                        backgroundColor: isSelected
                          ? 'var(--bg-dark)'
                          : isToday
                          ? 'rgba(37, 99, 235, 0.08)'
                          : 'var(--bg-surface)',
                        color: isSelected
                          ? 'var(--text-inverted)'
                          : 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: isSelected || isToday || hasEvent ? 800 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        transition: 'all 0.1s ease',
                      }}
                    >
                      <span>{dayNum}</span>

                      {/* Event Dot Badge */}
                      {hasEvent && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '3px',
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: hasCritical
                              ? 'var(--accent-red)'
                              : isSelected
                              ? '#00ff66'
                              : 'var(--accent-amber)',
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="ruler-divider" style={{ opacity: 0.4, margin: '2px 0' }} />

              {/* Selected Day Reminders Box */}
              {selectedDay !== null && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Bell size={11} style={{ color: 'var(--accent-amber)' }} />
                      REMINDERS FOR {currentCalendarDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()} {selectedDay}
                    </span>
                    <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>
                      {selectedDateReminders.length} event{selectedDateReminders.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  {selectedDateReminders.length === 0 ? (
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '6px 0' }}>
                      No scheduled maintenance or calibration windows on this date.
                    </div>
                  ) : (
                    selectedDateReminders.map((rem, idx) => (
                      <div
                        key={idx}
                        style={{
                          border: `1px solid ${rem.type === 'CRITICAL' ? 'var(--accent-red)' : 'var(--accent-amber)'}`,
                          backgroundColor: rem.type === 'CRITICAL' ? 'rgba(220, 38, 38, 0.06)' : 'rgba(217, 119, 6, 0.06)',
                          padding: '8px 10px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '3px',
                          borderLeft: `3px solid ${rem.type === 'CRITICAL' ? 'var(--accent-red)' : 'var(--accent-amber)'}`,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '11px' }}>
                            {rem.machineId} • {rem.machineName}
                          </span>
                          <span
                            style={{
                              fontSize: '8px',
                              fontWeight: 800,
                              color: rem.type === 'CRITICAL' ? 'var(--accent-red)' : 'var(--accent-amber)',
                              border: `1px solid ${rem.type === 'CRITICAL' ? 'var(--accent-red)' : 'var(--accent-amber)'}`,
                              padding: '0 4px',
                            }}
                          >
                            {rem.urgencyText}
                          </span>
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                          {rem.title}
                        </div>
                        <div style={{ fontSize: '9.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Wrench size={10} /> Spares: <strong>{rem.parts.join(', ')}</strong>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Next Upcoming Reminder Ticker */}
              {allUpcomingReminders.length > 0 && (
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-light)',
                    padding: '8px 10px',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Clock size={12} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>NEXT SERVICE: </span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {allUpcomingReminders[0].dateStr} — {allUpcomingReminders[0].machineId} ({allUpcomingReminders[0].urgencyText})
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Service History Archive Card */}
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
                maxHeight: '380px',
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
    </div>
  );
};

export default MaintenancePage;
