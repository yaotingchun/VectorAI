import React from 'react';
import { OrchestratorDecisionData, AgentStatus } from '../types';
import { ShieldCheck, CheckCircle } from 'lucide-react';

interface OrchestratorDecisionProps {
  decisionData: OrchestratorDecisionData;
  isApproved: boolean;
  status?: AgentStatus;
}

export const OrchestratorDecision: React.FC<OrchestratorDecisionProps> = ({
  decisionData,
  isApproved,
}) => {
  return (
    <div className="orchestrator-master-card tech-card">
      <span className="corner-tl" style={{ color: '#60A5FA' }}>+</span>
      <span className="corner-tr" style={{ color: '#60A5FA' }}>+</span>
      <span className="corner-bl" style={{ color: '#60A5FA' }}>+</span>
      <span className="corner-br" style={{ color: '#60A5FA' }}>+</span>

      <div className="orchestrator-card-header">
        <div className="orch-header-left">
          <div className="orch-icon-box">
            <ShieldCheck size={20} />
          </div>
          <div className="orch-title-group">
            <span className="orch-title">ORCHESTRATOR // FINAL DECISION</span>
            <span className="orch-role">Multi-Agent Synthesis & Operational Authority</span>
          </div>
        </div>

        <div className="orch-header-right">
          {isApproved ? (
            <div className="orch-status-badge">
              <CheckCircle size={13} />
              <span>✓ {decisionData.statusText}</span>
            </div>
          ) : (
            <div className="orch-status-badge deciding">
              <span className="status-dot pulse amber" />
              <span>● EVALUATING AGENT FINDINGS</span>
            </div>
          )}
        </div>
      </div>

      <div className="orchestrator-card-body">
        <div className="orch-synthesis-text">
          {decisionData.synthesis}
        </div>

        {/* Structured Decision Breakdown Grid */}
        <div className="orch-decision-grid">
          <div className="orch-decision-field">
            <span className="orch-field-label">Target Product</span>
            <span className="orch-field-val">{decisionData.keyDetails.product}</span>
          </div>

          <div className="orch-decision-field">
            <span className="orch-field-label">Primary Source</span>
            <span className="orch-field-val">{decisionData.keyDetails.source}</span>
          </div>

          <div className="orch-decision-field">
            <span className="orch-field-label">Alternative Route</span>
            <span className="orch-field-val highlight">{decisionData.keyDetails.alternative}</span>
          </div>

          <div className="orch-decision-field">
            <span className="orch-field-label">Rerouted Flow</span>
            <span className="orch-field-val highlight">{decisionData.keyDetails.reroutedCapacity}</span>
          </div>

          <div className="orch-decision-field">
            <span className="orch-field-label">Window Duration</span>
            <span className="orch-field-val">{decisionData.keyDetails.duration}</span>
          </div>

          <div className="orch-decision-field">
            <span className="orch-field-label">Synthesis Confidence</span>
            <span className="orch-field-val highlight">
              {(decisionData.confidence * 100).toFixed(0)}% OPTIMAL
            </span>
          </div>
        </div>

        {/* Reason summary box */}
        <div className="orch-reason-box">
          <span className="orch-reason-label">Operational Justification / Factor Analysis:</span>
          <span className="orch-reason-text">{decisionData.keyDetails.reason}</span>
        </div>
      </div>
    </div>
  );
};
