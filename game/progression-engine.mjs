// ═══════════════════════════════════════════════════════
// MYTHOS GATES: ASCENSION — PROGRESSION ENGINE
// Leveling, Gear, Mastery, Campaign Wiring, Economy
// ═══════════════════════════════════════════════════════

const clamp = (v, min = 0, max = 999999) => Math.max(min, Math.min(max, Math.round(v)));
const clone = v => JSON.parse(JSON.stringify(v));

// ─── LEVEL BANDS ───────────────────────────────────────
export const LEVEL_BANDS = Object.freeze([
  { band: 'Awakening',  minLevel: 1,  maxLevel: 10, enemyPressure: 'teaches positioning and Momentum loss', gearTier: 'Common' },
  { band: 'Trial',      minLevel: 11, maxLevel: 25, enemyPressure: 'adds controllers, hunters, and first elite mechanics', gearTier: 'Rare' },
  { band: 'Dominion',   minLevel: 26, maxLevel: 45, enemyPressure: 'multi-archetype pressure and objective puzzles', gearTier: 'Epic' },
  { band: 'Ascension',  minLevel: 46, maxLevel: 60, enemyPressure: 'full counter mechanics and boss-tier encounters', gearTier: 'Legendary' }
]);

export const MASTERY_BREAKPOINTS = Object.freeze([5, 10, 20, 30, 45, 60]);

// ─── GEAR TIERS ────────────────────────────────────────
export const GEAR_TIERS = Object.freeze({
  COMMON:   { name: 'Common',   gearScore: 30,  rarity: 0.45 },
  RARE:     { name: 'Rare',     gearScore: 70,  rarity: 0.25 },
  EPIC:     { name: 'Epic',     gearScore: 130, rarity: 0.15 },
  LEGENDARY:{ name: 'Legendary',gearScore: 210, rarity: 0.08 },
  MYTHIC:   { name: 'Mythic',   gearScore: 320, rarity: 0.03 }
});

// ─── STAT GROWTH PER 10 LEVELS ─────────────────────────
export const STAT_GROWTH = Object.freeze({
  hp: 9, attack: 1, armor: 2, resistance: 1
});

// ─── CORE CURRENCIES ───────────────────────────────────
export const CURRENCIES = Object.freeze({
  GATE_SHARDS:    'gate_shards',     // Free progression currency
  DIVINE_GOLD:    'divine_gold',     // Premium currency
  ASCENSION_EMBER:'ascension_ember', // Endgame upgrade resource
  TRIAL_FAVOR:    'trial_favor',     // Weekly trial currency
  RAID_TOKENS:    'raid_tokens',     // Raid completion currency
  SIGNATURE_ALLOY:'signature_alloy'  // Signature weapon upgrade resource
});

// ─── ENERGY SYSTEM ────────────────────────────────────
export const ENERGY_CONFIG = Object.freeze({
  maxEnergy: 120,
  regenPerHour: 12,
  regenTickMinutes: 5,
  firstRefillFree: true
});

// ─── CREATE PROGRESSION STATE ──────────────────────────
export function createProgressionState({ playerId, deityId, deityName, baseStats }) {
  const state = {
    playerId,
    deityId,
    deityName,
    level: 1,
    xp: 0,
    xpToNext: 100,
    statPoints: 0,
    masteryTier: 0,
    gear: { weapon: null, armor: null, core: null, movementRelic: null, reactionRelic: null, executionRelic: null },
    gearScore: 0,
    currencies: {
      [CURRENCIES.GATE_SHARDS]: 0,
      [CURRENCIES.DIVINE_GOLD]: 0,
      [CURRENCIES.ASCENSION_EMBER]: 0,
      [CURRENCIES.TRIAL_FAVOR]: 0,
      [CURRENCIES.RAID_TOKENS]: 0,
      [CURRENCIES.SIGNATURE_ALLOY]: 0
    },
    energy: { current: ENERGY_CONFIG.maxEnergy, lastTick: Date.now() },
    campaignProgress: { unlockedCampaigns: ['MG-CAMPAIGN-001'], completedMissions: [], currentMission: null, stars: {} },
    unlockedDeities: [deityId],
    achievements: [],
    battlePass: { tier: 0, xp: 0, premium: false },
    lastUpdated: new Date().toISOString()
  };
  return state;
}

// ─── LEVELING ─────────────────────────────────────────
export function getLevelBand(level) {
  return LEVEL_BANDS.find(b => level >= b.minLevel && level <= b.maxLevel) || LEVEL_BANDS[LEVEL_BANDS.length - 1];
}

export function getXpForLevel(level) {
  // XP curve: base 100, scales 1.15x per level
  return Math.round(100 * Math.pow(1.15, level - 1));
}

export function addXp(inputState, amount) {
  const state = clone(inputState);
  state.xp += amount;
  
  let leveledUp = false;
  while (state.xp >= state.xpToNext && state.level < 60) {
    state.xp -= state.xpToNext;
    state.level += 1;
    state.statPoints += 2;
    state.xpToNext = getXpForLevel(state.level);
    leveledUp = true;
    
    // Check mastery breakpoints
    if (MASTERY_BREAKPOINTS.includes(state.level)) {
      state.masteryTier += 1;
    }
  }
  
  if (leveledUp) {
    state.lastUpdated = new Date().toISOString();
  }
  return { state, leveledUp };
}

// ─── EFFECTIVE STATS (Base + Level + Gear + Mastery) ──
export function getEffectiveStats(baseStats, level, gearScore, masteryTier) {
  const levelMultiplier = Math.floor(level / 10);
  const effective = {
    hp:         baseStats.hp + STAT_GROWTH.hp * levelMultiplier,
    attack:     baseStats.attack + STAT_GROWTH.attack * levelMultiplier,
    armor:      baseStats.armor + STAT_GROWTH.armor * levelMultiplier,
    resistance: baseStats.resistance + STAT_GROWTH.resistance * levelMultiplier,
    range:      baseStats.range,
    speed:      baseStats.speed,
    critChance: baseStats.critChance,
    accuracy:   baseStats.accuracy,
    evasion:    baseStats.evasion,
    guardBreak: baseStats.guardBreak
  };
  
  // Gear contribution (0.85 multiplier)
  const gearContribution = Math.floor(gearScore * 0.85);
  effective.hp += gearContribution;
  effective.attack += Math.floor(gearContribution / 6);
  effective.armor += Math.floor(gearContribution / 8);
  
  // Mastery contribution (35 per tier)
  const masteryContribution = masteryTier * 35;
  effective.hp += masteryContribution;
  effective.attack += Math.floor(masteryContribution / 10);
  effective.critChance += Math.floor(masteryTier / 2);
  
  // Effective combat power
  effective.combatPower = effective.hp + effective.attack * 6 + effective.range * 5 + 
    effective.armor * 2 + effective.resistance * 2 + effective.speed * 5 +
    effective.critChance + effective.accuracy + effective.evasion * 3 + effective.guardBreak * 2;
  
  return effective;
}

// ─── GEAR SYSTEM ──────────────────────────────────────
export function equipGear(inputState, slot, gearItem) {
  const state = clone(inputState);
  const validSlots = ['weapon', 'armor', 'core', 'movementRelic', 'reactionRelic', 'executionRelic'];
  if (!validSlots.includes(slot)) throw new Error(`Invalid gear slot: ${slot}`);
  
  state.gear[slot] = {
    id: gearItem.id,
    name: gearItem.name,
    tier: gearItem.tier,
    gearScore: GEAR_TIERS[gearItem.tier]?.gearScore || 30,
    stats: gearItem.stats || {}
  };
  
  // Recalculate total gear score
  state.gearScore = Object.values(state.gear)
    .filter(g => g !== null)
    .reduce((sum, g) => sum + g.gearScore, 0);
  
  state.lastUpdated = new Date().toISOString();
  return state;
}

export function unequipGear(inputState, slot) {
  const state = clone(inputState);
  state.gear[slot] = null;
  state.gearScore = Object.values(state.gear)
    .filter(g => g !== null)
    .reduce((sum, g) => sum + g.gearScore, 0);
  state.lastUpdated = new Date().toISOString();
  return state;
}

// ─── MASTERY SYSTEM ───────────────────────────────────
export function getMasteryBonus(masteryTier) {
  return {
    hpBonus: masteryTier * 35,
    attackBonus: Math.floor(masteryTier * 35 / 10),
    critBonus: Math.floor(masteryTier / 2),
    unlockLevel: masteryTier
  };
}

export function checkMasteryUnlock(inputState) {
  const state = clone(inputState);
  const expectedTier = MASTERY_BREAKPOINTS.filter(bp => state.level >= bp).length;
  if (expectedTier > state.masteryTier) {
    state.masteryTier = expectedTier;
    state.lastUpdated = new Date().toISOString();
  }
  return state;
}

// ─── ECONOMY ──────────────────────────────────────────
export function addCurrency(inputState, currency, amount) {
  const state = clone(inputState);
  if (!(currency in state.currencies)) throw new Error(`Unknown currency: ${currency}`);
  state.currencies[currency] = clamp(state.currencies[currency] + amount);
  state.lastUpdated = new Date().toISOString();
  return state;
}

export function spendCurrency(inputState, currency, amount) {
  const state = clone(inputState);
  if (!(currency in state.currencies)) throw new Error(`Unknown currency: ${currency}`);
  if (state.currencies[currency] < amount) return { state, success: false };
  state.currencies[currency] -= amount;
  state.lastUpdated = new Date().toISOString();
  return { state, success: true };
}

// ─── ENERGY SYSTEM ────────────────────────────────────
export function tickEnergy(inputState, now = Date.now()) {
  const state = clone(inputState);
  const elapsed = (now - state.energy.lastTick) / 1000 / 60; // minutes
  const energyGain = Math.floor(elapsed / ENERGY_CONFIG.regenTickMinutes * (ENERGY_CONFIG.regenPerHour / 60 * ENERGY_CONFIG.regenTickMinutes));
  state.energy.current = Math.min(ENERGY_CONFIG.maxEnergy, state.energy.current + energyGain);
  state.energy.lastTick = now;
  return state;
}

export function spendEnergy(inputState, cost) {
  const state = clone(inputState);
  if (state.energy.current < cost) return { state, success: false };
  state.energy.current -= cost;
  state.energy.lastTick = Date.now();
  return { state, success: true };
}

// ─── CAMPAIGN WIRING ──────────────────────────────────
export function unlockCampaign(inputState, campaignId) {
  const state = clone(inputState);
  if (!state.campaignProgress.unlockedCampaigns.includes(campaignId)) {
    state.campaignProgress.unlockedCampaigns.push(campaignId);
    state.lastUpdated = new Date().toISOString();
  }
  return state;
}

export function completeMission(inputState, missionId, stars = 1, rewards = {}) {
  const state = clone(inputState);
  if (!state.campaignProgress.completedMissions.includes(missionId)) {
    state.campaignProgress.completedMissions.push(missionId);
  }
  state.campaignProgress.stars[missionId] = Math.max(state.campaignProgress.stars[missionId] || 0, stars);
  
  // Apply rewards
  if (rewards.xp) {
    const result = addXp(state, rewards.xp);
    Object.assign(state, result.state);
  }
  if (rewards.gateShards) {
    state.currencies[CURRENCIES.GATE_SHARDS] += rewards.gateShards;
  }
  if (rewards.divineGold) {
    state.currencies[CURRENCIES.DIVINE_GOLD] += rewards.divineGold;
  }
  if (rewards.energy) {
    state.energy.current = Math.min(ENERGY_CONFIG.maxEnergy, state.energy.current + rewards.energy);
  }
  
  state.lastUpdated = new Date().toISOString();
  return state;
}

export function setCurrentMission(inputState, missionId) {
  const state = clone(inputState);
  state.campaignProgress.currentMission = missionId;
  state.lastUpdated = new Date().toISOString();
  return state;
}

// ─── BATTLE PASS ──────────────────────────────────────
export function addBattlePassXp(inputState, amount) {
  const state = clone(inputState);
  state.battlePass.xp += amount;
  while (state.battlePass.xp >= 1000) {
    state.battlePass.xp -= 1000;
    state.battlePass.tier += 1;
  }
  state.lastUpdated = new Date().toISOString();
  return state;
}

export function unlockPremiumBattlePass(inputState) {
  const state = clone(inputState);
  state.battlePass.premium = true;
  state.lastUpdated = new Date().toISOString();
  return state;
}

// ─── ACHIEVEMENTS ──────────────────────────────────────
export function unlockAchievement(inputState, achievementId) {
  const state = clone(inputState);
  if (!state.achievements.includes(achievementId)) {
    state.achievements.push(achievementId);
    state.lastUpdated = new Date().toISOString();
  }
  return state;
}

// ─── DEITY UNLOCKING ──────────────────────────────────
export function unlockDeity(inputState, deityId) {
  const state = clone(inputState);
  if (!state.unlockedDeities.includes(deityId)) {
    state.unlockedDeities.push(deityId);
    state.lastUpdated = new Date().toISOString();
  }
  return state;
}

// ─── SUMMARY ──────────────────────────────────────────
export function getProgressionSummary(state) {
  const band = getLevelBand(state.level);
  const mastery = getMasteryBonus(state.masteryTier);
  return {
    deity: state.deityName,
    level: state.level,
    band: band.band,
    xp: `${state.xp}/${state.xpToNext}`,
    masteryTier: state.masteryTier,
    masteryBonuses: mastery,
    gearScore: state.gearScore,
    gearSlots: Object.entries(state.gear).filter(([_, g]) => g !== null).length,
    currencies: { ...state.currencies },
    energy: `${state.energy.current}/${ENERGY_CONFIG.maxEnergy}`,
    campaigns: state.campaignProgress.unlockedCampaigns.length,
    completedMissions: state.campaignProgress.completedMissions.length,
    unlockedDeities: state.unlockedDeities.length,
    achievements: state.achievements.length,
    battlePass: `Tier ${state.battlePass.tier} (${state.battlePass.premium ? 'Premium' : 'Free'})`
  };
}
