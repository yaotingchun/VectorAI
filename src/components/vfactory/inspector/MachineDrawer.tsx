import React, { useState, useEffect } from 'react';
import { MachineData } from '../../../types/factory';
import { MachineAssetIcon } from '../canvas/MachineAssets';
import {
  X,
  Activity,
  Gauge,
  Thermometer,
  Zap,
  Clock,
  ShieldCheck,
  Wrench,
  Layers,
  Crosshair,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface MachineDrawerProps {
  machine: MachineData | null;
  onClose: () => void;
  onFocusMachine: (machine: MachineData) => void;
}

export const MachineDrawer: React.FC<MachineDrawerProps> = ({
  machine,
  onClose,
  onFocusMachine,
}) => {
  const [diagnosticRunning, setDiagnosticRunning] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Reset diagnostic state when selected machine changes
  useEffect(() => {
    setDiagnosticRunning(false);
    setDiagnosticResult(null);
  }, [machine?.id]);

  if (!machine) return null;

  const handleRunDiagnostics = () => {
    setDiagnosticRunning(true);
    setDiagnosticResult(null);
    setTimeout(() => {
      setDiagnosticRunning(false);
      setDiagnosticResult(
        machine.status === 'warning'
          ? 'Warning: Vibration anomaly detected on Spindle Bearing #2 (+18% above nominal).'
          : 'All 24 telemetry channels within nominal operating thresholds. Calibration OK.'
      );
    }, 900);
  };

  const getStatusBadge = (status: MachineData['status']) => {
    switch (status) {
      case 'running':
        return { label: 'RUNNING', bg: 'rgba(22, 163, 74, 0.12)', color: '#16A34A', border: '#16A34A' };
      case 'idle':
        return { label: 'STANDBY / IDLE', bg: 'rgba(59, 130, 246, 0.12)', color: '#2563EB', border: '#2563EB' };
      case 'warning':
        return { label: 'ALERT / WARNING', bg: 'rgba(217, 119, 6, 0.12)', color: '#D97706', border: '#D97706' };
      case 'error':
        return { label: 'FAULT / STOPPED', bg: 'rgba(220, 38, 38, 0.12)', color: '#DC2626', border: '#DC2626' };
      case 'maintenance':
        return { label: 'UNDER MAINTENANCE', bg: 'rgba(139, 92, 246, 0.12)', color: '#7C3AED', border: '#7C3AED' };
      default:
        return { label: 'UNKNOWN', bg: 'rgba(100, 116, 139, 0.12)', color: '#64748B', border: '#64748B' };
    }
  };

  const badge = getStatusBadge(machine.status);

  return (
    <div className="inspector-drawer-backdrop" onClick={onClose}>
      <aside
        className="inspector-drawer"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '420px',
          maxWidth: '90vw',
          backgroundColor: 'var(--bg-surface)',
          borderLeft: '1.5px solid var(--border-strong)',
          boxShadow: '-8px 0 32px rgba(18, 19, 21, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          animation: 'drawer-slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1.5px solid var(--border-strong)',
            backgroundColor: 'var(--bg-card)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                backgroundColor: 'var(--bg-surface)',
                border: '1.5px solid var(--border-strong)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <MachineAssetIcon type={machine.type} size={46} highlight />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '18px',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    color: 'var(--text-primary)',
                  }}
                >
                  {machine.id}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    padding: '2px 6px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '3px',
                    color: 'var(--text-muted)',
                  }}
                >
                  {machine.code}
                </span>
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                }}
              >
                {machine.name}
              </div>

              {/* Status Badge */}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  padding: '2px 8px',
                  borderRadius: '3px',
                  backgroundColor: badge.bg,
                  color: badge.color,
                  border: `1px solid ${badge.border}`,
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: badge.color,
                  }}
                />
                {badge.label}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="tech-btn"
            style={{
              padding: '6px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            title="Close Inspector (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Stage & Operational Description */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: '6px',
              padding: '12px 14px',
            }}
          >
            <div
              style={{
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.05em',
                marginBottom: '4px',
                textTransform: 'uppercase',
              }}
            >
              Operational Stage
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '6px',
              }}
            >
              {machine.stage}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                lineHeight: 1.4,
              }}
            >
              {machine.statusMessage}
            </div>
          </div>

          {/* Key Telemetry Metrics Grid */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '10px',
                fontFamily: 'var(--font-display)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: 'var(--text-primary)',
              }}
            >
              <Activity size={14} color="var(--accent-amber)" />
              <span>LIVE TELEMETRY & SENSORS</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
              }}
            >
              {/* OEE Metric */}
              <div className="telemetry-box">
                <div className="telemetry-box-label">
                  <Gauge size={12} />
                  <span>OEE EFFICIENCY</span>
                </div>
                <div className="telemetry-box-val" style={{ color: machine.telemetry.oee >= 90 ? '#16A34A' : '#D97706' }}>
                  {machine.telemetry.oee}%
                </div>
              </div>

              {/* Temperature Metric */}
              <div className="telemetry-box">
                <div className="telemetry-box-label">
                  <Thermometer size={12} />
                  <span>TEMPERATURE</span>
                </div>
                <div className="telemetry-box-val">
                  {machine.telemetry.temperature}°C
                </div>
              </div>

              {/* Vibration Metric */}
              <div className="telemetry-box">
                <div className="telemetry-box-label">
                  <Activity size={12} />
                  <span>VIBRATION RMS</span>
                </div>
                <div
                  className="telemetry-box-val"
                  style={{ color: machine.telemetry.vibration > 0.8 ? '#DC2626' : 'var(--text-primary)' }}
                >
                  {machine.telemetry.vibration} mm/s
                </div>
              </div>

              {/* Power Metric */}
              <div className="telemetry-box">
                <div className="telemetry-box-label">
                  <Zap size={12} />
                  <span>POWER LOAD</span>
                </div>
                <div className="telemetry-box-val">
                  {machine.telemetry.powerConsumptionKw} kW
                </div>
              </div>

              {/* Cycle Time */}
              <div className="telemetry-box">
                <div className="telemetry-box-label">
                  <Clock size={12} />
                  <span>CYCLE TIME</span>
                </div>
                <div className="telemetry-box-val">
                  {machine.telemetry.cycleTimeSec} s
                </div>
              </div>

              {/* Health Score */}
              <div className="telemetry-box">
                <div className="telemetry-box-label">
                  <ShieldCheck size={12} />
                  <span>HEALTH SCORE</span>
                </div>
                <div className="telemetry-box-val" style={{ color: '#16A34A' }}>
                  {machine.telemetry.healthScore} / 100
                </div>
              </div>
            </div>
          </div>

          {/* Active Job Details (if available) */}
          {machine.activeJob && (
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1.5px solid var(--border-strong)',
                borderRadius: '6px',
                padding: '14px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'var(--font-display)',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}
                >
                  <Layers size={13} />
                  <span>ACTIVE PRODUCTION BATCH</span>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: 'var(--accent-blue)',
                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                    padding: '2px 6px',
                    borderRadius: '3px',
                  }}
                >
                  {machine.activeJob.lotId}
                </span>
              </div>

              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>PRODUCT SPEC</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{machine.activeJob.productType}</div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '8px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>Progress ({machine.activeJob.completedUnits} / {machine.activeJob.batchSize} units)</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{machine.activeJob.progressPercentage}%</span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: 'var(--bg-muted)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-light)',
                  }}
                >
                  <div
                    style={{
                      width: `${machine.activeJob.progressPercentage}%`,
                      height: '100%',
                      backgroundColor: 'var(--border-strong)',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>Started: {machine.activeJob.startedAt}</span>
                <span>ETA: {machine.activeJob.estimatedCompletion}</span>
              </div>
            </div>
          )}

          {/* Maintenance Lifecycle */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: '6px',
              padding: '14px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '10px',
                fontFamily: 'var(--font-display)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              <Wrench size={13} />
              <span>MAINTENANCE LIFECYCLE</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px' }}>LAST SERVICE</span>
                <strong style={{ color: 'var(--text-primary)' }}>{machine.maintenance.lastServiced}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px' }}>NEXT SERVICE DUE</span>
                <strong style={{ color: machine.maintenance.nextServiceDue.includes('OVERDUE') ? '#DC2626' : 'var(--text-primary)' }}>
                  {machine.maintenance.nextServiceDue}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px' }}>OPERATING HOURS</span>
                <strong style={{ color: 'var(--text-primary)' }}>{machine.maintenance.operatingHours} hrs</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px' }}>ESTIMATED MTBF</span>
                <strong style={{ color: 'var(--text-primary)' }}>{machine.maintenance.mtbfHours} hrs</strong>
              </div>
            </div>
          </div>

          {/* Diagnostic Log Result */}
          {diagnosticResult && (
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '6px',
                backgroundColor: machine.status === 'warning' ? 'rgba(217, 119, 6, 0.1)' : 'rgba(22, 163, 74, 0.1)',
                border: `1.5px solid ${machine.status === 'warning' ? '#D97706' : '#16A34A'}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: machine.status === 'warning' ? '#92400E' : '#14532D',
              }}
            >
              {machine.status === 'warning' ? (
                <AlertTriangle size={15} style={{ flexShrink: 0 }} />
              ) : (
                <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
              )}
              <div>{diagnosticResult}</div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1.5px solid var(--border-strong)',
            backgroundColor: 'var(--bg-card)',
            display: 'flex',
            gap: '10px',
          }}
        >
          <button
            onClick={() => onFocusMachine(machine)}
            className="tech-btn"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Crosshair size={14} />
            <span>FOCUS CANVAS</span>
          </button>

          <button
            onClick={handleRunDiagnostics}
            disabled={diagnosticRunning}
            className="tech-btn primary"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Activity size={14} className={diagnosticRunning ? 'spin-anim' : ''} />
            <span>{diagnosticRunning ? 'SCANNING...' : 'DIAGNOSTICS'}</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
