import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const REGISTRY_PATH = path.join(ROOT, 'asset_registry/github-asset-registry.json');
const REPORT_PATH = path.join(ROOT, 'validation/reports/github-asset-detection-report.json');
const TODAY = new Date().toISOString().slice(0, 10);

const SUPPORTED = new Map([
  ['.glb', 'model3d'], ['.gltf', 'model3d'], ['.fbx', 'model3d'], ['.obj', 'model3d'], ['.blend', 'model3d'],
  ['.png', 'image'], ['.jpg', 'image'], ['.jpeg', 'image'], ['.webp', 'image'], ['.psd', 'image'], ['.tga', 'image'],
  ['.wav', 'audio_future'], ['.ogg', 'audio_future'], ['.vfx', 'vfx_future']
]);

const ASSET_ROOTS = ['assets'];
const IGNORED = new Set(['.gitkeep', 'ASSET_MANIFEST_TEMPLATE.json', 'RESERVED_ASSET_IDS.json', 'manifest.json']);

function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function writeJson(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n'); }
function sha256(file) { return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'); }
function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}
function rel(file) { return path.relative(ROOT, file).replaceAll(path.sep, '/'); }
function parseAssetId(relativePath) {
  const parts = relativePath.split('/');
  const text = parts.join(' ');
  const match = text.match(/(?:^|[^A-Z0-9])(DEITY|CHARACTER|CREATURE|ENEMY|BATTLEFIELD|GATE|WEAPON|ARMOR|STRUCTURE|PROP|ENVIRONMENT|GLOBAL_REF)_[0-9]{3}(?=$|[^A-Z0-9])/i);
  return match ? match[0].match(/(DEITY|CHARACTER|CREATURE|ENEMY|BATTLEFIELD|GATE|WEAPON|ARMOR|STRUCTURE|PROP|ENVIRONMENT|GLOBAL_REF)_[0-9]{3}/i)[0].toUpperCase() : null;
}
function inferAssetType(relativePath, assetId) {
  if (assetId) return assetId.replace(/_[0-9]{3}$/, '').replace('GLOBAL_REF', 'GLOBAL_REFERENCE');
  const p = relativePath.toLowerCase();
  if (p.includes('/deities/')) return 'DEITY';
  if (p.includes('/characters/')) return 'CHARACTER';
  if (p.includes('/creatures/')) return 'CREATURE';
  if (p.includes('/enemies/')) return 'ENEMY';
  if (p.includes('/battlefields/')) return 'BATTLEFIELD';
  if (p.includes('/gates/')) return 'GATE';
  if (p.includes('/weapons/')) return 'WEAPON';
  if (p.includes('/armor/')) return 'ARMOR';
  if (p.includes('/structures/')) return 'STRUCTURE';
  if (p.includes('/props/')) return 'PROP';
  if (p.includes('/environment/')) return 'ENVIRONMENT';
  return 'UNKNOWN';
}
function classifySlot(relativePath, ext) {
  const p = relativePath.toLowerCase();
  if (p.includes('/concept_art/')) return 'concept';
  if (p.includes('/textures/')) return 'textures';
  if (p.includes('/materials/')) return 'materials';
  if (p.includes('/rigs/')) return 'rig';
  if (p.includes('/animations/')) return 'animations';
  if (p.includes('/vfx/')) return 'vfx';
  if (p.includes('/preview') || p.includes('/previews/')) return 'preview';
  if (['.glb', '.gltf', '.fbx', '.obj', '.blend'].includes(ext)) return 'model';
  if (['.png', '.jpg', '.jpeg', '.webp', '.psd', '.tga'].includes(ext)) return 'concept';
  return 'source';
}
function setSlot(entry, slot, relativePath) {
  entry.source_slots ||= {};
  if (['textures', 'materials', 'animations', 'vfx', 'lod'].includes(slot)) {
    entry.source_slots[slot] ||= [];
    if (!entry.source_slots[slot].includes(relativePath)) entry.source_slots[slot].push(relativePath);
  } else {
    entry.source_slots[slot] = relativePath;
  }
  if (slot === 'model') entry.model_reference = relativePath;
  if (slot === 'rig') entry.rig_reference = relativePath;
  if (slot === 'preview') entry.source_slots.preview = relativePath;
  if (slot === 'materials') entry.material_reference = entry.source_slots.materials;
  if (slot === 'animations') entry.animation_reference = entry.source_slots.animations;
  if (slot === 'vfx') entry.vfx_reference = entry.source_slots.vfx;
}

const registry = readJson(REGISTRY_PATH);
const byId = new Map((registry.entries || []).map(e => [e.asset_id, e]));
const discovered = [];
const needsCanonReview = [];
for (const rootName of ASSET_ROOTS) {
  for (const file of walk(path.join(ROOT, rootName))) {
    const name = path.basename(file);
    if (IGNORED.has(name)) continue;
    const relativePath = rel(file);
    const ext = path.extname(file).toLowerCase();
    if (!SUPPORTED.has(ext)) continue;
    const assetId = parseAssetId(relativePath);
    const assetType = inferAssetType(relativePath, assetId);
    const bytes = fs.statSync(file).size;
    const record = { path: relativePath, asset_id: assetId, asset_type: assetType, file_type: ext || '.json', bytes, sha256: sha256(file), detected_date: TODAY };
    discovered.push(record);
    if (!assetId || !byId.has(assetId)) {
      needsCanonReview.push({ ...record, validation_status: 'NEEDS_CANON_REVIEW', reason: assetId ? 'asset_id_not_seeded_from_canon' : 'missing_permanent_asset_id' });
      continue;
    }
    const entry = byId.get(assetId);
    entry.source_file ||= relativePath;
    entry.file_type ||= ext || '.json';
    entry.status = 'SOURCE_DISCOVERED';
    entry.validation_status = 'NEEDS_VALIDATION';
    entry.updated_date = TODAY;
    entry.version = entry.version === 'v000' ? 'v001' : entry.version;
    entry.detected_files ||= [];
    if (!entry.detected_files.find(f => f.path === relativePath)) entry.detected_files.push(record);
    setSlot(entry, classifySlot(relativePath, ext), relativePath);
    entry.versions ||= { current: null, previous: [], archived: [] };
    entry.versions.current ||= 'v001';
  }
}
registry.updated = TODAY;
registry.entryCount = registry.entries.length;
writeJson(REGISTRY_PATH, registry);
writeJson(REPORT_PATH, { id: 'MG-GITHUB-ASSET-DETECTION-REPORT-001', status: 'IMPLEMENTED', generated: TODAY, discoveredCount: discovered.length, updatedKnownAssets: discovered.filter(d => d.asset_id && byId.has(d.asset_id)).length, needsCanonReviewCount: needsCanonReview.length, discovered, needsCanonReview, rule: 'Detection never modifies original source assets; it only updates registry metadata and review reports.' });
console.log(JSON.stringify({ ok: true, discovered: discovered.length, needsCanonReview: needsCanonReview.length, registryEntries: registry.entries.length }, null, 2));
