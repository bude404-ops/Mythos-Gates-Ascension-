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
const prompts = JSON.parse(readFileSync('data/art-prompts.json', 'utf8'));
const artImportPipeline = JSON.parse(readFileSync('data/art-import-pipeline.json', 'utf8'));
const generatedIndex = JSON.parse(readFileSync('data/index.json', 'utf8'));
const missions = JSON.parse(readFileSync('data/mission-registry.json', 'utf8'));
const missionDialogue = JSON.parse(readFileSync('data/mission-dialogue.json', 'utf8'));
const missionArtPackages = JSON.parse(readFileSync('data/mission-art-packages.json', 'utf8'));
const endgameArchitecture = JSON.parse(readFileSync('data/endgame-architecture.json', 'utf8'));
const squadSystem = JSON.parse(readFileSync('data/squad-system.json', 'utf8'));
const asyncArenaSystem = JSON.parse(readFileSync('data/async-arena-system.json', 'utf8'));
const endgameDashboard = JSON.parse(readFileSync('data/endgame-dashboard.json', 'utf8'));

if (endgameArchitecture.standardSquadSize !== 5 || endgameArchitecture.livePvpImplemented !== false || asyncArenaSystem.mode !== 'ASYNCHRONOUS' || asyncArenaSystem.livePvpImplemented !== false) {
  console.error(JSON.stringify({ ok: false, endgameBoundaryInvalid: true }, null, 2));
  process.exit(1);
}
if (!squadSystem.samplePresets.every(p => p.squadSize === 5 && p.titanIds.length === 5)) {
  console.error(JSON.stringify({ ok: false, squadPresetInvalid: true }, null, 2));
  process.exit(1);
}
if (!indexHtml.includes('function endgameDashboard') || !indexHtml.includes('#/endgame') || !indexHtml.includes('#/arena') || !indexHtml.includes('#/squads')) {
  console.error(JSON.stringify({ ok: false, endgameRoutesMissing: true }, null, 2));
  process.exit(1);
}
if (JSON.stringify(endgameDashboard.sampleState || {}) !== '{}' || indexHtml.includes('Floor 37') || indexHtml.includes('Gold II')) {
  console.error(JSON.stringify({ ok: false, fabricatedProgressionVisible: true }, null, 2));
  process.exit(1);
}

if (missions.filter(m => m.factionId === 'TG-FACTION-001' && m.campaignType === 'Normal').length !== 20 || missions.filter(m => m.factionId === 'TG-FACTION-001' && m.campaignType === 'Elite').length !== 20 || missionDialogue.length < missions.length || missionArtPackages.length < missions.length) {
  console.error(JSON.stringify({ ok: false, missionArchitectureInvalid: true }, null, 2));
  process.exit(1);
}
if (!indexHtml.includes('Campaign Architecture') || !indexHtml.includes('#/missions')) {
  console.error(JSON.stringify({ ok: false, missionDashboardMissing: true }, null, 2));
  process.exit(1);
}
if ((generatedIndex.counts?.artMapPrompts || 0) !== prompts.filter(p => p.category === 'Map').length || !Array.isArray(generatedIndex.artMapPrompts) || generatedIndex.artMapPrompts.length < 12) {
  console.error(JSON.stringify({ ok: false, artMapPromptsIndexed: false }, null, 2));
  process.exit(1);
}
if (prompts.filter(p => p.category === 'Campaign').length < 7 || prompts.filter(p => p.category === 'Map').length < 12) {
  console.error(JSON.stringify({ ok: false, campaignPromptCoverageInvalid: true }, null, 2));
  process.exit(1);
}
if (!artImportPipeline.safeFolders?.includes('art/imported') || !artImportPipeline.acceptedExtensions?.includes('webp')) {
  console.error(JSON.stringify({ ok: false, artImportPipelineInvalid: true }, null, 2));
  process.exit(1);
}
if (!indexHtml.includes('#/art-import') || !indexHtml.includes('function artImportPage') || !indexHtml.includes('saveArtworkImport') || !indexHtml.includes('localStorage') || !indexHtml.includes('Import Art')) {
  console.error(JSON.stringify({ ok: false, artImportUiMissing: true }, null, 2));
  process.exit(1);
}
if (!indexHtml.includes('mobileClipboardFallback') || !indexHtml.includes('data-mobile-copy') || !indexHtml.includes('touch-manipulation') || !indexHtml.includes('setSelectionRange(0, value.length)')) {
  console.error(JSON.stringify({ ok: false, mobileClipboardHardeningMissing: true }, null, 2));
  process.exit(1);
}
if (!indexHtml.includes('data-copy-prompt') || (!indexHtml.includes('Click prompt to copy') && !indexHtml.includes('Tap prompt to copy')) || !indexHtml.includes('Art Map Prompts')) {
  console.error(JSON.stringify({ ok: false, clickablePromptCopyMissing: true }, null, 2));
  process.exit(1);
}
if (!indexHtml.includes('artFilterTabs') || !indexHtml.includes('Campaign Art') || !indexHtml.includes('Map Art')) {
  console.error(JSON.stringify({ ok: false, artStudioFiltersMissing: true }, null, 2));
  process.exit(1);
}
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
