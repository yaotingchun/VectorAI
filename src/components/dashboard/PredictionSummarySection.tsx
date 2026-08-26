import React from 'react';
import { PredictionSummaryData, TopRiskMachineSummary } from '../../types/dashboard';
import { TabId } from '../../types/navigation';
import {
  BrainCircuit,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingDown,
  ShieldAlert,
} from 'lucide-react';

interface PredictionSummarySectionProps {
  data?: PredictionSummaryData;
  onNavigate?: (tab: TabId, machineId?: string) => void;
}

export const PredictionSummarySection: React.FC<PredictionSummarySectionProps> = ({
  data,
  onNavigate,
}) => {
  // Fallback defaults if not provided
  const summary: PredictionSummaryData = data || {
    machinesAtRiskCount: 6,
    imminentFailureCount: 2,
    avgPredictedRulHours: 428,
    enteringDegradationCount: 3,
    topRiskMachines: [
      {
        id: 'WB-04',
        name: 'Wire Bonder Delta',
        type: 'Wire Bonder',
        healthScore: 54,
        rulHours: 28,
        status: 'critical',
        bay: 'Bay B',
        line: 'Line 04 - High-Density Interconnect',
        issue: 'Ultrasonic transducer resonance impedance shift (Imminent bond shear failure)',
        actionUrgency: '< 24 Hours',
      },
      {
        id: 'WD-02',
        name: 'Wafer Dicer Beta',
        type: 'Wafer Dicing Machine',
        healthScore: 71,
        rulHours: 64,
        status: 'warning',
        bay: 'Bay A',
        line: 'Line 01 - Die Prep',
        issue: 'Spindle bearing ceramic race harmonic wear at 12.4 kHz',
        actionUrgency: '< 48 Hours',
      },
      {
        id: 'DA-01',
        name: 'Die Attacher Prime',
        type: 'Die Attacher',
        healthScore: 68,
        rulHours: 112,
        status: 'warning',
        bay: 'Bay A',
        line: 'Line 02 - Die Prep',
        issue: 'Vacuum collet seal degradation causing optical pickup centering drift',
        actionUrgency: '< 72 Hours',
      },
      {
        id: 'MD-03',
        name: 'Molding Press Gamma',
        type: 'Molding Machine',
        healthScore: 65,
        rulHours: 146,
        status: 'warning',
        bay: 'Bay C',
        line: 'Line 05 - Auto Encapsulation',
        issue: 'Hydraulic ram pressure decay during final resin cure pack cycle',
        actionUrgency: '< 5 Days',
      },
    ],
  };

  return (
    <section className="tech-card" aria-label="Prediction Summary Overview">
      <span className="corner-tl">+</span>
      <span className="corner-tr">+</span>
      <span className="corner-bl">+</span>
      <span className="corner-br">+</span>

      <div className="tech-card-header">
        <div className="tech-card-title">
          <BrainCircuit size={16} color="var(--accent-amber)" />
          <span>AI Predictive Failure &amp; RUL Summary</span>
        </div>

        <button
          type="button"
          onClick={() => onNavigate?.('prediction')}
          className="tech-btn"
          style={{ padding: '4px 10px', fontSize: '10px' }}
        >
          <span>View Predictions</span>
          <ArrowRight size={12} />
        </button>
      </div>

      <div className="tech-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* 4-Column Prediction KPI Counters */}
        <div className="pred-summary-kpi-grid">
          {/* Machines with Predicted Failure Risk */}
          <div className="pred-metric-box">
            <div className="pred-metric-header">
              <ShieldAlert size={12} color="var(--accent-amber)" />
              <span className="pred-metric-label">Predicted Failure Risk</span>
            </div>
            <div className="pred-metric-val text-amber">{summary.machinesAtRiskCount} <span className="unit">Units</span></div>
            <div className="pred-metric-sub">Warning &amp; Critical Equipment</div>
          </div>

          {/* Imminent Failure (< 48 hrs) */}
          <div className="pred-metric-box alert-box">
            <div className="pred-metric-header">
              <AlertTriangle size={12} color="var(--accent-red)" />
              <span className="pred-metric-label" style={{ color: 'var(--accent-red)' }}>Imminent Failure</span>
            </div>
            <div className="pred-metric-val text-red">{summary.imminentFailureCount} <span className="unit">Units</span></div>
            <div className="pred-metric-sub text-red font-bold">RUL &lt; 48 Hours Remaining</div>
          </div>

          {/* Average Predicted RUL */}
          <div className="pred-metric-box">
            <div className="pred-metric-header">
              <Clock size={12} color="var(--text-primary)" />
              <span className="pred-metric-label">Average Predicted RUL</span>
            </div>
            <div className="pred-metric-val">{summary.avgPredictedRulHours} <span className="unit">Hours</span></div>
            <div className="pred-metric-sub">Fleet-Wide Mean Useful Life</div>
          </div>

          {/* Entering Degradation Stage */}
          <div className="pred-metric-box">
            <div className="pred-metric-header">
              <TrendingDown size={12} color="var(--accent-blue)" />
              <span className="pred-metric-label">Entering Degradation</span>
            </div>
            <div className="pred-metric-val" style={{ color: 'var(--accent-blue)' }}>
              {summary.enteringDegradationCount} <span className="unit">Units</span>
            </div>
            <div className="pred-metric-sub">Stage 2 Early Neural Drift</div>
          </div>
        </div>

        {/* Small Summary List of Highest-Risk Machines */}
        <div className="pred-risk-list-section">
          <div className="pred-risk-list-header">
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Top Highest-Risk Equipment (Summary Overview)
            </span>
            <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              DEGRADATION MATRIX
            </span>
          </div>

          <div className="pred-risk-list">
            {summary.topRiskMachines.map((m: TopRiskMachineSummary) => {
              const isCritical = m.status === 'critical';

              return (
                <div
                  key={m.id}
                  className={`pred-risk-row ${isCritical ? 'critical' : 'warning'}`}
                >
                  {/* Left: Machine Tag & Type */}
                  <div className="pred-risk-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="pred-risk-tag">{m.id}</span>
                      <span className="pred-risk-name">{m.name}</span>
                      <span className="pred-risk-bay">({m.bay} • {m.line.split(' - ')[0]})</span>
                    </div>

                    <div className="pred-risk-issue">
                      <span className="issue-label">Anomaly:</span> {m.issue}
                    </div>
                  </div>

                  {/* Right: RUL, Health & Action link */}
                  <div className="pred-risk-metrics">
                    <div className="pred-risk-rul">
                      <Clock size={11} color={isCritical ? 'var(--accent-red)' : 'var(--accent-amber)'} />
                      <span>RUL {m.rulHours} hrs</span>
                    </div>

                    <div
                      className="pred-risk-health"
                      style={{
                        backgroundColor: isCritical ? 'var(--accent-red)' : 'var(--accent-amber)',
                        color: '#FFFFFF',
                      }}
                    >
                      {m.healthScore}% HP
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate?.('prediction', m.id)}
                      className="tech-btn"
                      style={{ padding: '3px 7px', fontSize: '9.5px' }}
                      title="Inspect full neural degradation curve in Prediction Tab"
                    >
                      <span>Details</span>
                      <ArrowRight size={10} />
                    </button>
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

export default PredictionSummarySection;
