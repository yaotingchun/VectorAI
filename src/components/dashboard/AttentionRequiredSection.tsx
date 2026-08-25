import React from 'react';
import { AlertItem } from '../../types/dashboard';
import { TabId } from '../../types/navigation';
import { MachineIcon } from './MachineIcon';
import {
  Clock,
  ShieldAlert,
  BrainCircuit,
  Wrench,
  Cpu,
} from 'lucide-react';

interface AttentionRequiredSectionProps {
  alerts: AlertItem[];
  onNavigate?: (tab: TabId, machineId?: string) => void;
  onSelectMachine?: (machineId: string) => void;
}

export const AttentionRequiredSection: React.FC<AttentionRequiredSectionProps> = ({
  alerts,
  onNavigate,
  onSelectMachine,
}) => {
  return (
    <section className="tech-card" aria-label="Attention Required Alerts">
      <span className="corner-tl">+</span>
      <span className="corner-tr">+</span>
      <span className="corner-bl">+</span>
      <span className="corner-br">+</span>

      <div className="tech-card-header">
        <div className="tech-card-title">
          <ShieldAlert size={16} color="var(--accent-red)" />
          <span>Attention Required — Priority Anomaly Queue</span>
        </div>
        <span className="status-pill dark" style={{ fontSize: '10px' }}>
          {alerts.length} EVENTS
        </span>
      </div>

      <div className="tech-card-body" style={{ padding: '12px' }}>
        <div className="alert-card-list">
          {alerts.map((alert) => {
            const isCritical = alert.severity === 'critical';

            return (
              <div
                key={alert.id}
                className={`alert-card ${isCritical ? 'critical' : 'warning'}`}
              >
                {/* Top Row: Machine Tag, Type, Location, RUL & Health Score */}
                <div className="alert-top">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        padding: '4px',
                        border: '1px solid var(--border-strong)',
                        backgroundColor: isCritical ? '#FEF2F2' : '#FFFBEB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MachineIcon
                        type={alert.machineType}
                        size={16}
                        color={isCritical ? 'var(--accent-red)' : 'var(--accent-amber)'}
                      />
                    </div>

                    <div>
                      <div className="alert-meta-tag">
                        <span>{alert.machineId}</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          • {alert.machineType}
                        </span>
                      </div>
                      <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                        {alert.bay} • {alert.line}
                      </div>
                    </div>
                  </div>

                  {/* Health Score & RUL Urgency */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 7px',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-strong)',
                        fontSize: '10.5px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                      }}
                    >
                      <Clock size={11} color={isCritical ? 'var(--accent-red)' : 'var(--accent-amber)'} />
                      <span>RUL {alert.rulHours}h</span>
                    </div>

                    <div
                      style={{
                        padding: '3px 7px',
                        backgroundColor: isCritical ? 'var(--accent-red)' : 'var(--accent-amber)',
                        color: '#FFFFFF',
                        fontSize: '10.5px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                      }}
                    >
                      {alert.healthScore}% HP
                    </div>
                  </div>
                </div>

                {/* Middle: Issue & Impact */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '11.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {alert.issue}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                    <span style={{ fontWeight: 600 }}>Impact:</span> {alert.productionImpact}
                  </div>
                </div>

                {/* Recommended Action Box */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-light)',
                    borderLeft: `3px solid ${isCritical ? 'var(--accent-red)' : 'var(--accent-amber)'}`,
                    padding: '6px 10px',
                    fontSize: '10.5px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '9px', color: 'var(--text-muted)' }}>
                      RECOMMENDED MITIGATION
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '9px', color: isCritical ? 'var(--accent-red)' : 'var(--accent-amber)' }}>
                      URGENCY: {alert.actionUrgency}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {alert.recommendedAction}
                  </div>
                </div>

                {/* Bottom Actions (Drill-Down Links) */}
                <div className="alert-actions-row">
                  <button
                    onClick={() => {
                      onSelectMachine?.(alert.machineId);
                      onNavigate?.('machines', alert.machineId);
                    }}
                    className="tech-btn"
                    style={{ padding: '4px 8px', fontSize: '10px' }}
                    title="View Machine Telemetry"
                  >
                    <Cpu size={12} />
                    <span>View Machine</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectMachine?.(alert.machineId);
                      onNavigate?.('prediction', alert.machineId);
                    }}
                    className="tech-btn"
                    style={{ padding: '4px 8px', fontSize: '10px' }}
                    title="View AI Degradation Model"
                  >
                    <BrainCircuit size={12} />
                    <span>View Prediction</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectMachine?.(alert.machineId);
                      onNavigate?.('maintenance', alert.machineId);
                    }}
                    className="tech-btn primary"
                    style={{ padding: '4px 8px', fontSize: '10px' }}
                    title="Schedule Maintenance Task"
                  >
                    <Wrench size={12} />
                    <span>Schedule Maintenance</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
