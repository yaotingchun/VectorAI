import React from 'react';
import { MachineType } from '../../../types/factory';

interface MachineAssetProps {
  type: MachineType;
  className?: string;
  size?: number;
  highlight?: boolean;
}

export const MachineAssetIcon: React.FC<MachineAssetProps> = ({
  type,
  className = '',
  size = 72,
  highlight = false,
}) => {
  switch (type) {
    // =========================================================================
    // 1. WAFER SAW (WS-2000) - Diamond Blade Spindle & Wafer Chuck
    // =========================================================================
    case 'wafer-saw':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="ws-body" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="60%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="ws-glass" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="ws-wafer" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
            <filter id="ws-shadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#0F172A" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Machine Drop Shadow on Floor */}
          <ellipse cx="50" cy="88" rx="38" ry="6" fill="#0F172A" fillOpacity="0.12" />

          {/* Base Stand & Vibration Dampeners */}
          <rect x="18" y="78" width="64" height="8" rx="2" fill="#334155" />
          <rect x="24" y="86" width="10" height="3" rx="1" fill="#0F172A" />
          <rect x="66" y="86" width="10" height="3" rx="1" fill="#0F172A" />

          {/* Main Chassis with Chamfer */}
          <path
            d="M20 30 C20 25 24 22 28 22 H72 C76 22 80 25 80 30 V78 H20 V30 Z"
            fill="url(#ws-body)"
            stroke="#1E293B"
            strokeWidth="2"
            filter="url(#ws-shadow)"
          />

          {/* Side Ventilation Slits */}
          <line x1="24" y1="40" x2="24" y2="68" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="40" x2="28" y2="68" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

          {/* Cleanroom Observation Chamber Window */}
          <rect x="34" y="28" width="40" height="36" rx="4" fill="url(#ws-glass)" stroke="#0F172A" strokeWidth="1.8" />
          
          {/* Inner 300mm Silicon Wafer Chuck */}
          <ellipse cx="54" cy="52" rx="14" ry="7" fill="url(#ws-wafer)" stroke="#0284C7" strokeWidth="1" />
          {/* Wafer Grid Pattern */}
          <line x1="44" y1="52" x2="64" y2="52" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.8" />
          <line x1="54" y1="46" x2="54" y2="58" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.8" />

          {/* High-Speed Dicing Saw Blade Assembly */}
          <circle cx="54" cy="40" r="7" fill="#64748B" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="54" cy="40" r="3" fill="#E2E8F0" />
          <path d="M54 33 V35 M54 45 V47 M47 40 H49 M59 40 H61" stroke="#F8FAFC" strokeWidth="1.2" strokeLinecap="round" />
          
          {/* Spindle Arm */}
          <path d="M54 28 V34" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />

          {/* Operator Touchscreen & Status Light Bar */}
          <rect x="34" y="68" width="40" height="7" rx="1.5" fill="#1E293B" />
          <rect x="37" y="70" width="12" height="3" rx="0.5" fill="#22C55E" />
          <circle cx="68" cy="71.5" r="1.5" fill="#38BDF8" />

          {/* Safety Tower Light on Top */}
          <rect x="70" y="14" width="4" height="8" rx="1" fill="#475569" />
          <circle cx="72" cy="13" r="2.5" fill={highlight ? '#F59E0B' : '#22C55E'} />
        </svg>
      );

    // =========================================================================
    // 2. DIE ATTACH (DA-3000) - Robotic Pick & Place Collet Head
    // =========================================================================
    case 'die-attach':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="da-body" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>

          {/* Shadow */}
          <ellipse cx="50" cy="88" rx="38" ry="6" fill="#0F172A" fillOpacity="0.12" />

          {/* Base */}
          <rect x="18" y="76" width="64" height="10" rx="2" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />

          {/* Main Enclosure */}
          <rect x="22" y="24" width="56" height="52" rx="4" fill="url(#da-body)" stroke="#1E293B" strokeWidth="2" />

          {/* Gantry Arch */}
          <path d="M30 76 V34 H70 V76" stroke="#475569" strokeWidth="2" fill="none" strokeDasharray="4 2" />

          {/* Leadframe Stage */}
          <rect x="30" y="64" width="40" height="8" rx="1" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.5" />
          <rect x="42" y="62" width="16" height="3" fill="#D97706" /> {/* Silicon Die */}

          {/* High-Precision Pick-and-Place Gantry Head */}
          <rect x="40" y="28" width="20" height="14" rx="2" fill="#0F172A" />
          <circle cx="50" cy="35" r="3" fill="#38BDF8" /> {/* Alignment Vision Lens */}

          {/* Vertical Collet Arm */}
          <line x1="50" y1="42" x2="50" y2="56" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          <polygon points="46,56 54,56 50,61" fill="#D97706" stroke="#0F172A" strokeWidth="1" />

          {/* Epoxy Dispense Syringe on Left */}
          <rect x="34" y="38" width="4" height="14" rx="1" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1" />
          <line x1="36" y1="52" x2="36" y2="58" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />

          {/* Status Indicator */}
          <circle cx="28" cy="30" r="2" fill="#22C55E" />
        </svg>
      );

    // =========================================================================
    // 3. WIRE BONDING (WB-6000) - Thermosonic Wire Capillary
    // =========================================================================
    case 'wire-bonding':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="wb-dome" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>

          {/* Shadow */}
          <ellipse cx="50" cy="88" rx="38" ry="6" fill="#0F172A" fillOpacity="0.12" />

          {/* Base */}
          <rect x="18" y="76" width="64" height="10" rx="2" fill="#1E293B" />

          {/* Ergonomic Curved Enclosure */}
          <path
            d="M22 42 C22 26 32 18 50 18 C68 18 78 26 78 42 V76 H22 V42 Z"
            fill="url(#wb-dome)"
            stroke="#1E293B"
            strokeWidth="2"
          />

          {/* Gold Wire Spool Carousel on Top */}
          <circle cx="50" cy="30" r="9" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2" />
          <circle cx="50" cy="30" r="6" fill="#FEF08A" stroke="#EAB308" strokeWidth="1.5" />
          <circle cx="50" cy="30" r="2" fill="#0F172A" />

          {/* Transducer & Capillary Bonding Arm */}
          <path d="M50 39 V52 L44 64" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="42,64 46,64 44,69" fill="#EAB308" />

          {/* Bonding Workholder Stage with Vacuum Heat Bed */}
          <rect x="28" y="68" width="44" height="8" rx="1.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
          
          {/* Micro Gold Wires Loop Arc */}
          <path d="M36 68 Q44 60 52 68" stroke="#EAB308" strokeWidth="1.8" fill="none" />
          <path d="M48 68 Q56 58 64 68" stroke="#EAB308" strokeWidth="1.8" fill="none" />

          {/* Stereo Microscope Optical Lens */}
          <ellipse cx="62" cy="40" rx="5" ry="3" fill="#38BDF8" stroke="#0F172A" strokeWidth="1.2" transform="rotate(-20 62 40)" />
        </svg>
      );

    // =========================================================================
    // 4. MOLDING PRESS (MP-7000) - 4-Column Hydraulic Encapsulation Mold
    // =========================================================================
    case 'molding-press':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="mp-steel" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>

          {/* Shadow */}
          <ellipse cx="50" cy="88" rx="38" ry="6" fill="#0F172A" fillOpacity="0.12" />

          {/* Heavy Machine Cast Base */}
          <rect x="16" y="74" width="68" height="12" rx="2" fill="#0F172A" stroke="#1E293B" strokeWidth="2" />

          {/* 4 Heavy-Duty Hardened Steel Columns */}
          <rect x="22" y="20" width="8" height="54" fill="url(#mp-steel)" stroke="#0F172A" strokeWidth="1.5" />
          <rect x="70" y="20" width="8" height="54" fill="url(#mp-steel)" stroke="#0F172A" strokeWidth="1.5" />

          {/* Top Hydraulic Cylinder Head */}
          <rect x="18" y="16" width="64" height="14" rx="2" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <rect x="42" y="10" width="16" height="6" fill="#334155" stroke="#0F172A" strokeWidth="1" />

          {/* Upper Movable Heated Platen (Ram) */}
          <rect x="28" y="36" width="44" height="12" rx="2" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2" />
          <line x1="32" y1="42" x2="68" y2="42" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 2" /> {/* Heating Rods */}

          {/* Lower Mold Cavity Base */}
          <rect x="28" y="58" width="44" height="14" rx="2" fill="#CBD5E1" stroke="#0F172A" strokeWidth="2" />
          
          {/* Hydraulic Pressure Indicator */}
          <circle cx="50" cy="23" r="3.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
          <line x1="50" y1="23" x2="52" y2="21" stroke="#EF4444" strokeWidth="1" />
        </svg>
      );

    // =========================================================================
    // 5. BALL ATTACH (BA-8000) - BGA Solder Sphere Matrix Placement
    // =========================================================================
    case 'ball-attach':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Shadow */}
          <ellipse cx="50" cy="88" rx="38" ry="6" fill="#0F172A" fillOpacity="0.12" />

          {/* Base */}
          <rect x="18" y="76" width="64" height="10" rx="2" fill="#1E293B" />

          {/* Main Enclosure */}
          <rect x="22" y="24" width="56" height="52" rx="4" fill="#F1F5F9" stroke="#1E293B" strokeWidth="2" />

          {/* Rotary Solder Ball Feeder Drum */}
          <circle cx="40" cy="40" r="12" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2" />
          <circle cx="40" cy="40" r="4" fill="#0F172A" />

          {/* Array of Micro Solder Balls */}
          <circle cx="62" cy="36" r="2" fill="#64748B" stroke="#0F172A" strokeWidth="0.8" />
          <circle cx="68" cy="36" r="2" fill="#64748B" stroke="#0F172A" strokeWidth="0.8" />
          <circle cx="62" cy="42" r="2" fill="#64748B" stroke="#0F172A" strokeWidth="0.8" />
          <circle cx="68" cy="42" r="2" fill="#64748B" stroke="#0F172A" strokeWidth="0.8" />

          {/* Flux Print & Drop Head */}
          <rect x="36" y="54" width="28" height="8" rx="1" fill="#0F172A" />
          
          {/* Substrate Carriage Bed */}
          <rect x="26" y="66" width="48" height="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
          <rect x="42" y="64" width="16" height="2" fill="#3B82F6" />
        </svg>
      );

    // =========================================================================
    // 6. PLASMA CLEANER (PC-1000) - Vacuum RF Chamber with Argon Glow
    // =========================================================================
    case 'plasma-cleaner':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <radialGradient id="plasma-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C084FC" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#818CF8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Shadow */}
          <ellipse cx="50" cy="88" rx="38" ry="6" fill="#0F172A" fillOpacity="0.12" />

          {/* Base */}
          <rect x="18" y="76" width="64" height="10" rx="2" fill="#1E293B" />

          {/* Chamber Body */}
          <rect x="22" y="22" width="56" height="54" rx="6" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" />

          {/* Heavy Vacuum Door Flange */}
          <circle cx="50" cy="48" r="18" fill="#0F172A" stroke="#475569" strokeWidth="3" />
          
          {/* Glass Porthole Window with Plasma Glow */}
          <circle cx="50" cy="48" r="13" fill="#020617" />
          <circle cx="50" cy="48" r="11" fill="url(#plasma-glow)" />

          {/* Ion discharge lightning core */}
          <path d="M50 39 L52 46 L57 48 L51 50 L50 57 L47 51 L43 48 L48 46 Z" fill="#FFFFFF" />

          {/* Vacuum Gauge Manometer on Top */}
          <circle cx="34" cy="18" r="4.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
          <line x1="34" y1="18" x2="36" y2="16" stroke="#EF4444" strokeWidth="1.2" />

          {/* RF Generator Status Bar */}
          <rect x="46" y="16" width="24" height="5" rx="1" fill="#0F172A" />
          <circle cx="65" cy="18.5" r="1.2" fill="#22C55E" />
        </svg>
      );

    // =========================================================================
    // 7. AOI INSPECTION (AOI-5000) - 3D Optical Metrology & Vision Turret
    // =========================================================================
    case 'aoi-inspection':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="aoi-laser" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Shadow */}
          <ellipse cx="50" cy="88" rx="38" ry="6" fill="#0F172A" fillOpacity="0.12" />

          {/* Base */}
          <rect x="18" y="76" width="64" height="10" rx="2" fill="#1E293B" />

          {/* Clean White Enclosure */}
          <rect x="20" y="24" width="60" height="52" rx="4" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />

          {/* Optical Sensor Gantry Dome */}
          <rect x="38" y="16" width="24" height="14" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          <circle cx="50" cy="23" r="4" fill="#38BDF8" /> {/* 120 FPS High-Res Camera */}

          {/* 3D Structured Light Scan Cone */}
          <polygon points="44,30 56,30 68,64 32,64" fill="url(#aoi-laser)" stroke="#3B82F6" strokeWidth="1" strokeDasharray="3 2" />

          {/* Inspected IC Substrate on Precision Stage */}
          <rect x="28" y="64" width="44" height="8" rx="1.5" fill="#F1F5F9" stroke="#0F172A" strokeWidth="1.5" />
          
          {/* Laser Reticle Target */}
          <circle cx="50" cy="68" r="3" stroke="#EF4444" strokeWidth="1" fill="none" />
          <line x1="50" y1="63" x2="50" y2="73" stroke="#EF4444" strokeWidth="0.8" />
          <line x1="45" y1="68" x2="55" y2="68" stroke="#EF4444" strokeWidth="0.8" />
        </svg>
      );

    // =========================================================================
    // 8. X-RAY INSPECTION (XR-6000) - Lead-Shielded Non-Destructive CT Scan
    // =========================================================================
    case 'x-ray-inspection':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Shadow */}
          <ellipse cx="50" cy="88" rx="38" ry="6" fill="#0F172A" fillOpacity="0.12" />

          {/* Heavy Lead Shield Base */}
          <rect x="18" y="76" width="64" height="10" rx="2" fill="#0F172A" />

          {/* Enclosure */}
          <rect x="22" y="20" width="56" height="56" rx="4" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2.5" />

          {/* Microfocus X-Ray Tube */}
          <polygon points="40,24 60,24 54,36 46,36" fill="#0F172A" stroke="#334155" strokeWidth="1" />

          {/* Penetrating Ray Lines */}
          <line x1="50" y1="36" x2="34" y2="62" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 2" />
          <line x1="50" y1="36" x2="50" y2="62" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 2" />
          <line x1="50" y1="36" x2="66" y2="62" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 2" />

          {/* Flat Panel Detector Platform */}
          <rect x="28" y="62" width="44" height="6" rx="1" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />

          {/* Radiation Warning Trefoil Emblem */}
          <circle cx="70" cy="28" r="4" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
          <circle cx="70" cy="28" r="1" fill="#0F172A" />
        </svg>
      );

    // =========================================================================
    // 9. LASER MARKING (LM-2000) - Fiber Laser Galvo 2D DataMatrix Engraving
    // =========================================================================
    case 'laser-marking':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Shadow */}
          <ellipse cx="50" cy="88" rx="38" ry="6" fill="#0F172A" fillOpacity="0.12" />

          {/* Base */}
          <rect x="18" y="76" width="64" height="10" rx="2" fill="#1E293B" />

          {/* Main Enclosure with Dark Laser Shield Glass */}
          <rect x="22" y="22" width="56" height="54" rx="4" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2" />
          <rect x="30" y="32" width="40" height="34" rx="2" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />

          {/* Galvo Laser Head */}
          <rect x="42" y="24" width="16" height="12" rx="1" fill="#0F172A" />

          {/* High Energy Focused Red Laser Beam */}
          <line x1="50" y1="36" x2="50" y2="56" stroke="#EF4444" strokeWidth="2.5" />
          
          {/* Laser Flash / Spark Core */}
          <circle cx="50" cy="56" r="3" fill="#FDE047" />
          <circle cx="50" cy="56" r="5" stroke="#EF4444" strokeWidth="1" strokeDasharray="2 2" fill="none" />

          {/* Engraving Stage */}
          <rect x="34" y="58" width="32" height="6" rx="1" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1" />
        </svg>
      );

    // =========================================================================
    // 10. TAPE & REEL (TR-3000) - 13-Inch Carrier Reel Packaging
    // =========================================================================
    case 'tape-reel':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Shadow */}
          <ellipse cx="50" cy="88" rx="38" ry="6" fill="#0F172A" fillOpacity="0.12" />

          {/* Base */}
          <rect x="18" y="76" width="64" height="10" rx="2" fill="#1E293B" />

          {/* Frame */}
          <rect x="20" y="22" width="60" height="54" rx="4" fill="#F1F5F9" stroke="#1E293B" strokeWidth="2" />

          {/* Large 13" Packaging Reel Spool */}
          <circle cx="50" cy="46" r="20" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          <circle cx="50" cy="46" r="8" fill="#CBD5E1" stroke="#0F172A" strokeWidth="2" />
          <circle cx="50" cy="46" r="3" fill="#0F172A" />

          {/* Reel Spokes */}
          <line x1="50" y1="28" x2="50" y2="36" stroke="#0F172A" strokeWidth="2" />
          <line x1="50" y1="56" x2="50" y2="64" stroke="#0F172A" strokeWidth="2" />
          <line x1="32" y1="46" x2="40" y2="46" stroke="#0F172A" strokeWidth="2" />
          <line x1="60" y1="46" x2="68" y2="46" stroke="#0F172A" strokeWidth="2" />

          {/* Carrier Tape Output Strip with IC Cavities */}
          <path d="M62 56 L76 66" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="70" cy="62" r="1.5" fill="#D97706" />
        </svg>
      );

    // =========================================================================
    // 11. CONVEYOR (CV-100) - Anti-static Belt & Roller System
    // =========================================================================
    case 'conveyor':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Floor Shadow */}
          <ellipse cx="50" cy="88" rx="42" ry="5" fill="#0F172A" fillOpacity="0.12" />

          {/* Support Legs */}
          <rect x="22" y="52" width="6" height="32" rx="1" fill="#334155" />
          <rect x="72" y="52" width="6" height="32" rx="1" fill="#334155" />
          <rect x="18" y="80" width="14" height="4" rx="1" fill="#0F172A" />
          <rect x="68" y="80" width="14" height="4" rx="1" fill="#0F172A" />

          {/* Conveyor Belt Track Body */}
          <rect x="12" y="34" width="76" height="22" rx="11" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />

          {/* Chrome Rollers */}
          <circle cx="24" cy="45" r="7" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2" />
          <circle cx="24" cy="45" r="2.5" fill="#0F172A" />

          <circle cx="50" cy="45" r="7" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2" />
          <circle cx="50" cy="45" r="2.5" fill="#0F172A" />

          <circle cx="76" cy="45" r="7" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2" />
          <circle cx="76" cy="45" r="2.5" fill="#0F172A" />

          {/* Pallet Carrier on Belt */}
          <rect x="42" y="26" width="16" height="8" rx="1.5" fill="#38BDF8" stroke="#0F172A" strokeWidth="1.5" />
          
          {/* Directional Velocity Chevrons */}
          <path d="M33 42 L36 45 L33 48" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M59 42 L62 45 L59 48" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // =========================================================================
    // 12. AGV (AGV-01) - Automated Guided Vehicle Shuttle
    // =========================================================================
    case 'agv':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Shadow */}
          <ellipse cx="50" cy="88" rx="38" ry="6" fill="#0F172A" fillOpacity="0.14" />

          {/* Heavy Duty Mecanum Wheels */}
          <rect x="20" y="70" width="14" height="10" rx="3" fill="#0F172A" stroke="#334155" strokeWidth="1" />
          <rect x="66" y="70" width="14" height="10" rx="3" fill="#0F172A" stroke="#334155" strokeWidth="1" />

          {/* AGV Main Low-Profile Chassis */}
          <rect x="16" y="38" width="68" height="34" rx="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          
          {/* Front 360 LiDAR Sensor Puck */}
          <circle cx="26" cy="46" r="4.5" fill="#EF4444" stroke="#0F172A" strokeWidth="1.5" />

          {/* Battery State LED Gauge */}
          <rect x="40" y="44" width="22" height="6" rx="1.5" fill="#0F172A" />
          <rect x="42" y="46" width="16" height="2" rx="0.5" fill="#22C55E" />

          {/* Cleanroom FOUP / Substrate Magazine Payload */}
          <rect x="28" y="20" width="44" height="18" rx="2" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1.8" />
          <line x1="34" y1="24" x2="66" y2="24" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
          <line x1="34" y1="29" x2="66" y2="29" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
          <line x1="34" y1="34" x2="66" y2="34" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />

          {/* Safety Warning Bumper Stripes */}
          <path d="M18 64 L24 70 M28 64 L34 70 M38 64 L44 70" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // =========================================================================
    // 13. BUFFER / QUEUE (BQ-01) - Cleanroom Cassette Staging Magazine
    // =========================================================================
    case 'buffer-queue':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Shadow */}
          <ellipse cx="50" cy="88" rx="38" ry="6" fill="#0F172A" fillOpacity="0.12" />

          {/* Base */}
          <rect x="18" y="76" width="64" height="10" rx="2" fill="#1E293B" />

          {/* Cleanroom Buffer Magazine Tower */}
          <rect x="22" y="18" width="56" height="58" rx="4" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2" />

          {/* Cassette Slots Array with Silicon Wafer Carriers */}
          <rect x="28" y="24" width="44" height="8" rx="1.5" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.2" />
          <circle cx="32" cy="28" r="1.5" fill="#22C55E" />
          
          <rect x="28" y="36" width="44" height="8" rx="1.5" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.2" />
          <circle cx="32" cy="40" r="1.5" fill="#22C55E" />

          <rect x="28" y="48" width="44" height="8" rx="1.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
          <circle cx="32" cy="52" r="1.5" fill="#94A3B8" />

          <rect x="28" y="60" width="44" height="8" rx="1.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
          <circle cx="32" cy="64" r="1.5" fill="#94A3B8" />

          {/* RFID Lot Tracking Antenna */}
          <rect x="74" y="26" width="4" height="16" rx="1" fill="#0F172A" />
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <rect x="20" y="20" width="60" height="60" rx="6" fill="#F1F5F9" stroke="#1E293B" strokeWidth="2" />
        </svg>
      );
  }
};
