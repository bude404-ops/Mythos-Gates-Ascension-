import assert from 'node:assert/strict';
import { readJson, validateCrossFactionCreaturePools, summarizeCrossFactionRunIns, ONE_TITAN_RULE } from '../src/lore/cross-faction-run-ins.mjs';

const data = {
  factions: readJson('data/factions.json'),
  creatures: readJson('data/creatures.json'),
  pools: readJson('data/cross-faction-encounter-pools.json'),
  missions: readJson('data/mission-registry.json'),
  campaigns: readJson('data/campaigns.json')
};
const validation = validateCrossFactionCreaturePools(data);
assert.equal(validation.ok, true, validation.issues.join('; '));
const summary = summarizeCrossFactionRunIns(data);
assert.equal(summary.factions, 7);
assert.equal(summary.runInPools, 7);
assert.equal(summary.runInCreatures, 21);
assert.equal(summary.missions, 280);
assert.equal(summary.oneTitanMissions, 280);
assert.equal(summary.mobileCampaigns, data.campaigns.length);
for (const mission of data.missions) {
  assert.equal(mission.activeTitanPolicy.standardCombat, ONE_TITAN_RULE);
  assert.equal(mission.crossFactionRunIns.enabled, true);
  assert.ok(mission.crossFactionRunIns.recommendedPoolIds.length >= 2);
}
console.log(JSON.stringify({ ok: true, missionCampaignLoreRunInsContract: 'PASS', summary }, null, 2));
