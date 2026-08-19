import fs from 'node:fs';

export const MOBILE_FIRST_PIPELINE = Object.freeze(['Region', 'Zone', 'Terrain', 'Structures', 'Props', 'Exploration Paths', 'Combat Arena', 'Enemies', 'Objectives', 'Lighting', 'Optimization', 'Final Polish']);
export const REQUIRED_APPROVAL_TESTS = Object.freeze(['Deity scale', 'Exploration', 'Combat', 'Camera', 'Controls', 'Loading', 'Memory', 'FPS', 'Asset streaming', 'Visual quality', 'Mobile performance', 'Lore consistency']);
export const REQUIRED_MOBILE_OPTIMIZATION = Object.freeze(['LODs', 'culling', 'texture streaming', 'efficient materials', 'controlled draw calls', 'optimized collision', 'efficient animations', 'optimized Niagara effects', 'asset streaming', 'controlled enemy counts', 'efficient lighting', 'scalable quality settings']);

export function loadMobileFirstArchitecture() {
  return JSON.parse(fs.readFileSync('engine/unreal/mobile-first-architecture.json', 'utf8'));
}

export function validateMobileFirstArchitecture(contract, framework, firstTemplate) {
  const issues = [];
  if (contract.primaryTarget?.engine !== 'Unreal Engine 5') issues.push('mobile-first contract must target Unreal Engine 5');
  for (const platform of ['Android', 'iOS']) if (!contract.primaryTarget?.platforms?.includes(platform)) issues.push(`missing mobile platform: ${platform}`);
  if (!/Mobile hardware is the baseline/i.test(contract.primaryTarget?.rule || '')) issues.push('primary target must declare mobile hardware as baseline');
  if (!contract.negativeRules?.some(rule => /Do not build a PC\/console version first/i.test(rule))) issues.push('contract must block high-end-first production');
  if (!contract.negativeRules?.some(rule => /generic corridor/i.test(rule))) issues.push('contract must block generic corridor dungeons');
  if (contract.mobilePerformanceBudgets?.maxDynamicLightsMobile !== 0) issues.push('baseline mobile dynamic lights must be zero');
  if (contract.mobilePerformanceBudgets?.targetFps < 30) issues.push('baseline FPS target must be at least 30');
  if (contract.mobilePerformanceBudgets?.maxActiveCombatEnemiesStandard > 6) issues.push('standard active enemy count must stay controlled for mobile');
  if (!contract.scalableQualityTiers?.some(tier => tier.tier === 'STANDARD' && /baseline Android\/iOS/i.test(tier.target))) issues.push('STANDARD tier must target baseline Android/iOS');
  if (!contract.titanOptimization?.mandate?.includes('not computational waste')) issues.push('Deity optimization mandate must preserve scale without waste');
  for (const step of MOBILE_FIRST_PIPELINE) if (!contract.generationPipeline?.includes(step)) issues.push(`missing generation step: ${step}`);
  for (const test of REQUIRED_APPROVAL_TESTS) if (!contract.firstImplementationGate?.approvalTests?.includes(test)) issues.push(`missing first-zone approval test: ${test}`);
  for (const item of REQUIRED_MOBILE_OPTIMIZATION) if (!framework.mobileOptimization?.includes(item)) issues.push(`framework missing mobile optimization: ${item}`);
  if (framework.mobileFirstMandate?.linkedContract !== 'engine/unreal/mobile-first-architecture.json') issues.push('framework must link mobile-first contract');
  if (firstTemplate.prototypeLock?.nextZoneAllowed !== false) issues.push('first template must block next-zone expansion until approved');
  for (const key of ['controls', 'loading', 'memory', 'fps', 'assetStreaming']) if (!firstTemplate.validationChecklist?.[key]?.length) issues.push(`first template missing validation checklist: ${key}`);
  if (firstTemplate.mobileBudgets?.maxDynamicLightsMobile !== 0) issues.push('first template mobile budget must use zero dynamic lights baseline');
  return { ok: issues.length === 0, issues };
}

export function mobileFirstSummary(contract, firstTemplate) {
  return {
    engine: contract.primaryTarget.engine,
    platforms: contract.primaryTarget.platforms,
    targetFps: contract.mobilePerformanceBudgets.targetFps,
    qualityTiers: contract.scalableQualityTiers.length,
    firstMission: contract.firstImplementationGate.sourceMissionId,
    expansionLocked: firstTemplate.prototypeLock.nextZoneAllowed === false,
    approvalTests: contract.firstImplementationGate.approvalTests.length,
    generationStages: contract.generationPipeline.length
  };
}
