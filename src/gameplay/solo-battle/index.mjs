export {
  PHASES,
  STANCES,
  recordTelemetryHook,
  createInitialSoloBattleState,
  applyDeityAction,
  revealEnemyIntents,
  resolveEnemyPhase,
  applyReaction,
  applyTerrainTick,
  evaluateObjectives,
  runReducerScript
} from '../../../game/solo-battle-engine.mjs';

import fs from 'node:fs';
import { createInitialSoloBattleState } from '../../../game/solo-battle-engine.mjs';

const readJson = path => JSON.parse(fs.readFileSync(path, 'utf8'));

export function createVerticalSliceBattleState({ seed = 777 } = {}) {
  const deitys = readJson('data/deitys.json');
  const creatures = readJson('data/creatures.json');
  const schema = readJson('data/solo-battle-state-schema.json');
  const deity = deitys.find(t => t.id === schema.verticalSliceDefault.starterDeityId);
  const enemies = schema.verticalSliceDefault.starterEnemies.map(id => creatures.find(c => c.id === id));
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
  return createInitialSoloBattleState({
    battleId: schema.verticalSliceDefault.battleId,
    missionId: schema.verticalSliceDefault.missionId,
    deity,
    enemies,
    terrain,
    objectives,
    seed
  });
}
