import React, { useRef, useState, useCallback } from 'react';
import { MachineData } from '../../../types/factory';
import { MachineNode } from './MachineNode';
import { MachineTooltip } from './MachineTooltip';

interface FactoryCanvasProps {
  machines: MachineData[];
  selectedMachine: MachineData | null;
  onSelectMachine: (machine: MachineData | null) => void;
  transform: { x: number; y: number; scale: number };
  onTransformChange: (newTransform: { x: number; y: number; scale: number }) => void;
}

export const FactoryCanvas: React.FC<FactoryCanvasProps> = ({
  machines,
  selectedMachine,
  onSelectMachine,
  transform,
  onTransformChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredMachine, setHoveredMachine] = useState<MachineData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Mouse wheel zoom centered at cursor
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
      const newScale = Math.min(Math.max(0.35, transform.scale * zoomFactor), 2.2);

      if (newScale === transform.scale) return;

      const newX = cursorX - (cursorX - transform.x) * (newScale / transform.scale);
      const newY = cursorY - (cursorY - transform.y) * (newScale / transform.scale);

      onTransformChange({
        x: newX,
        y: newY,
        scale: newScale,
      });
    },
    [transform, onTransformChange]
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.button !== 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - transform.x,
      y: e.clientY - transform.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      onTransformChange({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
        scale: transform.scale,
      });
    }

    if (hoveredMachine && containerRef.current) {
      const machineCenterX = hoveredMachine.x + hoveredMachine.width / 2;
      const machineTopY = hoveredMachine.y;
      const screenX = machineCenterX * transform.scale + transform.x;
      const screenY = machineTopY * transform.scale + transform.y;
      setTooltipPos({ x: screenX, y: screenY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleHoverStart = (machine: MachineData, _e: React.MouseEvent) => {
    setHoveredMachine(machine);
    if (containerRef.current) {
      const machineCenterX = machine.x + machine.width / 2;
      const machineTopY = machine.y;
      const screenX = machineCenterX * transform.scale + transform.x;
      const screenY = machineTopY * transform.scale + transform.y;
      setTooltipPos({ x: screenX, y: screenY });
    }
  };

  const handleHoverEnd = () => {
    setHoveredMachine(null);
    setTooltipPos(null);
  };

  // Render Technical Dual-Rail Conveyor Tracks with Flow Stream
  const renderFlowConnections = () => {
    const machineMap = new Map<string, MachineData>();
    machines.forEach((m) => machineMap.set(m.id, m));

    const paths: React.ReactNode[] = [];

    const connections: Array<{ from: string; to: string }> = [
      // Stage 01 (WS & STK) -> Stage 02 (DA)
      { from: 'STK-01', to: 'WS-01' },
      { from: 'STK-01', to: 'WS-02' },
      { from: 'WS-01', to: 'DA-01' },
      { from: 'WS-01', to: 'DA-02' },
      { from: 'WS-02', to: 'DA-03' },
      { from: 'WS-02', to: 'DA-04' },
      // Stage 02 (DA) -> Stage 03 (PC)
      { from: 'DA-01', to: 'PC-01' },
      { from: 'DA-02', to: 'PC-01' },
      { from: 'DA-03', to: 'PC-02' },
      { from: 'DA-04', to: 'PC-02' },
      // Stage 03 (PC) -> Stage 04 (WB)
      { from: 'PC-01', to: 'WB-01' },
      { from: 'PC-01', to: 'WB-02' },
      { from: 'PC-01', to: 'WB-03' },
      { from: 'PC-01', to: 'WB-04' },
      { from: 'PC-02', to: 'WB-05' },
      { from: 'PC-02', to: 'WB-06' },
      { from: 'PC-02', to: 'WB-07' },
      { from: 'PC-02', to: 'WB-08' },
      // Stage 04 (WB) -> Stage 05 (MP)
      { from: 'WB-01', to: 'MP-01' },
      { from: 'WB-02', to: 'MP-01' },
      { from: 'WB-03', to: 'MP-02' },
      { from: 'WB-04', to: 'MP-02' },
      { from: 'WB-05', to: 'MP-03' },
      { from: 'WB-06', to: 'MP-03' },
      { from: 'WB-07', to: 'MP-04' },
      { from: 'WB-08', to: 'MP-04' },
      // Stage 05 (MP) -> Stage 06 (AOI)
      { from: 'MP-01', to: 'AOI-01' },
      { from: 'MP-02', to: 'AOI-02' },
      { from: 'MP-03', to: 'AOI-03' },
      { from: 'MP-04', to: 'AOI-04' },
      // Stage 06 (AOI) -> Stage 06 (XR)
      { from: 'AOI-01', to: 'XR-01' },
      { from: 'AOI-02', to: 'XR-01' },
      { from: 'AOI-03', to: 'XR-02' },
      { from: 'AOI-04', to: 'XR-02' },
      // Stage 06 (XR) -> Stage 07 (LM)
      { from: 'XR-01', to: 'LM-01' },
      { from: 'XR-02', to: 'LM-02' },
      // Stage 07 (LM) -> Stage 07 (TH)
      { from: 'LM-01', to: 'TH-01' },
      { from: 'LM-02', to: 'TH-02' },
      // Stage 07 (TH) -> Stage 07 (TR)
      { from: 'TH-01', to: 'TR-01' },
      { from: 'TH-01', to: 'TR-02' },
      { from: 'TH-01', to: 'TR-03' },
      { from: 'TH-02', to: 'TR-04' },
      { from: 'TH-02', to: 'TR-05' },
      { from: 'TH-02', to: 'TR-06' },
    ];

    connections.forEach((conn, index) => {
      const source = machineMap.get(conn.from);
      const target = machineMap.get(conn.to);
      if (!source || !target) return;

      const startX = source.x + source.width;
      const startY = source.y + source.height / 2;
      const endX = target.x;
      const endY = target.y + target.height / 2;

      const isStraight = Math.abs(startY - endY) < 4;

      let pathD: string;
      if (isStraight) {
        pathD = `M ${startX} ${startY} L ${endX} ${endY}`;
      } else {
        const deltaX = endX - startX;
        const cp1x = startX + deltaX * 0.5;
        const cp2x = startX + deltaX * 0.5;
        pathD = `M ${startX} ${startY} C ${cp1x} ${startY}, ${cp2x} ${endY}, ${endX} ${endY}`;
      }

      const isAlert = source.status === 'warning' || target.status === 'warning';
      const isHighlighted =
        selectedMachine?.id === source.id ||
        selectedMachine?.id === target.id ||
        hoveredMachine?.id === source.id ||
        hoveredMachine?.id === target.id;

      const strokeColor = isAlert
        ? 'var(--accent-red)'
        : isHighlighted
        ? 'var(--accent-amber)'
        : 'var(--border-strong)';

      paths.push(
        <g key={`conn-${index}`}>
          {/* Dual-Rail Outer Conveyor Track Bed */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--border-light)"
            strokeWidth={7}
            strokeLinecap="round"
          />
          {/* Inner Track Channel */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--bg-surface)"
            strokeWidth={3}
            strokeLinecap="round"
          />
          {/* Animated Flow Pulse Stream */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth={isAlert ? 2.5 : isHighlighted ? 2.5 : 1.8}
            strokeDasharray={isAlert ? '4 3' : '6 4'}
            className="animated-flow-line"
          />
          {/* Terminal Coupling Anchor Dots */}
          <circle cx={startX} cy={startY} r={2.5} fill={strokeColor} />
          <circle cx={endX} cy={endY} r={2.5} fill={strokeColor} />
        </g>
      );
    });

    return paths;
  };

  // 7 Process Stage Headers with Tightened, Snug Spacing
  const processStages = [
    {
      step: '01',
      title: 'WAFER DICING',
      nodeCount: '3 NODES',
      color: '#2563EB', // Blue
      bgTint: 'rgba(37, 99, 235, 0.035)',
      borderTint: 'rgba(37, 99, 235, 0.22)',
      x: 50,
      icon: (
        <svg width="30" height="30" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="11" stroke="#2563EB" strokeWidth="2" fill="rgba(37, 99, 235, 0.1)" />
          <path d="M 6 10 L 22 10 M 4 14 L 24 14 M 6 18 L 22 18" stroke="#2563EB" strokeWidth="1.4" strokeDasharray="1.5 1.5" />
          <path d="M 10 6 L 10 22 M 14 4 L 14 24 M 18 6 L 18 22" stroke="#2563EB" strokeWidth="1.4" strokeDasharray="1.5 1.5" />
          <path d="M 14 2 L 14 6" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      step: '02',
      title: 'DIE ATTACH',
      nodeCount: '4 NODES',
      color: '#4F46E5', // Indigo
      bgTint: 'rgba(79, 70, 229, 0.035)',
      borderTint: 'rgba(79, 70, 229, 0.22)',
      x: 350,
      icon: (
        <svg width="30" height="30" viewBox="0 0 28 28" fill="none">
          <rect x="4" y="8" width="20" height="16" rx="2.5" stroke="#4F46E5" strokeWidth="2" fill="rgba(79, 70, 229, 0.1)" />
          <rect x="9" y="13" width="10" height="7" rx="1" fill="#4F46E5" />
          <path d="M 14 3 L 14 10 M 11 6 L 14 3 L 17 6" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      step: '03',
      title: 'PLASMA CLEAN',
      nodeCount: '2 NODES',
      color: '#0D9488', // Teal
      bgTint: 'rgba(13, 148, 136, 0.035)',
      borderTint: 'rgba(13, 148, 136, 0.22)',
      x: 650,
      icon: (
        <svg width="30" height="30" viewBox="0 0 28 28" fill="none">
          <path d="M 14 3.5 L 16.8 11.2 L 24.5 14 L 16.8 16.8 L 14 24.5 L 11.2 16.8 L 3.5 14 L 11.2 11.2 Z" stroke="#0D9488" strokeWidth="2" fill="rgba(13, 148, 136, 0.14)" strokeLinejoin="round" />
          <circle cx="21" cy="7" r="1.8" fill="#0D9488" />
          <circle cx="7" cy="21" r="1.5" fill="#0D9488" />
        </svg>
      ),
    },
    {
      step: '04',
      title: 'WIRE BOND',
      nodeCount: '8 NODES',
      color: '#16A34A', // Green
      bgTint: 'rgba(22, 163, 74, 0.035)',
      borderTint: 'rgba(22, 163, 74, 0.22)',
      x: 950,
      icon: (
        <svg width="30" height="30" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="10.5" stroke="#16A34A" strokeWidth="2" fill="rgba(22, 163, 74, 0.1)" />
          <circle cx="14" cy="14" r="2.8" fill="#16A34A" />
          <path d="M 6 18 C 9 9.5, 19 9.5, 22 18" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 14 3.5 L 14 11.2" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      step: '05',
      title: 'AUTO MOLD',
      nodeCount: '4 NODES',
      color: '#7C3AED', // Purple
      bgTint: 'rgba(124, 58, 237, 0.035)',
      borderTint: 'rgba(124, 58, 237, 0.22)',
      x: 1250,
      icon: (
        <svg width="30" height="30" viewBox="0 0 28 28" fill="none">
          <rect x="5" y="5" width="18" height="6.5" rx="1.5" stroke="#7C3AED" strokeWidth="2" fill="rgba(124, 58, 237, 0.16)" />
          <rect x="5" y="16.5" width="18" height="6.5" rx="1.5" stroke="#7C3AED" strokeWidth="2" fill="rgba(124, 58, 237, 0.16)" />
          <path d="M 8 11.5 L 20 11.5" stroke="#7C3AED" strokeWidth="2" />
          <circle cx="9" cy="25" r="1.8" fill="#7C3AED" />
          <circle cx="14" cy="25" r="1.8" fill="#7C3AED" />
          <circle cx="19" cy="25" r="1.8" fill="#7C3AED" />
        </svg>
      ),
    },
    {
      step: '06',
      title: '3D AOI & X-RAY',
      nodeCount: '6 NODES',
      color: '#EA580C', // Orange
      bgTint: 'rgba(234, 88, 12, 0.035)',
      borderTint: 'rgba(234, 88, 12, 0.22)',
      x: 1550,
      icon: (
        <svg width="30" height="30" viewBox="0 0 28 28" fill="none">
          <path d="M 14 4.5 L 5.5 22.5 L 22.5 22.5 Z" stroke="#EA580C" strokeWidth="2" fill="rgba(234, 88, 12, 0.1)" strokeLinejoin="round" />
          <circle cx="14" cy="15" r="3.8" stroke="#EA580C" strokeWidth="1.8" />
          <path d="M 14 11 L 14 19 M 10 15 L 18 15" stroke="#EA580C" strokeWidth="1.4" />
        </svg>
      ),
    },
    {
      step: '07',
      title: 'LASER, TEST & PACK',
      nodeCount: '10 NODES',
      color: '#0891B2', // Cyan
      bgTint: 'rgba(8, 145, 178, 0.035)',
      borderTint: 'rgba(8, 145, 178, 0.22)',
      x: 1850,
      icon: (
        <svg width="30" height="30" viewBox="0 0 28 28" fill="none">
          <path d="M 14 3.5 L 23.5 9 L 23.5 19 L 14 24.5 L 4.5 19 L 4.5 9 Z" stroke="#0891B2" strokeWidth="2" fill="rgba(8, 145, 178, 0.1)" strokeLinejoin="round" />
          <path d="M 14 3.5 L 14 24.5 M 4.5 9 L 14 14 L 23.5 9" stroke="#0891B2" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <div
      ref={containerRef}
      id="vfactory-canvas-container"
      className="factory-canvas-viewport blueprint-grid"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={() => onSelectMachine(null)}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        backgroundColor: 'var(--bg-main)',
        userSelect: 'none',
      }}
    >
      {/* 2D Canvas Stage: 2160px × 595px */}
      <div
        className="factory-canvas-stage"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '2160px',
          height: '595px',
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0px) scale(${transform.scale})`,
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
      >
        {/* ================================================================= */}
        {/* CLEANROOM BASE PLATE                                              */}
        {/* ================================================================= */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'var(--bg-surface)',
            border: '1.5px solid var(--border-strong)',
            borderRadius: '6px',
            boxShadow: '3.5px 3.5px 0px rgba(18, 19, 21, 0.1)',
          }}
        >
          {/* Outer Viewport Corner L-Brackets */}
          <div style={{ position: 'absolute', top: '8px', left: '8px', width: '18px', height: '18px', borderTop: '2px solid var(--border-strong)', borderLeft: '2px solid var(--border-strong)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '8px', right: '8px', width: '18px', height: '18px', borderTop: '2px solid var(--border-strong)', borderRight: '2px solid var(--border-strong)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '18px', height: '18px', borderBottom: '2px solid var(--border-strong)', borderLeft: '2px solid var(--border-strong)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '18px', height: '18px', borderBottom: '2px solid var(--border-strong)', borderRight: '2px solid var(--border-strong)', pointerEvents: 'none' }} />

          {/* =============================================================== */}
          {/* 7 STAGE COLUMN TINTED LANES (Tightened Vertical Fit)            */}
          {/* =============================================================== */}
          {processStages.map((stage, idx) => (
            <div
              key={`stage-col-${idx}`}
              style={{
                position: 'absolute',
                left: `${stage.x}px`,
                top: '10px',
                width: '260px',
                height: '574px',
                backgroundColor: stage.bgTint,
                border: `1.5px solid ${stage.borderTint}`,
                borderRadius: '5px',
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* =============================================================== */}
          {/* 7 PROCESS STAGE HEADERS (Snug Fit & Clear Hierarchy)            */}
          {/* =============================================================== */}
          {processStages.map((stage, idx) => (
            <React.Fragment key={`stage-header-${idx}`}>
              {/* Header Box */}
              <div
                style={{
                  position: 'absolute',
                  left: `${stage.x + 10}px`,
                  top: '14px',
                  width: '240px',
                  height: '84px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  pointerEvents: 'none',
                }}
              >
                {/* Top Row: Circular Icon + Step & Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Left: Stage SVG Illustration Badge */}
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      border: `2px solid ${stage.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 2px 8px ${stage.borderTint}`,
                      flexShrink: 0,
                    }}
                  >
                    {stage.icon}
                  </div>

                  {/* Right: Step Number + Process Title + Node Count */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          fontWeight: 900,
                          color: '#FFFFFF',
                          backgroundColor: stage.color,
                          padding: '1px 5px',
                          borderRadius: '2px',
                          letterSpacing: '0.06em',
                        }}
                      >
                        STEP {stage.step}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '9px',
                          fontWeight: 700,
                          color: 'var(--text-muted)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {stage.nodeCount}
                      </span>
                    </div>

                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '14px',
                        fontWeight: 900,
                        color: stage.color,
                        letterSpacing: '0.03em',
                        lineHeight: 1.15,
                        marginTop: '1px',
                      }}
                    >
                      {stage.title}
                    </span>
                  </div>
                </div>

                {/* Bold Colored Accent Underline with Rounded Tips */}
                <div
                  style={{
                    width: '100%',
                    height: '3.5px',
                    backgroundColor: stage.color,
                    borderRadius: '2px',
                    boxShadow: `0 1px 3px ${stage.borderTint}`,
                    marginTop: '6px',
                  }}
                />
              </div>

              {/* Connecting Double Chevron ">>" between stages */}
              {idx < processStages.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${stage.x + 268}px`,
                    top: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    zIndex: 4,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M 5 4 L 10 10 L 5 16"
                      stroke="#94A3B8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 11 4 L 16 10 L 11 16"
                      stroke="#94A3B8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ================================================================= */}
        {/* SVG CONVEYORS & FLOW PATHS                                        */}
        {/* ================================================================= */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          {renderFlowConnections()}
        </svg>

        {/* ================================================================= */}
        {/* MACHINE NODES (24 MACHINES IN 7-STAGE PROCESS LANES)              */}
        {/* ================================================================= */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          {machines.map((machine) => (
            <MachineNode
              key={machine.id}
              machine={machine}
              isSelected={selectedMachine?.id === machine.id}
              isHovered={hoveredMachine?.id === machine.id}
              onSelect={onSelectMachine}
              onHoverStart={handleHoverStart}
              onHoverEnd={handleHoverEnd}
            />
          ))}
        </div>
      </div>

      {/* Screen-space Hover Tooltip */}
      <MachineTooltip machine={hoveredMachine} position={tooltipPos} />
    </div>
  );
};
