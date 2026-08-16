import fs from 'node:fs';

const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const packetPath = 'handoff/external_ai/BATTLEFIELD_001_the-first-reopening-gate.external-ai-packet.json';
const mdPath = 'handoff/external_ai/BATTLEFIELD_001_the-first-reopening-gate.external-ai-packet.md';
const packet = read(packetPath);
const md = fs.readFileSync(mdPath, 'utf8');
const issues = [];

const requiredStages = [
  'BATTLEFIELD_BLUEPRINT','COMBAT_LAYOUT','GRAYBOX','TERRAIN_FOUNDATION','VERTICALITY',
  'COMBAT_SURFACES','CONNECTIONS','BOUNDARIES','TITAN_SCALE','REAL_3D_GEOMETRY',
  'MODULAR_ENVIRONMENT_ASSETS','ARCHITECTURE','HERO_LANDMARK','LORE_INTEGRATION','MATERIALS',
  'LIGHTING','ENVIRONMENTAL_DRESSING','ATMOSPHERE','GAMEPLAY_CAMERA','MOBILE_OPTIMIZATION',
  'FINAL_QUALITY_REVIEW','APPROVAL_GATE'
];

if (packet.status !== 'ACTIVE_SOURCE_OF_TRUTH') issues.push('External AI packet must be ACTIVE_SOURCE_OF_TRUTH');
if (packet.targetAsset?.assetId !== 'BATTLEFIELD_001') issues.push('Packet must target only BATTLEFIELD_001');
if (packet.targetAsset?.canonicalEntityId !== 'TG-MAP-001') issues.push('Packet must target TG-MAP-001');
if (packet.approvalGate?.mayStartNextBattlefield !== false) issues.push('Packet must block Battlefield 002+');
if (!String(packet.absoluteRule || '').includes('ONLY BATTLEFIELD_001')) issues.push('Missing one-battlefield absolute rule');
for (const stage of requiredStages) if (!(packet.productionStages || []).includes(stage)) issues.push(`Missing production stage ${stage}`);
if ((packet.tacticalLayout?.zones || []).length < 7) issues.push('Packet must include all tactical zones');
if ((packet.tacticalLayout?.routes || []).length < 4) issues.push('Packet must include route definitions');
if (!packet.artPrompt?.positive || !packet.artPrompt?.negative) issues.push('Packet must include positive and negative generation prompts');
if ((packet.geometryRules || []).length < 5) issues.push('Packet must include geometry rules');
if (!packet.importTargets?.manifest) issues.push('Packet must include import manifest target');
for (const phrase of ['BATTLEFIELD_001', 'The First Reopening Gate', 'Do not generate Battlefield 002', 'Core Generation Prompt', 'Approval Gate']) {
  if (!md.includes(phrase)) issues.push(`Markdown packet missing phrase: ${phrase}`);
}

if (issues.length) {
  console.error(JSON.stringify({ ok: false, issueCount: issues.length, issues }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  externalAiPacket: 'PASS',
  packetPath,
  markdownPath: mdPath,
  stages: packet.productionStages.length,
  zones: packet.tacticalLayout.zones.length,
  routes: packet.tacticalLayout.routes.length,
  target: packet.targetAsset
}, null, 2));
