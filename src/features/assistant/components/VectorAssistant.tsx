import React from 'react';
import { useAssistant } from '../hooks/useAssistant';
import { AssistantButton } from './AssistantButton';
import { AssistantPanel } from './AssistantPanel';
import '../../../styles/assistant.css';

interface VectorAssistantProps {
  currentPage?: string;
  currentMachineId?: string | null;
  currentSubTab?: string;
  onNavigate?: (tabId: string, contextId?: string, subTab?: string) => void;
}

export const VectorAssistant: React.FC<VectorAssistantProps> = ({
  currentPage,
  currentMachineId,
  currentSubTab
}) => {
  const {
    isOpen,
    setIsOpen,
    messages,
    isLoading,
    currentActivity,
    sendMessage,
    resetConversation
  } = useAssistant({
    currentPage,
    currentMachineId,
    currentSubTab
  });

  return (
    <div className="vector-assistant-root">
      <AssistantPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onReset={resetConversation}
        messages={messages}
        isLoading={isLoading}
        currentActivity={currentActivity}
        onSendMessage={sendMessage}
        currentMachineId={currentMachineId}
      />

      <AssistantButton
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        unreadCount={0}
      />
    </div>
  );
};
