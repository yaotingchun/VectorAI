import React from 'react';
import {
  ArrowLeft, AlertTriangle, AlertCircle, Activity, Clock, Target,
  FileText, RefreshCcw, ShieldAlert, BarChart2
} from 'lucide-react';
import { Machine } from '../../machines/types/machine';
import { getPredictionScenario } from '../data/predictionScenarios';
import { DegradationChart } from './charts/DegradationChart';
import { getHealthScoreColor } from '../../machines/utils/machineStatus';
import { MACHINE_TYPES } from '../../machines/data/machineTypes';

interface PredictionDetailProps {
  machine: Machine;
  onBack: () => void;
}

export const PredictionDetail: React.FC<PredictionDetailProps> = ({ machine, onBack }) => {
  const scenario = getPredictionScenario(machine);
  const { color: healthColor } = getHealthScoreColor(machine.healthScore);
  const typeDef = MACHINE_TYPES[machine.machineType];
  const typeName = typeDef?.name ?? machine.machineType;

  const isCritical  = scenario.conditionLevel === 'critical';
  const isWarning   = scenario.conditionLevel === 'warning';

  const bannerColor  = isCritical ? '#DC2626' : isWarning ? '#D97706' : '#16A34A';
  const bannerBg     = isCritical ? 'rgba(220,38,38,0.08)' : isWarning ? 'rgba(217,119,6,0.07)' : 'rgba(22,163,74,0.07)';
  const BannerIcon   = isCritical ? AlertTriangle : isWarning ? AlertCircle : Activity;

  const riskColor = scenario.failureRisk >= 75 ? '#DC2626'
                  : scenario.failureRisk >= 45 ? '#D97706'
                  : '#16A34A';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>

      {/* ══════════════════════════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        flexShrink: 0,
        padding: '12px 20px',
        backgroundColor: 'var(--bg-card)',
        borderBottom: '2px solid var(--border-strong)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px',
            backgroundColor: 'transparent',
            border: '1.5px solid var(--border-light)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
            cursor: 'pointer', letterSpacing: '0.05em', flexShrink: 0
          }}
        >
          <ArrowLeft size={12} /> BACK
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
            <h2 style={{
              margin: 0,
              fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800,
              color: 'var(--text-primary)', letterSpacing: '0.04em', textTransform: 'uppercase'
            }}>
              {machine.id}
            </h2>
            <span style={{
              fontFamily: 'var(--font-sans)', fontSize: '13px',
              color: 'var(--text-muted)', fontWeight: 500
            }}>
              {typeName} · {machine.location.area}
            </span>
          </div>
          <p style={{
            margin: '2px 0 0',
            fontFamily: 'var(--font-mono)', fontSize: '10px',
            color: 'var(--text-muted)', letterSpacing: '0.04em'
          }}>
            PREDICTION DETAIL · Degradation: {machine.rul.degradationStage.toUpperCase()}
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SCROLLABLE CONTENT
      ══════════════════════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* ─── STAT ROW ─────────────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>

            <StatCard
              label="MACHINE HEALTH"
              value={`${machine.healthScore}%`}
              color={healthColor}
              sub={machine.status.toUpperCase()}
              icon={<Activity size={13} />}
            />
            <StatCard
              label="FAILURE RISK"
              value={`${scenario.failureRisk}%`}
              color={riskColor}
              sub={isCritical ? 'High' : isWarning ? 'Medium' : 'Low'}
              icon={<AlertTriangle size={13} />}
              highlight={isCritical}
            />
            <StatCard
              label="REMAINING USEFUL LIFE"
              value={`${scenario.rulHours}h`}
              color="var(--text-primary)"
              sub={`~${machine.rul.estimatedDays}d`}
              icon={<Clock size={13} />}
            />
            <StatCard
              label="PREDICTION CONFIDENCE"
              value={`${scenario.rulConfidence}%`}
              color="#16A34A"
              sub={machine.rul.degradationStage}
              icon={<Target size={13} />}
            />
          </div>

          {/* ─── PREDICTED ISSUE BANNER ───────────────────────────────────── */}
          <div style={{
            backgroundColor: bannerBg,
            border: `2px solid ${bannerColor}`,
            padding: '16px 20px',
            display: 'flex', gap: '14px', alignItems: 'flex-start'
          }}>
            <div style={{ color: bannerColor, flexShrink: 0, marginTop: '2px' }}>
              <BannerIcon size={22} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
                color: bannerColor, letterSpacing: '0.07em', marginBottom: '6px'
              }}>
                PREDICTED ISSUE
              </div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800,
                color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '8px'
              }}>
                {scenario.mainPrediction}
              </div>
              <p style={{
                margin: 0,
                fontFamily: 'var(--font-sans)', fontSize: '13px', lineHeight: 1.5,
                color: 'var(--text-secondary)', fontWeight: 500
              }}>
                {scenario.predictedIssueDesc}
              </p>
              {scenario.expectedFailureWindow && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  marginTop: '10px', padding: '4px 10px',
                  backgroundColor: bannerColor, color: '#fff',
                  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
                  letterSpacing: '0.05em'
                }}>
                  <Clock size={11} />
                  EXPECTED FAILURE WINDOW: {scenario.expectedFailureWindow.toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* ─── DEGRADATION TREND CHART ──────────────────────────────────── */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1.5px solid var(--border-light)',
            padding: '16px 20px'
          }}>
            <SectionHeader icon={<BarChart2 size={13} />} label="DEGRADATION TREND" />
            <DegradationChart machine={machine} scenario={scenario} />
          </div>

          {/* ─── CONTRIBUTING FACTORS + QUALITY RISK (2-col grid) ─────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>

            {/* Contributing Factors */}
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1.5px solid var(--border-light)', padding: '16px' }}>
              <SectionHeader icon={<Activity size={13} />} label="CONTRIBUTING FACTORS" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {scenario.contributingFactors.map((f, i) => {
                  const fColor = f.status === 'critical' ? '#DC2626'
                               : f.status === 'warning'  ? '#D97706'
                               : '#16A34A';
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: '11px',
                          fontWeight: 700, color: 'var(--text-primary)',
                          letterSpacing: '0.02em'
                        }}>
                          {f.name}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: fColor }}>
                          {f.pct}%
                        </span>
                      </div>
                      <div style={{ height: '5px', backgroundColor: 'var(--bg-muted)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${f.pct}%`,
                          backgroundColor: fColor,
                          transition: 'width 0.4s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quality Risk */}
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1.5px solid var(--border-light)', padding: '16px' }}>
              <SectionHeader icon={<ShieldAlert size={13} />} label="QUALITY RISK" />
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 800,
                    color: scenario.qualityRiskScore >= 45 ? '#DC2626'
                         : scenario.qualityRiskScore >= 20 ? '#D97706'
                         : '#16A34A',
                    lineHeight: 1
                  }}>
                    {scenario.qualityRiskScore}%
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700,
                    color: 'var(--text-primary)'
                  }}>
                    {scenario.qualityRiskTitle}
                  </span>
                </div>
              </div>
              <p style={{
                margin: 0, fontFamily: 'var(--font-sans)', fontSize: '12px',
                lineHeight: 1.6, color: 'var(--text-secondary)'
              }}>
                {scenario.qualityRiskExplanation}
              </p>
            </div>
          </div>

          {/* ─── PRODUCTION IMPACT ──────────────────────────────────────────── */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1.5px solid var(--border-light)',
            padding: '16px 20px'
          }}>
            <SectionHeader icon={<Activity size={13} />} label="PRODUCTION IMPACT" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1.5px solid var(--border-light)',
                padding: '14px 16px'
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.05em' }}>
                  ESTIMATED DOWNTIME
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: isCritical ? '#DC2626' : isWarning ? '#D97706' : 'var(--text-primary)', lineHeight: 1 }}>
                  {scenario.productionImpactDowntime}h
                </div>
              </div>

              <div style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1.5px solid var(--border-light)',
                padding: '14px 16px'
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.05em' }}>
                  THROUGHPUT IMPACT
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: isWarning || isCritical ? '#D97706' : 'var(--text-primary)', lineHeight: 1 }}>
                  −{scenario.productionImpactThroughputLoss}%
                </div>
              </div>
            </div>
          </div>

          {/* ─── RECOMMENDED ACTION ─────────────────────────────────────────── */}
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1.5px solid var(--border-light)', padding: '16px 20px' }}>
            <SectionHeader label="RECOMMENDED ACTION" />
            <p style={{ margin: '0 0 16px', fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {scenario.recommendedAction}
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button style={{
                padding: '8px 18px',
                backgroundColor: 'var(--bg-dark)', border: '1.5px solid var(--border-strong)',
                color: 'var(--text-inverted)', fontFamily: 'var(--font-mono)',
                fontSize: '10px', fontWeight: 700, cursor: 'pointer',
                letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '7px'
              }}>
                <RefreshCcw size={12} /> SCHEDULE MAINTENANCE
              </button>
              {scenario.documentLink && (
                <button style={{
                  padding: '8px 18px',
                  backgroundColor: 'transparent', border: '1.5px solid var(--accent-amber)',
                  color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)',
                  fontSize: '10px', fontWeight: 700, cursor: 'pointer',
                  letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '7px'
                }}>
                  <FileText size={12} /> VIEW: {scenario.documentLink.id}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  color: string;
  sub?: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color, sub, icon, highlight }) => (
  <div style={{
    backgroundColor: highlight ? `rgba(220,38,38,0.06)` : 'var(--bg-card)',
    border: `1.5px solid ${highlight ? '#DC2626' : 'var(--border-light)'}`,
    padding: '14px'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.07em' }}>
        {label}
      </span>
      <span style={{ color: 'var(--text-muted)', opacity: 0.7 }}>{icon}</span>
    </div>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color, lineHeight: 1 }}>
      {value}
    </div>
    {sub && (
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px', letterSpacing: '0.04em' }}>
        {sub}
      </div>
    )}
  </div>
);

interface SectionHeaderProps {
  label: string;
  icon?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ label, icon }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '7px',
    fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
    color: 'var(--text-secondary)', letterSpacing: '0.06em',
    marginBottom: '14px'
  }}>
    {icon && <span style={{ opacity: 0.8 }}>{icon}</span>}
    {label}
  </div>
);
