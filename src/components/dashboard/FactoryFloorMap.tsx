import React, { useState } from 'react';
import { MachineNode, MachineStatus } from '../../types/dashboard';
import { MachineIcon } from './MachineIcon';
import {
  Factory,
  Search,
} from 'lucide-react';

interface FactoryFloorMapProps {
  machines: MachineNode[];
  selectedMachineId: string | null;
  onSelectMachine: (machine: MachineNode) => void;
  statusFilter: MachineStatus | 'all';
  onStatusFilterChange: (status: MachineStatus | 'all') => void;
}

export const FactoryFloorMap: React.FC<FactoryFloorMapProps> = ({
  machines,
  selectedMachineId,
  onSelectMachine,
  statusFilter,
  onStatusFilterChange,
}) => {
  const [selectedBay, setSelectedBay] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const bays = [
    { id: 'all', name: 'All Bays' },
    { id: 'Bay A', name: 'Bay A: Die Prep' },
    { id: 'Bay B', name: 'Bay B: Wire Bond' },
    { id: 'Bay C', name: 'Bay C: Molding' },
    { id: 'Bay D', name: 'Bay D: Test & Sort' },
  ];

  const bayDescriptions: Record<string, { subtitle: string; lines: string }> = {
    'Bay A': { subtitle: 'WAFER DICING & DIE ATTACH', lines: 'Lines 01 & 02' },
    'Bay B': { subtitle: 'HIGH-DENSITY WIRE BONDING', lines: 'Lines 03 & 04' },
    'Bay C': { subtitle: 'AUTO MOLDING & ENCAPSULATION', lines: 'Line 05' },
    'Bay D': { subtitle: 'FINAL IC TEST & PACK', lines: 'Line 06' },
  };

  const filteredMachines = machines.filter((m) => {
    const matchesBay = selectedBay === 'all' || m.bay === selectedBay;
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBay && matchesStatus && matchesSearch;
  });

  const getBayMachines = (bayName: string) => {
    return filteredMachines.filter((m) => m.bay === bayName);
  };

  const getStatusDotClass = (status: MachineStatus) => {
    switch (status) {
      case 'healthy':
        return 'healthy';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'critical';
      case 'offline':
        return 'offline';
    }
  };

  return (
    <div className="floor-map-card">
      <span className="corner-tl">+</span>
      <span className="corner-tr">+</span>
      <span className="corner-bl">+</span>
      <span className="corner-br">+</span>

      {/* Header with Title & Legend */}
      <div className="floor-map-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="tech-card-title">
            <Factory size={16} />
            <span>Digital Factory Floor Map</span>
          </div>
          <span className="status-pill" style={{ fontSize: '10px' }}>
            <span className="status-dot pulse" />
            <span>2D TWIN LIVE</span>
          </span>
        </div>

        {/* Legend */}
        <div className="map-legend">
          <button
            onClick={() => onStatusFilterChange(statusFilter === 'healthy' ? 'all' : 'healthy')}
            className="legend-item"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              opacity: statusFilter === 'all' || statusFilter === 'healthy' ? 1 : 0.4,
            }}
          >
            <span className="legend-dot healthy" />
            <span>Healthy</span>
          </button>

          <button
            onClick={() => onStatusFilterChange(statusFilter === 'warning' ? 'all' : 'warning')}
            className="legend-item"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              opacity: statusFilter === 'all' || statusFilter === 'warning' ? 1 : 0.4,
            }}
          >
            <span className="legend-dot warning" />
            <span>Warning</span>
          </button>

          <button
            onClick={() => onStatusFilterChange(statusFilter === 'critical' ? 'all' : 'critical')}
            className="legend-item"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              opacity: statusFilter === 'all' || statusFilter === 'critical' ? 1 : 0.4,
            }}
          >
            <span className="legend-dot critical" />
            <span>Critical</span>
          </button>

          <button
            onClick={() => onStatusFilterChange(statusFilter === 'offline' ? 'all' : 'offline')}
            className="legend-item"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              opacity: statusFilter === 'all' || statusFilter === 'offline' ? 1 : 0.4,
            }}
          >
            <span className="legend-dot offline" />
            <span>Offline</span>
          </button>
        </div>
      </div>

      {/* Sub-toolbar with Bay filter buttons & Search */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          backgroundColor: 'var(--bg-main)',
          borderBottom: '1px solid var(--border-light)',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        {/* Bay Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-muted)', marginRight: '4px' }}>
            SECTOR:
          </span>
          {bays.map((bay) => (
            <button
              key={bay.id}
              onClick={() => setSelectedBay(bay.id)}
              className={`filter-badge-btn ${selectedBay === bay.id ? 'active' : ''}`}
            >
              {bay.name}
            </button>
          ))}
        </div>

        {/* Search Machine Box */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-strong)',
              padding: '2px 8px',
              gap: '6px',
            }}
          >
            <Search size={12} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search machine ID or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                backgroundColor: 'transparent',
                width: '150px',
              }}
            />
          </div>

          <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontWeight: 700 }}>
            {filteredMachines.length} of {machines.length} VISIBLE
          </span>
        </div>
      </div>

      {/* Interactive Blueprint Floor Layout */}
      <div className="floor-map-viewport">
        <div className="floor-bay-grid">
          {(['Bay A', 'Bay B', 'Bay C', 'Bay D'] as const).map((bayName) => {
            if (selectedBay !== 'all' && selectedBay !== bayName) return null;
            const bayMachines = getBayMachines(bayName);
            const meta = bayDescriptions[bayName];

            return (
              <div key={bayName} className="floor-bay-section">
                <span className="floor-bay-tag">{bayName}</span>

                <div className="floor-bay-meta">
                  <span>{meta.subtitle}</span>
                  <span>{meta.lines}</span>
                </div>

                {bayMachines.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px' }}>
                    No machines match current filter criteria in {bayName}.
                  </div>
                ) : (
                  <div className="machine-nodes-list">
                    {bayMachines.map((machine) => {
                      const isSelected = selectedMachineId === machine.id;

                      return (
                        <div
                          key={machine.id}
                          onClick={() => onSelectMachine(machine)}
                          className={`machine-floor-node ${isSelected ? 'selected' : ''} status-${machine.status}`}
                          title={`${machine.id} - ${machine.name} (${machine.status.toUpperCase()})`}
                        >
                          <div className="node-top-row">
                            <span className="node-code">{machine.id}</span>
                            <span className="node-type-badge">{machine.typeShort}</span>
                          </div>

                          <div className="node-icon-row">
                            <div className="node-icon-box">
                              <MachineIcon
                                type={machine.type}
                                size={18}
                                color={
                                  isSelected
                                    ? '#FAF9F5'
                                    : machine.status === 'critical'
                                    ? 'var(--accent-red)'
                                    : machine.status === 'warning'
                                    ? 'var(--accent-amber)'
                                    : 'var(--text-primary)'
                                }
                              />
                            </div>

                            <div className="node-stats">
                              <span className="node-health-label">HEALTH</span>
                              <span
                                className="node-health-val"
                                style={{
                                  color: isSelected
                                    ? '#FAF9F5'
                                    : machine.status === 'critical'
                                    ? 'var(--accent-red)'
                                    : machine.status === 'warning'
                                    ? 'var(--accent-amber)'
                                    : 'var(--text-primary)',
                                }}
                              >
                                {machine.status === 'offline' ? 'OFF' : `${machine.healthScore}%`}
                              </span>
                            </div>
                          </div>

                          {/* Machine Status Bar */}
                          <div className={`node-status-bar ${getStatusDotClass(machine.status)}`} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
