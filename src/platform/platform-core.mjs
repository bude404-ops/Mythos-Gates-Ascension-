import crypto from 'node:crypto';

const DEFAULT_CLOCK = () => '2026-08-16T23:00:00.000Z';
const DEFAULT_CURRENCIES = Object.freeze({ sunshards: 120, gateKeys: 1, signatureAlloy: 0 });
const REQUIRED_EVENT_TYPES = Object.freeze([
  'PROFILE_CREATED',
  'TITAN_GRANTED',
  'ACTIVE_TITAN_SET',
  'MISSION_COMPLETED',
  'CURRENCY_CREDITED',
  'CURRENCY_DEBITED',
  'SAVE_EXPORTED',
  'SAVE_IMPORTED'
]);

export function createPlatformProfile({
  playerId = 'TG-PLAYER-LOCAL-001',
  displayName = 'First Gatebreaker',
  starterTitanId = 'TG-TITAN-003',
  now = DEFAULT_CLOCK
} = {}) {
  const createdAt = now();
  const state = {
    schema: 'TG_PLATFORM_SAVE_STATE_V1',
    version: 1,
    player: {
      playerId,
      displayName,
      createdAt,
      lastSeenAt: createdAt,
      accountLevel: 1,
      accountXp: 0
    },
    roster: {
      activeTitanId: starterTitanId,
      ownedTitans: [{ titanId: starterTitanId, source: 'STARTER_GRANT', grantedAt: createdAt, level: 1, xp: 0 }]
    },
    inventory: {
      currencies: { ...DEFAULT_CURRENCIES },
      items: []
    },
    progression: {
      completedMissions: [],
      unlockedCampaigns: ['TG-CAMPAIGN-ATEN-RA-001'],
      unlockedFeatures: ['COMMAND_HUB', 'SOLO_BATTLE', 'CAMPAIGN_SELECT']
    },
    ledger: [],
    platformEvents: []
  };
  appendEvent(state, 'PROFILE_CREATED', { playerId, displayName });
  appendEvent(state, 'TITAN_GRANTED', { titanId: starterTitanId, source: 'STARTER_GRANT' });
  appendEvent(state, 'ACTIVE_TITAN_SET', { titanId: starterTitanId });
  for (const [currency, amount] of Object.entries(DEFAULT_CURRENCIES)) {
    if (amount > 0) appendLedger(state, 'CURRENCY_CREDITED', currency, amount, 'STARTER_BALANCE', { playerId });
  }
  return snapshot(state);
}

export function grantTitan(state, titanId, { source = 'MISSION_REWARD', now = DEFAULT_CLOCK } = {}) {
  const next = snapshot(state);
  if (!next.roster.ownedTitans.some(titan => titan.titanId === titanId)) {
    next.roster.ownedTitans.push({ titanId, source, grantedAt: now(), level: 1, xp: 0 });
    appendEvent(next, 'TITAN_GRANTED', { titanId, source });
  }
  return snapshot(next);
}

export function setActiveTitan(state, titanId) {
  const next = snapshot(state);
  if (!next.roster.ownedTitans.some(titan => titan.titanId === titanId)) throw new Error(`Cannot activate unowned Titan: ${titanId}`);
  next.roster.activeTitanId = titanId;
  appendEvent(next, 'ACTIVE_TITAN_SET', { titanId });
  return snapshot(next);
}

export function completeMission(state, missionId, reward = {}) {
  const next = snapshot(state);
  if (!next.progression.completedMissions.includes(missionId)) next.progression.completedMissions.push(missionId);
  const accountXp = Number(reward.accountXp || 0);
  next.player.accountXp += accountXp;
  next.player.accountLevel = 1 + Math.floor(next.player.accountXp / 100);
  for (const [currency, amount] of Object.entries(reward.currencies || {})) creditCurrencyInPlace(next, currency, amount, `MISSION:${missionId}`);
  for (const titanId of reward.titans || []) {
    if (!next.roster.ownedTitans.some(titan => titan.titanId === titanId)) next.roster.ownedTitans.push({ titanId, source: `MISSION:${missionId}`, grantedAt: DEFAULT_CLOCK(), level: 1, xp: 0 });
  }
  appendEvent(next, 'MISSION_COMPLETED', { missionId, accountXp, reward });
  return snapshot(next);
}

export function creditCurrency(state, currency, amount, reason = 'MANUAL_CREDIT') {
  const next = snapshot(state);
  creditCurrencyInPlace(next, currency, amount, reason);
  return snapshot(next);
}

export function debitCurrency(state, currency, amount, reason = 'MANUAL_DEBIT') {
  const next = snapshot(state);
  assertPositiveAmount(amount);
  const balance = Number(next.inventory.currencies[currency] || 0);
  if (balance < amount) throw new Error(`Insufficient ${currency}: ${balance} < ${amount}`);
  next.inventory.currencies[currency] = balance - amount;
  appendLedger(next, 'CURRENCY_DEBITED', currency, amount, reason, { balanceAfter: next.inventory.currencies[currency] });
  return snapshot(next);
}

export function exportSave(state) {
  const payload = snapshot(state);
  appendEvent(payload, 'SAVE_EXPORTED', { checksum: checksum(payload) });
  return JSON.stringify(payload, null, 2);
}

export function importSave(serialized) {
  const parsed = typeof serialized === 'string' ? JSON.parse(serialized) : serialized;
  const result = validatePlatformState(parsed);
  if (!result.ok) throw new Error(`Invalid platform save: ${result.issues.join('; ')}`);
  const next = snapshot(parsed);
  appendEvent(next, 'SAVE_IMPORTED', { checksum: checksum(parsed) });
  return snapshot(next);
}

export function validatePlatformState(state) {
  const issues = [];
  if (state?.schema !== 'TG_PLATFORM_SAVE_STATE_V1') issues.push('schema must be TG_PLATFORM_SAVE_STATE_V1');
  if (!state?.player?.playerId) issues.push('player.playerId is required');
  if (!state?.roster?.activeTitanId) issues.push('roster.activeTitanId is required');
  if (!state?.roster?.ownedTitans?.some(titan => titan.titanId === state.roster.activeTitanId)) issues.push('active titan must be owned');
  if (!state?.inventory?.currencies || typeof state.inventory.currencies !== 'object') issues.push('inventory.currencies is required');
  if (!Array.isArray(state?.ledger)) issues.push('ledger must be an array');
  if (!Array.isArray(state?.platformEvents)) issues.push('platformEvents must be an array');
  for (const entry of state?.ledger || []) {
    if (!['CURRENCY_CREDITED', 'CURRENCY_DEBITED'].includes(entry.type)) issues.push(`invalid ledger type ${entry.type}`);
    if (!entry.currency || !Number.isFinite(entry.amount) || entry.amount <= 0) issues.push('ledger entries require positive currency amount');
  }
  return { ok: issues.length === 0, issues };
}

export function platformSummary(state) {
  return {
    playerId: state.player.playerId,
    level: state.player.accountLevel,
    xp: state.player.accountXp,
    activeTitanId: state.roster.activeTitanId,
    ownedTitans: state.roster.ownedTitans.length,
    completedMissions: state.progression.completedMissions.length,
    currencies: { ...state.inventory.currencies },
    ledgerEntries: state.ledger.length,
    platformEvents: state.platformEvents.length,
    checksum: checksum(state)
  };
}

export { REQUIRED_EVENT_TYPES };

function creditCurrencyInPlace(state, currency, amount, reason) {
  assertPositiveAmount(amount);
  state.inventory.currencies[currency] = Number(state.inventory.currencies[currency] || 0) + amount;
  appendLedger(state, 'CURRENCY_CREDITED', currency, amount, reason, { balanceAfter: state.inventory.currencies[currency] });
}

function appendLedger(state, type, currency, amount, reason, metadata = {}) {
  state.ledger.push({ id: `LEDGER-${String(state.ledger.length + 1).padStart(4, '0')}`, type, currency, amount, reason, metadata });
  appendEvent(state, type, { currency, amount, reason });
}

function appendEvent(state, type, payload) {
  state.platformEvents.push({ id: `EVT-${String(state.platformEvents.length + 1).padStart(4, '0')}`, type, payload });
}

function assertPositiveAmount(amount) {
  if (!Number.isFinite(amount) || amount <= 0) throw new Error(`Amount must be positive: ${amount}`);
}

function snapshot(value) {
  return JSON.parse(JSON.stringify(value));
}

function checksum(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 16);
}
