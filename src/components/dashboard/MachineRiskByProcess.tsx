import React from 'react';
import { ProcessRiskItem } from '../../types/dashboard';
import { TabId } from '../../types/navigation';
import {
  Layers,
  ArrowRight,
} from 'lucide-react';

interface MachineRiskByProcessProps {
  processRiskList: ProcessRiskItem[];
  onNavigate?: (tab: TabId, machineId?: string) => void;
}

export const MachineRiskByProcess: React.FC<MachineRiskByProcessProps> = ({
  processRiskList,
  onNavigate,
}) => {
  return (
    <section className="tech-card" aria-label="Machine Risk by Manufacturing Process">
      <span className="corner-tl">+</span>
      <span className="corner-tr">+</span>
      <span className="corner-bl">+</span>
      <span className="corner-br">+</span>

      <div className="tech-card-header">
        <div className="tech-card-title">
          <Layers size={16} color="var(--accent-purple)" />
          <span>Machine Risk by Manufacturing Process</span>
        </div>

        <button
          type="button"
          onClick={() => onNavigate?.('machines')}
          className="tech-btn"
          style={{ padding: '4px 10px', fontSize: '10px' }}
        >
          <span>Line Equipment</span>
          <ArrowRight size={12} />
        </button>
      </div>

      <div className="tech-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Comparative predictive risk index across semiconductor backend stages:
          </span>
          <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            BENCHMARK: 0 (NOMINAL) — 100 (CRITICAL RISK)
          </span>
        </div>

        {/* Process Risk Comparative Bar List */}
        <div className="process-risk-list">
          {processRiskList.map((proc) => {
            const isCritical = proc.riskLevel === 'critical';
            const isModerate = proc.riskLevel === 'moderate';

            const barColor = isCritical
              ? 'var(--accent-red)'
              : isModerate
              ? 'var(--accent-amber)'
              : 'var(--accent-green)';

            return (
              <div key={proc.processId} className={`process-risk-card ${isCritical ? 'border-red-subtle' : ''}`}>
                {/* Header row for process */}
                <div className="process-risk-header">
                  <div className="process-risk-identity">
                    <span className={`process-code-badge ${proc.shortCode.toLowerCase()}`}>
                      {proc.shortCode}
                    </span>
                    <div>
                      <div className="process-name-text">
                        {proc.processName}
                      </div>
                      <div className="process-location-text">
                        {proc.bay} • {proc.lines} • {proc.totalMachines} Units
                      </div>
                    </div>
                  </div>

                  <div className="process-risk-score-group">
                    <div className="process-score-badge" style={{ borderColor: barColor, color: barColor }}>
                      {proc.riskScore} <span className="score-scale">/ 100 Risk</span>
                    </div>

                    <span
                      className={`priority-tag ${proc.riskLevel === 'critical' ? 'urgent' : proc.riskLevel === 'moderate' ? 'medium' : 'low'}`}
                    >
                      {proc.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>
                </div>

                {/* Horizontal Progress / Risk Bar */}
                <div className="process-bar-track">
                  <div
                    className="process-bar-fill"
                    style={{
                      width: `${proc.riskScore}%`,
                      backgroundColor: barColor,
                    }}
                    title={`Process Risk Score: ${proc.riskScore}%`}
                  />
                  {/* Warning threshold indicator at 50% */}
                  <div className="threshold-marker thresh-warn" style={{ left: '40%' }} title="Moderate Warning (40)" />
                  <div className="threshold-marker thresh-crit" style={{ left: '70%' }} title="Critical Risk Threshold (70)" />
                </div>

                {/* Bottom details & primary bottleneck */}
                <div className="process-risk-footer">
                  <div className="process-breakdown-tags">
                    <span className="breakdown-tag ok">{proc.healthyCount} OK</span>
                    {proc.warningCount > 0 && (
                      <span className="breakdown-tag warn">{proc.warningCount} Warn</span>
                    )}
                    {proc.criticalCount > 0 && (
                      <span className="breakdown-tag crit">{proc.criticalCount} Critical</span>
                    )}
                  </div>

                  {proc.primaryBottleneck && (
                    <div className="process-bottleneck-text" title={proc.primaryBottleneck}>
                      <span className="bottleneck-prefix">Constraint:</span> {proc.primaryBottleneck}
                    </div>
                  )}

                  <span className="process-sla-badge">
                    {proc.urgency}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MachineRiskByProcess;
