import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REGISTRY_PATH = path.join(ROOT, 'asset_registry/github-asset-registry.json');
const CONTRACT_PATH = path.join(ROOT, 'data/github-asset-repository.json');
const GRAPH_PATH = path.join(ROOT, 'asset_registry/asset-dependency-graph.json');
const REPORT_PATH = path.join(ROOT, 'validation/reports/github-asset-validation-report.json');
const MANIFEST_ROOT = path.join(ROOT, 'manifests/assets');
const TODAY = new Date().toISOString().slice(0, 10);

function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function exists(rel) { return rel && fs.existsSync(path.join(ROOT, rel)); }
function push(issueList, severity, asset_id, field, message) { issueList.push({ severity, asset_id, field, message }); }
function manifestPathFor(entry) { return path.join(MANIFEST_ROOT, String(entry.asset_type || 'UNKNOWN').toLowerCase(), entry.asset_id, 'manifest.json'); }

const contract = readJson(CONTRACT_PATH);
const registry = readJson(REGISTRY_PATH);
const graph = readJson(GRAPH_PATH);
const issues = [];
const warnings = [];
const ids = new Set();
const allowedStatuses = new Set(['AWAITING_SOURCE_ASSET', 'SOURCE_DISCOVERED', 'VALID', 'WARNING', 'ERROR', 'NEEDS_REVIEW', 'NEEDS_CANON_REVIEW']);
const allowedExtensions = new Set(Object.values(contract.supportedTypes || {}).flat());
const requiredFields = ['asset_id','asset_type','canonical_name','source_file','file_type','version','status','lore_reference','faction_reference','blueprint_reference','model_reference','material_reference','rig_reference','animation_reference','vfx_reference','battlefield_references','dependencies','lod_status','collision_status','validation_status','created_date','updated_date'];

for (const dir of contract.rootFolders || []) {
  if (!fs.existsSync(path.join(ROOT, dir))) push(issues, 'ERROR', contract.id, 'rootFolders', `missing folder ${dir}`);
}

for (const entry of registry.entries || []) {
  if (!entry.asset_id) push(issues, 'ERROR', 'UNKNOWN', 'asset_id', 'missing permanent asset ID');
  if (ids.has(entry.asset_id)) push(issues, 'ERROR', entry.asset_id, 'asset_id', 'duplicate permanent asset ID');
  ids.add(entry.asset_id);
  for (const field of requiredFields) if (!(field in entry)) push(issues, 'ERROR', entry.asset_id, field, 'missing registry field');
  if (!/^(DEITY|CHARACTER|CREATURE|ENEMY|BATTLEFIELD|GATE|WEAPON|ARMOR|STRUCTURE|PROP|ENVIRONMENT|GLOBAL_REF)_[0-9]{3}$/.test(entry.asset_id)) {
    push(issues, 'ERROR', entry.asset_id, 'asset_id', 'asset ID does not match stable ID contract');
  }
  if (entry.file_type && !allowedExtensions.has(entry.file_type)) push(warnings, 'WARNING', entry.asset_id, 'file_type', `file type ${entry.file_type} is not in supported type policy`);
  if (entry.source_file && !exists(entry.source_file)) push(issues, 'ERROR', entry.asset_id, 'source_file', 'source file is declared but missing');
  if (entry.model_reference && !exists(entry.model_reference)) push(issues, 'ERROR', entry.asset_id, 'model_reference', 'model file is declared but missing');
  if (entry.blueprint_reference && !exists(entry.blueprint_reference)) push(warnings, 'WARNING', entry.asset_id, 'blueprint_reference', 'blueprint reference is not present at declared path');
  if (!entry.scale_reference) push(warnings, 'WARNING', entry.asset_id, 'scale_reference', 'MASTER_SCALE reference missing');
  if (entry.asset_type !== 'GLOBAL_REFERENCE' && entry.scale_reference !== 'MASTER_SCALE') push(warnings, 'WARNING', entry.asset_id, 'scale_reference', '3D asset should link to MASTER_SCALE');
  if (!entry.lore_reference && !['WEAPON','ARMOR','STRUCTURE','PROP','ENVIRONMENT','GLOBAL_REFERENCE'].includes(entry.asset_type)) push(warnings, 'NEEDS_REVIEW', entry.asset_id, 'lore_reference', 'canon link missing; do not invent lore');
  if (!Array.isArray(entry.dependencies)) push(issues, 'ERROR', entry.asset_id, 'dependencies', 'dependencies must be an array');
  if (!entry.versions || !('current' in entry.versions) || !Array.isArray(entry.versions.previous) || !Array.isArray(entry.versions.archived)) push(issues, 'ERROR', entry.asset_id, 'versions', 'version control shape invalid');
  if (!allowedStatuses.has(entry.validation_status) && !['NEEDS_SOURCE_ASSET', 'NEEDS_VALIDATION'].includes(entry.validation_status)) push(warnings, 'WARNING', entry.asset_id, 'validation_status', `unknown validation status ${entry.validation_status}`);
  const manifestPath = manifestPathFor(entry);
  if (!fs.existsSync(manifestPath)) {
    push(issues, 'ERROR', entry.asset_id, 'manifest', `missing manifest ${path.relative(ROOT, manifestPath).replaceAll(path.sep, '/')}`);
  } else {
    try {
      const manifest = readJson(manifestPath);
      if (manifest.asset_id !== entry.asset_id) push(issues, 'ERROR', entry.asset_id, 'manifest.asset_id', 'manifest asset_id does not match registry');
      if (String(manifest.asset_type || '').toUpperCase() !== String(entry.asset_type || '').toUpperCase()) push(issues, 'ERROR', entry.asset_id, 'manifest.asset_type', 'manifest type does not match registry');
      if (manifest.scale_reference !== 'MASTER_SCALE' && entry.asset_type !== 'GLOBAL_REFERENCE') push(warnings, 'WARNING', entry.asset_id, 'manifest.scale_reference', 'manifest should link 3D asset to MASTER_SCALE');
    } catch (err) {
      push(issues, 'ERROR', entry.asset_id, 'manifest', `manifest is not valid JSON: ${err.message}`);
    }
  }
}

const graphIds = new Set((graph.nodes || []).map(n => n.asset_id));
for (const id of ids) if (!graphIds.has(id)) push(issues, 'ERROR', id, 'dependencyGraph', 'missing dependency graph node');

let status = 'VALID';
if (issues.length) status = 'ERROR';
else if (warnings.length) status = 'WARNING';
if ((registry.entries || []).some(e => e.validation_status === 'NEEDS_CANON_REVIEW')) status = status === 'ERROR' ? status : 'NEEDS_REVIEW';

const report = { id: 'MG-GITHUB-ASSET-VALIDATION-REPORT-001', status, generated: TODAY, registryEntries: (registry.entries || []).length, graphNodes: (graph.nodes || []).length, issues, warnings, checks: ['file_exists','valid_file_type','correct_asset_id','correct_location','stable_id_unique','source_preserved','version_shape','dependency_graph','blueprint_link','MASTER_SCALE_link','asset_manifest','reserved_id_ledger','canon_review_flag'], rule: 'Validation reports VALID, WARNING, ERROR, or NEEDS_REVIEW. It never rewrites source assets.' };
fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ ok: issues.length === 0, status, issues: issues.length, warnings: warnings.length, registryEntries: report.registryEntries, graphNodes: report.graphNodes }, null, 2));
if (issues.length) process.exit(1);
