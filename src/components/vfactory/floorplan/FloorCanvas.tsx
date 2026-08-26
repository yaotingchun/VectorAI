import React, { useRef, useCallback } from 'react';
import {
  FloorMachineAsset,
  RoomZone,
  StructureAsset,
  ConveyorJunction,
  ToolMode,
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
  gridSize,
  transform,
  onTransformChange,
  filterType,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; startX: number; startY: number }>({
    clientX: 0,
    clientY: 0,
    startX: 0,
    startY: 0,
  });

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

  // Mouse Down for Panning
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only primary button or middle button
    if (e.button !== 0 && e.button !== 1) return;

    isDraggingRef.current = true;
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: transform.x,
      startY: transform.y,
    };
  };

  // Mouse Move for Smooth Panning
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.clientX;
    const deltaY = e.clientY - dragStartRef.current.clientY;

    onTransformChange({
      ...transform,
      x: dragStartRef.current.startX + deltaX,
      y: dragStartRef.current.startY + deltaY,
    });
  };

  // Mouse Up
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    // If click was stationary (< 4px movement) on background, deselect
    const deltaX = Math.abs(e.clientX - dragStartRef.current.clientX);
    const deltaY = Math.abs(e.clientY - dragStartRef.current.clientY);
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
      className={`floor-canvas-container ${activeTool === 'pan' ? 'panning' : ''}`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
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
            {/* Fine Grid Pattern */}
            <pattern
              id="blueprint-grid-pattern"
              width={gridSize}
              height={gridSize}
              patternUnits="userSpaceOnUse"
            >
              <rect width={gridSize} height={gridSize} fill="#FFFFFF" />
              <path
                d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="0.8"
              />
              <circle cx="0" cy="0" r="0.7" fill="#CBD5E1" />
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
            fill="#FFFFFF"
            stroke="#1E293B"
            strokeWidth="3.5"
            className="room-zone-boundary"
          />
          <rect
            x="44"
            y="44"
            width="1072"
            height="812"
            fill="none"
            stroke="#334155"
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
                  fill="#FAFAFA"
                  stroke="#1E293B"
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
                    stroke="#1E293B"
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
                      stroke="#475569"
                      strokeWidth="1"
                    />
                  ))}
                  <line
                    x1={str.x + str.width / 2}
                    y1={str.y}
                    x2={str.x + str.width / 2}
                    y2={str.y + str.height}
                    stroke="#64748B"
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
                    fill="#F1F5F9"
                    stroke="#1E293B"
                    strokeWidth="1.5"
                  />
                  <line x1={str.x} y1={str.y + 20} x2={str.x + str.width} y2={str.y + 20} stroke="#1E293B" strokeWidth="1.2" />
                  <line x1={str.x} y1={str.y + 40} x2={str.x + str.width} y2={str.y + 40} stroke="#1E293B" strokeWidth="1.2" />
                  <line x1={str.x} y1={str.y + 60} x2={str.x + str.width} y2={str.y + 60} stroke="#1E293B" strokeWidth="1.2" />
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
                    fill="#F8FAFC"
                    stroke="#1E293B"
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
                    fill="#475569"
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
                  <rect x={str.x} y={str.y - 2} width={str.width} height={4} fill="#FFFFFF" />
                  <line x1={str.x} y1={str.y} x2={str.x + 8} y2={str.y - 12} stroke="#1E293B" strokeWidth="1.8" />
                  <path
                    d={`M ${str.x + 8} ${str.y - 12} A 14 14 0 0 1 ${str.x + str.width} ${str.y}`}
                    stroke="#94A3B8"
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
              stroke="#1E293B"
              strokeWidth="1.8"
              rx="4"
            />
            {/* AGV Vehicle Icon in Pad */}
            <rect x="1048" y="332" width="44" height="24" rx="3" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.2" />
            <path d="M1066 324 L1062 334 H1068 L1064 344 L1074 332 H1068 L1072 324 Z" fill="#EAB308" stroke="#CA8A04" strokeWidth="0.8" />
          </g>

          {/* =========================================================================
              4. AUTOMATED CONVEYOR INTERCONNECTING NETWORK
              ========================================================================= */}
          {/* Die Attach Top Conveyor Line */}
          <g style={{ pointerEvents: 'none' }}>
            <rect x="428" y="166" width="372" height="18" fill="#F1F5F9" stroke="#1E293B" strokeWidth="1.5" />
            <line x1="428" y1="175" x2="800" y2="175" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="6 3" />
            <rect x="428" y="166" width="18" height="44" fill="#F1F5F9" stroke="#1E293B" strokeWidth="1.5" />
            <rect x="782" y="166" width="18" height="44" fill="#F1F5F9" stroke="#1E293B" strokeWidth="1.5" />

            {/* Middle Main Hall Conveyor Loop (Plasma -> WB -> MP -> AOI -> XR -> LM) */}
            <rect x="74" y="271" width="826" height="18" fill="#F1F5F9" stroke="#1E293B" strokeWidth="1.5" />
            <line x1="74" y1="280" x2="900" y2="280" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="6 3" />

            <rect x="74" y="471" width="826" height="18" fill="#F1F5F9" stroke="#1E293B" strokeWidth="1.5" />
            <line x1="74" y1="480" x2="900" y2="480" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="6 3" />

            <rect x="74" y="656" width="826" height="18" fill="#F1F5F9" stroke="#1E293B" strokeWidth="1.5" />
            <line x1="74" y1="665" x2="900" y2="665" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="6 3" />

            {/* Vertical Connectors */}
            <rect x="74" y="280" width="18" height="385" fill="#F1F5F9" stroke="#1E293B" strokeWidth="1.5" />
            <line x1="83" y1="280" x2="83" y2="665" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="6 3" />

            <rect x="341" y="280" width="18" height="385" fill="#F1F5F9" stroke="#1E293B" strokeWidth="1.5" />
            <line x1="350" y1="280" x2="350" y2="665" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="6 3" />

            <rect x="651" y="280" width="18" height="385" fill="#F1F5F9" stroke="#1E293B" strokeWidth="1.5" />
            <line x1="660" y1="280" x2="660" y2="665" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="6 3" />

            <rect x="891" y="280" width="18" height="385" fill="#F1F5F9" stroke="#1E293B" strokeWidth="1.5" />
            <line x1="900" y1="280" x2="900" y2="665" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="6 3" />

            {/* Junction Transfer Boxes */}
            {junctions.map((j) => (
              <g key={j.id} className="conveyor-junction-node">
                <rect
                  x={j.x - j.size / 2}
                  y={j.y - j.size / 2}
                  width={j.size}
                  height={j.size}
                  fill="#FFFFFF"
                  stroke="#0F172A"
                  strokeWidth="1.8"
                  rx="1"
                />
                <line x1={j.x - j.size / 2} y1={j.y} x2={j.x + j.size / 2} y2={j.y} stroke="#3B82F6" strokeWidth="1.2" />
                <line x1={j.x} y1={j.y - j.size / 2} x2={j.x} y2={j.y + j.size / 2} stroke="#3B82F6" strokeWidth="1.2" />
                <circle cx={j.x} cy={j.y} r="2.5" fill="#1E293B" />
              </g>
            ))}
          </g>

          {/* =========================================================================
              5. MACHINE NODES (Interactive Equipments on Floor)
              ========================================================================= */}
          {machines.map((machine) => {
            const isSelected = selectedAssetId === machine.id;
            const isFiltered = filterType ? machine.type === filterType : true;

            return (
              <g
                key={machine.id}
                transform={`translate(${machine.x}, ${machine.y})`}
                className={`fp-machine-node ${isSelected ? 'selected' : ''}`}
                style={{
                  cursor: 'pointer',
                  opacity: isFiltered ? 1 : 0.25,
                  pointerEvents: 'all',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAsset(machine.id);
                }}
              >
                {/* Selection Bounding Box */}
                {isSelected && (
                  <rect
                    x="-3"
                    y="-3"
                    width={machine.width + 6}
                    height={machine.height + 6}
                    fill="rgba(37, 99, 235, 0.08)"
                    stroke="#2563EB"
                    strokeWidth="2"
                    rx="5"
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
                  rx="4"
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
                  r="3.2"
                  fill={getStatusColor(machine.status)}
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  style={{ pointerEvents: 'none' }}
                />

                {/* Subtle ID Label below machine */}
                <text
                  x={machine.width / 2}
                  y={machine.height + 11}
                  textAnchor="middle"
                  fontSize="8.5"
                  fontFamily="var(--font-mono)"
                  fontWeight="700"
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
                  style={{ cursor: 'pointer' }}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
