# First Grok Build prompt — fee + full site/docs

```bash
cd /path/to/deposit-now-v1.1
git fetch origin && git checkout pricing-under-32c
grok
```

Turn Plan Mode on (`/plan`), then paste the prompt in GROK-BUILD.md under "Paste this".

## Paste this

You are working in betrnames/deposit-now-v1.1, the live deposit.now x402 funding rail (Next.js App Router, Base mainnet USDC, Vercel).

This is one pass: change the fee math AND update docs + the entire site so humans and agents see the same pricing. Do not touch custody. Do not add key export. Do not refactor x402.ts or CDP.

Read first: AGENTS.md, lib/billing.ts, lib/product-copy.ts, lib/pricing.ts, lib/discovery.ts, lib/deposit-handler.ts, app/page.tsx, app/docs/page.tsx, public/llms.txt, public/openapi.json.

### 1. Fee math
In lib/billing.ts replace the flat 1% (`PLATFORM_FEE_BPS = 100`) with:
- PLATFORM_FEE_BPS = 25 (0.25%)
- PLATFORM_FEE_MIN_USDC = 0.001
- PLATFORM_FEE_MAX_USDC = 0.25
calculateDepositSplit: fee = clamp(net * bps / 10000, min, max), gross = net + fee, 6-decimal USDC rounding.
The cap exists so every fee stays under the ~$0.32 average x402 payment.

### 2. Words follow the math
Update lib/product-copy.ts first. New fee language should be something like:
"0.25% platform fee, $0.001 minimum, $0.25 maximum — always under the $0.32 average x402 payment."
Do not leave "amount + 1%" anywhere that agents or users will read.

Then update every surface listed in AGENTS.md: homepage, docs page, discovery (feePercent is currently hardcoded to 1), llms.txt, llms-full.txt, openapi.json, README, footer/header if needed, MCP server copy, guardrails doc, social text files if they still say 1%.

Grep the repo for: 1% , amount + 1 , feePercent , PLATFORM_FEE

### 3. Do not change
- CDP child-wallet behavior (platform_managed, no key export)
- payment_received vs forwardStatus honesty
- Network (Base mainnet)
- Auth model (payment is auth)

### 4. Done when
- TypeScript compiles
- Homepage, /docs, /llms.txt, /openapi.json, and /api/discovery all describe the same 0.25% / $0.25-cap fee
- No remaining user-facing "1%" fee copy

Stop after that. Do not start multi-chain or atomic settlement in this pass.
