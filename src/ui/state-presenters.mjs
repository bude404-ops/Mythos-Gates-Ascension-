export function summarizeBattleState(state) {
  return {
    battleId: state.battleId,
    missionId: state.missionId,
    round: state.round,
    phase: state.phase,
    deity: {
      id: state.deity.id,
      name: state.deity.name,
      hp: state.deity.hp,
      maxHp: state.deity.maxHp,
      stance: state.deity.stance,
      ascended: Boolean(state.deity.ascended)
    },
    resources: { ...state.resources },
    enemiesRemaining: state.enemies.filter(enemy => enemy.hp > 0).length,
    telemetry: {
      damageDealt: state.telemetry.damageDealt,
      damageTaken: state.telemetry.damageTaken,
      objectiveProgress: state.telemetry.objectiveProgress,
      events: state.eventLog.length
    }
  };
}

export function summarizeEconomyState(player) {
  const economy = player.economy || {};
  return {
    wallets: { ...(economy.wallets || {}) },
    retainedResources: { ...(economy.retainedResources || {}) },
    energy: economy.energy ? { amount: economy.energy.amount, max: economy.energy.max } : null,
    battlePass: economy.battlePass ? { seasonId: economy.battlePass.seasonId, level: economy.battlePass.level, xp: economy.battlePass.xp } : null,
    ownedCosmetics: economy.cosmetics?.owned?.length || 0
  };
}
