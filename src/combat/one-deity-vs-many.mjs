import fs from 'node:fs';

export const PRIMARY_ONE_TITAN_RULE = 'ONE_PLAYER_CONTROLLED_TITAN_PER_BATTLE';
export const FORBIDDEN_COMBAT_PATTERNS = Object.freeze(['squad combat', 'team formations', 'multiple player-controlled Titans', 'ally positioning', 'team turns']);
export const REQUIRED_PROTOTYPE_BEATS = Object.freeze(['Exploration', 'Encounter trigger', 'Combat transition', 'Multiple enemies', 'Titan AoE attacks', 'Tactical movement', 'Enemy AI', 'Divine Abilities', 'Victory', 'Rewards', 'Divine Ascension', 'Gear improvement', 'Return to exploration']);
export const REQUIRED_VISIBLE_PROGRESSION = Object.freeze(['larger AoE coverage', 'shorter cooldowns', 'group clear speed improves']);
export const REQUIRED_ENEMY_ROLES = Object.freeze(['melee attackers', 'ranged attackers', 'fast enemies', 'support enemies', 'elite enemies', 'bosses']);

export function loadOneTitanVsManyCombat() {
  return JSON.parse(fs.readFileSync('data/one-deity-vs-many-combat.json', 'utf8'));
}

export function validateOneTitanVsManyCombat(contract, mission, mobileArchitecture, firstTemplate) {
  const issues = [];
  if (contract.primaryRule !== PRIMARY_ONE_TITAN_RULE) issues.push('primary combat rule must be one player-controlled Titan per battle');
  for (const pattern of FORBIDDEN_COMBAT_PATTERNS) if (!contract.forbiddenSystems?.includes(pattern)) issues.push(`missing forbidden combat pattern: ${pattern}`);
  if (!contract.combatLoop?.includes('1 Titan vs. Multiple Enemies')) issues.push('combat loop must include 1 Titan vs. Multiple Enemies');
  for (const role of REQUIRED_ENEMY_ROLES) if (!contract.enemyGroupDesign?.roles?.includes(role)) issues.push(`missing enemy tactical role: ${role}`);
  if (!/health pools/i.test(contract.enemyGroupDesign?.antiPattern || '')) issues.push('enemy design must forbid inflated health-pool difficulty');
  for (const beat of REQUIRED_PROTOTYPE_BEATS) if (!contract.firstPrototype?.requiredDemonstration?.includes(beat)) issues.push(`first prototype missing beat: ${beat}`);
  for (const visible of REQUIRED_VISIBLE_PROGRESSION) if (!contract.powerProgression?.visibleGameplayOutcomes?.includes(visible)) issues.push(`visible progression missing: ${visible}`);
  if (mission.activeTitanCount !== 1 || mission.teamSize !== 1) issues.push('first mission must remain exactly one active deity/team size 1');
  if (mission.activeTitanPolicy?.standardCombat !== PRIMARY_ONE_TITAN_RULE) issues.push('first mission activeTitanPolicy must use one player-controlled Titan');
  if (!mission.specialRules?.some(rule => /one (active|player-controlled) Titan/i.test(rule))) issues.push('first mission must preserve one active/player-controlled Titan special rule');
  if (mobileArchitecture.combatRule?.contract !== 'data/one-deity-vs-many-combat.json') issues.push('mobile architecture must link one-deity combat contract');
  if (mobileArchitecture.combatRule?.forbidSquads !== true) issues.push('mobile architecture must forbid squads');
  if (firstTemplate.combatIdentity?.playerControlledTitans !== 1) issues.push('first template must specify exactly one player-controlled Titan');
  if (!firstTemplate.validationChecklist?.oneTitanVsMany?.some(item => /no squads/i.test(item))) issues.push('first template must validate no squads or team turns');
  if (!firstTemplate.validationChecklist?.progressionFeel?.length) issues.push('first template must validate visible progression feel');
  const early = contract.scalingBands?.find(band => band.band === 'EARLY');
  if (!early || early.enemyCountRange?.[0] > 4 || early.enemyCountRange?.[1] < 6) issues.push('early scaling must target 4-6 enemy pressure');
  return { ok: issues.length === 0, issues };
}

export function summarizeOneTitanVsMany(contract, firstTemplate) {
  const early = contract.scalingBands.find(band => band.band === 'EARLY');
  return {
    rule: contract.primaryRule,
    forbiddenSystems: contract.forbiddenSystems.length,
    enemyRoles: contract.enemyGroupDesign.roles.length,
    scalingBands: contract.scalingBands.length,
    earlyEnemyRange: early.enemyCountRange,
    prototypeBeats: contract.firstPrototype.requiredDemonstration.length,
    firstMission: contract.firstPrototype.sourceMissionId,
    templatePlayerTitans: firstTemplate.combatIdentity.playerControlledTitans
  };
}
