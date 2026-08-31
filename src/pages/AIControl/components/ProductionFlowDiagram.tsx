import React from 'react';
import { GitFork } from 'lucide-react';
import { ScenarioDefinition } from '../types';

interface ProductionFlowDiagramProps {
  scenario: ScenarioDefinition;
  isRerouteActive: boolean;
  decisionApproved: boolean;
}

export const ProductionFlowDiagram: React.FC<ProductionFlowDiagramProps> = ({
  scenario,
  isRerouteActive,
  decisionApproved,
}) => {
  const { flowState } = scenario;

  return (
    <div className="flow-visualizer-card tech-card">
      <span className="corner-tl">+</span>
      <span className="corner-tr">+</span>
      <span className="corner-bl">+</span>
      <span className="corner-br">+</span>

      <div className="tech-card-header">
        <div className="tech-card-title">
          <GitFork size={14} />
          <span>PRODUCTION FLOW // ROUTE TOPOLOGY</span>
        </div>
        <span className="status-pill">
          {isRerouteActive ? (
            <span style={{ color: 'var(--accent-green)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span className="status-dot green" />
              DYNAMIC MULTI-ROUTE
            </span>
          ) : (
            <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span className="status-dot muted" />
              PRIMARY ROUTE ONLY
            </span>
          )}
        </span>
      </div>

      <div className="flow-card-body">
        <div className="flow-schematic-wrapper">
          {/* Primary Route */}
          <div className="flow-diagram-row">
            <div className="flow-node highlight-product">
              <span className="flow-node-type">PRODUCT</span>
              <span className="flow-node-title">{flowState.product}</span>
              <span className="flow-node-metric">Demand: 180 u/h</span>
            </div>

            <div className="flow-pipe">
              <div className={`flow-line ${isRerouteActive ? '' : 'anim-active'}`} />
              <span className="flow-pipe-label">
                {isRerouteActive ? '150 u/h' : '180 u/h'}
              </span>
            </div>

            <div className="flow-node near-capacity">
              <span className="flow-node-type">PRIMARY NODE</span>
              <span className="flow-node-title">{flowState.primaryMachine}</span>
              <span className="flow-node-metric" style={{ color: 'var(--accent-red)' }}>
                Load: {flowState.primaryLoadBefore}% (CAPACITY LIMIT)
              </span>
            </div>

            <div className="flow-pipe">
              <div className="flow-line" />
              <span className="flow-pipe-label">FABRICATE</span>
            </div>

            <div className="flow-node">
              <span className="flow-node-type">DESTINATION</span>
              <span className="flow-node-title">QA & Pack</span>
              <span className="flow-node-metric">Line 2 Output</span>
            </div>
          </div>

          {/* Rerouted Alternative Route (Active or Preview) */}
          {isRerouteActive && (
            <div
              style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px dashed var(--border-light)',
                position: 'relative',
              }}
            >
              <div className="flow-diagram-row">
                <div className="flow-node highlight-product" style={{ opacity: 0.6 }}>
                  <span className="flow-node-type">BYPASS FEED</span>
                  <span className="flow-node-title">{flowState.product}</span>
                  <span className="flow-node-metric">Surge Split</span>
                </div>

                <div className="flow-pipe">
                  <div className="flow-line anim-active" style={{ height: '3px' }} />
                  <span className="flow-pipe-label" style={{ color: 'var(--accent-green)', fontWeight: 800 }}>
                    +{flowState.rerouteCapacity} (Diverted)
                  </span>
                </div>

                <div className="flow-node new-route">
                  <span className="flow-node-type" style={{ color: 'var(--accent-green)' }}>
                    ★ ALTERNATIVE NODE
                  </span>
                  <span className="flow-node-title">{flowState.alternativeMachine}</span>
                  <span className="flow-node-metric" style={{ color: 'var(--accent-green)' }}>
                    Load: {flowState.altLoadBefore}% → {flowState.altLoadAfter}%
                  </span>
                </div>

                <div className="flow-pipe">
                  <div className="flow-line anim-active" />
                  <span className="flow-pipe-label">MERGE</span>
                </div>

                <div className="flow-node">
                  <span className="flow-node-type">DESTINATION</span>
                  <span className="flow-node-title">QA & Pack</span>
                  <span className="flow-node-metric">Line 2 Output</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Rerouting Impact Banner */}
        {isRerouteActive && (
          <div className="reroute-impact-banner">
            <div>
              <span className="reroute-banner-title">
                {decisionApproved ? 'ACTIVE REROUTING EXECUTED' : 'REROUTING RECOMMENDATION'}
              </span>
              <div style={{ fontSize: '11px', color: '#14532D', marginTop: '2px' }}>
                {flowState.product}: {flowState.primaryMachine} ➔ {flowState.alternativeMachine} ({flowState.rerouteCapacity})
              </div>
            </div>

            <div className="reroute-banner-details">
              <span>RATE: {flowState.rerouteCapacity}</span>
              <span>•</span>
              <span>WINDOW: {flowState.duration}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
