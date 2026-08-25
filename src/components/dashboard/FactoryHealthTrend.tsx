import React, { useState } from 'react';
import { TrendTimeRange, TrendDataPoint } from '../../types/dashboard';
import {
  TrendingUp,
  TrendingDown,
  LineChart,
} from 'lucide-react';

interface FactoryHealthTrendProps {
  trends: Record<TrendTimeRange, TrendDataPoint[]>;
}

export const FactoryHealthTrend: React.FC<FactoryHealthTrendProps> = ({ trends }) => {
  const [timeRange, setTimeRange] = useState<TrendTimeRange>('7D');
  const [hoveredPoint, setHoveredPoint] = useState<TrendDataPoint | null>(null);

  const currentData = trends[timeRange];

  // Calculate SVG chart coordinates
  const minVal = 70;
  const maxVal = 100;
  const chartHeight = 150;
  const chartWidth = 500;
  const paddingX = 40;
  const paddingY = 20;

  const getCoordinates = (points: TrendDataPoint[]) => {
    const usableWidth = chartWidth - paddingX * 2;
    const usableHeight = chartHeight - paddingY * 2;

    return points.map((p, idx) => {
      const x = paddingX + (idx / (points.length - 1)) * usableWidth;
      const normalizedY = (p.factoryHealth - minVal) / (maxVal - minVal);
      const y = chartHeight - paddingY - normalizedY * usableHeight;
      return { x, y, point: p };
    });
  };

  const coords = getCoordinates(currentData);
  const pathD = coords.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = coords.length > 0
    ? `${pathD} L ${coords[coords.length - 1].x} ${chartHeight - paddingY} L ${coords[0].x} ${chartHeight - paddingY} Z`
    : '';

  // Trend analysis
  const firstVal = currentData[0]?.factoryHealth ?? 0;
  const lastVal = currentData[currentData.length - 1]?.factoryHealth ?? 0;
  const delta = (lastVal - firstVal).toFixed(1);
  const isImproving = lastVal > firstVal;
  const isStable = Math.abs(lastVal - firstVal) < 1.0;

  const trendStatus = isStable ? 'STABLE' : isImproving ? 'IMPROVING' : 'DEGRADING';

  return (
    <section className="tech-card" aria-label="Factory Health Trend Chart">
      <span className="corner-tl">+</span>
      <span className="corner-tr">+</span>
      <span className="corner-bl">+</span>
      <span className="corner-br">+</span>

      <div className="tech-card-header">
        <div className="tech-card-title">
          <LineChart size={16} />
          <span>Aggregated Factory Health Trend</span>
        </div>

        {/* Time-range toggles: 24 Hours, 7 Days, 30 Days */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          {(['24H', '7D', '30D'] as const).map((range) => (
            <button
              key={range}
              onClick={() => {
                setTimeRange(range);
                setHoveredPoint(null);
              }}
              className={`filter-badge-btn ${timeRange === range ? 'active' : ''}`}
              style={{ padding: '3px 8px', fontSize: '10px' }}
            >
              {range === '24H' ? '24 Hours' : range === '7D' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      <div className="tech-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Top Summary Banner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Trajectory:
            </span>
            <span
              className="status-pill"
              style={{
                borderColor: isStable ? 'var(--border-strong)' : isImproving ? 'var(--accent-green)' : 'var(--accent-amber)',
                backgroundColor: isStable ? 'var(--bg-surface)' : isImproving ? '#F0FDF4' : '#FFFBEB',
                color: isStable ? 'inherit' : isImproving ? '#166534' : '#B45309',
              }}
            >
              {isImproving ? <TrendingUp size={11} /> : isStable ? null : <TrendingDown size={11} />}
              <span>{trendStatus} ({delta >= '0' ? `+${delta}` : delta} pts)</span>
            </span>
          </div>

          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            CURRENT: <strong style={{ color: 'var(--text-primary)' }}>{lastVal.toFixed(1)} / 100</strong>
          </div>
        </div>

        {/* Interactive SVG Chart */}
        <div className="trend-chart-container" style={{ position: 'relative' }}>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="trend-svg">
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#121315" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#121315" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Threshold Guide Lines */}
            {/* 90 Index Guide */}
            <line
              x1={paddingX}
              y1={chartHeight - paddingY - ((90 - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2)}
              x2={chartWidth - paddingX}
              y2={chartHeight - paddingY - ((90 - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2)}
              stroke="var(--border-light)"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
            <text
              x={paddingX - 6}
              y={chartHeight - paddingY - ((90 - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2) + 3}
              fontSize="8"
              fill="var(--text-muted)"
              fontFamily="var(--font-mono)"
              textAnchor="end"
            >
              90
            </text>

            {/* 80 Index Guide (Warning Level) */}
            <line
              x1={paddingX}
              y1={chartHeight - paddingY - ((80 - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2)}
              x2={chartWidth - paddingX}
              y2={chartHeight - paddingY - ((80 - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2)}
              stroke="rgba(217, 119, 6, 0.4)"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
            <text
              x={paddingX - 6}
              y={chartHeight - paddingY - ((80 - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2) + 3}
              fontSize="8"
              fill="var(--accent-amber)"
              fontFamily="var(--font-mono)"
              textAnchor="end"
            >
              80
            </text>

            {/* Area Fill */}
            <path d={areaD} fill="url(#trendGradient)" />

            {/* Main Trend Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#121315"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points */}
            {coords.map((c, i) => (
              <g key={i}>
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={hoveredPoint?.timestamp === c.point.timestamp ? 5 : 3.5}
                  fill={hoveredPoint?.timestamp === c.point.timestamp ? 'var(--accent-amber)' : 'var(--bg-card)'}
                  stroke="#121315"
                  strokeWidth="2"
                  style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                  onMouseEnter={() => setHoveredPoint(c.point)}
                />
                {/* X Axis Label */}
                <text
                  x={c.x}
                  y={chartHeight - 4}
                  fontSize="8.5"
                  fill="var(--text-secondary)"
                  fontFamily="var(--font-mono)"
                  textAnchor="middle"
                >
                  {c.point.label}
                </text>
              </g>
            ))}
          </svg>

          {/* Hover Tooltip Card */}
          {hoveredPoint && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'var(--bg-dark)',
                color: 'var(--text-inverted)',
                padding: '6px 10px',
                border: '1px solid var(--border-strong)',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                pointerEvents: 'none',
                boxShadow: '2px 2px 0px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ fontWeight: 800 }}>{hoveredPoint.label} Telemetry</div>
              <div>Health: {hoveredPoint.factoryHealth.toFixed(1)} / 100</div>
              <div style={{ color: '#86EFAC' }}>Healthy: {hoveredPoint.healthyCount}</div>
              <div style={{ color: '#FDE047' }}>Warning: {hoveredPoint.warningCount}</div>
              <div style={{ color: '#FCA5A5' }}>Critical: {hoveredPoint.criticalCount}</div>
            </div>
          )}
        </div>

        {/* Legend / Info Strip */}
        <div className="trend-stat-pills">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '2px', backgroundColor: '#121315' }} />
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Aggregated Fleet Health Index</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '1px', borderTop: '1px dashed var(--accent-amber)' }} />
            <span style={{ fontSize: '10px', color: 'var(--accent-amber)' }}>80 Pt Warning Threshold</span>
          </div>
        </div>
      </div>
    </section>
  );
};
