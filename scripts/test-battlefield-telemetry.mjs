import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  createInitialSoloBattleState,
  applyDeityAction,
  revealEnemyIntents,
  resolveEnemyPhase,
  applyReaction,
  applyTerrainTick,
  evaluateObjectives,
  recordBossPhaseTelemetry,
  summarizeBattlefieldTelemetry,
  runReducerScript
} from '../game/solo-battle-engine.mjs';

const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const deitys = read('data/deitys.json');
const creatures = read('data/creatures.json');
const schema = read('data/solo-battle-state-schema.json');
const contract = read('data/battlefield-telemetry-contract.json');
const runtime = read('data/battlefield-runtime-architecture.json');
const balance = read('data/balance-analytics.json');

assert.equal(contract.status, 'IMPLEMENTED');
assert.equal(runtime.telemetryContract, contract.id);
assert.equal(balance.latestTelemetryContractId, contract.id);
for (const family of ['resource','reaction','objective','terrain','boss','replay']) {
  assert.ok(contract.eventFamilies.some(f => f.family === family), `missing telemetry family ${family}`);
}
for (const counter of ['reactionSuccessRate','objectiveCompletionRate','momentumEfficiency','divinityEfficiency','hazardDamageShare','bossPhaseFailPoints','replayabilityScore']) {
  assert.ok(contract.counters[counter], `missing counter ${counter}`);
}

const deity = deitys.find(t => t.id === schema.verticalSliceDefault.starterDeityId);
const enemyRoster = schema.verticalSliceDefault.starterEnemies.map(id => creatures.find(c => c.id === id));
const terrain = {
  grid: { width: 7, height: 7 },
  spaces: Array.from({ length: 49 }, (_, i) => {
    const x = (i % 7) + 1;
    const y = Math.floor(i / 7) + 1;
    return { id: `${x},${y}`, position: { x, y }, type: y >= 4 ? 'GATE_COURT' : 'BROKEN_THRESHOLD', illuminated: x === 2 || x === 3, hazard: x === 3 && y === 1 ? 'SOLAR_JUDGMENT' : null };
  })
};
const objectives = [
  { id: 'stabilize_solar_seals', progress: 0, requiredProgress: 2, status: 'ACTIVE' },
  { id: 'destroy_hollow_anchor', progress: 0, requiredProgress: 1, status: 'ACTIVE' }
];

let state = createInitialSoloBattleState({ battleId: 'MG-TELEMETRY-TEST-001', missionId: 'MG-BATTLEFIELD-VS-001', deity: deity, enemies: enemyRoster, terrain, objectives, seed: 931 });
state = applyDeityAction(state, { type: 'MOVE', to: { x: 2, y: 1 } });
state = applyDeityAction(state, { type: 'FOCUS' });
state = revealEnemyIntents(state);
state = resolveEnemyPhase(state);
state = resolveEnemyPhase(state);
state = resolveEnemyPhase(state);
state = resolveEnemyPhase(state);
state = applyTerrainTick(state);
state = evaluateObjectives(state);
state = applyDeityAction(state, { type: 'MOVE', to: { x: 3, y: 1 } });
state = applyDeityAction(state, { type: 'FOCUS' });
state = revealEnemyIntents(state);
state = resolveEnemyPhase(state);
if (state.phase === 'REACTION_WINDOW') state = applyReaction(state, 'RESOLVE');
state = applyTerrainTick(state);
state = evaluateObjectives(state, { objectiveId: 'stabilize_solar_seals', progress: 2, momentum: 12, divinity: 12 });
state = recordBossPhaseTelemetry(state, { bossId: 'MG-CREATURE-008', phaseIndex: 1, status: 'REACHED', reason: 'test reached' });
state = recordBossPhaseTelemetry(state, { bossId: 'MG-CREATURE-008', phaseIndex: 1, status: 'FAILED', reason: 'gate pressure overflow' });

const summary = summarizeBattlefieldTelemetry(state);
assert.equal(summary.runId, 'MG-TELEMETRY-TEST-001-931');
assert.ok(summary.replayabilityScore >= 0 && summary.replayabilityScore <= 100);
assert.ok(summary.objectiveCompletionRate > 0);
assert.ok(summary.hazardDamageShare >= 0);
assert.ok(summary.bossPhaseFailPoints.some(p => p.phase === 'phase_1'));
assert.ok(state.eventLog.every(row => row.seq && row.family && row.runId));
assert.ok(state.eventLog.some(row => row.type === 'OBJECTIVE_COMPLETE'));

const scriptedA = runReducerScript(createInitialSoloBattleState({ battleId: 'MG-TELEMETRY-DETERMINISM', missionId: 'MG-BATTLEFIELD-VS-001', deity: deity, enemies: enemyRoster, terrain, objectives, seed: 11 }), [
  { reducer: 'applyDeityAction', action: { type: 'MOVE', to: { x: 2, y: 1 } } },
  { reducer: 'applyDeityAction', action: { type: 'FOCUS' } },
  { reducer: 'recordBossPhaseTelemetry', bossPhase: { bossId: 'MG-CREATURE-008', phaseIndex: 2, status: 'CLEARED', reason: 'deterministic clear' } },
  { reducer: 'evaluateObjectives', objectiveEvent: { objectiveId: 'destroy_hollow_anchor', progress: 1 } }
]);
const scriptedB = runReducerScript(createInitialSoloBattleState({ battleId: 'MG-TELEMETRY-DETERMINISM', missionId: 'MG-BATTLEFIELD-VS-001', deity: deity, enemies: enemyRoster, terrain, objectives, seed: 11 }), [
  { reducer: 'applyDeityAction', action: { type: 'MOVE', to: { x: 2, y: 1 } } },
  { reducer: 'applyDeityAction', action: { type: 'FOCUS' } },
  { reducer: 'recordBossPhaseTelemetry', bossPhase: { bossId: 'MG-CREATURE-008', phaseIndex: 2, status: 'CLEARED', reason: 'deterministic clear' } },
  { reducer: 'evaluateObjectives', objectiveEvent: { objectiveId: 'destroy_hollow_anchor', progress: 1 } }
]);
assert.deepEqual(summarizeBattlefieldTelemetry(scriptedA), summarizeBattlefieldTelemetry(scriptedB));

console.log(JSON.stringify({ ok: true, battlefieldTelemetry: 'PASS', events: state.eventLog.length, summary }, null, 2));
