import React from 'react';
import { AnomalyEvent, Machine } from '../../types/machine';
import { MachineTypeId } from '../../data/machineTypes';
import { 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  Sparkles, 
  BookOpen, 
  AlertTriangle, 
  AlertOctagon, 
  Wrench 
} from 'lucide-react';
import { 
  diagnoseFromManual, 
  diagnoseFromRag, 
  DiagnosticResult, 
  AnomalyRecord 
} from '../../intelligence';

interface AnomalySummaryProps {
  anomalies: AnomalyEvent[];
  machine?: Machine;
}

export const AnomalySummary: React.FC<AnomalySummaryProps> = ({
  anomalies,
  machine
}) => {
  const machineType = (machine?.machineType || 'wire_bonder') as MachineTypeId;

  if (anomalies.length === 0) {
    return (
      <div className="tech-card">
        <div className="tech-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="tech-card-title">
            <CheckCircle2 size={15} color="var(--accent-green)" /> ACTIVE SENSOR ANOMALIES & AUTOMATIC AI DIAGNOSTICS
          </span>
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              backgroundColor: 'var(--accent-green)',
              color: '#FFFFFF',
              padding: '2px 8px',
              fontWeight: 800
            }}
          >
            0 ACTIVE INCIDENTS
          </span>
        </div>
        <div className="tech-card-body" style={{ textAlign: 'center', padding: '36px 20px' }}>
          <div style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 800 }}>
            ALL TELEMETRY STREAMS OPERATING WITHIN SPECIFIED LIMITS
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>
            Deterministic threshold engine confirms all continuous edge telemetry values are strictly within normal operating bounds.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* ─── SECTION HEADER BAR ─── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          borderBottom: '1.5px solid var(--border-strong)',
          paddingBottom: '8px'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '14px',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ShieldAlert size={16} color="var(--accent-amber)" /> ACTIVE SENSOR ANOMALIES & AUTOMATIC AI DIAGNOSTICS
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
          {anomalies.length} ACTIVE INCIDENT{anomalies.length > 1 ? 'S' : ''}
        </span>
      </div>

      {/* ─── INDIVIDUAL INCIDENT CARDS ─── */}
      {anomalies.map((anomaly) => {
        const isCritical = anomaly.severity === 'critical';
        const severityColor = isCritical ? 'var(--accent-red)' : 'var(--accent-amber)';

        const matchedSensor = machine?.sensors.find(s => 
          s.name.toLowerCase() === (anomaly.sensor || '').toLowerCase() || 
          s.sensorId?.toLowerCase() === (anomaly.sensor || '').toLowerCase() ||
          s.name.toLowerCase().includes((anomaly.sensor || '').toLowerCase()) ||
          (anomaly.sensor || '').toLowerCase().includes(s.name.toLowerCase())
        );

        // Convert to AnomalyRecord to run diagnostic engine automatically
        const anomalyRecord: AnomalyRecord = {
          id: anomaly.id,
          machineId: machine?.id || 'UNKNOWN',
          sensorId: matchedSensor?.sensorId || anomaly.sensor || 'sensor',
          sensorName: matchedSensor?.name || anomaly.sensor || 'Sensor',
          currentValue: matchedSensor?.value || 0,
          unit: matchedSensor?.unit || '',
          thresholdValue: 0,
          thresholdType: isCritical ? 'CRITICAL_HIGH' : 'WARNING_HIGH',
          severity: anomaly.severity,
          status: anomaly.status,
          detectedAt: anomaly.timestamp,
          description: anomaly.description
        };

        // Automatic Two-Layer Diagnosis: Layer 1 (Manual-First) -> Layer 2 (Semantic RAG)
        const manualDiag = diagnoseFromManual(anomalyRecord, machineType);
        const ragDiag = !manualDiag ? diagnoseFromRag(anomalyRecord, machineType) : null;
        const diagnosis: DiagnosticResult = manualDiag || ragDiag!;
        const isManualSource = diagnosis.source === 'MANUAL';

        return (
          <div className="tech-card" key={anomaly.id} style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="corner-tl">+</span>
            <span className="corner-tr">+</span>

            {/* ─── SECTION 1: ANOMALY TELEMETRY TRIGGER ─── */}
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isCritical ? <AlertOctagon size={15} color={severityColor} /> : <AlertTriangle size={15} color={severityColor} />}
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '13px',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      letterSpacing: '0.03em'
                    }}
                  >
                    {anomaly.type.toUpperCase()}
                  </span>
                  <span
                    style={{
                      fontSize: '9px',
                      fontFamily: 'var(--font-mono)',
                      padding: '2px 6px',
                      backgroundColor: severityColor,
                      color: '#FFFFFF',
                      fontWeight: 800,
                      letterSpacing: '0.05em'
                    }}
                  >
                    {anomaly.severity.toUpperCase()}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> Detected: {anomaly.timestamp}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', lineHeight: 1.45 }}>
                {anomaly.description}
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '2px' }}>
                <span>Sensor: <strong style={{ color: 'var(--text-primary)' }}>{anomalyRecord.sensorName}</strong></span>
                {anomalyRecord.currentValue > 0 && (
                  <span>· Current: <strong style={{ color: severityColor }}>{anomalyRecord.currentValue} {anomalyRecord.unit}</strong></span>
                )}
              </div>
            </div>

            {/* ─── SPACED INSET MIDDLE DIVIDER LINE ─── */}
            <div style={{ padding: '4px 20px' }}>
              <div style={{ borderBottom: '1px solid var(--border-strong)' }} />
            </div>

            {/* ─── SECTION 2: AI DIAGNOSTIC REASONING ─── */}
            <div style={{ padding: '18px 20px 22px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={15} color="var(--accent-blue)" />
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '13px',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      letterSpacing: '0.03em'
                    }}
                  >
                    AI DIAGNOSTIC REASONING
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {/* Layer / Source Badge */}
                  <span
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      padding: '2px 8px',
                      border: isManualSource ? '1px solid #2563EB' : '1px solid #9333EA',
                      backgroundColor: isManualSource ? '#EFF6FF' : '#FAF5FF',
                      color: isManualSource ? '#1D4ED8' : '#7E22CE',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <BookOpen size={10} />
                    {isManualSource ? 'LAYER 1: MANUAL-FIRST GROUNDING' : 'LAYER 2: SEMANTIC RAG RETRIEVAL'}
                  </span>

                  {/* Confidence */}
                  <span
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    Confidence: <strong style={{ color: 'var(--text-primary)' }}>{diagnosis.confidence.toLowerCase()} ({Math.round(diagnosis.confidenceScore * 100)}%)</strong>
                  </span>
                </div>
              </div>

              {/* Condition Diagnosis */}
              <div
                style={{
                  fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  lineHeight: 1.35
                }}
              >
                {diagnosis.diagnosis}
              </div>

              {/* RAG Disclaimer if Layer 2 */}
              {diagnosis.disclaimer && (
                <div
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: '#9333EA',
                    backgroundColor: '#FAF5FF',
                    border: '1px dashed #C084FC',
                    padding: '8px 12px'
                  }}
                >
                  ⚠ {diagnosis.disclaimer}
                </div>
              )}

              {/* Evidence Bullets */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '12px', fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)' }}>
                {diagnosis.evidence.map((ev, i) => (
                  <div key={i} style={{ paddingLeft: '8px', lineHeight: 1.45 }}>
                    • {ev}
                  </div>
                ))}
              </div>

              {/* Documented Causes Pills */}
              {diagnosis.possibleCauses.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '2px' }}>
                  {diagnosis.possibleCauses.map((cause, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '3px 10px',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-strong)',
                        fontSize: '11px',
                        fontFamily: 'var(--font-sans)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {cause}
                    </span>
                  ))}
                </div>
              )}

              {/* Recommended Action */}
              {diagnosis.recommendedActions.length > 0 && (
                <div
                  style={{
                    marginTop: '4px',
                    paddingLeft: '12px',
                    borderLeft: '2.5px solid var(--accent-blue)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700, fontSize: '11px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '0.03em' }}>
                    <Wrench size={12} color="var(--accent-blue)" />
                    <span>RECOMMENDED ACTION:</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px', fontFamily: 'var(--font-sans)', lineHeight: 1.45 }}>
                    {diagnosis.recommendedActions[0]}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
