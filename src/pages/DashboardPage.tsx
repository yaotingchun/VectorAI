import React, { useState } from 'react';
import { TabId } from '../types/navigation';
import { MOCK_DASHBOARD_DATA } from '../data/mockFactoryData';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { FactoryOverviewKpi } from '../components/dashboard/FactoryOverviewKpi';
import { FactoryHealthTrend } from '../components/dashboard/FactoryHealthTrend';
import { OeeTrendChart } from '../components/dashboard/OeeTrendChart';
import { MachineHealthDistribution } from '../components/dashboard/MachineHealthDistribution';
import { MachineRiskByProcess } from '../components/dashboard/MachineRiskByProcess';
import { PredictiveRiskOverview } from '../components/dashboard/PredictiveRiskOverview';
import { MaintenanceOverviewSection } from '../components/dashboard/MaintenanceOverviewSection';
import '../styles/dashboard.css';

interface DashboardPageProps {
  onNavigate?: (tab: TabId, machineId?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [dashboardData] = useState(MOCK_DASHBOARD_DATA);

  const overview = dashboardData.overview;

  const handleSelectCriticalRul = (machineId: string) => {
    if (onNavigate) {
      onNavigate('prediction', machineId);
    }
  };

  return (
    <div className="dashboard-root" role="region" aria-label="Vector.ai Factory Executive Dashboard">
      {/* 0. Factory Overview Header (Plant Identity, Reporting Period, Overall Status) */}
      <DashboardHeader
        onNavigate={onNavigate}
        factoryHealthScore={overview.factoryHealthScore}
        criticalRiskCount={overview.criticalMachines}
      />

      {/* 1. Factory Overview Top 4 KPI Cards: Factory Health, OEE, Machine Status, Active Alerts */}
      <FactoryOverviewKpi
        data={overview}
        onNavigate={onNavigate}
        onSelectCriticalRul={handleSelectCriticalRul}
      />

      {/* 2. Middle Executive Grid: Two Time-Series Visualizations (Factory Health Trend + OEE Trend) */}
      <div className="dash-overview-two-col-grid">
        {/* Factory Health Trend (24H / 7D / 30D) */}
        <FactoryHealthTrend trends={dashboardData.healthTrends} />

        {/* OEE & Production Efficiency Trend (24H / 7D / 30D) */}
        <OeeTrendChart trends={dashboardData.oeeTrends} />
      </div>

      {/* 3. Distribution & Process Risk Grid: Equipment Health Distribution + Machine Risk by Process */}
      <div className="dash-overview-two-col-grid">
        {/* Equipment Health Distribution (Healthy, Warning, Critical) */}
        <MachineHealthDistribution
          overview={overview}
          machines={dashboardData.machines}
          onNavigate={onNavigate}
        />

        {/* Machine Risk by Process (Wafer Dicing, Die Attach, Wire Bonding, Molding, Testing) */}
        <MachineRiskByProcess
          processRiskList={dashboardData.processRisk}
          onNavigate={onNavigate}
        />
      </div>

      {/* 4. Full-Width Section: Predictive Maintenance Risk Overview (4-Tier Risk, 7D/30D Horizon, High-Risk Equipment) */}
      <div className="dash-bottom-full-section">
        <PredictiveRiskOverview
          data={dashboardData.predictiveRisk}
          onNavigate={onNavigate}
        />
      </div>

      {/* 5. Bottom Section: Factory Maintenance Workload & Priority Work Orders Summary */}
      <div className="dash-bottom-full-section">
        <MaintenanceOverviewSection
          data={dashboardData.maintenance}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
};

export default DashboardPage;


