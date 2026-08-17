import { PHASES, STANCES, createBattleState, applyDeityAction, revealEnemyIntents, resolveEnemyPhase, applyReaction, applyTerrainTick, evaluateObjectives, autoAdvanceEnemyTurn, summarizeBattle, resolveMissionScaling, scaleEnemyForMission } from './browser-battle-engine.mjs';
import { renderBattlefieldOverviewView } from './views/battlefield-overview-view.mjs';
const STORAGE_KEY = 'tg.commandHub.playerState.v1';
const BOOT_STAGES = ['BOOT','INITIALIZATION','ASSET_PRELOAD','SAVE_DATA_LOAD','SAVE_VALIDATION','PLAYER_STATE_LOAD','CANON_DATA_LOAD','CONTENT_VALIDATION','TITLE_GATE_PRESENTATION','MAIN_COMMAND_HUB'];
const esc = x => String(x ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

export function createCommandHubRuntime(DATA, mount){
  const CONTRACT = DATA.commandHubContract || DATA['command-hub-contract'] || {};
  const ASSETS = DATA.assetRegistry || DATA['asset-registry'] || { assets: [] };
  if (typeof window !== 'undefined') window.__TG_COMMAND_HUB_DATA__ = DATA;
  const state = { route:'boot', bootIndex:0, startupMode:'firstLaunch', player:null, selectedTab:'battle', focusTitanId:null, battle:null, logs:[], lastError:null, perf:{ renderCount:0, partialResourceUpdates:0, routeRenderCount:{}, lastRenderMs:0, maxRenderMs:0, lastRoute:null, budgetMs:32, resourceOnlyBudgetMs:8, assetPreloadCount:0 } };
  const factions = () => DATA.factions || [];
  const deities = () => DATA.titans || [];
  const realms = () => DATA.realmCodex || DATA['realm-codex'] || [];
  const missions = () => DATA.missions || [];
  const battlefieldRegistry = () => DATA.battlefieldCanonRegistry || DATA['battlefield-canon-registry'] || {};
  const chapters = () => DATA.campaignChapters || DATA['campaign-chapter-registry'] || DATA.chapters || [];
  const playflow = () => DATA.campaignPlayflowContract || DATA['campaign-playflow-contract'] || {};
  const deityById = id => deities().find(t => t.id === id);
  const factionById = id => factions().find(f => f.id === id);
  const realmByFaction = id => realms().find(r => r.factionId === id) || {};
  const missionById = id => missions().find(m => m.id === id);
  const FALLBACK_CREATURES = [
    { id:'TG-CREATURE-001', name:'Hollow Wretch', combatRole:'SWARMER', abilities:['Scratch of Forgetting','Swarm Pressure'], mapBehavior:'Rushes isolated Deities and punishes careless positioning.', aiProfile:{ archetype:'SWARMER' }, stats:{ hp:45, damage:8, range:1, armor:2, resistance:2, movement:4, threatWeight:1 } },
    { id:'TG-CREATURE-002', name:'Gateborn Colossus', combatRole:'BRUTE', abilities:['Gate Stomp','Fracture Roar','Objective Crush'], mapBehavior:'Controls central objectives and forces Deities to split pressure.', aiProfile:{ archetype:'BRUTE' }, stats:{ hp:131, damage:17, range:1, armor:11, resistance:5, movement:3, threatWeight:2 } },
    // Cross-faction enemies (019-039): 3 per faction for future missions
    // Aten Ra (TG-FACTION-001)
    { id:'TG-CREATURE-019', name:'Aten Ra Sun-Seal Vigilant', combatRole:'CONTROLLER', abilities:['Aten Ray Lattice','Ma\u2019at Measure Bind','Solar Lane Verdict'], mapBehavior:'Locks lanes and punishes Deities who ignore objective geometry.', aiProfile:{ archetype:'CONTROLLER' }, stats:{ hp:126, damage:22, range:3, armor:7, resistance:8, movement:4, threatWeight:3 } },
    { id:'TG-CREATURE-020', name:'Khepri Scarab Dawn Engine', combatRole:'BRUTE', abilities:['Dawn Roll','Wingflare Guard','Silt-Glass Crush'], mapBehavior:'Advances slowly, guards Gates, and forces AoE decisions.', aiProfile:{ archetype:'BRUTE' }, stats:{ hp:88, damage:16, range:1, armor:7, resistance:5, movement:3, threatWeight:2 } },
    { id:'TG-CREATURE-021', name:'Uraeus Counter-Edict Serpent', combatRole:'DISRUPTOR', abilities:['Counter-Edict Spit','Blinding Crown','Law Venom'], mapBehavior:'Applies accuracy and cooldown pressure near lanes.', aiProfile:{ archetype:'DISRUPTOR' }, stats:{ hp:88, damage:16, range:3, armor:7, resistance:8, movement:4, threatWeight:2 } },
    // Asgardian (TG-FACTION-002)
    { id:'TG-CREATURE-022', name:'Storm-Oath Rime Raider', combatRole:'BRUTE', abilities:['Rime Axe Hook','Bridge-Oath Charge','Shieldwall Break'], mapBehavior:'Closes distance and uses chokepoints to force repositioning.', aiProfile:{ archetype:'BRUTE' }, stats:{ hp:88, damage:16, range:1, armor:7, resistance:5, movement:4, threatWeight:2 } },
    { id:'TG-CREATURE-023', name:'Thunder-Bridge Jotun', combatRole:'BRUTE', abilities:['Storm Boulder','Oath Roar','Bridge Quake'], mapBehavior:'Controls elevation and pushes the Deity away from objectives.', aiProfile:{ archetype:'BRUTE' }, stats:{ hp:126, damage:22, range:1, armor:7, resistance:5, movement:3, threatWeight:3 } },
    { id:'TG-CREATURE-024', name:'Valkyr Storm-Caller', combatRole:'GUARDIAN', abilities:['Gale Mark','Oath Mend','Raven Sight'], mapBehavior:'Buffs melee units and marks exposed Deity routes.', aiProfile:{ archetype:'GUARDIAN' }, stats:{ hp:88, damage:16, range:3, armor:7, resistance:8, movement:4, threatWeight:2 } },
    // Olympian (TG-FACTION-003)
    { id:'TG-CREATURE-025', name:'Olympian Laurel Hoplon Guard', combatRole:'GUARDIAN', abilities:['Phalanx Pin','Laurel Guard','Trial Rebuke'], mapBehavior:'Creates defensive walls and protects ranged allies.', aiProfile:{ archetype:'GUARDIAN' }, stats:{ hp:88, damage:16, range:1, armor:7, resistance:5, movement:3, threatWeight:2 } },
    { id:'TG-CREATURE-026', name:'Oracle Glass Archer', combatRole:'CONTROLLER', abilities:['Predicted Shot','Skyline Volley','Fate Thread Mark'], mapBehavior:'Fires from elevation and rewards closing lanes.', aiProfile:{ archetype:'CONTROLLER' }, stats:{ hp:88, damage:16, range:3, armor:5, resistance:5, movement:4, threatWeight:2 } },
    { id:'TG-CREATURE-027', name:'Bronze Chimera Trialbeast', combatRole:'ELITE', abilities:['Tri-Aspect Maul','Arena Flame','Serpent Feint'], mapBehavior:'Combines melee, hazard, and debuff pressure.', aiProfile:{ archetype:'ELITE' }, stats:{ hp:126, damage:22, range:1, armor:7, resistance:5, movement:4, threatWeight:3 } },
    // Kami (TG-FACTION-004)
    { id:'TG-CREATURE-028', name:'Kami Torii Foxfire Runner', combatRole:'HUNTER', abilities:['Foxfire Dash','Mirror Feint','Seal Nip'], mapBehavior:'Flanks the Deity and baits wasted AoE.', aiProfile:{ archetype:'HUNTER' }, stats:{ hp:88, damage:16, range:1, armor:5, resistance:5, movement:5, threatWeight:2 } },
    { id:'TG-CREATURE-029', name:'Mirror-Lake Onryo', combatRole:'DISRUPTOR', abilities:['Grudge Pull','Reflection Hex','Drowned Silence'], mapBehavior:'Pulls the Deity toward hazards and slows recovery.', aiProfile:{ archetype:'DISRUPTOR' }, stats:{ hp:88, damage:16, range:3, armor:7, resistance:8, movement:4, threatWeight:2 } },
    { id:'TG-CREATURE-030', name:'Storm Komainu Guardian', combatRole:'GUARDIAN', abilities:['Threshold Guard','Thunder Bite','Ward Howl'], mapBehavior:'Guards objective gates and protects support spirits.', aiProfile:{ archetype:'GUARDIAN' }, stats:{ hp:126, damage:22, range:1, armor:7, resistance:5, movement:3, threatWeight:3 } },
    // Tuatha (TG-FACTION-005)
    { id:'TG-CREATURE-031', name:'Avalora Moon-Grove Stagwarden', combatRole:'CONTROLLER', abilities:['Moonroot Shot','Grove Snare','Memory Antler'], mapBehavior:'Controls paths with roots and punishes straight-line movement.', aiProfile:{ archetype:'CONTROLLER' }, stats:{ hp:88, damage:16, range:3, armor:5, resistance:5, movement:4, threatWeight:2 } },
    { id:'TG-CREATURE-032', name:'Bog Sidhe Hexer', combatRole:'GUARDIAN', abilities:['Name-Tax Hex','Mire Veil','Debt Ward'], mapBehavior:'Debuffs priority abilities and shields allies.', aiProfile:{ archetype:'GUARDIAN' }, stats:{ hp:88, damage:16, range:3, armor:7, resistance:8, movement:4, threatWeight:2 } },
    { id:'TG-CREATURE-033', name:'Ancient Root Ogre', combatRole:'BRUTE', abilities:['Root Slam','Living Wall','Spore Stagger'], mapBehavior:'Blocks chokepoints and creates destructible terrain pressure.', aiProfile:{ archetype:'BRUTE' }, stats:{ hp:126, damage:22, range:1, armor:7, resistance:5, movement:3, threatWeight:3 } },
    // Empyrean (TG-FACTION-006)
    { id:'TG-CREATURE-034', name:'Empyrean Radiant Censor', combatRole:'CONTROLLER', abilities:['Censure Beam','Halo Sight','Contradiction Brand'], mapBehavior:'Marks the Deity and supports disciplined ranged fire.', aiProfile:{ archetype:'CONTROLLER' }, stats:{ hp:88, damage:16, range:3, armor:5, resistance:5, movement:4, threatWeight:2 } },
    { id:'TG-CREATURE-035', name:'Throne-Spear Adjudicator', combatRole:'BRUTE', abilities:['Adjudicator Thrust','Radiant Interdict','Edict Step'], mapBehavior:'Uses reach and zone denial to pin Deity movement.', aiProfile:{ archetype:'BRUTE' }, stats:{ hp:126, damage:22, range:1, armor:7, resistance:5, movement:4, threatWeight:3 } },
    { id:'TG-CREATURE-036', name:'Seraphic Bastion Servitor', combatRole:'GUARDIAN', abilities:['Bastion Wing','Sanction Shield','Order Pulse'], mapBehavior:'Protects ranged units and counters reckless cleaves.', aiProfile:{ archetype:'GUARDIAN' }, stats:{ hp:88, damage:16, range:1, armor:7, resistance:5, movement:3, threatWeight:2 } },
    // Infernal Dominion (TG-FACTION-007)
    { id:'TG-CREATURE-037', name:'Infernal Cinder-Chain Bailiff', combatRole:'CONTROLLER', abilities:['Chain Writ','Debt Drag','Cinder Lock'], mapBehavior:'Drags the Deity into bad positions and taxes movement.', aiProfile:{ archetype:'CONTROLLER' }, stats:{ hp:88, damage:16, range:3, armor:7, resistance:8, movement:4, threatWeight:2 } },
    { id:'TG-CREATURE-038', name:'Brass Hellhound Packfiend', combatRole:'HUNTER', abilities:['Pack Lunge','Scent of Debt','Ash Snap'], mapBehavior:'Fast pressure unit that surrounds and exposes the Deity.', aiProfile:{ archetype:'HUNTER' }, stats:{ hp:88, damage:16, range:1, armor:5, resistance:5, movement:5, threatWeight:2 } },
    { id:'TG-CREATURE-039', name:'Black Iron Executor', combatRole:'ELITE', abilities:['Execution Arc','Sentence Mark','Furnace Guard'], mapBehavior:'Elite burst threat with telegraphed lethal windows.', aiProfile:{ archetype:'ELITE' }, stats:{ hp:126, damage:22, range:1, armor:7, resistance:5, movement:4, threatWeight:3 } }
  ];
  const creatures = () => (DATA.creatures && DATA.creatures.length ? DATA.creatures : DATA.hollowCreatures && DATA.hollowCreatures.length ? DATA.hollowCreatures : FALLBACK_CREATURES);
  const creatureById = id => creatures().find(c => c.id === id);
  const chapterById = id => chapters().find(c => c.id === id) || (playflow().flow||[]).flatMap(f=>f.chapterRoutes||[]).find(c=>c.chapterId===id);
  const log = (type, message, data={}) => state.logs.unshift({ type, message, data, at:new Date().toISOString() });
  const STARTER_TITAN_IDS = ['TG-TITAN-001','TG-TITAN-006','TG-TITAN-009'];
  const AWAKENING_BEATS = [
    { step:1, id:'AWAKEN_FIRST_DEITY', lesson:'Awaken first Deity', missionBeat:'The Gate opens; the Deity crosses alone.', playableSystem:'starter binding', milestone:'AWAKENING_BEAT_01' },
    { step:2, id:'MOVEMENT_BASIC_ATTACKS', lesson:'Movement and basic attacks', missionBeat:'Claim safe lanes before the Hollow reaches the seal.', playableSystem:'movement + basic attack', milestone:'AWAKENING_BEAT_02' },
    { step:3, id:'ABILITIES_POSITIONING', lesson:'Abilities and positioning', missionBeat:'Enemies force use of range, facing, and safe lanes.', playableSystem:'technique timing', milestone:'AWAKENING_BEAT_03' },
    { step:4, id:'MOMENTUM_REACTIONS', lesson:'Momentum and reactions', missionBeat:'First telegraphed attack creates dodge, parry, or counter timing.', playableSystem:'reaction window', milestone:'AWAKENING_BEAT_04' },
    { step:5, id:'TERRAIN_DISCIPLINE', lesson:'Terrain', missionBeat:'Judgment rays, ruins, and river-light lanes reward terrain mastery.', playableSystem:'terrain interaction', milestone:'AWAKENING_BEAT_05' },
    { step:6, id:'FIRST_ELITE', lesson:'First elite', missionBeat:'An elite teaches priority target and stance discipline.', playableSystem:'elite focus target', milestone:'AWAKENING_BEAT_06' },
    { step:7, id:'FIRST_BUILD_CHOICE', lesson:'First meaningful build choice', missionBeat:'Choose an ability evolution or stance upgrade, not a flat stat.', playableSystem:'build choice preview', milestone:'AWAKENING_BEAT_07' },
    { step:8, id:'FIRST_BOSS', lesson:'First boss', missionBeat:'A multi-phase Gate enemy exposes a weakness window.', playableSystem:'boss phase preview', milestone:'AWAKENING_BEAT_08' },
    { step:9, id:'SECOND_TITAN_ENCOUNTER', lesson:'Second Deity encounter', missionBeat:'A second Deity appears through a story battlefield event and solves a problem differently.', playableSystem:'specialist contrast', milestone:'AWAKENING_BEAT_09' },
    { step:10, id:'TITAN_TRIAL_HANDOFF', lesson:'Divine Trial', missionBeat:'Temporarily pilot a second Deity with its mechanic, sample gear, and Divine Ascension.', playableSystem:'temporary trial', milestone:'AWAKENING_BEAT_10' },
    { step:11, id:'FIRST_FACTION_DISCOVERY', lesson:'First faction discovery', missionBeat:'A Gate incident reveals another canon faction as a new world.', playableSystem:'realm discovery', milestone:'AWAKENING_BEAT_11' },
    { step:12, id:'FACTION_TRIAL_HANDOFF', lesson:'Faction Trial', missionBeat:'A short faction trial teaches environment, combat philosophy, Codex, and deity identity.', playableSystem:'faction trial', milestone:'AWAKENING_BEAT_12' }
  ];
  function completeAwakeningBeat(player, step){
    const ob=ensureOnboarding(player); const beat=AWAKENING_BEATS.find(b=>b.step===step); if(!beat) return ob;
    if(!ob.completedBeatIds.includes(beat.id)) ob.completedBeatIds.push(beat.id);
    if(!ob.milestones.includes(beat.milestone)) ob.milestones.push(beat.milestone);
    ob.currentBeat = Math.min(AWAKENING_BEATS.length, Math.max(ob.currentBeat||1, step+1));
    return ob;
  }
  function awakeningProgress(player=ensurePlayerState()){ const ob=ensureOnboarding(player); const total=AWAKENING_BEATS.length; const done=ob.completedBeatIds.length; return { total, done, percent:Math.round((done/total)*100), current:AWAKENING_BEATS.find(b=>b.step===ob.currentBeat)||AWAKENING_BEATS[total-1] }; }
  function starterTitans(){ const rows=STARTER_TITAN_IDS.map(deityById).filter(Boolean); return rows.length?rows:(deities()[0]?[deities()[0]]:[]); }
  function ensureOnboarding(player){
    player.onboarding ||= { status:'AWAKENING', starterTitanId:null, milestones:[], awakeningMissionId:null, currentBeat:1, completedBeatIds:[], starterChoiceReason:null, fullRosterHidden:true };
    player.onboarding.milestones ||= [];
    player.onboarding.completedBeatIds ||= [];
    player.onboarding.status ||= player.onboarding.starterTitanId?'COMPLETE':'AWAKENING';
    player.onboarding.currentBeat = Number(player.onboarding.currentBeat||1);
    player.onboarding.fullRosterHidden = player.onboarding.status !== 'COMPLETE';
    player.onboarding.awakeningMissionId ||= player.campaignProgress?.currentMissionId || missions()[0]?.id;
    return player.onboarding;
  }
  const TRIAL_TITAN_IDS = ['TG-TITAN-005','TG-TITAN-005','TG-TITAN-010'];
  const TRIAL_MODES = [
    { id:'TEMP_LOADOUT', label:'Temporary Loadout', rule:'Borrowed relics vanish after the showcase; only Trial Favor persists.' },
    { id:'FACTION_TRIAL', label:'Faction Trial', rule:'Aten Ra tactical pressure teaches roster difference without requiring ownership.' },
    { id:'ASCENSION_SHOWCASE', label:'Divine Ascension Preview', rule:'Signature burst is demonstrated at capped power; no ranked or shop currency rewards.' }
  ];
  function trialTitans(){ const rows=TRIAL_TITAN_IDS.map(deityById).filter(Boolean); return rows.length?rows:deities().slice(1,4); }
  function ensureTrials(player){
    player.deityTrials ||= { attempts:[], completions:[], bestScores:{}, trialFavor:0, showcasedTitanIds:[], conversions:[] };
    player.deityTrials.attempts ||= [];
    player.deityTrials.completions ||= [];
    player.deityTrials.bestScores ||= {};
    player.deityTrials.showcasedTitanIds ||= [];
    player.deityTrials.conversions ||= [];
    player.deityTrials.trialFavor = Number(player.deityTrials.trialFavor||0);
    player.factionTrials ||= { completions:[], bestScores:{} };
    player.factionTrials.completions ||= [];
    player.factionTrials.bestScores ||= {};
    return player.deityTrials;
  }

  const AudioManager = { play(hook){ if(state.player?.settings?.audioEnabled !== false) log('audio', hook); } };
  const AssetManager = {
    cache:new Map(),
    forEntity(entityId, type){
      const key=`${entityId||'unknown'}:${type||'any'}`;
      if(this.cache.has(key)) return this.cache.get(key);
      const asset=(ASSETS.assets||[]).find(a=>a.entityId===entityId && (!type || a.assetType===type)) || { status:'PLACEHOLDER', fallback:'canon-safe-placeholder', requirements:'Canon-safe placeholder' };
      this.cache.set(key, asset);
      return asset;
    },
    resolvedPath(asset){ return asset?.status==='FINAL' && asset.finalPath ? asset.finalPath : (asset?.path || asset?.fallback || 'canon-safe-placeholder'); },
    fallbackActive(asset){ return !(asset?.status==='FINAL' && asset.finalPath); },
    badge(asset){ return asset?.status==='FINAL' ? 'FINAL ART' : 'FALLBACK'; },
    visibleArtReport(player=ensurePlayerState()){
      const ctx=currentVisualContext(player);
      const selected=player.selectedDeities.map(id=>this.forEntity(id,'TITAN_PRESENTATION'));
      return [ctx.bg, ctx.gate, ...selected].map(a=>({ assetId:a.assetId||'MISSING', entityId:a.entityId||'UNKNOWN', type:a.assetType||'UNKNOWN', status:a.status||'PLACEHOLDER', path:this.resolvedPath(a), fallback:a.fallback||null, fallbackActive:this.fallbackActive(a), provenance:a.provenance||a.requirements||'Canon-safe placeholder' }));
    },
    preloadVisible(){ const p=ensurePlayerState(); const preload=[...p.selectedDeities.map(id=>this.forEntity(id,'TITAN_PRESENTATION')), this.forEntity(p.campaignProgress.currentFactionId,'COMMAND_HUB_BACKGROUND'), this.forEntity(p.campaignProgress.currentFactionId,'GATE')]; state.perf.assetPreloadCount+=preload.length; return preload; }
  };

  function canonicalDefaultPlayer(){
    const base = JSON.parse(JSON.stringify(CONTRACT.defaultPlayerState || {}));
    const firstFaction = factions()[0];
    const firstFlow = (playflow().flow||[]).find(f=>f.factionId===firstFaction?.id) || (playflow().flow||[])[0];
    const firstChapter = firstFlow?.chapterRoutes?.[0];
    const firstMission = firstChapter?.defaultMissionId || firstChapter?.normalMissionIds?.[0] || missions()[0]?.id;
    base.playerId ||= 'TG-PLAYER-LOCAL-001'; base.playerName ||= 'Gate Commander'; base.level ||= 1;
    base.experience ||= { current:0, next:100 };
    base.resources ||= [];
    base.selectedDeities = (base.selectedDeities || []).filter(id=>deityById(id));
    if(!base.selectedDeities.length && deities()[0]) base.selectedDeities=[deities()[0].id];
    base.unlockedContent ||= { campaign:true, deities:true, gates:true, codex:true, elite:false, arena:false, pvp:false, developerTools:true };
    base.campaignProgress ||= {};
    base.campaignProgress.currentFactionId ||= firstFaction?.id;
    base.campaignProgress.currentChapterId ||= firstChapter?.chapterId || firstChapter?.id;
    base.campaignProgress.currentMissionId ||= firstMission;
    base.campaignProgress.completedMissionIds ||= [];
    base.campaignProgress.claimedRewards ||= [];
    base.quests ||= [{ id:'TG-QUEST-FIRST-GATE', title:'Open the First Gate', objective:'Launch the first campaign mission.', status:'ACTIVE', progress:0, target:1 }];
    base.onboarding ||= { status:'AWAKENING', starterTitanId:null, milestones:['GATE_SIGNAL_DETECTED'], awakeningMissionId:firstMission, currentBeat:1, completedBeatIds:[], starterChoiceReason:null, fullRosterHidden:true };
    base.notifications ||= [];
    base.settings ||= { reducedMotion:false, audioEnabled:true };
    return base;
  }

  function ensureResource(player,id,name,amount=0){
    player.resources = Array.isArray(player.resources) ? player.resources : [];
    let row = player.resources.find(r=>r.id===id);
    if(!row){ row={id,name,amount}; player.resources.push(row); }
    row.amount = Number(row.amount||0);
    return row;
  }
  function normalizeProgression(player){
    player.campaignProgress ||= {};
    player.campaignProgress.completedMissionIds ||= [];
    player.campaignProgress.claimedRewards ||= [];
    player.campaignProgress.pendingRewards ||= [];
    player.campaignProgress.rewardHistory ||= [];
    player.raidProgress ||= { attempts:[], completions:[], bestScores:{} };
    player.raidProgress.attempts ||= [];
    player.raidProgress.completions ||= [];
    player.raidProgress.bestScores ||= {};
    player.raidProgress.masteryByTitanId ||= {};
    player.raidProgress.weeklyTokens ||= {};
    player.raidProgress.materialHistory ||= [];
    ensureResource(player,'TG-RES-GATE-SHARDS','Gate Shards',0);
    ensureResource(player,'TG-RES-ASCENSION-EMBER','Ascension Ember',0);
    ensureResource(player,'TG-RES-DEITY-RELICS','Deity Relics',0);
    ensureResource(player,'TG-RES-RAID-TOKENS','Raid Tokens',0);
    ensureResource(player,'TG-RES-SIGNATURE-ALLOY','Signature Alloy',0);
    ensureResource(player,'TG-RES-MASTERY-SEALS','Mastery Seals',0);
    ensureResource(player,'TG-RES-TRIAL-FAVOR','Trial Favor',0);
    ensureOnboarding(player);
    ensureTrials(player);
    player.experience ||= { current:0, next:100 };
    player.experience.current = Number(player.experience.current||0);
    player.experience.next = Number(player.experience.next||100);
    return player;
  }
  function validatePlayerState(player){
    const diagnostics=[];
    if(!player || typeof player !== 'object') diagnostics.push('SAVE_NOT_OBJECT');
    const p = normalizeProgression(player && typeof player === 'object' ? player : canonicalDefaultPlayer());
    p.selectedDeities = (p.selectedDeities || []).filter(id => deityById(id));
    if(!p.selectedDeities.length) { diagnostics.push('NO_VALID_SELECTED_DEITY'); p.selectedDeities = canonicalDefaultPlayer().selectedDeities; }
    if(!missionById(p.campaignProgress?.currentMissionId)) { diagnostics.push('INVALID_CURRENT_MISSION'); p.campaignProgress = canonicalDefaultPlayer().campaignProgress; normalizeProgression(p); }
    if(!factionById(p.campaignProgress?.currentFactionId)) { diagnostics.push('INVALID_CURRENT_FACTION'); p.campaignProgress.currentFactionId = canonicalDefaultPlayer().campaignProgress.currentFactionId; }
    p.resources = Array.isArray(p.resources) ? p.resources : [];
    p.notifications = deriveNotifications(p);
    return { ok: diagnostics.length === 0, player:p, diagnostics };
  }

  function loadPlayerState(){
    let raw = null;
    try { raw = localStorage.getItem(STORAGE_KEY); } catch(e) { state.lastError = 'LOCAL_STORAGE_UNAVAILABLE'; }
    state.startupMode = raw ? 'returningPlayer' : 'firstLaunch';
    if(!raw) return canonicalDefaultPlayer();
    try { return validatePlayerState(JSON.parse(raw)).player; }
    catch(e){
      log('error','Corrupt save detected; preserving backup and loading safe default',{ error:String(e) });
      try { localStorage.setItem(`${STORAGE_KEY}.corrupt.${Date.now()}`, raw); } catch(_) {}
      return canonicalDefaultPlayer();
    }
  }
  function savePlayerState(){ try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.player)); } catch(e){ log('error','Save failed',{ error:String(e) }); } }
  function ensurePlayerState(){ if(!state.player) state.player = loadPlayerState(); return state.player; }

  function deriveNotifications(player){
    const notes=[]; const current=missionById(player.campaignProgress?.currentMissionId);
    if(current && !(player.campaignProgress.completedMissionIds||[]).includes(current.id)) notes.push({ id:'TG-NOTE-CONTINUE-CAMPAIGN', type:'campaign', label:'Campaign objective waiting', route:'battle' });
    if((player.campaignProgress.pendingRewards||[]).length) notes.push({ id:'TG-NOTE-REWARD', type:'reward', label:`${player.campaignProgress.pendingRewards.length} reward cache${player.campaignProgress.pendingRewards.length===1?'':'s'} pending`, route:'command' });
    for(const id of player.selectedDeities||[]){ const t=deityById(id); if(t && (t.abilityDetails||[]).some(a=>a.unlockLevel<=player.level+1 && a.unlockLevel>player.level)) notes.push({ id:`TG-NOTE-${id}-UPGRADE`, type:'deity', label:'Deity upgrade soon', route:'titans', entityId:id }); }
    return notes;
  }

  function getNextRecommendedAction(player=ensurePlayerState()){
    const validation = validatePlayerState(player);
    if(!validation.ok) return { label:'RECOVER SAVE', route:'command', reason:validation.diagnostics.join(', ') };
    const reward = player.notifications.find(n=>n.type==='reward'); if(reward) return { label:'CLAIM REWARD', route:'command', reason:'Unclaimed progression reward detected.' };
    if(!player.selectedDeities?.length) return { label:'SELECT DEITY', route:'titans', reason:'A valid Deity must be selected.' };
    const mission = missionById(player.campaignProgress.currentMissionId);
    if(mission) return { label:(player.campaignProgress.completedMissionIds||[]).includes(mission.id)?'VIEW NEW CONTENT':'CONTINUE CAMPAIGN', route:'mission', missionId:mission.id, reason:mission.title || mission.id };
    return { label:'START CAMPAIGN', route:'campaigns', reason:'No current mission was found.' };
  }

  function nextMissionAfter(missionId){
    const m=missionById(missionId); if(!m) return null;
    const ordered=missions().filter(x=>x.factionId===m.factionId && (x.type||x.campaignType||'Normal')===(m.type||m.campaignType||'Normal')).sort((a,b)=>(a.n||0)-(b.n||0));
    return ordered[ordered.findIndex(x=>x.id===missionId)+1] || null;
  }
  function tacticalProfileForMission(mission){
    const p=mission?.tacticalProfile || {};
    const problemTags=Array.isArray(p.problemTags)?p.problemTags:[];
    const advantageRoles=Array.isArray(p.advantageRoles)?p.advantageRoles:[];
    const recommendedDeities=Array.isArray(p.recommendedDeities)?p.recommendedDeities:[];
    return { problemTags, advantageRoles, recommendedDeities, favoredNotRequired:p.favoredNotRequired!==false, ownershipLock:p.ownershipLock===true, rule:p.rule||'Recommended advantages only — any valid active Deity can attempt the mission.' };
  }
  function missionTacticalBrief(mission){
    const p=tacticalProfileForMission(mission);
    try { window.__TG_LAST_TACTICAL_PROFILE__ = p; } catch(_) {}
    const tagBadges=p.problemTags.length?p.problemTags.map(t=>badge(t.replaceAll('_',' '))).join(''):'<span class="text-sm text-neutral-500">No tactical tags assigned.</span>';
    const roleBadges=p.advantageRoles.length?p.advantageRoles.map(r=>badge(r,'ok')).join(''):'<span class="text-sm text-neutral-500">No role advantage listed.</span>';
    const recRows=p.recommendedDeities.length?p.recommendedDeities.map(t=>`<p class="rounded-2xl bg-neutral-950 p-3 text-sm"><b class="text-primary">${esc(t.name||t.id)}</b><br/><span class="text-neutral-400">${esc(t.reason||'Specialist advantage, not required.')}</span></p>`).join(''):'<p class="rounded-2xl bg-neutral-950 p-3 text-sm text-neutral-400">Any selected Deity may attempt this mission.</p>';
    return `<section class="rounded-3xl border border-neutral-800 bg-neutral-900 p-5"><p class="text-xs font-black uppercase tracking-[.28em] text-primary">Tactical Read · Favored Not Required</p><h2 class="mt-1 text-2xl font-black">Mission Problem Profile</h2><p class="mt-2 text-sm text-neutral-300">${esc(p.rule)}</p><div class="mt-4 grid gap-3 md:grid-cols-3"><article class="rounded-2xl bg-neutral-950 p-3"><p class="text-xs font-black uppercase tracking-[.18em] text-neutral-500">Problem Tags</p><div class="mt-2 flex flex-wrap gap-2">${tagBadges}</div></article><article class="rounded-2xl bg-neutral-950 p-3"><p class="text-xs font-black uppercase tracking-[.18em] text-neutral-500">Advantage Roles</p><div class="mt-2 flex flex-wrap gap-2">${roleBadges}</div></article><article class="rounded-2xl bg-neutral-950 p-3"><p class="text-xs font-black uppercase tracking-[.18em] text-neutral-500">Ownership Lock</p><b class="text-bull-400">${p.ownershipLock?'Blocked':'None'}</b></article></div><div class="mt-3 grid gap-2 md:grid-cols-3">${recRows}</div></section>`;
  }
  function createRewardCache(player, mission, battle){
    normalizeProgression(player);
    const firstClear = !(player.campaignProgress.completedMissionIds||[]).includes(mission.id);
    const missionType = String(mission.type||mission.campaignType||'Normal').toUpperCase();
    const multiplier = missionType==='ELITE' ? 2 : 1;
    const basePower = Number(mission.recommendedPower||mission.power||120);
    const shardAmount = firstClear ? Math.max(10, Math.round(basePower/18)*multiplier) : Math.max(2, Math.round(basePower/60));
    const emberAmount = firstClear && missionType==='ELITE' ? 1 : 0;
    const relicAmount = firstClear && Number(mission.n||1)%5===0 ? 1 : 0;
    const xp = firstClear ? Math.max(25, Math.round(basePower/8)) : Math.max(5, Math.round(basePower/30));
    return { id:`TG-REWARD-${mission.id}-${firstClear?'FIRST':'REPLAY'}-${Date.now()}`, missionId:mission.id, title:mission.title||mission.id, firstClear, missionType, status:'PENDING', summary:firstClear?'First-clear cache secured.':'Replay cache secured under anti-exploit limits.', grants:{ gateShards:shardAmount, ascensionEmber:emberAmount, deityRelics:relicAmount, xp }, battleSummary:summarizeBattle(battle), createdAt:new Date().toISOString() };
  }
  function advanceCampaignAfterClear(player, mission){
    const next=nextMissionAfter(mission.id);
    if(next){ player.campaignProgress.currentMissionId=next.id; player.campaignProgress.currentChapterId=player.campaignProgress.currentChapterId || mission.chapterId; }
    return next;
  }
  function applyRewardCache(player, cache){
    normalizeProgression(player);
    ensureResource(player,'TG-RES-GATE-SHARDS','Gate Shards').amount += cache.grants.gateShards||0;
    ensureResource(player,'TG-RES-ASCENSION-EMBER','Ascension Ember').amount += cache.grants.ascensionEmber||0;
    ensureResource(player,'TG-RES-DEITY-RELICS','Deity Relics').amount += cache.grants.deityRelics||0;
    ensureResource(player,'TG-RES-RAID-TOKENS','Raid Tokens').amount += cache.grants.raidTokens||0;
    ensureResource(player,'TG-RES-SIGNATURE-ALLOY','Signature Alloy').amount += cache.grants.signatureAlloy||0;
    ensureResource(player,'TG-RES-MASTERY-SEALS','Mastery Seals').amount += cache.grants.masterySeals||0;
    ensureResource(player,'TG-RES-TRIAL-FAVOR','Trial Favor').amount += cache.grants.trialFavor||0;
    player.experience.current += cache.grants.xp||0;
    while(player.experience.current >= player.experience.next){ player.experience.current -= player.experience.next; player.level += 1; player.experience.next = Math.round(player.experience.next * 1.18); }
    cache.status='CLAIMED'; cache.claimedAt=new Date().toISOString();
    player.campaignProgress.claimedRewards.push(cache.id);
    player.campaignProgress.rewardHistory.unshift(cache);
    player.campaignProgress.rewardHistory=player.campaignProgress.rewardHistory.slice(0,12);
    return cache;
  }

  function raidSystem(){ return DATA.raidSystem || DATA['raid-system'] || {}; }
  function raidDesign(){ return raidSystem().status==='IMPLEMENTED' ? raidSystem() : (DATA.raidDesignDocument || DATA['raid-design-document'] || {}); }
  function raidBoss(){ return (raidSystem().bosses||[])[0] || { id:'TG-RAID-BOSS-001', name:'The Gate Warden', phases:['Sealfield Approach','Guardian Interdiction','Weakness Window','Gate Destabilization','Divine Enrage'], mechanics:['Seal pillar objectives','Telegraphed hazard lanes','Reaction windows','Weakness exposure','Final Divine confrontation'], rewards:['raidCurrency','signatureGearMaterial'] }; }
  const FALLBACK_RAID_STAGES = [
    { stage:1, name:'Gatefield Trial', goal:'Solve battlefield hazard/objective under pressure.', checks:['movement','terrain interaction','Momentum routing'] },
    { stage:2, name:'Elite Interdiction', goal:'Defeat protected elites or break ritual guards.', checks:['priority targeting','reaction discipline','build counterplay'] },
    { stage:3, name:'Boss Revelation', goal:'Fight first boss phase and learn core mechanic.', checks:['weakness exposure','stance timing','telegraphed survival'] },
    { stage:4, name:'Realm Collapse', goal:'Battlefield changes; hazards, routes, and objectives mutate.', checks:['adaptation','terrain destruction','resource conservation'] },
    { stage:5, name:'Divine Confrontation', goal:'Final boss phase / enemy Deity Ascension duel.', checks:['Divinity timing','execution routing','perfect reactions'] }
  ];
  function raidRules(){ const r=raidDesign(); return { tierCaps:r.tierCaps||{}, approachRules:r.approachRules||{}, scoreFormula:r.scoreFormula||{}, economyCaps:r.economyCaps||{} }; }
  function raidStages(){ const design=raidDesign(); const rows=(design.stageProfiles&&design.stageProfiles.length?design.stageProfiles:(design.standardStructure&&design.standardStructure.length?design.standardStructure:FALLBACK_RAID_STAGES)); return rows.map((s,i)=>({ stage:s.stage||i+1, name:s.name||raidBoss().phases?.[i]||`Stage ${i+1}`, goal:s.goal||raidBoss().mechanics?.[i]||'Resolve raid mechanic.', problemTags:s.problemTags||s.tags||[], checks:s.checks||[], preferredCounters:s.preferredCounters||[], carryRisk:s.carryRisk||'Carry score, damage, and turn pressure into the next stage.', target:s.target ?? (i===0?2:i===1?2:i===2?1:i===3?2:1), baseScore:s.baseScore||s.score||140-(i*8) })); }
  function createRaidAttempt(player,tier='RAID_NORMAL'){
    normalizeProgression(player); const boss=raidBoss(); const stages=raidStages();
    const attempt={ id:`TG-RAID-ATTEMPT-${Date.now()}`, raidId:'TG-RAID-001', bossId:boss.id, name:boss.name, tier, activeTitanId:player.selectedDeities?.[0], stageIndex:0, status:'ACTIVE', score:0, damageTaken:0, turns:0, resolvedStages:[], modifiers:['Ruptured Gate Lanes','Reaction Discipline'], startedAt:new Date().toISOString(), stages };
    state.raid=attempt; player.raidProgress.attempts.unshift({ id:attempt.id, raidId:attempt.raidId, tier, status:'ACTIVE', startedAt:attempt.startedAt }); player.raidProgress.attempts=player.raidProgress.attempts.slice(0,8); savePlayerState(); log('raid','Raid attempt started',{raidId:attempt.raidId,tier}); return attempt;
  }
  function ensureRaid(){ const p=ensurePlayerState(); if(!state.raid || state.raid.status!=='ACTIVE') return createRaidAttempt(p,'RAID_NORMAL'); return state.raid; }
  function resolveRaidStage(attempt, approach='BALANCED'){
    const s=attempt.stages[attempt.stageIndex]; if(!s || attempt.status!=='ACTIVE') return attempt;
    const rules=raidRules(); const tier=rules.tierCaps[attempt.tier]||{scoreMultiplier:1,damageMultiplier:1,maxReplayTokens:6}; const a=rules.approachRules[approach]||rules.approachRules.BALANCED||{scoreBonus:12,damageTaken:3,turns:2};
    const stageScore=Math.max(40, Math.round(((s.baseScore||s.score||100) + (a.scoreBonus||0)) * (tier.scoreMultiplier||1))); const damage=Math.max(0, Math.round((a.damageTaken||0) * (tier.damageMultiplier||1))); const turns=Math.max(1, Number(a.turns||2));
    attempt.score += stageScore; attempt.damageTaken += damage; attempt.turns += turns;
    attempt.resolvedStages.push({ stage:s.stage, name:s.name, approach, score:stageScore, damageTaken:damage, turns, problemTags:s.problemTags||[], preferredCounters:s.preferredCounters||[], carryRisk:s.carryRisk, checks:s.checks, resolvedAt:new Date().toISOString() });
    attempt.stageIndex += 1;
    if(attempt.stageIndex >= attempt.stages.length){ attempt.status='VICTORY'; attempt.completedAt=new Date().toISOString(); attempt.finalScore=Math.max(0,attempt.score - attempt.damageTaken*6 - attempt.turns*2); }
    return attempt;
  }
  function resolveRaidEconomy(player, attempt){
    normalizeProgression(player);
    const score=Math.max(0,Number(attempt.finalScore||attempt.score||0));
    const tuning=raidRules().economyTuning || {};
    const bands=tuning.qualityBands || raidRules().scoreFormula?.qualityBands || {S:560,A:500,B:430,C:0};
    const quality=score>=Number(bands.S||560)?'S':score>=Number(bands.A||500)?'A':score>=Number(bands.B||430)?'B':'C';
    const firstClear=!(player.raidProgress.completions||[]).some(c=>c.raidId===attempt.raidId && c.tier===attempt.tier);
    const firstRules=tuning.firstClear || { tokenBonus:8, ascensionEmber:1, deityRelics:2, masterySeals:1, payoutScalar:1 };
    const replayRules=tuning.replay || { payoutScalar:0.42, minReplayTokens:2, weeklyDecayPerClear:1, sReplayMasterySeals:1, nonSReplayMasterySeals:0 };
    const replayScalar=firstClear?Number(firstRules.payoutScalar||1):Number(replayRules.payoutScalar||0.42);
    const weeklyKey=`${attempt.raidId}:${attempt.tier}`;
    const weeklyCount=Number(player.raidProgress.weeklyTokens[weeklyKey]||0);
    const table=tuning.qualityRewardTable || {S:{tokenBase:16,signatureAlloy:5,masteryXpScalar:1},A:{tokenBase:13,signatureAlloy:4,masteryXpScalar:.86},B:{tokenBase:10,signatureAlloy:3,masteryXpScalar:.72},C:{tokenBase:7,signatureAlloy:2,masteryXpScalar:.58}};
    const row=table[quality] || table.C;
    const tier=raidRules().tierCaps[attempt.tier]||{rewardMultiplier:1,maxReplayTokens:6};
    const rewardMultiplier=Number((tuning.tierRewardMultipliers||{})[attempt.tier] || tier.rewardMultiplier || 1);
    const cap=Number((tuning.weeklyReplayTokenCaps||{})[attempt.tier] || tier.maxReplayTokens || 6);
    const weeklyDecay=Number(replayRules.weeklyDecayPerClear||1);
    const tokenBase=Number(row.tokenBase||7);
    const replayBase=Math.max(Number(replayRules.minReplayTokens||2), Math.min(cap, tokenBase - (weeklyCount*weeklyDecay)));
    const raidTokens=Math.round((firstClear ? tokenBase + Number(firstRules.tokenBonus||8) : replayBase) * replayScalar * rewardMultiplier);
    const signatureAlloy=Math.max(Number(tuning.materialCaps?.signatureAlloyMinimum||1), Math.round(Number(row.signatureAlloy||2)*replayScalar*rewardMultiplier));
    const masterySeals=firstClear?Number(firstRules.masterySeals||1):(quality==='S'?Number(replayRules.sReplayMasterySeals||1):Number(replayRules.nonSReplayMasterySeals||0));
    const masteryRules=tuning.masteryCredit || { firstClearDivisor:18, replayDivisor:40 };
    const divisor=firstClear?Number(masteryRules.firstClearDivisor||18):Number(masteryRules.replayDivisor||40);
    const masteryXp=Math.round((score/divisor)*Number(row.masteryXpScalar||1));
    return { quality, firstClear, replayScalar, weeklyKey, weeklyCount, caps:{ weeklyReplayTokenCap:cap, rewardMultiplier, replayBase, gearMaterialBand:row.gearMaterialBand||'stable' }, grants:{ gateShards:Math.round(score/14*replayScalar), ascensionEmber:firstClear?Number(firstRules.ascensionEmber||1):0, deityRelics:firstClear?Number(firstRules.deityRelics||2):1, raidTokens, signatureAlloy, masterySeals, xp:Math.round(score/4*replayScalar), masteryXp } };
  }
  function applyRaidMastery(player, attempt, economy){
    normalizeProgression(player); const titanId=attempt.activeTitanId||player.selectedDeities?.[0]||'UNKNOWN_DEITY';
    const row=player.raidProgress.masteryByTitanId[titanId] ||= { titanId, clears:0, bestScore:0, masteryXp:0, seals:0 };
    row.clears += 1; row.bestScore=Math.max(row.bestScore||0, attempt.finalScore||attempt.score||0); row.masteryXp += economy.grants.masteryXp||0; row.seals += economy.grants.masterySeals||0; row.lastRaidId=attempt.raidId; row.lastQuality=economy.quality;
    player.raidProgress.weeklyTokens[economy.weeklyKey]=economy.weeklyCount+1;
    player.raidProgress.materialHistory.unshift({ raidId:attempt.raidId, tier:attempt.tier, titanId, quality:economy.quality, firstClear:economy.firstClear, grants:economy.grants, at:new Date().toISOString() });
    player.raidProgress.materialHistory=player.raidProgress.materialHistory.slice(0,12);
    return row;
  }
  function completeRaidAttempt(player, attempt){
    normalizeProgression(player); if(!attempt || attempt.status!=='VICTORY') return null;
    const key=`${attempt.raidId}:${attempt.tier}`; player.raidProgress.bestScores[key]=Math.max(player.raidProgress.bestScores[key]||0, attempt.finalScore||attempt.score||0);
    const economy=resolveRaidEconomy(player, attempt);
    const mastery=applyRaidMastery(player, attempt, economy);
    const completion={ id:attempt.id, raidId:attempt.raidId, name:attempt.name, tier:attempt.tier, score:attempt.finalScore, quality:economy.quality, firstClear:economy.firstClear, activeTitanId:attempt.activeTitanId, damageTaken:attempt.damageTaken, turns:attempt.turns, completedAt:attempt.completedAt, stages:attempt.resolvedStages.length };
    player.raidProgress.completions.unshift(completion); player.raidProgress.completions=player.raidProgress.completions.slice(0,12);
    const cache={ id:`TG-REWARD-${attempt.raidId}-${attempt.tier}-${Date.now()}`, missionId:attempt.raidId, title:`${attempt.name} Raid Cache`, firstClear:economy.firstClear, missionType:attempt.tier, status:'PENDING', summary:`${economy.quality}-grade raid economy cache: mastery credit, capped replay payout, and non-pay-to-win materials.`, grants:economy.grants, raidSummary:{...completion, mastery}, economy, createdAt:new Date().toISOString() };
    player.campaignProgress.pendingRewards.push(cache); player.notifications=deriveNotifications(player); savePlayerState(); state.raid=null; log('raid','Raid completed',{raidId:attempt.raidId,score:attempt.finalScore,quality:economy.quality,rewardId:cache.id}); return cache;
  }

  function createTrialAttempt(player, titanId=trialTitans()[0]?.id){
    normalizeProgression(player); const deity=deityById(titanId)||trialTitans()[0]||deityById(player.selectedDeities?.[0]);
    const mode=TRIAL_MODES[(player.deityTrials.attempts.length||0)%TRIAL_MODES.length];
    const attempt={ id:`TG-TRIAL-ATTEMPT-${Date.now()}`, trialId:'TG-TRIAL-001', titanId:deity?.id, deityName:deity?.name||'Trial Deity', factionId:deity?.factionId||'TG-FACTION-001', mode:mode.id, modeLabel:mode.label, tempLoadout:{ relic:'Borrowed Solar Reliquary', gearScore:72, expires:'END_OF_TRIAL' }, status:'ACTIVE', score:0, turns:0, damageTaken:0, lessons:['Read battlefield fit','Test unique mechanic','Compare collection reason'], startedAt:new Date().toISOString() };
    state.trial=attempt; player.deityTrials.attempts.unshift({ id:attempt.id, titanId:attempt.titanId, mode:attempt.mode, status:'ACTIVE', startedAt:attempt.startedAt }); player.deityTrials.attempts=player.deityTrials.attempts.slice(0,8); savePlayerState(); log('trial','Trial attempt started',{titanId:attempt.titanId,mode:attempt.mode}); return attempt;
  }
  function resolveTrialAttempt(player, attempt, approach='BALANCED'){
    normalizeProgression(player); if(!attempt || attempt.status!=='ACTIVE') return null;
    const deity=deityById(attempt.titanId)||{}; const aggressive=approach==='AGGRESSIVE', studied=approach==='STUDIED';
    const roleScore=String(deity.role||deity.previousRole||'').length*3; const archetypeScore=(deity.soloArchetypes||[]).length*18;
    const score=Math.max(120, 250 + roleScore + archetypeScore + (studied?42:aggressive?20:34));
    const damageTaken=studied?1:aggressive?5:3; const turns=studied?4:aggressive?2:3; const quality=score>=340?'S':score>=310?'A':score>=270?'B':'C';
    attempt.status='COMPLETE'; attempt.score=score; attempt.damageTaken=damageTaken; attempt.turns=turns; attempt.quality=quality; attempt.completedAt=new Date().toISOString();
    const firstShowcase=!player.deityTrials.showcasedTitanIds.includes(attempt.titanId); if(firstShowcase) player.deityTrials.showcasedTitanIds.push(attempt.titanId);
    const favor=Math.round(({S:18,A:14,B:10,C:7}[quality])*(firstShowcase?1.35:0.55)); const xp=Math.round(score/7); const shardGrant=firstShowcase?Math.round(score/26):Math.round(score/80);
    player.deityTrials.trialFavor += favor; ensureResource(player,'TG-RES-TRIAL-FAVOR','Trial Favor').amount += favor;
    player.deityTrials.bestScores[attempt.titanId]=Math.max(player.deityTrials.bestScores[attempt.titanId]||0, score);
    const completion={ id:attempt.id, trialId:attempt.trialId, titanId:attempt.titanId, deityName:attempt.deityName, mode:attempt.mode, quality, score, firstShowcase, favor, completedAt:attempt.completedAt };
    player.deityTrials.completions.unshift(completion); player.deityTrials.completions=player.deityTrials.completions.slice(0,12);
    player.factionTrials.bestScores[attempt.factionId]=Math.max(player.factionTrials.bestScores[attempt.factionId]||0, score); player.factionTrials.completions.unshift({ factionId:attempt.factionId, titanId:attempt.titanId, score, quality, at:attempt.completedAt }); player.factionTrials.completions=player.factionTrials.completions.slice(0,12);
    const cache={ id:`TG-REWARD-${attempt.trialId}-${attempt.titanId}-${Date.now()}`, missionId:attempt.trialId, title:`${attempt.deityName} Trial Cache`, firstClear:firstShowcase, missionType:'TITAN_TRIAL', status:'PENDING', summary:`${quality}-grade temporary loadout showcase. Trial Favor persists; borrowed gear does not.`, grants:{ gateShards:shardGrant, ascensionEmber:0, deityRelics:firstShowcase?1:0, raidTokens:0, signatureAlloy:0, masterySeals:0, trialFavor:favor, xp }, trialSummary:completion, createdAt:new Date().toISOString() };
    player.campaignProgress.pendingRewards.push(cache); player.notifications=deriveNotifications(player); state.trial=null; savePlayerState(); log('trial','Trial completed',{titanId:attempt.titanId,quality,score,rewardId:cache.id}); return cache;
  }

  function setRoute(route, payload={}){ Object.assign(state, payload, { route }); AudioManager.play(route==='hub'?'menu_open':'tab_change'); render(); }
  function bottomNav(){
    const tabs = [{id:'battle',label:'BATTLE'},{id:'battlefields',label:'FIELDS'},{id:'titans',label:'DEITIES'},{id:'trials',label:'TRIALS'},{id:'command',label:'COMMAND'}];
    const routeMap={battle:'hub',battlefields:'battlefields',deities:'titans',trials:'trials',raid:'raid',command:'command'};
    return `<nav class="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-800 bg-neutral-950/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 backdrop-blur"><div class="mx-auto grid max-w-3xl grid-cols-5 gap-1">${tabs.slice(0,5).map(t=>`<button data-nav="${esc(t.id)}" class="min-h-[52px] rounded-2xl ${state.selectedTab===t.id?'bg-primary text-white':'bg-neutral-900 text-neutral-300'} px-2 text-xs font-black tracking-[.12em]" onclick="TGHub.openTab('${esc(t.id)}')">${esc(t.label||t.id)}</button>`).join('')}</div></nav>`;
  }
  function shell(content){ return `${content}${bottomNav()}`; }
  function badge(text,tone='primary'){ const cls=tone==='ok'?'bg-bull-950 text-bull-400':tone==='bad'?'bg-bear-950 text-bear-400':'bg-primary/15 text-primary'; return `<span class="rounded-full ${cls} px-3 py-1 text-xs font-black uppercase tracking-[.12em]">${esc(text)}</span>`; }


  function resourceBar(player){
    return `<div data-resource-bar class="flex gap-2 overflow-x-auto pb-1">${(player.resources||[]).map(r=>`<div data-resource-id="${esc(r.id)}" class="min-w-[112px] rounded-2xl border border-neutral-800 bg-neutral-950/80 px-3 py-2"><p class="text-[10px] uppercase tracking-[.18em] text-neutral-500">${esc(r.name)}</p><b data-resource-amount class="text-lg text-primary-light">${esc(r.amount)}</b></div>`).join('')}</div>`;
  }
  function refreshResourceBar(player=ensurePlayerState()){
    const started=performance.now();
    const rows=mount.querySelectorAll('[data-resource-id]');
    if(!rows.length) return false;
    const byId=new Map((player.resources||[]).map(r=>[r.id,r]));
    rows.forEach(row=>{ const r=byId.get(row.dataset.resourceId); const amount=row.querySelector('[data-resource-amount]'); if(r && amount && amount.textContent!==String(r.amount)) amount.textContent=String(r.amount); });
    state.perf.partialResourceUpdates++;
    state.perf.lastResourceUpdateMs=Number((performance.now()-started).toFixed(3));
    return true;
  }
  function profileHeader(player){
    const xp = Math.max(0, Math.min(100, Math.round(((player.experience?.current||0)/(player.experience?.next||100))*100)));
    return `<header class="sticky top-0 z-30 border-b border-neutral-800 bg-neutral-950/90 px-3 py-2 backdrop-blur"><div class="mx-auto max-w-5xl"><div class="flex items-center justify-between gap-3"><button onclick="TGHub.go('hub')" class="text-left"><p class="text-[10px] font-black uppercase tracking-[.24em] text-primary">Titan Gates: Ascension</p><h1 class="text-xl font-black">${esc(player.playerName)}</h1></button><button onclick="TGHub.go('command')" class="relative rounded-2xl bg-neutral-900 px-3 py-2 text-sm font-black">LV ${esc(player.level)}${player.notifications.length?`<span class="absolute -right-1 -top-1 rounded-full bg-bear-500 px-1.5 text-[10px] text-white">${player.notifications.length}</span>`:''}</button></div><div class="mt-2 h-1.5 rounded-full bg-neutral-800"><div class="h-full rounded-full bg-primary" style="width:${xp}%"></div></div><div class="mt-2">${resourceBar(player)}</div></div></header>`;
  }
  function currentVisualContext(player){
    const f=factionById(player.campaignProgress.currentFactionId)||factions()[0]||{};
    const r=realmByFaction(f.id);
    return { faction:f, realm:r, bg:AssetManager.forEntity(f.id,'COMMAND_HUB_BACKGROUND'), gate:AssetManager.forEntity(r?.id || f.id,'GATE') };
  }
  function artBadge(asset){ return `<span data-art-status="${esc(asset?.status||'PLACEHOLDER')}" class="rounded-full ${asset?.status==='FINAL'?'bg-bull-950 text-bull-400':'bg-yellow-950 text-yellow-400'} px-2 py-1 text-[10px] font-black uppercase tracking-[.14em]">${esc(AssetManager.badge(asset))}</span>`; }
  function artProvenancePanel(player){
    const rows=AssetManager.visibleArtReport(player).map(a=>`<div class="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3"><div class="flex items-center justify-between gap-2"><p class="text-[10px] font-black uppercase tracking-[.18em] text-neutral-500">${esc(a.type)}</p>${artBadge(a)}</div><p class="mt-1 line-clamp-1 text-sm font-black text-neutral-50">${esc(a.entityId)}</p><p data-art-path class="mt-1 line-clamp-1 text-[11px] text-primary">${esc(a.path)}</p><p class="mt-1 line-clamp-2 text-[11px] text-neutral-500">${esc(a.fallbackActive?'Fallback active · '+(a.fallback||'none'):a.provenance)}</p></div>`).join('');
    return `<section data-art-provenance class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4"><div class="flex items-center justify-between gap-3"><div><p class="text-xs font-black uppercase tracking-[.24em] text-primary">Art Integration</p><h3 class="text-2xl font-black">Final slots online</h3></div>${badge('Manifest Safe','ok')}</div><div class="mt-3 grid gap-2 sm:grid-cols-3">${rows}</div></section>`;
  }
  function deitySilhouette(t, i){
    const asset=AssetManager.forEntity(t.id,'TITAN_PRESENTATION'); const rarity=t.rarity||'Unknown'; const power=t.stats?.combatPower||t.stats?.attack||'—';
    const h = i===0?'h-56':'h-44'; const w=i===0?'w-32':'w-24';
    return `<button onclick="TGHub.focusDeity('${esc(t.id)}')" class="group relative flex min-w-[92px] flex-col items-center justify-end active:scale-[.98]" title="${esc(AssetManager.resolvedPath(asset))}"><div class="absolute bottom-14 h-8 w-28 rounded-full bg-primary/20 blur-xl"></div><div data-art-slot="${esc(asset.assetId||t.id)}" class="${h} ${w} rounded-t-[64px] border border-primary/30 bg-gradient-to-b from-neutral-700 via-neutral-900 to-neutral-950 shadow-dark-outline ${i===0?'animate-pulse':''}"><div class="mx-auto mt-3 flex justify-center">${artBadge(asset)}</div><div class="mx-auto mt-4 h-10 w-10 rounded-full bg-primary/20"></div><div class="mx-auto mt-4 h-20 w-16 rounded-3xl bg-neutral-800"></div></div><div class="relative -mt-8 w-full rounded-2xl border border-neutral-800 bg-neutral-950/90 p-2 text-center"><p class="line-clamp-1 text-xs font-black text-neutral-50">${esc(t.name)}</p><p class="text-[10px] uppercase tracking-[.14em] text-primary">LV ${esc((state.player?.level||1))} · ${esc(rarity)}</p><p class="text-[10px] text-neutral-500">PWR ${esc(power)}</p></div></button>`;
  }
  function primaryAction(player){
    const action=getNextRecommendedAction(player);
    return `<button class="w-full rounded-3xl bg-primary px-5 py-5 text-center text-2xl font-black text-white shadow-dark-outline active:scale-[.99]" onclick="TGHub.primary()"><span class="block text-[11px] uppercase tracking-[.28em] text-white/70">Recommended</span>${esc(action.label)}<span class="mt-1 block text-sm font-semibold text-white/80">${esc(action.reason)}</span></button>`;
  }
  function hub(){
    const player=ensurePlayerState(); const ctx=currentVisualContext(player); const selected=player.selectedDeities.map(deityById).filter(Boolean); const mission=missionById(player.campaignProgress.currentMissionId)||{};
    return shell(`${profileHeader(player)}<main class="mx-auto max-w-5xl space-y-4 px-3 pb-36 pt-3"><section class="relative min-h-[500px] overflow-hidden rounded-[2rem] border border-primary/30 bg-neutral-900 p-4 shadow-dark-outline"><div class="absolute inset-0 bg-gradient-to-b from-primary/20 via-neutral-950 to-neutral-950"></div><div class="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full border border-primary/30 bg-primary/10 blur-sm"></div><div class="absolute left-1/2 top-12 h-64 w-40 -translate-x-1/2 rounded-t-full border-4 border-primary/40 bg-neutral-950/30 shadow-dark-outline"></div><div class="absolute inset-0 opacity-40"><div class="absolute left-8 top-24 h-2 w-2 rounded-full bg-primary"></div><div class="absolute right-12 top-36 h-1.5 w-1.5 rounded-full bg-bull-400"></div><div class="absolute bottom-44 left-1/3 h-1 w-1 rounded-full bg-yellow-400"></div></div><div class="relative z-10 flex items-start justify-between gap-3"><div><p class="text-xs font-black uppercase tracking-[.28em] text-primary">Command Hub</p><h2 class="mt-1 text-4xl font-black leading-none">I Command Deities</h2><p class="mt-2 max-w-lg text-sm text-neutral-300">${esc(ctx.realm.coreTone || ctx.faction.visualIdentity || 'Canon-safe Gate command environment')}</p></div>${badge(state.startupMode==='firstLaunch'?'First Launch':'Returning Player','ok')}</div><div class="relative z-10 mt-10 flex min-h-[310px] items-end justify-center gap-2 overflow-x-auto px-2"><div class="absolute bottom-8 h-16 w-[90%] rounded-[50%] bg-neutral-950/80 blur-xl"></div>${selected.map(deitySilhouette).join('')}</div><div class="relative z-10 mt-4 grid gap-3 md:grid-cols-[1fr_.7fr]"><div>${primaryAction(player)}</div><article class="rounded-3xl border border-neutral-800 bg-neutral-950/85 p-4"><p class="text-xs font-black uppercase tracking-[.22em] text-primary">Current Objective</p><h3 class="mt-1 text-xl font-black">${esc(mission.title||'Open the First Gate')}</h3><p class="mt-1 line-clamp-3 text-sm text-neutral-300">${esc(mission.description||mission.primary||'Launch the first campaign mission.')}</p><p class="mt-2 text-xs text-neutral-500">${esc(ctx.realm.gate || 'Massive canon-safe Gate')} · ${esc(ctx.faction.realm || ctx.faction.name)} · ${esc(AssetManager.badge(ctx.bg))} background · ${esc(AssetManager.badge(ctx.gate))} gate</p></article></div></section>${artProvenancePanel(player)}</main>`);
  }
  function title(){
    const first=state.startupMode==='firstLaunch';
    return `<main class="min-h-screen overflow-hidden bg-neutral-950 text-neutral-50"><section class="relative flex min-h-screen flex-col items-center justify-end p-5 pb-14 text-center"><div class="absolute inset-0 bg-gradient-to-b from-neutral-950 via-primary/10 to-neutral-950"></div><div class="absolute top-24 h-72 w-48 rounded-t-full border-4 border-primary/40 bg-neutral-900/60 shadow-dark-outline"></div><div class="absolute top-8 h-96 w-96 rounded-full bg-primary/10 blur-3xl"></div><div class="relative z-10 mb-12"><p class="text-xs font-black uppercase tracking-[.32em] text-primary">${first?'The Gate Awakens':'Gate Link Restored'}</p><h1 class="mt-2 text-5xl font-black leading-none">Titan Gates:<br/>Ascension</h1><p class="mx-auto mt-4 max-w-sm text-neutral-300">${first?'A massive Gate opens in the dark. Divine energy stirs. Your first Deity answers.':'Returning player state detected. The Command Hub is ready.'}</p><button onclick="TGHub.enterHub()" class="mt-8 rounded-3xl bg-primary px-8 py-5 text-xl font-black text-white">TAP TO ENTER</button></div></section></main>`;
  }
  function awakeningScreen(){
    const player=ensurePlayerState(); const onboarding=ensureOnboarding(player); const selected=onboarding.starterTitanId; const progress=awakeningProgress(player); const cards=starterTitans().map(t=>`<button onclick="TGHub.chooseStarter('${esc(t.id)}')" class="rounded-3xl border ${selected===t.id?'border-primary bg-primary/15':'border-neutral-800 bg-neutral-900'} p-4 text-left active:scale-[.99]"><p class="text-xs font-black uppercase tracking-[.22em] text-primary">Starter Deity · ${esc(t.role)}</p><h3 class="mt-1 text-2xl font-black">${esc(t.name)}</h3><p class="mt-2 text-sm text-neutral-300">${esc(t.role==='Defender'?'Long survival, objective holding, hazard endurance.':t.role==='Controller'?'Fast enemies, terrain-heavy battles, caster denial.':'Heavily armored enemies, shield windows, boss armor phases.')}</p><p class="mt-3 rounded-2xl bg-neutral-950 p-3 text-xs text-neutral-500">Canon-safe starter set only. Full roster remains hidden until Command unlock.</p></button>`).join('');
    const beats=AWAKENING_BEATS.map(b=>{ const done=onboarding.completedBeatIds.includes(b.id); const live=progress.current?.id===b.id; return `<li class="rounded-2xl border ${done?'border-bull-500/40 bg-bull-950/20':live?'border-primary/60 bg-primary/10':'border-neutral-800 bg-neutral-950'} p-3"><b class="${done?'text-bull-400':'text-primary'}">${esc(b.step)} · ${esc(b.lesson)}</b><p class="text-sm text-neutral-400">${esc(b.missionBeat)}</p><p class="mt-1 text-[11px] uppercase tracking-[.16em] text-neutral-500">${esc(b.playableSystem)}</p></li>`; }).join('');
    return `<main class="min-h-screen overflow-auto bg-neutral-950 p-4 text-neutral-50"><section class="mx-auto max-w-5xl space-y-4"><header class="rounded-[2rem] border border-primary/40 bg-neutral-900 p-5"><p class="text-xs font-black uppercase tracking-[.3em] text-primary">Awakening Protocol · TG-DEV-026</p><h1 class="mt-2 text-5xl font-black leading-none">Choose the Deity that answers first.</h1><p class="mt-3 max-w-2xl text-neutral-300">Aten Ra opens the first safe Gate. You choose one active deity for the Awakening path — no full roster flood, no forced purchase pressure.</p><div class="mt-4 grid gap-2 sm:grid-cols-4"><div class="rounded-2xl bg-neutral-950 p-3"><p class="text-xs text-neutral-500">Starter</p><b>${esc(selected||'Unbound')}</b></div><div class="rounded-2xl bg-neutral-950 p-3"><p class="text-xs text-neutral-500">Beats</p><b>${esc(progress.done)}/${esc(progress.total)}</b></div><div class="rounded-2xl bg-neutral-950 p-3"><p class="text-xs text-neutral-500">Roster</p><b>${onboarding.fullRosterHidden?'Hidden':'Unlocked'}</b></div><div class="rounded-2xl bg-neutral-950 p-3"><p class="text-xs text-neutral-500">Policy</p><b>No P2W</b></div></div><div class="mt-4 h-2 rounded-full bg-neutral-800"><div class="h-full rounded-full bg-primary" style="width:${progress.percent}%"></div></div>${selected?badge('Starter bound','ok'):badge('Awaiting choice','bad')}</header><section class="grid gap-3 md:grid-cols-3">${cards}</section><section class="grid gap-3 md:grid-cols-[.9fr_1.1fr]"><article class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4"><h2 class="text-2xl font-black">Awakening Beats</h2><ul class="mt-3 max-h-[520px] space-y-2 overflow-auto pr-1">${beats}</ul></article><article class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4"><h2 class="text-2xl font-black">First Gate Handoff</h2><p class="mt-2 text-neutral-300">After binding, the Command Hub opens directly into the first solo mission. The 12-beat path now tracks tutorial, trial, and faction-discovery milestones before the roster opens.</p><button ${selected?'':'disabled'} onclick="TGHub.advanceAwakeningBeat()" class="mt-5 w-full rounded-3xl ${selected?'bg-neutral-800 text-white':'bg-neutral-800 text-neutral-500'} px-5 py-4 text-lg font-black">ADVANCE CURRENT BEAT</button><button ${selected?'':'disabled'} onclick="TGHub.finishAwakening()" class="mt-3 w-full rounded-3xl ${selected?'bg-primary text-white':'bg-neutral-800 text-neutral-500'} px-5 py-5 text-xl font-black">BEGIN AWAKENING MISSION</button></article></section></section></main>`;
  }
  function boot(){
    const stage=BOOT_STAGES[state.bootIndex] || 'MAIN_COMMAND_HUB';
    return `<main class="flex min-h-screen items-center justify-center bg-neutral-950 p-6 text-neutral-50"><section class="w-full max-w-sm rounded-3xl border border-primary/30 bg-neutral-900 p-5 text-center"><p class="text-xs font-black uppercase tracking-[.32em] text-primary">Startup Pipeline</p><h1 class="mt-2 text-3xl font-black">${esc(stage)}</h1><div class="mt-4 h-2 rounded-full bg-neutral-800"><div class="h-full rounded-full bg-primary" style="width:${Math.round(((state.bootIndex+1)/BOOT_STAGES.length)*100)}%"></div></div><p class="mt-3 text-sm text-neutral-400">Boot · asset preload · save validation · canon load · title Gate.</p></section></main>`;
  }


  function lockedPanel(title, why, progress='Progress depends on campaign state.'){
    return `<section class="rounded-3xl border border-neutral-800 bg-neutral-900 p-5"><p class="text-xs font-black uppercase tracking-[.24em] text-bear-400">Locked / Future</p><h2 class="mt-1 text-3xl font-black">${esc(title)}</h2><p class="mt-2 text-neutral-300">${esc(why)}</p><p class="mt-3 rounded-2xl bg-neutral-950 p-3 text-sm text-neutral-400">${esc(progress)}</p></section>`;
  }
  function campaigns(){
    const player=ensurePlayerState();
    const rows=factions().map(f=>{ const flow=(playflow().flow||[]).find(x=>x.factionId===f.id); const r=realmByFaction(f.id); return `<button onclick="TGHub.openCampaign('${esc(f.id)}')" class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4 text-left active:scale-[.99]"><p class="text-xs font-black uppercase tracking-[.22em] text-primary">${esc(r.gate||f.realm)}</p><h3 class="mt-1 text-2xl font-black">${esc(f.name)}</h3><p class="mt-2 line-clamp-3 text-sm text-neutral-300">${esc(f.philosophy)}</p><div class="mt-3 flex flex-wrap gap-2">${badge(`${flow?.chapterCount||0} chapters`,'ok')}${badge(`${flow?.normalMissionCount||0} normal`)}${badge(`${flow?.eliteMissionCount||0} elite`)}</div></button>`; }).join('');
    return shell(`${profileHeader(player)}<main class="mx-auto max-w-5xl space-y-4 px-3 pb-28 pt-3"><button onclick="TGHub.go('hub')" class="rounded-2xl bg-neutral-800 px-4 py-3 font-black">← Command Hub</button><header class="rounded-3xl border border-primary/40 bg-neutral-900 p-5"><p class="text-xs font-black uppercase tracking-[.28em] text-primary">Battle</p><h1 class="text-4xl font-black">Campaign Gates</h1><p class="mt-2 text-neutral-300">All faction entries come directly from the canonical faction registry.</p></header><div class="grid gap-3 md:grid-cols-2">${rows}</div></main>`);
  }
  function missionScreen(){
    const player=ensurePlayerState(); const m=missionById(player.campaignProgress.currentMissionId) || missions()[0]; const f=factionById(m?.factionId)||{};
    if(!m) return shell(`${profileHeader(player)}<main class="p-3 pb-28">${lockedPanel('Missing campaign mission','The current mission id did not resolve. Safe fallback prevented a blank screen.')}</main>`);
    return shell(`${profileHeader(player)}<main class="mx-auto max-w-4xl space-y-4 px-3 pb-28 pt-3"><button onclick="TGHub.go('hub')" class="rounded-2xl bg-neutral-800 px-4 py-3 font-black">← Command Hub</button><section class="rounded-3xl border border-primary/40 bg-neutral-900 p-5"><p class="text-xs font-black uppercase tracking-[.28em] text-primary">${esc(f.name)} · Mission</p><h1 class="mt-1 text-4xl font-black">${esc(m.title)}</h1><p class="mt-2 text-neutral-300">${esc(m.description||m.lore||m.objectives?.primary)}</p><div class="mt-4 grid gap-2 sm:grid-cols-3"><div class="rounded-2xl bg-neutral-950 p-3"><p class="text-xs text-neutral-500">Power</p><b>${esc(m.recommendedPower||m.power||'—')}</b></div><div class="rounded-2xl bg-neutral-950 p-3"><p class="text-xs text-neutral-500">Map</p><b>${esc(m.mapName||m.mapId||'Canon map')}</b></div><div class="rounded-2xl bg-neutral-950 p-3"><p class="text-xs text-neutral-500">Type</p><b>${esc(m.campaignType||m.type||'Normal')}</b></div></div><button onclick="TGHub.launchBattle()" class="mt-5 w-full rounded-3xl bg-primary px-5 py-5 text-2xl font-black text-white">ENTER BATTLE</button></section>${missionTacticalBrief(m)}</main>`);
  }
  function titansScreen(){
    const player=ensurePlayerState(); const selected=new Set(player.selectedDeities||[]);
    const rows=deities().slice(0,63).map(t=>`<button onclick="TGHub.toggleDeity('${esc(t.id)}')" class="rounded-3xl border ${selected.has(t.id)?'border-primary bg-primary/10':'border-neutral-800 bg-neutral-900'} p-4 text-left"><p class="text-xs font-black uppercase tracking-[.2em] text-primary">${esc(t.faction)} · ${esc(t.rarity)}</p><h3 class="mt-1 text-xl font-black">${esc(t.name)}</h3><p class="mt-1 text-sm text-neutral-300">${esc(t.role)} · PWR ${esc(t.stats?.combatPower||'—')}</p><p class="mt-2 line-clamp-2 text-xs text-neutral-500">${esc(t.visualDescription)}</p></button>`).join('');
    return shell(`${profileHeader(player)}<main class="mx-auto max-w-5xl space-y-4 px-3 pb-28 pt-3"><button onclick="TGHub.go('hub')" class="rounded-2xl bg-neutral-800 px-4 py-3 font-black">← Command Hub</button><header class="rounded-3xl border border-primary/40 bg-neutral-900 p-5"><p class="text-xs font-black uppercase tracking-[.28em] text-primary">Deity Roster</p><h1 class="text-4xl font-black">Canonical Deities</h1><p class="mt-2 text-neutral-300">Selection writes to PlayerState. Deity cards read canonical Deity IDs only.</p>${badge(`${player.selectedDeities.length} selected`,'ok')}</header><div class="grid gap-3 md:grid-cols-2">${rows}</div></main>`);
  }
  function gatesScreen(){
    const player=ensurePlayerState();
    const rows=realms().map(r=>{ const gate=AssetManager.forEntity(r.id,'GATE'); return `<button onclick="TGHub.setRealm('${esc(r.factionId)}')" class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4 text-left"><div class="flex items-start justify-between gap-2"><p class="text-xs font-black uppercase tracking-[.22em] text-primary">${esc(r.gate)}</p>${artBadge(gate)}</div><h3 class="mt-1 text-2xl font-black">${esc(r.realm)}</h3><p class="mt-2 line-clamp-3 text-sm text-neutral-300">${esc(r.coreTone||r.visualLanguage)}</p><p class="mt-2 line-clamp-1 text-xs text-primary">${esc(AssetManager.resolvedPath(gate))}</p><p class="mt-2 text-xs text-neutral-500">${esc((r.landmarks||[]).slice(0,3).join(' · '))}</p></button>`; }).join('');
    return shell(`${profileHeader(player)}<main class="mx-auto max-w-5xl space-y-4 px-3 pb-28 pt-3"><button onclick="TGHub.go('hub')" class="rounded-2xl bg-neutral-800 px-4 py-3 font-black">← Command Hub</button><header class="rounded-3xl border border-primary/40 bg-neutral-900 p-5"><p class="text-xs font-black uppercase tracking-[.28em] text-primary">Gates</p><h1 class="text-4xl font-black">Realm Network</h1><p class="mt-2 text-neutral-300">Gate presentation is realm-driven from the codex and asset registry.</p></header><div class="grid gap-3 md:grid-cols-2">${rows}</div></main>`);
  }
  function trialsScreen(){
    const player=ensurePlayerState(); normalizeProgression(player); const trials=ensureTrials(player); const active=state.trial?.status==='ACTIVE'; const options=trialTitans().map(t=>`<article class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4"><p class="text-xs font-black uppercase tracking-[.22em] text-primary">${esc(t.faction)} · ${esc(t.rarity)} Trial</p><h3 class="mt-1 text-2xl font-black">${esc(t.name)}</h3><p class="mt-2 text-sm text-neutral-300">${esc(t.preferredBattlefield||t.collectionReason||t.role)}</p><p class="mt-2 rounded-2xl bg-neutral-950 p-3 text-xs text-neutral-500">${esc(t.notMandatoryRule||'Recommended advantage, never an ownership lock.')}</p><button onclick="TGHub.startTrial('${esc(t.id)}')" class="mt-4 w-full rounded-2xl bg-primary px-4 py-3 font-black text-white">START TEMP TRIAL</button></article>`).join('');
    const modeRows=TRIAL_MODES.map(m=>`<p class="rounded-2xl bg-neutral-950 p-3 text-sm"><b class="text-primary">${esc(m.label)}</b> · ${esc(m.rule)}</p>`).join('');
    const history=trials.completions.slice(0,4).map(c=>`<p class="rounded-2xl bg-neutral-950 p-3 text-sm"><b class="text-primary">${esc(c.quality)} Grade</b> · ${esc(c.deityName)} · +${esc(c.favor)} Favor · Score ${esc(c.score)}</p>`).join('') || '<p class="text-neutral-400">No trial completions yet.</p>';
    return shell(`${profileHeader(player)}<main class="mx-auto max-w-5xl space-y-4 px-3 pb-28 pt-3"><button onclick="TGHub.go('hub')" class="rounded-2xl bg-neutral-800 px-4 py-3 font-black">← Command Hub</button><section class="rounded-3xl border border-primary/40 bg-neutral-900 p-5"><p class="text-xs font-black uppercase tracking-[.28em] text-primary">Divine Trials · Conversion Safe</p><h1 class="text-4xl font-black">Borrow power. Keep insight.</h1><p class="mt-2 text-neutral-300">Try specialist Deities with temporary loadouts, sample role gear, and Divine Ascension previews. Trial Favor persists; borrowed power does not.</p><div class="mt-4 grid gap-2 sm:grid-cols-4"><div class="rounded-2xl bg-neutral-950 p-3"><p class="text-xs text-neutral-500">Trial Favor</p><b>${esc(trials.trialFavor)}</b></div><div class="rounded-2xl bg-neutral-950 p-3"><p class="text-xs text-neutral-500">Showcased</p><b>${esc(trials.showcasedTitanIds.length)}</b></div><div class="rounded-2xl bg-neutral-950 p-3"><p class="text-xs text-neutral-500">Completions</p><b>${esc(trials.completions.length)}</b></div><div class="rounded-2xl bg-neutral-950 p-3"><p class="text-xs text-neutral-500">Policy</p><b>No Lock</b></div></div>${active?`<div class="mt-4 rounded-3xl border border-bull-500/40 bg-bull-950/20 p-4"><p class="text-xs font-black uppercase tracking-[.22em] text-bull-400">Active Temporary Loadout</p><h2 class="text-2xl font-black">${esc(state.trial.deityName)}</h2><p class="mt-1 text-neutral-300">${esc(state.trial.modeLabel)} · ${esc(state.trial.tempLoadout.relic)} · expires ${esc(state.trial.tempLoadout.expires)}</p><div class="mt-3 grid gap-2 sm:grid-cols-3"><button onclick="TGHub.finishTrial('STUDIED')" class="rounded-2xl bg-primary px-4 py-4 font-black text-white">STUDIED CLEAR</button><button onclick="TGHub.finishTrial('BALANCED')" class="rounded-2xl bg-neutral-800 px-4 py-4 font-black">BALANCED CLEAR</button><button onclick="TGHub.finishTrial('AGGRESSIVE')" class="rounded-2xl bg-bear-950 px-4 py-4 font-black text-bear-400">AGGRESSIVE CLEAR</button></div></div>`:''}</section><section class="grid gap-3 md:grid-cols-3">${options}</section><section class="grid gap-3 md:grid-cols-2"><article class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4"><h2 class="text-2xl font-black">Trial Modes</h2><div class="mt-3 space-y-2">${modeRows}</div></article><article class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4"><h2 class="text-2xl font-black">Completion Ledger</h2><div class="mt-3 space-y-2">${history}</div></article></section></main>`);
  }
  function raidScreen(){
    const player=ensurePlayerState(); normalizeProgression(player); const attempt=state.raid; const boss=raidBoss(); const stages=raidStages(); const active=attempt?.status==='ACTIVE'; const victorious=attempt?.status==='VICTORY'; const current=active?attempt.stages[attempt.stageIndex]:null; const best=player.raidProgress.bestScores?.['TG-RAID-001:RAID_NORMAL']||0; const mastery=Object.values(player.raidProgress.masteryByTitanId||{}).sort((a,b)=>(b.bestScore||0)-(a.bestScore||0))[0];
    const stageCards=(active||victorious?attempt.stages:stages).map((s,i)=>{ const done=(active||victorious) && (i<attempt.stageIndex || victorious); const live=active && i===attempt.stageIndex; return `<article class="rounded-3xl border ${live?'border-primary bg-primary/10':done?'border-bull-500/40 bg-bull-950/20':'border-neutral-800 bg-neutral-900'} p-4"><p class="text-xs font-black uppercase tracking-[.2em] ${done?'text-bull-400':live?'text-primary':'text-neutral-500'}">Stage ${esc(s.stage)} ${done?'· Cleared':live?'· Active':''}</p><h3 class="mt-1 text-2xl font-black">${esc(s.name)}</h3><p class="mt-2 text-sm text-neutral-300">${esc(s.goal)}</p><div class="mt-3 flex flex-wrap gap-2">${(s.problemTags||[]).map(c=>badge(c)).join('')}${(s.checks||[]).slice(0,3).map(c=>badge(c)).join('')}</div><p class="mt-3 text-xs text-neutral-400"><b class="text-primary">Counter:</b> ${esc((s.preferredCounters||[]).join(' · ')||'Read the stage and preserve the active Deity.')}</p><p class="mt-2 text-xs text-neutral-500"><b>Carry risk:</b> ${esc(s.carryRisk||'Score, damage, and turns carry forward.')}</p></article>`; }).join('');
    const resolved=attempt?.resolvedStages?.length?attempt.resolvedStages.map(s=>`<p class="rounded-2xl bg-neutral-950 p-3 text-sm"><b class="text-primary">Stage ${esc(s.stage)}</b> · ${esc(s.approach)} · +${esc(s.score)} score · ${esc(s.damageTaken)} damage</p>`).join(''):'<p class="text-neutral-400">No raid stages resolved yet.</p>';
    const completions=(player.raidProgress.completions||[]).slice(0,4).map(c=>`<p class="rounded-2xl bg-neutral-950 p-3 text-sm"><b class="text-primary">${esc(c.tier)}</b> · ${esc(c.name)} · Score ${esc(c.score)}</p>`).join('') || '<p class="text-neutral-400">No raid clears recorded.</p>';
    return shell(`${profileHeader(player)}<main class="mx-auto max-w-5xl space-y-4 px-3 pb-28 pt-3"><button onclick="TGHub.go('hub')" class="rounded-2xl bg-neutral-800 px-4 py-3 font-black">← Command Hub</button><section class="rounded-3xl border border-primary/40 bg-neutral-900 p-5"><p class="text-xs font-black uppercase tracking-[.28em] text-primary">Solo Deity Raid · Deterministic</p><h1 class="text-4xl font-black">${esc(boss.name||'The Gate Warden')}</h1><p class="mt-2 text-neutral-300">One active Deity crosses a five-stage Gate gauntlet. No live PvP, no fabricated ranks — only local mastery scoring.</p><div class="mt-4 grid gap-2 sm:grid-cols-4"><div class="rounded-2xl bg-neutral-950 p-3"><p class="text-xs text-neutral-500">Tier</p><b>${esc(attempt?.tier||'RAID_NORMAL')}</b></div><div class="rounded-2xl bg-neutral-950 p-3"><p class="text-xs text-neutral-500">Stage</p><b>${esc(active?attempt.stageIndex+1:1)}/5</b></div><div class="rounded-2xl bg-neutral-950 p-3"><p class="text-xs text-neutral-500">Score</p><b>${esc(attempt?.score||0)}</b></div><div class="rounded-2xl bg-neutral-950 p-3"><p class="text-xs text-neutral-500">Best</p><b>${esc(best)}</b></div></div>${victorious?`<div class="mt-4 rounded-3xl border border-bull-500/40 bg-bull-950/20 p-4"><p class="text-xs font-black uppercase tracking-[.22em] text-bull-400">Raid Victory Ready</p><h2 class="text-2xl font-black">Score ${esc(attempt.finalScore||attempt.score)}</h2><p class="mt-1 text-neutral-300">Lock the clear to write raid history and create a reward cache.</p><button onclick="TGHub.raidClaim()" class="mt-3 w-full rounded-3xl bg-primary px-5 py-4 font-black text-white">LOCK RAID VICTORY</button></div>`:active?`<div class="mt-4 rounded-3xl border border-neutral-800 bg-neutral-950 p-4"><p class="text-xs font-black uppercase tracking-[.22em] text-primary">Active Stage</p><h2 class="text-2xl font-black">${esc(current?.name)}</h2><p class="mt-1 text-neutral-300">${esc(current?.goal)}</p><div class="mt-3 grid grid-cols-3 gap-2"><button onclick="TGHub.raidResolve('BALANCED')" class="rounded-2xl bg-primary px-3 py-4 font-black text-white">BALANCED</button><button onclick="TGHub.raidResolve('GUARDED')" class="rounded-2xl bg-neutral-800 px-3 py-4 font-black">GUARDED</button><button onclick="TGHub.raidResolve('AGGRESSIVE')" class="rounded-2xl bg-bear-950 px-3 py-4 font-black text-bear-400">AGGRESSIVE</button></div></div>`:`<button onclick="TGHub.startRaid()" class="mt-5 w-full rounded-3xl bg-primary px-5 py-5 text-2xl font-black text-white">START GATE WARDEN RAID</button>`}</section><section class="grid gap-3 md:grid-cols-2">${stageCards}</section><section class="grid gap-3 md:grid-cols-2"><article class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4"><h2 class="text-2xl font-black">Stage Ledger</h2><div class="mt-3 space-y-2">${resolved}</div>${attempt?.status==='VICTORY'?`<button onclick="TGHub.raidClaim()" class="mt-4 w-full rounded-3xl bg-primary px-5 py-4 font-black text-white">LOCK RAID VICTORY</button>`:''}</article><article class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4"><h2 class="text-2xl font-black">Raid Economy</h2><p class="mt-2 text-sm text-neutral-300">Non-pay-to-win payouts: first-clear bonus once, replay tokens capped, materials tied to score quality.</p><div class="mt-3 grid grid-cols-3 gap-2 text-center text-xs"><span class="rounded-2xl bg-neutral-950 p-2">Clears<br><b>${esc(mastery?.clears||0)}</b></span><span class="rounded-2xl bg-neutral-950 p-2">Best<br><b>${esc(mastery?.bestScore||0)}</b></span><span class="rounded-2xl bg-neutral-950 p-2">Seals<br><b>${esc(mastery?.seals||0)}</b></span></div><div class="mt-3 space-y-2">${completions}</div></article></section></main>`);
  }
  function codexScreen(){
    const player=ensurePlayerState();
    const rows=[...factions().map(f=>({type:'Faction',id:f.id,title:f.name,body:f.culture||f.philosophy})),...realms().map(r=>({type:'Realm',id:r.id,title:r.realm,body:r.thesis||r.coreTone})),.. .titans().slice(0,12).map(t=>({type:'Deity',id:t.id,title:t.name,body:t.lore}))].map(e=>`<article class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4"><p class="text-xs font-black uppercase tracking-[.2em] text-primary">${esc(e.type)} · ${esc(e.id)}</p><h3 class="mt-1 text-xl font-black">${esc(e.title)}</h3><p class="mt-2 line-clamp-4 text-sm text-neutral-300">${esc(e.body)}</p></article>`).join('');
    return shell(`${profileHeader(player)}<main class="mx-auto max-w-5xl space-y-4 px-3 pb-28 pt-3"><button onclick="TGHub.go('hub')" class="rounded-2xl bg-neutral-800 px-4 py-3 font-black">← Command Hub</button><header class="rounded-3xl border border-primary/40 bg-neutral-900 p-5"><p class="text-xs font-black uppercase tracking-[.28em] text-primary">Codex</p><h1 class="text-4xl font-black">Lore Registry</h1><p class="mt-2 text-neutral-300">The Command Hub displays lore; it does not create or modify canon.</p></header><div class="grid gap-3 md:grid-cols-2">${rows}</div></main>`);
  }
  function battlefieldsScreen(){
    const player=ensurePlayerState();
    state.selectedTab='battlefields';
    return renderBattlefieldOverviewView({ registry:battlefieldRegistry(), playerHeader:profileHeader(player), shell });
  }
  function commandScreen(){
    const player=ensurePlayerState(); normalizeProgression(player);
    const pending=(player.campaignProgress.pendingRewards||[]);
    const history=(player.campaignProgress.rewardHistory||[]).slice(0,6);
    const rewardCards=pending.length?pending.map(r=>`<article class="rounded-3xl border border-primary/40 bg-primary/10 p-4"><p class="text-xs font-black uppercase tracking-[.22em] text-primary">${esc(r.firstClear?'First Clear':'Replay Cache')} · ${esc(r.missionType)} ${r.economy?.quality?`· ${esc(r.economy.quality)} Grade`:''}</p><h3 class="mt-1 text-2xl font-black">${esc(r.title)}</h3><p class="mt-1 text-sm text-neutral-300">${esc(r.summary)}</p><div class="mt-3 grid grid-cols-4 gap-2 text-center text-xs"><span class="rounded-2xl bg-neutral-950 p-2">Shards<br><b>${esc(r.grants.gateShards||0)}</b></span><span class="rounded-2xl bg-neutral-950 p-2">Ember<br><b>${esc(r.grants.ascensionEmber||0)}</b></span><span class="rounded-2xl bg-neutral-950 p-2">Relics<br><b>${esc(r.grants.deityRelics||0)}</b></span><span class="rounded-2xl bg-neutral-950 p-2">XP<br><b>${esc(r.grants.xp||0)}</b></span><span class="rounded-2xl bg-neutral-950 p-2">Raid<br><b>${esc(r.grants.raidTokens||0)}</b></span><span class="rounded-2xl bg-neutral-950 p-2">Alloy<br><b>${esc(r.grants.signatureAlloy||0)}</b></span><span class="rounded-2xl bg-neutral-950 p-2">Seals<br><b>${esc(r.grants.masterySeals||0)}</b></span><span class="rounded-2xl bg-neutral-950 p-2">Mastery<br><b>${esc(r.grants.masteryXp||0)}</b></span><span class="rounded-2xl bg-neutral-950 p-2">Favor<br><b>${esc(r.grants.trialFavor||0)}</b></span></div><button onclick="TGHub.claimReward('${esc(r.id)}')" class="mt-4 w-full rounded-2xl bg-primary px-4 py-3 font-black text-white">CLAIM CACHE</button></article>`).join(''):'<article class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4"><h3 class="text-2xl font-black">Reward Ledger</h3><p class="mt-2 text-neutral-400">No pending reward caches. Clear a mission to generate one.</p></article>';
    const historyRows=history.length?history.map(r=>`<p class="mt-2 rounded-2xl bg-neutral-950 p-3 text-sm"><b class="text-primary">${esc(r.firstClear?'FIRST':'REPLAY')}</b> · ${esc(r.title)} · +${esc(r.grants.gateShards||0)} shards · +${esc(r.grants.xp||0)} XP</p>`).join(''):'<p class="mt-2 text-neutral-400">No claimed caches yet.</p>';
    return shell(`${profileHeader(player)}<main class="mx-auto max-w-5xl space-y-4 px-3 pb-28 pt-3"><button onclick="TGHub.go('hub')" class="rounded-2xl bg-neutral-800 px-4 py-3 font-black">← Command Hub</button><section class="rounded-3xl border border-primary/40 bg-neutral-900 p-5"><p class="text-xs font-black uppercase tracking-[.28em] text-primary">Command</p><h1 class="text-4xl font-black">Profile, Rewards, Settings</h1><p class="mt-2 text-neutral-300">Mission clears now create save-backed reward caches with first-clear protection and replay limits.</p></section><div class="grid gap-3 md:grid-cols-2"><article class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4"><h3 class="text-2xl font-black">Notifications</h3>${player.notifications.length?player.notifications.map(n=>`<p class="mt-2 rounded-2xl bg-neutral-950 p-3 text-sm">${esc(n.label)}</p>`).join(''):'<p class="mt-2 text-neutral-400">No fake badges. Nothing pending.</p>'}</article><article class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4"><h3 class="text-2xl font-black">Settings</h3><button onclick="TGHub.toggleMotion()" class="mt-3 rounded-2xl bg-neutral-800 px-4 py-3 font-black">Reduced Motion: ${player.settings.reducedMotion?'ON':'OFF'}</button><button onclick="TGHub.resetSave()" class="mt-3 block rounded-2xl bg-bear-950 px-4 py-3 font-black text-bear-400">Reset Local Save</button></article><section class="md:col-span-2 grid gap-3 md:grid-cols-2">${rewardCards}</section><article class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4 md:col-span-2"><h3 class="text-2xl font-black">Claimed Reward History</h3>${historyRows}</article><article class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4 md:col-span-2"><h3 class="text-2xl font-black">Diagnostics</h3><div class="mt-2 max-h-60 overflow-auto rounded-2xl bg-neutral-950 p-3 text-xs text-neutral-400">${state.logs.map(l=>`<p>${esc(l.at)} · ${esc(l.type)} · ${esc(l.message)}</p>`).join('')}</div></article></div>${artProvenancePanel(player)}</main>`);
  }
  function buildBattle(){
    const player=ensurePlayerState(); const mission=missionById(player.campaignProgress.currentMissionId)||missions()[0]||{}; const deity=deityById(player.selectedDeities?.[0])||deities()[0];
    const ids=(mission.enemyIds||mission.enemies||['TG-CREATURE-001','TG-CREATURE-001','TG-CREATURE-002']).slice(0,3);
    const enemySet=ids.map(id=>creatureById(id)).filter(Boolean); if(!enemySet.length) enemySet.push({id:'TG-CREATURE-FALLBACK',name:'Hollow Wretch',combatRole:'PRESSURE',stats:{hp:18,damage:6,armor:4,resistance:3,range:1,movement:1}});
    const scaling=resolveMissionScaling({ mission, dynamic:false });
    const scaledEnemySet=enemySet.map((e,i)=>scaleEnemyForMission(e,scaling,i));
    const objectives=[{id:'stabilize_solar_seal_a',label:'Stabilize Solar Seal',progress:0,requiredProgress:2,status:'ACTIVE'},{id:'destroy_hollow_anchor',label:'Destroy Hollow Anchor',progress:0,requiredProgress:1,status:'ACTIVE'}];
    state.battle=createBattleState({ battleId:`TG-HUB-${mission.id||'FIRST-GATE'}`, missionId:mission.id||'TG-F01-C01-M01', deity, enemies:scaledEnemySet, objectives, scaling }); log('battle','Playable battle initialized',{ missionId:mission.id, deity:deity?.id, scaling });
  }
  function ensureBattle(){ if(!state.battle || ['VICTORY','DEFEAT'].includes(state.battle.phase)) buildBattle(); return state.battle; }
  function bar(label,value,max,tone='primary'){ const pct=Math.max(0,Math.min(100,Math.round((value/Math.max(1,max))*100))); const color=tone==='hp'?'bg-bear-500':tone==='solar'?'bg-yellow-500':'bg-primary'; return `<div><div class="flex justify-between text-[10px] font-black uppercase tracking-[.18em] text-neutral-500"><span>${esc(label)}</span><span>${esc(value)}/${esc(max)}</span></div><div class="mt-1 h-2 rounded-full bg-neutral-800"><div class="h-full rounded-full ${color}" style="width:${pct}%"></div></div></div>`; }
  function battleGrid(b){
    const occupied=new Map([[`${b.deity.position.x},${b.deity.position.y}`,'T']]); b.enemies.filter(e=>e.hp>0).forEach((e,i)=>occupied.set(`${e.position.x},${e.position.y}`,String(i+1)));
    return `<div class="grid grid-cols-5 gap-1 rounded-3xl border border-neutral-800 bg-neutral-950 p-2">${b.terrain.spaces.map(sp=>{ const k=`${sp.position.x},${sp.position.y}`; const mark=occupied.get(k); const cls=mark==='T'?'border-primary bg-primary/25 text-white':mark?'border-bear-500 bg-bear-950 text-bear-300':sp.hazard?'border-yellow-500/50 bg-yellow-950/30':sp.illuminated?'border-primary/30 bg-primary/10':'border-neutral-800 bg-neutral-900'; return `<button onclick="TGHub.battleMove(${sp.position.x},${sp.position.y})" class="aspect-square rounded-2xl border ${cls} text-xs font-black">${mark||''}<span class="block text-[9px] text-neutral-500">${sp.position.x},${sp.position.y}</span></button>`; }).join('')}</div>`;
  }
  function battleScreen(){
    const player=ensurePlayerState(); const b=ensureBattle(); const m=missionById(b.missionId)||{}; const summary=summarizeBattle(b); const target=b.enemies.find(e=>e.hp>0); const canAct=b.phase===PHASES.PLAYER; const reaction=b.phase===PHASES.REACTION; const scaling=b.telemetry.enemyScaling||{};
    const enemies=b.enemies.map(e=>`<button onclick="TGHub.battleTarget('${esc(e.instanceId)}')" class="rounded-2xl border ${e.hp>0?'border-neutral-800 bg-neutral-950':'border-neutral-800 bg-neutral-900 opacity-45'} p-3 text-left"><p class="text-xs font-black uppercase tracking-[.16em] text-bear-400">${esc(e.intent?.label||e.aiProfile?.label||e.archetype)}</p><h3 class="font-black">${esc(e.name)}</h3><p class="mt-1 line-clamp-2 text-xs text-neutral-500">${esc(e.intent?.description||e.mapBehavior||e.aiProfile?.telegraph||'Telegraphed Hollow pressure.')}</p>${bar('HP',e.hp,e.maxHp,'hp')}<div class="mt-2 flex flex-wrap gap-1">${badge(e.aiProfile?.id||e.archetype)}${badge(e.scalingProfile?.tier||scaling.tier||'NORMAL')}${e.scalingProfile?.threatBudget?badge(`Threat ${e.scalingProfile.threatBudget}`,'bad'):''}${e.intent?.reactionType?badge(e.intent.reactionType,'bad'):''}${e.intent?.behaviorTag?badge(e.intent.behaviorTag,'bad'):''}</div>${e.intent?.counterplay?`<p class="mt-2 rounded-2xl bg-neutral-900 p-2 text-[11px] text-neutral-300"><b class="text-primary">Counterplay:</b> ${esc(e.intent.counterplay)}</p>`:''}${e.vulnerable?badge('Vulnerable','bad'):''}</button>`).join('');
    const objectives=b.objectives.map(o=>`<div class="rounded-2xl bg-neutral-950 p-3"><p class="text-xs font-black uppercase tracking-[.16em] ${o.status==='COMPLETE'?'text-bull-400':'text-primary'}">${esc(o.status)}</p><h3 class="font-black">${esc(o.label||o.id)}</h3>${bar('Progress',o.progress||0,o.requiredProgress||1,o.status==='COMPLETE'?'ok':'primary')}</div>`).join('');
    const logRows=b.eventLog.slice(-8).reverse().map(e=>`<p><b class="text-primary">R${e.round}</b> · ${esc(e.type)} ${e.damage?`· ${esc(e.damage)} dmg`:''}</p>`).join('');
    return shell(`${profileHeader(player)}<main class="mx-auto max-w-5xl space-y-4 px-3 pb-28 pt-3"><button onclick="TGHub.go('mission')" class="rounded-2xl bg-neutral-800 px-4 py-3 font-black">← Mission Brief</button><section class="rounded-3xl border border-primary/40 bg-neutral-900 p-4"><p class="text-xs font-black uppercase tracking-[.28em] text-primary">Playable Solo Battle · ${esc(b.phase)}</p><h1 class="text-3xl font-black">${esc(m.title||'The First Reopening Gate')}</h1><div class="mt-3 grid gap-3 md:grid-cols-[.9fr_1.1fr]"><article class="space-y-3 rounded-3xl border border-neutral-800 bg-neutral-950 p-4"><h2 class="text-2xl font-black">${esc(b.deity.name)}</h2>${bar('Deity HP',b.deity.hp,b.deity.maxHp,'hp')}${bar('Momentum',b.resources.momentum,100)}${bar('Divinity',b.resources.divinity,100)}${bar('Solar Charge',b.resources.solarCharge,100,'solar')}<p class="rounded-2xl bg-neutral-900 p-3 text-sm text-neutral-300">Round ${esc(b.round)} · Stance ${esc(b.deity.stance)} · ${esc(summary.enemiesRemaining)} enemies remain.</p></article>${battleGrid(b)}</div></section><section class="grid gap-3 md:grid-cols-3"><article class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4 md:col-span-2"><h2 class="text-2xl font-black">Battle Actions</h2>${reaction?`<div class="mt-3 rounded-3xl border border-yellow-500 bg-yellow-950/20 p-4"><p class="text-xs font-black uppercase tracking-[.2em] text-yellow-400">Reaction Window</p><h3 class="text-xl font-black">${esc(b.reactionWindow.consequencePreview)}</h3><div class="mt-3 grid grid-cols-2 gap-2"><button onclick="TGHub.battleReact('RESOLVE')" class="rounded-2xl bg-primary px-4 py-4 font-black text-white">RESOLVE</button><button onclick="TGHub.battleReact('DECLINE')" class="rounded-2xl bg-neutral-800 px-4 py-4 font-black">DECLINE</button></div></div>`:`<div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4"><button ${!canAct?'disabled':''} onclick="TGHub.battleBasic()" class="rounded-2xl bg-primary px-3 py-4 font-black text-white disabled:opacity-40">STRIKE</button><button ${!canAct?'disabled':''} onclick="TGHub.battleFocus()" class="rounded-2xl bg-neutral-800 px-3 py-4 font-black disabled:opacity-40">FOCUS</button><button ${!canAct?'disabled':''} onclick="TGHub.battleTechnique()" class="rounded-2xl bg-neutral-800 px-3 py-4 font-black disabled:opacity-40">TECHNIQUE</button><button onclick="TGHub.battleEndTurn()" class="rounded-2xl bg-bear-950 px-3 py-4 font-black text-bear-400">END TURN</button></div><div class="mt-2 grid grid-cols-3 gap-2"><button onclick="TGHub.battleStance('GUARDIAN')" class="rounded-2xl bg-neutral-950 px-3 py-3 text-xs font-black">GUARD</button><button onclick="TGHub.battleStance('ASSAULT')" class="rounded-2xl bg-neutral-950 px-3 py-3 text-xs font-black">ASSAULT</button><button onclick="TGHub.battleObjective()" class="rounded-2xl bg-neutral-950 px-3 py-3 text-xs font-black">SEAL</button></div>`}</article><article class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4"><h2 class="text-2xl font-black">Objectives</h2><div class="mt-3 space-y-2">${objectives}</div></article></section><section class="grid gap-3 md:grid-cols-2"><article class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4"><h2 class="text-2xl font-black">Enemies</h2><div class="mt-3 grid gap-2">${enemies}</div></article><article class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4"><h2 class="text-2xl font-black">Combat Log</h2><div class="mt-3 max-h-72 overflow-auto rounded-2xl bg-neutral-950 p-3 text-xs text-neutral-400">${logRows}</div>${['VICTORY','DEFEAT'].includes(b.phase)?`<button onclick="TGHub.completeBattle()" class="mt-4 w-full rounded-3xl bg-primary px-5 py-4 text-xl font-black text-white">RETURN TO COMMAND HUB</button>`:''}</article></section></main>`);
  }

  function render(){
    const started=performance.now();
    const views={ boot, title, awakening:awakeningScreen, hub, campaigns, mission:missionScreen, deities:deitiesScreen, gates:gatesScreen, battlefields:battlefieldsScreen, trials:trialsScreen, raid:raidScreen, codex:codexScreen, command:commandScreen, battle:battleScreen };
    mount.innerHTML=(views[state.route]||hub)();
    const elapsed=performance.now()-started;
    state.perf.renderCount++;
    state.perf.lastRenderMs=Number(elapsed.toFixed(3));
    state.perf.maxRenderMs=Number(Math.max(state.perf.maxRenderMs||0, elapsed).toFixed(3));
    state.perf.lastRoute=state.route;
    state.perf.routeRenderCount[state.route]=(state.perf.routeRenderCount[state.route]||0)+1;
    if(elapsed > state.perf.budgetMs) log('performance','Render exceeded budget',{route:state.route, elapsedMs:state.perf.lastRenderMs, budgetMs:state.perf.budgetMs});
  }
  function advanceBoot(){
    if(state.route!=='boot') return;
    if(state.bootIndex===3) state.player=loadPlayerState();
    if(state.bootIndex===5) validatePlayerState(ensurePlayerState());
    if(state.bootIndex>=BOOT_STAGES.length-2){ state.route='title'; render(); return; }
    state.bootIndex++; render(); setTimeout(advanceBoot, state.player?.settings?.reducedMotion ? 20 : 90);
  }
  const api={
    state, getNextRecommendedAction, validatePlayerState, AssetManager, AudioManager, awakeningProgress, refreshResourceBar,
    start(){ render(); setTimeout(advanceBoot, 80); },
    enterHub(){ const p=ensurePlayerState(); AssetManager.preloadVisible(); AudioManager.play('gate_open'); setRoute(p.onboarding?.status==='COMPLETE'?'hub':'awakening'); },
    go(route){ setRoute(route); },
    openTab(tab){ state.selectedTab=tab; const map={battle:'hub',battlefields:'battlefields',deities:'titans',trials:'trials',raid:'raid',gates:'gates',codex:'codex',command:'command'}; setRoute(map[tab]||'hub'); },
    chooseStarter(id){
      const p=ensurePlayerState(); const starters=new Set(starterTitans().map(t=>t.id));
      if(!starters.has(id)){ log('onboarding-error','Rejected non-starter Deity',{id}); render(); return; }
      p.selectedDeities=[id]; const ob=ensureOnboarding(p); ob.starterTitanId=id; ob.starterChoiceReason=starterTitans().find(t=>t.id===id)?.role || 'Canon starter'; completeAwakeningBeat(p,1); if(!ob.milestones.includes('STARTER_TITAN_BOUND')) ob.milestones.push('STARTER_TITAN_BOUND'); p.notifications=deriveNotifications(p); savePlayerState(); AudioManager.play('deity_selected'); render();
    },
    advanceAwakeningBeat(){ const p=ensurePlayerState(); const ob=ensureOnboarding(p); completeAwakeningBeat(p, ob.currentBeat||1); p.notifications=deriveNotifications(p); savePlayerState(); AudioManager.play('button_confirm'); render(); },
    finishAwakening(){
      const p=ensurePlayerState(); const ob=ensureOnboarding(p); if(!ob.starterTitanId){ log('onboarding-error','Starter required before Awakening mission'); render(); return; }
      for(const beat of AWAKENING_BEATS) completeAwakeningBeat(p, beat.step);
      ob.status='COMPLETE'; ob.currentBeat=AWAKENING_BEATS.length; ob.fullRosterHidden=false; if(!ob.milestones.includes('AWAKENING_MISSION_UNLOCKED')) ob.milestones.push('AWAKENING_MISSION_UNLOCKED'); if(!ob.milestones.includes('FULL_ROSTER_UNLOCKED_AFTER_AWAKENING')) ob.milestones.push('FULL_ROSTER_UNLOCKED_AFTER_AWAKENING'); p.campaignProgress.currentFactionId='TG-FACTION-001'; p.campaignProgress.currentMissionId=ob.awakeningMissionId || p.campaignProgress.currentMissionId; p.notifications=deriveNotifications(p); savePlayerState(); state.selectedTab='battle'; AudioManager.play('campaign_start'); setRoute('mission');
    },
    primary(){ const a=getNextRecommendedAction(); setRoute(a.route,{ missionId:a.missionId }); },
    openCampaign(factionId){ const player=ensurePlayerState(); const flow=(playflow().flow||[]).find(f=>f.factionId===factionId); const ch=flow?.chapterRoutes?.[0]; player.campaignProgress.currentFactionId=factionId; player.campaignProgress.currentChapterId=ch?.chapterId; player.campaignProgress.currentMissionId=ch?.defaultMissionId || ch?.normalMissionIds?.[0] || player.campaignProgress.currentMissionId; savePlayerState(); setRoute('mission'); },
    focusDeity(id){ state.focusTitanId=id; setRoute('titans'); },
    toggleDeity(id){ const p=ensurePlayerState(); if(p.selectedDeities.includes(id)) p.selectedDeities=p.selectedDeities.filter(x=>x!==id); else p.selectedDeities=[id]; p.notifications=deriveNotifications(p); savePlayerState(); render(); AudioManager.play('deity_selected'); },
    setRealm(fid){ const p=ensurePlayerState(); p.campaignProgress.currentFactionId=fid; const flow=(playflow().flow||[]).find(f=>f.factionId===fid); const ch=flow?.chapterRoutes?.[0]; if(ch){ p.campaignProgress.currentChapterId=ch.chapterId; p.campaignProgress.currentMissionId=ch.defaultMissionId || ch.normalMissionIds?.[0]; } savePlayerState(); setRoute('hub'); },
    launchBattle(){ AudioManager.play('campaign_start'); buildBattle(); setRoute('battle'); },
    battleTarget(id){ state.battleTargetId=id; render(); },
    battleMove(x,y){ try{ const b=ensureBattle(); if(b.phase!==PHASES.PLAYER) return; state.battle=applyDeityAction(b,{type:'MOVE',to:{x,y}}); render(); }catch(e){ log('battle-error',String(e)); render(); } },
    battleBasic(){ try{ const b=ensureBattle(); const targetId=state.battleTargetId || b.enemies.find(e=>e.hp>0)?.instanceId; state.battle=applyDeityAction(b,{type:'BASIC_ATTACK',targetId}); render(); }catch(e){ log('battle-error',String(e)); render(); } },
    battleTechnique(){ try{ const b=ensureBattle(); const targetId=state.battleTargetId || b.enemies.find(e=>e.hp>0)?.instanceId; state.battle=applyDeityAction(b,{type:'TECHNIQUE',targetId}); render(); }catch(e){ log('battle-error',String(e)); render(); } },
    battleFocus(){ try{ state.battle=applyDeityAction(ensureBattle(),{type:'FOCUS'}); render(); }catch(e){ log('battle-error',String(e)); render(); } },
    battleStance(stance){ try{ state.battle=applyDeityAction(ensureBattle(),{type:'STANCE_SHIFT',stance}); render(); }catch(e){ log('battle-error',String(e)); render(); } },
    battleObjective(){ try{ const b=ensureBattle(); const objective=b.objectives.find(o=>o.status!=='COMPLETE'); if(!objective) return; state.battle=evaluateObjectives(b,{objectiveId:objective.id,progress:1,momentum:12,divinity:10}); render(); }catch(e){ log('battle-error',String(e)); render(); } },
    battleEndTurn(){ try{ state.battle=autoAdvanceEnemyTurn(ensureBattle()); render(); }catch(e){ log('battle-error',String(e)); render(); } },
    battleReact(choice){ try{ let b=applyReaction(ensureBattle(),choice); state.battle=autoAdvanceEnemyTurn(b); render(); }catch(e){ log('battle-error',String(e)); render(); } },
    completeBattle(){
      const p=ensurePlayerState(); normalizeProgression(p);
      const battle=state.battle || ensureBattle(); const mission=missionById(battle.missionId) || missionById(p.campaignProgress.currentMissionId) || missions()[0];
      if(!mission){ log('reward-error','No mission found for reward resolution'); setRoute('hub'); return; }
      const cache=createRewardCache(p, mission, battle);
      if(mission.id && !p.campaignProgress.completedMissionIds.includes(mission.id)) p.campaignProgress.completedMissionIds.push(mission.id);
      p.campaignProgress.pendingRewards.push(cache);
      const next=advanceCampaignAfterClear(p, mission);
      p.notifications=deriveNotifications(p); state.battle=null; savePlayerState(); log('reward','Reward cache pending',{missionId:mission.id,rewardId:cache.id,nextMissionId:next?.id}); setRoute('command');
    },
    claimReward(id){
      const p=ensurePlayerState(); normalizeProgression(p);
      const idx=p.campaignProgress.pendingRewards.findIndex(r=>r.id===id);
      if(idx<0){ log('reward-error','Reward cache missing',{id}); render(); return; }
      const [cache]=p.campaignProgress.pendingRewards.splice(idx,1);
      applyRewardCache(p,cache); p.notifications=deriveNotifications(p); savePlayerState(); log('reward','Reward cache claimed',{id,grants:cache.grants}); if(!refreshResourceBar(p)) render();
    },
    startTrial(titanId){ const p=ensurePlayerState(); createTrialAttempt(p,titanId); state.selectedTab='trials'; setRoute('trials'); },
    finishTrial(approach){ const p=ensurePlayerState(); const cache=resolveTrialAttempt(p,state.trial,approach); if(cache){ state.selectedTab='command'; setRoute('command'); } else render(); },
    startRaid(){ const p=ensurePlayerState(); createRaidAttempt(p,'RAID_NORMAL'); state.selectedTab='raid'; setRoute('raid'); },
    raidResolve(approach){ const attempt=ensureRaid(); resolveRaidStage(attempt,approach); savePlayerState(); render(); },
    raidClaim(){ const p=ensurePlayerState(); const cache=completeRaidAttempt(p,state.raid); if(cache){ state.selectedTab='command'; setRoute('command'); } else render(); },
    toggleMotion(){ const p=ensurePlayerState(); p.settings.reducedMotion=!p.settings.reducedMotion; savePlayerState(); render(); },
    resetSave(){ try{localStorage.removeItem(STORAGE_KEY);}catch(e){} state.player=canonicalDefaultPlayer(); state.startupMode='firstLaunch'; savePlayerState(); render(); }
  };
  window.TGHub = api;
  return api;
}
