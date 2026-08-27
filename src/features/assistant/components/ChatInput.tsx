import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  placeholder = 'Ask about telemetry, anomalies, RUL, or manuals...'
}) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
  };

  return (
    <div className="assistant-input-area">
      <div className="assistant-input-box">
        <textarea
          ref={textareaRef}
          className="assistant-textarea"
          rows={1}
          placeholder={placeholder}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />

        <button
          className="assistant-send-btn"
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          title="Send message (Enter)"
          aria-label="Send Message"
        >
          <Send size={14} />
        </button>
      </div>

      <div className="assistant-input-hint">
        <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for newline</span>
        <span>READ-ONLY COPILOT</span>
      </div>
    </div>
  );
};
