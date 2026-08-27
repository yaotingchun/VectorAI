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

const websiteKnowledge = JSON.parse(fs.readFileSync(path.join(root, 'data/knowledge/website-knowledge.json'), 'utf8'));
const systemKnowledge = JSON.parse(fs.readFileSync(path.join(root, 'data/knowledge/system-knowledge.json'), 'utf8'));

const chunks = [
  ...websiteKnowledge.sections.map(s => ({
    knowledgeType: 'WEBSITE',
    sourceName: 'VectorAI Website & UI Guide',
    section: s.sectionName,
    title: s.title || s.sectionName,
    content: s.content,
    tags: s.tags || []
  })),
  ...systemKnowledge.sections.map(s => ({
    knowledgeType: 'SYSTEM',
    sourceName: 'VectorAI System & Architecture Overview',
    section: s.sectionName,
    title: s.title || s.sectionName,
    content: s.content,
    tags: s.tags || []
  }))
];

function search(query) {
  const norm = query.toLowerCase();
  const raw = norm.replace(/[^a-z0-9_\-\s]/g, ' ').split(/\s+/).filter(t => t.length > 1);
  const meaningful = raw.filter(t => !STOPWORDS.has(t));
  const terms = meaningful.length > 0 ? meaningful : raw;

  const scored = [];
  for (const c of chunks) {
    let score = 0;
    const content = c.content.toLowerCase();
    const title = c.title.toLowerCase();
    const section = c.section.toLowerCase();

    if (content.includes(norm) || title.includes(norm)) score += 8.0;

    for (const t of terms) {
      if (title.includes(t)) score += 5.0;
      if (c.tags.some(tag => tag.toLowerCase().includes(t))) score += 4.0;
      if (section.includes(t)) score += 3.0;
      if (content.includes(t)) score += 1.5;
    }

    if (score > 0) {
      const divisor = Math.max(1, terms.length) * 6.0;
      const normScore = Math.min(1.0, score / divisor);
      if (normScore >= 0.05) {
        scored.push({ chunk: c, similarityScore: Math.round(normScore * 100) / 100 });
      }
    }
  }

  scored.sort((a, b) => b.similarityScore - a.similarityScore);
  return scored.slice(0, 4);
}

const res = search('What is the purpose of the Prediction tab?');
console.log('Query: "What is the purpose of the Prediction tab?"');
res.forEach((r, i) => {
  console.log(`[Source ${i + 1} - ${r.similarityScore * 100}% MATCH]:`);
  console.log(`  Source: ${r.chunk.sourceName}`);
  console.log(`  Section: ${r.chunk.section}`);
  console.log(`  Content: ${r.chunk.content}\n`);
});
