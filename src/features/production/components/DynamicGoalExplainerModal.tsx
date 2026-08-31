import React from 'react';
import { Product, DynamicGoalBreakdown } from '../types/production';
import { X, Calculator } from 'lucide-react';

interface DynamicGoalExplainerModalProps {
  product: Product | null;
  goalBreakdown: DynamicGoalBreakdown | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DynamicGoalExplainerModal: React.FC<DynamicGoalExplainerModalProps> = ({
  product,
  goalBreakdown,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !product || !goalBreakdown) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <span className="corner-tl">+</span>
        <span className="corner-tr">+</span>
        <span className="corner-bl">+</span>
        <span className="corner-br">+</span>

        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={15} color="var(--accent-amber)" />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em' }}>
              DYNAMIC DAILY GOAL CALCULATION ENGINE
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-inverted)', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="modal-body">
          {/* Target Product Summary */}
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-strong)', padding: '12px 14px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              PRODUCT PROFILE
            </span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {product.name} ({product.code.split('//')[0].trim()})
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {product.packageType} • {product.waferTechnology} • Line Cycle Time: {product.cycleTimeSeconds}s
            </div>
          </div>

          {/* Mathematical Equation Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-dark)',
              color: 'var(--text-inverted)',
              padding: '14px 16px',
              border: '1.5px solid var(--border-strong)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent-amber)', letterSpacing: '0.06em' }}>
              MATHEMATICAL FORMULATION
            </div>

            <div style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.6, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
              <span>Today's Adjusted Goal = Base Quota ({goalBreakdown.baseDailyQuota})</span>
              <span>+</span>
              <span style={{ color: 'var(--accent-amber)' }}>
                Σ Order Surge (+{goalBreakdown.totalDynamicAddedUnits})
              </span>
              <span>=</span>
              <span style={{ color: 'var(--accent-green)', fontWeight: 800 }}>
                {goalBreakdown.totalDailyGoal} Units
              </span>
            </div>

            <div style={{ fontSize: '11px', opacity: 0.85, borderTop: '1px solid var(--border-medium)', paddingTop: '8px' }}>
              The goal starts as a fixed baseline quota ({goalBreakdown.baseDailyQuota} units). When orders are placed with approaching deadlines, Vector.AI dynamically scales up today's quota to ensure 100% on-time delivery without factory bottlenecks.
            </div>
          </div>

          {/* Active Orders Breakdown Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
              ACTIVE ORDER ALLOCATIONS CONTRIBUTING TO TODAY'S GOAL ({goalBreakdown.orderAllocations.length})
            </span>

            {goalBreakdown.orderAllocations.length === 0 ? (
              <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-light)', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                No active rush orders. Running at fixed baseline quota ({goalBreakdown.baseDailyQuota} units).
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {goalBreakdown.orderAllocations.map((alloc) => (
                  <div
                    key={alloc.orderId}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-strong)',
                      padding: '10px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '12px' }}>{alloc.customer}</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>({alloc.orderId})</span>
                      </div>
                      <span className={`kpi-pill ${alloc.priority === 'CRITICAL_RUSH' ? 'red' : 'dark'}`}>
                        +{alloc.dynamicAddedUnits} UNITS ADDED
                      </span>
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Deadline: <strong>{alloc.deadlineLabel}</strong> • Order Balance: <strong>{alloc.remainingAmount} / {alloc.orderAmount} u</strong>
                    </div>

                    <div style={{ fontSize: '10px', color: 'var(--accent-amber)', backgroundColor: '#FEF3C7', padding: '4px 8px', border: '1px solid #FDE68A', marginTop: '2px' }}>
                      ⚡ {alloc.urgencyReason}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Throughput & Required Speed Calculation */}
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1.5px solid var(--border-strong)', padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)' }}>
              THROUGHPUT (UPH) & PACE CALCULATION
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>REMAINING TODAY</div>
                <div style={{ fontSize: '16px', fontWeight: 800 }}>{goalBreakdown.remainingToday} units</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>HOURS IN SHIFT</div>
                <div style={{ fontSize: '16px', fontWeight: 800 }}>{goalBreakdown.hoursRemainingInShift} hours</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>REQUIRED THROUGHPUT</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-amber)' }}>
                  {goalBreakdown.requiredUph} UPH
                </div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>CURRENT LIVE SPEED</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-green)' }}>
                  {goalBreakdown.currentUph} UPH
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button
            onClick={onClose}
            className="tech-btn primary"
            style={{ padding: '7px 16px' }}
          >
            CLOSE EXPLAINER
          </button>
        </div>
      </div>
    </div>
  );
};
