// =========================================================================
// VECTOR.AI — GLOBAL ASSISTANT TYPES
// Type Contracts for Router, Orchestrator, Tools, Memory & UI
// =========================================================================

import { MachineTypeId } from '../../machines/data/machineTypes';
import { KnowledgeType } from '../../machines/intelligence';

export type AssistantRole = 'user' | 'assistant' | 'system';

export type AssistantIntent =
  | 'GENERAL_KNOWLEDGE'
  | 'MACHINE_KNOWLEDGE'
  | 'LIVE_MACHINE_DATA'
  | 'DIAGNOSTIC'
  | 'MIXED'
  | 'WEBSITE_HELP'
  | 'UNKNOWN';

export type AssistantDataSourceType =
  | 'GLOBAL_RAG'
  | 'MACHINE_MANUAL'
  | 'LIVE_TELEMETRY'
  | 'DETERMINISTIC_RUL'
  | 'THRESHOLD_ENGINE'
  | 'MACHINE_AGENT'
  | 'MAINTENANCE_SERVICE';

export interface AssistantSourceCitation {
  id: string;
  knowledgeType: KnowledgeType;
  sourceName: string;
  section: string;
  title: string;
  contentSnippet: string;
  similarityScore?: number;
  documentId?: string;
  manualId?: string;
  machineType?: MachineTypeId;
}

export interface AssistantLiveDataBadge {
  machineId: string;
  machineName?: string;
  metric: string;
  value: string | number;
  unit?: string;
  status?: 'normal' | 'warning' | 'critical' | 'healthy';
  timestamp?: string;
}

export interface AssistantToolActivity {
  toolName: string;
  description: string;
  status: 'running' | 'completed' | 'error';
  dataSources?: AssistantDataSourceType[];
}

export interface AssistantAttachment {
  id: string;
  title: string;
  filename: string;
  pdfUrl: string;
  size: string;
  machineType?: MachineTypeId;
}

export interface AssistantMessage {
  id: string;
  conversationId: string;
  role: AssistantRole;
  content: string;
  createdAt: string;
  intent?: AssistantIntent;
  sources?: AssistantSourceCitation[];
  dataSources?: AssistantDataSourceType[];
  liveData?: AssistantLiveDataBadge[];
  resolvedMachineId?: string;
  toolActivity?: AssistantToolActivity[];
  attachments?: AssistantAttachment[];
}

export interface AssistantConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessagePreview?: string;
}

export interface AssistantFrontendContext {
  currentPage?: string;
  currentMachineId?: string | null;
  currentSubTab?: string;
}

export interface AssistantChatRequest {
  message: string;
  conversationId?: string;
  context?: AssistantFrontendContext;
}

export interface AssistantChatResponse {
  conversationId: string;
  message: AssistantMessage;
  intent: AssistantIntent;
  sources: AssistantSourceCitation[];
  dataSources: AssistantDataSourceType[];
}
