import React from 'react';
import { HelpCircle, ArrowRight } from 'lucide-react';

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  currentMachineId?: string | null;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  onSelect,
  currentMachineId
}) => {
  const suggestions = [
    currentMachineId
      ? `Why is ${currentMachineId} currently at risk?`
      : 'Which machines are currently at risk?',
    'How does VectorAI calculate RUL without ML?',
    'What does the Wire Bonder manual say about vibration?',
    'What is the purpose of the Prediction tab?',
    'How does the telemetry pipeline work?'
  ];

  return (
    <div className="assistant-suggestions">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '10.5px',
          fontFamily: 'var(--font-mono, monospace)',
          color: 'var(--text-muted, #64748B)',
          fontWeight: 700
        }}
      >
        <HelpCircle size={12} />
        <span>SUGGESTED QUESTIONS</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {suggestions.map((q, idx) => (
          <button
            key={idx}
            className="assistant-suggestion-pill"
            onClick={() => onSelect(q)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{q}</span>
              <ArrowRight size={12} style={{ opacity: 0.5 }} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
