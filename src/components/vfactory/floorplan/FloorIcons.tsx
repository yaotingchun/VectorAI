import React from 'react';
import { FloorAssetType, StructureType } from '../../../types/floorPlan';

interface FloorIconProps {
  type: FloorAssetType | StructureType;
  size?: number;
  className?: string;
  color?: string;
}

export const FloorIcon: React.FC<FloorIconProps> = ({
  type,
  size = 32,
  className = '',
  color = '#1E293B',
}) => {
  switch (type) {
    // 1. DIE ATTACH (DA)
    case 'die-attach':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="6" y="28" width="28" height="6" rx="1.5" fill="#E2E8F0" stroke={color} strokeWidth="1.5" />
          <rect x="8" y="8" width="24" height="20" rx="2" fill="#FFFFFF" stroke={color} strokeWidth="1.5" />
          <rect x="15" y="10" width="10" height="7" rx="1" fill="#0F172A" />
          <line x1="20" y1="17" x2="20" y2="24" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <polygon points="17,24 23,24 20,27" fill="#D97706" />
          <rect x="12" y="25" width="16" height="3" rx="0.5" fill="#F8FAFC" stroke={color} strokeWidth="1" />
        </svg>
      );

    // 2. WIRE BONDING (WB)
    case 'wire-bonding':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="6" y="28" width="28" height="6" rx="1.5" fill="#E2E8F0" stroke={color} strokeWidth="1.5" />
          <path d="M8 16 C8 11 13 8 20 8 C27 8 32 11 32 16 V28 H8 V16 Z" fill="#FFFFFF" stroke={color} strokeWidth="1.5" />
          <circle cx="20" cy="14" r="4.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.2" />
          <circle cx="20" cy="14" r="1.5" fill="#0F172A" />
          <path d="M20 18.5 V23 L17 26" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <rect x="11" y="25" width="18" height="3" rx="0.5" fill="#FFFFFF" stroke={color} strokeWidth="1" />
          <path d="M14 25 Q17 22 20 25 Q23 22 26 25" stroke="#EAB308" strokeWidth="1.2" fill="none" />
        </svg>
      );

    // 3. MOLDING PRESS (MP)
    case 'molding-press':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="5" y="28" width="30" height="6" rx="1" fill="#0F172A" />
          <rect x="7" y="6" width="26" height="6" rx="1" fill="#1E293B" />
          <rect x="8" y="12" width="4" height="16" fill="#94A3B8" stroke={color} strokeWidth="1" />
          <rect x="28" y="12" width="4" height="16" fill="#94A3B8" stroke={color} strokeWidth="1" />
          <rect x="13" y="14" width="14" height="5" rx="1" fill="#E2E8F0" stroke={color} strokeWidth="1.2" />
          <rect x="13" y="22" width="14" height="6" rx="1" fill="#CBD5E1" stroke={color} strokeWidth="1.2" />
          <line x1="15" y1="16.5" x2="25" y2="16.5" stroke="#EF4444" strokeWidth="1" strokeDasharray="1.5 1" />
        </svg>
      );

    // 4. AOI INSPECTION (AOI)
    case 'aoi-inspection':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="6" y="28" width="28" height="6" rx="1.5" fill="#E2E8F0" stroke={color} strokeWidth="1.5" />
          <rect x="7" y="8" width="26" height="20" rx="2" fill="#FFFFFF" stroke={color} strokeWidth="1.5" />
          <rect x="14" y="6" width="12" height="6" rx="1" fill="#0F172A" />
          <circle cx="20" cy="9" r="2" fill="#38BDF8" />
          <polygon points="16,12 24,12 28,24 12,24" fill="#3B82F6" fillOpacity="0.15" stroke="#3B82F6" strokeWidth="0.8" strokeDasharray="2 1" />
          <rect x="11" y="24" width="18" height="4" rx="0.5" fill="#F1F5F9" stroke={color} strokeWidth="1" />
          <circle cx="20" cy="26" r="1.5" stroke="#EF4444" strokeWidth="0.8" fill="none" />
        </svg>
      );

    // 5. X-RAY INSPECTION (XR)
    case 'x-ray-inspection':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="6" y="28" width="28" height="6" rx="1.5" fill="#0F172A" />
          <rect x="8" y="7" width="24" height="21" rx="2" fill="#E2E8F0" stroke={color} strokeWidth="1.8" />
          <polygon points="16,9 24,9 21,14 19,14" fill="#0F172A" />
          <line x1="20" y1="14" x2="14" y2="23" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 1" />
          <line x1="20" y1="14" x2="20" y2="23" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="2 1" />
          <line x1="20" y1="14" x2="26" y2="23" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 1" />
          <rect x="11" y="23" width="18" height="3" rx="0.5" fill="#1E293B" />
          <circle cx="27" cy="11" r="2" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.8" />
        </svg>
      );

    // 6. LASER MARKING (LM)
    case 'laser-marking':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="6" y="28" width="28" height="6" rx="1.5" fill="#E2E8F0" stroke={color} strokeWidth="1.5" />
          <rect x="8" y="8" width="24" height="20" rx="2" fill="#F8FAFC" stroke={color} strokeWidth="1.5" />
          <rect x="11" y="11" width="18" height="13" rx="1" fill="#1E293B" stroke="#475569" strokeWidth="1" />
          <rect x="16" y="9" width="8" height="5" rx="0.5" fill="#0F172A" />
          <line x1="20" y1="14" x2="20" y2="21" stroke="#EF4444" strokeWidth="1.5" />
          <circle cx="20" cy="21" r="1.5" fill="#FDE047" />
          <rect x="13" y="21.5" width="14" height="2.5" rx="0.5" fill="#E2E8F0" />
        </svg>
      );

    // 7. TAPE & REEL (TR)
    case 'tape-reel':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="6" y="28" width="28" height="6" rx="1.5" fill="#E2E8F0" stroke={color} strokeWidth="1.5" />
          <rect x="8" y="8" width="24" height="20" rx="2" fill="#F1F5F9" stroke={color} strokeWidth="1.5" />
          <circle cx="20" cy="18" r="7.5" fill="#FFFFFF" stroke={color} strokeWidth="1.2" />
          <circle cx="20" cy="18" r="3" fill="#CBD5E1" stroke={color} strokeWidth="1" />
          <circle cx="20" cy="18" r="1" fill="#0F172A" />
          <line x1="20" y1="11" x2="20" y2="14" stroke={color} strokeWidth="1" />
          <line x1="20" y1="22" x2="20" y2="25" stroke={color} strokeWidth="1" />
          <line x1="13" y1="18" x2="16" y2="18" stroke={color} strokeWidth="1" />
          <line x1="24" y1="18" x2="27" y2="18" stroke={color} strokeWidth="1" />
          <path d="M25 22 L30 26" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    // 8. TEST HANDLER (TH)
    case 'test-handler':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="6" y="28" width="28" height="6" rx="1.5" fill="#E2E8F0" stroke={color} strokeWidth="1.5" />
          <rect x="8" y="8" width="24" height="20" rx="2" fill="#FFFFFF" stroke={color} strokeWidth="1.5" />
          <rect x="11" y="11" width="18" height="8" rx="1" fill="#0284C7" fillOpacity="0.2" stroke="#0284C7" strokeWidth="1" />
          <rect x="13" y="13" width="6" height="4" fill="#38BDF8" />
          <rect x="21" y="13" width="6" height="4" fill="#38BDF8" />
          <rect x="11" y="21" width="18" height="5" rx="0.5" fill="#1E293B" />
          <circle cx="15" cy="23.5" r="1" fill="#22C55E" />
          <circle cx="20" cy="23.5" r="1" fill="#38BDF8" />
          <circle cx="25" cy="23.5" r="1" fill="#EF4444" />
        </svg>
      );

    // 9. ROBOT ARM (RA)
    case 'robot-arm':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <ellipse cx="20" cy="30" rx="10" ry="3" fill="#E2E8F0" stroke={color} strokeWidth="1.5" />
          <circle cx="20" cy="28" r="4" fill="#0F172A" />
          <path d="M20 28 L14 18 L24 12" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="14" cy="18" r="2.5" fill="#38BDF8" stroke={color} strokeWidth="1" />
          <circle cx="24" cy="12" r="2.5" fill="#38BDF8" stroke={color} strokeWidth="1" />
          <path d="M24 12 L28 10 M28 8 V12" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    // 10. CONVEYOR (CV)
    case 'conveyor':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="4" y="14" width="32" height="12" rx="6" fill="#1E293B" stroke={color} strokeWidth="1.5" />
          <circle cx="10" cy="20" r="3.5" fill="#E2E8F0" stroke={color} strokeWidth="1" />
          <circle cx="20" cy="20" r="3.5" fill="#E2E8F0" stroke={color} strokeWidth="1" />
          <circle cx="30" cy="20" r="3.5" fill="#E2E8F0" stroke={color} strokeWidth="1" />
          <rect x="8" y="26" width="3" height="8" fill="#475569" />
          <rect x="29" y="26" width="3" height="8" fill="#475569" />
        </svg>
      );

    // 11. AGV STATION (AGV)
    case 'agv-station':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="6" y="12" width="28" height="18" rx="3" fill="#FFFFFF" stroke={color} strokeWidth="1.8" />
          <rect x="8" y="26" width="6" height="5" rx="1" fill="#0F172A" />
          <rect x="26" y="26" width="6" height="5" rx="1" fill="#0F172A" />
          <circle cx="11" cy="17" r="2.2" fill="#EF4444" stroke={color} strokeWidth="0.8" />
          <path d="M22 13 L18 19 H22 L20 25 L26 18 H21 L23 13 Z" fill="#EAB308" stroke="#CA8A04" strokeWidth="0.8" />
        </svg>
      );

    // 12. PLASMA CLEANER (PC)
    case 'plasma-cleaner':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="6" y="28" width="28" height="6" rx="1.5" fill="#E2E8F0" stroke={color} strokeWidth="1.5" />
          <rect x="8" y="8" width="24" height="20" rx="3" fill="#E2E8F0" stroke={color} strokeWidth="1.5" />
          <circle cx="20" cy="18" r="7" fill="#0F172A" stroke="#475569" strokeWidth="1.2" />
          <circle cx="20" cy="18" r="4.5" fill="#A855F7" />
          <circle cx="20" cy="18" r="2" fill="#FFFFFF" />
          <circle cx="13" cy="7" r="1.8" fill="#FFFFFF" stroke={color} strokeWidth="0.8" />
        </svg>
      );

    // 13. WALL
    case 'wall':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="4" y="16" width="32" height="8" rx="1" fill="#1E293B" stroke={color} strokeWidth="1.5" />
          <line x1="12" y1="16" x2="12" y2="24" stroke="#FFFFFF" strokeWidth="1" />
          <line x1="20" y1="16" x2="20" y2="24" stroke="#FFFFFF" strokeWidth="1" />
          <line x1="28" y1="16" x2="28" y2="24" stroke="#FFFFFF" strokeWidth="1" />
        </svg>
      );

    // 14. DOOR
    case 'door':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="6" y="24" width="28" height="3" fill="#1E293B" />
          <line x1="8" y1="24" x2="8" y2="10" stroke={color} strokeWidth="1.8" />
          <path d="M8 10 A 14 14 0 0 1 22 24" stroke="#64748B" strokeWidth="1.2" strokeDasharray="2 2" fill="none" />
        </svg>
      );

    // 15. COLUMN
    case 'column':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="10" y="10" width="20" height="20" rx="1" fill="#FFFFFF" stroke={color} strokeWidth="1.8" />
          <line x1="10" y1="10" x2="30" y2="30" stroke={color} strokeWidth="1" />
          <line x1="30" y1="10" x2="10" y2="30" stroke={color} strokeWidth="1" />
        </svg>
      );

    // 16. RACK / SHELF
    case 'rack':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="8" y="6" width="24" height="28" rx="1" fill="#F8FAFC" stroke={color} strokeWidth="1.5" />
          <line x1="8" y1="13" x2="32" y2="13" stroke={color} strokeWidth="1.2" />
          <line x1="8" y1="20" x2="32" y2="20" stroke={color} strokeWidth="1.2" />
          <line x1="8" y1="27" x2="32" y2="27" stroke={color} strokeWidth="1.2" />
          <line x1="20" y1="6" x2="20" y2="34" stroke={color} strokeWidth="1.2" />
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <rect x="8" y="8" width="24" height="24" rx="2" fill="#F1F5F9" stroke={color} strokeWidth="1.5" />
        </svg>
      );
  }
};
