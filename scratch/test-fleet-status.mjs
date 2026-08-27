import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

// Load raw machines from data/machines.json (FactoryContext seed)
const factoryMachines = JSON.parse(fs.readFileSync(path.join(root, 'src/data/machines.json'), 'utf-8'));

console.log(`Loaded ${factoryMachines.length} factory machines.`);
console.log('Sample machine statuses:', factoryMachines.map(m => `${m.id}: ${m.status}`).slice(0, 5));

const critical = factoryMachines.filter(m => {
  const s = String(m.status || '').toLowerCase();
  return s === 'critical' || s === 'error';
});
const warning = factoryMachines.filter(m => {
  const s = String(m.status || '').toLowerCase();
  return s === 'warning';
});
const healthy = factoryMachines.filter(m => {
  const s = String(m.status || '').toLowerCase();
  return s === 'healthy' || s === 'running' || s === 'idle';
});
const maint = factoryMachines.filter(m => {
  const s = String(m.status || '').toLowerCase();
  return s === 'maint' || s === 'maintenance';
});
const offline = factoryMachines.filter(m => {
  const s = String(m.status || '').toLowerCase();
  return s === 'offline';
});

console.log('\n--- Status Breakdown ---');
console.log(`Total: ${factoryMachines.length}`);
console.log(`Healthy: ${healthy.length} (${healthy.map(m => m.id).join(', ')})`);
console.log(`Warning: ${warning.length} (${warning.map(m => m.id).join(', ')})`);
console.log(`Critical: ${critical.length} (${critical.map(m => m.id).join(', ')})`);
console.log(`Maintenance: ${maint.length} (${maint.map(m => m.id).join(', ')})`);
console.log(`Offline: ${offline.length} (${offline.map(m => m.id).join(', ')})`);

if (healthy.length + warning.length + critical.length + maint.length + offline.length !== factoryMachines.length) {
  throw new Error('Mismatch in machine count sum!');
}

console.log('\nVERIFIED: Fleet status categorization correctly categorizes all 13 machines!');
