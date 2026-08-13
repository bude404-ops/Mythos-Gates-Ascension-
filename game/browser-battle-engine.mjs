export const PHASES = Object.freeze({ PLAYER:'PLAYER_PHASE', ENEMY_INTENT:'ENEMY_INTENT', ENEMY:'ENEMY_PHASE', REACTION:'REACTION_WINDOW', TERRAIN:'TERRAIN_TICK', OBJECTIVE:'OBJECTIVE_EVALUATION', VICTORY:'VICTORY', DEFEAT:'DEFEAT' });
export const STANCES = Object.freeze({ GUARDIAN:'GUARDIAN', ASSAULT:'ASSAULT', ASCENDANT:'ASCENDANT' });
const clone = value => JSON.parse(JSON.stringify(value));
const clamp = (value,min=0,max=100)=>Math.max(min,Math.min(max,Math.round(value)));
const budgetClamp = (value,min,max)=>Math.max(min,Math.min(max,Number(value.toFixed ? value.toFixed(3) : value)));
const key = pos => `${pos.x},${pos.y}`;
const distance = (a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
const living = s => s.enemies.filter(e=>e.hp>0);
const currentSpace = s => s.terrain.spaces.find(sp=>key(sp.position)===key(s.titan.position));
const ARCHETYPE_BUDGETS = Object.freeze({
  SWARMER:{ hp:0.82, damage:0.82, armor:0.75, resistance:0.75, threat:1, countPressure:1.15, mechanics:['formation spacing','execution routing'] },
  BRUTE:{ hp:1.25, damage:1.18, armor:1.28, resistance:1.0, threat:2.1, countPressure:0.9, mechanics:['guard break','objective denial'] },
  HUNTER:{ hp:0.92, damage:1.05, armor:0.8, resistance:1.0, threat:1.4, countPressure:1.0, mechanics:['range pressure','line of sight'] },
  CONTROLLER:{ hp:1.0, damage:0.86, armor:0.95, resistance:1.18, threat:1.7, countPressure:0.9, mechanics:['zone denial','objective routing'] },
  DISRUPTOR:{ hp:0.95, damage:0.9, armor:0.86, resistance:1.22, threat:1.8, countPressure:0.85, mechanics:['resource drain','reaction bait'] },
  GUARDIAN:{ hp:1.35, damage:0.78, armor:1.45, resistance:1.2, threat:1.6, countPressure:0.75, mechanics:['intercept','shield aura'] },
  EXECUTIONER:{ hp:1.05, damage:1.28, armor:0.9, resistance:0.9, threat:2.0, countPressure:0.8, mechanics:['wound threshold','pursuit'] },
  ELITE:{ hp:1.22, damage:1.12, armor:1.1, resistance:1.1, threat:2.4, countPressure:0.65, mechanics:['extra mechanic layer','reaction behavior'] },
  CHAMPION:{ hp:1.55, damage:1.28, armor:1.25, resistance:1.25, threat:3.5, countPressure:0.45, mechanics:['phase count','arena rules'] },
  ENEMY_TITAN:{ hp:1.8, damage:1.38, armor:1.35, resistance:1.35, threat:4.6, countPressure:0.35, mechanics:['stance mirror','divine phase'] },
  PRESSURE:{ hp:1.0, damage:1.0, armor:1.0, resistance:1.0, threat:1.2, countPressure:1.0, mechanics:['baseline pressure'] }
});
export function resolveMissionScaling({ mission={}, difficulty=null, dynamic=false }={}){
  const power=Number(mission.recommendedPower||mission.power||135);
  const campaignType=String(difficulty||mission.campaignType||mission.type||'Normal').toUpperCase();
  const tier=campaignType.includes('ELITE')?'ELITE':campaignType.includes('HARD')?'HARD':campaignType.includes('RAID')?'RAID':'NORMAL';
  const missionIndex=Math.max(1, Math.round((power-100)/35)+1);
  const band=missionIndex<=20?'early':missionIndex<=60?'mid':'late';
  const tierScalar=tier==='ELITE'?1.12:tier==='HARD'?1.08:tier==='RAID'?1.18:1;
  const dynamicScalar=dynamic?1.1:1;
  const cap=tier==='RAID'?1.28:tier==='ELITE'?1.22:1.12;
  const powerScalar=budgetClamp((0.82 + power/650) * tierScalar * dynamicScalar, 0.85, cap);
  return { id:`SCALING-${mission.id||'ADHOC'}`, missionId:mission.id||null, tier, band, recommendedPower:power, missionIndex, enemyLevelDelta:tier==='ELITE'?3:tier==='RAID'?5:1, powerScalar, dynamicCap:dynamic?'+10% capped':'fixed campaign band', philosophy:'tactical problems before raw statistics' };
}
export function scaleEnemyForMission(enemy, scaling, index=0){
  const role=String(enemy?.combatRole||enemy?.aiProfile?.archetype||'PRESSURE').toUpperCase();
  const budget=ARCHETYPE_BUDGETS[role] || ARCHETYPE_BUDGETS.PRESSURE;
  const stats=enemy?.stats||{};
  const countPenalty=budgetClamp(1 - (index * 0.035 * (budget.countPressure||1)), 0.82, 1);
  const scalar=scaling?.powerScalar||1;
  const scaled=clone(enemy);
  scaled.scalingProfile={ archetype:role, tier:scaling?.tier||'NORMAL', band:scaling?.band||'early', powerScalar:scalar, countPenalty, threatBudget:budget.threat, mechanics:budget.mechanics, dynamicCap:scaling?.dynamicCap||'fixed campaign band' };
  scaled.stats={...stats,
    hp:Math.max(6, Math.round((stats.hp||18) * scalar * budget.hp * countPenalty)),
    damage:Math.max(1, Math.round((stats.damage||6) * scalar * budget.damage)),
    armor:Math.max(0, Math.round((stats.armor||4) * scalar * budget.armor)),
    resistance:Math.max(0, Math.round((stats.resistance||3) * scalar * budget.resistance)),
    range:stats.range||1,
    movement:stats.movement||1,
    threatWeight:budget.threat
  };
  return scaled;
}

const profileFor = e => {
  const role = String(e.archetype || e.aiProfile?.archetype || '').toUpperCase();
  if(role === 'SWARMER') return { id:'HOLLOW_SWARMER', label:'Swarm Pressure', reactionType:'DODGE', preferredRange:1, movementBias:'close', telegraph:'Rushes isolated Titans and forces reaction spending.' };
  if(role === 'BRUTE') return { id:'GATEBORN_BRUTE', label:'Objective Crush', reactionType:'PARRY', preferredRange:1, movementBias:'anchor', telegraph:'Controls central objectives with Gate Stomp and Fracture Roar.' };
  if(role === 'EXECUTIONER') return { id:'WOUNDED_EXECUTIONER', label:'Devour Weakness', reactionType:'DODGE', preferredRange:1, movementBias:'hunt', telegraph:'Tracks wounded Titans and escalates if ignored.' };
  return { id:'PRESSURE', label:'Pressure Strike', reactionType:'COUNTER_CHARGE', preferredRange:e.range||1, movementBias:'close', telegraph:'Telegraphed pressure attack.' };
};
const intentLabel = (e, type) => ({
  SWARM_RAKE:'Scratch of Forgetting',
  SWARM_SURROUND:'Swarm Pressure',
  GATE_STOMP:'Gate Stomp',
  FRACTURE_ROAR:'Fracture Roar',
  OBJECTIVE_CRUSH:'Objective Crush',
  DEVOUR_WEAKNESS:'Devour Weakness',
  STRIKE:'Pressure Strike',
  ADVANCE:'Advance'
}[type] || profileFor(e).label);
function chooseEnemyIntent(state, e){
  const dist = distance(e.position,state.titan.position);
  const profile = profileFor(e);
  if(dist > (e.range||profile.preferredRange)) return { type:'ADVANCE', label:'Advance', target:state.titan.id, telegraphed:true, reactionType:'COUNTER_CHARGE', description:`${e.name} closes distance.`, damage:0, pressure:0 };
  if(profile.id==='HOLLOW_SWARMER'){
    const pack = living(state).filter(x=>profileFor(x).id==='HOLLOW_SWARMER').length;
    const type = pack > 1 && state.round % 2 === 0 ? 'SWARM_SURROUND' : 'SWARM_RAKE';
    return { type, label:intentLabel(e,type), target:state.titan.id, telegraphed:true, reactionType:'DODGE', description:type==='SWARM_SURROUND'?'Pack pressure tries to pin the active Titan.':'A forgetting scratch tests the guard.', damage:e.damage + Math.max(0,pack-1)*2, pressure:pack };
  }
  if(profile.id==='GATEBORN_BRUTE'){
    const type = state.objectives.some(o=>(o.progress||0)>0 && o.status!=='COMPLETE') ? 'OBJECTIVE_CRUSH' : (state.round % 3 === 0 ? 'FRACTURE_ROAR' : 'GATE_STOMP');
    return { type, label:intentLabel(e,type), target: type==='OBJECTIVE_CRUSH'?'objective':state.titan.id, telegraphed:true, reactionType:type==='FRACTURE_ROAR'?'DODGE':'PARRY', description:type==='OBJECTIVE_CRUSH'?'The Colossus turns toward the seal objective.':type==='FRACTURE_ROAR'?'A fracture roar threatens Momentum and stance.':'A crushing Gate Stomp is coming.', damage:type==='FRACTURE_ROAR'?Math.max(1,Math.round(e.damage*.55)):e.damage+4, pressure:e.threatWeight||2 };
  }
  if(profile.id==='WOUNDED_EXECUTIONER') return { type:'DEVOUR_WEAKNESS', label:intentLabel(e,'DEVOUR_WEAKNESS'), target:state.titan.id, telegraphed:true, reactionType:'DODGE', description:'The creature hunts low health and marked weakness.', damage:e.damage + (state.titan.hp <= state.titan.maxHp*.45 ? 6 : 0), pressure:2 };
  return { type:'STRIKE', label:intentLabel(e,'STRIKE'), target:state.titan.id, telegraphed:true, reactionType:profile.reactionType, description:profile.telegraph, damage:e.damage, pressure:1 };
}
function family(type){ if(type.startsWith('RESOURCE_')) return 'resource'; if(type.startsWith('REACTION_')) return 'reaction'; if(type.startsWith('OBJECTIVE_')) return 'objective'; if(type.startsWith('TERRAIN_')) return 'terrain'; return 'replay'; }
function log(state,type,detail={}){ state.telemetry.sequence=(state.telemetry.sequence||0)+1; state.eventLog.push({seq:state.telemetry.sequence,round:state.round,phase:state.phase,family:family(type),type,...detail}); }
function gain(state,resource,amount,source){ const before=state.resources[resource]||0; state.resources[resource]=clamp(before+amount); const delta=state.resources[resource]-before; state.telemetry.resourceGain[resource]=(state.telemetry.resourceGain[resource]||0)+Math.max(0,delta); log(state,'RESOURCE_GAIN',{resource,amount:delta,source}); }
function spend(state,resource,amount,source){ const before=state.resources[resource]||0; if(before<amount) return false; state.resources[resource]=clamp(before-amount); state.telemetry.resourceSpend[resource]=(state.telemetry.resourceSpend[resource]||0)+amount; log(state,'RESOURCE_SPEND',{resource,amount,source}); return true; }
function enemy(state,id){ const found=state.enemies.find(e=>e.id===id||e.instanceId===id); if(!found||found.hp<=0) throw new Error(`Enemy unavailable: ${id}`); return found; }
export function buildStarterTerrain(){
  const spaces=[];
  for(let y=1;y<=5;y++) for(let x=1;x<=5;x++) spaces.push({ position:{x,y}, type:y>=4?'SOLAR_SEAL_COURT':x>=4&&y>=3?'GATE_MOUTH':x<=2&&y<=2?'SUNKEN_SUNLIT_STONE':'BROKEN_THRESHOLD', illuminated:(x<=2&&y<=2)||(y===4&&x<=3), hazard:(x===4&&y===3)||(x===5&&y===3)?'SOLAR_JUDGMENT':null });
  return { grid:{width:5,height:5}, spaces };
}
export function createBattleState({ battleId='TG-BATTLE-FIRST-GATE-001', missionId='TG-F01-C01-M01', titan, enemies, terrain=buildStarterTerrain(), objectives, seed=777, scaling=null }){
  if(!titan?.id) throw new Error('Battle requires one active Titan.');
  if(!Array.isArray(enemies)||!enemies.length) throw new Error('Battle requires enemies.');
  const tStats=titan.stats||{};
  const appliedScaling=scaling || resolveMissionScaling({ mission:{id:missionId,recommendedPower:135,campaignType:'Normal'} });
  const scaledEnemies=enemies.map((e,i)=>e?.scalingProfile?e:scaleEnemyForMission(e,appliedScaling,i));
  const state={ battleId, missionId, seed, round:1, phase:PHASES.PLAYER, titan:{ id:titan.id, name:titan.name, role:titan.role, hp:tStats.hp||42, maxHp:tStats.hp||42, attack:tStats.attack||11, armor:tStats.armor||8, resistance:tStats.resistance||6, accuracy:tStats.accuracy||85, range:tStats.range||1, speed:tStats.speed||2, position:{x:1,y:1}, stance:STANCES.GUARDIAN, status:[], cooldowns:{}, ascended:false, actionsTakenThisRound:[] }, resources:{momentum:0,divinity:0,solarCharge:0}, scaling:appliedScaling, enemies:scaledEnemies.map((e,i)=>{ const role=e.combatRole||e.aiProfile?.archetype||e.scalingProfile?.archetype||'PRESSURE'; const base={ id:e.id, instanceId:`${e.id}-${i+1}`, name:e.name, archetype:role, abilities:e.abilities||[], aiPriority:e.aiProfile?.priority||[], mapBehavior:e.mapBehavior||'', hp:e.stats?.hp||18, maxHp:e.stats?.hp||18, damage:e.stats?.damage||6, armor:e.stats?.armor||4, resistance:e.stats?.resistance||3, range:e.stats?.range||1, movement:e.stats?.movement||1, threatWeight:e.stats?.threatWeight||e.scalingProfile?.threatBudget||1, scalingProfile:e.scalingProfile||null, position:{x:4+(i%2),y:3+Math.floor(i/2)}, intent:null, vulnerable:false, status:[] }; return { ...base, aiProfile:profileFor(base) }; }), terrain:clone(terrain), objectives:clone(objectives||[{id:'stabilize_solar_seal_a',label:'Stabilize Solar Seal',progress:0,requiredProgress:2,status:'ACTIVE'},{id:'destroy_hollow_anchor',label:'Destroy Hollow Anchor',progress:0,requiredProgress:1,status:'ACTIVE'}]), reactionWindow:null, eventLog:[], telemetry:{turns:1,damageDealt:0,damageTaken:0,reactionsOpened:0,reactionsResolved:0,executions:0,objectiveProgress:0,hazardDamage:0,enemyTelegraphs:0,enemyIntentCounts:{},enemyScaling:{tier:appliedScaling.tier,band:appliedScaling.band,powerScalar:appliedScaling.powerScalar,threatBudget:Number(scaledEnemies.reduce((sum,e)=>sum+(e.scalingProfile?.threatBudget||1),0).toFixed(2)),archetypes:{}},resourceGain:{momentum:0,divinity:0,solarCharge:0},resourceSpend:{momentum:0,divinity:0,solarCharge:0},sequence:0,reactionSuccesses:0,reactionDeclines:0,objectiveCompletions:0,actionTypeCounts:{},terrainTouches:{},routeSpacesVisited:[]} };
  for(const e of state.enemies){ const a=e.scalingProfile?.archetype||e.archetype||'PRESSURE'; state.telemetry.enemyScaling.archetypes[a]=(state.telemetry.enemyScaling.archetypes[a]||0)+1; }
  log(state,'BATTLE_START',{battleId,missionId,titan:titan.id,enemies:state.enemies.map(e=>e.instanceId),scaling:state.telemetry.enemyScaling});
  return state;
}
export function applyTitanAction(input,action){
  const s=clone(input); if(s.phase!==PHASES.PLAYER) throw new Error(`Titan action blocked during ${s.phase}`);
  if(action.type==='MOVE'){ const dist=distance(s.titan.position,action.to); const sp=s.terrain.spaces.find(x=>key(x.position)===key(action.to)); if(!sp) throw new Error('Invalid move target'); if(dist>s.titan.speed) throw new Error('Move exceeds speed'); s.titan.position=clone(action.to); if(sp.illuminated) gain(s,'momentum',8,'illuminated_movement'); s.telemetry.routeSpacesVisited.push(key(action.to)); log(s,'TITAN_MOVE',{to:action.to,terrain:sp.type}); }
  else if(action.type==='BASIC_ATTACK'){ const e=enemy(s,action.targetId); if(distance(s.titan.position,e.position)>s.titan.range) throw new Error('Target out of range'); const dmg=Math.max(1,s.titan.attack+(s.titan.stance===STANCES.ASSAULT?3:0)-Math.floor(e.armor/4)); e.hp=Math.max(0,e.hp-dmg); e.vulnerable=e.hp>0&&e.hp<=Math.ceil(e.maxHp*.35); s.telemetry.damageDealt+=dmg; gain(s,'momentum',currentSpace(s)?.illuminated?12:8,'basic_attack'); if(e.vulnerable) gain(s,'divinity',5,'vulnerability_created'); log(s,'BASIC_ATTACK',{target:e.instanceId,damage:dmg,remainingHp:e.hp,vulnerable:e.vulnerable}); }
  else if(action.type==='TECHNIQUE'){ if(!spend(s,'momentum',20,'technique')) throw new Error('Technique requires 20 Momentum'); const e=enemy(s,action.targetId); const dmg=Math.max(2,Math.round(s.titan.attack*1.3)-Math.floor(e.armor/5)); e.hp=Math.max(0,e.hp-dmg); e.status.push('MARKED_BY_VERDICT'); s.resources.solarCharge=clamp(s.resources.solarCharge+10); s.telemetry.damageDealt+=dmg; log(s,'TECHNIQUE',{target:e.instanceId,damage:dmg}); }
  else if(action.type==='FOCUS'){ gain(s,'momentum',6,'focus'); gain(s,'divinity',4,'focus'); log(s,'FOCUS'); }
  else if(action.type==='STANCE_SHIFT'){ if(!Object.values(STANCES).includes(action.stance)) throw new Error('Invalid stance'); if(action.stance===STANCES.ASCENDANT&&!s.titan.ascended) throw new Error('Ascendant stance requires Divine Ascension'); s.titan.stance=action.stance; log(s,'STANCE_SHIFT',{stance:action.stance}); }
  else if(action.type==='EXECUTE'){ if(!spend(s,'momentum',30,'execution')) throw new Error('Execution requires 30 Momentum'); const e=enemy(s,action.targetId); if(!e.vulnerable) throw new Error('Execution requires vulnerable enemy'); const dmg=e.hp; e.hp=0; s.telemetry.damageDealt+=dmg; s.telemetry.executions+=1; gain(s,'divinity',18,'execution'); log(s,'EXECUTION',{target:e.instanceId,damage:dmg}); }
  else throw new Error(`Unknown Titan action ${action.type}`);
  if(!living(s).length) s.phase=PHASES.OBJECTIVE; s.titan.actionsTakenThisRound.push(action.type); s.telemetry.actionTypeCounts[action.type]=(s.telemetry.actionTypeCounts[action.type]||0)+1; return s;
}

export function revealEnemyIntents(input){
  const s=clone(input); s.phase=PHASES.ENEMY_INTENT;
  for(const e of living(s)){ e.intent=chooseEnemyIntent(s,e); s.telemetry.enemyTelegraphs+=1; s.telemetry.enemyIntentCounts[e.intent.type]=(s.telemetry.enemyIntentCounts[e.intent.type]||0)+1; log(s,'ENEMY_INTENT',{enemy:e.instanceId,intent:e.intent.type,label:e.intent.label,reactionType:e.intent.reactionType,pressure:e.intent.pressure,description:e.intent.description}); }
  s.phase=PHASES.ENEMY; return s;
}
export function resolveEnemyPhase(input){
  const s=clone(input); if(s.phase!==PHASES.ENEMY) throw new Error(`Enemy phase blocked during ${s.phase}`);
  const e=living(s).find(x=>x.intent); if(!e){ s.phase=PHASES.TERRAIN; return s; }
  if(e.intent.type==='ADVANCE'){
    const dx=Math.sign(s.titan.position.x-e.position.x); const dy=Math.sign(s.titan.position.y-e.position.y);
    const steps=Math.max(1,Math.min(e.movement||1,2));
    for(let i=0;i<steps;i++){ if(Math.abs(s.titan.position.x-e.position.x)>=Math.abs(s.titan.position.y-e.position.y)) e.position.x+=dx; else e.position.y+=dy; }
    log(s,'ENEMY_ADVANCE',{enemy:e.instanceId,to:e.position,profile:e.aiProfile?.id}); e.intent=null; return s;
  }
  if(e.intent.type==='OBJECTIVE_CRUSH'){
    const objective=s.objectives.find(o=>o.status!=='COMPLETE' && (o.progress||0)>0) || s.objectives.find(o=>o.status!=='COMPLETE');
    if(objective){ objective.progress=Math.max(0,(objective.progress||0)-1); s.telemetry.objectiveProgress=Math.max(0,(s.telemetry.objectiveProgress||0)-1); log(s,'OBJECTIVE_CRUSH',{enemy:e.instanceId,objective:objective.id,progress:objective.progress}); }
  }
  if(e.intent.type==='FRACTURE_ROAR'){
    const loss=Math.min(s.resources.momentum||0,8); s.resources.momentum=clamp((s.resources.momentum||0)-loss); s.titan.status=[...new Set([...(s.titan.status||[]),'FRACTURE_ROAR'])]; log(s,'FRACTURE_ROAR',{enemy:e.instanceId,momentumLost:loss});
  }
  const cost=e.intent.reactionType==='DODGE'?{momentum:10}:e.intent.reactionType==='PARRY'?{momentum:14}:{momentum:8};
  s.reactionWindow={id:`RW-${s.round}-${e.instanceId}`,sourceEnemy:e.instanceId,type:e.intent.reactionType,cost,options:['RESOLVE','DECLINE'],consequencePreview:`${e.intent.label} · ${e.intent.description} ${e.intent.damage?`(${e.intent.damage} base damage)`:''}`,expiresAtPhase:PHASES.REACTION};
  s.phase=PHASES.REACTION; s.telemetry.reactionsOpened+=1; log(s,'REACTION_OPENED',{reaction:s.reactionWindow}); return s;
}
export function applyReaction(input,choice='RESOLVE'){
  const s=clone(input); if(s.phase!==PHASES.REACTION||!s.reactionWindow) throw new Error('No reaction window open'); const e=s.enemies.find(x=>x.instanceId===s.reactionWindow.sourceEnemy); if(!e) throw new Error('Reaction source missing');
  if(choice==='RESOLVE'){ const cost=s.reactionWindow.cost?.momentum||0; if(cost&&!spend(s,'momentum',cost,'reaction')) choice='DECLINE'; }
  if(choice==='RESOLVE'){ const type=s.reactionWindow.type; if(type==='DODGE'){ gain(s,'momentum',12,'successful_dodge'); gain(s,'divinity',6,'successful_dodge'); s.telemetry.reactionSuccesses+=1; log(s,'REACTION_SUCCESS',{type,enemy:e.instanceId,prevented:e.damage}); } else { const dmg=Math.max(1,Math.round(s.titan.attack*.9)-Math.floor(e.armor/6)); e.hp=Math.max(0,e.hp-dmg); e.vulnerable=e.hp>0&&e.hp<=Math.ceil(e.maxHp*.35); s.telemetry.damageDealt+=dmg; gain(s,'momentum',14,'successful_counter_reaction'); gain(s,'divinity',8,'successful_counter_reaction'); s.telemetry.reactionSuccesses+=1; log(s,'REACTION_SUCCESS',{type,enemy:e.instanceId,counterDamage:dmg,enemyHp:e.hp}); } }
  else { const rawDamage=e.intent?.damage ?? e.damage; const mitigation=s.titan.stance===STANCES.GUARDIAN?Math.floor(s.titan.armor/3):Math.floor(s.titan.armor/5); const dmg=Math.max(1,rawDamage-mitigation); s.titan.hp=Math.max(0,s.titan.hp-dmg); s.telemetry.damageTaken+=dmg; s.telemetry.reactionDeclines+=1; log(s,'REACTION_DECLINED',{enemy:e.instanceId,intent:e.intent?.type,damage:dmg,titanHp:s.titan.hp}); }
  e.intent=null; s.reactionWindow=null; s.telemetry.reactionsResolved+=1; s.phase=s.titan.hp<=0?PHASES.DEFEAT:PHASES.ENEMY; return s;
}
export function applyTerrainTick(input){
  const s=clone(input); s.phase=PHASES.TERRAIN; const sp=currentSpace(s); if(sp?.hazard==='SOLAR_JUDGMENT'){ const dmg=s.titan.stance===STANCES.GUARDIAN?1:4; s.titan.hp=Math.max(0,s.titan.hp-dmg); s.telemetry.damageTaken+=dmg; s.telemetry.hazardDamage+=dmg; gain(s,'solarCharge',8,'solar_judgment_lane'); log(s,'TERRAIN_HAZARD',{hazard:sp.hazard,damage:dmg,titanHp:s.titan.hp}); } return s;
}
export function evaluateObjectives(input,objectiveEvent=null){
  const s=clone(input); s.phase=PHASES.OBJECTIVE;
  if(objectiveEvent){ const o=s.objectives.find(x=>x.id===objectiveEvent.objectiveId); if(!o) throw new Error(`Unknown objective ${objectiveEvent.objectiveId}`); o.progress=Math.min(o.requiredProgress,(o.progress||0)+(objectiveEvent.progress||1)); if(o.progress>=o.requiredProgress&&o.status!=='COMPLETE'){ o.status='COMPLETE'; s.telemetry.objectiveCompletions+=1; gain(s,'momentum',objectiveEvent.momentum||12,'objective_complete'); gain(s,'divinity',objectiveEvent.divinity||10,'objective_complete'); log(s,'OBJECTIVE_COMPLETE',{objective:o.id}); } s.telemetry.objectiveProgress+=objectiveEvent.progress||1; log(s,'OBJECTIVE_PROGRESS',{objective:o.id,progress:o.progress,status:o.status}); }
  if(s.titan.hp<=0) s.phase=PHASES.DEFEAT; else if(s.objectives.every(o=>o.status==='COMPLETE')) s.phase=PHASES.VICTORY; else { s.round+=1; s.telemetry.turns=s.round; s.titan.actionsTakenThisRound=[]; s.phase=PHASES.PLAYER; log(s,'ROUND_ADVANCE',{round:s.round}); } return s;
}
export function autoAdvanceEnemyTurn(input){
  let s=clone(input); if(s.phase===PHASES.PLAYER) s=revealEnemyIntents(s);
  let guard=0; while(s.phase===PHASES.ENEMY && guard++<8){ s=resolveEnemyPhase(s); }
  if(s.phase===PHASES.TERRAIN) s=applyTerrainTick(s);
  if(s.phase===PHASES.TERRAIN) s=evaluateObjectives(s);
  return s;
}
export function summarizeBattle(state){
  const complete=(state.objectives||[]).filter(o=>o.status==='COMPLETE').length;
  const objectiveCompletionRate=state.objectives?.length?Number((complete/state.objectives.length).toFixed(3)):0;
  const reactionSuccessRate=state.telemetry.reactionsOpened?Number(((state.telemetry.reactionSuccesses||0)/state.telemetry.reactionsOpened).toFixed(3)):0;
  return { finalPhase:state.phase, turns:state.round, damageDealt:state.telemetry.damageDealt||0, damageTaken:state.telemetry.damageTaken||0, reactionSuccessRate, objectiveCompletionRate, enemiesRemaining:living(state).length, resources:state.resources };
}
