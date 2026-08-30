import React, { useState, useEffect, useRef } from 'react';
import { useFactory } from '../../context/FactoryContext';
import {
  RerouteExecution,
  RerouteSeverity,
  MachineFaultScenario,
} from '../../types/rerouting';
import {
  PRECONFIGURED_FAULT_SCENARIOS,
} from '../../features/rerouting/services/rerouteEngine';
import {
  Terminal,
  BrainCircuit,
  Bot,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  AlertTriangle,
  Radio,
  Search,
  Sparkles,
  Zap,
  Cpu,
  RefreshCw,
  Box,
  Truck,
  FileCode,
} from 'lucide-react';

interface DashboardRerouteExecutionSectionProps {
  onNavigate?: (tab: any, machineId?: string) => void;
}

export const DashboardRerouteExecutionSection: React.FC<DashboardRerouteExecutionSectionProps> = ({
  onNavigate,
}) => {
  const {
    rerouteExecutions,
    activeExecutionId,
    setActiveExecutionId,
    triggerReroute,
    pauseExecution,
    resumeExecution,
    rollbackExecution,
  } = useFactory();

  const [activeTab, setActiveTab] = useState<'reasoning' | 'terminal' | 'topology'>('reasoning');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(PRECONFIGURED_FAULT_SCENARIOS[0].id);
  const [logFilter, setLogFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedPayloadId, setExpandedPayloadId] = useState<string | null>(null);
  const [copiedLogs, setCopiedLogs] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [hasTriggeredAutoReroute, setHasTriggeredAutoReroute] = useState<boolean>(false);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Active execution object
  const activeExecution: RerouteExecution | undefined =
    rerouteExecutions.find((e) => e.id === activeExecutionId) || rerouteExecutions[0];

  // Auto-scroll terminal when new logs arrive if autoScroll is enabled
  useEffect(() => {
    if (autoScroll && activeTab === 'terminal' && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeExecution?.logs.length, activeTab, autoScroll]);

  // Aggregate Metrics across all executions
  const totalWafersProtected = rerouteExecutions.reduce(
    (acc, curr) => acc + (curr.metrics?.wafersProtected || 0),
    0
  );
  const totalScrapSavedUsd = rerouteExecutions.reduce(
    (acc, curr) => acc + (curr.metrics?.financialLossPreventedUsd || 0),
    0
  );
  const totalLotsRerouted = rerouteExecutions.reduce(
    (acc, curr) => acc + (curr.affectedLots?.length || 0),
    0
  );

  const handleLaunchScenario = (scenarioId: string) => {
    const scenario = PRECONFIGURED_FAULT_SCENARIOS.find((s: MachineFaultScenario) => s.id === scenarioId);
    if (scenario) {
      triggerReroute(scenario);
      setHasTriggeredAutoReroute(true);
      setActiveTab('terminal');
    }
  };

  const handleCopyLogs = () => {
    if (!activeExecution) return;
    const logText = activeExecution.logs
      .map(
        (l) =>
          `[${l.timestamp}] [${l.level}] [${l.subsystem}] ${l.message}${l.reasoningNote ? `\n  >> AI REASONING: ${l.reasoningNote}` : ''
          }`
      )
      .join('\n');

    navigator.clipboard.writeText(logText);
    setCopiedLogs(true);
    setTimeout(() => setCopiedLogs(false), 2000);
  };

  // Filter logs
  const filteredLogs = (activeExecution?.logs || []).filter((log) => {
    if (logFilter === 'REASONING' && log.level !== 'REASONING' && !log.reasoningNote) return false;
    if (logFilter === 'ACTION' && log.level !== 'ACTION') return false;
    if (logFilter === 'WARN' && log.level !== 'WARN' && log.level !== 'ERROR') return false;
    if (logFilter === 'SUCCESS' && log.level !== 'SUCCESS') return false;

    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const matchMsg = log.message.toLowerCase().includes(q);
      const matchSub = log.subsystem.toLowerCase().includes(q);
      const matchReason = log.reasoningNote?.toLowerCase().includes(q);
      if (!matchMsg && !matchSub && !matchReason) return false;
    }
    return true;
  });

  const getSeverityBadge = (level: RerouteSeverity) => {
    switch (level) {
      case 'REASONING':
        return { bg: '#581C87', border: '#A855F7', color: '#F3E8FF', label: 'AI REASONING' };
      case 'ACTION':
        return { bg: '#1E3A8A', border: '#3B82F6', color: '#DBEAFE', label: 'EXEC ACTION' };
      case 'WARN':
      case 'ERROR':
        return { bg: '#7F1D1D', border: '#EF4444', color: '#FEE2E2', label: 'ANOMALY ALERT' };
      case 'SUCCESS':
        return { bg: '#14532D', border: '#22C55E', color: '#DCFCE7', label: 'VERIFIED OK' };
      default:
        return { bg: '#1E293B', border: '#64748B', color: '#F1F5F9', label: 'SYSTEM INFO' };
    }
  };

  return (
    <section
      className="tech-card"
      style={{
        width: '100%',
        backgroundColor: 'var(--bg-card)',
        border: '1.5px solid var(--border-strong)',
        boxShadow: '3px 3px 0px rgba(18, 19, 21, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0px',
        overflow: 'hidden',
        position: 'relative',
      }}
      aria-label="Autonomous Rerouting and Incident Execution Logs"
    >
      <span className="corner-tl">+</span>
      <span className="corner-tr">+</span>
      <span className="corner-bl">+</span>
      <span className="corner-br">+</span>

      {/* ── Section Header Bar ── */}
      <div
        className="tech-card-header"
        style={{
          padding: '12px 18px',
          borderBottom: '1.5px solid var(--border-strong)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: 'var(--bg-dark)',
              color: 'var(--text-inverted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-strong)',
              flexShrink: 0,
            }}
          >
            <BrainCircuit size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '15px',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '0.04em',
                }}
              >
                AUTONOMOUS REROUTING & INCIDENT EXECUTION LOGS
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  padding: '2px 8px',
                  backgroundColor: activeExecution?.status === 'IN_PROGRESS' ? 'var(--accent-amber)' : 'var(--accent-green)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  borderRadius: '2px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    display: 'inline-block',
                  }}
                />
                {activeExecution?.status === 'IN_PROGRESS' ? 'LIVE SOLVER ACTIVE' : 'PROTECTED • READY'}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Real-time multi-agent solver: Machine anomaly isolation, SECS/GEM safety lockout, AI line balancing reasoning, and robotic AGV lot rerouting.
            </div>
          </div>
        </div>

        {/* Top Scenario Launcher & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* 1. FAULT SIMULATOR (Always visible) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-muted)', padding: '4px 8px', border: '1px solid var(--border-strong)' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 700 }}>
              FAULT SIMULATOR:
            </span>
            <select
              value={selectedScenarioId}
              onChange={(e) => setSelectedScenarioId(e.target.value)}
              style={{
                padding: '4px 8px',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-strong)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {PRECONFIGURED_FAULT_SCENARIOS.map((sc: MachineFaultScenario) => (
                <option key={sc.id} value={sc.id}>
                  {sc.machineId} • {sc.processStage} ({sc.triggerTelemetry.sensorName})
                </option>
              ))}
            </select>

            <button
              onClick={() => handleLaunchScenario(selectedScenarioId)}
              className="tech-btn"
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                backgroundColor: 'var(--accent-red)',
                color: '#FFFFFF',
                border: '1px solid var(--border-strong)',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
              }}
              title="Simulate machine fault and watch real-time rerouting execution logs & reasoning"
            >
              <Zap size={13} />
              <span>RUN AUTO-REROUTE</span>
            </button>
          </div>

          {/* 2. AUDIT SESSION (Situated between Fault Simulator and Export Audit; appears after pressing Run Auto-Reroute) */}
          {hasTriggeredAutoReroute && rerouteExecutions.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-muted)', padding: '4px 8px', border: '1px solid var(--border-strong)' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 700 }}>
                AUDIT SESSION:
              </span>
              <select
                value={activeExecutionId || ''}
                onChange={(e) => setActiveExecutionId(e.target.value)}
                style={{
                  padding: '4px 8px',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-strong)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {rerouteExecutions.map((exec) => {
                  const timeStr = new Date(exec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                  return (
                    <option key={exec.id} value={exec.id}>
                      {exec.sourceMachineId} ➔ {exec.targetMachineId} • {timeStr} ({exec.status})
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ── KPI Summary Strip ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1px',
          backgroundColor: 'var(--border-strong)',
          borderBottom: '2px solid var(--border-strong)',
        }}
      >
        <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-card)' }}>
          <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            INCIDENT EXECUTIONS
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            {rerouteExecutions.length} Recorded
          </div>
        </div>

        <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-card)' }}>
          <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            WAFERS PROTECTED
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-green)', marginTop: '2px' }}>
            {totalWafersProtected.toLocaleString()} Wafers
          </div>
        </div>

        <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-card)' }}>
          <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            SCRAP LOSS PREVENTED
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-blue)', marginTop: '2px' }}>
            ${totalScrapSavedUsd.toLocaleString()} USD
          </div>
        </div>

        <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-card)' }}>
          <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            LOTS REDIRECTED
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            {totalLotsRerouted} Substrates
          </div>
        </div>

        <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-card)' }}>
          <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            DECISION LATENCY
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '2px' }}>
            8.2s (Real-Time)
          </div>
        </div>
      </div>

      {/* ── Active Incident Banner & Flow Navigator ── */}
      {activeExecution && (
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1.5px solid var(--border-strong)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          {/* Machine Flow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  padding: '3px 8px',
                  backgroundColor: 'var(--accent-red)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 800,
                  border: '1px solid var(--border-strong)',
                }}
              >
                FAULT: {activeExecution.sourceMachineId}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>
                {activeExecution.sourceMachineName}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              <span>──[ AMHS AGV DIVERSION ]──►</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  padding: '3px 8px',
                  backgroundColor: 'var(--accent-green)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 800,
                  border: '1px solid var(--border-strong)',
                }}
              >
                TARGET: {activeExecution.targetMachineId}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>
                {activeExecution.targetMachineName}
              </span>
            </div>
          </div>

          {/* Execution Progress & Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 700 }}>
                STEP {activeExecution.currentStepIndex + 1} / {activeExecution.steps.length} • {activeExecution.status}
              </div>
              <div
                style={{
                  width: '160px',
                  height: '8px',
                  backgroundColor: 'var(--bg-muted)',
                  border: '1px solid var(--border-strong)',
                  overflow: 'hidden',
                  marginTop: '3px',
                }}
              >
                <div
                  style={{
                    width: `${activeExecution.progressPercent}%`,
                    height: '100%',
                    backgroundColor: activeExecution.status === 'COMPLETED' ? 'var(--accent-green)' : 'var(--accent-blue)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>

            {/* Controls */}
            {activeExecution.status === 'IN_PROGRESS' && (
              <button
                onClick={() => pauseExecution(activeExecution.id)}
                className="tech-btn"
                style={{ fontSize: '11px', padding: '4px 10px', border: '1px solid var(--border-strong)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
                title="Pause execution"
              >
                <Pause size={12} />
                <span>PAUSE</span>
              </button>
            )}

            {activeExecution.status === 'PAUSED' && (
              <button
                onClick={() => resumeExecution(activeExecution.id)}
                className="tech-btn"
                style={{ fontSize: '11px', padding: '4px 10px', backgroundColor: 'var(--accent-blue)', color: '#FFFFFF', border: '1px solid var(--border-strong)' }}
                title="Resume execution"
              >
                <Play size={12} />
                <span>RESUME</span>
              </button>
            )}

            {activeExecution.status === 'COMPLETED' && (
              <button
                onClick={() => rollbackExecution(activeExecution.id)}
                className="tech-btn"
                style={{ fontSize: '11px', padding: '4px 10px', border: '1px solid var(--border-strong)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
                title="Rollback lot routing"
              >
                <RotateCcw size={12} />
                <span>ROLLBACK</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Tab Switcher Bar ── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'stretch',
          borderBottom: '1.5px solid var(--border-strong)',
          backgroundColor: 'var(--bg-surface)',
          padding: '0 16px',
          gap: '6px',
        }}
      >
        <button
          onClick={() => setActiveTab('reasoning')}
          style={{
            padding: '10px 16px',
            borderTop: activeTab === 'reasoning' ? '2px solid var(--accent-blue)' : '2px solid transparent',
            borderLeft: '1px solid var(--border-strong)',
            borderRight: '1px solid var(--border-strong)',
            borderBottom: activeTab === 'reasoning' ? '1.5px solid var(--bg-card)' : '1px solid var(--border-strong)',
            backgroundColor: activeTab === 'reasoning' ? 'var(--bg-card)' : 'transparent',
            color: activeTab === 'reasoning' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11.5px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-1.5px',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
          }}
        >
          <Bot size={15} color={activeTab === 'reasoning' ? 'var(--accent-blue)' : 'currentColor'} />
          <span>AI DIAGNOSTIC REASONING & DECISION MATRIX</span>
        </button>

        <button
          onClick={() => setActiveTab('terminal')}
          style={{
            padding: '10px 16px',
            borderTop: activeTab === 'terminal' ? '2px solid var(--accent-green)' : '2px solid transparent',
            borderLeft: '1px solid var(--border-strong)',
            borderRight: '1px solid var(--border-strong)',
            borderBottom: activeTab === 'terminal' ? '1.5px solid var(--bg-card)' : '1px solid var(--border-strong)',
            backgroundColor: activeTab === 'terminal' ? 'var(--bg-card)' : 'transparent',
            color: activeTab === 'terminal' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11.5px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-1.5px',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
          }}
        >
          <Terminal size={15} color={activeTab === 'terminal' ? 'var(--accent-green)' : 'currentColor'} />
          <span>LIVE EXECUTION LOG TERMINAL</span>
          <span
            style={{
              fontSize: '10px',
              padding: '1px 7px',
              backgroundColor: activeTab === 'terminal' ? 'var(--accent-green)' : 'var(--border-strong)',
              color: '#FFFFFF',
              fontWeight: 800,
              borderRadius: '2px',
            }}
          >
            {activeExecution?.logs.length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('topology')}
          style={{
            padding: '10px 16px',
            borderTop: activeTab === 'topology' ? '2px solid var(--accent-amber)' : '2px solid transparent',
            borderLeft: '1px solid var(--border-strong)',
            borderRight: '1px solid var(--border-strong)',
            borderBottom: activeTab === 'topology' ? '1.5px solid var(--bg-card)' : '1px solid var(--border-strong)',
            backgroundColor: activeTab === 'topology' ? 'var(--bg-card)' : 'transparent',
            color: activeTab === 'topology' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11.5px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-1.5px',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
          }}
        >
          <Truck size={15} color={activeTab === 'topology' ? 'var(--accent-amber)' : 'currentColor'} />
          <span>AGV ROUTING & TOPOLOGY FLOW</span>
        </button>
      </div>

      {/* ── TAB 1: AI REASONING & DECISION MATRIX ── */}
      {activeTab === 'reasoning' && activeExecution && (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px', backgroundColor: 'var(--bg-surface)' }}>
          {/* Reason Card Top Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
            {/* Root Cause & Fault Mechanism */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-strong)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-strong)', paddingBottom: '8px' }}>
                <AlertTriangle size={16} color="var(--accent-red)" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  FAULT DIAGNOSIS & REASONING SUMMARY
                </span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Trigger Root Cause:</strong> {activeExecution.reasoning.rootCause}
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  padding: '10px 12px',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  lineHeight: '1.5',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderLeft: '3px solid var(--accent-red)',
                }}
              >
                <strong style={{ color: 'var(--accent-red)' }}>Physical Damage Mechanism:</strong> {activeExecution.reasoning.faultMechanism}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Yield Risk Analysis:</strong> {activeExecution.reasoning.yieldRiskAssessment}
              </div>
            </div>

            {/* Target Selection & Optimization Logic */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-strong)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-strong)', paddingBottom: '8px' }}>
                <Sparkles size={16} color="var(--accent-blue)" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  AI TARGET SELECTION & CAPACITY SOLVER
                </span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Selection Decision:</strong> {activeExecution.reasoning.targetSelectionLogic}
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(37, 99, 235, 0.08)',
                  padding: '10px 12px',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  lineHeight: '1.5',
                  border: '1px solid rgba(37, 99, 235, 0.25)',
                  borderLeft: '3px solid var(--accent-blue)',
                }}
              >
                <strong style={{ color: 'var(--accent-blue)' }}>Line Balancing Impact:</strong> {activeExecution.reasoning.lineBalancingImpact}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Estimated Lead Time Delta:</strong> {activeExecution.reasoning.estimatedLeadTimeDelta} • OEE Preservation: {activeExecution.metrics.oeePreservationFactor}%
              </div>
            </div>
          </div>

          {/* Candidate Evaluation Matrix Table */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-strong)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-strong)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--bg-surface)',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={15} color="var(--accent-purple, #7c3aed)" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  MULTI-CRITERIA TARGET CANDIDATE EVALUATION MATRIX
                </span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                AI SCORING WEIGHTS: Capacity (35%) • Compatibility (30%) • Health (20%) • Transit Latency (15%)
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-muted)', borderBottom: '1px solid var(--border-strong)', color: 'var(--text-primary)', textAlign: 'left', fontWeight: 800 }}>
                    <th style={{ padding: '10px 14px' }}>CANDIDATE NODE</th>
                    <th style={{ padding: '10px 14px' }}>UTILIZATION</th>
                    <th style={{ padding: '10px 14px' }}>FREE CAPACITY</th>
                    <th style={{ padding: '10px 14px' }}>HEALTH</th>
                    <th style={{ padding: '10px 14px' }}>COMPATIBILITY</th>
                    <th style={{ padding: '10px 14px' }}>TRANSIT TIME</th>
                    <th style={{ padding: '10px 14px' }}>AI SCORE</th>
                    <th style={{ padding: '10px 14px' }}>REASONING VERDICT</th>
                  </tr>
                </thead>
                <tbody>
                  {activeExecution.reasoning.candidateEvaluations.map((cand, cIdx) => (
                    <tr
                      key={cIdx}
                      style={{
                        borderBottom: '1px solid var(--border-strong)',
                        backgroundColor: cand.isRecommended ? 'rgba(22, 163, 74, 0.08)' : 'var(--bg-card)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <td style={{ padding: '12px 14px', fontWeight: 800 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: cand.isRecommended ? 'var(--accent-green)' : 'var(--text-primary)', fontSize: '13px' }}>
                            {cand.machineId}
                          </span>
                          {cand.isRecommended && (
                            <span
                              style={{
                                fontSize: '9.5px',
                                padding: '2px 6px',
                                backgroundColor: 'var(--accent-green)',
                                color: '#FFFFFF',
                                fontWeight: 800,
                                borderRadius: '2px',
                              }}
                            >
                              SELECTED OPTIMAL
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '2px' }}>
                          {cand.machineName}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>{cand.currentUtilization}%</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: cand.availableCapacity > 30 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                        {cand.availableCapacity}%
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>{cand.healthScore}/100</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>{cand.toolCompatibilityScore}%</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>{cand.agvTransferTimeSeconds}s</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: cand.isRecommended ? 'var(--accent-green)' : 'var(--text-primary)', fontSize: '13px' }}>
                        {cand.overallScore} / 100
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-primary)', fontSize: '11.5px', maxWidth: '340px', lineHeight: '1.45', fontWeight: 500 }}>
                        {cand.evaluationReasoning}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Substrate Lots Redirection Manifest */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-strong)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-strong)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--bg-surface)',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box size={15} color="var(--accent-blue)" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  AFFECTED SUBSTRATE LOTS & ROBOTIC CARRIER REASSIGNMENT MANIFEST
                </span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                ✓ {activeExecution.metrics.wafersProtected} WAFERS DIVERTED • $
                {activeExecution.metrics.financialLossPreventedUsd.toLocaleString()} SCRAP PREVENTED
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-muted)', borderBottom: '1px solid var(--border-strong)', color: 'var(--text-primary)', textAlign: 'left', fontWeight: 800 }}>
                    <th style={{ padding: '10px 14px' }}>LOT TRACKING ID</th>
                    <th style={{ padding: '10px 14px' }}>PRODUCT FAMILY</th>
                    <th style={{ padding: '10px 14px' }}>WAFERS</th>
                    <th style={{ padding: '10px 14px' }}>PRIORITY</th>
                    <th style={{ padding: '10px 14px' }}>ORIGIN ➔ TARGET</th>
                    <th style={{ padding: '10px 14px' }}>AGV CARRIER</th>
                    <th style={{ padding: '10px 14px' }}>TRANSFER STATUS</th>
                    <th style={{ padding: '10px 14px' }}>VALUE SAVED</th>
                  </tr>
                </thead>
                <tbody>
                  {activeExecution.affectedLots.map((lot, lIdx) => (
                    <tr key={lIdx} style={{ borderBottom: '1px solid var(--border-strong)', color: 'var(--text-primary)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--accent-blue)' }}>{lot.lotId}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600 }}>{lot.productFamily}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>{lot.waferCount} Wafers</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            padding: '2px 7px',
                            backgroundColor: lot.priority === 'CRITICAL' ? 'var(--accent-red)' : 'var(--accent-blue)',
                            color: '#FFFFFF',
                            fontWeight: 800,
                            borderRadius: '2px',
                          }}
                        >
                          {lot.priority}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>
                        {lot.originalMachineId} ➔ <strong style={{ color: 'var(--accent-green)' }}>{lot.targetMachineId}</strong>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-primary)', fontWeight: 600 }}>{lot.agvCarrierId}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            padding: '2px 7px',
                            backgroundColor: lot.transferStatus === 'PROCESSED' ? 'var(--accent-green)' : 'var(--accent-amber)',
                            color: '#FFFFFF',
                            fontWeight: 800,
                            borderRadius: '2px',
                          }}
                        >
                          {lot.transferStatus}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--accent-green)', fontWeight: 800 }}>
                        +${lot.estimatedScrapSavingsUsd.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: LIVE EXECUTION LOG TERMINAL ── */}
      {activeTab === 'terminal' && activeExecution && (
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#0B0F19' }}>
          {/* Terminal Toolbar */}
          <div
            style={{
              padding: '12px 18px',
              borderBottom: '1px solid #1E293B',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              backgroundColor: '#070A10',
            }}
          >
            {/* Filter buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94A3B8', fontWeight: 700 }}>
                FILTER LEVEL:
              </span>
              {['ALL', 'REASONING', 'ACTION', 'WARN', 'SUCCESS'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLogFilter(lvl)}
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    padding: '4px 10px',
                    backgroundColor: logFilter === lvl ? '#FFFFFF' : '#1E293B',
                    color: logFilter === lvl ? '#000000' : '#F1F5F9',
                    border: '1px solid #334155',
                    fontWeight: 800,
                    cursor: 'pointer',
                    borderRadius: '2px',
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Search & Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={13} style={{ position: 'absolute', left: '8px', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Search logs & reasoning..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '5px 8px 5px 28px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    width: '190px',
                    borderRadius: '2px',
                  }}
                />
              </div>

              <button
                onClick={() => setAutoScroll(!autoScroll)}
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  padding: '5px 10px',
                  backgroundColor: autoScroll ? '#14532D' : '#1E293B',
                  color: autoScroll ? '#86EFAC' : '#CBD5E1',
                  border: '1px solid #334155',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 700,
                  borderRadius: '2px',
                }}
              >
                <RefreshCw size={12} />
                <span>AUTO-SCROLL: {autoScroll ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={handleCopyLogs}
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  padding: '5px 10px',
                  backgroundColor: '#1E293B',
                  color: '#FFFFFF',
                  border: '1px solid #334155',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 700,
                  borderRadius: '2px',
                }}
              >
                {copiedLogs ? <Check size={12} color="#4ade80" /> : <Copy size={12} />}
                <span>{copiedLogs ? 'COPIED' : 'COPY LOGS'}</span>
              </button>
            </div>
          </div>

          {/* Terminal Console View */}
          <div
            style={{
              padding: '18px 22px',
              minHeight: '400px',
              maxHeight: '560px',
              overflowY: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              lineHeight: '1.6',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* Terminal Header Intro */}
            <div style={{ color: '#94A3B8', borderBottom: '1px dashed #334155', paddingBottom: '8px', fontWeight: 700, fontSize: '11px' }}>
              VECTOR.AI INCIDENT EXECUTION KERNEL v2.4 // SESSION: {activeExecution.id} // SECS-GEM INTERLOCK ACTIVE
            </div>

            {filteredLogs.length === 0 ? (
              <div style={{ color: '#E2E8F0', fontStyle: 'italic', padding: '20px 0' }}>
                No execution logs match the selected filter.
              </div>
            ) : (
              filteredLogs.map((log) => {
                const badge = getSeverityBadge(log.level);
                const hasPayload = log.payload && Object.keys(log.payload).length > 0;
                const isExpanded = expandedPayloadId === log.id;

                return (
                  <div
                    key={log.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px',
                      padding: '10px 14px',
                      backgroundColor: log.level === 'REASONING' ? 'rgba(88, 28, 135, 0.25)' : log.level === 'ACTION' ? 'rgba(30, 58, 138, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      borderLeft: `4px solid ${badge.border}`,
                    }}
                  >
                    {/* Log Line Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ color: '#94A3B8', fontSize: '11px', fontWeight: 600 }}>
                        {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>

                      <span
                        style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          backgroundColor: badge.bg,
                          border: `1px solid ${badge.border}`,
                          color: badge.color,
                          fontWeight: 800,
                          borderRadius: '2px',
                        }}
                      >
                        [{badge.label}]
                      </span>

                      <span style={{ color: '#60A5FA', fontWeight: 700 }}>
                        [{log.subsystem}]
                      </span>

                      <span style={{ color: '#F8FAFC', flex: 1, fontWeight: 500 }}>
                        {log.message}
                      </span>

                      {hasPayload && (
                        <button
                          onClick={() => setExpandedPayloadId(isExpanded ? null : log.id)}
                          style={{
                            fontSize: '10px',
                            fontFamily: 'var(--font-mono)',
                            padding: '2px 8px',
                            backgroundColor: '#0F172A',
                            color: '#38BDF8',
                            border: '1px solid #0284C7',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 700,
                            borderRadius: '2px',
                          }}
                        >
                          <FileCode size={11} />
                          <span>{isExpanded ? 'HIDE JSON' : 'INSPECT PAYLOAD'}</span>
                        </button>
                      )}
                    </div>

                    {/* AI Reasoning Callout Box */}
                    {log.reasoningNote && (
                      <div
                        style={{
                          margin: '4px 0 2px 20px',
                          padding: '8px 12px',
                          backgroundColor: '#2E1065',
                          border: '1px solid #A855F7',
                          borderRadius: '2px',
                          color: '#FAF5FF',
                          fontSize: '11.5px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          lineHeight: '1.5',
                        }}
                      >
                        <Bot size={15} style={{ flexShrink: 0, marginTop: '2px', color: '#D8B4FE' }} />
                        <div>
                          <strong style={{ color: '#E9D5FF', fontWeight: 800 }}>AI DECISION REASONING:</strong>{' '}
                          <span style={{ color: '#F3E8FF' }}>{log.reasoningNote}</span>
                        </div>
                      </div>
                    )}

                    {/* Expandable JSON Payload */}
                    {isExpanded && hasPayload && (
                      <div
                        style={{
                          margin: '4px 0 2px 20px',
                          padding: '10px 14px',
                          backgroundColor: '#020617',
                          border: '1px solid #38BDF8',
                          borderRadius: '2px',
                          fontSize: '11px',
                          color: '#7DD3FC',
                          overflowX: 'auto',
                        }}
                      >
                        <pre style={{ margin: 0, fontFamily: 'var(--font-mono)' }}>
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            <div ref={terminalEndRef} />
          </div>
        </div>
      )}

      {/* ── TAB 3: TOPOLOGY & AGV FLOW SCHEMATIC ── */}
      {activeTab === 'topology' && activeExecution && (
        <div style={{ padding: '24px', backgroundColor: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1.5px solid var(--border-strong)', paddingBottom: '12px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                CLEANROOM PRODUCTION CELL // DYNAMIC DIVERSION TOPOLOGY
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Spatial routing corridor between faulted station <strong>{activeExecution.sourceMachineId}</strong> and assigned buffer node <strong>{activeExecution.targetMachineId}</strong>.
              </div>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('vfactory', activeExecution.sourceMachineId)}
              className="tech-btn"
              style={{ fontSize: '11px', padding: '6px 12px', border: '1px solid var(--border-strong)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
            >
              <Radio size={13} />
              <span>OPEN FACTORY FLOOR TWIN</span>
            </button>
          </div>

          {/* Graphical Stage Map */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              alignItems: 'center',
            }}
          >
            {/* Source Node (Isolated) */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--accent-red)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 800, color: 'var(--accent-red)' }}>
                  {activeExecution.sourceMachineId}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    padding: '2px 7px',
                    backgroundColor: 'var(--accent-red)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    borderRadius: '2px',
                  }}
                >
                  LOCKOUT / DRAIN
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>
                {activeExecution.sourceMachineName}
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Status: INTAKE DISABLED • Cycle Drain: 100%
              </div>
              <div
                style={{
                  fontSize: '11px',
                  backgroundColor: 'var(--bg-surface)',
                  padding: '8px',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                  lineHeight: '1.4',
                }}
              >
                <strong>Trigger:</strong> {activeExecution.triggerFaultType}
              </div>
            </div>

            {/* AGV Transfer Corridor (Center) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '20px',
                border: '1px dashed var(--border-strong)',
                backgroundColor: 'var(--bg-card)',
              }}
            >
              <Truck size={28} color="var(--accent-blue)" />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 800, color: 'var(--accent-blue)' }}>
                AMHS ROBOTIC DISPATCH CORRIDOR
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-primary)', textAlign: 'center', fontWeight: 600 }}>
                Active AGV Carriers: {activeExecution.affectedLots.map((l) => l.agvCarrierId).join(', ')}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  padding: '4px 10px',
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  color: 'var(--accent-blue)',
                  border: '1px solid #2563eb',
                  fontWeight: 700,
                }}
              >
                Transit Window: 45s (Collision-free)
              </div>
            </div>

            {/* Target Node (Active Buffer) */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--accent-green)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 800, color: 'var(--accent-green)' }}>
                  {activeExecution.targetMachineId}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    padding: '2px 7px',
                    backgroundColor: 'var(--accent-green)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    borderRadius: '2px',
                  }}
                >
                  INGESTION ACTIVE
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>
                {activeExecution.targetMachineName}
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Recipe: SYNCHRONIZED • Post-Load: {activeExecution.metrics.targetCapacityPostLoadPercent}%
              </div>
              <div
                style={{
                  fontSize: '11px',
                  backgroundColor: 'var(--bg-surface)',
                  padding: '8px',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                }}
              >
                <strong style={{ color: 'var(--accent-green)' }}>Telemetry:</strong> Nominal Baseline (98% Health)
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DashboardRerouteExecutionSection;
