import React from 'react';
import { 
  Zap, 
  Disc, 
  Layers, 
  Box, 
  Cpu, 
  Activity,
  LucideProps 
} from 'lucide-react';
import { MachineTypeId } from '../data/machineTypes';

interface MachineIconProps extends LucideProps {
  type: MachineTypeId | string;
}

export const MachineIcon: React.FC<MachineIconProps> = ({ type, ...props }) => {
  switch (type) {
    case 'wafer_dicing':
      return <Disc {...props} />;
    case 'die_attacher':
      return <Layers {...props} />;
    case 'wire_bonder':
      return <Zap {...props} />;
    case 'molding':
      return <Box {...props} />;
    case 'ic_tester':
      return <Cpu {...props} />;
    default:
      return <Activity {...props} />;
  }
};
