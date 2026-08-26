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
    // 1. WAFER DICING SAW (WS)
    case 'wafer-saw':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Machine Outer Casing */}
          <rect x="4" y="6" width="32" height="28" rx="2" fill="#F8FAFC" stroke={color} strokeWidth="1.5" />
          {/* Dual 300mm FOUP cassette load ports on front */}
          <rect x="7" y="27" width="11" height="5" rx="1" fill="#0284C7" stroke={color} strokeWidth="0.8" />
          <rect x="22" y="27" width="11" height="5" rx="1" fill="#0284C7" stroke={color} strokeWidth="0.8" />
          {/* Rotating Silicon Wafer Chuck */}
          <circle cx="20" cy="17" r="8" fill="#E2E8F0" stroke={color} strokeWidth="1.2" />
          {/* 300mm Silicon Wafer with grid lines */}
          <circle cx="20" cy="17" r="6" fill="#0284C7" fillOpacity="0.25" stroke="#0284C7" strokeWidth="0.8" />
          <line x1="16" y1="17" x2="24" y2="17" stroke="#0284C7" strokeWidth="0.6" />
          <line x1="20" y1="13" x2="20" y2="21" stroke="#0284C7" strokeWidth="0.6" />
          {/* Spindle Blade Carriage */}
          <rect x="18" y="7" width="4" height="6" fill="#D97706" stroke={color} strokeWidth="0.8" />
          {/* 3-Tier Andon Light */}
          <circle cx="32" cy="9" r="1.5" fill="#16A34A" />
        </svg>
      );

    // 2. DIE ATTACH (DA)
    case 'die-attach':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Machine Frame */}
          <rect x="4" y="6" width="32" height="28" rx="2" fill="#FFFFFF" stroke={color} strokeWidth="1.5" />
          {/* Wafer Ring Stage (Left) */}
          <circle cx="14" cy="18" r="6.5" fill="#E2E8F0" stroke={color} strokeWidth="1" />
          <rect x="11.5" y="15.5" width="5" height="5" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="0.6" />
          {/* Epoxy Dispense & Collet Pick-and-Place Rail */}
          <line x1="14" y1="11" x2="28" y2="11" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="21" cy="11" r="2" fill="#D97706" />
          {/* Leadframe Magazine Indexer (Right) */}
          <rect x="25" y="11" width="7" height="15" rx="1" fill="#F1F5F9" stroke={color} strokeWidth="1" />
          <line x1="26" y1="14" x2="31" y2="14" stroke="#94A3B8" strokeWidth="0.8" />
          <line x1="26" y1="18" x2="31" y2="18" stroke="#94A3B8" strokeWidth="0.8" />
          <line x1="26" y1="22" x2="31" y2="22" stroke="#94A3B8" strokeWidth="0.8" />
          {/* Touchscreen UI */}
          <rect x="6" y="27" width="10" height="5" rx="0.5" fill="#0F172A" />
        </svg>
      );

    // 3. RF PLASMA CLEANER (PC)
    case 'plasma-cleaner':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="5" y="6" width="30" height="28" rx="2" fill="#F8FAFC" stroke={color} strokeWidth="1.5" />
          {/* Stainless Cylindrical Vacuum Chamber */}
          <circle cx="20" cy="18" r="9" fill="#0F172A" stroke={color} strokeWidth="1.2" />
          {/* Glowing Purple RF Argon Plasma */}
          <circle cx="20" cy="18" r="6" fill="#A855F7" fillOpacity="0.6" />
          <circle cx="20" cy="18" r="3" fill="#E9D5FF" />
          {/* Dual Loadlock Slide Doors */}
          <line x1="7" y1="18" x2="11" y2="18" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
          <line x1="29" y1="18" x2="33" y2="18" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
          {/* RF Match Box Indicator */}
          <circle cx="31" cy="9" r="1.5" fill="#A855F7" />
        </svg>
      );

    // 4. WIRE BONDING (WB)
    case 'wire-bonding':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="4" y="6" width="32" height="28" rx="2" fill="#FFFFFF" stroke={color} strokeWidth="1.5" />
          {/* Indexed Leadframe Heating Track */}
          <rect x="4" y="22" width="32" height="6" fill="#E2E8F0" stroke={color} strokeWidth="1" />
          <rect x="12" y="23" width="16" height="4" fill="#CA8A04" stroke="#A16207" strokeWidth="0.8" />
          {/* Spool Enclosure (Gold/Copper Wire) */}
          <circle cx="20" cy="12" r="5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.2" />
          <circle cx="20" cy="12" r="1.5" fill="#0F172A" />
          {/* Transducer Ultrasonic Bondhead */}
          <path d="M20 17 V21 L16 23" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
          {/* Micro-wire Arc Representation */}
          <path d="M14 23 Q17 20 20 23 Q23 20 26 23" stroke="#EAB308" strokeWidth="1.2" fill="none" />
          {/* Dual Screen Display Arm */}
          <rect x="28" y="8" width="6" height="5" rx="0.5" fill="#0F172A" />
        </svg>
      );

    // 5. AUTO MOLDING PRESS (MP)
    case 'molding-press':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="4" y="6" width="32" height="28" rx="2" fill="#0F172A" stroke={color} strokeWidth="1.5" />
          {/* 4 Heavy Hydraulic Tie-Bars */}
          <circle cx="8" cy="10" r="2" fill="#94A3B8" stroke="#CBD5E1" strokeWidth="0.8" />
          <circle cx="32" cy="10" r="2" fill="#94A3B8" stroke="#CBD5E1" strokeWidth="0.8" />
          <circle cx="8" cy="30" r="2" fill="#94A3B8" stroke="#CBD5E1" strokeWidth="0.8" />
          <circle cx="32" cy="30" r="2" fill="#94A3B8" stroke="#CBD5E1" strokeWidth="0.8" />
          {/* Heated Mold Platen (175°C) with Multi-Cavity Grid */}
          <rect x="11" y="11" width="18" height="18" rx="1" fill="#1E293B" stroke="#EF4444" strokeWidth="1" />
          <rect x="13" y="13" width="6" height="6" fill="#EF4444" fillOpacity="0.25" stroke="#EF4444" strokeWidth="0.6" />
          <rect x="21" y="13" width="6" height="6" fill="#EF4444" fillOpacity="0.25" stroke="#EF4444" strokeWidth="0.6" />
          <rect x="13" y="21" width="6" height="6" fill="#EF4444" fillOpacity="0.25" stroke="#EF4444" strokeWidth="0.6" />
          <rect x="21" y="21" width="6" height="6" fill="#EF4444" fillOpacity="0.25" stroke="#EF4444" strokeWidth="0.6" />
          {/* Thermal Heating Indicator */}
          <line x1="14" y1="20" x2="26" y2="20" stroke="#EF4444" strokeWidth="1" strokeDasharray="2 1" />
        </svg>
      );

    // 6. 3D AOI OPTICAL INSPECTION (AOI)
    case 'aoi-inspection':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="4" y="6" width="32" height="28" rx="2" fill="#FFFFFF" stroke={color} strokeWidth="1.5" />
          {/* Dual-Lane SMEMA Conveyor */}
          <line x1="4" y1="20" x2="36" y2="20" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 1" />
          {/* Multi-Angle Circular RGB+W LED Illumination Dome */}
          <circle cx="20" cy="20" r="9" fill="#0284C7" fillOpacity="0.1" stroke="#0284C7" strokeWidth="1.2" />
          <circle cx="20" cy="20" r="4.5" fill="#38BDF8" fillOpacity="0.3" stroke="#0284C7" strokeWidth="0.8" />
          {/* Telecentric Camera Aperture */}
          <circle cx="20" cy="20" r="2" fill="#0F172A" />
          {/* Optical Target Crosshair */}
          <line x1="20" y1="13" x2="20" y2="15" stroke="#EF4444" strokeWidth="1" />
          <line x1="20" y1="25" x2="20" y2="27" stroke="#EF4444" strokeWidth="1" />
          <line x1="13" y1="20" x2="15" y2="20" stroke="#EF4444" strokeWidth="1" />
          <line x1="25" y1="20" x2="27" y2="20" stroke="#EF4444" strokeWidth="1" />
        </svg>
      );

    // 7. MICROFOCUS X-RAY NDT (XR)
    case 'x-ray-inspection':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Lead-Shielded Enclosure with Hazard Warning */}
          <rect x="4" y="6" width="32" height="28" rx="2" fill="#1E293B" stroke={color} strokeWidth="1.8" />
          {/* Radiation Warning Sign on Door */}
          <polygon points="20,10 24,18 16,18" fill="#F59E0B" />
          <circle cx="20" cy="15" r="1.5" fill="#0F172A" />
          {/* Internal X-Ray Cone Beam */}
          <line x1="20" y1="19" x2="12" y2="28" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 1" />
          <line x1="20" y1="19" x2="20" y2="28" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="2 1" />
          <line x1="20" y1="19" x2="28" y2="28" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 1" />
          {/* Detector Stage */}
          <rect x="10" y="28" width="20" height="3" rx="0.5" fill="#0F172A" stroke="#475569" strokeWidth="0.8" />
        </svg>
      );

    // 8. GALVO FIBER LASER MARKING (LM)
    case 'laser-marking':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="4" y="6" width="32" height="28" rx="2" fill="#F8FAFC" stroke={color} strokeWidth="1.5" />
          {/* Class 1 Laser Safety Window */}
          <rect x="8" y="10" width="24" height="16" rx="1" fill="#1E293B" stroke="#475569" strokeWidth="1" />
          {/* Galvo Head & Red Laser Beam */}
          <rect x="17" y="7" width="6" height="5" fill="#0F172A" />
          <line x1="20" y1="12" x2="20" y2="21" stroke="#EF4444" strokeWidth="1.8" />
          <circle cx="20" cy="21" r="1.5" fill="#FDE047" />
          {/* 2D DataMatrix Grid Target */}
          <rect x="14" y="21" width="12" height="3" rx="0.5" fill="#E2E8F0" stroke="#0F172A" strokeWidth="0.5" />
        </svg>
      );

    // 9. TRI-TEMP TEST HANDLER (TH)
    case 'test-handler':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="4" y="6" width="32" height="28" rx="2" fill="#FFFFFF" stroke={color} strokeWidth="1.5" />
          {/* Thermal Soak Chamber */}
          <rect x="8" y="9" width="24" height="10" rx="1" fill="#0284C7" fillOpacity="0.2" stroke="#0284C7" strokeWidth="1" />
          <text x="20" y="16.5" textAnchor="middle" fontSize="6.5" fontFamily="monospace" fontWeight="800" fill="#0284C7">TRI-TEMP</text>
          {/* Multi-Bin Sort Channels (Pass, Fail, Re-Test) */}
          <rect x="8" y="22" width="7" height="8" rx="0.5" fill="#22C55E" fillOpacity="0.3" stroke="#16A34A" strokeWidth="0.8" />
          <rect x="16.5" y="22" width="7" height="8" rx="0.5" fill="#EF4444" fillOpacity="0.3" stroke="#DC2626" strokeWidth="0.8" />
          <rect x="25" y="22" width="7" height="8" rx="0.5" fill="#F59E0B" fillOpacity="0.3" stroke="#D97706" strokeWidth="0.8" />
        </svg>
      );

    // 10. TAPE & REEL PACKAGING (TR)
    case 'tape-reel':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="4" y="6" width="32" height="28" rx="2" fill="#F8FAFC" stroke={color} strokeWidth="1.5" />
          {/* Carrier Tape Payout Reel */}
          <circle cx="12" cy="18" r="6" fill="#FFFFFF" stroke={color} strokeWidth="1" />
          <circle cx="12" cy="18" r="2" fill="#0F172A" />
          {/* Heat Sealing Press Shoe */}
          <rect x="18" y="16" width="4" height="4" fill="#EF4444" />
          {/* 13-Inch Take-Up Reel Spindle */}
          <circle cx="28" cy="18" r="7.5" fill="#FFFFFF" stroke={color} strokeWidth="1.2" />
          <circle cx="28" cy="18" r="2.5" fill="#CBD5E1" />
          <line x1="18" y1="18" x2="28" y2="18" stroke="#1E293B" strokeWidth="1.5" />
        </svg>
      );

    // 11. AMHS STOCKER (STK)
    case 'stocker':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="4" y="5" width="32" height="30" rx="2" fill="#F8FAFC" stroke={color} strokeWidth="1.8" />
          {/* Multi-Tier FOUP Storage Shelves */}
          <rect x="7" y="8" width="10" height="7" rx="0.5" fill="#0284C7" fillOpacity="0.3" stroke="#0284C7" strokeWidth="0.8" />
          <rect x="7" y="17" width="10" height="7" rx="0.5" fill="#0284C7" fillOpacity="0.3" stroke="#0284C7" strokeWidth="0.8" />
          <rect x="7" y="26" width="10" height="7" rx="0.5" fill="#0284C7" fillOpacity="0.3" stroke="#0284C7" strokeWidth="0.8" />
          {/* Central Robotic Gripper Crane */}
          <line x1="20" y1="6" x2="20" y2="34" stroke={color} strokeWidth="1.2" />
          <rect x="18" y="15" width="4" height="8" rx="0.5" fill="#D97706" />
          {/* Right Storage Shelves */}
          <rect x="23" y="8" width="10" height="7" rx="0.5" fill="#0284C7" fillOpacity="0.3" stroke="#0284C7" strokeWidth="0.8" />
          <rect x="23" y="17" width="10" height="7" rx="0.5" fill="#0284C7" fillOpacity="0.3" stroke="#0284C7" strokeWidth="0.8" />
          <rect x="23" y="26" width="10" height="7" rx="0.5" fill="#0284C7" fillOpacity="0.3" stroke="#0284C7" strokeWidth="0.8" />
        </svg>
      );

    // 12. AGV STATION
    case 'agv-station':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="6" y="10" width="28" height="20" rx="3" fill="#FFFFFF" stroke={color} strokeWidth="1.8" />
          <rect x="8" y="24" width="6" height="5" rx="1" fill="#0F172A" />
          <rect x="26" y="24" width="6" height="5" rx="1" fill="#0F172A" />
          <circle cx="11" cy="15" r="2.2" fill="#EF4444" stroke={color} strokeWidth="0.8" />
          <path d="M22 12 L18 18 H22 L20 24 L26 17 H21 L23 12 Z" fill="#EAB308" stroke="#CA8A04" strokeWidth="0.8" />
        </svg>
      );

    // 13. AIR SHOWER
    case 'air-shower':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="6" y="6" width="28" height="28" rx="2" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
          <circle cx="10" cy="14" r="1.5" fill="#0284C7" />
          <circle cx="10" cy="20" r="1.5" fill="#0284C7" />
          <circle cx="10" cy="26" r="1.5" fill="#0284C7" />
          <circle cx="30" cy="14" r="1.5" fill="#0284C7" />
          <circle cx="30" cy="20" r="1.5" fill="#0284C7" />
          <circle cx="30" cy="26" r="1.5" fill="#0284C7" />
          <line x1="12" y1="14" x2="17" y2="16" stroke="#38BDF8" strokeWidth="1" strokeDasharray="1.5 1" />
          <line x1="28" y1="14" x2="23" y2="16" stroke="#38BDF8" strokeWidth="1" strokeDasharray="1.5 1" />
          <line x1="12" y1="20" x2="17" y2="20" stroke="#38BDF8" strokeWidth="1" strokeDasharray="1.5 1" />
          <line x1="28" y1="20" x2="23" y2="20" stroke="#38BDF8" strokeWidth="1" strokeDasharray="1.5 1" />
        </svg>
      );

    // 14. GOWNING BENCH
    case 'gowning-bench':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="5" y="16" width="30" height="8" rx="1" fill="#E2E8F0" stroke={color} strokeWidth="1.5" />
          <line x1="8" y1="24" x2="8" y2="30" stroke={color} strokeWidth="1.5" />
          <line x1="32" y1="24" x2="32" y2="30" stroke={color} strokeWidth="1.5" />
          <line x1="5" y1="20" x2="35" y2="20" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      );

    // 15. STICKY MAT
    case 'sticky-mat':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="6" y="10" width="28" height="20" rx="1" fill="#0284C7" fillOpacity="0.2" stroke="#0284C7" strokeWidth="1.5" />
          <line x1="6" y1="15" x2="34" y2="15" stroke="#0284C7" strokeWidth="0.8" strokeDasharray="2 1" />
          <line x1="6" y1="20" x2="34" y2="20" stroke="#0284C7" strokeWidth="0.8" strokeDasharray="2 1" />
          <line x1="6" y1="25" x2="34" y2="25" stroke="#0284C7" strokeWidth="0.8" strokeDasharray="2 1" />
        </svg>
      );

    // 16. PASS THROUGH
    case 'pass-through':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="8" y="8" width="24" height="24" rx="2" fill="#FFFFFF" stroke={color} strokeWidth="1.5" />
          <line x1="12" y1="8" x2="12" y2="32" stroke="#3B82F6" strokeWidth="1.5" />
          <line x1="28" y1="8" x2="28" y2="32" stroke="#3B82F6" strokeWidth="1.5" />
          <circle cx="20" cy="20" r="3" fill="#A855F7" fillOpacity="0.5" stroke="#9333EA" strokeWidth="0.8" />
        </svg>
      );

    // 17. ESD RACK
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

export default FloorIcon;
