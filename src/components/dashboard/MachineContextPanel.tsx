import React from 'react';
import { MachineNode } from '../../types/dashboard';
import { TabId } from '../../types/navigation';
import { MachineIcon } from './MachineIcon';
import {
  X,
  ArrowRight,
  AlertTriangle,
  Clock,
  Activity,
  Thermometer,
  Zap,
  Wrench,
  BrainCircuit,
  Cpu,
} from 'lucide-react';

interface MachineContextPanelProps {
  machine: MachineNode | null;
  onClose: () => void;
  onNavigate?: (tab: TabId, machineId?: string) => void;
}

export const MachineContextPanel: React.FC<MachineContextPanelProps> = ({
  machine,
  onClose,
  onNavigate,
}) => {
  if (!machine) {
    return (
      <aside className="machine-context-panel" style={{ justifyContent: 'center', alignItems: 'center', padding: '30px 20px', textAlign: 'center' }}>
        <span className="corner-tl">+</span>
        <span className="corner-tr">+</span>
        <span className="corner-bl">+</span>
        <span className="corner-br">+</span>

        <div style={{ opacity: 0.5, marginBottom: '12px' }}>
          <Cpu size={36} strokeWidth={1.5} />
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          No Machine Selected
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px', maxWidth: '220px' }}>
          Click any machine node on the digital factory map to inspect telemetry, issues, and predictive actions.
        </p>
      </aside>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'var(--accent-green)';
      case 'warning':
        return 'var(--accent-amber)';
      case 'critical':
        return 'var(--accent-red)';
      default:
        return 'var(--text-muted)';
    }
  };

  return (
    <aside className="machine-context-panel" aria-label="Machine Context Inspector">
      <span className="corner-tl">+</span>
      <span className="corner-tr">+</span>
      <span className="corner-bl">+</span>
      <span className="corner-br">+</span>

      {/* Header */}
      <div className="context-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              backgroundColor: 'var(--bg-dark)',
              color: 'var(--text-inverted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-strong)',
            }}
          >
            <MachineIcon type={machine.type} size={16} color="#FFF" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800, letterSpacing: '0.04em' }}>
              {machine.id}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {machine.name}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: '1px solid var(--border-light)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Close Inspector"
        >
          <X size={14} />
        </button>
      </div>

      {/* Body */}
      <div className="context-body">
        {/* Machine Metadata Grid */}
        <div className="telemetry-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="telemetry-item">
            <span className="telemetry-label">Machine Type</span>
            <span className="telemetry-value" style={{ fontSize: '11px', fontWeight: 700 }}>
              {machine.type}
            </span>
          </div>

          <div className="telemetry-item">
            <span className="telemetry-label">Location / Line</span>
            <span className="telemetry-value" style={{ fontSize: '11px', fontWeight: 700 }}>
              {machine.bay} • {machine.line.split(' - ')[0]}
            </span>
          </div>

          <div className="telemetry-item">
            <span className="telemetry-label">Health Score</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                className="telemetry-value"
                style={{ color: getStatusColor(machine.status) }}
              >
                {machine.healthScore}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
          </div>

          <div className="telemetry-item">
            <span className="telemetry-label">Predicted RUL</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} color="var(--accent-amber)" />
              <span className="telemetry-value" style={{ fontSize: '13px' }}>
                {machine.rulHours > 0 ? `${machine.rulHours} hrs` : 'N/A (Offline)'}
              </span>
            </div>
          </div>
        </div>

        {/* Risk Level Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 10px',
            border: '1px solid var(--border-strong)',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            Operating Risk Level
          </span>
          <span
            className="status-pill"
            style={{
              borderColor: getStatusColor(machine.status),
              color: machine.status === 'critical' ? 'var(--accent-red)' : 'inherit',
            }}
          >
            <span
              className="status-dot"
              style={{ backgroundColor: getStatusColor(machine.status) }}
            />
            <span>{machine.riskLevel.toUpperCase()}</span>
          </span>
        </div>

        {/* Live Telemetry Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Real-Time Sensor Feed
            </span>
            <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              LIVE OPC-UA
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            <div className="telemetry-item" style={{ padding: '6px 8px' }}>
              <span className="telemetry-label" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Activity size={10} /> Vib
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: machine.telemetry.vibration > machine.telemetry.vibrationThreshold ? 'var(--accent-red)' : 'var(--text-primary)',
                }}
              >
                {machine.telemetry.vibration} mm/s
              </span>
            </div>

            <div className="telemetry-item" style={{ padding: '6px 8px' }}>
              <span className="telemetry-label" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Thermometer size={10} /> Temp
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: machine.telemetry.temperature > machine.telemetry.tempThreshold ? 'var(--accent-red)' : 'var(--text-primary)',
                }}
              >
                {machine.telemetry.temperature}°C
              </span>
            </div>

            <div className="telemetry-item" style={{ padding: '6px 8px' }}>
              <span className="telemetry-label" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Zap size={10} /> OEE
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700 }}>
                {machine.telemetry.oee}%
              </span>
            </div>
          </div>
        </div>

        {/* Most Recent Detected Issue (if any) */}
        {machine.primaryIssue ? (
          <div className={`context-issue-alert ${machine.status === 'warning' ? 'warning' : ''}`}>
            <div className="context-issue-title">
              <AlertTriangle size={13} color={machine.status === 'critical' ? 'var(--accent-red)' : 'var(--accent-amber)'} />
              <span>{machine.primaryIssue.title}</span>
            </div>
            <p className="context-issue-desc">{machine.primaryIssue.description}</p>
            <div style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
              Component: {machine.primaryIssue.component} • Detected {machine.primaryIssue.detectedAt}
            </div>

            {machine.recommendedAction && (
              <div
                style={{
                  marginTop: '6px',
                  padding: '6px 8px',
                  backgroundColor: 'rgba(0,0,0,0.04)',
                  borderLeft: '2px solid var(--border-strong)',
                  fontSize: '10px',
                  fontWeight: 600,
                }}
              >
                <span style={{ fontWeight: 800 }}>ACTION:</span> {machine.recommendedAction}
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              padding: '10px 12px',
              border: '1px solid var(--accent-green)',
              backgroundColor: '#F0FDF4',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#166534',
            }}
          >
            <span className="status-dot" style={{ backgroundColor: 'var(--accent-green)' }} />
            <span>All operating harmonics nominal. No active anomalies detected.</span>
          </div>
        )}

        {/* Production Impact Note */}
        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)', padding: '6px 8px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontWeight: 700 }}>Impact:</span> {machine.productionImpact}
        </div>

        {/* Navigation Action Buttons (Drill-Down Workflow) */}
        <div className="context-action-group">
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '9.5px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Drill-Down Actions
          </span>

          <button
            onClick={() => onNavigate?.('machines', machine.id)}
            className="tech-btn"
            style={{ width: '100%', justifyContent: 'space-between', padding: '8px 12px' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={14} />
              <span>View Machine Diagnostics</span>
            </span>
            <ArrowRight size={13} />
          </button>

          <button
            onClick={() => onNavigate?.('prediction', machine.id)}
            className="tech-btn"
            style={{ width: '100%', justifyContent: 'space-between', padding: '8px 12px' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BrainCircuit size={14} />
              <span>View AI Prediction & RUL</span>
            </span>
            <ArrowRight size={13} />
          </button>

          <button
            onClick={() => onNavigate?.('maintenance', machine.id)}
            className="tech-btn primary"
            style={{ width: '100%', justifyContent: 'space-between', padding: '8px 12px' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wrench size={14} />
              <span>View Maintenance & Service</span>
            </span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
};
