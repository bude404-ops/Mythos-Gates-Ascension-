import { createInitialSoloBattleState, enterExploration, triggerEncounter, applyTitanAction, 
         revealEnemyIntents, resolveEnemyPhase, applyReaction, applyTerrainTick,
         evaluateObjectives, transitionToNextZone, PHASES, runReducerScript } from '../game/solo-battle-engine.mjs';
import fs from 'node:fs';

const titans = JSON.parse(fs.readFileSync('data/titans.json', 'utf8'));
const creatures = JSON.parse(fs.readFileSync('data/creatures.json', 'utf8'));
const missions = JSON.parse(fs.readFileSync('data/mission-registry.json', 'utf8'));

let passed = 0, failed = 0;
function assert(cond, msg) { if (cond) passed++; else { failed++; console.error(`FAIL: ${msg}`); } }

// 1. EXPLORATION phase
const titan = titans[0];
const mission = missions[0];
let state = createInitialSoloBattleState({
  battleId: 'test-001', missionId: mission.id,
  deity: { id: titan.id, name: titan.name, role: titan.role, stats: titan.stats },
  enemies: [],
  terrain: { spaces: [{ position: {x:1,y:1}, type: 'FLOOR', illuminated: true }] },
  objectives: [{ id: 'obj1', type: 'CLEAR', status: 'PENDING' }],
  seed: 1
});
state = enterExploration(state);
assert(state.phase === PHASES.EXPLORATION, 'Should enter EXPLORATION phase');

// 2. ENCOUNTER trigger
const enemyIds = mission.enemies || [];
const enemyData = enemyIds.map(id => creatures.find(c => c.id === id)).filter(Boolean);
assert(enemyData.length > 0, `Mission should have valid enemies`);
state = triggerEncounter(state, { enemies: enemyData, zoneName: mission.zoneType });
assert(state.phase === PHASES.PLAYER, 'Should enter PLAYER phase after encounter');
assert(state.enemies.length === enemyData.length, 'Enemies populated');

// 3. FOCUS action
state = applyTitanAction(state, { type: 'FOCUS' });
assert(state.resources.momentum > 0, 'FOCUS generates momentum');

// 4. STANCE_SHIFT
state = applyTitanAction(state, { type: 'STANCE_SHIFT', stance: 'ASSAULT' });
assert(state.deity.stance === 'ASSAULT', 'Stance shift to ASSAULT');

// 5. Enemy phase
state = revealEnemyIntents(state);
assert(state.phase === PHASES.ENEMY, 'Enemy phase after intents');

// 6. Resolve enemies
state = resolveEnemyPhase(state);
assert([PHASES.REACTION, PHASES.TERRAIN, PHASES.ENEMY].includes(state.phase), 'Valid phase after enemy resolve');
if (state.phase === PHASES.REACTION) {
  state = applyReaction(state, 'RESOLVE');
}

// 7. Terrain tick
state = applyTerrainTick(state);
assert(state.phase === PHASES.TERRAIN, 'Terrain phase');

// 8. Zone transition (dungeon crawler)
state = transitionToNextZone(state, { nextZoneId: 'TG-F01-C01-M02', rewards: { momentum: 10, divinity: 5, solarCharge: 15 } });
assert(state.phase === PHASES.EXPLORATION, 'EXPLORATION after zone transition');
assert(state.missionId === 'TG-F01-C01-M02', 'Mission updated to next zone');
assert(state.round === 1, 'Round reset on zone transition');

// 9. Full script execution
const state2 = createInitialSoloBattleState({
  battleId: 'test-002', missionId: 'TG-F01-C01-M01',
  deity: { id: titan.id, name: titan.name, role: titan.role, stats: titan.stats },
  enemies: [],
  terrain: { spaces: [{ position: {x:1,y:1}, type: 'FLOOR', illuminated: true }] },
  objectives: [{ id: 'obj1', type: 'CLEAR', status: 'PENDING' }],
  seed: 2
});
try {
  const finalState = runReducerScript(state2, [
    { reducer: 'enterExploration' },
    { reducer: 'triggerEncounter', encounter: { enemies: enemyData, zoneName: 'Test' } },
    { reducer: 'applyTitanAction', action: { type: 'FOCUS' } },
    { reducer: 'applyTitanAction', action: { type: 'STANCE_SHIFT', stance: 'ASSAULT' } },
    { reducer: 'revealEnemyIntents' },
  ]);
  assert(true, 'Script execution succeeds');
  assert(finalState.phase === PHASES.ENEMY, `Enemy phase after script, got ${finalState.phase}`);
} catch (e) {
  assert(false, `Script failed: ${e.message}`);
}

// 10. Mission data integrity
let issues = 0;
for (const m of missions.slice(0, 20)) {
  if (!m.enemies?.length) issues++;
  if (!m.combatType) issues++;
  if (!m.routeType) issues++;
  if (!m.enemyGroup) issues++;
  for (const eid of m.enemies || []) if (!creatures.find(c => c.id === eid)) issues++;
}
assert(issues === 0, `First 20 missions have valid combat data (issues: ${issues})`);

// 11. Boss missions
const bossMissions = missions.filter(m => m.encounterType === 'BOSS');
assert(bossMissions.length > 0, 'Has BOSS missions');
for (const bm of bossMissions.slice(0, 3)) {
  const hasExec = bm.enemies.some(eid => creatures.find(c => c.id === eid)?.combatRole === 'EXECUTIONER');
  assert(hasExec, `Boss ${bm.id} has EXECUTIONER`);
}

// 12. Scaling bands
const bands = {};
for (const m of missions) bands[m.routeType] = (bands[m.routeType] || 0) + 1;
assert(bands['EARLY'] > 0 && bands['MID'] > 0 && bands['LATE'] > 0 && bands['BOSS'] > 0, 'All scaling bands present');

// 13. Dungeon routes wired
const routes = JSON.parse(fs.readFileSync('data/mythos-gates-dungeon-route-registry.json', 'utf8')).routes;
for (const r of routes) {
  assert(r.missionCount > 0, `Route ${r.id} has missions`);
  assert(r.zones.length > 0, `Route ${r.id} has zones`);
}

// 14. Combat contract
const contract = JSON.parse(fs.readFileSync('data/one-deity-vs-many-combat.json', 'utf8'));
assert(contract.primaryRule === 'ONE_PLAYER_CONTROLLED_TITAN_PER_BATTLE', 'Contract primary rule');
assert(contract.enemyGroupDesign.roles.length === 6, '6 enemy roles');
assert(contract.scalingBands.length === 4, '4 scaling bands');

console.log(`\n=== DUNGEON CRAWLER COMBAT TEST ===`);
console.log(`Passed: ${passed} | Failed: ${failed}`);
console.log(`Bands: ${JSON.stringify(bands)} | Boss missions: ${bossMissions.length}`);
console.log(failed === 0 ? 'ALL TESTS PASSED' : 'TESTS FAILED');
process.exit(failed === 0 ? 0 : 1);
