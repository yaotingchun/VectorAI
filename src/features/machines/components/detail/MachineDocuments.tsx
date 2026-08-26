import React from 'react';
import { MachineDocument } from '../../types/machine';
import { MachineTypeId } from '../../data/machineTypes';
import { 
  ExternalLink, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Download
} from 'lucide-react';
import { getMachineKnowledge } from '../../intelligence';

interface MachineDocumentsProps {
  documents?: MachineDocument[];
  machineId: string;
  machineType?: MachineTypeId;
}

export const MachineDocuments: React.FC<MachineDocumentsProps> = ({
  documents = [],
  machineId,
  machineType = 'wire_bonder'
}) => {
  const knowledge = getMachineKnowledge(machineType);
  const pdfFilename = `${knowledge.filename}-manual.pdf`;
  const pdfUrl = `/manuals/${pdfFilename}`;

  // Filter out any legacy placeholder mock documents (keep only authoritative PDF manuals)
  const realDocuments: MachineDocument[] = documents.filter(d => 
    d.id.startsWith('DOC-VAI-MAN') || 
    d.title.includes('Technical Manual')
  );

  // If no document in machine array, use authoritative knowledge manual
  const displayDocs: MachineDocument[] = realDocuments.length > 0 ? realDocuments : [
    {
      id: `DOC-${knowledge.machine.manualId}`,
      title: `${knowledge.machine.name} Technical Manual (PDF)`,
      type: 'PDF',
      category: 'Manual',
      updatedAt: knowledge.machine.generatedDate || '2026-08-26',
      size: '36 KB',
      tags: ['Manual', 'Technical_Specification', 'Synthetic_Prototype']
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* 1. Knowledge Extraction Status Banner */}
      <div className="tech-card" style={{ borderColor: 'var(--accent-green)' }}>
        <div className="tech-card-header" style={{ backgroundColor: 'rgba(22, 163, 74, 0.08)' }}>
          <span className="tech-card-title" style={{ color: 'var(--accent-green)' }}>
            <ShieldCheck size={15} /> MACHINE DOMAIN KNOWLEDGE EXTRACTION STATUS
          </span>
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              padding: '2px 8px',
              backgroundColor: 'var(--accent-green)',
              color: '#FFFFFF',
              fontWeight: 800
            }}
          >
            INITIALIZED & SYNCHRONIZED
          </span>
        </div>

        <div className="tech-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', lineHeight: 1.4 }}>
            The technical manual below serves as the <strong>authoritative model specification</strong> for all <strong>{knowledge.machine.name}</strong> units across the factory floor (including <code>{machineId}</code>).
            All operational thresholds, degradation indicators, failure scenarios, and RUL formulas apply universally to machines of this model type.
          </p>

          {/* Status Indicators Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <CheckCircle2 size={14} color="var(--accent-green)" />
              <span><strong>Sensor Thresholds:</strong> {knowledge.thresholds.length} extracted</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <CheckCircle2 size={14} color="var(--accent-green)" />
              <span><strong>RUL Parameters:</strong> {knowledge.rulModel.parameters.length} active (Σ w = 1.0)</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <CheckCircle2 size={14} color="var(--accent-green)" />
              <span><strong>Failure Scenarios:</strong> {knowledge.failureScenarios.length} parsed</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <CheckCircle2 size={14} color="var(--accent-green)" />
              <span><strong>RAG Vector Store:</strong> Scoped & Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Document Repository List */}
      <div className="tech-card">
        <div className="tech-card-header">
          <span className="tech-card-title">
            <BookOpen size={14} /> AUTHORITATIVE TECHNICAL DOCUMENTATION REPOSITORY
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
            {displayDocs.length} REGISTERED MANUAL{displayDocs.length > 1 ? 'S' : ''}
          </span>
        </div>

        <div className="tech-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {displayDocs.map((docItem) => (
            <div
              key={docItem.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1.5px solid var(--border-strong)',
                padding: '14px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              {/* Left: Icon & Metadata */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: '1 1 300px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: 'var(--bg-dark)',
                    color: 'var(--text-inverted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <FileText size={18} />
                </div>

                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: 'var(--text-primary)'
                    }}
                  >
                    {knowledge.machine.name} Technical Manual (PDF)
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)',
                      marginTop: '3px'
                    }}
                  >
                    <span>Manual ID: <strong>{knowledge.machine.manualId}</strong></span>
                    <span>•</span>
                    <span>Version: <strong>v{knowledge.machine.version}</strong></span>
                    <span>•</span>
                    <span>Date: <strong>{knowledge.machine.generatedDate}</strong></span>
                    <span>•</span>
                    <span>Size: <strong>36 KB</strong></span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                    <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', padding: '1px 6px', backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #93C5FD' }}>
                      #Synthetic_Prototype
                    </span>
                    <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', padding: '1px 6px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
                      #Thresholds
                    </span>
                    <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', padding: '1px 6px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
                      #RUL_Model
                    </span>
                    <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', padding: '1px 6px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
                      #Diagnostics
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tech-btn"
                  style={{ fontSize: '11px', padding: '6px 14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                  title="Open and view PDF manual in browser"
                >
                  <ExternalLink size={13} />
                  <span>VIEW PDF MANUAL</span>
                </a>

                <a
                  href={pdfUrl}
                  download={pdfFilename}
                  className="tech-btn"
                  style={{ fontSize: '11px', padding: '6px 14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                  title="Download manual file"
                >
                  <Download size={13} />
                  <span>DOWNLOAD</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
