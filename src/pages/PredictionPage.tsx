import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Activity,
  Clock,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  Cpu,
  RefreshCw,
  AlertCircle,
  Wifi
} from 'lucide-react';
import { useMachines } from '../features/machines/hooks/useMachines';
import { Machine } from '../features/machines/types/machine';
import { MACHINE_TYPES, MachineTypeId } from '../features/machines/data/machineTypes';
import { MachineIcon } from '../features/machines/components/MachineIcon';
import { MachineStatusBadge } from '../features/machines/components/MachineStatusBadge';
import { getHealthScoreColor } from '../features/machines/utils/machineStatus';
import { PredictionDetail } from '../features/prediction/components/PredictionDetail';

// ─── Types ────────────────────────────────────────────────────────────────────

type SortField = 'healthScore' | 'name' | 'rul' | 'status';
type SortDir   = 'asc' | 'desc';
interface SortState { field: SortField; dir: SortDir; }

type TypeFilter = 'all' | MachineTypeId;
type QuickFilter = 'all' | 'critical' | 'warning' | 'min_rul' | 'imminent_failure';

// ─── Degradation stage colors ─────────────────────────────────────────────────

const DEGRADATION_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  'Normal':           { bg: 'rgba(22, 163, 74, 0.10)',  border: '#16A34A', text: '#16A34A' },
  'Early Drift':      { bg: 'rgba(217, 119, 6, 0.12)',  border: '#D97706', text: '#B45309' },
  'Accelerated Wear': { bg: 'rgba(220, 38, 38, 0.10)',  border: '#DC2626', text: '#DC2626' },
  'Imminent Failure': { bg: 'rgba(220, 38, 38, 0.20)',  border: '#7F1D1D', text: '#B91C1C' }
};

// ─── Machine type filter buttons config ───────────────────────────────────────

const TYPE_FILTERS: { id: TypeFilter; label: string }[] = [
  { id: 'all',         label: 'All Machines' },
  { id: 'wafer_dicing', label: 'Wafer Dicing' },
  { id: 'die_attacher', label: 'Die Attacher' },
  { id: 'wire_bonder',  label: 'Wire Bonder' },
  { id: 'molding',      label: 'Molding' },
  { id: 'ic_tester',    label: 'IC Tester' }
];

// ─── Utilities ────────────────────────────────────────────────────────────────

function formatRUL(machine: Machine): string {
  const { value, unit } = machine.rul;
  return unit === 'hours' ? `${value.toLocaleString()} hrs` : `${value.toLocaleString()} days`;
}

function getRulUrgencyColor(rul: Machine['rul']): string {
  const d = rul.estimatedDays;
  if (d <= 3)  return '#DC2626';
  if (d <= 14) return '#D97706';
  return '#16A34A';
}

function applyFilterAndSort(machines: Machine[], allMachines: Machine[], typeFilter: TypeFilter, quickFilter: QuickFilter, sort: SortState): Machine[] {
  let filtered = typeFilter === 'all'
    ? machines
    : machines.filter((m) => m.machineType === typeFilter);

  if (quickFilter !== 'all') {
    if (quickFilter === 'critical') {
      filtered = filtered.filter(m => m.status === 'critical');
    } else if (quickFilter === 'warning') {
      filtered = filtered.filter(m => m.status === 'warning');
    } else if (quickFilter === 'imminent_failure') {
      filtered = filtered.filter(m => m.rul.degradationStage === 'Imminent Failure');
    } else if (quickFilter === 'min_rul') {
      const minRulValue = Math.min(...allMachines.map(m => m.rul.estimatedDays));
      filtered = filtered.filter(m => m.rul.estimatedDays === minRulValue);
    }
  }

  return [...filtered].sort((a, b) => {
    let cmp = 0;
    switch (sort.field) {
      case 'healthScore': cmp = a.healthScore - b.healthScore; break;
      case 'name':        cmp = a.id.localeCompare(b.id);     break;
      case 'rul':         cmp = a.rul.estimatedDays - b.rul.estimatedDays; break;
      case 'status': {
        const order = ['critical', 'warning', 'maintenance', 'offline', 'healthy'];
        cmp = order.indexOf(a.status) - order.indexOf(b.status);
        break;
      }
    }
    return sort.dir === 'asc' ? cmp : -cmp;
  });
}

// ─── Health Ring ──────────────────────────────────────────────────────────────

const HealthRing: React.FC<{ score: number; size?: number }> = ({ score, size = 42 }) => {
  const { color } = getHealthScoreColor(score);
  const r = (size - 6) / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (score / 100) * circumference;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-muted)" strokeWidth={5} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeLinecap="butt"
          strokeDasharray={`${dash} ${circumference - dash}`}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '11px',
        fontWeight: 800, color, letterSpacing: '-0.02em' }}>
        {score}
      </div>
    </div>
  );
};

// ─── RUL Bar ──────────────────────────────────────────────────────────────────

const RULBar: React.FC<{ machine: Machine }> = ({ machine }) => {
  const pct = Math.min(machine.rul.confidence * 100, 100);
  const urgencyColor = getRulUrgencyColor(machine.rul);
  const stageCfg = DEGRADATION_COLORS[machine.rul.degradationStage] || DEGRADATION_COLORS['Normal'];
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 700,
        color: urgencyColor, fontVariantNumeric: 'tabular-nums' }}>
        {formatRUL(machine)}
        <span style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '4px' }}>
          (~{machine.rul.estimatedDays}d)
        </span>
      </div>
      <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg-muted)',
        borderRadius: '1px', overflow: 'hidden', marginTop: '4px' }}>
        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: urgencyColor,
          opacity: 0.7, transition: 'width 0.4s ease' }} />
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '5px',
        padding: '1px 6px', border: `1px solid ${stageCfg.border}`,
        backgroundColor: stageCfg.bg, fontSize: '9px', fontFamily: 'var(--font-mono)',
        fontWeight: 700, color: stageCfg.text, letterSpacing: '0.05em',
        textTransform: 'uppercase' as const }}>
        {machine.rul.degradationStage === 'Imminent Failure' && <AlertTriangle size={8} />}
        {machine.rul.degradationStage}
      </div>
    </div>
  );
};

// ─── Rank Badge ───────────────────────────────────────────────────────────────

const RankBadge: React.FC<{ rank: number; total: number }> = ({ rank, total }) => {
  const pct = rank / total;
  const bg    = pct <= 0.25 ? 'rgba(220,38,38,0.12)' : pct <= 0.55 ? 'rgba(217,119,6,0.12)' : 'rgba(107,114,128,0.10)';
  const color = pct <= 0.25 ? '#DC2626'               : pct <= 0.55 ? '#D97706'               : 'var(--text-muted)';
  return (
    <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', backgroundColor: bg, border: `1.5px solid ${color}`,
      fontFamily: 'var(--font-display)', fontSize: rank <= 3 ? '12px' : '11px',
      fontWeight: 800, color, flexShrink: 0 }}>
      {rank}
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps { label: string; value: string | number; sub?: string; color?: string; icon: React.ReactNode; onClick?: () => void; active?: boolean; }

const StatCard: React.FC<StatCardProps> = ({ label, value, sub, color, icon, onClick, active }) => (
  <div onClick={onClick} style={{ backgroundColor: active ? 'var(--bg-muted)' : 'var(--bg-card)', border: `1.5px solid ${active ? color || 'var(--border-strong)' : 'var(--border-strong)'}`,
    boxShadow: active ? 'none' : '2px 2px 0px rgba(18,19,21,0.05)', padding: '12px 14px',
    flex: '1 1 140px', minWidth: 0, cursor: onClick ? 'pointer' : 'default', transition: 'all var(--transition-fast)' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
      <span style={{ fontSize: '9.5px', fontFamily: 'var(--font-mono)', fontWeight: 700,
        color: 'var(--text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase' as const }}>
        {label}
      </span>
      <span style={{ color: color || 'var(--text-muted)', opacity: 0.8 }}>{icon}</span>
    </div>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800,
      color: color || 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.01em',
      fontVariantNumeric: 'tabular-nums' }}>
      {value}
    </div>
    {sub && (
      <div style={{ fontSize: '10px', fontFamily: 'var(--font-sans)', color: 'var(--text-muted)',
        marginTop: '3px', fontWeight: 500 }}>
        {sub}
      </div>
    )}
  </div>
);

// ─── Sortable column header ───────────────────────────────────────────────────

interface SortThProps {
  label: string;
  field: SortField;
  sort: SortState;
  onSort: (f: SortField) => void;
  align?: 'left' | 'center' | 'right';
}

const SortTh: React.FC<SortThProps> = ({ label, field, sort, onSort, align = 'left' }) => {
  const active = sort.field === field;
  return (
    <th
      onClick={() => onSort(field)}
      style={{
        padding: '10px 14px',
        cursor: 'pointer',
        userSelect: 'none',
        whiteSpace: 'nowrap' as const,
        textAlign: align,
        // Active column gets a subtle highlight that disappears on next click
        color: active ? 'var(--text-primary)' : 'var(--text-muted)'
      }}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
        <span>{label}</span>
        <span style={{ display: 'flex', opacity: active ? 1 : 0.5 }}>
          {active
            ? (sort.dir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />)
            : <ChevronsUpDown size={11} />}
        </span>
      </div>
    </th>
  );
};

// ─── Static (non-sortable) column header ─────────────────────────────────────

const StaticTh: React.FC<{ label: string; align?: 'left' | 'center' | 'right' }> = ({ label, align = 'left' }) => (
  <th style={{ padding: '10px 14px', whiteSpace: 'nowrap' as const, textAlign: align,
    color: 'var(--text-muted)', cursor: 'default' }}>
    {label}
  </th>
);

// ─── Prediction Row ───────────────────────────────────────────────────────────

interface PredictionRowProps { machine: Machine; rank: number; total: number; onClick: (id: string) => void; }

const PredictionRow: React.FC<PredictionRowProps> = ({ machine, rank, total, onClick }) => {
  const typeDef = MACHINE_TYPES[machine.machineType];
  const typeName = typeDef ? typeDef.shortName : machine.machineType;
  const { color: healthColor } = getHealthScoreColor(machine.healthScore);
  const activeAnomalies = machine.anomalies.filter((a) => a.status === 'active').length;

  return (
    <tr
      onClick={() => onClick(machine.id)}
      style={{ borderBottom: '1px solid var(--border-light)', transition: 'background-color var(--transition-fast)', cursor: 'pointer' }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-surface)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      {/* # Rank */}
      <td style={{ padding: '12px 14px', width: '52px' }}>
        <RankBadge rank={rank} total={total} />
      </td>

      {/* Machine */}
      <td style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', backgroundColor: 'var(--bg-dark)',
            color: 'var(--text-inverted)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0 }}>
            <MachineIcon type={machine.machineType} size={14} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800,
              color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
              {machine.id}
            </div>
            <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-sans)',
              color: 'var(--text-muted)', fontWeight: 500, marginTop: '1px' }}>
              {typeName} · {machine.location.area}
            </div>
          </div>
        </div>
      </td>

      {/* Health Score */}
      <td style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <HealthRing score={machine.healthScore} />
          <div>
            <div style={{ width: '80px', height: '5px', backgroundColor: 'var(--bg-muted)',
              borderRadius: '1px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.max(machine.healthScore, 2)}%`, height: '100%',
                backgroundColor: healthColor, transition: 'width 0.4s ease' }} />
            </div>
            <div style={{ fontSize: '9.5px', fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)', marginTop: '3px', letterSpacing: '0.04em' }}>/ 100</div>
          </div>
        </div>
      </td>

      {/* Status */}
      <td style={{ padding: '12px 14px' }}>
        <MachineStatusBadge status={machine.status} size="sm" />
      </td>

      {/* RUL */}
      <td style={{ padding: '12px 14px', minWidth: '160px' }}>
        <RULBar machine={machine} />
      </td>

      {/* Anomalies */}
      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
        {activeAnomalies > 0 ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '2px 8px', backgroundColor: 'rgba(220,38,38,0.10)',
            border: '1.5px solid #DC2626', fontSize: '11px', fontFamily: 'var(--font-mono)',
            fontWeight: 700, color: '#DC2626' }}>
            <AlertTriangle size={10} />
            {activeAnomalies}
          </div>
        ) : (
          <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)' }}>—</span>
        )}
      </td>

      {/* Next Maintenance */}
      <td style={{ padding: '12px 14px' }}>
        <div style={{ fontSize: '11.5px', fontFamily: 'var(--font-sans)',
          color: 'var(--text-secondary)', fontWeight: 500 }}>
          {machine.maintenance.nextScheduledDate}
        </div>
        <div style={{ fontSize: '9.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
          marginTop: '2px', letterSpacing: '0.03em', textTransform: 'uppercase' as const }}>
          {machine.maintenance.type}
        </div>
      </td>

      {/* Confidence — non-interactive, right-aligned */}
      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700,
          color: getRulUrgencyColor(machine.rul), fontVariantNumeric: 'tabular-nums' }}>
          {Math.round(machine.rul.confidence * 100)}%
        </span>
      </td>
    </tr>
  );
};


// ─── Main Page ────────────────────────────────────────────────────────────────

export const PredictionPage: React.FC = () => {
  const { machines, loading, error, refetch, isRealTime } = useMachines();

  // Selection state for master-detail view
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);

  // Sort: default health score ascending (lowest first = highest risk)
  const [sort, setSort] = useState<SortState>({ field: 'healthScore', dir: 'asc' });

  // Machine type filter
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  // Quick stat filter
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');

  const handleSort = (field: SortField) => {
    setSort((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { field, dir: 'asc' }
    );
  };

  const sorted = useMemo(
    () => applyFilterAndSort(machines, machines, typeFilter, quickFilter, sort),
    [machines, typeFilter, quickFilter, sort]
  );

  const stats = useMemo(() => {
    if (!machines.length) return null;
    return {
      critical:        machines.filter((m) => m.status === 'critical').length,
      warning:         machines.filter((m) => m.status === 'warning').length,
      avgHealth:       Math.round(machines.reduce((s, m) => s + m.healthScore, 0) / machines.length),
      minRUL:          Math.min(...machines.map((m) => m.rul.estimatedDays)),
      imminentFailure: machines.filter((m) => m.rul.degradationStage === 'Imminent Failure').length
    };
  }, [machines]);

  if (selectedMachineId) {
    const selectedMachine = machines.find(m => m.id === selectedMachineId);
    if (selectedMachine) {
      return <PredictionDetail machine={selectedMachine} onBack={() => setSelectedMachineId(null)} />;
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>

      {/* ══════════════════════════════════════════
          TOP SECTION — fixed, never scrolls
      ══════════════════════════════════════════ */}
      <div style={{ flexShrink: 0 }}>

        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '10px', padding: '14px 0 12px',
          borderBottom: '1.5px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '3px', height: '22px', backgroundColor: 'var(--accent-red)', flexShrink: 0 }} />
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 800,
                color: 'var(--text-primary)', letterSpacing: '0.04em',
                textTransform: 'uppercase' as const, lineHeight: 1.1 }}>
                Predictive Health Ranking
              </h1>
              <p style={{ fontSize: '11.5px', fontFamily: 'var(--font-sans)',
                color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>
                Machines ranked by health score — lowest score = highest failure risk
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px',
              border: '1.5px solid var(--border-light)', backgroundColor: 'var(--bg-card)',
              fontSize: '9.5px', fontFamily: 'var(--font-mono)', fontWeight: 700,
              color: isRealTime ? '#16A34A' : 'var(--text-muted)', letterSpacing: '0.05em' }}>
              <Wifi size={10} />
              {isRealTime ? 'LIVE' : 'CACHED'}
            </div>
            <button onClick={refetch} style={{ display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', border: '1.5px solid var(--border-strong)',
              backgroundColor: 'var(--bg-dark)', color: 'var(--text-inverted)',
              fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700,
              letterSpacing: '0.05em', cursor: 'pointer' }}>
              <RefreshCw size={11} />
              REFRESH
            </button>
          </div>
        </div>

        {/* Summary Stat Cards */}
        {stats && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', padding: '12px 0' }}>
            <StatCard label="Critical"        value={stats.critical}        sub="Immediate action" color="#DC2626" icon={<AlertCircle size={13} />} onClick={() => setQuickFilter(quickFilter === 'critical' ? 'all' : 'critical')} active={quickFilter === 'critical'} />
            <StatCard label="Warning"         value={stats.warning}         sub="Anomaly detected" color="#D97706" icon={<AlertTriangle size={13} />} onClick={() => setQuickFilter(quickFilter === 'warning' ? 'all' : 'warning')} active={quickFilter === 'warning'} />
            <StatCard label="Avg Health"      value={`${stats.avgHealth}`}  sub="Fleet-wide"       color={getHealthScoreColor(stats.avgHealth).color} icon={<Activity size={13} />} />
            <StatCard label="Min RUL"         value={`${stats.minRUL}d`}    sub="Shortest life left"
              color={stats.minRUL <= 3 ? '#DC2626' : stats.minRUL <= 14 ? '#D97706' : undefined}
              icon={<Clock size={13} />} onClick={() => setQuickFilter(quickFilter === 'min_rul' ? 'all' : 'min_rul')} active={quickFilter === 'min_rul'} />
            <StatCard label="Imminent Failure" value={stats.imminentFailure} sub="Critical stage"
              color={stats.imminentFailure > 0 ? '#DC2626' : undefined} icon={<Cpu size={13} />} onClick={() => setQuickFilter(quickFilter === 'imminent_failure' ? 'all' : 'imminent_failure')} active={quickFilter === 'imminent_failure'} />
          </div>
        )}

        {/* Machine Type Filter + count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '8px', padding: '10px 12px',
          backgroundColor: 'var(--bg-card)', border: '1.5px solid var(--border-light)',
          marginBottom: '0' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' as const }}>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700,
              color: 'var(--text-muted)', letterSpacing: '0.06em', marginRight: '4px' }}>
              MACHINE TYPE
            </span>
            {TYPE_FILTERS.map(({ id, label }) => {
              const active = typeFilter === id;
              return (
                <button
                  key={id}
                  onClick={() => setTypeFilter(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '5px 10px', fontSize: '10px', fontFamily: 'var(--font-mono)',
                    fontWeight: 700, letterSpacing: '0.04em', cursor: 'pointer',
                    border: `1.5px solid ${active ? 'var(--border-strong)' : 'var(--border-light)'}`,
                    backgroundColor: active ? 'var(--bg-dark)' : 'var(--bg-card)',
                    color: active ? 'var(--text-inverted)' : 'var(--text-secondary)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {id !== 'all' && (
                    <span style={{ opacity: 0.7, display: 'flex' }}>
                      <MachineIcon type={id as MachineTypeId} size={10} />
                    </span>
                  )}
                  {label}
                </button>
              );
            })}
          </div>

          {!loading && (
            <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)', letterSpacing: '0.04em', flexShrink: 0 }}>
              {sorted.length} / {machines.length} MACHINES
            </span>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SCROLL AREA — single table, sticky thead
      ══════════════════════════════════════════ */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '8px' }}>
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="animate-pulse" style={{ height: '64px',
                backgroundColor: 'var(--bg-card)', border: '1.5px solid var(--border-light)' }} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="tech-card" style={{ marginTop: '16px', padding: '32px',
            textAlign: 'center', backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--accent-red)' }}>
            <AlertCircle size={32} color="var(--accent-red)" style={{ margin: '0 auto 10px auto' }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700,
              color: 'var(--accent-red)', marginBottom: '6px' }}>
              UNABLE TO LOAD PREDICTION DATA
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '14px' }}>
              {error.message}
            </p>
            <button onClick={refetch} style={{ padding: '6px 14px',
              border: '1.5px solid var(--accent-red)', backgroundColor: 'transparent',
              color: 'var(--accent-red)', fontSize: '11px', fontFamily: 'var(--font-mono)',
              fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em' }}>
              RETRY
            </button>
          </div>
        )}

        {/* ── Single table: sticky thead + tbody in one element = perfect alignment ── */}
        {!loading && !error && sorted.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left',
            backgroundColor: 'var(--bg-card)',
            border: '1.5px solid var(--border-strong)' }}>

            {/* Sticky header — scrolls with table container, never detaches */}
            <thead style={{ position: 'sticky', top: 0, zIndex: 5 }}>
              <tr style={{
                backgroundColor: 'var(--bg-surface)',
                borderBottom: '1.5px solid var(--border-strong)',
                fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase' as const
              }}>
                {/* # — static */}
                <StaticTh label="#" />
                {/* Sortable columns */}
                <SortTh label="Machine"        field="name"        sort={sort} onSort={handleSort} />
                <SortTh label="Health Score"   field="healthScore" sort={sort} onSort={handleSort} />
                <SortTh label="Status"         field="status"      sort={sort} onSort={handleSort} />
                <SortTh label="RUL Prediction" field="rul"         sort={sort} onSort={handleSort} />
                {/* Non-sortable columns */}
                <StaticTh label="Anomalies"       align="center" />
                <StaticTh label="Next Maintenance" />
                <StaticTh label="Confidence"      align="right" />
              </tr>
            </thead>

            <tbody>
              {sorted.map((machine, idx) => (
                <PredictionRow
                  key={machine.id}
                  machine={machine}
                  rank={idx + 1}
                  total={sorted.length}
                  onClick={setSelectedMachineId}
                />
              ))}
            </tbody>
          </table>
        )}

        {/* Empty */}
        {!loading && !error && sorted.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 16px', color: 'var(--text-muted)',
            fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700,
            letterSpacing: '0.04em' }}>
            NO MACHINES MATCH THIS FILTER
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionPage;
