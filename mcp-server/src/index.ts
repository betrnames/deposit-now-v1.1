#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { x402Client } from '@x402/core/client';
import { wrapFetchWithPayment } from '@x402/fetch';
import { ExactEvmScheme } from '@x402/evm/exact/client';
import { privateKeyToAccount } from 'viem/accounts';

const API_BASE = process.env.DEPOSIT_API_BASE ?? 'https://deposit.now';

async function jsonFetch(path: string) {
  const res = await fetch(`${API_BASE}${path}`, { headers: { Accept: 'application/json' } });
  const text = await res.text();
  let body: unknown = text;
  try {
    body = JSON.parse(text);
  } catch {
    // keep text
  }
  return { status: res.status, body };
}

function paymentFetch() {
  const key = process.env.EVM_PRIVATE_KEY;
  if (!key) {
    throw new Error('EVM_PRIVATE_KEY is required for paid deposit calls');
  }
  const signer = privateKeyToAccount(key as `0x${string}`);
  const client = new x402Client();
  client.register('eip155:*', new ExactEvmScheme(signer));
  return wrapFetchWithPayment(fetch, client);
}

const server = new McpServer({
  name: 'deposit-now',
  version: '1.0.0',
});

server.tool(
  'deposit_now_describe',
  'Return the deposit.now x402 discovery manifest (endpoints, network, OpenAPI pointers).',
  {},
  async () => {
    const { status, body } = await jsonFetch('/api/discovery');
    return {
      content: [{ type: 'text', text: JSON.stringify({ status, body }, null, 2) }],
    };
  }
);

server.tool(
  'deposit_now_list_merchants',
  'List active merchant-scoped deposit endpoints and their payTo addresses.',
  {},
  async () => {
    const { status, body } = await jsonFetch('/api/merchants');
    return {
      content: [{ type: 'text', text: JSON.stringify({ status, body }, null, 2) }],
    };
  }
);

server.tool(
  'deposit_now_trigger_deposit',
  'Trigger an x402 deposit (platform or merchant). Requires EVM_PRIVATE_KEY with USDC on Base mainnet.',
  {
    amount: z.string().default('100.00').describe('Deposit intent amount (metadata)'),
    account: z.string().default('agent-wallet-123').describe('Target account identifier'),
    merchantSlug: z
      .string()
      .optional()
      .describe('Optional merchant slug; omit for platform /api/deposit'),
  },
  async ({ amount, account, merchantSlug }) => {
    const path = merchantSlug
      ? `/api/merchants/${merchantSlug}/deposit`
      : '/api/deposit';
    const paidFetch = paymentFetch();
    const res = await paidFetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, account }),
    });
    const body = await res.json();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ status: res.status, url: `${API_BASE}${path}`, body }, null, 2),
        },
      ],
    };
  }
);

server.tool(
  'deposit_now_get_receipt',
  'Fetch a public deposit receipt by ID (16-char hex from receiptId / receiptUrl).',
  {
    receiptId: z.string().regex(/^[a-f0-9]{16}$/).describe('Receipt ID from API response'),
  },
  async ({ receiptId }) => {
    const res = await fetch(`${API_BASE}/receipt/${receiptId}`, {
      headers: { Accept: 'text/html' },
    });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              receiptId,
              receiptUrl: `${API_BASE}/receipt/${receiptId}`,
              pageStatus: res.status,
              note: 'Open receiptUrl for human-readable settlement proof with Basescan link.',
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('deposit-now-mcp failed:', error);
  process.exit(1);
});