import React, { useState } from 'react';
import { DispatchMatrixConfigData, TechnicianRoutingEntry } from '../../../types/configuration';
import {
  Bell,
  Mail,
  MessageSquare,
  Globe,
  Plus,
  Trash2,
  Send,
  CheckCircle2,
  RotateCw,
  Users,
  Clock,
  ShieldAlert,
} from 'lucide-react';

interface DispatchChannelsConfigProps {
  dispatch: DispatchMatrixConfigData;
  onChange: (updated: DispatchMatrixConfigData) => void;
  onSendTestNotification?: (channelType: string, recipient: string) => void;
}

export const DispatchChannelsConfig: React.FC<DispatchChannelsConfigProps> = ({
  dispatch,
  onChange,
  onSendTestNotification,
}) => {
  const [sendingTestFor, setSendingTestFor] = useState<string | null>(null);
  const [testSentSuccess, setTestSentSuccess] = useState<string | null>(null);

  const updateSmtp = (fields: Partial<typeof dispatch.smtp>) => {
    onChange({ ...dispatch, smtp: { ...dispatch.smtp, ...fields } });
  };

  const updateWhatsApp = (fields: Partial<typeof dispatch.whatsapp>) => {
    onChange({ ...dispatch, whatsapp: { ...dispatch.whatsapp, ...fields } });
  };

  const handleUpdateTechnician = (index: number, fields: Partial<TechnicianRoutingEntry>) => {
    const updated = dispatch.technicians.map((tech, i) =>
      i === index ? { ...tech, ...fields } : tech
    );
    onChange({ ...dispatch, technicians: updated });
  };

  const handleAddTechnician = () => {
    const newTech: TechnicianRoutingEntry = {
      id: `tech-0${dispatch.technicians.length + 1}`,
      name: `Specialist ${dispatch.technicians.length + 1}`,
      role: 'Cleanroom Maintenance Specialist',
      assignedCategory: 'dicing',
      primaryChannel: 'EMAIL',
      channelAddress: `specialist${dispatch.technicians.length + 1}@vectorai.internal`,
      autoEscalationMin: 15,
      shiftSchedule: 'Shift A (08:00 - 16:00)',
    };
    onChange({ ...dispatch, technicians: [...dispatch.technicians, newTech] });
  };

  const handleRemoveTechnician = (index: number) => {
    const updated = dispatch.technicians.filter((_, i) => i !== index);
    onChange({ ...dispatch, technicians: updated });
  };

  const handleTriggerTest = (tech: TechnicianRoutingEntry) => {
    setSendingTestFor(tech.id);
    setTestSentSuccess(null);
    setTimeout(() => {
      setSendingTestFor(null);
      setTestSentSuccess(`Test dispatch notification delivered to ${tech.name} via ${tech.primaryChannel} (${tech.channelAddress}).`);
      if (onSendTestNotification) {
        onSendTestNotification(tech.primaryChannel, tech.channelAddress);
      }
    }, 700);
  };

  return (
    <div className="config-content-grid" role="region" aria-label="Notification and Dispatch Configuration">
      {/* Test Notification Banner */}
      {testSentSuccess && (
        <div
          style={{
            backgroundColor: 'rgba(22, 163, 74, 0.08)',
            border: '1.5px solid var(--accent-green)',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
          }}
        >
          <CheckCircle2 size={16} style={{ color: 'var(--accent-green)' }} />
          <span>{testSentSuccess}</span>
        </div>
      )}

      {/* 1. Gateways: SMTP, WhatsApp, Webhooks */}
      <div className="config-grid-2col">
        {/* SMTP Gateway */}
        <div className="config-card">
          <div className="config-card-header">
            <div className="config-card-title">
              <Mail size={14} style={{ color: 'var(--accent-blue)' }} />
              <span>Email SMTP Cleanroom Dispatch Gateway</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={dispatch.smtp.enabled}
                onChange={(e) => updateSmtp({ enabled: e.target.checked })}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="config-card-body">
            <div className="config-form-group">
              <label className="config-label">SMTP Server Host</label>
              <input
                type="text"
                value={dispatch.smtp.host}
                onChange={(e) => updateSmtp({ host: e.target.value })}
                className="config-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="config-form-group">
                <label className="config-label">SMTP Port</label>
                <input
                  type="number"
                  value={dispatch.smtp.port}
                  onChange={(e) => updateSmtp({ port: parseInt(e.target.value) || 587 })}
                  className="config-input"
                />
              </div>

              <div className="config-form-group">
                <label className="config-label">Sender Name</label>
                <input
                  type="text"
                  value={dispatch.smtp.senderName}
                  onChange={(e) => updateSmtp({ senderName: e.target.value })}
                  className="config-input"
                />
              </div>
            </div>

            <div className="config-form-group">
              <label className="config-label">Sender Email Address</label>
              <input
                type="email"
                value={dispatch.smtp.senderAddress}
                onChange={(e) => updateSmtp({ senderAddress: e.target.value })}
                className="config-input"
              />
            </div>

            <div className="toggle-switch-row">
              <div>
                <div style={{ fontWeight: 700, fontSize: '11px' }}>TLS / SSL Encryption (STARTTLS)</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Secure transport protocol for dispatch alerts</div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={dispatch.smtp.useTls}
                  onChange={(e) => updateSmtp({ useTls: e.target.checked })}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </div>

        {/* WhatsApp & Webhooks Gateway */}
        <div className="config-card">
          <div className="config-card-header">
            <div className="config-card-title">
              <MessageSquare size={14} style={{ color: 'var(--accent-green)' }} />
              <span>WhatsApp Twilio &amp; MES Webhook Bridge</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={dispatch.whatsapp.enabled}
                onChange={(e) => updateWhatsApp({ enabled: e.target.checked })}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="config-card-body">
            <div className="config-form-group">
              <label className="config-label">WhatsApp Business Sender Number</label>
              <input
                type="text"
                value={dispatch.whatsapp.senderNumber}
                onChange={(e) => updateWhatsApp({ senderNumber: e.target.value })}
                className="config-input"
              />
            </div>

            <div className="config-form-group">
              <label className="config-label">Twilio / WhatsApp Account SID</label>
              <input
                type="text"
                value={dispatch.whatsapp.accountSid}
                onChange={(e) => updateWhatsApp({ accountSid: e.target.value })}
                className="config-input"
              />
            </div>

            <div className="config-form-group">
              <label className="config-label">MES Supervisor Webhook URL</label>
              <input
                type="text"
                value={dispatch.webhooks[0]?.url || ''}
                onChange={(e) => {
                  const updatedWh = [...dispatch.webhooks];
                  if (updatedWh[0]) {
                    updatedWh[0].url = e.target.value;
                    onChange({ ...dispatch, webhooks: updatedWh });
                  }
                }}
                className="config-input"
              />
            </div>

            <div className="config-form-group">
              <div className="config-label-row">
                <label className="config-label">Escalate to Plant Supervisor After (Minutes)</label>
                <span className="config-hint">{dispatch.escalateToPlantManagerAfterMin} min</span>
              </div>
              <input
                type="number"
                value={dispatch.escalateToPlantManagerAfterMin}
                onChange={(e) => onChange({ ...dispatch, escalateToPlantManagerAfterMin: parseInt(e.target.value) || 20 })}
                className="config-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Technician Dispatch Routing Matrix */}
      <div className="config-card">
        <div className="config-card-header">
          <div className="config-card-title">
            <Users size={14} style={{ color: 'var(--accent-amber)' }} />
            <span>Cleanroom Specialist &amp; Work Order Auto-Dispatch Matrix</span>
          </div>
          <button
            type="button"
            onClick={handleAddTechnician}
            className="tech-btn"
            style={{ fontSize: '11px', padding: '4px 8px' }}
          >
            <Plus size={12} /> ADD SPECIALIST
          </button>
        </div>

        <div className="config-card-body">
          <div className="config-table-container">
            <table className="config-table">
              <thead>
                <tr>
                  <th>Technician Name</th>
                  <th>Assigned Machine Stage</th>
                  <th>Shift Schedule</th>
                  <th>Dispatch Channel</th>
                  <th>Channel Address</th>
                  <th>Escalation</th>
                  <th style={{ width: '130px', textAlign: 'center' }}>Test Dispatch</th>
                  <th style={{ width: '40px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {dispatch.technicians.map((tech, idx) => (
                  <tr key={tech.id || idx}>
                    <td>
                      <input
                        type="text"
                        value={tech.name}
                        onChange={(e) => handleUpdateTechnician(idx, { name: e.target.value })}
                        className="config-input"
                        style={{ padding: '4px 6px', fontSize: '11px' }}
                      />
                    </td>
                    <td>
                      <select
                        value={tech.assignedCategory}
                        onChange={(e) => handleUpdateTechnician(idx, { assignedCategory: e.target.value })}
                        className="config-select"
                        style={{ padding: '4px 6px', fontSize: '11px' }}
                      >
                        <option value="dicing">Wafer Dicing</option>
                        <option value="die_attach">Die Attach</option>
                        <option value="wire_bond">Wire Bonding</option>
                        <option value="molding">Molding</option>
                        <option value="ate_sort">Testing &amp; Sort</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={tech.shiftSchedule}
                        onChange={(e) => handleUpdateTechnician(idx, { shiftSchedule: e.target.value })}
                        className="config-input"
                        style={{ padding: '4px 6px', fontSize: '11px' }}
                      />
                    </td>
                    <td>
                      <select
                        value={tech.primaryChannel}
                        onChange={(e) => handleUpdateTechnician(idx, { primaryChannel: e.target.value as any })}
                        className="config-select"
                        style={{ padding: '4px 6px', fontSize: '11px' }}
                      >
                        <option value="EMAIL">Email</option>
                        <option value="WHATSAPP">WhatsApp</option>
                        <option value="WEBSITE">Web Console</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={tech.channelAddress}
                        onChange={(e) => handleUpdateTechnician(idx, { channelAddress: e.target.value })}
                        className="config-input"
                        style={{ padding: '4px 6px', fontSize: '11px' }}
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <input
                          type="number"
                          value={tech.autoEscalationMin}
                          onChange={(e) => handleUpdateTechnician(idx, { autoEscalationMin: parseInt(e.target.value) || 15 })}
                          className="config-input"
                          style={{ width: '50px', padding: '4px 6px', fontSize: '11px' }}
                        />
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>min</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleTriggerTest(tech)}
                        disabled={sendingTestFor === tech.id}
                        className="tech-btn"
                        style={{ fontSize: '10px', padding: '3px 8px' }}
                        title="Send sample work order alert"
                      >
                        {sendingTestFor === tech.id ? (
                          <RotateCw size={11} className="spin-anim" />
                        ) : (
                          <Send size={11} />
                        )}
                        <span>TEST ALERT</span>
                      </button>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveTechnician(idx)}
                        className="canvas-ctrl-btn"
                        style={{ color: 'var(--accent-red)' }}
                        title="Delete specialist entry"
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
    </div>
  );
};
