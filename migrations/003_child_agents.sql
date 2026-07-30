-- Migration: 003_child_agents.sql
-- Managed child agent wallets (CDP Server Wallets provisioned by deposit.now)

CREATE TABLE IF NOT EXISTS child_agents (
  id              TEXT PRIMARY KEY,
  cdp_name        TEXT NOT NULL UNIQUE,
  address         TEXT NOT NULL UNIQUE,
  label           TEXT,
  parent_wallet   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_funded_at  TIMESTAMPTZ,
  metadata        JSONB
);

CREATE INDEX IF NOT EXISTS idx_child_parent
  ON child_agents(parent_wallet, created_at);
CREATE INDEX IF NOT EXISTS idx_child_address
  ON child_agents(address);
CREATE INDEX IF NOT EXISTS idx_child_label
  ON child_agents(label, created_at);
