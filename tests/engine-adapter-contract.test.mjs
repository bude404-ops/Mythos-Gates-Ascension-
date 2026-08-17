import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildEngineExportSummary, mapTitanForEngine, mapMissionForEngine } from '../engine/shared/engine-exporter.mjs';
import { loadSourceDataset } from '../src/data-loaders/index.mjs';
import { loadUe5DungeonFramework, loadFirstMissionZoneTemplate } from '../engine/unreal/ue5-dungeon-framework.mjs';
import { loadMobileFirstArchitecture } from '../engine/unreal/mobile-first-architecture.mjs';

const summary = buildEngineExportSummary({ includeMissions: true });
assert.equal(summary.schema, 'TG_ENGINE_EXPORT_SUMMARY_V1');
assert.equal(summary.counts.titans, 63);
assert.equal(summary.counts.missions, 280);
assert.equal(summary.canonicalRules.activeTitanCount, 1);

const dataset = loadSourceDataset({ includeMissions: true });
const titan = mapTitanForEngine(dataset.titans[0]);
assert.equal(titan.id, 'TG-TITAN-001');
assert.ok(titan.combatStats.hp > 0);
assert.ok(Array.isArray(titan.abilityNames));

const mission = mapMissionForEngine(dataset.missions.find(row => row.id === 'TG-F01-C01-M01'));
const ue5Framework = loadUe5DungeonFramework();
const ue5Template = loadFirstMissionZoneTemplate();
const mobileFirst = loadMobileFirstArchitecture();
assert.equal(ue5Framework.primaryEngine, 'Unreal Engine 5');
assert.equal(ue5Template.sourceMissionId, mission.id);
assert.deepEqual(mobileFirst.primaryTarget.platforms, ['Android', 'iOS']);
assert.equal(mission.activeTitanCount, 1);
assert.equal(mission.enemyWaveCount, 2);
assert.ok(mission.victoryConditions.length >= 1);

for (const file of ['engine/unreal/adapter-manifest.json', 'engine/unity/adapter-manifest.json']) {
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.equal(manifest.schema, 'TG_ENGINE_ADAPTER_MANIFEST_V1');
  assert.ok(manifest.plannedTypes.length >= 4);
  if (file.includes('/unreal/')) {
    assert.equal(manifest.primaryTarget, true);
    assert.equal(manifest.mobileFirst, true);
  }
}

console.log(JSON.stringify({ ok: true, engineAdapterContract: 'PASS', titans: summary.counts.titans, missions: summary.counts.missions }, null, 2));
