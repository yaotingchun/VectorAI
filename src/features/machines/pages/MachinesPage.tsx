import React, { useState, useMemo } from 'react';
import { useMachines } from '../hooks/useMachines';
import { filterMachines, getSummaryCounts } from '../utils/machineFilters';
import { MachineHeader } from '../components/MachineHeader';
import { MachineSummaryCards } from '../components/MachineSummaryCards';
import { MachineToolbar } from '../components/MachineToolbar';
import { MachineList } from '../components/MachineList';
import { MachineDetail } from '../components/detail/MachineDetail';
import { MachineTypeId } from '../data/machineTypes';

interface MachinesPageProps {
  initialMachineId?: string | null;
  onNavigateTab?: (tabId: string, contextId?: string) => void;
}

export const MachinesPage: React.FC<MachinesPageProps> = ({
  initialMachineId = null,
  onNavigateTab
}) => {
  const { machines, loading, error, refetch, isRealTime } = useMachines();

  // State Management
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(initialMachineId);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<MachineTypeId | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filtered Machines
  const filteredMachines = useMemo(() => {
    return filterMachines(machines, {
      searchQuery,
      machineType: selectedType,
      status: selectedStatus,
      sortBy: 'id'
    });
  }, [machines, searchQuery, selectedType, selectedStatus]);

  // Summary Metrics
  const summaryCounts = useMemo(() => {
    return getSummaryCounts(machines);
  }, [machines]);

  // Selected Machine Document
  const selectedMachine = useMemo(() => {
    if (!selectedMachineId) return null;
    return machines.find((m) => m.id === selectedMachineId) || null;
  }, [machines, selectedMachineId]);

  const handleSelectMachine = (id: string) => {
    setSelectedMachineId(id);
    const viewport = document.querySelector('.content-viewport');
    if (viewport) {
      viewport.scrollTop = 0;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToFleet = () => {
    setSelectedMachineId(null);
    const viewport = document.querySelector('.content-viewport');
    if (viewport) {
      viewport.scrollTop = 0;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Integration callbacks
  const handleViewOnFactory = (machineId: string) => {
    if (onNavigateTab) {
      onNavigateTab('vfactory', machineId);
    } else {
      alert(`[Factory Integration] Navigating to v-Factory with focus on machine ${machineId}`);
    }
  };

  const handleNavigateToMaintenance = (workOrderId?: string) => {
    if (onNavigateTab) {
      onNavigateTab('maintenance', workOrderId);
    } else {
      alert(`[Maintenance Integration] Opening work order ${workOrderId || 'N/A'}`);
    }
  };

  // If a single machine is selected, show Detail View
  if (selectedMachine) {
    return (
      <div style={{ width: '100%' }}>
        <MachineDetail
          machine={selectedMachine}
          onBack={handleBackToFleet}
          onViewOnFactory={handleViewOnFactory}
          onNavigateToMaintenance={handleNavigateToMaintenance}
        />
      </div>
    );
  }

  // Main Machines Fleet Dashboard
  return (
    <div style={{ width: '100%' }}>
      {/* Header with Refresh */}
      <MachineHeader
        isRealTime={isRealTime}
        totalMachines={summaryCounts.total}
        onRefresh={refetch}
      />

      {/* Summary Metrics Cards */}
      <MachineSummaryCards
        total={summaryCounts.total}
        healthy={summaryCounts.healthy}
        warning={summaryCounts.warning}
        critical={summaryCounts.critical}
        offline={summaryCounts.offline}
        selectedStatusFilter={selectedStatus}
        onSelectStatusFilter={(st) => setSelectedStatus(st)}
      />

      {/* Toolbar (Search, Type Filter, Status Filter, View Toggle) */}
      <MachineToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalFiltered={filteredMachines.length}
        totalCount={machines.length}
      />

      {/* Machine List (Grid / Table) */}
      <MachineList
        machines={filteredMachines}
        loading={loading}
        error={error}
        viewMode={viewMode}
        onSelectMachine={handleSelectMachine}
        onRetry={refetch}
        onClearFilters={() => {
          setSearchQuery('');
          setSelectedType('all');
          setSelectedStatus('all');
        }}
      />
    </div>
  );
};
