import React, { useState } from 'react';
import { Machine } from '../../types/machine';
import { MACHINE_TYPES } from '../../data/machineTypes';
import { MachineIcon } from '../MachineIcon';
import { MachineStatusBadge } from '../MachineStatusBadge';
import { MachineOverview } from './MachineOverview';
import { SensorStatus } from './SensorStatus';
import { HealthTrendChart } from './HealthTrendChart';
import { RULCard } from './RULCard';
import { AnomalySummary } from './AnomalySummary';
import { MaintenanceSummary } from './MaintenanceSummary';
import { MachineDocuments } from './MachineDocuments';
import { MachinePrediction } from './MachinePrediction';
import { 
  ArrowLeft, 
  Factory, 
  Activity, 
  Wrench, 
  FileText, 
  ShieldAlert, 
  Radio,
  Download,
  BrainCircuit
} from 'lucide-react';

export type DetailTab = 'overview' | 'sensors' | 'anomalies' | 'prediction' | 'maintenance' | 'documents';

interface MachineDetailProps {
  machine: Machine;
  initialTab?: DetailTab;
  onBack: () => void;
  onViewOnFactory?: (machineId: string) => void;
  onNavigateToMaintenance?: (workOrderId?: string) => void;
}

export const MachineDetail: React.FC<MachineDetailProps> = ({
  machine,
  initialTab = 'overview',
  onBack,
  onViewOnFactory,
  onNavigateToMaintenance
}) => {
  const [activeTab, setActiveTab] = useState<DetailTab>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Automatically scroll to the top of the viewport when opening a machine or switching tabs
  React.useEffect(() => {
    const viewport = document.querySelector('.content-viewport');
    if (viewport) {
      viewport.scrollTop = 0;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [machine.id, activeTab]);

  const typeDef = MACHINE_TYPES[machine.machineType];
  const typeName = typeDef ? typeDef.name : machine.machineType;

  const handleExportTelemetry = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(machine, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${machine.id}_telemetry.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const tabs: { id: DetailTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    { id: 'overview', label: 'OVERVIEW', icon: <Activity size={13} /> },
    { id: 'sensors', label: 'SENSORS', icon: <Radio size={13} />, badge: machine.sensors.length },
    { 
      id: 'anomalies', 
      label: 'ANOMALIES', 
      icon: <ShieldAlert size={13} />,
      badge: machine.anomalies.length > 0 ? machine.anomalies.length : undefined
    },
    { 
      id: 'prediction', 
      label: 'PREDICTION', 
      icon: <BrainCircuit size={13} />,
      badge: ['Accelerated Wear', 'Imminent Failure'].includes(machine.rul.degradationStage) ? 'RISK' : undefined
    },
    { id: 'maintenance', label: 'MAINTENANCE', icon: <Wrench size={13} /> },
    { 
      id: 'documents', 
      label: 'DOCUMENTS', 
      icon: <FileText size={13} />, 
      badge: machine.documents?.filter(d => d.id.startsWith('DOC-VAI-MAN') || d.title.includes('Technical Manual')).length || 1 
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* Navigation & Header Banner */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          paddingBottom: '12px',
          borderBottom: '1.5px solid var(--border-strong)'
        }}
      >
        {/* Left: Back button + Machine Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onBack}
            className="tech-btn"
            style={{ padding: '6px 12px', fontSize: '11px' }}
            title="Return to Machine Fleet List"
          >
            <ArrowLeft size={13} />
            <span>BACK TO MACHINES</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'var(--bg-dark)',
                color: 'var(--text-inverted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <MachineIcon type={machine.machineType} size={16} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '0.03em'
                  }}
                >
                  {machine.id}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  — {machine.name}
                </span>
                <MachineStatusBadge status={machine.status} size="sm" />
              </div>

              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {typeName} • {machine.location.area} ({machine.location.station}) • Stage: {machine.processStage}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onViewOnFactory && (
            <button
              onClick={() => onViewOnFactory(machine.id)}
              className="tech-btn"
              style={{ fontSize: '11px', padding: '6px 12px' }}
              title="Locate & focus this machine in the v-Factory floor layout"
            >
              <Factory size={13} />
              <span>VIEW ON FACTORY</span>
            </button>
          )}

          <button
            onClick={handleExportTelemetry}
            className="tech-btn"
            style={{ fontSize: '11px', padding: '6px 12px' }}
            title="Export full machine telemetry JSON dataset"
          >
            <Download size={13} />
            <span>EXPORT TELEMETRY</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          borderBottom: '1.5px solid var(--border-strong)',
          paddingBottom: '2px'
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '7px 12px',
                border: '1.5px solid var(--border-strong)',
                borderBottom: isActive ? '1.5px solid var(--bg-dark)' : '1.5px solid var(--border-strong)',
                backgroundColor: isActive ? 'var(--bg-dark)' : 'var(--bg-card)',
                color: isActive ? 'var(--text-inverted)' : 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all var(--transition-fast)'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  style={{
                    fontSize: '9px',
                    padding: '1px 5px',
                    backgroundColor: isActive ? 'var(--bg-surface)' : 'var(--bg-dark)',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-inverted)',
                    fontWeight: 800
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {/* Overview Tab: Specs + Health Score & RUL + Degradation Curve */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <MachineOverview machine={machine} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              <RULCard rul={machine.rul} machine={machine} />
              <HealthTrendChart trendData={machine.healthTrend} currentScore={machine.healthScore} />
            </div>
          </div>
        )}

        {/* Dedicated Sensors Tab */}
        {activeTab === 'sensors' && <SensorStatus machine={machine} />}

        {/* Anomalies Tab */}
        {activeTab === 'anomalies' && (
          <AnomalySummary
            anomalies={
              machine.anomalies && machine.anomalies.length > 0
                ? machine.anomalies
                : machine.sensors
                    .filter((s) => s.status === 'critical' || s.status === 'warning' || (s as any).deviation >= 60)
                    .map((s, idx) => ({
                      id: `dynamic-ano-${machine.id}-${s.sensorId || s.name}-${idx}`,
                      timestamp: 'Live Telemetry Alert',
                      type: `${s.name} Deviation Alert`,
                      severity: (s.status === 'critical' || (s as any).deviation >= 85 ? 'critical' : 'medium') as 'critical' | 'medium',
                      description: `${s.name} is reading ${s.value}${s.unit}, exceeding the nominal safe baseline. Automated diagnostic reasoning invoked.`,
                      sensor: s.name,
                      confidence: 0.94,
                      status: 'active' as const,
                      recommendedAction: `Inspect sensor calibration and corresponding mechanical subsystem on ${machine.id}.`
                    }))
            }
            machine={machine}
          />
        )}

        {/* Prediction Tab */}
        {activeTab === 'prediction' && (
          <MachinePrediction
            machine={machine}
            onNavigateToMaintenance={onNavigateToMaintenance}
            onSelectTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* Maintenance Tab */}
        {activeTab === 'maintenance' && (
          <MaintenanceSummary
            maintenance={machine.maintenance}
            onNavigateToMaintenance={() => onNavigateToMaintenance && onNavigateToMaintenance(machine.id)}
          />
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <MachineDocuments
            documents={machine.documents}
            machineId={machine.id}
            machineType={machine.machineType}
          />
        )}
      </div>
    </div>
  );
};
