# deposit.now — go-live checklist

## Phase 1 shipped (2026-07-05): verifiable deposit receipts

- Every settled payment writes a public receipt to Vercel Blob (store
  `deposit-receipts`) from the `onAfterSettle` hook in middleware.ts.
- Receipt ID is derived deterministically from the payment signature, so the
  API response can include `receiptId`/`receiptUrl` before settlement lands.
- Public page: `https://deposit.now/receipt/<id>` — payer, amount, payTo,
  settlement time, and a Basescan link to the settlement transaction.

## Current state (2026-07-06)

- Real x402 v2 payment verification is live via `middleware.ts` (`@x402/next` `paymentProxy`).
- **Production network: Base mainnet** (`eip155:8453`), facilitator: Coinbase Developer Platform (CDP).
- Payments settle to `0x3f7a25Dc7307F5662489686e5A457DAD4879F685` (MetaMask account "deposit.now").
- Asset: USDC `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`.
- Price: $0.01 USDC per call to `/api/deposit` (GET or POST).
- Site copy, docs, OpenAPI, and `llms.txt` all reference Base mainnet.

## Production env (required for mainnet)

```
CDP_API_KEY_ID       # set via: vercel env add CDP_API_KEY_ID production
CDP_API_KEY_SECRET   # set via: vercel env add CDP_API_KEY_SECRET production
X402_NETWORK=mainnet # set via: vercel env add X402_NETWORK production
BLOB_READ_WRITE_TOKEN
```

Verify: `curl -i https://deposit.now/api/deposit` → the base64 in the
`Payment-Required` header should contain `eip155:8453` and the mainnet USDC asset.

The middleware auto-switches: mainnet requires all three CDP env vars; anything else
falls back to Base Sepolia testnet via `x402.org/facilitator`. Local dev always runs testnet.

## Phase 2 shipped (2026-07-06): merchant endpoints

- `GET /api/merchants` — public catalog of merchant deposit routes
- `POST /api/merchants/{slug}/deposit` — x402-protected; USDC settles to merchant `payTo`
- Optional `deposit.settled` webhooks (HMAC-signed when `webhookSecret` is set)
- Register merchants: `POST /api/merchants` with `Authorization: Bearer $MERCHANT_ADMIN_SECRET`

## Phase 3 shipped (2026-07-06): discovery flywheel

- `GET /.well-known/x402` and `GET /api/discovery` — machine-readable manifest
- Bazaar extension on all deposit routes (already in middleware)
- CDP Bazaar indexes after first mainnet settlement — no separate registration
- OpenAPI + llms.txt updated with merchant paths

## Next steps

1. End-to-end mainnet test with a real payment (~$0.01) using the JS client from /docs.
2. Register additional merchants via admin API.
3. MCP server: `mcp-server/` — add to Cursor MCP config (see mcp-server/README.md).
4. x402scan listing (browse at https://www.x402scan.com after Bazaar indexing).

## Testing on testnet (local dev, free)

Fund a throwaway wallet with Base Sepolia test USDC (Circle faucet:
faucet.circle.com), then from the project root:

```
$env:EVM_PRIVATE_KEY="0x..."   # throwaway key only — never paste into chat
$env:DEPOSIT_API_URL="http://localhost:3000/api/deposit"
npm run test:deposit
```

## Testing on mainnet (production, real USDC)

```
$env:EVM_PRIVATE_KEY="0x..."   # wallet with ~0.01 USDC on Base mainnet
npm run test:deposit           # hits https://deposit.now/api/deposit by default
```

This proves the full loop: 402 → settle → receipt blob → `/receipt/<id>` page.