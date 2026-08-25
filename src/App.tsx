import React, { useState } from 'react';
import { TabId } from './types/navigation';
import { AppLayout } from './components/layout/AppLayout';
import { IntroScreen } from './components/intro/IntroScreen';
import { DashboardPage } from './pages/DashboardPage';
import { VFactoryPage } from './pages/VFactoryPage';
import { MachinesPage } from './pages/MachinesPage';
import { PredictionPage } from './pages/PredictionPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { ConfigurationPage } from './pages/ConfigurationPage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [showIntro, setShowIntro] = useState<boolean>(true);

  const handleNavigate = (tab: TabId, _machineId?: string) => {
    setActiveTab(tab);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'vfactory':
        return <VFactoryPage />;
      case 'machines':
        return <MachinesPage />;
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
    <>
      {showIntro && (
        <IntroScreen onComplete={() => setShowIntro(false)} />
      )}

      <AppLayout activeTab={activeTab} onSelectTab={setActiveTab}>
        {renderActivePage()}
      </AppLayout>
    </>
  );
};

export default App;
