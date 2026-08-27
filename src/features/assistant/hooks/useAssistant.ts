// =========================================================================
// VECTOR.AI — USE ASSISTANT HOOK
// State Management for Floating Chatbot, Message History & Tool Status
// =========================================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { useFactory } from '../../../context/FactoryContext';
import {
  AssistantMessage,
  AssistantFrontendContext,
  AssistantToolActivity
} from '../types/assistant';
import {
  getActiveConversationId,
  loadConversationMessages,
  saveConversationMessages,
  clearConversation
} from '../services/conversationStorage';
import { sendAssistantMessage } from '../services/assistantChatApi';

interface UseAssistantOptions {
  currentPage?: string;
  currentMachineId?: string | null;
  currentSubTab?: string;
}

export function useAssistant(options?: UseAssistantOptions) {
  const factory = useFactory();
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string>(getActiveConversationId);
  const [messages, setMessages] = useState<AssistantMessage[]>(() =>
    loadConversationMessages(getActiveConversationId())
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<AssistantToolActivity | undefined>(undefined);
  const lastMachineIdRef = useRef<string | null>(null);

  // Sync previous machine reference
  useEffect(() => {
    if (options?.currentMachineId) {
      lastMachineIdRef.current = options.currentMachineId;
    }
  }, [options?.currentMachineId]);

  // Persist messages when updated
  useEffect(() => {
    saveConversationMessages(conversationId, messages);
  }, [conversationId, messages]);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isLoading) return;

      const userMsg: AssistantMessage = {
        id: `user-${Date.now()}`,
        conversationId,
        role: 'user',
        content: trimmed,
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMsg]);
      setIsLoading(true);
      setCurrentActivity({
        toolName: 'VectorAI Orchestrator',
        description: 'Analyzing query intent and selecting tools...',
        status: 'running'
      });

      try {
        const frontendContext: AssistantFrontendContext = {
          currentPage: options?.currentPage,
          currentMachineId: options?.currentMachineId || lastMachineIdRef.current,
          currentSubTab: options?.currentSubTab
        };

        const response = await sendAssistantMessage(
          {
            message: trimmed,
            conversationId,
            context: frontendContext
          },
          undefined,
          lastMachineIdRef.current
        );

        if (response.message.resolvedMachineId) {
          lastMachineIdRef.current = response.message.resolvedMachineId;
        }

        setMessages(prev => [...prev, response.message]);
      } catch (err) {
        console.error('[useAssistant] Send error:', err);
        const errorMsg: AssistantMessage = {
          id: `err-${Date.now()}`,
          conversationId,
          role: 'assistant',
          content: 'I encountered an unexpected error processing your request. Please try asking again.',
          createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
        setCurrentActivity(undefined);
      }
    },
    [conversationId, isLoading, options, factory.machines]
  );

  const resetConversation = useCallback(() => {
    clearConversation(conversationId);
    const newId = `conv-${Date.now()}`;
    setConversationId(newId);
    setMessages([]);
    lastMachineIdRef.current = null;
  }, [conversationId]);

  return {
    isOpen,
    setIsOpen,
    messages,
    isLoading,
    currentActivity,
    conversationId,
    sendMessage,
    resetConversation
  };
}
