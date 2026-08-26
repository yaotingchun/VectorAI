import React from 'react';
import { ProductionStatusData } from '../../types/dashboard';
import { TabId } from '../../types/navigation';
import {
  Gauge,
  Percent,
  CheckCircle2,
  AlertOctagon,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

interface ProductionStatusSectionProps {
  data: ProductionStatusData;
  onNavigate?: (tab: TabId, machineId?: string) => void;
}

export const ProductionStatusSection: React.FC<ProductionStatusSectionProps> = ({ data, onNavigate }) => {
  const throughputEfficiency = ((data.currentThroughput / data.targetThroughput) * 100).toFixed(1);

  return (
    <section className="tech-card" aria-label="Production Status Overview">
      <span className="corner-tl">+</span>
      <span className="corner-tr">+</span>
      <span className="corner-bl">+</span>
      <span className="corner-br">+</span>

      <div className="tech-card-header">
        <div className="tech-card-title">
          <Gauge size={16} />
          <span>Production Floor Performance</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => onNavigate?.('monitoring')}
            className="tech-btn"
            style={{ padding: '4px 10px', fontSize: '10px' }}
          >
            <span>View Monitoring</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      <div className="tech-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* 4-Column Metric Summary Strip */}
        <div className="prod-metric-strip">
          {/* Current Throughput */}
          <div className="prod-metric-box">
            <span className="telemetry-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={11} /> Throughput (UPH)
            </span>
            <span className="telemetry-value" style={{ fontSize: '16px' }}>
              {data.currentThroughput.toLocaleString()}
            </span>
            <div style={{ fontSize: '9.5px', color: 'var(--text-secondary)' }}>
              Target: {data.targetThroughput.toLocaleString()} ({throughputEfficiency}%)
            </div>
          </div>

          {/* Factory Yield Rate */}
          <div className="prod-metric-box">
            <span className="telemetry-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Percent size={11} /> Overall Yield
            </span>
            <span className="telemetry-value" style={{ fontSize: '16px', color: 'var(--accent-green)' }}>
              {data.yieldPercentage.toFixed(2)}%
            </span>
            <div style={{ fontSize: '9.5px', color: 'var(--text-secondary)' }}>
              Target: {data.targetYieldPercentage.toFixed(2)}%
            </div>
          </div>

          {/* Active Production Lines */}
          <div className="prod-metric-box">
            <span className="telemetry-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={11} /> Active Lines
            </span>
            <span className="telemetry-value" style={{ fontSize: '16px' }}>
              {data.activeLinesCount} / {data.totalLinesCount}
            </span>
            <div style={{ fontSize: '9.5px', color: 'var(--text-secondary)' }}>
              1 Line Scheduled Offline
            </div>
          </div>

          {/* Production Lines at Risk */}
          <div className="prod-metric-box" style={{ borderColor: 'var(--accent-red)', backgroundColor: '#FEF2F2' }}>
            <span className="telemetry-label" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-red)' }}>
              <AlertOctagon size={11} /> Lines at Risk
            </span>
            <span className="telemetry-value" style={{ fontSize: '16px', color: 'var(--accent-red)' }}>
              {data.linesAtRiskCount} Lines
            </span>
            <div style={{ fontSize: '9.5px', color: '#991B1B', fontWeight: 600 }}>
              {data.throughputAtRiskPercentage}% Cap. Exposed
            </div>
          </div>
        </div>

        {/* Individual Production Line Status Breakdown */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Live Line Telemetry vs Equipment Health
            </span>
            <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              EFFICIENCY %
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {data.lines.map((line) => {
              const isDegraded = line.status === 'degraded';
              const isAtRisk = line.status === 'at-risk';

              return (
                <div
                  key={line.lineId}
                  className="prod-line-row"
                  style={{
                    borderColor: isDegraded ? 'var(--accent-red)' : isAtRisk ? 'var(--accent-amber)' : 'var(--border-light)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10.5px',
                        fontWeight: 800,
                        backgroundColor: 'var(--bg-muted)',
                        padding: '2px 6px',
                        border: '1px solid var(--border-strong)',
                      }}
                    >
                      {line.bay}
                    </span>

                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700 }}>
                        {line.lineName}
                      </div>
                      {line.riskFactor ? (
                        <div style={{ fontSize: '9.5px', color: isDegraded ? 'var(--accent-red)' : 'var(--accent-amber)', fontWeight: 600 }}>
                          ⚠ {line.riskFactor}
                        </div>
                      ) : (
                        <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                          Running at nominal capacity • Yield: {line.yieldRate}%
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 800 }}>
                        {line.currentUph.toLocaleString()} <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>UPH</span>
                      </div>
                      <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>
                        {line.efficiency}% target
                      </div>
                    </div>

                    <div className="prod-line-bar" title={`${line.efficiency}% target achieved`}>
                      <div
                        className={`prod-line-progress ${isDegraded ? 'critical' : isAtRisk ? 'warning' : ''}`}
                        style={{ width: `${Math.min(100, line.efficiency)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
