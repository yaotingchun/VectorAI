import React from 'react';
import { 
  Zap, 
  Disc, 
  Layers, 
  Box, 
  Cpu, 
  Activity,
  Boxes,
  Flame,
  ScanLine,
  ShieldAlert,
  QrCode,
  Film,
  LucideProps 
} from 'lucide-react';
import { MachineTypeId } from '../data/machineTypes';

interface MachineIconProps extends LucideProps {
  type: MachineTypeId | string;
}

export const MachineIcon: React.FC<MachineIconProps> = ({ type, ...props }) => {
  switch (type) {
    case 'wafer-saw':
    case 'wafer_dicing':
      return <Disc {...props} />;
    case 'stocker':
      return <Boxes {...props} />;
    case 'die-attach':
    case 'die_attacher':
      return <Layers {...props} />;
    case 'plasma-cleaner':
      return <Flame {...props} />;
    case 'wire-bonding':
    case 'wire_bonder':
      return <Zap {...props} />;
    case 'molding-press':
    case 'molding':
      return <Box {...props} />;
    case 'aoi-inspection':
      return <ScanLine {...props} />;
    case 'x-ray-inspection':
      return <ShieldAlert {...props} />;
    case 'laser-marking':
      return <QrCode {...props} />;
    case 'test-handler':
    case 'ic_tester':
      return <Cpu {...props} />;
    case 'tape-reel':
      return <Film {...props} />;
    default:
      return <Activity {...props} />;
  }
};
