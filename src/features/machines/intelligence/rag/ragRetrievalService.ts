// =========================================================================
// VECTOR.AI — RAG KNOWLEDGE RETRIEVAL SERVICE
// Scoped Technical Document Chunking, Vector Indexing & Semantic Retrieval
// =========================================================================

import { MachineTypeId } from '../../data/machineTypes';
import { getMachineKnowledge, listAvailableKnowledgeMachineTypes } from '../manuals/manualKnowledgeRepository';

export interface RagChunk {
  chunkId: string;
  machineType: MachineTypeId;
  manualId: string;
  section: string;
  title: string;
  content: string;
  tags: string[];
  embedding?: number[];
}

export interface RagRetrievalResult {
  chunk: RagChunk;
  similarityScore: number; // 0.0 to 1.0
}

/**
 * In-memory RAG Vector Index generated from structured machine documentation.
 */
class RagVectorIndex {
  private chunks: RagChunk[] = [];
  private isInitialized = false;

  public initialize() {
    if (this.isInitialized) return;

    const machineTypes = listAvailableKnowledgeMachineTypes();
    let chunkCounter = 1;

    for (const mt of machineTypes) {
      const knowledge = getMachineKnowledge(mt);
      const manualId = knowledge.machine.manualId;

      // 1. Chunk Overview & Subsystems
      this.chunks.push({
        chunkId: `CHUNK-${manualId}-${chunkCounter++}`,
        machineType: mt,
        manualId,
        section: 'Section 2 — Overview',
        title: `${knowledge.machine.name} Process & Subsystems`,
        content: `${knowledge.machine.description} ${knowledge.machine.manufacturingProcess} Key subsystems: ${knowledge.machine.subsystems.join(', ')}.`,
        tags: ['overview', 'subsystems', 'process', mt]
      });

      // 2. Chunk Components
      for (const comp of knowledge.components) {
        this.chunks.push({
          chunkId: `CHUNK-${manualId}-${chunkCounter++}`,
          machineType: mt,
          manualId,
          section: 'Section 3 — Components',
          title: `Component Specification: ${comp.name}`,
          content: `Component: ${comp.name}. Function: ${comp.function}. Important parameters: ${comp.importantParameters}. Degradation indicators: ${comp.degradationIndicators}.`,
          tags: ['component', comp.name.toLowerCase(), mt]
        });
      }

      // 3. Chunk Degradation & RUL
      for (const deg of knowledge.degradationIndicators) {
        this.chunks.push({
          chunkId: `CHUNK-${manualId}-${chunkCounter++}`,
          machineType: mt,
          manualId,
          section: 'Section 8 — Degradation Physics',
          title: `Degradation Mechanism: ${deg.parameter}`,
          content: `Degradation indicator: ${deg.parameter}. Physical phenomenon: ${deg.physicalPhenomenon || ''}. Measurable effect: ${deg.measurableEffect || ''}. Significance: ${deg.degradationSignificance || ''}.`,
          tags: ['degradation', 'rul', deg.parameter.toLowerCase(), mt]
        });
      }

      // 4. Chunk Maintenance SOPs
      for (const maint of knowledge.maintenance) {
        this.chunks.push({
          chunkId: `CHUNK-${manualId}-${chunkCounter++}`,
          machineType: mt,
          manualId,
          section: 'Section 7 — Maintenance',
          title: `Maintenance Procedure: ${maint.component}`,
          content: `Component ${maint.component} has maintenance interval of ${maint.recommendedMaintenanceIntervalHours} hrs (Service life: ${maint.expectedServiceLifeHours} hrs). Action: ${maint.maintenanceAction}. Procedure: ${maint.procedureSummary}`,
          tags: ['maintenance', 'sop', maint.component.toLowerCase(), mt]
        });
      }
    }

    this.isInitialized = true;
  }

  /**
   * Search knowledge chunks with machine-specific scoping and semantic keyword term matching.
   */
  public search(
    query: string,
    filter?: { machineType?: MachineTypeId; maxResults?: number }
  ): RagRetrievalResult[] {
    this.initialize();

    const normalizedQuery = query.toLowerCase();
    const queryTerms = normalizedQuery.split(/\s+/).filter(t => t.length > 2);
    const maxResults = filter?.maxResults || 4;

    const scored: RagRetrievalResult[] = [];

    for (const chunk of this.chunks) {
      // Machine-specific scoping filter
      if (filter?.machineType && chunk.machineType !== filter.machineType) {
        continue;
      }

      let score = 0;
      const contentLower = chunk.content.toLowerCase();
      const titleLower = chunk.title.toLowerCase();

      for (const term of queryTerms) {
        if (titleLower.includes(term)) score += 3.0;
        if (contentLower.includes(term)) score += 1.0;
        if (chunk.tags.some(tag => tag.includes(term))) score += 2.0;
      }

      if (score > 0) {
        // Normalize score between 0.0 and 1.0
        const normalizedScore = Math.min(1.0, score / (queryTerms.length * 4.0));
        scored.push({
          chunk,
          similarityScore: Math.round(normalizedScore * 100) / 100
        });
      }
    }

    scored.sort((a, b) => b.similarityScore - a.similarityScore);
    return scored.slice(0, maxResults);
  }

  public getTotalChunkCount(): number {
    this.initialize();
    return this.chunks.length;
  }
}

export const ragVectorIndex = new RagVectorIndex();
