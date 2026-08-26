import React, { useState } from 'react';
import { FloorMachineAsset } from '../../../types/floorPlan';
import { FloorIcon } from './FloorIcons';
import {
  Activity,
  Thermometer,
  Zap,
  Clock,
  ExternalLink,
  Edit3,
  Trash2,
  X,
  Cpu,
  Radio,
  Layers,
  Gauge,
  Boxes,
} from 'lucide-react';

interface AssetDetailsInspectorProps {
  selectedAsset: FloorMachineAsset | null;
  onClose?: () => void;
  onNavigateToMachine?: (machineId: string) => void;
  onRemoveAsset?: (assetId: string) => void;
  onUpdateAsset?: (asset: FloorMachineAsset) => void;
  onOpenSensorProvisioning?: (machine: FloorMachineAsset) => void;
}

export const AssetDetailsInspector: React.FC<AssetDetailsInspectorProps> = ({
  selectedAsset,
  onClose,
  onNavigateToMachine,
  onRemoveAsset,
  onUpdateAsset,
  onOpenSensorProvisioning,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editNotes, setEditNotes] = useState('');

  if (!selectedAsset) {
    return (
      <aside className="asset-details-inspector empty" aria-label="Asset Details">
        <div className="inspector-empty-state">
          <div className="inspector-empty-icon-ring">
            <Cpu size={32} strokeWidth={1.5} />
          </div>
          <div className="inspector-empty-title">ASSET DETAILS</div>
          <p className="inspector-empty-desc">
            Click any semiconductor machine or cleanroom node on the blueprint floor plan to inspect telemetry, cleanroom class, process jobs, and utilities.
          </p>
        </div>
      </aside>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return (
          <span className="status-pill status-healthy">
            <span className="status-dot green" />
            <span>Operational</span>
          </span>
        );
      case 'warning':
        return (
          <span className="status-pill status-warning">
            <span className="status-dot amber" />
            <span>Warning</span>
          </span>
        );
      case 'critical':
        return (
          <span className="status-pill status-critical">
            <span className="status-dot red" />
            <span>Critical Alarm</span>
          </span>
        );
      default:
        return (
          <span className="status-pill status-offline">
            <span className="status-dot gray" />
            <span>Offline</span>
          </span>
        );
    }
  };

  return (
    <aside className="asset-details-inspector" aria-label="Asset Details Inspector">
      {/* Header Panel Title Bar */}
      <div className="inspector-top-bar">
        <span className="inspector-heading">ASSET DETAILS</span>
        {onClose && (
          <button onClick={onClose} className="inspector-close-btn" title="Close Details">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="inspector-scroll-area">
        {/* Machine Header Card */}
        <div className="inspector-machine-card">
          <div className="inspector-machine-icon-wrapper">
            <FloorIcon type={selectedAsset.type} size={42} />
          </div>

          <div className="inspector-machine-title-group">
            <div className="inspector-machine-name">{selectedAsset.name}</div>
            <div className="inspector-machine-id">{selectedAsset.id}</div>
            <div style={{ marginTop: '4px', display: 'flex', gap: '6px', alignItems: 'center' }}>
              {getStatusBadge(selectedAsset.status)}
              {selectedAsset.cleanroomClass && (
                <span className="cleanroom-class-tag">{selectedAsset.cleanroomClass.split(' (')[0]}</span>
              )}
            </div>
          </div>
        </div>

        {/* ACTIVE LOT / WAFER PRODUCTION JOB */}
        {selectedAsset.activeJob && (
          <div className="inspector-section">
            <div className="inspector-section-header">
              <Boxes size={11} />
              <span>ACTIVE WAFER / LEADFRAME JOB</span>
            </div>

            <div className="inspector-job-card">
              <div className="job-card-top-row">
                <span className="job-lot-id">{selectedAsset.activeJob.lotId}</span>
                <span className="job-progress-badge">{selectedAsset.activeJob.progressPercentage}% COMPLETE</span>
              </div>
              <div className="job-product-name">{selectedAsset.activeJob.productType}</div>
              
              {/* Progress Bar */}
              <div className="job-progress-bar-bg">
                <div
                  className="job-progress-bar-fill"
                  style={{ width: `${selectedAsset.activeJob.progressPercentage}%` }}
                />
              </div>

              <div className="job-meta-row">
                <span>Units: <b>{selectedAsset.activeJob.completedUnits}</b> / {selectedAsset.activeJob.batchSize}</span>
                <span>Est: <b>{selectedAsset.activeJob.estimatedCompletion}</b></span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 1: SPECIFICATIONS & CLEANROOM ENVIRONMENT */}
        <div className="inspector-section">
          <div className="inspector-section-header">
            <Layers size={11} />
            <span>EQUIPMENT SPECIFICATIONS</span>
          </div>

          <div className="inspector-info-list">
            <div className="inspector-info-row">
              <span className="inspector-info-label">Bay Zone</span>
              <span className="inspector-info-value">{selectedAsset.area}</span>
            </div>

            <div className="inspector-info-row">
              <span className="inspector-info-label">Footprint</span>
              <span className="inspector-info-value">{selectedAsset.footprint}</span>
            </div>

            <div className="inspector-info-row">
              <span className="inspector-info-label">Power Rating</span>
              <span className="inspector-info-value">{selectedAsset.power}</span>
            </div>

            <div className="inspector-info-row">
              <span className="inspector-info-label">Utility Hookups</span>
              <span className="inspector-info-value" style={{ fontSize: '9.5px' }}>{selectedAsset.utility}</span>
            </div>

            <div className="inspector-info-row">
              <span className="inspector-info-label">Overall OEE</span>
              <span className="inspector-info-value" style={{ fontWeight: 800, color: selectedAsset.oee >= 90 ? '#16A34A' : '#D97706' }}>
                {selectedAsset.oee.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: LIVE TELEMETRY STREAM (OPC-UA / MQTT) */}
        <div className="inspector-section">
          <div className="inspector-section-header">
            <Gauge size={11} />
            <span>REAL-TIME SENSOR TELEMETRY (OPC-UA)</span>
          </div>

          <div className="inspector-telemetry-mini-grid">
            <div className="telemetry-box">
              <span className="telemetry-box-label">
                <Thermometer size={11} /> Temp
              </span>
              <span className="telemetry-box-val">{selectedAsset.telemetry.temperature.toFixed(1)}°C</span>
            </div>

            <div className="telemetry-box">
              <span className="telemetry-box-label">
                <Activity size={11} /> Vibration
              </span>
              <span className="telemetry-box-val">{selectedAsset.telemetry.vibration.toFixed(2)} mm/s</span>
            </div>

            <div className="telemetry-box">
              <span className="telemetry-box-label">
                <Zap size={11} /> Health Score
              </span>
              <span className="telemetry-box-val" style={{ color: selectedAsset.telemetry.healthScore > 90 ? '#16A34A' : '#D97706' }}>
                {selectedAsset.telemetry.healthScore}/100
              </span>
            </div>

            <div className="telemetry-box">
              <span className="telemetry-box-label">
                <Clock size={11} /> Remaining Life
              </span>
              <span className="telemetry-box-val">{selectedAsset.telemetry.rulHours} hrs</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: SENSOR REGISTRY & NFC TAG BINDING */}
        <div className="inspector-section">
          <div className="inspector-section-header">
            <Radio size={11} />
            <span>HARDWARE NFC SENSOR KIT</span>
          </div>

          {selectedAsset.sensorKit ? (
            <div className="inspector-sensor-kit-box">
              <div className="sensor-kit-top-row">
                <span className="sensor-kit-name">{selectedAsset.sensorKit.kitModel}</span>
                <span className="sensor-kit-signal-pill">
                  <Radio size={10} />
                  <span>{selectedAsset.sensorKit.signalStrength}% Locked</span>
                </span>
              </div>

              <div className="sensor-kit-meta-row">
                <span className="sensor-kit-sn">TAG: <code>{selectedAsset.sensorKit.nfcTagSerial}</code></span>
                <span className="sensor-kit-proto">{selectedAsset.sensorKit.telemetryProtocol}</span>
              </div>

              {/* Registered Channels */}
              <div className="inspector-sensor-chips-list">
                {selectedAsset.sensorKit.sensors.map((s) => (
                  <div key={s.id} className="inspector-sensor-chip">
                    <span className="sensor-chip-dot green" />
                    <span className="sensor-chip-name">{s.name.split(' ')[0]}</span>
                    <span className="sensor-chip-val">{s.currentValue} {s.unit}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onOpenSensorProvisioning?.(selectedAsset)}
                className="sensor-kit-rebind-btn"
                title="Scan another NFC kit or calibrate sensors"
              >
                <Radio size={12} />
                <span>+ SCAN / REBIND SENSORS</span>
              </button>
            </div>
          ) : (
            <div className="inspector-unbound-sensor-box">
              <div className="unbound-icon-wrap">
                <Radio size={20} className="unbound-icon" />
              </div>
              <div className="unbound-title">EMPTY MACHINE INSTANCE</div>
              <div className="unbound-desc">
                No sensor kit registered yet. Scan the physical kit's NFC tag to pull sensor calibration and bind telemetry.
              </div>
              <button
                onClick={() => onOpenSensorProvisioning?.(selectedAsset)}
                className="sensor-scan-nfc-cta-btn"
              >
                <Radio size={14} />
                <span>+ ADD SENSOR KIT (SCAN NFC)</span>
              </button>
            </div>
          )}
        </div>

        {/* SECTION 4: SMEMA & AMHS CONNECTIONS */}
        <div className="inspector-section">
          <div className="inspector-section-header">LOGISTICS & SMEMA CONNECTIONS</div>

          <div className="inspector-info-list">
            <div className="inspector-info-row">
              <span className="inspector-info-label">Upstream Source</span>
              <span className="inspector-info-value">{selectedAsset.connections.input || 'Direct Staging'}</span>
            </div>

            <div className="inspector-info-row">
              <span className="inspector-info-label">Downstream Queue</span>
              <span className="inspector-info-value">{selectedAsset.connections.output || 'Downstream Queue'}</span>
            </div>

            <div className="inspector-info-row">
              <span className="inspector-info-label">Conveyor Standard</span>
              <span className="inspector-info-value">{selectedAsset.connections.conveyor || 'SMEMA 9851'}</span>
            </div>

            <div className="inspector-info-row">
              <span className="inspector-info-label">AMHS OHT Access</span>
              <span className="inspector-info-value" style={{ color: '#0284C7' }}>
                {selectedAsset.connections.ohtAccess !== false ? 'Enabled (Ceiling Spur)' : 'Manual Only'}
              </span>
            </div>

            <div className="inspector-info-row">
              <span className="inspector-info-label">AGV / AMR Access</span>
              <span className="inspector-info-value">{selectedAsset.connections.agvAccess ? 'Dock Available' : 'No'}</span>
            </div>
          </div>
        </div>

        {/* SECTION 5: ACTIONS */}
        <div className="inspector-section">
          <div className="inspector-section-header">ACTIONS</div>

          <div className="inspector-actions-group">
            <button
              onClick={() => onNavigateToMachine?.(selectedAsset.id)}
              className="inspector-action-btn primary"
              title="Navigate to comprehensive machine diagnostics"
            >
              <ExternalLink size={14} />
              <span>View Machine Diagnostics</span>
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inspector-action-btn secondary"
              title="Edit asset metadata or notes"
            >
              <Edit3 size={14} />
              <span>{isEditing ? 'Close Editing' : 'Edit Notes & Maintenance'}</span>
            </button>

            {isEditing && (
              <div className="inspector-edit-panel">
                <label className="inspector-edit-label">Custom Maintenance Notes / Calibration Tag:</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Enter maintenance notes or process calibration tag..."
                  className="inspector-edit-textarea"
                />
                <button
                  onClick={() => {
                    if (onUpdateAsset) {
                      onUpdateAsset({
                        ...selectedAsset,
                        customNotes: editNotes,
                      });
                    }
                    setIsEditing(false);
                  }}
                  className="tech-btn primary"
                  style={{ width: '100%', marginTop: '6px', fontSize: '11px' }}
                >
                  SAVE PROPERTIES
                </button>
              </div>
            )}

            <button
              onClick={() => onRemoveAsset?.(selectedAsset.id)}
              className="inspector-action-btn danger"
              title="Remove or unlink this asset from the cleanroom"
            >
              <Trash2 size={14} />
              <span>Remove Asset</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AssetDetailsInspector;
