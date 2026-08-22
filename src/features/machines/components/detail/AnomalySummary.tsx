import React from 'react';
import { AnomalyEvent } from '../../types/machine';
import { CheckCircle2, ShieldAlert, Clock, Sparkles } from 'lucide-react';

interface AnomalySummaryProps {
  anomalies: AnomalyEvent[];
  onAcknowledge?: (anomalyId: string) => void;
}

export const AnomalySummary: React.FC<AnomalySummaryProps> = ({
  anomalies,
  onAcknowledge
}) => {
  if (anomalies.length === 0) {
    return (
      <div className="tech-card">
        <div className="tech-card-header">
          <span className="tech-card-title">
            <CheckCircle2 size={14} color="var(--accent-green)" /> ANOMALY & DRIFT MONITORING
          </span>
          <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', fontWeight: 700 }}>
            0 ACTIVE ANOMALIES
          </span>
        </div>
        <div className="tech-card-body" style={{ textAlign: 'center', padding: '28px' }}>
          <div style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700 }}>
            NO ABNORMAL BEHAVIOR DETECTED
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
            Neural autoencoder and changepoint detection models report all sensor streams operating within 3σ tolerance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tech-card">
      <div className="tech-card-header">
        <span className="tech-card-title">
          <ShieldAlert size={14} /> ANOMALY DETECTION LOG & CLASSIFICATION
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
          {anomalies.length} RECORDED EVENTS
        </span>
      </div>

      <div className="tech-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {anomalies.map((anomaly) => {
          let severityColor = 'var(--accent-amber)';
          let severityBg = 'rgba(217, 119, 6, 0.1)';

          if (anomaly.severity === 'critical' || anomaly.severity === 'high') {
            severityColor = 'var(--accent-red)';
            severityBg = 'rgba(220, 38, 38, 0.12)';
          } else if (anomaly.severity === 'low') {
            severityColor = 'var(--text-muted)';
            severityBg = 'rgba(142, 147, 155, 0.1)';
          }

          return (
            <div
              key={anomaly.id}
              style={{
                border: `1.5px solid ${severityColor}`,
                backgroundColor: 'var(--bg-surface)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {/* Event Header */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'var(--text-primary)'
                    }}
                  >
                    {anomaly.type}
                  </span>

                  <span
                    style={{
                      fontSize: '9px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      backgroundColor: severityBg,
                      color: severityColor,
                      border: `1px solid ${severityColor}`,
                      padding: '1px 6px',
                      textTransform: 'uppercase'
                    }}
                  >
                    SEVERITY: {anomaly.severity}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Clock size={11} />
                  <span>{anomaly.timestamp}</span>
                </div>
              </div>

              {/* Description */}
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  lineHeight: 1.4
                }}
              >
                {anomaly.description}
              </div>

              {/* Sensor & Confidence Footer */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  paddingTop: '6px',
                  borderTop: '1px dashed var(--border-light)',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>
                  AFFECTED SENSOR: <strong>{anomaly.sensor}</strong>
                </span>

                <span style={{ color: 'var(--text-secondary)' }}>
                  DETECTION CONFIDENCE: <strong>{Math.round(anomaly.confidence * 100)}%</strong>
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: anomaly.status === 'active' ? 'var(--accent-red)' : 'var(--text-muted)'
                    }}
                  >
                    STATUS: {anomaly.status}
                  </span>
                  {anomaly.status === 'active' && onAcknowledge && (
                    <button
                      onClick={() => onAcknowledge(anomaly.id)}
                      className="tech-btn"
                      style={{ padding: '2px 6px', fontSize: '9px' }}
                    >
                      ACKNOWLEDGE
                    </button>
                  )}
                </div>
              </div>

              {/* Recommended Action */}
              {anomaly.recommendedAction && (
                <div
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-strong)',
                    padding: '6px 10px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '6px'
                  }}
                >
                  <Sparkles size={13} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    <strong>AI Recommendation:</strong> {anomaly.recommendedAction}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
