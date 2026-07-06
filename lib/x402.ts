import { paymentProxy, x402ResourceServer } from '@x402/next';
import { ExactEvmScheme } from '@x402/evm/exact/server';
import { HTTPFacilitatorClient } from '@x402/core/server';
import {
  declareDiscoveryExtension,
  bazaarResourceServerExtension,
} from '@x402/extensions/bazaar';
import { facilitator as cdpFacilitator } from '@coinbase/x402';
import { put } from '@vercel/blob';
import {
  getMerchant,
  merchantSlugFromPath,
  ensureDefaultMerchants,
} from '@/lib/merchants';
import { buildWebhookPayload, deliverMerchantWebhook } from '@/lib/webhooks';
import { receiptIdFromPayload, receiptBlobPath } from '@/lib/receipts';
import type { HTTPRequestContext } from '@x402/core/server';

export const PLATFORM_PAY_TO = '0x3f7a25Dc7307F5662489686e5A457DAD4879F685';

const useMainnet =
  process.env.X402_NETWORK === 'mainnet' &&
  !!process.env.CDP_API_KEY_ID &&
  !!process.env.CDP_API_KEY_SECRET;

export const X402_NETWORK = useMainnet ? 'eip155:8453' : 'eip155:84532';

const facilitatorClient = new HTTPFacilitatorClient(
  useMainnet ? cdpFacilitator : { url: 'https://x402.org/facilitator' }
);

const depositDiscovery = declareDiscoveryExtension({
  bodyType: 'json',
  input: { amount: '100.00', account: 'agent-wallet-123' },
  inputSchema: {
    properties: {
      amount: {
        type: 'string',
        description: 'Deposit amount to trigger, as a decimal string',
      },
      account: {
        type: 'string',
        description: 'Agent account identifier receiving the deposit',
      },
    },
    required: [],
  },
  output: {
    example: {
      status: 'success',
      depositAmount: '100.00',
      account: 'agent-wallet-123',
      message: 'Deposit of 100.00 triggered for agent account: agent-wallet-123',
      timestamp: '2026-07-06T00:00:00.000Z',
      paymentReceived: true,
      transactionId: 'txn_1751587200000_x7k2m9p4q',
      receiptId: 'a1b2c3d4e5f60718',
      receiptUrl: 'https://deposit.now/receipt/a1b2c3d4e5f60718',
    },
  },
});

const merchantDiscovery = declareDiscoveryExtension({
  bodyType: 'json',
  input: { amount: '100.00', account: 'agent-wallet-123' },
  inputSchema: {
    properties: {
      amount: {
        type: 'string',
        description: 'Deposit amount to trigger for the merchant account',
      },
      account: {
        type: 'string',
        description: 'Agent or customer account identifier',
      },
    },
    required: [],
  },
  output: {
    example: {
      status: 'success',
      merchantSlug: 'acme-corp',
      depositAmount: '100.00',
      account: 'agent-wallet-123',
      paymentReceived: true,
      receiptId: 'a1b2c3d4e5f60718',
      receiptUrl: 'https://deposit.now/receipt/a1b2c3d4e5f60718',
    },
  },
});

async function resolveMerchantPayTo(context: HTTPRequestContext): Promise<string> {
  const slug = merchantSlugFromPath(context.path);
  if (!slug) {
    throw new Error('Invalid merchant route');
  }
  const merchant = await getMerchant(slug);
  if (!merchant?.active) {
    throw new Error(`Unknown merchant: ${slug}`);
  }
  return merchant.payTo;
}

async function parseDepositBody(context: HTTPRequestContext) {
  try {
    if (!context.adapter.getBody) return { amount: null, account: null };
    const body = (await context.adapter.getBody()) as {
      amount?: string | number;
      account?: string;
    } | undefined;
    const amount =
      body?.amount !== undefined && body?.amount !== null ? String(body.amount) : null;
    const account = typeof body?.account === 'string' ? body.account : null;
    return { amount, account };
  } catch {
    return { amount: null, account: null };
  }
}

const server = new x402ResourceServer(facilitatorClient)
  .register(X402_NETWORK, new ExactEvmScheme())
  .registerExtension(bazaarResourceServerExtension)
  .onAfterSettle(async (ctx) => {
    try {
      if (!process.env.BLOB_READ_WRITE_TOKEN) return;

      const id = receiptIdFromPayload(ctx.paymentPayload);
      if (!id) return;

      const transport = ctx.transportContext as
        | { request?: HTTPRequestContext }
        | undefined;
      const requestPath = transport?.request?.path ?? 'https://deposit.now/api/deposit';
      const resource = requestPath.startsWith('http')
        ? requestPath
        : `https://deposit.now${requestPath}`;
      const merchantSlug = merchantSlugFromPath(requestPath);
      const merchant = merchantSlug ? await getMerchant(merchantSlug) : null;
      const depositBody = transport?.request
        ? await parseDepositBody(transport.request)
        : { amount: null, account: null };

      const payload = ctx.paymentPayload as {
        payload?: { authorization?: { from?: string } };
      };
      const req = ctx.requirements as {
        amount?: string;
        maxAmountRequired?: string;
        asset?: string;
        network?: string;
        payTo?: string;
      };
      const result = ctx.result as {
        payer?: string;
        transaction?: string;
        network?: string;
      };
      const amountAtomic = String(req.amount ?? req.maxAmountRequired ?? '');
      const receipt = {
        id,
        payer: result.payer ?? payload.payload?.authorization?.from ?? null,
        amountAtomic: amountAtomic || null,
        amountUsdc: amountAtomic ? (Number(amountAtomic) / 1e6).toFixed(6) : null,
        asset: req.asset ?? null,
        network: req.network ?? result.network ?? null,
        payTo: req.payTo ?? null,
        txHash: result.transaction ?? null,
        resource,
        settledAt: new Date().toISOString(),
        merchantSlug: merchant?.slug ?? null,
        merchantName: merchant?.name ?? null,
        depositAmount: depositBody.amount,
        account: depositBody.account,
      };

      await put(receiptBlobPath(id), JSON.stringify(receipt), {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json',
      });

      if (merchant?.webhookUrl) {
        const webhookPayload = buildWebhookPayload(merchant, receipt, depositBody);
        await deliverMerchantWebhook(merchant, webhookPayload);
      }
    } catch (error) {
      console.error('receipt write failed:', error);
    }
  });

void ensureDefaultMerchants(PLATFORM_PAY_TO);

export const middleware = paymentProxy(
  {
    '/api/deposit': {
      accepts: [
        {
          scheme: 'exact',
          price: '$0.01',
          network: X402_NETWORK,
          payTo: PLATFORM_PAY_TO,
        },
      ],
      description:
        'Trigger an autonomous agent deposit via deposit.now. Pays 0.01 USDC per call on Base mainnet.',
      mimeType: 'application/json',
      extensions: {
        ...depositDiscovery,
      },
    },
    '/api/merchants/:slug/deposit': {
      accepts: [
        {
          scheme: 'exact',
          price: '$0.01',
          network: X402_NETWORK,
          payTo: resolveMerchantPayTo,
        },
      ],
      description:
        'Merchant-scoped deposit endpoint. USDC settles directly to the merchant payTo address.',
      mimeType: 'application/json',
      extensions: {
        ...merchantDiscovery,
      },
      unpaidResponseBody: async (context) => {
        const slug = merchantSlugFromPath(context.path);
        const merchant = slug ? await getMerchant(slug) : null;
        if (!merchant?.active) {
          return {
            contentType: 'application/json',
            body: {
              error: 'merchant_not_found',
              slug,
              message: 'No active merchant matches this slug. See GET /api/merchants.',
            },
          };
        }
        return { contentType: 'application/json', body: {} };
      },
    },
  },
  server
);