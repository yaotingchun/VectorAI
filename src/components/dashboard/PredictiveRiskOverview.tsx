import React from 'react';
import { PredictiveRiskOverviewData, TopRiskMachineSummary } from '../../types/dashboard';
import { TabId } from '../../types/navigation';
import {
  BrainCircuit,
  AlertTriangle,
  Clock,
  ArrowRight,
  Calendar,
  AlertOctagon,
  CheckCircle2,
} from 'lucide-react';

interface PredictiveRiskOverviewProps {
  data: PredictiveRiskOverviewData;
  onNavigate?: (tab: TabId, machineId?: string) => void;
}

export const PredictiveRiskOverview: React.FC<PredictiveRiskOverviewProps> = ({
  data,
  onNavigate,
}) => {
  return (
    <section className="tech-card" aria-label="Predictive Maintenance Risk Overview">
      <span className="corner-tl">+</span>
      <span className="corner-tr">+</span>
      <span className="corner-bl">+</span>
      <span className="corner-br">+</span>

      <div className="tech-card-header">
        <div className="tech-card-title">
          <BrainCircuit size={16} color="var(--accent-amber)" />
          <span>Predictive Maintenance Risk Overview</span>
        </div>

        <button
          type="button"
          onClick={() => onNavigate?.('prediction')}
          className="tech-btn"
          style={{ padding: '4px 10px', fontSize: '10px' }}
        >
          <span>View All Predictions</span>
          <ArrowRight size={12} />
        </button>
      </div>

      <div className="tech-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* 1. 4-Tier Risk Classification Summary Cards */}
        <div className="pred-risk-tier-grid">
          {/* Critical Risk */}
          <div className="pred-tier-card tier-critical">
            <div className="pred-tier-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertOctagon size={14} color="var(--accent-red)" />
                <span className="pred-tier-title">Critical Risk</span>
              </div>
              <span className="pred-tier-badge crit">RUL &lt; 48h</span>
            </div>
            <div className="pred-tier-value text-red">
              {data.criticalCount} <span className="unit">Machines</span>
            </div>
            <div className="pred-tier-desc">Immediate intervention required</div>
          </div>

          {/* High Risk */}
          <div className="pred-tier-card tier-high">
            <div className="pred-tier-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={14} color="#EA580C" />
                <span className="pred-tier-title">High Risk</span>
              </div>
              <span className="pred-tier-badge high">RUL 48–120h</span>
            </div>
            <div className="pred-tier-value" style={{ color: '#EA580C' }}>
              {data.highRiskCount} <span className="unit">Machines</span>
            </div>
            <div className="pred-tier-desc">Service within 5 days</div>
          </div>

          {/* Medium Risk */}
          <div className="pred-tier-card tier-medium">
            <div className="pred-tier-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="var(--accent-amber)" />
                <span className="pred-tier-title">Medium Risk</span>
              </div>
              <span className="pred-tier-badge med">RUL 120–250h</span>
            </div>
            <div className="pred-tier-value text-amber">
              {data.mediumRiskCount} <span className="unit">Machines</span>
            </div>
            <div className="pred-tier-desc">Monitor baseline drift</div>
          </div>

          {/* Low Risk */}
          <div className="pred-tier-card tier-low">
            <div className="pred-tier-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="var(--accent-green)" />
                <span className="pred-tier-title">Low Risk</span>
              </div>
              <span className="pred-tier-badge low">RUL &gt; 250h</span>
            </div>
            <div className="pred-tier-value text-green">
              {data.lowRiskCount} <span className="unit">Machines</span>
            </div>
            <div className="pred-tier-desc">Nominal wear parameters</div>
          </div>
        </div>

        {/* 2. Maintenance Time Horizon (Next 7 Days vs Next 30 Days Forecast) */}
        <div className="horizon-forecast-box">
          <div className="horizon-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} color="var(--text-primary)" />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                Predictive Maintenance Horizon Windows
              </span>
            </div>
            <span style={{ fontSize: '9.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              AUTOMATED TIME-HORIZON PROJECTIONS
            </span>
          </div>

          <div className="horizon-cards-row">
            {/* Within Next 7 Days (Critical & High urgency) */}
            <div className="horizon-card urgent-window">
              <div className="horizon-card-top">
                <span className="horizon-window-tag urgent">URGENT WINDOW</span>
                <span className="horizon-count-num text-red">{data.horizon.next7Days}</span>
              </div>
              <div className="horizon-window-title">Service Due Within Next 7 Days</div>
              <div className="horizon-window-sub">
                Includes <strong>WB-04 (28h)</strong>, <strong>WS-02 (64h)</strong>, and <strong>DA-02 (72h)</strong>. Emergency &amp; high priority work orders queued.
              </div>
            </div>

            {/* Next 30 Days (Planned window) */}
            <div className="horizon-card planned-window">
              <div className="horizon-card-top">
                <span className="horizon-window-tag planned">PLANNED WINDOW</span>
                <span className="horizon-count-num text-amber">{data.horizon.next30Days}</span>
              </div>
              <div className="horizon-window-title">Service Due Within 7 to 30 Days</div>
              <div className="horizon-window-sub">
                Includes <strong>DA-01</strong>, <strong>WB-02</strong>, and <strong>MP-02</strong>. Scheduled for routine shift PM window.
              </div>
            </div>

            {/* Stable beyond 30 Days */}
            <div className="horizon-card stable-window">
              <div className="horizon-card-top">
                <span className="horizon-window-tag stable">STABLE FLEET</span>
                <span className="horizon-count-num text-green">{data.horizon.stableBeyond30Days}</span>
              </div>
              <div className="horizon-window-title">Stable Beyond 30 Days (&gt; 250h RUL)</div>
              <div className="horizon-window-sub">
                {data.horizon.stableBeyond30Days} cleanroom units operating safely within sensor baseline drift tolerances. No unscheduled outages.
              </div>
            </div>
          </div>
        </div>

        {/* 3. Top High-Risk Machines Summary Table */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Highest Predictive Risk Equipment (Action Horizon)
            </span>
            <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              SORTED BY SHORTEST RUL
            </span>
          </div>

          <div className="pred-risk-table-wrapper">
            <table className="maint-table">
              <thead>
                <tr>
                  <th>EQUIPMENT</th>
                  <th>PROCESS / LINE</th>
                  <th>PREDICTED RUL</th>
                  <th>HEALTH SCORE</th>
                  <th>ANOMALY &amp; FAILURE RISK</th>
                  <th>URGENCY SLA</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {data.topRiskMachines.map((m: TopRiskMachineSummary) => {
                  const isCrit = m.status === 'critical';
                  return (
                    <tr key={m.id} className={isCrit ? 'row-crit-highlight' : ''}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className={`pred-risk-code-pill ${isCrit ? 'crit' : 'warn'}`}>{m.id}</span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '11.5px', color: 'var(--text-primary)' }}>{m.name}</div>
                            <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>{m.type}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>{m.bay}</div>
                        <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>{m.line}</div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={11} color={isCrit ? 'var(--accent-red)' : 'var(--accent-amber)'} />
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: isCrit ? 'var(--accent-red)' : 'var(--accent-amber)' }}>
                            {m.rulHours} Hours
                          </span>
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div
                            style={{
                              width: '40px',
                              height: '5px',
                              backgroundColor: 'var(--bg-muted)',
                              border: '1px solid var(--border-strong)',
                              position: 'relative',
                            }}
                          >
                            <div
                              style={{
                                width: `${m.healthScore}%`,
                                height: '100%',
                                backgroundColor: isCrit ? 'var(--accent-red)' : 'var(--accent-amber)',
                              }}
                            />
                          </div>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700 }}>
                            {m.healthScore}%
                          </span>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontSize: '11px', color: 'var(--text-primary)', maxWidth: '280px' }}>
                          {m.issue}
                        </div>
                      </td>

                      <td>
                        <span className={`priority-tag ${isCrit ? 'urgent' : 'high'}`}>
                          {m.actionUrgency}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          onClick={() => onNavigate?.('prediction', m.id)}
                          className="tech-btn"
                          style={{ padding: '3px 8px', fontSize: '9.5px' }}
                          title="Inspect degradation model in Prediction page"
                        >
                          <span>Inspect</span>
                          <ArrowRight size={10} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PredictiveRiskOverview;
