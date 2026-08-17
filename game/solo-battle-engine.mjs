export const PHASES = Object.freeze({
  PLAYER: 'PLAYER_PHASE',
  ENEMY_INTENT: 'ENEMY_INTENT',
  ENEMY: 'ENEMY_PHASE',
  REACTION: 'REACTION_WINDOW',
  TERRAIN: 'TERRAIN_TICK',
  OBJECTIVE: 'OBJECTIVE_EVALUATION',
  VICTORY: 'VICTORY',
  DEFEAT: 'DEFEAT'
});

export const STANCES = Object.freeze({
  GUARDIAN: 'GUARDIAN',
  ASSAULT: 'ASSAULT',
  ASCENDANT: 'ASCENDANT'
});

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(value)));
const clone = value => JSON.parse(JSON.stringify(value));
const key = pos => `${pos.x},${pos.y}`;
const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

function telemetryFamily(type) {
  if (type.startsWith('RESOURCE_')) return 'resource';
  if (type.startsWith('REACTION_')) return 'reaction';
  if (type.startsWith('OBJECTIVE_')) return 'objective';
  if (type.startsWith('TERRAIN_')) return 'terrain';
  if (type.startsWith('BOSS_PHASE_')) return 'boss';
  return 'replay';
}
function log(state, type, detail = {}) {
  state.telemetry.sequence = (state.telemetry.sequence || 0) + 1;
  state.eventLog.push({
    seq: state.telemetry.sequence,
    runId: state.telemetry.runId,
    round: state.round,
    phase: state.phase,
    family: telemetryFamily(type),
    type,
    ...detail
  });
}
export function recordTelemetryHook(inputState, type, detail = {}) {
  const state = clone(inputState);
  log(state, type, detail);
  return state;
}
function gain(state, resource, amount, source) {
  const before = state.resources[resource] ?? 0;
  state.resources[resource] = clamp(before + amount);
  const delta = state.resources[resource] - before;
  state.telemetry.resourceGain[resource] = (state.telemetry.resourceGain[resource] || 0) + Math.max(0, delta);
  log(state, 'RESOURCE_GAIN', { resource, amount: delta, source });
}
function spend(state, resource, amount, source) {
  const before = state.resources[resource] ?? 0;
  if (before < amount) return false;
  state.resources[resource] = clamp(before - amount);
  state.telemetry.resourceSpend[resource] = (state.telemetry.resourceSpend[resource] || 0) + amount;
  log(state, 'RESOURCE_SPEND', { resource, amount, source });
  return true;
}
function findEnemy(state, enemyId) {
  const enemy = state.enemies.find(e => e.id === enemyId || e.instanceId === enemyId);
  if (!enemy || enemy.hp <= 0) throw new Error(`Enemy unavailable: ${enemyId}`);
  return enemy;
}
function livingEnemies(state) { return state.enemies.filter(e => e.hp > 0); }
function currentSpace(state) { return state.terrain.spaces.find(s => key(s.position) === key(state.titan.position)); }

export function createInitialSoloBattleState({ battleId, missionId, titan, enemies, terrain, objectives, seed = 1 }) {
  if (!titan?.id) throw new Error('A solo battle requires one active titan.');
  if (!Array.isArray(enemies) || enemies.length < 1) throw new Error('A solo battle requires at least one enemy.');
  const state = {
    battleId,
    missionId,
    seed,
    round: 1,
    phase: PHASES.PLAYER,
    titan: {
      id: titan.id,
      name: titan.name,
      role: titan.role,
      hp: titan.stats.hp,
      maxHp: titan.stats.hp,
      attack: titan.stats.attack,
      armor: titan.stats.armor,
      resistance: titan.stats.resistance,
      accuracy: titan.stats.accuracy,
      range: titan.stats.range,
      speed: titan.stats.speed,
      position: { x: 1, y: 1 },
      stance: STANCES.GUARDIAN,
      status: [],
      cooldowns: {},
      ascended: false,
      actionsTakenThisRound: []
    },
    resources: { momentum: 0, divinity: 0, solarCharge: 0 },
    enemies: enemies.map((enemy, index) => ({
      id: enemy.id,
      instanceId: `${enemy.id}-${index + 1}`,
      name: enemy.name,
      archetype: enemy.combatRole || enemy.aiProfile?.archetype || 'PRESSURE',
      hp: enemy.stats.hp,
      maxHp: enemy.stats.hp,
      damage: enemy.stats.damage,
      armor: enemy.stats.armor,
      resistance: enemy.stats.resistance,
      range: enemy.stats.range,
      movement: enemy.stats.movement,
      threatWeight: enemy.stats.threatWeight || 1,
      position: { x: 4 + (index % 3), y: 3 + Math.floor(index / 3) },
      intent: null,
      vulnerable: false,
      status: []
    })),
    terrain: clone(terrain),
    objectives: clone(objectives),
    reactionWindow: null,
    eventLog: [],
    telemetry: {
      turns: 1,
      damageDealt: 0,
      damageTaken: 0,
      reactionsOpened: 0,
      reactionsResolved: 0,
      executions: 0,
      objectiveProgress: 0,
      hazardDamage: 0,
      enemyTelegraphs: 0,
      resourceGain: { momentum: 0, divinity: 0, solarCharge: 0 },
      resourceSpend: { momentum: 0, divinity: 0, solarCharge: 0 },
      sequence: 0,
      runId: `${battleId || missionId || 'SOLO'}-${seed}`,
      reactionSuccesses: 0,
      reactionDeclines: 0,
      objectiveCompletions: 0,
      bossPhaseReached: {},
      bossPhaseCleared: {},
      bossPhaseFailed: {},
      actionTypeCounts: {},
      terrainTouches: {},
      routeSpacesVisited: []
    }
  };
  log(state, 'BATTLE_START', { battleId, missionId, titanId: titan.id, enemies: state.enemies.map(e => e.instanceId) });
  return state;
}

export function applyTitanAction(inputState, action) {
  const state = clone(inputState);
  if (state.phase !== PHASES.PLAYER) throw new Error(`Titan action blocked during ${state.phase}`);
  if (action.type === 'MOVE') {
    const dist = distance(state.titan.position, action.to);
    const space = state.terrain.spaces.find(s => key(s.position) === key(action.to));
    if (!space) throw new Error(`Invalid move target ${key(action.to)}`);
    if (dist > state.titan.speed) throw new Error(`Move exceeds speed: ${dist} > ${state.titan.speed}`);
    state.titan.position = clone(action.to);
    const illuminated = Boolean(space.illuminated);
    if (illuminated) gain(state, 'momentum', 8, 'illuminated_movement');
    state.telemetry.routeSpacesVisited.push(key(action.to));
    state.telemetry.terrainTouches[space.type] = (state.telemetry.terrainTouches[space.type] || 0) + 1;
    log(state, 'TITAN_MOVE', { to: action.to, terrain: space.type, illuminated });
  } else if (action.type === 'BASIC_ATTACK') {
    const enemy = findEnemy(state, action.targetId);
    if (distance(state.titan.position, enemy.position) > state.titan.range) throw new Error('Target out of range');
    const damage = Math.max(1, state.titan.attack + (state.titan.stance === STANCES.ASSAULT ? 3 : 0) - Math.floor(enemy.armor / 4));
    enemy.hp = Math.max(0, enemy.hp - damage);
    enemy.vulnerable = enemy.hp > 0 && enemy.hp <= Math.ceil(enemy.maxHp * 0.35);
    state.telemetry.damageDealt += damage;
    gain(state, 'momentum', currentSpace(state)?.illuminated ? 12 : 8, 'basic_attack');
    if (enemy.vulnerable) gain(state, 'divinity', 5, 'vulnerability_created');
    log(state, 'BASIC_ATTACK', { target: enemy.instanceId, damage, remainingHp: enemy.hp, vulnerable: enemy.vulnerable });
  } else if (action.type === 'TECHNIQUE') {
    if (!spend(state, 'momentum', 20, 'technique')) throw new Error('Technique requires 20 Momentum');
    const enemy = findEnemy(state, action.targetId);
    const damage = Math.max(2, Math.round(state.titan.attack * 1.3) - Math.floor(enemy.armor / 5));
    enemy.hp = Math.max(0, enemy.hp - damage);
    enemy.status.push('MARKED_BY_VERDICT');
    state.resources.solarCharge = clamp(state.resources.solarCharge + 10);
    state.telemetry.damageDealt += damage;
    log(state, 'TECHNIQUE', { target: enemy.instanceId, damage, status: 'MARKED_BY_VERDICT', solarCharge: state.resources.solarCharge });
  } else if (action.type === 'SIGNATURE') {
    if (!spend(state, 'momentum', 45, 'signature')) throw new Error('Signature requires 45 Momentum');
    if (!spend(state, 'divinity', 25, 'signature')) throw new Error('Signature requires 25 Divinity');
    for (const enemy of livingEnemies(state)) {
      const damage = Math.max(3, Math.round(state.titan.attack * 1.4) - Math.floor(enemy.resistance / 5));
      enemy.hp = Math.max(0, enemy.hp - damage);
      enemy.vulnerable = enemy.hp > 0 && enemy.hp <= Math.ceil(enemy.maxHp * 0.35);
      state.telemetry.damageDealt += damage;
    }
    state.titan.status.push('LAW_OF_HOLDING');
    log(state, 'SIGNATURE', { name: 'Law of Holding', enemiesRemaining: livingEnemies(state).length });
  } else if (action.type === 'STANCE_SHIFT') {
    if (!Object.values(STANCES).includes(action.stance)) throw new Error(`Invalid stance ${action.stance}`);
    if (action.stance === STANCES.ASCENDANT && !state.titan.ascended) throw new Error('Ascendant stance requires Divine Ascension');
    state.titan.stance = action.stance;
    log(state, 'STANCE_SHIFT', { stance: action.stance });
  } else if (action.type === 'FOCUS') {
    gain(state, 'momentum', 6, 'focus');
    gain(state, 'divinity', 4, 'focus');
    log(state, 'FOCUS');
  } else if (action.type === 'EXECUTE') {
    if (!spend(state, 'momentum', 30, 'execution')) throw new Error('Execution requires 30 Momentum');
    const enemy = findEnemy(state, action.targetId);
    if (!enemy.vulnerable) throw new Error('Execution requires vulnerable enemy');
    const damage = enemy.hp;
    enemy.hp = 0;
    state.telemetry.damageDealt += damage;
    state.telemetry.executions += 1;
    gain(state, 'divinity', 18, 'execution');
    log(state, 'EXECUTION', { target: enemy.instanceId, damage });
  } else if (action.type === 'DIVINE_ASCENSION') {
    if (!spend(state, 'divinity', 100, 'divine_ascension')) throw new Error('Divine Ascension requires 100 Divinity');
    state.titan.ascended = true;
    state.titan.stance = STANCES.ASCENDANT;
    state.titan.status.push('ASCENDANT_2_ROUNDS');
    log(state, 'DIVINE_ASCENSION', { stance: state.titan.stance });
  } else {
    throw new Error(`Unknown Titan action ${action.type}`);
  }
  if (!livingEnemies(state).length) state.phase = PHASES.OBJECTIVE;
  state.titan.actionsTakenThisRound.push(action.type);
  state.telemetry.actionTypeCounts[action.type] = (state.telemetry.actionTypeCounts[action.type] || 0) + 1;
  return state;
}

export function revealEnemyIntents(inputState) {
  const state = clone(inputState);
  state.phase = PHASES.ENEMY_INTENT;
  for (const enemy of livingEnemies(state)) {
    const dist = distance(enemy.position, state.titan.position);
    enemy.intent = dist <= enemy.range
      ? { type: enemy.archetype === 'BRUTE' ? 'CRUSH' : 'STRIKE', target: state.titan.id, telegraphed: true, reactionType: enemy.archetype === 'BRUTE' ? 'PARRY' : 'DODGE' }
      : { type: 'ADVANCE', target: state.titan.id, telegraphed: true, reactionType: 'COUNTER_CHARGE' };
    state.telemetry.enemyTelegraphs += 1;
    log(state, 'ENEMY_INTENT', { enemy: enemy.instanceId, intent: enemy.intent.type, reactionType: enemy.intent.reactionType });
  }
  state.phase = PHASES.ENEMY;
  return state;
}

export function resolveEnemyPhase(inputState) {
  const state = clone(inputState);
  if (state.phase !== PHASES.ENEMY) throw new Error(`Enemy phase blocked during ${state.phase}`);
  const acting = livingEnemies(state).find(e => e.intent);
  if (!acting) { state.phase = PHASES.TERRAIN; return state; }
  if (acting.intent.type === 'ADVANCE') {
    acting.position.x += Math.sign(state.titan.position.x - acting.position.x);
    acting.position.y += Math.sign(state.titan.position.y - acting.position.y);
    log(state, 'ENEMY_ADVANCE', { enemy: acting.instanceId, to: acting.position });
    acting.intent = null;
    return state;
  }
  state.reactionWindow = {
    id: `RW-${state.round}-${acting.instanceId}`,
    sourceEnemy: acting.instanceId,
    type: acting.intent.reactionType,
    cost: acting.intent.reactionType === 'DODGE' ? { momentum: 10 } : { momentum: 14 },
    options: ['RESOLVE', 'DECLINE'],
    consequencePreview: `${acting.name} ${acting.intent.type.toLowerCase()} for ${acting.damage} base damage`,
    expiresAtPhase: PHASES.REACTION
  };
  state.phase = PHASES.REACTION;
  state.telemetry.reactionsOpened += 1;
  log(state, 'REACTION_OPENED', { reaction: state.reactionWindow });
  return state;
}

export function applyReaction(inputState, choice = 'RESOLVE') {
  const state = clone(inputState);
  if (state.phase !== PHASES.REACTION || !state.reactionWindow) throw new Error('No reaction window open');
  const enemy = state.enemies.find(e => e.instanceId === state.reactionWindow.sourceEnemy);
  if (!enemy) throw new Error('Reaction source missing');
  if (choice === 'RESOLVE') {
    const cost = state.reactionWindow.cost?.momentum || 0;
    if (cost && !spend(state, 'momentum', cost, 'reaction')) choice = 'DECLINE';
  }
  if (choice === 'RESOLVE') {
    const type = state.reactionWindow.type;
    if (type === 'DODGE') {
      gain(state, 'momentum', 12, 'successful_dodge');
      gain(state, 'divinity', 6, 'successful_dodge');
      state.telemetry.reactionSuccesses += 1;
      log(state, 'REACTION_SUCCESS', { type, enemy: enemy.instanceId, prevented: enemy.damage });
    } else if (type === 'PARRY' || type === 'COUNTER_CHARGE') {
      const counterDamage = Math.max(1, Math.round(state.titan.attack * 0.9) - Math.floor(enemy.armor / 6));
      enemy.hp = Math.max(0, enemy.hp - counterDamage);
      enemy.vulnerable = enemy.hp > 0 && enemy.hp <= Math.ceil(enemy.maxHp * 0.35);
      state.telemetry.damageDealt += counterDamage;
      gain(state, 'momentum', 14, 'successful_counter_reaction');
      gain(state, 'divinity', 8, 'successful_counter_reaction');
      state.telemetry.reactionSuccesses += 1;
      log(state, 'REACTION_SUCCESS', { type, enemy: enemy.instanceId, counterDamage, enemyHp: enemy.hp });
    }
  } else {
    const mitigation = state.titan.stance === STANCES.GUARDIAN ? Math.floor(state.titan.armor / 3) : Math.floor(state.titan.armor / 5);
    const damage = Math.max(1, enemy.damage - mitigation);
    state.titan.hp = Math.max(0, state.titan.hp - damage);
    state.telemetry.damageTaken += damage;
    state.telemetry.reactionDeclines += 1;
    log(state, 'REACTION_DECLINED', { enemy: enemy.instanceId, damage, titanHp: state.titan.hp });
  }
  enemy.intent = null;
  state.reactionWindow = null;
  state.telemetry.reactionsResolved += 1;
  state.phase = state.titan.hp <= 0 ? PHASES.DEFEAT : PHASES.ENEMY;
  return state;
}

export function applyTerrainTick(inputState) {
  const state = clone(inputState);
  state.phase = PHASES.TERRAIN;
  const space = currentSpace(state);
  if (space?.hazard === 'SOLAR_JUDGMENT') {
    const damage = state.titan.stance === STANCES.GUARDIAN ? 1 : 4;
    state.titan.hp = Math.max(0, state.titan.hp - damage);
    state.telemetry.damageTaken += damage;
    state.telemetry.hazardDamage += damage;
    state.telemetry.terrainTouches[space.type] = (state.telemetry.terrainTouches[space.type] || 0) + 1;
    gain(state, 'solarCharge', 8, 'solar_judgment_lane');
    log(state, 'TERRAIN_HAZARD', { hazard: space.hazard, damage, titanHp: state.titan.hp });
  }
  return state;
}

export function evaluateObjectives(inputState, objectiveEvent = null) {
  const state = clone(inputState);
  state.phase = PHASES.OBJECTIVE;
  if (objectiveEvent) {
    const objective = state.objectives.find(o => o.id === objectiveEvent.objectiveId);
    if (!objective) throw new Error(`Unknown objective ${objectiveEvent.objectiveId}`);
    objective.progress = Math.min(objective.requiredProgress, (objective.progress || 0) + (objectiveEvent.progress || 1));
    if (objective.progress >= objective.requiredProgress) {
      objective.status = 'COMPLETE';
      state.telemetry.objectiveCompletions += 1;
      gain(state, 'momentum', objectiveEvent.momentum || 12, 'objective_complete');
      gain(state, 'divinity', objectiveEvent.divinity || 10, 'objective_complete');
      log(state, 'OBJECTIVE_COMPLETE', { objective: objective.id, progress: objective.progress, status: objective.status });
    }
    state.telemetry.objectiveProgress += objectiveEvent.progress || 1;
    log(state, 'OBJECTIVE_PROGRESS', { objective: objective.id, progress: objective.progress, status: objective.status });
  }
  if (state.titan.hp <= 0) state.phase = PHASES.DEFEAT;
  else if (state.objectives.every(o => o.status === 'COMPLETE')) state.phase = PHASES.VICTORY;
  else {
    state.round += 1;
    state.telemetry.turns = state.round;
    state.titan.actionsTakenThisRound = [];
    // M01 turn limit enforcement: defeat if turn limit exceeded
    if (state.turnLimit && state.round > state.turnLimit) {
      state.phase = PHASES.DEFEAT;
      log(state, 'TURN_LIMIT_EXCEEDED', { round: state.round, limit: state.turnLimit });
    } else {
      state.phase = PHASES.PLAYER;
      log(state, 'ROUND_ADVANCE', { round: state.round });
    }
  }
  return state;
}



export function recordBossPhaseTelemetry(inputState, { bossId, phaseIndex, status, reason = '' }) {
  const state = clone(inputState);
  const keyName = `phase_${phaseIndex}`;
  const normalized = String(status || 'reached').toUpperCase();
  if (normalized === 'CLEARED') state.telemetry.bossPhaseCleared[keyName] = (state.telemetry.bossPhaseCleared[keyName] || 0) + 1;
  else if (normalized === 'FAILED') state.telemetry.bossPhaseFailed[keyName] = (state.telemetry.bossPhaseFailed[keyName] || 0) + 1;
  else state.telemetry.bossPhaseReached[keyName] = (state.telemetry.bossPhaseReached[keyName] || 0) + 1;
  log(state, `BOSS_PHASE_${normalized}`, { bossId, phaseIndex, reason });
  return state;
}

export function summarizeBattlefieldTelemetry(state) {
  const telemetry = clone(state.telemetry || {});
  const objectives = state.objectives || [];
  const uniqueRoutes = new Set(telemetry.routeSpacesVisited || []).size;
  const actionTypes = Object.keys(telemetry.actionTypeCounts || {}).length;
  const resourceSpendTotal = Object.values(telemetry.resourceSpend || {}).reduce((sum, value) => sum + Number(value || 0), 0);
  const reactionSuccessRate = telemetry.reactionsOpened ? Number(((telemetry.reactionSuccesses || 0) / telemetry.reactionsOpened).toFixed(3)) : 0;
  const objectiveCompletionRate = objectives.length ? Number(((telemetry.objectiveCompletions || objectives.filter(o => o.status === 'COMPLETE').length) / objectives.length).toFixed(3)) : 0;
  const momentumSpend = Math.max(1, Number((telemetry.resourceSpend || {}).momentum || 0));
  const divinitySpend = Math.max(1, Number((telemetry.resourceSpend || {}).divinity || 0));
  const momentumEfficiency = Number((((telemetry.damageDealt || 0) + (telemetry.objectiveProgress || 0) * 10) / momentumSpend).toFixed(3));
  const divinityEfficiency = Number((((telemetry.bossPhaseCleared && Object.values(telemetry.bossPhaseCleared).reduce((a, b) => a + b, 0)) || 0) * 25 / divinitySpend).toFixed(3));
  const hazardDamageShare = telemetry.damageTaken ? Number(((telemetry.hazardDamage || 0) / telemetry.damageTaken).toFixed(3)) : 0;
  const bossPhaseFailPoints = Object.entries(telemetry.bossPhaseFailed || {}).map(([phase, count]) => ({ phase, count })).sort((a, b) => b.count - a.count);
  const replayabilityScore = Math.max(0, Math.min(100, Math.round(uniqueRoutes * 8 + actionTypes * 10 + Math.min(30, resourceSpendTotal / 3) + Math.min(20, (telemetry.reactionsResolved || 0) * 5))));
  const watch = [];
  if (reactionSuccessRate && reactionSuccessRate < 0.35) watch.push('LOW_REACTION_SUCCESS');
  if (reactionSuccessRate > 0.9 && telemetry.reactionsOpened >= 3) watch.push('REACTIONS_TOO_EASY');
  if (hazardDamageShare > 0.4) watch.push('HAZARD_DAMAGE_SPIKE');
  if (objectiveCompletionRate < 0.65) watch.push('OBJECTIVE_COMPLETION_RISK');
  if (replayabilityScore < 60) watch.push('LOW_REPLAYABILITY');
  if (bossPhaseFailPoints.some(p => p.count > 0)) watch.push('BOSS_FAIL_POINT_REVIEW');
  return {
    runId: telemetry.runId,
    battleId: state.battleId,
    missionId: state.missionId,
    finalPhase: state.phase,
    turns: telemetry.turns || state.round,
    damageDealt: telemetry.damageDealt || 0,
    damageTaken: telemetry.damageTaken || 0,
    reactionSuccessRate,
    objectiveCompletionRate,
    momentumEfficiency,
    divinityEfficiency,
    hazardDamageShare,
    bossPhaseFailPoints,
    replayabilityScore,
    routeDiversity: uniqueRoutes,
    actionTypeDiversity: actionTypes,
    watch
  };
}

export function runReducerScript(initialState, actions) {
  return actions.reduce((state, action) => {
    if (action.reducer === 'applyTitanAction') return applyTitanAction(state, action.action);
    if (action.reducer === 'revealEnemyIntents') return revealEnemyIntents(state);
    if (action.reducer === 'resolveEnemyPhase') return resolveEnemyPhase(state);
    if (action.reducer === 'applyReaction') return applyReaction(state, action.choice);
    if (action.reducer === 'applyTerrainTick') return applyTerrainTick(state);
    if (action.reducer === 'evaluateObjectives') return evaluateObjectives(state, action.objectiveEvent);
    if (action.reducer === 'recordBossPhaseTelemetry') return recordBossPhaseTelemetry(state, action.bossPhase);
    if (action.reducer === 'recordTelemetryHook') return recordTelemetryHook(state, action.type, action.detail);
    throw new Error(`Unknown reducer ${action.reducer}`);
  }, initialState);
}

