import React from 'react';
import { ProductionFlowDiagram } from './ProductionFlowDiagram';
import { MachineStatusList } from './MachineStatusList';
import { ScenarioDefinition } from '../types';

interface FactoryImpactPanelProps {
  scenario: ScenarioDefinition;
  isRerouteActive: boolean;
  decisionApproved: boolean;
}

export const FactoryImpactPanel: React.FC<FactoryImpactPanelProps> = ({
  scenario,
  isRerouteActive,
  decisionApproved,
}) => {
  return (
    <div className="factory-impact-container">
      {/* 1. Production Flow Visualizer */}
      <ProductionFlowDiagram
        scenario={scenario}
        isRerouteActive={isRerouteActive}
        decisionApproved={decisionApproved}
      />

      {/* 2. Machine Telemetry & Utilization */}
      <MachineStatusList
        activeTargetMachineId={scenario.flowState.alternativeMachine}
      />
    </div>
  );
};
