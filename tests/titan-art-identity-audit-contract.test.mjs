import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const titans = read('data/titans.json');
const audit = read('data/titan-art-identity-audit.json');
const prompts = read('data/art-prompts.json').filter(prompt => prompt.category === 'Deity');
const byTitan = new Map(titans.map(titan => [titan.id, titan]));
const promptByTitan = new Map(prompts.map(prompt => [prompt.entityId, prompt]));

assert.equal(audit.status, 'IMPLEMENTED');
assert.equal(audit.entries.length, titans.length);
assert.equal(prompts.length, titans.length);
assert.equal(audit.summary.totalTitans, titans.length);
assert.equal(audit.summary.pass, titans.length, 'resolution pass should leave every deity production-ready');
assert.equal(audit.summary.refine, 0, 'no borderline designs should remain after resolution pass');
assert.equal(audit.summary.redesign, 0, 'no failed generic identities should remain after resolution pass');
assert.equal(titans.length, 28, 'deity playable roster must be 28 total');
assert.equal(audit.summary.female, 14, 'female deity coverage must be 14');
assert.equal(audit.summary.male, 14, 'male deity coverage must be 14');
const factionSexCounts = new Map();
for (const titan of titans) {
  const key = `${titan.factionId}:${titan.sex}`;
  factionSexCounts.set(key, (factionSexCounts.get(key) || 0) + 1);
}
for (const factionId of new Set(titans.map(titan => titan.factionId))) {
  assert.equal(factionSexCounts.get(`${factionId}:Male`), 2, `${factionId}: must have 2 male deities`);
  assert.equal(factionSexCounts.get(`${factionId}:Female`), 2, `${factionId}: must have 2 female deities`);
}

for (const entry of audit.entries) {
  const titan = byTitan.get(entry.titanId);
  assert.ok(titan, `${entry.titanId}: missing deity`);
  const prompt = promptByTitan.get(entry.titanId);
  assert.ok(prompt, `${entry.titanId}: missing prompt`);
  assert.equal(titan.sex, entry.sex);
  assert.equal(prompt.sex, entry.sex);
  assert.equal(prompt.artIdentityAuditStatus, entry.status);
  assert.ok(prompt.prompt.startsWith(`Create a premium playable character depiction of ${titan.name},`), `${entry.titanId}: prompt missing required deity opening`);
  assert.ok(prompt.prompt.includes('actual'), `${entry.titanId}: prompt missing actual mythology identity`);
  assert.ok(prompt.prompt.includes('Mythos Gates universe'), `${entry.titanId}: prompt missing Mythos Gates universe lock`);
  assert.ok(prompt.prompt.includes('not an ancient Mythos Gates giant'), `${entry.titanId}: prompt missing anti-Titan playable guard`);
  assert.ok(prompt.prompt.includes('approved Mythos Gates premium stylized tactical RPG aesthetic'), `${entry.titanId}: prompt missing approved style lock`);
  assert.ok(prompt.negativePrompt.includes('same-face reuse'), `${entry.titanId}: negative prompt missing anti-clone guard`);
  assert.ok(prompt.negativePrompt.includes('generic faction armor'), `${entry.titanId}: negative prompt missing generic armor guard`);
  assert.ok(titan.titanArtDna?.signatureWeapon, `${entry.titanId}: missing art DNA weapon`);
}

const highest = byTitan.get(audit.summary.highestPriorityTitanId);
assert.ok(highest, 'highest-priority deity must reference a real deity');
assert.equal(audit.summary.highestPriorityTitanId, 'TG-TITAN-010');

console.log(JSON.stringify({
  ok: true,
  deityArtIdentityAuditContract: 'PASS',
  titans: titans.length,
  prompts: prompts.length,
  pass: audit.summary.pass,
  refine: audit.summary.refine,
  redesign: audit.summary.redesign,
  female: audit.summary.female,
  male: audit.summary.male,
  highestPriorityTitanId: audit.summary.highestPriorityTitanId,
  highestPriorityName: highest.name
}, null, 2));
