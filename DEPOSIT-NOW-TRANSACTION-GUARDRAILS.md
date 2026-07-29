# deposit.now — Transaction Guardrails Specification

## Purpose

Add transaction-level safety controls to deposit.now to prevent fraud, abuse,
and runaway agent behavior on Base mainnet. These are fintech guardrails, not
AI guardrails — they protect the platform and merchants from malicious or
malfunctioning agents making autonomous USDC payments.

---

## Current State

| Layer              | Status                                      |
|--------------------|---------------------------------------------|
| HMAC webhooks      | Implemented (timing-safe comparison UNVERIFIED) |
| SSRF protection    | Implemented (private IP blocking)           |
| Slug validation    | Implemented (reserved name blocking)        |
| Receipt entropy    | Implemented (128-bit)                       |
| Rate limiting      | **NOT IMPLEMENTED**                         |
| Transaction caps   | **NOT IMPLEMENTED**                         |
| Velocity checks    | **NOT IMPLEMENTED**                         |
| Agent validation   | **NOT IMPLEMENTED**                         |
| Anomaly detection  | **NOT IMPLEMENTED**                         |
| Failed settlement  | **PARTIALLY IMPLEMENTED** (logged, not alerted) |

---

## Architecture Overview

```
Agent (USDC) ──► x402 facilitator ──► Platform CDP Wallet
                                          │
                            ┌──────────────┤
                            │              │
                     [GUARDRAILS]     Fee retained
                            │
                            ▼
                    Merchant payTo wallet
```

All guardrail checks execute BEFORE the platform-to-merchant forward transfer.
If any check fails, the agent's USDC sits in the platform CDP wallet and gets
flagged for manual review — it is NOT automatically refunded (refund logic is
a separate, future feature).

---

## Guardrail Layers

### Layer 1: Rate Limiting (API Surface)

**What it prevents:** Brute-force endpoint abuse, DDoS, enumeration attacks.

| Endpoint Pattern     | Limit              | Window  | Key             |
|----------------------|---------------------|---------|-----------------|
| `POST /api/deposit`  | 30 requests         | 1 min   | Agent wallet    |
| `GET  /api/merchants`| 60 requests         | 1 min   | IP address      |
| `GET  /api/receipt/*` | 120 requests        | 1 min   | IP address      |
| `POST /api/merchant` | 5 requests          | 1 hour  | API key         |
| All other endpoints  | 100 requests        | 1 min   | IP address      |

**Implementation:** Cloudflare Workers has no built-in rate limiter on the free
plan. Use D1 with a sliding window counter table.

```sql
CREATE TABLE rate_limits (
  key       TEXT NOT NULL,
  endpoint  TEXT NOT NULL,
  window    INTEGER NOT NULL,  -- Unix timestamp of window start (floored)
  count     INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (key, endpoint, window)
);
```

**Check logic (pseudocode):**
```
windowStart = floor(now / windowSeconds) * windowSeconds
row = SELECT count FROM rate_limits WHERE key=? AND endpoint=? AND window=?
IF row.count >= limit → return 429 with Retry-After header
ELSE → INSERT OR UPDATE count = count + 1
```

**Cleanup:** Cron trigger or lazy cleanup — DELETE rows WHERE window < (now - 2 * windowSeconds).

---

### Layer 2: Transaction Amount Caps

**What it prevents:** A rogue agent draining a merchant's trust or the platform
wallet via a single oversized transaction.

| Tier     | Per-Transaction Cap | Rationale                          |
|----------|---------------------|------------------------------------|
| Catalog  | $100.00 USDC        | Discovery/small merchants, default |
| Rail     | $1,000.00 USDC      | Integrated merchants, higher trust |
| Network  | $10,000.00 USDC     | Enterprise, custom agreements      |

**Schema addition:**
```sql
ALTER TABLE merchants ADD COLUMN max_transaction_usdc REAL
  DEFAULT 100.00;
```

**Enforcement point:** Inside the deposit handler, BEFORE initiating the
platform-to-merchant forward:

```typescript
if (depositAmount > merchant.max_transaction_usdc) {
  // Hold funds in platform wallet
  // Log to guardrail_events table
  // Return 402 with error: "AMOUNT_EXCEEDS_MERCHANT_CAP"
  // Do NOT forward to merchant
}
```

Merchants can request cap increases via the onboarding flow (manual approval).

---

### Layer 3: Velocity Controls (Per-Merchant)

**What it prevents:** A compromised or malfunctioning agent flooding a merchant
with rapid small transactions that individually pass the cap but collectively
represent anomalous volume.

| Rule                     | Default          | Configurable |
|--------------------------|-------------------|--------------|
| Max transactions / hour  | 20                | Yes          |
| Max volume / hour        | $500.00 USDC     | Yes          |
| Max transactions / day   | 100               | Yes          |
| Max volume / day         | $2,000.00 USDC   | Yes          |

**Schema:**
```sql
CREATE TABLE merchant_velocity_config (
  merchant_slug       TEXT PRIMARY KEY,
  max_txn_per_hour    INTEGER DEFAULT 20,
  max_vol_per_hour    REAL    DEFAULT 500.00,
  max_txn_per_day     INTEGER DEFAULT 100,
  max_vol_per_day     REAL    DEFAULT 2000.00
);
```

**Tracking table (append-only log):**
```sql
CREATE TABLE transactions (
  id                TEXT PRIMARY KEY,       -- depositId or receipt ID
  merchant_slug     TEXT NOT NULL,
  agent_wallet      TEXT NOT NULL,
  amount_usdc       REAL NOT NULL,
  fee_usdc          REAL NOT NULL,
  net_usdc          REAL NOT NULL,
  status            TEXT NOT NULL DEFAULT 'pending',
  -- 'pending' | 'settled' | 'held' | 'failed' | 'refunded'
  agent_tx_hash     TEXT,                   -- agent → platform
  merchant_tx_hash  TEXT,                   -- platform → merchant
  guardrail_flags   TEXT,                   -- JSON array of triggered rules
  created_at        INTEGER NOT NULL,       -- Unix timestamp
  settled_at        INTEGER
);

CREATE INDEX idx_txn_merchant_time ON transactions(merchant_slug, created_at);
CREATE INDEX idx_txn_agent_time ON transactions(agent_wallet, created_at);
```

**Check logic:**
```typescript
const oneHourAgo = now - 3600;
const oneDayAgo  = now - 86400;

const hourly = await db.prepare(`
  SELECT COUNT(*) as cnt, COALESCE(SUM(amount_usdc), 0) as vol
  FROM transactions
  WHERE merchant_slug = ? AND created_at > ? AND status != 'failed'
`).bind(merchantSlug, oneHourAgo).first();

const daily = await db.prepare(`
  SELECT COUNT(*) as cnt, COALESCE(SUM(amount_usdc), 0) as vol
  FROM transactions
  WHERE merchant_slug = ? AND created_at > ? AND status != 'failed'
`).bind(merchantSlug, oneDayAgo).first();

if (hourly.cnt >= config.max_txn_per_hour)  → HOLD + flag "HOURLY_TXN_LIMIT"
if (hourly.vol >= config.max_vol_per_hour)  → HOLD + flag "HOURLY_VOL_LIMIT"
if (daily.cnt  >= config.max_txn_per_day)   → HOLD + flag "DAILY_TXN_LIMIT"
if (daily.vol  >= config.max_vol_per_day)   → HOLD + flag "DAILY_VOL_LIMIT"
```

---

### Layer 4: Per-Agent Velocity Controls

**What it prevents:** A single agent wallet spamming multiple merchants or
cycling deposits across the Bazaar.

| Rule                          | Default         |
|-------------------------------|-----------------|
| Max transactions / hour       | 30              |
| Max volume / hour             | $1,000.00 USDC  |
| Max unique merchants / hour   | 10              |

**No per-agent config table** — these are platform-wide defaults stored in
environment variables or a `platform_config` table. Agents don't onboard,
so there's no per-agent override mechanism yet.

**Check logic:** Same pattern as merchant velocity, but keyed on `agent_wallet`.

---

### Layer 5: Guardrail Event Log

Every triggered guardrail writes to an audit log for forensics and tuning.

```sql
CREATE TABLE guardrail_events (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type      TEXT NOT NULL,
  -- 'RATE_LIMIT' | 'AMOUNT_CAP' | 'VELOCITY_MERCHANT' |
  -- 'VELOCITY_AGENT' | 'SETTLEMENT_FAILURE' | 'MANUAL_HOLD'
  rule_name       TEXT NOT NULL,
  -- e.g. 'HOURLY_TXN_LIMIT', 'AMOUNT_EXCEEDS_MERCHANT_CAP'
  merchant_slug   TEXT,
  agent_wallet    TEXT,
  deposit_id      TEXT,
  amount_usdc     REAL,
  context_json    TEXT,          -- Additional context (counts, thresholds)
  action_taken    TEXT NOT NULL, -- 'BLOCKED' | 'HELD' | 'WARNED' | 'LOGGED'
  created_at      INTEGER NOT NULL
);

CREATE INDEX idx_guard_merchant ON guardrail_events(merchant_slug, created_at);
CREATE INDEX idx_guard_type ON guardrail_events(event_type, created_at);
```

---

### Layer 6: Settlement Failure Handling

**Current gap:** If the platform-to-merchant forward transfer fails, the funds
sit in the platform CDP wallet with only a log entry. No alerting, no retry,
no merchant notification.

**New behavior:**

```
Forward transfer fails
  → Set transaction status = 'failed'
  → Write guardrail_event: SETTLEMENT_FAILURE
  → Retry up to 3 times with exponential backoff (5s, 15s, 45s)
  → If all retries fail:
      → Set transaction status = 'held'
      → Fire webhook to merchant with status: 'settlement_held'
      → Add to a 'held_settlements' dashboard query
      → Platform operator manually resolves via CLI or admin endpoint
```

**Critical rule:** NEVER silently swallow merchant funds. A held settlement
is better than a lost settlement.

---

## Implementation Order

| Phase | What                           | Why First                                      |
|-------|--------------------------------|------------------------------------------------|
| 1     | `transactions` table + logging | Foundation — everything else reads from this    |
| 2     | `guardrail_events` table       | Audit trail before enforcing anything           |
| 3     | Transaction amount caps        | Simplest guard, highest impact                  |
| 4     | Rate limiting                  | Protects API surface                            |
| 5     | Merchant velocity controls     | Prevents volume abuse                           |
| 6     | Agent velocity controls        | Prevents cross-merchant abuse                   |
| 7     | Settlement failure retry       | Protects merchant trust                         |

---

## Guardrail Response Contract

All guardrail rejections return a consistent error shape:

```json
{
  "error": "GUARDRAIL_BLOCKED",
  "code": "HOURLY_VOL_LIMIT",
  "message": "Merchant hourly volume limit exceeded. Try again later.",
  "retryAfter": 1823,
  "depositId": "dep_abc123"
}
```

**Rules:**
- Never expose internal thresholds in the error response
- Never reveal merchant wallet addresses in error responses
- Always include `retryAfter` (seconds) when applicable
- Always include `depositId` so the agent can reference it
- HTTP status: 429 for rate limits, 402 for transaction blocks

---

## D1 Migration Script (All Tables)

```sql
-- Migration: 001_transaction_guardrails.sql

-- Transaction log (append-only)
CREATE TABLE IF NOT EXISTS transactions (
  id              TEXT PRIMARY KEY,
  merchant_slug   TEXT NOT NULL,
  agent_wallet    TEXT NOT NULL,
  amount_usdc     REAL NOT NULL,
  fee_usdc        REAL NOT NULL,
  net_usdc        REAL NOT NULL,
  fee_tier        TEXT NOT NULL,        -- 'catalog' | 'rail' | 'network'
  status          TEXT NOT NULL DEFAULT 'pending',
  agent_tx_hash   TEXT,
  merchant_tx_hash TEXT,
  guardrail_flags TEXT,
  error_message   TEXT,
  retry_count     INTEGER DEFAULT 0,
  created_at      INTEGER NOT NULL,
  settled_at      INTEGER
);

CREATE INDEX IF NOT EXISTS idx_txn_merchant_time
  ON transactions(merchant_slug, created_at);
CREATE INDEX IF NOT EXISTS idx_txn_agent_time
  ON transactions(agent_wallet, created_at);
CREATE INDEX IF NOT EXISTS idx_txn_status
  ON transactions(status);

-- Merchant velocity config
CREATE TABLE IF NOT EXISTS merchant_velocity_config (
  merchant_slug     TEXT PRIMARY KEY,
  max_txn_per_hour  INTEGER DEFAULT 20,
  max_vol_per_hour  REAL    DEFAULT 500.00,
  max_txn_per_day   INTEGER DEFAULT 100,
  max_vol_per_day   REAL    DEFAULT 2000.00
);

-- Rate limiting
CREATE TABLE IF NOT EXISTS rate_limits (
  key       TEXT NOT NULL,
  endpoint  TEXT NOT NULL,
  window    INTEGER NOT NULL,
  count     INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (key, endpoint, window)
);

-- Guardrail audit log
CREATE TABLE IF NOT EXISTS guardrail_events (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type      TEXT NOT NULL,
  rule_name       TEXT NOT NULL,
  merchant_slug   TEXT,
  agent_wallet    TEXT,
  deposit_id      TEXT,
  amount_usdc     REAL,
  context_json    TEXT,
  action_taken    TEXT NOT NULL,
  created_at      INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_guard_merchant
  ON guardrail_events(merchant_slug, created_at);
CREATE INDEX IF NOT EXISTS idx_guard_type
  ON guardrail_events(event_type, created_at);

-- Add max transaction cap to merchants table
-- (Run only if column doesn't exist — D1 doesn't support IF NOT EXISTS for ALTER)
ALTER TABLE merchants ADD COLUMN max_transaction_usdc REAL DEFAULT 100.00;
```

---

## Claude Code CLI Handoff

Open Claude Code in the deposit-now-v1.1 repo and run:

```
claude "Read DEPOSIT-NOW-TRANSACTION-GUARDRAILS.md and implement all 7 phases
in order. For each phase: (1) run the D1 migration, (2) write the guardrail
check function in a new lib/guardrails.ts module, (3) integrate it into the
deposit handler flow BEFORE the merchant forward transfer, (4) add the
guardrail_events logging, (5) verify the error response contract matches the
spec. After all phases, run a dry walkthrough of a $1.00 test deposit showing
which guardrail checks fire and in what order. Do NOT modify the settlement
split logic — only add guardrails around it."
```

---

## What This Does NOT Cover (Future Work)

- **Automated refund flow** — held funds require manual resolution today
- **Merchant alerting** — webhook for guardrail events (notify merchant when
  their velocity limit is hit)
- **Agent allowlisting** — trusted agents with higher limits
- **On-chain monitoring** — watching for USDC transfers that bypass the API
- **Smart contract guardrails** — on-chain enforcement vs. app-layer enforcement
- **Admin dashboard** — UI for viewing held settlements and guardrail events
- **Merchant self-service** — letting merchants adjust their own velocity config

These are all post-revenue features. Ship the base guardrails first.
