# deposit.now — agent instructions

This is an open x402 funding rail on Base. Agents POST `/api/deposit`, pay USDC via HTTP 402, and net funds forward to a target EVM address or a managed CDP child wallet.

Repo: `betrnames/deposit-now-v1.1`
Live: https://deposit.now
Stack: Next.js App Router, TypeScript, Coinbase CDP, x402, Vercel.

## Non-negotiables

- Stay complementary to Coinbase CDP Fund/Send. Do not pretend this replaces that stack.
- Do not add key export or server-side private-key custody. Managed children stay `platform_managed`.
- Payment is auth. No deposit.now API key for payers.
- `200` / `payment_received` is not delivery. Keep `forwardStatus` honest.
- Do not hold user private keys. Forward to addresses the caller already controls, or to CDP-managed children.

## Pricing goal (this branch)

Current code: `PLATFORM_FEE_BPS = 100` (1% of net) in `lib/billing.ts`.

Market average x402 payment is about **$0.32**. The platform fee on every deposit must stay **strictly under $0.32**.

Target model:
- Keep a small percent for large deposits, but **cap the fee at $0.25**.
- Floor the fee at **$0.001** so dust still covers settlement bookkeeping.
- Suggested: `PLATFORM_FEE_BPS = 25` (0.25%) + `PLATFORM_FEE_MIN_USDC = 0.001` + `PLATFORM_FEE_MAX_USDC = 0.25`.
- On a $0.32 deposit that is a fraction of a cent, not a percent tax that scales into dollars.

`calculateDepositSplit` must apply: `fee = clamp(net * bps / 10000, min, max)` then `gross = net + fee`.

## Files that mention the fee (update all of them)

- `lib/billing.ts` — source of truth
- `lib/pricing.ts`
- `lib/product-copy.ts`
- `lib/discovery.ts`
- `app/page.tsx`
- `app/docs/page.tsx`
- `public/llms.txt`
- `public/llms-full.txt`
- `public/openapi.json`
- `README.md`
- `DEPOSIT-NOW-TRANSACTION-GUARDRAILS.md` if it hardcodes 1%

Do not invent a second fee path. One function, one number, copy follows the function.

## After code changes

- Keep TypeScript compiling.
- Do not commit secrets, `.env`, or CDP private credentials.
- Prefer a branch + PR over pushing straight to `main` if the change is live pricing.
