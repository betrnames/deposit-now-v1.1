-- Migration: 002_payment_verification.sql
-- Payment nonce replay protection + failed-forward reconciliation queue

CREATE TABLE IF NOT EXISTS payment_nonces (
  nonce          TEXT PRIMARY KEY,
  deposit_id     TEXT NOT NULL,
  agent_wallet   TEXT,
  claimed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_nonces_deposit
  ON payment_nonces(deposit_id);
CREATE INDEX IF NOT EXISTS idx_payment_nonces_claimed
  ON payment_nonces(claimed_at);

CREATE TABLE IF NOT EXISTS failed_forwards (
  id               TEXT PRIMARY KEY,
  deposit_id       TEXT NOT NULL,
  target_address   TEXT NOT NULL,
  net_usdc         NUMERIC(18,6) NOT NULL,
  gross_usdc       NUMERIC(18,6) NOT NULL,
  agent_tx_hash    TEXT,
  error_message    TEXT NOT NULL,
  retry_count      INTEGER NOT NULL DEFAULT 0,
  status           TEXT NOT NULL DEFAULT 'pending_manual',
  memo             TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_failed_forwards_status
  ON failed_forwards(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_failed_forwards_target
  ON failed_forwards(target_address, created_at DESC);
