import React, { useState } from 'react';
import { TabId } from '../../types/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activeTab,
  onSelectTab,
  children,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="app-container">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Workspace */}
      <div className="main-wrapper">
        <Header activeTab={activeTab} />
        
        <main className={`content-viewport blueprint-grid ${activeTab === 'rerouting' || activeTab === 'vfactory' ? 'canvas-mode' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};
