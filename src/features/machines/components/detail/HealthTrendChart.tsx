import React, { useState, useMemo } from 'react';
import { HealthDataPoint } from '../../types/machine';
import { Activity, Info } from 'lucide-react';
import { getHealthScoreColor } from '../../utils/machineStatus';

interface HealthTrendChartProps {
  trendData?: {
    '24h'?: HealthDataPoint[];
    '7d'?: HealthDataPoint[];
    '30d'?: HealthDataPoint[];
  };
  currentScore: number;
}

// Generate realistic industrial degradation curves based on machine health score
function generateRealisticTrend(currentScore: number, range: '24h' | '7d' | '30d'): HealthDataPoint[] {
  if (currentScore === 0) {
    // Offline machine
    if (range === '24h') {
      return [
        { timestamp: '-24h', health: 85 },
        { timestamp: '-18h', health: 84 },
        { timestamp: '-12h', health: 82 },
        { timestamp: '-6h', health: 0 },
        { timestamp: '-3h', health: 0 },
        { timestamp: 'Now', health: 0 }
      ];
    }
    if (range === '7d') {
      return [
        { timestamp: 'Day -6', health: 88 },
        { timestamp: 'Day -5', health: 87 },
        { timestamp: 'Day -4', health: 85 },
        { timestamp: 'Day -3', health: 83 },
        { timestamp: 'Day -2', health: 0 },
        { timestamp: 'Day -1', health: 0 },
        { timestamp: 'Today', health: 0 }
      ];
    }
    return [
      { timestamp: 'Wk -4', health: 92 },
      { timestamp: 'Wk -3', health: 90 },
      { timestamp: 'Wk -2', health: 85 },
      { timestamp: 'Wk -1', health: 0 },
      { timestamp: 'Now', health: 0 }
    ];
  }

  if (currentScore >= 85) {
    // Healthy equipment: High baseline with subtle operational noise
    if (range === '24h') {
      return [
        { timestamp: '-24h', health: Math.min(100, currentScore + 2) },
        { timestamp: '-20h', health: Math.max(85, currentScore - 1) },
        { timestamp: '-16h', health: Math.min(100, currentScore + 1) },
        { timestamp: '-12h', health: currentScore },
        { timestamp: '-8h', health: Math.max(85, currentScore - 2) },
        { timestamp: '-4h', health: Math.min(100, currentScore + 1) },
        { timestamp: 'Now', health: currentScore }
      ];
    }
    if (range === '7d') {
      return [
        { timestamp: 'Day -6', health: Math.min(100, currentScore + 3) },
        { timestamp: 'Day -5', health: Math.min(100, currentScore + 2) },
        { timestamp: 'Day -4', health: Math.min(100, currentScore + 1) },
        { timestamp: 'Day -3', health: Math.max(85, currentScore - 1) },
        { timestamp: 'Day -2', health: Math.min(100, currentScore + 2) },
        { timestamp: 'Day -1', health: Math.max(85, currentScore - 1) },
        { timestamp: 'Today', health: currentScore }
      ];
    }
    return [
      { timestamp: 'Wk -4', health: 99 },
      { timestamp: 'Wk -3', health: 98 },
      { timestamp: 'Wk -2', health: 97 },
      { timestamp: 'Wk -1', health: 96 },
      { timestamp: 'Now', health: currentScore }
    ];
  }

  if (currentScore >= 60) {
    // Warning equipment (e.g. WB-024): Accelerated wear curve beginning 3-4 days ago
    if (range === '24h') {
      return [
        { timestamp: '-24h', health: Math.min(95, currentScore + 6) },
        { timestamp: '-20h', health: Math.min(95, currentScore + 5) },
        { timestamp: '-16h', health: Math.min(95, currentScore + 3) },
        { timestamp: '-12h', health: Math.min(95, currentScore + 3) },
        { timestamp: '-8h', health: Math.min(95, currentScore + 2) },
        { timestamp: '-4h', health: Math.min(95, currentScore + 1) },
        { timestamp: 'Now', health: currentScore }
      ];
    }
    if (range === '7d') {
      return [
        { timestamp: 'Day -6', health: 93 },
        { timestamp: 'Day -5', health: 91 },
        { timestamp: 'Day -4', health: 89 },
        { timestamp: 'Day -3', health: 84 },
        { timestamp: 'Day -2', health: 79 },
        { timestamp: 'Day -1', health: Math.min(80, currentScore + 3) },
        { timestamp: 'Today', health: currentScore }
      ];
    }
    return [
      { timestamp: 'Wk -4', health: 96 },
      { timestamp: 'Wk -3', health: 94 },
      { timestamp: 'Wk -2', health: 90 },
      { timestamp: 'Wk -1', health: 82 },
      { timestamp: 'Now', health: currentScore }
    ];
  }

  // Critical equipment (e.g. WB-003, DA-002): Steep cascade degradation curve
  if (range === '24h') {
    return [
      { timestamp: '-24h', health: Math.min(70, currentScore + 11) },
      { timestamp: '-20h', health: Math.min(70, currentScore + 9) },
      { timestamp: '-16h', health: Math.min(70, currentScore + 6) },
      { timestamp: '-12h', health: Math.min(70, currentScore + 4) },
      { timestamp: '-8h', health: Math.min(70, currentScore + 2) },
      { timestamp: '-4h', health: Math.min(70, currentScore + 1) },
      { timestamp: 'Now', health: currentScore }
    ];
  }
  if (range === '7d') {
    return [
      { timestamp: 'Day -6', health: 89 },
      { timestamp: 'Day -5', health: 86 },
      { timestamp: 'Day -4', health: 78 },
      { timestamp: 'Day -3', health: 68 },
      { timestamp: 'Day -2', health: 56 },
      { timestamp: 'Day -1', health: Math.min(55, currentScore + 5) },
      { timestamp: 'Today', health: currentScore }
    ];
  }
  return [
    { timestamp: 'Wk -4', health: 95 },
    { timestamp: 'Wk -3', health: 92 },
    { timestamp: 'Wk -2', health: 83 },
    { timestamp: 'Wk -1', health: 64 },
    { timestamp: 'Now', health: currentScore }
  ];
}

// Generate smooth cubic bezier SVG path
function getSmoothSplinePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const controlX = (current.x + next.x) / 2;
    path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
  }
  return path;
}

export const HealthTrendChart: React.FC<HealthTrendChartProps> = ({
  trendData,
  currentScore
}) => {
  const [selectedRange, setSelectedRange] = useState<'24h' | '7d' | '30d'>('7d');

  const points = useMemo(() => {
    if (trendData?.[selectedRange] && trendData[selectedRange]!.length > 0) {
      return trendData[selectedRange]!;
    }
    return generateRealisticTrend(currentScore, selectedRange);
  }, [trendData, selectedRange, currentScore]);

  const svgWidth = 600;
  const svgHeight = 200;
  const padding = { top: 20, right: 30, bottom: 35, left: 45 };

  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  const minY = 0;
  const maxY = 100;

  const getX = (index: number) => {
    if (points.length <= 1) return padding.left + chartWidth / 2;
    return padding.left + (index / (points.length - 1)) * chartWidth;
  };

  const getY = (value: number) => {
    return padding.top + chartHeight - ((value - minY) / (maxY - minY)) * chartHeight;
  };

  const coords = points.map((pt, idx) => ({
    x: getX(idx),
    y: getY(pt.health),
    health: pt.health,
    timestamp: pt.timestamp
  }));

  const smoothPathD = getSmoothSplinePath(coords);

  const areaD = coords.length > 0
    ? `${smoothPathD} L ${coords[coords.length - 1].x} ${getY(0)} L ${coords[0].x} ${getY(0)} Z`
    : '';

  const { color: scoreColor } = getHealthScoreColor(currentScore);

  return (
    <div className="tech-card" style={{ width: '100%' }}>
      <div className="tech-card-header" style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={15} />
          <span className="tech-card-title">HEALTH DEGRADATION & DRIFT TREND</span>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          {(['24h', '7d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              style={{
                padding: '3px 8px',
                fontSize: '10.5px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid var(--border-strong)',
                backgroundColor: selectedRange === range ? 'var(--bg-dark)' : 'var(--bg-card)',
                color: selectedRange === range ? 'var(--text-inverted)' : 'var(--text-primary)'
              }}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="tech-card-body" style={{ padding: '14px' }}>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          >
            {/* Critical Danger Zone (<60%) */}
            <rect
              x={padding.left}
              y={getY(60)}
              width={chartWidth}
              height={getY(0) - getY(60)}
              fill="rgba(220, 38, 38, 0.05)"
            />

            {/* Warning Zone (60-85%) */}
            <rect
              x={padding.left}
              y={getY(85)}
              width={chartWidth}
              height={getY(60) - getY(85)}
              fill="rgba(217, 119, 6, 0.04)"
            />

            {/* Gridlines */}
            {[0, 25, 50, 75, 100].map((val) => (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={getY(val)}
                  x2={padding.left + chartWidth}
                  y2={getY(val)}
                  stroke="var(--border-light)"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={getY(val) + 4}
                  textAnchor="end"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                  fill="var(--text-muted)"
                >
                  {val}%
                </text>
              </g>
            ))}

            <defs>
              <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={scoreColor} stopOpacity="0.28" />
                <stop offset="100%" stopColor={scoreColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Shaded Area Under Curve */}
            <path d={areaD} fill="url(#healthGradient)" />

            {/* Smooth Spline Line */}
            <path
              d={smoothPathD}
              fill="none"
              stroke={scoreColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points */}
            {coords.map((pt, i) => {
              const isLast = i === coords.length - 1;
              return (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isLast ? 5 : 3.5}
                    fill={isLast ? 'var(--bg-dark)' : scoreColor}
                    stroke="var(--bg-card)"
                    strokeWidth="1.5"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 8}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="700"
                    fontFamily="var(--font-sans)"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                    fill="var(--text-primary)"
                  >
                    {pt.health}
                  </text>
                  <text
                    x={pt.x}
                    y={padding.top + chartHeight + 18}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontFamily="var(--font-mono)"
                    fill="var(--text-secondary)"
                  >
                    {pt.timestamp}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '10px',
            paddingTop: '8px',
            borderTop: '1px solid var(--border-light)',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)'
          }}
        >
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent-green)' }} />
              Nominal (85–100%)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent-amber)' }} />
              Warning (60–84%)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent-red)' }} />
              Critical (&lt;60%)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
            <Info size={12} />
            <span>Dynamic edge degradation curve</span>
          </div>
        </div>
      </div>
    </div>
  );
};
