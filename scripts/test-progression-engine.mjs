import { unequipGear, 
  createProgressionState, addXp, getEffectiveStats, equipGear, 
  checkMasteryUnlock, getLevelBand, getXpForLevel, addCurrency, 
  spendCurrency, tickEnergy, spendEnergy, completeMission, unlockCampaign,
  unlockDeity, getMasteryBonus, getProgressionSummary, MASTERY_BREAKPOINTS,
  GEAR_TIERS, CURRENCIES, LEVEL_BANDS
} from '../game/progression-engine.mjs';

let passed = 0, failed = 0;
function assert(cond, msg) { if (cond) passed++; else { failed++; console.error(`FAIL: ${msg}`); } }

// 1. Create progression state
const baseStats = { hp: 52, attack: 10, armor: 19, resistance: 12, range: 2, speed: 2, critChance: 7, accuracy: 82, evasion: 4, guardBreak: 8 };
let state = createProgressionState({ playerId: 'P1', deityId: 'MG-DEITY-001', deityName: 'Aten-Ra', baseStats });
assert(state.level === 1, 'Starts at level 1');
assert(state.xp === 0, 'Starts at 0 XP');
assert(state.statPoints === 0, 'No stat points at level 1');
assert(state.masteryTier === 0, 'Mastery tier 0 at start');
assert(state.gearScore === 0, 'Gear score 0 with no gear');
assert(state.energy.current === 120, 'Full energy at start');
assert(state.unlockedDeities.length === 1, 'Only 1 deity unlocked');

// 2. Leveling
const xpResult = addXp(state, 150);
state = xpResult.state;
assert(state.level === 2, `Leveled up to 2 (got ${state.level})`);
assert(state.statPoints === 2, '2 stat points after 1 level up');
assert(xpResult.leveledUp, 'leveledUp flag set');

// 3. Multiple level ups
state = createProgressionState({ playerId: 'P1', deityId: 'MG-DEITY-001', deityName: 'Aten-Ra', baseStats });
const bigXp = addXp(state, 5000);
state = bigXp.state;
assert(state.level > 5, `Multiple level ups (got level ${state.level})`);
assert(state.statPoints > 10, `Multiple stat points (got ${state.statPoints})`);

// 4. Level bands
const band1 = getLevelBand(1);
assert(band1.band === 'Awakening', 'Level 1 = Awakening band');
const band2 = getLevelBand(20);
assert(band2.band === 'Trial', 'Level 20 = Trial band');
const band3 = getLevelBand(35);
assert(band3.band === 'Dominion', 'Level 35 = Dominion band');
const band4 = getLevelBand(55);
assert(band4.band === 'Ascension', 'Level 55 = Ascension band');

// 5. Effective stats calculation
const effective = getEffectiveStats(baseStats, 30, 130, 3);
assert(effective.hp > baseStats.hp, 'Effective HP > base HP at level 30');
assert(effective.attack > baseStats.attack, 'Effective ATK > base ATK at level 30');
assert(effective.combatPower > 0, 'Combat power calculated');
assert(effective.hp > effective.attack, 'HP > ATK for Warrior role');

// 6. Gear system
state = createProgressionState({ playerId: 'P1', deityId: 'MG-DEITY-001', deityName: 'Aten-Ra', baseStats });
state = equipGear(state, 'weapon', { id: 'GW001', name: 'Sun Blade', tier: 'EPIC', stats: { attack: 5 } });
assert(state.gear.weapon !== null, 'Weapon equipped');
assert(state.gearScore === GEAR_TIERS.EPIC.gearScore, `Gear score = Epic (${state.gearScore} vs ${GEAR_TIERS.EPIC.gearScore})`);

state = equipGear(state, 'armor', { id: 'GA001', name: 'Sun Plate', tier: 'LEGENDARY', stats: { armor: 10 } });
assert(state.gearScore === GEAR_TIERS.EPIC.gearScore + GEAR_TIERS.LEGENDARY.gearScore, 'Gear score stacks');

state = unequipGear(state, 'weapon');
assert(state.gear.weapon === null, 'Weapon unequipped');
assert(state.gearScore === GEAR_TIERS.LEGENDARY.gearScore, 'Gear score reduced after unequip');

// 7. Mastery
state = createProgressionState({ playerId: 'P1', deityId: 'MG-DEITY-001', deityName: 'Aten-Ra', baseStats });
state = addXp(state, 100000).state; // Level up a lot
assert(state.level >= 10, `Reached level 10+ (got ${state.level})`);
state = checkMasteryUnlock(state);
assert(state.masteryTier > 0, `Mastery tier unlocked (got ${state.masteryTier})`);

const mastery = getMasteryBonus(3);
assert(mastery.hpBonus === 105, `Mastery HP bonus = 105 (got ${mastery.hpBonus})`);
assert(mastery.attackBonus === 10, `Mastery ATK bonus = 10 (got ${mastery.attackBonus})`);

// 8. Economy
state = createProgressionState({ playerId: 'P1', deityId: 'MG-DEITY-001', deityName: 'Aten-Ra', baseStats });
state = addCurrency(state, CURRENCIES.GATE_SHARDS, 500);
assert(state.currencies[CURRENCIES.GATE_SHARDS] === 500, 'Added 500 gate shards');

const spendResult = spendCurrency(state, CURRENCIES.GATE_SHARDS, 200);
assert(spendResult.success, 'Spent 200 gate shards');
state = spendResult.state;
assert(state.currencies[CURRENCIES.GATE_SHARDS] === 300, '300 remaining');

const failSpend = spendCurrency(state, CURRENCIES.GATE_SHARDS, 999);
assert(!failSpend.success, 'Cannot overspend');

// 9. Energy
state = createProgressionState({ playerId: 'P1', deityId: 'MG-DEITY-001', deityName: 'Aten-Ra', baseStats });
const energyResult = spendEnergy(state, 30);
assert(energyResult.success, 'Spent 30 energy');
assert(energyResult.state.energy.current === 90, '90 energy remaining');

const noEnergy = spendEnergy(energyResult.state, 200);
assert(!noEnergy.success, 'Cannot overspend energy');

// 10. Campaign wiring
state = createProgressionState({ playerId: 'P1', deityId: 'MG-DEITY-001', deityName: 'Aten-Ra', baseStats });
assert(state.campaignProgress.unlockedCampaigns.includes('MG-CAMPAIGN-001'), 'First campaign unlocked');

state = unlockCampaign(state, 'MG-CAMPAIGN-002');
assert(state.campaignProgress.unlockedCampaigns.includes('MG-CAMPAIGN-002'), 'Second campaign unlocked');

state = completeMission(state, 'MG-F01-C01-M01', 3, { xp: 500, gateShards: 100, energy: 10 });
assert(state.campaignProgress.completedMissions.includes('MG-F01-C01-M01'), 'Mission completed');
assert(state.campaignProgress.stars['MG-F01-C01-M01'] === 3, '3 stars recorded');
assert(state.level > 1, 'Leveled up from mission XP');
assert(state.currencies[CURRENCIES.GATE_SHARDS] === 100, 'Got 100 gate shards');

// 11. Deity unlocking
state = unlockDeity(state, 'MG-DEITY-019'); // Zeus
assert(state.unlockedDeities.length === 2, 'Second deity unlocked');

// 12. Progression summary
const summary = getProgressionSummary(state);
assert(summary.deity === 'Aten-Ra', 'Summary has deity name');
assert(summary.level > 0, 'Summary has level');
assert(summary.campaigns >= 2, 'Summary has campaign count');
assert(summary.completedMissions >= 1, 'Summary has mission count');

// 13. XP curve
const xp10 = getXpForLevel(10);
const xp20 = getXpForLevel(20);
assert(xp20 > xp10, 'XP curve scales up');
assert(xp10 > 100, 'Level 10 XP > 100');

// 14. Max level cap
state = createProgressionState({ playerId: 'P1', deityId: 'MG-DEITY-001', deityName: 'Aten-Ra', baseStats });
state = addXp(state, 99999999).state;
assert(state.level === 60, `Max level is 60 (got ${state.level})`);
assert(state.xp < state.xpToNext || state.level === 60, 'No overflow past 60');

console.log(`\n=== PROGRESSION ENGINE TEST ===`);
console.log(`Passed: ${passed} | Failed: ${failed}`);
console.log(failed === 0 ? 'ALL TESTS PASSED ✅' : 'TESTS FAILED ❌');
process.exit(failed === 0 ? 0 : 1);
