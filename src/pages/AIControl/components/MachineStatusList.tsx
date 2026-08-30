import React from 'react';
import { FACTORY_MACHINES } from '../data/factoryState';
import { Cpu } from 'lucide-react';

interface MachineStatusListProps {
  activeTargetMachineId?: string;
}

export const MachineStatusList: React.FC<MachineStatusListProps> = ({ activeTargetMachineId = 'M-01' }) => {
  return (
    <div className="tech-card">
      <span className="corner-tl">+</span>
      <span className="corner-tr">+</span>

      <div className="tech-card-header">
        <div className="tech-card-title">
          <Cpu size={14} />
          <span>MACHINE TELEMETRY & HEALTH POOL</span>
        </div>
        <span className="status-pill">
          3 NODES ONLINE
        </span>
      </div>

      <div className="tech-card-body" style={{ padding: '12px' }}>
        <div className="machine-telemetry-list">
          {FACTORY_MACHINES.map((machine) => {
            const isTarget = machine.id === activeTargetMachineId;
            const isNearCapacity = machine.status === 'near_capacity';

            return (
              <div
                key={machine.id}
                className={`machine-item-card ${isTarget ? 'active-target' : ''}`}
              >
                <div className="machine-item-top">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="machine-id-tag">{machine.id}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {machine.name}
                    </span>
                  </div>

                  <div>
                    {isNearCapacity ? (
                      <span className="status-pill" style={{ borderColor: 'var(--accent-red)', color: 'var(--accent-red)' }}>
                        <span className="status-dot critical" />
                        NEAR CAPACITY
                      </span>
                    ) : (
                      <span className="status-pill">
                        <span className="status-dot green" />
                        AVAILABLE
                      </span>
                    )}
                  </div>
                </div>

                <div className="machine-bars-row">
                  {/* Utilization Bar */}
                  <div className="stat-bar-group">
                    <div className="stat-bar-labels">
                      <span>UTILIZATION</span>
                      <span>{machine.utilization}%</span>
                    </div>
                    <div className="stat-bar-track">
                      <div
                        className={`stat-bar-fill ${
                          machine.utilization > 90
                            ? 'red'
                            : machine.utilization > 70
                            ? 'amber'
                            : 'green'
                        }`}
                        style={{ width: `${machine.utilization}%` }}
                      />
                    </div>
                  </div>

                  {/* Health Bar */}
                  <div className="stat-bar-group">
                    <div className="stat-bar-labels">
                      <span>HEALTH SCORE</span>
                      <span>{machine.health}/100</span>
                    </div>
                    <div className="stat-bar-track">
                      <div
                        className={`stat-bar-fill ${
                          machine.health > 80 ? 'green' : 'amber'
                        }`}
                        style={{ width: `${machine.health}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="machine-extra-info">
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>RUL: </span>
                    <span style={{ fontWeight: 700 }}>{machine.rulHours}h</span>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Maintenance: </span>
                    <span style={{ fontWeight: 700, color: machine.maintenanceInHours && machine.maintenanceInHours <= 10 ? 'var(--accent-amber)' : 'inherit' }}>
                      {machine.maintenanceInHours ? `In ${machine.maintenanceInHours}h` : 'None Scheduled'}
                    </span>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Compat: </span>
                    <span style={{ fontWeight: 700 }}>{machine.compatibleProducts.join(', ')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
