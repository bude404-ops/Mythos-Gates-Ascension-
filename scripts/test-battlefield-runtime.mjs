import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  PHASES,
  createBattlefieldRuntimeState,
  buildBattlefieldTerrain,
  createBattlefieldObjectives,
  createBattlefieldEnemyRoster,
  applyBattlefieldAction,
  applyBattlefieldInteraction,
  endBattlefieldRound,
  advanceBattlefieldBossPhase,
  summarizeBattlefieldRuntime,
  runBattlefieldScript
} from '../game/battlefield-runtime.mjs';

const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const verticalSlice = read('data/battlefield-vertical-slice.json');
const architecture = read('data/battlefield-runtime-architecture.json');
const qualityGate = read('data/battlefield-quality-gate.json');
const titans = read('data/titans.json');
const creatures = read('data/creatures.json');
const tasks = read('data/development-tasks.json');

assert.equal(verticalSlice.id, 'TG-BATTLEFIELD-VS-001');
assert.ok(architecture.runtimeRules.some(rule => rule.includes('No battlefield hardcoded as a one-off')));
assert.ok(verticalSlice.qualityTargets.includes('one active Titan'));
assert.ok(verticalSlice.qualityTargets.includes('49 meaningful spaces'));
assert.ok(verticalSlice.qualityTargets.includes('boss phases'));
assert.ok(verticalSlice.qualityTargets.includes('mobile bottom action bar'));
assert.ok(qualityGate.id === 'TG-BATTLEFIELD-QUALITY-GATE-001');

const titan = titans.find(t => t.id === verticalSlice.canonDecision.starterTitan || t.id === 'TG-TITAN-001');
assert.equal(titan.id, 'TG-TITAN-001');

const terrain = buildBattlefieldTerrain(verticalSlice);
assert.equal(terrain.grid.width, 7);
assert.equal(terrain.grid.height, 7);
assert.equal(terrain.spaces.length, 49);
assert.equal(new Set(terrain.spaces.map(s => s.id)).size, 49);
for (const zoneId of ['entry','open','choke','terrain','objective','elite','boss']) {
  assert.ok(terrain.spaces.some(space => space.zoneId === zoneId), `missing zone ${zoneId}`);
}
assert.ok(terrain.spaces.some(space => space.hazard === 'SOLAR_JUDGMENT'));
assert.ok(terrain.spaces.some(space => space.hazard === 'GATE_PRESSURE'));
assert.ok(terrain.spaces.some(space => space.cover === 'FRACTURED_COVER'));

const objectives = createBattlefieldObjectives(verticalSlice);
assert.equal(objectives.filter(o => o.primary).length, 2);
assert.ok(objectives.some(o => o.optional && o.id === 'read_memory_obelisk'));
assert.ok(objectives.some(o => o.boss && o.requiredProgress === 5));

const roster = createBattlefieldEnemyRoster({ creatures });
assert.equal(roster.length, 7);
assert.ok(roster.some(enemy => enemy.name === 'The First Gate Colossus'));
assert.ok(roster.every(enemy => enemy.stats.hp > 0 && enemy.stats.damage > 0));

let state = createBattlefieldRuntimeState({ verticalSlice, titan, creatures, seed: 29029 });
assert.equal(state.battlefield.activeTitanLimit, 1);
assert.equal(state.terrain.spaces.length, 49);
assert.equal(state.titan.id, 'TG-TITAN-001');
assert.equal(state.enemies.length, 7);
assert.equal(state.battlefield.mobileBottomActionBar, true);
assert.deepEqual(state.battlefield.routeTypes.sort(), ['direct','optional','safe','tactical'].sort());

state = applyBattlefieldAction(state, { type: 'MOVE', to: { x: 3, y: 2 } });
state = applyBattlefieldInteraction(state, { type: 'DESTROY_PYLON' });
assert.equal(state.battlefield.pylonWallDestroyed, true);
state = applyBattlefieldAction(state, { type: 'MOVE', to: { x: 3, y: 4 } });
state = applyBattlefieldInteraction(state, { type: 'STABILIZE_SEAL' });
state = applyBattlefieldInteraction(state, { type: 'STABILIZE_SEAL', force: true });
state = applyBattlefieldInteraction(state, { type: 'STABILIZE_SEAL', force: true });
assert.equal(state.battlefield.sealsStable, 3);
assert.equal(state.objectives.find(o => o.id === 'stabilize_solar_seals').status, 'COMPLETE');
assert.ok(state.resources.divinity >= 10);
assert.ok(state.eventLog.filter(row => row.type === 'BATTLEFIELD_SEAL_STABILIZED').length >= 3);

state = applyBattlefieldInteraction(state, { type: 'READ_MEMORY_OBELISK' });
assert.equal(state.battlefield.memoryObeliskRead, true);
assert.equal(state.objectives.find(o => o.id === 'read_memory_obelisk').status, 'COMPLETE');

const boss = state.enemies.find(e => e.boss);
assert.ok(boss);
boss.hp = Math.ceil(boss.maxHp * 0.62);
state = advanceBattlefieldBossPhase(state, 'test_phase_progression');
assert.ok(state.eventLog.some(row => row.type === 'BOSS_PHASE_REACHED'));
assert.ok(state.battlefield.gatePressure >= 1);

state.phase = PHASES.PLAYER;
state = endBattlefieldRound(state, 'DECLINE');
assert.equal(state.phase, PHASES.PLAYER);
assert.ok(state.round >= 2);

const summary = summarizeBattlefieldRuntime(state);
assert.equal(summary.activeTitanLimit, 1);
assert.equal(summary.spaces, 49);
assert.equal(summary.routes, 4);
assert.equal(summary.sealsStable, 3);
assert.equal(summary.qualityTargetsMet.oneActiveTitan, true);
assert.equal(summary.qualityTargetsMet.spaces49, true);
assert.equal(summary.qualityTargetsMet.multipleRoutes, true);
assert.equal(summary.qualityTargetsMet.interactiveTerrain, true);
assert.equal(summary.qualityTargetsMet.objectiveAndOptional, true);
assert.equal(summary.qualityTargetsMet.mobileBottomActionBar, true);
assert.equal(summary.qualityTargetsMet.cameraModes, true);
assert.ok(summary.completedObjectives.includes('stabilize_solar_seals'));
assert.ok(summary.completedObjectives.includes('read_memory_obelisk'));
assert.ok(summary.replayabilityScore >= 0 && summary.replayabilityScore <= 100);

const script = [
  { reducer: 'applyBattlefieldAction', action: { type: 'MOVE', to: { x: 3, y: 2 } } },
  { reducer: 'applyBattlefieldInteraction', interaction: { type: 'DESTROY_PYLON' } },
  { reducer: 'applyBattlefieldAction', action: { type: 'MOVE', to: { x: 3, y: 4 } } },
  { reducer: 'applyBattlefieldInteraction', interaction: { type: 'STABILIZE_SEAL' } },
  { reducer: 'applyBattlefieldInteraction', interaction: { type: 'STABILIZE_SEAL', force: true } },
  { reducer: 'applyBattlefieldInteraction', interaction: { type: 'READ_MEMORY_OBELISK' } },
  { reducer: 'advanceBattlefieldBossPhase', reason: 'deterministic_script' },
  { reducer: 'endBattlefieldRound', reactionChoice: 'DECLINE' }
];
const scriptedA = runBattlefieldScript(createBattlefieldRuntimeState({ verticalSlice, titan, creatures, seed: 77 }), script);
const scriptedB = runBattlefieldScript(createBattlefieldRuntimeState({ verticalSlice, titan, creatures, seed: 77 }), script);
assert.deepEqual(summarizeBattlefieldRuntime(scriptedA), summarizeBattlefieldRuntime(scriptedB));
assert.equal(tasks.find(task => task.id === 'TG-DEV-029').status, 'COMPLETED');

console.log(JSON.stringify({ ok: true, battlefieldRuntime: 'PASS', summary }, null, 2));
