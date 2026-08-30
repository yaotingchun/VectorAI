import React from 'react';
import { ReroutePolicyConfigData } from '../../../types/configuration';
import {
  ShieldAlert,
  Bot,
  Truck,
} from 'lucide-react';

interface ReroutePolicyConfigProps {
  reroutePolicy: ReroutePolicyConfigData;
  onChange: (updated: ReroutePolicyConfigData) => void;
}

export const ReroutePolicyConfig: React.FC<ReroutePolicyConfigProps> = ({
  reroutePolicy,
  onChange,
}) => {
  const updatePolicy = (fields: Partial<ReroutePolicyConfigData>) => {
    onChange({ ...reroutePolicy, ...fields });
  };

  const clustersList = [
    'Dicing Bay Alpha',
    'Dicing Bay Beta',
    'Die Attach Cluster A',
    'Die Attach Cluster B',
    'Wire Bond Wing North',
    'Wire Bond Wing South',
    'Molding Cell 1',
    'ATE Sorter Bay Alpha',
  ];

  const handleToggleCluster = (clusterName: string) => {
    const current = reroutePolicy.allowedTargetClusters || [];
    const exists = current.includes(clusterName);
    const updated = exists
      ? current.filter((c) => c !== clusterName)
      : [...current, clusterName];
    updatePolicy({ allowedTargetClusters: updated });
  };

  return (
    <div className="config-content-grid" role="region" aria-label="Rerouting Policy Configuration">
      {/* 1. Automation Mode Selector */}
      <div className="config-card">
        <div className="config-card-header">
          <div className="config-card-title">
            <Bot size={16} style={{ color: 'var(--accent-amber)' }} />
            <span>Autonomous Lot Diversion &amp; Dynamic Rerouting Engine Mode</span>
          </div>
          <span className="status-pill" style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--text-inverted)' }}>
            MES INTERLOCK POLICY
          </span>
        </div>

        <div className="config-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            <div
              onClick={() => updatePolicy({ automationMode: 'AUTONOMOUS' })}
              className={`preset-card ${reroutePolicy.automationMode === 'AUTONOMOUS' ? 'active' : ''}`}
            >
              <div className="preset-card-title">
                <span>Fully Autonomous</span>
                <span className="status-pill" style={{ backgroundColor: 'var(--accent-green)', color: '#FFFFFF', fontSize: '9px' }}>
                  ACTIVE AGV
                </span>
              </div>
              <p className="preset-card-desc">
                Automatically detects critical telemetry excursions, allocates peer machines, and commands AGVs to divert wafer lots without waiting for manual confirmation.
              </p>
            </div>

            <div
              onClick={() => updatePolicy({ automationMode: 'SEMI_AUTONOMOUS' })}
              className={`preset-card ${reroutePolicy.automationMode === 'SEMI_AUTONOMOUS' ? 'active' : ''}`}
            >
              <div className="preset-card-title">
                <span>Semi-Autonomous (Supervised)</span>
                <span className="status-pill" style={{ backgroundColor: 'var(--accent-blue)', color: '#FFFFFF', fontSize: '9px' }}>
                  PROMPT OP
                </span>
              </div>
              <p className="preset-card-desc">
                Synthesizes the optimal rerouting target and AGV route, presenting an immediate 1-click authorization modal to the cleanroom shift supervisor.
              </p>
            </div>

            <div
              onClick={() => updatePolicy({ automationMode: 'MANUAL_ONLY' })}
              className={`preset-card ${reroutePolicy.automationMode === 'MANUAL_ONLY' ? 'active' : ''}`}
            >
              <div className="preset-card-title">
                <span>Manual Only</span>
                <span className="status-pill" style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)', fontSize: '9px' }}>
                  OPERATOR ONLY
                </span>
              </div>
              <p className="preset-card-desc">
                Disables automated routing dispatch. Cleanroom engineers must manually initiate transfers via the v-Factory floor tab.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Reroute Triggers & AGV Fleet Parameters */}
      <div className="config-grid-2col">
        {/* Trigger Rules */}
        <div className="config-card">
          <div className="config-card-header">
            <div className="config-card-title">
              <ShieldAlert size={14} style={{ color: 'var(--accent-red)' }} />
              <span>Yield Protection Trigger Rules</span>
            </div>
          </div>

          <div className="config-card-body">
            <div className="config-form-group">
              <div className="config-label-row">
                <label className="config-label">RUL Trigger Cutoff Threshold (Hours)</label>
                <span className="config-hint">{reroutePolicy.yieldProtectionTriggerRulHours} hrs</span>
              </div>
              <div className="range-slider-wrap">
                <input
                  type="range"
                  min={12}
                  max={120}
                  step={6}
                  value={reroutePolicy.yieldProtectionTriggerRulHours}
                  onChange={(e) => updatePolicy({ yieldProtectionTriggerRulHours: parseInt(e.target.value) })}
                  className="config-slider"
                />
                <span className="slider-val-chip">{reroutePolicy.yieldProtectionTriggerRulHours} h</span>
              </div>
            </div>

            <div className="toggle-switch-row">
              <div>
                <div style={{ fontWeight: 700, fontSize: '11px' }}>Auto-Trigger on Status == CRITICAL</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Initiate diversion immediately upon critical sensor spike</div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={reroutePolicy.autoRerouteOnCriticalStatus}
                  onChange={(e) => updatePolicy({ autoRerouteOnCriticalStatus: e.target.checked })}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="config-form-group">
              <div className="config-label-row">
                <label className="config-label">Cleanroom Wafer Scrap Value Baseline</label>
                <span className="config-hint">USD ($ / Wafer)</span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  value={reroutePolicy.cleanroomWaferScrapValueUsd}
                  onChange={(e) => updatePolicy({ cleanroomWaferScrapValueUsd: parseInt(e.target.value) || 700 })}
                  className="config-input"
                />
              </div>
              <span className="config-hint" style={{ marginTop: '2px' }}>
                A 250-wafer carrier equates to approx. ${(250 * reroutePolicy.cleanroomWaferScrapValueUsd).toLocaleString()} in preserved yield per avoided catastrophic machine jam.
              </span>
            </div>
          </div>
        </div>

        {/* AGV Carrier & Safety Window */}
        <div className="config-card">
          <div className="config-card-header">
            <div className="config-card-title">
              <Truck size={14} style={{ color: 'var(--accent-blue)' }} />
              <span>AGV Carrier Fleet &amp; Rollback Safety</span>
            </div>
          </div>

          <div className="config-card-body">
            <div className="config-form-group">
              <label className="config-label">AGV Dispatch Optimization Goal</label>
              <select
                value={reroutePolicy.agvDispatchPriority}
                onChange={(e) => updatePolicy({ agvDispatchPriority: e.target.value as any })}
                className="config-select"
              >
                <option value="FASTEST_TRANSIT">Fastest Transit (Direct AGV Route)</option>
                <option value="LOAD_BALANCED">Load Balanced (Equal Machine Utilization)</option>
                <option value="MIN_STAGING_BUFFER">Minimal Staging Buffer (WIP Flow)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="config-form-group">
                <label className="config-label">Carrier Staging Timeout</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="number"
                    value={reroutePolicy.agvStagingTimeoutSec}
                    onChange={(e) => updatePolicy({ agvStagingTimeoutSec: parseInt(e.target.value) || 15 })}
                    className="config-input"
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>sec</span>
                </div>
              </div>

              <div className="config-form-group">
                <label className="config-label">Operator Rollback Window</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="number"
                    value={reroutePolicy.safetyRollbackWindowMin}
                    onChange={(e) => updatePolicy({ safetyRollbackWindowMin: parseInt(e.target.value) || 5 })}
                    className="config-input"
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>min</span>
                </div>
              </div>
            </div>

            {/* Allowed Target Clusters */}
            <div style={{ marginTop: '6px' }}>
              <span className="config-label" style={{ display: 'block', marginBottom: '8px' }}>
                Allowed Rerouting Target Machine Bays
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '6px' }}>
                {clustersList.map((cluster) => {
                  const isChecked = (reroutePolicy.allowedTargetClusters || []).includes(cluster);
                  return (
                    <label
                      key={cluster}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        padding: '5px 8px',
                        backgroundColor: isChecked ? 'var(--bg-surface)' : 'transparent',
                        border: `1px solid ${isChecked ? 'var(--border-strong)' : 'var(--border-light)'}`,
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleCluster(cluster)}
                      />
                      <span>{cluster}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
