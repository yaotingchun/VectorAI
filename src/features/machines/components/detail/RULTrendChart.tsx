import React, { useState, useMemo } from 'react';
import { Machine } from '../../types/machine';
import { Clock, Info } from 'lucide-react';
import { getMachineRulCalculation } from '../../services/machineApi';

interface RULTrendChartProps {
  machine: Machine;
}

interface RulPoint {
  timestamp: string;
  hours: number;
  isFuture?: boolean;
}

// Generate deterministic RUL trajectory points based on machine RUL and health
function generateRulTrajectory(machine: Machine, range: '24h' | '7d' | '30d'): RulPoint[] {
  const detailedRul = getMachineRulCalculation(machine);
  const currentRul = detailedRul?.rulHours ?? machine.rul.value;
  const baseLife = detailedRul?.baseUsefulLifeHours ?? 1500;
  const isCritical = currentRul <= 80 || machine.healthScore < 60;
  const isWarning = currentRul <= 250 || machine.healthScore < 80;

  // Daily decay rate (nominal ~24h of life per calendar day under normal wear; accelerated under high friction/temp)
  const accelerationFactor = isCritical ? 2.8 : isWarning ? 1.6 : 1.0;
  const hourlyBurnRate = accelerationFactor;

  if (range === '24h') {
    const pts: RulPoint[] = [];
    const stepHours = 4;
    // 6 historical points (-24h to Now)
    for (let h = 24; h >= 0; h -= stepHours) {
      const pastRul = Math.min(baseLife, Math.round(currentRul + h * hourlyBurnRate));
      pts.push({
        timestamp: h === 0 ? 'Now' : `−${h}h`,
        hours: Math.max(0, pastRul),
        isFuture: false
      });
    }
    // 3 future projected points (+4h, +8h, +12h)
    for (let h = stepHours; h <= 16; h += stepHours) {
      const futureRul = Math.max(0, Math.round(currentRul - h * hourlyBurnRate));
      pts.push({
        timestamp: `+${h}h`,
        hours: futureRul,
        isFuture: true
      });
    }
    return pts;
  }

  if (range === '7d') {
    const pts: RulPoint[] = [];
    // 7 past days
    for (let d = 6; d >= 1; d--) {
      const pastRul = Math.min(baseLife, Math.round(currentRul + d * 24 * hourlyBurnRate));
      pts.push({
        timestamp: `Day −${d}`,
        hours: Math.max(0, pastRul),
        isFuture: false
      });
    }
    // Now
    pts.push({
      timestamp: 'Today',
      hours: currentRul,
      isFuture: false
    });
    // 4 future projected days
    for (let d = 1; d <= 4; d++) {
      const futureRul = Math.max(0, Math.round(currentRul - d * 24 * hourlyBurnRate));
      pts.push({
        timestamp: `+${d}d`,
        hours: futureRul,
        isFuture: true
      });
    }
    return pts;
  }

  // 30d range
  const pts: RulPoint[] = [];
  for (let w = 4; w >= 1; w--) {
    const pastRul = Math.min(baseLife, Math.round(currentRul + w * 7 * 24 * hourlyBurnRate));
    pts.push({
      timestamp: `Wk −${w}`,
      hours: Math.max(0, pastRul),
      isFuture: false
    });
  }
  pts.push({
    timestamp: 'Now',
    hours: currentRul,
    isFuture: false
  });
  for (let w = 1; w <= 3; w++) {
    const futureRul = Math.max(0, Math.round(currentRul - w * 7 * 24 * hourlyBurnRate));
    pts.push({
      timestamp: `+${w}wk`,
      hours: futureRul,
      isFuture: true
    });
  }
  return pts;
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

export const RULTrendChart: React.FC<RULTrendChartProps> = ({ machine }) => {
  const [selectedRange, setSelectedRange] = useState<'24h' | '7d' | '30d'>('7d');

  const detailedRul = useMemo(() => getMachineRulCalculation(machine), [machine]);
  const currentRul = detailedRul?.rulHours ?? machine.rul.value;
  const criticalThreshold = 80;

  const points = useMemo(() => {
    return generateRulTrajectory(machine, selectedRange);
  }, [machine, selectedRange]);

  const maxVal = useMemo(() => {
    const maxHour = Math.max(...points.map(p => p.hours), criticalThreshold * 2);
    return Math.ceil(maxHour / 100) * 100;
  }, [points, criticalThreshold]);

  const svgWidth = 600;
  const svgHeight = 200;
  const padding = { top: 20, right: 30, bottom: 35, left: 52 };

  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  const minY = 0;
  const maxY = maxVal;

  const getX = (index: number) => {
    if (points.length <= 1) return padding.left + chartWidth / 2;
    return padding.left + (index / (points.length - 1)) * chartWidth;
  };

  const getY = (value: number) => {
    return padding.top + chartHeight - ((Math.max(0, Math.min(maxY, value)) - minY) / (maxY - minY)) * chartHeight;
  };

  // Map coordinates
  const allCoords = points.map((pt, idx) => ({
    x: getX(idx),
    y: getY(pt.hours),
    hours: pt.hours,
    timestamp: pt.timestamp,
    isFuture: pt.isFuture
  }));

  const nowIndex = points.findIndex(p => p.timestamp === 'Today' || p.timestamp === 'Now');
  const nowCoord = nowIndex >= 0 ? allCoords[nowIndex] : allCoords[allCoords.length - 1];

  const histCoords = allCoords.slice(0, (nowIndex >= 0 ? nowIndex + 1 : allCoords.length));
  const projCoords = allCoords.slice(nowIndex >= 0 ? nowIndex : 0);

  const histPathD = getSmoothSplinePath(histCoords);
  const projPathD = getSmoothSplinePath(projCoords);

  const areaD = histCoords.length > 0
    ? `${histPathD} L ${histCoords[histCoords.length - 1].x} ${getY(0)} L ${histCoords[0].x} ${getY(0)} Z`
    : '';

  const isCritical = currentRul <= criticalThreshold;
  const isWarning = currentRul <= 250;
  const rulColor = isCritical ? 'var(--accent-red)' : isWarning ? 'var(--accent-amber)' : 'var(--accent-green)';
  const rulBgColor = isCritical ? 'rgba(220, 38, 38, 0.12)' : isWarning ? 'rgba(217, 119, 6, 0.12)' : 'rgba(22, 163, 74, 0.12)';

  // Y-axis grid ticks (4 intervals)
  const yTicks = [0, Math.round(maxY * 0.33), Math.round(maxY * 0.66), maxY];

  return (
    <div className="tech-card" style={{ width: '100%' }}>
      <div className="tech-card-header" style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={15} style={{ color: rulColor }} />
          <span className="tech-card-title">REMAINING USEFUL LIFE (RUL) TRAJECTORY</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              color: rulColor,
              backgroundColor: rulBgColor,
              border: `1px solid ${rulColor}`,
              padding: '2px 8px'
            }}
          >
            CURRENT: {currentRul.toLocaleString()}h (~{machine.rul.estimatedDays}d)
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
      </div>

      <div className="tech-card-body" style={{ padding: '14px' }}>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          >
            {/* Critical Limit Zone (Below 80h) */}
            <rect
              x={padding.left}
              y={getY(criticalThreshold)}
              width={chartWidth}
              height={getY(0) - getY(criticalThreshold)}
              fill="rgba(220, 38, 38, 0.08)"
            />

            {/* Threshold Line at Critical Limit (80h) */}
            <line
              x1={padding.left}
              y1={getY(criticalThreshold)}
              x2={padding.left + chartWidth}
              y2={getY(criticalThreshold)}
              stroke="var(--accent-red)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text
              x={padding.left + chartWidth - 6}
              y={getY(criticalThreshold) - 5}
              textAnchor="end"
              fontSize="9"
              fontWeight="800"
              fontFamily="var(--font-mono)"
              fill="var(--accent-red)"
            >
              CRITICAL LIMIT: {criticalThreshold}h
            </text>

            {/* Gridlines */}
            {yTicks.map((val) => (
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
                  {val}h
                </text>
              </g>
            ))}

            <defs>
              <linearGradient id="rulGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={rulColor} stopOpacity="0.25" />
                <stop offset="100%" stopColor={rulColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Shaded Area Under Historical Curve */}
            <path d={areaD} fill="url(#rulGradient)" />

            {/* Historical RUL Curve (Solid) */}
            <path
              d={histPathD}
              fill="none"
              stroke={rulColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Forward Projected RUL Curve (Dashed) */}
            {projCoords.length > 1 && (
              <path
                d={projPathD}
                fill="none"
                stroke="var(--accent-red)"
                strokeWidth="2"
                strokeDasharray="5 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Divider Line at "Now" */}
            {nowCoord && (
              <line
                x1={nowCoord.x}
                y1={padding.top}
                x2={nowCoord.x}
                y2={padding.top + chartHeight}
                stroke="var(--border-strong)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity={0.6}
              />
            )}

            {/* Data Points */}
            {allCoords.map((pt, i) => {
              const isNow = pt.timestamp === 'Today' || pt.timestamp === 'Now';
              const pointColor = pt.isFuture ? 'var(--accent-red)' : rulColor;

              return (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isNow ? 5.5 : pt.isFuture ? 3 : 3.5}
                    fill={isNow ? 'var(--bg-dark)' : pointColor}
                    stroke={isNow ? rulColor : 'var(--bg-card)'}
                    strokeWidth={isNow ? 2 : 1.5}
                    style={isNow ? { filter: `drop-shadow(0 0 4px ${rulColor})` } : undefined}
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 8}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight={isNow ? '800' : '600'}
                    fontFamily="var(--font-mono)"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                    fill={isNow ? rulColor : 'var(--text-primary)'}
                  >
                    {pt.hours}h
                  </text>
                  <text
                    x={pt.x}
                    y={padding.top + chartHeight + 18}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight={isNow ? '800' : '500'}
                    fontFamily="var(--font-mono)"
                    fill={isNow ? 'var(--text-primary)' : 'var(--text-secondary)'}
                  >
                    {pt.timestamp}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Bottom Legend & Meta */}
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
            color: 'var(--text-secondary)',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '12px', height: '3px', backgroundColor: rulColor }} />
              Historical Operation Decay
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '12px', height: '2px', borderTop: '2px dashed var(--accent-red)' }} />
              Forward Projected Trajectory
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: 'rgba(220, 38, 38, 0.2)', border: '1px solid var(--accent-red)' }} />
              Critical Boundary (&le;{criticalThreshold}h)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
            <Info size={12} />
            <span>Deterministic RUL (No-ML) · Base: {detailedRul?.baseUsefulLifeHours || 1500}h</span>
          </div>
        </div>
      </div>
    </div>
  );
};
