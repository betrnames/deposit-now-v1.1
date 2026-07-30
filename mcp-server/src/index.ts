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
    throw new Error('EVM_PRIVATE_KEY is required for paid deposit calls (paying agent only)');
  }
  const signer = privateKeyToAccount(key as `0x${string}`);
  const client = new x402Client();
  client.register('eip155:*', new ExactEvmScheme(signer));
  return wrapFetchWithPayment(fetch, client);
}

const server = new McpServer({
  name: 'deposit-now',
  version: '3.0.0',
});

server.tool(
  'deposit_now_describe',
  'Return the deposit.now discovery manifest (funding layer for AI agents).',
  {},
  async () => {
    const { status, body } = await jsonFetch('/api/discovery');
    return {
      content: [{ type: 'text', text: JSON.stringify({ status, body }, null, 2) }],
    };
  }
);

server.tool(
  'deposit_now_trigger_deposit',
  'Fund a wallet via x402 (amount + 1%). Pass target for an existing address, or provision+label to create/fund a managed child wallet. Requires EVM_PRIVATE_KEY on the paying agent with USDC on Base. Managed children are platform_managed (no key export).',
  {
    target: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/)
      .optional()
      .describe('EVM address receiving net USDC (omit when provision is true)'),
    amount: z.string().describe('Net USDC to forward to target (e.g. "50.00")'),
    memo: z.string().max(256).optional().describe('Optional memo, e.g. Fund child trading agent'),
    provision: z
      .boolean()
      .optional()
      .describe('If true, create/resolve a managed CDP child wallet and fund it (do not pass target)'),
    label: z
      .string()
      .max(36)
      .optional()
      .describe('Stable child label when provision=true (e.g. trading-agent-1)'),
  },
  async ({ target, amount, memo, provision, label }) => {
    const path = '/api/deposit';
    if (provision && target) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: 'ambiguous_target',
              message: 'Pass either target or provision, not both.',
            }),
          },
        ],
        isError: true,
      };
    }
    if (!provision && !target) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: 'missing_target',
              message: 'Pass target, or provision:true with label.',
            }),
          },
        ],
        isError: true,
      };
    }
    if (provision && !label) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: 'missing_provision_identity',
              message: 'provision requires label for a stable child wallet.',
            }),
          },
        ],
        isError: true,
      };
    }
    const paidFetch = paymentFetch();
    const payload = provision
      ? { provision: true, label, amount, memo }
      : { target, amount, memo };
    const res = await paidFetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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
  'Fetch a public deposit receipt by ID (from receiptId / receiptUrl).',
  {
    receiptId: z
      .string()
      .regex(/^[a-f0-9]{16,32}$/)
      .describe('Receipt ID from API response'),
  },
  async ({ receiptId }) => {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              receiptId,
              receiptUrl: `${API_BASE}/receipt/${receiptId}`,
              note: 'Open receiptUrl for settlement proof, target, fee, and Basescan links.',
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
