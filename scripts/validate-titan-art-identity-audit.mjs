import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const exists = file => fs.existsSync(path.join(root, file));
const fail = issue => issues.push(issue);
const issues = [];

const titans = read('data/titans.json');
const prompts = read('data/art-prompts.json').filter(prompt => prompt.category === 'Titan');
const audit = read('data/titan-art-identity-audit.json');
const factions = read('data/factions.json');
const factionIds = new Set(factions.map(f => f.id));
const promptByEntity = new Map(prompts.map(prompt => [prompt.entityId, prompt]));
const auditByTitan = new Map((audit.entries || []).map(entry => [entry.titanId, entry]));
const allowedStatuses = new Set(['PASS', 'REFINE', 'REDESIGN']);
const requiredPromptTokens = [
  'Titan name:',
  'Titan title:',
  'Sex:',
  'Faction:',
  'Mythology:',
  'Extradimensional realm:',
  'Civilization:',
  'Culture rule:',
  'Titan DNA:',
  'Realm-shaped species/anatomical traits:',
  'Individual face:',
  'Body proportions:',
  'Civilization role:',
  'Combat philosophy:',
  'Signature weapon:',
  'Armor identity:',
  'Cultural symbols/materials:',
  'Pose and expression:',
  'Environment and lighting:',
  'Art style:'
];
const negativeTokens = [
  'same-face reuse',
  'same body template',
  'generic fantasy warrior',
  'generic faction armor',
  'color-swap character',
  'interchangeable masks',
  'anime',
  'robot',
  'mech'
];

if (audit.status !== 'IMPLEMENTED') fail('Titan art identity audit must be IMPLEMENTED');
if (!Array.isArray(audit.entries) || audit.entries.length !== titans.length) fail(`Audit entry coverage mismatch: ${audit.entries?.length || 0}/${titans.length}`);
if (prompts.length !== titans.length) fail(`Titan prompt coverage mismatch: ${prompts.length}/${titans.length}`);

const seenFaces = new Map();
const seenBodies = new Map();
const seenWeapons = new Map();
let femaleCount = 0;
let maleCount = 0;
for (const titan of titans) {
  if (!factionIds.has(titan.factionId)) fail(`${titan.id}: invalid factionId`);
  if (!['Male', 'Female'].includes(titan.sex)) fail(`${titan.id}: missing explicit sex`);
  if (titan.sex === 'Female') femaleCount += 1;
  if (titan.sex === 'Male') maleCount += 1;
  if (!titan.titanArtDna) fail(`${titan.id}: missing titanArtDna`);
  for (const field of ['mythology','realm','civilization','cultureRule','beautyStandard','realmAnatomy','identityFace','identityBody','roleSilhouette','signatureWeapon','auditStatus']) {
    if (!titan.titanArtDna?.[field]) fail(`${titan.id}: titanArtDna missing ${field}`);
  }
  const prompt = promptByEntity.get(titan.id);
  if (!prompt) fail(`${titan.id}: missing Titan art prompt`);
  else {
    if (prompt.sex !== titan.sex) fail(`${titan.id}: prompt sex mismatch`);
    if (!allowedStatuses.has(prompt.artIdentityAuditStatus)) fail(`${titan.id}: invalid prompt audit status`);
    for (const token of requiredPromptTokens) if (!prompt.prompt.includes(token)) fail(`${titan.id}: prompt missing token ${token}`);
    if (!prompt.prompt.includes(titan.name)) fail(`${titan.id}: prompt missing Titan name`);
    if (!prompt.prompt.includes(titan.faction)) fail(`${titan.id}: prompt missing faction`);
    if (!prompt.prompt.includes(titan.role)) fail(`${titan.id}: prompt missing role`);
    if (!prompt.prompt.includes(titan.titanArtDna.signatureWeapon)) fail(`${titan.id}: prompt missing signature weapon`);
    if (titan.sex === 'Female' && !/Female identity must be unmistakable|feminine facial anatomy|waist-to-hip/i.test(prompt.prompt)) fail(`${titan.id}: female prompt missing explicit feminine design language`);
    if (titan.sex === 'Male' && !/Male identity must be unmistakable|masculine facial anatomy/i.test(prompt.prompt)) fail(`${titan.id}: male prompt missing explicit masculine design language`);
    for (const token of negativeTokens) if (!prompt.negativePrompt.includes(token)) fail(`${titan.id}: negative prompt missing ${token}`);
    if (!exists(`art/prompts/${prompt.id}.json`)) fail(`${titan.id}: missing individual prompt file ${prompt.id}`);
  }
  const entry = auditByTitan.get(titan.id);
  if (!entry) fail(`${titan.id}: missing audit entry`);
  else {
    for (const field of ['status','loreConnection','individuality','sexualIdentity','problems','revisedArtPrompt','recommendedNextStep']) if (!entry[field] || (Array.isArray(entry[field]) && !entry[field].length)) fail(`${titan.id}: audit entry missing ${field}`);
    if (!allowedStatuses.has(entry.status)) fail(`${titan.id}: invalid audit status ${entry.status}`);
    if (entry.sex !== titan.sex) fail(`${titan.id}: audit sex mismatch`);
  }
  const face = titan.titanArtDna?.identityFace;
  const body = titan.titanArtDna?.identityBody;
  const weapon = titan.titanArtDna?.signatureWeapon;
  if (face) seenFaces.set(face, (seenFaces.get(face) || 0) + 1);
  if (body) seenBodies.set(body, (seenBodies.get(body) || 0) + 1);
  if (weapon) seenWeapons.set(weapon, (seenWeapons.get(weapon) || 0) + 1);
}
const factionSexCounts = new Map();
for (const titan of titans) {
  const key = `${titan.factionId}:${titan.sex}`;
  factionSexCounts.set(key, (factionSexCounts.get(key) || 0) + 1);
}
for (const faction of factions) {
  if ((factionSexCounts.get(`${faction.id}:Male`) || 0) !== 2) fail(`${faction.name}: must have exactly 2 male god-Titans`);
  if ((factionSexCounts.get(`${faction.id}:Female`) || 0) !== 2) fail(`${faction.name}: must have exactly 2 female god-Titans`);
}
if (femaleCount !== 14) fail(`Female god-Titan count must be 14: ${femaleCount}`);
if (maleCount !== 14) fail(`Male god-Titan count must be 14: ${maleCount}`);
for (const [weapon, count] of seenWeapons.entries()) if (count > 1) fail(`Signature weapon reused: ${weapon}`);
if ((audit.summary?.pass || 0) + (audit.summary?.refine || 0) + (audit.summary?.redesign || 0) !== titans.length) fail('Audit summary status counts do not cover all Titans');
if (!audit.summary?.highestPriorityTitanId || !auditByTitan.has(audit.summary.highestPriorityTitanId)) fail('Highest-priority Titan recommendation missing or invalid');
if (!exists('docs/lore/TITAN_ART_IDENTITY_AUDIT.md')) fail('Missing Markdown art identity audit document');

const result = {
  ok: issues.length === 0,
  titanArtIdentityAudit: issues.length === 0 ? 'PASS' : 'FAIL',
  summary: {
    titans: titans.length,
    prompts: prompts.length,
    auditEntries: audit.entries?.length || 0,
    pass: audit.summary?.pass || 0,
    refine: audit.summary?.refine || 0,
    redesign: audit.summary?.redesign || 0,
    female: femaleCount,
    male: maleCount,
    highestPriorityTitanId: audit.summary?.highestPriorityTitanId
  },
  issues
};
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
