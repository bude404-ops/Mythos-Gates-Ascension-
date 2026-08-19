import assert from 'node:assert/strict';
import { soloBattle, economy, platform } from '../src/gameplay/index.mjs';
import { loadSourceDataset, buildContentLookup, validateContract } from '../src/data-loaders/index.mjs';
import { summarizeBattleState, summarizeEconomyState } from '../src/ui/index.mjs';
import { productionGateManifest } from '../src/tools/production-gate-manifest.mjs';
import fs from 'node:fs';

const state = soloBattle.createVerticalSliceBattleState({ seed: 2026 });
assert.equal(state.phase, soloBattle.PHASES.PLAYER);
const summary = summarizeBattleState(state);
assert.equal(summary.deity.id, 'TG-TITAN-001');
assert.equal(summary.enemiesRemaining, 3);

const player = { id: 'TG-QA-PLAYER' };
economy.migratePlayerEconomy(player);
const energy = economy.consumeEnergy(player, 'campaign');
assert.equal(energy.ok, true);
assert.ok(summarizeEconomyState(player).energy.amount < summarizeEconomyState(player).energy.max);

let platformState = platform.createPlatformProfile({ playerId: 'TG-QA-PLAYER', starterDeityId: 'TG-TITAN-003' });
platformState = platform.completeMission(platformState, 'TG-F01-C01-M01', { accountXp: 20, currencies: { sunshards: 10 } });
assert.equal(platform.validatePlatformState(platformState).ok, true);
assert.equal(platform.platformSummary(platformState).completedMissions, 1);

const dataset = loadSourceDataset({ includeMissions: false });
const lookup = buildContentLookup(dataset);
assert.ok(lookup.deityById.has('TG-TITAN-001'));
assert.ok(lookup.creatureById.size >= 1);

const deitySchema = JSON.parse(fs.readFileSync('schemas/deity.schema.json', 'utf8'));
assert.equal(validateContract(dataset.deitys[0], deitySchema, 'firstDeity').ok, true);
assert.ok(productionGateManifest.sourceModules.every(file => fs.existsSync(file)));

console.log(JSON.stringify({ ok: true, productionModuleContract: 'PASS', modules: productionGateManifest.sourceModules.length, deity: summary.deity.id }, null, 2));
