# deposit.now

**Open x402 funding rail for agents.** Fund any EVM wallet — or provision a managed child — via one HTTP call. Pay 0.25% (min $0.001, max $0.25) over HTTP 402; net forwards after settlement. No deposit.now API key.

**Live:** [deposit.now](https://deposit.now)

## What it does

- **x402 deposits** — `POST /api/deposit` with `{ target, amount }` or `{ provision: true, label, amount }`
- **Managed children** — optional CDP Server Wallet provision (platform-managed keys; no export in v1)
- **CDP settlement** — platform receive + forward on Base
- **MCP server** — agents can call the funding rail from Cursor / Claude Desktop
- **Public receipts** — optional `/receipt/{id}` when Blob storage is configured

## Honest boundaries

- Complements Coinbase **CDP Fund/Send** inside Agentic / Server Wallets — does not replace that stack.
- `payment_received` ≠ funds already on target — check `forwardStatus`.
- Managed children are **platform_managed**; for full custody, generate your own address and pass `target`.

## Tech stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js, TypeScript, Tailwind v4 |
| Database | Neon Postgres (guardrails, children) |
| Payments | x402, CDP Server Wallets |
| AI integration | MCP server |
| Hosting | Vercel |

## Docs

- https://deposit.now/docs
- https://deposit.now/llms.txt
- https://deposit.now/openapi.json
