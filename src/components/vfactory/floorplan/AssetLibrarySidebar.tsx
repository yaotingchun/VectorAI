import React, { useState } from 'react';
import { ASSET_LIBRARY_ITEMS } from '../../../data/floorPlanData';
import { AssetLibraryItem, FloorAssetType, StructureType } from '../../../types/floorPlan';
import { FloorIcon } from './FloorIcons';
import { Search, ChevronDown, ChevronRight, X, Layers, Box } from 'lucide-react';

interface AssetLibrarySidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectLibraryItem?: (item: AssetLibraryItem) => void;
  onFilterByType?: (type: FloorAssetType | StructureType | null) => void;
  activeFilterType?: FloorAssetType | StructureType | null;
  isConfigMode?: boolean;
}

export const AssetLibrarySidebar: React.FC<AssetLibrarySidebarProps> = ({
  searchQuery,
  onSearchChange,
  onSelectLibraryItem,
  onFilterByType,
  activeFilterType,
  isConfigMode = false,
}) => {
  const [equipmentExpanded, setEquipmentExpanded] = useState(true);
  const [structuresExpanded, setStructuresExpanded] = useState(true);

  const equipmentItems = ASSET_LIBRARY_ITEMS.filter((item) => item.category === 'equipment');
  const structureItems = ASSET_LIBRARY_ITEMS.filter((item) => item.category === 'structures');

  const filteredEquipment = equipmentItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStructures = structureItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemClick = (item: AssetLibraryItem) => {
    if (activeFilterType === item.type) {
      onFilterByType?.(null);
    } else {
      onFilterByType?.(item.type);
    }
    onSelectLibraryItem?.(item);
  };

  return (
    <aside className="asset-library-sidebar" aria-label="Asset Library">
      {/* Sidebar Header */}
      <div className="asset-lib-header">
        <div className="asset-lib-title-row">
          <span className="asset-lib-title">ASSET LIBRARY</span>
          <span className="asset-lib-count-badge">
            {filteredEquipment.length + filteredStructures.length}
          </span>
        </div>

        {isConfigMode && (
          <div className="asset-lib-config-cue">
            <span>⚡ Drag items to place on canvas</span>
          </div>
        )}

        {/* Search Box */}
        <div className="asset-search-box">
          <Search size={14} className="asset-search-icon" />
          <input
            type="text"
            placeholder="Search asset..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="asset-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="asset-search-clear"
              title="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Asset Categories Container */}
      <div className="asset-lib-content">
        {/* 1. EQUIPMENT ACCORDION */}
        <div className="asset-group">
          <button
            onClick={() => setEquipmentExpanded(!equipmentExpanded)}
            className="asset-group-header-btn"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Box size={13} style={{ color: 'var(--text-muted)' }} />
              <span className="asset-group-title">EQUIPMENT</span>
              <span className="asset-group-pill">{filteredEquipment.length}</span>
            </div>
            {equipmentExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {equipmentExpanded && (
            <div className="asset-group-list">
              {filteredEquipment.map((item) => {
                const isActive = activeFilterType === item.type;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`asset-card-item ${isActive ? 'active' : ''} ${isConfigMode ? 'draggable' : ''}`}
                    title={isConfigMode ? `Drag to place ${item.name} on canvas` : `${item.name} (${item.code})\n${item.description}`}
                    draggable={isConfigMode}
                    onDragStart={(e) => {
                      if (isConfigMode) {
                        e.dataTransfer.setData('application/json', JSON.stringify(item));
                        e.dataTransfer.setData('text/plain', JSON.stringify(item));
                        e.dataTransfer.effectAllowed = 'copy';
                      }
                    }}
                  >
                    <div className="asset-icon-box">
                      <FloorIcon type={item.type} size={28} />
                    </div>

                    <div className="asset-card-text">
                      <div className="asset-card-name">{item.name}</div>
                      <div className="asset-card-code">{item.code}</div>
                    </div>
                  </div>
                );
              })}

              {filteredEquipment.length === 0 && (
                <div className="asset-empty-filter">No equipment found</div>
              )}
            </div>
          )}
        </div>

        {/* 2. STRUCTURES ACCORDION */}
        <div className="asset-group">
          <button
            onClick={() => setStructuresExpanded(!structuresExpanded)}
            className="asset-group-header-btn"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={13} style={{ color: 'var(--text-muted)' }} />
              <span className="asset-group-title">STRUCTURES</span>
              <span className="asset-group-pill">{filteredStructures.length}</span>
            </div>
            {structuresExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {structuresExpanded && (
            <div className="asset-group-list">
              {filteredStructures.map((item) => {
                const isActive = activeFilterType === item.type;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`asset-card-item ${isActive ? 'active' : ''} ${isConfigMode ? 'draggable' : ''}`}
                    title={isConfigMode ? `Drag to place ${item.name} on canvas` : `${item.name} (${item.code})\n${item.description}`}
                    draggable={isConfigMode}
                    onDragStart={(e) => {
                      if (isConfigMode) {
                        e.dataTransfer.setData('application/json', JSON.stringify(item));
                        e.dataTransfer.setData('text/plain', JSON.stringify(item));
                        e.dataTransfer.effectAllowed = 'copy';
                      }
                    }}
                  >
                    <div className="asset-icon-box">
                      <FloorIcon type={item.type} size={28} />
                    </div>

                    <div className="asset-card-text">
                      <div className="asset-card-name">{item.name}</div>
                      <div className="asset-card-code">{item.code}</div>
                    </div>
                  </div>
                );
              })}

              {filteredStructures.length === 0 && (
                <div className="asset-empty-filter">No structures found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
