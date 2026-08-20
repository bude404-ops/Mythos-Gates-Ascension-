import fs from 'node:fs';

const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const asText = (v) => JSON.stringify(v);
const includesAny = (s, arr) => arr.some((x) => s.toLowerCase().includes(x.toLowerCase()));
const missingTerms = (s, arr) => arr.filter((x) => !s.toLowerCase().includes(x.toLowerCase()));
const sourcePattern = /source culture|source-culture|source cultures|humans later copied|Earth legend is (only )?the echo|Earth mythology is (only )?the later echo|Realm culture is the source|original source/i;
const oldScalePattern = /\b(one-active-Deity|one active deity?|three-Deity|one active deity?)\b/i;
const staleGenericPattern = /Low-tier gear component|not rewriting established Canon|distant pyramids|color language|museum version|generic RPG set dressing without faction/i;

const factionCanon = {
  'TG-FACTION-001': {
    name: 'Aten Ra',
    realm: ['Solar Dominion of Khepra', 'Khepra'],
    source: ['Egyptian solar myth'],
    anchors: ['Aten', 'Ma’at', 'Khepri', 'electrum', 'faience', 'lapis', 'obsidian'],
    gear: ['Ma’at was-sceptre', 'electrum wesekh', 'Khepri scarab', 'Uraeus'],
    avoidRegex: /Viking|Asgard|Olymp|Kami|Tuatha|Empyrean|Infernal|Norse|Greek|Japanese|Celtic|angelic|demonology/i,
  },
  'TG-FACTION-002': {
    name: 'Asgardian',
    realm: ['Storm-Rooted Aesir Holds', 'Aesir'],
    source: ['Norse saga myth'],
    anchors: ['rune', 'stormsteel', 'oath', 'Yggdrasil', 'Bifrost', 'Valkyrie', 'raven'],
    gear: ['rune-iron oath axe', 'stormsteel wolf-cloak', 'Yggdrasil thunder-root', 'Valkyrie'],
    avoidRegex: /Aten|Khepra|Olymp|Kami|Tuatha|Empyrean|Infernal|Egyptian|Greek|Japanese|Celtic|angelic|demonology/i,
  },
  'TG-FACTION-003': {
    name: 'Olympian',
    realm: ['Celestial Heights of Olympus', 'Olympus'],
    source: ['Greek divine court myth'],
    anchors: ['aegis', 'laurel', 'marble', 'bronze', 'oracle', 'ambrosia', 'Athena'],
    gear: ['aegis laurel spear', 'living marble bronze', 'oracle ambrosia', 'Athena'],
    avoidRegex: /Aten|Khepra|Asgard|Kami|Tuatha|Empyrean|Infernal|Egyptian|Norse|Japanese|Celtic|angelic|demonology/i,
  },
  'TG-FACTION-004': {
    name: 'Kami',
    realm: ['Sacred Kingdoms'],
    source: ['Japanese kami', 'Shinto shrine'],
    anchors: ['torii', 'shimenawa', 'shide', 'mirror', 'foxfire', 'magatama', 'kitsune'],
    gear: ['mirror-talisman spirit blade', 'lacquered shimenawa', 'foxfire magatama', 'kitsune'],
    avoidRegex: /Aten|Khepra|Asgard|Olymp|Tuatha|Empyrean|Infernal|Egyptian|Norse|Greek|Celtic|angelic|demonology/i,
  },
  'TG-FACTION-005': {
    name: 'Tuatha',
    realm: ['Avalora'],
    source: ['Celtic and Irish fae myth'],
    anchors: ['sídhe', 'silver branch', 'moon-oak', 'Dagda', 'Lugh', 'Morrígan', 'geas'],
    gear: ['Lugh silver-spear', 'moon-oak sídhe', 'Dagda cauldron', 'fae glamour'],
    avoidRegex: /Aten|Khepra|Asgard|Olymp|Kami|Empyrean|Infernal|Egyptian|Norse|Greek|Japanese|angelic|demonology/i,
  },
  'TG-FACTION-006': {
    name: 'Empyrean',
    realm: ['Radiant Hierarchies'],
    source: ['angelic hierarchy', 'heavenly myth'],
    anchors: ['seraph', 'cherubim', 'ophanim', 'many-eye', 'bell', 'opal glass', 'scroll'],
    gear: ['seraph bell-edict', 'opal-glass cherubim', 'ophanim many-eye', 'wheel intercept'],
    avoidRegex: /Aten|Khepra|Asgard|Olymp|Kami|Tuatha|Infernal|Egyptian|Norse|Greek|Japanese|Celtic|demonology/i,
  },
  'TG-FACTION-007': {
    name: 'Infernal Dominion',
    realm: ['Infernal Dominion'],
    source: ['hell', 'demonology', 'infernal contract'],
    anchors: ['Goetic', 'chain', 'volcanic glass', 'blood wax', 'contract', 'ledger', 'black iron'],
    gear: ['Goetic chain-crown', 'volcanic glass debtor', 'blood-wax infernal ledger', 'chain-lien'],
    avoidRegex: /Aten|Khepra|Asgard|Olymp|Kami|Tuatha|Empyrean|Egyptian|Norse|Greek|Japanese|Celtic|angelic hierarchy/i,
  },
};

const factions = read('data/factions.json');
const realmCodex = read('data/realm-codex.json');
const visualBible = read('data/faction-visual-bible.json');
const deitys = read('data/deitys.json');
const artPrompts = read('data/art-prompts.json');
const maps = read('data/maps.json');
const missions = read('data/mission-registry.json');
const missionDialogue = read('data/mission-dialogue.json');
const missionArtPackages = read('data/mission-art-packages.json');
const monetization = read('data/monetization-policy.json');
const battlefieldCanon = read('data/battlefield-canon-registry.json');
const soloRoster = read('data/solo-deity-roster-redesign.json').deities;
const balancePass = read('data/deity-enemy-balance-pass.json').deities;
const index = read('data/index.json');

const issues = [];
const warn = [];

function requireTerms(label, obj, terms, min=1) {
  const s = asText(obj);
  const hits = terms.filter((x) => s.toLowerCase().includes(x.toLowerCase()));
  if (hits.length < min) issues.push(`${label}: expected at least ${min} canon terms from [${terms.join(', ')}], found ${hits.length}`);
}
function forbid(label, obj, regex, why) {
  const s = asText(obj);
  const m = s.match(regex);
  if (m) issues.push(`${label}: forbidden ${why}: ${m[0]}`);
}
function requireSource(label, obj) {
  if (!sourcePattern.test(asText(obj))) issues.push(`${label}: missing source-culture / Earth-echo premise`);
}

// Global generated and sync checks.
if (index.counts?.factions !== 7) issues.push(`index: expected 7 factions, found ${index.counts?.factions}`);
if (index.counts?.deities !== 63) issues.push(`index: expected 28 deities, found ${index.counts?.deities}`);
if (index.counts?.missions !== 280) issues.push(`index: expected 280 missions, found ${index.counts?.missions}`);
if (index.counts?.missionDialogue !== 280) issues.push(`index: expected 280 mission dialogue, found ${index.counts?.missionDialogue}`);
if (index.counts?.missionArtPackages !== 280) issues.push(`index: expected 280 mission art packages, found ${index.counts?.missionArtPackages}`);

// Faction and core lore.
for (const f of factions) {
  const c = factionCanon[f.id];
  if (!c) { issues.push(`unknown faction ${f.id}`); continue; }
  const label = `${c.name} faction canon`;
  requireTerms(label, f, [...c.realm, ...c.source, ...c.anchors], 4);
  requireSource(label, f);
  forbid(label, f, staleGenericPattern, 'stale generic language');
}
for (const c of Object.values(factionCanon)) {
  requireTerms(`${c.name} realm codex`, realmCodex, [...c.realm, ...c.source, ...c.anchors], 4);
  requireTerms(`${c.name} visual bible`, visualBible, [...c.realm, ...c.anchors, ...c.gear], 5);
}

// Deities, prompts, solo roster, and balance.
for (const t of deitys) {
  const c = factionCanon[t.factionId];
  if (!c) { issues.push(`${t.id}: unknown faction ${t.factionId}`); continue; }
  requireTerms(`${t.id} deity`, t, [...c.anchors, ...c.gear], 5);
  requireSource(`${t.id} deity`, t);
  forbid(`${t.id} deity`, t, staleGenericPattern, 'stale generic language');
  forbid(`${t.id} deity`, t, oldScalePattern, 'old scale language');
  const prompt = artPrompts.find((p) => p.entityId === t.id || p.id?.includes(t.id));
  if (!prompt) issues.push(`${t.id}: missing art prompt`);
  else {
    requireSource(`${t.id} art prompt`, prompt);
    requireTerms(`${t.id} art prompt`, prompt, [...c.anchors, ...c.gear], 5);
    forbid(`${t.id} art prompt`, prompt, staleGenericPattern, 'stale generic language');
  }
  const solo = soloRoster.find((r) => r.id === t.id || r.deityId === t.id);
  if (!solo) issues.push(`${t.id}: missing solo roster row`);
  else requireTerms(`${t.id} solo roster`, solo, c.gear, 2);
  const bal = balancePass.find((r) => r.id === t.id || r.deityId === t.id);
  if (!bal) issues.push(`${t.id}: missing balance row`);
  else requireTerms(`${t.id} balance pass`, bal, c.gear, 2);
}

// Maps and map prompts.
for (const m of maps) {
  const c = factionCanon[m.factionId];
  if (!c) continue;
  requireTerms(`${m.id} map`, m, [...c.realm, ...c.anchors], 3);
  requireSource(`${m.id} map`, m);
  forbid(`${m.id} map`, m, staleGenericPattern, 'stale generic language');
}
for (const p of artPrompts.filter((p) => p.category === 'Map')) {
  requireSource(`${p.id} map prompt`, p);
  if (!/Battlefield cosmetics rule/i.test(asText(p))) issues.push(`${p.id} map prompt: missing battlefield cosmetics rule`);
  forbid(`${p.id} map prompt`, p, oldScalePattern, 'old scale language');
  forbid(`${p.id} map prompt`, p, staleGenericPattern, 'stale generic language');
}

// Missions, dialogue, art packages.
const missionIds = new Set(missions.map((m) => m.id));
for (const m of missions) {
  const c = factionCanon[m.factionId];
  if (!c) { issues.push(`${m.id}: unknown mission faction ${m.factionId}`); continue; }
  requireSource(`${m.id} mission`, m);
  requireTerms(`${m.id} mission`, m, [...c.realm, ...c.source, ...c.anchors, ...c.gear], 5);
  if (!m.sourceCultureAppearanceRule) issues.push(`${m.id} mission: missing sourceCultureAppearanceRule`);
  forbid(`${m.id} mission`, m, oldScalePattern, 'old scale language');
  forbid(`${m.id} mission`, m, staleGenericPattern, 'stale generic language');
}
for (const d of missionDialogue) {
  if (!missionIds.has(d.missionId)) issues.push(`${d.id}: dialogue missionId not found ${d.missionId}`);
  const c = factionCanon[d.factionId];
  if (!c) continue;
  requireSource(`${d.id} mission dialogue`, d);
  requireTerms(`${d.id} mission dialogue`, d, [...c.realm, ...c.source, ...c.gear], 3);
  if (!d.visualDirection) issues.push(`${d.id} mission dialogue: missing visualDirection`);
  forbid(`${d.id} mission dialogue`, d, oldScalePattern, 'old scale language');
  forbid(`${d.id} mission dialogue`, d, staleGenericPattern, 'stale generic language');
}
for (const p of missionArtPackages) {
  const c = factionCanon[p.factionId];
  if (!c) { issues.push(`${p.id}: unknown package faction ${p.factionId}`); continue; }
  const mid = p.missionId || p.id?.replace('-ART-', '-');
  requireSource(`${p.id} mission art package`, p);
  requireTerms(`${p.id} mission art package`, p, [...c.realm, ...c.source, ...c.anchors, ...c.gear], 6);
  if (!/one active deity scale/i.test(asText(p))) issues.push(`${p.id} mission art package: missing one active deity scale`);
  if (!/cosmetic|relic/i.test(asText(p))) issues.push(`${p.id} mission art package: missing cosmetic/relic language`);
  forbid(`${p.id} mission art package`, p, oldScalePattern, 'old scale language');
  forbid(`${p.id} mission art package`, p, staleGenericPattern, 'stale generic language');
}

// Cosmetic and battlefield policy.
requireSource('battlefield canon registry', battlefieldCanon);
if (!battlefieldCanon.sourceCultureAppearanceRule) issues.push('battlefield canon registry: missing sourceCultureAppearanceRule');
if (!monetization.sourceCultureCosmeticRule) issues.push('monetization policy: missing sourceCultureCosmeticRule');
forbid('battlefield canon registry', battlefieldCanon, oldScalePattern, 'old scale language');
forbid('monetization policy', monetization, oldScalePattern, 'old scale language');

const summary = {
  ok: issues.length === 0,
  issueCount: issues.length,
  warningCount: warn.length,
  checked: {
    factions: factions.length,
    deitys: deitys.length,
    artPrompts: artPrompts.length,
    maps: maps.length,
    missions: missions.length,
    missionDialogue: missionDialogue.length,
    missionArtPackages: missionArtPackages.length,
    soloRoster: soloRoster.length,
    balanceRows: balancePass.length,
  },
  issues: issues.slice(0, 120),
  warnings: warn.slice(0, 50),
};
console.log(JSON.stringify(summary, null, 2));
if (issues.length) process.exit(1);
