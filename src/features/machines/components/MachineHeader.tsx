import React from 'react';
import { RefreshCw, Radio } from 'lucide-react';

interface MachineHeaderProps {
  isRealTime: boolean;
  totalMachines: number;
  onRefresh: () => void;
}

export const MachineHeader: React.FC<MachineHeaderProps> = ({
  isRealTime,
  totalMachines,
  onRefresh
}) => {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          paddingBottom: '10px',
          borderBottom: '1.5px solid var(--border-strong)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)'
              }}
            >
              Machines
            </span>

            <span
              style={{
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                backgroundColor: 'var(--bg-dark)',
                color: 'var(--text-inverted)',
                padding: '2px 7px',
                fontWeight: 700,
                letterSpacing: '0.08em'
              }}
            >
              NODE // MACH
            </span>

            {isRealTime && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-green)',
                  border: '1px solid var(--accent-green)',
                  padding: '1px 6px',
                  fontWeight: 700,
                  backgroundColor: 'rgba(22, 163, 74, 0.08)'
                }}
              >
                <Radio size={11} className="animate-pulse" />
                LIVE TELEMETRY
              </span>
            )}
          </div>

          <p
            style={{
              fontSize: '11.5px',
              color: 'var(--text-secondary)',
              marginTop: '3px',
              fontFamily: 'var(--font-mono)'
            }}
          >
            Semiconductor Back-End & OSAT Equipment Monitoring • {totalMachines} Active Digital Nodes
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onRefresh}
            className="tech-btn"
            title="Refresh and synchronize all machine telemetry from Firestore"
            style={{ fontSize: '11px', padding: '5px 12px' }}
          >
            <RefreshCw size={12} />
            <span>REFRESH</span>
          </button>
        </div>
      </div>
    </div>
  );
};
