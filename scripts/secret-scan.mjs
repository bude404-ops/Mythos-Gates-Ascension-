import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const skip = new Set(['.git', 'node_modules', 'dist']);
const scannerFile = 'scripts/secret-scan.mjs';
const forbidden = [
  new RegExp('github' + '_pat_' + '[A-Za-z0-9_]+'),
  new RegExp('gh' + '[pousr]_' + '[A-Za-z0-9_]+'),
  new RegExp('x-access' + '-token', 'i'),
  new RegExp('Authorization\\s*:\\s*Bearer', 'i'),
  new RegExp('GITHUB' + '_TOKEN\\s*[:=]\\s*[\'\"][A-Za-z0-9_\\-]+', 'i')
];
const hits = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue;
    const path = join(dir, name);
    const rel = path.replace(root + '/', '');
    if (rel === scannerFile) continue;
    const st = statSync(path);
    if (st.isDirectory()) walk(path);
    else if (st.size < 2_000_000) {
      const text = readFileSync(path, 'utf8');
      for (const pattern of forbidden) {
        if (pattern.test(text)) hits.push(rel);
      }
    }
  }
}
walk(root);
if (hits.length) {
  console.error(JSON.stringify({ ok: false, secretHits: [...new Set(hits)] }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, secretScan: 'PASS' }, null, 2));
