import React from 'react';
import { SCENARIOS } from '../data/scenarios';
import { ScenarioDefinition, SimulationStatus } from '../types';
import { Play, RotateCcw, Activity } from 'lucide-react';

interface ScenarioSimulatorProps {
  selectedScenario: ScenarioDefinition;
  selectedScenarioId: string;
  onSelectScenario: (id: string) => void;
  simulationStatus: SimulationStatus;
  onRunSimulation: () => void;
  onResetSimulation: () => void;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  selectedScenario,
  selectedScenarioId,
  onSelectScenario,
  simulationStatus,
  onRunSimulation,
  onResetSimulation,
}) => {
  const getStatusBadge = () => {
    switch (simulationStatus) {
      case 'idle':
        return (
          <span className="status-pill">
            <span className="status-dot muted" />
            WAITING FOR SCENARIO
          </span>
        );
      case 'running':
        return (
          <span className="status-pill" style={{ borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)' }}>
            <span className="status-dot pulse blue" />
            AGENTS COLLABORATING
          </span>
        );
      case 'completed':
        return (
          <span className="status-pill dark" style={{ borderColor: 'var(--accent-green)' }}>
            <span className="status-dot" />
            DECISION COMPLETED
          </span>
        );
    }
  };

  return (
    <div className="scenario-simulator-card tech-card">
      <span className="corner-tl">+</span>
      <span className="corner-tr">+</span>
      <span className="corner-bl">+</span>
      <span className="corner-br">+</span>

      <div className="tech-card-header">
        <div className="tech-card-title">
          <Activity size={14} />
          <span>SCENARIO SIMULATOR</span>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      <div className="simulator-body">
        <div className="simulator-controls-row">
          <div className="scenario-selector-group">
            <label htmlFor="scenario-select" className="scenario-label">
              Selected Scenario:
            </label>
            <select
              id="scenario-select"
              value={selectedScenarioId}
              onChange={(e) => onSelectScenario(e.target.value)}
              className="scenario-select"
              disabled={simulationStatus === 'running'}
            >
              {SCENARIOS.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.title} ({scenario.code})
                </option>
              ))}
            </select>
          </div>

          <div className="simulator-action-group">
            <button
              onClick={onRunSimulation}
              disabled={simulationStatus === 'running'}
              className="tech-btn primary"
              title="Run multi-agent sequential analysis simulation"
            >
              <Play size={13} fill="currentColor" />
              <span>{simulationStatus === 'running' ? 'SIMULATING...' : 'RUN SIMULATION'}</span>
            </button>

            <button
              onClick={onResetSimulation}
              className="tech-btn"
              title="Reset simulation and clear active routes"
            >
              <RotateCcw size={13} />
              <span>RESET</span>
            </button>
          </div>
        </div>

        <div className="simulator-status-banner">
          <div className="scenario-info-row">
            <span className="scenario-info-label">DESCRIPTION:</span>
            <span className="scenario-desc-text">"{selectedScenario.description}"</span>
          </div>
          <div className="scenario-info-row">
            <span className="scenario-info-label">TRIGGER EVENT:</span>
            <span className="scenario-trigger-text">{selectedScenario.triggerEvent}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
