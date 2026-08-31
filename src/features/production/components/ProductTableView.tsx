import React from 'react';
import { Product, DynamicGoalBreakdown } from '../types/production';
import { ArrowRight, Plus, CheckCircle2 } from 'lucide-react';

interface ProductTableViewProps {
  products: Product[];
  dynamicGoalsMap: Map<string, DynamicGoalBreakdown>;
  onSelectProduct: (productId: string) => void;
  onOpenNewOrder: (productId: string) => void;
  onOpenExplainer: (productId: string) => void;
}

export const ProductTableView: React.FC<ProductTableViewProps> = ({
  products,
  dynamicGoalsMap,
  onSelectProduct,
  onOpenNewOrder,
  onOpenExplainer,
}) => {
  return (
    <div className="production-table-container">
      <table className="production-table">
        <thead>
          <tr>
            <th>Product Identity & SKU</th>
            <th>Package & Tech</th>
            <th>Throughput (UPH)</th>
            <th>Today's Dynamic Goal & Progress</th>
            <th>Yield / Scrap</th>
            <th>Pace & Shift Status</th>
            <th>Cleanroom Line</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const goal = dynamicGoalsMap.get(product.id);
            const totalGoal = goal?.totalDailyGoal || product.baseDailyQuota;
            const completed = goal?.producedToday || product.currentProducedToday;
            const pct = totalGoal > 0 ? Math.min(100, Math.round((completed / totalGoal) * 100)) : 100;
            const isAhead = (goal?.paceDeltaUph || 0) >= 0;
            const isCompleted = completed >= totalGoal;

            return (
              <tr key={product.id}>
                {/* 1. Identity */}
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>
                      {product.code.split('//')[0].trim()}
                    </span>
                    <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                      {product.name}
                    </strong>
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                      {product.categoryLabel}
                    </span>
                  </div>
                </td>

                {/* 2. Package & Tech */}
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <span className="kpi-pill dark" style={{ width: 'fit-content' }}>
                      {product.packageType}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      {product.waferTechnology}
                    </span>
                  </div>
                </td>

                {/* 3. UPH */}
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '16px',
                          fontWeight: 800,
                          color: product.currentUph >= product.targetUph ? 'var(--accent-green)' : 'var(--accent-amber)',
                        }}
                      >
                        {product.currentUph}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        / {product.targetUph} UPH
                      </span>
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                      Nominal: {product.nominalUph} UPH • {product.cycleTimeSeconds}s
                    </span>
                  </div>
                </td>

                {/* 4. Dynamic Goal Progress */}
                <td style={{ minWidth: '220px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                      <span>
                        <strong>{completed.toLocaleString()}</strong> / {totalGoal.toLocaleString()} u
                      </span>
                      <span style={{ fontWeight: 700 }}>{pct}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ height: '8px', background: 'var(--bg-muted)', border: '1px solid var(--border-strong)', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          backgroundColor: isCompleted ? '#15803d' : '#121315',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)' }}>
                      <span>Base: {product.baseDailyQuota} + Surge: +{goal?.totalDynamicAddedUnits || 0}</span>
                      <button
                        onClick={() => onOpenExplainer(product.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', textDecoration: 'underline', cursor: 'pointer', fontSize: '9px', padding: 0 }}
                      >
                        Math
                      </button>
                    </div>
                  </div>
                </td>

                {/* 5. Yield / Scrap */}
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>
                      {product.yieldRate}% Yield
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      {product.scrapRate}% Scrap
                    </span>
                  </div>
                </td>

                {/* 6. Pace & Status */}
                <td>
                  {isCompleted ? (
                    <span className="kpi-pill green" style={{ gap: '3px' }}>
                      <CheckCircle2 size={10} /> GOAL MET
                    </span>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span className={`kpi-pill ${isAhead ? 'green' : 'amber'}`}>
                        {isAhead ? `+${goal?.paceDeltaUph} UPH Ahead` : `${goal?.paceDeltaUph} Behind`}
                      </span>
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                        Req: {goal?.requiredUph} UPH
                      </span>
                    </div>
                  )}
                </td>

                {/* 7. Line Machines */}
                <td>
                  <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                    {product.assignedMachines.slice(0, 3).map((m) => (
                      <span key={m} className="machine-tag">{m}</span>
                    ))}
                    {product.assignedMachines.length > 3 && (
                      <span className="machine-tag">+{product.assignedMachines.length - 3}</span>
                    )}
                  </div>
                </td>

                {/* 8. Actions */}
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button
                      onClick={() => onOpenNewOrder(product.id)}
                      className="tech-btn"
                      style={{ padding: '4px 8px', fontSize: '10px' }}
                      title="Add Order"
                    >
                      <Plus size={10} />
                    </button>
                    <button
                      onClick={() => onSelectProduct(product.id)}
                      className="tech-btn primary"
                      style={{ padding: '4px 10px', fontSize: '10px', gap: '4px' }}
                    >
                      <span>INSPECT</span>
                      <ArrowRight size={10} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
