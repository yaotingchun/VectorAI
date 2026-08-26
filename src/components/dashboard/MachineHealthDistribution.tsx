import React, { useState } from 'react';
import { FactoryOverviewKpiData, MachineNode, MachineType } from '../../types/dashboard';
import { TabId } from '../../types/navigation';
import {
  PieChart,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  PowerOff,
} from 'lucide-react';

interface MachineHealthDistributionProps {
  overview: FactoryOverviewKpiData;
  machines: MachineNode[];
  onNavigate?: (tab: TabId, machineId?: string) => void;
}

interface MachineTypeBreakdown {
  type: MachineType;
  shortCode: string;
  total: number;
  healthy: number;
  warning: number;
  critical: number;
  offline: number;
  avgHealth: number;
}

export const MachineHealthDistribution: React.FC<MachineHealthDistributionProps> = ({
  overview,
  machines,
  onNavigate,
}) => {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  // Compute stats across semiconductor backend cleanroom machine types
  const machineTypes: MachineType[] = [
    'Wafer Dicing Machine',
    'AMHS Stocker',
    'Die Attacher',
    'RF Plasma Cleaner',
    'Wire Bonder',
    'Molding Machine',
    '3D Optical AOI',
    'Microfocus X-Ray',
    'Laser Marker',
    'IC Test Handler',
    'Tape & Reel Packaging',
  ];

  const shortCodeMap: Record<MachineType, string> = {
    'Wafer Dicing Machine': 'WS',
    'AMHS Stocker': 'STK',
    'Die Attacher': 'DA',
    'RF Plasma Cleaner': 'PC',
    'Wire Bonder': 'WB',
    'Molding Machine': 'MP',
    '3D Optical AOI': 'AOI',
    'Microfocus X-Ray': 'XR',
    'Laser Marker': 'LM',
    'IC Test Handler': 'TH',
    'Tape & Reel Packaging': 'TR',
    'IC Tester & Sorter': 'TS',
  };

  const typeBreakdowns: MachineTypeBreakdown[] = machineTypes.map((type) => {
    const list = machines.filter((m) => m.type === type);
    const healthy = list.filter((m) => m.status === 'healthy').length;
    const warning = list.filter((m) => m.status === 'warning').length;
    const critical = list.filter((m) => m.status === 'critical').length;
    const offline = list.filter((m) => m.status === 'offline').length;
    const avgHealth = Math.round(
      list.reduce((acc, m) => acc + m.healthScore, 0) / (list.length || 1)
    );

    return {
      type,
      shortCode: shortCodeMap[type],
      total: list.length,
      healthy,
      warning,
      critical,
      offline,
      avgHealth,
    };
  });

  // Donut SVG parameters
  const size = 170;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const total = overview.totalMachines;
  const healthyRatio = overview.healthyMachines / total;
  const warningRatio = overview.warningMachines / total;
  const criticalRatio = overview.criticalMachines / total;
  const offlineRatio = overview.offlineMachines / total;

  const healthyStroke = healthyRatio * circumference;
  const warningStroke = warningRatio * circumference;
  const criticalStroke = criticalRatio * circumference;
  const offlineStroke = offlineRatio * circumference;

  const healthyOffset = 0;
  const warningOffset = -(healthyStroke);
  const criticalOffset = -(healthyStroke + warningStroke);
  const offlineOffset = -(healthyStroke + warningStroke + criticalStroke);

  return (
    <section className="tech-card" aria-label="Machine Fleet Health Distribution">
      <span className="corner-tl">+</span>
      <span className="corner-tr">+</span>
      <span className="corner-bl">+</span>
      <span className="corner-br">+</span>

      <div className="tech-card-header">
        <div className="tech-card-title">
          <PieChart size={16} />
          <span>Machine Fleet Health Distribution</span>
        </div>

        <button
          type="button"
          onClick={() => onNavigate?.('machines')}
          className="tech-btn"
          style={{ padding: '4px 10px', fontSize: '10px' }}
        >
          <span>View Machine Fleet</span>
          <ArrowRight size={12} />
        </button>
      </div>

      <div className="tech-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Top Split: Donut Chart + Global Fleet Status Stats */}
        <div className="distrib-top-grid">
          {/* Donut Chart Visual */}
          <div className="distrib-donut-wrapper">
            <svg width={size} height={size} className="distrib-donut-svg">
              {/* Background Ring */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke="var(--bg-muted)"
                strokeWidth={strokeWidth}
              />

              {/* Healthy Ring */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke="var(--accent-green)"
                strokeWidth={hoveredSegment === 'healthy' ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={`${healthyStroke} ${circumference}`}
                strokeDashoffset={healthyOffset}
                className="donut-segment"
                onMouseEnter={() => setHoveredSegment('healthy')}
                onMouseLeave={() => setHoveredSegment(null)}
              />

              {/* Warning Ring */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke="var(--accent-amber)"
                strokeWidth={hoveredSegment === 'warning' ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={`${warningStroke} ${circumference}`}
                strokeDashoffset={warningOffset}
                className="donut-segment"
                onMouseEnter={() => setHoveredSegment('warning')}
                onMouseLeave={() => setHoveredSegment(null)}
              />

              {/* Critical Ring */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke="var(--accent-red)"
                strokeWidth={hoveredSegment === 'critical' ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={`${criticalStroke} ${circumference}`}
                strokeDashoffset={criticalOffset}
                className="donut-segment"
                onMouseEnter={() => setHoveredSegment('critical')}
                onMouseLeave={() => setHoveredSegment(null)}
              />

              {/* Offline Ring */}
              {offlineRatio > 0 && (
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke="#9CA3AF"
                  strokeWidth={hoveredSegment === 'offline' ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={`${offlineStroke} ${circumference}`}
                  strokeDashoffset={offlineOffset}
                  className="donut-segment"
                  onMouseEnter={() => setHoveredSegment('offline')}
                  onMouseLeave={() => setHoveredSegment(null)}
                />
              )}
            </svg>

            {/* Inner Donut Center Label */}
            <div className="donut-center-info">
              <span className="donut-center-num">{overview.totalMachines}</span>
              <span className="donut-center-text">TOTAL UNITS</span>
              <span className="donut-center-sub">70% Healthy</span>
            </div>
          </div>

          {/* 4 Health State Breakdown Cards */}
          <div className="distrib-legend-grid">
            {/* Healthy */}
            <div className="distrib-stat-box border-green">
              <div className="distrib-box-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle2 size={13} color="var(--accent-green)" />
                  <span className="distrib-box-title">Healthy</span>
                </div>
                <span className="distrib-box-pct">{Math.round(healthyRatio * 100)}%</span>
              </div>
              <div className="distrib-box-val">{overview.healthyMachines} <span className="sub">Units</span></div>
              <div className="distrib-box-desc">Normal operating parameters</div>
            </div>

            {/* Warning */}
            <div className="distrib-stat-box border-amber">
              <div className="distrib-box-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <AlertTriangle size={13} color="var(--accent-amber)" />
                  <span className="distrib-box-title">Warning</span>
                </div>
                <span className="distrib-box-pct">{Math.round(warningRatio * 100)}%</span>
              </div>
              <div className="distrib-box-val text-amber">{overview.warningMachines} <span className="sub">Units</span></div>
              <div className="distrib-box-desc">Early component drift detected</div>
            </div>

            {/* Critical */}
            <div className="distrib-stat-box border-red">
              <div className="distrib-box-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <AlertOctagon size={13} color="var(--accent-red)" />
                  <span className="distrib-box-title">Critical</span>
                </div>
                <span className="distrib-box-pct">{Math.round(criticalRatio * 100)}%</span>
              </div>
              <div className="distrib-box-val text-red">{overview.criticalMachines} <span className="sub">Units</span></div>
              <div className="distrib-box-desc">Imminent failure risk (RUL &lt; 48h)</div>
            </div>

            {/* Offline */}
            <div className="distrib-stat-box border-gray">
              <div className="distrib-box-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <PowerOff size={13} color="var(--text-muted)" />
                  <span className="distrib-box-title">Offline</span>
                </div>
                <span className="distrib-box-pct">{Math.round(offlineRatio * 100)}%</span>
              </div>
              <div className="distrib-box-val text-gray">{overview.offlineMachines} <span className="sub">Units</span></div>
              <div className="distrib-box-desc">Tooling changeover / PM in progress</div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Health Breakdown by the 5 Semiconductor Backend Machine Types */}
        <div className="distrib-type-matrix">
          <div className="distrib-matrix-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={13} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                Equipment Category Distribution (5 Semiconductor Backend Types)
              </span>
            </div>
            <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              AGGREGATED FLEET METRICS
            </span>
          </div>

          <div className="distrib-type-list">
            {typeBreakdowns.map((tb) => {
              const hPct = (tb.healthy / (tb.total || 1)) * 100;
              const wPct = (tb.warning / (tb.total || 1)) * 100;
              const cPct = (tb.critical / (tb.total || 1)) * 100;
              const oPct = (tb.offline / (tb.total || 1)) * 100;

              return (
                <div key={tb.type} className="distrib-type-row">
                  {/* Category Name & Short Code */}
                  <div className="distrib-type-info">
                    <span className="distrib-type-code">{tb.shortCode}</span>
                    <div>
                      <div className="distrib-type-name">{tb.type}</div>
                      <div className="distrib-type-meta">
                        {tb.total} Units registered • Avg Health: <strong>{tb.avgHealth}%</strong>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Segmented Bar */}
                  <div className="distrib-bar-container">
                    <div className="distrib-stacked-bar">
                      {hPct > 0 && <div className="distrib-bar-seg seg-healthy" style={{ width: `${hPct}%` }} title={`Healthy: ${tb.healthy}`} />}
                      {wPct > 0 && <div className="distrib-bar-seg seg-warning" style={{ width: `${wPct}%` }} title={`Warning: ${tb.warning}`} />}
                      {cPct > 0 && <div className="distrib-bar-seg seg-critical" style={{ width: `${cPct}%` }} title={`Critical: ${tb.critical}`} />}
                      {oPct > 0 && <div className="distrib-bar-seg seg-offline" style={{ width: `${oPct}%` }} title={`Offline: ${tb.offline}`} />}
                    </div>

                    {/* Chips for this type */}
                    <div className="distrib-type-chips">
                      <span className="chip-healthy">{tb.healthy} OK</span>
                      {tb.warning > 0 && <span className="chip-warning">{tb.warning} WARN</span>}
                      {tb.critical > 0 && <span className="chip-critical">{tb.critical} CRIT</span>}
                      {tb.offline > 0 && <span className="chip-offline">{tb.offline} OFF</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MachineHealthDistribution;
