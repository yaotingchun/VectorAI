import React from 'react';
import { MachineData } from '../../../types/factory';
import { MachineAssetIcon } from './MachineAssets';

interface MachineNodeProps {
  machine: MachineData;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (machine: MachineData) => void;
  onHoverStart: (machine: MachineData, event: React.MouseEvent) => void;
  onHoverEnd: () => void;
}

export const MachineNode: React.FC<MachineNodeProps> = ({
  machine,
  isSelected,
  isHovered,
  onSelect,
  onHoverStart,
  onHoverEnd,
}) => {
  const isWarning = machine.status === 'warning' || machine.status === 'error';

  // Status indicator colors (Vector.AI Palette)
  const getStatusColor = (status: MachineData['status']) => {
    switch (status) {
      case 'running':
        return 'var(--accent-green)'; // #16A34A
      case 'idle':
        return 'var(--accent-blue)';  // #2563EB
      case 'warning':
        return 'var(--accent-amber)'; // #D97706
      case 'error':
        return 'var(--accent-red)';   // #DC2626
      case 'maintenance':
        return '#7C3AED';
      default:
        return 'var(--text-muted)';
    }
  };

  const statusColor = getStatusColor(machine.status);

  return (
    <div
      id={`machine-node-${machine.id}`}
      className={`machine-node-card ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''} ${isWarning ? 'node-warning' : ''}`}
      style={{
        position: 'absolute',
        left: `${machine.x}px`,
        top: `${machine.y}px`,
        width: `${machine.width}px`,
        height: `${machine.height}px`,
        backgroundColor: isWarning ? '#FFF5F5' : 'var(--bg-card)',
        borderColor: isWarning
          ? 'var(--accent-red)'
          : isSelected
          ? 'var(--accent-amber)'
          : 'var(--border-strong)',
        borderWidth: isSelected || isWarning ? '2px' : '1.5px',
        borderStyle: 'solid',
        borderRadius: '4px',
        boxShadow: isWarning
          ? '2.5px 2.5px 0px var(--accent-red)'
          : isSelected
          ? '3px 3px 0px var(--accent-amber)'
          : isHovered
          ? '3.5px 3.5px 0px var(--border-strong)'
          : '2px 2px 0px var(--border-strong)',
        transform: isHovered ? 'translate(-1.5px, -1.5px)' : 'none',
        transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer',
        overflow: 'visible',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(machine);
      }}
      onMouseEnter={(e) => onHoverStart(machine, e)}
      onMouseLeave={onHoverEnd}
    >
      {/* Industrial Inbound Docking Port (Left Center) */}
      <div
        style={{
          position: 'absolute',
          left: '-4px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '6px',
          height: '10px',
          backgroundColor: 'var(--bg-card)',
          border: '1.5px solid var(--border-strong)',
          borderRadius: '1px',
          zIndex: 4,
          pointerEvents: 'none',
        }}
      />

      {/* Industrial Outbound Docking Port (Right Center) */}
      <div
        style={{
          position: 'absolute',
          right: '-4px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '6px',
          height: '10px',
          backgroundColor: isWarning ? 'var(--accent-red)' : 'var(--border-strong)',
          border: '1.5px solid var(--border-strong)',
          borderRadius: '1px',
          zIndex: 4,
          pointerEvents: 'none',
        }}
      />

      {/* Tiny circle on top right indicating status */}
      <div
        className="machine-status-circle"
        title={`Status: ${machine.status.toUpperCase()}`}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '9px',
          height: '9px',
          borderRadius: '50%',
          backgroundColor: isWarning ? 'var(--accent-red)' : statusColor,
          border: '1.5px solid var(--border-strong)',
          zIndex: 5,
        }}
      >
        {(machine.status === 'running' || isWarning) && (
          <span
            style={{
              position: 'absolute',
              top: '-3px',
              left: '-3px',
              right: '-3px',
              bottom: '-3px',
              borderRadius: '50%',
              border: `1.5px solid ${isWarning ? 'var(--accent-red)' : statusColor}`,
              animation: 'status-pulse 1.8s infinite ease-out',
              opacity: 0.85,
            }}
          />
        )}
      </div>

      {/* Main Inner Content Layout (Vector.AI Technical Schematic Style) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          padding: '10px 12px',
          gap: '12px',
          userSelect: 'none',
        }}
      >
        {/* Left Side: 2.5D Machine Asset Graphic */}
        <div
          className="machine-icon-wrapper"
          style={{
            width: '74px',
            height: '74px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isWarning ? 'rgba(220, 38, 38, 0.06)' : 'var(--bg-surface)',
            borderRadius: '3px',
            border: isWarning ? '1px solid var(--accent-red)' : '1px solid var(--border-light)',
            flexShrink: 0,
            transition: 'transform 0.15s ease',
            transform: isHovered ? 'scale(1.04)' : 'none',
          }}
        >
          <MachineAssetIcon
            type={machine.type}
            size={64}
            highlight={isSelected || isHovered || isWarning}
          />
        </div>

        {/* Right Side: Machine Technical Details */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '3px',
          }}
        >
          {/* Top Row: Machine Code & Hardware ID */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                fontSize: '11px',
                letterSpacing: '0.06em',
                backgroundColor: isWarning ? 'var(--accent-red)' : 'var(--bg-dark)',
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
                fontSize: '9px',
                fontWeight: 700,
                color: 'var(--text-muted)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-surface)',
                padding: '1px 4px',
                borderRadius: '2px',
              }}
            >
              {machine.id}
            </span>
          </div>

          {/* Machine Name/Type */}
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '12px',
              fontWeight: 700,
              color: isWarning ? 'var(--accent-red)' : 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              letterSpacing: '0.01em',
            }}
          >
            {machine.name}
          </div>

          {/* Efficiency Metric Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              border: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-surface)',
              padding: '1px 5px',
              borderRadius: '2px',
              width: 'fit-content',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: isWarning ? 'var(--accent-red)' : statusColor,
                display: 'inline-block',
              }}
            />
            <span style={{ color: isWarning ? 'var(--accent-red)' : 'var(--text-primary)' }}>
              {machine.efficiency.toFixed(2)}
            </span>
            <span
              style={{
                fontSize: '8px',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.04em',
              }}
            >
              {machine.category === 'transport' ? 'FLOW' : 'OEE'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
