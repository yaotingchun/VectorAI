import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const STOPWORDS = new Set([
  'what', 'is', 'the', 'of', 'in', 'and', 'to', 'for', 'a', 'an', 'on', 'with', 'at',
  'by', 'from', 'about', 'how', 'does', 'do', 'can', 'it', 'its', 'this', 'that',
  'these', 'those', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had'
]);

const systemKnowledge = JSON.parse(fs.readFileSync(path.join(root, 'data/knowledge/system-knowledge.json'), 'utf8'));
const websiteKnowledge = JSON.parse(fs.readFileSync(path.join(root, 'data/knowledge/website-knowledge.json'), 'utf8'));
const technicalKnowledge = JSON.parse(fs.readFileSync(path.join(root, 'data/knowledge/technical-knowledge.json'), 'utf8'));

const allChunks = [];
for (const sec of websiteKnowledge.sections) {
  allChunks.push({
    knowledgeType: 'WEBSITE',
    sourceName: 'VectorAI Website & UI Guide',
    section: sec.sectionName,
    title: sec.title || sec.sectionName,
    content: sec.content,
    tags: sec.tags || []
  });
}

for (const sec of systemKnowledge.sections) {
  allChunks.push({
    knowledgeType: 'SYSTEM',
    sourceName: 'VectorAI System & Architecture Overview',
    section: sec.sectionName,
    title: sec.title || sec.sectionName,
    content: sec.content,
    tags: sec.tags || []
  });
}

function searchChunks(query) {
  const normQuery = query.toLowerCase();
  const rawTerms = normQuery.replace(/[^a-z0-9_\-\s]/g, ' ').split(/\s+/).filter(t => t.length > 1);
  const meaningfulTerms = rawTerms.filter(t => !STOPWORDS.has(t));
  const queryTerms = meaningfulTerms.length > 0 ? meaningfulTerms : rawTerms;

  console.log('Filtered Query Terms:', queryTerms);

  const scored = [];
  for (const chunk of allChunks) {
    let score = 0;
    const contentLower = chunk.content.toLowerCase();
    const titleLower = chunk.title.toLowerCase();
    const sectionLower = chunk.section.toLowerCase();

    // Exact phrase bonus
    if (contentLower.includes(normQuery) || titleLower.includes(normQuery)) {
      score += 10.0;
    }

    for (const term of queryTerms) {
      if (titleLower.includes(term)) score += 6.0;
      if (chunk.tags.some(tag => tag.toLowerCase().includes(term))) score += 4.0;
      if (sectionLower.includes(term)) score += 3.0;
      if (contentLower.includes(term)) score += 1.5;
    }

    if (score > 0) {
      scored.push({
        chunk,
        score
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 4);
}

const results = searchChunks('What is the purpose of the Prediction tab?');
console.log('\nSearch Results with Stopword Filtering & Exact Match Weights:');
results.forEach((r, i) => {
  console.log(`[${i + 1}] [${r.chunk.knowledgeType}] ${r.chunk.sourceName} | ${r.chunk.section} (Score: ${r.score})`);
  console.log(`    Snippet: ${r.chunk.content.slice(0, 120)}...`);
});
