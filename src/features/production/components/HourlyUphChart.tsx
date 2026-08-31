import React, { useState } from 'react';
import { HourlyUphRecord } from '../types/production';

interface HourlyUphChartProps {
  hourlyData: HourlyUphRecord[];
  targetUph: number;
  nominalUph: number;
  height?: number;
}

export const HourlyUphChart: React.FC<HourlyUphChartProps> = ({
  hourlyData,
  targetUph,
  nominalUph,
  height = 180,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!hourlyData || hourlyData.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
        NO TELEMETRY HISTORY RECORDED
      </div>
    );
  }

  const chartWidth = 640;
  const chartHeight = height;
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 25;
  const paddingBottom = 30;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const maxVal = Math.max(nominalUph * 1.08, ...hourlyData.map((d) => d.actualUph), targetUph);
  const minVal = 0;

  const getX = (index: number) => {
    return paddingLeft + (index / (hourlyData.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    return paddingTop + innerHeight - ((val - minVal) / (maxVal - minVal)) * innerHeight;
  };

  const targetY = getY(targetUph);
  const nominalY = getY(nominalUph);

  // Line points for actual UPH
  const linePoints = hourlyData
    .map((d, i) => `${getX(i).toFixed(1)},${getY(d.actualUph).toFixed(1)}`)
    .join(' ');

  const areaPoints = `${getX(0).toFixed(1)},${(paddingTop + innerHeight).toFixed(1)} ` +
    linePoints +
    ` ${getX(hourlyData.length - 1).toFixed(1)},${(paddingTop + innerHeight).toFixed(1)}`;

  const hoveredItem = hoveredIndex !== null ? hourlyData[hoveredIndex] : null;

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        style={{ width: '100%', height: 'auto', display: 'block', backgroundColor: 'var(--bg-surface)' }}
      >
        {/* Background Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const val = Math.round(minVal + ratio * (maxVal - minVal));
          const y = paddingTop + innerHeight - ratio * innerHeight;
          return (
            <g key={ratio}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={chartWidth - paddingRight}
                y2={y}
                stroke="var(--border-light)"
                strokeDasharray="2,3"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 8}
                y={y + 3}
                fill="var(--text-muted)"
                fontSize="9"
                fontFamily="var(--font-mono)"
                textAnchor="end"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Target UPH Threshold Line */}
        <line
          x1={paddingLeft}
          y1={targetY}
          x2={chartWidth - paddingRight}
          y2={targetY}
          stroke="var(--accent-amber)"
          strokeWidth="1.5"
          strokeDasharray="4,3"
        />
        <text
          x={chartWidth - paddingRight - 4}
          y={targetY - 5}
          fill="var(--accent-amber)"
          fontSize="9"
          fontFamily="var(--font-mono)"
          fontWeight="700"
          textAnchor="end"
        >
          TARGET: {targetUph} UPH
        </text>

        {/* Nominal Max Ceiling Line */}
        <line
          x1={paddingLeft}
          y1={nominalY}
          x2={chartWidth - paddingRight}
          y2={nominalY}
          stroke="var(--text-muted)"
          strokeWidth="1"
          strokeDasharray="2,2"
          opacity="0.6"
        />
        <text
          x={paddingLeft + 6}
          y={nominalY - 4}
          fill="var(--text-muted)"
          fontSize="8"
          fontFamily="var(--font-mono)"
        >
          NOMINAL CAPACITY ({nominalUph} UPH)
        </text>

        {/* Area fill */}
        <polygon
          points={areaPoints}
          fill="rgba(18, 19, 21, 0.08)"
        />

        {/* Actual UPH Line */}
        <polyline
          points={linePoints}
          fill="none"
          stroke="var(--bg-dark)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points & Interactive Hover Bars */}
        {hourlyData.map((d, i) => {
          const x = getX(i);
          const y = getY(d.actualUph);
          const isHovered = hoveredIndex === i;
          const isShiftChange = d.hour === '06:00' || d.hour === '14:00' || d.hour === '22:00';

          return (
            <g key={i}>
              {/* Invisible touch/hover target bar */}
              <rect
                x={x - (innerWidth / hourlyData.length) / 2}
                y={paddingTop}
                width={innerWidth / hourlyData.length}
                height={innerHeight}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />

              {/* Shift separator line */}
              {isShiftChange && (
                <line
                  x1={x}
                  y1={paddingTop}
                  x2={x}
                  y2={paddingTop + innerHeight}
                  stroke="var(--border-strong)"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                  opacity="0.4"
                />
              )}

              {/* Data Point Dot */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 5 : 2.5}
                fill={d.actualUph >= targetUph ? 'var(--accent-green)' : 'var(--accent-amber)'}
                stroke="var(--bg-dark)"
                strokeWidth="1.5"
              />

              {/* X-axis time label (sparse) */}
              {(i % 4 === 0 || i === hourlyData.length - 1) && (
                <text
                  x={x}
                  y={chartHeight - 10}
                  fill="var(--text-secondary)"
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                  textAnchor="middle"
                >
                  {d.hour}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating Hover Tooltip */}
      {hoveredItem && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '12px',
            backgroundColor: 'var(--bg-dark)',
            color: 'var(--text-inverted)',
            padding: '6px 10px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            border: '1px solid var(--border-strong)',
            boxShadow: '2px 2px 0px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 10,
          }}
        >
          <span>HOUR: <strong>{hoveredItem.hour}</strong></span>
          <span>UPH: <strong>{hoveredItem.actualUph}</strong></span>
          <span>YIELD: <strong>{hoveredItem.yieldPercent}%</strong></span>
          <span>SCRAP: <strong>{hoveredItem.scrapUnits} u</strong></span>
        </div>
      )}
    </div>
  );
};
