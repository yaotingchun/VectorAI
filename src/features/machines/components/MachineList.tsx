import React from 'react';
import { Machine } from '../types/machine';
import { MachineCard } from './MachineCard';
import { MachineTableRow } from './MachineTableRow';
import { AlertCircle, RefreshCw, Layers } from 'lucide-react';

interface MachineListProps {
  machines: Machine[];
  loading: boolean;
  error: Error | null;
  viewMode: 'grid' | 'table';
  onSelectMachine: (machineId: string) => void;
  onRetry: () => void;
  onClearFilters?: () => void;
}

export const MachineList: React.FC<MachineListProps> = ({
  machines,
  loading,
  error,
  viewMode,
  onSelectMachine,
  onRetry,
  onClearFilters
}) => {
  // 1. Loading Skeleton State
  if (loading) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '14px',
          width: '100%'
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="tech-card animate-pulse"
            style={{ height: '220px', backgroundColor: 'var(--bg-card)', padding: '14px' }}
          >
            <div
              style={{
                height: '24px',
                backgroundColor: 'var(--bg-muted)',
                marginBottom: '12px',
                width: '60%'
              }}
            />
            <div
              style={{
                height: '14px',
                backgroundColor: 'var(--bg-muted)',
                marginBottom: '8px',
                width: '90%'
              }}
            />
            <div
              style={{
                height: '14px',
                backgroundColor: 'var(--bg-muted)',
                marginBottom: '16px',
                width: '40%'
              }}
            />
            <div
              style={{
                height: '36px',
                backgroundColor: 'var(--bg-muted)',
                width: '100%'
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div
        className="tech-card"
        style={{
          padding: '32px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--accent-red)',
          width: '100%'
        }}
      >
        <AlertCircle size={32} color="var(--accent-red)" style={{ margin: '0 auto 10px auto' }} />
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--accent-red)',
            marginBottom: '6px'
          }}
        >
          UNABLE TO LOAD MACHINE TELEMETRY
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '14px' }}>
          {error.message || 'Check network connection or Firestore collection access.'}
        </p>
        <button onClick={onRetry} className="tech-btn primary" style={{ padding: '6px 12px', fontSize: '11px' }}>
          <RefreshCw size={12} />
          <span>RETRY CONNECTION</span>
        </button>
      </div>
    );
  }

  // 3. Empty Search / Filter Results State
  if (machines.length === 0) {
    return (
      <div
        className="tech-card"
        style={{
          padding: '40px 16px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-surface)',
          width: '100%'
        }}
      >
        <Layers size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px auto' }} />
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '15px',
            fontWeight: 700,
            marginBottom: '6px',
            letterSpacing: '0.04em'
          }}
        >
          NO SEMICONDUCTOR MACHINES FOUND
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '14px' }}>
          No equipment instances match the selected type, stage, status, or search query.
        </p>
        {onClearFilters && (
          <button onClick={onClearFilters} className="tech-btn" style={{ padding: '6px 12px', fontSize: '11px' }}>
            RESET ALL FILTERS
          </button>
        )}
      </div>
    );
  }

  // 4. Table View Mode
  if (viewMode === 'table') {
    return (
      <div
        className="tech-card"
        style={{
          overflowX: 'auto',
          backgroundColor: 'var(--bg-card)',
          width: '100%'
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left'
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderBottom: '1.5px solid var(--border-strong)',
                fontFamily: 'var(--font-display)',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                letterSpacing: '0.05em'
              }}
            >
              <th style={{ padding: '10px 14px' }}>MACHINE ID</th>
              <th style={{ padding: '10px 14px' }}>TYPE & STAGE</th>
              <th style={{ padding: '10px 14px' }}>STATUS</th>
              <th style={{ padding: '10px 14px' }}>HEALTH SCORE</th>
              <th style={{ padding: '10px 14px' }}>RUL PREDICTION</th>
              <th style={{ padding: '10px 14px' }}>SENSORS</th>
              <th style={{ padding: '10px 14px' }}>LOCATION</th>
              <th style={{ padding: '10px 14px', textAlign: 'right' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {machines.map((machine) => (
              <MachineTableRow
                key={machine.id}
                machine={machine}
                onSelect={onSelectMachine}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // 5. Grid View Mode (Default)
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '14px',
        width: '100%'
      }}
    >
      {machines.map((machine) => (
        <MachineCard
          key={machine.id}
          machine={machine}
          onSelect={onSelectMachine}
        />
      ))}
    </div>
  );
};
