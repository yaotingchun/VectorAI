import React from 'react';
import { DECISION_HISTORY } from '../data/decisionHistory';
import { Clock } from 'lucide-react';

export const DecisionHistory: React.FC = () => {
  return (
    <div className="decision-history-card tech-card">
      <span className="corner-tl">+</span>
      <span className="corner-tr">+</span>
      <span className="corner-bl">+</span>
      <span className="corner-br">+</span>

      <div className="tech-card-header">
        <div className="tech-card-title">
          <Clock size={14} />
          <span>DECISION AUDIT LOG // HISTORICAL REROUTE RECORDS</span>
        </div>
        <span className="status-pill">
          IMMUTABLE LEDGER
        </span>
      </div>

      <div className="history-list">
        {DECISION_HISTORY.map((item) => (
          <div key={item.id} className="history-item">
            <div className="history-left">
              <span className="history-date">
                {item.date} • {item.time} ({item.id})
              </span>
              <span className="history-scenario">{item.scenarioTitle}</span>
              <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 600 }}>
                ✓ {item.outcome}
              </span>
            </div>

            <div className="history-right">
              <div className="history-route-pill">
                {item.sourceMachine} → {item.targetMachine} ({item.capacityRerouted})
              </div>

              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                CONF: {(item.orchestratorConfidence * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
