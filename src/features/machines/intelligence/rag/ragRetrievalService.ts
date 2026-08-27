// =========================================================================
// VECTOR.AI — UNIFIED RAG KNOWLEDGE RETRIEVAL SERVICE
// Shared Vector Index & Multi-Scope Semantic Retrieval (Machine & Global)
// =========================================================================

import { 
  RagChunk, 
  RagRetrievalResult, 
  RagSearchFilter, 
  KnowledgeType 
} from '../types/intelligence';
import { getMachineKnowledge, listAvailableKnowledgeMachineTypes } from '../manuals/manualKnowledgeRepository';
import { listAllGlobalDocuments } from '../knowledge/globalKnowledgeRepository';

// Re-export types for direct consumer convenience
export type { RagChunk, RagRetrievalResult, RagSearchFilter, KnowledgeType };

/**
 * In-memory unified RAG Vector Index generated from structured machine technical manuals
 * and global VectorAI system, website, and technical engineering documentation.
 */
class RagVectorIndex {
  private chunks: RagChunk[] = [];
  private isInitialized = false;

  public initialize() {
    if (this.isInitialized) return;

    let chunkCounter = 1;

    // ─────────────────────────────────────────────────────────────────────────
    // 1. INDEX MACHINE KNOWLEDGE (5 Authoritative Technical Manuals)
    // ─────────────────────────────────────────────────────────────────────────
    const machineTypes = listAvailableKnowledgeMachineTypes();

    for (const mt of machineTypes) {
      const knowledge = getMachineKnowledge(mt);
      const manualId = knowledge.machine.manualId;
      const sourceName = knowledge.machine.name;

      // 1.1 Chunk Overview & Subsystems (Section 2)
      this.chunks.push({
        chunkId: `CHUNK-${manualId}-${chunkCounter++}`,
        knowledgeType: 'MACHINE',
        machineType: mt,
        manualId,
        documentId: manualId,
        sourceName,
        section: 'Section 2 — Overview',
        title: `${knowledge.machine.name} Process & Subsystems`,
        content: `${knowledge.machine.description} ${knowledge.machine.manufacturingProcess} Key subsystems: ${knowledge.machine.subsystems.join(', ')}.`,
        tags: ['overview', 'subsystems', 'process', mt, 'machine_manual']
      });

      // 1.2 Chunk Components (Section 3)
      for (const comp of knowledge.components) {
        this.chunks.push({
          chunkId: `CHUNK-${manualId}-${chunkCounter++}`,
          knowledgeType: 'MACHINE',
          machineType: mt,
          manualId,
          documentId: manualId,
          sourceName,
          section: 'Section 3 — Components',
          title: `Component Specification: ${comp.name}`,
          content: `Component: ${comp.name}. Function: ${comp.function}. Important parameters: ${comp.importantParameters}. Degradation indicators: ${comp.degradationIndicators}.`,
          tags: ['component', comp.name.toLowerCase(), mt, 'machine_manual']
        });
      }

      // 1.3 Chunk Degradation & RUL (Section 8)
      for (const deg of knowledge.degradationIndicators) {
        this.chunks.push({
          chunkId: `CHUNK-${manualId}-${chunkCounter++}`,
          knowledgeType: 'MACHINE',
          machineType: mt,
          manualId,
          documentId: manualId,
          sourceName,
          section: 'Section 8 — Degradation Physics',
          title: `Degradation Mechanism: ${deg.parameter}`,
          content: `Degradation indicator: ${deg.parameter}. Normal condition: ${deg.normalCondition}. Degraded: ${deg.degradedCondition}. Critical: ${deg.criticalCondition}. Physical mechanism: ${deg.indicatorMechanism}.`,
          tags: ['degradation', 'rul', deg.parameter.toLowerCase(), mt, 'machine_manual']
        });
      }

      // 1.4 Chunk Maintenance SOPs (Section 7)
      for (const maint of knowledge.maintenance) {
        this.chunks.push({
          chunkId: `CHUNK-${manualId}-${chunkCounter++}`,
          knowledgeType: 'MACHINE',
          machineType: mt,
          manualId,
          documentId: manualId,
          sourceName,
          section: 'Section 7 — Maintenance',
          title: `Maintenance Procedure: ${maint.component}`,
          content: `Component ${maint.component} has maintenance interval of ${maint.recommendedMaintenanceIntervalHours} hrs (Service life: ${maint.expectedServiceLifeHours} hrs). Action: ${maint.maintenanceAction}. Procedure: ${maint.procedureSummary}`,
          tags: ['maintenance', 'sop', maint.component.toLowerCase(), mt, 'machine_manual']
        });
      }

      // 1.5 Chunk Troubleshooting Symptoms (Section 10)
      if (knowledge.symptoms) {
        for (const sym of knowledge.symptoms) {
          this.chunks.push({
            chunkId: `CHUNK-${manualId}-${chunkCounter++}`,
            knowledgeType: 'MACHINE',
            machineType: mt,
            manualId,
            documentId: manualId,
            sourceName,
            section: 'Section 10 — Troubleshooting',
            title: `Troubleshooting Symptom: ${sym.symptom}`,
            content: `Symptom: ${sym.symptom}. Severity: ${sym.severity}. Related sensors: ${sym.relatedSensors.join(', ')}. Probable causes: ${sym.possibleCauses.join('; ')}. Recommended action: ${sym.recommendedAction}`,
            tags: ['troubleshooting', 'symptom', ...sym.relatedSensors.map(s => s.toLowerCase()), mt, 'machine_manual']
          });
        }
      }

      // 1.6 Chunk Failure Scenarios (Section 11)
      if (knowledge.failureScenarios) {
        for (const sc of knowledge.failureScenarios) {
          this.chunks.push({
            chunkId: `CHUNK-${manualId}-${chunkCounter++}`,
            knowledgeType: 'MACHINE',
            machineType: mt,
            manualId,
            documentId: manualId,
            sourceName,
            section: 'Section 11 — Failure Scenarios',
            title: `Failure Scenario: ${sc.symptom}`,
            content: `Scenario: ${sc.symptom}. Sensor pattern: ${sc.sensorPattern}. Severity: ${sc.severity}. Probable causes: ${sc.possibleCauses.join('; ')}. Recommended recovery action: ${sc.recommendedAction}.${sc.verificationSteps ? ` Verification steps: ${sc.verificationSteps.join('; ')}.` : ''}`,
            tags: ['failure_scenario', 'root_cause', sc.symptom.toLowerCase(), mt, 'machine_manual']
          });
        }
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. INDEX GLOBAL KNOWLEDGE (SYSTEM, WEBSITE, TECHNICAL)
    // ─────────────────────────────────────────────────────────────────────────
    const globalDocs = listAllGlobalDocuments();

    for (const doc of globalDocs) {
      for (const sec of doc.sections) {
        this.chunks.push({
          chunkId: `CHUNK-${doc.documentId}-${sec.sectionId}`,
          knowledgeType: doc.knowledgeType,
          documentId: doc.documentId,
          sourceName: doc.sourceName,
          section: sec.sectionName,
          title: sec.title,
          content: sec.content,
          tags: [
            ...sec.tags,
            doc.category.toLowerCase(),
            doc.knowledgeType.toLowerCase(),
            doc.sourceName.toLowerCase()
          ]
        });
      }
    }

    this.isInitialized = true;
  }

  /**
   * Search knowledge chunks with multi-tier scoping filters and semantic keyword term matching.
   *
   * Supports:
   * - Scoped Machine Agent search (`knowledgeType: 'MACHINE'`, `machineType: '...'`)
   * - Global Vector Assistant search (no filter or multi-type filter)
   * - Machine-specific global search (`machineType: '...'` with all or specific knowledge types)
   */
  public search(
    query: string,
    filter?: RagSearchFilter
  ): RagRetrievalResult[] {
    this.initialize();

    const STOPWORDS = new Set([
      'what', 'is', 'the', 'of', 'in', 'and', 'to', 'for', 'a', 'an', 'on', 'with', 'at',
      'by', 'from', 'about', 'how', 'does', 'do', 'can', 'it', 'its', 'this', 'that',
      'these', 'those', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had'
    ]);

    const normalizedQuery = query.toLowerCase();
    const rawTerms = normalizedQuery.replace(/[^a-z0-9_\-\s]/g, ' ').split(/\s+/).filter(t => t.length > 1);
    const meaningfulTerms = rawTerms.filter(t => !STOPWORDS.has(t));
    const queryTerms = meaningfulTerms.length > 0 ? meaningfulTerms : rawTerms;

    const maxResults = filter?.maxResults || 4;
    const minScore = filter?.minScore || 0.05;

    const scored: RagRetrievalResult[] = [];

    // Resolve knowledge types to match
    let targetKnowledgeTypes: KnowledgeType[] | null = null;
    if (filter?.knowledgeType) {
      targetKnowledgeTypes = Array.isArray(filter.knowledgeType)
        ? filter.knowledgeType
        : [filter.knowledgeType];
    }

    for (const chunk of this.chunks) {
      // 1. Knowledge Type Filtering
      if (targetKnowledgeTypes && !targetKnowledgeTypes.includes(chunk.knowledgeType)) {
        continue;
      }

      // 2. Machine Type Scoping
      if (filter?.machineType) {
        if (chunk.knowledgeType === 'MACHINE' && chunk.machineType !== filter.machineType) {
          continue;
        }
      }

      // 3. Document ID Filtering
      if (filter?.documentId && chunk.documentId !== filter.documentId && chunk.manualId !== filter.documentId) {
        continue;
      }

      // 4. Source Name Filtering
      if (filter?.sourceName && !chunk.sourceName.toLowerCase().includes(filter.sourceName.toLowerCase())) {
        continue;
      }

      // 5. Section Filtering
      if (filter?.section && !chunk.section.toLowerCase().includes(filter.section.toLowerCase())) {
        continue;
      }

      // 6. Semantic & Term Match Scoring
      let score = 0;
      const contentLower = chunk.content.toLowerCase();
      const titleLower = chunk.title.toLowerCase();
      const sectionLower = chunk.section.toLowerCase();

      // Exact phrase bonus
      if (contentLower.includes(normalizedQuery) || titleLower.includes(normalizedQuery)) {
        score += 8.0;
      }

      for (const term of queryTerms) {
        if (titleLower.includes(term)) score += 5.0;
        if (chunk.tags.some(tag => tag.toLowerCase().includes(term))) score += 4.0;
        if (sectionLower.includes(term)) score += 3.0;
        if (contentLower.includes(term)) score += 1.5;
      }

      if (score > 0) {
        // Normalize score between 0.0 and 1.0
        const divisor = Math.max(1, queryTerms.length) * 6.0;
        const normalizedScore = Math.min(1.0, score / divisor);

        if (normalizedScore >= minScore) {
          scored.push({
            chunk,
            similarityScore: Math.round(normalizedScore * 100) / 100
          });
        }
      }
    }

    scored.sort((a, b) => b.similarityScore - a.similarityScore);
    return scored.slice(0, maxResults);
  }

  /**
   * Get total number of registered chunks across all knowledge categories.
   */
  public getTotalChunkCount(): number {
    this.initialize();
    return this.chunks.length;
  }

  /**
   * Get count of chunks registered for a specific knowledge type.
   */
  public getChunkCountByType(knowledgeType: KnowledgeType): number {
    this.initialize();
    return this.chunks.filter(c => c.knowledgeType === knowledgeType).length;
  }

  /**
   * Returns all indexed chunks in memory (for introspection or debugging).
   */
  public getAllChunks(): readonly RagChunk[] {
    this.initialize();
    return this.chunks;
  }
}

export const ragVectorIndex = new RagVectorIndex();
