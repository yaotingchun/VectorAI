import { routeUserQuery } from '../src/features/assistant/services/assistantRouter.ts';
import { ragVectorIndex } from '../src/features/machines/intelligence/rag/ragRetrievalService.ts';

const query = 'What is the purpose of the Prediction tab?';
const route = routeUserQuery(query);
console.log('Route:', route);

const results = ragVectorIndex.search(route.cleanSearchQuery, {
  knowledgeType: route.ragKnowledgeScope === 'MACHINE_ONLY' ? 'MACHINE' : undefined,
  machineType: route.targetMachineType,
  maxResults: 4
});

console.log(`\nSearch results for "${route.cleanSearchQuery}":`);
results.forEach(r => {
  console.log(`- [${r.chunk.knowledgeType}] ${r.chunk.sourceName} | ${r.chunk.section} | ${r.chunk.title} (Score: ${(r.similarityScore * 100).toFixed(1)}%)`);
});
