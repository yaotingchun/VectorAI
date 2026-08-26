import React, { useState } from 'react';
import { TrendTimeRange, OeeTrendDataPoint } from '../../types/dashboard';
import {
  Gauge,
  TrendingUp,
  TrendingDown,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface OeeTrendChartProps {
  trends: Record<TrendTimeRange, OeeTrendDataPoint[]>;
}

export const OeeTrendChart: React.FC<OeeTrendChartProps> = ({ trends }) => {
  const [timeRange, setTimeRange] = useState<TrendTimeRange>('7D');
  const [activeMetric, setActiveMetric] = useState<'composite' | 'availability' | 'performance' | 'quality'>('composite');
  const [hoveredPoint, setHoveredPoint] = useState<OeeTrendDataPoint | null>(null);

  const currentData = trends[timeRange] || [];

  // SVG parameters
  const minVal = 80;
  const maxVal = 100;
  const chartHeight = 150;
  const chartWidth = 500;
  const paddingX = 40;
  const paddingY = 20;

  const getMetricValue = (p: OeeTrendDataPoint) => {
    switch (activeMetric) {
      case 'availability': return p.availability;
      case 'performance': return p.performance;
      case 'quality': return p.quality;
      case 'composite':
      default:
        return p.oee;
    }
  };

  const getMetricColor = () => {
    switch (activeMetric) {
      case 'availability': return 'var(--accent-cyan)';
      case 'performance': return 'var(--accent-purple)';
      case 'quality': return 'var(--accent-green)';
      case 'composite':
      default:
        return 'var(--accent-blue)';
    }
  };

  const getCoordinates = (points: OeeTrendDataPoint[]) => {
    if (!points || points.length === 0) return [];
    const usableWidth = chartWidth - paddingX * 2;
    const usableHeight = chartHeight - paddingY * 2;

    return points.map((p, idx) => {
      const x = paddingX + (idx / Math.max(1, points.length - 1)) * usableWidth;
      const val = getMetricValue(p);
      const normalizedY = (val - minVal) / (maxVal - minVal);
      const y = chartHeight - paddingY - normalizedY * usableHeight;
      return { x, y, point: p, val };
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
  const firstVal = currentData[0] ? getMetricValue(currentData[0]) : 0;
  const lastVal = currentData[currentData.length - 1] ? getMetricValue(currentData[currentData.length - 1]) : 0;
  const delta = (lastVal - firstVal).toFixed(1);
  const isImproving = lastVal >= firstVal;

  const currentOee = currentData[currentData.length - 1]?.oee ?? 89.6;
  const currentAvailability = currentData[currentData.length - 1]?.availability ?? 94.2;
  const currentPerformance = currentData[currentData.length - 1]?.performance ?? 96.1;
  const currentQuality = currentData[currentData.length - 1]?.quality ?? 98.9;

  // 85% Benchmark line Y
  const benchmarkY = chartHeight - paddingY - ((85 - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);

  return (
    <section className="tech-card" aria-label="OEE Production Efficiency Trend">
      <span className="corner-tl">+</span>
      <span className="corner-tr">+</span>
      <span className="corner-bl">+</span>
      <span className="corner-br">+</span>

      <div className="tech-card-header">
        <div className="tech-card-title">
          <Gauge size={16} color="var(--accent-blue)" />
          <span>OEE &amp; Production Efficiency Trend</span>
        </div>

        {/* Time-range toggles */}
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
        {/* Metric Selector & Summary Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          {/* Sub-metric selector pills */}
          <div className="oee-metric-toggles">
            <button
              type="button"
              onClick={() => setActiveMetric('composite')}
              className={`oee-toggle-btn ${activeMetric === 'composite' ? 'active-comp' : ''}`}
            >
              Composite OEE ({currentOee.toFixed(1)}%)
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('availability')}
              className={`oee-toggle-btn ${activeMetric === 'availability' ? 'active-avail' : ''}`}
            >
              Avail ({currentAvailability.toFixed(1)}%)
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('performance')}
              className={`oee-toggle-btn ${activeMetric === 'performance' ? 'active-perf' : ''}`}
            >
              Perf ({currentPerformance.toFixed(1)}%)
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('quality')}
              className={`oee-toggle-btn ${activeMetric === 'quality' ? 'active-qual' : ''}`}
            >
              Qual ({currentQuality.toFixed(1)}%)
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              className="status-pill"
              style={{
                borderColor: isImproving ? 'var(--accent-green)' : 'var(--accent-amber)',
                backgroundColor: isImproving ? '#F0FDF4' : '#FFFBEB',
                color: isImproving ? '#166534' : '#B45309',
                fontSize: '10px',
                padding: '2px 6px',
              }}
            >
              {isImproving ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              <span>{isImproving ? '+' : ''}{delta}% vs period start</span>
            </span>
          </div>
        </div>

        {/* Interactive SVG Chart */}
        <div className="trend-chart-container" style={{ position: 'relative' }}>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="trend-svg">
            <defs>
              <linearGradient id="oeeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* 95% Reference Guide */}
            <line
              x1={paddingX}
              y1={chartHeight - paddingY - ((95 - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2)}
              x2={chartWidth - paddingX}
              y2={chartHeight - paddingY - ((95 - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2)}
              stroke="var(--border-light)"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
            <text
              x={paddingX - 6}
              y={chartHeight - paddingY - ((95 - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2) + 3}
              fontSize="8"
              fill="var(--text-muted)"
              fontFamily="var(--font-mono)"
              textAnchor="end"
            >
              95%
            </text>

            {/* 85% World Class Benchmark Line */}
            <line
              x1={paddingX}
              y1={benchmarkY}
              x2={chartWidth - paddingX}
              y2={benchmarkY}
              stroke="rgba(16, 185, 129, 0.6)"
              strokeDasharray="4 3"
              strokeWidth="1.2"
            />
            <text
              x={paddingX - 6}
              y={benchmarkY + 3}
              fontSize="8"
              fill="var(--accent-green)"
              fontFamily="var(--font-mono)"
              textAnchor="end"
            >
              85%
            </text>

            {/* Area Under Fill */}
            <path d={areaD} fill="url(#oeeGradient)" />

            {/* Main Line */}
            <path
              d={pathD}
              fill="none"
              stroke={getMetricColor()}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Circles */}
            {coords.map((c, i) => (
              <g key={i}>
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={hoveredPoint?.timestamp === c.point.timestamp ? 5 : 3.5}
                  fill={hoveredPoint?.timestamp === c.point.timestamp ? '#FFFFFF' : getMetricColor()}
                  stroke="var(--bg-dark)"
                  strokeWidth="2"
                  style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                  onMouseEnter={() => setHoveredPoint(c.point)}
                />
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

          {/* Hover Tooltip */}
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
                zIndex: 10,
              }}
            >
              <div style={{ fontWeight: 800, color: 'var(--accent-blue)' }}>{hoveredPoint.label} OEE Telemetry</div>
              <div>Composite OEE: <strong>{hoveredPoint.oee.toFixed(1)}%</strong></div>
              <div style={{ color: 'var(--accent-cyan)' }}>Availability: {hoveredPoint.availability.toFixed(1)}%</div>
              <div style={{ color: 'var(--accent-purple)' }}>Performance: {hoveredPoint.performance.toFixed(1)}%</div>
              <div style={{ color: 'var(--accent-green)' }}>Quality Yield: {hoveredPoint.quality.toFixed(1)}%</div>
            </div>
          )}
        </div>

        {/* Legend strip */}
        <div className="trend-stat-pills">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '2px', backgroundColor: getMetricColor() }} />
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              {activeMetric === 'composite' ? 'Composite Overall Equipment Effectiveness' : activeMetric.toUpperCase()}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '1px', borderTop: '1px dashed var(--accent-green)' }} />
            <span style={{ fontSize: '10px', color: 'var(--accent-green)' }}>85% World-Class OEE Benchmark</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OeeTrendChart;
