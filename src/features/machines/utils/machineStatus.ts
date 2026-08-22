import { MachineStatus } from '../types/machine';

export interface MachineStatusConfig {
  id: MachineStatus;
  label: string;
  shortLabel: string;
  color: string;
  bgLight: string;
  borderColor: string;
  badgeClassName: string;
  dotClassName: string;
  glowColor: string;
  description: string;
}

export const STATUS_CONFIG: Record<MachineStatus, MachineStatusConfig> = {
  healthy: {
    id: 'healthy',
    label: 'HEALTHY',
    shortLabel: 'OK',
    color: '#16A34A', // accent-green
    bgLight: 'rgba(22, 163, 74, 0.12)',
    borderColor: '#16A34A',
    badgeClassName: 'status-healthy',
    dotClassName: 'status-dot pulse',
    glowColor: 'rgba(22, 163, 74, 0.4)',
    description: 'Operating within all nominal tolerance parameters.'
  },
  warning: {
    id: 'warning',
    label: 'WARNING',
    shortLabel: 'WARN',
    color: '#D97706', // accent-amber
    bgLight: 'rgba(217, 119, 6, 0.14)',
    borderColor: '#D97706',
    badgeClassName: 'status-warning',
    dotClassName: 'status-dot amber',
    glowColor: 'rgba(217, 119, 6, 0.45)',
    description: 'Telemetry parameter drift or early anomaly pattern detected.'
  },
  critical: {
    id: 'critical',
    label: 'CRITICAL',
    shortLabel: 'CRIT',
    color: '#DC2626', // accent-red
    bgLight: 'rgba(220, 38, 38, 0.15)',
    borderColor: '#DC2626',
    badgeClassName: 'status-critical',
    dotClassName: 'status-dot critical',
    glowColor: 'rgba(220, 38, 38, 0.5)',
    description: 'Severe threshold breach or imminent mechanical breakdown.'
  },
  offline: {
    id: 'offline',
    label: 'OFFLINE',
    shortLabel: 'OFF',
    color: '#8E939B', // text-muted
    bgLight: 'rgba(142, 147, 155, 0.14)',
    borderColor: '#8E939B',
    badgeClassName: 'status-offline',
    dotClassName: 'status-dot muted',
    glowColor: 'rgba(142, 147, 155, 0.3)',
    description: 'Equipment disconnected or telemetry gateway unreachable.'
  },
  maintenance: {
    id: 'maintenance',
    label: 'MAINTENANCE',
    shortLabel: 'MAINT',
    color: '#2563EB', // accent-blue
    bgLight: 'rgba(37, 99, 235, 0.12)',
    borderColor: '#2563EB',
    badgeClassName: 'status-maintenance',
    dotClassName: 'status-dot blue',
    glowColor: 'rgba(37, 99, 235, 0.4)',
    description: 'Under active scheduled preventive or corrective service.'
  }
};

export function getMachineStatusConfig(status: MachineStatus | string): MachineStatusConfig {
  const s = (status || '').toLowerCase() as MachineStatus;
  return STATUS_CONFIG[s] || STATUS_CONFIG.healthy;
}

export function getHealthScoreColor(score: number): { color: string; status: MachineStatus } {
  if (score >= 85) return { color: '#16A34A', status: 'healthy' };
  if (score >= 60) return { color: '#D97706', status: 'warning' };
  return { color: '#DC2626', status: 'critical' };
}
