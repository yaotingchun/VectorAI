import React, { useState } from 'react';
import { ToolMode, LayerVisibilityState } from '../../../types/floorPlan';
import {
  MousePointer,
  Hand,
  Focus,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Activity,
  Zap,
  Wind,
  Truck,
} from 'lucide-react';

interface FloorCanvasToolbarProps {
  activeTool: ToolMode;
  onSelectTool: (tool: ToolMode) => void;
  onFitView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  scale?: number;
  layers?: Partial<LayerVisibilityState>;
  onToggleLayer?: (layerKey: keyof LayerVisibilityState) => void;
}

export const FloorCanvasToolbar: React.FC<FloorCanvasToolbarProps> = ({
  activeTool,
  onSelectTool,
  onFitView,
  onZoomIn,
  onZoomOut,
  onResetView,
  scale = 1,
  layers,
  onToggleLayer,
}) => {
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  return (
    <div className="floor-canvas-floating-toolbar" role="toolbar" aria-label="Floor Plan Canvas Tools">
      {/* 1. Selection & Pan Tools */}
      <button
        onClick={() => onSelectTool('select')}
        className={`canvas-tool-btn ${activeTool === 'select' ? 'active' : ''}`}
        title="Select & Move (V)"
      >
        <MousePointer size={15} />
      </button>

      <button
        onClick={() => onSelectTool('pan')}
        className={`canvas-tool-btn ${activeTool === 'pan' ? 'active' : ''}`}
        title="Pan Canvas (H / Spacebar)"
      >
        <Hand size={15} />
      </button>

      <div className="canvas-tool-divider" />

      {/* 2. Fit & Zoom */}
      <button
        onClick={onFitView}
        className="canvas-tool-btn"
        title="Fit Floor Plan to Screen (F)"
      >
        <Focus size={15} />
      </button>

      <button
        onClick={onResetView}
        className="canvas-tool-btn"
        title="Reset 100% Zoom (0)"
      >
        <Maximize2 size={15} />
      </button>

      <div className="canvas-tool-divider" />

      {/* 3. Layer Visibility Overlays Menu */}
      {layers && onToggleLayer && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            className={`canvas-tool-btn ${isLayerMenuOpen || layers.showUtilities || layers.showOHT ? 'active' : ''}`}
            title="Cleanroom Engineering Overlays (OHT, Sub-Fab Utilities, Zones)"
          >
            <Layers size={15} />
          </button>

          {isLayerMenuOpen && (
            <div className="canvas-layers-dropdown-menu">
              <div className="layers-dropdown-title">// CLEANROOM OVERLAYS</div>
              
              <button
                onClick={() => onToggleLayer('showZones')}
                className={`layer-toggle-menu-item ${layers.showZones !== false ? 'active' : ''}`}
              >
                <Wind size={13} />
                <span>Production Zones</span>
              </button>

              <button
                onClick={() => onToggleLayer('showOHT')}
                className={`layer-toggle-menu-item ${layers.showOHT ? 'active' : ''}`}
              >
                <Truck size={13} />
                <span>OHT AMHS Rail Carriers</span>
              </button>

              <button
                onClick={() => onToggleLayer('showUtilities')}
                className={`layer-toggle-menu-item ${layers.showUtilities ? 'active' : ''}`}
              >
                <Zap size={13} />
                <span>Sub-Fab Process Piping</span>
              </button>

              <button
                onClick={() => onToggleLayer('showAGV')}
                className={`layer-toggle-menu-item ${layers.showAGV !== false ? 'active' : ''}`}
              >
                <Activity size={13} />
                <span>AGV/AMR Guide Lanes</span>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="canvas-tool-divider" />

      {/* 4. Zoom Controls */}
      <button
        onClick={onZoomOut}
        className="canvas-tool-btn"
        title="Zoom Out (-)"
      >
        <ZoomOut size={14} />
      </button>

      <span className="canvas-zoom-percentage">
        {Math.round(scale * 100)}%
      </span>

      <button
        onClick={onZoomIn}
        className="canvas-tool-btn"
        title="Zoom In (+)"
      >
        <ZoomIn size={14} />
      </button>
    </div>
  );
};

export default FloorCanvasToolbar;
