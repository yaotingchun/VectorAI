import React, { useState } from 'react';
import {
  Product,
  ProductionOrder,
  DynamicGoalBreakdown,
  OrderStatus,
} from '../types/production';
import { HourlyUphChart } from './HourlyUphChart';
import {
  X,
  Plus,
  Layers,
  Activity,
  Cpu,
  Settings,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

interface ProductDetailDrawerProps {
  product: Product | null;
  goalBreakdown: DynamicGoalBreakdown | null;
  orders: ProductionOrder[];
  isOpen: boolean;
  onClose: () => void;
  onOpenNewOrder: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  onUpdateBaseQuota: (productId: string, newQuota: number) => void;
}

type DrawerTab = 'orders' | 'uph_analytics' | 'routing' | 'quota_settings';

export const ProductDetailDrawer: React.FC<ProductDetailDrawerProps> = ({
  product,
  goalBreakdown,
  orders,
  isOpen,
  onClose,
  onOpenNewOrder,
  onUpdateOrderStatus,
  onDeleteOrder,
  onUpdateBaseQuota,
}) => {
  const [activeTab, setActiveTab] = useState<DrawerTab>('orders');
  const [editingQuota, setEditingQuota] = useState<number>(product?.baseDailyQuota || 800);

  // Sync editing quota when product changes
  React.useEffect(() => {
    if (product) {
      setEditingQuota(product.baseDailyQuota);
    }
  }, [product]);

  if (!isOpen || !product || !goalBreakdown) return null;

  const productOrders = orders.filter((o) => o.productId === product.id);

  const handleSaveQuota = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBaseQuota(product.id, editingQuota);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="inspector-drawer-backdrop" onClick={onClose} />

      {/* Slide-out Drawer Panel */}
      <aside className="drawer-panel" aria-label="Product Deep-Dive Telemetry">
        <span className="corner-tl">+</span>
        <span className="corner-bl">+</span>

        {/* Drawer Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>
              {product.code}
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {product.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
              <span className="kpi-pill dark">{product.packageType}</span>
              <span className="kpi-pill green">Yield: {product.yieldRate}%</span>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                ${product.unitPriceUsd} / unit
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-surface)',
              border: '1.5px solid var(--border-strong)',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Top Mini KPI Bar */}
        <div
          style={{
            backgroundColor: 'var(--bg-dark)',
            color: 'var(--text-inverted)',
            padding: '10px 16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            borderBottom: '1.5px solid var(--border-strong)',
          }}
        >
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '9px' }}>LIVE THROUGHPUT</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-green)' }}>
              {product.currentUph} UPH
            </div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '9px' }}>TODAY GOAL</span>
            <div style={{ fontSize: '15px', fontWeight: 800 }}>
              {goalBreakdown.totalDailyGoal} u
            </div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '9px' }}>DONE TODAY</span>
            <div style={{ fontSize: '15px', fontWeight: 800 }}>
              {goalBreakdown.producedToday} u ({goalBreakdown.progressPercent}%)
            </div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '9px' }}>REQUIRED PACE</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-amber)' }}>
              {goalBreakdown.requiredUph} UPH
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="drawer-tabs-bar">
          <button
            className={`drawer-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Layers size={11} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Orders ({productOrders.length})
          </button>
          <button
            className={`drawer-tab-btn ${activeTab === 'uph_analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('uph_analytics')}
          >
            <Activity size={11} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            24H UPH Chart
          </button>
          <button
            className={`drawer-tab-btn ${activeTab === 'routing' ? 'active' : ''}`}
            onClick={() => setActiveTab('routing')}
          >
            <Cpu size={11} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Line Routing ({product.assignedMachines.length})
          </button>
          <button
            className={`drawer-tab-btn ${activeTab === 'quota_settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('quota_settings')}
          >
            <Settings size={11} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Goal Config
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="drawer-body">
          {/* TAB 1: ORDERS & WORKLOADS */}
          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700 }}>
                  ACTIVE CUSTOMER BATCH ORDERS
                </span>
                <button
                  onClick={() => onOpenNewOrder(product.id)}
                  className="tech-btn primary"
                  style={{ padding: '4px 10px', fontSize: '10px', gap: '4px' }}
                >
                  <Plus size={10} />
                  <span>+ ADD ORDER</span>
                </button>
              </div>

              {productOrders.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px', border: '1px dashed var(--border-light)' }}>
                  No active orders for this product.
                </div>
              ) : (
                productOrders.map((order) => {
                  const pct = Math.min(100, Math.round((order.completedAmount / order.orderAmount) * 100));
                  const isDone = order.status === 'COMPLETED';

                  return (
                    <div key={order.id} className="drawer-order-card">
                      <div className="drawer-order-header">
                        <div>
                          <div className="order-customer-name">{order.customer}</div>
                          <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                            {order.id} • Lot: {order.lotBatchId} • {order.shiftAssigned}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className={`kpi-pill ${order.priority === 'CRITICAL_RUSH' ? 'red' : 'dark'}`}>
                            {order.priority.replace('_', ' ')}
                          </span>
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, isDone ? 'IN_PRODUCTION' : 'COMPLETED')}
                            style={{
                              background: isDone ? '#DCFCE7' : 'transparent',
                              border: '1px solid var(--border-strong)',
                              color: isDone ? '#166534' : 'var(--text-secondary)',
                              cursor: 'pointer',
                              padding: '2px 6px',
                              fontSize: '9px',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                            }}
                            title={isDone ? 'Reopen order' : 'Mark order completed'}
                          >
                            <CheckCircle2 size={10} />
                            <span>{isDone ? 'DONE' : 'COMPLETE'}</span>
                          </button>
                          <button
                            onClick={() => onDeleteOrder(order.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                            title="Delete order"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                          <span>
                            Progress: <strong>{order.completedAmount.toLocaleString()}</strong> / {order.orderAmount.toLocaleString()} units
                          </span>
                          <span style={{ fontWeight: 700 }}>{pct}%</span>
                        </div>
                        <div className="order-progress-track">
                          <div
                            className="order-progress-fill"
                            style={{ width: `${pct}%`, backgroundColor: isDone ? '#15803d' : '#121315' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                        <span>Deadline: <strong>{order.deadline}</strong></span>
                        <span>Value: <strong>${(order.revenueUsd / 1000).toFixed(0)}k</strong></span>
                      </div>

                      {order.notes && (
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic', backgroundColor: 'var(--bg-card)', padding: '4px 8px', border: '1px solid var(--border-light)' }}>
                          {order.notes}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: 24H UPH ANALYTICS */}
          {activeTab === 'uph_analytics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: 'var(--bg-surface)', border: '1.5px solid var(--border-strong)', padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700 }}>
                    24-HOUR MEASURED THROUGHPUT (UPH) VS TARGET
                  </span>
                  <span className="kpi-pill dark">REAL-TIME TELEMETRY</span>
                </div>

                <HourlyUphChart
                  hourlyData={product.hourlyHistory}
                  targetUph={product.targetUph}
                  nominalUph={product.nominalUph}
                  height={190}
                />
              </div>

              {/* Analytics Telemetry Data Grid */}
              <div className="telemetry-grid">
                <div className="telemetry-item">
                  <span className="telemetry-label">LIVE SPEED</span>
                  <span className="telemetry-value">{product.currentUph} UPH</span>
                </div>
                <div className="telemetry-item">
                  <span className="telemetry-label">TARGET SPEED</span>
                  <span className="telemetry-value">{product.targetUph} UPH</span>
                </div>
                <div className="telemetry-item">
                  <span className="telemetry-label">PEAK SPEED TODAY</span>
                  <span className="telemetry-value">{product.peakUphToday} UPH</span>
                </div>
                <div className="telemetry-item">
                  <span className="telemetry-label">SHIFT AVERAGE</span>
                  <span className="telemetry-value">{product.shiftAverageUph} UPH</span>
                </div>
                <div className="telemetry-item">
                  <span className="telemetry-label">CYCLE TIME</span>
                  <span className="telemetry-value">{product.cycleTimeSeconds}s</span>
                </div>
                <div className="telemetry-item">
                  <span className="telemetry-label">CLEANROOM YIELD</span>
                  <span className="telemetry-value">{product.yieldRate}%</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CLEANROOM MACHINES & ROUTING */}
          {activeTab === 'routing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700 }}>
                ASSIGNED FABRICATION & ASSEMBLY STAGES
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {product.assignedMachines.map((machineId, index) => {
                  const stageNames = [
                    'Stage 1: Precision Wafer Dicing & Prep',
                    'Stage 2: High-Speed Die Attach & Bonding',
                    'Stage 3: Ultrasonic Wire Bonding',
                    'Stage 4: Epoxy Resin Transfer Molding',
                    'Stage 5: High-Frequency ATE Electrical Sort',
                  ];

                  return (
                    <div
                      key={machineId}
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        border: '1.5px solid var(--border-strong)',
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            backgroundColor: 'var(--bg-dark)',
                            color: 'var(--text-inverted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 800,
                            fontSize: '12px',
                          }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700 }}>
                            {machineId} - {stageNames[index] || 'Semiconductor Processing Stage'}
                          </div>
                          <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                            Active recipe loaded • Calibration status: Verified
                          </div>
                        </div>
                      </div>

                      <span className="kpi-pill green">OPERATIONAL</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: GOAL CONFIG & BASE QUOTA */}
          {activeTab === 'quota_settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: 'var(--bg-surface)', border: '1.5px solid var(--border-strong)', padding: '14px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700 }}>
                  ADJUST FIXED BASE DAILY QUOTA
                </span>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: '12px' }}>
                  The base daily quota is the scheduled baseline target before order-based dynamic increases are applied.
                </p>

                <form onSubmit={handleSaveQuota} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">BASE QUOTA (UNITS/DAY)</label>
                    <input
                      type="number"
                      min="100"
                      max="10000"
                      step="50"
                      className="form-input"
                      value={editingQuota}
                      onChange={(e) => setEditingQuota(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <button type="submit" className="tech-btn primary" style={{ padding: '8px 16px' }}>
                    SAVE QUOTA
                  </button>
                </form>
              </div>

              {/* Dynamic Goal Formula Summary */}
              <div style={{ backgroundColor: '#FEF3C7', border: '1.5px solid #D97706', padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                <strong style={{ color: '#92400E' }}>DYNAMIC GOAL SUMMARY FOR TODAY:</strong>
                <div style={{ marginTop: '6px', color: '#78350F' }}>
                  • Fixed Base Quota: <strong>{product.baseDailyQuota} units</strong>
                  <br />
                  • Dynamic Customer Order Workloads: <strong>+{goalBreakdown.totalDynamicAddedUnits} units</strong>
                  <br />
                  • Effective Adjusted Goal Today: <strong>{goalBreakdown.totalDailyGoal} units</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
