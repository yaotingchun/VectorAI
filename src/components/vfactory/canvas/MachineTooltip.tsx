import React from 'react';
import { MachineData } from '../../../types/factory';

interface MachineTooltipProps {
  machine: MachineData | null;
  position: { x: number; y: number } | null;
}

export const MachineTooltip: React.FC<MachineTooltipProps> = ({
  machine,
  position,
}) => {
  if (!machine || !position) return null;

  const getStatusBadge = (status: MachineData['status']) => {
    switch (status) {
      case 'running':
        return { text: 'RUNNING', bg: 'rgba(22, 163, 74, 0.1)', color: 'var(--accent-green)', border: 'var(--accent-green)' };
      case 'idle':
        return { text: 'STANDBY', bg: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-blue)', border: 'var(--accent-blue)' };
      case 'warning':
        return { text: 'ALERT', bg: 'rgba(220, 38, 38, 0.1)', color: 'var(--accent-red)', border: 'var(--accent-red)' };
      case 'error':
        return { text: 'FAULT', bg: 'rgba(220, 38, 38, 0.1)', color: 'var(--accent-red)', border: 'var(--accent-red)' };
      case 'maintenance':
        return { text: 'MAINTENANCE', bg: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED', border: '#7C3AED' };
      default:
        return { text: 'UNKNOWN', bg: 'var(--bg-muted)', color: 'var(--text-muted)', border: 'var(--border-light)' };
    }
  };

  const badge = getStatusBadge(machine.status);

  return (
    <div
      className="machine-hover-tooltip"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -100%) translateY(-14px)',
        zIndex: 50,
        pointerEvents: 'none',
        backgroundColor: 'var(--bg-card)',
        border: '1.5px solid var(--border-strong)',
        boxShadow: '3px 3px 0px var(--border-strong)',
        borderRadius: '3px',
        padding: '10px 12px',
        width: '250px',
        animation: 'tooltip-fade-in 0.15s ease-out',
      }}
    >
      {/* Tooltip Header: ID & Type */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '11px',
              backgroundColor: 'var(--bg-dark)',
              color: 'var(--text-inverted)',
              padding: '1px 5px',
              borderRadius: '2px',
            }}
          >
            {machine.code}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 700,
              color: 'var(--text-muted)',
              border: '1px solid var(--border-light)',
              padding: '0 4px',
              borderRadius: '2px',
            }}
          >
            {machine.id}
          </span>
        </div>

        {/* Status Badge */}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            fontWeight: 800,
            letterSpacing: '0.06em',
            padding: '2px 6px',
            borderRadius: '2px',
            backgroundColor: badge.bg,
            color: badge.color,
            border: `1px solid ${badge.border}`,
          }}
        >
          {badge.text}
        </span>
      </div>

      {/* Machine Type Name */}
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '13px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '4px',
        }}
      >
        {machine.name}
      </div>

      {/* Status Message */}
      <div
        style={{
          fontSize: '10px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)',
          backgroundColor: 'var(--bg-surface)',
          padding: '4px 6px',
          borderRadius: '2px',
          border: '1px solid var(--border-light)',
          lineHeight: 1.3,
          marginBottom: '8px',
        }}
      >
        {machine.statusMessage}
      </div>

      {/* Live Telemetry Glance */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px',
          borderTop: '1px solid var(--border-light)',
          paddingTop: '6px',
          fontSize: '10px',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <div>
          <span style={{ color: 'var(--text-muted)' }}>OEE: </span>
          <strong style={{ color: 'var(--text-primary)' }}>{machine.telemetry.oee}%</strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>TEMP: </span>
          <strong style={{ color: 'var(--text-primary)' }}>{machine.telemetry.temperature}°C</strong>
        </div>
      </div>

      {/* Little bottom arrow pointer */}
      <div
        style={{
          position: 'absolute',
          bottom: '-6px',
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          width: '10px',
          height: '10px',
          backgroundColor: 'var(--bg-card)',
          borderRight: '1.5px solid var(--border-strong)',
          borderBottom: '1.5px solid var(--border-strong)',
        }}
      />
    </div>
  );
};
