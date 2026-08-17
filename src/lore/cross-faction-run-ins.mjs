import fs from 'node:fs';

export const ONE_TITAN_RULE = 'ONE_PLAYER_CONTROLLED_TITAN_PER_BATTLE';
export const REQUIRED_MOBILE_LOOP = Object.freeze(['Explore', 'Encounter', '1 Titan vs. Multiple Enemies', 'Victory', 'Rewards', 'Upgrade Titan', 'Explore Further']);
export const FORBIDDEN_STANDARD_COMBAT = Object.freeze(['squad combat', 'team formations', 'multiple player-controlled Titans', 'ally positioning', 'team turns']);

export function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

export function validateCrossFactionCreaturePools({ factions, creatures, pools, missions, campaigns }) {
  const issues = [];
  const factionIds = new Set(factions.map(f => f.id));
  const creaturesById = new Map(creatures.map(c => [c.id, c]));
  const poolsBySource = new Map(pools.map(pool => [pool.sourceFactionId, pool]));
  const poolsById = new Map(pools.map(pool => [pool.id, pool]));

  for (const faction of factions) {
    const pool = poolsBySource.get(faction.id);
    if (!pool) {
      issues.push(`${faction.id} missing cross-faction run-in pool`);
      continue;
    }
    if (pool.creatureIds.length < 3) issues.push(`${pool.id} must include at least 3 faction run-in creatures`);
    if (pool.allowedAgainstFactionIds.includes(faction.id)) issues.push(`${pool.id} cannot be allowed against its own source faction`);
    for (const other of factions) if (other.id !== faction.id && !pool.allowedAgainstFactionIds.includes(other.id)) issues.push(`${pool.id} missing allowed opponent ${other.id}`);
    for (const creatureId of pool.creatureIds) {
      const creature = creaturesById.get(creatureId);
      if (!creature) {
        issues.push(`${pool.id} references missing creature ${creatureId}`);
        continue;
      }
      if (creature.sourceFactionId !== faction.id) issues.push(`${creature.id} sourceFactionId must match ${faction.id}`);
      if (creature.playable !== false) issues.push(`${creature.id} must be non-playable run-in creature`);
      if (!creature.encounterTags?.includes('cross-faction-event')) issues.push(`${creature.id} missing cross-faction-event tag`);
      if (!creature.loreGuardrails?.sourceCultureRule) issues.push(`${creature.id} missing source-culture lore guardrail`);
      if (!creature.balanceNotes?.includes('one Titan vs many')) issues.push(`${creature.id} must be tuned for one Titan vs many`);
      if (!creature.scaling?.eliteRemix?.includes('not raw health sponge')) issues.push(`${creature.id} scaling must reject raw health sponge tuning`);
    }
  }

  for (const mission of missions) {
    if (mission.activeTitanCount !== 1 || mission.teamSize !== 1) issues.push(`${mission.id} must remain one active Titan`);
    if (mission.activeTitanPolicy?.standardCombat !== ONE_TITAN_RULE) issues.push(`${mission.id} must use ${ONE_TITAN_RULE}`);
    if (mission.combatArchitecture?.playerControlledTitans !== 1) issues.push(`${mission.id} missing one-Titan combatArchitecture`);
    for (const step of REQUIRED_MOBILE_LOOP) if (!mission.combatArchitecture?.loop?.includes(step)) issues.push(`${mission.id} combatArchitecture missing loop step ${step}`);
    for (const forbidden of FORBIDDEN_STANDARD_COMBAT) if (!mission.combatArchitecture?.forbidden?.includes(forbidden)) issues.push(`${mission.id} missing forbidden combat pattern ${forbidden}`);
    if (mission.crossFactionRunIns?.homeFactionId !== mission.factionId) issues.push(`${mission.id} crossFactionRunIns home faction mismatch`);
    if (!mission.crossFactionRunIns?.enabled) issues.push(`${mission.id} crossFactionRunIns must be enabled`);
    const recommended = mission.crossFactionRunIns?.recommendedPoolIds || [];
    if (recommended.length < 2) issues.push(`${mission.id} should recommend at least two run-in pools`);
    for (const poolId of recommended) {
      const pool = poolsById.get(poolId);
      if (!pool) issues.push(`${mission.id} references missing recommended pool ${poolId}`);
      else if (pool.sourceFactionId === mission.factionId) issues.push(`${mission.id} cannot recommend home-faction run-in pool ${poolId}`);
    }
    if (mission.loreContinuityGuard?.sourceFactionId !== mission.factionId) issues.push(`${mission.id} lore continuity source faction mismatch`);
    if (!mission.loreContinuityGuard?.forbid?.includes('lore rewrites')) issues.push(`${mission.id} must forbid lore rewrites`);
  }

  for (const campaign of campaigns) {
    if (campaign.mobileUe5Architecture?.combatRule !== ONE_TITAN_RULE) issues.push(`${campaign.id} campaign must declare one-Titan combat rule`);
    if (campaign.oneTitanVsManyCombat?.playerControlledTitans !== 1) issues.push(`${campaign.id} campaign must enforce one player-controlled Titan`);
    for (const forbidden of FORBIDDEN_STANDARD_COMBAT) if (!campaign.oneTitanVsManyCombat?.forbidden?.includes(forbidden)) issues.push(`${campaign.id} campaign missing forbidden ${forbidden}`);
    if ((campaign.crossFactionRunIns?.poolIds || []).length !== factions.length) issues.push(`${campaign.id} campaign must expose all faction run-in pools for lore-valid events`);
  }

  return { ok: issues.length === 0, issues };
}

export function summarizeCrossFactionRunIns({ factions, creatures, pools, missions, campaigns }) {
  const factionCreatureCount = Object.fromEntries(pools.map(pool => [pool.sourceFactionId, pool.creatureIds.length]));
  return {
    factions: factions.length,
    totalCreatures: creatures.length,
    runInPools: pools.length,
    runInCreatures: pools.reduce((sum, pool) => sum + pool.creatureIds.length, 0),
    missions: missions.length,
    campaigns: campaigns.length,
    factionCreatureCount,
    oneTitanMissions: missions.filter(m => m.activeTitanPolicy?.standardCombat === ONE_TITAN_RULE).length,
    mobileCampaigns: campaigns.filter(c => c.mobileUe5Architecture?.combatRule === ONE_TITAN_RULE).length
  };
}
