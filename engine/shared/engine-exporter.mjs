import { loadSourceDataset } from '../../src/data-loaders/index.mjs';

export function buildEngineExportSummary({ includeMissions = true } = {}) {
  const dataset = loadSourceDataset({ includeMissions });
  return {
    schema: 'TG_ENGINE_EXPORT_SUMMARY_V1',
    counts: {
      titans: dataset.titans.length,
      creatures: dataset.creatures.length,
      campaigns: dataset.campaigns.length,
      maps: dataset.maps.length,
      missions: dataset.missions.length
    },
    canonicalRules: {
      activeTitanCount: 1,
      playableThreatLayer: false,
      engineAdaptersAreCanonConsumers: true
    },
    sample: {
      firstTitan: dataset.titans[0]?.id,
      firstMission: dataset.missions[0]?.id,
      firstMap: dataset.maps[0]?.id
    }
  };
}

export function mapTitanForEngine(titan) {
  return {
    id: titan.id,
    displayName: titan.name,
    factionId: titan.factionId,
    faction: titan.faction,
    role: titan.role,
    rarity: titan.rarity,
    combatStats: { ...titan.stats },
    abilityNames: Array.isArray(titan.abilities) ? [...titan.abilities] : [],
    canonicalAssetHint: titan.artPromptId || null
  };
}

export function mapMissionForEngine(mission) {
  return {
    id: mission.id,
    title: mission.title,
    campaignId: mission.campaignId,
    campaignType: mission.campaignType,
    recommendedPower: mission.recommendedPower,
    activeTitanCount: mission.activeTitanCount,
    mapId: mission.mapId,
    enemyWaveCount: mission.enemyWaves?.length || 0,
    turnLimit: mission.turnLimit,
    victoryConditions: mission.victoryConditions || [],
    defeatConditions: mission.defeatConditions || []
  };
}
