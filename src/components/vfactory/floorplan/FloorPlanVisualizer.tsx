import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  FloorMachineAsset,
  RoomZone,
  StructureAsset,
  ConveyorJunction,
  ToolMode,
} from '../../../types/floorPlan';
import {
  INITIAL_FLOOR_MACHINES,
  INITIAL_ROOM_ZONES,
  INITIAL_STRUCTURES,
  INITIAL_CONVEYOR_JUNCTIONS,
} from '../../../data/floorPlanData';
import { FloorCanvasToolbar } from './FloorCanvasToolbar';
import { FloorCanvas } from './FloorCanvas';
import { AssetDetailsInspector } from './AssetDetailsInspector';
import { FloorBottomBar } from './FloorBottomBar';
import { FloorPlanConfigStudio } from './FloorPlanConfigStudio';
import { Settings } from 'lucide-react';
import '../../../styles/floorplan.css';

interface FloorPlanVisualizerProps {
  onNavigateToMachine?: (machineId: string) => void;
}

const STORAGE_KEY = 'vector_vfactory_floorplan_v1';

export const FloorPlanVisualizer: React.FC<FloorPlanVisualizerProps> = ({
  onNavigateToMachine,
}) => {
  // Load saved layout from localStorage or fallback to initial
  const [machines, setMachines] = useState<FloorMachineAsset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.machines && Array.isArray(parsed.machines)) return parsed.machines;
      }
    } catch {}
    return INITIAL_FLOOR_MACHINES;
  });

  const [zones, setZones] = useState<RoomZone[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.zones && Array.isArray(parsed.zones)) return parsed.zones;
      }
    } catch {}
    return INITIAL_ROOM_ZONES;
  });

  const [structures, setStructures] = useState<StructureAsset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.structures && Array.isArray(parsed.structures)) return parsed.structures;
      }
    } catch {}
    return INITIAL_STRUCTURES;
  });

  const [junctions, setJunctions] = useState<ConveyorJunction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.junctions && Array.isArray(parsed.junctions)) return parsed.junctions;
      }
    } catch {}
    return INITIAL_CONVEYOR_JUNCTIONS;
  });

  // Dedicated Studio Page Mode
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);

  // Selected machine in Live View
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>('WB-05');
  const [activeTool, setActiveTool] = useState<ToolMode>('select');

  // Floor & Grid Controls
  const [floor, setFloor] = useState<number>(1);
  const [area, setArea] = useState<string>('Backend Assembly');
  const [gridVisible, setGridVisible] = useState<boolean>(true);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [gridSize, setGridSize] = useState<number>(20);

  // Transform (Pan & Zoom)
  const [transform, setTransform] = useState<{ x: number; y: number; scale: number }>({
    x: 10,
    y: 10,
    scale: 0.85,
  });

  // Calculate Fit to View
  const handleFitView = useCallback(() => {
    const canvasContainer = document.querySelector('.floor-canvas-container');
    if (!canvasContainer) return;

    const { clientWidth, clientHeight } = canvasContainer;
    if (clientWidth === 0 || clientHeight === 0) return;

    const floorWidth = 1160;
    const floorHeight = 900;
    const padding = 20;

    const scaleX = (clientWidth - padding) / floorWidth;
    const scaleY = (clientHeight - padding) / floorHeight;
    const fitScale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.4), 1.25);

    const fitX = (clientWidth - floorWidth * fitScale) / 2;
    const fitY = (clientHeight - floorHeight * fitScale) / 2;

    setTransform({
      x: fitX,
      y: fitY,
      scale: fitScale,
    });
  }, []);

  // Zoom In / Out / Reset
  const handleZoomIn = () => setTransform((prev) => ({ ...prev, scale: Math.min(prev.scale * 1.2, 2.5) }));
  const handleZoomOut = () => setTransform((prev) => ({ ...prev, scale: Math.max(prev.scale * 0.8, 0.35) }));
  const handleResetZoom = () => setTransform((prev) => ({ ...prev, scale: 1.0 }));

  // Initial fit on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFitView();
    }, 80);

    window.addEventListener('resize', handleFitView);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleFitView);
    };
  }, [handleFitView]);

  // Selected Machine details lookup
  const selectedAsset = useMemo(() => {
    return machines.find((m) => m.id === selectedAssetId) || null;
  }, [machines, selectedAssetId]);

  // Remove asset
  const handleRemoveAsset = (assetId: string) => {
    setMachines((prev) => prev.filter((m) => m.id !== assetId));
    if (selectedAssetId === assetId) {
      setSelectedAssetId(null);
    }
  };

  // Update asset properties
  const handleUpdateAsset = (updated: FloorMachineAsset) => {
    setMachines((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    );
  };

  // Minimap pan handler
  const handleMinimapPan = (targetX: number, targetY: number) => {
    const canvasContainer = document.querySelector('.floor-canvas-container');
    if (!canvasContainer) return;
    const { clientWidth, clientHeight } = canvasContainer;

    setTransform((prev) => ({
      ...prev,
      x: clientWidth / 2 - targetX * prev.scale,
      y: clientHeight / 2 - targetY * prev.scale,
    }));
  };

  // Save from Studio
  const handleSaveAndApplyFromStudio = (config: {
    machines: FloorMachineAsset[];
    zones: RoomZone[];
    structures: StructureAsset[];
    junctions: ConveyorJunction[];
  }) => {
    setMachines(config.machines);
    setZones(config.zones);
    setStructures(config.structures);
    setJunctions(config.junctions);
    setIsStudioOpen(false);

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save layout to localStorage', e);
    }
  };

  // If Studio Page is Open, render the Dedicated Configuration Studio Page
  if (isStudioOpen) {
    return (
      <FloorPlanConfigStudio
        initialMachines={machines}
        initialZones={zones}
        initialStructures={structures}
        initialJunctions={junctions}
        onSaveAndApply={handleSaveAndApplyFromStudio}
        onExit={() => setIsStudioOpen(false)}
      />
    );
  }

  // Otherwise, render the Main Clean v-Factory Monitoring View (Asset Library hidden for clean view)
  return (
    <div className="vfactory-floorplan-root live-view">
      {/* Main 2-Column Live Workspace (Canvas + Inspector) */}
      <div className="floorplan-workspace-grid live-mode">
        {/* Center Column: Interactive Blueprint Canvas */}
        <div className="floorplan-canvas-column">
          {/* Top Left Floating Canvas Toolbar */}
          <FloorCanvasToolbar
            activeTool={activeTool}
            onSelectTool={setActiveTool}
            onFitView={handleFitView}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetView={handleResetZoom}
            scale={transform.scale}
          />

          {/* Top Right Configure Layout Button -> Opens Studio Page */}
          <div className="canvas-top-right-overlay">
            <button
              onClick={() => setIsStudioOpen(true)}
              className="canvas-settings-btn"
              title="Open Floor Plan Configuration Studio (Initialize layout, drag & drop assets)"
            >
              <Settings size={14} />
              <span>Configure Layout</span>
            </button>
          </div>

          <FloorCanvas
            machines={machines}
            zones={zones}
            structures={structures}
            junctions={junctions}
            selectedAssetId={selectedAssetId}
            onSelectAsset={setSelectedAssetId}
            activeTool={activeTool}
            gridVisible={gridVisible}
            snapToGrid={snapToGrid}
            gridSize={gridSize}
            transform={transform}
            onTransformChange={setTransform}
            isConfigMode={false}
          />
        </div>

        {/* Right Column: Asset Details Inspector */}
        <AssetDetailsInspector
          selectedAsset={selectedAsset}
          onClose={() => setSelectedAssetId(null)}
          onNavigateToMachine={onNavigateToMachine}
          onRemoveAsset={handleRemoveAsset}
          onUpdateAsset={handleUpdateAsset}
        />
      </div>

      {/* Bottom Bar: Floor & Area Selectors, Minimap, Status Legend, Grid Controls */}
      <FloorBottomBar
        floor={floor}
        onFloorChange={setFloor}
        area={area}
        onAreaChange={setArea}
        snapToGrid={snapToGrid}
        onToggleSnapToGrid={() => setSnapToGrid(!snapToGrid)}
        gridVisible={gridVisible}
        onToggleGridVisible={() => setGridVisible(!gridVisible)}
        gridSize={gridSize}
        onGridSizeChange={setGridSize}
        machines={machines}
        zones={zones}
        canvasTransform={transform}
        onMinimapPan={handleMinimapPan}
      />
    </div>
  );
};

export default FloorPlanVisualizer;
