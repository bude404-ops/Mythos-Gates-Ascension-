import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const fail = issues => {
  console.error(JSON.stringify({ ok: false, mythosGatesDungeonRoutes: 'FAIL', issues }, null, 2));
  process.exit(1);
};

const registry = read('data/mythos-gates-dungeon-route-registry.json');
const realms = read('data/realm-codex.json');
const realmIds = new Set(realms.map(realm => realm.id));
const factionIds = new Set(realms.map(realm => realm.factionId));
const issues = [];

if (registry.name !== 'Mythos Gates Dungeon Route Registry') issues.push('Registry name must remain Mythos Gates Dungeon Route Registry.');
if (registry.chapter !== 'Ascension') issues.push('Registry chapter must identify Ascension as the current chapter.');
if (!Array.isArray(registry.routes) || registry.routes.length !== 7) issues.push('Registry must contain exactly 7 dungeon routes.');

const seenRealms = new Set();
const seenFactions = new Set();
const seenIds = new Set();

for (const route of registry.routes || []) {
  const prefix = route.id || route.name || 'UNKNOWN_ROUTE';
  if (seenIds.has(route.id)) issues.push(`${prefix}: duplicate route id.`);
  seenIds.add(route.id);
  if (!route.id?.startsWith('MG-DUNGEON-ROUTE-')) issues.push(`${prefix}: route id must use MG-DUNGEON-ROUTE prefix.`);
  if (route.universe !== 'Mythos Gates') issues.push(`${prefix}: universe must be Mythos Gates.`);
  if (route.chapter !== 'Ascension') issues.push(`${prefix}: chapter must be Ascension.`);
  if (!realmIds.has(route.sourceRealmId)) issues.push(`${prefix}: sourceRealmId must exist in realm-codex.`);
  if (!factionIds.has(route.factionId)) issues.push(`${prefix}: factionId must exist in realm-codex.`);
  seenRealms.add(route.sourceRealmId);
  seenFactions.add(route.factionId);
  if (!route.entryGate?.includes('Gate')) issues.push(`${prefix}: entryGate must identify an established Gate.`);
  if (!route.gateState?.match(/Stable|Ruin|Distortion|Sealed|Wound/i)) issues.push(`${prefix}: gateState must classify the route by an established Gate state.`);
  if (route.playerModel?.activePlayableDeities !== 1) issues.push(`${prefix}: playerModel must enforce one active playable deity.`);
  const partyRules = route.playerModel?.partyRules || [];
  for (const rule of ['no armies', 'no squads', 'no simultaneous multi-character party']) {
    if (!partyRules.includes(rule)) issues.push(`${prefix}: missing party rule ${rule}.`);
  }
  const rooms = route.routeStructure?.roomGraph || [];
  if (rooms.length < 7) issues.push(`${prefix}: route must contain at least 7 room nodes.`);
  if (!rooms.some(room => room.nodeType === 'boss')) issues.push(`${prefix}: route must contain a boss node.`);
  if (!rooms.some(room => room.branching)) issues.push(`${prefix}: route must contain at least one branching node.`);
  if (!Array.isArray(route.hazards) || route.hazards.length < 3) issues.push(`${prefix}: route must include at least 3 Realm hazards.`);
  if (!Array.isArray(route.treasureRooms) || route.treasureRooms.length < 1) issues.push(`${prefix}: route must include a treasure room.`);
  if (!Array.isArray(route.loreRevealChain) || route.loreRevealChain.length < 3) issues.push(`${prefix}: route must include at least 3 lore reveals.`);
  if (!route.encounters?.eliteEncounter) issues.push(`${prefix}: route must include an elite encounter.`);
  if (!route.encounters?.bossEncounter) issues.push(`${prefix}: route must include a boss encounter.`);
  if (!route.artDirection?.avoid?.includes('sci-fi portal treatment')) issues.push(`${prefix}: art direction must explicitly reject sci-fi portal treatment.`);
}

if (seenRealms.size !== realms.length) issues.push(`Routes must cover all 7 Realms; covered ${seenRealms.size}.`);
if (seenFactions.size !== realms.length) issues.push(`Routes must cover all 7 factions; covered ${seenFactions.size}.`);

if (issues.length) fail(issues);
console.log(JSON.stringify({
  ok: true,
  mythosGatesDungeonRoutes: 'PASS',
  routes: registry.routes.length,
  realmsCovered: seenRealms.size,
  factionsCovered: seenFactions.size,
  activePlayableDeitiesPerRun: 1
}, null, 2));
