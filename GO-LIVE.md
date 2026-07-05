# deposit.now — go-live checklist

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
faucet.circle.com) and run the /docs JavaScript example against
http://localhost:3000/api/deposit with `EVM_PRIVATE_KEY` set to the throwaway key.
