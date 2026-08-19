import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import playwright from '/usr/local/lib/node_modules/playwright/index.js';
const { chromium } = playwright;

const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const contract = read('data/command-hub-contract.json');
const assets = read('data/asset-registry.json');
const factions = read('data/factions.json');
const deitys = read('data/deitys.json');
const missions = read('data/mission-registry.json');
const raidSystem = read('data/raid-system.json');
const characters = read('data/characters.json');
const runtime = fs.readFileSync('game/command-hub-runtime.mjs', 'utf8');
const game = fs.readFileSync('game/index.html', 'utf8');

assert.equal(contract.status, 'IMPLEMENTED');
assert.equal(contract.canonFirst, true);
assert.equal(contract.navigationTabs.length, 5);
assert.equal(contract.counts.factions, factions.length);
assert.equal(contract.counts.deitys, deitys.length);
assert.ok(contract.startupPipeline.includes('SAVE_VALIDATION'));
assert.ok(contract.startupPipeline.includes('MAIN_COMMAND_HUB'));
assert.equal(contract.onboardingFlow.status, 'IMPLEMENTED');
assert.equal(contract.onboardingFlow.beatCount, 12);
assert.equal(contract.onboardingFlow.starterDeityIds.length, 3);
assert.ok(contract.defaultPlayerState.selectedDeities.every(id => deitys.some(t => t.id === id)));
assert.ok(missions.some(m => m.id === contract.defaultPlayerState.campaignProgress.currentMissionId));
assert.equal(assets.status, 'IMPLEMENTED');
assert.ok(assets.assets.length >= factions.length * 3);
assert.ok(characters.length >= 8, 'non-playable character registry required');
assert.ok(characters.every(c => c.playable === false && c.recruitable === false && c.combatUnit === false), 'characters must stay non-playable');
assert.ok(characters.every(c => c.heroCanonLock === 'NO_PLAYABLE_HERO_CANON'), 'characters must preserve no-Hero canon lock');
assert.equal(raidSystem.status, 'IMPLEMENTED');
assert.equal(raidSystem.stageProfiles.length, 5);
assert.ok(raidSystem.stageProfiles.every(s => s.problemTags.length >= 2 && s.preferredCounters.length >= 2 && s.carryRisk && s.baseScore));
assert.ok(['BALANCED','GUARDED','AGGRESSIVE'].every(k => raidSystem.approachRules[k]));
for (const token of ['createCommandHubRuntime','validatePlayerState','getNextRecommendedAction','AssetManager','AudioManager','deriveNotifications','bottomNav']) assert.ok(runtime.includes(token), `runtime missing ${token}`);
for (const token of ['Command Hub','OPEN THE MYTHOS GATE','command-hub-runtime.mjs']) assert.ok(game.includes(token), `game missing ${token}`);

const server = http.createServer((req, res) => {
  const clean = decodeURIComponent((req.url || '/').split('?')[0]);
  if (clean === '/favicon.ico') { res.writeHead(204); res.end(); return; }
  const rel = clean === '/' ? 'game/index.html' : clean.replace(/^\//, '');
  const file = path.resolve(process.cwd(), rel);
  if (!file.startsWith(process.cwd())) { res.writeHead(403); res.end('forbidden'); return; }
  fs.readFile(file, (err, body) => {
  if (err) { console.warn(`SMOKE_STATIC_404 ${clean}`); res.writeHead(404); res.end('missing'); return; }
    const type = file.endsWith('.mjs') ? 'text/javascript' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(body);
  });
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;

async function closeServer(){
  server.closeAllConnections?.();
  server.closeIdleConnections?.();
  await new Promise(resolve => server.close(() => resolve()));
}

async function runBrowserSmoke(){
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--disable-extensions', '--disable-background-networking', '--disable-sync', '--no-first-run', '--no-default-browser-check'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 760 } });
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url.startsWith(`http://127.0.0.1:${port}/`)) return route.continue();
    return route.fulfill({ status: 204, body: '' });
  });
  await page.addInitScript(() => localStorage.clear());
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', msg => { if(msg.type() === 'error' && !msg.text().includes('favicon') && !msg.text().includes('net::ERR_FAILED')) errors.push(msg.text()); });
  try {
    await page.goto(`http://127.0.0.1:${port}/game/index.html`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForFunction(() => Boolean(window.TGHub?.enterHub), null, { timeout: 30000 });
    await page.evaluate(() => window.TGHub.enterHub());
    assert.equal(await page.evaluate(() => window.TGHub.state.route), 'awakening');
    await page.evaluate(() => window.TGHub.chooseStarter('TG-TITAN-003'));
    assert.equal(await page.evaluate(() => window.TGHub.state.player.onboarding.starterDeityId), 'TG-TITAN-003');
    assert.equal(await page.evaluate(() => window.TGHub.awakeningProgress().total), 12);
    assert.equal(await page.evaluate(() => window.TGHub.state.player.onboarding.fullRosterHidden), true);
    await page.evaluate(() => window.TGHub.finishAwakening());
    assert.equal(await page.evaluate(() => window.TGHub.state.route), 'mission');
    await page.waitForFunction(() => Boolean(window.__TG_LAST_TACTICAL_PROFILE__), null, { timeout: 10000 });
    const missionTactical = await page.evaluate(() => window.__TG_LAST_TACTICAL_PROFILE__ || null);
    await page.evaluate(() => window.TGHub.launchBattle());
    assert.equal(await page.evaluate(() => window.TGHub.state.route), 'battle');
    await page.evaluate(() => window.TGHub.completeBattle());
    assert.ok(await page.evaluate(() => (window.TGHub.state.player.campaignProgress.pendingRewards.length || 0) >= 1));
    await page.evaluate(() => window.TGHub.openTab('trials'));
    assert.equal(await page.evaluate(() => window.TGHub.state.route), 'trials');
    await page.evaluate(() => window.TGHub.startTrial());
    assert.equal(await page.evaluate(() => window.TGHub.state.trial.status), 'ACTIVE');
    await page.evaluate(() => window.TGHub.finishTrial('STUDIED'));
    assert.ok(await page.evaluate(() => (window.TGHub.state.player.deityTrials.completions.length || 0) >= 1));
    await page.evaluate(() => window.TGHub.openTab('raid'));
    assert.equal(await page.evaluate(() => window.TGHub.state.route), 'raid');
    await page.evaluate(() => window.TGHub.startRaid());
    assert.equal(await page.evaluate(() => window.TGHub.state.raid.status), 'ACTIVE');
    const raidPreview = await page.evaluate(() => ({ stages: window.TGHub.state.raid.stages.length, problemTags: window.TGHub.state.raid.stages.flatMap(s=>s.problemTags||[]), counters: window.TGHub.state.raid.stages.flatMap(s=>s.preferredCounters||[]), carryRisks: window.TGHub.state.raid.stages.map(s=>s.carryRisk).filter(Boolean), body: document.body.innerText }));
    assert.equal(raidPreview.stages, 5);
    assert.ok(raidPreview.problemTags.includes('BOSS_ENRAGE'));
    assert.ok(raidPreview.counters.some(c => String(c).includes('Divinity')));
    assert.equal(raidPreview.carryRisks.length, 5);
    assert.ok(raidPreview.body.includes('Carry risk'));
    const raidPreviewStages = await page.evaluate(() => window.TGHub.state.raid.stages);
    for (const approach of ['BALANCED','GUARDED','AGGRESSIVE','BALANCED','GUARDED']) await page.evaluate(a => window.TGHub.raidResolve(a), approach);
    assert.equal(await page.evaluate(() => window.TGHub.state.raid.status), 'VICTORY');
    const metrics = await page.evaluate(({ missionTactical, raidPreviewStages }) => {
      window.TGHub.raidClaim();
      const p = window.TGHub.state.player;
      const firstRaidCache = (p.campaignProgress.pendingRewards||[]).find(r=>r.missionId==='TG-RAID-001') || null;
      window.TGHub.openTab('raid');
      window.TGHub.startRaid();
      for (const approach of ['BALANCED','GUARDED','AGGRESSIVE','BALANCED','GUARDED']) window.TGHub.raidResolve(approach);
      window.TGHub.raidClaim();
      const raidCaches = (p.campaignProgress.pendingRewards||[]).filter(r=>r.missionId==='TG-RAID-001');
      const replayRaidCache = raidCaches.find(r=>r !== firstRaidCache && r.economy?.firstClear === false) || null;
      const masteryRows = Object.values(p.raidProgress.masteryByDeityId||{});
      const renderBeforeClaim = window.TGHub.state.perf.renderCount;
      const partialBeforeClaim = window.TGHub.state.perf.partialResourceUpdates;
      const firstPending = (p.campaignProgress.pendingRewards||[])[0];
      window.TGHub.claimReward(firstPending.id);
      const renderAfterClaim = window.TGHub.state.perf.renderCount;
      const partialAfterClaim = window.TGHub.state.perf.partialResourceUpdates;
      const perf = window.TGHub.state.perf;
      const artReport = window.TGHub.AssetManager.visibleArtReport(p);
      const characterCount = window.__TG_COMMAND_HUB_DATA__.characters?.length || 0;
      const nonPlayableCharacters = (window.__TG_COMMAND_HUB_DATA__.characters||[]).filter(c => c.playable === false && c.heroCanonLock === 'NO_PLAYABLE_HERO_CANON').length;
      const artPanel = document.querySelector('[data-art-provenance]');
      const artStatuses = [...document.querySelectorAll('[data-art-status]')].map(n=>n.dataset.artStatus);
      return { route: window.TGHub.state.route, selected: p.selectedDeities.length, selectedDeityId: p.selectedDeities[0], onboarding: p.onboarding, awakeningProgress: window.TGHub.awakeningProgress(p), currentMissionTactical: missionTactical, tacticalVisible: Boolean(missionTactical), notifications: p.notifications.length, pendingRewards: p.campaignProgress.pendingRewards.length || 0, trialCompletions: p.deityTrials.completions.length || 0, trialFavor: p.deityTrials.trialFavor || 0, trialCache: (p.campaignProgress.pendingRewards||[]).find(r=>r.missionType==='DEITY_TRIAL') || null, trialVisible: true, raidClears: p.raidProgress.completions.length || 0, raidBest: p.raidProgress.bestScores?.['TG-RAID-001:RAID_NORMAL'] || 0, raidMastery: masteryRows[0] || null, raidCache: firstRaidCache, replayRaidCache, weeklyTokens: p.raidProgress.weeklyTokens?.['TG-RAID-001:RAID_NORMAL'] || 0, raidResolvedStages: raidPreviewStages, economyVisible: true, perf, renderBeforeClaim, renderAfterClaim, partialBeforeClaim, partialAfterClaim, characterCount, nonPlayableCharacters, artReport, artPanelVisible: Boolean(artPanel), artStatuses };
    }, { missionTactical, raidPreviewStages });
    assert.ok(metrics.raidClears >= 1);
    assert.equal(errors.length, 0, errors.join('\n'));
    return metrics;
  } finally {
    await browser.close().catch(()=>{});
  }
}

let metrics;
let lastError;
for (let attempt = 1; attempt <= 3; attempt++) {
  try { metrics = await runBrowserSmoke(); break; }
  catch (err) { lastError = err; if (!String(err?.message || err).match(/Page crashed|Target page|browser has been closed|Timeout/i)) break; }
}
await closeServer();
if (!metrics) throw lastError;
assert.equal(metrics.route, 'command');
assert.equal(metrics.selectedDeityId, 'TG-TITAN-003');
assert.equal(metrics.onboarding?.status, 'COMPLETE');
assert.equal(metrics.onboarding?.starterDeityId, 'TG-TITAN-003');
assert.ok(metrics.onboarding?.milestones?.includes('STARTER_DEITY_BOUND'));
assert.ok(metrics.onboarding?.milestones?.includes('AWAKENING_MISSION_UNLOCKED'));
assert.ok(metrics.onboarding?.milestones?.includes('FULL_ROSTER_UNLOCKED_AFTER_AWAKENING'));
assert.equal(metrics.onboarding?.completedBeatIds?.length, 12);
assert.equal(metrics.onboarding?.fullRosterHidden, false);
assert.equal(metrics.awakeningProgress?.total, 12);
assert.equal(metrics.awakeningProgress?.done, 12);
assert.ok(metrics.currentMissionTactical?.problemTags?.length >= 3);
assert.equal(metrics.currentMissionTactical?.favoredNotRequired, true);
assert.equal(metrics.currentMissionTactical?.ownershipLock, false);
assert.ok(metrics.currentMissionTactical?.recommendedDeities?.length >= 1);
assert.equal(metrics.pendingRewards, 3);
assert.equal(metrics.characterCount, characters.length);
assert.equal(metrics.nonPlayableCharacters, characters.length);
assert.equal(metrics.trialCompletions, 1);
assert.ok(metrics.trialFavor > 0);
assert.ok(metrics.trialCache?.grants?.trialFavor > 0);
assert.equal(metrics.trialCache?.trialSummary?.firstShowcase, true);
assert.ok(metrics.trialVisible);
assert.equal(metrics.raidClears, 2);
assert.ok(metrics.raidBest > 0);
assert.ok(metrics.raidCache?.economy?.quality);
assert.equal(metrics.raidCache?.economy?.firstClear, true);
assert.equal(metrics.raidCache?.economy?.replayScalar, 1);
assert.equal(metrics.raidCache?.grants?.raidTokens, 24);
assert.equal(metrics.raidCache?.grants?.signatureAlloy, 5);
assert.equal(metrics.raidCache?.grants?.masterySeals, 1);
assert.ok(metrics.raidCache?.grants?.masteryXp > 0);
assert.equal(metrics.replayRaidCache?.economy?.firstClear, false);
assert.ok(metrics.replayRaidCache?.economy?.replayScalar < 0.5);
assert.ok(metrics.replayRaidCache?.grants?.raidTokens <= metrics.replayRaidCache?.economy?.caps?.weeklyReplayTokenCap);
assert.equal(metrics.replayRaidCache?.grants?.masterySeals, metrics.replayRaidCache?.economy?.quality === 'S' ? 1 : 0);
assert.equal(metrics.weeklyTokens, 2);
assert.ok(metrics.perf.renderCount > 0);
assert.ok(metrics.perf.maxRenderMs <= metrics.perf.budgetMs * 8, `render spike ${metrics.perf.maxRenderMs}ms`);
assert.ok(metrics.perf.routeRenderCount.command >= 1);
assert.ok(metrics.perf.assetPreloadCount >= 3);
assert.equal(metrics.renderAfterClaim, metrics.renderBeforeClaim);
assert.equal(metrics.partialAfterClaim, metrics.partialBeforeClaim + 1);
assert.ok(metrics.perf.lastResourceUpdateMs <= metrics.perf.resourceOnlyBudgetMs, `resource refresh ${metrics.perf.lastResourceUpdateMs}ms`);
assert.equal(metrics.artPanelVisible, true);
assert.ok(metrics.artReport.length >= 3);
assert.ok(metrics.artReport.every(a => a.status === 'FINAL'), JSON.stringify(metrics.artReport, null, 2));
assert.ok(metrics.artReport.every(a => a.path.endsWith('.final.webp')));
assert.ok(metrics.artStatuses.includes('FINAL'));
assert.ok(metrics.raidMastery?.clears === 2);
assert.ok(metrics.raidMastery?.masteryXp > metrics.raidCache?.grants?.masteryXp);
assert.ok(metrics.economyVisible);
assert.equal(metrics.raidResolvedStages.length, 5);
assert.ok(metrics.raidResolvedStages.some(s => s.problemTags?.includes('WEAKNESS_WINDOW')));
assert.ok(metrics.raidResolvedStages.every(s => s.carryRisk));
assert.ok(metrics.selected >= 1);
console.log(JSON.stringify({ ok: true, commandHubSmoke: 'PASS', route: metrics.route, selectedDeities: metrics.selected, starterDeityId: metrics.selectedDeityId, onboardingStatus: metrics.onboarding.status, awakeningBeats: metrics.awakeningProgress.done, tacticalTags: metrics.currentMissionTactical.problemTags.length, characterCount: metrics.characterCount, nonPlayableCharacters: metrics.nonPlayableCharacters, tacticalOwnershipLock: metrics.currentMissionTactical.ownershipLock, trialCompletions: metrics.trialCompletions, trialFavor: metrics.trialFavor, trialQuality: metrics.trialCache.trialSummary.quality, notifications: metrics.notifications, pendingRewards: metrics.pendingRewards, raidClears: metrics.raidClears, raidBest: metrics.raidBest, raidQuality: metrics.raidCache.economy.quality, raidStages: metrics.raidResolvedStages.length, firstClearTokens: metrics.raidCache.grants.raidTokens, replayTokens: metrics.replayRaidCache.grants.raidTokens, replayCap: metrics.replayRaidCache.economy.caps.weeklyReplayTokenCap, weeklyTokens: metrics.weeklyTokens, signatureAlloy: metrics.raidCache.grants.signatureAlloy, masteryXp: metrics.raidMastery.masteryXp, renderCount: metrics.perf.renderCount, maxRenderMs: metrics.perf.maxRenderMs, partialResourceUpdates: metrics.perf.partialResourceUpdates, lastResourceUpdateMs: metrics.perf.lastResourceUpdateMs, assetPreloadCount: metrics.perf.assetPreloadCount, finalArtSlots: metrics.artReport.length, finalArtStatuses: metrics.artStatuses.filter(s=>s==='FINAL').length, viewport: '390x760' }, null, 2));
