import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { INITIAL_MACHINES } from '../../data/factoryMachines';
import { MachineData } from '../../types/factory';
import { FactoryCanvas } from './canvas/FactoryCanvas';
import { MachineDrawer } from './inspector/MachineDrawer';
import { CanvasControls } from './controls/CanvasControls';
import {
  Activity,
  Sparkles,
} from 'lucide-react';

export const VFactoryLiveView: React.FC = () => {
  const [machines] = useState<MachineData[]>(INITIAL_MACHINES);
  const [selectedMachine, setSelectedMachine] = useState<MachineData | null>(null);
  
  // Transform state for pan and zoom
  const [transform, setTransform] = useState<{ x: number; y: number; scale: number }>({
    x: 0,
    y: 0,
    scale: 0.6,
  });

  // Dynamic Fit & Center calculation
  const handleFitView = useCallback(() => {
    const container = document.getElementById('vfactory-canvas-container');
    if (!container) return;

    const { clientWidth, clientHeight } = container;
    if (clientWidth === 0 || clientHeight === 0) return;

    const contentWidth = 2160;
    const contentHeight = 595;

    // Leave a clean margin around the stage
    const paddingX = 40;
    const paddingY = 40;

    const scaleX = (clientWidth - paddingX) / contentWidth;
    const scaleY = (clientHeight - paddingY) / contentHeight;
    const fitScale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.35), 1.2);

    const fitX = (clientWidth - contentWidth * fitScale) / 2;
    const fitY = (clientHeight - contentHeight * fitScale) / 2;

    setTransform({
      x: fitX,
      y: fitY,
      scale: fitScale,
    });
  }, []);

  // Center automatically on initial mount and on window resize
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFitView();
    }, 60);

    const handleResize = () => {
      handleFitView();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleFitView]);

  // Calculate live statistics
  const stats = useMemo(() => {
    const total = machines.length;
    const running = machines.filter((m) => m.status === 'running').length;
    const warning = machines.filter((m) => m.status === 'warning').length;
    const idle = machines.filter((m) => m.status === 'idle').length;
    const error = machines.filter((m) => m.status === 'error').length;
    const avgOee = (
      machines.reduce((acc, curr) => acc + curr.telemetry.oee, 0) / total
    ).toFixed(1);

    return { total, running, warning, idle, error, avgOee };
  }, [machines]);

  // Zoom helpers
  const handleZoomIn = useCallback(() => {
    setTransform((prev) => {
      const container = document.getElementById('vfactory-canvas-container');
      if (!container) return prev;

      const { clientWidth, clientHeight } = container;
      const newScale = Math.min(prev.scale * 1.2, 2.2);
      const newX = clientWidth / 2 - (clientWidth / 2 - prev.x) * (newScale / prev.scale);
      const newY = clientHeight / 2 - (clientHeight / 2 - prev.y) * (newScale / prev.scale);

      return { x: newX, y: newY, scale: newScale };
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setTransform((prev) => {
      const container = document.getElementById('vfactory-canvas-container');
      if (!container) return prev;

      const { clientWidth, clientHeight } = container;
      const newScale = Math.max(prev.scale * 0.8, 0.3);
      const newX = clientWidth / 2 - (clientWidth / 2 - prev.x) * (newScale / prev.scale);
      const newY = clientHeight / 2 - (clientHeight / 2 - prev.y) * (newScale / prev.scale);

      return { x: newX, y: newY, scale: newScale };
    });
  }, []);

  const handleResetView = useCallback(() => {
    handleFitView();
  }, [handleFitView]);

  // Focus directly on a machine
  const handleFocusMachine = useCallback((machine: MachineData) => {
    const container = document.getElementById('vfactory-canvas-container');
    if (!container) return;

    const { clientWidth, clientHeight } = container;
    const targetScale = 1.1;
    
    // Position target machine at center
    const targetX = clientWidth / 2 - (machine.x + machine.width / 2) * targetScale - 80;
    const targetY = clientHeight / 2 - (machine.y + machine.height / 2) * targetScale;

    setTransform({
      x: targetX,
      y: targetY,
      scale: targetScale,
    });
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-main)',
      }}
    >
      {/* Top Telemetry Toolbar (Vector.AI Signature Industrial Header) */}
      <div
        className="vfactory-top-bar"
        style={{
          height: '52px',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1.5px solid var(--border-strong)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          flexShrink: 0,
          zIndex: 25,
        }}
      >
        {/* Left Side: Title & Status Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                backgroundColor: 'var(--bg-dark)',
                color: 'var(--text-inverted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                padding: '3px 8px',
                borderRadius: '2px',
              }}
            >
              FAB-04
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '13px',
                letterSpacing: '0.04em',
                color: 'var(--text-primary)',
              }}
            >
              SEMICONDUCTOR BACKEND FACILITY ({stats.total} NODES)
            </span>
          </div>

          <div style={{ width: '1.5px', height: '18px', backgroundColor: 'var(--border-light)' }} />

          {/* Machine Status Summary Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Running */}
            <div
              className="status-summary-pill"
              title="Operational Machines"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                backgroundColor: 'var(--bg-card)',
                border: '1.5px solid var(--border-strong)',
                boxShadow: '1.5px 1.5px 0px var(--border-strong)',
                borderRadius: '3px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
                fontWeight: 800,
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--accent-green)', border: '1px solid var(--border-strong)' }} />
              <span>{stats.running} RUNNING</span>
            </div>

            {/* Warning */}
            {stats.warning > 0 && (
              <div
                className="status-summary-pill"
                title="Machines with Alerts"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  backgroundColor: '#FEF2F2',
                  border: '1.5px solid var(--accent-red)',
                  boxShadow: '1.5px 1.5px 0px var(--accent-red)',
                  borderRadius: '3px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-red)',
                  fontWeight: 800,
                }}
              >
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--accent-red)' }} />
                <span>{stats.warning} ALERT</span>
              </div>
            )}

            {/* Line OEE Average */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                backgroundColor: 'var(--bg-card)',
                border: '1.5px solid var(--border-strong)',
                boxShadow: '1.5px 1.5px 0px var(--border-strong)',
                borderRadius: '3px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
              }}
            >
              <Activity size={12} color="var(--text-primary)" />
              <span style={{ color: 'var(--text-muted)' }}>FAB OEE:</span>
              <span style={{ color: 'var(--text-primary)' }}>{stats.avgOee}%</span>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleFitView}
            className="zone-btn active"
            title="Fit all machines cleanly into view"
            style={{
              padding: '5px 12px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              border: '1.5px solid var(--border-strong)',
              boxShadow: '2px 2px 0px var(--border-strong)',
              borderRadius: '3px',
            }}
          >
            FIT VIEW
          </button>
          <button
            onClick={handleResetView}
            className="zone-btn"
            title="Reset Zoom to Centered Fit"
            style={{
              padding: '5px 12px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              border: '1.5px solid var(--border-strong)',
              boxShadow: '2px 2px 0px var(--border-strong)',
              borderRadius: '3px',
            }}
          >
            RESET
          </button>
        </div>
      </div>

      {/* Main 2D Canvas Viewport */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <FactoryCanvas
          machines={machines}
          selectedMachine={selectedMachine}
          onSelectMachine={setSelectedMachine}
          transform={transform}
          onTransformChange={setTransform}
        />

        {/* Floating Canvas Controls */}
        <CanvasControls
          scale={transform.scale}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitView={handleFitView}
          onResetView={handleResetView}
        />

        {/* Bottom Left Status Legend */}
        <div
          className="canvas-legend-box"
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            backgroundColor: 'var(--bg-card)',
            border: '1.5px solid var(--border-strong)',
            borderRadius: '3px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            boxShadow: '2.5px 2.5px 0px var(--border-strong)',
            zIndex: 30,
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800 }}>
            <Sparkles size={11} color="var(--accent-amber)" />
            <span>STATUS:</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--accent-green)', border: '1px solid var(--border-strong)' }} />
            <span>Running</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--accent-red)', border: '1px solid var(--border-strong)' }} />
            <span>Warning / Alert</span>
          </div>
        </div>
      </div>

      {/* Slide-out Machine Inspector Drawer */}
      <MachineDrawer
        machine={selectedMachine}
        onClose={() => setSelectedMachine(null)}
        onFocusMachine={handleFocusMachine}
      />
    </div>
  );
};
export default VFactoryLiveView;
