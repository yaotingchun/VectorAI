import React, { useState, useEffect } from 'react';
import {
  FloorMachineAsset,
  RegisteredSensorKit,
} from '../../../types/floorPlan';
import { PRE_PROVISIONED_SENSOR_KITS } from '../../../data/floorPlanData';
import {
  Wifi,
  Radio,
  CheckCircle2,
  X,
  Activity,
  Zap,
  Thermometer,
  ArrowRight,
  Fingerprint,
} from 'lucide-react';
import '../../../styles/floorplan.css';

interface SensorKitProvisioningModalProps {
  isOpen: boolean;
  machine: FloorMachineAsset | null;
  onClose: () => void;
  onBindKit: (machineId: string, kit: RegisteredSensorKit) => void;
}

type ProvisionStep = 'scan' | 'verify' | 'confirmed';

export const SensorKitProvisioningModal: React.FC<SensorKitProvisioningModalProps> = ({
  isOpen,
  machine,
  onClose,
  onBindKit,
}) => {
  const [step, setStep] = useState<ProvisionStep>('scan');
  const [selectedKit, setSelectedKit] = useState<RegisteredSensorKit | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualSerial, setManualSerial] = useState('');
  const [handshakeStep, setHandshakeStep] = useState(0);
  const [waveOffset, setWaveOffset] = useState(0);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('scan');
      setSelectedKit(null);
      setIsScanning(false);
      setHandshakeStep(0);
    }
  }, [isOpen, machine]);

  // Live waveform animation loop when verifying
  useEffect(() => {
    if (step !== 'verify') return;
    const interval = setInterval(() => {
      setWaveOffset((prev) => (prev + 1) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [step]);

  // Handshake sequence progression
  useEffect(() => {
    if (step === 'verify') {
      setHandshakeStep(1);
      const t1 = setTimeout(() => setHandshakeStep(2), 600);
      const t2 = setTimeout(() => setHandshakeStep(3), 1300);
      const t3 = setTimeout(() => setHandshakeStep(4), 2000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [step]);

  if (!isOpen || !machine) return null;

  // Handle Scanning a Pre-Provisioned Kit
  const handleSelectPreProvisionedKit = (kit: RegisteredSensorKit) => {
    setIsScanning(true);

    const done = setTimeout(() => {
      setSelectedKit(kit);
      setIsScanning(false);
      setStep('verify');
    }, 600);

    return () => {
      clearTimeout(done);
    };
  };

  // Handle Custom Serial Entry
  const handleScanManualSerial = () => {
    if (!manualSerial.trim()) return;

    // Look for matching kit or create dynamic kit payload
    const found = PRE_PROVISIONED_SENSOR_KITS.find(
      (k) =>
        k.nfcTagSerial.toLowerCase() === manualSerial.toLowerCase() ||
        k.kitId.toLowerCase() === manualSerial.toLowerCase()
    );

    const kitToUse: RegisteredSensorKit = found || {
      kitId: `KIT-${manualSerial.toUpperCase().slice(0, 8)}`,
      nfcTagSerial: manualSerial.toUpperCase(),
      kitModel: 'Vector Custom Dynamic Sensor Kit',
      description: 'Custom field-provisioned edge IoT telemetry kit.',
      provisionDate: new Date().toISOString().split('T')[0],
      signalStrength: 97,
      firmwareVersion: 'v2.4.1',
      telemetryProtocol: 'OPC-UA',
      sensors: [
        {
          id: `SEN-VIB-01`,
          name: 'Primary Spindle Accelerometer',
          type: 'vibration',
          samplingRate: '20 kHz',
          range: '±50g',
          status: 'active',
          currentValue: 1.15,
          unit: 'mm/s',
        },
        {
          id: `SEN-TMP-01`,
          name: 'Core Surface Temperature RTD',
          type: 'temperature',
          samplingRate: '1 Hz',
          range: '-40°C to +150°C',
          status: 'active',
          currentValue: 41.2,
          unit: '°C',
        },
      ],
    };

    handleSelectPreProvisionedKit(kitToUse);
  };

  // Final Binding Confirmation
  const handleConfirmBinding = () => {
    if (selectedKit) {
      onBindKit(machine.id, selectedKit);
      onClose();
    }
  };

  return (
    <div className="nfc-modal-overlay" role="dialog" aria-modal="true">
      <div className="nfc-modal-container">
        {/* Top Modal Header */}
        <div className="nfc-modal-header">
          <div className="nfc-header-title-group">
            <Radio size={16} className="nfc-header-icon" />
            <span className="nfc-header-title">SENSOR REGISTRY // NFC KIT SETUP</span>
            <span className="nfc-header-target-badge">
              [ TARGET: {machine.id} ({machine.name}) ]
            </span>
          </div>

          <button onClick={onClose} className="nfc-modal-close-btn" title="Close Setup">
            <X size={15} />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="nfc-step-progress-bar">
          <div className={`nfc-step-pill ${step === 'scan' ? 'active' : 'completed'}`}>
            <span className="step-num">01</span>
            <span className="step-label">SCAN NFC TAG</span>
          </div>
          <div className="nfc-step-connector" />
          <div className={`nfc-step-pill ${step === 'verify' ? 'active' : step === 'confirmed' ? 'completed' : ''}`}>
            <span className="step-num">02</span>
            <span className="step-label">LIVE SIGNAL VERIFY</span>
          </div>
          <div className="nfc-step-connector" />
          <div className={`nfc-step-pill ${step === 'confirmed' ? 'active' : ''}`}>
            <span className="step-num">03</span>
            <span className="step-label">BIND & STREAM</span>
          </div>
        </div>

        {/* =========================================================================
            STEP 1: NFC RADAR SCAN & PRE-PROVISIONED KIT SELECTION
            ========================================================================= */}
        {step === 'scan' && (
          <div className="nfc-step-body">
            {/* Top Scanning Radar Hero */}
            <div className="nfc-scanner-hero-box">
              <div className={`nfc-radar-pulse ${isScanning ? 'scanning' : ''}`}>
                <Fingerprint size={36} className="nfc-fingerprint-icon" />
                <div className="radar-wave wave-1" />
                <div className="radar-wave wave-2" />
                <div className="radar-wave wave-3" />
              </div>

              <div className="nfc-hero-text">
                <div className="nfc-hero-title">
                  {isScanning ? 'READING NFC TAG PAYLOAD...' : 'READY FOR NFC SENSOR KIT SCAN'}
                </div>
                <p className="nfc-hero-desc">
                  Hold the pre-provisioned physical Sensor Kit NFC tag against the reader, or select one of the provisioned cleanroom kits below:
                </p>
              </div>
            </div>

            {/* Quick-Tap Pre-provisioned Sensor Kits */}
            <div className="nfc-kits-catalog-section">
              <div className="nfc-section-title">// PRE-PROVISIONED CLEANROOM SENSOR KITS (READY TO PAIR)</div>

              <div className="nfc-kits-cards-grid">
                {PRE_PROVISIONED_SENSOR_KITS.map((kit) => (
                  <div
                    key={kit.kitId}
                    className="nfc-kit-card"
                    onClick={() => handleSelectPreProvisionedKit(kit)}
                  >
                    <div className="nfc-kit-card-top">
                      <span className="nfc-kit-id">{kit.kitId}</span>
                      <span className="nfc-kit-proto-badge">{kit.telemetryProtocol}</span>
                    </div>

                    <div className="nfc-kit-model-name">{kit.kitModel}</div>
                    <div className="nfc-kit-serial">NFC TAG: {kit.nfcTagSerial}</div>
                    <p className="nfc-kit-desc">{kit.description}</p>

                    <div className="nfc-kit-channels-list">
                      {kit.sensors.map((s) => (
                        <span key={s.id} className="nfc-channel-tag">
                          {s.type === 'vibration' && <Activity size={10} />}
                          {s.type === 'temperature' && <Thermometer size={10} />}
                          {s.type === 'current' && <Zap size={10} />}
                          {s.type === 'acoustic' && <Radio size={10} />}
                          <span>{s.name.split(' ')[0]} ({s.samplingRate})</span>
                        </span>
                      ))}
                    </div>

                    <button className="nfc-scan-tap-btn">
                      <Wifi size={13} />
                      <span>TAP TO SCAN THIS KIT</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual Serial Entry Option */}
            <div className="nfc-manual-scan-bar">
              <div className="nfc-manual-label">OR ENTER CUSTOM SENSOR KIT SERIAL:</div>
              <div className="nfc-manual-input-group">
                <input
                  type="text"
                  placeholder="e.g. NFC-9482-B2 or KIT-VEC-1001"
                  value={manualSerial}
                  onChange={(e) => setManualSerial(e.target.value)}
                  className="nfc-manual-input"
                  onKeyDown={(e) => e.key === 'Enter' && handleScanManualSerial()}
                />
                <button
                  onClick={handleScanManualSerial}
                  className="tech-btn primary"
                  style={{ padding: '6px 14px', fontSize: '11px' }}
                >
                  PAIR SERIAL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: LIVE SIGNAL VERIFICATION & INSTANT CONFIRMATION
            ========================================================================= */}
        {step === 'verify' && selectedKit && (
          <div className="nfc-step-body">
            {/* Extracted Payload Summary Banner */}
            <div className="nfc-extracted-banner">
              <div className="nfc-banner-icon">
                <CheckCircle2 size={24} color="#16A34A" />
              </div>
              <div className="nfc-banner-info">
                <div className="nfc-banner-title">NFC TAG DETECTED // PAYLOAD DECRYPTED</div>
                <div className="nfc-banner-sub">
                  Kit: <strong>{selectedKit.kitModel}</strong> | Tag Serial: <code>{selectedKit.nfcTagSerial}</code> | Protocol: <strong>{selectedKit.telemetryProtocol}</strong>
                </div>
              </div>
              <span className="signal-locked-badge">
                <Radio size={12} />
                <span>SIGNAL LOCKED (100%)</span>
              </span>
            </div>

            {/* Live Gateway Verification Handshake Sequence */}
            <div className="nfc-verification-handshake-box">
              <div className="handshake-step-row">
                <div className={`handshake-dot ${handshakeStep >= 1 ? 'done' : 'pending'}`}>
                  {handshakeStep >= 1 ? '✓' : '1'}
                </div>
                <span className="handshake-text">Industrial Edge Gateway Handshake (OPC-UA Ping: 11ms)</span>
                {handshakeStep >= 1 && <span className="handshake-status ok">[ VERIFIED ]</span>}
              </div>

              <div className="handshake-step-row">
                <div className={`handshake-dot ${handshakeStep >= 2 ? 'done' : 'pending'}`}>
                  {handshakeStep >= 2 ? '✓' : '2'}
                </div>
                <span className="handshake-text">Hardware Cryptographic Token Validation (AES-256 GCM)</span>
                {handshakeStep >= 2 && <span className="handshake-status ok">[ VALIDATED ]</span>}
              </div>

              <div className="handshake-step-row">
                <div className={`handshake-dot ${handshakeStep >= 3 ? 'done' : 'pending'}`}>
                  {handshakeStep >= 3 ? '✓' : '3'}
                </div>
                <span className="handshake-text">Telemetry Ingestion & Calibration Baseline Lock</span>
                {handshakeStep >= 3 && <span className="handshake-status ok">[ STREAM ACTIVE ]</span>}
              </div>
            </div>

            {/* Live Signal Stream Oscilloscope */}
            <div className="nfc-live-stream-oscilloscope-card">
              <div className="oscilloscope-header">
                <div className="osc-title-group">
                  <Activity size={14} className="osc-icon" />
                  <span className="osc-title">LIVE SENSOR SIGNAL OSCILLOSCOPE (INSTANT VERIFICATION)</span>
                </div>
                <span className="osc-rate-pill">20,000 SAMPLES/SEC</span>
              </div>

              {/* Dynamic Oscilloscope SVG Waveform */}
              <div className="oscilloscope-screen">
                <svg viewBox="0 0 700 90" className="osc-svg-wave" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="45" x2="700" y2="45" stroke="rgba(217,119,6,0.25)" strokeDasharray="4 4" />
                  <line x1="175" y1="0" x2="175" y2="90" stroke="rgba(217,119,6,0.15)" strokeDasharray="4 4" />
                  <line x1="350" y1="0" x2="350" y2="90" stroke="rgba(217,119,6,0.15)" strokeDasharray="4 4" />
                  <line x1="525" y1="0" x2="525" y2="90" stroke="rgba(217,119,6,0.15)" strokeDasharray="4 4" />

                  {/* Primary Vibration Sine Wave */}
                  <path
                    d={Array.from({ length: 140 }).reduce<string>((acc, _, i) => {
                      const x = i * 5;
                      const rad = ((i * 12 + waveOffset * 4) * Math.PI) / 180;
                      const rad2 = ((i * 24 + waveOffset * 6) * Math.PI) / 180;
                      const y = 45 + Math.sin(rad) * 26 + Math.sin(rad2) * 8;
                      return `${acc} ${i === 0 ? 'M' : 'L'} ${x} ${y.toFixed(1)}`;
                    }, '')}
                    fill="none"
                    stroke="#D97706"
                    strokeWidth="2"
                  />

                  {/* Secondary Temperature DC Wave */}
                  <path
                    d={Array.from({ length: 70 }).reduce<string>((acc, _, i) => {
                      const x = i * 10;
                      const rad = ((i * 6 + waveOffset) * Math.PI) / 180;
                      const y = 30 + Math.sin(rad) * 4;
                      return `${acc} ${i === 0 ? 'M' : 'L'} ${x} ${y.toFixed(1)}`;
                    }, '')}
                    fill="none"
                    stroke="#16A34A"
                    strokeWidth="1.5"
                    strokeDasharray="6 2"
                  />
                </svg>

                <div className="osc-live-readouts">
                  {selectedKit.sensors.map((sensor) => (
                    <div key={sensor.id} className="osc-readout-item">
                      <span className="readout-label">{sensor.name}</span>
                      <span className="readout-val">
                        {(
                          sensor.currentValue +
                          Math.sin((waveOffset * Math.PI) / 180) * 0.05
                        ).toFixed(2)}{' '}
                        {sensor.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Verified Sensors Channel Mapping */}
            <div className="nfc-mapped-channels-grid">
              <div className="nfc-section-title">// PROVISIONED SENSOR CHANNELS TO BIND:</div>
              <div className="mapped-channels-list">
                {selectedKit.sensors.map((s, idx) => (
                  <div key={s.id} className="mapped-channel-row">
                    <span className="channel-idx">CH-{String(idx + 1).padStart(2, '0')}</span>
                    <span className="channel-name">{s.name}</span>
                    <span className="channel-spec">{s.range} ({s.samplingRate})</span>
                    <span className="channel-verified-tag">
                      <CheckCircle2 size={12} color="#16A34A" />
                      <span>LIVE</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Action Controls */}
            <div className="nfc-modal-footer">
              <button
                onClick={() => setStep('scan')}
                className="tech-btn secondary"
                style={{ fontSize: '11px', padding: '6px 14px' }}
              >
                ← RESCAN ANOTHER KIT
              </button>

              <button
                onClick={handleConfirmBinding}
                disabled={handshakeStep < 3}
                className="nfc-complete-binding-btn"
              >
                <CheckCircle2 size={15} />
                <span>CONFIRM & BIND KIT TO {machine.id}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
