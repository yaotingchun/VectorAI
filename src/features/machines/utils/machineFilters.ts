import { Machine } from '../types/machine';
import { MachineTypeId } from '../data/machineTypes';

export interface MachineFilterOptions {
  searchQuery: string;
  machineType: MachineTypeId | 'all';
  status: string; // 'all' | MachineStatus
  processStage?: string;
  sortBy?: 'id' | 'health' | 'rul' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export function filterMachines(
  machines: Machine[],
  options: MachineFilterOptions
): Machine[] {
  const {
    searchQuery = '',
    machineType = 'all',
    status = 'all',
    processStage = 'all',
    sortBy = 'id',
    sortOrder = 'asc'
  } = options;

  const normalizedQuery = searchQuery.trim().toLowerCase();

  return machines
    .filter((machine) => {
      // 1. Status Filter
      if (status !== 'all' && machine.status !== status) {
        return false;
      }

      // 2. Machine Type Filter
      if (machineType !== 'all' && machine.machineType !== machineType) {
        return false;
      }

      // 3. Process Stage Filter
      if (processStage !== 'all' && machine.processStage !== processStage) {
        return false;
      }

      // 4. Search Query (ID, Name, Type, Location area/line/station, status)
      if (normalizedQuery) {
        const matchesId = machine.id.toLowerCase().includes(normalizedQuery);
        const matchesName = machine.name.toLowerCase().includes(normalizedQuery);
        const matchesType = machine.machineType.toLowerCase().includes(normalizedQuery);
        const matchesStage = machine.processStage.toLowerCase().includes(normalizedQuery);
        const matchesArea = machine.location.area.toLowerCase().includes(normalizedQuery);
        const matchesLine = machine.location.line.toLowerCase().includes(normalizedQuery);
        const matchesStation = machine.location.station.toLowerCase().includes(normalizedQuery);
        const matchesStatus = machine.status.toLowerCase().includes(normalizedQuery);

        if (
          !matchesId &&
          !matchesName &&
          !matchesType &&
          !matchesStage &&
          !matchesArea &&
          !matchesLine &&
          !matchesStation &&
          !matchesStatus
        ) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'health') {
        comparison = a.healthScore - b.healthScore;
      } else if (sortBy === 'rul') {
        comparison = a.rul.value - b.rul.value;
      } else if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else {
        // Default sort by ID
        comparison = a.id.localeCompare(b.id, undefined, { numeric: true });
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });
}

export function getSummaryCounts(machines: Machine[]) {
  const total = machines.length;
  let healthy = 0;
  let warning = 0;
  let critical = 0;
  let offline = 0;
  let maintenance = 0;

  for (const m of machines) {
    if (m.status === 'healthy') healthy++;
    else if (m.status === 'warning') warning++;
    else if (m.status === 'critical') critical++;
    else if (m.status === 'offline') offline++;
    else if (m.status === 'maintenance') maintenance++;
  }

  return { total, healthy, warning, critical, offline, maintenance };
}
