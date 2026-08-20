import { loadSourceDataset } from '../../src/data-loaders/index.mjs';

export function buildEngineExportSummary({ includeMissions = true } = {}) {
  const dataset = loadSourceDataset({ includeMissions });
  return {
    schema: 'MG_ENGINE_EXPORT_SUMMARY_V1',
    counts: {
      deities: dataset.deities.length,
      creatures: dataset.creatures.length,
      campaigns: dataset.campaigns.length,
      maps: dataset.maps.length,
      missions: dataset.missions.length
    },
    canonicalRules: {
      activeDeityCount: 1,
      playableThreatLayer: false,
      engineAdaptersAreCanonConsumers: true
    },
    sample: {
      firstDeity: dataset.deities[0]?.id,
      firstMission: dataset.missions[0]?.id,
      firstMap: dataset.maps[0]?.id
    }
  };
}

export function mapDeityForEngine(deity) {
  return {
    id: deity.id,
    displayName: deity.name,
    factionId: deity.factionId,
    faction: deity.faction,
    role: deity.role,
    rarity: deity.rarity,
    combatStats: { ...deity.stats },
    abilityNames: Array.isArray(deity.abilities) ? [...deity.abilities] : [],
    canonicalAssetHint: deity.artPromptId || null
  };
}

export function mapMissionForEngine(mission) {
  return {
    id: mission.id,
    title: mission.title,
    campaignId: mission.campaignId,
    campaignType: mission.campaignType,
    recommendedPower: mission.recommendedPower,
    activeDeityCount: mission.activeDeityCount,
    mapId: mission.mapId,
    enemyWaveCount: mission.enemyWaves?.length || 0,
    turnLimit: mission.turnLimit,
    victoryConditions: mission.victoryConditions || [],
    defeatConditions: mission.defeatConditions || []
  };
}
