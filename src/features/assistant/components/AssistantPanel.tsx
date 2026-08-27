import React, { useEffect } from 'react';
import { AssistantHeader } from './AssistantHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { AssistantMessage, AssistantToolActivity } from '../types/assistant';

interface AssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  messages: AssistantMessage[];
  isLoading: boolean;
  currentActivity?: AssistantToolActivity;
  onSendMessage: (message: string) => void;
  currentMachineId?: string | null;
}

export const AssistantPanel: React.FC<AssistantPanelProps> = ({
  isOpen,
  onClose,
  onReset,
  messages,
  isLoading,
  currentActivity,
  onSendMessage,
  currentMachineId
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="assistant-panel-container"
      role="dialog"
      aria-label="VectorAI Assistant Panel"
      aria-modal="true"
    >
      <AssistantHeader onClose={onClose} onReset={onReset} />

      <ChatMessageList
        messages={messages}
        isLoading={isLoading}
        currentActivity={currentActivity}
        onSelectSuggestion={onSendMessage}
        currentMachineId={currentMachineId}
      />

      <ChatInput
        onSend={onSendMessage}
        disabled={isLoading}
        placeholder={
          currentMachineId
            ? `Ask about ${currentMachineId}, live telemetry, RUL, or manual...`
            : 'Ask about telemetry, anomalies, RUL, or manuals...'
        }
      />
    </div>
  );
};
