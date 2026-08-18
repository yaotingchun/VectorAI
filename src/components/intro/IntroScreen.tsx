import React, { useState, useEffect, useRef } from 'react';
import vectorLogo from '../../assets/vector-logo.png';
import './IntroScreen.css';
import { ArrowRight } from 'lucide-react';

interface IntroScreenProps {
  onComplete: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const exitingRef = useRef(false);

  const handleFinish = () => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 450);
  };

  useEffect(() => {
    let current = 0;
    let timerId: ReturnType<typeof setTimeout>;

    const nextStep = () => {
      if (exitingRef.current) return;

      let increment = 0;
      let nextDelay = 0;

      if (current < 18) {
        // Fast initial leap (0% -> 18%)
        increment = Math.floor(Math.random() * 6) + 3;
        nextDelay = Math.floor(Math.random() * 30) + 20;
      } else if (current < 46) {
        // Steady acceleration (18% -> 46%)
        increment = Math.floor(Math.random() * 5) + 2;
        nextDelay = Math.floor(Math.random() * 40) + 25;
      } else if (current < 54) {
        // Realistic micro-pause / hesitation (46% -> 54%)
        increment = Math.random() > 0.55 ? 1 : 0;
        nextDelay = Math.floor(Math.random() * 80) + 50;
      } else if (current < 82) {
        // Dynamic surge (54% -> 82%)
        increment = Math.floor(Math.random() * 7) + 4;
        nextDelay = Math.floor(Math.random() * 35) + 20;
      } else if (current < 92) {
        // Slight final calibration slowdown (82% -> 92%)
        increment = Math.floor(Math.random() * 3) + 1;
        nextDelay = Math.floor(Math.random() * 60) + 35;
      } else {
        // Final snap to 100%
        increment = Math.floor(Math.random() * 4) + 2;
        nextDelay = Math.floor(Math.random() * 25) + 15;
      }

      current = Math.min(100, current + increment);
      setProgress(current);

      if (current < 100) {
        timerId = setTimeout(nextStep, nextDelay);
      } else {
        // Hold 100% briefly then smoothly transition
        setTimeout(() => {
          handleFinish();
        }, 180);
      }
    };

    timerId = setTimeout(nextStep, 80);

    return () => clearTimeout(timerId);
  }, []);

  // Keyboard shortcut (Space / Enter to skip)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`intro-overlay ${isExiting ? 'exiting' : ''}`}>
      {/* 4 Viewport Corner L-Brackets */}
      <div className="screen-bracket screen-bracket-tl" />
      <div className="screen-bracket screen-bracket-tr" />
      <div className="screen-bracket screen-bracket-bl" />
      <div className="screen-bracket screen-bracket-br" />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '20px' }}>
        {/* Main Central Blueprint Card */}
        <div className="intro-card">
          {/* Top Row */}
          <div className="intro-top-row">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="sys-id-group">
                <span className="sys-id-badge">SYS-ID</span>
                <span className="sys-id-value">VF-01</span>
              </div>

              {/* Tick Marks */}
              <div className="sys-tick-marks">
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
              </div>
            </div>

            {/* Top Right Dot Matrix & Industry 4.0 Tag */}
            <div className="intro-top-right">
              <div className="dot-matrix">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="matrix-dot" />
                ))}
              </div>

              <span className="industry-tag">INDUSTRY 4.0</span>
              <span className="corner-tag-glyph">┐</span>
            </div>
          </div>

          {/* Center Logo Section */}
          <div className="intro-logo-section">
            <img
              src={vectorLogo}
              alt="Vector.ai - Factory Intelligence Platform"
              className="intro-logo-img"
            />
          </div>

          {/* Horizontal Rule Divider */}
          <div className="intro-divider-rule" />

          {/* Bottom Metadata 4-Column Bar */}
          <div className="intro-bottom-row">
            {/* Column 1: Factory Icon & Version */}
            <div className="intro-col col-factory">
              <svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2 22V14L8 18V14L14 18V6H26V22H2Z"
                  fill="#121315"
                />
                <rect x="5" y="18" width="2" height="2" fill="#FAF9F5" />
                <rect x="9" y="18" width="2" height="2" fill="#FAF9F5" />
                <rect x="17" y="9" width="2" height="2" fill="#FAF9F5" />
                <rect x="21" y="9" width="2" height="2" fill="#FAF9F5" />
                <rect x="17" y="13" width="2" height="2" fill="#FAF9F5" />
                <rect x="21" y="13" width="2" height="2" fill="#FAF9F5" />
              </svg>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em' }}>
                  VECTOR.AI
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  VER 1.0.0
                </span>
              </div>
            </div>

            <div className="intro-col-divider" />

            {/* Column 2: Digital Twin & Hazard Stripes */}
            <div className="intro-col col-twin">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em' }}>
                DIGITAL TWIN
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em' }}>
                PREDICT • OPTIMIZE • ACT
              </span>
              <div className="hazard-stripes-container">
                <div className="hazard-stripes">
                  <div className="hazard-stripe" />
                  <div className="hazard-stripe" />
                  <div className="hazard-stripe" />
                  <div className="hazard-stripe" />
                </div>
                <div className="hazard-line" />
              </div>
            </div>

            <div className="intro-col-divider" />

            {/* Column 3: ESTD 2026 */}
            <div className="intro-col col-estd">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)' }}>
                ESTD.
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 800 }}>
                2026
              </span>
            </div>

            <div className="intro-col-divider" />

            {/* Column 4: Barcode & VT-2401-IND */}
            <div className="intro-col col-barcode">
              {/* SVG Barcode */}
              <svg width="130" height="24" viewBox="0 0 130 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="3" height="24" fill="#121315" />
                <rect x="5" y="0" width="1.5" height="24" fill="#121315" />
                <rect x="8" y="0" width="4" height="24" fill="#121315" />
                <rect x="14" y="0" width="2" height="24" fill="#121315" />
                <rect x="18" y="0" width="1.5" height="24" fill="#121315" />
                <rect x="22" y="0" width="3.5" height="24" fill="#121315" />
                <rect x="28" y="0" width="2" height="24" fill="#121315" />
                <rect x="32" y="0" width="4.5" height="24" fill="#121315" />
                <rect x="39" y="0" width="1.5" height="24" fill="#121315" />
                <rect x="43" y="0" width="3" height="24" fill="#121315" />
                <rect x="48" y="0" width="2" height="24" fill="#121315" />
                <rect x="53" y="0" width="5" height="24" fill="#121315" />
                <rect x="61" y="0" width="1.5" height="24" fill="#121315" />
                <rect x="65" y="0" width="3.5" height="24" fill="#121315" />
                <rect x="71" y="0" width="2" height="24" fill="#121315" />
                <rect x="75" y="0" width="4" height="24" fill="#121315" />
                <rect x="81" y="0" width="1.5" height="24" fill="#121315" />
                <rect x="85" y="0" width="3" height="24" fill="#121315" />
                <rect x="90" y="0" width="2" height="24" fill="#121315" />
                <rect x="94" y="0" width="4.5" height="24" fill="#121315" />
                <rect x="101" y="0" width="1.5" height="24" fill="#121315" />
                <rect x="105" y="0" width="3" height="24" fill="#121315" />
                <rect x="110" y="0" width="2.5" height="24" fill="#121315" />
                <rect x="115" y="0" width="4" height="24" fill="#121315" />
                <rect x="121" y="0" width="1.5" height="24" fill="#121315" />
                <rect x="125" y="0" width="3.5" height="24" fill="#121315" />
              </svg>

              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em' }}>
                VT-2401-IND
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Loading Progress */}
        <div className="intro-controls">
          <div className="intro-progress-track">
            <div className="intro-progress-bar" style={{ width: `${progress}%` }} />
          </div>

          <div className="intro-status-text">
            <span>Loading...</span>
            <span style={{ fontWeight: 800 }}>{progress}%</span>
          </div>

          <button onClick={handleFinish} className="enter-btn">
            <span>ENTER PLATFORM</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;
