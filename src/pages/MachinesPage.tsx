import React from 'react';
import { MachinesPage as MachinesFeaturePage } from '../features/machines';

interface MachinesPageProps {
  initialMachineId?: string | null;
  onNavigateTab?: (tabId: string, contextId?: string) => void;
}

export const MachinesPage: React.FC<MachinesPageProps> = (props) => {
  return <MachinesFeaturePage {...props} />;
};

export default MachinesPage;
