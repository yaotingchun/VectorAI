import { FactoryMachineState, FactoryProductState } from '../types';

export const FACTORY_MACHINES: FactoryMachineState[] = [
  {
    id: 'M-01',
    name: 'CNC Milling Center M-01',
    type: 'Multi-Axis Precision Milling',
    utilization: 58,
    health: 82,
    rulHours: 28,
    compatibleProducts: ['Product A', 'Product B'],
    maintenanceInHours: 10,
    status: 'optimal',
    statusNote: 'Spare capacity available; scheduled maintenance in 10h',
  },
  {
    id: 'M-02',
    name: 'Turning Center M-02',
    type: 'High-Speed CNC Lathe',
    utilization: 72,
    health: 91,
    rulHours: 140,
    compatibleProducts: ['Product A'],
    maintenanceInHours: 72,
    status: 'optimal',
    statusNote: 'Configured for Product A exclusively',
  },
  {
    id: 'M-03',
    name: 'Advanced Machining Center M-03',
    type: '5-Axis High-Torque Milling',
    utilization: 96,
    health: 74,
    rulHours: 42,
    compatibleProducts: ['Product B'],
    maintenanceInHours: null,
    status: 'near_capacity',
    statusNote: 'Operating at 96% load. Near thermal & spindle threshold',
  },
];

export const FACTORY_PRODUCTS: FactoryProductState[] = [
  {
    id: 'prod-a',
    name: 'Product A',
    code: 'PRD-A // HIGH-PRECISION CORE',
    normalDemandPerHour: 100,
    currentDemandPerHour: 100,
    primaryMachine: 'M-01',
    alternativeMachine: 'M-02',
    compatibleMachines: ['M-01', 'M-02'],
  },
  {
    id: 'prod-b',
    name: 'Product B',
    code: 'PRD-B // AEROSPACE TURBINE BLADE',
    normalDemandPerHour: 120,
    currentDemandPerHour: 180,
    primaryMachine: 'M-03',
    alternativeMachine: 'M-01',
    compatibleMachines: ['M-01', 'M-03'],
  },
];

export const MACHINE_COMPATIBILITY_MATRIX = [
  {
    machineId: 'M-01',
    machineName: 'M-01 (CNC Milling)',
    productA: true,
    productB: true,
    notes: 'Tooling head swapped for dual-profile A & B support',
  },
  {
    machineId: 'M-02',
    machineName: 'M-02 (Turning Center)',
    productA: true,
    productB: false,
    notes: 'Incompatible chuck geometry for Product B',
  },
  {
    machineId: 'M-03',
    machineName: 'M-03 (5-Axis Machining)',
    productA: false,
    productB: true,
    notes: 'Dedicated 5-Axis jig for Product B profile only',
  },
];
