import React, { useState, useEffect } from 'react';
import { TabId, NAV_ITEMS } from '../../types/navigation';

interface HeaderProps {
  activeTab: TabId;
}

export const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentNav = NAV_ITEMS.find((n) => n.id === activeTab) || NAV_ITEMS[0];

  return (
    <header className="app-header">
      {/* Breadcrumbs */}
      <div className="header-breadcrumbs">
        <span style={{ color: 'var(--text-muted)' }}>VECTOR.AI</span>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        <span
          style={{
            backgroundColor: 'var(--bg-dark)',
            color: 'var(--text-inverted)',
            padding: '3px 10px',
            fontSize: '11px',
            letterSpacing: '0.08em',
          }}
        >
          {currentNav.label.toUpperCase()}
        </span>
      </div>

      {/* Right Clock */}
      <div className="header-status-group" style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            border: '1.5px solid var(--border-strong)',
            backgroundColor: 'var(--bg-card)',
            padding: '5px 12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            color: 'var(--text-primary)',
          }}
        >
          {timeStr || '00:00:00'}
        </div>
      </div>
    </header>
  );
};
