import React from 'react';
import { MachineDocument } from '../../types/machine';
import { ExternalLink, BookOpen, FileText } from 'lucide-react';

interface MachineDocumentsProps {
  documents: MachineDocument[];
  machineId: string;
  onViewDocument?: (documentId: string) => void;
}

export const MachineDocuments: React.FC<MachineDocumentsProps> = ({
  documents,
  machineId: _machineId,
  onViewDocument
}) => {
  if (documents.length === 0) {
    return (
      <div className="tech-card">
        <div className="tech-card-header">
          <span className="tech-card-title">
            <BookOpen size={14} /> TECHNICAL DOCUMENTATION REPOSITORY
          </span>
        </div>
        <div className="tech-card-body" style={{ textAlign: 'center', padding: '24px' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            No specialized documentation uploaded for this machine node. Generic standard operating manual applies.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tech-card">
      <div className="tech-card-header">
        <span className="tech-card-title">
          <BookOpen size={14} /> TECHNICAL DOCUMENTATION REPOSITORY
        </span>
        <span
          style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            backgroundColor: 'var(--bg-dark)',
            color: 'var(--text-inverted)',
            padding: '2px 8px',
            fontWeight: 700
          }}
        >
          {documents.length} ATTACHED DOCUMENTS
        </span>
      </div>

      <div className="tech-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {documents.map((doc) => (
          <div
            key={doc.id}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              padding: '12px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}
          >
            {/* Doc Info */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: '1 1 260px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'var(--bg-dark)',
                  color: 'var(--text-inverted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <FileText size={15} />
              </div>

              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--text-primary)'
                  }}
                >
                  {doc.title}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                    marginTop: '3px'
                  }}
                >
                  <span>Category: {doc.category}</span>
                  <span>•</span>
                  <span>Size: {doc.size}</span>
                  <span>•</span>
                  <span>Updated: {doc.updatedAt}</span>
                </div>

                {/* Tags */}
                {doc.tags && doc.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                    {doc.tags.map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '9px',
                          fontFamily: 'var(--font-mono)',
                          padding: '1px 5px',
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--border-light)'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => {
                  if (onViewDocument) {
                    onViewDocument(doc.id);
                  } else {
                    alert(`[Document Viewer] Opening ${doc.title} (${doc.url})`);
                  }
                }}
                className="tech-btn"
                style={{ fontSize: '11px', padding: '6px 12px' }}
                title="View document"
              >
                <ExternalLink size={12} />
                <span>VIEW MANUAL</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
