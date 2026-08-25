import React from 'react';
import { FactoryOverviewKpiData, MachineStatus } from '../../types/dashboard';
import {
  Activity,
  Cpu,
  AlertTriangle,
  Clock,
  TrendingDown,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';

interface FactoryOverviewKpiProps {
  data: FactoryOverviewKpiData;
  activeStatusFilter?: MachineStatus | 'all';
  onFilterStatus?: (status: MachineStatus | 'all') => void;
  onSelectCriticalRul?: (machineId: string) => void;
}

export const FactoryOverviewKpi: React.FC<FactoryOverviewKpiProps> = ({
  data,
  activeStatusFilter = 'all',
  onFilterStatus,
  onSelectCriticalRul,
}) => {
  const healthyPct = (data.healthyMachines / data.totalMachines) * 100;
  const warningPct = (data.warningMachines / data.totalMachines) * 100;
  const criticalPct = (data.criticalMachines / data.totalMachines) * 100;
  const offlinePct = (data.offlineMachines / data.totalMachines) * 100;

  return (
    <section className="kpi-grid" aria-label="Factory Top Overview KPIs">
      {/* 1. FACTORY HEALTH SCORE */}
      <div className="kpi-card">
        <span className="corner-tl">+</span>
        <span className="corner-tr">+</span>
        <span className="corner-bl">+</span>
        <span className="corner-br">+</span>

        <div className="kpi-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={14} color="var(--text-primary)" />
            <span className="kpi-title">Factory Health Score</span>
          </div>
          <span className="kpi-code">INDEX // 0-100</span>
        </div>

        <div className="kpi-value-row">
          <span className="kpi-main-value">{data.factoryHealthScore.toFixed(1)}</span>
          <span className="kpi-unit">/ 100</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
          <span
            className={`kpi-delta-tag ${data.healthScoreDelta >= 0 ? 'positive' : 'negative'}`}
          >
            {data.healthScoreDelta >= 0 ? (
              <TrendingUp size={11} />
            ) : (
              <TrendingDown size={11} />
            )}
            <span>
              {data.healthScoreDelta >= 0 ? '+' : ''}
              {data.healthScoreDelta}% vs yesterday
            </span>
          </span>

          <span className="status-pill" style={{ fontSize: '9px', padding: '1px 5px' }}>
            <span className="status-dot pulse" />
            <span>OPTIMAL</span>
          </span>
        </div>
      </div>

      {/* 2. REGISTERED MACHINES BREAKDOWN */}
      <div className="kpi-card">
        <span className="corner-tl">+</span>
        <span className="corner-tr">+</span>
        <span className="corner-bl">+</span>
        <span className="corner-br">+</span>

        <div className="kpi-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={14} color="var(--text-primary)" />
            <span className="kpi-title">Registered Fleet</span>
          </div>
          <span className="kpi-code">TOTAL // {data.totalMachines}</span>
        </div>

        <div className="kpi-value-row">
          <span className="kpi-main-value">{data.totalMachines}</span>
          <span className="kpi-unit">UNITS</span>
        </div>

        {/* Stacked Segment Bar */}
        <div className="kpi-breakdown-bar" title="Fleet Status Breakdown">
          <div className="kpi-breakdown-segment seg-healthy" style={{ width: `${healthyPct}%` }} />
          <div className="kpi-breakdown-segment seg-warning" style={{ width: `${warningPct}%` }} />
          <div className="kpi-breakdown-segment seg-critical" style={{ width: `${criticalPct}%` }} />
          <div className="kpi-breakdown-segment seg-offline" style={{ width: `${offlinePct}%` }} />
        </div>

        {/* Status Breakdown Chips (clickable to filter) */}
        <div className="kpi-status-chips">
          <button
            onClick={() => onFilterStatus?.(activeStatusFilter === 'healthy' ? 'all' : 'healthy')}
            className={`status-chip-mini ${activeStatusFilter === 'healthy' ? 'active' : ''}`}
            style={{
              cursor: 'pointer',
              borderColor: activeStatusFilter === 'healthy' ? 'var(--accent-green)' : 'var(--border-light)',
            }}
            title="Filter healthy machines"
          >
            <span className="legend-dot healthy" />
            <span>{data.healthyMachines} OK</span>
          </button>

          <button
            onClick={() => onFilterStatus?.(activeStatusFilter === 'warning' ? 'all' : 'warning')}
            className={`status-chip-mini ${activeStatusFilter === 'warning' ? 'active' : ''}`}
            style={{
              cursor: 'pointer',
              borderColor: activeStatusFilter === 'warning' ? 'var(--accent-amber)' : 'var(--border-light)',
            }}
            title="Filter warning machines"
          >
            <span className="legend-dot warning" />
            <span>{data.warningMachines} WARN</span>
          </button>

          <button
            onClick={() => onFilterStatus?.(activeStatusFilter === 'critical' ? 'all' : 'critical')}
            className={`status-chip-mini ${activeStatusFilter === 'critical' ? 'active' : ''}`}
            style={{
              cursor: 'pointer',
              borderColor: activeStatusFilter === 'critical' ? 'var(--accent-red)' : 'var(--border-light)',
            }}
            title="Filter critical machines"
          >
            <span className="legend-dot critical" />
            <span>{data.criticalMachines} CRIT</span>
          </button>

          <button
            onClick={() => onFilterStatus?.(activeStatusFilter === 'offline' ? 'all' : 'offline')}
            className={`status-chip-mini ${activeStatusFilter === 'offline' ? 'active' : ''}`}
            style={{
              cursor: 'pointer',
              borderColor: activeStatusFilter === 'offline' ? 'var(--border-strong)' : 'var(--border-light)',
            }}
            title="Filter offline machines"
          >
            <span className="legend-dot offline" />
            <span>{data.offlineMachines} OFF</span>
          </button>
        </div>
      </div>

      {/* 3. CRITICAL RISK MACHINES */}
      <div
        className={`kpi-card interactive ${data.criticalRiskCount > 0 ? 'alert-border' : ''}`}
        onClick={() => onFilterStatus?.(activeStatusFilter === 'critical' ? 'all' : 'critical')}
        title="Click to highlight Critical Risk machines"
      >
        <span className="corner-tl">+</span>
        <span className="corner-tr">+</span>
        <span className="corner-bl">+</span>
        <span className="corner-br">+</span>

        <div className="kpi-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={14} color="var(--accent-red)" />
            <span className="kpi-title" style={{ color: 'var(--accent-red)' }}>Critical Risk</span>
          </div>
          <span className="status-pill dark" style={{ fontSize: '9px' }}>URGENT</span>
        </div>

        <div className="kpi-value-row">
          <span className="kpi-main-value" style={{ color: 'var(--accent-red)' }}>
            {data.criticalRiskCount.toString().padStart(2, '0')}
          </span>
          <span className="kpi-unit">MACHINES</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
          <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Immediate service required
          </span>
          <ArrowUpRight size={14} color="var(--accent-red)" />
        </div>
      </div>

      {/* 4. MINIMUM FACTORY RUL */}
      <div
        className="kpi-card interactive"
        onClick={() => onSelectCriticalRul?.(data.minRulMachineId)}
        title={`Inspect ${data.minRulMachineId} (${data.minRulMachineType})`}
      >
        <span className="corner-tl">+</span>
        <span className="corner-tr">+</span>
        <span className="corner-bl">+</span>
        <span className="corner-br">+</span>

        <div className="kpi-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} color="var(--text-primary)" />
            <span className="kpi-title">Min Factory RUL</span>
          </div>
          <span className="kpi-code">EST // TIME</span>
        </div>

        <div className="kpi-value-row">
          <span className="kpi-main-value" style={{ color: 'var(--accent-amber)' }}>
            {data.minRulHours}
          </span>
          <span className="kpi-unit">HOURS</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10.5px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-muted)',
              padding: '2px 6px',
              border: '1px solid var(--border-strong)',
            }}
          >
            {data.minRulMachineId} • {data.minRulMachineType.split(' ')[0]}
          </span>
          <span style={{ fontSize: '9.5px', color: 'var(--accent-red)', fontWeight: 700 }}>
            CRITICAL
          </span>
        </div>
      </div>

      {/* 5. PRODUCTION RISK */}
      <div className="kpi-card">
        <span className="corner-tl">+</span>
        <span className="corner-tr">+</span>
        <span className="corner-bl">+</span>
        <span className="corner-br">+</span>

        <div className="kpi-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingDown size={14} color="var(--accent-amber)" />
            <span className="kpi-title">Production Risk</span>
          </div>
          <span className="kpi-code">THROUGHPUT</span>
        </div>

        <div className="kpi-value-row">
          <span className="kpi-main-value" style={{ color: 'var(--accent-amber)' }}>
            {data.capacityAtRiskPercentage}%
          </span>
          <span className="kpi-unit">CAPACITY AT RISK</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
            }}
          >
            2 Lines Impacted
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9.5px',
              fontWeight: 700,
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              padding: '1px 5px',
              border: '1px solid #F59E0B',
            }}
          >
            MODERATE RISK
          </span>
        </div>
      </div>
    </section>
  );
};
