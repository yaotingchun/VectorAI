import React from 'react';
import { AgentDefinition, AgentStatus, SimulationStep } from '../types';
import { Package, Activity, BrainCircuit, Wrench, GitFork, ShieldCheck, Check, Loader2 } from 'lucide-react';

interface AgentCardProps {
  agent: AgentDefinition;
  step?: SimulationStep;
  status: AgentStatus;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, step, status }) => {
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

  const renderStatusBadge = () => {
    switch (status) {
      case 'waiting':
        return (
          <span className="status-pill" style={{ opacity: 0.7 }}>
            <span className="status-dot muted" />
            WAITING
          </span>
        );
      case 'analyzing':
        return (
          <span className="status-pill" style={{ borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)' }}>
            <Loader2 size={10} className="status-dot pulse blue" style={{ animation: 'spin 1s linear infinite' }} />
            ANALYZING
          </span>
        );
      case 'completed':
        return (
          <span className="status-pill dark" style={{ borderColor: 'var(--accent-green)' }}>
            <Check size={10} style={{ color: 'var(--accent-green)' }} />
            COMPLETED
          </span>
        );
      case 'deciding':
        return (
          <span className="status-pill" style={{ borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)' }}>
            <span className="status-dot amber" />
            DECIDING
          </span>
        );
    }
  };

  return (
    <div className={`agent-card ${status}`}>
      <span className="corner-tl">+</span>
      <span className="corner-tr">+</span>

      <div className="agent-card-header">
        <div className="agent-header-left">
          <div className="agent-icon-badge" style={{ borderColor: agent.color }}>
            {getAgentIcon(agent.iconName)}
          </div>
          <div className="agent-title-block">
            <span className="agent-name">{agent.name}</span>
            <span className="agent-role-subtitle">{agent.role}</span>
          </div>
        </div>

        <div className="agent-header-right">
          {step && (
            <span className="agent-seq-badge">
              SEQ #{step.sequenceNum} (+{step.delayMs}ms)
            </span>
          )}
          {renderStatusBadge()}
        </div>
      </div>

      <div className="agent-card-body">
        {step ? (
          <>
            <div className="agent-message-content">
              {step.message}
            </div>

            {step.metrics && step.metrics.length > 0 && (
              <div className="agent-metrics-row">
                {step.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className={`agent-metric-chip ${metric.alert ? 'alert' : ''} ${metric.badge ? 'badge-chip' : ''}`}
                  >
                    <span className="agent-metric-label">{metric.label}:</span>
                    <span className="agent-metric-value">{metric.value}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontStyle: 'italic' }}>
            Awaiting scenario trigger and telemetry ingestion...
          </div>
        )}
      </div>
    </div>
  );
};
