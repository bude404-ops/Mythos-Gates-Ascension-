import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildEngineExportSummary, mapDeityForEngine, mapMissionForEngine } from '../engine/shared/engine-exporter.mjs';
import { loadSourceDataset } from '../src/data-loaders/index.mjs';
import { loadUe5DungeonFramework, loadFirstMissionZoneTemplate } from '../engine/unreal/ue5-dungeon-framework.mjs';
import { loadMobileFirstArchitecture } from '../engine/unreal/mobile-first-architecture.mjs';

const summary = buildEngineExportSummary({ includeMissions: true });
assert.equal(summary.schema, 'MG_ENGINE_EXPORT_SUMMARY_V1');
assert.equal(summary.counts.deities, 28);
assert.equal(summary.counts.missions, 280);
assert.equal(summary.canonicalRules.activeDeityCount, 1);

const dataset = loadSourceDataset({ includeMissions: true });
const deity = mapDeityForEngine(dataset.deities[0]);
assert.equal(deity.id, 'MG-DEITY-001');
assert.ok(deity.combatStats.hp > 0);
assert.ok(Array.isArray(deity.abilityNames));

const mission = mapMissionForEngine(dataset.missions.find(row => row.id === 'MG-F01-C01-M01'));
const ue5Framework = loadUe5DungeonFramework();
const ue5Template = loadFirstMissionZoneTemplate();
const mobileFirst = loadMobileFirstArchitecture();
assert.equal(ue5Framework.primaryEngine, 'Unreal Engine 5');
assert.equal(ue5Template.sourceMissionId, mission.id);
assert.deepEqual(mobileFirst.primaryTarget.platforms, ['Android', 'iOS']);
assert.equal(mission.activeDeityCount, 1);
assert.equal(mission.enemyWaveCount, 2);
assert.ok(mission.victoryConditions.length >= 1);

for (const file of ['engine/unreal/adapter-manifest.json', 'engine/unity/adapter-manifest.json']) {
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.equal(manifest.schema, 'MG_ENGINE_ADAPTER_MANIFEST_V1');
  assert.ok(manifest.plannedTypes.length >= 4);
  if (file.includes('/unreal/')) {
    assert.equal(manifest.primaryTarget, true);
    assert.equal(manifest.mobileFirst, true);
  }
}

console.log(JSON.stringify({ ok: true, engineAdapterContract: 'PASS', deitys: summary.counts.deities, missions: summary.counts.missions }, null, 2));
