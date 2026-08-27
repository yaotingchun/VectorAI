// =========================================================================
// VECTOR.AI — ASSISTANT CHAT API SERVICE
// Client API Contract & Dispatcher (POST /api/assistant/chat compatible)
// =========================================================================

import { Machine } from '../../machines/types/machine';
import { AssistantChatRequest, AssistantChatResponse } from '../types/assistant';
import { orchestrateAssistantQuery } from './assistantOrchestrator';

/**
 * Executes assistant chat request.
 * Designed to seamlessly interface with local orchestrator or remote API endpoint.
 */
export async function sendAssistantMessage(
  request: AssistantChatRequest,
  liveMachinesOverride?: Machine[],
  previousMachineId?: string | null
): Promise<AssistantChatResponse> {
  return orchestrateAssistantQuery(request, liveMachinesOverride, previousMachineId);
}
