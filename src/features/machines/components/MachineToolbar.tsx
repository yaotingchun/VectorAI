import React from 'react';
import { Search, LayoutGrid, List, X } from 'lucide-react';
import { MachineTypeId, MACHINE_TYPE_LIST } from '../data/machineTypes';

interface MachineToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: MachineTypeId | 'all';
  onTypeChange: (type: MachineTypeId | 'all') => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  totalFiltered: number;
  totalCount: number;
}

export const MachineToolbar: React.FC<MachineToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
  totalFiltered,
  totalCount
}) => {
  const statusOptions: { id: string; label: string; countColor?: string }[] = [
    { id: 'all', label: 'All Status' },
    { id: 'healthy', label: 'Healthy', countColor: 'var(--accent-green)' },
    { id: 'warning', label: 'Warning', countColor: 'var(--accent-amber)' },
    { id: 'critical', label: 'Critical', countColor: 'var(--accent-red)' },
    { id: 'offline', label: 'Offline', countColor: 'var(--text-muted)' },
    { id: 'maintenance', label: 'Maint', countColor: 'var(--accent-blue)' }
  ];

  const hasActiveFilters = searchQuery !== '' || selectedType !== 'all' || selectedStatus !== 'all';

  const clearAllFilters = () => {
    onSearchChange('');
    onTypeChange('all');
    onStatusChange('all');
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1.5px solid var(--border-strong)',
        padding: '10px 14px',
        marginBottom: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%'
      }}
    >
      {/* Upper Row: Search Bar, Type Dropdown, View Mode */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px'
        }}
      >
        {/* Search Bar (stretches dynamically) */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 280px',
            minWidth: '220px'
          }}
        >
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search equipment ID, model, stage, location (e.g. WB-024, Line A)..."
            style={{
              width: '100%',
              padding: '6px 10px 6px 30px',
              backgroundColor: 'var(--bg-card)',
              border: '1.5px solid var(--border-strong)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              outline: 'none',
              transition: 'border-color var(--transition-fast)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex'
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Machine Type Filter Dropdown & View Mode Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                letterSpacing: '0.04em'
              }}
            >
              TYPE:
            </span>
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value as MachineTypeId | 'all')}
              style={{
                padding: '5px 8px',
                backgroundColor: 'var(--bg-card)',
                border: '1.5px solid var(--border-strong)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="all">All 5 Types</option>
              {MACHINE_TYPE_LIST.map((typeDef) => (
                <option key={typeDef.id} value={typeDef.id}>
                  {typeDef.name} ({typeDef.codePrefix})
                </option>
              ))}
            </select>
          </div>

          {/* View Switcher (Grid / Table) */}
          <div
            style={{
              display: 'flex',
              border: '1.5px solid var(--border-strong)',
              backgroundColor: 'var(--bg-card)'
            }}
          >
            <button
              onClick={() => onViewModeChange('grid')}
              style={{
                padding: '5px 10px',
                backgroundColor: viewMode === 'grid' ? 'var(--bg-dark)' : 'transparent',
                color: viewMode === 'grid' ? 'var(--text-inverted)' : 'var(--text-primary)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700
              }}
              title="Grid View"
            >
              <LayoutGrid size={13} />
              <span>GRID</span>
            </button>

            <button
              onClick={() => onViewModeChange('table')}
              style={{
                padding: '5px 10px',
                backgroundColor: viewMode === 'table' ? 'var(--bg-dark)' : 'transparent',
                color: viewMode === 'table' ? 'var(--text-inverted)' : 'var(--text-primary)',
                border: 'none',
                borderLeft: '1px solid var(--border-strong)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700
              }}
              title="Table View"
            >
              <List size={13} />
              <span>LIST</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lower Row: Machine Stage Pills & Status Filter Pills */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          paddingTop: '8px',
          borderTop: '1px dashed var(--border-light)'
        }}
      >
        {/* Machine Stage Filter Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px' }}>
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              marginRight: '2px',
              fontWeight: 700
            }}
          >
            STAGE:
          </span>

          <button
            onClick={() => onTypeChange('all')}
            style={{
              padding: '2px 8px',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              cursor: 'pointer',
              border: '1px solid var(--border-strong)',
              backgroundColor: selectedType === 'all' ? 'var(--bg-dark)' : 'var(--bg-card)',
              color: selectedType === 'all' ? 'var(--text-inverted)' : 'var(--text-primary)'
            }}
          >
            ALL
          </button>

          {MACHINE_TYPE_LIST.map((t) => {
            const isSelected = selectedType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onTypeChange(t.id)}
                style={{
                  padding: '2px 8px',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid var(--border-strong)',
                  backgroundColor: isSelected ? 'var(--bg-dark)' : 'var(--bg-card)',
                  color: isSelected ? 'var(--text-inverted)' : 'var(--text-primary)'
                }}
              >
                {t.shortName}
              </button>
            );
          })}
        </div>

        {/* Status Filter Chips & Results Count */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px' }}>
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              marginRight: '2px',
              fontWeight: 700
            }}
          >
            STATUS:
          </span>

          {statusOptions.map((st) => {
            const isSelected = selectedStatus === st.id;
            return (
              <button
                key={st.id}
                onClick={() => onStatusChange(st.id)}
                style={{
                  padding: '2px 8px',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid var(--border-strong)',
                  backgroundColor: isSelected ? 'var(--bg-dark)' : 'var(--bg-card)',
                  color: isSelected ? 'var(--text-inverted)' : 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {st.countColor && (
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: st.countColor
                    }}
                  />
                )}
                {st.label}
              </button>
            );
          })}

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="tech-btn"
              style={{
                padding: '2px 6px',
                fontSize: '10px',
                marginLeft: '4px',
                color: 'var(--accent-red)',
                borderColor: 'var(--accent-red)'
              }}
            >
              RESET
            </button>
          )}

          <span
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              marginLeft: '6px',
              fontWeight: 700
            }}
          >
            [{totalFiltered} / {totalCount}]
          </span>
        </div>
      </div>
    </div>
  );
};
