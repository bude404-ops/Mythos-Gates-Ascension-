import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const before = readFileSync('data/index.json', 'utf8');
execFileSync('node', ['scripts/generate-indexes.mjs'], { stdio: ['ignore', 'pipe', 'inherit'] });
const after = readFileSync('data/index.json', 'utf8');
if (before !== after) {
  console.error('data/index.json was stale and has been regenerated. Commit the updated index with this change.');
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, indexFresh: true }, null, 2));
