import React from 'react';
import { MachineStatus } from '../types/machine';
import { getMachineStatusConfig } from '../utils/machineStatus';

interface MachineStatusBadgeProps {
  status: MachineStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

export const MachineStatusBadge: React.FC<MachineStatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
  className = ''
}) => {
  const config = getMachineStatusConfig(status);

  const sizeStyles = {
    sm: { fontSize: '9px', padding: '1px 6px', dotSize: '5px' },
    md: { fontSize: '10px', padding: '2px 8px', dotSize: '6px' },
    lg: { fontSize: '11px', padding: '4px 10px', dotSize: '7px' }
  }[size];

  return (
    <span
      className={`status-pill ${config.badgeClassName} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: sizeStyles.fontSize,
        padding: sizeStyles.padding,
        border: `1.5px solid ${config.borderColor}`,
        backgroundColor: config.bgLight,
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        borderRadius: '0px'
      }}
    >
      {showDot && (
        <span
          className={config.dotClassName}
          style={{
            width: sizeStyles.dotSize,
            height: sizeStyles.dotSize,
            backgroundColor: config.color,
            borderRadius: '50%',
            display: 'inline-block'
          }}
        />
      )}
      <span>{config.label}</span>
    </span>
  );
};
