import React from 'react';
import { Machine } from '../../types/machine';
import { MACHINE_TYPES } from '../../data/machineTypes';
import { Cpu } from 'lucide-react';
import { getHealthScoreColor } from '../../utils/machineStatus';

interface MachineOverviewProps {
  machine: Machine;
}

export const MachineOverview: React.FC<MachineOverviewProps> = ({ machine }) => {
  const typeDef = MACHINE_TYPES[machine.machineType];
  const { color: healthColor } = getHealthScoreColor(machine.healthScore);
  const onlineSensors = machine.sensors.filter((s) => s.status !== 'critical').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* Top Grid: Machine Identity & Core Specs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px'
        }}
      >
        {/* Metric Box 1: Location & Line */}
        <div className="telemetry-item" style={{ padding: '12px 14px' }}>
          <div className="telemetry-label" style={{ fontSize: 'var(--text-xs, 11px)', letterSpacing: '0.08em' }}>
            FACILITY & LOCATION
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', marginTop: '2px' }}>
            {machine.location.area}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', marginTop: '2px' }}>
            {machine.location.line} • {machine.location.station}
          </div>
        </div>

        {/* Metric Box 2: Health & Score */}
        <div className="telemetry-item" style={{ padding: '12px 14px' }}>
          <div className="telemetry-label" style={{ fontSize: 'var(--text-xs, 11px)', letterSpacing: '0.08em' }}>
            HEALTH SCORE
          </div>
          <div
            className="telemetry-value"
            style={{
              color: healthColor,
              fontFamily: 'var(--font-sans)',
              fontVariantNumeric: 'tabular-nums',
              fontSize: '22px',
              fontWeight: 800,
              marginTop: '2px'
            }}
          >
            {machine.healthScore}{' '}
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}>
            Status: <strong style={{ color: 'var(--text-primary)' }}>{machine.status.toUpperCase()}</strong>
          </div>
        </div>

        {/* Metric Box 3: Operating Hours */}
        <div className="telemetry-item" style={{ padding: '12px 14px' }}>
          <div className="telemetry-label" style={{ fontSize: 'var(--text-xs, 11px)', letterSpacing: '0.08em' }}>
            OPERATING RUNTIME
          </div>
          <div
            className="telemetry-value"
            style={{
              fontFamily: 'var(--font-sans)',
              fontVariantNumeric: 'tabular-nums',
              fontSize: '22px',
              fontWeight: 800,
              marginTop: '2px'
            }}
          >
            {machine.operatingHours.toLocaleString()}{' '}
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>hrs</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}>
            Installed: {machine.installationDate}
          </div>
        </div>

        {/* Metric Box 4: Sensors Online */}
        <div className="telemetry-item" style={{ padding: '12px 14px' }}>
          <div className="telemetry-label" style={{ fontSize: 'var(--text-xs, 11px)', letterSpacing: '0.08em' }}>
            SENSOR CONNECTIVITY
          </div>
          <div
            className="telemetry-value"
            style={{
              color: onlineSensors === machine.sensors.length ? 'var(--accent-green)' : 'var(--accent-amber)',
              fontFamily: 'var(--font-sans)',
              fontVariantNumeric: 'tabular-nums',
              fontSize: '22px',
              fontWeight: 800,
              marginTop: '2px'
            }}
          >
            {onlineSensors} / {machine.sensors.length}{' '}
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Active</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            IP: {machine.ipAddress}
          </div>
        </div>
      </div>

      {/* Industrial Machine Specification & Context Box */}
      <div className="tech-card">
        <div className="tech-card-header">
          <span className="tech-card-title">
            <Cpu size={15} /> EQUIPMENT SPECIFICATION & INDUSTRIAL CONTEXT
          </span>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            FIRMWARE {machine.firmwareVersion}
          </span>
        </div>

        <div className="tech-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <div
              style={{
                fontSize: 'var(--text-xs, 11px)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                marginBottom: '4px'
              }}
            >
              PROCESS FUNCTION & PURPOSE
            </div>
            <div style={{ fontSize: '13px', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', lineHeight: 1.55 }}>
              {typeDef ? typeDef.purpose : 'High-precision semiconductor back-end manufacturing equipment.'}
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: 'var(--text-xs, 11px)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                marginBottom: '4px'
              }}
            >
              SYSTEM ARCHITECTURE
            </div>
            <div style={{ fontSize: '13px', fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              {typeDef ? typeDef.description : ''}
            </div>
          </div>

          {/* AI / VectorAI Intelligence Relevance */}
          {typeDef && typeDef.aiRelevance && (
            <div
              style={{
                marginTop: '6px',
                paddingTop: '12px',
                borderTop: '1px dashed var(--border-light)'
              }}
            >
              <div
                style={{
                  fontSize: 'var(--text-xs, 11px)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.08em',
                  marginBottom: '8px'
                }}
              >
                VECTOR.AI INTELLIGENCE SUITE MONITORING CAPABILITIES
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {typeDef.aiRelevance.map((cap, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '12px',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 500,
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-strong)',
                      padding: '4px 10px',
                      color: 'var(--text-primary)'
                    }}
                  >
                    ● {cap}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
