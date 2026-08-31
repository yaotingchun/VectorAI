import React from 'react';
import { useScenarioSimulation } from './hooks/useScenarioSimulation';
import { AIControlHeader } from './components/AIControlHeader';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { AgentCollaboration } from './components/AgentCollaboration';
import { FactoryImpactPanel } from './components/FactoryImpactPanel';
import { DecisionHistory } from './components/DecisionHistory';
import './styles/aicontrol.css';

interface AIControlPageProps {
  onNavigate?: (tab: string, machineId?: string, subTab?: string) => void;
}

export const AIControlPage: React.FC<AIControlPageProps> = () => {
  const {
    selectedScenario,
    selectedScenarioId,
    selectScenario,
    simulationStatus,
    visibleSteps,
    agentStatuses,
    orchestratorRevealed,
    orchestratorStatus,
    decisionApproved,
    isRerouteActive,
    runSimulation,
    resetSimulation,
  } = useScenarioSimulation();

  return (
    <div className="ai-control-root" role="region" aria-label="VectorAI Command Center">
      {/* 1. Top Level Industrial Header */}
      <AIControlHeader onRefresh={resetSimulation} />

      {/* 2. Interactive Scenario Simulation Controls */}
      <ScenarioSimulator
        selectedScenario={selectedScenario}
        selectedScenarioId={selectedScenarioId}
        onSelectScenario={selectScenario}
        simulationStatus={simulationStatus}
        onRunSimulation={runSimulation}
        onResetSimulation={resetSimulation}
      />

      {/* 3. Main Two-Column Operational Layout */}
      <div className="ai-main-two-col-grid">
        {/* Left Column: Agent Collaboration & Orchestrator Decision */}
        <AgentCollaboration
          visibleSteps={visibleSteps}
          agentStatuses={agentStatuses}
          orchestratorRevealed={orchestratorRevealed}
          orchestratorStatus={orchestratorStatus}
          decisionApproved={decisionApproved}
          orchestratorDecision={selectedScenario.orchestratorDecision}
          simulationStatus={simulationStatus}
        />

        {/* Right Column: Production Flow Visualizer & Live Machine Telemetry */}
        <FactoryImpactPanel
          scenario={selectedScenario}
          isRerouteActive={isRerouteActive}
          decisionApproved={decisionApproved}
        />
      </div>

      {/* 4. Bottom Section: Immutable Decision Audit Ledger */}
      <DecisionHistory />
    </div>
  );
};

export default AIControlPage;
