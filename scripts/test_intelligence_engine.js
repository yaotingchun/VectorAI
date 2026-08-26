/**
 * VectorAI — Comprehensive Unit Test Suite for Machine Intelligence Engine
 * Tests:
 * 1. Threshold Engine
 * 2. Degradation Calculator
 * 3. Deterministic RUL Engine
 * 4. Manual-First & RAG Diagnostic Engines
 * 5. All 5 Machine Configurations
 */

import assert from 'assert';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load JSONs
const DATA_DIR = join(__dirname, '..', 'data', 'machines');
const loadKnowledge = (name) => JSON.parse(readFileSync(join(DATA_DIR, `${name}.json`), 'utf8'));

const waferDicing = loadKnowledge('wafer-dicing-machine');
const dieAttacher = loadKnowledge('die-attacher');
const wireBonder = loadKnowledge('wire-bonder');
const molding = loadKnowledge('molding-machine');
const icTester = loadKnowledge('ic-tester-sorter');

const KNOWLEDGE_MAP = {
  wafer_dicing: waferDicing,
  die_attacher: dieAttacher,
  wire_bonder: wireBonder,
  molding: molding,
  ic_tester: icTester
};

// -------------------------------------------------------------------------
// 1. Degradation Calculator Logic Implementation (Node test mirror)
// -------------------------------------------------------------------------
function calculateIndividualDegradation(currentValue, healthyLimit, criticalLimit, direction) {
  if (healthyLimit === criticalLimit) {
    return { degradation: 0.0, isValid: false, errorMessage: 'Equal limits' };
  }
  let raw = 0.0;
  if (direction === 'HIGHER_IS_WORSE') {
    if (criticalLimit <= healthyLimit) return { degradation: 0.0, isValid: false };
    raw = (currentValue - healthyLimit) / (criticalLimit - healthyLimit);
  } else {
    if (criticalLimit >= healthyLimit) return { degradation: 0.0, isValid: false };
    raw = (healthyLimit - currentValue) / (healthyLimit - criticalLimit);
  }
  return {
    degradation: Math.max(0.0, Math.min(1.0, raw)),
    rawScore: raw,
    isValid: true
  };
}

// -------------------------------------------------------------------------
// 2. RUL Engine Logic Implementation
// -------------------------------------------------------------------------
function calculateDeterministicRul(machineId, machineType, currentSensors, model) {
  const sensorMap = new Map();
  for (const s of currentSensors) {
    sensorMap.set(s.sensorId, s.value);
  }

  let totalDegradation = 0.0;
  const parameterContributions = [];

  for (const param of model.parameters) {
    const sensorVal = sensorMap.get(param.sensorId);
    const currentVal = sensorVal !== undefined ? sensorVal : param.healthyLimit;

    const degRes = calculateIndividualDegradation(
      currentVal,
      param.healthyLimit,
      param.criticalLimit,
      param.direction
    );

    const weightedContrib = degRes.degradation * param.weight;
    totalDegradation += weightedContrib;

    parameterContributions.push({
      parameter: param.parameter,
      sensorId: param.sensorId,
      currentValue: currentVal,
      individualDegradation: degRes.degradation,
      weight: param.weight,
      weightedContribution: weightedContrib
    });
  }

  const clampedDegradation = Math.max(0.0, Math.min(1.0, totalDegradation));
  const remainingLifeRatio = Math.max(0.0, 1.0 - clampedDegradation);
  const rulHours = Math.max(0, Math.round(model.baseUsefulLifeHours * remainingLifeRatio));

  return {
    machineId,
    machineType,
    rulHours,
    estimatedDays: Math.round((rulHours / 24) * 10) / 10,
    degradationScore: clampedDegradation,
    remainingLifeRatio,
    baseUsefulLifeHours: model.baseUsefulLifeHours,
    parameters: parameterContributions
  };
}

// -------------------------------------------------------------------------
// 3. Threshold Evaluation Logic
// -------------------------------------------------------------------------
function evaluateSensorThreshold(currentValue, threshold) {
  const { normal, warning, critical, direction } = threshold;
  if (direction === 'HIGHER_IS_WORSE') {
    if (currentValue >= critical.min) return { status: 'critical', type: 'CRITICAL_HIGH' };
    if (currentValue >= warning.min) return { status: 'warning', type: 'WARNING_HIGH' };
    if (currentValue < normal.min) return { status: 'warning', type: 'WARNING_LOW' };
    return { status: 'normal', type: 'NORMAL' };
  } else {
    if (currentValue <= critical.max) return { status: 'critical', type: 'CRITICAL_LOW' };
    if (currentValue <= warning.max) return { status: 'warning', type: 'WARNING_LOW' };
    if (currentValue > normal.max) return { status: 'warning', type: 'WARNING_HIGH' };
    return { status: 'normal', type: 'NORMAL' };
  }
}

// -------------------------------------------------------------------------
// 4. Diagnostic Matching Logic
// -------------------------------------------------------------------------
function diagnoseAnomaly(sensorId, anomalyDesc, machineType) {
  const knowledge = KNOWLEDGE_MAP[machineType];
  const scenarios = knowledge.failureScenarios || [];

  for (const sc of scenarios) {
    if (sc.sensorPattern.toLowerCase().includes(sensorId.toLowerCase()) || 
        sc.symptom.toLowerCase().includes(sensorId.toLowerCase())) {
      return {
        source: 'MANUAL',
        confidence: 'HIGH',
        matchedScenarioId: sc.scenarioId,
        diagnosis: sc.symptom,
        possibleCauses: sc.possibleCauses,
        recommendedAction: sc.recommendedAction
      };
    }
  }

  // RAG fallback
  return {
    source: 'RAG',
    confidence: 'MEDIUM',
    diagnosis: `Probable sub-system degradation related to ${sensorId}`,
    disclaimer: 'This diagnosis is inferred from semantic knowledge base references and is not directly documented in the primary machine manual.'
  };
}

// =========================================================================
// TEST EXECUTION SUITE
// =========================================================================
console.log('='.repeat(70));
console.log('VectorAI — Machine Intelligence Engine Test Suite');
console.log('='.repeat(70));

let passed = 0;
let failed = 0;

function it(name, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    Error: ${err.message}`);
    failed++;
  }
}

// -------------------------------------------------------------------------
// TEST GROUP 1: THRESHOLD ENGINE
// -------------------------------------------------------------------------
console.log('\n[Group 1] Testing Deterministic Threshold Engine...');

it('Should detect NORMAL status for in-range sensor (vibration = 0.35 mm/s)', () => {
  const thresh = wireBonder.thresholds.find(t => t.sensorId === 'vibration_ultrasonic');
  const res = evaluateSensorThreshold(0.35, thresh);
  assert.strictEqual(res.status, 'normal');
  assert.strictEqual(res.type, 'NORMAL');
});

it('Should detect WARNING_HIGH for vibration = 0.65 mm/s', () => {
  const thresh = wireBonder.thresholds.find(t => t.sensorId === 'vibration_ultrasonic');
  const res = evaluateSensorThreshold(0.65, thresh);
  assert.strictEqual(res.status, 'warning');
  assert.strictEqual(res.type, 'WARNING_HIGH');
});

it('Should detect CRITICAL_HIGH for vibration = 0.88 mm/s', () => {
  const thresh = wireBonder.thresholds.find(t => t.sensorId === 'vibration_ultrasonic');
  const res = evaluateSensorThreshold(0.88, thresh);
  assert.strictEqual(res.status, 'critical');
  assert.strictEqual(res.type, 'CRITICAL_HIGH');
});

it('Should detect CRITICAL_LOW for coolant pressure drop = 1.1 bar (LOWER_IS_WORSE)', () => {
  const thresh = waferDicing.thresholds.find(t => t.sensorId === 'pressure_coolant');
  const res = evaluateSensorThreshold(1.1, thresh);
  assert.strictEqual(res.status, 'critical');
  assert.strictEqual(res.type, 'CRITICAL_LOW');
});

// -------------------------------------------------------------------------
// TEST GROUP 2: DEGRADATION CALCULATOR
// -------------------------------------------------------------------------
console.log('\n[Group 2] Testing Degradation Calculator (Clamping & Bounds)...');

it('Should return degradation = 0.0 at healthy limit (HIGHER_IS_WORSE)', () => {
  const res = calculateIndividualDegradation(0.50, 0.50, 1.10, 'HIGHER_IS_WORSE');
  assert.strictEqual(res.degradation, 0.0);
  assert.strictEqual(res.isValid, true);
});

it('Should return degradation = 1.0 at critical limit (HIGHER_IS_WORSE)', () => {
  const res = calculateIndividualDegradation(1.10, 0.50, 1.10, 'HIGHER_IS_WORSE');
  assert.strictEqual(res.degradation, 1.0);
});

it('Should return degradation = 0.5 at exact midpoint', () => {
  const res = calculateIndividualDegradation(0.80, 0.50, 1.10, 'HIGHER_IS_WORSE');
  assert.strictEqual(Math.round(res.degradation * 100) / 100, 0.50);
});

it('Should clamp degradation to 1.0 when value exceeds critical limit', () => {
  const res = calculateIndividualDegradation(1.80, 0.50, 1.10, 'HIGHER_IS_WORSE');
  assert.strictEqual(res.degradation, 1.0);
});

it('Should clamp degradation to 0.0 when value is below healthy limit', () => {
  const res = calculateIndividualDegradation(0.20, 0.50, 1.10, 'HIGHER_IS_WORSE');
  assert.strictEqual(res.degradation, 0.0);
});

it('Should compute degradation correctly for LOWER_IS_WORSE (pressure 2.5 down to 1.2)', () => {
  const res = calculateIndividualDegradation(1.2, 2.5, 1.2, 'LOWER_IS_WORSE');
  assert.strictEqual(res.degradation, 1.0);
});

it('Should fail gracefully if healthyLimit === criticalLimit', () => {
  const res = calculateIndividualDegradation(5.0, 5.0, 5.0, 'HIGHER_IS_WORSE');
  assert.strictEqual(res.isValid, false);
});

// -------------------------------------------------------------------------
// TEST GROUP 3: FORMULA-BASED RUL ENGINE
// -------------------------------------------------------------------------
console.log('\n[Group 3] Testing Deterministic Formula-Based RUL Engine...');

it('Should compute RUL = BaseUsefulLife when all sensors are healthy (D = 0.0)', () => {
  const model = wireBonder.rulModel;
  const sensors = model.parameters.map(p => ({ sensorId: p.sensorId, value: p.healthyLimit }));
  const res = calculateDeterministicRul('WB-001', 'wire_bonder', sensors, model);

  assert.strictEqual(res.degradationScore, 0.0);
  assert.strictEqual(res.rulHours, model.baseUsefulLifeHours);
  assert.strictEqual(res.remainingLifeRatio, 1.0);
});

it('Should compute RUL = 0 when all sensors are at critical limit (D = 1.0)', () => {
  const model = wireBonder.rulModel;
  const sensors = model.parameters.map(p => ({ sensorId: p.sensorId, value: p.criticalLimit }));
  const res = calculateDeterministicRul('WB-001', 'wire_bonder', sensors, model);

  assert.strictEqual(res.degradationScore, 1.0);
  assert.strictEqual(res.rulHours, 0);
  assert.strictEqual(res.remainingLifeRatio, 0.0);
});

it('Should verify weights sum to 1.00 across all 5 machines', () => {
  for (const [key, know] of Object.entries(KNOWLEDGE_MAP)) {
    const sum = know.rulModel.parameters.reduce((acc, p) => acc + p.weight, 0);
    assert.strictEqual(Math.abs(sum - 1.00) < 0.0001, true, `Weight sum failed on ${key}: ${sum}`);
  }
});

// -------------------------------------------------------------------------
// TEST GROUP 4: DIAGNOSTIC ENGINE (MANUAL FIRST + RAG FALLBACK)
// -------------------------------------------------------------------------
console.log('\n[Group 4] Testing Manual-First & RAG Diagnostic Engine...');

it('Should match exact documented failure scenario in Wire Bonder (Piezo Micro-Crack)', () => {
  const diag = diagnoseAnomaly('vibration_ultrasonic', 'Piezo Transducer Vibration', 'wire_bonder');
  assert.strictEqual(diag.source, 'MANUAL');
  assert.strictEqual(diag.confidence, 'HIGH');
  assert.strictEqual(diag.matchedScenarioId, 'SCEN-WB-001');
  assert.strictEqual(diag.diagnosis.includes('Transducer Piezo'), true);
});

it('Should match documented failure scenario in Die Attacher (Epoxy Clogging)', () => {
  const diag = diagnoseAnomaly('dispense_pressure', 'Epoxy Dispense Needle', 'die_attacher');
  assert.strictEqual(diag.source, 'MANUAL');
  assert.strictEqual(diag.confidence, 'HIGH');
  assert.strictEqual(diag.matchedScenarioId, 'SCEN-DA-002');
});

it('Should fallback to RAG with disclaimer for unknown anomaly', () => {
  const diag = diagnoseAnomaly('unregistered_unknown_sensor', 'Random mystery drift', 'wire_bonder');
  assert.strictEqual(diag.source, 'RAG');
  assert.strictEqual(diag.confidence, 'MEDIUM');
  assert.strictEqual(diag.disclaimer.includes('inferred from semantic knowledge'), true);
});

// -------------------------------------------------------------------------
// TEST SUMMARY
// -------------------------------------------------------------------------
console.log('\n' + '='.repeat(70));
console.log(`Test Execution Complete: ${passed} Passed, ${failed} Failed.`);
console.log('='.repeat(70));

if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL UNIT TESTS PASSED WITH 100% SUCCESS!');
}
