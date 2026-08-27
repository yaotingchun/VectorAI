import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

// Load global and machine documents
const systemKnowledge = JSON.parse(fs.readFileSync(path.join(root, 'data/knowledge/system-knowledge.json'), 'utf8'));
const websiteKnowledge = JSON.parse(fs.readFileSync(path.join(root, 'data/knowledge/website-knowledge.json'), 'utf8'));
const technicalKnowledge = JSON.parse(fs.readFileSync(path.join(root, 'data/knowledge/technical-knowledge.json'), 'utf8'));

// Test TF-IDF search on websiteKnowledge sections for "What is the purpose of the Prediction tab?"
function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z0-9_\-\s]/g, ' ').split(/\s+/).filter(t => t.length > 1);
}

const query = 'What is the purpose of the Prediction tab?';
const qTokens = tokenize(query);
console.log('Query Tokens:', qTokens);

const allSections = [
  ...websiteKnowledge.sections.map(s => ({ ...s, doc: 'website' })),
  ...systemKnowledge.sections.map(s => ({ ...s, doc: 'system' })),
  ...technicalKnowledge.sections.map(s => ({ ...s, doc: 'technical' }))
];

const matches = allSections.map(s => {
  const text = `${s.sectionName} ${s.content} ${(s.tags || []).join(' ')}`.toLowerCase();
  let score = 0;
  qTokens.forEach(t => {
    if (t === 'prediction' && text.includes('prediction')) score += 5;
    if (t === 'tab' && text.includes('tab')) score += 3;
    if (t === 'purpose' && text.includes('purpose')) score += 2;
    if (text.includes(t)) score += 1;
  });
  return { section: s.sectionName, doc: s.doc, score, snippet: s.content.slice(0, 100) };
}).sort((a, b) => b.score - a.score).slice(0, 5);

console.log('\nTop matches in consolidated global knowledge:');
matches.forEach(m => {
  console.log(`- [${m.doc}] ${m.section} (Score: ${m.score}): ${m.snippet}...`);
});
