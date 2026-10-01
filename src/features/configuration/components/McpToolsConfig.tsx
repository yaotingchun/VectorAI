import React from 'react';
import { McpToolsConfigData, McpToolPolicy } from '../../../types/configuration';
import { Server, Play, Settings2 } from 'lucide-react';

interface McpToolsConfigProps {
  mcpTools: McpToolsConfigData;
  onChange: (mcpTools: McpToolsConfigData) => void;
}

export const McpToolsConfig: React.FC<McpToolsConfigProps> = ({ mcpTools, onChange }) => {
  const updatePolicy = (id: string, updates: Partial<McpToolPolicy>) => {
    onChange({
      ...mcpTools,
      policies: mcpTools.policies.map(p => p.id === id ? { ...p, ...updates } : p),
    });
  };

  return (
    <div className="config-content-grid" role="region" aria-label="AI Automation (MCP) Configuration">
      {mcpTools.policies.map(policy => (
        <div key={policy.id} className="config-card">
          <div className="config-card-header">
            <div className="config-card-title">
              <Server size={14} style={{ color: 'var(--accent-blue)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>{policy.name}</span>
                <span style={{ fontSize: '10px', fontWeight: 400, color: 'var(--text-secondary)' }}>{policy.description}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="tech-btn" style={{ fontSize: '11px', padding: '4px 8px', color: 'var(--accent-blue)' }}>
                CONFIGURE MCP <Settings2 size={12} style={{ marginLeft: '4px' }} />
              </button>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={policy.enabled}
                  onChange={(e) => updatePolicy(policy.id, { enabled: e.target.checked })}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>

          <div className="config-card-body" style={{ padding: '12px 16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', marginBottom: '10px' }}>
              <div className="config-form-group">
                <label className="config-label">Transport Protocol</label>
                <select 
                  className="config-select"
                  value={policy.transportProtocol}
                  onChange={(e) => updatePolicy(policy.id, { transportProtocol: e.target.value as any })}
                >
                  <option value="Stdio">Stdio (Standard I/O Process)</option>
                  <option value="HTTP">HTTP (REST/Webhook)</option>
                  <option value="WebSocket">WebSocket</option>
                </select>
              </div>
              <div className="config-form-group">
                <label className="config-label">Stdio Command</label>
                <input 
                  type="text" 
                  className="config-input"
                  value={policy.command}
                  onChange={(e) => updatePolicy(policy.id, { command: e.target.value })}
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
              </div>
            </div>

            <div className="config-form-group" style={{ marginBottom: '10px' }}>
              <label className="config-label">Command Arguments</label>
              <input 
                type="text" 
                className="config-input"
                value={policy.arguments}
                onChange={(e) => updatePolicy(policy.id, { arguments: e.target.value })}
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div className="config-form-group">
                <label className="config-label">Arguments Template (JSON Payload)</label>
                <textarea 
                  className="config-input"
                  value={policy.argumentsTemplate}
                  onChange={(e) => updatePolicy(policy.id, { argumentsTemplate: e.target.value })}
                  style={{ fontFamily: 'var(--font-mono)', minHeight: '56px', resize: 'vertical' }}
                />
              </div>
              <div className="config-form-group">
                <label className="config-label">Environment Variables (KEY=VALUE)</label>
                <textarea 
                  className="config-input"
                  value={policy.environmentVariables}
                  onChange={(e) => updatePolicy(policy.id, { environmentVariables: e.target.value })}
                  style={{ fontFamily: 'var(--font-mono)', minHeight: '56px', resize: 'vertical' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '10px', marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="config-label">STATUS:</span>
                <span className="status-pill" style={{ backgroundColor: policy.status === 'Connected & Ready' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(220, 38, 38, 0.08)', color: policy.status === 'Connected & Ready' ? 'var(--accent-green)' : 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: policy.status === 'Connected & Ready' ? 'var(--accent-green)' : 'var(--accent-red)' }} />
                  {policy.status}
                </span>
              </div>
              <button className="tech-btn primary" style={{ backgroundColor: '#5B50D6', borderColor: '#5B50D6', fontSize: '11px', padding: '5px 10px' }}>
                <Play size={11} fill="currentColor" /> TEST MCP TOOL
              </button>
            </div>

            <div style={{ marginTop: '10px', backgroundColor: 'var(--bg-surface)', padding: '8px 10px', border: '1px solid var(--border-light)', borderRadius: '4px' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Connected Exposed Tools</h4>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {policy.connectedTools.map((tool, idx) => (
                  <span key={idx} style={{ backgroundColor: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', color: 'var(--accent-blue)', padding: '3px 7px', borderRadius: '4px', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                    {tool}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};
