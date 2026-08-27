import React, { useEffect, useRef } from 'react';
import { Bot } from 'lucide-react';
import { AssistantMessage, AssistantToolActivity } from '../types/assistant';
import { ChatMessage } from './ChatMessage';
import { ToolActivity } from './ToolActivity';
import { SuggestedQuestions } from './SuggestedQuestions';

interface ChatMessageListProps {
  messages: AssistantMessage[];
  isLoading: boolean;
  currentActivity?: AssistantToolActivity;
  onSelectSuggestion: (question: string) => void;
  currentMachineId?: string | null;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isLoading,
  currentActivity,
  onSelectSuggestion,
  currentMachineId
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, currentActivity]);

  return (
    <div className="assistant-messages-viewport">
      {/* Welcome Greeting on empty conversation */}
      {messages.length === 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '16px',
            backgroundColor: 'var(--bg-surface, #FFFFFF)',
            border: '1px solid var(--border-light, #E2E8F0)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            borderRadius: '6px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                backgroundColor: 'rgba(2, 132, 199, 0.15)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-blue, #0284C7)'
              }}
            >
              <Bot size={16} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary, #0F172A)' }}>
                Hi! I'm VectorAI Assistant.
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary, #64748B)' }}>
                Your unified industrial AI copilot across the VectorAI platform.
              </div>
            </div>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-secondary, #334155)', margin: 0, lineHeight: 1.45 }}>
            I can help you analyze live machine telemetry, investigate anomaly root causes with the Machine Agent, explain deterministic RUL calculations, and search authoritative technical manuals.
          </p>

          <SuggestedQuestions
            onSelect={onSelectSuggestion}
            currentMachineId={currentMachineId}
          />
        </div>
      )}

      {/* Message Stream */}
      {messages.map(msg => (
        <ChatMessage key={msg.id} message={msg} />
      ))}

      {/* Tool Execution Status */}
      {isLoading && <ToolActivity activity={currentActivity} />}

      <div ref={bottomRef} />
    </div>
  );
};
