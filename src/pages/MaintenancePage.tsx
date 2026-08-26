import React, { useState } from 'react';
import { useFactory } from '../context/FactoryContext';
import { MaintenanceTask, ProgressStep, CommunicationChannelType } from '../types/factory';
import {
  Calendar,
  CheckCircle2,
  History,
  ShieldCheck,
  Mail,
  MessageSquare,
  Globe,
  FileText,
  CheckCheck,
  Loader,
  Send,
  X,
  Printer,
  Copy,
  Check,
  Cpu,
} from 'lucide-react';

// ─── Formatting Helpers ───────────────────────────────────────────────────────

function fmtTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    });
  } catch {
    return iso;
  }
}

function fmtDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
    });
  } catch {
    return iso;
  }
}

const PRIORITY_COLOR: Record<string, string> = {
  CRITICAL: 'var(--accent-red)',
  HIGH: '#D97706',
  MEDIUM: 'var(--accent-blue)',
  LOW: 'var(--accent-green)',
};

const CHANNEL_CONFIG: Record<CommunicationChannelType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  EMAIL: {
    label: 'Email',
    icon: <Mail size={12} />,
    color: '#2563EB',
    bg: 'rgba(37, 99, 235, 0.08)',
  },
  WHATSAPP: {
    label: 'WhatsApp',
    icon: <MessageSquare size={12} />,
    color: '#16A34A',
    bg: 'rgba(22, 163, 74, 0.08)',
  },
  WEBSITE: {
    label: 'Website',
    icon: <Globe size={12} />,
    color: '#7C3AED',
    bg: 'rgba(124, 58, 237, 0.08)',
  },
};

// ─── Sub-component: Progress Stepper for Active Cards ────────────────────────

const ProgressStepper: React.FC<{ steps: ProgressStep[]; percent: number }> = ({ steps, percent }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
    {/* Bar */}
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: 'var(--text-muted)', marginBottom: '4px' }}>
        <span style={{ fontWeight: 700, letterSpacing: '0.04em' }}>LIVE SERVICE PROGRESS</span>
        <span style={{ fontWeight: 800, color: percent === 100 ? 'var(--accent-green)' : 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>
          {percent}% COMPLETE
        </span>
      </div>
      <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            width: `${percent}%`,
            backgroundColor: percent === 100 ? 'var(--accent-green)' : 'var(--accent-blue)',
            transition: 'width 0.6s ease',
          }}
        />
      </div>
    </div>

    {/* Compact Steps List */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '6px' }}>
      {steps.map((step, i) => {
        const isDone = step.status === 'DONE';
        const isActive = step.status === 'ACTIVE';

        return (
          <div
            key={i}
            style={{
              padding: '6px 8px',
              backgroundColor: isDone ? 'rgba(22, 163, 74, 0.06)' : isActive ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-surface)',
              border: `1px solid ${isDone ? 'var(--accent-green)' : isActive ? 'var(--accent-blue)' : 'var(--border-light)'}`,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '6px',
            }}
          >
            <div style={{ marginTop: '1px', flexShrink: 0 }}>
              {isDone ? (
                <CheckCheck size={11} color="var(--accent-green)" />
              ) : isActive ? (
                <Loader size={11} color="var(--accent-blue)" style={{ animation: 'spin 1.5s linear infinite' }} />
              ) : (
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--border-dashed)', marginTop: '2px' }} />
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: '9.5px',
                fontWeight: isDone ? 700 : isActive ? 800 : 500,
                color: isDone ? 'var(--accent-green)' : isActive ? 'var(--accent-blue)' : 'var(--text-muted)',
                lineHeight: 1.3,
              }}>
                {i + 1}. {step.label}
              </div>
              {isDone && step.completedAt && (
                <span style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block', marginTop: '1px', fontFamily: 'var(--font-mono)' }}>
                  {fmtTime(step.completedAt)}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>

    <style>{`
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    `}</style>
  </div>
);

// ─── Modal 1: Dispatched Message Viewer Modal ─────────────────────────────────

const MessageModal: React.FC<{
  task: MaintenanceTask;
  onClose: () => void;
}> = ({ task, onClose }) => {
  const [copied, setCopied] = useState(false);
  const notif = task.notificationLog[0];
  const channelType = task.communicationChannel?.type || 'EMAIL';
  const cfg = CHANNEL_CONFIG[channelType] || CHANNEL_CONFIG.EMAIL;

  const handleCopy = () => {
    if (!notif) return;
    navigator.clipboard.writeText(notif.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(18, 19, 21, 0.75)',
        backdropFilter: 'blur(3px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--bg-card)',
          border: '1.5px solid var(--border-strong)',
          boxShadow: '6px 6px 0px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          overflow: 'hidden',
          animation: 'fadeInModal 0.15s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'var(--bg-dark)',
            color: 'var(--text-inverted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1.5px solid var(--border-strong)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={14} color="#60A5FA" />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em' }}>
              AUTO-DISPATCHED MESSAGE LOG
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-inverted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Sub-Header */}
        <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  backgroundColor: cfg.bg,
                  border: `1px solid ${cfg.color}`,
                  color: cfg.color,
                  fontSize: '10px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}
              >
                {cfg.icon}
                {cfg.label} Channel
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700 }}>
                {task.machineId} // {task.id}
              </span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--accent-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <CheckCheck size={13} />
              DELIVERED &amp; SAVED
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '85px 1fr', gap: '4px', fontSize: '11px' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Destination:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: cfg.color }}>{task.communicationChannel?.label || notif?.recipient}</span>

            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Dispatched:</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{notif ? fmtDateTime(notif.sentAt) : 'Just now'}</span>

            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Subject:</span>
            <span style={{ fontWeight: 600 }}>{notif?.subject || 'Urgent Maintenance Work Order'}</span>
          </div>
        </div>

        {/* Message Body Content */}
        <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
          {channelType === 'WHATSAPP' ? (
            /* WhatsApp Chat Bubble style */
            <div
              style={{
                backgroundColor: '#E7FCE8',
                border: '1px solid #86EFAC',
                borderRadius: '6px',
                padding: '12px',
                color: '#14532D',
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                lineHeight: 1.6,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                whiteSpace: 'pre-line',
              }}
            >
              {notif?.body}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '3px', marginTop: '8px', fontSize: '10px', color: '#15803D' }}>
                <span>{notif ? fmtTime(notif.sentAt) : ''}</span>
                <CheckCheck size={13} />
              </div>
            </div>
          ) : channelType === 'WEBSITE' ? (
            /* API / Webhook Payload style */
            <div
              style={{
                backgroundColor: '#1E1E24',
                color: '#A5F3FC',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                padding: '12px',
                borderRadius: '4px',
                lineHeight: 1.5,
                whiteSpace: 'pre',
                overflowX: 'auto',
              }}
            >
              {notif?.body}
            </div>
          ) : (
            /* Email format style */
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                padding: '14px',
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                lineHeight: 1.6,
                color: 'var(--text-primary)',
                whiteSpace: 'pre-line',
              }}
            >
              {notif?.body}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '10px 16px',
            backgroundColor: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            Single record saved in designated channel archive.
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleCopy}
              className="tech-btn"
              style={{ padding: '4px 10px', fontSize: '11px' }}
            >
              {copied ? <Check size={12} color="var(--accent-green)" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy Message'}</span>
            </button>
            <button
              onClick={onClose}
              className="tech-btn primary"
              style={{ padding: '4px 12px', fontSize: '11px' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Modal 2: Diagnosis Report PDF Modal ──────────────────────────────────────

const DiagnosisModal: React.FC<{
  task: MaintenanceTask;
  onClose: () => void;
}> = ({ task, onClose }) => {
  const report = task.diagnosisReport;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(18, 19, 21, 0.8)',
        backdropFilter: 'blur(3px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '720px',
          backgroundColor: '#FFFFFF',
          border: '2px solid var(--border-strong)',
          boxShadow: '8px 8px 0px rgba(0,0,0,0.35)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          overflow: 'hidden',
          animation: 'fadeInModal 0.15s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* PDF Top Bar */}
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'var(--bg-dark)',
            color: 'var(--text-inverted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1.5px solid var(--border-strong)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={15} color="#FBBF24" />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em' }}>
              DIAGNOSIS REPORT PDF // {task.machineId}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => window.print()}
              title="Print Document"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-inverted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
              }}
            >
              <Printer size={13} />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-inverted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* PDF Document Container */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, backgroundColor: '#FAFAFA', color: '#111827', fontFamily: 'var(--font-sans)' }}>
          {/* Document Header */}
          <div style={{ borderBottom: '2px solid #111827', paddingBottom: '14px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={20} color="#111827" />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 900, letterSpacing: '0.04em' }}>
                  VECTOR.AI TELEMETRY &amp; DIAGNOSTIC REPORT
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#4B5563', marginTop: '2px' }}>
                Autonomous Predictive Reliability Engine // ISO-13374 Condition Monitoring
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#4B5563' }}>
              <div><strong>DOC ID:</strong> DIAG-{task.id}</div>
              <div><strong>DATE:</strong> {fmtDateTime(report.generatedAt)}</div>
              <div><strong>STATUS:</strong> <span style={{ color: PRIORITY_COLOR[task.priority], fontWeight: 800 }}>{task.priority}</span></div>
            </div>
          </div>

          {/* Machine Info Header Block */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', padding: '10px 14px', marginBottom: '16px', fontSize: '11px' }}>
            <div>
              <span style={{ color: '#6B7280', fontSize: '10px', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Machine ID</span>
              <strong>{task.machineId}</strong>
            </div>
            <div>
              <span style={{ color: '#6B7280', fontSize: '10px', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Machine Name</span>
              <strong>{task.machineName}</strong>
            </div>
            <div>
              <span style={{ color: '#6B7280', fontSize: '10px', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Assigned Tech</span>
              <strong>{task.technician}</strong>
            </div>
            <div>
              <span style={{ color: '#6B7280', fontSize: '10px', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Channel</span>
              <strong style={{ color: CHANNEL_CONFIG[task.communicationChannel?.type || 'EMAIL'].color }}>{task.communicationChannel?.label}</strong>
            </div>
          </div>

          {/* Section 1: Fault Summary */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '6px' }}>
              1. EXECUTIVE FAULT SUMMARY
            </div>
            <div style={{ backgroundColor: 'rgba(220, 38, 38, 0.05)', border: '1px solid rgba(220, 38, 38, 0.3)', padding: '10px 12px', fontSize: '11.5px', color: '#1F2937', lineHeight: 1.5 }}>
              {report.faultSummary}
            </div>
          </div>

          {/* Section 2: Root Cause Analysis */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '6px' }}>
              2. ROOT CAUSE ANALYSIS &amp; DEGRADATION MECHANISM
            </div>
            <div style={{ backgroundColor: 'rgba(217, 119, 6, 0.06)', border: '1px solid rgba(217, 119, 6, 0.3)', padding: '10px 12px', fontSize: '11.5px', color: '#1F2937', lineHeight: 1.5 }}>
              {report.estimatedRootCause}
            </div>
          </div>

          {/* Section 3: Sensor Matrix Table */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '6px' }}>
              3. SENSOR TELEMETRY AT DISPATCH TRIGGER
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', border: '1px solid #E5E7EB' }}>
              <thead>
                <tr style={{ backgroundColor: '#111827', color: '#FFFFFF' }}>
                  <th style={{ textAlign: 'left', padding: '6px 10px' }}>Sensor Channel</th>
                  <th style={{ textAlign: 'left', padding: '6px 10px' }}>Captured Value</th>
                  <th style={{ textAlign: 'left', padding: '6px 10px' }}>Threshold Status</th>
                </tr>
              </thead>
              <tbody>
                {report.sensorReadings.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F9FAFB' }}>
                    <td style={{ padding: '6px 10px', fontWeight: 600 }}>{r.sensor}</td>
                    <td style={{ padding: '6px 10px', fontFamily: 'var(--font-mono)' }}>{r.value}</td>
                    <td style={{ padding: '6px 10px' }}>
                      <span
                        style={{
                          fontSize: '9.5px',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '2px',
                          backgroundColor: r.status === 'CRITICAL' ? 'rgba(220,38,38,0.12)' : r.status === 'WARNING' ? 'rgba(217,119,6,0.12)' : 'rgba(22,163,74,0.12)',
                          color: r.status === 'CRITICAL' ? '#DC2626' : r.status === 'WARNING' ? '#D97706' : '#16A34A',
                        }}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 4: Recommended Action Protocols */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '6px' }}>
              4. REQUIRED REPAIR ACTIONS &amp; CONSUMABLES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {report.recommendedActions.map((act, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11.5px', color: '#374151' }}>
                  <span style={{ fontWeight: 800, color: '#2563EB', minWidth: '16px' }}>{i + 1}.</span>
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signature Block */}
          <div style={{ marginTop: '24px', borderTop: '1px solid #D1D5DB', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6B7280' }}>
            <div>
              Generated automatically by <strong>Vector.AI Autonomous Dispatch Agent</strong>
            </div>
            <div>
              Technician Sign-off: _____________________
            </div>
          </div>
        </div>

        {/* PDF Modal Footer */}
        <div
          style={{
            padding: '10px 16px',
            backgroundColor: '#F3F4F6',
            borderTop: '1.5px solid var(--border-strong)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            Official Vector.AI Condition-Based Maintenance Record
          </span>
          <button
            onClick={onClose}
            className="tech-btn primary"
            style={{ padding: '5px 14px', fontSize: '11px' }}
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Sub-component: Dispatch Card for Left Panel ─────────────────────────────

const DispatchCard: React.FC<{
  task: MaintenanceTask;
  onComplete: () => void;
  onDelete: () => void;
  windowInfo: { label: string; color: string; desc: string; urgency: number };
  rul: number;
}> = ({ task, onComplete, onDelete, windowInfo, rul }) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);

  const channelType = task.communicationChannel?.type || 'EMAIL';
  const cfg = CHANNEL_CONFIG[channelType] || CHANNEL_CONFIG.EMAIL;

  return (
    <>
      <div
        style={{
          border: '1.5px solid var(--border-strong)',
          backgroundColor: 'var(--bg-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
          boxShadow: '2px 2px 0px rgba(0,0,0,0.05)',
          borderLeft: `4px solid ${windowInfo.color}`,
        }}
      >
        {/* Top Header */}
        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px' }}>
              {task.machineId} // {task.machineName}
            </span>
            <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginLeft: '10px' }}>
              Work Order: <strong>{task.id}</strong>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '9.5px', fontWeight: 700, padding: '2px 7px',
                border: `1px solid ${windowInfo.color}`, color: windowInfo.color,
              }}
            >
              {windowInfo.label}
            </span>
            <span
              style={{
                fontSize: '9px', fontWeight: 700, padding: '2px 6px',
                backgroundColor: PRIORITY_COLOR[task.priority],
                color: '#fff',
              }}
            >
              {task.priority}
            </span>
          </div>
        </div>

        {/* RUL Timeline Bar */}
        <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '3px' }}>
            <span>Safe Buffer (&gt;72h)</span>
            <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>Optimal (24h–72h)</span>
            <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>Danger (&lt;24h)</span>
          </div>
          <div style={{ height: '7px', backgroundColor: 'var(--bg-muted)', position: 'relative', display: 'flex' }}>
            <div style={{ width: '10%', height: '100%', borderRight: '1px dashed #fff', backgroundColor: 'rgba(220,38,38,0.25)' }} />
            <div style={{ width: '25%', height: '100%', borderRight: '1px dashed #fff', backgroundColor: 'rgba(22,163,74,0.25)' }} />
            <div style={{ flex: 1, height: '100%' }} />
            <div
              style={{
                position: 'absolute', top: '-3px',
                left: `${Math.min(98, Math.max(2, (1 - rul / 400) * 100))}%`,
                width: '13px', height: '13px', borderRadius: '50%',
                backgroundColor: 'var(--bg-dark)',
                border: `2px solid ${windowInfo.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10,
              }}
            >
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: windowInfo.color }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-secondary)', marginTop: '3px' }}>
            <span>Failure Point</span>
            <span style={{ color: windowInfo.color, fontWeight: 700 }}>Machine at {rul}h RUL</span>
            <span>Calibrated Baseline</span>
          </div>
        </div>

        {/* 4 Metadata Fields: Parts Required, Assigned Tech, Est. Duration, Communication Channel */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr 0.9fr 1.3fr',
            gap: '10px',
            padding: '10px 14px',
            fontSize: '11px',
            borderBottom: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-card)',
          }}
        >
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Parts Required:</span><br />
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
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Communication Channel:</span><br />
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 700,
                color: cfg.color,
                wordBreak: 'break-all',
              }}
            >
              {cfg.icon}
              {task.communicationChannel?.label || 'Email'}
            </span>
          </div>
        </div>

        {/* Interactive Click Triggers for Dispatched Message & Diagnosis Report */}
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {/* Click to view dispatched message */}
            <button
              onClick={() => setShowMessageModal(true)}
              className="tech-btn"
              style={{
                padding: '6px 12px',
                fontSize: '11px',
                borderColor: cfg.color,
                color: cfg.color,
                backgroundColor: cfg.bg,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: 700,
              }}
            >
              {cfg.icon}
              <span>View Dispatched Message</span>
              <span
                style={{
                  fontSize: '8.5px',
                  backgroundColor: cfg.color,
                  color: '#fff',
                  padding: '1px 5px',
                  borderRadius: '2px',
                  fontWeight: 800,
                }}
              >
                LOGGED
              </span>
            </button>

            {/* Click to view diagnosis report */}
            <button
              onClick={() => setShowDiagnosisModal(true)}
              className="tech-btn"
              style={{
                padding: '6px 12px',
                fontSize: '11px',
                borderColor: '#D97706',
                color: '#B45309',
                backgroundColor: 'rgba(217, 119, 6, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: 700,
              }}
            >
              <FileText size={12} color="#D97706" />
              <span>View Diagnosis Report (PDF)</span>
            </button>
          </div>

          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            Auto-dispatched upon anomaly detection
          </span>
        </div>

        {/* In-Progress Stepper on Every Active Card */}
        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-card)' }}>
          <ProgressStepper steps={task.progressSteps} percent={task.progressPercent} />
        </div>

        {/* Action Row */}
        <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{windowInfo.desc}</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onComplete}
              className="tech-btn"
              style={{
                padding: '5px 12px',
                fontSize: '11px',
                borderColor: 'var(--accent-green)',
                color: 'var(--accent-green)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: 700,
              }}
            >
              <CheckCircle2 size={13} />
              <span>Sign-off (Complete)</span>
            </button>
            <button
              onClick={onDelete}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showMessageModal && (
        <MessageModal task={task} onClose={() => setShowMessageModal(false)} />
      )}
      {showDiagnosisModal && (
        <DiagnosisModal task={task} onClose={() => setShowDiagnosisModal(false)} />
      )}
    </>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export const MaintenancePage: React.FC = () => {
  const {
    machines,
    maintenanceQueue,
    completeMaintenanceTask,
    deleteMaintenanceTask,
  } = useFactory();

  const activeTasks = maintenanceQueue.filter((t) => t.status !== 'COMPLETED');
  const completedTasks = maintenanceQueue.filter((t) => t.status === 'COMPLETED');

  // KPI Calculations
  const activeCount = activeTasks.length;
  const completedCount = completedTasks.length;
  const savedDowntime = completedCount * 18 + activeTasks.filter(t => t.priority === 'CRITICAL').length * 4;
  const efficiency = completedCount + activeCount > 0
    ? Math.round((completedCount / (completedCount + activeTasks.filter(t => t.priority === 'CRITICAL').length)) * 100) || 100
    : 100;

  const getTaskMaintenanceWindowStatus = (task: MaintenanceTask) => {
    const machine = machines.find((m) => m.id === task.machineId);
    if (!machine) return { label: 'UNKNOWN', color: 'var(--text-muted)', desc: 'Sensor status unavailable', urgency: 0 };
    const rul = machine.currentRul;
    if (rul <= 24) return { label: 'CRITICAL / OVERDUE', color: 'var(--accent-red)', desc: 'High breakdown risk. Failure imminent!', urgency: 3 };
    if (rul <= 72) return { label: 'OPTIMAL WINDOW', color: 'var(--accent-green)', desc: 'Optimal trade-off: max wear utilization without risk.', urgency: 2 };
    return { label: 'PREVENTIVE (SUFFICIENT RUL)', color: 'var(--accent-blue)', desc: 'Early schedule. Lifespan remaining.', urgency: 1 };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="tech-card" style={{ padding: '16px 20px', backgroundColor: 'var(--bg-surface)' }}>
        <div className="corner-tl">+</div><div className="corner-tr">+</div>
        <div className="corner-bl">+</div><div className="corner-br">+</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, letterSpacing: '0.04em' }}>
          AUTOMATED PREDICTIVE MAINTENANCE SYSTEM
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>
          Autonomous Dispatch System: Upon threshold violation or anomaly detection, Vector.AI instantly dispatches messages to the assigned technician’s saved communication channel (Email, WhatsApp, or Web Portal) with an accompanying Diagnostic Report.
        </p>
      </div>

      {/* ── KPIs ─────────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="tech-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Active In-Progress Orders</span>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginTop: '4px' }}>
            {activeCount} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>active machines</span>
          </div>
        </div>
        <div className="tech-card" style={{ padding: '16px', borderLeft: '3px solid var(--accent-green)' }}>
          <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--accent-green)', display: 'block', textTransform: 'uppercase' }}>Prevented Downtime</span>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginTop: '4px', color: 'var(--accent-green)' }}>
            {savedDowntime} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>hours saved</span>
          </div>
        </div>
        <div className="tech-card" style={{ padding: '16px', borderLeft: '3px solid var(--accent-blue)' }}>
          <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--accent-blue)', display: 'block', textTransform: 'uppercase' }}>Scheduling Precision</span>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginTop: '4px', color: 'var(--accent-blue)' }}>
            {efficiency}% <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>on-time actions</span>
          </div>
        </div>
        <div className="tech-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Pre-Allocated Spares</span>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginTop: '4px' }}>
            {Math.round(85 + completedCount * 1.2)}% <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>kit availability</span>
          </div>
        </div>
      </div>

      {/* ── Main Grid ────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px' }}>

        {/* LEFT: AUTO-DISPATCH CONSOLE — PREDICTIVE TIMELINE & OPTIMAL WINDOW BOARD */}
        <div className="tech-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="corner-tl">+</div><div className="corner-tr">+</div>
          <div className="corner-bl">+</div><div className="corner-br">+</div>
          <div className="tech-card-header">
            <span className="tech-card-title">
              <Calendar size={14} />
              AUTO-DISPATCH CONSOLE — PREDICTIVE TIMELINE &amp; OPTIMAL WINDOW BOARD
            </span>
            <span className="status-pill">ALL ACTIVE IN-PROGRESS</span>
          </div>

          <div className="tech-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeTasks.length === 0 ? (
              <div style={{
                padding: '40px', border: '1.5px dashed var(--border-light)',
                textAlign: 'center', color: 'var(--text-secondary)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
              }}>
                <ShieldCheck size={32} style={{ color: 'var(--accent-green)' }} />
                <strong>Telemetry Stable Across All Nodes</strong>
                <span style={{ fontSize: '11px' }}>No active maintenance required. All machine RUL thresholds exceed 250h safety margins.</span>
              </div>
            ) : (
              [...activeTasks]
                .sort((a, b) => getTaskMaintenanceWindowStatus(b).urgency - getTaskMaintenanceWindowStatus(a).urgency)
                .map((task) => {
                  const windowInfo = getTaskMaintenanceWindowStatus(task);
                  const machine = machines.find((m) => m.id === task.machineId);
                  const rul = machine?.currentRul || 0;

                  return (
                    <DispatchCard
                      key={task.id}
                      task={task}
                      windowInfo={windowInfo}
                      rul={rul}
                      onComplete={() => completeMaintenanceTask(task.id)}
                      onDelete={() => deleteMaintenanceTask(task.id)}
                    />
                  );
                })
            )}
          </div>
        </div>

        {/* RIGHT: SERVICE HISTORY ARCHIVE (Completed Shift & Maintenance Archive) */}
        <div className="tech-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="corner-tl">+</div><div className="corner-tr">+</div>
          <div className="corner-bl">+</div><div className="corner-br">+</div>

          <div className="tech-card-header">
            <span className="tech-card-title">
              <History size={14} />
              SERVICE HISTORY ARCHIVE
            </span>
            <span style={{
              fontSize: '9.5px',
              fontWeight: 700,
              color: 'var(--accent-green)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <CheckCheck size={12} />
              {completedTasks.length} RESOLVED
            </span>
          </div>

          <div
            className="tech-card-body"
            style={{
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxHeight: '620px',
              overflowY: 'auto',
            }}
          >
            {completedTasks.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '11px', textAlign: 'center', padding: '28px' }}>
                No maintenance tasks completed in this shift yet.
              </div>
            ) : (
              completedTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    border: '1px solid var(--border-light)',
                    borderLeft: '3px solid var(--accent-green)',
                    backgroundColor: 'var(--bg-surface)',
                    padding: '12px',
                    fontSize: '11px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontFamily: 'var(--font-display)', fontSize: '12px' }}>
                      {task.machineId} // {task.machineName}
                    </strong>
                    <span style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '9px', border: '1px solid var(--accent-green)', padding: '1px 5px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <CheckCheck size={9} />
                      RESOLVED
                    </span>
                  </div>

                  <div className="ruler-divider" style={{ opacity: 0.3, margin: '2px 0' }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '10.5px' }}>
                    <div><span style={{ color: 'var(--text-muted)' }}>Technician:</span> <strong>{task.technician}</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Parts Replaced:</span> {task.partsRequired.join(', ')}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Channel Dispatched:</span> <span style={{ color: CHANNEL_CONFIG[task.communicationChannel?.type || 'EMAIL'].color, fontWeight: 700 }}>{task.communicationChannel?.label}</span></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Ticket ID:</span> <span style={{ opacity: 0.8, fontFamily: 'var(--font-mono)' }}>{task.id}</span></div>
                  </div>

                  {/* Step resolution pill list */}
                  <div style={{ marginTop: '4px', borderTop: '1px dashed var(--border-light)', paddingTop: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9.5px', color: 'var(--accent-green)', fontWeight: 700 }}>
                      <CheckCheck size={11} />
                      <span>All 7 service stages verified &amp; signed off</span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '5px' }}>
                      {task.progressSteps?.map((step, i) => (
                        <span
                          key={i}
                          title={step.label}
                          style={{
                            fontSize: '8px',
                            padding: '1px 4px',
                            backgroundColor: 'rgba(22, 163, 74, 0.08)',
                            border: '1px solid rgba(22, 163, 74, 0.25)',
                            color: 'var(--accent-green)',
                            fontWeight: 600,
                          }}
                        >
                          ✓ Step {i + 1}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInModal {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default MaintenancePage;
