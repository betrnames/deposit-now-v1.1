# deposit.now — restore runbook

A backup you have never restored is not a backup. Run this once on a throwaway
Neon branch before launch, then keep it updated.

## What you have

- **Neon**: point-in-time recovery (PITR) is on by default for every branch.
  Tables: `transactions`, `payment_nonces`, `failed_forwards`, `rate_limits`,
  `guardrail_events`, `child_agents`, `target_velocity_config`.
- **Vercel Blob**: receipts (`receipts/<id>.json`), deposit intents
  (`deposit-intents/`), failed-forward records (`failed-forwards/`), settlement
  logs (`settlements/`), nonce claims (`payment-nonces/`).

## Restore steps (Neon)

1. In the Neon console, open the `deposit-now` project → Branches.
2. Create a branch from a point in time (e.g. 30 minutes ago) — free, instant.
3. Point a throwaway `DATABASE_URL` at that branch and run:
   `node scripts/run-migration.mjs migrations/001_transaction_guardrails.sql`
   (and 002, 003) — should be no-ops on an existing schema.
4. Verify: `SELECT count(*) FROM transactions;` and
   `SELECT count(*) FROM failed_forwards WHERE status = 'pending_manual';`.
5. Delete the throwaway branch.

## Restore steps (Blob)

Blob objects are immutable and versioned. If a receipt or intent is corrupted,
re-upload is not needed — the original object id is stable. For a full wipe,
re-run settlement replay from on-chain data using `scripts/watch-deposits.mjs`
against the platform wallet.

## Ongoing

- Hit `https://deposit.now/api/health` from an uptime monitor every 5 minutes.
- Review `/api/admin/reconcile` (Bearer ADMIN_API_KEY) daily for pending forwards.
- Neon PITR window: check project settings — default is 7 days on free tier;
  extend if you need longer.
