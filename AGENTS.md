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

## Pricing goal

Current code: `PLATFORM_FEE_BPS = 100` (1% of net) in `lib/billing.ts`.

Market average x402 payment is about **$0.32**. The platform fee on every deposit must stay **strictly under $0.32**.

Target model:
- `PLATFORM_FEE_BPS = 25` (0.25%)
- `PLATFORM_FEE_MIN_USDC = 0.001`
- `PLATFORM_FEE_MAX_USDC = 0.25`
- `fee = clamp(net * bps / 10000, min, max)` then `gross = net + fee`
- 6-decimal USDC rounding

One function owns the math. Site copy, docs, OpenAPI, llms.txt, and discovery all follow that function. Do not invent a second fee path.

## Full site + docs surface (must all match)

Source of truth for math: `lib/billing.ts`
Source of truth for words: `lib/product-copy.ts`

Update every surface in the same pass:

Human site
- `app/page.tsx` (homepage hero, steps, fee callouts)
- `app/docs/page.tsx` and `app/docs/layout.tsx`
- `app/receipt/[id]/page.tsx` if it mentions 1%
- `components/Header.tsx`, `components/SiteFooter.tsx`
- `lib/seo.ts` if titles/descriptions hardcode 1%

Agent / machine docs
- `public/llms.txt`
- `public/llms-full.txt`
- `public/openapi.json`
- `lib/discovery.ts` (`feePercent: 1` and `price: 'dynamic — amount + 1%...'`)
- `app/.well-known/x402/route.ts` if it hardcodes price
- `mcp-server/src/index.ts` and `mcp-server/README.md`

Repo docs
- `README.md`
- `GO-LIVE.md`
- `DEPOSIT-NOW-TRANSACTION-GUARDRAILS.md`
- `lib/pricing.ts`

Social leftovers (only if they hardcode 1%)
- `public/social/x-content.txt`
- `public/social/betrnames-x-content.txt`

Search the repo for `1%`, `amount + 1`, `feePercent`, and `PLATFORM_FEE` so nothing is left behind.

## After code changes

- Keep TypeScript compiling.
- Do not commit secrets, `.env`, or CDP private credentials.
- Prefer this branch over pushing straight to `main` for live pricing.
