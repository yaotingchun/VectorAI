import React from 'react';
import { ProductionSummaryKpis } from '../types/production';
import { Activity, Target, Layers, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

interface ProductKpiStripProps {
  kpis: ProductionSummaryKpis;
  onOpenExplainerModal?: () => void;
}

export const ProductKpiStrip: React.FC<ProductKpiStripProps> = ({ kpis, onOpenExplainerModal }) => {
  const uphDelta = kpis.totalFactoryLiveUph - kpis.totalFactoryTargetUph;
  const isUphAhead = uphDelta >= 0;

  return (
    <div className="production-kpi-grid">
      {/* 1. Factory Live UPH Throughput */}
      <div className="production-kpi-card">
        <span className="corner-tl">+</span>
        <span className="corner-tr">+</span>
        <span className="corner-bl">+</span>
        <span className="corner-br">+</span>

        <div className="kpi-top-row">
          <span className="kpi-badge">
            <Activity size={12} color="var(--accent-blue)" />
            TOTAL FACTORY THROUGHPUT
          </span>
          <span className={`kpi-pill ${isUphAhead ? 'green' : 'amber'}`}>
            <TrendingUp size={10} />
            {isUphAhead ? `+${uphDelta} UPH` : `${uphDelta} UPH`}
          </span>
        </div>

        <div className="kpi-main-val">
          <span>{kpis.totalFactoryLiveUph.toLocaleString()}</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
            UPH (Units / Hour)
          </span>
        </div>

        <div className="kpi-sub-text">
          <span>Target Nominal: {kpis.totalFactoryTargetUph.toLocaleString()} UPH</span>
          <span style={{ color: isUphAhead ? 'var(--accent-green)' : 'var(--accent-amber)', fontWeight: 700 }}>
            {isUphAhead ? 'OPTIMAL' : 'THROTTLED'}
          </span>
        </div>
      </div>

      {/* 2. Today's Dynamic Goal Hit Rate */}
      <div className="production-kpi-card">
        <span className="corner-tl">+</span>
        <span className="corner-tr">+</span>
        <span className="corner-bl">+</span>
        <span className="corner-br">+</span>

        <div className="kpi-top-row">
          <span className="kpi-badge">
            <Target size={12} color="var(--accent-amber)" />
            TODAY'S DYNAMIC GOAL
          </span>
          <button
            onClick={onOpenExplainerModal}
            className="goal-explain-btn"
            title="Click to see mathematical breakdown"
          >
            How it works?
          </button>
        </div>

        <div className="kpi-main-val">
          <span>{kpis.overallGoalProgressPercent}%</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
            ({kpis.totalProducedToday.toLocaleString()} / {kpis.totalDailyDynamicGoal.toLocaleString()} u)
          </span>
        </div>

        <div className="kpi-sub-text">
          <span>Remaining to Hit Today: {(kpis.totalDailyDynamicGoal - kpis.totalProducedToday).toLocaleString()} u</span>
          <span className="kpi-pill dark">
            DYNAMIC
          </span>
        </div>
      </div>

      {/* 3. Active Orders & Delivery Backlog */}
      <div className="production-kpi-card">
        <span className="corner-tl">+</span>
        <span className="corner-tr">+</span>
        <span className="corner-bl">+</span>
        <span className="corner-br">+</span>

        <div className="kpi-top-row">
          <span className="kpi-badge">
            <Layers size={12} color="var(--accent-green)" />
            CUSTOMER ORDERS BACKLOG
          </span>
          {kpis.urgentOrdersCount > 0 && (
            <span className="kpi-pill red">
              <AlertTriangle size={10} />
              {kpis.urgentOrdersCount} URGENT
            </span>
          )}
        </div>

        <div className="kpi-main-val">
          <span>{kpis.totalBacklogUnits.toLocaleString()}</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
            UNITS ({kpis.totalActiveOrders} Active Orders)
          </span>
        </div>

        <div className="kpi-sub-text">
          <span>Top Accounts: Tesla, NVIDIA, Apple, Qualcomm</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Active</span>
        </div>
      </div>

      {/* 4. Factory Yield & Daily Output Value */}
      <div className="production-kpi-card">
        <span className="corner-tl">+</span>
        <span className="corner-tr">+</span>
        <span className="corner-bl">+</span>
        <span className="corner-br">+</span>

        <div className="kpi-top-row">
          <span className="kpi-badge">
            <Sparkles size={12} color="var(--accent-amber)" />
            LINE YIELD & OUTPUT VALUE
          </span>
          <span className="kpi-pill green">
            AEC-Q100 OK
          </span>
        </div>

        <div className="kpi-main-val">
          <span>{kpis.averageFactoryYield}%</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
            Avg Cleanroom Yield
          </span>
        </div>

        <div className="kpi-sub-text">
          <span>Est. Value Today: ${(kpis.totalDailyRevenueUsd / 1000).toFixed(0)}k USD</span>
          <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>Nominal</span>
        </div>
      </div>
    </div>
  );
};
