// =========================================================================
// VECTOR.AI — ASSISTANT ORCHESTRATOR
// Multi-Source AI Orchestration Layer (Global RAG + Live Telemetry + Machine Agent)
// =========================================================================

import { GoogleGenAI } from '@google/genai';
import { Machine } from '../../machines/types/machine';
import { getGeminiApiKey } from '../../machines/intelligence';
import {
  AssistantChatRequest,
  AssistantChatResponse,
  AssistantMessage,
  AssistantSourceCitation,
  AssistantDataSourceType,
  AssistantLiveDataBadge,
  AssistantToolActivity,
  AssistantAttachment
} from '../types/assistant';
import { routeUserQuery } from './assistantRouter';
import {
  searchKnowledgeBase,
  getFleetMachines,
  getLatestSensorValues,
  getMachineRulData,
  runMachineDiagnosis,
  getMachineHealth,
  getMachineRul
} from '../tools/assistantTools';

const MANUAL_ATTACHMENT_MAP: Record<string, { id: string; title: string; filename: string; pdfUrl: string; size: string }> = {
  // 11 Canonical Cleanroom V-Factory Models
  'aoi-inspection': {
    id: 'DOC-VAI-MAN-AOI-001',
    title: '3D Optical AOI Metrology & Coplanarity System Technical Manual (PDF)',
    filename: 'aoi-inspection-manual.pdf',
    pdfUrl: '/manuals/aoi-inspection-manual.pdf',
    size: '35 KB'
  },
  'x-ray-inspection': {
    id: 'DOC-VAI-MAN-XR-001',
    title: 'Lead-Shielded Microfocus X-Ray NDT Cell Technical Manual (PDF)',
    filename: 'x-ray-inspection-manual.pdf',
    pdfUrl: '/manuals/x-ray-inspection-manual.pdf',
    size: '36 KB'
  },
  'laser-marking': {
    id: 'DOC-VAI-MAN-LM-001',
    title: 'Galvo Fiber Laser Serialization Marker Technical Manual (PDF)',
    filename: 'laser-marking-manual.pdf',
    pdfUrl: '/manuals/laser-marking-manual.pdf',
    size: '34 KB'
  },
  'stocker': {
    id: 'DOC-VAI-MAN-STK-001',
    title: 'AMHS Automated Cleanroom FOUP Stocker Technical Manual (PDF)',
    filename: 'stocker-manual.pdf',
    pdfUrl: '/manuals/stocker-manual.pdf',
    size: '34 KB'
  },
  'plasma-cleaner': {
    id: 'DOC-VAI-MAN-PC-001',
    title: 'RF Argon & Oxygen Plasma Surface Activation Chamber Technical Manual (PDF)',
    filename: 'plasma-cleaner-manual.pdf',
    pdfUrl: '/manuals/plasma-cleaner-manual.pdf',
    size: '36 KB'
  },
  'tape-reel': {
    id: 'DOC-VAI-MAN-TR-001',
    title: 'Automated High-Speed Tape & Reel Packaging Cell Technical Manual (PDF)',
    filename: 'tape-reel-manual.pdf',
    pdfUrl: '/manuals/tape-reel-manual.pdf',
    size: '35 KB'
  },
  'wafer-saw': {
    id: 'DOC-VAI-MAN-WS-001',
    title: '300mm Precision Wafer Dicing Saw Technical Manual (PDF)',
    filename: 'wafer-saw-manual.pdf',
    pdfUrl: '/manuals/wafer-saw-manual.pdf',
    size: '38 KB'
  },
  'die-attach': {
    id: 'DOC-VAI-MAN-DA-001',
    title: 'High-Precision Epoxy & Eutectic Die Bonder Technical Manual (PDF)',
    filename: 'die-attach-manual.pdf',
    pdfUrl: '/manuals/die-attach-manual.pdf',
    size: '39 KB'
  },
  'wire-bonding': {
    id: 'DOC-VAI-MAN-WB-001',
    title: 'High-Speed Thermosonic Ball Bonder Technical Manual (PDF)',
    filename: 'wire-bonding-manual.pdf',
    pdfUrl: '/manuals/wire-bonding-manual.pdf',
    size: '41 KB'
  },
  'molding-press': {
    id: 'DOC-VAI-MAN-MP-001',
    title: 'Multi-Cavity Auto Molding Encapsulation Press Technical Manual (PDF)',
    filename: 'molding-press-manual.pdf',
    pdfUrl: '/manuals/molding-press-manual.pdf',
    size: '37 KB'
  },
  'test-handler': {
    id: 'DOC-VAI-MAN-TH-001',
    title: 'Tri-Temp High-Throughput IC Test Handler Technical Manual (PDF)',
    filename: 'test-handler-manual.pdf',
    pdfUrl: '/manuals/test-handler-manual.pdf',
    size: '38 KB'
  },

  // Legacy & Alias types for backward compatibility
  'wire_bonder': {
    id: 'DOC-VAI-MAN-WB-001',
    title: 'High-Speed Thermosonic Ball Bonder Technical Manual (PDF)',
    filename: 'wire-bonder-manual.pdf',
    pdfUrl: '/manuals/wire-bonder-manual.pdf',
    size: '41 KB'
  },
  'die_attacher': {
    id: 'DOC-VAI-MAN-DA-001',
    title: 'High-Precision Epoxy & Eutectic Die Bonder Technical Manual (PDF)',
    filename: 'die-attacher-manual.pdf',
    pdfUrl: '/manuals/die-attacher-manual.pdf',
    size: '39 KB'
  },
  'wafer_dicing': {
    id: 'DOC-VAI-MAN-DIC-001',
    title: '300mm Precision Wafer Dicing Saw Technical Manual (PDF)',
    filename: 'wafer-dicing-machine-manual.pdf',
    pdfUrl: '/manuals/wafer-dicing-machine-manual.pdf',
    size: '38 KB'
  },
  'molding': {
    id: 'DOC-VAI-MAN-MOLD-001',
    title: 'Multi-Cavity Auto Molding Encapsulation Press Technical Manual (PDF)',
    filename: 'molding-machine-manual.pdf',
    pdfUrl: '/manuals/molding-machine-manual.pdf',
    size: '37 KB'
  },
  'ic_tester': {
    id: 'DOC-VAI-MAN-ATE-001',
    title: 'Tri-Temp High-Throughput IC Test Handler Technical Manual (PDF)',
    filename: 'ic-tester-sorter-manual.pdf',
    pdfUrl: '/manuals/ic-tester-sorter-manual.pdf',
    size: '38 KB'
  }
};

/**
 * Main orchestration entrypoint for processing user messages.
 */
export async function orchestrateAssistantQuery(
  request: AssistantChatRequest,
  liveMachinesOverride?: Machine[],
  previousMachineId?: string | null
): Promise<AssistantChatResponse> {
  const conversationId = request.conversationId || `conv-${Date.now()}`;
  const query = request.message.trim();
  const context = request.context;

  if (!query) {
    return {
      conversationId,
      intent: 'UNKNOWN',
      sources: [],
      dataSources: [],
      message: {
        id: `msg-${Date.now()}`,
        conversationId,
        role: 'assistant',
        content: "I didn't receive a question. How can I assist you with VectorAI, machine telemetry, or RUL predictions today?",
        createdAt: new Date().toISOString()
      }
    };
  }

  // 1. Analyze Intent & Determine Route
  const route = routeUserQuery(query, context, previousMachineId);
  const dataSources: AssistantDataSourceType[] = [];
  const sources: AssistantSourceCitation[] = [];
  const liveBadges: AssistantLiveDataBadge[] = [];
  const toolActivities: AssistantToolActivity[] = [];

  let liveMachineDataSummary = '';
  let machineAgentDiagnosisSummary = '';
  let ragKnowledgeSummary = '';

  // ─────────────────────────────────────────────────────────────────────────
  // 2. EXECUTE REQUIRED TOOLS BASED ON ROUTE
  // ─────────────────────────────────────────────────────────────────────────

  // Tool 1: Live Telemetry & Machine Fleet Status
  if (route.requiresLiveTelemetry) {
    if (route.targetMachineId) {
      toolActivities.push({
        toolName: 'Live Telemetry & RUL Service',
        description: `Querying live sensor streams and formula RUL for ${route.targetMachineId}...`,
        status: 'running',
        dataSources: ['LIVE_TELEMETRY', 'DETERMINISTIC_RUL']
      });

      const sensorData = await getLatestSensorValues(route.targetMachineId, liveMachinesOverride);
      const rulData = await getMachineRulData(route.targetMachineId, liveMachinesOverride);

      if (sensorData && rulData) {
        dataSources.push('LIVE_TELEMETRY', 'DETERMINISTIC_RUL');
        const m = sensorData.machine;
        const health = getMachineHealth(m);
        const rulHours = getMachineRul(m);

        liveBadges.push(
          { machineId: m.id, metric: 'Status', value: m.status.toUpperCase(), status: m.status === 'healthy' ? 'normal' : m.status as any },
          { machineId: m.id, metric: 'Health Score', value: `${health}%`, unit: '%' },
          { machineId: m.id, metric: 'Formula RUL', value: `${rulHours} hrs`, unit: 'hours' }
        );

        sensorData.sensors.forEach(s => liveBadges.push(s));

        liveMachineDataSummary = `
CURRENT LIVE MACHINE STATE:
• Machine: ${m.name} (${m.id})
• Operational Status: ${m.status.toUpperCase()}
• Health Score: ${health}%
• Calculated Formula RUL: ${rulHours} operating hours (Degradation: ${rulData.degradationPercentage}%, Reliability: ${rulData.modelReliability})
• RUL Formula: ${rulData.formula}
• Live Sensor Readings:
${sensorData.sensors.map(s => `  - ${s.metric}: ${s.value} ${s.unit || ''} (Status: ${s.status?.toUpperCase() || 'NORMAL'})`).join('\n')}
• Active Machine Anomalies: ${m.anomalies && m.anomalies.length > 0 ? m.anomalies.map(a => `${a.sensor} (${a.severity.toUpperCase()}): ${a.description}`).join('; ') : 'None detected'}`;
      } else {
        liveMachineDataSummary = `Machine '${route.targetMachineId}' was not found in the active factory registry.`;
      }
    } else {
      // Fleet-wide query
      toolActivities.push({
        toolName: 'Fleet Telemetry Aggregator',
        description: 'Aggregating fleet-wide machine health and active alerts...',
        status: 'running',
        dataSources: ['LIVE_TELEMETRY']
      });

      const allMachines = await getFleetMachines(liveMachinesOverride);
      dataSources.push('LIVE_TELEMETRY');

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
      const maint = allMachines.filter(m => {
        const s = String(m.status || '').toLowerCase();
        return s === 'maint' || s === 'maintenance';
      });
      const offline = allMachines.filter(m => {
        const s = String(m.status || '').toLowerCase();
        return s === 'offline';
      });

      liveMachineDataSummary = `
CURRENT FLEET TELEMETRY OVERVIEW (AUTHORITATIVE MACHINE FLEET):
• Total Registered Machines: ${allMachines.length}
• Critical Machines (${critical.length}):
${critical.map(m => `  - ${m.id} (${m.name}): Status CRITICAL, Health ${getMachineHealth(m)}%, RUL ${getMachineRul(m)}h, Active Issues: ${m.anomalies?.map(a => a.type || a.description).join('; ') || 'Threshold breach'}`).join('\n') || '  None'}
• Warning Machines (${warning.length}):
${warning.map(m => `  - ${m.id} (${m.name}): Status WARNING, Health ${getMachineHealth(m)}%, RUL ${getMachineRul(m)}h, Active Issues: ${m.anomalies?.map(a => a.type || a.description).join('; ') || 'Parameter drift'}`).join('\n') || '  None'}
• Healthy / Nominal Machines (${healthy.length}):
  ${healthy.map(m => `${m.id} (${m.name}): Health ${getMachineHealth(m)}%, RUL ${getMachineRul(m)}h`).join('\n  ') || 'None'}
• Maintenance: ${maint.length} (${maint.map(m => m.id).join(', ') || 'None'})
• Offline: ${offline.length} (${offline.map(m => m.id).join(', ') || 'None'})`;
    }
  }

  // Tool 2: Machine Agent Diagnosis
  if (route.requiresMachineAgent && route.targetMachineId) {
    toolActivities.push({
      toolName: 'Machine Agent Diagnosis',
      description: `Invoking Machine Agent diagnostics for ${route.targetMachineId}...`,
      status: 'running',
      dataSources: ['MACHINE_AGENT', 'MACHINE_MANUAL']
    });

    const analysis = await runMachineDiagnosis(route.targetMachineId, liveMachinesOverride);
    if (analysis) {
      dataSources.push('MACHINE_AGENT');
      if (analysis.diagnoses.some(d => d.source === 'MANUAL')) {
        dataSources.push('MACHINE_MANUAL');
      }

      machineAgentDiagnosisSummary = `
MACHINE AGENT DIAGNOSTIC REPORT:
• Machine: ${analysis.machineName} (${analysis.machineId})
• Active Anomalies Count: ${analysis.activeAnomaliesCount}
• Diagnoses:
${analysis.diagnoses.length > 0 ? analysis.diagnoses.map((d, i) => `  [Diagnosis ${i + 1} - Source: ${d.source}, Confidence: ${d.confidence} (${Math.round(d.confidenceScore * 100)}%)]
  - Diagnosis: ${d.diagnosis}
  - Probable Root Causes: ${d.possibleCauses.join('; ')}
  - Recommended SOP Actions: ${d.recommendedActions.join('; ')}
  - Source Reference: ${d.sourceDocument?.title || 'Machine Manual'} (${d.sourceDocument?.section || 'Section 11'})
  ${d.disclaimer ? `  - Note: ${d.disclaimer}` : ''}`).join('\n') : '  - All sensors within nominal bounds. No anomalies detected.'}
• Agent Operational Recommendations:
${analysis.recommendations.map(r => `  - ${r}`).join('\n')}`;
    }
  }

  // Tool 3: Shared Global RAG Knowledge Base
  if (route.requiresRAG) {
    toolActivities.push({
      toolName: 'VectorAI Global RAG Knowledge Base',
      description: `Retrieving authoritative knowledge chunks for "${route.cleanSearchQuery}"...`,
      status: 'running',
      dataSources: ['GLOBAL_RAG']
    });

    const ragResults = searchKnowledgeBase(route.cleanSearchQuery, {
      knowledgeType: route.ragKnowledgeScope === 'MACHINE_ONLY' ? 'MACHINE' : undefined,
      machineType: route.targetMachineType,
      maxResults: 4,
      minScore: 0.05
    });

    if (ragResults.length > 0) {
      dataSources.push('GLOBAL_RAG');
      ragResults.forEach(r => sources.push(r));

      ragKnowledgeSummary = `
RETRIEVED AUTHORITATIVE KNOWLEDGE BASE CHUNKS:
${ragResults.map((r, i) => `[Source ${i + 1}: ${r.sourceName} // ${r.section} - "${r.title}"] (Relevance: ${Math.round((r.similarityScore || 0) * 100)}%)
${r.contentSnippet}`).join('\n\n')}`;
    }
  }

  // Mark tool activities as completed
  toolActivities.forEach(t => (t.status = 'completed'));

  // ─────────────────────────────────────────────────────────────────────────
  // 3. SYNTHESIZE RESPONSE (GEMINI LLM OR DETERMINISTIC SYNTHESIZER)
  // ─────────────────────────────────────────────────────────────────────────
  let responseContent = '';
  const apiKey = getGeminiApiKey();

  // Call Google Gemini 2.5 Flash via direct SDK or local backend proxy (credentials/google.json)
  try {
    const systemPrompt = `You are VectorAI Assistant, the intelligent technical AI copilot for the VectorAI industrial predictive maintenance platform in semiconductor manufacturing.

CRITICAL OPERATIONAL RULES:
1. Ground your answers strictly in the provided data.
2. NEVER fabricate live sensor values, RUL numbers, timestamps, or manual citations.
3. VectorAI DOES NOT use Machine Learning for RUL calculations. It uses deterministic weighted physical degradation formulas. Always explain this accurately.
4. When reporting live data, clearly identify it as "Current Machine Telemetry" or "Live Fleet Data".
5. Keep explanations concise, professional, and structured with clear bullet points.
6. When referencing technical manuals or platform documentation, accurately cite the source name and section.`;

    const promptText = `${systemPrompt}

User Query: "${query}"

CONTEXT DATA PROVIDED BY VECTORAI TOOLS:
${liveMachineDataSummary ? `${liveMachineDataSummary}\n` : ''}
${machineAgentDiagnosisSummary ? `${machineAgentDiagnosisSummary}\n` : ''}
${ragKnowledgeSummary ? `${ragKnowledgeSummary}\n` : ''}

Synthesize a natural, helpful, well-structured response for the user based strictly on the context provided above.`;

    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: promptText }]
          }
        ]
      });
      responseContent = result.text?.trim() || '';
    } else {
      // Call local backend proxy powered by credentials/google.json
      const proxyRes = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });
      if (proxyRes.ok) {
        const proxyData = await proxyRes.json();
        if (proxyData.success && proxyData.text) {
          responseContent = proxyData.text.trim();
        }
      }
    }
  } catch (llmError) {
    console.warn('[VectorAssistant] Live Gemini synthesis error, using deterministic synthesis:', llmError);
  }

  // Deterministic Fallback Synthesizer if LLM is unavailable or key not configured
  if (!responseContent) {
    responseContent = synthesizeDeterministicResponse(
      route.intent,
      query,
      route.targetMachineId,
      liveMachineDataSummary,
      machineAgentDiagnosisSummary,
      ragKnowledgeSummary,
      sources
    );
  }

  // Manual PDF Attachment Resolution
  const attachments: AssistantAttachment[] = [];
  const targetMt = route.targetMachineType;
  const isManualQuery = /\b(manual|pdf|document|datasheet|handbook|guide|spec)\b/i.test(query);

  if (targetMt && MANUAL_ATTACHMENT_MAP[targetMt]) {
    if (isManualQuery || route.intent === 'MACHINE_KNOWLEDGE' || route.intent === 'DIAGNOSTIC') {
      attachments.push({
        ...MANUAL_ATTACHMENT_MAP[targetMt],
        machineType: targetMt
      });
    }
  } else if (isManualQuery) {
    const q = query.toLowerCase();
    if (q.includes('aoi') || q.includes('optical') || q.includes('metrology')) {
      attachments.push({ ...MANUAL_ATTACHMENT_MAP['aoi-inspection'], machineType: 'aoi-inspection' });
    } else if (q.includes('xr') || q.includes('x-ray') || q.includes('xray') || q.includes('ndt')) {
      attachments.push({ ...MANUAL_ATTACHMENT_MAP['x-ray-inspection'], machineType: 'x-ray-inspection' });
    } else if (q.includes('lm') || q.includes('laser')) {
      attachments.push({ ...MANUAL_ATTACHMENT_MAP['laser-marking'], machineType: 'laser-marking' });
    } else if (q.includes('stk') || q.includes('stocker') || q.includes('amhs')) {
      attachments.push({ ...MANUAL_ATTACHMENT_MAP['stocker'], machineType: 'stocker' });
    } else if (q.includes('pc') || q.includes('plasma')) {
      attachments.push({ ...MANUAL_ATTACHMENT_MAP['plasma-cleaner'], machineType: 'plasma-cleaner' });
    } else if (q.includes('tr') || q.includes('tape') || q.includes('reel')) {
      attachments.push({ ...MANUAL_ATTACHMENT_MAP['tape-reel'], machineType: 'tape-reel' });
    } else if (q.includes('wb') || q.includes('bonder') || q.includes('wire')) {
      attachments.push({ ...MANUAL_ATTACHMENT_MAP['wire-bonding'], machineType: 'wire-bonding' });
    } else if (q.includes('da') || q.includes('die') || q.includes('attach')) {
      attachments.push({ ...MANUAL_ATTACHMENT_MAP['die-attach'], machineType: 'die-attach' });
    } else if (q.includes('ws') || q.includes('saw') || q.includes('dicing') || q.includes('wafer') || q.includes('dic')) {
      attachments.push({ ...MANUAL_ATTACHMENT_MAP['wafer-saw'], machineType: 'wafer-saw' });
    } else if (q.includes('mp') || q.includes('mold')) {
      attachments.push({ ...MANUAL_ATTACHMENT_MAP['molding-press'], machineType: 'molding-press' });
    } else if (q.includes('th') || q.includes('ate') || q.includes('test') || q.includes('handler') || q.includes('tester') || q.includes('ic')) {
      attachments.push({ ...MANUAL_ATTACHMENT_MAP['test-handler'], machineType: 'test-handler' });
    }
  }

  const message: AssistantMessage = {
    id: `msg-${Date.now()}`,
    conversationId,
    role: 'assistant',
    content: responseContent,
    createdAt: new Date().toISOString(),
    intent: route.intent,
    sources,
    dataSources,
    liveData: liveBadges.length > 0 ? liveBadges : undefined,
    resolvedMachineId: route.targetMachineId,
    toolActivity: toolActivities,
    attachments: attachments.length > 0 ? attachments : undefined
  };

  return {
    conversationId,
    message,
    intent: route.intent,
    sources,
    dataSources
  };
}

/**
 * Deterministic response synthesis ensuring 100% reliable answers even offline / without API key.
 */
function synthesizeDeterministicResponse(
  _intent: string,
  _query: string,
  machineId?: string,
  liveData?: string,
  agentData?: string,
  _ragData?: string,
  sources?: AssistantSourceCitation[]
): string {
  // Case 1: Mixed / Diagnostic with Machine Agent
  if (agentData && liveData) {
    return `### Machine Assessment for ${machineId || 'Equipment'}

${liveData.trim()}

---

${agentData.trim()}

${sources && sources.length > 0 ? `\n**Authoritative Sources Consulted:**\n${sources.map(s => `• *${s.sourceName}* — ${s.section}: "${s.title}"`).join('\n')}` : ''}`;
  }

  // Case 2: Pure Live Machine Telemetry / Fleet Status
  if (liveData) {
    return `### Current Machine Telemetry & Fleet Status

${liveData.trim()}

*Note: Live sensor readings and RUL updates refresh every 3 seconds from the plant telemetry engine.*`;
  }

  // Case 3: Pure Machine Agent Diagnosis
  if (agentData) {
    return `### Machine Agent Diagnostic Result

${agentData.trim()}

${sources && sources.length > 0 ? `\n**Reference Manual:**\n${sources.map(s => `• *${s.sourceName}* — ${s.section}`).join('\n')}` : ''}`;
  }

  // Case 4: RAG Knowledge Retrieval
  if (sources && sources.length > 0) {
    const topChunk = sources[0];
    const otherChunks = sources.slice(1);

    return `**${topChunk.title}**

${topChunk.contentSnippet}

${otherChunks.length > 0 ? otherChunks.map(c => `#### ${c.title}\n${c.contentSnippet}`).join('\n\n') : ''}

---
**Sources:**
${sources.map(s => `• **${s.sourceName}** — ${s.section} (*"${s.title}"*)`).join('\n')}`;
  }

  // Fallback
  return "I don't have enough specific information in the VectorAI knowledge base or active telemetry registry to answer that reliably. Please try asking about a specific equipment model (e.g., WB-001, Wire Bonder, Die Attacher), current RUL calculation, or VectorAI platform features.";
}
