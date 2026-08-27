// =========================================================================
// VECTOR.AI — GLOBAL KNOWLEDGE REPOSITORY
// Single Source of Truth for Consolidated System, Website, and Technical Domain Knowledge
// =========================================================================

import { GlobalKnowledgeDocument, KnowledgeType } from '../types/intelligence';

// Consolidated Domain Knowledge JSONs
import systemKnowledgeJson from '../../../../../data/knowledge/system-knowledge.json';
import websiteKnowledgeJson from '../../../../../data/knowledge/website-knowledge.json';
import technicalKnowledgeJson from '../../../../../data/knowledge/technical-knowledge.json';

const GLOBAL_DOCUMENTS_REGISTRY: GlobalKnowledgeDocument[] = [
  systemKnowledgeJson as unknown as GlobalKnowledgeDocument,
  websiteKnowledgeJson as unknown as GlobalKnowledgeDocument,
  technicalKnowledgeJson as unknown as GlobalKnowledgeDocument
];

/**
 * Retrieve all registered global knowledge documents across SYSTEM, WEBSITE, and TECHNICAL categories.
 */
export function listAllGlobalDocuments(): GlobalKnowledgeDocument[] {
  return GLOBAL_DOCUMENTS_REGISTRY;
}

/**
 * Find a specific global knowledge document by its unique document ID.
 */
export function getGlobalDocumentById(documentId: string): GlobalKnowledgeDocument | undefined {
  return GLOBAL_DOCUMENTS_REGISTRY.find(d => d.documentId === documentId);
}

/**
 * Filter registered global knowledge documents by KnowledgeType ('SYSTEM' | 'WEBSITE' | 'TECHNICAL').
 */
export function listGlobalDocumentsByType(knowledgeType: KnowledgeType): GlobalKnowledgeDocument[] {
  return GLOBAL_DOCUMENTS_REGISTRY.filter(d => d.knowledgeType === knowledgeType);
}
