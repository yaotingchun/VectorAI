import React from 'react';
import { Bot } from 'lucide-react';

interface AssistantButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount?: number;
}

export const AssistantButton: React.FC<AssistantButtonProps> = ({
  isOpen,
  onToggle
}) => {
  return (
    <button
      className={`assistant-toggle-btn ${isOpen ? 'active' : ''}`}
      onClick={onToggle}
      aria-label="Toggle VectorAI Assistant"
      aria-expanded={isOpen}
      title={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
    >
      <Bot size={20} />
      <span className="assistant-btn-status-dot" title="Operational // AI Online" />
    </button>
  );
};
