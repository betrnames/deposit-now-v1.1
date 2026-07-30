# deposit.now MCP Server

Thin MCP wrapper around the deposit.now x402 API for Cursor, Claude Desktop, and other MCP hosts.

## Tools

| Tool | Description |
|------|-------------|
| `deposit_now_describe` | Discovery manifest (no payment) |
| `deposit_now_list_merchants` | Merchant catalog (no payment) |
| `deposit_now_trigger_deposit` | Paid x402 deposit (target **or** provision+label; needs `EVM_PRIVATE_KEY`) |
| `deposit_now_get_receipt` | Receipt URL lookup by ID |

## Setup

```powershell
cd mcp-server
npm install
npm run build
```

## Cursor / Claude Desktop config

```json
{
  "mcpServers": {
    "deposit-now": {
      "command": "node",
      "args": ["C:/Users/gabem/Projects/deposit-now-v1.1/mcp-server/dist/index.js"],
      "env": {
        "EVM_PRIVATE_KEY": "<wallet with Base mainnet USDC — set locally, never commit>"
      }
    }
  }
}
```

## Environment

| Variable | Default | Purpose |
|----------|---------|---------|
| `DEPOSIT_API_BASE` | `https://deposit.now` | API host |
| `EVM_PRIVATE_KEY` | — | Required for `deposit_now_trigger_deposit` |