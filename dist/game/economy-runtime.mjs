import fs from 'node:fs';

const DEFAULT_CONFIG_PATH = new URL('../data/free-to-play-economy.json', import.meta.url);

export function loadEconomyConfig(path = DEFAULT_CONFIG_PATH) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

export function createEconomyState(config = loadEconomyConfig(), now = new Date()) {
  return {
    schemaVersion: `${config.id}@${config.version}`,
    wallets: Object.fromEntries(Object.keys(config.coreCurrencies).map((key) => [key, 0])),
    retainedResources: Object.fromEntries(Object.keys(config.retainedProgressionResources || {}).map((key) => [key, 0])),
    energy: {
      amount: config.energy.maxEnergy,
      max: config.energy.maxEnergy,
      lastRegenAt: now.toISOString(),
      paidRefillsToday: 0,
      paidRefillDate: now.toISOString().slice(0, 10)
    },
    purchases: [],
    transactionLog: [],
    rewardClaims: [],
    dailyRewards: { lastClaimDate: null, streak: 0, claimedKeys: [] },
    battlePass: {
      seasonId: config.battlePass.seasonId,
      xp: 0,
      level: 1,
      premiumOwned: false,
      claimedFree: [],
      claimedPremium: []
    },
    cosmetics: { owned: [], equipped: {} }
  };
}

export function migratePlayerEconomy(player, config = loadEconomyConfig(), now = new Date()) {
  player.economy ||= createEconomyState(config, now);
  const econ = player.economy;
  econ.wallets ||= {};
  econ.retainedResources ||= {};
  econ.transactionLog ||= [];
  econ.purchases ||= [];
  econ.rewardClaims ||= [];
  econ.dailyRewards ||= { lastClaimDate: null, streak: 0, claimedKeys: [] };
  econ.battlePass ||= { seasonId: config.battlePass.seasonId, xp: 0, level: 1, premiumOwned: false, claimedFree: [], claimedPremium: [] };
  econ.cosmetics ||= { owned: [], equipped: {} };
  for (const key of Object.keys(config.coreCurrencies)) econ.wallets[key] = Number(econ.wallets[key] || 0);
  for (const key of Object.keys(config.retainedProgressionResources || {})) econ.retainedResources[key] = Number(econ.retainedResources[key] || 0);
  econ.energy ||= { amount: config.energy.maxEnergy, max: config.energy.maxEnergy, lastRegenAt: now.toISOString() };
  econ.energy.max = Number(econ.energy.max || config.energy.maxEnergy);
  econ.energy.amount = Math.min(Number(econ.energy.amount ?? econ.energy.max), config.energy.overflowCapFromRewards || econ.energy.max);
  econ.energy.lastRegenAt ||= now.toISOString();

  // Legacy resource compatibility: preserve old rows while mirroring into canonical wallets.
  const resources = Array.isArray(player.resources) ? player.resources : [];
  const readLegacy = (ids) => resources.filter((r) => ids.includes(r.id)).reduce((sum, r) => sum + Number(r.amount || 0), 0);
  for (const [key, row] of Object.entries(config.coreCurrencies)) {
    const legacy = readLegacy(row.legacyIds || []);
    if (legacy > econ.wallets[key]) econ.wallets[key] = legacy;
  }
  for (const [key, row] of Object.entries(config.retainedProgressionResources || {})) {
    const legacy = readLegacy(row.legacyIds || []);
    if (legacy > econ.retainedResources[key]) econ.retainedResources[key] = legacy;
  }
  return player;
}

function log(econ, type, payload) {
  const entry = { id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, type, payload, createdAt: new Date().toISOString() };
  econ.transactionLog.unshift(entry);
  econ.transactionLog = econ.transactionLog.slice(0, 500);
  return entry;
}

export function addCurrency(player, currency, amount, reason, config = loadEconomyConfig()) {
  migratePlayerEconomy(player, config);
  if (!config.coreCurrencies[currency]) throw new Error(`UNKNOWN_CURRENCY:${currency}`);
  if (amount < 0) throw new Error('NEGATIVE_ADD_BLOCKED');
  player.economy.wallets[currency] += amount;
  log(player.economy, 'ADD_CURRENCY', { currency, amount, reason });
  return player.economy.wallets[currency];
}

export function spendCurrency(player, currency, amount, reason, config = loadEconomyConfig()) {
  migratePlayerEconomy(player, config);
  if (!config.coreCurrencies[currency]) throw new Error(`UNKNOWN_CURRENCY:${currency}`);
  if (amount < 0) throw new Error('NEGATIVE_SPEND_BLOCKED');
  if (player.economy.wallets[currency] < amount) return { ok: false, reason: 'INSUFFICIENT_FUNDS', balance: player.economy.wallets[currency] };
  player.economy.wallets[currency] -= amount;
  log(player.economy, 'SPEND_CURRENCY', { currency, amount, reason });
  return { ok: true, balance: player.economy.wallets[currency] };
}

export function regenerateEnergy(player, now = new Date(), config = loadEconomyConfig()) {
  migratePlayerEconomy(player, config, now);
  const e = player.economy.energy;
  const last = new Date(e.lastRegenAt || now).getTime();
  const elapsed = Math.max(0, now.getTime() - last);
  const ticks = Math.floor(elapsed / (config.energy.regenIntervalSeconds * 1000));
  if (ticks > 0 && e.amount < e.max) {
    e.amount = Math.min(e.max, e.amount + ticks * config.energy.regenAmount);
    e.lastRegenAt = new Date(last + ticks * config.energy.regenIntervalSeconds * 1000).toISOString();
    log(player.economy, 'REGENERATE_ENERGY', { ticks, amount: e.amount });
  }
  return e;
}

export function consumeEnergy(player, activity, now = new Date(), config = loadEconomyConfig()) {
  regenerateEnergy(player, now, config);
  const cost = Number(config.energy.costs[activity] ?? 0);
  if (cost <= 0) return { ok: true, cost: 0, energy: player.economy.energy.amount };
  if (player.economy.energy.amount < cost) return { ok: false, reason: 'INSUFFICIENT_ENERGY', cost, energy: player.economy.energy.amount };
  player.economy.energy.amount -= cost;
  log(player.economy, 'CONSUME_ENERGY', { activity, cost });
  return { ok: true, cost, energy: player.economy.energy.amount };
}

export function grantReward(player, reward, reason, claimId, config = loadEconomyConfig()) {
  migratePlayerEconomy(player, config);
  if (claimId && player.economy.rewardClaims.includes(claimId)) return { ok: true, duplicate: true, player };
  for (const [key, amount] of Object.entries(reward || {})) {
    if (config.coreCurrencies[key]) player.economy.wallets[key] += Number(amount || 0);
    else if (key === 'ENERGY') player.economy.energy.amount = Math.min(config.energy.overflowCapFromRewards, player.economy.energy.amount + Number(amount || 0));
    else if (config.retainedProgressionResources?.[key]) player.economy.retainedResources[key] += Number(amount || 0);
    else if (key === 'cosmeticId') player.economy.cosmetics.owned.push(amount);
  }
  if (claimId) player.economy.rewardClaims.push(claimId);
  log(player.economy, 'GRANT_REWARD', { reward, reason, claimId });
  return { ok: true, player };
}

export function unlockTitan(player, titanId, shardCost, config = loadEconomyConfig()) {
  migratePlayerEconomy(player, config);
  player.unlockedTitanIds ||= [];
  if (player.unlockedTitanIds.includes(titanId)) return { ok: true, alreadyOwned: true };
  const spend = spendCurrency(player, 'SHARDS', shardCost, `UNLOCK_TITAN:${titanId}`, config);
  if (!spend.ok) return spend;
  player.unlockedTitanIds.push(titanId);
  log(player.economy, 'UNLOCK_TITAN', { titanId, shardCost });
  return { ok: true, titanId };
}

export function purchaseItem(player, productId, receipt = null, config = loadEconomyConfig(), env = 'development') {
  migratePlayerEconomy(player, config);
  const product = config.purchaseArchitecture.productCatalog.find((p) => p.PRODUCT_ID === productId && p.ACTIVE);
  if (!product) return { ok: false, reason: 'PRODUCT_INACTIVE_OR_UNKNOWN' };
  if (env === 'production' && !receipt?.serverVerified) return { ok: false, reason: 'SERVER_VERIFICATION_REQUIRED' };
  if (receipt?.transactionId && player.economy.purchases.some((p) => p.transactionId === receipt.transactionId)) return { ok: true, duplicate: true };
  const paid = spendCurrency(player, product.CURRENCY, product.PRICE, `PURCHASE_ITEM:${productId}`, config);
  if (!paid.ok) return paid;
  grantReward(player, product.REWARD, `PURCHASE_ITEM:${productId}`, `PURCHASE-${receipt?.transactionId || productId}-${Date.now()}`, config);
  player.economy.purchases.push({ productId, transactionId: receipt?.transactionId || null, verified: !!receipt?.serverVerified, env, createdAt: new Date().toISOString() });
  log(player.economy, 'PURCHASE_ITEM', { productId, env, verified: !!receipt?.serverVerified });
  return { ok: true, productId };
}

export function claimDailyReward(player, now = new Date(), config = loadEconomyConfig()) {
  migratePlayerEconomy(player, config, now);
  const dayKey = now.toISOString().slice(0, 10);
  if (player.economy.dailyRewards.lastClaimDate === dayKey) return { ok: false, reason: 'ALREADY_CLAIMED_TODAY' };
  const streak = (player.economy.dailyRewards.streak % config.dailyRewards.streakLength) + 1;
  const row = config.dailyRewards.freeTrack.find((r) => r.day === streak) || config.dailyRewards.freeTrack[0];
  grantReward(player, row.reward, 'DAILY_REWARD', `DAILY-${dayKey}`, config);
  player.economy.dailyRewards.lastClaimDate = dayKey;
  player.economy.dailyRewards.streak = streak;
  player.economy.dailyRewards.claimedKeys.push(dayKey);
  return { ok: true, day: streak, reward: row.reward };
}
