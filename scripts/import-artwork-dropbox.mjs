import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const TODAY = new Date().toISOString().slice(0, 10);
const DROPBOX = path.join(ROOT, 'artwork_import/dropbox');
const REPORT = path.join(ROOT, 'validation/reports/artwork-import-report.json');
const SUPPORTED = new Set(['.glb', '.gltf', '.fbx', '.obj', '.blend', '.png', '.jpg', '.jpeg', '.webp', '.psd', '.tga']);
const RESERVED_NAMES = new Set(['README.md', '.gitkeep']);

function readJson(rel) { return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8')); }
function writeJson(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n'); }
function rel(file) { return path.relative(ROOT, file).replaceAll(path.sep, '/'); }
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
function parseAssetId(text) {
  const match = String(text).match(/(?:^|[^A-Z0-9])(DEITY|CHARACTER|CREATURE|ENEMY|BATTLEFIELD|GATE|WEAPON|ARMOR|STRUCTURE|PROP|ENVIRONMENT|GLOBAL_REF)_[0-9]{3}(?=$|[^A-Z0-9])/i);
  return match ? match[0].match(/(DEITY|CHARACTER|CREATURE|ENEMY|BATTLEFIELD|GATE|WEAPON|ARMOR|STRUCTURE|PROP|ENVIRONMENT|GLOBAL_REF)_[0-9]{3}/i)[0].toUpperCase() : null;
}
function slug(text) { return String(text || 'asset').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'asset'; }
function typeRoot(type, ext) {
  const image = ['.png', '.jpg', '.jpeg', '.webp', '.psd', '.tga'].includes(ext);
  if (image && !['BATTLEFIELD', 'GATE'].includes(type)) return 'assets/concept_art/source';
  const map = {
    DEITY: 'assets/3d/deities/source',
    CHARACTER: 'assets/3d/characters/source',
    CREATURE: 'assets/3d/creatures/source',
    ENEMY: 'assets/3d/enemies/source',
    BATTLEFIELD: image ? 'assets/concept_art/source' : 'assets/3d/battlefields/source',
    GATE: image ? 'assets/concept_art/source' : 'assets/3d/gates/source',
    WEAPON: 'assets/3d/weapons/source',
    ARMOR: 'assets/3d/armor/source',
    STRUCTURE: 'assets/3d/structures/source',
    PROP: 'assets/3d/props/source',
    ENVIRONMENT: 'assets/3d/environment/source',
    GLOBAL_REFERENCE: 'assets/references/source'
  };
  return map[type] || 'assets/references/source';
}
function nextVersionFolder(base) {
  fs.mkdirSync(base, { recursive: true });
  const nums = fs.readdirSync(base, { withFileTypes: true })
    .filter(d => d.isDirectory() && /^v\d{3}$/i.test(d.name))
    .map(d => Number(d.name.slice(1)))
    .filter(n => Number.isFinite(n));
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `v${String(next).padStart(3, '0')}`;
}
function safeName(name) {
  const ext = path.extname(name).toLowerCase();
  const base = path.basename(name, ext).replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-|-$/g, '') || 'source-file';
  return `${base}${ext}`;
}

fs.mkdirSync(DROPBOX, { recursive: true });
const registry = readJson('asset_registry/github-asset-registry.json');
const byId = new Map((registry.entries || []).map(entry => [entry.asset_id, entry]));
const files = walk(DROPBOX).filter(file => !RESERVED_NAMES.has(path.basename(file)));
const imported = [];
const skipped = [];

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  const assetId = parseAssetId(rel(file));
  if (!SUPPORTED.has(ext)) {
    skipped.push({ path: rel(file), reason: `unsupported extension ${ext || '(none)'}` });
    continue;
  }
  if (!assetId) {
    skipped.push({ path: rel(file), reason: 'missing permanent asset ID in filename or folder path' });
    continue;
  }
  const entry = byId.get(assetId);
  if (!entry) {
    skipped.push({ path: rel(file), asset_id: assetId, reason: 'asset ID is not reserved in registry' });
    continue;
  }
  const base = path.join(ROOT, typeRoot(entry.asset_type, ext), assetId);
  const version = nextVersionFolder(base);
  const destDir = path.join(base, version);
  const dest = path.join(destDir, safeName(path.basename(file)));
  fs.mkdirSync(destDir, { recursive: true });
  if (fs.existsSync(dest)) throw new Error(`Refusing to overwrite existing asset: ${rel(dest)}`);
  const beforeHash = sha256(file);
  fs.renameSync(file, dest);
  imported.push({
    asset_id: assetId,
    asset_type: entry.asset_type,
    canonical_name: entry.canonical_name,
    from: rel(file),
    to: rel(dest),
    file_type: ext,
    bytes: fs.statSync(dest).size,
    sha256: beforeHash,
    version
  });
}

const commands = [];
function run(label, command, args) {
  execFileSync(command, args, { cwd: ROOT, stdio: 'pipe' });
  commands.push(`${command} ${args.join(' ')}`);
}
if (imported.length) {
  run('detect', 'node', ['scripts/detect-github-assets.mjs']);
  run('validate', 'node', ['scripts/validate-github-assets.mjs']);
  run('manifests', 'node', ['scripts/generate-asset-manifests.mjs']);
  run('handoff', 'node', ['scripts/generate-creator-handoff.mjs']);
  run('queue', 'node', ['scripts/generate-artwork-build-queue.mjs']);
}

const report = {
  id: 'MG-ARTWORK-IMPORT-REPORT-001',
  status: skipped.length ? (imported.length ? 'IMPORTED_WITH_SKIPS' : 'NO_IMPORTS') : (imported.length ? 'IMPORTED' : 'NO_DROPBOX_FILES'),
  generated: TODAY,
  importedCount: imported.length,
  skippedCount: skipped.length,
  imported,
  skipped,
  commandsRun: commands,
  rule: 'Importer never overwrites existing source assets and never invents canon. Unknown IDs remain skipped for review.'
};
writeJson(REPORT, report);
console.log(JSON.stringify({ ok: skipped.length === 0, status: report.status, imported: imported.length, skipped: skipped.length, report: rel(REPORT) }, null, 2));
if (skipped.length) process.exitCode = 1;
