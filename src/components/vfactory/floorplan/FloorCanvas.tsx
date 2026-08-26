import React, { useRef, useCallback, useState } from 'react';
import {
  FloorMachineAsset,
  RoomZone,
  StructureAsset,
  ConveyorJunction,
  ToolMode,
  AssetLibraryItem,
} from '../../../types/floorPlan';
import { FloorIcon } from './FloorIcons';

interface FloorCanvasProps {
  machines: FloorMachineAsset[];
  zones: RoomZone[];
  structures: StructureAsset[];
  junctions: ConveyorJunction[];
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
  onMoveMachine?: (id: string, x: number, y: number) => void;
  onAddMachine?: (item: AssetLibraryItem, x: number, y: number) => void;
}

export const FloorCanvas: React.FC<FloorCanvasProps> = ({
  machines,
  zones,
  structures,
  junctions,
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
  onMoveMachine,
  onAddMachine,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
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
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
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
  }, [transform, onTransformChange]);

  // Mouse Down for Panning canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only primary button or middle button on background
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

    // If click was stationary (< 4px movement) on background, deselect
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

  // Machine Pointer Down (for Config Mode Dragging & Click Selection)
  const handleMachinePointerDown = (
    e: React.PointerEvent<SVGGElement>,
    machine: FloorMachineAsset
  ) => {
    e.stopPropagation();

    if (!isConfigMode) {
      onSelectAsset(machine.id);
      return;
    }

    // In config mode, enable drag
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

  // Machine Pointer Move (while dragging in config mode)
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

    // Constrain within factory walls
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

      // If user clicked without dragging, select asset
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
      let dropX = (e.clientX - rect.left - transform.x) / transform.scale - 22;
      let dropY = (e.clientY - rect.top - transform.y) / transform.scale - 24;

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

  // Helper for Machine Status Dot color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return '#16A34A';
      case 'warning':
        return '#D97706';
      case 'critical':
        return '#DC2626';
      default:
        return '#94A3B8';
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
            {/* Fine Industrial Schematic Grid Pattern */}
            <pattern
              id="blueprint-grid-pattern"
              width={gridSize}
              height={gridSize}
              patternUnits="userSpaceOnUse"
            >
              <rect width={gridSize} height={gridSize} fill="#F4F3EE" />
              <path
                d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                fill="none"
                stroke={isConfigMode ? '#D1D5DB' : '#E2E8F0'}
                strokeWidth={isConfigMode ? '1' : '0.8'}
              />
              <circle cx="0" cy="0" r="0.8" fill="#9CA3AF" />
            </pattern>
          </defs>

          {/* Background Grid */}
          {gridVisible && (
            <rect
              x="0"
              y="0"
              width="1160"
              height="900"
              fill="url(#blueprint-grid-pattern)"
              style={{ pointerEvents: 'none' }}
            />
          )}

          {/* =========================================================================
              1. ARCHITECTURAL EXTERIOR WALLS & PERIMETER
              ========================================================================= */}
          {/* Main Exterior Boundary */}
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
          <rect
            x="44"
            y="44"
            width="1072"
            height="812"
            fill="none"
            stroke="#2E3033"
            strokeWidth="1.2"
            style={{ pointerEvents: 'none' }}
          />

          {/* =========================================================================
              2. ROOM ZONES & INTERIOR PARTITIONS
              ========================================================================= */}
          {zones.map((zone) => {
            return (
              <g key={zone.id} className="room-zone-group">
                {/* Zone Room Boundary */}
                <rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.width}
                  height={zone.height}
                  fill="#FAF9F5"
                  stroke="#121315"
                  strokeWidth="2"
                  className="room-zone-boundary"
                />

                {/* Zone Name Header */}
                <text
                  x={zone.x + zone.width / 2}
                  y={zone.y + 22}
                  textAnchor="middle"
                  className="zone-header-text"
                  style={{ pointerEvents: 'none' }}
                >
                  {zone.name}
                </text>
              </g>
            );
          })}

          {/* =========================================================================
              3. WAREHOUSE STORAGE RACKS & STRUCTURES
              ========================================================================= */}
          {structures.map((str) => {
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
                  {/* Shelves dividers */}
                  {Array.from({ length: (str.rows || 3) - 1 }).map((_, idx) => (
                    <line
                      key={idx}
                      x1={str.x}
                      y1={str.y + ((str.height) / (str.rows || 3)) * (idx + 1)}
                      x2={str.x + str.width}
                      y2={str.y + ((str.height) / (str.rows || 3)) * (idx + 1)}
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
                  <text
                    x={str.x + str.width / 2}
                    y={str.y + str.height / 2 + 3}
                    textAnchor="middle"
                    fontSize="9"
                    fontFamily="var(--font-mono)"
                    fontWeight="700"
                    fill="#374151"
                  >
                    {str.label}
                  </text>
                </g>
              );
            }

            if (str.type === 'door') {
              return (
                <g key={str.id} className="structure-door-group" style={{ pointerEvents: 'none' }}>
                  {/* Door Opening Gap & Swing Arc */}
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

          {/* AGV Station Charging Pad Badge */}
          <g className="agv-station-pad" style={{ pointerEvents: 'none' }}>
            <rect
              x="1040"
              y="320"
              width="60"
              height="60"
              fill="#FFFFFF"
              stroke="#121315"
              strokeWidth="1.8"
              rx="2"
            />
            {/* AGV Vehicle Icon in Pad */}
            <rect x="1048" y="332" width="44" height="24" rx="2" fill="#EBE9DF" stroke="#121315" strokeWidth="1.2" />
            <path d="M1066 324 L1062 334 H1068 L1064 344 L1074 332 H1068 L1072 324 Z" fill="#D97706" stroke="#92400E" strokeWidth="0.8" />
          </g>

          {/* =========================================================================
              4. AUTOMATED CONVEYOR INTERCONNECTING NETWORK
              ========================================================================= */}
          {/* Die Attach Top Conveyor Line */}
          <g style={{ pointerEvents: 'none' }}>
            <rect x="428" y="166" width="372" height="18" fill="#EBE9DF" stroke="#121315" strokeWidth="1.5" />
            <line x1="428" y1="175" x2="800" y2="175" stroke="#D97706" strokeWidth="1.5" strokeDasharray="6 3" />
            <rect x="428" y="166" width="18" height="44" fill="#EBE9DF" stroke="#121315" strokeWidth="1.5" />
            <rect x="782" y="166" width="18" height="44" fill="#EBE9DF" stroke="#121315" strokeWidth="1.5" />

            {/* Middle Main Hall Conveyor Loop (Plasma -> WB -> MP -> AOI -> XR -> LM) */}
            <rect x="74" y="271" width="826" height="18" fill="#EBE9DF" stroke="#121315" strokeWidth="1.5" />
            <line x1="74" y1="280" x2="900" y2="280" stroke="#D97706" strokeWidth="1.5" strokeDasharray="6 3" />

            <rect x="74" y="471" width="826" height="18" fill="#EBE9DF" stroke="#121315" strokeWidth="1.5" />
            <line x1="74" y1="480" x2="900" y2="480" stroke="#D97706" strokeWidth="1.5" strokeDasharray="6 3" />

            <rect x="74" y="656" width="826" height="18" fill="#EBE9DF" stroke="#121315" strokeWidth="1.5" />
            <line x1="74" y1="665" x2="900" y2="665" stroke="#D97706" strokeWidth="1.5" strokeDasharray="6 3" />

            {/* Vertical Connectors */}
            <rect x="74" y="280" width="18" height="385" fill="#EBE9DF" stroke="#121315" strokeWidth="1.5" />
            <line x1="83" y1="280" x2="83" y2="665" stroke="#D97706" strokeWidth="1.5" strokeDasharray="6 3" />

            <rect x="341" y="280" width="18" height="385" fill="#EBE9DF" stroke="#121315" strokeWidth="1.5" />
            <line x1="350" y1="280" x2="350" y2="665" stroke="#D97706" strokeWidth="1.5" strokeDasharray="6 3" />

            <rect x="651" y="280" width="18" height="385" fill="#EBE9DF" stroke="#121315" strokeWidth="1.5" />
            <line x1="660" y1="280" x2="660" y2="665" stroke="#D97706" strokeWidth="1.5" strokeDasharray="6 3" />

            <rect x="891" y="280" width="18" height="385" fill="#EBE9DF" stroke="#121315" strokeWidth="1.5" />
            <line x1="900" y1="280" x2="900" y2="665" stroke="#D97706" strokeWidth="1.5" strokeDasharray="6 3" />

            {/* Junction Transfer Boxes */}
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
                <circle cx={j.x} cy={j.y} r="2.5" fill="#121315" />
              </g>
            ))}
          </g>

          {/* =========================================================================
              5. MACHINE NODES (Interactive Equipments on Floor)
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
                {/* Selection Bounding Box */}
                {isSelected && (
                  <rect
                    x="-3"
                    y="-3"
                    width={machine.width + 6}
                    height={machine.height + 6}
                    fill="rgba(217, 119, 6, 0.12)"
                    stroke="#D97706"
                    strokeWidth="2"
                    rx="3"
                    style={{ pointerEvents: 'none' }}
                  />
                )}

                {/* In Config Mode: Subtle dashed guide border */}
                {isConfigMode && !isSelected && (
                  <rect
                    x="-2"
                    y="-2"
                    width={machine.width + 4}
                    height={machine.height + 4}
                    fill="none"
                    stroke="#9CA3AF"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    rx="2"
                    style={{ pointerEvents: 'none' }}
                  />
                )}

                {/* Equipment Base Card */}
                <rect
                  x="0"
                  y="0"
                  width={machine.width}
                  height={machine.height}
                  className="fp-machine-card-base"
                  rx="2"
                  style={{ pointerEvents: 'none' }}
                />

                {/* SVG Icon Illustration */}
                <foreignObject
                  x="2"
                  y="2"
                  width={machine.width - 4}
                  height={machine.height - 4}
                  style={{ pointerEvents: 'none' }}
                >
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <FloorIcon type={machine.type} size={34} />
                  </div>
                </foreignObject>

                {/* Live Status Dot */}
                <circle
                  cx={machine.width - 6}
                  cy="6"
                  r="3"
                  fill={getStatusColor(machine.status)}
                  stroke="#121315"
                  strokeWidth="1"
                  style={{ pointerEvents: 'none' }}
                />

                {/* ID Label below machine */}
                <text
                  x={machine.width / 2}
                  y={machine.height + 11}
                  textAnchor="middle"
                  fontSize="8.5"
                  fontFamily="var(--font-mono)"
                  fontWeight="800"
                  className="fp-machine-id-label"
                  style={{ pointerEvents: 'none' }}
                >
                  {machine.id}
                </text>

                {/* Direct Click Hit-Test Target */}
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
