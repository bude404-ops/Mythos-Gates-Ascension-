import { readFileSync } from 'node:fs';

const screens = JSON.parse(readFileSync('data/visual-screens.json', 'utf8'));
const status = JSON.parse(readFileSync('data/github-sync-status.json', 'utf8'));
const policy = JSON.parse(readFileSync('data/github-sync-policy.json', 'utf8'));
const requiredScreens = ['campaign', 'battle', 'full-flow'];
const missing = requiredScreens.filter(slug => !screens.some(s => s.slug === slug));
if (missing.length) {
  console.error(JSON.stringify({ ok: false, missingHybridScreens: missing }, null, 2));
  process.exit(1);
}
if (!policy.pipeline.includes('VISUAL TEST') || !policy.pipeline.includes('DEPLOY')) {
  console.error(JSON.stringify({ ok: false, reason: 'pipeline_missing_visual_or_deploy' }, null, 2));
  process.exit(1);
}
if (!['PASS', 'IN_PROGRESS'].includes(status.visualQa)) {
  console.error(JSON.stringify({ ok: false, visualQa: status.visualQa }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, visualQaSmoke: 'PASS', screens: requiredScreens }, null, 2));
