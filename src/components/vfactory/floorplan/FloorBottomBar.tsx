import React from 'react';
import { FloorMachineAsset, RoomZone } from '../../../types/floorPlan';
import { ChevronDown } from 'lucide-react';

interface FloorBottomBarProps {
  floor: number;
  onFloorChange: (floor: number) => void;
  area: string;
  onAreaChange: (area: string) => void;
  snapToGrid: boolean;
  onToggleSnapToGrid: () => void;
  gridVisible: boolean;
  onToggleGridVisible: () => void;
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  machines: FloorMachineAsset[];
  zones: RoomZone[];
  canvasTransform: { x: number; y: number; scale: number };
  onMinimapPan: (x: number, y: number) => void;
}

export const FloorBottomBar: React.FC<FloorBottomBarProps> = ({
  floor,
  onFloorChange,
  area,
  onAreaChange,
  snapToGrid,
  onToggleSnapToGrid,
  gridVisible,
  onToggleGridVisible,
  gridSize,
  onGridSizeChange,
  machines,
  zones,
  canvasTransform,
  onMinimapPan,
}) => {
  const handleMinimapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const normX = clickX / rect.width;
    const normY = clickY / rect.height;

    // Full floor dimension is roughly 1200 x 900
    const targetFloorX = normX * 1200;
    const targetFloorY = normY * 900;

    onMinimapPan(targetFloorX, targetFloorY);
  };

  return (
    <footer className="floor-bottom-bar" aria-label="Floor Controls & Cleanroom Status">
      {/* 1. Left Cleanroom Selectors & Environmental Microclimate */}
      <div className="bottom-bar-left">
        {/* Floor Dropdown */}
        <div className="bottom-select-group">
          <span className="bottom-select-label">LEVEL</span>
          <div className="bottom-custom-select">
            <select
              value={floor}
              onChange={(e) => onFloorChange(Number(e.target.value))}
              className="bottom-native-select"
            >
              <option value={1}>L1 Cleanroom Fab</option>
              <option value={2}>L2 Sub-Fab Utility</option>
              <option value={3}>L3 AMHS Plenum</option>
            </select>
            <ChevronDown size={13} className="bottom-select-arrow" />
          </div>
        </div>

        {/* Area Dropdown */}
        <div className="bottom-select-group">
          <span className="bottom-select-label">BAY</span>
          <div className="bottom-custom-select area-select">
            <select
              value={area}
              onChange={(e) => onAreaChange(e.target.value)}
              className="bottom-native-select"
            >
              <option value="Backend Assembly">Full Packaging Cleanroom</option>
              <option value="Bay 1: Wafer Dicing">Bay 1: Wafer Dicing</option>
              <option value="Bay 2: Die Attach">Bay 2: Die Attach</option>
              <option value="Bay 3: Wire Bonding">Bay 3: Wire Bonding</option>
              <option value="Bay 4: Molding Chase">Bay 4: Molding Chase</option>
              <option value="Bay 5: 3D Metrology">Bay 5: 3D Metrology</option>
              <option value="Bay 6: Tape & Reel">Bay 6: Tape & Reel</option>
            </select>
            <ChevronDown size={13} className="bottom-select-arrow" />
          </div>
        </div>
      </div>

      {/* 2. Center Interactive Minimap */}
      <div className="bottom-bar-center">
        <div
          className="floor-minimap-box"
          onClick={handleMinimapClick}
          title="Click to pan floor plan"
        >
          {/* Mini schematic wireframe */}
          <svg viewBox="0 0 1200 900" className="minimap-svg">
            {/* Rooms */}
            {zones.map((zone) => (
              <rect
                key={zone.id}
                x={zone.x}
                y={zone.y}
                width={zone.width}
                height={zone.height}
                fill="#E2E8F0"
                stroke="#94A3B8"
                strokeWidth="4"
              />
            ))}

            {/* Machines dots */}
            {machines.map((m) => {
              const color =
                m.status === 'healthy'
                  ? '#16A34A'
                  : m.status === 'warning'
                  ? '#D97706'
                  : m.status === 'critical'
                  ? '#DC2626'
                  : '#94A3B8';
              return (
                <rect
                  key={m.id}
                  x={m.x}
                  y={m.y}
                  width={m.width}
                  height={m.height}
                  fill={color}
                  rx="3"
                />
              );
            })}
          </svg>

          {/* Minimap Viewport Frame */}
          <div
            className="minimap-viewport-indicator"
            style={{
              left: `${Math.max(0, Math.min(80, (-canvasTransform.x / (1200 * canvasTransform.scale)) * 100))}%`,
              top: `${Math.max(0, Math.min(80, (-canvasTransform.y / (900 * canvasTransform.scale)) * 100))}%`,
              width: `${Math.min(100, (1 / canvasTransform.scale) * 60)}%`,
              height: `${Math.min(100, (1 / canvasTransform.scale) * 60)}%`,
            }}
          />
        </div>
      </div>

      {/* 3. Right Status Legend & Grid Controls */}
      <div className="bottom-bar-right">
        {/* Status Legend */}
        <div className="bottom-legend-group">
          <div className="legend-item">
            <span className="legend-dot green" />
            <span className="legend-text">Operational</span>
          </div>

          <div className="legend-item">
            <span className="legend-dot amber" />
            <span className="legend-text">Warning</span>
          </div>

          <div className="legend-item">
            <span className="legend-dot red" />
            <span className="legend-text">Alarm</span>
          </div>

          <div className="legend-item">
            <span className="legend-dot gray" />
            <span className="legend-text">Offline</span>
          </div>
        </div>

        <div className="bottom-divider" />

        {/* Snap to Grid Toggle */}
        <div className="bottom-toggle-group">
          <span className="toggle-label">Snap</span>
          <button
            onClick={onToggleSnapToGrid}
            className={`toggle-switch-btn ${snapToGrid ? 'on' : 'off'}`}
            title="Toggle snap to grid alignment"
          >
            <span className="toggle-knob" />
          </button>
        </div>

        {/* Grid Toggle */}
        <div className="bottom-toggle-group">
          <span className="toggle-label">Grid</span>
          <button
            onClick={onToggleGridVisible}
            className={`toggle-switch-btn ${gridVisible ? 'on' : 'off'}`}
            title="Toggle background cleanroom ESD grid"
          >
            <span className="toggle-knob" />
          </button>
        </div>

        {/* Grid Size Selector */}
        <div className="bottom-select-group">
          <span className="bottom-select-label" style={{ fontSize: '10px' }}>Grid</span>
          <div className="bottom-custom-select grid-size-select">
            <select
              value={gridSize}
              onChange={(e) => onGridSizeChange(Number(e.target.value))}
              className="bottom-native-select"
            >
              <option value={10}>10 px</option>
              <option value={20}>20 px</option>
              <option value={40}>40 px</option>
            </select>
            <ChevronDown size={11} className="bottom-select-arrow" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FloorBottomBar;
