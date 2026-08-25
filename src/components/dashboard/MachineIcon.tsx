import React from 'react';
import { MachineType } from '../../types/dashboard';

interface MachineIconProps {
  type: MachineType | 'WD' | 'DA' | 'WB' | 'MD' | 'TS';
  size?: number;
  color?: string;
  className?: string;
}

export const MachineIcon: React.FC<MachineIconProps> = ({
  type,
  size = 20,
  color = 'currentColor',
  className = '',
}) => {
  const isWD = type === 'Wafer Dicing Machine' || type === 'WD';
  const isDA = type === 'Die Attacher' || type === 'DA';
  const isWB = type === 'Wire Bonder' || type === 'WB';
  const isMD = type === 'Molding Machine' || type === 'MD';
  const isTS = type === 'IC Tester & Sorter' || type === 'TS';

  if (isWD) {
    // Wafer Dicer: Circular Wafer Saw Blade with Cut Lines
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <circle cx="12" cy="12" r="9" strokeDasharray="3 2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
        <path d="M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3" strokeWidth="1.2" />
      </svg>
    );
  }

  if (isDA) {
    // Die Attacher: Vacuum Pick Head placing Micro-Die onto Substrate
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M12 2v7M8 9h8" />
        <rect x="7" y="11" width="10" height="6" rx="1" fill="currentColor" fillOpacity="0.15" />
        <path d="M3 21h18" strokeWidth="2.2" />
        <path d="M5 19h14" strokeDasharray="2 2" />
      </svg>
    );
  }

  if (isWB) {
    // Wire Bonder: Capillary Head with Wire Arch Loop & Bond Pads
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M10 2l2 6 2-6z" fill="currentColor" fillOpacity="0.2" />
        <path d="M12 8c0 4-5 6-7 10" />
        <path d="M12 8c0 4 5 6 7 10" />
        <circle cx="5" cy="19" r="1.5" fill="currentColor" />
        <circle cx="19" cy="19" r="1.5" fill="currentColor" />
        <path d="M2 21h20" />
      </svg>
    );
  }

  if (isMD) {
    // Molding Machine: Hydraulic Press Plunger & Mold Cavity
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <rect x="4" y="3" width="16" height="4" />
        <path d="M12 7v5M9 12h6" />
        <rect x="3" y="14" width="18" height="7" rx="1" fill="currentColor" fillOpacity="0.15" />
        <path d="M7 17h2M11 17h2M15 17h2" />
      </svg>
    );
  }

  // IC Tester & Sorter: Packaged IC with Kelvin Socket Probe pins
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" fillOpacity="0.15" />
      <path d="M9 2v4M15 2v4M9 18v4M15 18v4" />
      <path d="M2 9h4M2 15h4M18 9h4M18 15h4" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
    </svg>
  );
};
