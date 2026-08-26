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
} from 'lucide-react';

interface AssetDetailsInspectorProps {
  selectedAsset: FloorMachineAsset | null;
  onClose?: () => void;
  onNavigateToMachine?: (machineId: string) => void;
  onRemoveAsset?: (assetId: string) => void;
  onUpdateAsset?: (asset: FloorMachineAsset) => void;
}

export const AssetDetailsInspector: React.FC<AssetDetailsInspectorProps> = ({
  selectedAsset,
  onClose,
  onNavigateToMachine,
  onRemoveAsset,
  onUpdateAsset,
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
            Click any equipment or node on the blueprint floor plan to inspect telemetry, connections, and operating properties.
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
            <span>Healthy</span>
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
            <span>Critical</span>
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
            <div style={{ marginTop: '4px' }}>
              {getStatusBadge(selectedAsset.status)}
            </div>
          </div>
        </div>

        {/* SECTION 1: INFORMATION */}
        <div className="inspector-section">
          <div className="inspector-section-header">INFORMATION</div>

          <div className="inspector-info-list">
            <div className="inspector-info-row">
              <span className="inspector-info-label">Type</span>
              <span className="inspector-info-value">{selectedAsset.code === 'WB' ? 'Wire Bonding' : selectedAsset.name.split(' 0')[0]}</span>
            </div>

            <div className="inspector-info-row">
              <span className="inspector-info-label">ID</span>
              <span className="inspector-info-value">{selectedAsset.id}</span>
            </div>

            <div className="inspector-info-row">
              <span className="inspector-info-label">Area</span>
              <span className="inspector-info-value">{selectedAsset.area}</span>
            </div>

            <div className="inspector-info-row">
              <span className="inspector-info-label">Footprint</span>
              <span className="inspector-info-value">{selectedAsset.footprint}</span>
            </div>

            <div className="inspector-info-row">
              <span className="inspector-info-label">Power</span>
              <span className="inspector-info-value">{selectedAsset.power}</span>
            </div>

            <div className="inspector-info-row">
              <span className="inspector-info-label">Utility</span>
              <span className="inspector-info-value">{selectedAsset.utility}</span>
            </div>

            <div className="inspector-info-row">
              <span className="inspector-info-label">Status</span>
              <span className="inspector-info-value">
                <span style={{
                  color: selectedAsset.status === 'healthy' ? '#16A34A' : selectedAsset.status === 'warning' ? '#D97706' : '#DC2626',
                  fontWeight: 700,
                  textTransform: 'capitalize'
                }}>
                  {selectedAsset.status}
                </span>
              </span>
            </div>

            <div className="inspector-info-row">
              <span className="inspector-info-label">OEE</span>
              <span className="inspector-info-value" style={{ fontWeight: 800 }}>
                {selectedAsset.oee.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Telemetry Grid */}
        <div className="inspector-section">
          <div className="inspector-section-header">LIVE SENSORS (OPC-UA)</div>

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
                <Zap size={11} /> Health
              </span>
              <span className="telemetry-box-val" style={{ color: selectedAsset.telemetry.healthScore > 90 ? '#16A34A' : '#D97706' }}>
                {selectedAsset.telemetry.healthScore}/100
              </span>
            </div>

            <div className="telemetry-box">
              <span className="telemetry-box-label">
                <Clock size={11} /> RUL
              </span>
              <span className="telemetry-box-val">{selectedAsset.telemetry.rulHours} hrs</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: CONNECTIONS */}
        <div className="inspector-section">
          <div className="inspector-section-header">CONNECTIONS</div>

          <div className="inspector-info-list">
            <div className="inspector-info-row">
              <span className="inspector-info-label">Input</span>
              <span className="inspector-info-value">{selectedAsset.connections.input || 'Direct Staging'}</span>
            </div>

            <div className="inspector-info-row">
              <span className="inspector-info-label">Output</span>
              <span className="inspector-info-value">{selectedAsset.connections.output || 'Downstream Queue'}</span>
            </div>

            <div className="inspector-info-row">
              <span className="inspector-info-label">Conveyor</span>
              <span className="inspector-info-value">{selectedAsset.connections.conveyor || 'CV-01'}</span>
            </div>

            <div className="inspector-info-row">
              <span className="inspector-info-label">AGV Access</span>
              <span className="inspector-info-value">{selectedAsset.connections.agvAccess ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: ACTIONS */}
        <div className="inspector-section">
          <div className="inspector-section-header">ACTIONS</div>

          <div className="inspector-actions-group">
            <button
              onClick={() => onNavigateToMachine?.(selectedAsset.id)}
              className="inspector-action-btn primary"
              title="Navigate to comprehensive machine diagnostics"
            >
              <ExternalLink size={14} />
              <span>View Machine Dashboard</span>
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inspector-action-btn secondary"
              title="Edit asset metadata or notes"
            >
              <Edit3 size={14} />
              <span>{isEditing ? 'Close Editing' : 'Edit Properties'}</span>
            </button>

            {isEditing && (
              <div className="inspector-edit-panel">
                <label className="inspector-edit-label">Custom Notes / Maintenance Tag:</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Enter maintenance schedule or asset allocation note..."
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
              title="Remove or unlink this asset from the layout"
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
