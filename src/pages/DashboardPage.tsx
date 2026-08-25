import React, { useState } from 'react';
import { TabId } from '../types/navigation';
import { MachineNode, MachineStatus } from '../types/dashboard';
import { MOCK_DASHBOARD_DATA } from '../data/mockFactoryData';
import { FactoryOverviewKpi } from '../components/dashboard/FactoryOverviewKpi';
import { FactoryFloorMap } from '../components/dashboard/FactoryFloorMap';
import { MachineContextPanel } from '../components/dashboard/MachineContextPanel';
import { ProductionStatusSection } from '../components/dashboard/ProductionStatusSection';
import { AttentionRequiredSection } from '../components/dashboard/AttentionRequiredSection';
import { FactoryHealthTrend } from '../components/dashboard/FactoryHealthTrend';
import { MaintenanceOverviewSection } from '../components/dashboard/MaintenanceOverviewSection';
import '../styles/dashboard.css';
import {
  LayoutDashboard,
  RefreshCw,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate?: (tab: TabId, machineId?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [dashboardData] = useState(MOCK_DASHBOARD_DATA);
  const [statusFilter, setStatusFilter] = useState<MachineStatus | 'all'>('all');
  
  // Selected machine on the floor map
  const [selectedMachine, setSelectedMachine] = useState<MachineNode | null>(
    // Default to WB-04 (most critical machine) to showcase context panel immediately
    dashboardData.machines.find((m) => m.id === 'WB-04') || dashboardData.machines[0]
  );

  const handleSelectMachine = (machine: MachineNode) => {
    setSelectedMachine(machine);
  };

  const handleSelectMachineById = (machineId: string) => {
    const target = dashboardData.machines.find((m) => m.id === machineId);
    if (target) {
      setSelectedMachine(target);
      // Scroll map into view smoothly if needed
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStatusFilterChange = (status: MachineStatus | 'all') => {
    setStatusFilter(status);
  };

  return (
    <div className="dashboard-root">
      {/* 0. Central Operations Header Strip */}
      <div className="dash-toolbar">
        <div className="dash-toolbar-left">
          <div className="dash-toolbar-title">
            <LayoutDashboard size={18} />
            <span>Semiconductor Backend Central Command (OSAT Floor 01)</span>
          </div>
          <span className="status-pill">
            <span className="status-dot pulse" />
            <span>OPC-UA STREAM: ONLINE</span>
          </span>
        </div>

        <div className="dash-toolbar-right">
          <div className="filter-badge-group">
            <span style={{ fontSize: '10px', fontWeight: 800, padding: '0 6px', color: 'var(--text-muted)' }}>
              VIEW FILTER:
            </span>
            <button
              onClick={() => handleStatusFilterChange('all')}
              className={`filter-badge-btn ${statusFilter === 'all' ? 'active' : ''}`}
            >
              ALL
            </button>
            <button
              onClick={() => handleStatusFilterChange('warning')}
              className={`filter-badge-btn ${statusFilter === 'warning' ? 'active' : ''}`}
            >
              WARNINGS ({dashboardData.overview.warningMachines})
            </button>
            <button
              onClick={() => handleStatusFilterChange('critical')}
              className={`filter-badge-btn ${statusFilter === 'critical' ? 'active' : ''}`}
            >
              CRITICAL ({dashboardData.overview.criticalMachines})
            </button>
          </div>

          <button
            onClick={() => {
              // Refresh or reset filters
              setStatusFilter('all');
            }}
            className="tech-btn"
            style={{ padding: '5px 8px', fontSize: '11px' }}
            title="Reset Floor Map Filters"
          >
            <RefreshCw size={12} />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* 1. Top Factory Overview KPI Cards (5 Cards) */}
      <FactoryOverviewKpi
        data={dashboardData.overview}
        activeStatusFilter={statusFilter}
        onFilterStatus={handleStatusFilterChange}
        onSelectCriticalRul={handleSelectMachineById}
      />

      {/* 2. Main Floor Map & Contextual Information Panel */}
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

      {/* 3. Middle Section: Production Status & Priority Attention Required */}
      <div className="dash-middle-grid">
        <ProductionStatusSection data={dashboardData.production} />
        
        <AttentionRequiredSection
          alerts={dashboardData.alerts}
          onNavigate={onNavigate}
          onSelectMachine={handleSelectMachineById}
        />
      </div>

      {/* 4. Bottom Section: Factory Health Trend & Maintenance Overview */}
      <div className="dash-bottom-grid">
        <FactoryHealthTrend trends={dashboardData.healthTrends} />
        
        <MaintenanceOverviewSection
          data={dashboardData.maintenance}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
