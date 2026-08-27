import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { AssistantSourceCitation } from '../types/assistant';

interface SourceCitationProps {
  sources: AssistantSourceCitation[];
}

export const SourceCitation: React.FC<SourceCitationProps> = ({ sources }) => {
  const [expanded, setExpanded] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="assistant-sources-container">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          padding: '4px 0',
          fontSize: '10.5px',
          fontFamily: 'var(--font-mono, monospace)',
          color: 'var(--accent-blue, #0284C7)',
          fontWeight: 700
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <BookOpen size={12} />
          <span>AUTHORITATIVE SOURCES ({sources.length})</span>
        </div>
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </div>

      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '2px' }}>
          {sources.map((s, idx) => (
            <div key={s.id || idx} className="assistant-source-card">
              <div className="assistant-source-header">
                <span>{s.sourceName}</span>
                {s.similarityScore !== undefined && (
                  <span style={{ fontSize: '9px', opacity: 0.8 }}>
                    {Math.round(s.similarityScore * 100)}% MATCH
                  </span>
                )}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted, #64748B)', fontWeight: 600 }}>
                {s.section} — {s.title}
              </div>
              <div className="assistant-source-snippet">
                {s.contentSnippet.length > 180 ? `${s.contentSnippet.slice(0, 180)}...` : s.contentSnippet}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
