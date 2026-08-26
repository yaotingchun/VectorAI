import React from 'react';
import { FloorPlanVisualizer } from '../components/vfactory/floorplan/FloorPlanVisualizer';

interface VFactoryPageProps {
  onNavigateToMachine?: (machineId: string) => void;
}

export const VFactoryPage: React.FC<VFactoryPageProps> = ({ onNavigateToMachine }) => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <FloorPlanVisualizer onNavigateToMachine={onNavigateToMachine} />
    </div>
  );
};

export default VFactoryPage;

