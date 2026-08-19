import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const bpRoot = path.join(root, '3D_Blueprints');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const exists = file => fs.existsSync(path.join(root, file));
const fail = msg => { throw new Error(msg); };

const allowedStatuses = new Set([
  'CONCEPT',
  'BLUEPRINT_IN_PROGRESS',
  'BLUEPRINT_COMPLETE',
  'VALIDATED',
  'READY_FOR_3D',
  'MODEL_IN_PROGRESS',
  'GAME_READY',
  'NEEDS_CANON_DATA'
]);
const readyStatuses = new Set(['READY_FOR_3D', 'MODEL_IN_PROGRESS', 'GAME_READY']);
const sourceFiles = {
  DEITY: 'data/deitys.json',
  CHARACTER: 'data/characters.json',
  CREATURE: 'data/creatures.json',
  CREATURE: 'data/creatures.json',
  BATTLEFIELD: 'data/maps.json',
  GATE: 'data/realm-codex.json'
};
const canonicalIds = new Map();
for (const [type, file] of Object.entries(sourceFiles)) {
  const data = read(file);
  canonicalIds.set(type, new Set(data.map(item => item.id)));
}
const registry = read('3D_Blueprints/Registry/blueprint-registry.json');
const githubAssetRegistry = read('asset_registry/github-asset-registry.json');
const system = read('data/3d-blueprint-system.json');
const productionQueue = read('data/3d-production-queue.json');
const master = read('3D_Blueprints/Global_References/Master_Scale_Reference/metadata.json');
const materialLibrary = read('3D_Blueprints/Global_References/Material_Library/metadata.json');
const styleGuide = read('3D_Blueprints/Global_References/Visual_Style_Guide/metadata.json');

if (system.status !== 'IMPLEMENTED') fail('3D Blueprint system must be IMPLEMENTED');
if (master.status !== 'READY_FOR_3D') fail('Master Scale Reference must be READY_FOR_3D');
if (materialLibrary.status !== 'READY_FOR_3D') fail('Material Library must be READY_FOR_3D');
if (styleGuide.status !== 'READY_FOR_3D') fail('Visual Style Guide must be READY_FOR_3D');

const requiredDirs = [
  'Characters/Deities', 'Characters/Creatures', 'Characters/NPCs',
  'Battlefields', 'Gates', 'Weapons', 'Armor', 'Structures', 'Props', 'Terrain',
  'Environment', 'Global_References', 'Schemas', 'Templates', 'Registry', 'Validation'
];
for (const dir of requiredDirs) {
  if (!fs.existsSync(path.join(bpRoot, dir))) fail(`Missing 3D blueprint directory: ${dir}`);
}

const ids = new Map();
const expectedRequiredViewCounts = {
  DEITY: 22,
  CHARACTER: 22,
  CREATURE: 21,
  BATTLEFIELD: 20,
  GATE: 12
};
const stats = {
  total: 0,
  readyFor3d: 0,
  needsCanonData: 0,
  byType: {},
  packagesChecked: 0
};
function checkPackage(entry) {
  stats.total += 1;
  stats.byType[entry.assetType] = (stats.byType[entry.assetType] || 0) + 1;
  if (ids.has(entry.assetId)) fail(`Duplicate 3D asset ID ${entry.assetId}`);
  ids.set(entry.assetId, entry.path || 'registry');
  if (!allowedStatuses.has(entry.status)) fail(`${entry.assetId}: invalid status ${entry.status}`);
  if (!entry.path || !exists(entry.path)) fail(`${entry.assetId}: package metadata file missing at ${entry.path}`);
  const pkg = read(entry.path);
  stats.packagesChecked += 1;
  if (pkg.assetId !== entry.assetId) fail(`${entry.assetId}: registry/package assetId mismatch`);
  if (pkg.assetType !== entry.assetType) fail(`${entry.assetId}: registry/package assetType mismatch`);
  if (pkg.status !== entry.status) fail(`${entry.assetId}: registry/package status mismatch`);
  if (!pkg.canonicalName) fail(`${entry.assetId}: missing canonicalName`);
  if (!pkg.sourceReferences || !pkg.sourceReferences.length) fail(`${entry.assetId}: missing sourceReferences`);
  if (!pkg.dependencies) fail(`${entry.assetId}: missing dependencies`);
  if (!pkg.requiredViews || !pkg.requiredViews.length) fail(`${entry.assetId}: missing requiredViews`);
  if (!pkg.scale || !pkg.scale.source || pkg.scale.source !== 'data/world-scale-reference.json') fail(`${entry.assetId}: missing master scale reference`);
  if (!pkg.materials || !pkg.materials.length) fail(`${entry.assetId}: missing material definitions`);
  if (!pkg.mobilePerformanceTarget) fail(`${entry.assetId}: missing mobile performance target`);
  if (!pkg.lodRequirements || !pkg.lodRequirements.includes('COLLISION_MESH')) fail(`${entry.assetId}: missing collision LOD requirement`);
  if (!pkg.technicalNotes?.collisionRequirements) fail(`${entry.assetId}: missing collision technical notes`);
  if (!pkg.battlefieldClearance) fail(`${entry.assetId}: missing battlefield clearance`);
  if (!allowedStatuses.has(pkg.status)) fail(`${entry.assetId}: invalid package status ${pkg.status}`);
  const canonSet = canonicalIds.get(pkg.assetType);
  if (canonSet && !canonSet.has(pkg.canonicalEntityId)) fail(`${entry.assetId}: canonical entity ${pkg.canonicalEntityId} not found for ${pkg.assetType}`);
  const minViews = expectedRequiredViewCounts[pkg.assetType];
  if (minViews && pkg.requiredViews.length < minViews) fail(`${entry.assetId}: required view count too low ${pkg.requiredViews.length}/${minViews}`);
  if (readyStatuses.has(pkg.status)) {
    stats.readyFor3d += 1;
    for (const view of pkg.requiredViews) {
      if (!view.file) fail(`${entry.assetId}: READY_FOR_3D requires linked file for ${view.viewId}`);
    }
    if (String(pkg.height).includes('DERIVED') || String(pkg.width).includes('DERIVED') || String(pkg.length).includes('DERIVED')) fail(`${entry.assetId}: READY_FOR_3D requires gameplay dimensions`);
  }
  if (pkg.status === 'NEEDS_CANON_DATA') {
    stats.needsCanonData += 1;
    if (!pkg.missingCanonData || !pkg.missingCanonData.length) fail(`${entry.assetId}: NEEDS_CANON_DATA requires missingCanonData list`);
  }
}

for (const entry of registry.assets) checkPackage(entry);
const githubLinkedAssetIds = new Set((githubAssetRegistry.entries || []).map(asset => asset.asset_id));
for (const entry of registry.assets) {
  if (!githubLinkedAssetIds.has(entry.assetId)) fail(`${entry.assetId}: missing GitHub asset registry link`);
}
const requiredCounts = {
  DEITY: read('data/deitys.json').length,
  CHARACTER: read('data/characters.json').length,
  BATTLEFIELD: read('data/maps.json').length,
  GATE: read('data/realm-codex.json').length,
  GLOBAL_REFERENCE: 3
};
for (const [type, count] of Object.entries(requiredCounts)) {
  if ((stats.byType[type] || 0) !== count) fail(`3D registry ${type} count mismatch: ${stats.byType[type] || 0}/${count}`);
}
for (const template of [
  'deity_blueprint_template.json', 'character_blueprint_template.json', 'creature_blueprint_template.json',
  'enemy_blueprint_template.json', 'battlefield_blueprint_template.json', 'gate_blueprint_template.json',
  'weapon_blueprint_template.json', 'armor_blueprint_template.json', 'structure_blueprint_template.json',
  'prop_blueprint_template.json', 'terrain_blueprint_template.json', 'environment_blueprint_template.json'
]) {
  if (!exists(`3D_Blueprints/Templates/${template}`)) fail(`Missing 3D template ${template}`);
}
if (!exists('3D_Blueprints/Schemas/blueprint-package.schema.json')) fail('Missing 3D blueprint package schema');
if (productionQueue.status !== 'IMPLEMENTED') fail('3D production queue must be IMPLEMENTED');
if (productionQueue.sourceRegistry !== '3D_Blueprints/Registry/blueprint-registry.json') fail('3D production queue sourceRegistry mismatch');
if (!Array.isArray(productionQueue.queue) || productionQueue.queue.length !== registry.assets.length) fail('3D production queue must cover every registry asset');
if (!Array.isArray(productionQueue.firstHandoffBatch) || productionQueue.firstHandoffBatch.length < 8) fail('3D production queue first handoff batch too small');
const registryById = new Map(registry.assets.map(asset => [asset.assetId, asset]));
const queueSeen = new Set();
for (const row of productionQueue.queue) {
  const entry = registryById.get(row.assetId);
  if (!entry) fail(`3D production queue unknown asset ${row.assetId}`);
  if (queueSeen.has(row.assetId)) fail(`3D production queue duplicate asset ${row.assetId}`);
  queueSeen.add(row.assetId);
  if (row.sourcePackage !== entry.path) fail(`${row.assetId}: queue sourcePackage mismatch`);
  if (row.status !== entry.status || row.assetType !== entry.assetType || row.canonicalEntityId !== entry.canonicalEntityId) fail(`${row.assetId}: queue row must mirror registry identity`);
  for (const field of ['priority', 'lane', 'phase', 'director', 'handoffInstruction']) if (!row[field]) fail(`${row.assetId}: queue missing ${field}`);
  if (row.director !== '3D Asset Director') fail(`${row.assetId}: queue director mismatch`);
  if (!Array.isArray(row.acceptanceCriteria) || !row.acceptanceCriteria.length) fail(`${row.assetId}: queue missing acceptance criteria`);
  if (row.assetType !== 'GLOBAL_REFERENCE') for (const ref of ['GLOBAL_REF_001', 'GLOBAL_REF_002', 'GLOBAL_REF_003']) if (!(row.dependsOn || []).includes(ref)) fail(`${row.assetId}: queue missing dependency ${ref}`);
}
for (const row of productionQueue.firstHandoffBatch) {
  if (!queueSeen.has(row.assetId)) fail(`${row.assetId}: first handoff missing from queue`);
  if (row.assetType === 'GLOBAL_REFERENCE') fail(`${row.assetId}: first handoff cannot be a global reference`);
}
console.log(JSON.stringify({ ok: true, blueprint3d: 'PASS', productionQueue: productionQueue.queue.length, firstHandoffBatch: productionQueue.firstHandoffBatch.length, ...stats }, null, 2));
