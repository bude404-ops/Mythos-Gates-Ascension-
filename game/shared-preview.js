export const DEVICE_PRESETS = [
  { id: '360', label: '360', width: 360 },
  { id: '390', label: '390', width: 390 },
  { id: '414', label: '414', width: 414 },
  { id: '430', label: '430', width: 430 },
  { id: 'tablet', label: 'Tablet', width: 768 },
  { id: 'desktop', label: 'Desktop', width: 1280 },
  { id: 'wide', label: '1920', width: 1920 }
];

export async function loadGameData(cacheBust = true) {
  const q = cacheBust ? `?v=${Date.now()}` : '';
  const files = ['project','factions','titans','npcs','creatures','maps','campaigns','chapters','lore-index','art-prompts','artworks','visual-screens','visual-change-rules','visual-baselines','development-tasks','hybrid-visual-architecture','asset-pipeline','realm-codex'];
  const entries = await Promise.all(files.map(async key => [key, await fetch(`../data/${key}.json${q}`).then(r => {
    if (!r.ok) throw new Error(`Failed to load ${key}`);
    return r.json();
  })]));
  return Object.fromEntries(entries);
}

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const first = value => Array.isArray(value) ? value[0] : value;

export function getPreviewEntity(data, entityId) {
  return [...data .titans, ...data.npcs, ...data.factions, ...data.creatures, ...data.maps, ...data.campaigns].find(item => item.id === entityId) || data .titans[0];
}

export function getAffectedScreens(data, changeType = 'deity-artwork') {
  const rule = data['visual-change-rules'].find(item => item.changeType === changeType);
  if (!rule) return [];
  return rule.affectedScreens.map(id => data['visual-screens'].find(screen => screen.id === id)).filter(Boolean);
}

function artPanel(entity, prompt) {
  const status = entity.artStatus || entity.artPipelineStatus || 'No Approved Artwork';
  return `<div class="art-slot"><div class="art-glow"></div><div class="art-label">${esc(entity.name)}</div><div class="art-status">${esc(status)}</div><div class="art-note">${prompt ? 'Prompt ready · artwork pending repository approval' : 'No prompt linked'}</div></div>`;
}

function deityCard(deity, prompt, dev) {
  return `<article class="game-card deity-card"><div class="micro">${esc(deity.id)} · ${esc(deity.faction)} · ${esc(deity.rarity || 'Deity')}</div>${artPanel(deity, prompt)}<h3>${esc(deity.name)}</h3><p>${esc(deity.role || 'Realm Deity')}</p><div class="stat-row"><b>ATK ${esc(deity.stats?.attack ?? deity.atk ?? '—')}</b><b>HP ${esc(deity.stats?.hp ?? deity.hp ?? '—')}</b><b>RNG ${esc(deity.stats?.range ?? deity.range ?? '—')}</b></div><p class="ability">${esc(first(deity.abilities)?.name || first(deity.abilities) || deity.signatureAbility || 'Signature ability pending')}</p>${dev ? `<div class="dev-chip">component: DeityCard · prompt: ${esc(deity.artPromptId || prompt?.id || 'none')}</div>` : ''}</article>`;
}

function spriteToken(entity, kind='player', size='normal') {
  const label = entity?.name || entity?.id || 'Sprite';
  return `<div class="sprite-token ${kind} ${size}" title="${esc(label)}"><span class="sprite-shadow"></span><span class="sprite-art">${esc(label).slice(0,2).toUpperCase()}</span><small>${esc(label).split(' ')[0]}</small></div>`;
}

function campaignDiorama(data, state, mode='campaign') {
  const campaign = data.campaigns[0];
  const realm = data['realm-codex']?.[0];
  const nodes = ['START','Encounter','Battle','Event','Elite','Treasure','Boss','NEXT'];
  const map = data.maps[0];
  return `<div class="hybrid-label"><b>3D CAMPAIGN ENVIRONMENT</b><span>Elongated Realm journey · Gate travel · mobile diorama camera</span></div><section class="campaign-diorama"><div class="skyline"><span></span><span></span><span></span></div><div class="realm-depth"><b>${esc(realm?.realm || campaign?.name || 'Realm Campaign')}</b><small>${esc(realm?.gate || 'Mythos Gate')} · ${esc(map?.name || 'Campaign Map')}</small></div><div class="journey-path">${nodes.map((n,i)=>`<button class="journey-node ${i===0?'active':''} ${n==='Boss'?'boss':''} ${n==='Battle'?'battle':''}"><i>${i+1}</i><span>${n}</span></button>`).join('')}</div><div class="gate-landmark">TITAN GATE</div></section><div class="game-card"><h3>${esc(campaign?.name || 'Campaign')}</h3><p>${esc(campaign?.summary || 'Campaign progression uses the live repository campaign data.')}</p><p class="ability">Architecture: 3D journey map. Player progresses through actual Realm space, not a flat level menu.</p>${state.devMode ? `<div class="dev-chip">component: CampaignDiorama · data: campaign/maps/realm-codex · camera: mobile diorama</div>` : ''}</div>`;
}

function battleHybrid(data, state) {
  const playerDeities = data .titans.slice(0,5);
  const enemies = [data.creatures[0], data.creatures[1], data .titans.find(t => t.faction === 'Infernal Dominion')].filter(Boolean);
  const map = data.maps[0];
  const cells = Array.from({length:35},(_,i)=>{
    const playerIndex = [22,23,29,30,31].indexOf(i);
    const enemyIndex = [5,6,12].indexOf(i);
    const gate = i === 3;
    return `<div class="tactical-cell ${gate?'gate-cell':''}">${gate?'<b>3D GATE</b>':playerIndex>=0?spriteToken(playerDeities[playerIndex],'player',playerIndex===0?'deity':'normal'):enemyIndex>=0?spriteToken(enemies[enemyIndex],'enemy',enemyIndex===2?'deity':'normal'):''}</div>`;
  }).join('');
  return `<div class="hybrid-label"><b>3D TACTICAL ENVIRONMENT + 2D SPRITES</b><span>Combatants remain 2D · environment supplies depth, terrain, lighting, and scale</span></div><section class="battle-hybrid"><div class="battle-camera">Mobile tactical camera · no terrain-hidden sprites</div><div class="tactical-grid">${cells}</div></section><div class="game-card"><h3>${esc(map?.name || 'Tactical Battlefield')}</h3><p>2D Deity and enemy sprites are grounded with contact shadows, selection rings, consistent scale, and grid positioning inside a 3D battlefield shell.</p><p class="ability">Gameplay system in development: live tactical engine will mount here when battle systems expand.</p>${state.devMode ? `<div class="dev-chip">component: BattleHybrid · sprite layer: 2D · environment layer: 3D</div>` : ''}</div>`;
}

function fullFlowPreview(data, state) {
  return `<div class="flow-stack"><div>${campaignDiorama(data,state,'flow')}</div><div class="transition-ribbon">Encounter reached → location reveal → battle initialization</div><div>${battleHybrid(data,state)}</div><div class="transition-ribbon victory">Victory → rewards → return to 3D campaign journey</div></div>`;
}

function shell(title, body, data, state) {
  const dev = state.devMode;
  return `<section class="game-shell ${dev ? 'dev-on' : ''}"><div class="preview-banner"><div><b>MYTHOS GATES — DEVELOPMENT PREVIEW</b><span>Build ${esc(data.project.version)} · Branch development · ${esc(data.project.lastUpdate)}</span></div><a href="../game/index.html" target="_blank" rel="noreferrer">Open Live Game</a></div><header class="game-hero"><p>Visual Game Preview</p><h1>${esc(title)}</h1><span>${dev ? 'DEV VIEW' : 'PLAYER VIEW'}</span></header>${body}${dev ? `<aside class="dev-overlay"><b>Dev Overlay</b><span>screen: ${esc(state.screen)}</span><span>entity: ${esc(state.entityId || 'auto')}</span><span>source: /data/*.json</span><span>component: shared-preview.js</span></aside>` : ''}</section>`;
}

export function renderGameScreen(data, state = {}) {
  const screen = state.screen || 'home';
  const dev = state.devMode !== false;
  const entity = getPreviewEntity(data, state.entityId);
  const prompts = data['art-prompts'];
  const promptFor = id => prompts.find(p => p.entityId === id || p.id === id);
  const deities = data .titans.slice(0, 8);
  const factions = data.factions;
  const campaigns = data.campaigns;
  const maps = data.maps;
  const npcs = data.npcs;
  const creatures = data.creatures;
  let body = '';
  let title = 'Home';

  if (screen === 'home') {
    title = 'Ascension Command';
    body = `<div class="home-grid"><button>Begin Campaign</button><button>Select Deities</button><button>Codex</button><button>Settings</button></div><div class="game-card"><h3>Current Build</h3><p>${esc(data.project.phase)}</p><p>${esc(data.project.canonStatus)}</p></div>`;
  } else if (screen === 'profile') {
    title = 'Creator Profile';
    body = `<div class="game-card"><h3>Profile System In Development</h3><p>Progression, save state, achievements, and account-linked unlocks will appear here when implemented.</p></div>`;
  } else if (screen === 'deity-selection') {
    title = 'Deity Selection';
    body = `<div class="selection-grid">${deities.map(t => deityCard(t, promptFor(t.id), dev)).join('')}</div>`;
  } else if (screen === 'deity-profile') {
    const deity = entity.id?.startsWith('TG-DEITY') ? entity : data .titans[0];
    const prompt = promptFor(deity.id);
    title = deity.name;
    body = `<div class="profile-grid">${artPanel(deity, prompt)}<div class="game-card"><p class="micro">${esc(deity.id)} · ${esc(deity.faction)} · ${esc(deity.role)}</p><h3>${esc(deity.name)}</h3><p>${esc(deity.lore || deity.description || 'Lore connected through Codex.')}</p><div class="stat-row"><b>ATK ${esc(deity.stats?.attack ?? '—')}</b><b>DEF ${esc(deity.stats?.defense ?? '—')}</b><b>HP ${esc(deity.stats?.hp ?? '—')}</b></div><p class="ability">${esc(first(deity.abilities)?.name || 'Ability data ready')}</p></div></div>`;
  } else if (screen === 'character-profile') {
    const npc = entity.id?.startsWith('TG-NPC') ? entity : npcs[0];
    title = npc.name;
    body = `<div class="profile-grid">${artPanel(npc, promptFor(npc.id))}<div class="game-card"><p class="micro">${esc(npc.id)} · Non-playable · ${esc(npc.faction)}</p><h3>${esc(npc.role)}</h3><p>${esc(npc.lore)}</p><p class="ability">${esc(npc.gameplayFunction)}</p></div></div>`;
  } else if (screen === 'faction') {
    const faction = entity.id?.startsWith('TG-FACTION') ? entity : factions[0];
    title = faction.name;
    const factionDeities = data .titans.filter(t => t.factionId === faction.id || t.faction === faction.name).slice(0, 6);
    body = `<div class="game-card faction-banner"><p class="micro">${esc(faction.id)}</p><h3>${esc(faction.name)}</h3><p>${esc(faction.description)}</p><p>${esc(faction.visualIdentity)}</p></div><div class="selection-grid small">${factionDeities.map(t => deityCard(t, promptFor(t.id), dev)).join('')}</div>`;
  } else if (screen === 'campaign') {
    title = '3D Campaign Journey';
    body = campaignDiorama(data, {...state, devMode: dev});
  } else if (screen === 'battle') {
    title = 'Hybrid Battle Preview';
    body = battleHybrid(data, {...state, devMode: dev});
  } else if (screen === 'full-flow') {
    title = 'Full Hybrid Flow';
    body = fullFlowPreview(data, {...state, devMode: dev});
  } else if (screen === 'victory' || screen === 'defeat') {
    title = screen === 'victory' ? 'Victory' : 'Defeat';
    body = `<div class="result-card ${screen}"><h3>${screen === 'victory' ? 'Gate Sealed' : 'Chosen Deity Broken'}</h3><p>${screen === 'victory' ? 'Rewards, Codex unlocks, and campaign progress preview.' : 'Retry, inspect lineup, and adjust deity selection.'}</p><button>${screen === 'victory' ? 'Continue' : 'Retry'}</button></div>`;
  } else if (screen === 'codex') {
    title = 'Codex';
    body = `<div class="campaign-list">${data['lore-index'].map(l => `<article class="game-card"><p class="micro">${esc(l.id)} · ${esc(l.category)}</p><h3>${esc(l.title)}</h3><p>${esc(l.summary)}</p></article>`).join('')}</div>`;
  } else if (screen === 'settings') {
    title = 'Settings';
    body = `<div class="game-card"><h3>Settings In Development</h3><p>Display scale, audio, accessibility, and save options will live here.</p></div>`;
  } else if (screen === 'loading') {
    title = 'Loading';
    body = `<div class="loading-sigil"><span></span><b>Opening the Gate</b><p>Loading current repository data.</p></div>`;
  }
  return shell(title, body, data, {...state, screen, devMode: dev});
}

export function runVisualChecks(root) {
  const warnings = [];
  if (root.scrollWidth > root.clientWidth + 4) warnings.push('Horizontal overflow detected in preview frame.');
  root.querySelectorAll('button,a').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width < 40 || r.height < 40) warnings.push(`Tiny touch target: ${el.textContent.trim().slice(0, 24) || el.tagName}`);
  });
  root.querySelectorAll('.art-slot').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.height < 160) warnings.push('Artwork slot may crop visual identity at mobile scale.');
  });
  return [...new Set(warnings)];
}

export function previewStyles() {
  return `
    .game-shell{min-height:100%;background:radial-gradient(circle at top,#2a1208,transparent 42%),#050505;color:#f5f5f5;padding:12px;font-family:Rajdhani,system-ui;position:relative;overflow:hidden}.preview-banner{display:flex;justify-content:space-between;gap:12px;align-items:center;border:1px solid #3f2b1b;background:#120c08;border-radius:18px;padding:10px 12px;margin-bottom:12px}.preview-banner b{display:block;color:#f59e0b}.preview-banner span{display:block;color:#a3a3a3;font-size:12px}.preview-banner a{color:white;background:#7c2d12;border-radius:14px;padding:9px 12px;text-decoration:none;font-weight:800}.game-hero{border:1px solid #3f2b1b;border-radius:26px;padding:18px;background:linear-gradient(135deg,#171717,#27130a)}.game-hero p,.micro{color:#f59e0b;text-transform:uppercase;letter-spacing:.18em;font-weight:900;font-size:11px}.game-hero h1{font-size:34px;line-height:.95;margin:4px 0 8px}.game-hero span,.dev-chip{display:inline-block;border:1px solid #854d0e;color:#fde68a;border-radius:999px;padding:4px 9px;font-size:12px}.home-grid,.selection-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:12px 0}.home-grid button,.result-card button{min-height:52px;border:0;border-radius:18px;background:#f59e0b;color:#111;font-weight:900}.game-card{border:1px solid #2f2f2f;background:#111;border-radius:22px;padding:14px;margin-top:10px}.game-card h3{font-size:23px;margin:5px 0}.game-card p{color:#d4d4d4}.art-slot{min-height:190px;border:1px solid #713f12;border-radius:22px;background:linear-gradient(145deg,#2a1308,#050505);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;position:relative;overflow:hidden}.art-glow{position:absolute;inset:20%;background:radial-gradient(circle,#f59e0b55,transparent 60%);filter:blur(18px)}.art-label{position:relative;font-size:22px;font-weight:900;max-width:80%}.art-status,.art-note{position:relative;color:#fde68a;font-size:12px;text-transform:uppercase;letter-spacing:.12em}.stat-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.stat-row b{background:#262626;border-radius:12px;padding:7px 9px}.ability{border-left:3px solid #f59e0b;padding-left:10px}.profile-grid{display:grid;grid-template-columns:minmax(180px,320px) 1fr;gap:12px;margin-top:12px}.campaign-list{display:grid;gap:10px;margin-top:12px}.battlefield{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;border:1px solid #3f2b1b;border-radius:22px;padding:10px;margin-top:12px;background:#0a0a0a}.map-title{grid-column:1/-1;display:flex;justify-content:space-between;color:#f59e0b}.tile{aspect-ratio:1;border:1px solid #333;border-radius:10px;display:grid;place-items:center;color:#737373;font-size:10px;background:#171717}.tile.gate{background:#78350f;color:#fff}.tile.enemy{background:#3f0d0d;color:#fecaca}.result-card{margin-top:20px;border-radius:30px;padding:28px;text-align:center;background:#111;border:1px solid #333}.result-card.victory{border-color:#f59e0b}.result-card.defeat{border-color:#7f1d1d}.loading-sigil{display:grid;place-items:center;min-height:360px;text-align:center}.loading-sigil span{width:90px;height:90px;border:4px solid #3f2b1b;border-top-color:#f59e0b;border-radius:50%;animation:spin 1.2s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}.dev-overlay{position:absolute;right:10px;bottom:10px;display:grid;gap:2px;background:#000c;border:1px solid #f59e0b;border-radius:16px;padding:10px;color:#fde68a;font-size:11px}.faction-banner{background:linear-gradient(135deg,#171717,#2a1208)}@media(max-width:520px){.profile-grid{grid-template-columns:1fr}.game-hero h1{font-size:28px}.preview-banner{align-items:flex-start;flex-direction:column}.dev-overlay{position:static;margin-top:10px}.selection-grid{grid-template-columns:1fr}}

.hybrid-label{display:flex;justify-content:space-between;gap:10px;align-items:center;border:1px solid #854d0e;background:#1c1008;border-radius:18px;padding:10px;margin:12px 0}.hybrid-label b{color:#facc15}.hybrid-label span{font-size:12px;color:#d6d3d1}.campaign-diorama{position:relative;min-height:330px;border:1px solid #713f12;border-radius:28px;overflow:hidden;background:linear-gradient(180deg,#241105 0%,#3b240f 40%,#0f1a10 100%);box-shadow:inset 0 -45px 80px #0009}.skyline span{position:absolute;bottom:120px;width:45%;height:120px;background:#0b0b0bcc;clip-path:polygon(0 100%,25% 35%,50% 78%,75% 22%,100% 100%)}.skyline span:nth-child(2){left:32%;height:170px;opacity:.75}.skyline span:nth-child(3){right:-8%;height:145px;opacity:.6}.realm-depth{position:absolute;top:16px;left:16px;right:16px;z-index:2}.realm-depth b{display:block;font-size:24px}.realm-depth small{color:#fde68a}.journey-path{position:absolute;left:10%;right:10%;bottom:36px;height:150px;border-bottom:4px solid #f59e0b99;transform:perspective(420px) rotateX(28deg);display:flex;align-items:flex-end;justify-content:space-between}.journey-node{transform:rotateX(-28deg);border:1px solid #f59e0b;background:#111;color:#fff;border-radius:18px;min-width:52px;min-height:52px;padding:7px;font-weight:900;box-shadow:0 10px 22px #000}.journey-node i{display:block;width:22px;height:22px;margin:0 auto 2px;border-radius:50%;background:#f59e0b;color:#111;font-style:normal}.journey-node.boss{background:#450a0a}.journey-node.battle{background:#431407}.journey-node.active{outline:3px solid #facc15}.gate-landmark{position:absolute;right:24px;top:70px;width:76px;height:120px;border:8px solid #f59e0b;border-radius:50%;display:grid;place-items:center;text-align:center;font-size:12px;font-weight:900;box-shadow:0 0 40px #f59e0b}.battle-hybrid{border:1px solid #3f3f46;border-radius:28px;padding:12px;background:linear-gradient(180deg,#172554,#111827 45%,#2f1d0c);box-shadow:inset 0 30px 80px #38bdf833}.battle-camera{font-size:12px;text-transform:uppercase;letter-spacing:.16em;color:#93c5fd;margin:4px 0 10px}.tactical-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;transform:perspective(620px) rotateX(32deg);transform-origin:center top;min-height:330px}.tactical-cell{position:relative;min-height:58px;border:1px solid #ffffff22;background:linear-gradient(145deg,#334155aa,#0f172aaa);border-radius:10px;display:grid;place-items:center}.gate-cell{background:radial-gradient(circle,#f59e0b66,#111827 70%);color:#fde68a;font-size:10px;font-weight:900}.sprite-token{position:relative;transform:rotateX(-32deg);display:grid;place-items:center;min-width:42px}.sprite-shadow{position:absolute;bottom:-5px;width:48px;height:14px;border-radius:50%;background:#0009;filter:blur(2px)}.sprite-art{position:relative;width:42px;height:56px;border-radius:18px 18px 10px 10px;background:linear-gradient(180deg,#facc15,#7c2d12);display:grid;place-items:center;color:#111;font-weight:900;border:2px solid #fde68a}.sprite-token.enemy .sprite-art{background:linear-gradient(180deg,#ef4444,#450a0a);color:#fff;border-color:#fca5a5}.sprite-token.deity .sprite-art{width:54px;height:74px}.sprite-token small{position:relative;font-size:9px;color:#fff;text-shadow:0 1px 4px #000}.flow-stack{display:grid;gap:12px}.transition-ribbon{text-align:center;border:1px solid #854d0e;border-radius:18px;background:#1c1008;color:#fde68a;padding:10px;font-weight:900}.transition-ribbon.victory{border-color:#22c55e;color:#bbf7d0}

  `;
}
