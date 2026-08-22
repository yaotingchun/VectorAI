import React, { useMemo } from 'react';
import { Machine } from '../../../machines/types/machine';
import { PredictionScenario } from '../../data/predictionScenarios';
import { getHealthScoreColor } from '../../../machines/utils/machineStatus';

// ─── Seeded deterministic pseudo-random ──────────────────────────────────────

function sr(seed: string, n: number): number {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) + h + seed.charCodeAt(i)) | 0;
  h = (Math.imul(h ^ n, 0x9e3779b9)) | 0;
  h = (Math.imul(h ^ (h >>> 16), 0x85ebca6b)) | 0;
  return ((h ^ (h >>> 13)) >>> 0) / 0xFFFFFFFF;
}

// ─── Generate health trend history (last 24 data points → "Now") ─────────────

function genHistory(machine: Machine): number[] {
  const current = machine.healthScore;
  const isAccel = ['Accelerated Wear', 'Imminent Failure'].includes(machine.rul.degradationStage);
  const offset = isAccel ? 20 : 10;
  return Array.from({ length: 24 }, (_, i) => {
    const t = i / 23;
    const base = current + offset * Math.pow(1 - t, 1.6);
    const noise = (sr(machine.id, i) - 0.5) * 4;
    return Math.max(1, Math.min(100, base + noise));
  });
}

// ─── Generate projected health (future, dashed) ───────────────────────────────

function genProjection(machine: Machine, history: number[]): number[] {
  const isAccel = ['Accelerated Wear', 'Imminent Failure'].includes(machine.rul.degradationStage);
  const isWarning = machine.healthScore < 80 && machine.healthScore >= 60;
  const ratePerStep = isAccel ? -2.2 : isWarning ? -0.9 : -0.35;
  const last = history[history.length - 1];
  return Array.from({ length: 8 }, (_, i) => {
    const base = last + ratePerStep * (i + 1);
    const noise = (sr(machine.id, i + 300) - 0.5) * 1.5;
    return Math.max(1, Math.min(100, base + noise));
  });
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface DegradationChartProps {
  machine: Machine;
  scenario: PredictionScenario;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const DegradationChart: React.FC<DegradationChartProps> = ({ machine, scenario }) => {
  const history = useMemo(() => genHistory(machine), [machine]);
  const projection = useMemo(() => genProjection(machine, history), [machine, history]);

  const { color: trendColor } = getHealthScoreColor(machine.healthScore);
  const totalPts = history.length + projection.length - 1;

  // SVG dimensions
  const VW = 600, VH = 160;
  const PAD = { top: 10, right: 4, bottom: 22, left: 32 };
  const IW = VW - PAD.left - PAD.right;
  const IH = VH - PAD.top - PAD.bottom;

  const toX = (i: number) => PAD.left + (i / totalPts) * IW;
  const toY = (v: number) => PAD.top + IH - (Math.max(0, Math.min(100, v)) / 100) * IH;

  // Paths
  const histPath = history.map((v, i) =>
    `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`
  ).join(' ');

  const projPath = projection.map((v, i) =>
    `${i === 0 ? 'M' : 'L'}${toX(history.length - 1 + i).toFixed(1)},${toY(v).toFixed(1)}`
  ).join(' ');

  const areaPath = `${histPath} L${toX(history.length - 1).toFixed(1)},${(PAD.top + IH).toFixed(1)} L${PAD.left},${(PAD.top + IH).toFixed(1)}Z`;

  // Threshold Y positions
  const y80 = toY(80);
  const y60 = toY(60);
  const y40 = toY(40);
  const splitX = toX(history.length - 1);

  return (
    <div>
      {/* ── Chart Title ─────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '10px', flexWrap: 'wrap', gap: '6px'
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
          color: 'var(--text-muted)', letterSpacing: '0.07em' }}>
          HEALTH SCORE — 24h TREND + PROJECTION
        </span>
        {/* Legend */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <LegendItem color={trendColor} label="Health Trend" dashed={false} />
          <LegendItem color="#DC2626" label="Projected" dashed />
        </div>
      </div>

      {/* ── SVG Chart ───────────────────────────────────── */}
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Zone bands */}
        <rect x={PAD.left} y={PAD.top} width={IW} height={y80 - PAD.top}
          fill="rgba(22,163,74,0.06)" />
        <rect x={PAD.left} y={y80} width={IW} height={y60 - y80}
          fill="rgba(217,119,6,0.06)" />
        <rect x={PAD.left} y={y60} width={IW} height={PAD.top + IH - y60}
          fill="rgba(220,38,38,0.07)" />

        {/* Zone threshold lines */}
        <ThreshLine x1={PAD.left} x2={PAD.left + IW} y={y80} color="#16A34A" />
        <ThreshLine x1={PAD.left} x2={PAD.left + IW} y={y60} color="#D97706" />
        <ThreshLine x1={PAD.left} x2={PAD.left + IW} y={y40} color="#DC2626" />

        {/* Area fill under history */}
        <path d={areaPath} fill={trendColor} fillOpacity={0.09} />

        {/* Historical trend line */}
        <path d={histPath} fill="none" stroke={trendColor} strokeWidth={2}
          strokeLinejoin="round" strokeLinecap="round" />

        {/* Divider: Now */}
        <line x1={splitX} y1={PAD.top} x2={splitX} y2={PAD.top + IH}
          stroke="var(--border-strong)" strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />

        {/* Projected trend line */}
        <path d={projPath} fill="none" stroke="#DC2626" strokeWidth={1.5}
          strokeDasharray="5,3" strokeLinejoin="round" />

        {/* Current point */}
        <circle
          cx={splitX} cy={toY(history[history.length - 1])}
          r={4} fill={trendColor}
          style={{ filter: `drop-shadow(0 0 3px ${trendColor})` }}
        />

        {/* Y Axis labels */}
        {[0, 20, 40, 60, 80, 100].map(v => (
          <text key={v}
            x={PAD.left - 4} y={toY(v)}
            fontSize={8} fill="var(--text-muted)" fontFamily="monospace"
            textAnchor="end" dominantBaseline="middle">{v}</text>
        ))}

        {/* X Axis baseline */}
        <line x1={PAD.left} y1={PAD.top + IH} x2={PAD.left + IW} y2={PAD.top + IH}
          stroke="var(--border-light)" strokeWidth={1} />

        {/* X axis labels */}
        <text x={PAD.left} y={VH - 2} fontSize={9} fill="var(--text-muted)"
          fontFamily="monospace" textAnchor="start">−24h</text>
        <text x={splitX} y={VH - 2} fontSize={9} fill="var(--text-primary)"
          fontFamily="monospace" textAnchor="middle" fontWeight="bold">NOW</text>
        <text x={PAD.left + IW} y={VH - 2} fontSize={9} fill="#DC2626"
          fontFamily="monospace" textAnchor="end">+{projection.length * 1}h Est.</text>
      </svg>

      {/* ── Sensor Status Row ────────────────────────────── */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
        {scenario.trendSensors.map(s => {
          const sColor = s.status === 'critical' ? '#DC2626'
                       : s.status === 'warning'  ? '#D97706'
                       : '#16A34A';
          return (
            <div key={s.id} style={{
              flex: '1 1 0', minWidth: '100px',
              padding: '8px 10px',
              backgroundColor: 'var(--bg-surface)',
              border: `1.5px solid ${sColor}30`,
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
                color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '4px',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {s.label.toUpperCase()}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: sColor }}>
                {s.value.toFixed(s.value < 10 ? 2 : 1)} {s.unit}
                <span style={{ marginLeft: '4px', fontSize: '12px' }}>
                  {s.trend === 'up' ? '↑' : s.trend === 'down' ? '↓' : '→'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Helper SVG sub-components ───────────────────────────────────────────────

const ThreshLine: React.FC<{ x1: number; x2: number; y: number; color: string }> = ({ x1, x2, y, color }) => (
  <g>
    <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={0.8} strokeDasharray="4,3" opacity={0.7} />
  </g>
);

const LegendItem: React.FC<{ color: string; label: string; dashed: boolean }> = ({ color, label, dashed }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
    <svg width={20} height={2} style={{ display: 'block' }}>
      <line x1={0} y1={1} x2={20} y2={1} stroke={color} strokeWidth={2}
        strokeDasharray={dashed ? '4,2' : undefined} />
    </svg>
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700 }}>
      {label}
    </span>
  </div>
);
