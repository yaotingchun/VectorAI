import React from 'react';
import { Product, DynamicGoalBreakdown } from '../types/production';
import {
  Target,
  ArrowRight,
  Plus,
  HelpCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  goalBreakdown: DynamicGoalBreakdown;
  onSelectProduct: (productId: string) => void;
  onOpenNewOrder: (productId: string) => void;
  onOpenExplainer: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  goalBreakdown,
  onSelectProduct,
  onOpenNewOrder,
  onOpenExplainer,
}) => {
  const isOptimal = product.currentUph >= product.targetUph;
  const isGoalCompleted = goalBreakdown.producedToday >= goalBreakdown.totalDailyGoal;

  // Calculate percentage widths for the progress bar
  const baseQuotaUnits = product.baseDailyQuota;
  const dynamicSurgeUnits = goalBreakdown.totalDynamicAddedUnits;
  const totalGoal = goalBreakdown.totalDailyGoal;
  const completedUnits = goalBreakdown.producedToday;

  const completedPct = totalGoal > 0 ? Math.min(100, (completedUnits / totalGoal) * 100) : 100;
  const baseQuotaPct = totalGoal > 0 ? (baseQuotaUnits / totalGoal) * 100 : 100;

  return (
    <div className="product-card">
      <span className="corner-tl">+</span>
      <span className="corner-tr">+</span>
      <span className="corner-bl">+</span>
      <span className="corner-br">+</span>

      {/* 1. Header: Product Code, Name, Package & Status Badge */}
      <div className="product-card-header">
        <div className="product-title-group">
          <span className="product-code-label">{product.code}</span>
          <h3 className="product-name-title">{product.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
            <span className="kpi-pill dark">{product.packageType}</span>
            <span className="kpi-pill" style={{ backgroundColor: '#EEF2F6', borderColor: '#CBD5E1', color: '#334155' }}>
              {product.waferTechnology}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <span
            className={`status-pill ${
              product.status === 'ACTIVE_RUNNING'
                ? 'dark'
                : product.status === 'THROTTLED'
                ? ''
                : 'dark'
            }`}
            style={{
              borderColor: product.status === 'THROTTLED' ? 'var(--accent-amber)' : 'var(--border-strong)',
              color: product.status === 'THROTTLED' ? 'var(--accent-amber)' : undefined,
            }}
          >
            <span
              className={`status-dot ${
                product.status === 'ACTIVE_RUNNING'
                  ? 'pulse'
                  : product.status === 'THROTTLED'
                  ? 'amber'
                  : 'muted'
              }`}
            />
            {product.status.replace('_', ' ')}
          </span>

          <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            Yield: <strong>{product.yieldRate}%</strong>
          </span>
        </div>
      </div>

      {/* 2. Body: Telemetry UPH & Dynamic Goal */}
      <div className="product-card-body">
        {/* Live Throughput UPH Strip */}
        <div className="uph-telemetry-row">
          <div className="uph-metric-col">
            <span className="uph-metric-label">LIVE THROUGHPUT</span>
            <div className="uph-metric-val">
              <span className={isOptimal ? 'green' : 'amber'}>{product.currentUph}</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '4px', fontWeight: 600 }}>
                UPH
              </span>
            </div>
          </div>

          <div className="uph-metric-col" style={{ textAlign: 'center' }}>
            <span className="uph-metric-label">TARGET / NOMINAL</span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700 }}>
              {product.targetUph} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>/ {product.nominalUph} UPH</span>
            </div>
          </div>

          <div className="uph-metric-col" style={{ textAlign: 'right' }}>
            <span className="uph-metric-label">CYCLE TIME</span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700 }}>
              {product.cycleTimeSeconds}s / unit
            </div>
          </div>
        </div>

        {/* Dynamic Daily Goal Progress Section */}
        <div className="goal-progress-box">
          {/* Header Row with Explainer Link */}
          <div className="goal-header-row">
            <span className="goal-title-badge">
              <Target size={12} color="var(--accent-amber)" />
              <span>TODAY'S PRODUCTION GOAL</span>
            </span>

            <button
              onClick={() => onOpenExplainer(product.id)}
              className="goal-explain-btn"
              title="Click for full formula breakdown"
            >
              <HelpCircle size={11} />
              <span>Dynamic Formula</span>
            </button>
          </div>

          {/* Numbers Row */}
          <div className="goal-numbers-row">
            <div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800 }}>
                {completedUnits.toLocaleString()}
              </span>
              <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>
                / {totalGoal.toLocaleString()} units ({completedPct.toFixed(0)}%)
              </span>
            </div>

            {/* Dynamic Equation Preview Tag */}
            <div className="goal-split-equation">
              <span>Base: <strong>{baseQuotaUnits}</strong></span>
              <span>+</span>
              <span style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>
                Orders: <strong>+{dynamicSurgeUnits}</strong>
              </span>
            </div>
          </div>

          {/* Visual Goal Bar Track with Base vs Surge Zones */}
          <div className="goal-bar-track" title={`Completed: ${completedUnits} / ${totalGoal} units`}>
            {/* Surge Zone marker overlay */}
            <div
              className="goal-bar-surge-zone"
              style={{
                left: `${baseQuotaPct}%`,
                width: `${100 - baseQuotaPct}%`,
              }}
              title={`Dynamic Order Surge Zone: +${dynamicSurgeUnits} units added from customer orders`}
            />

            {/* Completed Fill */}
            <div
              className={`goal-bar-fill-completed ${
                isGoalCompleted
                  ? 'on-track'
                  : goalBreakdown.paceStatus === 'critical'
                  ? 'critical'
                  : ''
              }`}
              style={{ width: `${completedPct}%` }}
            >
              <div className="goal-bar-fill-pattern" />
            </div>
          </div>

          {/* Pace & Finish Status Sub-row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={11} color="var(--text-muted)" />
              <span style={{ color: 'var(--text-secondary)' }}>{goalBreakdown.estimatedCompletionTime}</span>
            </div>

            {isGoalCompleted ? (
              <span style={{ color: 'var(--accent-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                <CheckCircle2 size={11} /> GOAL MET ✓
              </span>
            ) : (
              <span
                style={{
                  fontWeight: 700,
                  color:
                    goalBreakdown.paceDeltaUph >= 0
                      ? 'var(--accent-green)'
                      : goalBreakdown.paceDeltaUph >= -15
                      ? 'var(--accent-amber)'
                      : 'var(--accent-red)',
                }}
              >
                Req: {goalBreakdown.requiredUph} UPH ({goalBreakdown.paceDeltaUph >= 0 ? `+${goalBreakdown.paceDeltaUph} Ahead` : `${goalBreakdown.paceDeltaUph} Behind`})
              </span>
            )}
          </div>
        </div>

        {/* Machine Routing Strip */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            ASSIGNED CLEANROOM ROUTING
          </span>
          <div className="machine-route-strip">
            {product.assignedMachines.map((machId, idx) => (
              <React.Fragment key={machId}>
                <span className="machine-tag">{machId}</span>
                {idx < product.assignedMachines.length - 1 && <span className="route-arrow">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Footer: Action Buttons */}
      <div className="product-card-footer">
        <button
          onClick={() => onOpenNewOrder(product.id)}
          className="tech-btn"
          style={{ padding: '5px 10px', fontSize: '11px', gap: '4px' }}
        >
          <Plus size={11} />
          <span>ADD ORDER</span>
        </button>

        <button
          onClick={() => onSelectProduct(product.id)}
          className="tech-btn primary"
          style={{ padding: '5px 12px', fontSize: '11px', gap: '6px' }}
        >
          <span>INSPECT PRODUCT</span>
          <ArrowRight size={11} />
        </button>
      </div>
    </div>
  );
};
