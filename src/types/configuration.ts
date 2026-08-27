// =========================================================================
// VECTOR.AI — SYSTEM CONFIGURATION & INDUSTRIAL GATEWAY TYPES
// Protocol specs, RUL calibration, GenAI settings, Reroute policy & Security
// =========================================================================

import { ModelWeights } from './factory';

// ── 1. Edge Protocols & Industrial Gateway ─────────────────────────────────

export type ProtocolType = 'MQTT' | 'OPC_UA' | 'SECS_GEM' | 'MODBUS_TCP' | 'REST_WEBHOOK';

export interface MqttConfig {
  enabled: boolean;
  brokerHost: string;
  brokerPort: number;
  useTls: boolean;
  clientId: string;
  keepAliveSec: number;
  qos: 0 | 1 | 2;
  cleanSession: boolean;
  username: string;
  topicPrefix: string;
  payloadFormat: 'JSON' | 'SPARKPLUG_B' | 'PROTOBUF';
}

export interface OpcUaNodeMapping {
  nodeId: string;
  displayName: string;
  machineCategory: string;
  dataType: string;
  samplingIntervalMs: number;
}

export interface OpcUaConfig {
  enabled: boolean;
  endpointUrl: string;
  securityMode: 'None' | 'Sign' | 'SignAndEncrypt';
  securityPolicy: 'Basic256Sha256' | 'Aes128_Sha256_RsaOaep' | 'None';
  namespaceUri: string;
  authenticationMode: 'Anonymous' | 'UsernamePassword' | 'Certificate';
  username: string;
  sessionTimeoutMs: number;
  nodeMappings: OpcUaNodeMapping[];
}

export interface SecsGemConfig {
  enabled: boolean;
  deviceId: number;
  ipAddress: string;
  port: number;
  connectionMode: 'HSMS_SS_ACTIVE' | 'HSMS_SS_PASSIVE' | 'SECS_I_SERIAL';
  t3ReplyTimeout: number;
  t5ConnectSeparation: number;
  t6ControlTimeout: number;
  t7NotSelectedTimeout: number;
  t8NetworkInterCharTimeout: number;
}

export interface ModbusConfig {
  enabled: boolean;
  host: string;
  port: number;
  slaveId: number;
  pollingIntervalMs: number;
  timeoutMs: number;
}

export interface EdgeProtocolsConfigData {
  mqtt: MqttConfig;
  opcUa: OpcUaConfig;
  secsGem: SecsGemConfig;
  modbus: ModbusConfig;
}

// ── 2. AI & RUL Model Calibration ──────────────────────────────────────────

export interface RulCalibrationPreset {
  id: string;
  name: string;
  description: string;
  badge: string;
  weights: ModelWeights;
  criticalThresholdHours: number;
  warningThresholdHours: number;
  anomalySensitivity: 'LOW' | 'BALANCED' | 'HIGH' | 'STRICT';
}

export interface RulCalibrationConfigData {
  weights: ModelWeights;
  criticalThresholdHours: number;
  warningThresholdHours: number;
  anomalySensitivity: 'LOW' | 'BALANCED' | 'HIGH' | 'STRICT';
  healthScoreDecayFactor: number;
  vibrationSpikeZScore: number;
  activePresetId?: string;
}

// ── 3. GenAI & RAG Intelligence ─────────────────────────────────────────────

export interface GenAiRagConfigData {
  apiKey: string;
  selectedModel: 'gemini-2.5-flash' | 'gemini-2.5-pro' | 'gemini-2.0-flash';
  temperature: number;
  topP: number;
  maxOutputTokens: number;
  enableLayer1ManualGrounding: boolean;
  layer1ConfidenceCutoff: number;
  enableLayer2RagFallback: boolean;
  ragChunkSize: number;
  ragChunkOverlap: number;
  ragTopK: number;
  systemPromptModifier: string;
}

// ── 4. Dynamic Rerouting & AGV Policy ──────────────────────────────────────

export interface ReroutePolicyConfigData {
  automationMode: 'AUTONOMOUS' | 'SEMI_AUTONOMOUS' | 'MANUAL_ONLY';
  yieldProtectionTriggerRulHours: number;
  autoRerouteOnCriticalStatus: boolean;
  agvDispatchPriority: 'FASTEST_TRANSIT' | 'LOAD_BALANCED' | 'MIN_STAGING_BUFFER';
  agvStagingTimeoutSec: number;
  agvSpeedLimitMps: number;
  safetyRollbackWindowMin: number;
  cleanroomWaferScrapValueUsd: number;
  maxReroutesPerShift: number;
  allowedTargetClusters: string[];
}

// ── 5. Notification & Dispatch Matrix ───────────────────────────────────────

export interface SmtpConfig {
  enabled: boolean;
  host: string;
  port: number;
  useTls: boolean;
  senderAddress: string;
  senderName: string;
  authRequired: boolean;
}

export interface WhatsAppConfig {
  enabled: boolean;
  accountSid: string;
  senderNumber: string;
  webhookCallbackUrl: string;
}

export interface WebhookEndpointConfig {
  id: string;
  name: string;
  url: string;
  secret: string;
  enabled: boolean;
  subscribedEvents: string[];
}

export interface TechnicianRoutingEntry {
  id: string;
  name: string;
  role: string;
  assignedCategory: string;
  primaryChannel: 'EMAIL' | 'WHATSAPP' | 'WEBSITE';
  channelAddress: string;
  autoEscalationMin: number;
  shiftSchedule: string;
}

export interface DispatchMatrixConfigData {
  smtp: SmtpConfig;
  whatsapp: WhatsAppConfig;
  webhooks: WebhookEndpointConfig[];
  technicians: TechnicianRoutingEntry[];
  escalateToPlantManagerAfterMin: number;
}

// ── 6. Security, Tokens & Audit Trail ───────────────────────────────────────

export type UserRole = 'PLANT_ADMIN' | 'LEAD_PROCESS_ENGINEER' | 'MAINTENANCE_TECH' | 'AUDITOR';

export interface ApiToken {
  id: string;
  name: string;
  tokenKey: string;
  role: UserRole;
  createdAt: string;
  expiresAt: string;
  lastUsedAt?: string;
  scopes: string[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  category: 'PROTOCOLS' | 'CALIBRATION' | 'GENAI' | 'REROUTING' | 'DISPATCH' | 'SECURITY';
  action: string;
  details: string;
  status: 'SUCCESS' | 'WARN' | 'REVERTED';
}

export interface SecurityConfigData {
  currentUserRole: UserRole;
  tokens: ApiToken[];
  ipWhitelist: string[];
  sessionTimeoutMin: number;
  enforceMfa: boolean;
  auditLogs: AuditLogEntry[];
}

// ── Root Configuration Schema ───────────────────────────────────────────────

export interface SystemConfiguration {
  version: string;
  lastUpdated: string;
  plantIdentity: {
    facilityId: string;
    facilityName: string;
    location: string;
    cleanroomClass: string;
  };
  protocols: EdgeProtocolsConfigData;
  calibration: RulCalibrationConfigData;
  genAi: GenAiRagConfigData;
  reroutePolicy: ReroutePolicyConfigData;
  dispatch: DispatchMatrixConfigData;
  security: SecurityConfigData;
}

// ── Default Industrial Calibration Presets ─────────────────────────────────

export const CALIBRATION_PRESETS: RulCalibrationPreset[] = [
  {
    id: 'preset-nominal',
    name: 'Semiconductor Nominal (Balanced)',
    badge: 'DEFAULT',
    description: 'Calibrated for high-yield silicon packaging lines with standard preventive maintenance margins.',
    weights: {
      intercept: 2000,
      devWeight: 14.5,
      rateWeight: 420.0,
      timeWeight: 0.95,
    },
    criticalThresholdHours: 48,
    warningThresholdHours: 250,
    anomalySensitivity: 'BALANCED',
  },
  {
    id: 'preset-strict',
    name: 'Zero-Downtime Defense (Strict)',
    badge: 'HIGH PROTECTION',
    description: 'Aggressive safety envelope for high-value automotive & aerospace Grade-0 wafer lots.',
    weights: {
      intercept: 1800,
      devWeight: 20.0,
      rateWeight: 550.0,
      timeWeight: 1.4,
    },
    criticalThresholdHours: 72,
    warningThresholdHours: 350,
    anomalySensitivity: 'STRICT',
  },
  {
    id: 'preset-high-throughput',
    name: 'High-Throughput Production (Relaxed)',
    badge: 'MAX VELOCITY',
    description: 'Allows broader operating tolerances for mature commodity packaging lines before flagging alarms.',
    weights: {
      intercept: 2200,
      devWeight: 11.0,
      rateWeight: 310.0,
      timeWeight: 0.75,
    },
    criticalThresholdHours: 24,
    warningThresholdHours: 180,
    anomalySensitivity: 'LOW',
  },
];

// ── Default System Configuration Object ─────────────────────────────────────

export const DEFAULT_SYSTEM_CONFIG: SystemConfiguration = {
  version: '2.8.4-PROD',
  lastUpdated: new Date().toISOString(),
  plantIdentity: {
    facilityId: 'OSAT-PLANT-01',
    facilityName: 'Penang Backend Fab 1',
    location: 'Bayan Lepas Industrial Zone Phase IV, Penang',
    cleanroomClass: 'ISO Class 5 (Class 100)',
  },
  protocols: {
    mqtt: {
      enabled: true,
      brokerHost: 'mqtts://broker.vector.internal',
      brokerPort: 8883,
      useTls: true,
      clientId: 'vectorai-edge-gw-01',
      keepAliveSec: 60,
      qos: 1,
      cleanSession: false,
      username: 'edge_telemetry_agent',
      topicPrefix: 'vectorai/fab1/telemetry',
      payloadFormat: 'JSON',
    },
    opcUa: {
      enabled: true,
      endpointUrl: 'opc.tcp://edge-gw-01.fab1.internal:4840',
      securityMode: 'SignAndEncrypt',
      securityPolicy: 'Basic256Sha256',
      namespaceUri: 'urn:vectorai:fab:cleanroom',
      authenticationMode: 'UsernamePassword',
      username: 'opc_operator',
      sessionTimeoutMs: 120000,
      nodeMappings: [
        { nodeId: 'ns=2;s=WS01.SpindleVibration', displayName: 'WS-01 Spindle Vibration', machineCategory: 'dicing', dataType: 'Float32', samplingIntervalMs: 100 },
        { nodeId: 'ns=2;s=DA02.VacuumPressure', displayName: 'DA-02 Vacuum Pressure', machineCategory: 'die_attach', dataType: 'Float32', samplingIntervalMs: 250 },
        { nodeId: 'ns=2;s=WB01.TransducerTemp', displayName: 'WB-01 Transducer Temp', machineCategory: 'wire_bond', dataType: 'Float32', samplingIntervalMs: 500 },
        { nodeId: 'ns=2;s=MP01.CavityPressure', displayName: 'MP-01 Cavity Pressure', machineCategory: 'molding', dataType: 'Float32', samplingIntervalMs: 200 },
        { nodeId: 'ns=2;s=TH02.TurretVibration', displayName: 'TH-02 Turret Vibration', machineCategory: 'ate_sort', dataType: 'Float32', samplingIntervalMs: 100 },
      ],
    },
    secsGem: {
      enabled: true,
      deviceId: 1,
      ipAddress: '10.240.12.88',
      port: 5000,
      connectionMode: 'HSMS_SS_ACTIVE',
      t3ReplyTimeout: 45,
      t5ConnectSeparation: 10,
      t6ControlTimeout: 5,
      t7NotSelectedTimeout: 10,
      t8NetworkInterCharTimeout: 5,
    },
    modbus: {
      enabled: false,
      host: '10.240.12.95',
      port: 502,
      slaveId: 1,
      pollingIntervalMs: 1000,
      timeoutMs: 3000,
    },
  },
  calibration: {
    weights: {
      intercept: 2000,
      devWeight: 14.5,
      rateWeight: 420.0,
      timeWeight: 0.95,
    },
    criticalThresholdHours: 48,
    warningThresholdHours: 250,
    anomalySensitivity: 'BALANCED',
    healthScoreDecayFactor: 0.7,
    vibrationSpikeZScore: 3.2,
    activePresetId: 'preset-nominal',
  },
  genAi: {
    apiKey: '',
    selectedModel: 'gemini-2.5-flash',
    temperature: 0.2,
    topP: 0.95,
    maxOutputTokens: 2048,
    enableLayer1ManualGrounding: true,
    layer1ConfidenceCutoff: 0.85,
    enableLayer2RagFallback: true,
    ragChunkSize: 512,
    ragChunkOverlap: 64,
    ragTopK: 3,
    systemPromptModifier: 'Strict industrial engineering tone. Always cite manual chapter and scenario code.',
  },
  reroutePolicy: {
    automationMode: 'AUTONOMOUS',
    yieldProtectionTriggerRulHours: 48,
    autoRerouteOnCriticalStatus: true,
    agvDispatchPriority: 'FASTEST_TRANSIT',
    agvStagingTimeoutSec: 15,
    agvSpeedLimitMps: 1.8,
    safetyRollbackWindowMin: 5,
    cleanroomWaferScrapValueUsd: 700,
    maxReroutesPerShift: 12,
    allowedTargetClusters: ['Dicing Bay Alpha', 'Die Attach Cluster B', 'Wire Bond Wing North', 'Molding Cell 1'],
  },
  dispatch: {
    smtp: {
      enabled: true,
      host: 'smtp.internal.vector.ai',
      port: 587,
      useTls: true,
      senderAddress: 'ops-auto-dispatch@vector.ai',
      senderName: 'VectorAI Cleanroom Dispatch Hub',
      authRequired: true,
    },
    whatsapp: {
      enabled: true,
      accountSid: 'AC_TWILIO_VECTOR_FAB_01',
      senderNumber: '+1-555-019-8834',
      webhookCallbackUrl: 'https://ops.vector.ai/api/v1/webhooks/whatsapp',
    },
    webhooks: [
      {
        id: 'wh-mes',
        name: 'MES Supervisor Orchestration Webhook',
        url: 'https://mes.penang-fab1.internal/api/v2/lot-reroute',
        secret: 'sec_mes_38f920da83',
        enabled: true,
        subscribedEvents: ['reroute.initiated', 'reroute.completed', 'machine.critical'],
      },
      {
        id: 'wh-pagerduty',
        name: 'Cleanroom Escalation PagerDuty Bridge',
        url: 'https://events.pagerduty.com/v2/enqueue',
        secret: 'pd_int_key_cleanroom_01',
        enabled: true,
        subscribedEvents: ['machine.critical', 'work_order.unacknowledged'],
      },
    ],
    technicians: [
      {
        id: 'tech-01',
        name: 'David Kim',
        role: 'Senior Dicing Specialist',
        assignedCategory: 'dicing',
        primaryChannel: 'EMAIL',
        channelAddress: 'david.kim@vectorai.internal',
        autoEscalationMin: 15,
        shiftSchedule: 'Shift A (08:00 - 16:00)',
      },
      {
        id: 'tech-02',
        name: 'Sarah Jenkins',
        role: 'Die Attach & Molding Lead',
        assignedCategory: 'die_attach',
        primaryChannel: 'EMAIL',
        channelAddress: 'sarah.jenkins@vectorai.internal',
        autoEscalationMin: 10,
        shiftSchedule: 'Shift A (08:00 - 16:00)',
      },
      {
        id: 'tech-03',
        name: 'Kenji Sato',
        role: 'Ultrasonic & Wire Bond Specialist',
        assignedCategory: 'wire_bond',
        primaryChannel: 'WHATSAPP',
        channelAddress: '+1-555-019-8834',
        autoEscalationMin: 12,
        shiftSchedule: 'Shift B (16:00 - 00:00)',
      },
      {
        id: 'tech-04',
        name: 'Elena Rostova',
        role: 'ATE Sort & Test Handler Engineer',
        assignedCategory: 'ate_sort',
        primaryChannel: 'WEBSITE',
        channelAddress: 'https://ops.vector.ai/dispatch/wo/tech-04',
        autoEscalationMin: 15,
        shiftSchedule: 'Shift A (08:00 - 16:00)',
      },
    ],
    escalateToPlantManagerAfterMin: 20,
  },
  security: {
    currentUserRole: 'PLANT_ADMIN',
    tokens: [
      {
        id: 'tok-edge-gw-01',
        name: 'Cleanroom Edge Gateway Token',
        tokenKey: 'vai_sec_9941a87b8cfd01e488102fca399e',
        role: 'PLANT_ADMIN',
        createdAt: '2026-08-01T08:00:00Z',
        expiresAt: '2027-08-01T08:00:00Z',
        lastUsedAt: '2026-08-27T10:14:22Z',
        scopes: ['telemetry:write', 'reroute:execute', 'config:read'],
      },
      {
        id: 'tok-mes-bridge',
        name: 'MES Production Sync Integration',
        tokenKey: 'vai_sec_4412c980ebff93108ab49910d512',
        role: 'LEAD_PROCESS_ENGINEER',
        createdAt: '2026-08-10T14:30:00Z',
        expiresAt: '2026-11-10T14:30:00Z',
        lastUsedAt: '2026-08-27T10:30:05Z',
        scopes: ['reroute:execute', 'maintenance:read', 'telemetry:read'],
      },
    ],
    ipWhitelist: ['10.240.0.0/16', '192.168.10.0/24', '172.16.50.12'],
    sessionTimeoutMin: 60,
    enforceMfa: true,
    auditLogs: [
      {
        id: 'aud-01',
        timestamp: '2026-08-27T09:40:15Z',
        user: 'admin@vector.ai',
        role: 'PLANT_ADMIN',
        category: 'CALIBRATION',
        action: 'Applied Nominal Preset to RUL Degradation Model',
        details: 'Weights updated: θ_dev=14.5, θ_rate=420.0, θ_time=0.95',
        status: 'SUCCESS',
      },
      {
        id: 'aud-02',
        timestamp: '2026-08-27T08:15:30Z',
        user: 'lead.engineer@vector.ai',
        role: 'LEAD_PROCESS_ENGINEER',
        category: 'PROTOCOLS',
        action: 'Updated MQTT Keep-Alive and TLS Certificates',
        details: 'Port verified on 8883, TLS handshake confirmed with edge broker.',
        status: 'SUCCESS',
      },
      {
        id: 'aud-03',
        timestamp: '2026-08-26T22:10:00Z',
        user: 'system.supervisor',
        role: 'PLANT_ADMIN',
        category: 'REROUTING',
        action: 'Autonomous Reroute Mode Enabled',
        details: 'Dynamic lot diversion triggered automatically on critical RUL <= 48h.',
        status: 'SUCCESS',
      },
    ],
  },
};
