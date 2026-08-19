import fs from 'node:fs';

export const REQUIRED_UE5_SYSTEMS = Object.freeze(['World Partition when it provides real mobile loading benefit', 'Level Instances', 'Data Assets', 'Blueprint systems', 'Modular Actor Components', 'Niagara', 'Material Instances', 'Data Tables']);
export const REQUIRED_STAGE_ORDER = Object.freeze(['Region', 'Zone', 'Terrain', 'Structures', 'Props', 'Exploration paths', 'Combat arenas', 'Enemy placement', 'Lighting', 'Optimization', 'Final polish']);
export const REQUIRED_CONTENT_FOLDERS = Object.freeze(['Deities/', 'Characters/', 'Creatures/', 'Environments/', 'Gates/', 'Effects/', 'Materials/', 'UI/', 'Audio/']);

export function loadUe5DungeonFramework() {
  return JSON.parse(fs.readFileSync('engine/unreal/dungeon-crawler-framework.json', 'utf8'));
}

export function loadFirstMissionZoneTemplate() {
  return JSON.parse(fs.readFileSync('engine/unreal/first-mission-zone-template.json', 'utf8'));
}

export function validateUe5DungeonFramework(framework, firstTemplate, sourceMission, sourceFaction) {
  const issues = [];
  if (framework.primaryEngine !== 'Unreal Engine 5') issues.push('framework must target Unreal Engine 5 as primary engine');
  for (const system of REQUIRED_UE5_SYSTEMS) if (!framework.unrealSystems?.includes(system)) issues.push(`missing required UE5 system: ${system}`);
  for (const folder of REQUIRED_CONTENT_FOLDERS) if (!framework.assetPipeline?.folders?.includes(folder)) issues.push(`missing Content folder mapping: ${folder}`);
  if (framework.deityScaleRules?.standardCombatActiveAvatars !== 1) issues.push('standard combat must preserve one active deity');
  if (JSON.stringify(framework.aiGenerationStages) !== JSON.stringify(REQUIRED_STAGE_ORDER)) issues.push('AI generation stages must remain ordered and piecewise');
  if (firstTemplate.sourceMissionId !== sourceMission?.id) issues.push('first template must point at the first existing mission');
  if (firstTemplate.sourceFactionId !== sourceMission?.factionId) issues.push('first template faction must match source mission');
  if (firstTemplate.sourceFactionId !== sourceFaction?.id) issues.push('first template faction must resolve to Aten Ra');
  if (!firstTemplate.tacticalArena?.combatRulesPreserved?.includes('one active deity')) issues.push('first tactical arena must preserve one-active-deity combat');
  if (!firstTemplate.explorationZone?.mobileRules?.some(rule => /no unnecessary open world/i.test(rule))) issues.push('first zone must preserve lightweight non-open-world mobile scope');
  for (const loreToken of ['Aten hand-rays', 'Ma’at scale geometry', 'electrum', 'faience turquoise', 'lapis', 'obsidian', 'Nile-black silt glass', 'Red Land jasper']) {
    if (!firstTemplate.validationChecklist?.loreAccuracy?.includes(loreToken)) issues.push(`first template missing lore token: ${loreToken}`);
  }
  if (!/no canonical boss/i.test(firstTemplate.bossArena?.bossDesignNote || '')) issues.push('boss arena must not rewrite the source mission boss canon');
  return { ok: issues.length === 0, issues };
}

export function ue5DungeonSummary(framework, firstTemplate) {
  return {
    engine: framework.primaryEngine,
    coreLoopSteps: framework.coreLoop.length,
    unrealSystems: framework.unrealSystems.length,
    contentFolders: framework.assetPipeline.folders.length,
    firstMission: firstTemplate.sourceMissionId,
    dataAssets: firstTemplate.unrealDataAssets.length,
    blueprintActors: firstTemplate.blueprintActors.length,
    dataTables: firstTemplate.dataTables.length,
    aiStages: framework.aiGenerationStages.length
  };
}
