import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

class TestRagIndex {
  constructor() {
    this.chunks = [];
  }

  load() {
    // 1. Machine JSONs
    const machineMap = {
      wafer_dicing: 'wafer-dicing-machine',
      die_attacher: 'die-attacher',
      wire_bonder: 'wire-bonder',
      molding: 'molding-machine',
      ic_tester: 'ic-tester-sorter'
    };

    for (const [mt, filename] of Object.entries(machineMap)) {
      const data = JSON.parse(fs.readFileSync(path.join(root, `data/machines/${filename}.json`), 'utf-8'));
      const manualId = data.machine.manualId;
      const sourceName = data.machine.name;

      this.chunks.push({
        chunkId: `CHUNK-${manualId}-overview`,
        knowledgeType: 'MACHINE',
        machineType: mt,
        manualId,
        documentId: manualId,
        sourceName,
        section: 'Section 2 — Overview',
        title: `${data.machine.name} Process & Subsystems`,
        content: `${data.machine.description} ${data.machine.manufacturingProcess}`,
        tags: ['overview', 'subsystems', 'process', mt, 'machine_manual']
      });

      for (const comp of data.components) {
        this.chunks.push({
          chunkId: `CHUNK-${manualId}-comp-${comp.name}`,
          knowledgeType: 'MACHINE',
          machineType: mt,
          manualId,
          documentId: manualId,
          sourceName,
          section: 'Section 3 — Components',
          title: `Component Specification: ${comp.name}`,
          content: `Component: ${comp.name}. Function: ${comp.function}`,
          tags: ['component', comp.name.toLowerCase(), mt, 'machine_manual']
        });
      }
    }

    // 2. Consolidated Global docs (3 files)
    const files = ['system-knowledge.json', 'website-knowledge.json', 'technical-knowledge.json'];
    for (const f of files) {
      const doc = JSON.parse(fs.readFileSync(path.join(root, 'data/knowledge', f), 'utf-8'));
      for (const sec of doc.sections) {
        this.chunks.push({
          chunkId: `CHUNK-${doc.documentId}-${sec.sectionId}`,
          knowledgeType: doc.knowledgeType,
          documentId: doc.documentId,
          sourceName: doc.sourceName,
          section: sec.sectionName,
          title: sec.title,
          content: sec.content,
          tags: [...sec.tags, doc.category.toLowerCase(), doc.knowledgeType.toLowerCase()]
        });
      }
    }
  }

  search(query, filter) {
    const normalizedQuery = query.toLowerCase();
    const queryTerms = normalizedQuery.split(/\s+/).filter(t => t.length > 1);
    const maxResults = filter?.maxResults || 4;
    const minScore = filter?.minScore || 0.05;

    const scored = [];
    let targetKnowledgeTypes = null;
    if (filter?.knowledgeType) {
      targetKnowledgeTypes = Array.isArray(filter.knowledgeType) ? filter.knowledgeType : [filter.knowledgeType];
    }

    for (const chunk of this.chunks) {
      if (targetKnowledgeTypes && !targetKnowledgeTypes.includes(chunk.knowledgeType)) {
        continue;
      }
      if (filter?.machineType) {
        if (chunk.knowledgeType === 'MACHINE' && chunk.machineType !== filter.machineType) {
          continue;
        }
      }
      if (filter?.documentId && chunk.documentId !== filter.documentId && chunk.manualId !== filter.documentId) {
        continue;
      }

      let score = 0;
      const contentLower = chunk.content.toLowerCase();
      const titleLower = chunk.title.toLowerCase();
      const sectionLower = chunk.section.toLowerCase();

      for (const term of queryTerms) {
        if (titleLower.includes(term)) score += 3.0;
        if (chunk.tags.some(tag => tag.includes(term))) score += 2.0;
        if (sectionLower.includes(term)) score += 1.5;
        if (contentLower.includes(term)) score += 1.0;
      }

      if (score > 0) {
        const divisor = Math.max(1, queryTerms.length) * 4.0;
        const normalizedScore = Math.min(1.0, score / divisor);
        if (normalizedScore >= minScore) {
          scored.push({ chunk, similarityScore: Math.round(normalizedScore * 100) / 100 });
        }
      }
    }

    scored.sort((a, b) => b.similarityScore - a.similarityScore);
    return scored.slice(0, maxResults);
  }
}

const index = new TestRagIndex();
index.load();

console.log(`Loaded test index with ${index.chunks.length} chunks.`);

// TEST 1: Machine Agent Scoped Query
console.log('\n--- TEST 1: Machine Agent Scoped Search (Wire Bonder) ---');
const res1 = index.search('ultrasonic transducer wire loop', { knowledgeType: 'MACHINE', machineType: 'wire_bonder', maxResults: 3 });
console.log(`Results: ${res1.length}`);
res1.forEach(r => console.log(`- [${r.chunk.knowledgeType}] [${r.chunk.machineType}] ${r.chunk.title} (${r.similarityScore})`));
if (res1.some(r => r.chunk.knowledgeType !== 'MACHINE' || r.chunk.machineType !== 'wire_bonder')) {
  throw new Error('FAIL: Leaked non-machine or wrong-machine chunk into Machine Agent scope!');
}

// TEST 2: Global Vector Assistant Query
console.log('\n--- TEST 2: Global Assistant Search (RUL Formula & Degradation) ---');
const res2 = index.search('deterministic RUL formula degradation score', { maxResults: 3 });
console.log(`Results: ${res2.length}`);
res2.forEach(r => console.log(`- [${r.chunk.knowledgeType}] ${r.chunk.title} (${r.similarityScore})`));
if (!res2.some(r => r.chunk.knowledgeType === 'SYSTEM')) {
  throw new Error('FAIL: Global search did not retrieve System knowledge chunk!');
}

// TEST 3: Website Guide Query
console.log('\n--- TEST 3: Website Guide Search (Accelerated wear simulation) ---');
const res3 = index.search('accelerated wear simulation toggle 60x speed', { maxResults: 2 });
console.log(`Results: ${res3.length}`);
res3.forEach(r => console.log(`- [${r.chunk.knowledgeType}] ${r.chunk.title} (${r.similarityScore})`));
if (!res3.some(r => r.chunk.knowledgeType === 'WEBSITE')) {
  throw new Error('FAIL: Website search did not retrieve Website knowledge chunk!');
}

console.log('\nALL CONSOLIDATED SEARCH ASSERTIONS PASSED PERFECTLY!');
