import React, { useState, useMemo, useCallback } from 'react';
import {
  FloorMachineAsset,
  RoomZone,
  StructureAsset,
  ConveyorJunction,
  ToolMode,
  FloorAssetType,
  StructureType,
  AssetLibraryItem,
  LayoutPresetId,
} from '../../../types/floorPlan';
import { LAYOUT_PRESETS } from '../../../data/floorPlanData';
import { AssetLibrarySidebar } from './AssetLibrarySidebar';
import { FloorCanvasToolbar } from './FloorCanvasToolbar';
import { FloorCanvas } from './FloorCanvas';
import { FloorIcon } from './FloorIcons';
import {
  ArrowLeft,
  Check,
  RotateCcw,
  Download,
  Upload,
  Layers,
  Settings2,
  Trash2,
  Copy,
  Sliders,
  Sparkles,
  FileCode,
  Box,
} from 'lucide-react';
import '../../../styles/floorplan.css';

interface FloorPlanConfigStudioProps {
  initialMachines: FloorMachineAsset[];
  initialZones: RoomZone[];
  initialStructures: StructureAsset[];
  initialJunctions: ConveyorJunction[];
  onSaveAndApply: (config: {
    machines: FloorMachineAsset[];
    zones: RoomZone[];
    structures: StructureAsset[];
    junctions: ConveyorJunction[];
  }) => void;
  onExit: () => void;
}

type StudioTab = 'asset-props' | 'floor-init' | 'json-config';

export const FloorPlanConfigStudio: React.FC<FloorPlanConfigStudioProps> = ({
  initialMachines,
  initialZones,
  initialStructures,
  initialJunctions,
  onSaveAndApply,
  onExit,
}) => {
  // Working Floor Plan State in Studio
  const [machines, setMachines] = useState<FloorMachineAsset[]>(initialMachines);
  const [zones, setZones] = useState<RoomZone[]>(initialZones);
  const [structures, setStructures] = useState<StructureAsset[]>(initialStructures);
  const [junctions, setJunctions] = useState<ConveyorJunction[]>(initialJunctions);

  // Active studio state
  const [activeTab, setActiveTab] = useState<StudioTab>('floor-init');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<LayoutPresetId>('standard');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterType, setActiveFilterType] = useState<FloorAssetType | StructureType | null>(null);
  const [activeTool, setActiveTool] = useState<ToolMode>('select');

  // Grid & Canvas Transform
  const [gridVisible, setGridVisible] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [transform, setTransform] = useState<{ x: number; y: number; scale: number }>({
    x: 20,
    y: 20,
    scale: 0.8,
  });

  // JSON import/export feedback
  const [jsonInput, setJsonInput] = useState('');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 3000);
  };

  // Selected asset lookup
  const selectedAsset = useMemo(() => {
    return machines.find((m) => m.id === selectedAssetId) || null;
  }, [machines, selectedAssetId]);

  // Fit View
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
    const fitScale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.4), 1.2);

    setTransform({
      x: (clientWidth - floorWidth * fitScale) / 2,
      y: (clientHeight - floorHeight * fitScale) / 2,
      scale: fitScale,
    });
  }, []);

  // Zoom helpers
  const handleZoomIn = () => setTransform((p) => ({ ...p, scale: Math.min(p.scale * 1.2, 2.5) }));
  const handleZoomOut = () => setTransform((p) => ({ ...p, scale: Math.max(p.scale * 0.8, 0.35) }));
  const handleResetZoom = () => setTransform((p) => ({ ...p, scale: 1.0 }));

  // Move Machine Handler
  const handleMoveMachine = (id: string, x: number, y: number) => {
    setMachines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, x, y } : m))
    );
  };

  // Add Machine from Library Drop
  const handleAddMachine = (item: AssetLibraryItem, x: number, y: number) => {
    const count = machines.filter((m) => m.type === item.type).length + 1;
    const newId = `${item.code}-${String(count).padStart(2, '0')}`;
    const newMachine: FloorMachineAsset = {
      id: newId,
      code: item.code,
      name: `${item.name} ${newId}`,
      type: item.type as FloorAssetType,
      area: 'Backend Assembly',
      x,
      y,
      width: 44,
      height: 48,
      footprint: item.defaultFootprint,
      power: item.defaultPower,
      utility: item.defaultUtility,
      status: 'healthy',
      oee: 95.0,
      telemetry: {
        temperature: 42.0,
        vibration: 1.0,
        healthScore: 95,
        powerConsumptionKw: 3.5,
        rulHours: 1500,
      },
      connections: {
        input: 'Staging Area',
        output: 'Process Queue',
        conveyor: 'CV-01',
        agvAccess: true,
      },
    };

    setMachines((prev) => [...prev, newMachine]);
    setSelectedAssetId(newId);
    setActiveTab('asset-props');
    showNotice(`Added ${newMachine.id} to floor plan`);
  };

  // Asset selection
  const handleSelectAsset = (assetId: string | null) => {
    setSelectedAssetId(assetId);
    if (assetId) {
      setActiveTab('asset-props');
    }
  };

  // Duplicate Selected Asset
  const handleDuplicateSelected = () => {
    if (!selectedAsset) return;
    const count = machines.filter((m) => m.type === selectedAsset.type).length + 1;
    const newId = `${selectedAsset.code}-${String(count).padStart(2, '0')}`;
    const newMachine: FloorMachineAsset = {
      ...selectedAsset,
      id: newId,
      name: `${selectedAsset.name.replace(selectedAsset.id, '')} ${newId}`,
      x: selectedAsset.x + 30,
      y: selectedAsset.y + 30,
    };
    setMachines((prev) => [...prev, newMachine]);
    setSelectedAssetId(newId);
    showNotice(`Duplicated as ${newId}`);
  };

  // Delete Selected Asset
  const handleDeleteSelected = () => {
    if (!selectedAssetId) return;
    setMachines((prev) => prev.filter((m) => m.id !== selectedAssetId));
    setSelectedAssetId(null);
    showNotice(`Removed asset from floor plan`);
  };

  // Update Asset Field
  const handleUpdateField = (field: keyof FloorMachineAsset, value: any) => {
    if (!selectedAssetId) return;
    setMachines((prev) =>
      prev.map((m) => (m.id === selectedAssetId ? { ...m, [field]: value } : m))
    );
  };

  // Initialize from Preset
  const handleApplyPreset = (presetId: LayoutPresetId) => {
    const preset = LAYOUT_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setSelectedPresetId(presetId);
    setMachines(preset.machines);
    setZones(preset.zones);
    setStructures(preset.structures);
    setJunctions(preset.junctions);
    setSelectedAssetId(null);
    showNotice(`Initialized layout from ${preset.name}`);
  };

  // Clear all assets (Blank)
  const handleClearAllAssets = () => {
    setMachines([]);
    setSelectedAssetId(null);
    showNotice('Cleared all equipment from floor plan');
  };

  // Export JSON
  const handleExportJSON = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      machines,
      zones,
      structures,
      junctions,
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vector_factory_floorplan_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotice('Exported layout JSON file');
  };

  // Import JSON
  const handleImportJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (parsed.machines && Array.isArray(parsed.machines)) {
        setMachines(parsed.machines);
      }
      if (parsed.zones && Array.isArray(parsed.zones)) {
        setZones(parsed.zones);
      }
      if (parsed.structures && Array.isArray(parsed.structures)) {
        setStructures(parsed.structures);
      }
      if (parsed.junctions && Array.isArray(parsed.junctions)) {
        setJunctions(parsed.junctions);
      }
      showNotice('Successfully loaded custom JSON floor plan');
      setJsonInput('');
    } catch (err) {
      alert('Invalid JSON floor plan configuration format.');
    }
  };

  // Save and Apply to Live Factory
  const handleSave = () => {
    onSaveAndApply({
      machines,
      zones,
      structures,
      junctions,
    });
  };

  return (
    <div className="floorplan-studio-root">
      {/* Floating Fading Pop-Out Notification Toast */}
      {statusNotice && (
        <div className="studio-toast-popup" key={statusNotice}>
          <div className="toast-icon-box">
            <Sparkles size={14} />
          </div>
          <div className="toast-content">
            <span className="toast-title">// SYSTEM UPDATE</span>
            <span className="toast-message">{statusNotice}</span>
          </div>
        </div>
      )}

      {/* 1. TOP STUDIO HEADER BAR */}
      <header className="studio-top-header">
        <div className="studio-header-left">
          <button onClick={onExit} className="studio-back-btn" title="Back to Live Twin without saving">
            <ArrowLeft size={14} />
            <span>EXIT STUDIO</span>
          </button>

          <div className="studio-title-badge">
            <Settings2 size={14} className="studio-icon" />
            <span className="studio-title">V-FACTORY // FLOOR PLAN STUDIO</span>
            <span className="studio-subtitle">[ CONFIG MODE ]</span>
          </div>
        </div>

        <div className="studio-header-right">
          {/* Quick Preset Selector */}
          <div className="studio-preset-quick-select">
            <span className="studio-preset-label">TEMPLATE:</span>
            <select
              value={selectedPresetId}
              onChange={(e) => handleApplyPreset(e.target.value as LayoutPresetId)}
              className="studio-preset-dropdown"
            >
              {LAYOUT_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.machineCount} assets)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSave}
            className="studio-save-btn"
            title="Apply this floor plan layout to the live digital twin"
          >
            <Check size={14} />
            <span>APPLY TO LIVE TWIN</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN 3-COLUMN STUDIO WORKSPACE */}
      <div className="studio-workspace-grid">
        {/* Left Column: Asset Library */}
        <AssetLibrarySidebar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterByType={setActiveFilterType}
          activeFilterType={activeFilterType}
          isConfigMode={true}
        />

        {/* Center Column: Interactive Canvas */}
        <div className="studio-canvas-column">
          {/* Top Canvas Floating Tools */}
          <FloorCanvasToolbar
            activeTool={activeTool}
            onSelectTool={setActiveTool}
            onFitView={handleFitView}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetView={handleResetZoom}
            scale={transform.scale}
          />

          <FloorCanvas
            machines={machines}
            zones={zones}
            structures={structures}
            junctions={junctions}
            selectedAssetId={selectedAssetId}
            onSelectAsset={handleSelectAsset}
            activeTool={activeTool}
            gridVisible={gridVisible}
            snapToGrid={snapToGrid}
            gridSize={gridSize}
            transform={transform}
            onTransformChange={setTransform}
            filterType={activeFilterType}
            isConfigMode={true}
            onMoveMachine={handleMoveMachine}
            onAddMachine={handleAddMachine}
          />

          {/* Canvas Bottom Mini-Controls */}
          <div className="studio-canvas-footer-bar">
            <div className="studio-stat-item">
              <span className="stat-label">EQUIPMENTS:</span>
              <span className="stat-value">{machines.length}</span>
            </div>
            <div className="studio-stat-divider" />
            <div className="studio-stat-item">
              <span className="stat-label">ZONES:</span>
              <span className="stat-value">{zones.length}</span>
            </div>
            <div className="studio-stat-divider" />
            <div className="studio-grid-toggle-cluster">
              <label className="studio-checkbox-label">
                <input
                  type="checkbox"
                  checked={gridVisible}
                  onChange={(e) => setGridVisible(e.target.checked)}
                />
                <span>GRID</span>
              </label>
              <label className="studio-checkbox-label">
                <input
                  type="checkbox"
                  checked={snapToGrid}
                  onChange={(e) => setSnapToGrid(e.target.checked)}
                />
                <span>SNAP ({gridSize}px)</span>
              </label>
              <select
                value={gridSize}
                onChange={(e) => setGridSize(Number(e.target.value))}
                className="studio-grid-size-select"
              >
                <option value={10}>10 px</option>
                <option value={20}>20 px</option>
                <option value={40}>40 px</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Studio Configuration Inspector */}
        <aside className="studio-inspector-panel">
          {/* Tab Headers */}
          <div className="studio-tabs-header">
            <button
              onClick={() => setActiveTab('floor-init')}
              className={`studio-tab-btn ${activeTab === 'floor-init' ? 'active' : ''}`}
            >
              <Layers size={13} />
              <span>// 01 TEMPLATES</span>
            </button>
            <button
              onClick={() => setActiveTab('asset-props')}
              className={`studio-tab-btn ${activeTab === 'asset-props' ? 'active' : ''}`}
            >
              <Box size={13} />
              <span>// 02 ASSETS</span>
            </button>
            <button
              onClick={() => setActiveTab('json-config')}
              className={`studio-tab-btn ${activeTab === 'json-config' ? 'active' : ''}`}
            >
              <FileCode size={13} />
              <span>// 03 DATA</span>
            </button>
          </div>

          {/* TAB 1: FLOOR PLAN INITIALIZATION & TEMPLATES */}
          {activeTab === 'floor-init' && (
            <div className="studio-tab-content">
              <div className="studio-section-title">
                <span>// LAYOUT INITIALIZATION TEMPLATES</span>
              </div>
              <p className="studio-section-desc">
                Select a layout preset to instantly re-initialize cleanroom perimeter, zones, conveyors, and machinery:
              </p>

              <div className="studio-preset-cards-list">
                {LAYOUT_PRESETS.map((preset) => {
                  const isCurrent = selectedPresetId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      className={`studio-preset-card ${isCurrent ? 'active' : ''}`}
                      onClick={() => handleApplyPreset(preset.id)}
                    >
                      <div className="studio-preset-top">
                        <span className="studio-preset-name">{preset.name}</span>
                        <span className="studio-preset-category">{preset.category}</span>
                      </div>
                      <p className="studio-preset-desc">{preset.description}</p>
                      <div className="studio-preset-metrics">
                        <span>📦 {preset.machineCount} Equipments</span>
                        <span>🏢 {preset.zoneCount} Zones</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="studio-section-title" style={{ marginTop: '16px' }}>
                <span>CANVAS ACTIONS</span>
              </div>
              <div className="studio-actions-grid">
                <button onClick={handleClearAllAssets} className="studio-secondary-btn danger">
                  <Trash2 size={13} />
                  <span>Clear All Equipment</span>
                </button>
                <button
                  onClick={() => handleApplyPreset('standard')}
                  className="studio-secondary-btn"
                >
                  <RotateCcw size={13} />
                  <span>Reset to Factory Default</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SELECTED ASSET PROPERTIES */}
          {activeTab === 'asset-props' && (
            <div className="studio-tab-content">
              {selectedAsset ? (
                <div className="studio-asset-edit-form">
                  <div className="studio-asset-preview-header">
                    <div className="studio-asset-icon-box">
                      <FloorIcon type={selectedAsset.type} size={36} />
                    </div>
                    <div className="studio-asset-header-text">
                      <div className="studio-asset-code-badge">{selectedAsset.code}</div>
                      <div className="studio-asset-id-title">{selectedAsset.id}</div>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="studio-form-group">
                    <label className="studio-form-label">Asset Identifier (ID)</label>
                    <input
                      type="text"
                      value={selectedAsset.id}
                      onChange={(e) => handleUpdateField('id', e.target.value)}
                      className="studio-form-input"
                    />
                  </div>

                  <div className="studio-form-group">
                    <label className="studio-form-label">Display Name</label>
                    <input
                      type="text"
                      value={selectedAsset.name}
                      onChange={(e) => handleUpdateField('name', e.target.value)}
                      className="studio-form-input"
                    />
                  </div>

                  <div className="studio-form-group">
                    <label className="studio-form-label">Assigned Room Zone</label>
                    <select
                      value={selectedAsset.area}
                      onChange={(e) => handleUpdateField('area', e.target.value)}
                      className="studio-form-select"
                    >
                      {zones.map((z) => (
                        <option key={z.id} value={z.name}>
                          {z.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="studio-form-row">
                    <div className="studio-form-group flex-1">
                      <label className="studio-form-label">X Position</label>
                      <input
                        type="number"
                        value={Math.round(selectedAsset.x)}
                        onChange={(e) => handleUpdateField('x', Number(e.target.value))}
                        className="studio-form-input"
                      />
                    </div>
                    <div className="studio-form-group flex-1">
                      <label className="studio-form-label">Y Position</label>
                      <input
                        type="number"
                        value={Math.round(selectedAsset.y)}
                        onChange={(e) => handleUpdateField('y', Number(e.target.value))}
                        className="studio-form-input"
                      />
                    </div>
                  </div>

                  <div className="studio-form-group">
                    <label className="studio-form-label">Footprint Dimensions</label>
                    <input
                      type="text"
                      value={selectedAsset.footprint}
                      onChange={(e) => handleUpdateField('footprint', e.target.value)}
                      className="studio-form-input"
                    />
                  </div>

                  <div className="studio-form-group">
                    <label className="studio-form-label">Power Consumption Spec</label>
                    <input
                      type="text"
                      value={selectedAsset.power}
                      onChange={(e) => handleUpdateField('power', e.target.value)}
                      className="studio-form-input"
                    />
                  </div>

                  <div className="studio-form-group">
                    <label className="studio-form-label">Utility Requirements</label>
                    <input
                      type="text"
                      value={selectedAsset.utility}
                      onChange={(e) => handleUpdateField('utility', e.target.value)}
                      className="studio-form-input"
                    />
                  </div>

                  <div className="studio-asset-action-buttons">
                    <button onClick={handleDuplicateSelected} className="studio-action-btn secondary">
                      <Copy size={13} />
                      <span>Duplicate</span>
                    </button>
                    <button onClick={handleDeleteSelected} className="studio-action-btn danger">
                      <Trash2 size={13} />
                      <span>Delete Asset</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="studio-empty-select">
                  <Sliders size={28} className="empty-icon" />
                  <span className="empty-title">No Asset Selected</span>
                  <span className="empty-desc">
                    Click any equipment on the blueprint canvas or drag a new one from the Asset Library to edit its configuration.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: JSON BACKUP & CONFIGURATION SHARING */}
          {activeTab === 'json-config' && (
            <div className="studio-tab-content">
              <div className="studio-section-title">
                <span>EXPORT / IMPORT LAYOUT JSON</span>
              </div>
              <p className="studio-section-desc">
                Export your configured factory floor plan to a JSON backup file or import a saved blueprint:
              </p>

              <button onClick={handleExportJSON} className="studio-action-btn primary full-width">
                <Download size={14} />
                <span>Export Layout Configuration (JSON)</span>
              </button>

              <div className="studio-divider-text">OR PASTE CUSTOM JSON</div>

              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste floor plan layout JSON here..."
                rows={8}
                className="studio-json-textarea"
              />

              <button
                onClick={handleImportJSON}
                disabled={!jsonInput.trim()}
                className="studio-action-btn secondary full-width"
              >
                <Upload size={14} />
                <span>Load & Apply Pasted JSON</span>
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
