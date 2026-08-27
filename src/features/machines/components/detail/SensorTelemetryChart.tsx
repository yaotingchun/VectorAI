import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SensorReading } from '../../types/machine';
import { MachineSensorThreshold } from '../../intelligence';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export type TelemetryRange = '60s' | '1h' | '24h' | '7d' | '30d';

export interface TelemetryPoint {
  timestamp: string;
  value: number;
  isAnomaly?: boolean;
}

interface SensorTelemetryChartProps {
  sensor: SensorReading;
  thresholdDef?: MachineSensorThreshold;
  range?: TelemetryRange;
  onRangeChange?: (range: TelemetryRange) => void;
  isLiveStreaming?: boolean;
  compact?: boolean;
  height?: number;
  showControls?: boolean;
  showStats?: boolean;
}

// Generate realistic industrial telemetry historical waveforms based on sensor characteristics and state
function generateTelemetryHistory(
  sensor: SensorReading,
  thresholdDef: MachineSensorThreshold | undefined,
  range: TelemetryRange
): TelemetryPoint[] {
  const current = sensor.value;
  const isCrit = sensor.status === 'critical';
  const isWarn = sensor.status === 'warning';

  const normalMin = thresholdDef?.normal.min ?? (current < 0 ? current * 1.15 : current * 0.9);
  const normalMax = thresholdDef?.normal.max ?? (current < 0 ? current * 0.85 : current * 1.1);
  const normalMid = (normalMin + normalMax) / 2;

  const getNoise = (scale: number) => (Math.random() - 0.5) * Math.abs(scale);
  const decimals = sensor.value % 1 === 0 ? 0 : Math.abs(sensor.value) < 1 ? 2 : Math.abs(sensor.value) < 10 ? 2 : 1;

  if (range === '60s') {
    const count = 13;
    const points: TelemetryPoint[] = [];
    for (let i = 0; i < count; i++) {
      const secAgo = (count - 1 - i) * 5;
      const timeLabel = secAgo === 0 ? 'Now' : `-${secAgo}s`;
      let val = current;
      if (secAgo > 0) {
        if (isCrit) {
          val = current - (secAgo / 60) * (current - normalMid) * 0.15 + getNoise(Math.abs(current) * 0.03);
        } else if (isWarn) {
          val = current - (secAgo / 60) * (current - normalMid) * 0.1 + getNoise(Math.abs(current) * 0.02);
        } else {
          val = current + getNoise(Math.max(Math.abs(current) * 0.015, 0.02));
        }
      }
      points.push({
        timestamp: timeLabel,
        value: Number(val.toFixed(decimals)),
        isAnomaly: isCrit && secAgo <= 10
      });
    }
    return points;
  }

  if (range === '1h') {
    const timestamps = ['-60m', '-45m', '-30m', '-15m', 'Now'];
    return timestamps.map((t, idx) => {
      const progress = idx / (timestamps.length - 1);
      let val = normalMid;
      if (isCrit) {
        val = normalMid + progress * (current - normalMid) + getNoise(Math.abs(current) * 0.025);
      } else if (isWarn) {
        val = normalMid + progress * (current - normalMid) + getNoise(Math.abs(current) * 0.015);
      } else {
        val = normalMid + getNoise(Math.max(Math.abs(normalMax - normalMin) * 0.12, 0.03));
      }
      if (t === 'Now') val = current;
      return {
        timestamp: t,
        value: Number(val.toFixed(decimals)),
        isAnomaly: isCrit && idx >= timestamps.length - 2
      };
    });
  }

  if (range === '24h') {
    const timestamps = ['-24h', '-18h', '-12h', '-6h', 'Now'];
    return timestamps.map((t, idx) => {
      const progress = idx / (timestamps.length - 1);
      let val = normalMid;
      if (isCrit) {
        const curve = Math.pow(progress, 2.0);
        val = normalMid + curve * (current - normalMid) + getNoise(Math.abs(current) * 0.02);
      } else if (isWarn) {
        const curve = Math.pow(progress, 1.5);
        val = normalMid + curve * (current - normalMid) + getNoise(Math.abs(current) * 0.015);
      } else {
        val = normalMid + Math.sin(idx * 1.2) * Math.abs(normalMax - normalMin) * 0.08 + getNoise(0.02);
      }
      if (t === 'Now') val = current;
      return {
        timestamp: t,
        value: Number(val.toFixed(decimals)),
        isAnomaly: isCrit && idx >= timestamps.length - 2
      };
    });
  }

  if (range === '7d') {
    const timestamps = ['-6d', '-4d', '-2d', '-1d', 'Today'];
    return timestamps.map((t, idx) => {
      const progress = idx / (timestamps.length - 1);
      let val = normalMid;
      if (isCrit) {
        val = normalMid + Math.pow(progress, 2.4) * (current - normalMid) + getNoise(Math.abs(current) * 0.03);
      } else if (isWarn) {
        val = normalMid + Math.pow(progress, 1.8) * (current - normalMid) + getNoise(Math.abs(current) * 0.015);
      } else {
        val = normalMid + Math.sin(idx * 0.9) * Math.abs(normalMax - normalMin) * 0.08 + getNoise(0.02);
      }
      if (t === 'Today') val = current;
      return {
        timestamp: t,
        value: Number(val.toFixed(decimals)),
        isAnomaly: isCrit && idx >= 3
      };
    });
  }

  // 30d
  const timestamps = ['-4w', '-3w', '-2w', '-1w', 'Now'];
  return timestamps.map((t, idx) => {
    const progress = idx / (timestamps.length - 1);
    let val = normalMid;
    if (isCrit) {
      val = normalMid + Math.pow(progress, 2.8) * (current - normalMid);
    } else if (isWarn) {
      val = normalMid + Math.pow(progress, 2.0) * (current - normalMid);
    } else {
      val = normalMid + getNoise(Math.max(Math.abs(normalMax - normalMin) * 0.06, 0.02));
    }
    if (t === 'Now') val = current;
    return {
      timestamp: t,
      value: Number(val.toFixed(decimals)),
      isAnomaly: isCrit && idx >= 3
    };
  });
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

export const SensorTelemetryChart: React.FC<SensorTelemetryChartProps> = ({
  sensor,
  thresholdDef,
  range = '24h',
  onRangeChange,
  isLiveStreaming = true,
  compact = false,
  height = 140,
  showControls = false,
  showStats = true
}) => {
  const [internalRange, setInternalRange] = useState<TelemetryRange>(range);
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    point: TelemetryPoint;
    index: number;
  } | null>(null);

  const [liveJitter, setLiveJitter] = useState<number>(0);
  const activeRange = onRangeChange ? range : internalRange;

  // Real-time jitter simulator for active live view
  useEffect(() => {
    if (!isLiveStreaming || activeRange !== '60s') return;
    const interval = setInterval(() => {
      setLiveJitter((Math.random() - 0.5) * (Math.abs(sensor.value) * 0.015 || 0.04));
    }, 1500);
    return () => clearInterval(interval);
  }, [isLiveStreaming, activeRange, sensor.value]);

  const handleSelectRange = (r: TelemetryRange) => {
    if (onRangeChange) {
      onRangeChange(r);
    } else {
      setInternalRange(r);
    }
  };

  // Base raw telemetry points
  const points = useMemo<TelemetryPoint[]>(() => {
    if (sensor.history && sensor.history.length >= 4 && activeRange === '24h') {
      return sensor.history.map((h) => ({
        timestamp: h.timestamp,
        value: h.value,
        isAnomaly: false
      }));
    }
    const generated = generateTelemetryHistory(sensor, thresholdDef, activeRange);
    if (activeRange === '60s' && liveJitter !== 0 && generated.length > 0) {
      const lastIdx = generated.length - 1;
      const decimals = sensor.value % 1 === 0 ? 0 : Math.abs(sensor.value) < 1 ? 2 : Math.abs(sensor.value) < 10 ? 2 : 1;
      generated[lastIdx].value = Number((generated[lastIdx].value + liveJitter).toFixed(decimals));
    }
    return generated;
  }, [sensor, thresholdDef, activeRange, liveJitter]);

  // Statistics
  const { minVal, maxVal, avgVal, driftRate, driftDirection } = useMemo(() => {
    if (points.length === 0) {
      return { minVal: sensor.value, maxVal: sensor.value, avgVal: sensor.value, driftRate: '0.0', driftDirection: 'flat' as const };
    }
    const values = points.map((p) => p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;

    const first = points[0].value;
    const last = points[points.length - 1].value;
    const delta = last - first;
    const decimals = sensor.value % 1 === 0 ? 0 : Math.abs(sensor.value) < 1 ? 2 : 2;
    const deltaRate = Number(delta.toFixed(decimals));
    const dir = deltaRate > 0.005 ? 'up' : deltaRate < -0.005 ? 'down' : 'flat';

    return {
      minVal: min,
      maxVal: max,
      avgVal: Number(avg.toFixed(decimals)),
      driftRate: `${deltaRate > 0 ? '+' : ''}${deltaRate}`,
      driftDirection: dir as 'up' | 'down' | 'flat'
    };
  }, [points, sensor.value]);

  // Threshold definitions
  const direction = thresholdDef?.direction || 'HIGHER_IS_WORSE';
  const normMin = thresholdDef?.normal.min;
  const normMax = thresholdDef?.normal.max;
  const warnVal = thresholdDef
    ? direction === 'HIGHER_IS_WORSE'
      ? thresholdDef.warning.min
      : thresholdDef.warning.max
    : undefined;
  const critVal = thresholdDef
    ? direction === 'HIGHER_IS_WORSE'
      ? thresholdDef.critical.min
      : thresholdDef.critical.max
    : undefined;

  // Smart Domain Calculation with Full Support for Negative Ranges (e.g. -100 to 0 kPa vacuum)
  const { yMin, yMax } = useMemo(() => {
    const dataVals = points.map((p) => p.value);
    const dMin = Math.min(...dataVals);
    const dMax = Math.max(...dataVals);

    let calcMin = dMin;
    let calcMax = dMax;

    if (normMin !== undefined) calcMin = Math.min(calcMin, normMin);
    if (normMax !== undefined) calcMax = Math.max(calcMax, normMax);

    if (direction === 'HIGHER_IS_WORSE') {
      if (warnVal !== undefined) {
        if (dMax < 0 && warnVal < 0) calcMax = Math.max(calcMax, warnVal);
        else if (warnVal <= dMax * 1.6) calcMax = Math.max(calcMax, warnVal);
      }
      if (critVal !== undefined) {
        if (dMax < 0 && critVal < 0) calcMax = Math.max(calcMax, critVal);
        else if (critVal <= dMax * 1.3) calcMax = Math.max(calcMax, critVal);
      }
    } else {
      if (warnVal !== undefined) {
        if (dMin < 0 && warnVal < 0) calcMin = Math.min(calcMin, warnVal);
        else if (warnVal >= dMin * 0.7) calcMin = Math.min(calcMin, warnVal);
      }
      if (critVal !== undefined) {
        if (dMin < 0 && critVal < 0) calcMin = Math.min(calcMin, critVal);
        else if (critVal >= dMin * 0.8) calcMin = Math.min(calcMin, critVal);
      }
    }

    const span = Math.max(Math.abs(calcMax - calcMin), Math.abs(calcMax) * 0.1 || 1.0);
    const isNegative = calcMin < 0 || calcMax < 0;

    return {
      yMin: isNegative
        ? Number((calcMin - span * 0.15).toFixed(2))
        : Math.max(0, Number((calcMin - span * 0.15).toFixed(2))),
      yMax: isNegative && calcMax <= 0
        ? Math.min(0, Number((calcMax + span * 0.15).toFixed(2)))
        : Number((calcMax + span * 0.18).toFixed(2))
    };
  }, [points, direction, normMin, normMax, warnVal, critVal]);

  // SVG Chart Geometry
  const svgWidth = compact ? 260 : 420;
  const svgHeight = height;
  const padding = compact
    ? { top: 10, right: 12, bottom: 18, left: 34 }
    : { top: 16, right: 38, bottom: 22, left: 40 };

  const plotW = svgWidth - padding.left - padding.right;
  const plotH = svgHeight - padding.top - padding.bottom;

  const getX = (idx: number) => {
    if (points.length <= 1) return padding.left + plotW / 2;
    return padding.left + (idx / (points.length - 1)) * plotW;
  };

  const getY = (v: number) => {
    return padding.top + plotH - ((v - yMin) / (yMax - yMin || 1)) * plotH;
  };

  const coords = points.map((pt, idx) => ({
    x: getX(idx),
    y: Math.max(padding.top - 2, Math.min(padding.top + plotH + 2, getY(pt.value))),
    point: pt,
    index: idx
  }));

  const smoothPath = getSmoothSplinePath(coords);
  const areaPath = coords.length > 0
    ? `${smoothPath} L ${coords[coords.length - 1].x} ${padding.top + plotH} L ${coords[0].x} ${padding.top + plotH} Z`
    : '';

  // Theme colors based on status
  let strokeColor = 'var(--accent-green, #16A34A)';
  if (sensor.status === 'warning') {
    strokeColor = 'var(--accent-amber, #D97706)';
  } else if (sensor.status === 'critical') {
    strokeColor = 'var(--accent-red, #DC2626)';
  }

  const gradId = `telemetry-grad-${sensor.sensorId.replace(/[^a-zA-Z0-9]/g, '_')}`;

  // Mouse hover calculation
  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || coords.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * svgWidth;

    let closest = coords[0];
    let minDistance = Math.abs(coords[0].x - mouseX);
    for (let i = 1; i < coords.length; i++) {
      const dist = Math.abs(coords[i].x - mouseX);
      if (dist < minDistance) {
        minDistance = dist;
        closest = coords[i];
      }
    }
    setHoveredPoint(closest);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  // Y-axis tick values
  const midYVal = Number(((yMin + yMax) / 2).toFixed(Math.abs(sensor.value) < 1 ? 2 : Math.abs(sensor.value) < 10 ? 1 : 0));
  const minYVal = Number(yMin.toFixed(Math.abs(sensor.value) < 1 ? 2 : Math.abs(sensor.value) < 10 ? 1 : 0));
  const maxYVal = Number(yMax.toFixed(Math.abs(sensor.value) < 1 ? 2 : Math.abs(sensor.value) < 10 ? 1 : 0));

  // Determine if threshold labels would collide
  const warnY = warnVal !== undefined ? getY(warnVal) : null;
  const critY = critVal !== undefined ? getY(critVal) : null;
  const labelsCollide = warnY !== null && critY !== null && Math.abs(warnY - critY) < 14;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {/* Optional Range Switcher Header */}
      {showControls && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)' }}>
            <Activity size={12} color={strokeColor} />
            <span style={{ fontWeight: 700, letterSpacing: '0.04em' }}>TELEMETRY WAVEFORM</span>
          </div>

          <div style={{ display: 'flex', gap: '2px' }}>
            {(['60s', '1h', '24h', '7d', '30d'] as const).map((r) => {
              const isSelected = activeRange === r;
              return (
                <button
                  key={r}
                  onClick={() => handleSelectRange(r)}
                  style={{
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: isSelected ? 800 : 500,
                    cursor: 'pointer',
                    border: '1px solid var(--border-strong)',
                    backgroundColor: isSelected ? 'var(--bg-dark)' : 'var(--bg-card)',
                    color: isSelected ? 'var(--text-inverted)' : 'var(--text-primary)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {r.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SVG Waveform Graphic */}
      <div
        style={{
          width: '100%',
          position: 'relative',
          backgroundColor: 'var(--bg-surface)',
          border: '1.5px solid var(--border-strong)',
          overflow: 'hidden'
        }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', height: 'auto', display: 'block', cursor: 'crosshair' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
              <stop offset="70%" stopColor={strokeColor} stopOpacity="0.06" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Nominal Envelope Shading */}
          {normMin !== undefined && normMax !== undefined && (
            <rect
              x={padding.left}
              y={Math.max(padding.top, getY(Math.max(normMin, normMax)))}
              width={plotW}
              height={Math.max(
                0,
                Math.min(padding.top + plotH, getY(Math.min(normMin, normMax))) -
                  Math.max(padding.top, getY(Math.max(normMin, normMax)))
              )}
              fill="rgba(22, 163, 74, 0.05)"
            />
          )}

          {/* Gridlines (3 levels) */}
          {[
            { val: minYVal, y: getY(yMin) },
            { val: midYVal, y: getY((yMin + yMax) / 2) },
            { val: maxYVal, y: getY(yMax) }
          ].map((item, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={item.y}
                x2={padding.left + plotW}
                y2={item.y}
                stroke="var(--border-light)"
                strokeDasharray="2 2"
                strokeWidth="0.8"
              />
              <text
                x={padding.left - 5}
                y={item.y + 3}
                textAnchor="end"
                fontSize={compact ? '7.5' : '8'}
                fontFamily="var(--font-mono)"
                fill="var(--text-muted)"
              >
                {item.val}
              </text>
            </g>
          ))}

          {/* Warning Threshold Line */}
          {warnVal !== undefined && warnVal >= yMin && warnVal <= yMax && (
            <g>
              <line
                x1={padding.left}
                y1={getY(warnVal)}
                x2={padding.left + plotW}
                y2={getY(warnVal)}
                stroke="var(--accent-amber)"
                strokeWidth="1.2"
                strokeDasharray="4 3"
              />
              <text
                x={padding.left + plotW + 3}
                y={labelsCollide ? (warnY! < critY! ? getY(warnVal) - 2 : getY(warnVal) + 7) : getY(warnVal) + 3}
                textAnchor="start"
                fontSize="7"
                fontWeight="700"
                fontFamily="var(--font-mono)"
                fill="var(--accent-amber)"
              >
                WARN
              </text>
            </g>
          )}

          {/* Critical Threshold Line */}
          {critVal !== undefined && critVal >= yMin && critVal <= yMax && (
            <g>
              <line
                x1={padding.left}
                y1={getY(critVal)}
                x2={padding.left + plotW}
                y2={getY(critVal)}
                stroke="var(--accent-red)"
                strokeWidth="1.4"
                strokeDasharray="5 2"
              />
              <text
                x={padding.left + plotW + 3}
                y={labelsCollide ? (critY! < warnY! ? getY(critVal) - 2 : getY(critVal) + 7) : getY(critVal) + 3}
                textAnchor="start"
                fontSize="7"
                fontWeight="800"
                fontFamily="var(--font-mono)"
                fill="var(--accent-red)"
              >
                CRIT
              </text>
            </g>
          )}

          {/* Shaded Area Under Spline Curve */}
          <path d={areaPath} fill={`url(#${gradId})`} />

          {/* Smooth Spline Curve Line */}
          <path
            d={smoothPath}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Time Labels on X-axis (Non-overlapping) */}
          {coords.map((pt, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === coords.length - 1;
            const isMid = idx === Math.floor(coords.length / 2);

            if (!isFirst && !isLast && !isMid) return null;

            return (
              <text
                key={idx}
                x={pt.x}
                y={padding.top + plotH + (compact ? 11 : 14)}
                textAnchor={isFirst ? 'start' : isLast ? 'end' : 'middle'}
                fontSize={compact ? '7.5' : '8'}
                fontFamily="var(--font-mono)"
                fill="var(--text-secondary)"
              >
                {pt.point.timestamp}
              </text>
            );
          })}

          {/* Live Indicator on Last Point */}
          {coords.length > 0 && (() => {
            const lastPt = coords[coords.length - 1];
            return (
              <g>
                <circle
                  cx={lastPt.x}
                  cy={lastPt.y}
                  r={4.5}
                  fill={strokeColor}
                  stroke="var(--bg-dark)"
                  strokeWidth="1.5"
                />
                {isLiveStreaming && (
                  <circle
                    cx={lastPt.x}
                    cy={lastPt.y}
                    r={7.5}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="1"
                    opacity="0.5"
                  />
                )}
              </g>
            );
          })()}

          {/* Hover Crosshair and Tooltip */}
          {hoveredPoint && (
            <g>
              <line
                x1={hoveredPoint.x}
                y1={padding.top}
                x2={hoveredPoint.x}
                y2={padding.top + plotH}
                stroke="var(--text-primary)"
                strokeWidth="1"
                strokeDasharray="3 2"
              />

              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r={4}
                fill="var(--bg-dark)"
                stroke="var(--text-inverted)"
                strokeWidth="1.5"
              />

              {(() => {
                const isRightEdge = hoveredPoint.x > svgWidth - 100;
                const tipX = isRightEdge ? hoveredPoint.x - 94 : hoveredPoint.x + 8;
                const tipY = Math.max(padding.top, Math.min(hoveredPoint.y - 20, padding.top + plotH - 30));

                return (
                  <g>
                    <rect
                      x={tipX}
                      y={tipY}
                      width="88"
                      height="30"
                      fill="var(--bg-dark)"
                      stroke="var(--border-strong)"
                      strokeWidth="1"
                      rx="2"
                      opacity="0.94"
                    />
                    <text
                      x={tipX + 6}
                      y={tipY + 12}
                      fontSize="8.5"
                      fontWeight="700"
                      fontFamily="var(--font-mono)"
                      fill="var(--text-inverted)"
                    >
                      {hoveredPoint.point.value} {sensor.unit}
                    </text>
                    <text
                      x={tipX + 6}
                      y={tipY + 23}
                      fontSize="7.5"
                      fontFamily="var(--font-mono)"
                      fill="#9CA3AF"
                    >
                      {hoveredPoint.point.timestamp}
                    </text>
                  </g>
                );
              })()}
            </g>
          )}
        </svg>
      </div>

      {/* Clean, Non-wrapping Statistics Banner */}
      {showStats && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            padding: '4px 8px',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}
        >
          <div>
            <span style={{ color: 'var(--text-muted)' }}>MIN: </span>
            <strong style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
              {minVal}
            </strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>MAX: </span>
            <strong style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
              {maxVal}
            </strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>AVG: </span>
            <strong style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
              {avgVal}
            </strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ color: 'var(--text-muted)' }}>DRIFT: </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                color:
                  driftDirection === 'up'
                    ? sensor.status !== 'normal'
                      ? 'var(--accent-red)'
                      : 'var(--text-primary)'
                    : driftDirection === 'down'
                    ? 'var(--accent-blue)'
                    : 'var(--text-secondary)'
              }}
            >
              {driftDirection === 'up' ? (
                <TrendingUp size={10} />
              ) : driftDirection === 'down' ? (
                <TrendingDown size={10} />
              ) : (
                <Minus size={10} />
              )}
              {driftRate}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
