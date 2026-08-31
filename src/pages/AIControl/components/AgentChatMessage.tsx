import React from 'react';
import { AgentDefinition, SimulationStep } from '../types';
import { Package, Activity, BrainCircuit, Wrench, GitFork, ShieldCheck } from 'lucide-react';

interface AgentChatMessageProps {
  agent: AgentDefinition;
  step: SimulationStep;
}

export const AgentChatMessage: React.FC<AgentChatMessageProps> = ({ agent, step }) => {
  const getAgentIcon = (iconName: string) => {
    const size = 15;
    switch (iconName) {
      case 'Package':
        return <Package size={size} />;
      case 'Activity':
        return <Activity size={size} />;
      case 'BrainCircuit':
        return <BrainCircuit size={size} />;
      case 'Wrench':
        return <Wrench size={size} />;
      case 'GitFork':
        return <GitFork size={size} />;
      case 'ShieldCheck':
        return <ShieldCheck size={size} />;
      default:
        return <Package size={size} />;
    }
  };

  // Convert "PRODUCT AGENT" to "Product Agent" for friendly chat feel
  const formattedAgentName = agent.name
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  return (
    <div className="chat-msg-row">
      {/* Circular Avatar filled with agent's accent color */}
      <div
        className="chat-avatar-circle"
        style={{ backgroundColor: agent.color }}
        title={`${agent.name} (${agent.role})`}
      >
        {getAgentIcon(agent.iconName)}
      </div>

      {/* Message & Tinted Rounded Bubble */}
      <div className="chat-bubble-container">
        <div className={`chat-agent-bubble bubble-${agent.id}`}>
          {/* Header Row: Agent Name + Role + De-emphasized Metadata */}
          <div className="chat-bubble-header">
            <div>
              <span className="chat-agent-title" style={{ color: agent.color }}>
                {formattedAgentName}
              </span>
              <span className="chat-agent-role-inline">
                · {agent.role}
              </span>
            </div>

            <span className="chat-deemphasized-meta">
              SEQ #{step.sequenceNum} · +{step.delayMs}ms · Sent
            </span>
          </div>

          {/* Normal UI Font Body Text */}
          <div className="chat-body-text">
            {step.message}
          </div>

          {/* Pill/Tag-Style Metric Chips */}
          {step.metrics && step.metrics.length > 0 && (
            <div className="chat-metrics-row">
              {step.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className={`chat-metric-pill ${agent.id} ${metric.alert ? 'alert' : ''}`}
                >
                  <span style={{ opacity: 0.8, fontSize: '10.5px' }}>{metric.label}:</span>
                  <strong style={{ fontWeight: 700 }}>{metric.value}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
