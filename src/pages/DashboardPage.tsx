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
import { DashboardRerouteExecutionSection } from '../components/dashboard/DashboardRerouteExecutionSection';
import { ArrowRight, Bot } from 'lucide-react';
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

      {/* 0.1 AI Decision Alert Banner */}
      <div
        className="tech-card"
        style={{
          border: '1.5px solid var(--border-strong)',
          backgroundColor: 'var(--bg-card)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '2px 2px 0px rgba(18, 19, 21, 0.08)',
        }}
      >
        <span className="corner-tl">+</span>
        <span className="corner-tr">+</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '4px 8px',
              backgroundColor: 'var(--bg-dark)',
              color: 'var(--text-inverted)',
              fontSize: '10px',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Bot size={12} />
            <span>AI DECISION</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>⚠ Product B Demand Surge</span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>✓ Rerouting Approved</span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>M-01 → Product B (30 units/hr)</span>
          </div>
        </div>

        <button
          onClick={() => onNavigate?.('aicontrol')}
          className="tech-btn primary"
          style={{ padding: '5px 12px', fontSize: '11px', gap: '6px' }}
        >
          <span>VIEW COMMAND CENTER</span>
          <ArrowRight size={12} />
        </button>
      </div>

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

      {/* 5. Section: Factory Maintenance Workload & Priority Work Orders Summary */}
      <div className="dash-bottom-full-section">
        <MaintenanceOverviewSection
          data={dashboardData.maintenance}
          onNavigate={onNavigate}
        />
      </div>

      {/* 6. Bottom Section: Autonomous Rerouting & Machine Incident Execution Logs with AI Reasoning */}
      <div className="dash-bottom-full-section">
        <DashboardRerouteExecutionSection
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
};

export default DashboardPage;


