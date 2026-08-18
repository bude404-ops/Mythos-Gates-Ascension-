import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const exists = file => fs.existsSync(path.join(root, file));
const fail = issue => issues.push(issue);
const issues = [];

const titans = read('data/titans.json');
<<<<<<< HEAD
const prompts = read('data/art-prompts.json').filter(prompt => prompt.category === 'Deity');
const audit = read('data/titan-art-identity-audit.json');
=======
const prompts = read('data/art-prompts.json').filter(prompt => prompt.category === 'Titan');
const audit = read('data/deity-art-identity-audit.json');
>>>>>>> 919bdc51 (Mythos Gates: Ascension — Full repo migration)
const factions = read('data/factions.json');
const factionIds = new Set(factions.map(f => f.id));
const promptByEntity = new Map(prompts.map(prompt => [prompt.entityId, prompt]));
const auditByTitan = new Map((audit.entries || []).map(entry => [entry.titanId, entry]));
const allowedStatuses = new Set(['PASS', 'REFINE', 'REDESIGN']);
const requiredPromptTokens = [
  'Create a premium playable character depiction of',
  'actual',
  'Mythos Gates universe',
  'not an ancient Mythos Gates giant',
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

<<<<<<< HEAD
if (audit.status !== 'IMPLEMENTED') fail('Deity art identity audit must be IMPLEMENTED');
=======
if (audit.status !== 'IMPLEMENTED') fail('deity art identity audit must be IMPLEMENTED');
>>>>>>> 919bdc51 (Mythos Gates: Ascension — Full repo migration)
if (!Array.isArray(audit.entries) || audit.entries.length !== titans.length) fail(`Audit entry coverage mismatch: ${audit.entries?.length || 0}/${titans.length}`);
if (prompts.length !== titans.length) fail(`Deity prompt coverage mismatch: ${prompts.length}/${titans.length}`);

const seenFaces = new Map();
const seenBodies = new Map();
const seenWeapons = new Map();
let femaleCount = 0;
let maleCount = 0;
<<<<<<< HEAD
for (const deity of titans) {
  if (!factionIds.has(deity.factionId)) fail(`${deity.id}: invalid factionId`);
  if (!['Male', 'Female'].includes(deity.sex)) fail(`${deity.id}: missing explicit sex`);
  if (deity.sex === 'Female') femaleCount += 1;
  if (deity.sex === 'Male') maleCount += 1;
  if (!deity.titanArtDna) fail(`${deity.id}: missing titanArtDna`);
  for (const field of ['mythology','realm','civilization','cultureRule','beautyStandard','realmAnatomy','identityFace','identityBody','roleSilhouette','signatureWeapon','auditStatus']) {
    if (!deity.titanArtDna?.[field]) fail(`${deity.id}: titanArtDna missing ${field}`);
  }
  const prompt = promptByEntity.get(deity.id);
  if (!prompt) fail(`${deity.id}: missing Deity art prompt`);
  else {
    if (prompt.sex !== deity.sex) fail(`${deity.id}: prompt sex mismatch`);
    if (!allowedStatuses.has(prompt.artIdentityAuditStatus)) fail(`${deity.id}: invalid prompt audit status`);
    for (const token of requiredPromptTokens) if (!prompt.prompt.includes(token)) fail(`${deity.id}: prompt missing token ${token}`);
    if (!prompt.prompt.includes(deity.name)) fail(`${deity.id}: prompt missing Deity name`);
    if (!prompt.prompt.includes(deity.faction)) fail(`${deity.id}: prompt missing faction`);
    if (!prompt.prompt.includes(deity.role)) fail(`${deity.id}: prompt missing role`);
    if (!prompt.prompt.includes(deity.titanArtDna.signatureWeapon)) fail(`${deity.id}: prompt missing signature weapon`);
    if (deity.sex === 'Female' && !/Female identity must be unmistakable|feminine facial anatomy|waist-to-hip/i.test(prompt.prompt)) fail(`${deity.id}: female prompt missing explicit feminine design language`);
    if (deity.sex === 'Male' && !/Male identity must be unmistakable|masculine facial anatomy/i.test(prompt.prompt)) fail(`${deity.id}: male prompt missing explicit masculine design language`);
    for (const token of negativeTokens) if (!prompt.negativePrompt.includes(token)) fail(`${deity.id}: negative prompt missing ${token}`);
    if (!exists(`art/prompts/${prompt.id}.json`)) fail(`${deity.id}: missing individual prompt file ${prompt.id}`);
=======
for (const titan of titans) {
  if (!factionIds.has(titan.factionId)) fail(`${titan.id}: invalid factionId`);
  if (!['Male', 'Female'].includes(titan.sex)) fail(`${titan.id}: missing explicit sex`);
  if (titan.sex === 'Female') femaleCount += 1;
  if (titan.sex === 'Male') maleCount += 1;
  if (!titan.deityArtDna) fail(`${titan.id}: missing deityArtDna`);
  for (const field of ['mythology','realm','civilization','cultureRule','beautyStandard','realmAnatomy','identityFace','identityBody','roleSilhouette','signatureWeapon','auditStatus']) {
    if (!titan.deityArtDna?.[field]) fail(`${titan.id}: deityArtDna missing ${field}`);
  }
  const prompt = promptByEntity.get(titan.id);
  if (!prompt) fail(`${titan.id}: missing deity art prompt`);
  else {
    if (prompt.sex !== titan.sex) fail(`${titan.id}: prompt sex mismatch`);
    if (!allowedStatuses.has(prompt.artIdentityAuditStatus)) fail(`${titan.id}: invalid prompt audit status`);
    for (const token of requiredPromptTokens) if (!prompt.prompt.includes(token)) fail(`${titan.id}: prompt missing token ${token}`);
    if (!prompt.prompt.includes(titan.name)) fail(`${titan.id}: prompt missing Titan name`);
    if (!prompt.prompt.includes(titan.faction)) fail(`${titan.id}: prompt missing faction`);
    if (!prompt.prompt.includes(titan.role)) fail(`${titan.id}: prompt missing role`);
    if (!prompt.prompt.includes(titan.deityArtDna.signatureWeapon)) fail(`${titan.id}: prompt missing signature weapon`);
    if (titan.sex === 'Female' && !/Female identity must be unmistakable|feminine facial anatomy|waist-to-hip/i.test(prompt.prompt)) fail(`${titan.id}: female prompt missing explicit feminine design language`);
    if (titan.sex === 'Male' && !/Male identity must be unmistakable|masculine facial anatomy/i.test(prompt.prompt)) fail(`${titan.id}: male prompt missing explicit masculine design language`);
    for (const token of negativeTokens) if (!prompt.negativePrompt.includes(token)) fail(`${titan.id}: negative prompt missing ${token}`);
    if (!exists(`art/prompts/${prompt.id}.json`)) fail(`${titan.id}: missing individual prompt file ${prompt.id}`);
>>>>>>> 919bdc51 (Mythos Gates: Ascension — Full repo migration)
  }
  const entry = auditByTitan.get(deity.id);
  if (!entry) fail(`${deity.id}: missing audit entry`);
  else {
    for (const field of ['status','loreConnection','individuality','sexualIdentity','problems','revisedArtPrompt','recommendedNextStep']) if (!entry[field] || (Array.isArray(entry[field]) && !entry[field].length)) fail(`${deity.id}: audit entry missing ${field}`);
    if (!allowedStatuses.has(entry.status)) fail(`${deity.id}: invalid audit status ${entry.status}`);
    if (entry.sex !== deity.sex) fail(`${deity.id}: audit sex mismatch`);
  }
<<<<<<< HEAD
  const face = deity.titanArtDna?.identityFace;
  const body = deity.titanArtDna?.identityBody;
  const weapon = deity.titanArtDna?.signatureWeapon;
=======
  const face = titan.deityArtDna?.identityFace;
  const body = titan.deityArtDna?.identityBody;
  const weapon = titan.deityArtDna?.signatureWeapon;
>>>>>>> 919bdc51 (Mythos Gates: Ascension — Full repo migration)
  if (face) seenFaces.set(face, (seenFaces.get(face) || 0) + 1);
  if (body) seenBodies.set(body, (seenBodies.get(body) || 0) + 1);
  if (weapon) seenWeapons.set(weapon, (seenWeapons.get(weapon) || 0) + 1);
}
const factionSexCounts = new Map();
for (const deity of titans) {
  const key = `${deity.factionId}:${deity.sex}`;
  factionSexCounts.set(key, (factionSexCounts.get(key) || 0) + 1);
}
for (const faction of factions) {
  if ((factionSexCounts.get(`${faction.id}:Male`) || 0) !== 2) fail(`${faction.name}: must have exactly 2 male deities`);
  if ((factionSexCounts.get(`${faction.id}:Female`) || 0) !== 2) fail(`${faction.name}: must have exactly 2 female deities`);
}
if (femaleCount !== 14) fail(`Female deity count must be 14: ${femaleCount}`);
if (maleCount !== 14) fail(`Male deity count must be 14: ${maleCount}`);
for (const [weapon, count] of seenWeapons.entries()) if (count > 1) fail(`Signature weapon reused: ${weapon}`);
<<<<<<< HEAD
if ((audit.summary?.pass || 0) + (audit.summary?.refine || 0) + (audit.summary?.redesign || 0) !== titans.length) fail('Audit summary status counts do not cover all Titans');
if (!audit.summary?.highestPriorityTitanId || !auditByTitan.has(audit.summary.highestPriorityTitanId)) fail('Highest-priority Deity recommendation missing or invalid');
=======
if ((audit.summary?.pass || 0) + (audit.summary?.refine || 0) + (audit.summary?.redesign || 0) !== titans.length) fail('Audit summary status counts do not cover all deities');
if (!audit.summary?.highestPriorityTitanId || !auditByTitan.has(audit.summary.highestPriorityTitanId)) fail('Highest-priority Titan recommendation missing or invalid');
>>>>>>> 919bdc51 (Mythos Gates: Ascension — Full repo migration)
if (!exists('docs/lore/TITAN_ART_IDENTITY_AUDIT.md')) fail('Missing Markdown art identity audit document');

const result = {
  ok: issues.length === 0,
  deityArtIdentityAudit: issues.length === 0 ? 'PASS' : 'FAIL',
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
