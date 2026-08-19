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
const soloCombatDesign = JSON.parse(readFileSync('data/solo-combat-design-document.json', 'utf8'));
const asyncArenaSystem = JSON.parse(readFileSync('data/async-arena-system.json', 'utf8'));
const endgameDashboard = JSON.parse(readFileSync('data/endgame-dashboard.json', 'utf8'));
const campaignPlayflow = JSON.parse(readFileSync('data/campaign-playflow-contract.json', 'utf8'));
const miniAppHtml = readFileSync('mini-app/mythos-gates-ascension.html', 'utf8');
const visualBaselines = JSON.parse(readFileSync('data/visual-baselines.json', 'utf8'));
const visualReview = JSON.parse(readFileSync('visual/reviews/TG-VISUAL-QA-BASELINE-APPROVAL-001.json', 'utf8'));


if (campaignPlayflow.status !== 'IMPLEMENTED' || campaignPlayflow.flow.length !== 7 || !campaignPlayflow.routeStates.includes('battle')) {
  console.error(JSON.stringify({ ok: false, campaignPlayflowInvalid: true }, null, 2));
  process.exit(1);
}
if (!campaignPlayflow.flow.every(f => f.chapterCount === 5 && f.normalMissionCount === 20 && f.eliteMissionCount === 20 && f.chapterRoutes.every(c => c.normalMissionIds.length === 4 && c.eliteMissionIds.length === 4))) {
  console.error(JSON.stringify({ ok: false, campaignPlayflowCoverageInvalid: true }, null, 2));
  process.exit(1);
}
const gameHtmlForPlayflow = readFileSync('game/index.html', 'utf8');

if (!visualBaselines.length || visualBaselines.some(b => !['APPROVED'].includes(b.status))) {
  console.error(JSON.stringify({ ok: false, visualBaselinesNotApproved: visualBaselines.filter(b => b.status !== 'APPROVED').map(b => b.id) }, null, 2));
  process.exit(1);
}
if (visualReview.status !== 'APPROVED' || visualReview.taskId !== 'TG-DEV-009' || visualReview.screens.length !== visualBaselines.length || !visualReview.requiredSmokeScreens.every(s => requiredScreens.includes(s))) {
  console.error(JSON.stringify({ ok: false, visualReviewArtifactInvalid: true }, null, 2));
  process.exit(1);
}

const commandHub = JSON.parse(readFileSync('data/command-hub-contract.json', 'utf8'));
const assetRegistry = JSON.parse(readFileSync('data/asset-registry.json', 'utf8'));
const commandHubRuntime = readFileSync('game/command-hub-runtime.mjs', 'utf8');
if (commandHub.status !== 'IMPLEMENTED' || !commandHub.canonFirst || commandHub.navigationTabs?.length !== 5 || assetRegistry.assets?.length < 21) {
  console.error(JSON.stringify({ ok: false, commandHubContractInvalid: true }, null, 2));
  process.exit(1);
}
for (const token of ['I Command Deities', 'Command Hub', 'CONTINUE CAMPAIGN', 'Deity Roster', 'Realm Network', 'Lore Registry', 'Playable Solo Battle']) {
  if (!commandHubRuntime.includes(token) && !gameHtmlForPlayflow.includes(token)) {
    console.error(JSON.stringify({ ok: false, commandHubUiMissing: token }, null, 2));
    process.exit(1);
  }
}

for (const token of ['createCommandHubRuntime','function getNextRecommendedAction','function campaigns','function missionScreen','launchBattle(){','function battleScreen', "route:'battle'", 'ENTER BATTLE']) {
  if (!commandHubRuntime.includes(token)) {
    console.error(JSON.stringify({ ok: false, commandHubPlayflowMissing: token }, null, 2));
    process.exit(1);
  }
}

if (endgameArchitecture.livePvpImplemented !== false || asyncArenaSystem.mode !== 'ASYNCHRONOUS' || asyncArenaSystem.livePvpImplemented !== false || asyncArenaSystem.standardSquadSize !== 1 || asyncArenaSystem.status !== 'IMPLEMENTED') {
  console.error(JSON.stringify({ ok: false, endgameBoundaryInvalid: true }, null, 2));
  process.exit(1);
}
if (!asyncArenaSystem.snapshotRules?.oneActiveDefenderDeity || !asyncArenaSystem.snapshotRules?.checksumRequired || asyncArenaSystem.defenseSnapshots?.length !== asyncArenaSystem.sampleOpponents?.length) {
  console.error(JSON.stringify({ ok: false, asyncArenaSnapshotsInvalid: true }, null, 2));
  process.exit(1);
}
for (const token of ['Lore Continuity Sweep', 'one-active-Deity canon', 'One active deity in standard combat', 'The Hollow is a non-playable campaign threat']) {
  if (!miniAppHtml.includes(token)) {
    console.error(JSON.stringify({ ok: false, loreSweepDashboardMissing: token }, null, 2));
    process.exit(1);
  }
}
if (!soloCombatDesign.samplePresets.every(p => p.activeDeityCount === 1 || p.squadSize === 1)) {
  console.error(JSON.stringify({ ok: false, activeDeityPresetInvalid: true }, null, 2));
  process.exit(1);
}
if (!indexHtml.includes('function endgameDashboard') || !indexHtml.includes('#/endgame') || !indexHtml.includes('#/arena')) {
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
if (!indexHtml.includes('#/backstories') || !indexHtml.includes('Character Backstories') || !indexHtml.includes('function backstoryDetail')) {
  console.error(JSON.stringify({ ok: false, backstoryRouteMissing: true }, null, 2));
  process.exit(1);
}
if (!indexHtml.includes('#/storylines') || !indexHtml.includes('Storyline Arcs') || !indexHtml.includes('campaign-consequence-registry')) {
  console.error(JSON.stringify({ ok: false, storylineRouteMissing: true }, null, 2));
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

