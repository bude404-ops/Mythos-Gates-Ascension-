import fs from 'node:fs';

const read = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const doctrine = read('data/combat-first-gameplay-doctrine.json');
const framework = read('data/gameplay-balance-framework.json');
const solo = read('data/solo-combat-design-document.json');
const slice = read('data/solo-vertical-slice.json');
const missionProfiles = read('data/mission-tactical-profile-system.json');
const raid = read('data/raid-system.json');
const progression = read('data/progression-system.json');
const titans = read('data/titans.json');
const html = fs.readFileSync('mini-app/titan-gates-ascension.html', 'utf8');

const issues = [];
const warnings = [];
const hasText = (obj, terms) => {
  const text = JSON.stringify(obj).toLowerCase();
  return terms.every((term) => text.includes(term.toLowerCase()));
};
const push = (arr, code, detail) => arr.push({ code, detail });

if (!doctrine.corePrinciple?.toLowerCase().includes('fighting is the hook')) push(issues, 'MISSING_CORE_PRINCIPLE', 'Combat-first core principle is absent.');
if ((doctrine.combatLoop || []).length < 10 || doctrine.combatLoop[0] !== 'Choose Titans') push(issues, 'BROKEN_COMBAT_LOOP', 'Combat loop must start at Titan choice and return to battle.');
if (doctrine.developmentPriority?.[0] !== 'Combat feel') push(issues, 'WRONG_PRIORITY_ORDER', 'Development priority must put combat feel first.');
if (!framework.combatFirstDoctrine || !framework.directive?.toLowerCase().includes('combat-first')) push(issues, 'FRAMEWORK_NOT_BOUND', 'Balance framework is not bound to combat-first doctrine.');
if (!hasText(framework, ['battle', 'titan', 'positioning', 'progression'])) push(issues, 'FRAMEWORK_TOO_ABSTRACT', 'Framework does not keep battle/Titan/positioning/progression in focus.');
if (!hasText(solo, ['movement', 'attacks', 'momentum', 'terrain', 'enemyAI'])) push(issues, 'SOLO_COMBAT_MISSING_CORE_HOOKS', 'Solo combat design lacks core battle hooks.');
if (!hasText(slice, ['battlefield', 'bossEncounter', 'telemetryContract'])) push(issues, 'VERTICAL_SLICE_NOT_BATTLE_FIRST', 'Vertical slice does not center battlefield/boss/telemetry.');
if (!hasText(missionProfiles, ['tactical', 'role', 'objective'])) push(issues, 'MISSIONS_NOT_TACTICAL', 'Mission profile system lacks tactical role/objective framing.');
if (!hasText(raid, ['stageProfiles', 'bosses'])) push(issues, 'RAIDS_NOT_COMBAT_STRUCTURED', 'Raid system lacks stage/boss combat structure.');
if (!hasText(progression, ['combat', 'roster', 'battle'])) push(warnings, 'PROGRESSION_LANGUAGE_WEAK', 'Progression should explicitly sell return-to-battle value.');

let weakTitans = 0;
for (const titan of titans) {
  const text = JSON.stringify(titan).toLowerCase();
  const hasAbility = Array.isArray(titan.abilities) || text.includes('ability') || text.includes('passive');
  const hasRole = Boolean(titan.role || titan.archetype || text.includes('role'));
  const hasCombatWords = ['range','mobility','control','damage','guard','burst','sustain','terrain','momentum','divinity','attack'].some((w)=>text.includes(w));
  if (!(hasAbility && hasRole && hasCombatWords)) weakTitans += 1;
}
if (weakTitans > 0) push(issues, 'TITAN_IDENTITY_WEAK', `${weakTitans} Titans appear weakly differentiated by combat identity.`);

const playableIdx = html.indexOf('function renderPlayable');
const balanceIdx = html.indexOf('function renderBalanceLab');
const titanIdx = html.indexOf('function renderTitanLab');
if (playableIdx < 0) push(issues, 'PLAYABLE_OPS_MISSING', 'Panel must keep playable battle projection visible.');
if (balanceIdx < 0) push(issues, 'BALANCE_LAB_MISSING', 'Panel must expose combat-first balance guidance.');
if (titanIdx < 0) push(issues, 'TITAN_LAB_MISSING', 'Panel must expose Titan identity.');
if (playableIdx > balanceIdx && balanceIdx > 0) push(warnings, 'COMBAT_VIEW_AFTER_BALANCE', 'Playable Ops appears after Balance Lab in markup; keep combat surfaces prominent in navigation.');
for (const term of ['THE FIGHTING IS THE HOOK','Combat-First','Titan battle','Big Combat Moment']) {
  if (!html.toLowerCase().includes(term.toLowerCase())) push(issues, 'PANEL_MISSING_COMBAT_FIRST_COPY', `Panel missing combat-first signal: ${term}`);
}

const ok = issues.length === 0;
console.log(JSON.stringify({
  ok,
  issueCount: issues.length,
  warningCount: warnings.length,
  checked: {
    combatLoopSteps: doctrine.combatLoop?.length || 0,
    developmentPriorities: doctrine.developmentPriority?.length || 0,
    acceptanceGates: doctrine.acceptanceGates?.length || 0,
    titans: titans.length,
    bigMomentTargets: doctrine.bigMomentTargets?.length || 0
  },
  issues,
  warnings
}, null, 2));
if (!ok) process.exit(1);
