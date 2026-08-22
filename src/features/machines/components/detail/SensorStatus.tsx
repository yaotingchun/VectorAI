import React from 'react';
import { Machine } from '../../types/machine';
import { MACHINE_TYPES, SensorSchema } from '../../data/machineTypes';
import { AlertTriangle, CheckCircle2, AlertOctagon } from 'lucide-react';

interface SensorStatusProps {
  machine: Machine;
}

export const SensorStatus: React.FC<SensorStatusProps> = ({ machine }) => {
  const typeDef = MACHINE_TYPES[machine.machineType];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1.5px solid var(--border-strong)',
          paddingBottom: '8px'
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
            Real-Time Edge Sensor Telemetry
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', marginTop: '2px' }}>
            Dynamic sensor schema for {typeDef ? typeDef.name : machine.machineType} • Sampling Rate: 100ms Edge Stream
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
          width: '100%'
        }}
      >
        {machine.sensors.map((sensor) => {
          const schemaDef: SensorSchema | undefined = typeDef?.sensors.find(
            (s) => s.id === sensor.sensorId
          );

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

          const min = schemaDef ? schemaDef.min : 0;
          const max = schemaDef ? schemaDef.max : sensor.value * 1.5 || 100;
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

                <div style={{ marginBottom: '10px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-secondary)',
                      marginBottom: '4px'
                    }}
                  >
                    <span>MIN: {min} {sensor.unit}</span>
                    {schemaDef && (
                      <span>
                        NOMINAL: [{schemaDef.normalRange[0]} - {schemaDef.normalRange[1]}]
                      </span>
                    )}
                    <span>MAX: {max} {sensor.unit}</span>
                  </div>

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

                {schemaDef && (
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-sans)',
                      lineHeight: 1.45,
                      marginTop: '10px'
                    }}
                  >
                    {schemaDef.description}
                  </div>
                )}

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
                    <span style={{ color: 'var(--text-muted)' }}>RECENT TELEMETRY TREND:</span>
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
