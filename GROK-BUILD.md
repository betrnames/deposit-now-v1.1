# First Grok Build prompt

From the repo root:

```bash
cd /path/to/deposit-now-v1.1
git checkout pricing-under-32c
grok
```

Turn Plan Mode on (`/plan`), then paste the prompt below.

---

You are working in betrnames/deposit-now-v1.1, the live deposit.now x402 funding rail (Next.js, Base mainnet USDC).

Goal: change platform pricing so the fee is always under the current ~$0.32 average x402 payment. Do not touch custody. Do not add key export.

Read first:
- AGENTS.md
- lib/billing.ts
- lib/product-copy.ts
- lib/pricing.ts
- lib/deposit-handler.ts

Implement:
1. In lib/billing.ts, replace the flat 1% (`PLATFORM_FEE_BPS = 100`) with:
   - PLATFORM_FEE_BPS = 25 (0.25%)
   - PLATFORM_FEE_MIN_USDC = 0.001
   - PLATFORM_FEE_MAX_USDC = 0.25
   Update calculateDepositSplit so fee = clamp(net * bps / 10000, min, max), then gross = net + fee. Keep 6-decimal USDC rounding.
2. Update every user-facing string that says "amount + 1%" or "1% platform fee" so it matches the new model. Source of copy is lib/product-copy.ts. Also update lib/pricing.ts, homepage, docs, public/llms.txt, public/llms-full.txt, public/openapi.json, README.
3. Do not change CDP child-wallet behavior. Stay platform_managed, no key export.
4. Do not weaken payment_received vs forwardStatus honesty.
5. Add a tiny comment or helper test in billing if easy; otherwise just keep the math correct.

Stop after the fee + copy change compiles. Do not refactor x402.ts or CDP in this pass.

---

After you approve the plan, let it implement, then review the diff on `lib/billing.ts` first.
