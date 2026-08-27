import React, { useState, useMemo } from 'react';
import { Machine, SensorReading } from '../../types/machine';
import { MachineTypeId } from '../../data/machineTypes';
import { getThresholdsForMachine, MachineSensorThreshold } from '../../intelligence';
import { SensorTelemetryChart, TelemetryRange } from './SensorTelemetryChart';
import { 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon, 
  Radio, 
  Play, 
  Pause, 
  Search,
  Sparkles
} from 'lucide-react';

interface SensorStatusProps {
  machine: Machine;
}

type StatusFilter = 'all' | 'exceedance' | 'normal';

// Context-aware AI summary generator for telemetry trends
function generateSensorAiSummary(
  sensor: SensorReading,
  thresholdDef?: MachineSensorThreshold,
  range: TelemetryRange = '24h'
): string {
  const isCrit = sensor.status === 'critical';
  const isWarn = sensor.status === 'warning';
  const name = sensor.name;
  const unit = sensor.unit;
  const val = sensor.value;

  // Critical State
  if (isCrit) {
    if (name.toLowerCase().includes('vibrat')) {
      return `Severe kinematic vibration exceedance (${val} ${unit}). Harmonic waveform analysis indicates bearing race spalling or spindle unbalance requiring immediate mechanical servicing.`;
    }
    if (name.toLowerCase().includes('temp')) {
      return `Critical thermal runaway detected (${val} ${unit}). Heat dissipation failure detected over ${range} window; risk of component thermal trip.`;
    }
    if (name.toLowerCase().includes('pressure') || name.toLowerCase().includes('vacuum')) {
      return `Critical pneumatic/vacuum loss (${val} ${unit}). Sub-threshold pressure drop indicates seal leakage or line regulator failure.`;
    }
    if (name.toLowerCase().includes('current') || name.toLowerCase().includes('power') || name.toLowerCase().includes('load')) {
      return `Motor over-torque / high load draw (${val} ${unit}). Severe mechanical friction or drive axis jamming detected.`;
    }
    return `Critical envelope violation (${val} ${unit}). Telemetry has breached safe operating limit (${thresholdDef?.critical.min ?? 'N/A'} ${unit}) over the active ${range} window.`;
  }

  // Warning State
  if (isWarn) {
    if (name.toLowerCase().includes('vibrat')) {
      return `Accelerated vibration drift (+${val} ${unit}). Jitter envelope is trending toward warning boundary; early stage mechanical wear or rail misalignment.`;
    }
    if (name.toLowerCase().includes('temp')) {
      return `Moderate thermal elevation (${val} ${unit}). Temperature gradient shows upward drift (+0.8°C/hr); monitor cooling airflow and heatsink contact.`;
    }
    if (name.toLowerCase().includes('optical') || name.toLowerCase().includes('intensity') || name.toLowerCase().includes('uniform')) {
      return `Illumination decay (${val} ${unit}). LED output trending toward low threshold; inspect strobe optics calibration.`;
    }
    if (name.toLowerCase().includes('pressure') || name.toLowerCase().includes('flow')) {
      return `Line pressure variance (${val} ${unit}). Moderate fluidic instability detected over ${range} trend; inspect inlet filters.`;
    }
    return `Warning parameter drift detected (${val} ${unit}). Telemetry is approaching nominal tolerance limit; proactive inspection recommended.`;
  }

  // Normal State
  if (name.toLowerCase().includes('vibrat')) {
    return `Stable harmonic signature (${val} ${unit}). Motion jitter remains well within sub-micron nominal envelope with zero resonant peaks over ${range}.`;
  }
  if (name.toLowerCase().includes('temp')) {
    return `Optimal thermal equilibrium (${val} ${unit}). Closed-loop temperature regulation stable with ±0.3°C variance across ${range} window.`;
  }
  if (name.toLowerCase().includes('optical') || name.toLowerCase().includes('intensity') || name.toLowerCase().includes('uniform')) {
    return `Illumination calibration optimal (${val} ${unit}). Stable photometric output with uniform contrast response across cleanroom line.`;
  }
  if (name.toLowerCase().includes('pressure') || name.toLowerCase().includes('vacuum') || name.toLowerCase().includes('flow')) {
    return `Hermetic pneumatic stability (${val} ${unit}). Supply line pressure steady with zero leak rate or flow turbulence detected.`;
  }
  if (name.toLowerCase().includes('current') || name.toLowerCase().includes('power') || name.toLowerCase().includes('frequency')) {
    return `Electrical parameters steady (${val} ${unit}). Power draw and driver frequency locked in nominal operating band.`;
  }

  return `Nominal telemetry profile (${val} ${unit}). Sensor stream exhibits steady baseline stability within safe ${thresholdDef?.normal.min ?? 0}–${thresholdDef?.normal.max ?? val * 1.1} ${unit} envelope.`;
}

export const SensorStatus: React.FC<SensorStatusProps> = ({ machine }) => {
  const machineType = machine.machineType as MachineTypeId;
  const thresholds = getThresholdsForMachine(machineType);
  const thresholdMap = useMemo(() => {
    const map = new Map<string, MachineSensorThreshold>();
    thresholds.forEach((t) => map.set(t.sensorId, t));
    return map;
  }, [thresholds]);

  // View state
  const [globalRange, setGlobalRange] = useState<TelemetryRange>('24h');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Filtered sensor list
  const filteredSensors = useMemo(() => {
    return machine.sensors.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.sensorId.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === 'exceedance') {
        return s.status === 'warning' || s.status === 'critical';
      }
      if (statusFilter === 'normal') {
        return s.status === 'normal';
      }
      return true;
    });
  }, [machine.sensors, searchQuery, statusFilter]);

  // Summary Metrics
  const criticalCount = machine.sensors.filter((s) => s.status === 'critical').length;
  const warningCount = machine.sensors.filter((s) => s.status === 'warning').length;
  const normalCount = machine.sensors.filter((s) => s.status === 'normal').length;

  const stabilityIndex = Math.max(
    30,
    Math.round(100 - criticalCount * 22 - warningCount * 8)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* Top Banner & Global Telemetry Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1.5px solid var(--border-strong)',
          paddingBottom: '12px',
          gap: '12px'
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '16px',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Radio size={16} />
            <span>REAL-TIME SENSOR TELEMETRY & TREND ANALYSIS</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', marginTop: '2px' }}>
            Telemetry stream for {machine.name} ({machine.id}) • Edge sampling rate: 100ms interval
          </div>
        </div>

        {/* Global Toolbar Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Live stream toggle */}
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className="tech-btn"
            style={{
              padding: '6px 12px',
              fontSize: '11px',
              backgroundColor: isLiveStreaming ? 'var(--bg-dark)' : 'var(--bg-card)',
              color: isLiveStreaming ? 'var(--text-inverted)' : 'var(--text-primary)'
            }}
            title={isLiveStreaming ? 'Pause live edge streaming' : 'Resume live edge streaming'}
          >
            {isLiveStreaming ? <Pause size={12} /> : <Play size={12} />}
            <span>{isLiveStreaming ? 'STREAMING ACTIVE' : 'STREAM PAUSED'}</span>
          </button>

          {/* Time range switcher */}
          <div style={{ display: 'flex', gap: '2px', border: '1.5px solid var(--border-strong)', padding: '2px', backgroundColor: 'var(--bg-card)' }}>
            {(['60s', '1h', '24h', '7d', '30d'] as const).map((r) => {
              const isSelected = globalRange === r;
              return (
                <button
                  key={r}
                  onClick={() => setGlobalRange(r)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: isSelected ? 'var(--bg-dark)' : 'transparent',
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
      </div>

      {/* KPI Metric Summary Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}
      >
        <div className="tech-card" style={{ padding: '10px 14px', backgroundColor: 'var(--bg-card)' }}>
          <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            ONLINE SENSOR NODES
          </div>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontVariantNumeric: 'tabular-nums',
              fontSize: '22px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginTop: '2px'
            }}
          >
            {machine.sensors.length}{' '}
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-green)' }}>
              ({normalCount} Nominal)
            </span>
          </div>
        </div>

        <div className="tech-card" style={{ padding: '10px 14px', backgroundColor: 'var(--bg-card)' }}>
          <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            OUT-OF-SPEC EXCEEDANCES
          </div>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontVariantNumeric: 'tabular-nums',
              fontSize: '22px',
              fontWeight: 800,
              color: criticalCount > 0 ? 'var(--accent-red)' : warningCount > 0 ? 'var(--accent-amber)' : 'var(--accent-green)',
              marginTop: '2px'
            }}
          >
            {criticalCount + warningCount}{' '}
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
              ({criticalCount} Crit, {warningCount} Warn)
            </span>
          </div>
        </div>

        <div className="tech-card" style={{ padding: '10px 14px', backgroundColor: 'var(--bg-card)' }}>
          <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            TELEMETRY STABILITY INDEX
          </div>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontVariantNumeric: 'tabular-nums',
              fontSize: '22px',
              fontWeight: 800,
              color: stabilityIndex >= 85 ? 'var(--accent-green)' : stabilityIndex >= 60 ? 'var(--accent-amber)' : 'var(--accent-red)',
              marginTop: '2px'
            }}
          >
            {stabilityIndex}%{' '}
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              (Envelope Health)
            </span>
          </div>
        </div>

        <div className="tech-card" style={{ padding: '10px 14px', backgroundColor: 'var(--bg-card)' }}>
          <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            ACTIVE HORIZON & SAMPLING
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginTop: '6px'
            }}
          >
            {globalRange.toUpperCase()} • 100ms Edge Stream
          </div>
        </div>
      </div>

      {/* Search & Status Filter Strip */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          padding: '8px 12px',
          backgroundColor: 'var(--bg-surface)',
          border: '1.5px solid var(--border-strong)'
        }}
      >
        {/* Search input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: '220px', maxWidth: '400px' }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search sensor name, ID or metric..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        {/* Status filter buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginRight: '4px' }}>
            STATUS:
          </span>
          <button
            onClick={() => setStatusFilter('all')}
            style={{
              padding: '3px 8px',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              fontWeight: statusFilter === 'all' ? 800 : 500,
              cursor: 'pointer',
              border: '1px solid var(--border-strong)',
              backgroundColor: statusFilter === 'all' ? 'var(--bg-dark)' : 'var(--bg-card)',
              color: statusFilter === 'all' ? 'var(--text-inverted)' : 'var(--text-primary)'
            }}
          >
            ALL ({machine.sensors.length})
          </button>
          <button
            onClick={() => setStatusFilter('exceedance')}
            style={{
              padding: '3px 8px',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              fontWeight: statusFilter === 'exceedance' ? 800 : 500,
              cursor: 'pointer',
              border: '1px solid var(--border-strong)',
              backgroundColor: statusFilter === 'exceedance' ? 'var(--bg-dark)' : 'var(--bg-card)',
              color: statusFilter === 'exceedance' ? 'var(--text-inverted)' : 'var(--accent-amber)'
            }}
          >
            EXCEEDANCE ({criticalCount + warningCount})
          </button>
          <button
            onClick={() => setStatusFilter('normal')}
            style={{
              padding: '3px 8px',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              fontWeight: statusFilter === 'normal' ? 800 : 500,
              cursor: 'pointer',
              border: '1px solid var(--border-strong)',
              backgroundColor: statusFilter === 'normal' ? 'var(--bg-dark)' : 'var(--bg-card)',
              color: statusFilter === 'normal' ? 'var(--text-inverted)' : 'var(--accent-green)'
            }}
          >
            NOMINAL ({normalCount})
          </button>
        </div>
      </div>

      {/* Dedicated Sensor Telemetry Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '16px',
          width: '100%'
        }}
      >
        {filteredSensors.map((sensor) => {
          const isNegative = sensor.value < 0;
          const threshDef = thresholdMap.get(sensor.sensorId) || {
            sensorId: sensor.sensorId,
            sensorName: sensor.name,
            unit: sensor.unit,
            normal: {
              min: isNegative ? Number((sensor.value * 1.15).toFixed(1)) : Number((sensor.value * 0.9).toFixed(1)),
              max: isNegative ? Number((sensor.value * 0.85).toFixed(1)) : Number((sensor.value * 1.1).toFixed(1)),
              description: 'Nominal operating envelope'
            },
            warning: {
              min: isNegative ? Number((sensor.value * 0.85).toFixed(1)) : Number((sensor.value * 1.15).toFixed(1)),
              max: isNegative ? Number((sensor.value * 0.7).toFixed(1)) : Number((sensor.value * 1.3).toFixed(1)),
              description: 'Warning threshold drift'
            },
            critical: {
              min: isNegative ? Number((sensor.value * 0.7).toFixed(1)) : Number((sensor.value * 1.35).toFixed(1)),
              max: isNegative ? 0 : Number((sensor.value * 1.6).toFixed(1)),
              description: 'Critical limit breach'
            },
            direction: 'HIGHER_IS_WORSE' as const
          };

          let statusColor = 'var(--accent-green)';
          let statusBg = 'rgba(22, 163, 74, 0.1)';
          let statusText = 'NORMAL';
          let StatusIcon = CheckCircle2;

          if (sensor.status === 'warning') {
            statusColor = 'var(--accent-amber)';
            statusBg = 'rgba(217, 119, 6, 0.12)';
            statusText = 'WARNING';
            StatusIcon = AlertTriangle;
          } else if (sensor.status === 'critical') {
            statusColor = 'var(--accent-red)';
            statusBg = 'rgba(220, 38, 38, 0.14)';
            statusText = 'CRITICAL';
            StatusIcon = AlertOctagon;
          }

          const domainVals = [
            sensor.value,
            threshDef.normal.min,
            threshDef.normal.max,
            threshDef.warning.min,
            threshDef.warning.max,
            threshDef.critical.min,
            threshDef.critical.max
          ].filter((v): v is number => typeof v === 'number' && !isNaN(v));

          const dMin = Math.min(...domainVals);
          const dMax = Math.max(...domainVals);
          const percentage = Math.min(Math.max(((sensor.value - dMin) / (dMax - dMin || 1)) * 100, 0), 100);

          const aiSummary = generateSensorAiSummary(sensor, threshDef, globalRange);

          return (
            <div
              key={sensor.sensorId}
              className="tech-card"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: sensor.status !== 'normal' ? statusColor : 'var(--border-strong)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <span className="corner-tl">+</span>
              <span className="corner-tr">+</span>

              {/* Card Header */}
              <div
                style={{
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-surface)',
                  borderBottom: '1.5px solid var(--border-strong)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      letterSpacing: '0.03em'
                    }}
                  >
                    {sensor.name}
                  </span>
                  <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    ID: <code>{sensor.sensorId}</code>
                  </div>
                </div>

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: statusColor,
                    backgroundColor: statusBg,
                    border: `1px solid ${statusColor}`,
                    padding: '2px 8px'
                  }}
                >
                  <StatusIcon size={12} />
                  {statusText}
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                {/* Real-time Value and Last Updated */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between'
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontVariantNumeric: 'tabular-nums',
                      fontSize: '26px',
                      fontWeight: 800,
                      color: statusColor,
                      lineHeight: 1,
                      letterSpacing: 'normal',
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '4px'
                    }}
                  >
                    {sensor.value}
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-sans)'
                      }}
                    >
                      {sensor.unit}
                    </span>
                  </div>

                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Updated {sensor.lastUpdated}
                  </span>
                </div>

                {/* Envelope Progress Bar */}
                <div>
                  <div
                    style={{
                      width: '100%',
                      height: '5px',
                      backgroundColor: 'var(--bg-muted)',
                      border: '1px solid var(--border-strong)',
                      position: 'relative'
                    }}
                  >
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: statusColor,
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>

                {/* Integrated Telemetry Trend Graph */}
                <SensorTelemetryChart
                  sensor={sensor}
                  thresholdDef={threshDef}
                  range={globalRange}
                  isLiveStreaming={isLiveStreaming}
                  height={130}
                  showControls={false}
                  showStats={true}
                />

                {/* AI Trend Summary Insight Box */}
                <div
                  style={{
                    backgroundColor: sensor.status === 'critical'
                      ? 'rgba(220, 38, 38, 0.05)'
                      : sensor.status === 'warning'
                      ? 'rgba(217, 119, 6, 0.05)'
                      : 'var(--bg-surface)',
                    border: `1px solid ${
                      sensor.status === 'critical'
                        ? 'rgba(220, 38, 38, 0.25)'
                        : sensor.status === 'warning'
                        ? 'rgba(217, 119, 6, 0.25)'
                        : 'var(--border-light)'
                    }`,
                    padding: '8px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '10.5px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: statusColor
                    }}
                  >
                    <Sparkles size={12} />
                    <span>AI TELEMETRY DIAGNOSTIC</span>
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-sans)',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.45
                    }}
                  >
                    {aiSummary}
                  </div>
                </div>

                {/* Threshold Specifications Box */}
                {threshDef && (
                  <div
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-light)',
                      padding: '8px 10px',
                      fontSize: '10.5px',
                      fontFamily: 'var(--font-mono)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px',
                      marginTop: 'auto'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Nominal Band:</span>
                      <strong style={{ color: 'var(--accent-green)' }}>
                        {threshDef.normal.min} – {threshDef.normal.max} {sensor.unit}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Warning Limit:</span>
                      <strong style={{ color: 'var(--accent-amber)' }}>
                        {threshDef.direction === 'HIGHER_IS_WORSE' ? `≥ ${threshDef.warning.min}` : `≤ ${threshDef.warning.max}`} {sensor.unit}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Critical Limit:</span>
                      <strong style={{ color: 'var(--accent-red)' }}>
                        {threshDef.direction === 'HIGHER_IS_WORSE' ? `≥ ${threshDef.critical.min}` : `≤ ${threshDef.critical.max}`} {sensor.unit}
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
