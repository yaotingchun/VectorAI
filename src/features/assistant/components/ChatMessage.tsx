import React from 'react';
import { FileText, ExternalLink, Download } from 'lucide-react';
import { AssistantMessage } from '../types/assistant';
import { SourceCitation } from './SourceCitation';

interface ChatMessageProps {
  message: AssistantMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Helper to parse inline markdown (bold, italic, code)
  const renderInlineContent = (text: string): React.ReactNode => {
    // Tokenize bold (**...**), code (`...`), italic (*...*)
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const matchStart = match.index;
      const matchStr = match[0];

      if (matchStart > lastIndex) {
        parts.push(text.substring(lastIndex, matchStart));
      }

      if (matchStr.startsWith('**') && matchStr.endsWith('**')) {
        parts.push(
          <strong key={matchStart} style={{ fontWeight: 700, color: isUser ? '#FFFFFF' : 'var(--text-primary, #0F172A)' }}>
            {matchStr.slice(2, -2)}
          </strong>
        );
      } else if (matchStr.startsWith('`') && matchStr.endsWith('`')) {
        parts.push(
              <code
            key={matchStart}
            style={{
              padding: '1px 5px',
              backgroundColor: 'rgba(2, 132, 199, 0.08)',
              color: 'var(--accent-blue, #0284C7)',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '11px',
              borderRadius: '3px'
            }}
          >
            {matchStr.slice(1, -1)}
          </code>
        );
      } else if (matchStr.startsWith('*') && matchStr.endsWith('*')) {
        parts.push(<em key={matchStart}>{matchStr.slice(1, -1)}</em>);
      }

      lastIndex = matchStart + matchStr.length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Full block formatting helper
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      const trimmed = line.trim();

      // Horizontal rule
      if (trimmed === '---' || trimmed === '***') {
        return (
          <hr
            key={lineIdx}
            style={{
              border: 'none',
              borderTop: '1px solid var(--border-light, #E2E8F0)',
              margin: '10px 0'
            }}
          />
        );
      }

      // Header 1 / 2
      if (trimmed.startsWith('# ') || trimmed.startsWith('## ')) {
        const title = trimmed.replace(/^#+\s+/, '');
        return (
          <h3
            key={lineIdx}
            style={{
              margin: '10px 0 4px 0',
              fontSize: '13.5px',
              fontWeight: 800,
              color: 'var(--accent-blue, #0284C7)',
              fontFamily: 'var(--font-display, inherit)',
              letterSpacing: '0.02em'
            }}
          >
            {renderInlineContent(title)}
          </h3>
        );
      }

      // Header 3
      if (trimmed.startsWith('### ')) {
        const title = trimmed.replace('### ', '');
        return (
          <h4
            key={lineIdx}
            style={{
              margin: '8px 0 3px 0',
              fontSize: '12.5px',
              fontWeight: 700,
              color: 'var(--text-primary, #0F172A)'
            }}
          >
            {renderInlineContent(title)}
          </h4>
        );
      }

      // Header 4
      if (trimmed.startsWith('#### ')) {
        const title = trimmed.replace('#### ', '');
        return (
          <h5
            key={lineIdx}
            style={{
              margin: '6px 0 2px 0',
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--text-primary, #0F172A)'
            }}
          >
            {renderInlineContent(title)}
          </h5>
        );
      }

      // Bullet points (* , - , + , • )
      const bulletMatch = trimmed.match(/^([*•\-+])\s+(.*)/);
      if (bulletMatch) {
        const bulletBody = bulletMatch[2];
        return (
          <div
            key={lineIdx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '6px',
              margin: '3px 0',
              paddingLeft: '4px',
              fontSize: '12.5px',
              lineHeight: 1.45
            }}
          >
            <span
              style={{
                color: 'var(--accent-blue, #0284C7)',
                fontSize: '12px',
                lineHeight: '18px'
              }}
            >
              •
            </span>
            <div style={{ flex: 1 }}>{renderInlineContent(bulletBody)}</div>
          </div>
        );
      }

      // Empty line
      if (!trimmed) {
        return <div key={lineIdx} style={{ height: '6px' }} />;
      }

      // Regular Paragraph
      return (
        <p key={lineIdx} style={{ margin: '4px 0', fontSize: '12.5px', lineHeight: 1.45 }}>
          {renderInlineContent(line)}
        </p>
      );
    });
  };

  return (
    <div className={`assistant-msg ${isUser ? 'user' : 'assistant'}`}>
      <div className="assistant-msg-bubble">
        {/* Live Data Badges if available */}
        {message.liveData && message.liveData.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4px',
              marginBottom: '8px',
              paddingBottom: '6px',
              borderBottom: '1px solid var(--border-light, #E2E8F0)'
            }}
          >
            <span
              style={{
                fontSize: '9px',
                fontFamily: 'var(--font-mono, monospace)',
                backgroundColor: 'rgba(2, 132, 199, 0.12)',
                color: 'var(--accent-blue, #0284C7)',
                padding: '2px 6px',
                fontWeight: 700
              }}
            >
              LIVE TELEMETRY
            </span>
            {message.liveData.slice(0, 4).map((b, i) => (
              <span
                key={i}
                style={{
                  fontSize: '9.5px',
                  fontFamily: 'var(--font-mono, monospace)',
                  backgroundColor: 'var(--bg-primary, #F1F5F9)',
                  padding: '2px 6px',
                  border: '1px solid var(--border-light, #CBD5E1)',
                  color: 'var(--text-secondary, #334155)'
                }}
              >
                <strong>{b.metric}:</strong> {b.value}
              </span>
            ))}
          </div>
        )}

        {/* Formatted Content */}
        <div style={{ wordBreak: 'break-word' }}>{renderFormattedText(message.content)}</div>

        {/* PDF Attachments if available */}
        {message.attachments && message.attachments.length > 0 && (
          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {message.attachments.map((att, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  padding: '9px 12px',
                  backgroundColor: '#0A1220',
                  border: '1px solid rgba(2, 132, 199, 0.4)',
                  borderRadius: '4px',
                  color: '#FFFFFF'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#EF4444',
                      flexShrink: 0
                    }}
                  >
                    <FileText size={16} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 700,
                        color: '#F8FAFC',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {att.title}
                    </div>
                    <div style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'var(--font-mono, monospace)' }}>
                      {att.id} • {att.size}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <a
                    href={att.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '5px 10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: 'var(--accent-blue, #0284C7)',
                      color: '#FFFFFF',
                      textDecoration: 'none',
                      borderRadius: '3px'
                    }}
                    title="Open PDF in new tab"
                  >
                    <ExternalLink size={12} />
                    <span>View PDF</span>
                  </a>
                  <a
                    href={att.pdfUrl}
                    download={att.filename}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '5px 8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      textDecoration: 'none',
                      borderRadius: '3px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                    title="Download PDF"
                  >
                    <Download size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Source Citations */}
        {message.sources && message.sources.length > 0 && (
          <SourceCitation sources={message.sources} />
        )}
      </div>

      <div className="assistant-msg-meta">
        <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        {message.dataSources && message.dataSources.length > 0 && (
          <span>• {message.dataSources.join(' // ')}</span>
        )}
      </div>
    </div>
  );
};
