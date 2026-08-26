import React from 'react';
import { ToolMode } from '../../../types/floorPlan';
import {
  MousePointer,
  Hand,
  Focus,
  Maximize2,
  Link2,
  Type,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

interface FloorCanvasToolbarProps {
  activeTool: ToolMode;
  onSelectTool: (tool: ToolMode) => void;
  onFitView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  scale?: number;
}

export const FloorCanvasToolbar: React.FC<FloorCanvasToolbarProps> = ({
  activeTool,
  onSelectTool,
  onFitView,
  onZoomIn,
  onZoomOut,
  onResetView,
  scale = 1,
}) => {
  return (
    <div className="floor-canvas-floating-toolbar" role="toolbar" aria-label="Floor Plan Canvas Tools">
      <button
        onClick={() => onSelectTool('select')}
        className={`canvas-tool-btn ${activeTool === 'select' ? 'active' : ''}`}
        title="Select & Move (V)"
      >
        <MousePointer size={16} />
      </button>

      <button
        onClick={() => onSelectTool('pan')}
        className={`canvas-tool-btn ${activeTool === 'pan' ? 'active' : ''}`}
        title="Pan Canvas (H / Spacebar)"
      >
        <Hand size={16} />
      </button>

      <div className="canvas-tool-divider" />

      <button
        onClick={onFitView}
        className="canvas-tool-btn"
        title="Fit Floor Plan to Screen (F)"
      >
        <Focus size={16} />
      </button>

      <button
        onClick={onResetView}
        className="canvas-tool-btn"
        title="Reset 100% Zoom (0)"
      >
        <Maximize2 size={16} />
      </button>

      <div className="canvas-tool-divider" />

      <button
        onClick={() => onSelectTool('link')}
        className={`canvas-tool-btn ${activeTool === 'link' ? 'active' : ''}`}
        title="Connect Nodes / Draw Line (L)"
      >
        <Link2 size={16} />
      </button>

      <button
        onClick={() => onSelectTool('text')}
        className={`canvas-tool-btn ${activeTool === 'text' ? 'active' : ''}`}
        title="Add Text / Area Annotation (T)"
      >
        <Type size={16} />
      </button>

      <div className="canvas-tool-divider" />

      <button
        onClick={onZoomOut}
        className="canvas-tool-btn"
        title="Zoom Out (-)"
      >
        <ZoomOut size={15} />
      </button>

      <span className="canvas-zoom-percentage">
        {Math.round(scale * 100)}%
      </span>

      <button
        onClick={onZoomIn}
        className="canvas-tool-btn"
        title="Zoom In (+)"
      >
        <ZoomIn size={15} />
      </button>
    </div>
  );
};
