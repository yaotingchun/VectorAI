import React, { useState } from 'react';
import { SecurityConfigData, UserRole, ApiToken, AuditLogEntry } from '../../../types/configuration';
import {
  ShieldCheck,
  Key,
  Lock,
  Copy,
  Check,
  Plus,
  Trash2,
  Search,
  Filter,
  Download,
  AlertCircle,
  Clock,
  User,
} from 'lucide-react';

interface SecurityAuditConfigProps {
  security: SecurityConfigData;
  onChange: (updated: SecurityConfigData) => void;
}

export const SecurityAuditConfig: React.FC<SecurityAuditConfigProps> = ({
  security,
  onChange,
}) => {
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [showNewTokenModal, setShowNewTokenModal] = useState(false);
  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenRole, setNewTokenRole] = useState<UserRole>('LEAD_PROCESS_ENGINEER');

  const updateSecurity = (fields: Partial<SecurityConfigData>) => {
    onChange({ ...security, ...fields });
  };

  const handleCopyToken = (token: ApiToken) => {
    navigator.clipboard.writeText(token.tokenKey);
    setCopiedTokenId(token.id);
    setTimeout(() => setCopiedTokenId(null), 1500);
  };

  const handleGenerateToken = () => {
    if (!newTokenName.trim()) return;
    const randomHex = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const token: ApiToken = {
      id: `tok-${Date.now().toString().slice(-6)}`,
      name: newTokenName.trim(),
      tokenKey: `vai_sec_${randomHex}`,
      role: newTokenRole,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString(),
      scopes:
        newTokenRole === 'PLANT_ADMIN'
          ? ['telemetry:write', 'reroute:execute', 'config:write', 'maintenance:admin']
          : ['telemetry:read', 'reroute:execute', 'maintenance:read'],
    };

    const newLog: AuditLogEntry = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      user: 'admin@vector.ai',
      role: security.currentUserRole,
      category: 'SECURITY',
      action: `Generated API Token: ${newTokenName.trim()}`,
      details: `Created token with scopes [${token.scopes.join(', ')}]`,
      status: 'SUCCESS',
    };

    updateSecurity({
      tokens: [token, ...security.tokens],
      auditLogs: [newLog, ...security.auditLogs],
    });

    setShowNewTokenModal(false);
    setNewTokenName('');
  };

  const handleRevokeToken = (tokenId: string) => {
    const token = security.tokens.find((t) => t.id === tokenId);
    const updatedTokens = security.tokens.filter((t) => t.id !== tokenId);

    const newLog: AuditLogEntry = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      user: 'admin@vector.ai',
      role: security.currentUserRole,
      category: 'SECURITY',
      action: `Revoked API Token: ${token?.name || tokenId}`,
      details: `Revoked security bearer token key ${tokenId}`,
      status: 'WARN',
    };

    updateSecurity({
      tokens: updatedTokens,
      auditLogs: [newLog, ...security.auditLogs],
    });
  };

  const handleExportAuditCsv = () => {
    const header = 'Timestamp,User,Role,Category,Action,Details,Status\n';
    const rows = security.auditLogs
      .map(
        (l) =>
          `"${l.timestamp}","${l.user}","${l.role}","${l.category}","${l.action.replace(/"/g, '""')}","${l.details.replace(/"/g, '""')}","${l.status}"`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `vectorai-audit-log-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Filtered audit logs
  const filteredAuditLogs = security.auditLogs.filter((log) => {
    const matchCategory = categoryFilter === 'ALL' || log.category === categoryFilter;
    const matchSearch =
      searchKeyword === '' ||
      log.action.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      log.details.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      log.user.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="config-content-grid" role="region" aria-label="Security and Audit Configuration">
      {/* 1. Active Role & Access Control */}
      <div className="config-card">
        <div className="config-card-header">
          <div className="config-card-title">
            <ShieldCheck size={16} style={{ color: 'var(--accent-green)' }} />
            <span>Role-Based Access Control (RBAC) &amp; Security Posture</span>
          </div>
          <span className="status-pill" style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--text-inverted)' }}>
            MFA ENFORCED
          </span>
        </div>

        <div className="config-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div className="config-form-group">
              <label className="config-label">Active Operator Role</label>
              <select
                value={security.currentUserRole}
                onChange={(e) => updateSecurity({ currentUserRole: e.target.value as UserRole })}
                className="config-select"
              >
                <option value="PLANT_ADMIN">Plant Administrator (Full Read/Write)</option>
                <option value="LEAD_PROCESS_ENGINEER">Lead Process Engineer (Reroute &amp; Calib)</option>
                <option value="MAINTENANCE_TECH">Maintenance Specialist (Service SOP)</option>
                <option value="AUDITOR">Auditor (Read-Only Telemetry &amp; Logs)</option>
              </select>
            </div>

            <div className="config-form-group">
              <label className="config-label">Session Idle Timeout (Minutes)</label>
              <input
                type="number"
                value={security.sessionTimeoutMin}
                onChange={(e) => updateSecurity({ sessionTimeoutMin: parseInt(e.target.value) || 60 })}
                className="config-input"
              />
            </div>

            <div className="toggle-switch-row" style={{ marginTop: 'auto' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '11px' }}>Enforce Cleanroom MFA</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Hardware security key or TOTP token</div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={security.enforceMfa}
                  onChange={(e) => updateSecurity({ enforceMfa: e.target.checked })}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 2. API Security Tokens Matrix */}
      <div className="config-card">
        <div className="config-card-header">
          <div className="config-card-title">
            <Key size={14} style={{ color: 'var(--accent-amber)' }} />
            <span>Cleanroom Gateway Bearer API Tokens</span>
          </div>
          <button
            type="button"
            onClick={() => setShowNewTokenModal(true)}
            className="tech-btn"
            style={{ fontSize: '11px', padding: '4px 8px' }}
          >
            <Plus size={12} /> GENERATE NEW TOKEN
          </button>
        </div>

        <div className="config-card-body">
          <div className="config-table-container">
            <table className="config-table">
              <thead>
                <tr>
                  <th>Token Name</th>
                  <th>API Bearer Key</th>
                  <th>Assigned Role</th>
                  <th>Scopes</th>
                  <th>Created</th>
                  <th>Expires</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>Copy</th>
                  <th style={{ width: '40px', textAlign: 'center' }}>Revoke</th>
                </tr>
              </thead>
              <tbody>
                {security.tokens.map((token) => (
                  <tr key={token.id}>
                    <td style={{ fontWeight: 700 }}>{token.name}</td>
                    <td>
                      <code style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-blue)' }}>
                        {token.tokenKey.slice(0, 16)}••••••••••••
                      </code>
                    </td>
                    <td>
                      <span className="status-pill" style={{ fontSize: '9px' }}>{token.role}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                        {token.scopes.map((sc) => (
                          <span key={sc} style={{ fontSize: '9px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-light)', padding: '1px 4px' }}>
                            {sc}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      {new Date(token.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      {new Date(token.expiresAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleCopyToken(token)}
                        className="tech-btn"
                        style={{ fontSize: '10px', padding: '3px 8px' }}
                        title="Copy Bearer Token to clipboard"
                      >
                        {copiedTokenId === token.id ? <Check size={11} style={{ color: 'var(--accent-green)' }} /> : <Copy size={11} />}
                        <span>{copiedTokenId === token.id ? 'COPIED' : 'COPY'}</span>
                      </button>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleRevokeToken(token.id)}
                        className="canvas-ctrl-btn"
                        style={{ color: 'var(--accent-red)' }}
                        title="Revoke and invalidate token"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. Live Configuration Audit Trail */}
      <div className="config-card">
        <div className="config-card-header">
          <div className="config-card-title">
            <Clock size={14} style={{ color: 'var(--accent-blue)' }} />
            <span>Configuration Modification Audit Trail &amp; Version History</span>
          </div>
          <button
            type="button"
            onClick={handleExportAuditCsv}
            className="tech-btn"
            style={{ fontSize: '11px', padding: '4px 8px' }}
            title="Download audit logs in CSV format"
          >
            <Download size={12} /> EXPORT CSV
          </button>
        </div>

        <div className="config-card-body">
          {/* Filter and Search Bar */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <input
                type="text"
                placeholder="Search audit trail by keyword, action, or user..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="config-input"
                style={{ paddingLeft: '32px' }}
              />
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={13} style={{ color: 'var(--text-muted)' }} />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="config-select"
                style={{ width: '160px', padding: '6px 10px' }}
              >
                <option value="ALL">All Categories</option>
                <option value="CALIBRATION">RUL Calibration</option>
                <option value="PROTOCOLS">Edge Protocols</option>
                <option value="GENAI">GenAI &amp; RAG</option>
                <option value="REROUTING">Rerouting Policy</option>
                <option value="SECURITY">Security &amp; Tokens</option>
              </select>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="config-table-container">
            <table className="config-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User / Role</th>
                  <th>Category</th>
                  <th>Action</th>
                  <th>Configuration Details</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAuditLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '11px', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '11px' }}>{log.user}</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{log.role}</div>
                    </td>
                    <td>
                      <span className="status-pill" style={{ fontSize: '9px' }}>{log.category}</span>
                    </td>
                    <td style={{ fontWeight: 600, fontSize: '12px' }}>{log.action}</td>
                    <td style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{log.details}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        className="status-pill"
                        style={{
                          backgroundColor: log.status === 'SUCCESS' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                          color: log.status === 'SUCCESS' ? 'var(--accent-green)' : 'var(--accent-red)',
                          fontSize: '9px',
                        }}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Generate Token Modal */}
      {showNewTokenModal && (
        <div className="config-modal-overlay" role="dialog" aria-modal="true">
          <div className="config-modal-card">
            <div className="config-modal-header">
              <div className="config-modal-title">
                <Key size={16} style={{ color: 'var(--accent-amber)' }} />
                <span>GENERATE CLEANROOM API SECURITY TOKEN</span>
              </div>
            </div>
            <div className="config-modal-body">
              <div className="config-form-group">
                <label className="config-label">Token Identifier / Integration Name</label>
                <input
                  type="text"
                  placeholder="e.g. Automated MES Lot Redirection Gateway"
                  value={newTokenName}
                  onChange={(e) => setNewTokenName(e.target.value)}
                  className="config-input"
                />
              </div>

              <div className="config-form-group">
                <label className="config-label">Assigned Role &amp; Permission Scopes</label>
                <select
                  value={newTokenRole}
                  onChange={(e) => setNewTokenRole(e.target.value as UserRole)}
                  className="config-select"
                >
                  <option value="PLANT_ADMIN">Plant Administrator (Full Write Access)</option>
                  <option value="LEAD_PROCESS_ENGINEER">Lead Process Engineer (Reroute &amp; Telemetry)</option>
                  <option value="MAINTENANCE_TECH">Maintenance Technician (Work Order SOP)</option>
                  <option value="AUDITOR">Auditor (Telemetry Read-Only)</option>
                </select>
              </div>
            </div>
            <div className="config-modal-footer">
              <button
                type="button"
                onClick={() => setShowNewTokenModal(false)}
                className="tech-btn"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleGenerateToken}
                disabled={!newTokenName.trim()}
                className="tech-btn primary"
              >
                GENERATE TOKEN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
