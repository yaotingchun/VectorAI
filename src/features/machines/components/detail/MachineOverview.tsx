import React, { useState, useMemo } from 'react';
import { Machine } from '../../types/machine';
import { MACHINE_TYPES } from '../../data/machineTypes';
import { Cpu, TrendingUp, Zap, Sparkles } from 'lucide-react';
import { getHealthScoreColor } from '../../utils/machineStatus';

interface MachineOverviewProps {
  machine: Machine;
}

function getSplinePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return path;
}

export const MachineOverview: React.FC<MachineOverviewProps> = ({ machine }) => {
  const [perfRange, setPerfRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [loadRange, setLoadRange] = useState<'24h' | '7d' | '30d'>('24h');

  const typeDef = MACHINE_TYPES[machine.machineType];
  const { color: healthColor } = getHealthScoreColor(machine.healthScore);
  const onlineSensors = machine.sensors.filter((s) => s.status !== 'critical').length;

  const isOffline = machine.status === 'offline';
  const isCrit = machine.status === 'critical' || machine.healthScore < 60;
  const isWarn = machine.status === 'warning' || (machine.healthScore >= 60 && machine.healthScore < 85);

  // Dynamic Performance & OEE calculations
  const { oee, availability, performance, quality, currentUph, targetUph, cycleTime } = useMemo(() => {
    if (isOffline) {
      return { oee: 0.0, availability: 0, performance: 0, quality: 0, currentUph: '0', targetUph: '3,000', cycleTime: 0.0 };
    }
    const avail = isCrit ? 78.5 : isWarn ? 89.0 : 98.2;
    const perf = isCrit ? 82.0 : isWarn ? 92.4 : 96.5;
    const qual = isCrit ? 94.2 : isWarn ? 98.4 : 99.7;
    const computedOee = Math.round((avail * perf * qual) / 10000 * 10) / 10;

    let baseTarget = 3000;
    let baseCycle = 1.20;
    if (machine.machineType === 'wafer-saw') { baseTarget = 2800; baseCycle = 1.28; }
    else if (machine.machineType === 'stocker') { baseTarget = 120; baseCycle = 30.0; }
    else if (machine.machineType === 'die-attach') { baseTarget = 3200; baseCycle = 1.12; }
    else if (machine.machineType === 'plasma-cleaner') { baseTarget = 3000; baseCycle = 1.20; }
    else if (machine.machineType === 'wire-bonding') { baseTarget = 3400; baseCycle = 1.05; }
    else if (machine.machineType === 'molding-press') { baseTarget = 2600; baseCycle = 1.38; }
    else if (machine.machineType === 'aoi-inspection') { baseTarget = 3600; baseCycle = 1.00; }
    else if (machine.machineType === 'x-ray-inspection') { baseTarget = 2400; baseCycle = 1.50; }
    else if (machine.machineType === 'laser-marking') { baseTarget = 3500; baseCycle = 1.02; }
    else if (machine.machineType === 'test-handler') { baseTarget = 2800; baseCycle = 1.28; }
    else if (machine.machineType === 'tape-reel') { baseTarget = 3500; baseCycle = 1.02; }

    const curUph = Math.round(baseTarget * (computedOee / 100));
    return {
      oee: computedOee,
      availability: avail,
      performance: perf,
      quality: qual,
      currentUph: curUph.toLocaleString(),
      targetUph: baseTarget.toLocaleString(),
      cycleTime: baseCycle
    };
  }, [machine.machineType, isOffline, isCrit, isWarn]);

  // Dynamic Load Analysis calculations
  const { loadPct, loadStateText, powerDraw, thermalVal, thermalColor, vibVal, vibColor, pressureVal } = useMemo(() => {
    if (isOffline) {
      return {
        loadPct: 0,
        loadStateText: 'STANDBY / OFFLINE',
        powerDraw: 0.4,
        thermalVal: '21.0 °C (Ambient)',
        thermalColor: 'var(--text-muted)',
        vibVal: '0.00 mm/s (Static)',
        vibColor: 'var(--text-muted)',
        pressureVal: '0.0 kPa (Isolated)'
      };
    }

    const pct = isCrit ? 94 : isWarn ? 88 : 82;
    const stateText = isCrit ? 'ELEVATED STRESS (DERATING ACTIVE)' : isWarn ? 'HEAVY PRODUCTION LOAD' : 'OPTIMAL OPERATING ENVELOPE';
    const kw = isCrit ? 4.8 : isWarn ? 3.9 : 3.2;

    const tempSensor = machine.sensors.find(s => s.name.toLowerCase().includes('temp') || s.sensorId.includes('temp'));
    const vibSensor = machine.sensors.find(s => s.name.toLowerCase().includes('vib') || s.sensorId.includes('vibration'));
    const pressSensor = machine.sensors.find(s => s.name.toLowerCase().includes('pressure') || s.name.toLowerCase().includes('vacuum') || s.sensorId.includes('pressure'));

    const tVal = tempSensor ? `${tempSensor.value} ${tempSensor.unit}` : '23.4 °C (Stable)';
    const tCol = tempSensor?.status === 'critical' ? 'var(--accent-red)' : tempSensor?.status === 'warning' ? 'var(--accent-amber)' : 'var(--accent-green)';

    const vVal = vibSensor ? `${vibSensor.value} ${vibSensor.unit}` : '0.08 mm/s (Low Jitter)';
    const vCol = vibSensor?.status === 'critical' ? 'var(--accent-red)' : vibSensor?.status === 'warning' ? 'var(--accent-amber)' : 'var(--accent-green)';

    const pVal = pressSensor ? `${pressSensor.value} ${pressSensor.unit}` : '98.5 kPa (Hermetic)';

    return {
      loadPct: pct,
      loadStateText: stateText,
      powerDraw: kw,
      thermalVal: tVal,
      thermalColor: tCol,
      vibVal: vVal,
      vibColor: vCol,
      pressureVal: pVal
    };
  }, [machine.sensors, isOffline, isCrit, isWarn]);

  // Performance Trend Graph Coordinates
  const perfCoords = useMemo(() => {
    const rawData =
      perfRange === '24h'
        ? [
            { label: '00:00', val: Math.min(100, Math.max(0, oee + (isCrit ? 12 : 3))) },
            { label: '04:00', val: Math.min(100, Math.max(0, oee + (isCrit ? 9 : 2))) },
            { label: '08:00', val: Math.min(100, Math.max(0, oee + (isCrit ? 6 : 1))) },
            { label: '12:00', val: Math.min(100, Math.max(0, oee + (isCrit ? 2 : 0))) },
            { label: 'Now', val: oee }
          ]
        : perfRange === '7d'
        ? [
            { label: 'Day 1', val: Math.min(100, Math.max(0, oee + (isCrit ? 16 : 4))) },
            { label: 'Day 3', val: Math.min(100, Math.max(0, oee + (isCrit ? 11 : 3))) },
            { label: 'Day 5', val: Math.min(100, Math.max(0, oee + (isCrit ? 6 : 1))) },
            { label: 'Today', val: oee }
          ]
        : [
            { label: 'Week 1', val: Math.min(100, Math.max(0, oee + (isCrit ? 20 : 5))) },
            { label: 'Week 2', val: Math.min(100, Math.max(0, oee + (isCrit ? 14 : 3))) },
            { label: 'Week 3', val: Math.min(100, Math.max(0, oee + (isCrit ? 7 : 2))) },
            { label: 'Current', val: oee }
          ];

    const minX = 60;
    const maxX = 475;
    const stepX = (maxX - minX) / (rawData.length - 1);
    const topPad = 32;
    const cHeight = 142;

    return rawData.map((d, i) => {
      const x = minX + i * stepX;
      const y = topPad + cHeight - (d.val / 100) * cHeight;
      return { x, y, val: d.val, label: d.label };
    });
  }, [oee, isCrit, perfRange]);

  const perfSplinePath = useMemo(() => getSplinePath(perfCoords), [perfCoords]);
  const perfAreaPath = useMemo(() => {
    if (perfCoords.length === 0) return '';
    const first = perfCoords[0];
    const last = perfCoords[perfCoords.length - 1];
    return `${perfSplinePath} L ${last.x} 174 L ${first.x} 174 Z`;
  }, [perfSplinePath, perfCoords]);

  // Load Trend Graph Coordinates
  const loadCoords = useMemo(() => {
    const rawData =
      loadRange === '24h'
        ? [
            { label: '00:00', val: Math.min(100, Math.max(0, loadPct - (isCrit ? 15 : 6))) },
            { label: '04:00', val: Math.min(100, Math.max(0, loadPct - (isCrit ? 10 : 4))) },
            { label: '08:00', val: Math.min(100, Math.max(0, loadPct - (isCrit ? 5 : 2))) },
            { label: '12:00', val: Math.min(100, Math.max(0, loadPct + (isCrit ? 2 : 1))) },
            { label: 'Now', val: loadPct }
          ]
        : loadRange === '7d'
        ? [
            { label: 'Day 1', val: Math.min(100, Math.max(0, loadPct - (isCrit ? 18 : 8))) },
            { label: 'Day 3', val: Math.min(100, Math.max(0, loadPct - (isCrit ? 12 : 5))) },
            { label: 'Day 5', val: Math.min(100, Math.max(0, loadPct - (isCrit ? 6 : 2))) },
            { label: 'Today', val: loadPct }
          ]
        : [
            { label: 'Week 1', val: Math.min(100, Math.max(0, loadPct - (isCrit ? 22 : 10))) },
            { label: 'Week 2', val: Math.min(100, Math.max(0, loadPct - (isCrit ? 14 : 6))) },
            { label: 'Week 3', val: Math.min(100, Math.max(0, loadPct - (isCrit ? 7 : 3))) },
            { label: 'Current', val: loadPct }
          ];

    const minX = 60;
    const maxX = 475;
    const stepX = (maxX - minX) / (rawData.length - 1);
    const topPad = 32;
    const cHeight = 142;

    return rawData.map((d, i) => {
      const x = minX + i * stepX;
      const y = topPad + cHeight - (d.val / 100) * cHeight;
      return { x, y, val: d.val, label: d.label };
    });
  }, [loadPct, isCrit, loadRange]);

  const loadSplinePath = useMemo(() => getSplinePath(loadCoords), [loadCoords]);
  const loadAreaPath = useMemo(() => {
    if (loadCoords.length === 0) return '';
    const first = loadCoords[0];
    const last = loadCoords[loadCoords.length - 1];
    return `${loadSplinePath} L ${last.x} 174 L ${first.x} 174 Z`;
  }, [loadSplinePath, loadCoords]);

  // AI Prescriptive Text
  const { perfAiHeadline, perfAiAction } = useMemo(() => {
    if (isOffline) {
      return {
        perfAiHeadline: 'Equipment In Standby / Offline State',
        perfAiAction: 'Line routing auto-bypassed current lot batches. AI suggests completing standard pre-flight calibration sequence before re-engaging production.'
      };
    }
    if (isCrit) {
      return {
        perfAiHeadline: `OEE Degradation Cascade (−${(100 - oee).toFixed(1)}% vs Nominal Baseline)`,
        perfAiAction: 'Micro-stoppages detected in actuator cycle timing. AI recommends recalibrating vacuum pick-and-place servo offsets to recover +14.2% Availability.'
      };
    }
    if (isWarn) {
      return {
        perfAiHeadline: `Minor Speed Derating Detected (−${(100 - oee).toFixed(1)}% vs Target Throughput)`,
        perfAiAction: 'Unit cycle time extended by ~110ms due to thermal settling delay. AI suggests inspecting cooling loop flow rate.'
      };
    }
    return {
      perfAiHeadline: 'Optimal Cleanroom Production Trajectory (+2.6% vs Shift Plan)',
      perfAiAction: 'OEE speed velocity and defect-free yield rate are currently operating within top 5% cleanroom benchmark.'
    };
  }, [isOffline, isCrit, isWarn, oee]);

  const { loadAiHeadline, loadAiAction } = useMemo(() => {
    if (isOffline) {
      return {
        loadAiHeadline: 'Zero Dynamic Mechanical / Thermal Load',
        loadAiAction: 'Chamber standby power draw is 0.4 kW with hermetic isolation intact.'
      };
    }
    if (isCrit) {
      return {
        loadAiHeadline: 'Thermal & Mechanical Overload Limit Approached (94% Peak Stress)',
        loadAiAction: 'Dynamic friction harmonics and thermal dissipation exceed nominal boundaries. AI recommends automated speed throttling to prevent unrecoverable tool fatigue.'
      };
    }
    if (isWarn) {
      return {
        loadAiHeadline: 'Elevated Continuous Duty Cycle (88% Load Factor)',
        loadAiAction: 'Drive motor power consumption and vibration harmonics are moderately elevated. AI suggests lubrication service within the next 48 operating hours.'
      };
    }
    return {
      loadAiHeadline: 'Nominal Physical Stress Envelope (82% Balanced Load)',
      loadAiAction: 'Power factor (0.92) and vibration harmonics are well within ISO cleanroom vibration tolerance standards.'
    };
  }, [isOffline, isCrit, isWarn]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* Top Grid: Machine Identity & Core Specs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px'
        }}
      >
        {/* Metric Box 1: Location & Line */}
        <div className="telemetry-item" style={{ padding: '12px 14px' }}>
          <div className="telemetry-label" style={{ fontSize: 'var(--text-xs, 11px)', letterSpacing: '0.08em' }}>
            FACILITY & LOCATION
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', marginTop: '2px' }}>
            {machine.location.area}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', marginTop: '2px' }}>
            {machine.location.line} • {machine.location.station}
          </div>
        </div>

        {/* Metric Box 2: Health & Score */}
        <div className="telemetry-item" style={{ padding: '12px 14px' }}>
          <div className="telemetry-label" style={{ fontSize: 'var(--text-xs, 11px)', letterSpacing: '0.08em' }}>
            HEALTH SCORE
          </div>
          <div
            className="telemetry-value"
            style={{
              color: healthColor,
              fontFamily: 'var(--font-sans)',
              fontVariantNumeric: 'tabular-nums',
              fontSize: '22px',
              fontWeight: 800,
              marginTop: '2px'
            }}
          >
            {machine.healthScore}{' '}
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}>
            Status: <strong style={{ color: 'var(--text-primary)' }}>{machine.status.toUpperCase()}</strong>
          </div>
        </div>

        {/* Metric Box 3: Operating Hours */}
        <div className="telemetry-item" style={{ padding: '12px 14px' }}>
          <div className="telemetry-label" style={{ fontSize: 'var(--text-xs, 11px)', letterSpacing: '0.08em' }}>
            OPERATING RUNTIME
          </div>
          <div
            className="telemetry-value"
            style={{
              fontFamily: 'var(--font-sans)',
              fontVariantNumeric: 'tabular-nums',
              fontSize: '22px',
              fontWeight: 800,
              marginTop: '2px'
            }}
          >
            {machine.operatingHours.toLocaleString()}{' '}
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>hrs</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}>
            Installed: {machine.installationDate}
          </div>
        </div>

        {/* Metric Box 4: Sensors Online */}
        <div className="telemetry-item" style={{ padding: '12px 14px' }}>
          <div className="telemetry-label" style={{ fontSize: 'var(--text-xs, 11px)', letterSpacing: '0.08em' }}>
            SENSOR CONNECTIVITY
          </div>
          <div
            className="telemetry-value"
            style={{
              color: onlineSensors === machine.sensors.length ? 'var(--accent-green)' : 'var(--accent-amber)',
              fontFamily: 'var(--font-sans)',
              fontVariantNumeric: 'tabular-nums',
              fontSize: '22px',
              fontWeight: 800,
              marginTop: '2px'
            }}
          >
            {onlineSensors} / {machine.sensors.length}{' '}
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Active</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            IP: {machine.ipAddress}
          </div>
        </div>
      </div>

      {/* Two-Column Grid: Performance Overview & Load Analysis Overview with Graphs and AI Insights */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '16px'
        }}
      >
        {/* 1. PERFORMANCE & OEE OVERVIEW WITH GRAPH & AI INSIGHT */}
        <div className="tech-card">
          <div className="tech-card-header" style={{ padding: '10px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={15} style={{ color: 'var(--accent-blue)' }} />
              <span className="tech-card-title">EQUIPMENT PERFORMANCE & OEE TREND</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: isOffline ? 'var(--text-muted)' : isCrit ? 'var(--accent-red)' : 'var(--accent-green)',
                  backgroundColor: isOffline ? 'var(--bg-surface)' : isCrit ? 'rgba(220, 38, 38, 0.1)' : 'rgba(22, 163, 74, 0.1)',
                  border: `1px solid ${isOffline ? 'var(--border-strong)' : isCrit ? 'var(--accent-red)' : 'var(--accent-green)'}`,
                  padding: '2px 8px'
                }}
              >
                OEE: {oee}%
              </span>

              <div style={{ display: 'flex', gap: '3px' }}>
                {(['24h', '7d', '30d'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setPerfRange(r)}
                    style={{
                      padding: '2px 6px',
                      fontSize: '9.5px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: '1px solid var(--border-strong)',
                      backgroundColor: perfRange === r ? 'var(--bg-dark)' : 'var(--bg-card)',
                      color: perfRange === r ? 'var(--text-inverted)' : 'var(--text-primary)'
                    }}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="tech-card-body" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Interactive SVG OEE Trend Chart */}
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <svg viewBox="0 0 520 200" style={{ width: '100%', height: 'auto', display: 'block', minHeight: '170px' }}>
                {/* Background Gridlines */}
                {[0, 25, 50, 75, 100].map((v) => {
                  const y = 32 + 142 - (v / 100) * 142;
                  return (
                    <g key={v}>
                      <line x1={42} y1={y} x2={495} y2={y} stroke="var(--border-light)" strokeDasharray="3 3" />
                      <text x={36} y={y + 3.5} textAnchor="end" fontSize="9" fontFamily="var(--font-mono)" fill="var(--text-muted)">
                        {v}%
                      </text>
                    </g>
                  );
                })}

                <defs>
                  <linearGradient id="oeeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {/* Benchmark Reference Line (90% OEE) */}
                <line x1={42} y1={32 + 142 - 0.9 * 142} x2={495} y2={32 + 142 - 0.9 * 142} stroke="var(--accent-green)" strokeWidth="1.2" strokeDasharray="5 3" opacity={0.7} />
                <text x={490} y={32 + 142 - 0.9 * 142 - 5} textAnchor="end" fontSize="8.5" fontWeight="700" fontFamily="var(--font-mono)" fill="var(--accent-green)">
                  BENCHMARK: 90%
                </text>

                {/* Shaded Area Under OEE Curve */}
                <path d={perfAreaPath} fill="url(#oeeGrad)" />

                {/* OEE Trend Line */}
                <path
                  d={perfSplinePath}
                  fill="none"
                  stroke="var(--accent-blue)"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points & Value Tags */}
                {perfCoords.map((pt, idx) => {
                  const isLast = idx === perfCoords.length - 1;
                  return (
                    <g key={idx}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isLast ? 5 : 3.5}
                        fill={isLast ? 'var(--bg-dark)' : 'var(--accent-blue)'}
                        stroke="var(--accent-blue)"
                        strokeWidth="2"
                      />
                      <text
                        x={pt.x}
                        y={pt.y - 9}
                        textAnchor="middle"
                        fontSize="9.5"
                        fontWeight="800"
                        fontFamily="var(--font-mono)"
                        fill="var(--text-primary)"
                      >
                        {pt.val}%
                      </text>
                      <text
                        x={pt.x}
                        y={192}
                        textAnchor="middle"
                        fontSize="9"
                        fontFamily="var(--font-mono)"
                        fill="var(--text-secondary)"
                      >
                        {pt.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* OEE 3-Pillar Progress Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <div className="telemetry-item" style={{ padding: '6px 8px' }}>
                <div className="telemetry-label" style={{ fontSize: '9px' }}>AVAILABILITY</div>
                <div className="telemetry-value" style={{ fontSize: '13px', color: 'var(--accent-blue)' }}>
                  {availability}%
                </div>
                <div style={{ fontSize: '8.5px', color: 'var(--text-muted)', marginTop: '2px' }}>Uptime Rate</div>
              </div>

              <div className="telemetry-item" style={{ padding: '6px 8px' }}>
                <div className="telemetry-label" style={{ fontSize: '9px' }}>PERFORMANCE</div>
                <div className="telemetry-value" style={{ fontSize: '13px', color: 'var(--accent-cyan, #06B6D4)' }}>
                  {performance}%
                </div>
                <div style={{ fontSize: '8.5px', color: 'var(--text-muted)', marginTop: '2px' }}>Speed Index</div>
              </div>

              <div className="telemetry-item" style={{ padding: '6px 8px' }}>
                <div className="telemetry-label" style={{ fontSize: '9px' }}>QUALITY YIELD</div>
                <div className="telemetry-value" style={{ fontSize: '13px', color: 'var(--accent-green)' }}>
                  {quality}%
                </div>
                <div style={{ fontSize: '8.5px', color: 'var(--text-muted)', marginTop: '2px' }}>Defect-Free</div>
              </div>
            </div>

            {/* Production Telemetry Secondary Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <div className="telemetry-item" style={{ padding: '6px 8px' }}>
                <div className="telemetry-label" style={{ fontSize: '9px' }}>THROUGHPUT</div>
                <div className="telemetry-value" style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                  {currentUph} <span style={{ fontSize: '8.5px', color: 'var(--text-muted)' }}>UPH</span>
                </div>
                <div style={{ fontSize: '8.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>Target: {targetUph}</div>
              </div>

              <div className="telemetry-item" style={{ padding: '6px 8px' }}>
                <div className="telemetry-label" style={{ fontSize: '9px' }}>CYCLE TIME</div>
                <div className="telemetry-value" style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                  {cycleTime}s <span style={{ fontSize: '8.5px', color: 'var(--text-muted)' }}>/unit</span>
                </div>
                <div style={{ fontSize: '8.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>Design: {(cycleTime * 0.96).toFixed(2)}s</div>
              </div>

              <div className="telemetry-item" style={{ padding: '6px 8px' }}>
                <div className="telemetry-label" style={{ fontSize: '9px' }}>SHIFT PACE</div>
                <div className="telemetry-value" style={{ fontSize: '12px', color: isCrit ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                  {isOffline ? '0%' : isCrit ? '−18.4%' : '+2.6%'}
                </div>
                <div style={{ fontSize: '8.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>vs Plan Target</div>
              </div>
            </div>

            {/* AI Prescriptive Performance Insight Box */}
            <div
              style={{
                backgroundColor: 'rgba(37, 99, 235, 0.05)',
                border: '1px solid var(--accent-blue)',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-blue)', fontWeight: 800, fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                  <Sparkles size={12} />
                  <span>VECTOR.AI PERFORMANCE INTELLIGENCE</span>
                </div>
                <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  CONFIDENCE: 96.4%
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-primary)', lineHeight: 1.45, fontWeight: 600 }}>
                {perfAiHeadline}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {perfAiAction}
              </div>
            </div>
          </div>
        </div>

        {/* 2. LOAD ANALYSIS OVERVIEW WITH GRAPH & AI INSIGHT */}
        <div className="tech-card">
          <div className="tech-card-header" style={{ padding: '10px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={15} style={{ color: 'var(--accent-amber)' }} />
              <span className="tech-card-title">REAL-TIME LOAD & STRESS ENVELOPE</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: isCrit ? 'var(--accent-red)' : 'var(--accent-amber)',
                  backgroundColor: isCrit ? 'rgba(220, 38, 38, 0.1)' : 'rgba(217, 119, 6, 0.1)',
                  border: `1px solid ${isCrit ? 'var(--accent-red)' : 'var(--accent-amber)'}`,
                  padding: '2px 8px'
                }}
              >
                LOAD: {loadPct}%
              </span>

              <div style={{ display: 'flex', gap: '3px' }}>
                {(['24h', '7d', '30d'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setLoadRange(r)}
                    style={{
                      padding: '2px 6px',
                      fontSize: '9.5px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: '1px solid var(--border-strong)',
                      backgroundColor: loadRange === r ? 'var(--bg-dark)' : 'var(--bg-card)',
                      color: loadRange === r ? 'var(--text-inverted)' : 'var(--text-primary)'
                    }}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="tech-card-body" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Interactive SVG Load Stress Chart */}
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <svg viewBox="0 0 520 200" style={{ width: '100%', height: 'auto', display: 'block', minHeight: '170px' }}>
                {/* Critical Overload Zone (>90%) */}
                <rect x={42} y={32} width={453} height={32 + 142 - 0.9 * 142 - 32} fill="rgba(220, 38, 38, 0.07)" />

                {/* Background Gridlines */}
                {[0, 25, 50, 75, 100].map((v) => {
                  const y = 32 + 142 - (v / 100) * 142;
                  return (
                    <g key={v}>
                      <line x1={42} y1={y} x2={495} y2={y} stroke="var(--border-light)" strokeDasharray="3 3" />
                      <text x={36} y={y + 3.5} textAnchor="end" fontSize="9" fontFamily="var(--font-mono)" fill="var(--text-muted)">
                        {v}%
                      </text>
                    </g>
                  );
                })}

                <defs>
                  <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-amber)" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="var(--accent-amber)" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {/* Overload Limit Line (90%) */}
                <line x1={42} y1={32 + 142 - 0.9 * 142} x2={495} y2={32 + 142 - 0.9 * 142} stroke="var(--accent-red)" strokeWidth="1.2" strokeDasharray="5 3" opacity={0.75} />
                <text x={490} y={32 + 142 - 0.9 * 142 - 5} textAnchor="end" fontSize="8.5" fontWeight="700" fontFamily="var(--font-mono)" fill="var(--accent-red)">
                  OVERLOAD THRESHOLD: 90%
                </text>

                {/* Shaded Area Under Load Curve */}
                <path d={loadAreaPath} fill="url(#loadGrad)" />

                {/* Load Curve */}
                <path
                  d={loadSplinePath}
                  fill="none"
                  stroke="var(--accent-amber)"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points & Value Tags */}
                {loadCoords.map((pt, idx) => {
                  const isLast = idx === loadCoords.length - 1;
                  const ptColor = pt.val >= 90 ? 'var(--accent-red)' : 'var(--accent-amber)';
                  return (
                    <g key={idx}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isLast ? 5 : 3.5}
                        fill={isLast ? 'var(--bg-dark)' : ptColor}
                        stroke={ptColor}
                        strokeWidth="2"
                      />
                      <text
                        x={pt.x}
                        y={pt.y - 9}
                        textAnchor="middle"
                        fontSize="9.5"
                        fontWeight="800"
                        fontFamily="var(--font-mono)"
                        fill={ptColor}
                      >
                        {pt.val}%
                      </text>
                      <text
                        x={pt.x}
                        y={192}
                        textAnchor="middle"
                        fontSize="9"
                        fontFamily="var(--font-mono)"
                        fill="var(--text-secondary)"
                      >
                        {pt.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Operating Stress Envelope Status */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '10.5px',
                fontFamily: 'var(--font-mono)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-strong)',
                padding: '5px 10px'
              }}
            >
              <span style={{ color: 'var(--text-secondary)' }}>PHYSICAL ENVELOPE:</span>
              <span style={{ fontWeight: 800, color: isCrit ? 'var(--accent-red)' : isWarn ? 'var(--accent-amber)' : 'var(--accent-green)' }}>
                {loadStateText}
              </span>
            </div>

            {/* Load Analysis 4-Metric Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              <div className="telemetry-item" style={{ padding: '6px 8px' }}>
                <div className="telemetry-label" style={{ fontSize: '9px' }}>POWER DRAW</div>
                <div className="telemetry-value" style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                  {powerDraw} kW <span style={{ fontSize: '8.5px', color: 'var(--text-muted)' }}>(Peak: {(powerDraw * 1.2).toFixed(1)})</span>
                </div>
              </div>

              <div className="telemetry-item" style={{ padding: '6px 8px' }}>
                <div className="telemetry-label" style={{ fontSize: '9px' }}>THERMAL LOAD</div>
                <div className="telemetry-value" style={{ fontSize: '12px', color: thermalColor }}>
                  {thermalVal}
                </div>
              </div>

              <div className="telemetry-item" style={{ padding: '6px 8px' }}>
                <div className="telemetry-label" style={{ fontSize: '9px' }}>MECHANICAL DYNAMICS</div>
                <div className="telemetry-value" style={{ fontSize: '12px', color: vibColor }}>
                  {vibVal}
                </div>
              </div>

              <div className="telemetry-item" style={{ padding: '6px 8px' }}>
                <div className="telemetry-label" style={{ fontSize: '9px' }}>PNEUMATIC / SEAL</div>
                <div className="telemetry-value" style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                  {pressureVal}
                </div>
              </div>
            </div>

            {/* AI Prescriptive Load & Stress Insight Box */}
            <div
              style={{
                backgroundColor: isCrit ? 'rgba(220, 38, 38, 0.05)' : 'rgba(217, 119, 6, 0.05)',
                border: `1px solid ${isCrit ? 'var(--accent-red)' : 'var(--accent-amber)'}`,
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: isCrit ? 'var(--accent-red)' : 'var(--accent-amber)', fontWeight: 800, fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                  <Sparkles size={12} />
                  <span>VECTOR.AI LOAD & STRESS INTELLIGENCE</span>
                </div>
                <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  CONFIDENCE: 94.8%
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-primary)', lineHeight: 1.45, fontWeight: 600 }}>
                {loadAiHeadline}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {loadAiAction}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industrial Machine Specification & Context Box */}
      <div className="tech-card">
        <div className="tech-card-header">
          <span className="tech-card-title">
            <Cpu size={15} /> EQUIPMENT SPECIFICATION & INDUSTRIAL CONTEXT
          </span>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            FIRMWARE {machine.firmwareVersion}
          </span>
        </div>

        <div className="tech-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <div
              style={{
                fontSize: 'var(--text-xs, 11px)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                marginBottom: '4px'
              }}
            >
              PROCESS FUNCTION & PURPOSE
            </div>
            <div style={{ fontSize: '13px', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', lineHeight: 1.55 }}>
              {typeDef ? typeDef.purpose : 'High-precision semiconductor back-end manufacturing equipment.'}
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: 'var(--text-xs, 11px)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                marginBottom: '4px'
              }}
            >
              SYSTEM ARCHITECTURE
            </div>
            <div style={{ fontSize: '13px', fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              {typeDef ? typeDef.description : ''}
            </div>
          </div>

          {/* AI / VectorAI Intelligence Relevance */}
          {typeDef && typeDef.aiRelevance && (
            <div
              style={{
                marginTop: '6px',
                paddingTop: '12px',
                borderTop: '1px dashed var(--border-light)'
              }}
            >
              <div
                style={{
                  fontSize: 'var(--text-xs, 11px)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.08em',
                  marginBottom: '8px'
                }}
              >
                VECTOR.AI INTELLIGENCE SUITE MONITORING CAPABILITIES
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {typeDef.aiRelevance.map((cap, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '12px',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 500,
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-strong)',
                      padding: '4px 10px',
                      color: 'var(--text-primary)'
                    }}
                  >
                    ● {cap}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
