import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Bell, Wrench, AlertTriangle, Zap, ChevronRight, X, CheckCheck } from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';

interface NotificationPanelProps {
  onNavigate: (tab: string, machineId?: string) => void;
}

type NotifCategory = 'maintenance' | 'threshold' | 'anomaly';

interface AppNotification {
  id: string;
  category: NotifCategory;
  title: string;
  message: string;
  machineId?: string;
  machineName?: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  read: boolean;
  navigateTo?: string;
}

const CATEGORY_META: Record<NotifCategory, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  maintenance: {
    label: 'Auto Maintenance',
    icon: <Wrench size={12} />,
    color: '#2563EB',
    bg: 'rgba(37, 99, 235, 0.10)',
  },
  threshold: {
    label: 'Machine Threshold',
    icon: <AlertTriangle size={12} />,
    color: '#D97706',
    bg: 'rgba(217, 119, 6, 0.10)',
  },
  anomaly: {
    label: 'Anomaly Detected',
    icon: <Zap size={12} />,
    color: '#DC2626',
    bg: 'rgba(220, 38, 38, 0.10)',
  },
};

const SEVERITY_COLOR: Record<string, string> = {
  critical: '#DC2626',
  warning: '#D97706',
  info: '#2563EB',
};

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onNavigate }) => {
  const { machines, maintenanceQueue, events } = useFactory();
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<NotifCategory | 'all'>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Derive notifications from live context
  const notifications = useMemo<AppNotification[]>(() => {
    const notifs: AppNotification[] = [];

    // ── 1. Automated Maintenance Queue entries ──────────────────────────────
    maintenanceQueue
      .filter((t) => t.status !== 'COMPLETED')
      .forEach((task) => {
        const isCritical = task.priority === 'CRITICAL';
        notifs.push({
          id: `maint-${task.id}`,
          category: 'maintenance',
          title: `Work Order: ${task.machineId}`,
          message: `${task.machineName} — ${task.priority} priority. Scheduled in ${task.scheduledTime.replace('In ', '')}. Tech: ${task.technician}.`,
          machineId: task.machineId,
          machineName: task.machineName,
          severity: isCritical ? 'critical' : 'warning',
          timestamp: new Date(Date.now() - Math.random() * 600000).toISOString(),
          read: false,
          navigateTo: 'maintenance',
        });
      });

    // ── 2. Machine Threshold violations (sensors > threshold) ───────────────
    machines.forEach((m) => {
      const exceeded = m.sensors.filter((s) => s.deviation >= 90);
      exceeded.forEach((s) => {
        notifs.push({
          id: `thresh-${m.id}-${s.name}`,
          category: 'threshold',
          title: `Threshold Exceeded: ${m.id}`,
          message: `${s.label} at ${s.value.toFixed(1)}${s.unit} — ${s.deviation}% of safety limit. Immediate inspection advised.`,
          machineId: m.id,
          machineName: m.name,
          severity: 'critical',
          timestamp: new Date(Date.now() - Math.random() * 300000).toISOString(),
          read: false,
          navigateTo: 'machines',
        });
      });

      // Warning level (60-89%)
      const warned = m.sensors.filter((s) => s.deviation >= 60 && s.deviation < 90);
      warned.forEach((s) => {
        notifs.push({
          id: `thresh-warn-${m.id}-${s.name}`,
          category: 'threshold',
          title: `Threshold Warning: ${m.id}`,
          message: `${s.label} at ${s.deviation}% deviation — approaching safety limit (${s.value.toFixed(1)}${s.unit}).`,
          machineId: m.id,
          machineName: m.name,
          severity: 'warning',
          timestamp: new Date(Date.now() - Math.random() * 600000).toISOString(),
          read: false,
          navigateTo: 'machines',
        });
      });
    });

    // ── 3. Anomaly / System events (CRITICAL / WARNING status events) ───────
    events
      .filter((ev) => ev.type === 'CRITICAL' || ev.type === 'REROUTE')
      .slice(0, 8)
      .forEach((ev) => {
        notifs.push({
          id: `anomaly-${ev.id}`,
          category: 'anomaly',
          title: ev.type === 'REROUTE' ? 'Dynamic Rerouting' : 'Anomaly Alert',
          message: ev.message,
          machineId: ev.machineId,
          severity: ev.type === 'CRITICAL' ? 'critical' : 'warning',
          timestamp: ev.timestamp,
          read: false,
          navigateTo: ev.machineId ? 'machines' : 'dashboard',
        });
      });

    // Sort: critical first, then by recency
    notifs.sort((a, b) => {
      if (a.severity === 'critical' && b.severity !== 'critical') return -1;
      if (b.severity === 'critical' && a.severity !== 'critical') return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return notifs;
  }, [machines, maintenanceQueue, events]);

  const filtered = activeFilter === 'all' ? notifications : notifications.filter((n) => n.category === activeFilter);
  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;
  const criticalCount = notifications.filter((n) => n.severity === 'critical' && !readIds.has(n.id)).length;

  const handleNotifClick = (notif: AppNotification) => {
    setReadIds((prev) => new Set([...prev, notif.id]));
    if (notif.navigateTo) {
      onNavigate(notif.navigateTo, notif.machineId);
    }
    setOpen(false);
  };

  const handleMarkAllRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  return (
    <div ref={panelRef} style={{ position: 'relative' }}>
      {/* Bell Button */}
      <button
        id="notification-bell-btn"
        onClick={() => setOpen((v) => !v)}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '34px',
          height: '34px',
          background: open ? 'var(--bg-dark)' : 'var(--bg-card)',
          border: '1.5px solid var(--border-strong)',
          cursor: 'pointer',
          color: open ? 'var(--text-inverted)' : 'var(--text-primary)',
          transition: 'all 0.15s ease',
          flexShrink: 0,
        }}
        title="Notifications"
        aria-label="Open notifications"
      >
        <Bell size={15} style={{ transition: 'transform 0.2s', transform: open ? 'rotate(-15deg)' : 'none' }} />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              minWidth: '16px',
              height: '16px',
              borderRadius: '8px',
              backgroundColor: criticalCount > 0 ? '#DC2626' : '#D97706',
              color: '#fff',
              fontSize: '9px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 3px',
              fontFamily: 'var(--font-mono)',
              border: '1.5px solid var(--bg-card)',
              animation: criticalCount > 0 ? 'notif-pulse 2s ease-in-out infinite' : 'none',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          id="notification-panel"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '380px',
            maxHeight: '540px',
            backgroundColor: 'var(--bg-card)',
            border: '1.5px solid var(--border-strong)',
            boxShadow: '4px 4px 0px rgba(0,0,0,0.12)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
            animation: 'notif-panel-in 0.18s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1.5px solid var(--border-strong)',
              backgroundColor: 'var(--bg-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={13} color="var(--text-inverted)" />
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: 'var(--text-inverted)',
                  textTransform: 'uppercase',
                }}
              >
                Notifications
              </span>
              {unreadCount > 0 && (
                <span
                  style={{
                    backgroundColor: criticalCount > 0 ? '#DC2626' : '#D97706',
                    color: '#fff',
                    fontSize: '9px',
                    fontWeight: 800,
                    padding: '1px 5px',
                    borderRadius: '3px',
                  }}
                >
                  {unreadCount} NEW
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  title="Mark all as read"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(244,243,238,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <CheckCheck size={12} />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(244,243,238,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1.5px solid var(--border-strong)',
              backgroundColor: 'var(--bg-surface)',
              flexShrink: 0,
              overflowX: 'auto',
            }}
          >
            {(['all', 'maintenance', 'threshold', 'anomaly'] as const).map((cat) => {
              const isActive = activeFilter === cat;
              const count =
                cat === 'all'
                  ? notifications.length
                  : notifications.filter((n) => n.category === cat).length;
              const meta = cat !== 'all' ? CATEGORY_META[cat] : null;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  style={{
                    flex: cat === 'all' ? '0 0 auto' : '1',
                    padding: '8px 10px',
                    background: isActive ? 'var(--bg-dark)' : 'transparent',
                    border: 'none',
                    borderRight: '1px solid var(--border-light)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    fontSize: '9.5px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: isActive ? 'var(--text-inverted)' : meta ? meta.color : 'var(--text-muted)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.12s',
                  }}
                >
                  {meta && <span style={{ color: isActive ? 'var(--text-inverted)' : meta.color }}>{meta.icon}</span>}
                  <span>{cat === 'all' ? 'All' : meta?.label}</span>
                  <span
                    style={{
                      fontSize: '8px',
                      padding: '1px 4px',
                      borderRadius: '2px',
                      backgroundColor: isActive
                        ? 'rgba(255,255,255,0.15)'
                        : cat !== 'all'
                        ? meta?.bg
                        : 'var(--bg-muted)',
                      color: isActive ? '#fff' : cat !== 'all' ? meta?.color : 'var(--text-muted)',
                      fontWeight: 800,
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Notification List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.length === 0 ? (
              <div
                style={{
                  padding: '32px 20px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '11px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Bell size={24} style={{ opacity: 0.3 }} />
                <span>All systems nominal. No active alerts.</span>
              </div>
            ) : (
              filtered.map((notif, idx) => {
                const isRead = readIds.has(notif.id);
                const meta = CATEGORY_META[notif.category];

                return (
                  <div
                    key={notif.id}
                    id={`notif-item-${notif.id}`}
                    onClick={() => handleNotifClick(notif)}
                    style={{
                      padding: '11px 16px',
                      borderBottom: idx < filtered.length - 1 ? '1px solid var(--border-light)' : 'none',
                      cursor: 'pointer',
                      backgroundColor: isRead ? 'transparent' : 'rgba(255,255,255,0.6)',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start',
                      transition: 'background 0.1s',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--bg-muted)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.backgroundColor = isRead ? 'transparent' : 'rgba(255,255,255,0.6)';
                    }}
                  >
                    {/* Severity indicator stripe */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '3px',
                        backgroundColor: SEVERITY_COLOR[notif.severity],
                        opacity: isRead ? 0.3 : 1,
                      }}
                    />

                    {/* Category icon */}
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '2px',
                        backgroundColor: meta.bg,
                        border: `1px solid ${meta.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: meta.color,
                        flexShrink: 0,
                        opacity: isRead ? 0.5 : 1,
                      }}
                    >
                      {meta.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '11px',
                            fontWeight: isRead ? 600 : 800,
                            color: isRead ? 'var(--text-secondary)' : 'var(--text-primary)',
                            letterSpacing: '0.02em',
                          }}
                        >
                          {notif.title}
                        </span>
                        <span
                          style={{
                            fontSize: '9px',
                            color: 'var(--text-muted)',
                            flexShrink: 0,
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {formatRelativeTime(notif.timestamp)}
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize: '10.5px',
                          color: isRead ? 'var(--text-muted)' : 'var(--text-secondary)',
                          marginTop: '3px',
                          lineHeight: 1.45,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {notif.message}
                      </p>

                      {/* Navigate CTA */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          marginTop: '5px',
                          color: meta.color,
                          fontSize: '9.5px',
                          fontWeight: 700,
                          opacity: isRead ? 0.5 : 1,
                        }}
                      >
                        <ChevronRight size={11} />
                        <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Go to {notif.navigateTo === 'machines' ? `Machines${notif.machineId ? ` › ${notif.machineId}` : ''}` : notif.navigateTo === 'maintenance' ? 'Maintenance' : 'Dashboard'}
                        </span>
                        {!isRead && (
                          <span
                            style={{
                              marginLeft: 'auto',
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: SEVERITY_COLOR[notif.severity],
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer summary */}
          {notifications.length > 0 && (
            <div
              style={{
                padding: '8px 16px',
                borderTop: '1.5px solid var(--border-strong)',
                backgroundColor: 'var(--bg-surface)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {notifications.filter((n) => n.severity === 'critical').length} critical · {notifications.filter((n) => n.severity === 'warning').length} warnings
              </span>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Live · auto-refreshed
              </span>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes notif-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
          50% { box-shadow: 0 0 0 4px rgba(220, 38, 38, 0); }
        }
        @keyframes notif-panel-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default NotificationPanel;
