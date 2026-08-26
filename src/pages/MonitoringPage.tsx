import React, { useState } from 'react';
import { TabId } from '../types/navigation';
import { MachineNode, MachineStatus } from '../types/dashboard';
import { MOCK_DASHBOARD_DATA } from '../data/mockFactoryData';
import { FactoryFloorMap } from '../components/dashboard/FactoryFloorMap';
import { MachineContextPanel } from '../components/dashboard/MachineContextPanel';
import { AttentionRequiredSection } from '../components/dashboard/AttentionRequiredSection';
import { ProductionStatusSection } from '../components/dashboard/ProductionStatusSection';
import '../styles/dashboard.css';
import {
  Activity,
  RefreshCw,
  Radio,
} from 'lucide-react';

interface MonitoringPageProps {
  onNavigate?: (tab: TabId, machineId?: string) => void;
  initialMachineId?: string | null;
}

export const MonitoringPage: React.FC<MonitoringPageProps> = ({ onNavigate, initialMachineId }) => {
  const [dashboardData] = useState(MOCK_DASHBOARD_DATA);
  const [statusFilter, setStatusFilter] = useState<MachineStatus | 'all'>('all');

  // Selected machine on the floor map
  const [selectedMachine, setSelectedMachine] = useState<MachineNode | null>(
    (initialMachineId && dashboardData.machines.find((m) => m.id === initialMachineId)) ||
    dashboardData.machines.find((m) => m.id === 'WB-04') ||
    dashboardData.machines[0]
  );

  const handleSelectMachine = (machine: MachineNode) => {
    setSelectedMachine(machine);
  };

  const handleSelectMachineById = (machineId: string) => {
    const target = dashboardData.machines.find((m) => m.id === machineId);
    if (target) {
      setSelectedMachine(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStatusFilterChange = (status: MachineStatus | 'all') => {
    setStatusFilter(status);
  };

  return (
    <div className="dashboard-root" role="region" aria-label="Factory Floor Monitoring Command Center">
      {/* Central Operations Toolbar */}
      <div className="dash-toolbar">
        <div className="dash-toolbar-left">
          <div className="dash-toolbar-title">
            <Radio size={18} color="var(--accent-amber)" />
            <span>Factory Floor Command Center (OSAT Floor 01 — Live Telemetry)</span>
          </div>
          <span className="status-pill">
            <span className="status-dot pulse" />
            <span>OPC-UA STREAM: ONLINE</span>
          </span>
        </div>

        <div className="dash-toolbar-right">
          <div className="filter-badge-group">
            <span style={{ fontSize: '10px', fontWeight: 800, padding: '0 6px', color: 'var(--text-muted)' }}>
              FLOOR FILTER:
            </span>
            <button
              type="button"
              onClick={() => handleStatusFilterChange('all')}
              className={`filter-badge-btn ${statusFilter === 'all' ? 'active' : ''}`}
            >
              ALL ({dashboardData.overview.totalMachines})
            </button>
            <button
              type="button"
              onClick={() => handleStatusFilterChange('warning')}
              className={`filter-badge-btn ${statusFilter === 'warning' ? 'active' : ''}`}
            >
              WARNINGS ({dashboardData.overview.warningMachines})
            </button>
            <button
              type="button"
              onClick={() => handleStatusFilterChange('critical')}
              className={`filter-badge-btn ${statusFilter === 'critical' ? 'active' : ''}`}
            >
              CRITICAL ({dashboardData.overview.criticalMachines})
            </button>
          </div>

          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className="tech-btn"
            style={{ padding: '5px 8px', fontSize: '11px' }}
            title="Reset Floor Map Filters"
          >
            <RefreshCw size={12} />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* Main Floor Map & Contextual Information Panel */}
      <div className="floor-map-container-layout">
        <FactoryFloorMap
          machines={dashboardData.machines}
          selectedMachineId={selectedMachine?.id || null}
          onSelectMachine={handleSelectMachine}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
        />

        <MachineContextPanel
          machine={selectedMachine}
          onClose={() => setSelectedMachine(null)}
          onNavigate={onNavigate}
        />
      </div>

      {/* Real-Time Priority Anomaly Queue & Floor Production Telemetry */}
      <div className="dash-middle-grid">
        <AttentionRequiredSection
          alerts={dashboardData.alerts}
          onNavigate={onNavigate}
          onSelectMachine={handleSelectMachineById}
        />

        <ProductionStatusSection
          data={dashboardData.production}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
};

export default MonitoringPage;
