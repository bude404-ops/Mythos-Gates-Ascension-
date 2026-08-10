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
  const files = ['project','factions','titans','npcs','creatures','maps','campaigns','chapters','lore-index','art-prompts','artworks','visual-screens','visual-change-rules','visual-baselines','development-tasks'];
  const entries = await Promise.all(files.map(async key => [key, await fetch(`../data/${key}.json${q}`).then(r => {
    if (!r.ok) throw new Error(`Failed to load ${key}`);
    return r.json();
  })]));
  return Object.fromEntries(entries);
}

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const first = value => Array.isArray(value) ? value[0] : value;

export function getPreviewEntity(data, entityId) {
  return [...data.titans, ...data.npcs, ...data.factions, ...data.creatures, ...data.maps, ...data.campaigns].find(item => item.id === entityId) || data.titans[0];
}

export function getAffectedScreens(data, changeType = 'titan-artwork') {
  const rule = data['visual-change-rules'].find(item => item.changeType === changeType);
  if (!rule) return [];
  return rule.affectedScreens.map(id => data['visual-screens'].find(screen => screen.id === id)).filter(Boolean);
}

function artPanel(entity, prompt) {
  const status = entity.artStatus || entity.artPipelineStatus || 'No Approved Artwork';
  return `<div class="art-slot"><div class="art-glow"></div><div class="art-label">${esc(entity.name)}</div><div class="art-status">${esc(status)}</div><div class="art-note">${prompt ? 'Prompt ready · artwork pending repository approval' : 'No prompt linked'}</div></div>`;
}

function titanCard(titan, prompt, dev) {
  return `<article class="game-card titan-card"><div class="micro">${esc(titan.id)} · ${esc(titan.faction)} · ${esc(titan.rarity || 'Titan')}</div>${artPanel(titan, prompt)}<h3>${esc(titan.name)}</h3><p>${esc(titan.role || 'Realm Titan')}</p><div class="stat-row"><b>ATK ${esc(titan.stats?.attack ?? titan.atk ?? '—')}</b><b>HP ${esc(titan.stats?.hp ?? titan.hp ?? '—')}</b><b>RNG ${esc(titan.stats?.range ?? titan.range ?? '—')}</b></div><p class="ability">${esc(first(titan.abilities)?.name || first(titan.abilities) || titan.signatureAbility || 'Signature ability pending')}</p>${dev ? `<div class="dev-chip">component: TitanCard · prompt: ${esc(titan.artPromptId || prompt?.id || 'none')}</div>` : ''}</article>`;
}

function shell(title, body, data, state) {
  const dev = state.devMode;
  return `<section class="game-shell ${dev ? 'dev-on' : ''}"><div class="preview-banner"><div><b>TITAN GATES — DEVELOPMENT PREVIEW</b><span>Build ${esc(data.project.version)} · Branch development · ${esc(data.project.lastUpdate)}</span></div><a href="../game/index.html" target="_blank" rel="noreferrer">Open Live Game</a></div><header class="game-hero"><p>Visual Game Preview</p><h1>${esc(title)}</h1><span>${dev ? 'DEV VIEW' : 'PLAYER VIEW'}</span></header>${body}${dev ? `<aside class="dev-overlay"><b>Dev Overlay</b><span>screen: ${esc(state.screen)}</span><span>entity: ${esc(state.entityId || 'auto')}</span><span>source: /data/*.json</span><span>component: shared-preview.js</span></aside>` : ''}</section>`;
}

export function renderGameScreen(data, state = {}) {
  const screen = state.screen || 'home';
  const dev = state.devMode !== false;
  const entity = getPreviewEntity(data, state.entityId);
  const prompts = data['art-prompts'];
  const promptFor = id => prompts.find(p => p.entityId === id || p.id === id);
  const titans = data.titans.slice(0, 8);
  const factions = data.factions;
  const campaigns = data.campaigns;
  const maps = data.maps;
  const npcs = data.npcs;
  const creatures = data.creatures;
  let body = '';
  let title = 'Home';

  if (screen === 'home') {
    title = 'Ascension Command';
    body = `<div class="home-grid"><button>Begin Campaign</button><button>Select Titans</button><button>Codex</button><button>Settings</button></div><div class="game-card"><h3>Current Build</h3><p>${esc(data.project.phase)}</p><p>${esc(data.project.canonStatus)}</p></div>`;
  } else if (screen === 'profile') {
    title = 'Creator Profile';
    body = `<div class="game-card"><h3>Profile System In Development</h3><p>Progression, save state, achievements, and account-linked unlocks will appear here when implemented.</p></div>`;
  } else if (screen === 'titan-selection') {
    title = 'Titan Selection';
    body = `<div class="selection-grid">${titans.map(t => titanCard(t, promptFor(t.id), dev)).join('')}</div>`;
  } else if (screen === 'titan-profile') {
    const titan = entity.id?.startsWith('TG-TITAN') ? entity : data.titans[0];
    const prompt = promptFor(titan.id);
    title = titan.name;
    body = `<div class="profile-grid">${artPanel(titan, prompt)}<div class="game-card"><p class="micro">${esc(titan.id)} · ${esc(titan.faction)} · ${esc(titan.role)}</p><h3>${esc(titan.name)}</h3><p>${esc(titan.lore || titan.description || 'Lore connected through Codex.')}</p><div class="stat-row"><b>ATK ${esc(titan.stats?.attack ?? '—')}</b><b>DEF ${esc(titan.stats?.defense ?? '—')}</b><b>HP ${esc(titan.stats?.hp ?? '—')}</b></div><p class="ability">${esc(first(titan.abilities)?.name || 'Ability data ready')}</p></div></div>`;
  } else if (screen === 'character-profile') {
    const npc = entity.id?.startsWith('TG-NPC') ? entity : npcs[0];
    title = npc.name;
    body = `<div class="profile-grid">${artPanel(npc, promptFor(npc.id))}<div class="game-card"><p class="micro">${esc(npc.id)} · Non-playable · ${esc(npc.faction)}</p><h3>${esc(npc.role)}</h3><p>${esc(npc.lore)}</p><p class="ability">${esc(npc.gameplayFunction)}</p></div></div>`;
  } else if (screen === 'faction') {
    const faction = entity.id?.startsWith('TG-FACTION') ? entity : factions[0];
    title = faction.name;
    const factionTitans = data.titans.filter(t => t.factionId === faction.id || t.faction === faction.name).slice(0, 6);
    body = `<div class="game-card faction-banner"><p class="micro">${esc(faction.id)}</p><h3>${esc(faction.name)}</h3><p>${esc(faction.description)}</p><p>${esc(faction.visualIdentity)}</p></div><div class="selection-grid small">${factionTitans.map(t => titanCard(t, promptFor(t.id), dev)).join('')}</div>`;
  } else if (screen === 'campaign') {
    title = 'Campaign';
    body = `<div class="campaign-list">${campaigns.map(c => `<article class="game-card"><p class="micro">${esc(c.id)} · ${esc(c.phase)} · ${esc(c.status)}</p><h3>${esc(c.name)}</h3><p>${esc(c.summary)}</p><p class="ability">Maps ${esc(c.maps?.length||0)} · NPCs ${esc(c.npcs?.length||0)} · Creatures ${esc(c.creatures?.length||0)}</p></article>`).join('')}</div>`;
  } else if (screen === 'battle') {
    const map = maps[0], creature = creatures[0];
    title = 'Battle Preview';
    body = `<div class="battlefield"><div class="map-title"><b>${esc(map.name)}</b><span>${esc(map.status)}</span></div>${Array.from({length:25},(_,i)=>`<div class="tile ${i===12?'gate':''} ${[6,7,17].includes(i)?'enemy':''}">${i===12?'GATE':[6,7,17].includes(i)?'ENEMY':''}</div>`).join('')}</div><div class="game-card"><h3>${esc(creature.name)}</h3><p>${esc(creature.lore)}</p><p class="ability">Gameplay system in development: campaign encounter loading.</p></div>`;
  } else if (screen === 'victory' || screen === 'defeat') {
    title = screen === 'victory' ? 'Victory' : 'Defeat';
    body = `<div class="result-card ${screen}"><h3>${screen === 'victory' ? 'Gate Sealed' : 'Strike Force Broken'}</h3><p>${screen === 'victory' ? 'Rewards, Codex unlocks, and campaign progress preview.' : 'Retry, inspect lineup, and adjust Titan selection.'}</p><button>${screen === 'victory' ? 'Continue' : 'Retry'}</button></div>`;
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
  `;
}
