import React from 'react';
import { OrchestratorDecisionData } from '../types';
import { ShieldCheck, CheckCircle2, MessageSquareQuote } from 'lucide-react';

interface OrchestratorChatReplyProps {
  decisionData: OrchestratorDecisionData;
  isApproved: boolean;
}

export const OrchestratorChatReply: React.FC<OrchestratorChatReplyProps> = ({
  decisionData,
  isApproved,
}) => {
  return (
    <div className="orchestrator-chat-row">
      {/* Orchestrator Bubble (Right-aligned response) */}
      <div className="orchestrator-chat-bubble">
        {/* Top Header: Orchestrator Label + Status Ribbon Badge */}
        <div className="orch-bubble-header">
          <div className="orch-header-title-block">
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 800, color: '#60A5FA', letterSpacing: '0.04em' }}>
              Orchestrator
            </span>
            <span style={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'var(--font-sans)' }}>
              · Master Factory Authority
            </span>
          </div>

          <div>
            {isApproved ? (
              <span className="orch-reply-status-ribbon">
                <CheckCircle2 size={10} />
                <span>{decisionData.statusText}</span>
              </span>
            ) : (
              <span className="orch-reply-status-ribbon" style={{ backgroundColor: '#78350F', borderColor: '#D97706', color: '#FCD34D' }}>
                <span className="status-dot pulse amber" />
                <span>EVALUATING SWARM</span>
              </span>
            )}
          </div>
        </div>

        {/* Quoted Reply-Preview (Chat app styled reply snippet) */}
        <div className="orch-reply-preview">
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <MessageSquareQuote size={11} style={{ color: '#60A5FA' }} />
            <span style={{ fontSize: '9.5px', color: '#93C5FD', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              Replying to Swarm Consensus
            </span>
          </div>
          <span style={{ fontSize: '10.5px', color: '#9CA3AF', fontStyle: 'italic', fontFamily: 'var(--font-sans)', marginTop: '2px' }}>
            "Evaluating findings from Product, Monitoring, Prediction, Maintenance & Rerouting Agents"
          </span>
        </div>

        {/* Main Directive Synthesis Text */}
        <div className="chat-body-text" style={{ color: '#F3F4F6', whiteSpace: 'pre-line', fontSize: '11.5px', lineHeight: 1.45 }}>
          {decisionData.synthesis}
        </div>

        {/* Operational Routing Breakdown Chips */}
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
        </div>

        {/* Synthesis Confidence Progress Bar + Percentage */}
        <div className="orch-confidence-bar-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9.5px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#9CA3AF' }}>
            <span>SYNTHESIS CONFIDENCE</span>
            <span style={{ color: '#34D399' }}>{(decisionData.confidence * 100).toFixed(0)}% OPTIMAL</span>
          </div>
          <div style={{ height: '5px', backgroundColor: '#26292E', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${decisionData.confidence * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #3B82F6, #10B981)',
                borderRadius: '3px',
                transition: 'width 0.6s ease',
              }}
            />
          </div>
        </div>

        {/* Operational Justification / Factor Analysis Box */}
        <div className="orch-reason-box">
          <span className="orch-reason-label">Operational Directive & Factor Analysis:</span>
          <span className="orch-reason-text">{decisionData.keyDetails.reason}</span>
        </div>
      </div>

      {/* Circular Orchestrator Avatar on the Right */}
      <div
        className="chat-avatar-circle"
        style={{
          width: '30px',
          height: '30px',
          backgroundColor: '#1E2126',
          border: '1.5px solid #3B82F6',
          color: '#60A5FA',
        }}
        title="Orchestrator (Master Factory Authority)"
      >
        <ShieldCheck size={16} />
      </div>
    </div>
  );
};
