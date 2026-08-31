import React from 'react';
import { ProductionFilterState, ProductCategory, ProductStatus } from '../types/production';
import { Search, Plus, Play, Pause, LayoutGrid, Table } from 'lucide-react';

interface ProductHeaderProps {
  filterState: ProductionFilterState;
  onFilterChange: (filters: Partial<ProductionFilterState>) => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  simulationSpeed: number;
  onSetSimulationSpeed: (speed: number) => void;
  onOpenNewOrderModal: () => void;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  filterState,
  onFilterChange,
  isSimulating,
  onToggleSimulation,
  simulationSpeed,
  onSetSimulationSpeed,
  onOpenNewOrderModal,
}) => {
  return (
    <div className="production-toolbar">
      <span className="corner-tl">+</span>
      <span className="corner-tr">+</span>
      <span className="corner-bl">+</span>
      <span className="corner-br">+</span>

      {/* Left: Search Box */}
      <div className="toolbar-search-box">
        <Search size={14} color="var(--text-muted)" />
        <input
          type="text"
          className="toolbar-search-input"
          placeholder="Filter products, SKU code, package type, wafer tech..."
          value={filterState.searchQuery}
          onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
        />
      </div>

      {/* Center: Filters & Sort */}
      <div className="toolbar-filters-group">
        {/* Category Filter */}
        <select
          className="tech-select"
          value={filterState.categoryFilter}
          onChange={(e) => onFilterChange({ categoryFilter: e.target.value as ProductCategory | 'ALL' })}
          aria-label="Filter by product category"
        >
          <option value="ALL">ALL CATEGORIES</option>
          <option value="AI_ACCELERATOR">AI & Tensor Compute</option>
          <option value="POWER_SEMICONDUCTOR">Automotive Power SiC</option>
          <option value="RF_COMMUNICATION">5G & Satellite RF</option>
          <option value="HIGH_BANDWIDTH_MEMORY">3D TSV Memory</option>
          <option value="INDUSTRIAL_MCU">Industrial Safety MCU</option>
          <option value="MEMS_SENSOR">Tactical MEMS Sensors</option>
        </select>

        {/* Status Filter */}
        <select
          className="tech-select"
          value={filterState.statusFilter}
          onChange={(e) => onFilterChange({ statusFilter: e.target.value as ProductStatus | 'ALL' })}
          aria-label="Filter by production status"
        >
          <option value="ALL">ALL STATUSES</option>
          <option value="ACTIVE_RUNNING">ACTIVE RUNNING</option>
          <option value="THROTTLED">THROTTLED / BOTTLENECK</option>
          <option value="CHANGEOVER">CHANGEOVER</option>
          <option value="MAINTENANCE_HOLD">MAINTENANCE HOLD</option>
        </select>

        {/* Sort By */}
        <select
          className="tech-select"
          value={filterState.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value as ProductionFilterState['sortBy'] })}
          aria-label="Sort products list"
        >
          <option value="goal_progress">SORT: GOAL PROGRESS</option>
          <option value="uph_speed">SORT: UPH THROUGHPUT</option>
          <option value="order_volume">SORT: ORDER VOLUME</option>
          <option value="urgency">SORT: DEADLINE URGENCY</option>
          <option value="name">SORT: PRODUCT NAME</option>
        </select>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', border: '1px solid var(--border-strong)', backgroundColor: 'var(--bg-surface)' }}>
          <button
            onClick={() => onFilterChange({ viewMode: 'grid' })}
            style={{
              padding: '6px 8px',
              border: 'none',
              background: filterState.viewMode === 'grid' ? 'var(--bg-dark)' : 'transparent',
              color: filterState.viewMode === 'grid' ? 'var(--text-inverted)' : 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Grid View"
          >
            <LayoutGrid size={13} />
          </button>
          <button
            onClick={() => onFilterChange({ viewMode: 'table' })}
            style={{
              padding: '6px 8px',
              border: 'none',
              background: filterState.viewMode === 'table' ? 'var(--bg-dark)' : 'transparent',
              color: filterState.viewMode === 'table' ? 'var(--text-inverted)' : 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Table View"
          >
            <Table size={13} />
          </button>
        </div>
      </div>

      {/* Right: Live Simulation Controls & "+ NEW ORDER" button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Simulation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--border-strong)', padding: '2px', backgroundColor: 'var(--bg-surface)' }}>
          <button
            onClick={onToggleSimulation}
            className={`sim-speed-btn ${isSimulating ? 'active' : ''}`}
            title={isSimulating ? 'Pause live production ticking' : 'Start live production ticking'}
          >
            {isSimulating ? <Pause size={11} /> : <Play size={11} />}
            <span style={{ marginLeft: '4px' }}>{isSimulating ? 'TICKING' : 'PAUSED'}</span>
          </button>

          {[1, 5, 10].map((spd) => (
            <button
              key={spd}
              onClick={() => onSetSimulationSpeed(spd)}
              className={`sim-speed-btn ${simulationSpeed === spd && isSimulating ? 'active' : ''}`}
              title={`Simulate at ${spd}x speed`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Primary CTA */}
        <button
          onClick={onOpenNewOrderModal}
          className="tech-btn primary"
          style={{ padding: '7px 14px', fontSize: '11px', letterSpacing: '0.06em', gap: '6px' }}
        >
          <Plus size={13} />
          <span>+ NEW PRODUCTION ORDER</span>
        </button>
      </div>
    </div>
  );
};
