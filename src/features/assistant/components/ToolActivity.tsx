import React from 'react';
import { Loader2 } from 'lucide-react';
import { AssistantToolActivity } from '../types/assistant';

interface ToolActivityProps {
  activity?: AssistantToolActivity;
}

export const ToolActivity: React.FC<ToolActivityProps> = ({ activity }) => {
  if (!activity) return null;

  return (
    <div className="assistant-activity-banner">
      <Loader2 size={13} className="animate-spin" />
      <span>{activity.description || 'Orchestrating VectorAI tools & knowledge...'}</span>
    </div>
  );
};
