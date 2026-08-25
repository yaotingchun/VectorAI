import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';

interface CanvasControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onResetView: () => void;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  scale,
  onZoomIn,
  onZoomOut,
  onFitView,
  onResetView,
}) => {
  return (
    <div
      className="factory-canvas-controls"
      style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: 'var(--bg-card)',
        border: '1.5px solid var(--border-strong)',
        borderRadius: '6px',
        padding: '5px',
        boxShadow: '3px 3px 0px rgba(18, 19, 21, 0.1)',
        zIndex: 40,
      }}
    >
      {/* Zoom Out */}
      <button
        onClick={onZoomOut}
        className="canvas-ctrl-btn"
        title="Zoom Out (-)"
        aria-label="Zoom Out"
      >
        <ZoomOut size={15} />
      </button>

      {/* Scale Percent Readout */}
      <button
        onClick={onResetView}
        className="canvas-ctrl-btn text-val"
        title="Reset Zoom to 100%"
        style={{ minWidth: '46px', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}
      >
        {Math.round(scale * 100)}%
      </button>

      {/* Zoom In */}
      <button
        onClick={onZoomIn}
        className="canvas-ctrl-btn"
        title="Zoom In (+)"
        aria-label="Zoom In"
      >
        <ZoomIn size={15} />
      </button>

      <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-light)', margin: '0 2px' }} />

      {/* Fit to View */}
      <button
        onClick={onFitView}
        className="canvas-ctrl-btn"
        title="Fit All Machines to View"
        aria-label="Fit View"
      >
        <Maximize2 size={15} />
      </button>

      {/* Reset Position */}
      <button
        onClick={onResetView}
        className="canvas-ctrl-btn"
        title="Reset Position"
        aria-label="Reset View"
      >
        <RotateCcw size={15} />
      </button>
    </div>
  );
};
