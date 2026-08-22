import React from 'react';
import { Cpu, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

interface MachineSummaryCardsProps {
  total: number;
  healthy: number;
  warning: number;
  critical: number;
  offline?: number;
  selectedStatusFilter?: string;
  onSelectStatusFilter?: (status: string) => void;
}

export const MachineSummaryCards: React.FC<MachineSummaryCardsProps> = ({
  total,
  healthy,
  warning,
  critical,
  selectedStatusFilter = 'all',
  onSelectStatusFilter
}) => {
  const cards = [
    {
      id: 'all',
      label: 'TOTAL MACHINES',
      count: total,
      subtext: '5 machine types monitored',
      icon: <Cpu size={16} />,
      accentColor: 'var(--text-primary)',
      bgHover: 'var(--bg-muted)',
      isActive: selectedStatusFilter === 'all'
    },
    {
      id: 'healthy',
      label: 'HEALTHY',
      count: healthy,
      subtext: `${total > 0 ? Math.round((healthy / total) * 100) : 0}% in nominal state`,
      icon: <CheckCircle2 size={16} color="var(--accent-green)" />,
      accentColor: 'var(--accent-green)',
      bgHover: 'rgba(22, 163, 74, 0.08)',
      isActive: selectedStatusFilter === 'healthy'
    },
    {
      id: 'warning',
      label: 'WARNING',
      count: warning,
      subtext: `${warning} requires attention`,
      icon: <AlertTriangle size={16} color="var(--accent-amber)" />,
      accentColor: 'var(--accent-amber)',
      bgHover: 'rgba(217, 119, 6, 0.1)',
      isActive: selectedStatusFilter === 'warning'
    },
    {
      id: 'critical',
      label: 'CRITICAL',
      count: critical,
      subtext: `${critical} imminent breakdown`,
      icon: <AlertOctagon size={16} color="var(--accent-red)" />,
      accentColor: 'var(--accent-red)',
      bgHover: 'rgba(220, 38, 38, 0.1)',
      isActive: selectedStatusFilter === 'critical'
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '12px',
        marginBottom: '18px',
        width: '100%'
      }}
    >
      {cards.map((card) => {
        return (
          <div
            key={card.id}
            onClick={() => onSelectStatusFilter && onSelectStatusFilter(card.id)}
            style={{
              cursor: onSelectStatusFilter ? 'pointer' : 'default',
              transition: 'all var(--transition-fast)',
              backgroundColor: card.isActive ? 'var(--bg-surface)' : 'var(--bg-card)',
              border: card.isActive ? `1.5px solid ${card.accentColor}` : '1.5px solid var(--border-strong)',
              boxShadow: card.isActive 
                ? `2px 2px 0px ${card.accentColor}`
                : '2px 2px 0px rgba(18, 19, 21, 0.06)'
            }}
          >
            <div
              style={{
                padding: '9px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-surface)'
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  letterSpacing: '0.07em',
                  color: 'var(--text-muted)'
                }}
              >
                {card.label}
              </span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {card.icon}
              </div>
            </div>

            <div style={{ padding: '12px 14px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontVariantNumeric: 'tabular-nums',
                  fontSize: 'clamp(1.8rem, 2.3vw, 2.4rem)',
                  fontWeight: 800,
                  color: card.accentColor,
                  lineHeight: 1,
                  letterSpacing: '-0.02em'
                }}
              >
                {String(card.count).padStart(2, '0')}
              </div>
              <div
                style={{
                  fontSize: '11.5px',
                  color: 'var(--text-secondary)',
                  marginTop: '5px',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 500
                }}
              >
                {card.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
