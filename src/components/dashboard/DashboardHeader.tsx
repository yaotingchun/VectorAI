import React, { useState } from 'react';
import { TabId } from '../../types/navigation';
import {
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface DashboardHeaderProps {
  onNavigate?: (tab: TabId, machineId?: string) => void;
  factoryHealthScore?: number;
  criticalRiskCount?: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onNavigate,
  factoryHealthScore = 88.4,
  criticalRiskCount = 2,
}) => {
  const [selectedPlant, setSelectedPlant] = useState('OSAT Plant 1 — Bayan Lepas, Penang');
  const [selectedPeriod, setSelectedPeriod] = useState<'shift' | 'today' | '7d'>('today');

  const plants = [
    'OSAT Plant 1 — Bayan Lepas, Penang',
    'OSAT Plant 2 — Hsinchu Science Park',
    'OSAT Plant 3 — Clark Freeport, PH',
  ];

  const isAttentionRequired = criticalRiskCount > 0;

  return (
    <header className="dash-overview-header" aria-label="Factory Executive Header">
      <div className="dash-overview-top">
        {/* Left: Plant Identity, Facility Selector & Reporting Period */}
        <div className="dash-plant-info">
          <div className="dash-plant-badge">
            <Building2 size={15} />
            <span>SEMICONDUCTOR BACKEND FACILITY</span>
          </div>

          <div className="dash-plant-title-row">
            <h1 className="dash-plant-title">{selectedPlant}</h1>
            <select
              value={selectedPlant}
              onChange={(e) => setSelectedPlant(e.target.value)}
              className="dash-plant-select"
              aria-label="Select Monitored Factory"
            >
              {plants.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="dash-plant-subtext">
            <span>Aggregated Executive Summary</span>
            <span className="dot-sep">•</span>
            <span>20 Registered Machines</span>
            <span className="dot-sep">•</span>
            <span>6 Packaging &amp; Test Lines</span>
          </div>

          {/* Integrated Reporting Period Toolbar */}
          <div className="period-selector-group">
            <div className="period-label">
              <Calendar size={12} />
              <span>REPORTING PERIOD:</span>
            </div>
            <div className="period-btn-row">
              <button
                type="button"
                onClick={() => setSelectedPeriod('shift')}
                className={`period-btn ${selectedPeriod === 'shift' ? 'active' : ''}`}
              >
                Shift A (08:00-16:00)
              </button>
              <button
                type="button"
                onClick={() => setSelectedPeriod('today')}
                className={`period-btn ${selectedPeriod === 'today' ? 'active' : ''}`}
              >
                Today (24H)
              </button>
              <button
                type="button"
                onClick={() => setSelectedPeriod('7d')}
                className={`period-btn ${selectedPeriod === '7d' ? 'active' : ''}`}
              >
                Last 7 Days
              </button>
            </div>
          </div>
        </div>

        {/* Right: Docked Overall Factory Status Card */}
        <div className="dash-header-right">
          <div className={`factory-status-card ${isAttentionRequired ? 'status-attention' : 'status-optimal'}`}>
            <div className="factory-status-header">
              <span className="status-label-caption">OVERALL FACTORY STATUS</span>
              <span className="status-eval-time">Index: {factoryHealthScore.toFixed(1)}/100</span>
            </div>
            <div className="factory-status-badge">
              {isAttentionRequired ? (
                <>
                  <AlertTriangle size={16} className="status-icon warn" />
                  <span className="status-title-text">ATTENTION REQUIRED</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} className="status-icon good" />
                  <span className="status-title-text">OPERATIONAL / STABLE</span>
                </>
              )}
            </div>
            <div className="factory-status-subtext">
              {isAttentionRequired
                ? `${criticalRiskCount} critical equipment anomalies require supervisor intervention.`
                : 'All packaging and test clusters operating within nominal parameters.'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Action Strip */}
      <div className="dash-quick-nav-strip">
        <div className="dash-quick-nav-label">
          <Layers size={13} />
          <span>DETAILED MODULES:</span>
        </div>

        <div className="dash-quick-nav-links">
          <button
            type="button"
            onClick={() => onNavigate?.('monitoring')}
            className="dash-quick-nav-btn"
            title="Open Factory Floor Command Center"
          >
            <span>View Monitoring Floor</span>
            <ArrowRight size={12} />
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('machines')}
            className="dash-quick-nav-btn"
            title="Inspect Machine Telemetry Nodes"
          >
            <span>View Machine Fleet</span>
            <ArrowRight size={12} />
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('prediction')}
            className="dash-quick-nav-btn"
            title="Open Neural Anomaly & RUL Degradation Models"
          >
            <span>View Predictions</span>
            <ArrowRight size={12} />
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('maintenance')}
            className="dash-quick-nav-btn"
            title="Open Work Order Dispatch & Schedule Matrix"
          >
            <span>View Maintenance</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
