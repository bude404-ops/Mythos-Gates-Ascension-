import assert from 'node:assert/strict';
import {
  loadEconomyConfig,
  createEconomyState,
  migratePlayerEconomy,
  addCurrency,
  spendCurrency,
  consumeEnergy,
  regenerateEnergy,
  grantReward,
  unlockDeity,
  purchaseItem,
  claimDailyReward
} from '../game/economy-runtime.mjs';

const config = loadEconomyConfig();
const player = { playerId: 'TEST', resources: [{ id: 'MG-RES-GATE-SHARDS', name: 'Gate Shards', amount: 120 }] };
migratePlayerEconomy(player, config, new Date('2026-08-16T00:00:00Z'));
assert.equal(player.economy.wallets.SHARDS, 120);
assert.equal(player.economy.energy.amount, config.energy.maxEnergy);

let energy = consumeEnergy(player, 'campaign', new Date('2026-08-16T00:00:00Z'), config);
assert.equal(energy.ok, true);
assert.equal(player.economy.energy.amount, config.energy.maxEnergy - config.energy.costs.campaign);
player.economy.energy.lastRegenAt = '2026-08-16T00:00:00Z';
regenerateEnergy(player, new Date('2026-08-16T00:12:00Z'), config);
assert.ok(player.economy.energy.amount > config.energy.maxEnergy - config.energy.costs.campaign);

grantReward(player, { GOLD: 500, ENERGY: 20, SHARDS: 10 }, 'TEST_REWARD', 'CLAIM-1', config);
const goldAfter = player.economy.wallets.GOLD;
grantReward(player, { GOLD: 500 }, 'TEST_REWARD_DUP', 'CLAIM-1', config);
assert.equal(player.economy.wallets.GOLD, goldAfter);

let unlock = unlockDeity(player, 'MG-DEITY-TEST', 60, config);
assert.equal(unlock.ok, true);
assert.ok(player.unlockedDeityIds.includes('MG-DEITY-TEST'));

addCurrency(player, 'PREMIUM_CURRENCY', 1000, 'TEST_PREMIUM_GRANT', config);
let purchase = purchaseItem(player, 'TG_ENERGY_REFILL_FULL', null, config, 'development');
assert.equal(purchase.ok, true);
let blocked = purchaseItem(player, 'TG_ENERGY_REFILL_FULL', { transactionId: 'PROD-1' }, config, 'production');
assert.equal(blocked.ok, false);
assert.equal(blocked.reason, 'SERVER_VERIFICATION_REQUIRED');
let verified = purchaseItem(player, 'TG_ENERGY_REFILL_FULL', { transactionId: 'PROD-2', serverVerified: true }, config, 'production');
assert.equal(verified.ok, true);
let duplicate = purchaseItem(player, 'TG_ENERGY_REFILL_FULL', { transactionId: 'PROD-2', serverVerified: true }, config, 'production');
assert.equal(duplicate.duplicate, true);

let daily = claimDailyReward(player, new Date('2026-08-16T08:00:00Z'), config);
assert.equal(daily.ok, true);
let dailyDup = claimDailyReward(player, new Date('2026-08-16T12:00:00Z'), config);
assert.equal(dailyDup.ok, false);

let spend = spendCurrency(player, 'GOLD', 999999999, 'TOO_MUCH', config);
assert.equal(spend.ok, false);
console.log(JSON.stringify({ ok: true, wallets: player.economy.wallets, energy: player.economy.energy.amount, purchases: player.economy.purchases.length, log: player.economy.transactionLog.length }, null, 2));
