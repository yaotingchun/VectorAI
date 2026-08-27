import { SEED_MACHINES } from '../src/features/machines/data/seedMachines.ts';

function getMachineHealth(m) {
  if (typeof m.healthScore === 'number' && m.healthScore > 0) return m.healthScore;
  if (m.healthTrend?.['24h']?.[0]?.health) return m.healthTrend['24h'][0].health;
  if (m.rul?.value) return Math.min(99, Math.round((m.rul.value / (m.rul.criticalThresholdHours || 50)) * 25));
  return 95;
}

function getMachineRul(m) {
  if (typeof m.currentRul === 'number' && m.currentRul > 0) return m.currentRul;
  if (m.rul?.value) return m.rul.value;
  if (m.rul?.estimatedDays) return Math.round(m.rul.estimatedDays * 24);
  return 1200;
}

const allMachines = SEED_MACHINES;

const critical = allMachines.filter(m => {
  const s = String(m.status || '').toLowerCase();
  return s === 'critical' || s === 'error';
});
const warning = allMachines.filter(m => {
  const s = String(m.status || '').toLowerCase();
  return s === 'warning';
});
const healthy = allMachines.filter(m => {
  const s = String(m.status || '').toLowerCase();
  return s === 'healthy' || s === 'running' || s === 'idle';
});

console.log('--- CRITICAL MACHINES ---');
critical.forEach(m => {
  console.log(`• ${m.id} (${m.name}): Health ${getMachineHealth(m)}%, RUL ${getMachineRul(m)}h, Active Anomalies: ${m.anomalies?.map(a => a.type || a.description).join('; ') || 'Critical wear'}`);
});

console.log('\n--- WARNING MACHINES ---');
warning.forEach(m => {
  console.log(`• ${m.id} (${m.name}): Health ${getMachineHealth(m)}%, RUL ${getMachineRul(m)}h, Active Anomalies: ${m.anomalies?.map(a => a.type || a.description).join('; ') || 'Parameter drift'}`);
});

console.log('\n--- HEALTHY MACHINES ---');
console.log(`Total: ${healthy.length} machines (${healthy.map(m => m.id).join(', ')})`);
