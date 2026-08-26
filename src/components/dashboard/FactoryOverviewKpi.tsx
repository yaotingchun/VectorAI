import React from 'react';
import { FactoryOverviewKpiData } from '../../types/dashboard';
import { TabId } from '../../types/navigation';
import {
  Activity,
  Gauge,
  Cpu,
  BellRing,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from 'lucide-react';

interface FactoryOverviewKpiProps {
  data: FactoryOverviewKpiData;
  onNavigate?: (tab: TabId, machineId?: string) => void;
  onSelectCriticalRul?: (machineId: string) => void;
}

export const FactoryOverviewKpi: React.FC<FactoryOverviewKpiProps> = ({
  data,
  onNavigate,
}) => {
  const healthyPct = Math.round((data.healthyMachines / data.totalMachines) * 100);
  const warningPct = Math.round((data.warningMachines / data.totalMachines) * 100);
  const criticalPct = Math.round((data.criticalMachines / data.totalMachines) * 100);
  const offlinePct = Math.round((data.offlineMachines / data.totalMachines) * 100);

  const isHealthGood = data.factoryHealthScore >= 85;
  const isOeeWorldClass = data.oeePercentage >= 85;

  return (
    <section className="kpi-grid four-col" aria-label="Factory Executive Top KPIs">
      {/* 1. FACTORY HEALTH SCORE */}
      <div
        className="kpi-card interactive"
        onClick={() => onNavigate?.('machines')}
        title="View live plant health and fleet metrics"
      >
        <span className="corner-tl">+</span>
        <span className="corner-tr">+</span>
        <span className="corner-bl">+</span>
        <span className="corner-br">+</span>

        <div className="kpi-header">
          <div className="kpi-header-left">
            <div className="kpi-icon-bubble">
              <Activity size={15} color="var(--text-primary)" />
            </div>
            <span className="kpi-title">Factory Health Score</span>
          </div>
          <span className="kpi-code">INDEX</span>
        </div>

        <div className="kpi-value-row">
          <span className="kpi-main-value">{data.factoryHealthScore.toFixed(1)}</span>
          <span className="kpi-unit">/ 100</span>
        </div>

        <div className="kpi-footer-row">
          <span className={`kpi-delta-tag ${data.healthScoreDelta >= 0 ? 'positive' : 'negative'}`}>
            {data.healthScoreDelta >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            <span>
              {data.healthScoreDelta >= 0 ? '+' : ''}
              {data.healthScoreDelta}% vs yesterday
            </span>
          </span>

          <span
            className="kpi-status-badge"
            style={{
              backgroundColor: isHealthGood ? '#DCFCE7' : '#FEF3C7',
              color: isHealthGood ? '#166534' : '#92400E',
              borderColor: isHealthGood ? '#86EFAC' : '#FCD34D',
            }}
          >
            {isHealthGood ? 'GOOD / STABLE' : 'ATTENTION'}
          </span>
        </div>

        <div className="kpi-sub-strip">
          <span>Target Index: <strong>90.0</strong></span>
          <span className="kpi-nav-cue">Machines <ArrowRight size={10} /></span>
        </div>
      </div>

      {/* 2. OVERALL EQUIPMENT EFFECTIVENESS (OEE) */}
      <div
        className="kpi-card interactive"
        onClick={() => onNavigate?.('vfactory')}
        title="View production line throughput & OEE efficiency"
      >
        <span className="corner-tl">+</span>
        <span className="corner-tr">+</span>
        <span className="corner-bl">+</span>
        <span className="corner-br">+</span>

        <div className="kpi-header">
          <div className="kpi-header-left">
            <div className="kpi-icon-bubble">
              <Gauge size={15} color="var(--accent-blue)" />
            </div>
            <span className="kpi-title">Overall Equipment Effectiveness</span>
          </div>
          <span className="kpi-code">METRIC</span>
        </div>

        <div className="kpi-value-row">
          <span className="kpi-main-value text-blue">{data.oeePercentage.toFixed(1)}</span>
          <span className="kpi-unit">% OEE</span>
        </div>

        <div className="kpi-footer-row">
          <span className={`kpi-delta-tag ${data.oeeDelta >= 0 ? 'positive' : 'negative'}`}>
            {data.oeeDelta >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            <span>
              {data.oeeDelta >= 0 ? '+' : ''}
              {data.oeeDelta}% vs shift target
            </span>
          </span>

          <span
            className="kpi-status-badge"
            style={{
              backgroundColor: isOeeWorldClass ? '#EFF6FF' : '#FEF3C7',
              color: isOeeWorldClass ? '#1D4ED8' : '#92400E',
              borderColor: isOeeWorldClass ? '#93C5FD' : '#FCD34D',
            }}
          >
            {isOeeWorldClass ? 'WORLD CLASS' : 'MODERATE'}
          </span>
        </div>

        <div className="kpi-sub-strip oee-breakdown">
          <span>A: <strong>{data.oeeAvailability}%</strong></span>
          <span className="dot-sep">•</span>
          <span>P: <strong>{data.oeePerformance}%</strong></span>
          <span className="dot-sep">•</span>
          <span>Q: <strong>{data.oeeQuality}%</strong></span>
        </div>
      </div>

      {/* 3. MACHINE STATUS */}
      <div
        className="kpi-card interactive"
        onClick={() => onNavigate?.('machines')}
        title="Inspect machine registry and node statuses"
      >
        <span className="corner-tl">+</span>
        <span className="corner-tr">+</span>
        <span className="corner-bl">+</span>
        <span className="corner-br">+</span>

        <div className="kpi-header">
          <div className="kpi-header-left">
            <div className="kpi-icon-bubble">
              <Cpu size={15} color="var(--accent-green)" />
            </div>
            <span className="kpi-title">Machine Status</span>
          </div>
          <span className="kpi-code">REGISTRY</span>
        </div>

        <div className="kpi-value-row">
          <span className="kpi-main-value">{data.totalMachines}</span>
          <span className="kpi-unit">UNITS ({data.onlineMachines} ONLINE)</span>
        </div>

        {/* Stacked Fleet Bar */}
        <div className="kpi-breakdown-bar" title="Fleet Status Breakdown">
          <div className="kpi-breakdown-segment seg-healthy" style={{ width: `${healthyPct}%` }} title={`Healthy: ${data.healthyMachines}`} />
          <div className="kpi-breakdown-segment seg-warning" style={{ width: `${warningPct}%` }} title={`Warning: ${data.warningMachines}`} />
          <div className="kpi-breakdown-segment seg-critical" style={{ width: `${criticalPct}%` }} title={`Critical: ${data.criticalMachines}`} />
          <div className="kpi-breakdown-segment seg-offline" style={{ width: `${offlinePct}%` }} title={`Offline: ${data.offlineMachines}`} />
        </div>

        <div className="kpi-fleet-counts-row">
          <span className="count-tag text-green font-bold">{data.healthyMachines} Healthy</span>
          <span className="count-tag text-amber">{data.warningMachines} Warning</span>
          <span className="count-tag text-red font-bold">{data.criticalMachines} Critical</span>
        </div>
      </div>

      {/* 4. ACTIVE ALERTS */}
      <div
        className={`kpi-card interactive ${data.criticalAlertsCount > 0 ? 'alert-border' : ''}`}
        onClick={() => onNavigate?.('prediction')}
        title="View predictive alerts and critical anomalies"
      >
        <span className="corner-tl">+</span>
        <span className="corner-tr">+</span>
        <span className="corner-bl">+</span>
        <span className="corner-br">+</span>

        <div className="kpi-header">
          <div className="kpi-header-left">
            <div className="kpi-icon-bubble alert-pulse">
              <BellRing size={15} color={data.criticalAlertsCount > 0 ? 'var(--accent-red)' : 'var(--accent-amber)'} />
            </div>
            <span className="kpi-title" style={{ color: data.criticalAlertsCount > 0 ? 'var(--accent-red)' : 'var(--accent-amber)' }}>
              Active Alerts
            </span>
          </div>
          <span className="kpi-code">ALARMS</span>
        </div>

        <div className="kpi-value-row">
          <span className="kpi-main-value" style={{ color: data.criticalAlertsCount > 0 ? 'var(--accent-red)' : 'var(--accent-amber)' }}>
            {data.activeAlertsCount}
          </span>
          <span className="kpi-unit">ACTIVE ALARMS</span>
        </div>

        <div className="kpi-footer-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="kpi-alert-pill crit">{data.criticalAlertsCount} Critical</span>
            <span className="kpi-alert-pill warn">{data.warningAlertsCount} Warning</span>
          </div>

          <span
            className="kpi-status-badge"
            style={{
              backgroundColor: '#FEE2E2',
              color: '#991B1B',
              borderColor: '#FCA5A5',
            }}
          >
            ACTION REQ.
          </span>
        </div>

        <div className="kpi-sub-strip">
          <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>
            {data.imminentSlaCount} Imminent (&lt; 16h SLA)
          </span>
          <span className="kpi-nav-cue">Predictions <ArrowRight size={10} /></span>
        </div>
      </div>
    </section>
  );
};

export default FactoryOverviewKpi;

