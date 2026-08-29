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

## Pricing

Implemented in `lib/billing.ts`:
- `PLATFORM_FEE_BPS = 25` (0.25%)
- `PLATFORM_FEE_MIN_USDC = 0.001`
- `PLATFORM_FEE_MAX_USDC = 0.25`
- `fee = clamp(net * bps / 10000, min, max)` then `gross = net + fee`
- 6-decimal USDC rounding

Market average x402 payment is about **$0.32**. The platform fee on every deposit stays **strictly under $0.32** via the $0.25 cap.

One function owns the math (`calculateDepositSplit`). Site copy, docs, OpenAPI, llms.txt, and discovery all follow that function. Do not invent a second fee path.

Source of truth for math: `lib/billing.ts`
Source of truth for words: `lib/product-copy.ts`

## Surfaces that must match billing + product-copy

Human site: `app/page.tsx`, `app/docs/page.tsx`, `app/receipt/[id]/page.tsx`, `components/SiteFooter.tsx` (via `PRODUCT.taglineShort`).

Agent / machine docs: `public/llms.txt`, `public/llms-full.txt`, `public/openapi.json`, `lib/discovery.ts` (`feePercent` from `PLATFORM_FEE_PERCENT`), `mcp-server/src/index.ts`.

Repo docs: `README.md`, `GO-LIVE.md`, `lib/pricing.ts`.

Discovery and 402 bodies import fee numbers from `lib/billing.ts` — do not hardcode a second percent.

## After code changes

- Keep TypeScript compiling.
- Do not commit secrets, `.env`, or CDP private credentials.
- Prefer this branch over pushing straight to `main` for live pricing.
