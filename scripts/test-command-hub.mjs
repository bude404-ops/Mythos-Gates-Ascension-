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
const titans = read('data/titans.json');
const missions = read('data/mission-registry.json');
const runtime = fs.readFileSync('game/command-hub-runtime.mjs', 'utf8');
const game = fs.readFileSync('game/index.html', 'utf8');

assert.equal(contract.status, 'IMPLEMENTED');
assert.equal(contract.canonFirst, true);
assert.equal(contract.navigationTabs.length, 5);
assert.equal(contract.counts.factions, factions.length);
assert.equal(contract.counts.titans, titans.length);
assert.ok(contract.startupPipeline.includes('SAVE_VALIDATION'));
assert.ok(contract.startupPipeline.includes('MAIN_COMMAND_HUB'));
assert.ok(contract.defaultPlayerState.selectedTitans.every(id => titans.some(t => t.id === id)));
assert.ok(missions.some(m => m.id === contract.defaultPlayerState.campaignProgress.currentMissionId));
assert.equal(assets.status, 'IMPLEMENTED');
assert.ok(assets.assets.length >= factions.length * 3);
for (const token of ['createCommandHubRuntime','validatePlayerState','getNextRecommendedAction','AssetManager','AudioManager','deriveNotifications','bottomNav']) assert.ok(runtime.includes(token), `runtime missing ${token}`);
for (const token of ['Command Hub','OPEN THE TITAN GATE','command-hub-runtime.mjs']) assert.ok(game.includes(token), `game missing ${token}`);

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

const browser = await chromium.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 390, height: 760 }, isMobile: true });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', msg => { if(msg.type() === 'error' && !msg.text().includes('favicon')) errors.push(msg.text()); });
await page.goto(`http://127.0.0.1:${port}/game/index.html`, { waitUntil: 'domcontentloaded' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForSelector('text=Titan Gates:', { timeout: 5000 });
await page.click('text=TAP TO ENTER');
await page.waitForSelector('text=I Command Titans', { timeout: 5000 });
await page.click('[data-nav="titans"]');
await page.waitForSelector('text=Titan Roster', { timeout: 5000 });
await page.click('text=← Command Hub');
await page.waitForSelector('text=I Command Titans', { timeout: 5000 });
await page.evaluate(() => window.TGHub.primary());
await page.waitForSelector('text=ENTER BATTLE', { timeout: 5000 });
await page.click('text=ENTER BATTLE');
await page.waitForSelector('text=Playable Solo Battle', { timeout: 5000 });
await page.evaluate(() => window.TGHub.completeBattle());
await page.waitForSelector('text=CLAIM CACHE', { timeout: 5000 });
await page.click('[data-nav="raid"]');
await page.waitForSelector('text=The Gate Warden', { timeout: 5000 });
await page.click('text=START GATE WARDEN RAID');
await page.waitForSelector('text=Active Stage', { timeout: 5000 });
for (const approach of ['BALANCED','GUARDED','AGGRESSIVE','BALANCED','GUARDED']) await page.evaluate(a => window.TGHub.raidResolve(a), approach);
await page.waitForSelector('text=LOCK RAID VICTORY', { timeout: 5000 });
await page.click('text=LOCK RAID VICTORY');
await page.waitForSelector('text=Gate Warden Raid Cache', { timeout: 5000 });
const metrics = await page.evaluate(() => ({ route: window.TGHub?.state?.route, selected: window.TGHub?.state?.player?.selectedTitans?.length, notifications: window.TGHub?.state?.player?.notifications?.length, pendingRewards: window.TGHub?.state?.player?.campaignProgress?.pendingRewards?.length || 0, raidClears: window.TGHub?.state?.player?.raidProgress?.completions?.length || 0, raidBest: window.TGHub?.state?.player?.raidProgress?.bestScores?.['TG-RAID-001:RAID_NORMAL'] || 0, commandText: document.body.innerText.includes('Mission clears now create save-backed reward caches') }));
await browser.close();
server.close();
assert.equal(errors.length, 0, errors.join('\n'));
assert.equal(metrics.route, 'command');
assert.equal(metrics.pendingRewards, 2);
assert.equal(metrics.raidClears, 1);
assert.ok(metrics.raidBest > 0);
assert.ok(metrics.commandText);
assert.ok(metrics.selected >= 1);
console.log(JSON.stringify({ ok: true, commandHubSmoke: 'PASS', route: metrics.route, selectedTitans: metrics.selected, notifications: metrics.notifications, pendingRewards: metrics.pendingRewards, raidClears: metrics.raidClears, raidBest: metrics.raidBest, viewport: '390x760' }, null, 2));
