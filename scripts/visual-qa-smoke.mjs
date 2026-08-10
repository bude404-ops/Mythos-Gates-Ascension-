import { readFileSync } from 'node:fs';

const screens = JSON.parse(readFileSync('data/visual-screens.json', 'utf8'));
const status = JSON.parse(readFileSync('data/github-sync-status.json', 'utf8'));
const policy = JSON.parse(readFileSync('data/github-sync-policy.json', 'utf8'));
const requiredScreens = ['campaign', 'battle', 'full-flow', 'tactical-map-prototype'];
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
const indexHtml = readFileSync('index.html', 'utf8');
const dialogue = JSON.parse(readFileSync('data/dialogue-scripts.json', 'utf8'));
if (!indexHtml.includes('function chapterDetail') || !indexHtml.includes('#/chapter')) {
  console.error(JSON.stringify({ ok: false, chapterDetailMissing: true }, null, 2));
  process.exit(1);
}
if (!indexHtml.includes('function dialogueViewer') || !indexHtml.includes('#/dialogue')) {
  console.error(JSON.stringify({ ok: false, dialogueViewerMissing: true }, null, 2));
  process.exit(1);
}
if (dialogue.length !== 19 || !dialogue.every(s => s.beats && ['missionIntro','midBattlePressure','lowHealthWarning','victory','defeat','postMission'].every(b => s.beats[b]))) {
  console.error(JSON.stringify({ ok: false, dialogueCoverageInvalid: true }, null, 2));
  process.exit(1);
}
const tactical = readFileSync('game/tactical-map-prototype.html', 'utf8');
for (const token of ['__TG_TACTICAL_MAP_READY__', 'GRID_W = 10', 'GRID_H = 10', 'function attackUnit', 'function enemyTurn', 'realm-selector']) {
  if (!tactical.includes(token)) {
    console.error(JSON.stringify({ ok: false, tacticalPrototypeMissing: token }, null, 2));
    process.exit(1);
  }
}
console.log(JSON.stringify({ ok: true, visualQaSmoke: 'PASS', screens: requiredScreens }, null, 2));
