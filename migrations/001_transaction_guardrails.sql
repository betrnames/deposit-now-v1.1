-- Migration: 001_transaction_guardrails.sql
-- Postgres (Neon) schema for deposit.now transaction guardrails

-- Transaction log (append-only)
CREATE TABLE IF NOT EXISTS transactions (
  id                TEXT PRIMARY KEY,
  target_address    TEXT NOT NULL,
  agent_wallet      TEXT NOT NULL,
  amount_usdc       NUMERIC(18,6) NOT NULL,
  fee_usdc          NUMERIC(18,6) NOT NULL,
  net_usdc          NUMERIC(18,6) NOT NULL,
  fee_tier          TEXT NOT NULL DEFAULT 'catalog',
  status            TEXT NOT NULL DEFAULT 'pending',
  agent_tx_hash     TEXT,
  merchant_tx_hash  TEXT,
  guardrail_flags   JSONB,
  error_message     TEXT,
  retry_count       INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  settled_at        TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_txn_target_time
  ON transactions(target_address, created_at);
CREATE INDEX IF NOT EXISTS idx_txn_agent_time
  ON transactions(agent_wallet, created_at);
CREATE INDEX IF NOT EXISTS idx_txn_status
  ON transactions(status);

-- Per-target velocity config (optional overrides; defaults are in code)
CREATE TABLE IF NOT EXISTS target_velocity_config (
  target_address    TEXT PRIMARY KEY,
  max_txn_per_hour  INTEGER DEFAULT 20,
  max_vol_per_hour  NUMERIC(18,6) DEFAULT 500.00,
  max_txn_per_day   INTEGER DEFAULT 100,
  max_vol_per_day   NUMERIC(18,6) DEFAULT 2000.00,
  max_transaction_usdc NUMERIC(18,6) DEFAULT 100.00
);

-- Rate limiting (sliding window counters)
CREATE TABLE IF NOT EXISTS rate_limits (
  key       TEXT NOT NULL,
  endpoint  TEXT NOT NULL,
  window    BIGINT NOT NULL,
  count     INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (key, endpoint, window)
);

-- Guardrail audit log
CREATE TABLE IF NOT EXISTS guardrail_events (
  id              SERIAL PRIMARY KEY,
  event_type      TEXT NOT NULL,
  rule_name       TEXT NOT NULL,
  target_address  TEXT,
  agent_wallet    TEXT,
  deposit_id      TEXT,
  amount_usdc     NUMERIC(18,6),
  context_json    JSONB,
  action_taken    TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guard_target
  ON guardrail_events(target_address, created_at);
CREATE INDEX IF NOT EXISTS idx_guard_type
  ON guardrail_events(event_type, created_at);
