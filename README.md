# Deposit Now

Agent-to-agent funding rail built on the x402 protocol. Enables autonomous AI agents to send and receive payments on-chain.

**Live:** [deposit-now-v11.vercel.app](https://deposit-now-v11.vercel.app)

## What it does

Deposit Now provides the payment infrastructure for agentic commerce — letting AI agents autonomously fund, transact, and settle without human intervention.

- **x402 protocol** — HTTP-native payment negotiation between agents
- - **CDP platform wallets** — Coinbase Developer Platform wallet integration for on-chain settlement
  - - **MCP server** — Model Context Protocol server so LLMs can interact with the funding layer directly
    - - **On-chain billing** — Transparent, verifiable transaction records
     
      - ## Tech stack
     
      - | Layer | Tech |
      - |-------|------|
      - | Frontend | Next.js, TypeScript, Tailwind v4 |
      - | Backend | Supabase (Postgres + migrations) |
      - | Payments | x402 protocol, CDP wallets |
      - | AI integration | MCP server |
      - | Hosting | Vercel |
     
      - ## Why it matters
     
      - As AI agents begin acting autonomously — booking services, purchasing resources, delegating tasks — they need payment rails designed for machine-to-machine commerce. Deposit Now is that infrastructure layer.
