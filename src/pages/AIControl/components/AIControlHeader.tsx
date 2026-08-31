import React from 'react';
import { RefreshCw, Radio } from 'lucide-react';

interface AIControlHeaderProps {
  onRefresh?: () => void;
}

export const AIControlHeader: React.FC<AIControlHeaderProps> = ({ onRefresh }) => {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          paddingBottom: '10px',
          borderBottom: '1.5px solid var(--border-strong)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
              }}
            >
              COMMAND CENTER
            </span>

            <span
              style={{
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                backgroundColor: 'var(--bg-dark)',
                color: 'var(--text-inverted)',
                padding: '2px 7px',
                fontWeight: 700,
                letterSpacing: '0.08em',
              }}
            >
              AI // ORCH
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-green)',
                border: '1px solid var(--accent-green)',
                padding: '1px 6px',
                fontWeight: 700,
                backgroundColor: 'rgba(22, 163, 74, 0.08)',
              }}
            >
              <Radio size={11} className="animate-pulse" />
              SYSTEM ACTIVE
            </span>
          </div>

          <p
            style={{
              fontSize: '11.5px',
              color: 'var(--text-secondary)',
              marginTop: '3px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Multi-Agent Factory Intelligence • 5 Specialized Agents & 1 Master Orchestrator
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onRefresh}
            className="tech-btn"
            title="Refresh agent swarm and synchronized factory telemetry"
            style={{ fontSize: '11px', padding: '5px 12px' }}
          >
            <RefreshCw size={12} />
            <span>REFRESH</span>
          </button>
        </div>
      </div>
    </div>
  );
};
