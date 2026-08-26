import React, { useState } from 'react';
import { useFactory } from '../context/FactoryContext';
import { MaintenanceTask, ProgressStep, CommunicationChannelType } from '../types/factory';
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
  Send,
  X,
  Printer,
  Copy,
  Check,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Bell,
  Clock,
  Wrench,
  Activity,
  AlertTriangle,
  AlertOctagon,
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

// ─── Sub-component: Mini Sensor Waveform Plot (For Other Channels) ──────────

const SensorMiniWaveformPlot: React.FC<{
  sensor: {
    id: string;
    label: string;
    value: number;
    unit: string;
    baseline: number;
    threshold: number;
    deviation: number;
    status: string;
    isFaulty: boolean;
  };
}> = ({ sensor }) => {
  const points = React.useMemo(() => {
    const base = sensor.baseline;
    return [
      { time: '-6h', val: parseFloat((base * 1.01).toFixed(1)) },
      { time: '-5h', val: parseFloat((base * 0.99).toFixed(1)) },
      { time: '-4h', val: parseFloat((base * 1.03).toFixed(1)) },
      { time: '-3h', val: parseFloat((base * 0.98).toFixed(1)) },
      { time: '-2h', val: parseFloat((base * 1.02).toFixed(1)) },
      { time: '-1h', val: parseFloat((base * 1.01).toFixed(1)) },
      { time: 'Live', val: parseFloat(sensor.value.toFixed(1)) },
    ];
  }, [sensor]);

  const svgW = 280;
  const svgH = 80;
  const pad = { top: 10, right: 14, bottom: 18, left: 36 };
  const plotW = svgW - pad.left - pad.right;
  const plotH = svgH - pad.top - pad.bottom;

  const vals = points.map((p) => p.val).concat([sensor.baseline, sensor.threshold, sensor.value]);
  const minVal = Math.min(...vals) * 0.85;
  const maxVal = Math.max(...vals) * 1.15;

  const getX = (idx: number) => pad.left + (idx / (points.length - 1)) * plotW;
  const getY = (v: number) => pad.top + plotH - ((v - minVal) / (maxVal - minVal || 1)) * plotH;

  const splinePath = React.useMemo(() => {
    if (points.length === 0) return '';
    const pts = points.map((p, idx) => ({ x: getX(idx), y: getY(p.val) }));
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cur = pts[i];
      const next = pts[i + 1];
      const cx = (cur.x + next.x) / 2;
      path += ` C ${cx} ${cur.y}, ${cx} ${next.y}, ${next.x} ${next.y}`;
    }
    return path;
  }, [points, minVal, maxVal]);

  const lastPt = points.length > 0 ? { x: getX(points.length - 1), y: getY(points[points.length - 1].val) } : null;
  const areaPath = points.length > 0 && lastPt
    ? `${splinePath} L ${lastPt.x} ${pad.top + plotH} L ${pad.left} ${pad.top + plotH} Z`
    : '';

  const strokeColor = sensor.isFaulty ? '#DC2626' : '#2563EB';

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id={`miniGrad-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={0.18} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* Gridlines */}
      <line
        x1={pad.left}
        y1={getY(sensor.baseline)}
        x2={pad.left + plotW}
        y2={getY(sensor.baseline)}
        stroke="#16A34A"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      <line
        x1={pad.left}
        y1={getY(sensor.threshold)}
        x2={pad.left + plotW}
        y2={getY(sensor.threshold)}
        stroke="#DC2626"
        strokeWidth="1.2"
        strokeDasharray="4 2"
      />

      <text x={pad.left - 3} y={getY(sensor.baseline) + 2.5} textAnchor="end" fontSize="7.5" fontFamily="var(--font-mono)" fill="#16A34A">
        {sensor.baseline}
      </text>
      <text x={pad.left - 3} y={getY(sensor.threshold) + 2.5} textAnchor="end" fontSize="7.5" fontFamily="var(--font-mono)" fill="#DC2626" fontWeight="700">
        {sensor.threshold}
      </text>

      <path d={areaPath} fill={`url(#miniGrad-${sensor.id})`} />
      <path d={splinePath} fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

      {points.map((pt, idx) => {
        const x = getX(idx);
        const y = getY(pt.val);
        const isLast = idx === points.length - 1;

        return (
          <g key={idx}>
            <circle
              cx={x}
              cy={y}
              r={isLast ? 3.5 : 1.8}
              fill={isLast ? '#111827' : '#FFFFFF'}
              stroke={strokeColor}
              strokeWidth="1.4"
            />
            {isLast && (
              <text x={x} y={y - 5} textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="var(--font-mono)" fill="#111827">
                {pt.val.toFixed(1)} {sensor.unit}
              </text>
            )}
            <text x={x} y={pad.top + plotH + 12} textAnchor="middle" fontSize="7" fontFamily="var(--font-mono)" fill="#6B7280">
              {pt.time}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ─── Sub-component: Telemetry Diagnosis Graph for Report PDF ─────────────────

const SENSOR_FIXED_DEFAULTS: Record<string, { baseline: number; threshold: number; unit: string }> = {
  vibration_spindle: { baseline: 1.2, threshold: 4.5, unit: 'mm/s' },
  temperature_coolant: { baseline: 18.0, threshold: 28.0, unit: '°C' },
  load_motor: { baseline: 2.5, threshold: 6.0, unit: 'A' },
  vibration_arm: { baseline: 0.8, threshold: 3.5, unit: 'mm/s' },
  pressure_vacuum: { baseline: -85.0, threshold: -55.0, unit: 'kPa' },
  temperature_heater: { baseline: 150.0, threshold: 180.0, unit: '°C' },
  vibration_ultrasonic: { baseline: 2.0, threshold: 6.0, unit: 'mm/s' },
  load_clamp: { baseline: 15.0, threshold: 35.0, unit: 'N' },
  temperature_transducer: { baseline: 45.0, threshold: 85.0, unit: '°C' },
  temperature_mold: { baseline: 175.0, threshold: 190.0, unit: '°C' },
  pressure_hydraulic: { baseline: 120.0, threshold: 180.0, unit: 'bar' },
  load_plunger: { baseline: 8.5, threshold: 15.0, unit: 'kN' },
  vibration_handler: { baseline: 1.5, threshold: 5.0, unit: 'mm/s' },
  temperature_chamber: { baseline: 85.0, threshold: 120.0, unit: '°C' },
  load_actuator: { baseline: 12.0, threshold: 30.0, unit: 'N' },
};

const TelemetryDiagnosisGraph: React.FC<{
  task: MaintenanceTask;
  machine?: any;
}> = ({ task, machine }) => {
  const report = task.diagnosisReport;

  // Compile sensor dataset with deterministic, fixed values
  const sensorItems = React.useMemo(() => {
    if (machine && machine.sensors && machine.sensors.length > 0) {
      return machine.sensors.map((s: any, idx: number) => {
        const lookup = SENSOR_FIXED_DEFAULTS[s.name] || SENSOR_FIXED_DEFAULTS[s.sensorId] || { baseline: 50, threshold: 100, unit: '' };
        
        const reportMatch = report.sensorReadings.find(
          (r) =>
            r.sensor.toLowerCase() === (s.label || '').toLowerCase() ||
            r.sensor.toLowerCase() === (s.name || '').toLowerCase() ||
            (s.label || '').toLowerCase().includes(r.sensor.toLowerCase())
        );

        const baseline = lookup.baseline;
        const threshold = lookup.threshold;
        const unit = s.unit || lookup.unit || '';

        let value: number;
        let deviation: number;
        let status: string;
        let isFaulty: boolean;

        if (reportMatch) {
          // Parse the fixed value from the report snapshot
          const numVal = parseFloat(reportMatch.value.replace(/[^0-9.-]/g, '')) || (threshold * 1.15);
          value = parseFloat(numVal.toFixed(1));
          status = reportMatch.status;
          isFaulty = status === 'CRITICAL' || status === 'WARNING';
          
          if (isFaulty) {
             deviation = status === 'CRITICAL' ? 115 : 85;
          } else {
             deviation = Math.round((value / threshold) * 100);
          }
        } else {
          // Fixed, deterministic nominal value so it never changes in the PDF
          const deterministicOffset = ((s.label || s.name || s.id || '').length % 15) / 100; // e.g. 0.05 to 0.14
          value = parseFloat((baseline * (1 + deterministicOffset)).toFixed(1));
          status = 'OK';
          isFaulty = false;
          deviation = Math.round((value / threshold) * 100) || 15;
        }

        return {
          id: s.name || s.sensorId || s.label || `sensor-${idx}`,
          label: s.label || s.name || 'Sensor',
          value,
          unit,
          baseline,
          threshold,
          deviation,
          status,
          isFaulty,
        };
      });
    }

    // Fallback using report sensorReadings with fixed calculations
    return report.sensorReadings.map((r, idx) => {
      const numVal = parseFloat(r.value.replace(/[^0-9.-]/g, '')) || 50;
      const unit = r.value.replace(/[0-9.-]/g, '').trim();
      const isCritical = r.status === 'CRITICAL';
      const isWarn = r.status === 'WARNING';
      
      const lookupKey = Object.keys(SENSOR_FIXED_DEFAULTS).find(k => r.sensor.toLowerCase().includes(k.replace('_', ' '))) 
                        || Object.keys(SENSOR_FIXED_DEFAULTS)[idx % Object.keys(SENSOR_FIXED_DEFAULTS).length];
      const lookup = SENSOR_FIXED_DEFAULTS[lookupKey];

      const threshold = isCritical ? parseFloat((numVal * 0.85).toFixed(1)) : (lookup ? lookup.threshold : parseFloat((numVal * 1.25).toFixed(1)));
      const baseline = lookup ? lookup.baseline : parseFloat((numVal * 0.35).toFixed(1));
      const dev = isCritical ? 118 : isWarn ? 76 : 28;

      return {
        id: `sensor-${idx}`,
        label: r.sensor,
        value: parseFloat(numVal.toFixed(1)),
        unit: unit || lookup?.unit || '',
        baseline,
        threshold,
        deviation: dev,
        status: r.status,
        isFaulty: isCritical || isWarn,
      };
    });
  }, [machine, report]);

  // Primary problematic sensor that encountered the fault
  const problemSensors = React.useMemo(() => {
    return sensorItems.filter((s: any) => s.isFaulty || s.status === 'CRITICAL' || s.status === 'WARNING');
  }, [sensorItems]);

  const primaryProblemSensor = React.useMemo(() => {
    return (
      problemSensors[0] ||
      [...sensorItems].sort((a: any, b: any) => b.deviation - a.deviation)[0] ||
      sensorItems[0]
    );
  }, [problemSensors, sensorItems]);

  // Other sensor channels (excluding the primary fault channel)
  const otherSensors = React.useMemo(() => {
    return sensorItems.filter((s: any) => s.id !== primaryProblemSensor?.id);
  }, [sensorItems, primaryProblemSensor]);

  // Fixed deterministic time-series progression for the primary fault channel
  const wavePoints = React.useMemo(() => {
    if (!primaryProblemSensor) return [];
    const base = primaryProblemSensor.baseline;
    const thresh = primaryProblemSensor.threshold;
    const peak = primaryProblemSensor.value;
    const span = thresh - base;

    return [
      { time: '-6h', val: parseFloat(base.toFixed(1)) },
      { time: '-5h', val: parseFloat((base + span * 0.18).toFixed(1)) },
      { time: '-4h', val: parseFloat((base + span * 0.38).toFixed(1)) },
      { time: '-3h', val: parseFloat((base + span * 0.62).toFixed(1)) },
      { time: '-2h', val: parseFloat((base + span * 0.82).toFixed(1)) },
      { time: '-1h', val: parseFloat((thresh * 1.02).toFixed(1)) },
      { time: 'Trigger', val: parseFloat(peak.toFixed(1)) },
    ];
  }, [primaryProblemSensor]);

  // SVG Chart Geometry
  const svgWidth = 630;
  const svgHeight = 175;
  const pad = { top: 22, right: 35, bottom: 26, left: 55 };
  const plotW = svgWidth - pad.left - pad.right;
  const plotH = svgHeight - pad.top - pad.bottom;

  const vals = wavePoints.map((p) => p.val).concat([primaryProblemSensor.baseline, primaryProblemSensor.threshold, primaryProblemSensor.value]);
  const minVal = Math.min(...vals) * 0.85;
  const maxVal = Math.max(...vals) * 1.15;

  const getX = (idx: number) => pad.left + (idx / (wavePoints.length - 1)) * plotW;
  const getY = (v: number) => pad.top + plotH - ((v - minVal) / (maxVal - minVal || 1)) * plotH;

  const splinePath = React.useMemo(() => {
    if (wavePoints.length === 0) return '';
    const pts = wavePoints.map((p, idx) => ({ x: getX(idx), y: getY(p.val) }));
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cur = pts[i];
      const next = pts[i + 1];
      const cx = (cur.x + next.x) / 2;
      path += ` C ${cx} ${cur.y}, ${cx} ${next.y}, ${next.x} ${next.y}`;
    }
    return path;
  }, [wavePoints, minVal, maxVal]);

  const lastPt = wavePoints.length > 0 ? { x: getX(wavePoints.length - 1), y: getY(wavePoints[wavePoints.length - 1].val) } : null;
  const areaPath = wavePoints.length > 0 && lastPt
    ? `${splinePath} L ${lastPt.x} ${pad.top + plotH} L ${pad.left} ${pad.top + plotH} Z`
    : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
      {/* Section Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #E5E7EB',
          paddingBottom: '4px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={14} color="#DC2626" />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            3. MACHINE TELEMETRY SIGNATURE &amp; SENSOR ANOMALY ANALYSIS
          </span>
        </div>
        <span
          style={{
            fontSize: '9.5px',
            fontFamily: 'var(--font-mono)',
            backgroundColor: primaryProblemSensor.isFaulty ? 'rgba(220,38,38,0.1)' : 'rgba(37,99,235,0.1)',
            color: primaryProblemSensor.isFaulty ? '#DC2626' : '#2563EB',
            border: `1px solid ${primaryProblemSensor.isFaulty ? '#DC2626' : '#2563EB'}`,
            padding: '2px 8px',
            fontWeight: 800,
          }}
        >
          {primaryProblemSensor.isFaulty ? '⚠️ SENSOR ANOMALY BREACH DETECTED' : 'ALL CHANNELS NOMINAL'}
        </span>
      </div>

      {/* Part A: PRIMARY FAULT CHANNEL (Featured Main Graph) */}
      {primaryProblemSensor && (
        <div
          style={{
            border: '2px solid rgba(220, 38, 38, 0.45)',
            backgroundColor: '#FFFFFF',
            padding: '12px 14px',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.08)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertOctagon size={15} color="#DC2626" />
              <span style={{ fontSize: '12px', fontWeight: 900, color: '#991B1B', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                PRIMARY FAULT CHANNEL: {primaryProblemSensor.label}
              </span>
              <span
                style={{
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '8.5px',
                  padding: '2px 6px',
                  borderRadius: '2px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                CRITICAL THRESHOLD BREACH
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', fontSize: '9.5px', fontFamily: 'var(--font-mono)', alignItems: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16A34A' }}>
                <span style={{ width: '12px', height: '2px', backgroundColor: '#16A34A', borderTop: '1px dashed #16A34A' }} />
                Baseline ({primaryProblemSensor.baseline} {primaryProblemSensor.unit})
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#DC2626' }}>
                <span style={{ width: '12px', height: '2px', backgroundColor: '#DC2626', borderTop: '2px dashed #DC2626' }} />
                Safety Threshold ({primaryProblemSensor.threshold} {primaryProblemSensor.unit})
              </span>
            </div>
          </div>

          {/* SVG Time-Series Waveform */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
              <defs>
                <linearGradient id="primFaultGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DC2626" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Threshold Danger Shading */}
              <rect
                x={pad.left}
                y={getY(maxVal)}
                width={plotW}
                height={Math.max(0, getY(primaryProblemSensor.threshold) - getY(maxVal))}
                fill="rgba(220, 38, 38, 0.05)"
              />

              {/* Gridlines */}
              {[minVal, primaryProblemSensor.baseline, primaryProblemSensor.threshold, maxVal].map((val, idx) => (
                <g key={idx}>
                  <line
                    x1={pad.left}
                    y1={getY(val)}
                    x2={pad.left + plotW}
                    y2={getY(val)}
                    stroke="#E5E7EB"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={pad.left - 6}
                    y={getY(val) + 3.5}
                    textAnchor="end"
                    fontSize="9"
                    fontFamily="var(--font-mono)"
                    fill="#6B7280"
                  >
                    {val.toFixed(1)} {primaryProblemSensor.unit}
                  </text>
                </g>
              ))}

              {/* Baseline Reference Line (Green dashed) */}
              <line
                x1={pad.left}
                y1={getY(primaryProblemSensor.baseline)}
                x2={pad.left + plotW}
                y2={getY(primaryProblemSensor.baseline)}
                stroke="#16A34A"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />

              {/* Threshold Reference Line (Red dashed) */}
              <line
                x1={pad.left}
                y1={getY(primaryProblemSensor.threshold)}
                x2={pad.left + plotW}
                y2={getY(primaryProblemSensor.threshold)}
                stroke="#DC2626"
                strokeWidth="2"
                strokeDasharray="5 3"
              />
              <text
                x={pad.left + plotW - 4}
                y={getY(primaryProblemSensor.threshold) - 5}
                textAnchor="end"
                fontSize="8.5"
                fontWeight="800"
                fontFamily="var(--font-mono)"
                fill="#DC2626"
              >
                SAFETY LIMIT
              </text>

              {/* Shaded Area */}
              <path d={areaPath} fill="url(#primFaultGrad)" />

              {/* Spline Path */}
              <path
                d={splinePath}
                fill="none"
                stroke="#DC2626"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Points */}
              {wavePoints.map((pt, idx) => {
                const x = getX(idx);
                const y = getY(pt.val);
                const isLast = idx === wavePoints.length - 1;

                return (
                  <g key={idx}>
                    <line x1={x} y1={y} x2={x} y2={pad.top + plotH} stroke="#F3F4F6" strokeWidth="1" />
                    <circle
                      cx={x}
                      cy={y}
                      r={isLast ? 4.5 : 2.8}
                      fill={isLast ? '#DC2626' : '#FFFFFF'}
                      stroke="#DC2626"
                      strokeWidth="1.8"
                    />
                    <text
                      x={x}
                      y={y - 7}
                      textAnchor="middle"
                      fontSize="8.5"
                      fontWeight={isLast ? '800' : '600'}
                      fontFamily="var(--font-mono)"
                      fill={isLast ? '#DC2626' : '#111827'}
                    >
                      {pt.val.toFixed(1)}
                    </text>
                    <text
                      x={x}
                      y={pad.top + plotH + 16}
                      textAnchor="middle"
                      fontSize="8.5"
                      fontFamily="var(--font-mono)"
                      fill={isLast ? '#111827' : '#6B7280'}
                      fontWeight={isLast ? '800' : '500'}
                    >
                      {pt.time}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Fault Callout */}
          <div
            style={{
              marginTop: '10px',
              padding: '8px 10px',
              backgroundColor: '#FEF2F2',
              borderLeft: '3px solid #DC2626',
              fontSize: '10.5px',
              color: '#7F1D1D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={13} color="#DC2626" />
              <span>
                <strong>CRITICAL TELEMETRY SPIKE:</strong> {primaryProblemSensor.label} reached{' '}
                <strong>{primaryProblemSensor.value} {primaryProblemSensor.unit}</strong> (safety threshold: {primaryProblemSensor.threshold} {primaryProblemSensor.unit}). Triggered autonomous work order dispatch.
              </span>
            </div>
            <span style={{ fontSize: '9.5px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#DC2626' }}>
              DEVIATION: +{(primaryProblemSensor.deviation - 100 > 0 ? primaryProblemSensor.deviation - 100 : 0)}% OVER LIMIT
            </span>
          </div>
        </div>
      )}

      {/* Part B: Other Channels Telemetry Waveform Cards (Smaller Graphs) */}
      {otherSensors.length > 0 && (
        <div>
          <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#111827', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>OTHER SENSOR CHANNELS TELEMETRY ({otherSensors.length} NOMINAL STREAMS)</span>
            <span style={{ fontSize: '9px', color: '#6B7280', fontFamily: 'var(--font-mono)' }}>Continuous edge sampling</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
            {otherSensors.map((s: any) => (
              <div
                key={s.id}
                style={{
                  padding: '10px 12px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#111827' }}>
                    {s.label}
                  </span>
                  <span
                    style={{
                      fontSize: '8px',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      padding: '1px 5px',
                      borderRadius: '2px',
                      backgroundColor: s.deviation >= 60 ? '#D97706' : '#16A34A',
                      color: '#FFFFFF',
                    }}
                  >
                    {s.deviation >= 60 ? 'WARNING' : 'NOMINAL'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'var(--font-mono)', color: '#6B7280' }}>
                  <span>Val: <strong style={{ color: '#111827' }}>{s.value} {s.unit}</strong></span>
                  <span>Base: {s.baseline}</span>
                  <span>Limit: <strong style={{ color: '#DC2626' }}>{s.threshold}</strong></span>
                  <span style={{ color: '#16A34A', fontWeight: 700 }}>Dev: {s.deviation}%</span>
                </div>

                <SensorMiniWaveformPlot sensor={s} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Part C: Multi-Sensor Telemetry Saturation & Status Matrix (All Channels Listed) */}
      <div
        style={{
          border: '1px solid #E5E7EB',
          backgroundColor: '#FAFAFA',
          padding: '12px 14px',
          borderRadius: '4px',
        }}
      >
        <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#111827', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
          <span>ALL SENSOR TELEMETRY STATUS &amp; THRESHOLD SATURATION MATRIX ({sensorItems.length} CHANNELS)</span>
          <span style={{ fontSize: '9px', color: '#6B7280', fontFamily: 'var(--font-mono)' }}>Safety Threshold = 100%</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {sensorItems.map((s: any) => {
            const isProblem = s.isFaulty;
            const barPct = Math.min(100, Math.max(8, s.deviation));
            const barColor = isProblem ? '#DC2626' : s.deviation >= 60 ? '#D97706' : '#16A34A';

            return (
              <div
                key={s.id}
                style={{
                  padding: '6px 10px',
                  backgroundColor: isProblem ? '#FEF2F2' : '#FFFFFF',
                  border: `1px solid ${isProblem ? 'rgba(220,38,38,0.35)' : '#E5E7EB'}`,
                  borderRadius: '3px',
                  display: 'grid',
                  gridTemplateColumns: '150px 1fr 140px',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                {/* Sensor Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {isProblem ? <AlertOctagon size={12} color="#DC2626" /> : <CheckCircle2 size={12} color="#16A34A" />}
                  <span style={{ fontSize: '11px', fontWeight: isProblem ? 800 : 600, color: isProblem ? '#991B1B' : '#111827' }}>
                    {s.label}
                  </span>
                </div>

                {/* Relative Saturation Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '7.5px', backgroundColor: '#E5E7EB', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'absolute', right: '15%', top: 0, bottom: 0, width: '1.5px', backgroundColor: '#DC2626', zIndex: 2 }} />
                    <div style={{ width: `${barPct}%`, height: '100%', backgroundColor: barColor }} />
                  </div>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: barColor, minWidth: '35px', textAlign: 'right' }}>
                    {s.deviation}%
                  </span>
                </div>

                {/* Fixed Metrics & Status Badge */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#374151' }}>
                    <strong>{s.value}</strong> / {s.threshold} {s.unit}
                  </span>
                  <span
                    style={{
                      fontSize: '8px',
                      fontWeight: 800,
                      padding: '1px 5px',
                      borderRadius: '2px',
                      backgroundColor: isProblem ? '#DC2626' : s.deviation >= 60 ? '#D97706' : '#16A34A',
                      color: '#FFFFFF',
                    }}
                  >
                    {isProblem ? 'ANOMALY' : s.deviation >= 60 ? 'WARN' : 'NOMINAL'}
                  </span>
                </div>
              </div>
            );
          })}
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
  const { machines } = useFactory();
  const report = task.diagnosisReport;
  const machine = machines.find((m) => m.id === task.machineId);

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
          maxWidth: '740px',
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

          {/* Section 3: Telemetry Sensor Signature & Anomaly Graph */}
          <TelemetryDiagnosisGraph task={task} machine={machine} />

          {/* Section 4: Required Repair Actions & Consumables */}
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

  const getTaskMaintenanceWindowStatus = (task: MaintenanceTask) => {
    const machine = machines.find((m) => m.id === task.machineId);
    if (!machine) return { label: 'UNKNOWN', color: 'var(--text-muted)', desc: 'Sensor status unavailable', urgency: 0 };
    const rul = machine.currentRul;
    if (rul <= 24) return { label: 'CRITICAL / OVERDUE', color: 'var(--accent-red)', desc: 'High breakdown risk. Failure imminent!', urgency: 3 };
    if (rul <= 72) return { label: 'OPTIMAL WINDOW', color: 'var(--accent-green)', desc: 'Optimal trade-off: max wear utilization without risk.', urgency: 2 };
    return { label: 'PREVENTIVE (SUFFICIENT RUL)', color: 'var(--accent-blue)', desc: 'Early schedule. Lifespan remaining.', urgency: 1 };
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

        {/* RIGHT: CALENDAR REMINDERS & SERVICE HISTORY ARCHIVE */}
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
                maxHeight: '420px',
                overflowY: 'auto',
              }}
            >
              {completedTasks.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '11px', textAlign: 'center', padding: '24px' }}>
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
