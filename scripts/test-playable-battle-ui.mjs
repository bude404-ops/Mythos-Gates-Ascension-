import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import playwright from '/usr/local/lib/node_modules/playwright/index.js';
const { chromium } = playwright;
const root = process.cwd();
const hubRuntime = fs.readFileSync('game/command-hub-runtime.mjs','utf8');
const browserEngine = fs.readFileSync('game/browser-battle-engine.mjs','utf8');
for(const token of ['Playable Solo Battle','battleBasic','battleReact','battleObjective','createBattleState','HOLLOW_SWARMER','GATEBORN_BRUTE','enemyIntentCounts','enemyBehaviorTags','enemyCounterplay','OBJECTIVE_DENIAL','ISOLATION_PUNISH','Counterplay:']) assert.ok(hubRuntime.includes(token)||browserEngine.includes(token), `missing ${token}`);

async function makeServer(){
  const server = http.createServer((req,res)=>{
    const clean = decodeURIComponent((req.url||'/').split('?')[0]);
    if(clean==='/favicon.ico'){ res.writeHead(204); res.end(); return; }
    const rel = clean==='/' ? 'game/index.html' : clean.replace(/^\//,'');
    const file = path.join(root, rel);
    fs.readFile(file,(err,data)=>{ if(err){ res.writeHead(404); res.end('missing'); return; } const type=file.endsWith('.mjs')?'text/javascript':file.endsWith('.html')?'text/html':'application/octet-stream'; res.writeHead(200,{'Content-Type':type}); res.end(data); });
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  return server;
}

async function closeServer(server){
  if(!server) return;
  server.closeAllConnections?.();
  server.closeIdleConnections?.();
  await new Promise(resolve=>server.close(()=>resolve()));
}

async function runSmoke(){
  let server;
  let browser;
  try {
    server = await makeServer();
    const port = server.address().port;
    browser = await chromium.launch({
      executablePath:'/usr/bin/chromium-browser',
      args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']
    });
    const page = await browser.newPage({ viewport:{ width:390, height:760 } });
    await page.route('**/*', route => {
      const url = route.request().url();
      if (url.startsWith(`http://127.0.0.1:${port}/`)) return route.continue();
      return route.fulfill({ status: 204, body: '' });
    });
    const errors=[];
    page.on('console', msg=>{ if(msg.type()==='error') errors.push(msg.text()); });
    page.on('pageerror', err=>errors.push(err.message));
    await page.addInitScript(() => localStorage.clear());
    await page.goto(`http://127.0.0.1:${port}/game/index.html`, { waitUntil:'domcontentloaded' });
    await page.waitForFunction(() => window.TGHub && typeof window.TGHub.enterHub === 'function', null, { timeout:20000 });
    await page.evaluate(()=>window.TGHub.enterHub());
    await page.evaluate(()=>{
      if (window.TGHub.state.route === 'awakening') {
        window.TGHub.chooseStarter('TG-TITAN-003');
        window.TGHub.finishAwakening();
      }
    });
    await page.evaluate(()=>window.TGHub.primary());
    await page.waitForFunction(() => ['command','mission','hub'].includes(window.TGHub?.state?.route), null, { timeout:10000 });
    await page.evaluate(()=>window.TGHub.launchBattle());
    await page.waitForFunction(() => window.TGHub?.state?.route === 'battle' && window.TGHub?.state?.battle, null, { timeout:10000 });
    await page.evaluate(()=>window.TGHub.battleFocus());
    await page.evaluate(()=>window.TGHub.battleObjective());
    await page.evaluate(()=>{
      const b=window.TGHub.state.battle;
      b.deity.position={x:3,y:3};
      b.objectives[0].progress=1;
      const living=b.enemies.filter(e=>e.hp>0);
      if(living[0]) living[0].position={x:3,y:4};
      if(living[1]) living[1].position={x:4,y:3};
      if(living[2]) living[2].position={x:2,y:3};
    });
    await page.evaluate(()=>window.TGHub.battleEndTurn());
    const snapshot = await page.evaluate(()=>{ const text=document.body.innerText.toUpperCase(); return { route:window.TGHub.state.route, phase:window.TGHub.state.battle.phase, round:window.TGHub.state.battle.round, events:window.TGHub.state.battle.eventLog.length, resources:window.TGHub.state.battle.resources, objectives:window.TGHub.state.battle.objectives.map(o=>o.progress), enemyProfiles:window.TGHub.state.battle.enemies.map(e=>e.aiProfile?.id), enemyIntentCounts:window.TGHub.state.battle.telemetry.enemyIntentCounts, enemyBehaviorTags:window.TGHub.state.battle.telemetry.enemyBehaviorTags, enemyCounterplay:window.TGHub.state.battle.telemetry.enemyCounterplay, enemyScaling:window.TGHub.state.battle.telemetry.enemyScaling, scaledStats:window.TGHub.state.battle.enemies.map(e=>({hp:e.maxHp,damage:e.damage,tier:e.scalingProfile?.tier,threat:e.scalingProfile?.threatBudget})), visibleIntentText:text.includes('ADVANCE') || text.includes('SWARM') || text.includes('GATE STOMP') || text.includes('OBJECTIVE CRUSH'), visibleScalingText:text.includes('THREAT') && text.includes('NORMAL'), visibleCounterplayText:text.includes('COUNTERPLAY') && (text.includes('DODGE') || text.includes('PARRY')) } });
    assert.equal(snapshot.route,'battle');
    assert.ok(['PLAYER_PHASE','REACTION_WINDOW'].includes(snapshot.phase), `unexpected battle phase ${snapshot.phase}`);
    assert.ok(snapshot.events>=6,'battle should log reducer events');
    assert.ok(snapshot.resources.momentum>=0);
    assert.ok(snapshot.objectives.some(v=>v>=1),'objective progress should update');
    assert.ok(snapshot.enemyProfiles.includes('HOLLOW_SWARMER'), 'Hollow swarmer profile missing');
    assert.ok(snapshot.enemyProfiles.includes('GATEBORN_BRUTE'), 'Gateborn brute profile missing');
    assert.ok(Object.keys(snapshot.enemyIntentCounts||{}).length >= 1, 'enemy intent telemetry missing');
    assert.ok(Object.keys(snapshot.enemyBehaviorTags||{}).some(k=>['MEMORY_SCRATCH','ISOLATION_PUNISH','OBJECTIVE_DENIAL','ANCHOR_STOMP'].includes(k)), 'enemy behavior telemetry missing');
    assert.ok(snapshot.enemyCounterplay?.length >= 1, 'enemy counterplay telemetry missing');
    assert.equal(snapshot.enemyScaling.tier,'NORMAL','mission scaling tier missing');
    assert.ok(snapshot.enemyScaling.powerScalar >= .85 && snapshot.enemyScaling.powerScalar <= 1.12, 'normal scaling outside cap');
    assert.ok(snapshot.enemyScaling.threatBudget > 0, 'threat budget missing');
    assert.ok(snapshot.scaledStats.every(e=>e.tier==='NORMAL' && e.threat>0), 'enemy scaling profile missing');
    assert.ok(snapshot.visibleIntentText, 'enemy intent UI copy missing');
    assert.ok(snapshot.visibleScalingText, 'enemy scaling UI copy missing');
    assert.ok(snapshot.visibleCounterplayText, 'enemy counterplay UI copy missing');
    await page.evaluate(()=>{
      const b=window.TGHub.state.battle;
      for(const e of b.enemies) e.hp=0;
      for(const o of b.objectives){ o.progress=o.requiredProgress; o.status='COMPLETE'; }
      b.phase='VICTORY';
    });
    await page.evaluate(()=>window.TGHub.completeBattle());
    await page.waitForFunction(() => document.body.innerText.includes('CLAIM CACHE') || document.body.innerText.includes('First-clear cache secured'), null, { timeout:15000 });
    const pendingSnapshot = await page.evaluate(()=>({ route:window.TGHub.state.route, pending:window.TGHub.state.player.campaignProgress.pendingRewards.length, completed:window.TGHub.state.player.campaignProgress.completedMissionIds.length, nextMission:window.TGHub.state.player.campaignProgress.currentMissionId, rewardLabel:document.body.innerText.includes('First-clear cache secured'), beforeShards:window.TGHub.state.player.resources.find(r=>r.id==='TG-RES-GATE-SHARDS')?.amount||0 }));
    assert.equal(pendingSnapshot.route,'command');
    assert.equal(pendingSnapshot.pending,1,'pending reward cache missing');
    assert.ok(pendingSnapshot.completed>=1,'completed mission not recorded');
    assert.ok(pendingSnapshot.rewardLabel,'pending reward UI missing');
    await page.evaluate(()=>window.TGHub.claimReward(window.TGHub.state.player.campaignProgress.pendingRewards[0].id));
    const claimedSnapshot = await page.evaluate(()=>({ pending:window.TGHub.state.player.campaignProgress.pendingRewards.length, history:window.TGHub.state.player.campaignProgress.rewardHistory.length, shards:window.TGHub.state.player.resources.find(r=>r.id==='TG-RES-GATE-SHARDS')?.amount||0, text:document.body.innerText.includes('Claimed Reward History') }));
    assert.equal(claimedSnapshot.pending,0,'reward cache not removed after claim');
    assert.ok(claimedSnapshot.history>=1,'claimed reward history missing');
    assert.ok(claimedSnapshot.shards>pendingSnapshot.beforeShards,'claimed shards not applied');
    assert.ok(claimedSnapshot.text,'reward history UI missing');
    assert.equal(errors.length,0,errors.join('\n'));
    return snapshot;
  } finally {
    if(browser) await browser.close().catch(()=>{});
    await closeServer(server).catch(()=>{});
  }
}

let lastError;
for (let attempt = 1; attempt <= 4; attempt++) {
  try {
    const snapshot = await runSmoke();
    console.log(JSON.stringify({ ok:true, playableBattleSmoke:'PASS', ...snapshot }, null, 2));
    process.exit(0);
  } catch (err) {
    lastError = err;
    if (!String(err?.message || err).match(/Page crashed|Target page|browser has been closed|Timeout/i) || attempt === 2) break;
  }
}
throw lastError;
