import React, { useRef, useCallback, useState, useEffect } from 'react';
import {
  FloorMachineAsset,
  RoomZone,
  StructureAsset,
  ConveyorJunction,
  ToolMode,
  AssetLibraryItem,
  LayerVisibilityState,
  OHTRailSegment,
  UtilityPipeline,
} from '../../../types/floorPlan';
import { INITIAL_OHT_SEGMENTS, INITIAL_UTILITY_PIPELINES } from '../../../data/floorPlanData';

interface FloorCanvasProps {
  machines: FloorMachineAsset[];
  zones: RoomZone[];
  structures: StructureAsset[];
  junctions: ConveyorJunction[];
  ohtSegments?: OHTRailSegment[];
  utilityPipelines?: UtilityPipeline[];
  selectedAssetId: string | null;
  onSelectAsset: (assetId: string | null) => void;
  activeTool: ToolMode;
  gridVisible: boolean;
  snapToGrid: boolean;
  gridSize: number;
  transform: { x: number; y: number; scale: number };
  onTransformChange: (t: { x: number; y: number; scale: number }) => void;
  filterType?: string | null;
  isConfigMode?: boolean;
  layers?: Partial<LayerVisibilityState>;
  onMoveMachine?: (id: string, x: number, y: number) => void;
  onAddMachine?: (item: AssetLibraryItem, x: number, y: number) => void;
}

export const FloorCanvas: React.FC<FloorCanvasProps> = ({
  machines,
  zones,
  structures,
  junctions,
  ohtSegments = INITIAL_OHT_SEGMENTS,
  utilityPipelines = INITIAL_UTILITY_PIPELINES,
  selectedAssetId,
  onSelectAsset,
  activeTool,
  gridVisible,
  snapToGrid,
  gridSize,
  transform,
  onTransformChange,
  filterType,
  isConfigMode = false,
  layers = {
    showZones: true,
    showOHT: true,
    showAGV: true,
    showUtilities: false,
    showSensors: true,
    showHeatmap: false,
    showLeadframeFlow: true,
  },
  onMoveMachine,
  onAddMachine,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation cycle clock for OHT carrier position, air showers, and leadframe motion
  const [animTime, setAnimTime] = useState(0);
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      setAnimTime((prev) => (prev + delta * 0.4) % 100);
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Panning tracking
  const isPanningRef = useRef(false);
  const panStartRef = useRef<{ clientX: number; clientY: number; startX: number; startY: number }>({
    clientX: 0,
    clientY: 0,
    startX: 0,
    startY: 0,
  });

  // Machine dragging tracking (pointer capture)
  const [activeDraggingId, setActiveDraggingId] = useState<string | null>(null);
  const dragMachineRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    machineStartX: number;
    machineStartY: number;
    hasMoved: boolean;
  } | null>(null);

  // Wheel Zoom centered on cursor
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!containerRef.current) return;

      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
      const newScale = Math.min(Math.max(transform.scale * zoomFactor, 0.35), 2.5);

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const newX = mouseX - (mouseX - transform.x) * (newScale / transform.scale);
      const newY = mouseY - (mouseY - transform.y) * (newScale / transform.scale);

      onTransformChange({
        x: newX,
        y: newY,
        scale: newScale,
      });
    },
    [transform, onTransformChange]
  );

  // Mouse Down for Panning canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.button !== 1) return;
    if (dragMachineRef.current) return;

    isPanningRef.current = true;
    panStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: transform.x,
      startY: transform.y,
    };
  };

  // Mouse Move for Smooth Panning
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanningRef.current) return;

    const deltaX = e.clientX - panStartRef.current.clientX;
    const deltaY = e.clientY - panStartRef.current.clientY;

    onTransformChange({
      ...transform,
      x: panStartRef.current.startX + deltaX,
      y: panStartRef.current.startY + deltaY,
    });
  };

  // Mouse Up for canvas
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanningRef.current) return;
    isPanningRef.current = false;

    const deltaX = Math.abs(e.clientX - panStartRef.current.clientX);
    const deltaY = Math.abs(e.clientY - panStartRef.current.clientY);
    if (deltaX < 4 && deltaY < 4) {
      const target = e.target as HTMLElement;
      if (
        target === containerRef.current ||
        target.classList.contains('floor-blueprint-svg') ||
        target.classList.contains('room-zone-boundary')
      ) {
        onSelectAsset(null);
      }
    }
  };

  // Machine Pointer Down
  const handleMachinePointerDown = (
    e: React.PointerEvent<SVGGElement>,
    machine: FloorMachineAsset
  ) => {
    e.stopPropagation();

    if (!isConfigMode) {
      onSelectAsset(machine.id);
      return;
    }

    (e.target as Element).setPointerCapture(e.pointerId);
    dragMachineRef.current = {
      id: machine.id,
      startX: e.clientX,
      startY: e.clientY,
      machineStartX: machine.x,
      machineStartY: machine.y,
      hasMoved: false,
    };
    setActiveDraggingId(machine.id);
  };

  // Machine Pointer Move
  const handleMachinePointerMove = (e: React.PointerEvent<SVGGElement>) => {
    if (!dragMachineRef.current || !onMoveMachine) return;
    e.stopPropagation();

    const info = dragMachineRef.current;
    const deltaX = (e.clientX - info.startX) / transform.scale;
    const deltaY = (e.clientY - info.startY) / transform.scale;

    if (Math.hypot(deltaX, deltaY) > 3) {
      info.hasMoved = true;
    }

    let nextX = info.machineStartX + deltaX;
    let nextY = info.machineStartY + deltaY;

    nextX = Math.max(50, Math.min(1060, nextX));
    nextY = Math.max(50, Math.min(800, nextY));

    if (snapToGrid) {
      nextX = Math.round(nextX / gridSize) * gridSize;
      nextY = Math.round(nextY / gridSize) * gridSize;
    }

    onMoveMachine(info.id, nextX, nextY);
  };

  // Machine Pointer Up
  const handleMachinePointerUp = (
    e: React.PointerEvent<SVGGElement>,
    machineId: string
  ) => {
    e.stopPropagation();

    if (dragMachineRef.current) {
      const { hasMoved } = dragMachineRef.current;
      dragMachineRef.current = null;
      setActiveDraggingId(null);

      if (!hasMoved) {
        onSelectAsset(machineId);
      }
    } else {
      onSelectAsset(machineId);
    }
  };

  // Handle Drag Over & Drop from Asset Library
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (isConfigMode) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isConfigMode || !onAddMachine || !containerRef.current) return;
    e.preventDefault();

    const dataStr = e.dataTransfer.getData('application/json') || e.dataTransfer.getData('text/plain');
    if (!dataStr) return;

    try {
      const item: AssetLibraryItem = JSON.parse(dataStr);
      const rect = containerRef.current.getBoundingClientRect();
      let dropX = (e.clientX - rect.left - transform.x) / transform.scale - 28;
      let dropY = (e.clientY - rect.top - transform.y) / transform.scale - 26;

      dropX = Math.max(50, Math.min(1060, dropX));
      dropY = Math.max(50, Math.min(800, dropY));

      if (snapToGrid) {
        dropX = Math.round(dropX / gridSize) * gridSize;
        dropY = Math.round(dropY / gridSize) * gridSize;
      }

      onAddMachine(item, dropX, dropY);
    } catch (err) {
      console.error('Failed to parse dropped asset data', err);
    }
  };

  // Status Light Tower Helper (Andon Signal Tower)
  const renderAndonTower = (x: number, y: number, status: string) => {
    const isGreen = status === 'healthy';
    const isAmber = status === 'warning';
    const isRed = status === 'critical';
    const isOffline = status === 'offline';

    return (
      <g transform={`translate(${x}, ${y})`} className="andon-tower-stack" style={{ pointerEvents: 'none' }}>
        {/* Tower Mast */}
        <line x1="0" y1="0" x2="0" y2="-10" stroke="#475569" strokeWidth="1.2" />
        {/* Red Tier */}
        <circle cx="0" cy="-10" r="1.8" fill={isRed ? '#DC2626' : '#7F1D1D'} stroke="#121315" strokeWidth="0.5" />
        {isRed && <circle cx="0" cy="-10" r="3.5" fill="#EF4444" fillOpacity="0.5" className="andon-glow-pulse" />}
        {/* Amber Tier */}
        <circle cx="0" cy="-7" r="1.8" fill={isAmber ? '#F59E0B' : '#78350F'} stroke="#121315" strokeWidth="0.5" />
        {isAmber && <circle cx="0" cy="-7" r="3.5" fill="#FBBF24" fillOpacity="0.5" className="andon-glow-pulse" />}
        {/* Green Tier */}
        <circle cx="0" cy="-4" r="1.8" fill={isGreen ? '#16A34A' : '#14532D'} stroke="#121315" strokeWidth="0.5" />
        {isGreen && <circle cx="0" cy="-4" r="3.5" fill="#22C55E" fillOpacity="0.4" />}
        {/* Blue / Offline Tier */}
        <circle cx="0" cy="-1" r="1.8" fill={isOffline ? '#3B82F6' : '#1E3A8A'} stroke="#121315" strokeWidth="0.5" />
      </g>
    );
  };

  // =========================================================================
  // DEDICATED REALISTIC TOP-DOWN CAD GRAPHICS FOR SEMICONDUCTOR MACHINES
  // =========================================================================
  const renderMachineCadGraphic = (machine: FloorMachineAsset) => {
    const w = machine.width;
    const h = machine.height;

    switch (machine.type) {
      // 1. 300mm WAFER SAW (WS)
      case 'wafer-saw': {
        return (
          <g className="cad-machine-graphic">
            {/* Base Casing */}
            <rect x="0" y="0" width={w} height={h} rx="3" fill="#FAF9F5" stroke="#121315" strokeWidth="1.8" />
            <rect x="2" y="2" width={w - 4} height={h - 4} rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
            {/* Dual Front FOUP Loadports (300mm Wafer Cassettes) */}
            <rect x="4" y={h - 10} width="20" height="8" rx="1.5" fill="#0284C7" stroke="#121315" strokeWidth="1" />
            <circle cx="14" cy={h - 6} r="2.5" fill="#38BDF8" />
            <rect x={w - 24} y={h - 10} width="20" height="8" rx="1.5" fill="#0284C7" stroke="#121315" strokeWidth="1" />
            <circle cx={w - 14} cy={h - 6} r="2.5" fill="#38BDF8" />
            {/* Silicon Wafer Rotary Chuck (DI Water cooling) */}
            <circle cx={w / 2} cy={h / 2 - 4} r="14" fill="#E2E8F0" stroke="#121315" strokeWidth="1.2" />
            {/* 300mm Wafer Disc with Grid Dice Pattern */}
            <circle cx={w / 2} cy={h / 2 - 4} r="11" fill="#0284C7" fillOpacity="0.25" stroke="#0284C7" strokeWidth="0.8" />
            <line x1={w / 2 - 8} y1={h / 2 - 4} x2={w / 2 + 8} y2={h / 2 - 4} stroke="#0284C7" strokeWidth="0.6" strokeDasharray="1.5 1" />
            <line x1={w / 2} y1={h / 2 - 12} x2={w / 2} y2={h / 2 + 4} stroke="#0284C7" strokeWidth="0.6" strokeDasharray="1.5 1" />
            {/* Diamond Blade High-Speed Spindle Head */}
            <rect x={w / 2 - 3} y="4" width="6" height="10" rx="1" fill="#D97706" stroke="#121315" strokeWidth="1" />
            <circle cx={w / 2} cy="9" r="1.5" fill="#FEF08A" />
            {/* Touchscreen Operator Terminal */}
            <rect x="4" y="4" width="12" height="7" rx="0.5" fill="#0F172A" />
            <rect x="5" y="5" width="10" height="5" fill="#0284C7" fillOpacity="0.8" />
            {/* Andon Tower */}
            {renderAndonTower(w - 6, 6, machine.status)}
          </g>
        );
      }

      // 2. DIE ATTACH BONDER (DA)
      case 'die-attach': {
        return (
          <g className="cad-machine-graphic">
            <rect x="0" y="0" width={w} height={h} rx="3" fill="#FAF9F5" stroke="#121315" strokeWidth="1.8" />
            <rect x="2" y="2" width={w - 4} height={h - 4} rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
            {/* Wafer Ring Expansion Stage (Left) */}
            <circle cx="16" cy={h / 2} r="10" fill="#E2E8F0" stroke="#121315" strokeWidth="1" />
            <rect x="12" y={h / 2 - 4} width="8" height="8" fill="#3B82F6" fillOpacity="0.4" stroke="#1D4ED8" strokeWidth="0.8" />
            <circle cx="16" cy={h / 2} r="2" fill="#1D4ED8" />
            {/* Epoxy Dispense & Collet Pick-and-Place Gantry */}
            <line x1="16" y1="10" x2={w - 14} y2="10" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="28" cy="10" r="3" fill="#D97706" stroke="#92400E" strokeWidth="0.8" />
            {/* Dual Leadframe Magazine Elevator Loader/Unloader (Right) */}
            <rect x={w - 18} y="10" width="14" height={h - 20} rx="1.5" fill="#F1F5F9" stroke="#121315" strokeWidth="1.2" />
            <line x1={w - 16} y1="15" x2={w - 6} y2="15" stroke="#94A3B8" strokeWidth="1" />
            <line x1={w - 16} y1="21" x2={w - 6} y2="21" stroke="#94A3B8" strokeWidth="1" />
            <line x1={w - 16} y1="27" x2={w - 6} y2="27" stroke="#94A3B8" strokeWidth="1" />
            <line x1={w - 16} y1="33" x2={w - 6} y2="33" stroke="#94A3B8" strokeWidth="1" />
            <line x1={w - 16} y1="39" x2={w - 6} y2="39" stroke="#94A3B8" strokeWidth="1" />
            {/* Operator Display */}
            <rect x="4" y="4" width="10" height="6" rx="0.5" fill="#0F172A" />
            {/* Andon Tower */}
            {renderAndonTower(w - 6, 6, machine.status)}
          </g>
        );
      }

      // 3. RF PLASMA CLEANER (PC)
      case 'plasma-cleaner': {
        return (
          <g className="cad-machine-graphic">
            <rect x="0" y="0" width={w} height={h} rx="3" fill="#FAF9F5" stroke="#121315" strokeWidth="1.8" />
            <rect x="2" y="2" width={w - 4} height={h - 4} rx="2" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="0.8" />
            {/* Heavy Stainless Steel Vacuum Chamber */}
            <circle cx={w / 2} cy={h / 2} r="14" fill="#0F172A" stroke="#121315" strokeWidth="1.5" />
            {/* Glowing Purple RF Argon Ionization Plasma */}
            <circle cx={w / 2} cy={h / 2} r="10" fill="#A855F7" fillOpacity="0.75" className="plasma-glow-pulse" />
            <circle cx={w / 2} cy={h / 2} r="5" fill="#E9D5FF" />
            {/* Dual Loadlock Slide Doors */}
            <line x1="3" y1={h / 2} x2="12" y2={h / 2} stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
            <line x1={w - 12} y1={h / 2} x2={w - 3} y2={h / 2} stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
            {/* Vacuum Valve Gauge */}
            <circle cx="9" cy="9" r="3.5" fill="#FFFFFF" stroke="#121315" strokeWidth="0.8" />
            <line x1="9" y1="9" x2="11" y2="7" stroke="#EF4444" strokeWidth="0.8" />
            {/* Andon Tower */}
            {renderAndonTower(w - 6, 6, machine.status)}
          </g>
        );
      }

      // 4. THERMOSONIC WIRE BONDER (WB)
      case 'wire-bonding': {
        return (
          <g className="cad-machine-graphic">
            <rect x="0" y="0" width={w} height={h} rx="3" fill="#FFFFFF" stroke="#121315" strokeWidth="1.8" />
            {/* Indexed Leadframe Heating Rail */}
            <rect x="0" y={h - 14} width={w} height="8" fill="#E2E8F0" stroke="#121315" strokeWidth="1" />
            <rect x="10" y={h - 13} width={w - 20} height="6" fill="#CA8A04" stroke="#854D0E" strokeWidth="0.8" />
            {/* Micro-wire Spool Enclosure (Au/Cu wire) */}
            <circle cx="16" cy="14" r="7" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.2" />
            <circle cx="16" cy="14" r="2.5" fill="#0F172A" />
            {/* High-Speed Transducer Bondhead */}
            <path d={`M 16 20 V ${h - 18} L 24 ${h - 14}`} stroke="#121315" strokeWidth="2.2" strokeLinecap="round" />
            {/* Micro-wire Loop Arc Representation */}
            <path d={`M 16 ${h - 14} Q 26 ${h - 22} 36 ${h - 14}`} stroke="#EAB308" strokeWidth="1.5" fill="none" />
            {/* Pattern Recognition Optics Barrel */}
            <circle cx="28" cy="14" r="4" fill="#0284C7" fillOpacity="0.3" stroke="#0284C7" strokeWidth="1" />
            <circle cx="28" cy="14" r="1.5" fill="#0F172A" />
            {/* Dual Operator Monitors */}
            <rect x="4" y="4" width="8" height="5" rx="0.5" fill="#0F172A" />
            <rect x="38" y="4" width="8" height="5" rx="0.5" fill="#0F172A" />
            {/* Andon Tower */}
            {renderAndonTower(w - 6, 6, machine.status)}
          </g>
        );
      }

      // 5. AUTO MOLDING PRESS (MP)
      case 'molding-press': {
        return (
          <g className="cad-machine-graphic">
            {/* Heavy Hydraulic Chassis */}
            <rect x="0" y="0" width={w} height={h} rx="3" fill="#0F172A" stroke="#121315" strokeWidth="2" />
            {/* 4 Heavy Hydraulic Tie-Bar Columns */}
            <circle cx="7" cy="7" r="3" fill="#94A3B8" stroke="#E2E8F0" strokeWidth="1" />
            <circle cx={w - 7} cy="7" r="3" fill="#94A3B8" stroke="#E2E8F0" strokeWidth="1" />
            <circle cx="7" cy={h - 7} r="3" fill="#94A3B8" stroke="#E2E8F0" strokeWidth="1" />
            <circle cx={w - 7} cy={h - 7} r="3" fill="#94A3B8" stroke="#E2E8F0" strokeWidth="1" />
            {/* Heated Platen Chamber (175°C) with Multi-Cavity Mold Grid */}
            <rect x="12" y="10" width={w - 24} height={h - 20} rx="1.5" fill="#1E293B" stroke="#EF4444" strokeWidth="1.2" />
            {/* Mold Cavity Matrix */}
            <rect x="16" y="14" width="10" height="10" fill="#EF4444" fillOpacity="0.25" stroke="#EF4444" strokeWidth="0.8" />
            <rect x="32" y="14" width="10" height="10" fill="#EF4444" fillOpacity="0.25" stroke="#EF4444" strokeWidth="0.8" />
            <rect x="16" y="28" width="10" height="10" fill="#EF4444" fillOpacity="0.25" stroke="#EF4444" strokeWidth="0.8" />
            <rect x="32" y="28" width="10" height="10" fill="#EF4444" fillOpacity="0.25" stroke="#EF4444" strokeWidth="0.8" />
            {/* Thermal Heating Indicator */}
            <line x1="16" y1={h / 2} x2={w - 16} y2={h / 2} stroke="#EF4444" strokeWidth="1.2" strokeDasharray="3 1.5" />
            {/* Hydraulic Pressure Gauge */}
            <circle cx={w / 2} cy="6" r="3" fill="#FFFFFF" stroke="#121315" strokeWidth="0.8" />
            <line x1={w / 2} y1="6" x2={w / 2 + 1.5} y2="4.5" stroke="#EF4444" strokeWidth="0.8" />
            {/* Andon Tower */}
            {renderAndonTower(w - 6, 6, machine.status)}
          </g>
        );
      }

      // 6. 3D AOI OPTICAL INSPECTION (AOI)
      case 'aoi-inspection': {
        return (
          <g className="cad-machine-graphic">
            <rect x="0" y="0" width={w} height={h} rx="3" fill="#FAF9F5" stroke="#121315" strokeWidth="1.8" />
            <rect x="2" y="2" width={w - 4} height={h - 4} rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
            {/* Dual-Lane SMEMA Conveyor Belts */}
            <rect x="0" y={h / 2 - 4} width={w} height="8" fill="#334155" />
            <line x1="0" y1={h / 2} x2={w} y2={h / 2} stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 2" />
            {/* Multi-Angle Circular RGB+W LED Illumination Dome */}
            <circle cx={w / 2} cy={h / 2} r="13" fill="#0284C7" fillOpacity="0.15" stroke="#0284C7" strokeWidth="1.5" />
            <circle cx={w / 2} cy={h / 2} r="7" fill="#38BDF8" fillOpacity="0.3" stroke="#0284C7" strokeWidth="1" />
            {/* Line-Scan Camera Aperture & Laser Crosshair */}
            <circle cx={w / 2} cy={h / 2} r="3" fill="#0F172A" />
            <line x1={w / 2} y1={h / 2 - 6} x2={w / 2} y2={h / 2 + 6} stroke="#EF4444" strokeWidth="0.8" />
            <line x1={w / 2 - 6} y1={h / 2} x2={w / 2 + 6} y2={h / 2} stroke="#EF4444" strokeWidth="0.8" />
            {/* Review LCD Screen */}
            <rect x="4" y="4" width="12" height="7" rx="0.5" fill="#0F172A" />
            <rect x="5" y="5" width="10" height="5" fill="#22C55E" fillOpacity="0.8" />
            {/* Andon Tower */}
            {renderAndonTower(w - 6, 6, machine.status)}
          </g>
        );
      }

      // 7. LEAD-SHIELDED X-RAY NDT (XR)
      case 'x-ray-inspection': {
        return (
          <g className="cad-machine-graphic">
            {/* Heavy Lead-Shielded Enclosure */}
            <rect x="0" y="0" width={w} height={h} rx="3" fill="#1E293B" stroke="#121315" strokeWidth="2" />
            {/* Yellow / Black Hazard Warning Stripes on Shielding Border */}
            <rect x="2" y="2" width={w - 4} height="4" fill="#F59E0B" stroke="#121315" strokeWidth="0.5" />
            <line x1="8" y1="2" x2="4" y2="6" stroke="#121315" strokeWidth="1.5" />
            <line x1="16" y1="2" x2="12" y2="6" stroke="#121315" strokeWidth="1.5" />
            <line x1="24" y1="2" x2="20" y2="6" stroke="#121315" strokeWidth="1.5" />
            <line x1="32" y1="2" x2="28" y2="6" stroke="#121315" strokeWidth="1.5" />
            {/* Microfocus High-Voltage X-Ray Source & Turntable */}
            <circle cx={w / 2} cy={h / 2} r="12" fill="#0F172A" stroke="#475569" strokeWidth="1" />
            <polygon points={`${w / 2},${h / 2 - 8} ${w / 2 + 7},${h / 2 + 5} ${w / 2 - 7},${h / 2 + 5}`} fill="#F59E0B" />
            <circle cx={w / 2} cy={h / 2 + 1} r="2" fill="#0F172A" />
            {/* Safety Interlock Doors */}
            <line x1="2" y1={h / 2} x2="8" y2={h / 2} stroke="#F59E0B" strokeWidth="2" />
            <line x1={w - 8} y1={h / 2} x2={w - 2} y2={h / 2} stroke="#F59E0B" strokeWidth="2" />
            {/* Andon Tower */}
            {renderAndonTower(w - 6, 6, machine.status)}
          </g>
        );
      }

      // 8. GALVO FIBER LASER MARKING (LM)
      case 'laser-marking': {
        return (
          <g className="cad-machine-graphic">
            <rect x="0" y="0" width={w} height={h} rx="3" fill="#FAF9F5" stroke="#121315" strokeWidth="1.8" />
            {/* Class 1 Laser Safety Hood with Amber Viewing Glass */}
            <rect x="6" y="8" width={w - 12} height={h - 16} rx="2" fill="#1E293B" stroke="#121315" strokeWidth="1.2" />
            <rect x="10" y="12" width={w - 20} height={h - 24} rx="1" fill="#D97706" fillOpacity="0.4" stroke="#F59E0B" strokeWidth="0.8" />
            {/* High-Speed Galvo Scanner Head & Red Pilot Dot */}
            <circle cx={w / 2} cy={h / 2} r="3" fill="#EF4444" className="laser-dot-pulse" />
            <circle cx={w / 2} cy={h / 2} r="7" fill="none" stroke="#EF4444" strokeWidth="0.8" strokeDasharray="2 1" />
            {/* Fume Extraction Exhaust Port */}
            <circle cx="10" cy="10" r="2.5" fill="#64748B" stroke="#121315" strokeWidth="0.8" />
            {/* Andon Tower */}
            {renderAndonTower(w - 6, 6, machine.status)}
          </g>
        );
      }

      // 9. TRI-TEMP TEST HANDLER (TH)
      case 'test-handler': {
        return (
          <g className="cad-machine-graphic">
            <rect x="0" y="0" width={w} height={h} rx="3" fill="#FFFFFF" stroke="#121315" strokeWidth="1.8" />
            {/* Thermal Soak Chamber (-55°C to +150°C) */}
            <rect x="6" y="6" width={w - 12} height="16" rx="1.5" fill="#0284C7" fillOpacity="0.2" stroke="#0284C7" strokeWidth="1" />
            <text x={w / 2} y="17" textAnchor="middle" fontSize="7.5" fontFamily="var(--font-mono)" fontWeight="800" fill="#0284C7">TRI-TEMP</text>
            {/* Multi-Tube Sort Output Channels (Pass, Fail, Re-Test) */}
            <rect x="8" y={h - 18} width="10" height="12" rx="1" fill="#22C55E" fillOpacity="0.3" stroke="#16A34A" strokeWidth="0.8" />
            <rect x="23" y={h - 18} width="10" height="12" rx="1" fill="#EF4444" fillOpacity="0.3" stroke="#DC2626" strokeWidth="0.8" />
            <rect x="38" y={h - 18} width="10" height="12" rx="1" fill="#F59E0B" fillOpacity="0.3" stroke="#D97706" strokeWidth="0.8" />
            {/* Andon Tower */}
            {renderAndonTower(w - 6, 6, machine.status)}
          </g>
        );
      }

      // 10. TAPE & REEL PACKAGING (TR)
      case 'tape-reel': {
        return (
          <g className="cad-machine-graphic">
            <rect x="0" y="0" width={w} height={h} rx="3" fill="#FAF9F5" stroke="#121315" strokeWidth="1.8" />
            {/* Carrier Tape Payout Reel */}
            <circle cx="14" cy={h / 2} r="8" fill="#FFFFFF" stroke="#121315" strokeWidth="1.2" />
            <circle cx="14" cy={h / 2} r="3" fill="#0F172A" />
            {/* Heat Sealing Press Shoe */}
            <rect x="23" y={h / 2 - 4} width="8" height="8" rx="1" fill="#EF4444" stroke="#991B1B" strokeWidth="0.8" />
            {/* 13-Inch Take-Up Reel Spindle */}
            <circle cx={w - 14} cy={h / 2} r="11" fill="#FFFFFF" stroke="#121315" strokeWidth="1.5" />
            <circle cx={w - 14} cy={h / 2} r="4" fill="#CBD5E1" stroke="#475569" strokeWidth="0.8" />
            {/* Carrier Tape Feed Line */}
            <line x1="14" y1={h / 2} x2={w - 14} y2={h / 2} stroke="#1E293B" strokeWidth="2" />
            {/* Andon Tower */}
            {renderAndonTower(w - 6, 6, machine.status)}
          </g>
        );
      }

      // 11. AMHS AUTOMATED FOUP STOCKER (STK)
      case 'stocker': {
        return (
          <g className="cad-machine-graphic">
            <rect x="0" y="0" width={w} height={h} rx="3" fill="#F8FAFC" stroke="#121315" strokeWidth="2" />
            {/* Multi-Tier FOUP Storage Shelves (Left & Right) */}
            <rect x="4" y="8" width="16" height="12" rx="1" fill="#0284C7" fillOpacity="0.3" stroke="#0284C7" strokeWidth="1" />
            <rect x="4" y="24" width="16" height="12" rx="1" fill="#0284C7" fillOpacity="0.3" stroke="#0284C7" strokeWidth="1" />
            <rect x="4" y="40" width="16" height="12" rx="1" fill="#0284C7" fillOpacity="0.3" stroke="#0284C7" strokeWidth="1" />
            <rect x={w - 20} y="8" width="16" height="12" rx="1" fill="#0284C7" fillOpacity="0.3" stroke="#0284C7" strokeWidth="1" />
            <rect x={w - 20} y="24" width="16" height="12" rx="1" fill="#0284C7" fillOpacity="0.3" stroke="#0284C7" strokeWidth="1" />
            <rect x={w - 20} y="40" width="16" height="12" rx="1" fill="#0284C7" fillOpacity="0.3" stroke="#0284C7" strokeWidth="1" />
            {/* Central Robotic Crane Track */}
            <line x1={w / 2} y1="4" x2={w / 2} y2={h - 4} stroke="#121315" strokeWidth="2" strokeDasharray="3 1.5" />
            <rect x={w / 2 - 4} y="24" width="8" height="12" rx="1" fill="#D97706" stroke="#121315" strokeWidth="1" />
            {/* Andon Tower */}
            {renderAndonTower(w - 6, 6, machine.status)}
          </g>
        );
      }

      default: {
        return (
          <g className="cad-machine-graphic">
            <rect x="0" y="0" width={w} height={h} rx="3" fill="#FFFFFF" stroke="#121315" strokeWidth="1.8" />
            <circle cx={w / 2} cy={h / 2} r="10" fill="#E2E8F0" stroke="#121315" strokeWidth="1" />
            {renderAndonTower(w - 6, 6, machine.status)}
          </g>
        );
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`floor-canvas-container ${activeTool === 'pan' ? 'panning' : ''} ${isConfigMode ? 'config-mode' : ''}`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div
        className="floor-canvas-transform-layer"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Main Architectural CAD SVG Blueprint Stage (1160px x 900px) */}
        <svg
          width="1160"
          height="900"
          viewBox="0 0 1160 900"
          className="floor-blueprint-svg"
        >
          <defs>
            {/* Cleanroom ESD Floor Grid Pattern */}
            <pattern
              id="cleanroom-esd-grid"
              width={gridSize}
              height={gridSize}
              patternUnits="userSpaceOnUse"
            >
              <rect width={gridSize} height={gridSize} fill="#F4F3EE" />
              <path
                d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                fill="none"
                stroke={isConfigMode ? '#D1D5DB' : '#E2E8F0'}
                strokeWidth={isConfigMode ? '1' : '0.7'}
              />
              <circle cx="0" cy="0" r="0.75" fill="#9CA3AF" />
            </pattern>

            {/* ISO 5 Sterile Floor Pattern */}
            <pattern id="iso5-floor-pattern" width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="16" height="16" fill="#FAFDFE" />
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#E0F2FE" strokeWidth="0.8" />
            </pattern>

            {/* Sub-Fab Utility Floor Hatch */}
            <pattern id="utility-hatch" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="12" stroke="#E5E7EB" strokeWidth="2.5" />
            </pattern>

            {/* Glowing OHT Rail Filter */}
            <filter id="oht-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Cleanroom Grid */}
          {gridVisible && (
            <rect
              x="0"
              y="0"
              width="1160"
              height="900"
              fill="url(#cleanroom-esd-grid)"
              style={{ pointerEvents: 'none' }}
            />
          )}

          {/* =========================================================================
              1. CLEANROOM EXTERIOR REINFORCED PERIMETER WALLS
              ========================================================================= */}
          <rect
            x="40"
            y="40"
            width="1080"
            height="820"
            fill="#FAF9F5"
            stroke="#121315"
            strokeWidth="3.5"
            className="room-zone-boundary"
          />
          {/* Inner Safety Demarcation Line */}
          <rect
            x="44"
            y="44"
            width="1072"
            height="812"
            fill="none"
            stroke="#334155"
            strokeWidth="1.2"
            strokeDasharray="8 4"
            style={{ pointerEvents: 'none' }}
          />

          {/* =========================================================================
              2. CLEANROOM BAYS & PRESSURE CASCADE ZONES
              ========================================================================= */}
          {layers.showZones !== false &&
            zones.map((zone) => {
              const isIso5 = zone.cleanroomClass?.includes('ISO 5');
              const isIso6 = zone.cleanroomClass?.includes('ISO 6');
              const isIso7 = zone.cleanroomClass?.includes('ISO 7');
              const isIso8 = zone.cleanroomClass?.includes('ISO 8');
              const isUtility = zone.cleanroomClass?.includes('Sub-Fab');

              const floorFill = isIso5
                ? 'url(#iso5-floor-pattern)'
                : isIso6
                ? '#F8FAFC'
                : isIso7
                ? '#F1F5F9'
                : isIso8
                ? '#E0F2FE'
                : isUtility
                ? '#F3F4F6'
                : '#FAF9F5';

              return (
                <g key={zone.id} className="cleanroom-zone-group">
                  {/* Zone Bay Floor Boundary */}
                  <rect
                    x={zone.x}
                    y={zone.y}
                    width={zone.width}
                    height={zone.height}
                    fill={floorFill}
                    stroke="#121315"
                    strokeWidth="2"
                    className="room-zone-boundary"
                  />

                  {/* Cleanroom Bay Header Banner */}
                  <g style={{ pointerEvents: 'none' }}>
                    <rect
                      x={zone.x + 4}
                      y={zone.y + 4}
                      width={zone.width - 8}
                      height="20"
                      fill="#FFFFFF"
                      fillOpacity="0.95"
                      stroke="#CBD5E1"
                      strokeWidth="1"
                      rx="2"
                    />
                    {/* Zone Name text centered */}
                    <text
                      x={zone.x + zone.width / 2}
                      y={zone.y + 17}
                      textAnchor="middle"
                      fontSize="9"
                      fontFamily="var(--font-display, inherit)"
                      fontWeight="800"
                      letterSpacing="0.04em"
                      fill="#121315"
                    >
                      {zone.name}
                    </text>
                  </g>
                </g>
              );
            })}

          {/* =========================================================================
              3. CLEANROOM STRUCTURES (AIR SHOWERS, GOWNING BENCHES, PASS-THROUGHS)
              ========================================================================= */}
          {structures.map((str) => {
            // Air Shower Cabin
            if (str.type === 'air-shower') {
              return (
                <g key={str.id} className="structure-air-shower" style={{ pointerEvents: 'none' }}>
                  <rect
                    x={str.x}
                    y={str.y}
                    width={str.width}
                    height={str.height}
                    fill="#E0F2FE"
                    stroke="#0284C7"
                    strokeWidth="2"
                    rx="3"
                  />
                  {/* High-velocity Air Jets */}
                  <circle cx={str.x + 8} cy={str.y + 12} r="2.5" fill="#0284C7" />
                  <circle cx={str.x + 8} cy={str.y + str.height / 2} r="2.5" fill="#0284C7" />
                  <circle cx={str.x + 8} cy={str.y + str.height - 12} r="2.5" fill="#0284C7" />
                  <circle cx={str.x + str.width - 8} cy={str.y + 12} r="2.5" fill="#0284C7" />
                  <circle cx={str.x + str.width - 8} cy={str.y + str.height / 2} r="2.5" fill="#0284C7" />
                  <circle cx={str.x + str.width - 8} cy={str.y + str.height - 12} r="2.5" fill="#0284C7" />
                  {/* Animated Airflow Streams */}
                  <line
                    x1={str.x + 12}
                    y1={str.y + str.height / 2}
                    x2={str.x + str.width - 12}
                    y2={str.y + str.height / 2}
                    stroke="#38BDF8"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    className="air-shower-pulse"
                  />
                  <text
                    x={str.x + str.width / 2}
                    y={str.y + str.height / 2 + 16}
                    textAnchor="middle"
                    fontSize="6"
                    fontFamily="var(--font-mono)"
                    fontWeight="800"
                    fill="#0369A1"
                  >
                    AIR SHOWER
                  </text>
                </g>
              );
            }

            // Gowning Step-Over Bench
            if (str.type === 'gowning-bench') {
              return (
                <g key={str.id} className="structure-gowning-bench" style={{ pointerEvents: 'none' }}>
                  <rect
                    x={str.x}
                    y={str.y}
                    width={str.width}
                    height={str.height}
                    fill="#E2E8F0"
                    stroke="#121315"
                    strokeWidth="1.8"
                    rx="1.5"
                  />
                  <line x1={str.x} y1={str.y + str.height / 2} x2={str.x + str.width} y2={str.y + str.height / 2} stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
                  <text
                    x={str.x + str.width / 2}
                    y={str.y + str.height / 2 + 3}
                    textAnchor="middle"
                    fontSize="7"
                    fontFamily="var(--font-mono)"
                    fontWeight="800"
                    fill="#334155"
                  >
                    {str.label}
                  </text>
                </g>
              );
            }

            // Sticky Decon Mat
            if (str.type === 'sticky-mat') {
              return (
                <g key={str.id} className="structure-sticky-mat" style={{ pointerEvents: 'none' }}>
                  <rect
                    x={str.x}
                    y={str.y}
                    width={str.width}
                    height={str.height}
                    fill="#0284C7"
                    fillOpacity="0.25"
                    stroke="#0284C7"
                    strokeWidth="1.5"
                    rx="1"
                  />
                  <line x1={str.x} y1={str.y + 8} x2={str.x + str.width} y2={str.y + 8} stroke="#0284C7" strokeWidth="0.8" strokeDasharray="2 1" />
                  <line x1={str.x} y1={str.y + 16} x2={str.x + str.width} y2={str.y + 16} stroke="#0284C7" strokeWidth="0.8" strokeDasharray="2 1" />
                  <line x1={str.x} y1={str.y + 24} x2={str.x + str.width} y2={str.y + 24} stroke="#0284C7" strokeWidth="0.8" strokeDasharray="2 1" />
                  <text
                    x={str.x + str.width / 2}
                    y={str.y + str.height / 2 + 3}
                    textAnchor="middle"
                    fontSize="6.5"
                    fontFamily="var(--font-mono)"
                    fontWeight="800"
                    fill="#0369A1"
                  >
                    ESD STICKY MAT
                  </text>
                </g>
              );
            }

            // Pass-Through Box
            if (str.type === 'pass-through') {
              return (
                <g key={str.id} className="structure-pass-through" style={{ pointerEvents: 'none' }}>
                  <rect
                    x={str.x - str.width / 2}
                    y={str.y - str.height / 2}
                    width={str.width}
                    height={str.height}
                    fill="#FFFFFF"
                    stroke="#0284C7"
                    strokeWidth="1.8"
                    rx="1"
                  />
                  <circle cx={str.x} cy={str.y} r="3" fill="#A855F7" />
                </g>
              );
            }

            // ESD Storage Racks
            if (str.type === 'rack') {
              return (
                <g key={str.id} className="structure-rack-group" style={{ pointerEvents: 'none' }}>
                  <rect
                    x={str.x}
                    y={str.y}
                    width={str.width}
                    height={str.height}
                    fill="#FFFFFF"
                    stroke="#121315"
                    strokeWidth="1.5"
                  />
                  {Array.from({ length: (str.rows || 3) - 1 }).map((_, idx) => (
                    <line
                      key={idx}
                      x1={str.x}
                      y1={str.y + (str.height / (str.rows || 3)) * (idx + 1)}
                      x2={str.x + str.width}
                      y2={str.y + (str.height / (str.rows || 3)) * (idx + 1)}
                      stroke="#2E3033"
                      strokeWidth="1"
                    />
                  ))}
                  <line
                    x1={str.x + str.width / 2}
                    y1={str.y}
                    x2={str.x + str.width / 2}
                    y2={str.y + str.height}
                    stroke="#6b7280"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                </g>
              );
            }

            // Shipping Pallets
            if (str.type === 'shipping-pallet') {
              return (
                <g key={str.id} className="structure-pallet-group" style={{ pointerEvents: 'none' }}>
                  <rect
                    x={str.x}
                    y={str.y}
                    width={str.width}
                    height={str.height}
                    fill="#EBE9DF"
                    stroke="#121315"
                    strokeWidth="1.5"
                  />
                  <line x1={str.x} y1={str.y + 20} x2={str.x + str.width} y2={str.y + 20} stroke="#121315" strokeWidth="1.2" />
                  <line x1={str.x} y1={str.y + 40} x2={str.x + str.width} y2={str.y + 40} stroke="#121315" strokeWidth="1.2" />
                  <line x1={str.x} y1={str.y + 60} x2={str.x + str.width} y2={str.y + 60} stroke="#121315" strokeWidth="1.2" />
                </g>
              );
            }

            // Workbenches & Sub-Fab utility machinery
            if (str.type === 'workbench') {
              return (
                <g key={str.id} className="structure-bench-group" style={{ pointerEvents: 'none' }}>
                  <rect
                    x={str.x}
                    y={str.y}
                    width={str.width}
                    height={str.height}
                    fill="#FFFFFF"
                    stroke="#121315"
                    strokeWidth="1.5"
                    rx="2"
                  />
                  {/* Subtle inner header plate */}
                  <rect
                    x={str.x + 2}
                    y={str.y + 2}
                    width={str.width - 4}
                    height="12"
                    fill="#F1F5F9"
                    rx="1"
                  />
                  <text
                    x={str.x + str.width / 2}
                    y={str.y + 10.5}
                    textAnchor="middle"
                    fontSize="6.5"
                    fontFamily="var(--font-mono)"
                    fontWeight="800"
                    fill="#0F172A"
                    letterSpacing="0.04em"
                  >
                    {str.label}
                  </text>
                  {/* Utility Status Indicators */}
                  <circle cx={str.x + 8} cy={str.y + str.height - 8} r="2.5" fill="#0284C7" />
                  <circle cx={str.x + str.width - 8} cy={str.y + str.height - 8} r="2.5" fill="#10B981" />
                </g>
              );
            }

            // Doors with swing arc
            if (str.type === 'door') {
              return (
                <g key={str.id} className="structure-door-group" style={{ pointerEvents: 'none' }}>
                  <rect x={str.x} y={str.y - 2} width={str.width} height={4} fill="#FAF9F5" />
                  <line x1={str.x} y1={str.y} x2={str.x + 8} y2={str.y - 12} stroke="#121315" strokeWidth="1.8" />
                  <path
                    d={`M ${str.x + 8} ${str.y - 12} A 14 14 0 0 1 ${str.x + str.width} ${str.y}`}
                    stroke="#9CA3AF"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    fill="none"
                  />
                </g>
              );
            }

            return null;
          })}

          {/* =========================================================================
              4. SUB-FAB PROCESS UTILITY PIPING OVERLAY (CDA, N2, PCW, VAC)
              ========================================================================= */}
          {layers.showUtilities &&
            utilityPipelines.map((pipe) => (
              <g key={pipe.id} className="utility-pipe-group" style={{ pointerEvents: 'none' }}>
                {/* Glow Backdrop */}
                <path d={pipe.pathD} fill="none" stroke={pipe.color} strokeWidth="5" strokeOpacity="0.25" />
                {/* Main Process Pipe Line */}
                <path d={pipe.pathD} fill="none" stroke={pipe.color} strokeWidth="2.5" strokeDasharray="8 4" className="pipe-flow-dash" />
              </g>
            ))}

          {/* =========================================================================
              5. OVERHEAD HOIST TRANSPORT (OHT) CEILING RAIL NETWORK (CONNECTED CIRCUIT)
              ========================================================================= */}
          {layers.showOHT && (
            <g className="oht-rail-network" style={{ pointerEvents: 'none' }}>
              {ohtSegments.map((seg) => (
                <g key={seg.id}>
                  {/* Outer Rail Track */}
                  <path d={seg.pathD} fill="none" stroke="#0284C7" strokeWidth="4" strokeOpacity="0.35" />
                  <path d={seg.pathD} fill="none" stroke="#0284C7" strokeWidth="1.8" strokeDasharray="6 3" />
                </g>
              ))}

              {/* Animated OHT FOUP Carriers along tracks */}
              {/* OHT Carrier 1 (Top Express Loop) */}
              <g
                transform={`translate(${210 + ((animTime * 18) % 860)}, 75)`}
                className="animated-oht-carrier"
              >
                <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.2" />
                <circle cx="0" cy="0" r="2.5" fill="#38BDF8" />
                <rect x="-5" y="6" width="10" height="7" rx="1" fill="#0284C7" stroke="#121315" strokeWidth="0.8" />
              </g>

              {/* OHT Carrier 2 (Right Vertical Spine) */}
              <g
                transform={`translate(1070, ${75 + ((animTime * 14) % 750)})`}
                className="animated-oht-carrier"
              >
                <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.2" />
                <circle cx="0" cy="0" r="2.5" fill="#38BDF8" />
                <rect x="-5" y="6" width="10" height="7" rx="1" fill="#0284C7" stroke="#121315" strokeWidth="0.8" />
              </g>

              {/* OHT Carrier 3 (Bottom Loop) */}
              <g
                transform={`translate(${1070 - ((animTime * 18) % 860)}, 825)`}
                className="animated-oht-carrier"
              >
                <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.2" />
                <circle cx="0" cy="0" r="2.5" fill="#38BDF8" />
                <rect x="-5" y="6" width="10" height="7" rx="1" fill="#0284C7" stroke="#121315" strokeWidth="0.8" />
              </g>
            </g>
          )}

          {/* =========================================================================
              6. AUTOMATED CONTINUOUS SMEMA CONVEYOR & INTER-BAY ELEVATORS
              ========================================================================= */}
          <g style={{ pointerEvents: 'none' }} className="smema-conveyor-network">
            {/* ROW 1: Wafer Saws -> Stocker -> Die Attach Line (y: 135) */}
            <rect x="220" y="129" width="560" height="12" fill="#EBE9DF" stroke="#121315" strokeWidth="1.5" rx="1" />
            <line x1="220" y1="135" x2="780" y2="135" stroke="#D97706" strokeWidth="1.5" strokeDasharray="6 3" />

            {/* INTER-BAY ELEVATOR 1: Row 1 (Die Attach) -> Row 2 (Wire Bond & Mold) */}
            <rect x="769" y="135" width="12" height="216" fill="#EBE9DF" stroke="#121315" strokeWidth="1.5" rx="1" />
            <line x1="775" y1="135" x2="775" y2="351" stroke="#D97706" strokeWidth="1.5" strokeDasharray="6 3" />

            {/* ROW 2: Plasma -> Wire Bonding (8 Bonders) -> Auto Molding (4 Presses) (y: 345) */}
            <rect x="55" y="339" width="1025" height="12" fill="#EBE9DF" stroke="#121315" strokeWidth="1.5" rx="1" />
            <line x1="55" y1="345" x2="1080" y2="345" stroke="#D97706" strokeWidth="1.5" strokeDasharray="6 3" />

            {/* INTER-BAY ELEVATOR 2: Row 2 (Molding) -> Row 3 (3D Metrology) */}
            <rect x="1064" y="345" width="12" height="211" fill="#EBE9DF" stroke="#121315" strokeWidth="1.5" rx="1" />
            <line x1="1070" y1="345" x2="1070" y2="556" stroke="#D97706" strokeWidth="1.5" strokeDasharray="6 3" />

            {/* ROW 3: 3D AOI (4 lines) -> X-Ray -> Laser Mark -> Tri-Temp Test (y: 550) */}
            <rect x="50" y="544" width="1026" height="12" fill="#EBE9DF" stroke="#121315" strokeWidth="1.5" rx="1" />
            <line x1="50" y1="550" x2="1076" y2="550" stroke="#D97706" strokeWidth="1.5" strokeDasharray="6 3" />

            {/* INTER-BAY ELEVATOR 3: Row 3 (Test Return) -> Row 4 (Tape & Reel) */}
            <rect x="44" y="550" width="12" height="211" fill="#EBE9DF" stroke="#121315" strokeWidth="1.5" rx="1" />
            <line x1="50" y1="550" x2="50" y2="761" stroke="#D97706" strokeWidth="1.5" strokeDasharray="6 3" />

            {/* ROW 4: Tape & Reel Packaging (6 Lines) -> Finished Goods ESD Buffer (y: 755) */}
            <rect x="50" y="749" width="530" height="12" fill="#EBE9DF" stroke="#121315" strokeWidth="1.5" rx="1" />
            <line x1="50" y1="755" x2="580" y2="755" stroke="#D97706" strokeWidth="1.5" strokeDasharray="6 3" />

            {/* CONVEYOR CORNER TRANSFER JUNCTION NODES */}
            {junctions.map((j) => (
              <g key={j.id} className="conveyor-junction-node">
                <rect
                  x={j.x - j.size / 2}
                  y={j.y - j.size / 2}
                  width={j.size}
                  height={j.size}
                  fill="#FFFFFF"
                  stroke="#121315"
                  strokeWidth="1.8"
                  rx="1"
                />
                <line x1={j.x - j.size / 2} y1={j.y} x2={j.x + j.size / 2} y2={j.y} stroke="#D97706" strokeWidth="1.2" />
                <line x1={j.x} y1={j.y - j.size / 2} x2={j.x} y2={j.y + j.size / 2} stroke="#D97706" strokeWidth="1.2" />
                <circle cx={j.x} cy={j.y} r="2.5" fill="#D97706" />
              </g>
            ))}
          </g>

          {/* =========================================================================
              7. AUTOMATED GUIDED VEHICLE (AGV / AMR) ON-FLOOR HIGHWAY (CLOSED LOOP)
              ========================================================================= */}
          {layers.showAGV && (
            <g className="agv-highway-layer" style={{ pointerEvents: 'none' }}>
              {/* Closed-loop AGV Guide Highway */}
              <path
                d="M 1060 160 V 835 H 580 V 675 H 860 V 470 H 1060 Z"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeDasharray="6 4"
              />

              {/* AGV Charging Station Pad */}
              <g transform="translate(1010, 95)">
                <rect x="0" y="0" width="80" height="60" rx="3" fill="#FFFFFF" stroke="#121315" strokeWidth="1.8" />
                <rect x="6" y="6" width="68" height="48" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 2" />
                <path d="M 40 16 L 34 28 H 42 L 38 42 L 50 26 H 42 L 46 16 Z" fill="#D97706" />
                <text x="40" y="50" textAnchor="middle" fontSize="6.5" fontFamily="var(--font-mono)" fontWeight="800" fill="#92400E">AGV CHARGE</text>
              </g>

              {/* Animated Mobile AGV Robot navigating along the highway */}
              <g
                transform={`translate(1060, ${180 + ((animTime * 12) % 630)})`}
                className="animated-agv-robot"
              >
                <rect x="-14" y="-18" width="28" height="36" rx="4" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.8" />
                {/* Magazine Payload on AGV */}
                <rect x="-10" y="-12" width="20" height="24" rx="1.5" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
                <line x1="-8" y1="-6" x2="8" y2="-6" stroke="#93C5FD" strokeWidth="1" />
                <line x1="-8" y1="0" x2="8" y2="0" stroke="#93C5FD" strokeWidth="1" />
                <line x1="-8" y1="6" x2="8" y2="6" stroke="#93C5FD" strokeWidth="1" />
                {/* LiDAR Front Scanning Cone */}
                <polygon points="0,18 -16,36 16,36" fill="#F59E0B" fillOpacity="0.25" />
              </g>
            </g>
          )}

          {/* =========================================================================
              8. REALISTIC SEMICONDUCTOR MACHINES (INTERACTIVE TOP-DOWN NODES)
              ========================================================================= */}
          {machines.map((machine) => {
            const isSelected = selectedAssetId === machine.id;
            const isDraggingThis = activeDraggingId === machine.id;
            const isFiltered = filterType ? machine.type === filterType : true;

            return (
              <g
                key={machine.id}
                transform={`translate(${machine.x}, ${machine.y})`}
                className={`fp-machine-node ${isSelected ? 'selected' : ''} ${isConfigMode ? 'draggable' : ''} ${isDraggingThis ? 'is-dragging' : ''}`}
                style={{
                  cursor: isConfigMode ? (isDraggingThis ? 'grabbing' : 'grab') : 'pointer',
                  opacity: isFiltered ? 1 : 0.25,
                  pointerEvents: 'all',
                }}
                onPointerDown={(e) => handleMachinePointerDown(e, machine)}
                onPointerMove={handleMachinePointerMove}
                onPointerUp={(e) => handleMachinePointerUp(e, machine.id)}
              >
                {/* Selection Blueprint Halo */}
                {isSelected && (
                  <rect
                    x="-4"
                    y="-4"
                    width={machine.width + 8}
                    height={machine.height + 8}
                    fill="rgba(2, 132, 199, 0.12)"
                    stroke="#0284C7"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                    rx="5"
                    style={{ pointerEvents: 'none' }}
                  />
                )}

                {/* In Config Mode: Placement Bounds */}
                {isConfigMode && !isSelected && (
                  <rect
                    x="-2"
                    y="-2"
                    width={machine.width + 4}
                    height={machine.height + 4}
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    rx="3"
                    style={{ pointerEvents: 'none' }}
                  />
                )}

                {/* Render Dedicated Photorealistic SVG CAD Graphic for this Machine */}
                {renderMachineCadGraphic(machine)}

                {/* Machine Code & ID Badge */}
                <g transform={`translate(${machine.width / 2}, ${machine.height + 11})`} style={{ pointerEvents: 'none' }}>
                  <rect
                    x="-18"
                    y="-8"
                    width="36"
                    height="11"
                    rx="1.5"
                    fill="#121315"
                    stroke={isSelected ? '#0284C7' : '#475569'}
                    strokeWidth="0.8"
                  />
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    fontSize="7.5"
                    fontFamily="var(--font-mono)"
                    fontWeight="800"
                    fill="#FFFFFF"
                  >
                    {machine.id}
                  </text>
                </g>

                {/* OEE Efficiency Pill */}
                {machine.oee > 0 && (
                  <g transform={`translate(${machine.width / 2}, -4)`} style={{ pointerEvents: 'none' }}>
                    <rect
                      x="-14"
                      y="-7"
                      width="28"
                      height="9"
                      rx="1.5"
                      fill={machine.oee >= 90 ? '#DCFCE7' : '#FEF3C7'}
                      stroke={machine.oee >= 90 ? '#16A34A' : '#D97706'}
                      strokeWidth="0.6"
                    />
                    <text
                      x="0"
                      y="-0.5"
                      textAnchor="middle"
                      fontSize="5.5"
                      fontFamily="var(--font-mono)"
                      fontWeight="800"
                      fill={machine.oee >= 90 ? '#15803D' : '#B45309'}
                    >
                      {machine.oee.toFixed(0)}%
                    </text>
                  </g>
                )}

                {/* Direct Click Hit-Test Invisible Box */}
                <rect
                  x="0"
                  y="0"
                  width={machine.width}
                  height={machine.height}
                  fill="transparent"
                  style={{ cursor: isConfigMode ? 'grab' : 'pointer' }}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default FloorCanvas;
