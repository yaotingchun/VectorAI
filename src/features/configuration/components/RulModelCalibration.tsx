import React, { useState } from 'react';
import { RulCalibrationConfigData, CALIBRATION_PRESETS } from '../../../types/configuration';
import {
  Cpu,
  Sliders,
  Sparkles,
  TrendingDown,
  AlertTriangle,
  Layers,
  Activity,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

interface RulModelCalibrationProps {
  calibration: RulCalibrationConfigData;
  onChange: (updated: RulCalibrationConfigData) => void;
}

export const RulModelCalibration: React.FC<RulModelCalibrationProps> = ({
  calibration,
  onChange,
}) => {
  // Test probe simulator state
  const [probeDev, setProbeDev] = useState<number>(35);
  const [probeHours, setProbeHours] = useState<number>(240);
  const [probeRate, setProbeRate] = useState<number>(0.25);

  const { weights, criticalThresholdHours, warningThresholdHours, anomalySensitivity, healthScoreDecayFactor, activePresetId } = calibration;

  const updateWeights = (newWeights: Partial<typeof weights>) => {
    onChange({
      ...calibration,
      weights: { ...weights, ...newWeights },
      activePresetId: undefined, // custom
    });
  };

  const handleSelectPreset = (presetId: string) => {
    const preset = CALIBRATION_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    onChange({
      ...calibration,
      weights: { ...preset.weights },
      criticalThresholdHours: preset.criticalThresholdHours,
      warningThresholdHours: preset.warningThresholdHours,
      anomalySensitivity: preset.anomalySensitivity,
      activePresetId: preset.id,
    });
  };

  // Compute probe simulated RUL
  const simulatedRul = Math.max(
    0,
    Math.round(
      weights.intercept -
      weights.devWeight * probeDev -
      weights.rateWeight * probeRate -
      weights.timeWeight * probeHours
    )
  );

  // Determine status of probe RUL
  const probeStatus =
    simulatedRul <= criticalThresholdHours
      ? 'CRITICAL'
      : simulatedRul <= warningThresholdHours
      ? 'WARNING'
      : 'HEALTHY';

  // Compute curve points for SVG visualization
  const curvePoints: Array<{ hours: number; rul: number; x: number; y: number }> = [];
  const svgWidth = 540;
  const svgHeight = 180;
  const maxSimHours = 1200;
  const maxRulScale = Math.max(weights.intercept, 2500);

  for (let h = 0; h <= maxSimHours; h += 40) {
    // Model assuming standard 30% deviation
    const r = Math.max(
      0,
      weights.intercept -
      weights.devWeight * probeDev -
      weights.rateWeight * probeRate -
      weights.timeWeight * h
    );
    const x = (h / maxSimHours) * svgWidth;
    const y = svgHeight - (r / maxRulScale) * (svgHeight - 20) - 10;
    curvePoints.push({ hours: h, rul: Math.round(r), x, y });
  }

  const pathD = curvePoints.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // Critical & Warning horizontal guideline Y positions
  const criticalY = svgHeight - (criticalThresholdHours / maxRulScale) * (svgHeight - 20) - 10;
  const warningY = svgHeight - (warningThresholdHours / maxRulScale) * (svgHeight - 20) - 10;

  return (
    <div className="config-content-grid" role="region" aria-label="RUL Model Calibration Studio">
      {/* 1. Preset Selector Strip */}
      <div className="config-card">
        <div className="config-card-header">
          <div className="config-card-title">
            <Sparkles size={16} style={{ color: 'var(--accent-amber)' }} />
            <span>Industrial Calibration Presets (Semiconductor Packaging Fab)</span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            SELECT A PROFILE OR CUSTOMIZE HYPERPARAMETERS BELOW
          </span>
        </div>

        <div className="config-card-body">
          <div className="preset-card-grid">
            {CALIBRATION_PRESETS.map((preset) => {
              const isSelected = activePresetId === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`preset-card ${isSelected ? 'active' : ''}`}
                >
                  <div className="preset-card-title">
                    <span>{preset.name}</span>
                    <span
                      className="status-pill"
                      style={{
                        backgroundColor: isSelected ? 'var(--accent-amber)' : 'var(--bg-dark)',
                        color: 'var(--text-inverted)',
                        fontSize: '9px',
                      }}
                    >
                      {preset.badge}
                    </span>
                  </div>
                  <p className="preset-card-desc">{preset.description}</p>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    <span>θ₀: {preset.weights.intercept}h</span>
                    <span>•</span>
                    <span>θ_dev: {preset.weights.devWeight}</span>
                    <span>•</span>
                    <span>θ_rate: {preset.weights.rateWeight}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Mathematical Formula & Dynamic Degradation Curve */}
      <div className="config-grid-2col">
        {/* Formula Box & Sliders */}
        <div className="config-card">
          <div className="config-card-header">
            <div className="config-card-title">
              <Cpu size={14} style={{ color: 'var(--accent-blue)' }} />
              <span>Predictive RUL Degradation Equation</span>
            </div>
            <span className="status-pill" style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--text-inverted)' }}>
              θ MATRIX
            </span>
          </div>

          <div className="config-card-body">
            {/* Live Formula Display */}
            <div className="formula-display-box">
              <div style={{ fontSize: '10px', color: '#9CA3AF', letterSpacing: '0.06em' }}>
                LINEAR-DEGRADATION RESIDUAL MODEL FORMULA
              </div>
              <div className="formula-latex-text">
                RUL = {weights.intercept} - ({weights.devWeight} · Dev_max) - ({weights.rateWeight} · Rate_deg) - ({weights.timeWeight} · t_op)
              </div>
              <div className="formula-variable-legend">
                <div className="formula-legend-item">
                  <strong>θ₀ Intercept:</strong> Baseline {weights.intercept} hrs
                </div>
                <div className="formula-legend-item">
                  <strong>θ_dev:</strong> {weights.devWeight}x Deviation
                </div>
                <div className="formula-legend-item">
                  <strong>θ_rate:</strong> {weights.rateWeight}x Rate
                </div>
                <div className="formula-legend-item">
                  <strong>θ_time:</strong> {weights.timeWeight}x Hours
                </div>
              </div>
            </div>

            {/* Hyperparameter Sliders */}
            <div className="config-form-group">
              <div className="config-label-row">
                <label className="config-label">θ_intercept (Baseline Maximum RUL)</label>
                <span className="config-hint">500 to 4000 Hours</span>
              </div>
              <div className="range-slider-wrap">
                <input
                  type="range"
                  min={500}
                  max={4000}
                  step={50}
                  value={weights.intercept}
                  onChange={(e) => updateWeights({ intercept: parseInt(e.target.value) })}
                  className="config-slider"
                />
                <span className="slider-val-chip">{weights.intercept} h</span>
              </div>
            </div>

            <div className="config-form-group">
              <div className="config-label-row">
                <label className="config-label">θ_dev (Max Sensor Deviation Penalty)</label>
                <span className="config-hint">1.0 to 40.0</span>
              </div>
              <div className="range-slider-wrap">
                <input
                  type="range"
                  min={1.0}
                  max={40.0}
                  step={0.5}
                  value={weights.devWeight}
                  onChange={(e) => updateWeights({ devWeight: parseFloat(e.target.value) })}
                  className="config-slider"
                />
                <span className="slider-val-chip">{weights.devWeight.toFixed(1)}</span>
              </div>
            </div>

            <div className="config-form-group">
              <div className="config-label-row">
                <label className="config-label">θ_rate (Degradation Velocity Factor)</label>
                <span className="config-hint">50.0 to 1000.0</span>
              </div>
              <div className="range-slider-wrap">
                <input
                  type="range"
                  min={50}
                  max={1000}
                  step={10}
                  value={weights.rateWeight}
                  onChange={(e) => updateWeights({ rateWeight: parseFloat(e.target.value) })}
                  className="config-slider"
                />
                <span className="slider-val-chip">{weights.rateWeight.toFixed(0)}</span>
              </div>
            </div>

            <div className="config-form-group">
              <div className="config-label-row">
                <label className="config-label">θ_time (Operational Hours Aging Factor)</label>
                <span className="config-hint">0.1 to 3.0</span>
              </div>
              <div className="range-slider-wrap">
                <input
                  type="range"
                  min={0.1}
                  max={3.0}
                  step={0.05}
                  value={weights.timeWeight}
                  onChange={(e) => updateWeights({ timeWeight: parseFloat(e.target.value) })}
                  className="config-slider"
                />
                <span className="slider-val-chip">{weights.timeWeight.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live SVG Degradation Curve & Interactive Probe */}
        <div className="config-card">
          <div className="config-card-header">
            <div className="config-card-title">
              <TrendingDown size={14} style={{ color: 'var(--accent-red)' }} />
              <span>Simulated Degradation Curve &amp; Probe</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              LIVE PROJECTION
            </span>
          </div>

          <div className="config-card-body">
            {/* SVG Chart */}
            <div
              style={{
                backgroundColor: '#0E1012',
                border: '1.5px solid var(--border-strong)',
                padding: '12px',
                position: 'relative',
              }}
            >
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
                {/* Gridlines */}
                <line x1="0" y1={svgHeight - 10} x2={svgWidth} y2={svgHeight - 10} stroke="#374151" strokeWidth="1" />
                <line x1="0" y1="10" x2={svgWidth} y2="10" stroke="#1F2937" strokeWidth="1" strokeDasharray="4" />

                {/* Shaded Danger Zone (Critical Threshold) */}
                <rect
                  x="0"
                  y={criticalY}
                  width={svgWidth}
                  height={svgHeight - 10 - criticalY}
                  fill="rgba(220, 38, 38, 0.15)"
                />
                <line x1="0" y1={criticalY} x2={svgWidth} y2={criticalY} stroke="#DC2626" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x={svgWidth - 90} y={criticalY - 4} fill="#DC2626" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  CRITICAL: ≤{criticalThresholdHours}h
                </text>

                {/* Shaded Warning Zone */}
                <line x1="0" y1={warningY} x2={svgWidth} y2={warningY} stroke="#D97706" strokeWidth="1" strokeDasharray="3 3" />
                <text x={svgWidth - 90} y={warningY - 4} fill="#D97706" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  WARNING: ≤{warningThresholdHours}h
                </text>

                {/* The Degradation Curve Path */}
                <path d={pathD} fill="none" stroke="#38BDF8" strokeWidth="2.5" />

                {/* Current Probe Marker Dot */}
                {(() => {
                  const probeX = (probeHours / maxSimHours) * svgWidth;
                  const probeY = svgHeight - (simulatedRul / maxRulScale) * (svgHeight - 20) - 10;
                  return (
                    <g>
                      <circle cx={probeX} cy={probeY} r="5" fill={probeStatus === 'CRITICAL' ? '#DC2626' : probeStatus === 'WARNING' ? '#D97706' : '#10B981'} stroke="#FFFFFF" strokeWidth="1.5" />
                    </g>
                  );
                })()}
              </svg>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#9CA3AF', fontFamily: 'monospace', marginTop: '6px' }}>
                <span>0 operating hours</span>
                <span>600 hrs</span>
                <span>1200 operating hours</span>
              </div>
            </div>

            {/* Probe Controls Box */}
            <div style={{ backgroundColor: 'var(--bg-surface)', padding: '14px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="config-label">Interactive Telemetry Probe Test</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>COMPUTED RUL:</span>
                  <span
                    className="status-pill"
                    style={{
                      backgroundColor: probeStatus === 'CRITICAL' ? 'var(--accent-red)' : probeStatus === 'WARNING' ? '#D97706' : 'var(--accent-green)',
                      color: 'var(--text-inverted)',
                      fontSize: '12px',
                    }}
                  >
                    {simulatedRul} HOURS ({probeStatus})
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '4px' }}>
                    <span>Sensor Max Deviation:</span>
                    <strong>{probeDev}%</strong>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={probeDev}
                    onChange={(e) => setProbeDev(parseInt(e.target.value))}
                    className="config-slider"
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '4px' }}>
                    <span>Operating Hours:</span>
                    <strong>{probeHours} hrs</strong>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    step={20}
                    value={probeHours}
                    onChange={(e) => setProbeHours(parseInt(e.target.value))}
                    className="config-slider"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Threshold Horizons & Anomaly Sensitivity */}
      <div className="config-card">
        <div className="config-card-header">
          <div className="config-card-title">
            <AlertTriangle size={14} style={{ color: 'var(--accent-amber)' }} />
            <span>Factory Alarm Horizon Thresholds &amp; Anomaly Detection Sensitivity</span>
          </div>
        </div>

        <div className="config-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="config-form-group">
              <label className="config-label">Critical Alarm Threshold (Hours)</label>
              <input
                type="number"
                value={criticalThresholdHours}
                onChange={(e) => onChange({ ...calibration, criticalThresholdHours: parseInt(e.target.value) || 48 })}
                className="config-input"
              />
              <span className="config-hint">RUL ≤ {criticalThresholdHours}h immediately triggers critical alarm &amp; dispatch.</span>
            </div>

            <div className="config-form-group">
              <label className="config-label">Warning Alarm Threshold (Hours)</label>
              <input
                type="number"
                value={warningThresholdHours}
                onChange={(e) => onChange({ ...calibration, warningThresholdHours: parseInt(e.target.value) || 250 })}
                className="config-input"
              />
              <span className="config-hint">RUL ≤ {warningThresholdHours}h triggers auto-preventative scheduling.</span>
            </div>

            <div className="config-form-group">
              <label className="config-label">Anomaly Sensitivity Profile</label>
              <select
                value={anomalySensitivity}
                onChange={(e) => onChange({ ...calibration, anomalySensitivity: e.target.value as any })}
                className="config-select"
              >
                <option value="LOW">Low (Tolerate minor telemetry jitter)</option>
                <option value="BALANCED">Balanced (Standard Cleanroom Filter)</option>
                <option value="HIGH">High (Early micro-fault detection)</option>
                <option value="STRICT">Strict (Zero tolerance / Class 100)</option>
              </select>
            </div>

            <div className="config-form-group">
              <label className="config-label">Health Score Decay Factor</label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="1.5"
                value={healthScoreDecayFactor}
                onChange={(e) => onChange({ ...calibration, healthScoreDecayFactor: parseFloat(e.target.value) || 0.7 })}
                className="config-input"
              />
              <span className="config-hint">Multiplies deviation penalty during composite health score generation.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
