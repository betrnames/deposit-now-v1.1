# deposit.now — go-live checklist

## Phase 1 shipped (2026-07-05): verifiable deposit receipts

- Every settled payment writes a public receipt to Vercel Blob (store
  `deposit-receipts`) from the `onAfterSettle` hook in middleware.ts.
- Receipt ID is derived deterministically from the payment signature, so the
  API response can include `receiptId`/`receiptUrl` before settlement lands.
- Public page: `https://deposit.now/receipt/<id>` — payer, amount, payTo,
  settlement time, and a Basescan link to the settlement transaction.
- Mainnet relaunch was intentionally rolled back until Phase 1 was live;
  X402_NETWORK was removed from production (CDP keys remain stored).
- HELD until mainnet relaunch: x402scan registration (rejects testnet) and
  Bazaar indexing (happens automatically on first mainnet settlement).

## Current state (2026-07-04)

- Real x402 v2 payment verification is live via `middleware.ts` (`@x402/next` `paymentProxy`).
- Network: **Base Sepolia testnet** (`eip155:84532`), facilitator: free `x402.org/facilitator`.
- Payments settle to `0x3f7a25Dc7307F5662489686e5A457DAD4879F685` (MetaMask account "deposit.now").
- Price: $0.01 USDC per call to `/api/deposit` (GET or POST).
- The old fake `X-Payment-Proof` header check is gone — the facilitator verifies and
  settles every payment before the route handler runs.

## Switching to Base mainnet (real money)

1. Create a Coinbase Developer Platform account at portal.cdp.coinbase.com (free;
   CDP facilitator settles USDC on Base with no fees).
2. Create an API key → you get an id and a secret. Do NOT paste them into chat.
3. In your terminal:
   ```
   vercel env add CDP_API_KEY_ID production      # paste id when prompted
   vercel env add CDP_API_KEY_SECRET production  # paste secret when prompted
   vercel env add X402_NETWORK production        # type: mainnet
   ```
4. Redeploy: `vercel deploy --prod --yes`
5. Verify: `curl -i https://deposit.now/api/deposit` → the base64 in the
   `Payment-Required` header should contain `eip155:8453` (mainnet) and the
   mainnet USDC asset address.
6. End-to-end test with a real payment (~$0.01) using the JS client from /docs
   before announcing.

The middleware auto-switches: mainnet requires all three env vars, anything else
stays on testnet. Local dev always runs testnet.

## Testing on testnet (optional, free)

Fund a throwaway wallet with Base Sepolia test USDC (Circle faucet:
faucet.circle.com), then from the project root:

```
$env:EVM_PRIVATE_KEY="0x..."   # throwaway key only — never paste into chat
npm run test:deposit           # hits production by default
```

Use `DEPOSIT_API_URL=http://localhost:3000/api/deposit` for local dev.
This proves the full loop: 402 → settle → receipt blob → `/receipt/<id>` page.
