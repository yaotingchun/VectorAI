import React, { useState, useMemo } from 'react';
import { Product, OrderPriority } from '../types/production';
import { NewOrderFormData } from '../hooks/useProductionState';
import { X, Plus, Zap, Target } from 'lucide-react';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  preselectedProductId?: string;
  onSubmitOrder: (formData: NewOrderFormData) => void;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  products,
  preselectedProductId,
  onSubmitOrder,
}) => {
  const [productId, setProductId] = useState<string>(
    preselectedProductId || products[0]?.id || ''
  );
  const [customer, setCustomer] = useState<string>('NVIDIA Hyperscale Cluster');
  const [orderAmount, setOrderAmount] = useState<number>(500);
  const [deadlineType, setDeadlineType] = useState<NewOrderFormData['deadlineType']>(
    'TODAY_END_OF_SHIFT'
  );
  const [priority, setPriority] = useState<OrderPriority>('CRITICAL_RUSH');
  const [shiftAssigned, setShiftAssigned] = useState<string>('Shift 2 (Afternoon)');
  const [notes, setNotes] = useState<string>('Priority customer delivery lot with cleanroom test verification.');

  // Set initial product when preselectedProductId changes
  React.useEffect(() => {
    if (preselectedProductId) {
      setProductId(preselectedProductId);
    } else if (products.length > 0 && !productId) {
      setProductId(products[0].id);
    }
  }, [preselectedProductId, products, productId]);

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === productId) || products[0];
  }, [products, productId]);

  // Real-time Dynamic Goal Impact Simulation
  const dynamicGoalImpact = useMemo(() => {
    if (!selectedProduct || orderAmount <= 0) return { dynamicAddedUnits: 0, newTotalGoal: 0, uphImpact: 0 };

    let mult = 1.0;
    if (priority === 'CRITICAL_RUSH') mult = 1.25;
    else if (priority === 'HIGH') mult = 1.10;
    else if (priority === 'MEDIUM') mult = 1.0;
    else mult = 0.90;

    let dynamicUnits = 0;

    switch (deadlineType) {
      case 'TODAY_END_OF_SHIFT':
        dynamicUnits = Math.round(orderAmount * mult);
        break;
      case 'TODAY_MIDNIGHT':
        dynamicUnits = Math.round(orderAmount * 0.60 * mult);
        break;
      case 'TOMORROW_NOON':
        dynamicUnits = Math.round(orderAmount * 0.35 * mult);
        break;
      case 'IN_2_DAYS':
        dynamicUnits = Math.round(orderAmount * 0.50 * mult);
        break;
      case 'IN_4_DAYS':
        dynamicUnits = Math.round(orderAmount * 0.25 * mult);
        break;
    }

    const newTotalGoal = selectedProduct.baseDailyQuota + dynamicUnits;
    const uphImpact = Math.round(dynamicUnits / 4.5); // assuming 4.5h remaining today

    return {
      dynamicAddedUnits: dynamicUnits,
      newTotalGoal,
      uphImpact,
    };
  }, [selectedProduct, orderAmount, deadlineType, priority]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || orderAmount <= 0) return;

    onSubmitOrder({
      productId,
      customer,
      orderAmount,
      deadlineType,
      priority,
      shiftAssigned,
      notes,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <span className="corner-tl">+</span>
        <span className="corner-tr">+</span>
        <span className="corner-bl">+</span>
        <span className="corner-br">+</span>

        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={14} color="var(--accent-amber)" />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em' }}>
              CREATE PRODUCTION WORK ORDER
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-inverted)', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="modal-body">
          {/* Product Select */}
          <div className="form-group">
            <label className="form-label">TARGET PRODUCT / SKU</label>
            <select
              className="form-input"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.packageType} • Base Quota: {p.baseDailyQuota}u)
                </option>
              ))}
            </select>
          </div>

          {/* Customer Account & Order Amount */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">CUSTOMER / CLIENT ACCOUNT</label>
              <input
                type="text"
                className="form-input"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="e.g. Tesla, Apple, NVIDIA"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">ORDER QUANTITY (UNITS)</label>
              <input
                type="number"
                min="10"
                max="50000"
                step="50"
                className="form-input"
                value={orderAmount}
                onChange={(e) => setOrderAmount(parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          {/* Delivery Deadline & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">DELIVERY DEADLINE</label>
              <select
                className="form-input"
                value={deadlineType}
                onChange={(e) => setDeadlineType(e.target.value as NewOrderFormData['deadlineType'])}
              >
                <option value="TODAY_END_OF_SHIFT">Today 21:00 (End of Shift 2) [URGENT]</option>
                <option value="TODAY_MIDNIGHT">Today 23:59 (Midnight Shift)</option>
                <option value="TOMORROW_NOON">Tomorrow 12:00 (Next Day)</option>
                <option value="IN_2_DAYS">In 2 Days (48 Hours)</option>
                <option value="IN_4_DAYS">In 4 Days (Standard Window)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">PRIORITY LEVEL</label>
              <select
                className="form-input"
                value={priority}
                onChange={(e) => setPriority(e.target.value as OrderPriority)}
              >
                <option value="CRITICAL_RUSH">CRITICAL RUSH (+25% Buffer Surge)</option>
                <option value="HIGH">HIGH PRIORITY (+10% Surge)</option>
                <option value="MEDIUM">MEDIUM (Standard Allocation)</option>
                <option value="STANDARD">STANDARD (Smoothed Run)</option>
              </select>
            </div>
          </div>

          {/* Shift Assignment */}
          <div className="form-group">
            <label className="form-label">ASSIGNED PRODUCTION SHIFT</label>
            <input
              type="text"
              className="form-input"
              value={shiftAssigned}
              onChange={(e) => setShiftAssigned(e.target.value)}
              placeholder="e.g. Shift 2 (Afternoon), Cleanroom Line 1"
            />
          </div>

          {/* Order Notes */}
          <div className="form-group">
            <label className="form-label">SPECIFICATIONS / INSTRUCTIONS</label>
            <input
              type="text"
              className="form-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. AEC-Q100 Grade 0 cleanroom packaging"
            />
          </div>

          {/* DYNAMIC GOAL REAL-TIME IMPACT PREVIEW BOX */}
          <div className="goal-preview-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '11px', color: '#92400E' }}>
              <Target size={13} />
              <span>DYNAMIC GOAL ADJUSTMENT PREVIEW</span>
            </div>

            <div style={{ fontSize: '12px', color: '#78350F' }}>
              Submitting this order will dynamically add <strong>+{dynamicGoalImpact.dynamicAddedUnits} units</strong> to today's daily goal for <strong>{selectedProduct.name}</strong>.
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '4px', fontSize: '11px', flexWrap: 'wrap' }}>
              <div>
                Base Quota: <strong>{selectedProduct.baseDailyQuota} u</strong>
              </div>
              <div>→</div>
              <div>
                New Dynamic Goal Today: <strong style={{ color: '#B45309', fontSize: '13px' }}>{dynamicGoalImpact.newTotalGoal} u</strong>
              </div>
              <div style={{ color: '#B45309' }}>
                Required Speed: <strong>+{dynamicGoalImpact.uphImpact} UPH</strong>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer" style={{ margin: '-20px -20px -20px -20px', marginTop: '4px' }}>
            <button
              type="button"
              onClick={onClose}
              className="tech-btn"
              style={{ padding: '7px 14px' }}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="tech-btn primary"
              style={{ padding: '7px 16px', gap: '6px' }}
            >
              <Plus size={13} />
              <span>CREATE ORDER & UPDATE GOAL</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
