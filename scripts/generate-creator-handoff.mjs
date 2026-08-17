import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT_ROOT = path.join(ROOT, 'handoff/assets');
const REPORT_PATH = path.join(ROOT, 'validation/reports/creator-handoff-report.json');

const readJson = file => JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
const writeJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
};
const writeText = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value.trim() + '\n');
};
const slug = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'unnamed';

const registry = readJson('asset_registry/github-asset-registry.json');
const blueprintQueue = readJson('data/3d-production-queue.json');
const blueprintRegistry = readJson('3D_Blueprints/Registry/blueprint-registry.json');
const artApproval = readJson('data/art-approval-manifest.json');
const prompts = readJson('data/art-prompts.json');
const reserved = readJson('manifests/assets/RESERVED_ASSET_IDS.json');

const registryByEntity = new Map((registry.entries || []).flatMap(entry => [
  [entry.canonical_entity_id, entry],
  [entry.lore_reference, entry]
].filter(([key]) => Boolean(key))));
const registryByAsset = new Map((registry.entries || []).map(entry => [entry.asset_id, entry]));
const blueprintByAsset = new Map((blueprintRegistry.assets || []).map(asset => [asset.assetId, asset]));
const promptByEntity = new Map((prompts || []).map(prompt => [prompt.entityId, prompt]));
const reservedIds = new Set((reserved.reserved || []).map(item => item.asset_id));

const batches = [];
const packets = [];
const issues = [];

function packetForEntry(entry, source) {
  const prompt = promptByEntity.get(entry.canonical_entity_id) || null;
  const blueprint = blueprintByAsset.get(entry.asset_id) || null;
  const queueItem = (blueprintQueue.queue || []).find(item => item.assetId === entry.asset_id) || null;
  const manifestPath = `manifests/assets/${String(entry.asset_type).toLowerCase()}/${entry.asset_id}/manifest.json`;
  if (!reservedIds.has(entry.asset_id)) issues.push(`${entry.asset_id}: missing reserved ID contract`);
  if (!fs.existsSync(path.join(ROOT, manifestPath))) issues.push(`${entry.asset_id}: missing machine manifest`);
  if (entry.blueprint_reference && !fs.existsSync(path.join(ROOT, entry.blueprint_reference))) issues.push(`${entry.asset_id}: missing blueprint reference`);
  return {
    schema: 'TG_CREATOR_HANDOFF_PACKET_V1',
    asset_id: entry.asset_id,
    asset_type: entry.asset_type,
    canonical_entity_id: entry.canonical_entity_id,
    canonical_name: entry.canonical_name,
    source_batch: source.batchId,
    source_reason: source.reason,
    priority: source.priority,
    status: 'READY_FOR_EXTERNAL_CREATION',
    output_contract: {
      upload_target: entry.source_slots || {},
      manifest: manifestPath,
      preserve_original_source: true,
      do_not_rename_asset_id: true,
      do_not_mark_imported_without_real_file: true
    },
    canon_locks: {
      no_new_lore: true,
      no_new_faction_identity: true,
      no_playable_hero_drift: entry.asset_type === 'CHARACTER',
      no_sci_fi_drift: true
    },
    prompt_reference: prompt ? {
      prompt_id: prompt.id,
      status: prompt.status,
      prompt: prompt.prompt,
      negative_prompt: prompt.negativePrompt
    } : null,
    blueprint_reference: blueprint ? {
      registry_path: blueprint.path,
      blueprint_status: blueprint.status,
      faction: blueprint.faction || null,
      queue_status: queueItem?.status || null,
      package_path: queueItem?.packagePath || blueprint.path
    } : null,
    quality_gates: artApproval.qualityGates || [],
    rejection_triggers: artApproval.rejectionTriggers || [],
    required_return_files: [
      'Original source file in the correct GitHub source slot.',
      'Preview render or concept preview when available.',
      'Notes listing tool, version, scale assumptions, and unresolved blockers.'
    ]
  };
}

function packetForPrompt(prompt, batch, source) {
  return {
    schema: 'TG_CREATOR_HANDOFF_PACKET_V1',
    packet_type: 'APPROVED_PROMPT_ONLY_ART',
    prompt_id: prompt.id,
    asset_id: null,
    asset_type: prompt.category || 'ARTWORK',
    canonical_entity_id: prompt.entityId,
    canonical_name: prompt.entity,
    source_batch: batch.id,
    source_reason: source.reason,
    priority: source.priority,
    status: 'READY_FOR_EXTERNAL_CREATION',
    output_contract: {
      upload_target: `art/imported/${prompt.entityId || prompt.id}/`,
      approved_target: `art/approved/${prompt.entityId || prompt.id}/`,
      preserve_original_source: true,
      do_not_mark_imported_without_real_file: true,
      registry_note: 'Prompt-only art handoff. Promote to GitHub asset registry only when a real source file is received.'
    },
    canon_locks: {
      no_new_lore: true,
      no_new_faction_identity: true,
      no_playable_hero_drift: prompt.category === 'NPC',
      no_sci_fi_drift: true
    },
    prompt_reference: {
      prompt_id: prompt.id,
      status: prompt.status,
      prompt: prompt.prompt,
      negative_prompt: prompt.negativePrompt
    },
    blueprint_reference: null,
    quality_gates: artApproval.qualityGates || [],
    rejection_triggers: artApproval.rejectionTriggers || [],
    required_return_files: [
      'Generated source image or layered source file.',
      'Preview image suitable for 360px mobile crop review.',
      'Notes listing tool, model/version, seed/settings if applicable, and unresolved blockers.'
    ]
  };
}

for (const batch of artApproval.approvalBatches || []) {
  const batchPackets = [];
  for (const entityId of batch.entityIds || []) {
    const entry = registryByEntity.get(entityId);
    const prompt = promptByEntity.get(entityId);
    const packet = entry
      ? packetForEntry(entry, { batchId: batch.id, priority: 'HIGH', reason: batch.approvalNotes })
      : (prompt ? packetForPrompt(prompt, batch, { priority: 'HIGH', reason: batch.approvalNotes }) : null);
    if (!packet) { issues.push(`${batch.id}: no registry asset or prompt for ${entityId}`); continue; }
    batchPackets.push(packet);
    packets.push(packet);
    const fileId = packet.asset_id || packet.prompt_id;
    const out = path.join(OUT_ROOT, batch.id, `${fileId}_${slug(packet.canonical_name)}.json`);
    writeJson(out, packet);
  }
  batches.push({ id: batch.id, name: batch.name, type: 'APPROVED_ART_PROMPT_BATCH', packetCount: batchPackets.length });
}

const firstHandoff = blueprintQueue.firstHandoffBatch || [];
const handoffPackets = [];
for (const item of firstHandoff) {
  const entry = registryByAsset.get(item.assetId);
  if (!entry) { issues.push(`first-handoff: no registry asset for ${item.assetId}`); continue; }
  const packet = packetForEntry(entry, { batchId: 'TG-3D-FIRST-HANDOFF-BATTLEFIELDS-001', priority: 'HIGH', reason: 'First 3D battlefield handoff batch from production queue.' });
  handoffPackets.push(packet);
  packets.push(packet);
  writeJson(path.join(OUT_ROOT, 'TG-3D-FIRST-HANDOFF-BATTLEFIELDS-001', `${entry.asset_id}_${slug(entry.canonical_name)}.json`), packet);
}
batches.push({ id: 'TG-3D-FIRST-HANDOFF-BATTLEFIELDS-001', name: 'First 3D Battlefield Handoff Batch', type: '3D_BLUEPRINT_HANDOFF_BATCH', packetCount: handoffPackets.length });

const readme = `# Mythos Gates Creator Handoff Bundles

These packets are production contracts for external artists, Blender work, AI image generation, or direct GitHub upload.

Rules:
- Use the asset_id exactly as written.
- Upload real source files into the GitHub source slot listed in each packet.
- Do not mark an asset imported unless a real source file exists.
- Do not invent lore, factions, weapons, or playable Hero classes.
- Preserve original source files; game-ready conversions are separate.

Generated packets: ${packets.length}
Batches: ${batches.map(batch => `${batch.id} (${batch.packetCount})`).join(', ')}
`;
writeText(path.join(OUT_ROOT, 'README.md'), readme);

const report = {
  id: 'TG-CREATOR-HANDOFF-REPORT-001',
  schema: 'TG_CREATOR_HANDOFF_REPORT_V1',
  status: issues.length ? 'NEEDS_REVIEW' : 'VALID',
  generated: new Date().toISOString().slice(0, 10),
  packets: packets.length,
  batches,
  approvedArtPackets: batches.filter(batch => batch.type === 'APPROVED_ART_PROMPT_BATCH').reduce((sum, batch) => sum + batch.packetCount, 0),
  battlefield3dPackets: handoffPackets.length,
  issues,
  rule: 'Creator handoff packets point external tools at stable GitHub asset IDs and manifests without fabricating final source files.'
};
writeJson(REPORT_PATH, report);
console.log(JSON.stringify({ ok: !issues.length, status: report.status, packets: packets.length, batches: batches.length, issues: issues.length }, null, 2));
if (issues.length) process.exit(1);
