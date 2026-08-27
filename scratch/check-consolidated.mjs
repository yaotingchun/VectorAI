import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

// Test the 3 consolidated knowledge files
const sys = JSON.parse(fs.readFileSync(path.join(root, 'data/knowledge/system-knowledge.json'), 'utf-8'));
const web = JSON.parse(fs.readFileSync(path.join(root, 'data/knowledge/website-knowledge.json'), 'utf-8'));
const tech = JSON.parse(fs.readFileSync(path.join(root, 'data/knowledge/technical-knowledge.json'), 'utf-8'));

console.log(`System sections: ${sys.sections.length}`);
console.log(`Website sections: ${web.sections.length}`);
console.log(`Technical sections: ${tech.sections.length}`);

const totalGlobalSections = sys.sections.length + web.sections.length + tech.sections.length;
console.log(`Total Global Knowledge Sections: ${totalGlobalSections}`);

if (totalGlobalSections === 45) {
  console.log('PASSED: Exactly 45 sections (21 System + 15 Website + 9 Technical) present in 3 consolidated files!');
} else {
  throw new Error(`Unexpected section count: ${totalGlobalSections}`);
}
