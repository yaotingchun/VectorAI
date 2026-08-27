import { SEED_MACHINES } from '../src/features/machines/data/seedMachines.ts';

console.log(`Total SEED_MACHINES: ${SEED_MACHINES.length}`);

SEED_MACHINES.forEach(m => {
  const health = m.healthTrend?.['24h']?.[0]?.health || (m as any).healthScore || (m.rul ? Math.round((m.rul.value / (m.rul.criticalThresholdHours * 20)) * 100) : 95);
  const rulHours = m.rul?.value || (m as any).currentRul || 'N/A';
  console.log(`${m.id.padEnd(8)} | Status: ${m.status.padEnd(10)} | Health: ${String(health).padEnd(4)}% | RUL: ${String(rulHours).padEnd(6)}h | Anomalies: ${m.anomalies?.length || 0}`);
});

const critical = SEED_MACHINES.filter(m => m.status === 'critical');
const warning = SEED_MACHINES.filter(m => m.status === 'warning');
const healthy = SEED_MACHINES.filter(m => m.status === 'healthy');

console.log('\n--- Machine Tab Summary ---');
console.log(`Healthy (${healthy.length}):`, healthy.map(m => m.id).join(', '));
console.log(`Warning (${warning.length}):`, warning.map(m => m.id).join(', '));
console.log(`Critical (${critical.length}):`, critical.map(m => m.id).join(', '));
