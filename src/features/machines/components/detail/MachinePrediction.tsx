import React from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Activity,
  Clock,
  Target,
  FileText,
  RefreshCcw,
  ShieldAlert,
  BarChart2,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Machine } from '../../types/machine';
import { getPredictionScenario } from '../../../prediction/data/predictionScenarios';
import { DegradationChart } from '../../../prediction/components/charts/DegradationChart';
import { getHealthScoreColor } from '../../utils/machineStatus';
import { DetailTab } from './MachineDetail';
import { getMachineRulCalculation } from '../../services/machineApi';

interface MachinePredictionProps {
  machine: Machine;
  onNavigateToMaintenance?: (workOrderId?: string) => void;
  onSelectTab?: (tab: DetailTab) => void;
}

export const MachinePrediction: React.FC<MachinePredictionProps> = ({
  machine,
  onNavigateToMaintenance,
  onSelectTab
}) => {
  const scenario = getPredictionScenario(machine);
  const { color: healthColor } = getHealthScoreColor(machine.healthScore);
  const detailedRul = getMachineRulCalculation(machine);

  const isCritical = scenario.conditionLevel === 'critical';
  const isWarning = scenario.conditionLevel === 'warning';

  const bannerColor = isCritical ? 'var(--accent-red)' : isWarning ? 'var(--accent-amber)' : 'var(--accent-green)';
  const bannerBg = isCritical ? 'rgba(220, 38, 38, 0.08)' : isWarning ? 'rgba(217, 119, 6, 0.08)' : 'rgba(22, 163, 74, 0.08)';
  const BannerIcon = isCritical ? AlertTriangle : isWarning ? AlertCircle : CheckCircle2;

  const riskColor = scenario.failureRisk >= 75 ? 'var(--accent-red)'
                  : scenario.failureRisk >= 45 ? 'var(--accent-amber)'
                  : 'var(--accent-green)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>

      {/* ─── 1. TOP STAT CARDS ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <div className="tech-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.07em' }}>
              MACHINE HEALTH
            </span>
            <Activity size={13} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: healthColor, lineHeight: 1 }}>
            {machine.healthScore}%
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', marginTop: '5px', letterSpacing: '0.04em' }}>
            STATUS: <strong style={{ color: healthColor }}>{machine.status.toUpperCase()}</strong>
          </div>
        </div>

        <div
          className="tech-card"
          style={{
            padding: '14px',
            backgroundColor: isCritical ? 'rgba(220, 38, 38, 0.05)' : undefined,
            borderColor: isCritical ? 'var(--accent-red)' : undefined
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, color: isCritical ? 'var(--accent-red)' : 'var(--text-muted)', letterSpacing: '0.07em' }}>
              FAILURE RISK
            </span>
            <AlertTriangle size={13} style={{ color: riskColor }} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: riskColor, lineHeight: 1 }}>
            {scenario.failureRisk}%
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', marginTop: '5px', letterSpacing: '0.04em' }}>
            SEVERITY: <strong style={{ color: riskColor }}>{isCritical ? 'CRITICAL' : isWarning ? 'ELEVATED' : 'NOMINAL'}</strong>
          </div>
        </div>

        <div className="tech-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.07em' }}>
              REMAINING USEFUL LIFE (RUL)
            </span>
            <Clock size={13} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
            {scenario.rulHours.toLocaleString()}h
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', marginTop: '5px', letterSpacing: '0.04em' }}>
            EST. TIME: <strong>~{machine.rul.estimatedDays} DAYS</strong> ({machine.rul.value.toLocaleString()} {machine.rul.unit})
          </div>
        </div>

        <div className="tech-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.07em' }}>
              PREDICTION CONFIDENCE
            </span>
            <Target size={13} style={{ color: 'var(--accent-green)' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--accent-green)', lineHeight: 1 }}>
            {scenario.rulConfidence}%
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', marginTop: '5px', letterSpacing: '0.04em' }}>
            STAGE: <strong style={{ color: 'var(--text-primary)' }}>{machine.rul.degradationStage.toUpperCase()}</strong>
          </div>
        </div>
      </div>

      {/* ─── 2. PREDICTED ISSUE BANNER ─────────────────────────────────── */}
      <div
        style={{
          backgroundColor: bannerBg,
          border: `1.5px solid ${bannerColor}`,
          padding: '16px 20px',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start'
        }}
      >
        <div style={{ color: bannerColor, flexShrink: 0, marginTop: '2px' }}>
          <BannerIcon size={22} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 700,
              color: bannerColor,
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Sparkles size={12} />
              AI PREDICTIVE DIAGNOSIS · MODEL: HYBRID-RUL-V4
            </div>
            {scenario.expectedFailureWindow && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 8px',
                  backgroundColor: bannerColor,
                  color: 'var(--text-inverted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9.5px',
                  fontWeight: 700,
                  letterSpacing: '0.05em'
                }}
              >
                <Clock size={11} />
                EXPECTED FAILURE WINDOW: {scenario.expectedFailureWindow.toUpperCase()}
              </div>
            )}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.25,
            marginBottom: '8px'
          }}>
            {scenario.mainPrediction}
          </div>
          <p style={{
            margin: 0,
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            lineHeight: 1.5,
            color: 'var(--text-secondary)',
            fontWeight: 500
          }}>
            {scenario.predictedIssueDesc}
          </p>
        </div>
      </div>

      {/* ─── 3. DEGRADATION TREND CHART ────────────────────────────────── */}
      <div className="tech-card">
        <div className="tech-card-header">
          <span className="tech-card-title">
            <BarChart2 size={14} /> DETERMINISTIC DEGRADATION CURVE & RUL PROJECTION
          </span>
          <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            FORMULA-BASED RUL (NO-ML) • BASE: {detailedRul?.baseUsefulLifeHours || 5000}h
          </span>
        </div>
        <div className="tech-card-body">
          <DegradationChart machine={machine} scenario={scenario} />
        </div>
      </div>

      {/* ─── 4. CONTRIBUTING FACTORS + QUALITY RISK ────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* Contributing Factors */}
        <div className="tech-card">
          <div className="tech-card-header">
            <span className="tech-card-title">
              <Activity size={14} /> DEGRADATION PARAMETER CONTRIBUTIONS (Σ w_i = 1.00)
            </span>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              WEIGHTED WEAR
            </span>
          </div>
          <div className="tech-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {detailedRul && detailedRul.parameters.length > 0 ? (
              detailedRul.parameters.map((param, index) => {
                const paramColor = param.status === 'critical' ? 'var(--accent-red)'
                                  : param.status === 'warning' ? 'var(--accent-amber)'
                                  : 'var(--accent-green)';
                const wearPct = Math.round(param.individualDegradation * 100);
                return (
                  <div key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        letterSpacing: '0.02em'
                      }}>
                        {param.parameter} <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>(w={param.weight.toFixed(2)})</span>
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: paramColor }}>
                        {wearPct}% wear ({param.percentageOfTotalWear}% share)
                      </span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.max(wearPct, 3)}%`,
                          backgroundColor: paramColor,
                          transition: 'width 0.4s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              scenario.contributingFactors.map((factor, index) => {
                const factorColor = factor.status === 'critical' ? 'var(--accent-red)'
                                  : factor.status === 'warning' ? 'var(--accent-amber)'
                                  : 'var(--accent-green)';
                return (
                  <div key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        letterSpacing: '0.02em'
                      }}>
                        {factor.name}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: factorColor }}>
                        {factor.pct}%
                      </span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${factor.pct}%`,
                          backgroundColor: factorColor,
                          transition: 'width 0.4s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quality Risk */}
        <div className="tech-card">
          <div className="tech-card-header">
            <span className="tech-card-title">
              <ShieldAlert size={14} /> QUALITY & YIELD RISK ASSESSMENT
            </span>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              DEFECT PROBABILITY
            </span>
          </div>
          <div className="tech-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '32px',
                fontWeight: 800,
                color: scenario.qualityRiskScore >= 45 ? 'var(--accent-red)'
                     : scenario.qualityRiskScore >= 20 ? 'var(--accent-amber)'
                     : 'var(--accent-green)',
                lineHeight: 1
              }}>
                {scenario.qualityRiskScore}%
              </span>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--text-primary)'
              }}>
                {scenario.qualityRiskTitle}
              </span>
            </div>
            <p style={{
              margin: 0,
              fontFamily: 'var(--font-sans)',
              fontSize: '12.5px',
              lineHeight: 1.6,
              color: 'var(--text-secondary)'
            }}>
              {scenario.qualityRiskExplanation}
            </p>
          </div>
        </div>
      </div>

      {/* ─── 5. PRODUCTION IMPACT GRID ─────────────────────────────────── */}
      <div className="tech-card">
        <div className="tech-card-header">
          <span className="tech-card-title">
            <TrendingDown size={14} /> ESTIMATED PRODUCTION IMPACT
          </span>
          <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            UNPLANNED OUTAGE FORECAST
          </span>
        </div>
        <div className="tech-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div className="telemetry-item">
              <div className="telemetry-label">ESTIMATED DOWNTIME</div>
              <div
                className="telemetry-value"
                style={{
                  color: isCritical ? 'var(--accent-red)' : isWarning ? 'var(--accent-amber)' : 'var(--text-primary)'
                }}
              >
                {scenario.productionImpactDowntime} hrs
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Required for component replacement & recalibration</div>
            </div>

            <div className="telemetry-item">
              <div className="telemetry-label">THROUGHPUT IMPACT</div>
              <div
                className="telemetry-value"
                style={{
                  color: isWarning || isCritical ? 'var(--accent-amber)' : 'var(--text-primary)'
                }}
              >
                −{scenario.productionImpactThroughputLoss}%
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Line capacity reduction until maintenance window</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 6. RECOMMENDED ACTION ─────────────────────────────────────── */}
      <div className="tech-card">
        <div className="tech-card-header">
          <span className="tech-card-title">
            <RefreshCcw size={14} /> PRESCRIPTIVE AI RECOMMENDATION
          </span>
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: isCritical ? 'var(--accent-red)' : 'var(--accent-amber)',
              backgroundColor: isCritical ? 'rgba(220, 38, 38, 0.1)' : 'rgba(217, 119, 6, 0.1)',
              border: `1px solid ${isCritical ? 'var(--accent-red)' : 'var(--accent-amber)'}`,
              padding: '2px 8px'
            }}
          >
            ACTION REQUIRED
          </span>
        </div>
        <div className="tech-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{
            margin: 0,
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.5
          }}>
            {scenario.recommendedAction}
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '4px' }}>
            <button
              onClick={() => {
                if (onNavigateToMaintenance) {
                  onNavigateToMaintenance(machine.maintenance?.workOrderId);
                } else if (onSelectTab) {
                  onSelectTab('maintenance');
                }
              }}
              className="tech-btn primary"
              style={{ padding: '8px 16px', fontSize: '11px' }}
            >
              <RefreshCcw size={13} />
              <span>SCHEDULE / OPEN MAINTENANCE</span>
              <ArrowRight size={12} />
            </button>

            {scenario.documentLink && (
              <button
                onClick={() => {
                  if (onSelectTab) {
                    onSelectTab('documents');
                  }
                }}
                className="tech-btn"
                style={{ padding: '8px 16px', fontSize: '11px' }}
              >
                <FileText size={13} />
                <span>VIEW MANUAL: {scenario.documentLink.id}</span>
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default MachinePrediction;
