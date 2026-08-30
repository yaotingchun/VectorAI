import React from 'react';
import { TabId, NAV_ITEMS } from '../../types/navigation';
import { Logo } from '../common/Logo';
import {
  LayoutDashboard,
  Factory,
  Package,
  Cpu,
  BrainCircuit,
  Wrench,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
}) => {
  const getIcon = (id: TabId) => {
    const size = 18;
    switch (id) {
      case 'dashboard':
        return <LayoutDashboard size={size} />;
      case 'vfactory':
        return <Factory size={size} />;
      case 'products':
        return <Package size={size} />;
      case 'machines':
        return <Cpu size={size} />;
      case 'prediction':
        return <BrainCircuit size={size} />;
      case 'maintenance':
        return <Wrench size={size} />;
      case 'configuration':
        return <Settings size={size} />;
    }
  };

  return (
    <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header with Brand Logo */}
      <div className="sidebar-header">
        <Logo
          size={collapsed ? 'sm' : 'md'}
          collapsed={collapsed}
          showSubtitle={!collapsed}
        />
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`nav-item-btn ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {getIcon(item.id)}
              </span>

              {!collapsed && (
                <span className="nav-item-label">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer with Collapse Control */}
      <div className="sidebar-footer">
        <button
          onClick={onToggleCollapse}
          className="tech-btn"
          style={{
            width: '100%',
            padding: '7px',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? (
            <ChevronRight size={15} />
          ) : (
            <>
              <ChevronLeft size={15} />
              <span>COLLAPSE</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
