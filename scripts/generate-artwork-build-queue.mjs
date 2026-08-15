import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TODAY = new Date().toISOString().slice(0, 10);
const OUT_DIR = path.join(ROOT, 'artwork_import');
const QUEUE_JSON = path.join(OUT_DIR, 'ARTWORK_BUILD_QUEUE.json');
const QUEUE_MD = path.join(OUT_DIR, 'ARTWORK_BUILD_QUEUE.md');

function readJson(rel) { return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8')); }
function writeJson(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n'); }
function slug(text) { return String(text || 'asset').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'asset'; }
function assetKindPath(type) {
  const map = {
    TITAN: 'assets/3d/titans/source',
    CHARACTER: 'assets/3d/characters/source',
    CREATURE: 'assets/3d/creatures/source',
    ENEMY: 'assets/3d/enemies/source',
    BATTLEFIELD: 'assets/3d/battlefields/source',
    GATE: 'assets/3d/gates/source',
    WEAPON: 'assets/3d/weapons/source',
    ARMOR: 'assets/3d/armor/source',
    STRUCTURE: 'assets/3d/structures/source',
    PROP: 'assets/3d/props/source',
    ENVIRONMENT: 'assets/3d/environment/source',
    GLOBAL_REFERENCE: 'assets/references/source'
  };
  return map[type] || 'assets/references/source';
}
function priorityFor(entry) {
  if (entry.asset_id === 'TITAN_001') return 1;
  if (entry.asset_id === 'CHARACTER_001') return 2;
  if (entry.asset_id === 'BATTLEFIELD_001') return 3;
  if (entry.asset_type === 'TITAN') return 10;
  if (entry.asset_type === 'BATTLEFIELD') return 20;
  if (entry.asset_type === 'GATE') return 30;
  if (entry.asset_type === 'CHARACTER') return 40;
  if (entry.asset_type === 'CREATURE' || entry.asset_type === 'ENEMY') return 50;
  return 90;
}
function promptFor(entry, artPrompts) {
  const byName = artPrompts.find(p => String(p.entity || '').toLowerCase() === String(entry.canonical_name || '').toLowerCase());
  const byRef = artPrompts.find(p => p.entityId && [entry.lore_reference, ...(entry.battlefield_references || [])].includes(p.entityId));
  return byName || byRef || null;
}

const registry = readJson('asset_registry/github-asset-registry.json');
const artPrompts = readJson('data/art-prompts.json');
const handoff = fs.existsSync(path.join(ROOT, 'handoff')) ? 'handoff/' : null;
const entries = (registry.entries || [])
  .filter(entry => ['AWAITING_SOURCE_ASSET', 'NEEDS_SOURCE_ASSET', null, undefined].includes(entry.status) || !entry.source_file)
  .map(entry => {
    const prompt = promptFor(entry, artPrompts || []);
    const canonicalSlug = slug(entry.canonical_name);
    const targetFolder = `${assetKindPath(entry.asset_type)}/${entry.asset_id}/v001`;
    const dropboxName = `${entry.asset_id}__${canonicalSlug}__source-file.ext`;
    return {
      asset_id: entry.asset_id,
      asset_type: entry.asset_type,
      canonical_name: entry.canonical_name,
      priority: priorityFor(entry),
      status: entry.status,
      validation_status: entry.validation_status,
      target_source_folder: targetFolder,
      easiest_dropbox_name: dropboxName,
      import_dropbox: `artwork_import/dropbox/${dropboxName}`,
      accepted_extensions: ['.glb', '.gltf', '.fbx', '.obj', '.blend', '.png', '.jpg', '.jpeg', '.webp', '.psd', '.tga'],
      blueprint_reference: entry.blueprint_reference,
      lore_reference: entry.lore_reference,
      generation_prompt_id: prompt?.id || null,
      generation_prompt: prompt?.prompt || null,
      negative_prompt: prompt?.negativePrompt || null,
      build_note: entry.asset_type === 'TITAN'
        ? 'Create the finished Titan source art/model first; keep original source intact and put optimized runtime output in game_ready later.'
        : 'Create/import the source asset first; validation will link it to the permanent ID.'
    };
  })
  .sort((a, b) => a.priority - b.priority || a.asset_id.localeCompare(b.asset_id));

const queue = {
  id: 'TG-ARTWORK-BUILD-QUEUE-001',
  status: entries.length ? 'READY_FOR_SOURCE_ASSETS' : 'SOURCE_ASSETS_COMPLETE',
  generated: TODAY,
  totalNeeded: entries.length,
  firstFinishProductTargets: entries.slice(0, 12),
  allNeeded: entries,
  simpleWorkflow: [
    'Run npm run artwork:queue to refresh this list.',
    'Create or export an asset using the permanent ID in the filename, e.g. TITAN_001__solara-sunforge__source-file.png.',
    'Drop the file into artwork_import/dropbox/.',
    'Run npm run artwork:import.',
    'Commit the moved asset, registry update, manifests, handoff, and validation reports.'
  ],
  handoffFolder: handoff,
  rule: 'Do not edit registry JSON by hand. The importer moves files, detects IDs, validates, regenerates manifests, and writes reports.'
};

fs.mkdirSync(path.join(OUT_DIR, 'dropbox'), { recursive: true });
writeJson(QUEUE_JSON, queue);
const md = [
  '# Titan Gates Artwork Build Queue',
  '',
  `Generated: ${TODAY}`,
  `Needed source assets: ${entries.length}`,
  '',
  '## Fast workflow',
  '',
  '1. Build/export the next asset from the list below.',
  '2. Name it with the permanent ID: `TITAN_001__asset-name__source-file.png` or `.glb`.',
  '3. Drop it in `artwork_import/dropbox/`.',
  '4. Run `npm run artwork:import`.',
  '5. Commit the moved asset and generated reports.',
  '',
  '## First finished-product targets',
  '',
  ...entries.slice(0, 12).flatMap((entry, index) => [
    `### ${index + 1}. ${entry.asset_id} — ${entry.canonical_name}`,
    '',
    `- Type: ${entry.asset_type}`,
    `- Drop as: \`${entry.import_dropbox}\``,
    `- Final source folder: \`${entry.target_source_folder}\``,
    `- Blueprint: \`${entry.blueprint_reference || 'none'}\``,
    entry.generation_prompt_id ? `- Prompt: ${entry.generation_prompt_id}` : '- Prompt: not mapped; use blueprint/canon packet.',
    entry.generation_prompt ? `- Generation brief: ${entry.generation_prompt}` : '- Generation brief: see creator handoff packet or blueprint metadata.',
    entry.negative_prompt ? `- Negative prompt: ${entry.negative_prompt}` : '',
    ''
  ]),
  '## All waiting IDs',
  '',
  '| Priority | Asset ID | Type | Name | Dropbox filename |',
  '|---:|---|---|---|---|',
  ...entries.map(entry => `| ${entry.priority} | ${entry.asset_id} | ${entry.asset_type} | ${entry.canonical_name} | \`${entry.easiest_dropbox_name}\` |`),
  ''
].join('\n');
fs.writeFileSync(QUEUE_MD, md);
fs.writeFileSync(path.join(OUT_DIR, 'dropbox', 'README.md'), [
  '# Artwork Import Dropbox',
  '',
  'Drop finished source artwork or model files here, then run:',
  '',
  '```bash',
  'npm run artwork:import',
  '```',
  '',
  'File names must include a permanent asset ID such as `TITAN_001`, `BATTLEFIELD_001`, or `CHARACTER_001`.',
  'Example: `TITAN_001__solara-sunforge__source-file.png`',
  '',
  'The importer moves files into the correct `assets/.../source/<ASSET_ID>/v###/` folder and refreshes validation reports.',
  ''
].join('\n'));
console.log(JSON.stringify({ ok: true, queue: path.relative(ROOT, QUEUE_JSON), markdown: path.relative(ROOT, QUEUE_MD), totalNeeded: entries.length, firstTargets: entries.slice(0, 5).map(e => e.asset_id) }, null, 2));
