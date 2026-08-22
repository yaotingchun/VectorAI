import React from 'react';
import { MaintenanceRecord } from '../../types/machine';
import { Wrench, FileText, CheckSquare } from 'lucide-react';

interface MaintenanceSummaryProps {
  maintenance: MaintenanceRecord;
  onNavigateToMaintenance?: (workOrderId?: string) => void;
}

export const MaintenanceSummary: React.FC<MaintenanceSummaryProps> = ({
  maintenance,
  onNavigateToMaintenance
}) => {
  let statusColor = 'var(--accent-green)';
  let statusBg = 'rgba(22, 163, 74, 0.1)';

  if (maintenance.status === 'overdue') {
    statusColor = 'var(--accent-red)';
    statusBg = 'rgba(220, 38, 38, 0.12)';
  } else if (maintenance.status === 'in_progress') {
    statusColor = 'var(--accent-blue)';
    statusBg = 'rgba(37, 99, 235, 0.12)';
  } else if (maintenance.status === 'scheduled') {
    statusColor = 'var(--accent-amber)';
    statusBg = 'rgba(217, 119, 6, 0.12)';
  }

  return (
    <div className="tech-card">
      <div className="tech-card-header">
        <span className="tech-card-title">
          <Wrench size={14} /> PREVENTIVE & CORRECTIVE MAINTENANCE SCHEDULE
        </span>
        <span
          style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: statusColor,
            backgroundColor: statusBg,
            border: `1px solid ${statusColor}`,
            padding: '2px 8px',
            textTransform: 'uppercase'
          }}
        >
          {maintenance.status.replace('_', ' ')}
        </span>
      </div>

      <div className="tech-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Key Maintenance Dates Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px'
          }}
        >
          <div className="telemetry-item">
            <div className="telemetry-label">LAST SERVICE DATE</div>
            <div className="telemetry-value" style={{ fontSize: '13px' }}>
              {maintenance.lastMaintenanceDate}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Completed & Signed Off</div>
          </div>

          <div className="telemetry-item">
            <div className="telemetry-label">NEXT SCHEDULED SERVICE</div>
            <div className="telemetry-value" style={{ fontSize: '13px', color: statusColor }}>
              {maintenance.nextScheduledDate}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              Type: {maintenance.type}
            </div>
          </div>

          <div className="telemetry-item">
            <div className="telemetry-label">ASSIGNED LEAD TECHNICIAN</div>
            <div style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {maintenance.technician}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              WO: {maintenance.workOrderId || 'N/A'}
            </div>
          </div>
        </div>

        {/* Notes & Checklist if present */}
        {maintenance.notes && (
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)'
            }}
          >
            <strong style={{ color: 'var(--text-primary)' }}>Service Notes:</strong> {maintenance.notes}
          </div>
        )}

        {maintenance.checklistCount && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckSquare size={14} color="var(--accent-green)" />
              <span>Standard PM Inspection Checklist</span>
            </div>
            <span style={{ fontWeight: 700 }}>
              {maintenance.checklistCount.completed} / {maintenance.checklistCount.total} Items Checked
            </span>
          </div>
        )}

        {/* Integration button to Maintenance module */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '4px' }}>
          <button
            onClick={() => onNavigateToMaintenance && onNavigateToMaintenance(maintenance.workOrderId)}
            className="tech-btn"
            style={{ fontSize: '11px' }}
          >
            <FileText size={13} />
            <span>OPEN IN MAINTENANCE MODULE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
