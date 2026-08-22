import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Machine } from '../types/machine';
import { MachineIcon } from './MachineIcon';
import { MachineStatusBadge } from './MachineStatusBadge';
import { MACHINE_TYPES } from '../data/machineTypes';
import { getHealthScoreColor } from '../utils/machineStatus';

interface MachineTableRowProps {
  machine: Machine;
  onSelect: (machineId: string) => void;
}

export const MachineTableRow: React.FC<MachineTableRowProps> = ({ machine, onSelect }) => {
  const typeDef = MACHINE_TYPES[machine.machineType];
  const typeName = typeDef ? typeDef.name : machine.machineType;
  const { color: healthColor } = getHealthScoreColor(machine.healthScore);

  const onlineSensors = machine.sensors.filter((s) => s.status !== 'critical').length;
  const totalSensors = machine.sensors.length;

  return (
    <tr
      onClick={() => onSelect(machine.id)}
      style={{
        cursor: 'pointer',
        borderBottom: '1px solid var(--border-light)',
        transition: 'background-color var(--transition-fast)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--bg-muted)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {/* ID & Model */}
      <td style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
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
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                fontSize: '15px',
                color: 'var(--text-primary)',
                letterSpacing: '0.03em'
              }}
            >
              {machine.id}
            </div>
            <div
              style={{
                fontSize: '12px',
                fontFamily: 'var(--font-sans)',
                color: 'var(--text-secondary)',
                fontWeight: 500
              }}
            >
              {machine.name}
            </div>
          </div>
        </div>
      </td>

      {/* Machine Type & Stage */}
      <td style={{ padding: '12px 16px' }}>
        <div
          style={{
            fontWeight: 700,
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            color: 'var(--text-primary)'
          }}
        >
          {typeName}
        </div>
        <div
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            fontWeight: 600,
            letterSpacing: '0.04em'
          }}
        >
          STAGE: {machine.processStage.toUpperCase()}
        </div>
      </td>

      {/* Status Badge */}
      <td style={{ padding: '12px 16px' }}>
        <MachineStatusBadge status={machine.status} size="md" />
      </td>

      {/* Health Score */}
      <td style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 800,
              fontSize: '16px',
              color: healthColor,
              minWidth: '28px'
            }}
          >
            {machine.healthScore}
          </span>
          <div
            style={{
              width: '60px',
              height: '6px',
              backgroundColor: 'var(--bg-muted)',
              border: '1px solid var(--border-strong)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${machine.healthScore}%`,
                height: '100%',
                backgroundColor: healthColor
              }}
            />
          </div>
        </div>
      </td>

      {/* RUL Prediction */}
      <td style={{ padding: '12px 16px' }}>
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 800,
            fontSize: '15px',
            color: machine.rul.value < 100 ? 'var(--accent-red)' : 'var(--text-primary)'
          }}
        >
          {machine.rul.value.toLocaleString()} {machine.rul.unit}
        </div>
        <div
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-sans)',
            color: 'var(--text-muted)'
          }}
        >
          ~{machine.rul.estimatedDays} days ({Math.round(machine.rul.confidence * 100)}% conf)
        </div>
      </td>

      {/* Sensors */}
      <td style={{ padding: '12px 16px' }}>
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 700,
            fontSize: '14px',
            color: onlineSensors === totalSensors ? 'var(--accent-green)' : 'var(--accent-amber)'
          }}
        >
          {onlineSensors} / {totalSensors} Online
        </div>
      </td>

      {/* Location */}
      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
        <div
          style={{
            fontSize: '13px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}
        >
          {machine.location.area}
        </div>
        <div
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-sans)',
            color: 'var(--text-secondary)'
          }}
        >
          {machine.location.station}
        </div>
      </td>

      {/* Action */}
      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(machine.id);
          }}
          className="tech-btn"
          style={{ padding: '5px 10px', fontSize: '11px' }}
        >
          DETAILS <ArrowRight size={12} />
        </button>
      </td>
    </tr>
  );
};
