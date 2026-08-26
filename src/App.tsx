import React, { useState } from 'react';
import { TabId } from './types/navigation';
import { AppLayout } from './components/layout/AppLayout';
import { IntroScreen } from './components/intro/IntroScreen';
import { DashboardPage } from './pages/DashboardPage';
import { VFactoryPage } from './pages/VFactoryPage';
import { MachinesPage } from './pages/MachinesPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { ConfigurationPage } from './pages/ConfigurationPage';
import { DetailTab } from './features/machines';
import { FactoryProvider } from './context/FactoryContext';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [focusedMachineId, setFocusedMachineId] = useState<string | null>(null);
  const [focusedDetailTab, setFocusedDetailTab] = useState<DetailTab | undefined>(undefined);

  const handleNavigateTab = (tabId: string, contextId?: string, subTab?: string) => {
    if (tabId === 'prediction') {
      setActiveTab('machines');
      if (contextId) {
        setFocusedMachineId(contextId);
      }
      setFocusedDetailTab('prediction');
      return;
    }
    setActiveTab(tabId as TabId);
    if (contextId) {
      setFocusedMachineId(contextId);
    }
    if (subTab) {
      setFocusedDetailTab(subTab as DetailTab);
    } else {
      setFocusedDetailTab(undefined);
    }
  };

  const handleNavigate = (tab: TabId | string, machineId?: string) => {
    if (tab === 'prediction') {
      setActiveTab('machines');
      if (machineId) {
        setFocusedMachineId(machineId);
      }
      setFocusedDetailTab('prediction');
      return;
    }
    setActiveTab(tab as TabId);
    if (machineId) {
      setFocusedMachineId(machineId);
    }
    setFocusedDetailTab(undefined);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'vfactory':
        return <VFactoryPage />;
      case 'machines':
        return (
          <MachinesPage
            initialMachineId={focusedMachineId}
            initialDetailTab={focusedDetailTab}
            onNavigateTab={handleNavigateTab}
          />
        );
      case 'prediction':
        return (
          <MachinesPage
            initialMachineId={focusedMachineId}
            initialDetailTab="prediction"
            onNavigateTab={handleNavigateTab}
          />
        );
      case 'maintenance':
        return <MaintenancePage />;
      case 'configuration':
        return <ConfigurationPage />;
      default:
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <FactoryProvider>
      {showIntro && (
        <IntroScreen onComplete={() => setShowIntro(false)} />
      )}

      <AppLayout activeTab={activeTab} onSelectTab={setActiveTab} onNavigate={handleNavigate}>
        {renderActivePage()}
      </AppLayout>
    </FactoryProvider>
  );
};

export default App;
