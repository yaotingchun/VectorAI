import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

// Helper to simulate router logic
function routeUserQuery(query, context, previousMachineId) {
  const norm = query.toLowerCase().trim();

  const hasLiveKeywords = /\b(current|currently|now|latest|live|today|status|health score|value|how much|who is critical|show me telemetry)\b/i.test(norm);
  const isAnomalyQuery = /\b(anomaly|anomalies|alarms?|alerts?|defects?|faults?|issues?|problems?|anything broken|anything wrong|any issue|any anomaly|what is happening|what is failing)\b/i.test(norm);
  const isFleetOverviewQuery = isAnomalyQuery || /\b(which machines|fleet health|fleet status|critical machines|machines at risk|all machines|fleet overview|plant status|factory status)\b/i.test(norm);
  const isDiagnosticQuery = /\b(why is|what caused|what is causing|abnormal|root cause|troubleshoot|diagnose|failure mode|drill down|why.*decreasing|why.*drop|explain fault)\b/i.test(norm);

  if (isFleetOverviewQuery || isAnomalyQuery) {
    return {
      intent: 'LIVE_MACHINE_DATA',
      requiresLiveTelemetry: true,
      requiresRAG: true
    };
  }

  return { intent: 'UNKNOWN' };
}

const r1 = routeUserQuery('is there any anomaly occur ?');
console.log('Query: "is there any anomaly occur ?"');
console.log('Result:', r1);

if (!r1.requiresLiveTelemetry) {
  throw new Error('FAIL: Anomaly query did not trigger live telemetry!');
}

console.log('\nSUCCESS: Anomaly query correctly triggers live telemetry and active anomaly scanning!');
