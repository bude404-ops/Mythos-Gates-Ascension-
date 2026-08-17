import { validateContract } from '../src/data-loaders/schema-contracts.mjs';
import { readJson, validateCrossFactionCreaturePools, summarizeCrossFactionRunIns } from '../src/lore/cross-faction-run-ins.mjs';

const data = {
  factions: readJson('data/factions.json'),
  creatures: readJson('data/creatures.json'),
  pools: readJson('data/cross-faction-encounter-pools.json'),
  missions: readJson('data/mission-registry.json'),
  campaigns: readJson('data/campaigns.json')
};
const poolSchema = readJson('schemas/cross-faction-encounter-pool.schema.json');
const issues = [
  ...data.pools.flatMap(pool => validateContract(pool, poolSchema, pool.id).issues),
  ...validateCrossFactionCreaturePools(data).issues
];
const result = { ok: issues.length === 0, missionCampaignLoreRunIns: issues.length === 0 ? 'PASS' : 'FAIL', summary: summarizeCrossFactionRunIns(data), issues };
console.log(JSON.stringify(result, null, 2));
if (issues.length) process.exit(1);
