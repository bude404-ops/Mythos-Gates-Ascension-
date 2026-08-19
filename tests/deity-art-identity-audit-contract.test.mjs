import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const deitys = read('data/deitys.json');
const audit = read('data/deity-art-identity-audit.json');
const prompts = read('data/art-prompts.json').filter(prompt => prompt.category === 'Deity');
const byDeity = new Map(deitys.map(deity => [deity.id, deity]));
const promptByDeity = new Map(prompts.map(prompt => [prompt.entityId, prompt]));

assert.equal(audit.status, 'IMPLEMENTED');
assert.equal(audit.entries.length, deitys.length);
assert.equal(prompts.length, deitys.length);
assert.equal(audit.summary.totalDeities, deitys.length);
assert.equal(audit.summary.pass, deitys.length, 'resolution pass should leave every deity production-ready');
assert.equal(audit.summary.refine, 0, 'no borderline designs should remain after resolution pass');
assert.equal(audit.summary.redesign, 0, 'no failed generic identities should remain after resolution pass');
assert.equal(deitys.length, 28, 'deity playable roster must be 28 total');
assert.equal(audit.summary.female, 14, 'female deity coverage must be 14');
assert.equal(audit.summary.male, 14, 'male deity coverage must be 14');
const factionSexCounts = new Map();
for (const deity of deitys) {
  const key = `${deity.factionId}:${deity.sex}`;
  factionSexCounts.set(key, (factionSexCounts.get(key) || 0) + 1);
}
for (const factionId of new Set(deitys.map(deity => deity.factionId))) {
  assert.equal(factionSexCounts.get(`${factionId}:Male`), 2, `${factionId}: must have 2 male deities`);
  assert.equal(factionSexCounts.get(`${factionId}:Female`), 2, `${factionId}: must have 2 female deities`);
}

for (const entry of audit.entries) {
  const deity = byDeity.get(entry.deityId);
  assert.ok(deity, `${entry.deityId}: missing deity`);
  const prompt = promptByDeity.get(entry.deityId);
  assert.ok(prompt, `${entry.deityId}: missing prompt`);
  assert.equal(deity.sex, entry.sex);
  assert.equal(prompt.sex, entry.sex);
  assert.equal(prompt.artIdentityAuditStatus, entry.status);
  assert.ok(prompt.prompt.startsWith(`Create a premium playable character depiction of ${deity.name},`), `${entry.deityId}: prompt missing required deity opening`);
  assert.ok(prompt.prompt.includes(`Sex: ${entry.sex}`), `${entry.deityId}: prompt missing explicit sex`);
  assert.ok(prompt.prompt.includes('Mythos Gates universe'), `${entry.deityId}: prompt missing realm`);
  assert.ok(prompt.prompt.includes('actual'), `${entry.deityId}: prompt missing DNA`);
  assert.ok(prompt.prompt.includes('Visual description to preserve exactly in spirit') || prompt.prompt.includes('Face lock:'), `${entry.deityId}: prompt missing face`);
  assert.ok(prompt.prompt.includes('Body lock:') || prompt.prompt.includes('Body proportions:'), `${entry.deityId}: prompt missing body proportions`);
  assert.ok(prompt.prompt.includes('Signature weapon:') || prompt.prompt.includes('Weapon:') || prompt.prompt.includes('Signature weapon lock:'), `${entry.deityId}: prompt missing signature weapon`);
  assert.ok(prompt.prompt.includes('approved Mythos Gates premium stylized tactical RPG aesthetic'), `${entry.deityId}: prompt missing approved style lock`);
  assert.ok(prompt.negativePrompt.includes('same-face reuse'), `${entry.deityId}: negative prompt missing anti-clone guard`);
  assert.ok(prompt.negativePrompt.includes('generic faction armor'), `${entry.deityId}: negative prompt missing generic armor guard`);
  assert.ok(deity.deityArtDna?.signatureWeapon, `${entry.deityId}: missing art DNA weapon`);
}

const highest = byDeity.get(audit.summary.highestPriorityDeityId);
assert.ok(highest, 'highest-priority deity must reference a real deity');
assert.equal(audit.summary.highestPriorityDeityId, 'TG-TITAN-010');

console.log(JSON.stringify({
  ok: true,
  deityArtIdentityAuditContract: 'PASS',
  deitys: deitys.length,
  prompts: prompts.length,
  pass: audit.summary.pass,
  refine: audit.summary.refine,
  redesign: audit.summary.redesign,
  female: audit.summary.female,
  male: audit.summary.male,
  highestPriorityDeityId: audit.summary.highestPriorityDeityId,
  highestPriorityName: highest.name
}, null, 2));
