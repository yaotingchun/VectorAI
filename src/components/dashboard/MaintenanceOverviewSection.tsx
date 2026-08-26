import React from 'react';
import { MaintenanceSummary } from '../../types/dashboard';
import { TabId } from '../../types/navigation';
import {
  Wrench,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface MaintenanceOverviewSectionProps {
  data: MaintenanceSummary;
  onNavigate?: (tab: TabId, machineId?: string) => void;
}

export const MaintenanceOverviewSection: React.FC<MaintenanceOverviewSectionProps> = ({
  data,
  onNavigate,
}) => {
  return (
    <section className="tech-card" aria-label="Factory Maintenance Overview">
      <span className="corner-tl">+</span>
      <span className="corner-tr">+</span>
      <span className="corner-bl">+</span>
      <span className="corner-br">+</span>

      <div className="tech-card-header">
        <div className="tech-card-title">
          <Wrench size={16} />
          <span>Factory Maintenance Workload Matrix</span>
        </div>

        <button
          type="button"
          onClick={() => onNavigate?.('maintenance')}
          className="tech-btn"
          style={{ padding: '4px 10px', fontSize: '10px' }}
        >
          <span>View Maintenance</span>
          <ArrowRight size={12} />
        </button>
      </div>

      <div className="tech-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* 4-Column Maintenance KPI Counters: Scheduled, In Progress, Completed, Overdue */}
        <div className="maint-metric-grid four-col">
          {/* Scheduled */}
          <div className="maint-metric-card" style={{ borderColor: 'var(--accent-blue)' }}>
            <span className="telemetry-label">Scheduled</span>
            <span className="telemetry-value text-blue" style={{ fontSize: '20px' }}>
              {data.dueToday + data.dueThisWeek}
            </span>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
              {data.dueToday} Today • {data.dueThisWeek} This Week
            </span>
          </div>

          {/* In Progress */}
          <div className="maint-metric-card" style={{ borderColor: 'var(--accent-purple)' }}>
            <span className="telemetry-label">In Progress</span>
            <span className="telemetry-value" style={{ color: 'var(--accent-purple)', fontSize: '20px' }}>
              {data.inProgress}
            </span>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Active Service Bays</span>
          </div>

          {/* Completed */}
          <div className="maint-metric-card" style={{ borderColor: 'var(--accent-green)' }}>
            <span className="telemetry-label">Completed</span>
            <span className="telemetry-value text-green" style={{ fontSize: '20px' }}>
              {data.recentlyCompleted}
            </span>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Last 7 Days (Closed)</span>
          </div>

          {/* Overdue */}
          <div className="maint-metric-card alert-due" style={{ borderColor: 'var(--accent-red)' }}>
            <span className="telemetry-label" style={{ color: 'var(--accent-red)' }}>Overdue</span>
            <span className="telemetry-value text-red" style={{ fontSize: '20px' }}>
              {data.overdue}
            </span>
            <span style={{ fontSize: '9px', color: 'var(--accent-red)', fontWeight: 700 }}>Immediate Attention</span>
          </div>
        </div>

        {/* Priority Maintenance Schedule Table */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Highest-Priority Scheduled Services
            </span>
            <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              CONNECTED DISPATCH
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="maint-table">
              <thead>
                <tr>
                  <th>WORK ORDER</th>
                  <th>MACHINE / BAY</th>
                  <th>TASK DESCRIPTION</th>
                  <th>PRIORITY</th>
                  <th>SCHEDULED DUE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {data.priorityTasks.slice(0, 5).map((task) => {
                  return (
                    <tr key={task.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                        {task.id}
                      </td>

                      <td>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                          {task.machineId}
                        </div>
                        <div style={{ fontSize: '9.5px', color: 'var(--text-secondary)' }}>
                          {task.location}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {task.taskTitle}
                        </div>
                        <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                          {task.category} • {task.estimatedDuration}
                        </div>
                      </td>

                      <td>
                        <span className={`priority-tag ${task.priority}`}>
                          {task.priority}
                        </span>
                      </td>

                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={11} color="var(--text-muted)" />
                          <span>{task.dueDate}</span>
                        </div>
                        {task.assignedTechnician && (
                          <div style={{ fontSize: '9.5px', color: 'var(--text-secondary)' }}>
                            {task.assignedTechnician}
                          </div>
                        )}
                      </td>

                      <td>
                        <button
                          onClick={() => onNavigate?.('maintenance', task.machineId)}
                          className="tech-btn"
                          style={{ padding: '3px 8px', fontSize: '9.5px' }}
                          title="Open in Maintenance Tab"
                        >
                          <span>View</span>
                          <ExternalLink size={10} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
