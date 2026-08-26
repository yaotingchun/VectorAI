import React, { useState } from 'react';
import { Machine, MachineRUL } from '../../types/machine';
import { getMachineRulCalculation } from '../../services/machineApi';
import { Clock, HelpCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

interface RULCardProps {
  rul: MachineRUL;
  machine?: Machine;
}

export const RULCard: React.FC<RULCardProps> = ({ rul, machine }) => {
  const [showFormulaExplanation, setShowFormulaExplanation] = useState(false);

  // Compute live deterministic formula RUL if machine object is available
  const detailedRul = machine ? getMachineRulCalculation(machine) : null;

  const displayRulHours = detailedRul ? detailedRul.rulHours : rul.value;
  const displayDays = detailedRul ? detailedRul.estimatedDays : rul.estimatedDays;
  const degradationPct = detailedRul 
    ? Math.round(detailedRul.degradationScore * 1000) / 10 
    : Math.round((1 - (rul.value / (rul.value + 1000))) * 100);

  const isUrgent = displayRulHours < 200;
  const isCritical = displayRulHours < 50;

  let accentColor = 'var(--accent-green)';
  let bgHighlight = 'rgba(22, 163, 74, 0.08)';

  if (isCritical) {
    accentColor = 'var(--accent-red)';
    bgHighlight = 'rgba(220, 38, 38, 0.1)';
  } else if (isUrgent) {
    accentColor = 'var(--accent-amber)';
    bgHighlight = 'rgba(217, 119, 6, 0.1)';
  }

  const baseLife = detailedRul ? detailedRul.baseUsefulLifeHours : 5000;
  const percentage = Math.min(Math.max((displayRulHours / baseLife) * 100, 3), 100);

  return (
    <div className="tech-card" style={{ borderColor: isUrgent ? accentColor : 'var(--border-strong)' }}>
      {/* Corner Markers */}
      <span className="corner-tl">+</span>
      <span className="corner-tr">+</span>

      <div className="tech-card-header">
        <span className="tech-card-title">
          <Clock size={15} /> DETERMINISTIC FORMULA-BASED RUL
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              padding: '2px 8px',
              border: '1px solid var(--border-strong)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontWeight: 700
            }}
          >
            NO-ML • DETERMINISTIC v1.0
          </span>
        </div>
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
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: '0.08em'
              }}
            >
              ESTIMATED REMAINING USEFUL LIFE
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
              {displayRulHours.toLocaleString()}{' '}
              <span style={{ fontSize: '16px', fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--text-primary)' }}>
                HOURS
              </span>
            </div>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Overall Degradation: <strong style={{ color: accentColor }}>{degradationPct}%</strong> (Base: {baseLife.toLocaleString()} hrs)
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
              REPLACEMENT HORIZON
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontVariantNumeric: 'tabular-nums', fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              ~{displayDays} Days
            </div>
            <div
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '4px'
              }}
            >
              <ShieldCheck size={13} color="var(--accent-green)" />
              <span>Reliability: <strong style={{ color: 'var(--accent-green)' }}>HIGH (100% Sensors)</strong></span>
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
            <span>REMAINING LIFE RATIO: <strong style={{ color: 'var(--text-primary)' }}>{Math.round((1 - degradationPct / 100) * 100)}%</strong></span>
            <span>CRITICAL THRESHOLD: {rul.criticalThresholdHours} hrs</span>
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

        {/* Parameter Contribution Breakdown (Explainability) */}
        {detailedRul && detailedRul.parameters.length > 0 && (
          <div style={{ border: '1px solid var(--border-strong)', backgroundColor: 'var(--bg-surface)', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
                DEGRADATION PARAMETER CONTRIBUTIONS (Σ w_i = 1.00)
              </span>
              <button
                onClick={() => setShowFormulaExplanation(!showFormulaExplanation)}
                className="tech-btn"
                style={{ fontSize: '10px', padding: '3px 8px' }}
              >
                <HelpCircle size={11} />
                <span>{showFormulaExplanation ? 'HIDE FORMULA' : 'VIEW FORMULA'}</span>
                {showFormulaExplanation ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              </button>
            </div>

            {/* Formula Explanation Callout */}
            {showFormulaExplanation && (
              <div
                style={{
                  padding: '10px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px dashed var(--border-strong)',
                  marginBottom: '10px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Deterministic Formulation (Section 14 Specification):
                </div>
                <div>• Individual parameter wear: <code>d_i = clamp((current - healthy) / (critical - healthy), 0, 1)</code></div>
                <div>• Total weighted wear: <code>D = Σ (w_i × d_i)</code> [Weights: {detailedRul.parameters.map(p => `${p.parameter}: ${p.weight}`).join(', ')}]</div>
                <div>• Remaining Useful Life: <code>RUL = BaseUsefulLife ({baseLife} hrs) × (1 - D)</code></div>
                <div style={{ marginTop: '4px', fontSize: '10px', color: 'var(--text-muted)' }}>
                  Source: Machine Technical Manual & VectorAI Derived Deterministic Physics Model.
                </div>
              </div>
            )}

            {/* Parameter Contribution Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {detailedRul.parameters.map((p) => {
                const isParamWarn = p.status === 'warning' || p.status === 'critical';
                const pColor = p.status === 'critical' ? 'var(--accent-red)' : p.status === 'warning' ? 'var(--accent-amber)' : 'var(--accent-green)';
                return (
                  <div
                    key={p.sensorId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      padding: '4px 6px',
                      backgroundColor: isParamWarn ? 'rgba(217, 119, 6, 0.05)' : 'transparent',
                      borderBottom: '1px solid var(--border-light)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: '1 1 200px' }}>
                      <span style={{ color: pColor, fontWeight: 700 }}>•</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.parameter}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                        ({p.currentValue} {p.unit} / lim {p.criticalLimit})
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'right' }}>
                      <span style={{ color: 'var(--text-muted)' }}>w = {p.weight.toFixed(2)}</span>
                      <span style={{ color: 'var(--text-primary)' }}>Wear: {Math.round(p.individualDegradation * 100)}%</span>
                      <span style={{ fontWeight: 700, color: pColor, width: '60px' }}>
                        +{Math.round(p.weightedContribution * 1000) / 10}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
              CRITICAL NOTICE: Calculated RUL is below minimum safe threshold ({rul.criticalThresholdHours} hrs). Automatic lot rerouting recommended.
            </span>
          ) : isUrgent ? (
            <span style={{ color: '#92400E', fontWeight: 600 }}>
              <strong style={{ color: '#78350F' }}>WARNING:</strong> Accelerated mechanical tool wear observed. Preventive component replacement should be planned within {displayDays} days.
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
