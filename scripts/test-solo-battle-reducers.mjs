import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  PHASES,
  createInitialSoloBattleState,
  applyTitanAction,
  revealEnemyIntents,
  resolveEnemyPhase,
  applyReaction,
  applyTerrainTick,
  evaluateObjectives,
  runReducerScript
} from '../game/solo-battle-engine.mjs';
import { resolveMissionScaling, scaleEnemyForMission, createBattleState as createBrowserBattleState } from '../game/browser-battle-engine.mjs';

const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const titans = read('data/titans.json');
const creatures = read('data/creatures.json');
const schema = read('data/solo-battle-state-schema.json');
const titan = titans.find(t => t.id === schema.verticalSliceDefault.starterTitanId);
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

let state = createInitialSoloBattleState({ battleId: schema.verticalSliceDefault.battleId, missionId: schema.verticalSliceDefault.missionId, titan: titan, enemies: enemyRoster, terrain, objectives, seed: 777 });
assert.equal(state.phase, PHASES.PLAYER);
assert.equal(state.titan.id, 'TG-TITAN-001');
assert.equal(state.enemies.length, 3);
assert.equal(state.resources.momentum, 0);

state = applyTitanAction(state, { type: 'MOVE', to: { x: 2, y: 1 } });
assert.equal(state.resources.momentum, 8, 'illuminated movement should build Momentum');
state = applyTitanAction(state, { type: 'FOCUS' });
state = applyTitanAction(state, { type: 'FOCUS' });
assert.equal(state.resources.divinity, 8, 'Focus should build Divinity without ending the turn');
state = revealEnemyIntents(state);
assert.equal(state.telemetry.enemyTelegraphs, 3);
state = resolveEnemyPhase(state);
assert.equal(state.phase, PHASES.ENEMY, 'first distant enemy advances without reaction');
state = resolveEnemyPhase(state);
assert.equal(state.phase, PHASES.ENEMY, 'second distant enemy advances without reaction');
state = resolveEnemyPhase(state);
assert.equal(state.phase, PHASES.ENEMY, 'third distant enemy advances without reaction');
state = resolveEnemyPhase(state);
assert.equal(state.phase, PHASES.TERRAIN, 'enemy phase closes after all telegraphed advances resolve');
state = applyTerrainTick(state);
state = evaluateObjectives(state);
assert.equal(state.phase, PHASES.PLAYER, 'terrain and objective evaluation advance the round');
state = applyTitanAction(state, { type: 'MOVE', to: { x: 3, y: 1 } });
state = applyTitanAction(state, { type: 'FOCUS' });
state = revealEnemyIntents(state);
state = resolveEnemyPhase(state);
assert.equal(state.phase, PHASES.REACTION, 'adjacent enemy opens reaction on the next intent reveal');
assert.ok(state.reactionWindow);
const beforeMomentum = state.resources.momentum;
state = applyReaction(state, 'RESOLVE');
assert.equal(state.phase, PHASES.ENEMY);
assert.ok(state.resources.momentum >= beforeMomentum - 14, 'reaction spend and gain are clamped and logged');
state = resolveEnemyPhase(state);
if (state.phase !== PHASES.REACTION) {
  state = applyTerrainTick(state);
  state = evaluateObjectives(state);
  state = revealEnemyIntents(state);
  state = resolveEnemyPhase(state);
}
assert.equal(state.phase, PHASES.REACTION, 'decline path requires a live reaction window');
state = applyReaction(state, 'DECLINE');
assert.ok(state.telemetry.damageTaken > 0, 'declined reaction causes mitigated damage');
state = applyTerrainTick(state);
state = evaluateObjectives(state, { objectiveId: 'stabilize_solar_seals', progress: 2, momentum: 12, divinity: 12 });
assert.equal(state.objectives[0].status, 'COMPLETE');
assert.equal(state.phase, PHASES.PLAYER);

const scripted = runReducerScript(createInitialSoloBattleState({ battleId: 'DETERMINISM-A', missionId: 'TG-BATTLEFIELD-VS-001', titan: titan, enemies: enemyRoster, terrain, objectives, seed: 42 }), [
  { reducer: 'applyTitanAction', action: { type: 'MOVE', to: { x: 2, y: 1 } } },
  { reducer: 'applyTitanAction', action: { type: 'FOCUS' } },
  { reducer: 'evaluateObjectives', objectiveEvent: { objectiveId: 'destroy_hollow_anchor', progress: 1 } }
]);
const scriptedAgain = runReducerScript(createInitialSoloBattleState({ battleId: 'DETERMINISM-A', missionId: 'TG-BATTLEFIELD-VS-001', titan: titan, enemies: enemyRoster, terrain, objectives, seed: 42 }), [
  { reducer: 'applyTitanAction', action: { type: 'MOVE', to: { x: 2, y: 1 } } },
  { reducer: 'applyTitanAction', action: { type: 'FOCUS' } },
  { reducer: 'evaluateObjectives', objectiveEvent: { objectiveId: 'destroy_hollow_anchor', progress: 1 } }
]);
assert.deepEqual(scripted, scriptedAgain, 'reducer script must be deterministic');
assert.ok(scripted.resources.momentum <= 100 && scripted.resources.divinity <= 100);
const normalScaling = resolveMissionScaling({ mission:{ id:'TG-SCALE-NORMAL', recommendedPower:135, campaignType:'Normal' } });
const eliteScaling = resolveMissionScaling({ mission:{ id:'TG-SCALE-ELITE', recommendedPower:1020, campaignType:'Elite' } });
assert.equal(normalScaling.tier, 'NORMAL');
assert.equal(eliteScaling.tier, 'ELITE');
assert.ok(normalScaling.powerScalar <= 1.12, 'normal campaign scaling must stay capped');
assert.ok(eliteScaling.powerScalar <= 1.22, 'elite campaign scaling must stay capped');
const scaledSwarm = scaleEnemyForMission(enemyRoster[0], normalScaling, 0);
const scaledBrute = scaleEnemyForMission(enemyRoster.find(e=>e.combatRole==='BRUTE') || enemyRoster[2], normalScaling, 2);
assert.equal(scaledSwarm.scalingProfile.tier, 'NORMAL');
assert.ok(scaledBrute.scalingProfile.threatBudget >= scaledSwarm.scalingProfile.threatBudget, 'brute should carry higher threat budget than swarmer');
const browserBattle = createBrowserBattleState({ battleId:'SCALING-SMOKE', missionId:'TG-SCALE-NORMAL', titan: titan, enemies:enemyRoster, terrain, objectives, scaling:normalScaling });
assert.equal(browserBattle.telemetry.enemyScaling.tier, 'NORMAL');
assert.ok(browserBattle.telemetry.enemyScaling.threatBudget > 0);
assert.ok(browserBattle.enemies.every(e=>e.scalingProfile?.powerScalar === normalScaling.powerScalar));
console.log(JSON.stringify({ ok: true, soloBattleReducers: 'PASS', events: state.eventLog.length + scripted.eventLog.length, finalPhase: state.phase, telemetry: state.telemetry, enemyScaling: browserBattle.telemetry.enemyScaling }, null, 2));
