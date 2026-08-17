import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  PHASES,
  STANCES,
  createBattleState,
  applyDeityAction,
  revealEnemyIntents,
  resolveEnemyPhase,
  applyReaction,
  evaluateObjectives,
  resolveMissionScaling,
  scaleEnemyForMission
} from '../game/browser-battle-engine.mjs';

const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const contract = read('data/creature-behavior-runtime-contract.json');
const creatures = read('data/creatures.json');
const titans = read('data/titans.json');
const tasks = read('data/development-tasks.json');
const hub = read('data/command-hub-contract.json');
const browserEngine = fs.readFileSync('game/browser-battle-engine.mjs', 'utf8');
const hubRuntime = fs.readFileSync('game/command-hub-runtime.mjs', 'utf8');

assert.equal(contract.status, 'IMPLEMENTED');
assert.equal(contract.taskId, 'TG-DEV-008');
assert.equal(tasks.find(task => task.id === 'TG-DEV-008')?.status, 'COMPLETED');
assert.equal(hub.creatureBehaviorRuntime?.status, 'IMPLEMENTED');
assert.deepEqual(hub.creatureBehaviorRuntime?.creatureIds, ['TG-CREATURE-001', 'TG-CREATURE-002']);

const wretch = creatures.find(c => c.id === 'TG-CREATURE-001');
const colossus = creatures.find(c => c.id === 'TG-CREATURE-002');
const deity = titans.find(t => t.id === 'TG-TITAN-001');
assert.ok(wretch && colossus && deity, 'canonical Wretch, Colossus, and starter Deity required');
assert.equal(wretch.combatRole, 'SWARMER');
assert.equal(colossus.combatRole, 'BRUTE');

for (const token of [
  'HOLLOW_SWARMER',
  'GATEBORN_BRUTE',
  'SWARM_RAKE',
  'SWARM_SURROUND',
  'GATE_STOMP',
  'FRACTURE_ROAR',
  'OBJECTIVE_CRUSH',
  'enemyIntentCounts',
  'enemyBehaviorTags',
  'enemyCounterplay',
  'counterplay',
  'behaviorTag'
]) {
  assert.ok(browserEngine.includes(token) || hubRuntime.includes(token), `runtime missing ${token}`);
}

const mission = { id: 'TG-DEV-008-TEST', recommendedPower: 135, campaignType: 'Normal' };
const scaling = resolveMissionScaling({ mission });
const enemies = [wretch, wretch, colossus].map((enemy, index) => scaleEnemyForMission(enemy, scaling, index));
let state = createBattleState({
  battleId: 'TG-DEV-008-BEHAVIOR-SMOKE',
  missionId: mission.id,
  deity,
  enemies,
  objectives: [
    { id: 'stabilize_solar_seal_a', label: 'Stabilize Solar Seal', progress: 1, requiredProgress: 2, status: 'ACTIVE' },
    { id: 'destroy_hollow_anchor', label: 'Destroy Hollow Anchor', progress: 0, requiredProgress: 1, status: 'ACTIVE' }
  ],
  scaling
});

state.deity.position = { x: 3, y: 3 };
state.deity.stance = STANCES.GUARDIAN;
state.enemies[0].position = { x: 3, y: 4 };
state.enemies[1].position = { x: 4, y: 3 };
state.enemies[2].position = { x: 2, y: 3 };
state.round = 2;

state = revealEnemyIntents(state);
const firstIntentTypes = state.enemies.map(enemy => enemy.intent?.type).filter(Boolean);
assert.ok(firstIntentTypes.includes('SWARM_SURROUND'), 'Wretch pack pressure should produce SWARM_SURROUND on even round');
assert.ok(firstIntentTypes.includes('OBJECTIVE_CRUSH'), 'Colossus should deny active objective progress');
assert.ok(state.telemetry.enemyBehaviorTags.ISOLATION_PUNISH >= 1, 'Wretch isolation behavior tag missing');
assert.ok(state.telemetry.enemyBehaviorTags.OBJECTIVE_DENIAL >= 1, 'Colossus objective behavior tag missing');
assert.ok(state.telemetry.enemyCounterplay.some(text => text.includes('dodge') || text.includes('Dodge')), 'counterplay copy missing dodge guidance');

let reacted = resolveEnemyPhase(state);
assert.equal(reacted.phase, PHASES.REACTION);
assert.ok(reacted.reactionWindow?.consequencePreview.includes('Swarm Pressure'), 'Wretch reaction preview missing behavior label');
assert.ok(reacted.reactionWindow?.cost?.momentum >= 1, 'reaction cost missing');
reacted.resources.momentum = 40;
reacted = applyReaction(reacted, 'RESOLVE');
assert.equal(reacted.phase, PHASES.ENEMY);
assert.ok(reacted.telemetry.reactionSuccesses >= 1, 'resolved reaction not tracked');

let enemyGuard = 0;
while ((reacted.phase === PHASES.ENEMY || reacted.phase === PHASES.REACTION) && enemyGuard++ < 10) {
  if (reacted.phase === PHASES.ENEMY) reacted = resolveEnemyPhase(reacted);
  if (reacted.phase === PHASES.REACTION) reacted = applyReaction(reacted, 'DECLINE');
}
assert.ok(reacted.telemetry.objectiveProgress <= 0, 'objective denial should reduce progress telemetry when OBJECTIVE_CRUSH resolves');
assert.ok(reacted.eventLog.some(row => row.type === 'OBJECTIVE_CRUSH'), 'OBJECTIVE_CRUSH event not logged');

let roarState = createBattleState({ battleId: 'TG-DEV-008-ROAR', missionId: mission.id, deity, enemies: [scaleEnemyForMission(colossus, scaling, 0)], scaling });
roarState.deity.position = { x: 3, y: 3 };
roarState.enemies[0].position = { x: 3, y: 4 };
roarState.round = 3;
roarState.resources.momentum = 30;
roarState = revealEnemyIntents(roarState);
assert.equal(roarState.enemies[0].intent.type, 'FRACTURE_ROAR');
roarState = resolveEnemyPhase(roarState);
assert.ok(roarState.eventLog.some(row => row.type === 'FRACTURE_ROAR'), 'FRACTURE_ROAR event not logged');
assert.ok(roarState.resources.momentum < 30, 'FRACTURE_ROAR should drain Momentum');
assert.equal(roarState.phase, PHASES.REACTION);

let stompState = createBattleState({ battleId: 'TG-DEV-008-STOMP', missionId: mission.id, deity, enemies: [scaleEnemyForMission(colossus, scaling, 0)], scaling });
stompState.deity.position = { x: 3, y: 3 };
stompState.enemies[0].position = { x: 3, y: 4 };
stompState.round = 1;
stompState = revealEnemyIntents(stompState);
assert.equal(stompState.enemies[0].intent.type, 'GATE_STOMP');
assert.equal(stompState.enemies[0].intent.reactionType, 'PARRY');

const uiTokens = ['Counterplay:', 'Threat ', 'behaviorTag', 'e.intent?.reactionType', 'e.aiProfile?.id'];
for (const token of uiTokens) assert.ok(hubRuntime.includes(token), `battle UI missing ${token}`);
for (const token of ['HOLLOW_SWARMER', 'GATEBORN_BRUTE']) assert.ok(browserEngine.includes(token), `battle engine missing ${token}`);

const contractIntents = new Set(contract.implementedCreatures.flatMap(c => c.requiredIntents));
for (const intent of ['SWARM_RAKE', 'SWARM_SURROUND', 'GATE_STOMP', 'FRACTURE_ROAR', 'OBJECTIVE_CRUSH']) assert.ok(contractIntents.has(intent), `contract missing intent ${intent}`);

console.log(JSON.stringify({
  ok: true,
  creatureBehaviorRuntime: 'PASS',
  task: contract.taskId,
  profiles: hub.creatureBehaviorRuntime.runtimeProfiles,
  firstIntentTypes,
  behaviorTags: reacted.telemetry.enemyBehaviorTags,
  counterplayLines: reacted.telemetry.enemyCounterplay.length,
  objectiveAfterCrush: reacted.objectives[0].progress,
  roarMomentumAfter: roarState.resources.momentum,
  stompReaction: stompState.enemies[0].intent.reactionType
}, null, 2));
