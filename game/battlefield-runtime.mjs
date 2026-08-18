import {
// Combat Contract: ONE_PLAYER_CONTROLLED_TITAN_PER_BATTLE
// See: data/one-deity-vs-many-combat.json
// 7x7 grid, 6 tactical zones, 1 deity vs many enemies, 11-turn limit, 3 Solar Seals.
  PHASES,
  STANCES,
  createInitialSoloBattleState,
  applyDeityAction,
  revealEnemyIntents,
  resolveEnemyPhase,
  applyReaction,
  applyTerrainTick,
  evaluateObjectives,
  recordBossPhaseTelemetry,
  recordTelemetryHook,
  summarizeBattlefieldTelemetry,
  runReducerScript
} from './solo-battle-engine.mjs';

const clone = value => JSON.parse(JSON.stringify(value));
const key = position => `${position.x},${position.y}`;
const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const TURN_LIMIT = 11;

const ZONE_TYPES = Object.freeze({
  entry: 'BROKEN_THRESHOLD',
  open: 'SUN_CRACKED_CAUSEWAY',
  choke: 'FALLEN_PYLON_CHOKE',
  terrain: 'JUDGMENT_RAY_LANE',
  objective: 'SOLAR_SEAL_COURT',
  elite: 'ANCHOR_SCAR',
  boss: 'GATE_MOUTH_ARENA'
});

const DEFAULT_ENEMY_BINDINGS = Object.freeze([
  // M01 W1: Gateborn Colossus + Beast-Realm Maneater at opposing gate markers
  { slot: 'gateborn_colossus', creatureId: 'TG-CREATURE-002', position: { x: 6, y: 6 }, encounter: 1, role: 'BRUTE', wave: 1, boss: true },
  { slot: 'beast_realm_maneater', creatureId: 'TG-CREATURE-003', position: { x: 4, y: 7 }, encounter: 1, role: 'EXECUTIONER', wave: 1 },
  { slot: 'hollow_wretch_1', creatureId: 'TG-CREATURE-001', position: { x: 5, y: 5 }, encounter: 1, role: 'SWARMER', wave: 1 },
  { slot: 'hollow_wretch_2', creatureId: 'TG-CREATURE-001', position: { x: 3, y: 6 }, encounter: 1, role: 'SWARMER', wave: 1 },
  { slot: 'hollow_choirling', creatureId: 'TG-CREATURE-006', position: { x: 6, y: 4 }, encounter: 1, role: 'DISRUPTOR', wave: 1 },
  // M01 W2: Beast-Realm Maneater reinforcement from shadowed lane (trigger: turn 3 or objective touched)
  { slot: 'maneater_reinforcement', creatureId: 'TG-CREATURE-003', position: { x: 2, y: 5 }, encounter: 2, role: 'EXECUTIONER', wave: 2, reinforcement: true },
  { slot: 'standard_bearer', creatureId: 'TG-CREATURE-004', position: { x: 5, y: 7 }, encounter: 2, role: 'GUARDIAN', wave: 2, reinforcement: true }
]);

export const BATTLEFIELD_ACTIONS = Object.freeze({
  MOVE: 'MOVE',
  BASIC_ATTACK: 'BASIC_ATTACK',
  TECHNIQUE: 'TECHNIQUE',
  FOCUS: 'FOCUS',
  STANCE_SHIFT: 'STANCE_SHIFT',
  SIGNATURE: 'SIGNATURE',
  DIVINE_ASCENSION: 'DIVINE_ASCENSION',
  EXECUTE: 'EXECUTE',
  INTERACT: 'INTERACT',
  END_ROUND: 'END_ROUND'
});

function parseSpaceId(spaceId) {
  const match = String(spaceId).match(/^([A-G])(\d)$/);
  if (!match) throw new Error(`Invalid battlefield space ${spaceId}`);
  return { x: match[1].charCodeAt(0) - 64, y: Number(match[2]) };
}

function toSpaceId(position) {
  return `${String.fromCharCode(64 + position.x)}${position.y}`;
}

function buildZoneLookup(verticalSlice) {
  const lookup = new Map();
  for (const zone of verticalSlice.zones || []) {
    for (const spaceId of zone.spaces || []) lookup.set(spaceId, zone);
  }
  return lookup;
}

export function buildBattlefieldTerrain(verticalSlice) {
  const lookup = buildZoneLookup(verticalSlice);
  const spaces = [];
  for (let y = 1; y <= 7; y += 1) {
    for (let x = 1; x <= 7; x += 1) {
      const id = toSpaceId({ x, y });
      const zone = lookup.get(id) || { id: 'neutral', name: 'Fractured Approach' };
      const terrainType = ZONE_TYPES[zone.id] || 'FRACTURED_APPROACH';
      const judgmentLane = zone.id === 'terrain';
      const objectiveCourt = zone.id === 'objective';
      const sunlit = zone.id === 'open' || zone.id === 'terrain' || objectiveCourt;
      spaces.push({
        id,
        position: { x, y },
        zoneId: zone.id,
        zoneName: zone.name,
        type: terrainType,
        illuminated: sunlit,
        hazard: judgmentLane ? 'SOLAR_JUDGMENT' : zone.id === 'boss' ? 'GATE_PRESSURE' : null,
        cover: zone.id === 'entry' || zone.id === 'choke' ? 'FRACTURED_COVER' : null,
        scaleClass: zone.id === 'boss' ? 'COLOSSAL_BOSS_ARENA' : 'TITAN_TACTICAL_SPACE'
      });
    }
  }
  return { grid: { width: 7, height: 7 }, spaces };
}

export function createBattlefieldObjectives(verticalSlice) {
  const sealInteractables = (verticalSlice.interactables || []).filter(i => /^solar_seal_/.test(i.id));
  return [
    {
      id: 'stabilize_solar_seals',
      label: 'Stabilize the three Solar Seals',
      progress: 0,
      requiredProgress: sealInteractables.length || 3,
      status: 'ACTIVE',
      primary: true
    },
    {
      id: 'defeat_gateborn_colossus',
      label: 'Defeat the Gateborn Colossus',
      progress: 0,
      requiredProgress: 1,
      status: 'ACTIVE',
      primary: true,
      optional: true
    },
    {
      id: 'read_memory_obelisk',
      label: 'Read the Memory Obelisk',
      progress: 0,
      requiredProgress: 1,
      status: 'ACTIVE',
      optional: true
    },
    // M01 has no boss — victory is stabilizing 3 Solar Seals
    {
      id: 'survive_hollow_pressure',
      label: 'Survive the Hollow Drift until all seals are stable',
      progress: 0,
      requiredProgress: 3,
      status: 'ACTIVE'
    },
    {
      id: 'destroy_hollow_anchor',
      label: 'Destroy the Hollow Anchor (Boss)',
      progress: 0,
      requiredProgress: 5,
      status: 'ACTIVE',
      boss: true,
      required: true
    }
  ];
}

function compactCreature(creature, binding) {
  if (!creature) throw new Error(`Missing creature binding ${binding.creatureId}`);
  const stats = clone(creature.stats || {});
  const bossScalar = binding.role === 'CHAMPION' ? 0.42 : binding.role === 'ELITE' ? 0.45 : 0.34;
  return {
    id: creature.id,
    name: creature.name,
    combatRole: binding.role || creature.combatRole || 'PRESSURE',
    stats: {
      hp: Math.max(10, Math.round((stats.hp || 40) * bossScalar)),
      damage: Math.max(3, Math.round((stats.damage || 8) * (binding.boss ? 0.72 : 0.62))),
      range: binding.role === 'HUNTER' || binding.role === 'DISRUPTOR' ? Math.max(2, stats.range || 2) : Math.max(1, Math.min(2, stats.range || 1)),
      armor: Math.max(1, Math.round((stats.armor || 2) * 0.55)),
      resistance: Math.max(1, Math.round((stats.resistance || 2) * 0.55)),
      movement: Math.max(1, Math.min(3, stats.movement || 2)),
      threatWeight: binding.boss ? 5 : binding.role === 'ELITE' ? 3 : 1
    },
    battlefieldBinding: clone(binding)
  };
}

export function createBattlefieldEnemyRoster({ creatures, bindings = DEFAULT_ENEMY_BINDINGS } = {}) {
  if (!Array.isArray(creatures)) throw new Error('Battlefield runtime requires canonical creature records.');
  return bindings.map(binding => compactCreature(creatures.find(c => c.id === binding.creatureId), binding));
}

function applyEnemyPositions(state, bindings = DEFAULT_ENEMY_BINDINGS) {
  const next = clone(state);
  next.enemies = next.enemies.map((enemy, index) => {
    const binding = bindings[index] || DEFAULT_ENEMY_BINDINGS[index];
    return {
      ...enemy,
      instanceId: `${binding.slot}-${enemy.id}`,
      position: clone(binding.position),
      encounter: binding.encounter,
      battlefieldSlot: binding.slot,
      boss: binding.boss || false,
      phaseIndex: null,
    };
  });
  return next;
}

export function createBattlefieldRuntimeState({ verticalSlice, deity, creatures, seed = 20260813, difficulty = 'Normal' }) {
  if (!verticalSlice?.id) throw new Error('Battlefield runtime requires the vertical slice contract.');
  if (!titan?.id) throw new Error('Battlefield runtime requires one active deity.');
  const terrain = buildBattlefieldTerrain(verticalSlice);
  const objectives = createBattlefieldObjectives(verticalSlice);
  const enemies = createBattlefieldEnemyRoster({ creatures });
  let state = createInitialSoloBattleState({
    battleId: verticalSlice.id,
    missionId: 'TG-BATTLEFIELD-FIRST-REOPENING-GATE',
    deity,
    enemies,
    terrain,
    objectives,
    seed
  });
  state = applyEnemyPositions(state);
  state.deity.position = { x: 2, y: 2 };
  state.turnLimit = TURN_LIMIT;
  state.battlefield = {
    title: verticalSlice.title,
    difficulty,
    activeDeityLimit: 1,
    routeTypes: (verticalSlice.routes || []).map(r => r.type),
    cameraMode: 'TACTICAL',
    gatePressure: 0,
    sealsStable: 0,
    pylonWallDestroyed: false,
    memoryObeliskRead: false,
    bossId: null,
    qualityTargets: clone(verticalSlice.qualityTargets || []),
    mobileBottomActionBar: true
  };
  state.telemetry.battlefieldQuality = {
    spaces: terrain.spaces.length,
    routes: state.battlefield.routeTypes.length,
    activeDeityLimit: 1,
    contextualActions: ['Move', 'Strike', 'Verdict', 'React', 'Interact', 'End'],
    cameraModes: ['TACTICAL', 'CINEMATIC', 'BOSS_FOCUS']
  };
  state = recordTelemetryHook(state, 'BATTLEFIELD_BOOT', {
    title: verticalSlice.title,
    spaces: terrain.spaces.length,
    difficulty,
    activeDeity: deity.id
  });
  return state;
}

function nearbyObjectiveSpace(state) {
  return state.terrain.spaces.find(space => space.zoneId === 'objective' && distance(space.position, state.deity.position) <= 2);
}

function getObjective(state, objectiveId) {
  const objective = state.objectives.find(o => o.id === objectiveId);
  if (!objective) throw new Error(`Unknown battlefield objective ${objectiveId}`);
  return objective;
}

function markObjectiveProgress(state, objectiveId, options = {}) {
  const objective = getObjective(state, objectiveId);
  if (objective.status === 'COMPLETE') return state;
  return evaluateObjectives(state, {
    objectiveId,
    progress: options.progress || 1,
    momentum: options.momentum ?? 10,
    divinity: options.divinity ?? 8
  });
}

function completeObjectiveInPlayerPhase(input, objectiveId, detail = {}) {
  let state = clone(input);
  state.phase = PHASES.OBJECTIVE;
  state = markObjectiveProgress(state, objectiveId, detail);
  if (state.phase !== PHASES.PLAYER && state.phase !== PHASES.VICTORY && state.phase !== PHASES.DEFEAT) {
    state.phase = PHASES.PLAYER;
  }
  return state;
}

export function applyBattlefieldInteraction(input, interaction) {
  let state = clone(input);
  if (state.phase !== PHASES.PLAYER) throw new Error(`Battlefield interaction blocked during ${state.phase}`);
  const kind = String(interaction?.type || '').toUpperCase();
  if (kind === 'STABILIZE_SEAL') {
    const sealSpace = nearbyObjectiveSpace(state);
    if (!sealSpace && !interaction.force) throw new Error('Solar Seal interaction requires objective court range.');
    state.battlefield.sealsStable = Math.min(3, (state.battlefield.sealsStable || 0) + 1);
    state.battlefield.gatePressure = Math.max(0, (state.battlefield.gatePressure || 0) - 1);
    state = completeObjectiveInPlayerPhase(state, 'stabilize_solar_seals', { progress: 1, momentum: 12, divinity: 10 });
    state = recordTelemetryHook(state, 'BATTLEFIELD_SEAL_STABILIZED', { sealsStable: state.battlefield.sealsStable, gatePressure: state.battlefield.gatePressure });
    return state;
  }
  if (kind === 'READ_MEMORY_OBELISK') {
    state.battlefield.memoryObeliskRead = true;
    state = completeObjectiveInPlayerPhase(state, 'read_memory_obelisk', { progress: 1, momentum: 6, divinity: 4 });
    state = recordTelemetryHook(state, 'BATTLEFIELD_CODEX_UNLOCKED', { codex: 'Codex: First Reopening Gate', masteryXp: 15 });
    return state;
  }
  if (kind === 'DESTROY_PYLON') {
    state.battlefield.pylonWallDestroyed = true;
    state.resources.momentum = Math.min(100, state.resources.momentum + 8);
    state = recordTelemetryHook(state, 'BATTLEFIELD_PYLON_DESTROYED', { route: 'direct', reinforcementTelegraphed: true });
    return state;
  }
  throw new Error(`Unknown battlefield interaction ${interaction?.type}`);
}

function bossEnemy(state) {
  return state.enemies.find(enemy => enemy.boss || enemy.instanceId === state.battlefield?.bossId || enemy.name === 'The First Gate Colossus');
}

export function advanceBattlefieldBossPhase(input, reason = 'runtime_tick') {
  let state = clone(input);
  const boss = bossEnemy(state);
  if (!boss || boss.hp <= 0) return state;
  const missingSeals = 3 - Math.min(3, state.battlefield?.sealsStable || 0);
  state.battlefield.gatePressure = Math.min(9, (state.battlefield.gatePressure || 0) + Math.max(1, missingSeals));
  const phaseIndex = Math.min(5, Math.max(1, 6 - Math.ceil((boss.hp / Math.max(1, boss.maxHp)) * 5)));
  if (phaseIndex !== boss.phaseIndex) {
    boss.phaseIndex = phaseIndex;
    state.battlefield.cameraMode = 'BOSS_FOCUS';
    state = recordBossPhaseTelemetry(state, { bossId: boss.instanceId, phaseIndex, status: 'REACHED', reason });
  } else {
    state = recordTelemetryHook(state, 'BATTLEFIELD_GATE_PRESSURE', { gatePressure: state.battlefield.gatePressure, missingSeals, reason });
  }
  return state;
}

function maybeProgressCombatObjectives(input, before) {
  let state = clone(input);
  const beforeEnemies = new Map((before.enemies || []).map(enemy => [enemy.instanceId, enemy]));
  // M01: track Gateborn Colossus defeat as optional objective
  const gateborn = state.enemies.find(enemy => enemy.battlefieldSlot === 'gateborn_colossus');
  const oldGateborn = beforeEnemies.get(gateborn?.instanceId);
  if (gateborn && gateborn.hp <= 0 && oldGateborn?.hp > 0) {
    state = completeObjectiveInPlayerPhase(state, 'defeat_gateborn_colossus', { progress: 1, momentum: 14, divinity: 8 });
    state = recordTelemetryHook(state, 'BATTLEFIELD_ELITE_DEFEATED', { enemy: gateborn.instanceId, slot: 'gateborn_colossus' });
  }
  return state;
}

export function applyBattlefieldAction(input, action) {
  const before = clone(input);
  let state = clone(input);
  const type = String(action?.type || '').toUpperCase();
  if (type === BATTLEFIELD_ACTIONS.INTERACT) return applyBattlefieldInteraction(state, action.interaction || action);
  if (type === BATTLEFIELD_ACTIONS.END_ROUND) return endBattlefieldRound(state);
  state = applyDeityAction(state, action);
  state = maybeProgressCombatObjectives(state, before);
  if (state.phase === PHASES.OBJECTIVE) state.phase = PHASES.PLAYER;
  return state;
}

export function endBattlefieldRound(input, reactionChoice = 'DECLINE') {
  let state = clone(input);
  if (state.phase === PHASES.PLAYER) state = revealEnemyIntents(state);
  let guard = 0;
  while (state.phase === PHASES.ENEMY && guard < 20) {
    state = resolveEnemyPhase(state);
    if (state.phase === PHASES.REACTION) state = applyReaction(state, reactionChoice);
    guard += 1;
  }
  if (state.phase === PHASES.TERRAIN || state.phase === PHASES.ENEMY) state = applyTerrainTick(state);
  state = advanceBattlefieldBossPhase(state, 'end_round');
  if (state.phase === PHASES.TERRAIN) state = evaluateObjectives(state);
  if (state.phase !== PHASES.VICTORY && state.phase !== PHASES.DEFEAT) {
    state.phase = PHASES.PLAYER;
    state.round += 1;
    state.telemetry.turns = state.round;
    state.deity.actionsTakenThisRound = [];
    state.battlefield.cameraMode = 'TACTICAL';
    state = recordTelemetryHook(state, 'BATTLEFIELD_ROUND_READY', { round: state.round, gatePressure: state.battlefield.gatePressure });
  }
  return state;
}

export function summarizeBattlefieldRuntime(state) {
  const summary = summarizeBattlefieldTelemetry(state);
  const completed = (state.objectives || []).filter(o => o.status === 'COMPLETE').map(o => o.id);
  return {
    ...summary,
    battlefieldTitle: state.battlefield?.title,
    activeDeityLimit: state.battlefield?.activeDeityLimit,
    spaces: state.terrain?.spaces?.length || 0,
    routes: state.battlefield?.routeTypes?.length || 0,
    sealsStable: state.battlefield?.sealsStable || 0,
    gatePressure: state.battlefield?.gatePressure || 0,
    cameraMode: state.battlefield?.cameraMode,
    completedObjectives: completed,
    bossPhase: bossEnemy(state)?.phaseIndex || 0,
    bossRemainingHp: bossEnemy(state)?.hp ?? 0,
    qualityTargetsMet: {
      oneActiveDeity: state.battlefield?.activeDeityLimit === 1,
      spaces49: (state.terrain?.spaces || []).length === 49,
      multipleRoutes: (state.battlefield?.routeTypes || []).length >= 4,
      interactiveTerrain: Boolean(state.terrain?.spaces?.some(space => space.hazard || space.cover || space.illuminated)),
      objectiveAndOptional: state.objectives?.some(o => o.primary) && state.objectives?.some(o => o.optional),
      bossPhases: Boolean(bossEnemy(state)?.phaseIndex >= 1),
      mobileBottomActionBar: state.battlefield?.mobileBottomActionBar === true,
      cameraModes: Array.isArray(state.telemetry?.battlefieldQuality?.cameraModes) && state.telemetry.battlefieldQuality.cameraModes.length >= 3
    }
  };
}

export function runBattlefieldScript(initialState, actions) {
  return actions.reduce((state, action) => {
    if (action.reducer === 'applyBattlefieldAction') return applyBattlefieldAction(state, action.action);
    if (action.reducer === 'applyBattlefieldInteraction') return applyBattlefieldInteraction(state, action.interaction);
    if (action.reducer === 'endBattlefieldRound') return endBattlefieldRound(state, action.reactionChoice);
    if (action.reducer === 'advanceBattlefieldBossPhase') return advanceBattlefieldBossPhase(state, action.reason);
    return runReducerScript(state, [action]);
  }, initialState);
}

export { PHASES, STANCES, DEFAULT_ENEMY_BINDINGS, TURN_LIMIT };
