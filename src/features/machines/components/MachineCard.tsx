import React from 'react';
import { ArrowRight, MapPin, AlertTriangle } from 'lucide-react';
import { Machine } from '../types/machine';
import { MachineIcon } from './MachineIcon';
import { MachineStatusBadge } from './MachineStatusBadge';
import { MACHINE_TYPES } from '../data/machineTypes';
import { getHealthScoreColor } from '../utils/machineStatus';

interface MachineCardProps {
  machine: Machine;
  onSelect: (machineId: string) => void;
}

export const MachineCard: React.FC<MachineCardProps> = ({ machine, onSelect }) => {
  const typeDef = MACHINE_TYPES[machine.machineType];
  const typeName = typeDef ? typeDef.name : machine.machineType;
  const { color: healthColor } = getHealthScoreColor(machine.healthScore);

  const onlineSensors = machine.sensors.filter((s) => s.status !== 'critical').length;
  const totalSensors = machine.sensors.length;

  const hasActiveAnomaly = machine.anomalies.some((a) => a.status === 'active');
  const latestAnomaly = machine.anomalies[0];

  return (
    <div
      onClick={() => onSelect(machine.id)}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-card)',
        border: '1.5px solid var(--border-strong)',
        boxShadow: '2px 2px 0px rgba(18, 19, 21, 0.06)',
        transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
        position: 'relative',
        height: '100%',
        width: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translate(-2px, -2px)';
        e.currentTarget.style.boxShadow = '4px 4px 0px var(--border-strong)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translate(0px, 0px)';
        e.currentTarget.style.boxShadow = '2px 2px 0px rgba(18, 19, 21, 0.06)';
      }}
    >
      <div>
        {/* Card Header: Icon + Machine ID + Status Badge */}
        <div
          style={{
            padding: '12px 14px',
            borderBottom: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: 'var(--bg-dark)',
                color: 'var(--text-inverted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <MachineIcon type={machine.machineType} size={15} />
            </div>

            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '14px',
                  fontWeight: 800,
                  letterSpacing: '0.02em',
                  color: 'var(--text-primary)',
                  lineHeight: 1.1
                }}
              >
                {machine.id}
              </div>
              <div
                style={{
                  fontSize: '11.5px',
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                  marginTop: '1px'
                }}
              >
                {typeName}
              </div>
            </div>
          </div>

          <MachineStatusBadge status={machine.status} size="sm" />
        </div>

        {/* Card Body */}
        <div style={{ padding: '14px' }}>
          {/* Health Score Gauge */}
          <div style={{ marginBottom: '14px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginBottom: '5px'
              }}
            >
              <span
                style={{
                  fontSize: '10.5px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  letterSpacing: '0.06em'
                }}
              >
                HEALTH SCORE
              </span>

              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontVariantNumeric: 'tabular-nums',
                  fontSize: '17px',
                  fontWeight: 800,
                  color: healthColor,
                  letterSpacing: 'normal',
                  lineHeight: 1
                }}
              >
                {machine.healthScore}{' '}
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-muted)'
                  }}
                >
                  / 100
                </span>
              </div>
            </div>

            {/* Health Bar (Single accent color) */}
            <div
              style={{
                width: '100%',
                height: '6px',
                backgroundColor: 'var(--bg-muted)',
                borderRadius: '1px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${Math.max(machine.healthScore, 2)}%`,
                  height: '100%',
                  backgroundColor: healthColor,
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>

          {/* Clean Telemetry Metrics: No nested boxes, separated with subtle vertical divider */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              padding: '8px 0',
              marginBottom: '10px',
              borderTop: '1px solid var(--border-light)',
              borderBottom: '1px solid var(--border-light)'
            }}
          >
            {/* RUL Metric */}
            <div>
              <div
                style={{
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  letterSpacing: '0.06em'
                }}
              >
                RUL PREDICTION
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontVariantNumeric: 'tabular-nums',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: 'normal',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '3px',
                  marginTop: '2px',
                  lineHeight: 1
                }}
              >
                {machine.rul.value.toLocaleString()}{' '}
                <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  {machine.rul.unit}
                </span>
              </div>
            </div>

            {/* Subtle Divider */}
            <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-light)', margin: '0 12px' }} />

            {/* Sensors Metric */}
            <div>
              <div
                style={{
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  letterSpacing: '0.06em'
                }}
              >
                SENSORS
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontVariantNumeric: 'tabular-nums',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: 'normal',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '3px',
                  marginTop: '2px',
                  lineHeight: 1
                }}
              >
                {onlineSensors} / {totalSensors}{' '}
                <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  Online
                </span>
              </div>
            </div>
          </div>

          {/* Location Line */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11.5px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              marginBottom: hasActiveAnomaly ? '10px' : '0'
            }}
          >
            <MapPin size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {machine.location.area} • {machine.location.station}
            </span>
          </div>

          {/* Sleek Anomaly Callout: Left-accent bar only, no 4-sided box */}
          {hasActiveAnomaly && latestAnomaly && (
            <div
              style={{
                borderLeft: '3px solid var(--accent-amber)',
                backgroundColor: 'rgba(217, 119, 6, 0.05)',
                padding: '6px 10px',
                fontSize: '11px',
                fontFamily: 'var(--font-sans)',
                lineHeight: 1.4,
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '6px'
              }}
            >
              <AlertTriangle size={12} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent-amber)' }} />
              <div>
                <strong style={{ fontWeight: 600 }}>{latestAnomaly.type}:</strong>{' '}
                <span style={{ color: 'var(--text-secondary)' }}>{latestAnomaly.description.slice(0, 62)}...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: View Details CTA */}
      <div
        style={{
          borderTop: '1px solid var(--border-light)',
          padding: '8px 14px',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '10.5px',
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          color: 'var(--text-primary)'
        }}
      >
        <span style={{ color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
          Stage: {machine.processStage}
        </span>

        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: 'var(--text-primary)',
            fontWeight: 700
          }}
        >
          View Details <ArrowRight size={11} />
        </span>
      </div>
    </div>
  );
};
