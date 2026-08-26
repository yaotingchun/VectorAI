import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  FloorMachineAsset,
  RoomZone,
  StructureAsset,
  ConveyorJunction,
  ToolMode,
  FloorAssetType,
  StructureType,
} from '../../../types/floorPlan';
import {
  INITIAL_FLOOR_MACHINES,
  INITIAL_ROOM_ZONES,
  INITIAL_STRUCTURES,
  INITIAL_CONVEYOR_JUNCTIONS,
} from '../../../data/floorPlanData';
import { AssetLibrarySidebar } from './AssetLibrarySidebar';
import { FloorCanvasToolbar } from './FloorCanvasToolbar';
import { FloorCanvas } from './FloorCanvas';
import { AssetDetailsInspector } from './AssetDetailsInspector';
import { FloorBottomBar } from './FloorBottomBar';
import '../../../styles/floorplan.css';

interface FloorPlanVisualizerProps {
  onNavigateToMachine?: (machineId: string) => void;
}

export const FloorPlanVisualizer: React.FC<FloorPlanVisualizerProps> = ({
  onNavigateToMachine,
}) => {
  // State
  const [machines, setMachines] = useState<FloorMachineAsset[]>(INITIAL_FLOOR_MACHINES);
  const [zones] = useState<RoomZone[]>(INITIAL_ROOM_ZONES);
  const [structures] = useState<StructureAsset[]>(INITIAL_STRUCTURES);
  const [junctions] = useState<ConveyorJunction[]>(INITIAL_CONVEYOR_JUNCTIONS);

  // Default selected machine to WB-05 to match the reference design image
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>('WB-05');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterType, setActiveFilterType] = useState<FloorAssetType | StructureType | null>(null);
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
  const handleZoomIn = () => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(prev.scale * 1.2, 2.5),
    }));
  };

  const handleZoomOut = () => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(prev.scale * 0.8, 0.35),
    }));
  };

  const handleResetZoom = () => {
    setTransform((prev) => ({
      ...prev,
      scale: 1.0,
    }));
  };

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

  return (
    <div className="vfactory-floorplan-root">
      {/* Top Floating Canvas Toolbar */}
      <FloorCanvasToolbar
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        onFitView={handleFitView}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetZoom}
        scale={transform.scale}
      />

      {/* Main 3-Column Workspace */}
      <div className="floorplan-workspace-grid">
        {/* Left Column: Asset Library */}
        <AssetLibrarySidebar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterByType={setActiveFilterType}
          activeFilterType={activeFilterType}
        />

        {/* Center Column: Interactive Blueprint Canvas */}
        <div className="floorplan-canvas-column">
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
            filterType={activeFilterType}
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
