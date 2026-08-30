import { useState, useEffect, useRef, useCallback } from 'react';
import { SCENARIOS } from '../data/scenarios';
import { AgentId, AgentStatus, SimulationStatus, SimulationStep, ScenarioDefinition } from '../types';

export interface UseScenarioSimulationReturn {
  selectedScenario: ScenarioDefinition;
  selectedScenarioId: string;
  selectScenario: (scenarioId: string) => void;
  simulationStatus: SimulationStatus;
  visibleSteps: SimulationStep[];
  agentStatuses: Record<AgentId, AgentStatus>;
  orchestratorRevealed: boolean;
  orchestratorStatus: AgentStatus;
  decisionApproved: boolean;
  isRerouteActive: boolean;
  runSimulation: () => void;
  resetSimulation: () => void;
}

const INITIAL_AGENT_STATUSES: Record<AgentId, AgentStatus> = {
  product: 'waiting',
  monitoring: 'waiting',
  prediction: 'waiting',
  maintenance: 'waiting',
  rerouting: 'waiting',
  orchestrator: 'waiting',
};

export const useScenarioSimulation = (initialScenarioId = 'scenario-demand-surge'): UseScenarioSimulationReturn => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(initialScenarioId);
  const [simulationStatus, setSimulationStatus] = useState<SimulationStatus>('idle');
  const [visibleSteps, setVisibleSteps] = useState<SimulationStep[]>([]);
  const [agentStatuses, setAgentStatuses] = useState<Record<AgentId, AgentStatus>>(INITIAL_AGENT_STATUSES);
  const [orchestratorRevealed, setOrchestratorRevealed] = useState<boolean>(false);
  const [orchestratorStatus, setOrchestratorStatus] = useState<AgentStatus>('waiting');
  const [decisionApproved, setDecisionApproved] = useState<boolean>(false);
  const [isRerouteActive, setIsRerouteActive] = useState<boolean>(false);

  const timerRefs = useRef<NodeJS.Timeout[]>([]);

  const selectedScenario =
    SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];

  // Helper to clear all scheduled timers
  const clearAllTimers = useCallback(() => {
    timerRefs.current.forEach((t) => clearTimeout(t));
    timerRefs.current = [];
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // Reset simulation function
  const resetSimulation = useCallback(() => {
    clearAllTimers();
    setSimulationStatus('idle');
    setVisibleSteps([]);
    setAgentStatuses(INITIAL_AGENT_STATUSES);
    setOrchestratorRevealed(false);
    setOrchestratorStatus('waiting');
    setDecisionApproved(false);
    setIsRerouteActive(false);
  }, [clearAllTimers]);

  // Handle scenario change
  const selectScenario = useCallback(
    (scenarioId: string) => {
      resetSimulation();
      setSelectedScenarioId(scenarioId);
    },
    [resetSimulation]
  );

  // Run simulation sequentially
  const runSimulation = useCallback(() => {
    resetSimulation();
    setSimulationStatus('running');

    const scenario = selectedScenario;
    const steps = scenario.steps;
    if (!steps || steps.length === 0) return;

    // Immediately at 0ms: First agent starts analyzing
    const firstAgentId = steps[0].agentId;
    setAgentStatuses((prev) => ({
      ...prev,
      [firstAgentId]: 'analyzing',
    }));

    // Schedule each agent step
    steps.forEach((step, index) => {
      const stepTimer = setTimeout(() => {
        // Step completes
        setVisibleSteps((prev) => [...prev, step]);
        setAgentStatuses((prev) => {
          const nextStatuses = { ...prev, [step.agentId]: 'completed' as AgentStatus };
          // If there is a subsequent agent, set them to analyzing
          if (index + 1 < steps.length) {
            const nextAgentId = steps[index + 1].agentId;
            nextStatuses[nextAgentId] = 'analyzing';
          }
          return nextStatuses;
        });

        // If this is the last agent step (e.g. Rerouting Agent), activate the new route preview
        if (index === steps.length - 1) {
          setIsRerouteActive(true);
        }
      }, step.delayMs);

      timerRefs.current.push(stepTimer);
    });

    // Schedule Orchestrator appearance (6000ms)
    const orchAppearTimer = setTimeout(() => {
      setOrchestratorRevealed(true);
      setOrchestratorStatus('deciding');
      setAgentStatuses((prev) => ({
        ...prev,
        orchestrator: 'deciding',
      }));
    }, 6000);
    timerRefs.current.push(orchAppearTimer);

    // Schedule Final Decision Approved (7000ms)
    const finalDecisionTimer = setTimeout(() => {
      setDecisionApproved(true);
      setOrchestratorStatus('completed');
      setAgentStatuses((prev) => ({
        ...prev,
        orchestrator: 'completed',
      }));
      setSimulationStatus('completed');
      setIsRerouteActive(true);
    }, 7000);
    timerRefs.current.push(finalDecisionTimer);
  }, [resetSimulation, selectedScenario]);

  return {
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
  };
};
