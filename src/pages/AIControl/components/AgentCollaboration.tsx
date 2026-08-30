import React, { useRef, useEffect } from 'react';
import { AGENT_DEFINITIONS } from '../data/agents';
import { AgentChatMessage } from './AgentChatMessage';
import { OrchestratorChatReply } from './OrchestratorChatReply';
import {
  AgentId,
  AgentStatus,
  SimulationStep,
  OrchestratorDecisionData,
  SimulationStatus,
} from '../types';
import { MessageSquare, Users, Bot, Loader2 } from 'lucide-react';

interface AgentCollaborationProps {
  visibleSteps: SimulationStep[];
  agentStatuses: Record<AgentId, AgentStatus>;
  orchestratorRevealed: boolean;
  orchestratorStatus: AgentStatus;
  decisionApproved: boolean;
  orchestratorDecision: OrchestratorDecisionData;
  simulationStatus: SimulationStatus;
}

const ORDERED_AGENT_IDS: AgentId[] = [
  'product',
  'monitoring',
  'prediction',
  'maintenance',
  'rerouting',
];

export const AgentCollaboration: React.FC<AgentCollaborationProps> = ({
  visibleSteps,
  agentStatuses,
  orchestratorRevealed,
  decisionApproved,
  orchestratorDecision,
  simulationStatus,
}) => {
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll as new messages or typing indicators appear
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [visibleSteps.length, orchestratorRevealed, decisionApproved, simulationStatus]);

  // Determine which agent is currently analyzing (typing)
  const currentlyAnalyzingAgentId = ORDERED_AGENT_IDS.find(
    (id) => agentStatuses[id] === 'analyzing'
  );

  return (
    <div className="agent-collab-container">
      <div className="agent-groupchat-card tech-card">
        <span className="corner-tl">+</span>
        <span className="corner-tr">+</span>
        <span className="corner-bl">+</span>
        <span className="corner-br">+</span>

        {/* Group Chat Channel Header */}
        <div className="chat-channel-header">
          <div className="chat-channel-info">
            <MessageSquare size={16} style={{ color: 'var(--text-primary)' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="chat-channel-title">
                AGENT GROUP CHAT // #FACTORY-OPS-SWARM
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Multi-Agent Operational Consensus & Real-Time Synthesis
              </span>
            </div>
          </div>

          {/* Active Participants Bar */}
          <div className="chat-participants-row">
            <Users size={12} style={{ color: 'var(--text-muted)' }} />
            {ORDERED_AGENT_IDS.map((agentId) => {
              const def = AGENT_DEFINITIONS[agentId];
              const st = agentStatuses[agentId];
              return (
                <div
                  key={agentId}
                  className="chat-participant-pill"
                  title={`${def.name}: ${st.toUpperCase()}`}
                >
                  <span
                    className={`status-dot ${
                      st === 'completed'
                        ? 'green'
                        : st === 'analyzing'
                        ? 'pulse blue'
                        : 'muted'
                    }`}
                  />
                  <span>{def.name.split(' ')[0]}</span>
                </div>
              );
            })}
            <div className="chat-participant-pill" style={{ borderColor: '#60A5FA' }}>
              <span
                className={`status-dot ${
                  decisionApproved ? 'green' : orchestratorRevealed ? 'pulse amber' : 'muted'
                }`}
              />
              <span style={{ color: '#2563EB', fontWeight: 700 }}>ORCHESTRATOR</span>
            </div>
          </div>
        </div>

        {/* Group Chat Messages Body */}
        <div className="chat-messages-viewport" ref={chatScrollRef}>
          {simulationStatus === 'idle' && visibleSteps.length === 0 ? (
            <div
              style={{
                margin: 'auto',
                padding: '40px 20px',
                textAlign: 'center',
                backgroundColor: 'var(--bg-card)',
                border: '1.5px dashed var(--border-dashed)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                maxWidth: '440px',
              }}
            >
              <Bot size={32} style={{ color: 'var(--text-muted)' }} />
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px' }}>
                GROUP CHAT STANDBY
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: 1.5 }}>
                Click <strong>"RUN SIMULATION"</strong> above. Each specialized agent will post their telemetry findings and recommendations to this channel, and the Orchestrator will reply with the final factory directive.
              </p>
            </div>
          ) : (
            <>
              {/* Agent Messages Stream */}
              {visibleSteps.map((step) => {
                const agentDef = AGENT_DEFINITIONS[step.agentId];
                return (
                  <AgentChatMessage
                    key={`${step.agentId}-${step.sequenceNum}`}
                    agent={agentDef}
                    step={step}
                  />
                );
              })}

              {/* Live Typing / Analyzing Indicator */}
              {currentlyAnalyzingAgentId && (
                <div className="chat-typing-row">
                  <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>
                    <strong>{AGENT_DEFINITIONS[currentlyAnalyzingAgentId].name}</strong> is analyzing factory telemetry & calculating parameters
                  </span>
                  <div className="typing-dots">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}

              {/* Orchestrator Deciding Typing Indicator (Right-aligned) */}
              {orchestratorRevealed && !decisionApproved && (
                <div className="chat-typing-row right">
                  <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>
                    <strong>Orchestrator</strong> is synthesizing swarm findings into final factory directive
                  </span>
                  <div className="typing-dots">
                    <span className="typing-dot" style={{ backgroundColor: '#D97706' }} />
                    <span className="typing-dot" style={{ backgroundColor: '#D97706' }} />
                    <span className="typing-dot" style={{ backgroundColor: '#D97706' }} />
                  </div>
                </div>
              )}

              {/* Orchestrator Final Authoritative Reply in Group Chat */}
              {orchestratorRevealed && (
                <OrchestratorChatReply
                  decisionData={orchestratorDecision}
                  isApproved={decisionApproved}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
