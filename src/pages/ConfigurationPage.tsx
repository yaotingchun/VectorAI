import React, { useState, useEffect } from 'react';
import { useFactory } from '../context/FactoryContext';
import {
  SystemConfiguration,
  DEFAULT_SYSTEM_CONFIG,
  ConfigSubTab,
  ConfigHeader,
  EdgeProtocolsConfig,
  RulModelCalibration,
  GenAiRagConfig,
  ReroutePolicyConfig,
  DispatchChannelsConfig,
  SecurityAuditConfig,
} from '../features/configuration';
import { getGeminiApiKey, setGeminiApiKey } from '../features/machines/intelligence/llm/geminiDiagnosticService';
import { CheckCircle2 } from 'lucide-react';
import '../styles/configuration.css';

const CONFIG_STORAGE_KEY = 'vectorai_system_config';

export const ConfigurationPage: React.FC = () => {
  const { updateWeights, logSystemEvent } = useFactory();

  // Load configuration from localStorage or default
  const [config, setConfig] = useState<SystemConfiguration>(() => {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // ensure gemini key is synced
        const currentGeminiKey = getGeminiApiKey();
        if (currentGeminiKey && (!parsed.genAi || !parsed.genAi.apiKey)) {
          parsed.genAi = { ...parsed.genAi, apiKey: currentGeminiKey };
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load system configuration from localStorage', e);
    }
    const initial = { ...DEFAULT_SYSTEM_CONFIG };
    const currentGeminiKey = getGeminiApiKey();
    if (currentGeminiKey) {
      initial.genAi.apiKey = currentGeminiKey;
    }
    return initial;
  });

  const [activeSubTab, setActiveSubTab] = useState<ConfigSubTab>('protocols');
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync FactoryContext weights if config weights change on load
  useEffect(() => {
    if (config.calibration?.weights) {
      updateWeights(config.calibration.weights);
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleUpdateProtocols = (protocols: typeof config.protocols) => {
    setConfig((prev) => ({ ...prev, protocols }));
    setIsDirty(true);
  };

  const handleUpdateCalibration = (calibration: typeof config.calibration) => {
    setConfig((prev) => ({ ...prev, calibration }));
    updateWeights(calibration.weights); // Instant sync to FactoryContext simulation
    setIsDirty(true);
  };

  const handleUpdateGenAi = (genAi: typeof config.genAi) => {
    setConfig((prev) => ({ ...prev, genAi }));
    if (genAi.apiKey !== undefined) {
      setGeminiApiKey(genAi.apiKey);
    }
    setIsDirty(true);
  };

  const handleUpdateReroutePolicy = (reroutePolicy: typeof config.reroutePolicy) => {
    setConfig((prev) => ({ ...prev, reroutePolicy }));
    setIsDirty(true);
  };

  const handleUpdateDispatch = (dispatch: typeof config.dispatch) => {
    setConfig((prev) => ({ ...prev, dispatch }));
    setIsDirty(true);
  };

  const handleUpdateSecurity = (security: typeof config.security) => {
    setConfig((prev) => ({ ...prev, security }));
    setIsDirty(true);
  };

  const handleSaveConfiguration = () => {
    const updatedConfig: SystemConfiguration = {
      ...config,
      lastUpdated: new Date().toISOString(),
      security: {
        ...config.security,
        auditLogs: [
          {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            user: 'admin@vector.ai',
            role: config.security.currentUserRole,
            category: activeSubTab.toUpperCase() as any,
            action: `Committed and deployed changes to ${activeSubTab.toUpperCase()}`,
            details: `Saved system configuration to local memory and synchronized live runtime parameters.`,
            status: 'SUCCESS',
          },
          ...config.security.auditLogs,
        ],
      },
    };

    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updatedConfig));
      if (updatedConfig.genAi?.apiKey) {
        setGeminiApiKey(updatedConfig.genAi.apiKey);
      }
      setConfig(updatedConfig);
      setIsDirty(false);
      updateWeights(updatedConfig.calibration.weights);
      logSystemEvent('SYSTEM', `CONFIGURATION DEPLOYED: Applied updates to ${activeSubTab.toUpperCase()} studio.`);
      triggerToast('Configuration saved & successfully deployed to active edge telemetry runtime.');
    } catch (e) {
      console.error('Failed to save configuration', e);
      triggerToast('Error saving configuration to storage.');
    }
  };

  const handleResetDefaults = () => {
    const resetConfig: SystemConfiguration = {
      ...DEFAULT_SYSTEM_CONFIG,
      lastUpdated: new Date().toISOString(),
      security: {
        ...DEFAULT_SYSTEM_CONFIG.security,
        auditLogs: [
          {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            user: 'admin@vector.ai',
            role: 'PLANT_ADMIN',
            category: 'CALIBRATION',
            action: 'Reset System Configuration to Factory Defaults',
            details: 'All protocol endpoints, RUL weights, and rerouting rules restored to factory baseline.',
            status: 'WARN',
          },
          ...config.security.auditLogs,
        ],
      },
    };

    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(resetConfig));
    setConfig(resetConfig);
    updateWeights(resetConfig.calibration.weights);
    setIsDirty(false);
    logSystemEvent('SYSTEM', 'CONFIGURATION RESET: Reverted parameters to industrial factory baseline.');
    triggerToast('All system parameters reset to semiconductor nominal baseline.');
  };

  const handleImportConfig = (imported: SystemConfiguration) => {
    const validated: SystemConfiguration = {
      ...imported,
      lastUpdated: new Date().toISOString(),
      security: {
        ...imported.security,
        auditLogs: [
          {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            user: 'admin@vector.ai',
            role: imported.security?.currentUserRole || 'PLANT_ADMIN',
            category: 'SECURITY',
            action: 'Imported System Configuration from JSON Backup',
            details: `Restored configuration archive version ${imported.version || '2.8.4'}.`,
            status: 'SUCCESS',
          },
          ...(imported.security?.auditLogs || []),
        ],
      },
    };

    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(validated));
    setConfig(validated);
    updateWeights(validated.calibration.weights);
    setIsDirty(false);
    logSystemEvent('SYSTEM', 'CONFIGURATION IMPORTED: Successfully loaded configuration archive.');
    triggerToast('Configuration successfully restored from JSON backup.');
  };

  const handleSendTestNotification = (channelType: string, recipient: string) => {
    logSystemEvent('SYSTEM', `TEST DISPATCH: Dispatched test alert to ${recipient} via ${channelType}.`);
  };

  return (
    <div className="config-studio-root" role="region" aria-label="VectorAI Configuration Studio">
      {/* Top Header & Sub-Tab Bar */}
      <ConfigHeader
        config={config}
        activeSubTab={activeSubTab}
        onSelectSubTab={setActiveSubTab}
        onSave={handleSaveConfiguration}
        onResetDefaults={handleResetDefaults}
        onImportConfig={handleImportConfig}
        isDirty={isDirty}
      />

      {/* Active Sub-Tab View */}
      {activeSubTab === 'protocols' && (
        <EdgeProtocolsConfig
          protocols={config.protocols}
          onChange={handleUpdateProtocols}
        />
      )}

      {activeSubTab === 'calibration' && (
        <RulModelCalibration
          calibration={config.calibration}
          onChange={handleUpdateCalibration}
        />
      )}

      {activeSubTab === 'genAi' && (
        <GenAiRagConfig
          genAi={config.genAi}
          onChange={handleUpdateGenAi}
        />
      )}

      {activeSubTab === 'reroutePolicy' && (
        <ReroutePolicyConfig
          reroutePolicy={config.reroutePolicy}
          onChange={handleUpdateReroutePolicy}
        />
      )}

      {activeSubTab === 'dispatch' && (
        <DispatchChannelsConfig
          dispatch={config.dispatch}
          onChange={handleUpdateDispatch}
          onSendTestNotification={handleSendTestNotification}
        />
      )}

      {activeSubTab === 'security' && (
        <SecurityAuditConfig
          security={config.security}
          onChange={handleUpdateSecurity}
        />
      )}

      {/* Floating Save / Status Toast */}
      {toastMessage && (
        <div className="config-toast" role="alert">
          <CheckCircle2 size={16} style={{ color: 'var(--accent-green)' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default ConfigurationPage;
