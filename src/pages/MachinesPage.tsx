import React from 'react';
import { MachinesPage as MachinesFeaturePage, DetailTab } from '../features/machines';

interface MachinesPageProps {
  initialMachineId?: string | null;
  initialDetailTab?: DetailTab;
  onNavigateTab?: (tabId: string, contextId?: string) => void;
}

export const MachinesPage: React.FC<MachinesPageProps> = (props) => {
  return <MachinesFeaturePage {...props} />;
};

export default MachinesPage;
