import React, { useState } from 'react';
import { useFactory } from '../context/FactoryContext';
import { MaintenanceTask, ProgressStep, CommunicationChannelType, SensorReading } from '../types/factory';
import {
  Calendar,
  CalendarDays,
  CheckCircle2,
  History,
  ShieldCheck,
  Mail,
  MessageSquare,
  Globe,
  FileText,
  CheckCheck,
  Loader,
  X,
  Printer,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Bell,
  Clock,
  Wrench,
  Bot,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
  AlertOctagon,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { runAutoMaintenanceAgent, AgentScenario } from '../features/maintenance/autoMaintenanceAgent';
import { diagnoseFromManual, diagnoseFromRag, AnomalyRecord } from '../features/machines/intelligence';
import rawMachinesData from '../data/machines.json';

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

const ProgressStepper: React.FC<{ steps?: ProgressStep[]; percent?: number }> = ({ steps = [], percent = 0 }) => (
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

    {/* Steps List */}
    {steps.length > 0 && (
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
    )}
  </div>
);

// ─── Modal 1: Dispatched Message Viewer Modal ─────────────────────────────────

const MessageModal: React.FC<{
  task: MaintenanceTask;
  onClose: () => void;
}> = ({ task, onClose }) => {
  const [copied, setCopied] = useState(false);
  const notif = task.notificationLog?.[0];
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
        {/* Header */}
        <div
          style={{
            padding: '14px 18px',
            backgroundColor: 'var(--bg-dark)',
            color: 'var(--text-inverted)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: cfg.color }}>{cfg.icon}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', letterSpacing: '0.04em' }}>
              DISPATCHED {channelType} NOTIFICATION
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.8 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '18px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '11px', backgroundColor: 'var(--bg-surface)', padding: '10px 12px', border: '1px solid var(--border-light)' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Recipient Tech:</span><br />
              <strong>{task.technician}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Channel Address:</span><br />
              <strong style={{ color: cfg.color }}>{task.communicationChannel?.address || 'technician@vectorai.internal'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Work Order ID:</span><br />
              <span style={{ fontFamily: 'var(--font-mono)' }}>{task.id}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Dispatched At:</span><br />
              <span>{fmtDateTime(notif?.sentAt || new Date().toISOString())}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Subject Line
            </div>
            <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-light)', fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700 }}>
              {notif?.subject || `[URGENT] Maintenance Work Order for ${task.machineId}`}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Message Payload Body
            </div>
            <pre
              style={{
                margin: 0,
                padding: '12px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                color: 'var(--text-primary)',
                maxHeight: '220px',
                overflowY: 'auto',
              }}
            >
              {notif?.body || task.diagnosisReport?.faultSummary || 'Maintenance Notification'}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            onClick={handleCopy}
            className="tech-btn"
            style={{ padding: '6px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {copied ? <Check size={12} color="var(--accent-green)" /> : <Copy size={12} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Body'}</span>
          </button>
          <button
            onClick={onClose}
            className="tech-btn primary"
            style={{ padding: '6px 16px', fontSize: '11px' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Modal 2: Diagnosis Report Modal ──────────────────────────────────────────

const DiagnosisModal: React.FC<{
  task: MaintenanceTask;
  onClose: () => void;
}> = ({ task, onClose }) => {
  const report = task.diagnosisReport;

  const handlePrint = () => {
    window.print();
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
          maxWidth: '680px',
          backgroundColor: '#FFFFFF',
          color: '#111827',
          border: '2px solid #111827',
          boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          overflow: 'hidden',
          fontFamily: 'Inter, system-ui, sans-serif',
          animation: 'fadeInModal 0.15s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Printable Header */}
        <div
          style={{
            padding: '16px 22px',
            backgroundColor: '#111827',
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9CA3AF', fontWeight: 800 }}>
              VECTOR.AI CONDITION-BASED MONITORING // DIAGNOSTIC BRIEF
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, marginTop: '2px', letterSpacing: '-0.01em' }}>
              REP-{task.id}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={handlePrint}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #4B5563',
                color: '#E5E7EB',
                padding: '5px 10px',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: 600,
              }}
            >
              <Printer size={12} />
              <span>Print PDF</span>
            </button>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.8 }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#FAFAFA' }}>
          {/* Metadata Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', backgroundColor: '#FFFFFF', padding: '12px', border: '1px solid #E5E7EB', fontSize: '11px' }}>
            <div>
              <span style={{ color: '#6B7280', fontSize: '10px', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Target Node</span>
              <strong style={{ fontSize: '12px' }}>{task.machineId}</strong>
            </div>
            <div>
              <span style={{ color: '#6B7280', fontSize: '10px', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Priority Level</span>
              <strong style={{ color: PRIORITY_COLOR[task.priority] }}>{task.priority}</strong>
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
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '6px' }}>
              1. EXECUTIVE FAULT SUMMARY
            </div>
            <div style={{ backgroundColor: 'rgba(220, 38, 38, 0.05)', border: '1px solid rgba(220, 38, 38, 0.3)', padding: '10px 12px', fontSize: '11.5px', color: '#1F2937', lineHeight: 1.5 }}>
              {report?.faultSummary || task.notificationLog?.[0]?.subject || 'Diagnostic brief'}
            </div>
          </div>

          {/* Section 2: Root Cause Analysis */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '6px' }}>
              2. ROOT CAUSE ANALYSIS &amp; DEGRADATION MECHANISM
            </div>
            <div style={{ backgroundColor: 'rgba(217, 119, 6, 0.06)', border: '1px solid rgba(217, 119, 6, 0.3)', padding: '10px 12px', fontSize: '11.5px', color: '#1F2937', lineHeight: 1.5 }}>
              {report?.estimatedRootCause || `Telemetry signature reflects localized fatigue on ${task.machineName} wear components.`}
            </div>
          </div>

          {/* Section 3: Sensor Matrix Table */}
          {report?.sensorReadings && report.sensorReadings.length > 0 && (
            <div>
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
          )}

          {/* Section 4: Recommended Action Protocols */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '6px' }}>
              4. REQUIRED REPAIR ACTIONS &amp; CONSUMABLES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(report?.recommendedActions || ['Inspect mechanical tolerances and reset operational baselines.']).map((act, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11.5px', color: '#374151' }}>
                  <span style={{ fontWeight: 800, color: '#2563EB', minWidth: '16px' }}>{i + 1}.</span>
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '10px', color: '#6B7280' }}>
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

// ─── Modal 3: Machine Scenario Dossier Modal ("What Happened") ───────────────

const MachineScenarioModal: React.FC<{
  machineId: string;
  machineName: string;
  scenario: AgentScenario;
  rul: number;
  healthScore: number;
  location: string;
  stage: string;
  sensors?: SensorReading[];
  onClose: () => void;
}> = ({ machineId, machineName, scenario, rul, healthScore, location, stage, sensors = [], onClose }) => {
  const isCritical = rul <= 48;

  // Find exact raw machine record from machines.json
  const rawMachine = (rawMachinesData as any[]).find(m => m.id === machineId);

  // Collect ALL recommended actions, SOPs, and spare parts across ALL anomalies for this machine
  const allActions: { text: string; source?: string }[] = [];
  const sparesSet = new Set<string>(scenario.requiredParts || []);

  const deduceSparesFromAction = (actionText: string) => {
    const t = actionText.toLowerCase();
    if (t.includes('transducer') || t.includes('138 khz')) {
      sparesSet.add('Piezoelectric Transducer Horn 138kHz');
      sparesSet.add('Ceramic Capillary Tip (Gold Wire)');
    }
    if (t.includes('ejector')) {
      sparesSet.add('4-Pin Ejector Needle Set (0.3mm)');
      sparesSet.add('Wafer Expander Grip Ring');
      sparesSet.add('Alignment Fixture Calibration Jig');
    }
    if (t.includes('pogo pin') || t.includes('theta')) {
      sparesSet.add('High-Frequency Pogo Pin Block (128-pin)');
      sparesSet.add('Linear Guide Cleanroom Grease');
      sparesSet.add('Optical Encoder Cleaner');
    }
    if (t.includes('diamond blade') || t.includes('spindle')) {
      sparesSet.add('Resinoid Diamond Blade 2-inch Hubbed');
      sparesSet.add('Labyrinth Seal Gasket');
      sparesSet.add('High-Purity Spindle Synthetic Lubricant');
    }
    if (t.includes('clamp') || t.includes('anvil') || t.includes('pneumatic')) {
      sparesSet.add('Pneumatic Clamp Cylinder Seal Kit');
      sparesSet.add('Hardened Clamp Anvil Plate');
      sparesSet.add('Tension Gauge');
    }
    if (t.includes('silicone') || t.includes('o-ring') || t.includes('venturi') || t.includes('vacuum') || t.includes('collet')) {
      sparesSet.add('High-Temp Silicone O-Ring Kit');
      sparesSet.add('Silicone Pickup Nozzle 0.8mm');
      sparesSet.add('Vacuum Solenoid Valve ASCO-3');
    }
    if (t.includes('mold') || t.includes('cavity') || t.includes('hydraulic')) {
      sparesSet.add('Mold Cavity Release Agent (High Temp)');
      sparesSet.add('Hydraulic O-Ring Seal Kit');
      sparesSet.add('Filter Cartridge 5-micron');
    }
  };

  if (rawMachine?.anomalies && rawMachine.anomalies.length > 0) {
    rawMachine.anomalies.forEach((ano: any) => {
      const isCrit = ano.severity === 'critical';
      const matchedSensor = rawMachine.sensors?.find((s: any) =>
        s.name?.toLowerCase() === (ano.sensor || '').toLowerCase() ||
        s.sensorId?.toLowerCase() === (ano.sensor || '').toLowerCase() ||
        s.name?.toLowerCase().includes((ano.sensor || '').toLowerCase()) ||
        (ano.sensor || '').toLowerCase().includes((s.name || '').toLowerCase())
      );

      const anomalyRecord: AnomalyRecord = {
        id: ano.id,
        machineId: rawMachine.id,
        sensorId: matchedSensor?.sensorId || ano.sensor || 'sensor',
        sensorName: matchedSensor?.name || ano.sensor || 'Sensor',
        currentValue: matchedSensor?.value || 0,
        unit: matchedSensor?.unit || '',
        thresholdValue: 0,
        thresholdType: isCrit ? 'CRITICAL_HIGH' : 'WARNING_HIGH',
        severity: ano.severity,
        status: ano.status,
        detectedAt: ano.timestamp,
        description: ano.description,
      };

      const manualDiag = diagnoseFromManual(anomalyRecord, (rawMachine.machineType || 'wire_bonder') as any);
      const ragDiag = !manualDiag ? diagnoseFromRag(anomalyRecord, (rawMachine.machineType || 'wire_bonder') as any) : null;
      const diag = manualDiag || ragDiag;

      if (diag?.recommendedActions) {
        diag.recommendedActions.forEach((act: string) => {
          if (act && !allActions.some(a => a.text === act)) {
            allActions.push({ text: act, source: diag.diagnosis });
            deduceSparesFromAction(act);
          }
        });
      }

      if (ano.recommendedAction && !allActions.some(a => a.text === ano.recommendedAction)) {
        allActions.push({ text: ano.recommendedAction, source: ano.type });
        deduceSparesFromAction(ano.recommendedAction);
      }
    });
  }

  // Fallback to base scenario action if none gathered
  if (allActions.length === 0 && scenario.recommendedAction) {
    allActions.push({ text: scenario.recommendedAction });
    deduceSparesFromAction(scenario.recommendedAction);
  }

  const finalSparesList = Array.from(sparesSet);

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
          maxWidth: '780px',
          backgroundColor: 'var(--bg-card)',
          border: `2px solid ${isCritical ? 'var(--accent-red)' : 'var(--border-strong)'}`,
          boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          overflow: 'hidden',
          animation: 'fadeInModal 0.15s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: 'var(--bg-dark)',
            color: 'var(--text-inverted)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-strong)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bot size={20} style={{ color: isCritical ? 'var(--accent-red)' : 'var(--accent-blue)' }} />
            <div>
              <div style={{ fontSize: '9.5px', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                MACHINE FAILURE SCENARIO DOSSIER
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 800, marginTop: '2px' }}>
                {machineId} // {machineName}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.8 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Metadata Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', backgroundColor: 'var(--bg-surface)', padding: '10px 12px', border: '1px solid var(--border-light)', fontSize: '11px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '9.5px', display: 'block', fontWeight: 700 }}>STAGE &amp; LOCATION</span>
              <strong>{stage}</strong><br />
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{location}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '9.5px', display: 'block', fontWeight: 700 }}>HEALTH SCORE</span>
              <strong style={{ fontSize: '14px', color: healthScore < 70 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                {healthScore}/100
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '9.5px', display: 'block', fontWeight: 700 }}>PREDICTED RUL</span>
              <strong style={{ fontSize: '14px', color: isCritical ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                {rul} Hours
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '9.5px', display: 'block', fontWeight: 700 }}>TARGET SPECIALIST</span>
              <strong>{scenario.assignedTechnician}</strong>
            </div>
          </div>

          {/* ── 1. LIVE SENSOR EXCURSIONS & THRESHOLDS ── */}
          {sensors.length > 0 && (
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                LIVE SENSOR EXCURSIONS &amp; THRESHOLDS
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(3, sensors.length)}, 1fr)`, gap: '8px' }}>
                {sensors.map((s) => {
                  const isHigh = s.value >= s.threshold || s.deviation > 50;
                  return (
                    <div
                      key={s.name}
                      style={{
                        padding: '8px 10px',
                        border: `1px solid ${isHigh ? 'var(--accent-red)' : 'var(--border-light)'}`,
                        backgroundColor: 'var(--bg-surface)',
                        fontSize: '11px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                        <span style={{ color: 'var(--text-primary)' }}>{s.label}</span>
                        <span style={{ color: isHigh ? 'var(--accent-red)' : 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
                          {s.value} {s.unit}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
                        <span>Base: {s.baseline}{s.unit}</span>
                        <span>Limit: {s.threshold}{s.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── 2. ACTIVE SENSOR ANOMALIES & AUTOMATIC AI DIAGNOSTICS ── */}
          <div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
              ACTIVE SENSOR ANOMALIES &amp; AUTOMATIC AI DIAGNOSTICS
            </div>

            {rawMachine?.anomalies && rawMachine.anomalies.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {rawMachine.anomalies.map((ano: any) => {
                  const isCrit = ano.severity === 'critical';
                  const sevColor = isCrit ? 'var(--accent-red)' : 'var(--accent-amber)';

                  const matchedSensor = rawMachine.sensors?.find((s: any) =>
                    s.name?.toLowerCase() === (ano.sensor || '').toLowerCase() ||
                    s.sensorId?.toLowerCase() === (ano.sensor || '').toLowerCase() ||
                    s.name?.toLowerCase().includes((ano.sensor || '').toLowerCase()) ||
                    (ano.sensor || '').toLowerCase().includes((s.name || '').toLowerCase())
                  );

                  const anomalyRecord: AnomalyRecord = {
                    id: ano.id,
                    machineId: rawMachine.id,
                    sensorId: matchedSensor?.sensorId || ano.sensor || 'sensor',
                    sensorName: matchedSensor?.name || ano.sensor || 'Sensor',
                    currentValue: matchedSensor?.value || 0,
                    unit: matchedSensor?.unit || '',
                    thresholdValue: 0,
                    thresholdType: isCrit ? 'CRITICAL_HIGH' : 'WARNING_HIGH',
                    severity: ano.severity,
                    status: ano.status,
                    detectedAt: ano.timestamp,
                    description: ano.description,
                  };

                  const manualDiag = diagnoseFromManual(anomalyRecord, (rawMachine.machineType || 'wire_bonder') as any);
                  const ragDiag = !manualDiag ? diagnoseFromRag(anomalyRecord, (rawMachine.machineType || 'wire_bonder') as any) : null;
                  const diagnosis = manualDiag || ragDiag;
                  const isManualSource = diagnosis?.source === 'MANUAL';

                  return (
                    <div
                      key={ano.id}
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        border: `1px solid ${isCrit ? 'var(--accent-red)' : 'var(--border-light)'}`,
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      {/* Top Bar: Anomaly Title & Badges */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {isCrit ? <AlertOctagon size={13} color={sevColor} /> : <AlertTriangle size={13} color={sevColor} />}
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.03em' }}>
                            {ano.type.toUpperCase()}
                          </span>
                          <span
                            style={{
                              fontSize: '8.5px',
                              fontFamily: 'var(--font-mono)',
                              padding: '1px 5px',
                              border: `1px solid ${sevColor}`,
                              color: sevColor,
                              fontWeight: 800,
                            }}
                          >
                            {ano.severity.toUpperCase()}
                          </span>
                        </div>

                        <span style={{ fontSize: '9.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          Detected: {ano.timestamp}
                        </span>
                      </div>

                      {/* Description */}
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                        {ano.description}
                      </div>

                      {/* Sensor Info */}
                      <div style={{ display: 'flex', gap: '12px', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        <span>Sensor: <strong style={{ color: 'var(--text-primary)' }}>{ano.sensor}</strong></span>
                        {matchedSensor && (
                          <span>· Current: <strong style={{ color: sevColor }}>{matchedSensor.value} {matchedSensor.unit}</strong></span>
                        )}
                      </div>

                      {/* AI Diagnostic Reasoning Box */}
                      {diagnosis && (
                        <div
                          style={{
                            marginTop: '4px',
                            padding: '10px 12px',
                            backgroundColor: 'rgba(37, 99, 235, 0.04)',
                            border: '1px solid var(--accent-blue)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <Sparkles size={13} color="var(--accent-blue)" />
                              <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '0.03em' }}>
                                AI DIAGNOSTIC REASONING
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span
                                style={{
                                  fontSize: '8.5px',
                                  fontFamily: 'var(--font-mono)',
                                  padding: '1px 6px',
                                  border: isManualSource ? '1px solid #2563EB' : '1px solid #9333EA',
                                  color: isManualSource ? '#1D4ED8' : '#7E22CE',
                                  backgroundColor: isManualSource ? '#EFF6FF' : '#FAF5FF',
                                  fontWeight: 800,
                                }}
                              >
                                {isManualSource ? 'LAYER 1: MANUAL-FIRST GROUNDING' : 'LAYER 2: SEMANTIC RAG'}
                              </span>
                              <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                                Confidence: <strong style={{ color: 'var(--text-primary)' }}>{diagnosis.confidence.toLowerCase()} ({Math.round(diagnosis.confidenceScore * 100)}%)</strong>
                              </span>
                            </div>
                          </div>

                          {/* Identified Condition */}
                          <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                            Identified condition: {diagnosis.diagnosis.replace(/^Identified condition:\s*/i, '')}
                          </div>

                          {/* Evidence Bullets */}
                          {diagnosis.evidence && diagnosis.evidence.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                              {diagnosis.evidence.map((ev, i) => (
                                <div key={i} style={{ paddingLeft: '6px', lineHeight: 1.4 }}>
                                  • {ev}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Root Cause Tag Pills */}
                          {diagnosis.possibleCauses && diagnosis.possibleCauses.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
                              {diagnosis.possibleCauses.map((cause, i) => (
                                <span
                                  key={i}
                                  style={{
                                    padding: '2px 7px',
                                    backgroundColor: 'var(--bg-card)',
                                    border: '1px solid var(--border-strong)',
                                    fontSize: '9.5px',
                                    fontFamily: 'var(--font-mono)',
                                    color: 'var(--text-secondary)',
                                  }}
                                >
                                  {cause}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-light)', padding: '12px', textAlign: 'center' }}>
                <span style={{ color: 'var(--accent-green)', fontWeight: 800, fontSize: '11px' }}>
                  ALL TELEMETRY STREAMS OPERATING WITHIN SPECIFIED LIMITS
                </span>
                <p style={{ fontSize: '10.5px', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
                  Deterministic threshold engine confirms all continuous edge telemetry values are strictly within normal operating bounds.
                </p>
              </div>
            )}
          </div>

          {/* ── 3. RECOMMENDED RESOLUTION PLAN ── */}
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-light)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11px' }}>
            <div>
              <span style={{ fontWeight: 800, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                RECOMMENDED RESOLUTION PLAN // {scenario.sopReference}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                {allActions.map((act, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                    <span style={{ fontWeight: 800, color: 'var(--accent-blue)', minWidth: '16px', fontFamily: 'var(--font-mono)' }}>
                      {allActions.length > 1 ? `${i + 1}.` : '•'}
                    </span>
                    <span>{act.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px', borderTop: '1px dashed var(--border-light)', paddingTop: '10px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}><Wrench size={11} style={{ display: 'inline' }} /> Required Spares ({finalSparesList.length}):</span><br />
                <strong>{finalSparesList.join(', ')}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}><Clock size={11} style={{ display: 'inline' }} /> Target Window:</span><br />
                <strong>{scenario.recommendedServiceDateStr} (Est: {scenario.estimatedDowntimeHours}h)</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            Vector.AI Diagnostic Reasoning &amp; Manual Correlation Engine
          </span>
          <button
            onClick={onClose}
            className="tech-btn primary"
            style={{ padding: '6px 16px', fontSize: '11px' }}
          >
            Done
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
  scenarioInfo?: AgentScenario;
  onOpenScenarioModal?: () => void;
}> = ({ task, onComplete, onDelete, windowInfo, rul, scenarioInfo, onOpenScenarioModal }) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [showScenarioDetails, setShowScenarioDetails] = useState(false);

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
        {/* Top Header - CLICKABLE MACHINE TITLE */}
        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            onClick={onOpenScenarioModal}
            style={{
              cursor: onOpenScenarioModal ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Click to view full Machine Incident Scenario Dossier"
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '13px',
                color: onOpenScenarioModal ? 'var(--accent-blue)' : 'var(--text-primary)',
                textDecoration: onOpenScenarioModal ? 'underline' : 'none',
              }}
            >
              {task.machineId} // {task.machineName}
            </span>
            {onOpenScenarioModal && (
              <ExternalLink size={12} style={{ color: 'var(--accent-blue)' }} />
            )}
            <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginLeft: '6px' }}>
              Work Order: <strong>{task.id}</strong>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '9px',
                fontWeight: 800,
                padding: '3px 8px',
                backgroundColor: windowInfo.color === 'var(--accent-red)' ? 'var(--accent-red)' : 'var(--bg-surface)',
                border: `1.5px solid ${windowInfo.color}`,
                color: windowInfo.color === 'var(--accent-red)' ? '#FFFFFF' : windowInfo.color,
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {task.priority === 'CRITICAL' || windowInfo.urgency === 3
                ? 'CRITICAL'
                : task.priority === 'HIGH' || windowInfo.urgency === 2
                ? 'OPTIMAL WINDOW'
                : 'PREVENTIVE'}
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
            <div style={{ width: '25%', height: '100%', borderRight: '1px dashed #fff', backgroundColor: 'rgba(220,38,38,0.25)' }} />
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

        {/* 4 Metadata Fields */}
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

        {/* ── Active Sensor Anomalies & Automatic AI Diagnostics (Short Summary) ── */}
        {(() => {
          const rawMachine = (rawMachinesData as any[]).find(m => m.id === task.machineId);
          const activeAnomaly = rawMachine?.anomalies?.[0];

          if (activeAnomaly) {
            const isCrit = activeAnomaly.severity === 'critical';
            const matchedSensor = rawMachine?.sensors?.find((s: any) =>
              s.name?.toLowerCase() === (activeAnomaly.sensor || '').toLowerCase() ||
              s.sensorId?.toLowerCase() === (activeAnomaly.sensor || '').toLowerCase() ||
              s.name?.toLowerCase().includes((activeAnomaly.sensor || '').toLowerCase()) ||
              (activeAnomaly.sensor || '').toLowerCase().includes((s.name || '').toLowerCase())
            );

            const anomalyRecord: AnomalyRecord = {
              id: activeAnomaly.id,
              machineId: rawMachine?.id || task.machineId,
              sensorId: matchedSensor?.sensorId || activeAnomaly.sensor || 'sensor',
              sensorName: matchedSensor?.name || activeAnomaly.sensor || 'Sensor',
              currentValue: matchedSensor?.value || 0,
              unit: matchedSensor?.unit || '',
              thresholdValue: 0,
              thresholdType: isCrit ? 'CRITICAL_HIGH' : 'WARNING_HIGH',
              severity: activeAnomaly.severity,
              status: activeAnomaly.status,
              detectedAt: activeAnomaly.timestamp,
              description: activeAnomaly.description,
            };

            const manualDiag = diagnoseFromManual(anomalyRecord, (rawMachine?.machineType || 'wire_bonder') as any);
            const ragDiag = !manualDiag ? diagnoseFromRag(anomalyRecord, (rawMachine?.machineType || 'wire_bonder') as any) : null;
            const diagSummary = manualDiag || ragDiag;

            return (
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-surface)',
                  borderBottom: '1px solid var(--border-light)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: 800,
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em',
                    }}
                  >
                    <Bot size={12} style={{ color: windowInfo.color }} />
                    ACTIVE SENSOR ANOMALIES &amp; AUTOMATIC AI DIAGNOSTICS
                  </span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={onOpenScenarioModal}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent-blue)',
                        cursor: 'pointer',
                        fontSize: '9.5px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                      title="Open full scenario dossier in popup"
                    >
                      <Info size={11} />
                      <span>Full Dossier</span>
                    </button>

                    <button
                      onClick={() => setShowScenarioDetails(!showScenarioDetails)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '9.5px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <span>{showScenarioDetails ? 'Hide' : 'Quick Details'}</span>
                      {showScenarioDetails ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                    </button>
                  </div>
                </div>

                {/* Anomaly Headline & Description */}
                <div style={{ fontSize: '11px', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <strong style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                      {activeAnomaly.type}
                    </strong>
                    <span
                      style={{
                        fontSize: '8.5px',
                        fontFamily: 'var(--font-mono)',
                        padding: '1px 5px',
                        border: `1px solid ${activeAnomaly.severity === 'critical' ? 'var(--accent-red)' : 'var(--accent-amber)'}`,
                        color: activeAnomaly.severity === 'critical' ? 'var(--accent-red)' : 'var(--accent-amber)',
                        fontWeight: 800,
                      }}
                    >
                      {activeAnomaly.severity.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {activeAnomaly.description}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px' }}>
                    Sensor: <strong style={{ color: 'var(--text-primary)' }}>{activeAnomaly.sensor}</strong>
                  </div>
                </div>

                {/* Short AI Diagnostic Summary Box */}
                {diagSummary && (
                  <div
                    style={{
                      marginTop: '6px',
                      padding: '6px 10px',
                      backgroundColor: 'rgba(37, 99, 235, 0.04)',
                      border: '1px solid var(--accent-blue)',
                      fontSize: '10.5px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--accent-blue)', textTransform: 'uppercase' }}>
                        AI IDENTIFIED CONDITION ({diagSummary.source === 'MANUAL' ? 'LAYER 1: MANUAL-FIRST' : 'LAYER 2: RAG'})
                      </span>
                      <span style={{ fontSize: '8.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {Math.round(diagSummary.confidenceScore * 100)}% Confidence
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {diagSummary.diagnosis.replace(/^Identified condition:\s*/i, '')}
                    </div>
                  </div>
                )}

                {/* Quick Details Collapsible Box */}
                {showScenarioDetails && (
                  <div
                    style={{
                      marginTop: '8px',
                      paddingTop: '8px',
                      borderTop: '1px dashed var(--border-light)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      fontSize: '10.5px',
                      backgroundColor: 'rgba(37, 99, 235, 0.03)',
                      padding: '8px 10px',
                      borderRadius: '2px',
                    }}
                  >
                    {diagSummary?.evidence && diagSummary.evidence.length > 0 && (
                      <div>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Telemetry Evidence: </span>
                        <span style={{ color: 'var(--text-secondary)' }}>{diagSummary.evidence[0]}</span>
                      </div>
                    )}
                    {diagSummary?.possibleCauses && diagSummary.possibleCauses.length > 0 && (
                      <div>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Root Causes: </span>
                        <span style={{ color: 'var(--text-secondary)' }}>{diagSummary.possibleCauses.join(', ')}</span>
                      </div>
                    )}
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Standard SOP: </span>
                      <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>{scenarioInfo?.sopReference || 'Standard SOP'}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          if (scenarioInfo) {
            return (
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-surface)',
                  borderBottom: '1px solid var(--border-light)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: 800,
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      textTransform: 'uppercase',
                    }}
                  >
                    <Bot size={12} style={{ color: windowInfo.color }} />
                    ACTIVE SENSOR ANOMALIES &amp; AUTOMATIC AI DIAGNOSTICS
                  </span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={onOpenScenarioModal}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent-blue)',
                        cursor: 'pointer',
                        fontSize: '9.5px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                      title="Open full scenario dossier in popup"
                    >
                      <Info size={11} />
                      <span>Full Dossier</span>
                    </button>

                    <button
                      onClick={() => setShowScenarioDetails(!showScenarioDetails)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '9.5px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <span>{showScenarioDetails ? 'Hide' : 'Quick Details'}</span>
                      {showScenarioDetails ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{scenarioInfo.headline}</strong>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {scenarioInfo.whatHappened}
                  </div>
                </div>

                {showScenarioDetails && (
                  <div
                    style={{
                      marginTop: '8px',
                      paddingTop: '8px',
                      borderTop: '1px dashed var(--border-light)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      fontSize: '10.5px',
                      backgroundColor: 'rgba(37, 99, 235, 0.03)',
                      padding: '8px 10px',
                      borderRadius: '2px',
                    }}
                  >
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Physical Degradation Mechanism: </span>
                      <span style={{ color: 'var(--text-secondary)' }}>{scenarioInfo.physicalMechanism}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Wafer Scrap Risk Impact: </span>
                      <span style={{ color: 'var(--accent-red)', fontWeight: 800 }}>{scenarioInfo.scrapRiskEstimate}</span>
                      <span style={{ color: 'var(--text-secondary)' }}> — {scenarioInfo.riskProgression}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Standard SOP Protocol: </span>
                      <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>{scenarioInfo.sopReference}</span>
                      <span style={{ color: 'var(--text-secondary)' }}> — {scenarioInfo.recommendedAction}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          return null;
        })()}

        {/* Interactive Click Triggers */}
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
            </button>

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
              <span>View Diagnosis Report</span>
            </button>
          </div>

          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            Auto-dispatched via Agent
          </span>
        </div>

        {/* In-Progress Stepper */}
        {task.progressSteps && task.progressSteps.length > 0 && (
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-card)' }}>
            <ProgressStepper steps={task.progressSteps} percent={task.progressPercent || 0} />
          </div>
        )}

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

// ─── Main Maintenance Page Component ─────────────────────────────────────────

export const MaintenancePage: React.FC = () => {
  const {
    machines,
    maintenanceQueue,
    completeMaintenanceTask,
    deleteMaintenanceTask,
  } = useFactory();

  // Calendar State
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());

  // Selected Machine Scenario Modal State
  const [modalMachineId, setModalMachineId] = useState<string | null>(null);

  // Run Auto Maintenance Agent on current live machines to obtain scenario dossiers
  const agentOverview = React.useMemo(() => {
    return runAutoMaintenanceAgent(machines);
  }, [machines]);

  const activeTasks = maintenanceQueue.filter((t) => t.status !== 'COMPLETED');
  const completedTasks = maintenanceQueue.filter((t) => t.status === 'COMPLETED');

  // KPI Calculations
  const activeCount = activeTasks.length;
  const completedCount = completedTasks.length;
  const savedDowntime = completedCount * 18 + activeTasks.filter(t => t.priority === 'CRITICAL').length * 4;
  const efficiency = completedCount + activeCount > 0
    ? Math.round((completedCount / (completedCount + activeTasks.filter(t => t.priority === 'CRITICAL').length)) * 100) || 100
    : 100;
  const tasksWithAllocatedSpares = maintenanceQueue.filter(t => t.partsRequired && t.partsRequired.length > 0).length;
  const sparesAllocationRate = maintenanceQueue.length > 0
    ? Math.round((tasksWithAllocatedSpares / maintenanceQueue.length) * 100)
    : 100;

  const getTaskMaintenanceWindowStatus = (task: MaintenanceTask) => {
    const machine = machines.find((m) => m.id === task.machineId);
    const rawMachine = (rawMachinesData as any[]).find((m) => m.id === task.machineId);
    const rul = machine?.currentRul ?? 100;
    const hasCritAnomaly = rawMachine?.anomalies?.some((a: any) => a.severity === 'critical') || machine?.status === 'CRITICAL' || machine?.status === 'OFFLINE';

    if (task.priority === 'CRITICAL' || hasCritAnomaly || rul <= 48) {
      return { 
        label: 'CRITICAL', 
        color: 'var(--accent-red)', 
        desc: 'Critical anomaly or imminent failure risk (<48h RUL). Immediate intervention required!', 
        urgency: 3 
      };
    }
    if (task.priority === 'HIGH' || (rul > 48 && rul <= 150)) {
      return { 
        label: 'OPTIMAL WINDOW', 
        color: 'var(--accent-green)', 
        desc: 'Optimal trade-off window (48h–150h): max wear utilization without risk.', 
        urgency: 2 
      };
    }
    return { 
      label: 'PREVENTIVE', 
      color: 'var(--accent-blue)', 
      desc: 'Routine scheduled calibration with healthy remaining lifespan.', 
      urgency: 1 
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

    // Also check machines requiring calibration from Agent overview
    agentOverview.diagnoses.forEach((diag) => {
      if (diag.urgency !== 'HEALTHY' && !activeTasks.some(t => t.machineId === diag.machineId)) {
        const estDate = diag.scenario.recommendedServiceDate;
        if (
          estDate.getFullYear() === targetDate.getFullYear() &&
          estDate.getMonth() === targetDate.getMonth() &&
          estDate.getDate() === dayNum
        ) {
          reminders.push({
            machineId: diag.machineId,
            machineName: diag.machineName,
            type: diag.urgency === 'CRITICAL_BREAKDOWN' ? 'CRITICAL' : 'OPTIMAL',
            title: diag.scenario.headline,
            parts: diag.scenario.requiredParts,
            dateStr: diag.scenario.recommendedServiceDateStr,
            urgencyText: diag.urgency === 'CRITICAL_BREAKDOWN' ? 'CRITICAL' : 'OPTIMAL PREVENTIVE',
          });
        }
      }
    });

    return reminders;
  };

  const monthMaintenanceDays = new Set<number>();
  for (let d = 1; d <= daysInMonth; d++) {
    if (getRemindersForDate(d).length > 0) {
      monthMaintenanceDays.add(d);
    }
  }

  const selectedDateReminders = selectedDay ? getRemindersForDate(selectedDay) : [];

  const allUpcomingReminders: (DayReminder & { day: number })[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const rems = getRemindersForDate(d);
    rems.forEach(r => allUpcomingReminders.push({ ...r, day: d }));
  }

  // Selected Machine for Scenario Modal
  const modalMachine = modalMachineId ? machines.find(m => m.id === modalMachineId) : null;
  const modalDiagnosis = modalMachineId ? agentOverview.diagnoses.find(d => d.machineId === modalMachineId) : null;

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
          Autonomous Condition-Based Scheduler: Dispatches targeted maintenance orders to technicians with root-cause incident scenarios, parts allocation, and diagnosis reports when machine RUL reaches critical/optimal thresholds.
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
            {sparesAllocationRate}% <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>kit availability</span>
          </div>
        </div>
      </div>

      {/* ── Main Grid: Active Scheduler Timeline vs Right Column (Calendar + Historical Log) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr', gap: '20px' }}>

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

                  // Find the matching incident scenario for this machine
                  const matchedDiag = agentOverview.diagnoses.find(d => d.machineId === task.machineId);

                  return (
                    <DispatchCard
                      key={task.id}
                      task={task}
                      windowInfo={windowInfo}
                      rul={rul}
                      scenarioInfo={matchedDiag?.scenario}
                      onOpenScenarioModal={() => setModalMachineId(task.machineId)}
                      onComplete={() => completeMaintenanceTask(task.id)}
                      onDelete={() => deleteMaintenanceTask(task.id)}
                    />
                  );
                })
            )}
          </div>
        </div>

        {/* RIGHT: CALENDAR REMINDERS & SERVICE HISTORY ARCHIVE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* 1. Maintenance Calendar & Schedule Reminder Card (ABOVE ARCHIVE) */}
          <div className="tech-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="corner-tl">+</div><div className="corner-tr">+</div>
            <div className="corner-bl">+</div><div className="corner-br">+</div>
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
              {/* Days Header */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
                {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map((d) => (
                  <span key={d} style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-muted)' }}>
                    {d}
                  </span>
                ))}
              </div>

              {/* Days Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} style={{ height: '32px', opacity: 0.2 }} />
                ))}

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
                          <span
                            onClick={() => setModalMachineId(rem.machineId)}
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontWeight: 800,
                              fontSize: '11px',
                              cursor: 'pointer',
                              color: 'var(--accent-blue)',
                              textDecoration: 'underline',
                            }}
                            title="Click to view machine failure scenario dossier"
                          >
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
                    <span
                      onClick={() => setModalMachineId(allUpcomingReminders[0].machineId)}
                      style={{ color: 'var(--accent-blue)', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {allUpcomingReminders[0].dateStr} — {allUpcomingReminders[0].machineId} ({allUpcomingReminders[0].urgencyText})
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Service History Archive Card */}
          <div className="tech-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="corner-tl">+</div><div className="corner-tr">+</div>
            <div className="corner-bl">+</div><div className="corner-br">+</div>
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
                      <strong
                        onClick={() => setModalMachineId(task.machineId)}
                        style={{ fontFamily: 'var(--font-display)', fontSize: '12px', cursor: 'pointer', color: 'var(--accent-blue)', textDecoration: 'underline' }}
                        title="Click to view machine scenario dossier"
                      >
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

      {/* ── Machine Incident Scenario Modal (Opened when clicking on any machine) ── */}
      {modalMachine && modalDiagnosis && (
        <MachineScenarioModal
          machineId={modalMachine.id}
          machineName={modalMachine.name}
          scenario={modalDiagnosis.scenario}
          rul={modalMachine.currentRul}
          healthScore={modalMachine.healthScore}
          location={modalMachine.location}
          stage={modalMachine.stage}
          sensors={modalMachine.sensors}
          onClose={() => setModalMachineId(null)}
        />
      )}
    </div>
  );
};

export default MaintenancePage;
