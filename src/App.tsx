import React, { useState } from 'react';
import { TabId } from './types/navigation';
import { AppLayout } from './components/layout/AppLayout';
import { IntroScreen } from './components/intro/IntroScreen';
import { DashboardPage } from './pages/DashboardPage';
import { MonitoringPage } from './pages/MonitoringPage';
import { VFactoryPage } from './pages/VFactoryPage';
import { MachinesPage } from './pages/MachinesPage';
import { PredictionPage } from './pages/PredictionPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { ConfigurationPage } from './pages/ConfigurationPage';
import { FactoryProvider } from './context/FactoryContext';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [focusedMachineId, setFocusedMachineId] = useState<string | null>(null);

  const handleNavigateTab = (tabId: string, contextId?: string) => {
    setActiveTab(tabId as TabId);
    if (contextId) {
      setFocusedMachineId(contextId);
    }
  };

  const handleNavigate = (tab: TabId, machineId?: string) => {
    setActiveTab(tab);
    if (machineId) {
      setFocusedMachineId(machineId);
    }
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'monitoring':
        return (
          <MonitoringPage
            initialMachineId={focusedMachineId}
            onNavigate={handleNavigate}
          />
        );
      case 'vfactory':
        return <VFactoryPage />;
      case 'machines':
        return (
          <MachinesPage
            initialMachineId={focusedMachineId}
            onNavigateTab={handleNavigateTab}
          />
        );
      case 'prediction':
        return <PredictionPage />;
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

      <AppLayout activeTab={activeTab} onSelectTab={setActiveTab}>
        {renderActivePage()}
      </AppLayout>
    </FactoryProvider>
  );
};

export default App;
