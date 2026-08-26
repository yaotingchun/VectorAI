import React, { useState } from 'react';
import { AlertItem } from '../../types/dashboard';
import { TabId } from '../../types/navigation';
import {
  BellRing,
  AlertTriangle,
  AlertOctagon,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

interface AlertSummarySectionProps {
  alerts: AlertItem[];
  onNavigate?: (tab: TabId, machineId?: string) => void;
}

export const AlertSummarySection: React.FC<AlertSummarySectionProps> = ({
  alerts,
  onNavigate,
}) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning'>('all');

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'critical') return a.severity === 'critical';
    if (filter === 'warning') return a.severity === 'warning';
    return true;
  });

  return (
    <section className="tech-card" aria-label="Active Plant Alerts Summary">
      <span className="corner-tl">+</span>
      <span className="corner-tr">+</span>
      <span className="corner-bl">+</span>
      <span className="corner-br">+</span>

      <div className="tech-card-header">
        <div className="tech-card-title">
          <BellRing size={16} color="var(--accent-red)" />
          <span>Active Factory Alerts Summary</span>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`filter-badge-btn ${filter === 'all' ? 'active' : ''}`}
            style={{ padding: '3px 8px', fontSize: '10px' }}
          >
            All ({alerts.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('critical')}
            className={`filter-badge-btn ${filter === 'critical' ? 'active' : ''}`}
            style={{ padding: '3px 8px', fontSize: '10px' }}
          >
            Critical ({criticalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('warning')}
            className={`filter-badge-btn ${filter === 'warning' ? 'active' : ''}`}
            style={{ padding: '3px 8px', fontSize: '10px' }}
          >
            Warning ({warningCount})
          </button>
        </div>
      </div>

      <div className="tech-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Compact Alert Cards Feed */}
        <div className="alert-summary-feed">
          {filteredAlerts.slice(0, 4).map((alert) => {
            const isCrit = alert.severity === 'critical';

            return (
              <div
                key={alert.id}
                className={`alert-summary-item ${isCrit ? 'alert-crit-box' : 'alert-warn-box'}`}
              >
                {/* Header row */}
                <div className="alert-item-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isCrit ? (
                      <AlertOctagon size={13} color="var(--accent-red)" />
                    ) : (
                      <AlertTriangle size={13} color="var(--accent-amber)" />
                    )}
                    <span className="alert-item-id">{alert.id}</span>
                    <span className="dot-sep">•</span>
                    <span className="alert-item-mach">
                      {alert.machineId} ({alert.machineName})
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className={`priority-tag ${isCrit ? 'urgent' : 'high'}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="alert-item-time">{alert.detectedTime}</span>
                  </div>
                </div>

                {/* Issue & Impact */}
                <div className="alert-item-body">
                  <div className="alert-issue-title">
                    {alert.issue}
                  </div>
                  <div className="alert-impact-sub">
                    <strong>Impact:</strong> {alert.productionImpact}
                  </div>
                </div>

                {/* Footer with SLA & Action */}
                <div className="alert-item-footer">
                  <div className="alert-component-tag">
                    {alert.bay} • {alert.line.split(' - ')[0]} • {alert.component}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="alert-urgency-tag">
                      <Clock size={10} />
                      <span>{alert.actionUrgency}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => onNavigate?.('monitoring', alert.machineId)}
                      className="tech-btn"
                      style={{ padding: '2px 6px', fontSize: '9px' }}
                      title="Inspect machine telemetry in Monitoring page"
                    >
                      <span>Inspect</span>
                      <ArrowRight size={9} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View all alert queue strip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            SHOWING 4 OF {alerts.length} ALARMS (SLA RESPONSE ACTIVE)
          </span>

          <button
            type="button"
            onClick={() => onNavigate?.('prediction')}
            className="tech-btn"
            style={{ padding: '3px 8px', fontSize: '9.5px' }}
          >
            <span>View Complete Alert Queue</span>
            <ExternalLink size={10} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AlertSummarySection;
