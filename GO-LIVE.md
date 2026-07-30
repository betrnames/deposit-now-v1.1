# deposit.now — go-live checklist (v3 funding layer)

## Product

**Open x402 funding rail for agents.** Agents fund any wallet — or provision a managed child — via one HTTP call. Amount + 1% · no humans · no deposit.now API key.

### Flow

1. `POST /api/deposit` `{ target, amount, memo? }` **or** `{ provision: true, label, amount, memo? }`
2. HTTP 402 for **amount + 1%** (provision mode returns `child.address` as target)
3. Agent pays USDC via x402 to platform CDP wallet
4. Confirm → fee retained → net forwarded to `target` via CDP
5. Public receipt at `/receipt/<id>`

### Managed children (v1)

- `provision: true` creates/resolves a CDP Server Wallet under deposit.now credentials.
- Keys are **platform_managed** — no private-key export, no child spend API in v1.
- Requires stable `label` and/or `Idempotency-Key` so retries hit the same wallet.
- For a child the parent fully controls, generate an address yourself and pass `target`.

### Retired

- Facilitator directory / dashboards
- Merchant registration, renew, topup, merchant webhooks
- Announcement / sunset bar

## Production env (Vercel secrets only)

```
CDP_API_KEY_ID
CDP_API_KEY_SECRET
CDP_WALLET_SECRET          # CDP Server Wallet auth — not a MetaMask raw key paste in repo
CDP_PLATFORM_ADDRESS       # optional override for payTo
X402_NETWORK=mainnet
BLOB_READ_WRITE_TOKEN
DATABASE_URL               # Neon — guardrails, payment nonces, failed-forward queue
ADMIN_API_KEY              # GET /api/admin/reconcile (Bearer or x-admin-key)
```

### Migrations (Neon)

```
node scripts/run-migration.mjs migrations/001_transaction_guardrails.sql
node scripts/run-migration.mjs migrations/002_payment_verification.sql
node scripts/run-migration.mjs migrations/003_child_agents.sql
```

**Never** put platform hot-wallet private keys or MetaMask secrets in `.env` for production settlement. Agents that *pay* may use their own client-side keys offline only.

## Verify

```
curl -i -X POST https://deposit.now/api/deposit \
  -H "Content-Type: application/json" \
  -d "{\"target\":\"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0\",\"amount\":\"1.00\",\"memo\":\"smoke\"}"
```

Expect 402; Payment-Required should include mainnet network when `X402_NETWORK=mainnet` + CDP keys are set.

## Local

Without mainnet CDP env, middleware falls back to Base Sepolia facilitator.

```
npm run dev
```

## Machine docs

- https://deposit.now/llms.txt
- https://deposit.now/llms-full.txt
- https://deposit.now/openapi.json
