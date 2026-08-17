-- Titan Gates runtime persistence contract v1. Idempotent/additive by policy.
CREATE TABLE IF NOT EXISTS players (
  player_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  account_level INTEGER NOT NULL DEFAULT 1,
  account_xp INTEGER NOT NULL DEFAULT 0,
  auth_subject TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT 'platform'
);

CREATE TABLE IF NOT EXISTS player_saves (
  player_id TEXT PRIMARY KEY REFERENCES players(player_id),
  save_version INTEGER NOT NULL DEFAULT 1,
  checksum TEXT NOT NULL,
  state_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS economy_ledger (
  ledger_id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL REFERENCES players(player_id),
  sequence INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('CURRENCY_CREDITED','CURRENCY_DEBITED')),
  currency TEXT NOT NULL,
  amount REAL NOT NULL CHECK (amount > 0),
  reason TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  idempotency_key TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS telemetry_events (
  event_id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL,
  type TEXT NOT NULL,
  payload_json TEXT NOT NULL DEFAULT '{}',
  session_id TEXT NOT NULL DEFAULT 'unknown',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS idempotency_keys (
  idempotency_key TEXT PRIMARY KEY,
  operation TEXT NOT NULL,
  player_id TEXT NOT NULL,
  response_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_audit_log (
  audit_id TEXT PRIMARY KEY,
  actor_subject TEXT NOT NULL,
  action TEXT NOT NULL,
  target_player_id TEXT NOT NULL,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);
