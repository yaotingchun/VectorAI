import React from 'react';
import { Bot, X, RotateCcw } from 'lucide-react';

interface AssistantHeaderProps {
  onClose: () => void;
  onReset: () => void;
}

export const AssistantHeader: React.FC<AssistantHeaderProps> = ({
  onClose,
  onReset
}) => {
  return (
    <div className="assistant-header">
      <div className="assistant-header-left">
        <Bot size={18} color="var(--accent-blue, #38BDF8)" />
        <div>
          <div className="assistant-header-title">VectorAI Assistant</div>
        </div>
        <span
          className="assistant-header-badge"
          style={{
            backgroundColor: 'rgba(22, 163, 74, 0.2)',
            borderColor: 'rgba(22, 163, 74, 0.5)',
            color: '#4ADE80'
          }}
          title="Powered by Google Gemini 2.5 Flash + Global RAG Knowledge Base"
        >
          🟢 GEMINI 2.5 LIVE AI
        </span>
      </div>

      <div className="assistant-header-actions">
        <button
          className="assistant-header-btn"
          onClick={onReset}
          title="Clear & Reset Conversation"
          aria-label="Reset Conversation"
        >
          <RotateCcw size={14} />
        </button>
        <button
          className="assistant-header-btn"
          onClick={onClose}
          title="Minimize Assistant"
          aria-label="Close Assistant"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
