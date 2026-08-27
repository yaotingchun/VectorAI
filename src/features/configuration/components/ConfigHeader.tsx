import React, { useState, useRef } from 'react';
import { SystemConfiguration } from '../../../types/configuration';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertTriangle,
  Server,
  Cpu,
  BrainCircuit,
  Route,
  Bell,
  ShieldCheck,
  Building2,
  X,
  FileCode,
} from 'lucide-react';

export type ConfigSubTab =
  | 'protocols'
  | 'calibration'
  | 'genAi'
  | 'reroutePolicy'
  | 'dispatch'
  | 'security';

interface ConfigHeaderProps {
  config: SystemConfiguration;
  activeSubTab: ConfigSubTab;
  onSelectSubTab: (tab: ConfigSubTab) => void;
  onSave: () => void;
  onResetDefaults: () => void;
  onImportConfig: (imported: SystemConfiguration) => void;
  isDirty?: boolean;
}

export const ConfigHeader: React.FC<ConfigHeaderProps> = ({
  config,
  activeSubTab,
  onSelectSubTab,
  onSave,
  onResetDefaults,
  onImportConfig,
  isDirty = false,
}) => {
  const [showResetModal, setShowResetModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const subTabs = [
    { id: 'protocols' as ConfigSubTab, label: 'Edge Protocols', code: 'PROTOCOLS // EDGE-GW', num: '01', icon: <Server size={14} /> },
    { id: 'calibration' as ConfigSubTab, label: 'RUL & AI Calibration', code: 'CALIB // RUL-AI', num: '02', icon: <Cpu size={14} /> },
    { id: 'genAi' as ConfigSubTab, label: 'Gemini LLM & RAG', code: 'AI // GEMINI-RAG', num: '03', icon: <BrainCircuit size={14} /> },
    { id: 'reroutePolicy' as ConfigSubTab, label: 'Rerouting Policy', code: 'FLOW // REROUTE-POLICY', num: '04', icon: <Route size={14} /> },
    { id: 'dispatch' as ConfigSubTab, label: 'Dispatch Channels', code: 'DISPATCH // NOTIFY', num: '05', icon: <Bell size={14} /> },
    { id: 'security' as ConfigSubTab, label: 'Security & Audit', code: 'SECURITY // AUDIT', num: '06', icon: <ShieldCheck size={14} /> },
  ];

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `vectorai-config-${config.plantIdentity.facilityId.toLowerCase()}-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setImportJsonText(text);
        setImportError(null);
      } catch (err) {
        setImportError('Failed to read file content.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (!parsed.protocols || !parsed.calibration) {
        throw new Error('Invalid VectorAI configuration format.');
      }
      onImportConfig(parsed);
      setShowImportModal(false);
      setImportJsonText('');
      setImportError(null);
    } catch (err: any) {
      setImportError(err.message || 'Malformed JSON payload.');
    }
  };

  return (
    <div className="config-header-card" role="region" aria-label="System Configuration Header">
      <div className="config-header-top">
        {/* Plant ID & Title */}
        <div className="config-header-left">
          <div className="config-meta-strip">
            <span className="config-plant-code">{config.plantIdentity.facilityId}</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Building2 size={12} /> {config.plantIdentity.facilityName} ({config.plantIdentity.cleanroomClass})
            </span>
            <span>•</span>
            <span>SYS VERSION: {config.version}</span>
          </div>

          <div className="config-title-row">
            <Settings size={22} style={{ color: 'var(--accent-amber)' }} />
            <h1 className="config-title">System Configuration &amp; Industrial Gateway Studio</h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="config-header-actions">
          <button
            type="button"
            onClick={handleExportJson}
            className="tech-btn"
            title="Export full system configuration to JSON file"
          >
            <Download size={13} />
            <span>EXPORT JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="tech-btn"
            title="Import configuration from JSON backup"
          >
            <Upload size={13} />
            <span>IMPORT JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="tech-btn"
            style={{ color: 'var(--accent-red)' }}
            title="Reset all settings to factory default baseline"
          >
            <RotateCcw size={13} />
            <span>RESET DEFAULTS</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            className="tech-btn primary"
            style={{
              backgroundColor: isDirty ? 'var(--accent-amber)' : 'var(--bg-dark)',
              borderColor: 'var(--border-strong)',
              fontWeight: 700,
            }}
            title="Deploy and commit system configuration"
          >
            <Save size={14} />
            <span>{isDirty ? 'SAVE & DEPLOY CHANGES *' : 'SAVE & DEPLOY'}</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <nav className="config-tab-bar" aria-label="Configuration Module Navigation">
        {subTabs.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectSubTab(tab.id)}
              className={`config-tab-btn ${isActive ? 'active' : ''}`}
            >
              <span className="config-tab-num">{tab.num}</span>
              {tab.icon}
              <span>{tab.label}</span>
              <span className="config-tab-badge">{tab.code}</span>
            </button>
          );
        })}
      </nav>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="config-modal-overlay" role="dialog" aria-modal="true">
          <div className="config-modal-card">
            <div className="config-modal-header">
              <div className="config-modal-title">
                <AlertTriangle size={16} style={{ color: 'var(--accent-red)' }} />
                <span>CONFIRM RESET TO INDUSTRIAL DEFAULTS</span>
              </div>
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="canvas-ctrl-btn"
              >
                <X size={16} />
              </button>
            </div>
            <div className="config-modal-body">
              <p style={{ fontSize: '13px', lineHeight: '1.5' }}>
                Are you sure you want to restore all system configuration parameters to standard semiconductor factory defaults?
              </p>
              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '12px', border: '1px solid var(--border-light)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                • Reset RUL Degradation Weights ($\theta$) to Nominal (2000 / 14.5 / 420.0 / 0.95)<br />
                • Reset MQTT Broker &amp; OPC-UA Endpoint URLs<br />
                • Reset Autonomous Rerouting parameters &amp; Dispatch Channels
              </div>
            </div>
            <div className="config-modal-footer">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="tech-btn"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetDefaults();
                  setShowResetModal(false);
                }}
                className="tech-btn primary"
                style={{ backgroundColor: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}
              >
                CONFIRM RESET
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Configuration Modal */}
      {showImportModal && (
        <div className="config-modal-overlay" role="dialog" aria-modal="true">
          <div className="config-modal-card" style={{ maxWidth: '650px' }}>
            <div className="config-modal-header">
              <div className="config-modal-title">
                <FileCode size={16} style={{ color: 'var(--accent-blue)' }} />
                <span>IMPORT SYSTEM CONFIGURATION JSON</span>
              </div>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="canvas-ctrl-btn"
              >
                <X size={16} />
              </button>
            </div>
            <div className="config-modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="config-label">Upload JSON File or Paste Raw Content</span>
                <input
                  type="file"
                  accept=".json"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="tech-btn"
                  style={{ padding: '4px 8px', fontSize: '11px' }}
                >
                  <Upload size={11} /> Browse File
                </button>
              </div>

              <textarea
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder="Paste JSON configuration payload here..."
                className="config-textarea"
                style={{ height: '180px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}
              />

              {importError && (
                <div style={{ color: 'var(--accent-red)', fontSize: '11px', fontWeight: 700 }}>
                  ⚠️ {importError}
                </div>
              )}
            </div>
            <div className="config-modal-footer">
              <button
                type="button"
                onClick={() => {
                  setShowImportModal(false);
                  setImportError(null);
                }}
                className="tech-btn"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={!importJsonText.trim()}
                className="tech-btn primary"
              >
                <CheckCircle2 size={13} />
                <span>APPLY &amp; RESTORE</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
