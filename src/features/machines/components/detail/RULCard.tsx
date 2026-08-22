import React from 'react';
import { MachineRUL } from '../../types/machine';
import { Clock } from 'lucide-react';

interface RULCardProps {
  rul: MachineRUL;
}

export const RULCard: React.FC<RULCardProps> = ({ rul }) => {
  const isUrgent = rul.value < 200;
  const isCritical = rul.value < 50;

  let accentColor = 'var(--accent-green)';
  let bgHighlight = 'rgba(22, 163, 74, 0.08)';

  if (isCritical) {
    accentColor = 'var(--accent-red)';
    bgHighlight = 'rgba(220, 38, 38, 0.1)';
  } else if (isUrgent) {
    accentColor = 'var(--accent-amber)';
    bgHighlight = 'rgba(217, 119, 6, 0.1)';
  }

  const maxHours = 1500;
  const percentage = Math.min(Math.max((rul.value / maxHours) * 100, 4), 100);

  return (
    <div className="tech-card" style={{ borderColor: isUrgent ? accentColor : 'var(--border-strong)' }}>
      {/* Corner Markers */}
      <span className="corner-tl">+</span>
      <span className="corner-tr">+</span>

      <div className="tech-card-header">
        <span className="tech-card-title">
          <Clock size={15} /> REMAINING USEFUL LIFE (RUL) INFERENCE
        </span>
        <span
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            padding: '3px 8px',
            border: '1px solid var(--border-strong)',
            backgroundColor: 'var(--bg-card)',
            fontWeight: 700
          }}
        >
          AI WEIBULL / LSTM MODEL
        </span>
      </div>

      <div className="tech-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Top Metric Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '16px',
            backgroundColor: bgHighlight,
            border: `1.5px solid ${accentColor}`
          }}
        >
          <div>
            <div
              style={{
                fontSize: 'var(--text-xs, 11px)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: '0.08em'
              }}
            >
              ESTIMATED TIME TO FAILURE
            </div>
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontVariantNumeric: 'tabular-nums',
                fontSize: '34px',
                fontWeight: 800,
                color: accentColor,
                lineHeight: 1.1,
                marginTop: '2px'
              }}
            >
              {rul.value.toLocaleString()}{' '}
              <span style={{ fontSize: '16px', fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--text-primary)' }}>
                {rul.unit}
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'var(--text-xs, 11px)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
              REPLACEMENT HORIZON
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontVariantNumeric: 'tabular-nums', fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              ~{rul.estimatedDays} Days
            </div>
            <div
              style={{
                fontSize: '12px',
                fontFamily: 'var(--font-sans)',
                color: 'var(--text-secondary)',
                marginTop: '4px'
              }}
            >
              Confidence: <strong style={{ color: 'var(--text-primary)' }}>{Math.round(rul.confidence * 100)}%</strong>
            </div>
          </div>
        </div>

        {/* Life Remaining Gauge */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              marginBottom: '6px'
            }}
          >
            <span>DEGRADATION STAGE: <strong style={{ color: 'var(--text-primary)' }}>{rul.degradationStage.toUpperCase()}</strong></span>
            <span>CRITICAL LIMIT: {rul.criticalThresholdHours} hrs</span>
          </div>

          <div
            style={{
              width: '100%',
              height: '10px',
              backgroundColor: 'var(--bg-muted)',
              border: '1.5px solid var(--border-strong)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${percentage}%`,
                height: '100%',
                backgroundColor: accentColor,
                transition: 'width 0.5s ease'
              }}
            />
          </div>
        </div>

        {/* Operational Context note */}
        <div
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-sans)',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            padding: '10px 14px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-light)'
          }}
        >
          {isCritical ? (
            <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>
              CRITICAL NOTICE: RUL is below emergency maintenance threshold ({rul.criticalThresholdHours} hrs). Automatic lot rerouting recommended.
            </span>
          ) : isUrgent ? (
            <span style={{ color: '#92400E', fontWeight: 600 }}>
              <strong style={{ color: '#78350F' }}>WARNING:</strong> Accelerated mechanical tool wear observed. Preventive component replacement should be planned within {rul.estimatedDays} days.
            </span>
          ) : (
            <span>
              <strong>NOMINAL:</strong> Component degradation rate matches expected lifespan curve. Next scheduled PM occurs before predicted threshold.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
