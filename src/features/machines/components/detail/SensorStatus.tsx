import React from 'react';
import { Machine } from '../../types/machine';
import { MachineTypeId } from '../../data/machineTypes';
import { getThresholdsForMachine, MachineSensorThreshold } from '../../intelligence';
import { AlertTriangle, CheckCircle2, AlertOctagon } from 'lucide-react';

interface SensorStatusProps {
  machine: Machine;
}

export const SensorStatus: React.FC<SensorStatusProps> = ({ machine }) => {
  const machineType = machine.machineType as MachineTypeId;
  const thresholds = getThresholdsForMachine(machineType);
  const thresholdMap = new Map<string, MachineSensorThreshold>();
  thresholds.forEach(t => thresholdMap.set(t.sensorId, t));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1.5px solid var(--border-strong)',
          paddingBottom: '8px',
          gap: '8px'
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '15px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)'
            }}
          >
            Real-Time Edge Sensor Telemetry & Threshold Envelopes
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', marginTop: '2px' }}>
            Machine Manual Specifications for {machine.name} ({machine.id}) • Sampling Rate: 100ms Edge Stream
          </div>
        </div>

        <span
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            backgroundColor: 'var(--bg-dark)',
            color: 'var(--text-inverted)',
            padding: '3px 10px',
            fontWeight: 700,
            letterSpacing: '0.06em'
          }}
        >
          {machine.sensors.length} SENSOR NODES
        </span>
      </div>

      {/* Sensor Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px',
          width: '100%'
        }}
      >
        {machine.sensors.map((sensor) => {
          const threshDef = thresholdMap.get(sensor.sensorId);

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

          const min = threshDef ? threshDef.normal.min * 0.7 : 0;
          const max = threshDef ? threshDef.critical.max || threshDef.critical.min * 1.2 : sensor.value * 1.5 || 100;
          const percentage = Math.min(Math.max(((sensor.value - min) / (max - min)) * 100, 0), 100);

          return (
            <div
              key={sensor.sensorId}
              className="tech-card"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: sensor.status !== 'normal' ? statusColor : 'var(--border-strong)'
              }}
            >
              <span className="corner-tl">+</span>
              <span className="corner-tr">+</span>

              <div
                style={{
                  padding: '12px 16px',
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

              <div style={{ padding: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontVariantNumeric: 'tabular-nums',
                      fontSize: '28px',
                      fontWeight: 800,
                      color: statusColor,
                      lineHeight: 1,
                      letterSpacing: 'normal'
                    }}
                  >
                    {sensor.value}{' '}
                    <span
                      style={{
                        fontSize: '15px',
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

                {/* Progress bar */}
                <div style={{ marginBottom: '12px' }}>
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: 'var(--bg-muted)',
                      border: '1.5px solid var(--border-strong)',
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

                {/* Threshold Specifications Box */}
                {threshDef && (
                  <div
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-light)',
                      padding: '8px 10px',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
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

                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', borderTop: '1px dashed var(--border-light)', paddingTop: '4px', marginTop: '2px' }}>
                      Direction: {threshDef.direction.replace('_', ' ')}
                    </div>
                  </div>
                )}

                {/* Recent Telemetry trend if available */}
                {sensor.history && sensor.history.length > 0 && (
                  <div
                    style={{
                      marginTop: '12px',
                      paddingTop: '10px',
                      borderTop: '1px dashed var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>TREND:</span>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {sensor.history.map((pt, i) => (
                        <span
                          key={i}
                          style={{
                            padding: '2px 6px',
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border-light)',
                            fontSize: '10px',
                            fontFamily: 'var(--font-sans)',
                            fontVariantNumeric: 'tabular-nums',
                            fontWeight: 600
                          }}
                        >
                          {pt.value}
                        </span>
                      ))}
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
