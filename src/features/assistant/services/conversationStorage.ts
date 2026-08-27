// =========================================================================
// VECTOR.AI — CONVERSATION STORAGE SERVICE
// Client-Side Session Memory & Persistent Chat History
// =========================================================================

import { AssistantMessage } from '../types/assistant';

const STORAGE_KEY_PREFIX = 'vectorai_chat_messages_';
const ACTIVE_CONV_KEY = 'vectorai_chat_active_conv';

/**
 * Get active conversation ID or initialize a new one.
 */
export function getActiveConversationId(): string {
  if (typeof window === 'undefined') return 'conv-default';
  let activeId = localStorage.getItem(ACTIVE_CONV_KEY);
  if (!activeId) {
    activeId = `conv-${Date.now()}`;
    localStorage.setItem(ACTIVE_CONV_KEY, activeId);
  }
  return activeId;
}

/**
 * Set active conversation ID.
 */
export function setActiveConversationId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_CONV_KEY, id);
}

/**
 * Load stored messages for a conversation.
 */
export function loadConversationMessages(conversationId: string): AssistantMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${conversationId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('[ConversationStorage] Error loading messages:', err);
    return [];
  }
}

/**
 * Persist messages for a conversation.
 */
export function saveConversationMessages(conversationId: string, messages: AssistantMessage[]): void {
  if (typeof window === 'undefined') return;
  try {
    // Keep at most 50 recent messages to prevent storage bloat
    const trimmed = messages.slice(-50);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${conversationId}`, JSON.stringify(trimmed));
  } catch (err) {
    console.warn('[ConversationStorage] Error saving messages:', err);
  }
}

/**
 * Clear a conversation.
 */
export function clearConversation(conversationId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}${conversationId}`);
}
