import React, { useState } from 'react';
import { EdgeProtocolsConfigData, OpcUaNodeMapping } from '../../../types/configuration';
import {
  Server,
  Activity,
  ShieldCheck,
  Zap,
  Plus,
  Trash2,
  Play,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Wifi,
  Lock,
  Terminal,
} from 'lucide-react';

interface EdgeProtocolsConfigProps {
  protocols: EdgeProtocolsConfigData;
  onChange: (updated: EdgeProtocolsConfigData) => void;
}

export const EdgeProtocolsConfig: React.FC<EdgeProtocolsConfigProps> = ({
  protocols,
  onChange,
}) => {
  const [testingProtocol, setTestingProtocol] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ status: 'SUCCESS' | 'ERROR'; latencyMs: number; message: string } | null>(null);
  const [livePackets, setLivePackets] = useState<Array<{ id: string; time: string; topic: string; payload: string }>>([
    { id: 'pkt-1', time: '10:45:01.120', topic: 'vectorai/fab1/telemetry/WS-01', payload: '{"vibration":0.52,"temp":20.4,"load":5.8,"status":"HEALTHY"}' },
    { id: 'pkt-2', time: '10:45:01.350', topic: 'vectorai/fab1/telemetry/DA-02', payload: '{"vacuum_kpa":-78.2,"temp":158.0,"status":"WARNING"}' },
    { id: 'pkt-3', time: '10:45:01.780', topic: 'vectorai/fab1/telemetry/WB-01', payload: '{"piezo_temp":41.2,"ultrasonic_vib":0.38,"status":"HEALTHY"}' },
  ]);

  const updateMqtt = (fields: Partial<typeof protocols.mqtt>) => {
    onChange({ ...protocols, mqtt: { ...protocols.mqtt, ...fields } });
  };

  const updateOpcUa = (fields: Partial<typeof protocols.opcUa>) => {
    onChange({ ...protocols, opcUa: { ...protocols.opcUa, ...fields } });
  };

  const updateSecsGem = (fields: Partial<typeof protocols.secsGem>) => {
    onChange({ ...protocols, secsGem: { ...protocols.secsGem, ...fields } });
  };

  const updateModbus = (fields: Partial<typeof protocols.modbus>) => {
    onChange({ ...protocols, modbus: { ...protocols.modbus, ...fields } });
  };

  const handleAddOpcNode = () => {
    const newNode: OpcUaNodeMapping = {
      nodeId: `ns=2;s=DEV${protocols.opcUa.nodeMappings.length + 1}.Telemetry`,
      displayName: `New Node ${protocols.opcUa.nodeMappings.length + 1}`,
      machineCategory: 'dicing',
      dataType: 'Float32',
      samplingIntervalMs: 100,
    };
    updateOpcUa({ nodeMappings: [...protocols.opcUa.nodeMappings, newNode] });
  };

  const handleRemoveOpcNode = (index: number) => {
    const updated = protocols.opcUa.nodeMappings.filter((_, i) => i !== index);
    updateOpcUa({ nodeMappings: updated });
  };

  const handleUpdateOpcNode = (index: number, fields: Partial<OpcUaNodeMapping>) => {
    const updated = protocols.opcUa.nodeMappings.map((node, i) =>
      i === index ? { ...node, ...fields } : node
    );
    updateOpcUa({ nodeMappings: updated });
  };

  const handleRunPingTest = (protocol: string) => {
    setTestingProtocol(protocol);
    setTestResult(null);
    setTimeout(() => {
      setTestingProtocol(null);
      const latency = Math.floor(Math.random() * 12 + 6);
      setTestResult({
        status: 'SUCCESS',
        latencyMs: latency,
        message: `Handshake ACK received from ${protocol} endpoint. TLS v1.3 cipher AES-GCM verified (RTT: ${latency}ms).`,
      });

      // Add a simulated packet
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + '.' + now.getMilliseconds();
      setLivePackets((prev) => [
        {
          id: `pkt-${Date.now()}`,
          time: timeStr,
          topic: `vectorai/fab1/telemetry/PING-${protocol}`,
          payload: `{"handshake":"ACK","status":"ONLINE","rtt_ms":${latency}}`,
        },
        ...prev.slice(0, 10),
      ]);
    }, 900);
  };

  return (
    <div className="config-content-grid" role="region" aria-label="Edge Protocols Configuration">
      {/* 1. Protocol Summary & Live Ping Bar */}
      <div className="config-card">
        <div className="config-card-header">
          <div className="config-card-title">
            <Wifi size={16} style={{ color: 'var(--accent-green)' }} />
            <span>Industrial IoT Gateway Status &amp; Protocol Ping Simulator</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleRunPingTest('MQTT')}
              disabled={!!testingProtocol}
              className="tech-btn"
              style={{ fontSize: '11px', padding: '5px 10px' }}
            >
              {testingProtocol === 'MQTT' ? <RotateCw size={12} className="spin-anim" /> : <Play size={12} />}
              <span>TEST MQTT</span>
            </button>
            <button
              type="button"
              onClick={() => handleRunPingTest('OPC-UA')}
              disabled={!!testingProtocol}
              className="tech-btn"
              style={{ fontSize: '11px', padding: '5px 10px' }}
            >
              {testingProtocol === 'OPC-UA' ? <RotateCw size={12} className="spin-anim" /> : <Play size={12} />}
              <span>TEST OPC-UA</span>
            </button>
            <button
              type="button"
              onClick={() => handleRunPingTest('SECS/GEM')}
              disabled={!!testingProtocol}
              className="tech-btn"
              style={{ fontSize: '11px', padding: '5px 10px' }}
            >
              {testingProtocol === 'SECS/GEM' ? <RotateCw size={12} className="spin-anim" /> : <Play size={12} />}
              <span>TEST SECS/GEM</span>
            </button>
          </div>
        </div>

        <div className="config-card-body">
          {testResult && (
            <div
              style={{
                backgroundColor: testResult.status === 'SUCCESS' ? 'rgba(22, 163, 74, 0.08)' : 'rgba(220, 38, 38, 0.08)',
                border: `1.5px solid ${testResult.status === 'SUCCESS' ? 'var(--accent-green)' : 'var(--accent-red)'}`,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--accent-green)' }} />
                <span>{testResult.message}</span>
              </div>
              <span className="status-pill" style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--text-inverted)' }}>
                LATENCY: {testResult.latencyMs} ms
              </span>
            </div>
          )}

          {/* Live Ingestion Stream */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="config-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Terminal size={12} /> LIVE PROTOCOL PACKET INSPECTOR (INGESTION STREAM)
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                POLLING AT 10 HZ • BUFFER: 10 PACKETS
              </span>
            </div>

            <div className="config-terminal">
              {livePackets.map((pkt) => (
                <div key={pkt.id} className="terminal-line">
                  <span className="terminal-time">[{pkt.time}]</span>
                  <span style={{ color: '#F59E0B', fontWeight: 700 }}>{pkt.topic}</span>
                  <span className="terminal-msg">{pkt.payload}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Side-by-Side: MQTT Broker & SECS/GEM Configuration */}
      <div className="config-grid-2col">
        {/* MQTT Broker Settings */}
        <div className="config-card">
          <div className="config-card-header">
            <div className="config-card-title">
              <Zap size={14} style={{ color: 'var(--accent-amber)' }} />
              <span>MQTT Telemetry Broker</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={protocols.mqtt.enabled}
                onChange={(e) => updateMqtt({ enabled: e.target.checked })}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="config-card-body">
            <div className="config-form-group">
              <div className="config-label-row">
                <label className="config-label">Broker Host URI</label>
                <span className="config-hint">TLS Supported (mqtts://)</span>
              </div>
              <input
                type="text"
                value={protocols.mqtt.brokerHost}
                onChange={(e) => updateMqtt({ brokerHost: e.target.value })}
                className="config-input"
                placeholder="mqtts://broker.vector.internal"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="config-form-group">
                <label className="config-label">Broker Port</label>
                <input
                  type="number"
                  value={protocols.mqtt.brokerPort}
                  onChange={(e) => updateMqtt({ brokerPort: parseInt(e.target.value) || 8883 })}
                  className="config-input"
                />
              </div>

              <div className="config-form-group">
                <label className="config-label">QoS Level</label>
                <select
                  value={protocols.mqtt.qos}
                  onChange={(e) => updateMqtt({ qos: parseInt(e.target.value) as 0 | 1 | 2 })}
                  className="config-select"
                >
                  <option value={0}>0 — At most once</option>
                  <option value={1}>1 — At least once (Standard)</option>
                  <option value={2}>2 — Exactly once</option>
                </select>
              </div>
            </div>

            <div className="config-form-group">
              <label className="config-label">Client ID</label>
              <input
                type="text"
                value={protocols.mqtt.clientId}
                onChange={(e) => updateMqtt({ clientId: e.target.value })}
                className="config-input"
              />
            </div>

            <div className="config-form-group">
              <label className="config-label">Root Topic Prefix</label>
              <input
                type="text"
                value={protocols.mqtt.topicPrefix}
                onChange={(e) => updateMqtt({ topicPrefix: e.target.value })}
                className="config-input"
              />
            </div>

            <div className="config-form-group">
              <label className="config-label">Payload Encoding</label>
              <select
                value={protocols.mqtt.payloadFormat}
                onChange={(e) => updateMqtt({ payloadFormat: e.target.value as any })}
                className="config-select"
              >
                <option value="JSON">JSON (Standard UTF-8 Telemetry)</option>
                <option value="SPARKPLUG_B">Eclipse Sparkplug B (Industrial IoT)</option>
                <option value="PROTOBUF">Google Protocol Buffers (High Performance)</option>
              </select>
            </div>

            <div className="toggle-switch-row">
              <div>
                <div style={{ fontWeight: 700, fontSize: '11px' }}>TLS / SSL Encryption (Port 8883)</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Require X.509 client certificate authentication</div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={protocols.mqtt.useTls}
                  onChange={(e) => updateMqtt({ useTls: e.target.checked })}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </div>

        {/* SECS/GEM Semiconductor Equipment Interface */}
        <div className="config-card">
          <div className="config-card-header">
            <div className="config-card-title">
              <Server size={14} style={{ color: 'var(--accent-blue)' }} />
              <span>SECS / GEM Semi Interface (SEMI E5 / E30 / E37)</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={protocols.secsGem.enabled}
                onChange={(e) => updateSecsGem({ enabled: e.target.checked })}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="config-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="config-form-group">
                <label className="config-label">SECS Device ID</label>
                <input
                  type="number"
                  value={protocols.secsGem.deviceId}
                  onChange={(e) => updateSecsGem({ deviceId: parseInt(e.target.value) || 1 })}
                  className="config-input"
                />
              </div>

              <div className="config-form-group">
                <label className="config-label">HSMS Port</label>
                <input
                  type="number"
                  value={protocols.secsGem.port}
                  onChange={(e) => updateSecsGem({ port: parseInt(e.target.value) || 5000 })}
                  className="config-input"
                />
              </div>
            </div>

            <div className="config-form-group">
              <label className="config-label">Equipment IP Address</label>
              <input
                type="text"
                value={protocols.secsGem.ipAddress}
                onChange={(e) => updateSecsGem({ ipAddress: e.target.value })}
                className="config-input"
              />
            </div>

            <div className="config-form-group">
              <label className="config-label">Connection Mode</label>
              <select
                value={protocols.secsGem.connectionMode}
                onChange={(e) => updateSecsGem({ connectionMode: e.target.value as any })}
                className="config-select"
              >
                <option value="HSMS_SS_ACTIVE">HSMS-SS Active (Equipment initiates connection)</option>
                <option value="HSMS_SS_PASSIVE">HSMS-SS Passive (Host connects to equipment)</option>
                <option value="SECS_I_SERIAL">SECS-I RS-232 Serial Port (Legacy)</option>
              </select>
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
              <span className="config-label" style={{ display: 'block', marginBottom: '8px' }}>
                HSMS Timers (Seconds)
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <div className="config-form-group">
                  <span className="config-hint">T3 (Reply)</span>
                  <input
                    type="number"
                    value={protocols.secsGem.t3ReplyTimeout}
                    onChange={(e) => updateSecsGem({ t3ReplyTimeout: parseInt(e.target.value) || 45 })}
                    className="config-input"
                  />
                </div>
                <div className="config-form-group">
                  <span className="config-hint">T5 (Conn Sep)</span>
                  <input
                    type="number"
                    value={protocols.secsGem.t5ConnectSeparation}
                    onChange={(e) => updateSecsGem({ t5ConnectSeparation: parseInt(e.target.value) || 10 })}
                    className="config-input"
                  />
                </div>
                <div className="config-form-group">
                  <span className="config-hint">T6 (Control)</span>
                  <input
                    type="number"
                    value={protocols.secsGem.t6ControlTimeout}
                    onChange={(e) => updateSecsGem({ t6ControlTimeout: parseInt(e.target.value) || 5 })}
                    className="config-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. OPC-UA Server & Node Mapping Matrix */}
      <div className="config-card">
        <div className="config-card-header">
          <div className="config-card-title">
            <Lock size={14} style={{ color: 'var(--accent-green)' }} />
            <span>OPC-UA Cleanroom Gateway &amp; Tag Node Mapping (IEC 62541)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handleAddOpcNode}
              className="tech-btn"
              style={{ fontSize: '11px', padding: '4px 8px' }}
            >
              <Plus size={12} /> ADD NODE MAPPING
            </button>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={protocols.opcUa.enabled}
                onChange={(e) => updateOpcUa({ enabled: e.target.checked })}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>

        <div className="config-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div className="config-form-group">
              <label className="config-label">OPC-UA Endpoint URL</label>
              <input
                type="text"
                value={protocols.opcUa.endpointUrl}
                onChange={(e) => updateOpcUa({ endpointUrl: e.target.value })}
                className="config-input"
              />
            </div>

            <div className="config-form-group">
              <label className="config-label">Security Mode</label>
              <select
                value={protocols.opcUa.securityMode}
                onChange={(e) => updateOpcUa({ securityMode: e.target.value as any })}
                className="config-select"
              >
                <option value="SignAndEncrypt">Sign &amp; Encrypt (Recommended)</option>
                <option value="Sign">Sign Only</option>
                <option value="None">None (Unencrypted / Testing Only)</option>
              </select>
            </div>

            <div className="config-form-group">
              <label className="config-label">Security Policy</label>
              <select
                value={protocols.opcUa.securityPolicy}
                onChange={(e) => updateOpcUa({ securityPolicy: e.target.value as any })}
                className="config-select"
              >
                <option value="Basic256Sha256">Basic256Sha256 (High Security)</option>
                <option value="Aes128_Sha256_RsaOaep">Aes128_Sha256_RsaOaep</option>
                <option value="None">None</option>
              </select>
            </div>
          </div>

          {/* Node Mappings Table */}
          <div className="config-table-container" style={{ marginTop: '10px' }}>
            <table className="config-table">
              <thead>
                <tr>
                  <th>Node ID (Namespace + Identifier)</th>
                  <th>Display Name</th>
                  <th>Machine Category</th>
                  <th>Data Type</th>
                  <th>Sampling Interval</th>
                  <th style={{ width: '40px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {protocols.opcUa.nodeMappings.map((node, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        type="text"
                        value={node.nodeId}
                        onChange={(e) => handleUpdateOpcNode(idx, { nodeId: e.target.value })}
                        className="config-input"
                        style={{ padding: '4px 6px', fontSize: '11px' }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={node.displayName}
                        onChange={(e) => handleUpdateOpcNode(idx, { displayName: e.target.value })}
                        className="config-input"
                        style={{ padding: '4px 6px', fontSize: '11px' }}
                      />
                    </td>
                    <td>
                      <select
                        value={node.machineCategory}
                        onChange={(e) => handleUpdateOpcNode(idx, { machineCategory: e.target.value })}
                        className="config-select"
                        style={{ padding: '4px 6px', fontSize: '11px' }}
                      >
                        <option value="dicing">Dicing</option>
                        <option value="die_attach">Die Attach</option>
                        <option value="wire_bond">Wire Bond</option>
                        <option value="molding">Molding</option>
                        <option value="ate_sort">Testing &amp; Sort</option>
                      </select>
                    </td>
                    <td>
                      <span className="status-pill" style={{ fontSize: '9px' }}>{node.dataType}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input
                          type="number"
                          value={node.samplingIntervalMs}
                          onChange={(e) => handleUpdateOpcNode(idx, { samplingIntervalMs: parseInt(e.target.value) || 100 })}
                          className="config-input"
                          style={{ width: '70px', padding: '4px 6px', fontSize: '11px' }}
                        />
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ms</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveOpcNode(idx)}
                        className="canvas-ctrl-btn"
                        style={{ color: 'var(--accent-red)' }}
                        title="Delete node mapping"
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
