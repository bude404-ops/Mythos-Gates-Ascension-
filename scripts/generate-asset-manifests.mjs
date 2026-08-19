import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REGISTRY_PATH = path.join(ROOT, 'asset_registry/github-asset-registry.json');
const GRAPH_PATH = path.join(ROOT, 'asset_registry/asset-dependency-graph.json');
const CONTRACT_PATH = path.join(ROOT, 'data/github-asset-repository.json');
const REPORT_PATH = path.join(ROOT, 'validation/reports/github-asset-manifest-report.json');
const MANIFEST_ROOT = path.join(ROOT, 'manifests/assets');
const TODAY = new Date().toISOString().slice(0, 10);

function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function writeJson(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n'); }
function kebab(value) { return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'unnamed'; }
function manifestPathFor(entry) {
  const family = String(entry.asset_type || 'UNKNOWN').toLowerCase();
  return path.join(MANIFEST_ROOT, family, entry.asset_id, 'manifest.json');
}

const registry = readJson(REGISTRY_PATH);
const graph = readJson(GRAPH_PATH);
const contract = readJson(CONTRACT_PATH);
const graphById = new Map((graph.nodes || []).map(node => [node.asset_id, node]));
const written = [];
const reserved = [];
const sourceReady = [];
const needsCanonReview = [];

for (const entry of registry.entries || []) {
  if (!entry.asset_id || entry.validation_status === 'NEEDS_CANON_REVIEW') {
    needsCanonReview.push(entry.asset_id || 'UNKNOWN');
    continue;
  }
  const graphNode = graphById.get(entry.asset_id) || { dependencies: [] };
  const manifest = {
    schema: 'TG_ASSET_MANIFEST_V1',
    asset_id: entry.asset_id,
    asset_type: String(entry.asset_type || '').toLowerCase(),
    canonical_name: entry.canonical_name,
    slug: kebab(entry.canonical_name),
    source: entry.source_file ? 'external_or_repository' : 'awaiting_external_source',
    status: entry.status || 'AWAITING_SOURCE_ASSET',
    version: entry.version || 'v000',
    versions: entry.versions || { current: entry.version || 'v000', previous: [], archived: [] },
    source_file: entry.source_file || null,
    source_slots: entry.source_slots || {},
    game_ready: entry.game_ready || null,
    preview: entry.source_slots?.preview || null,
    blueprint: entry.blueprint_reference || null,
    model: entry.model_reference || null,
    material: entry.material_reference || null,
    rig: entry.rig_reference || null,
    animations: entry.animation_reference || null,
    vfx: entry.vfx_reference || null,
    battlefield_references: entry.battlefield_references || [],
    dependencies: entry.dependencies || graphNode.dependencies || [],
    dependent_assets: graphNode.dependents || [],
    lore_reference: entry.lore_reference || null,
    faction_reference: entry.faction_reference || null,
    scale_reference: entry.scale_reference || 'MASTER_SCALE',
    requirements: {
      lod_required: entry.lod_required ?? true,
      collision_required: entry.collision_required ?? true,
      rig_required: entry.rig_required ?? ['DEITY','CHARACTER','CREATURE','ENEMY'].includes(entry.asset_type),
      animation_required: entry.animation_required ?? ['DEITY','CHARACTER','CREATURE','ENEMY','GATE'].includes(entry.asset_type),
      master_scale_required: entry.asset_type !== 'GLOBAL_REFERENCE'
    },
    validation: {
      status: entry.validation_status || 'NEEDS_SOURCE_ASSET',
      lod_status: entry.lod_status || 'NEEDS_SOURCE_ASSET',
      collision_status: entry.collision_status || 'NEEDS_SOURCE_ASSET'
    },
    storage_policy: {
      original_source_preserved: true,
      source_vs_game_ready: contract.sourceVsRuntimePolicy,
      large_binary_strategy: 'Use Git LFS or external_uri for large files; manifests and metadata remain normal Git.'
    },
    canon_protection: {
      authority: 'Existing Canon/Lore system',
      unmatched_status: 'NEEDS_CANON_REVIEW',
      no_lore_invention: true
    },
    created_date: entry.created_date || TODAY,
    updated_date: TODAY
  };
  writeJson(manifestPathFor(entry), manifest);
  written.push(entry.asset_id);
  reserved.push({ asset_id: entry.asset_id, manifest: path.relative(ROOT, manifestPathFor(entry)).replaceAll(path.sep, '/'), status: manifest.status });
  if (entry.source_file) sourceReady.push(entry.asset_id);
}

writeJson(path.join(MANIFEST_ROOT, 'RESERVED_ASSET_IDS.json'), {
  schema: 'TG_RESERVED_ASSET_IDS_V1',
  generated: TODAY,
  rule: 'Never reuse a permanent asset ID. Reservation exists before final files so external tools can target stable IDs without Reaper as importer.',
  count: reserved.length,
  reserved
});

writeJson(REPORT_PATH, {
  id: 'TG-GITHUB-ASSET-MANIFEST-REPORT-001',
  status: needsCanonReview.length ? 'NEEDS_REVIEW' : 'VALID',
  generated: TODAY,
  manifestsGenerated: written.length,
  registryEntries: (registry.entries || []).length,
  sourceReady: sourceReady.length,
  awaitingSource: written.length - sourceReady.length,
  needsCanonReview,
  rule: 'Manifests are machine-readable contracts. They reserve IDs and link source, blueprint, model, materials, rig, animations, VFX, dependencies, and validation without creating or importing final art.'
});

console.log(JSON.stringify({ ok: true, manifestsGenerated: written.length, sourceReady: sourceReady.length, awaitingSource: written.length - sourceReady.length, needsCanonReview: needsCanonReview.length }, null, 2));
