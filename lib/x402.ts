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
  merchantRouteFromPath,
  merchantSlugFromPath,
  patchMerchantBilling,
  ensureDefaultMerchants,
} from '@/lib/merchants';
import {
  DEPOSIT_MIN_USDC,
  TIER_BILLING,
  canUseWebhooks,
  clampDepositUsdc,
  clampTopupUsdc,
  extendTierExpiry,
  normalizeTier,
} from '@/lib/billing';
import { buildWebhookPayload, deliverMerchantWebhook } from '@/lib/webhooks';
import { receiptIdFromPayload, receiptBlobPath } from '@/lib/receipts';
import {
  calculateSplit,
  forwardWithRetry,
  logSettlement,
  type SettlementSplit,
} from '@/lib/cdp';
import type { HTTPRequestContext } from '@x402/core/server';

export const PLATFORM_PAY_TO =
  process.env.CDP_PLATFORM_ADDRESS ?? '0x3f7a25Dc7307F5662489686e5A457DAD4879F685';

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
        description: 'USDC amount to deposit (min $0.01). This becomes the x402 payment price — the agent pays this amount on-chain.',
      },
      account: {
        type: 'string',
        description: 'Agent account identifier receiving the deposit',
      },
    },
    required: ['amount'],
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
        description: 'USDC amount to deposit to the merchant (min $0.01). This becomes the x402 payment price — the agent pays this amount on-chain directly to the merchant wallet.',
      },
      account: {
        type: 'string',
        description: 'Agent or customer account identifier',
      },
    },
    required: ['amount'],
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

async function resolveDepositPrice(context: HTTPRequestContext): Promise<string> {
  try {
    if (!context.adapter.getBody) return `$${DEPOSIT_MIN_USDC}`;
    const body = (await context.adapter.getBody()) as { amount?: string | number } | undefined;
    const usdc = clampDepositUsdc(body?.amount);
    if (usdc === null) return `$${DEPOSIT_MIN_USDC}`;
    return `$${usdc}`;
  } catch {
    return `$${DEPOSIT_MIN_USDC}`;
  }
}

async function resolveTopupPrice(context: HTTPRequestContext): Promise<string> {
  try {
    if (!context.adapter.getBody) return '$10';
    const body = (await context.adapter.getBody()) as { amount?: string | number } | undefined;
    const usdc = clampTopupUsdc(body?.amount);
    return `$${usdc}`;
  } catch {
    return '$10';
  }
}

async function applyBillingAfterSettle(
  requestPath: string,
  merchantSlug: string | null,
  paymentAmountAtomic: string,
  depositBody: { amount: string | null; account: string | null }
) {
  if (!merchantSlug || !process.env.BLOB_READ_WRITE_TOKEN) return;

  const route = merchantRouteFromPath(requestPath);
  if (!route) return;

  const merchant = await getMerchant(merchantSlug);
  if (!merchant) return;

  const paidMicro = Number(paymentAmountAtomic);
  if (!Number.isFinite(paidMicro) || paidMicro <= 0) return;

  if (route.action === 'renew') {
    const config = TIER_BILLING.rail;
    await patchMerchantBilling(merchantSlug, {
      tier: 'rail',
      tierExpiresAt: extendTierExpiry(merchant.tierExpiresAt, config.renewDays),
    });
    return;
  }

  if (route.action === 'topup') {
    const current = merchant.billingBalanceMicro ?? 0;
    await patchMerchantBilling(merchantSlug, {
      billingBalanceMicro: current + paidMicro,
    });
    return;
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
      const route = merchantRouteFromPath(requestPath);
      const merchantSlug = route?.slug ?? merchantSlugFromPath(requestPath);
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
      const amountUsdc = amountAtomic ? (Number(amountAtomic) / 1e6).toFixed(6) : null;

      // Settlement split: forward net amount to merchant via CDP
      const isMerchantDeposit = route?.action === 'deposit' && merchant;
      let split: SettlementSplit | null = null;
      let forwardTxHash: string | null = null;
      let forwardStatus: 'settled' | 'forward_failed' | null = null;

      if (isMerchantDeposit) {
        split = calculateSplit(depositBody.amount ?? amountUsdc, merchant.tier);
        if (split && split.net > 0) {
          const fwd = await forwardWithRetry(merchant.payTo, split.net);
          forwardTxHash = fwd.txHash;
          forwardStatus = fwd.txHash ? 'settled' : 'forward_failed';

          await logSettlement({
            depositId: id,
            merchantSlug: merchant.slug,
            grossAmount: split.gross.toFixed(6),
            fee: split.fee.toFixed(6),
            feePercent: split.feePercent.toFixed(2),
            netToMerchant: split.net.toFixed(6),
            agentTxHash: result.transaction ?? null,
            merchantTxHash: fwd.txHash,
            status: fwd.txHash ? 'settled' : 'forward_failed',
            error: fwd.error ?? undefined,
            requiresManualReview: !fwd.txHash,
            timestamp: new Date().toISOString(),
          });
        }
      }

      const receipt = {
        id,
        payer: result.payer ?? payload.payload?.authorization?.from ?? null,
        amountAtomic: amountAtomic || null,
        amountUsdc,
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
        grossAmount: split ? split.gross.toFixed(6) : null,
        fee: split ? split.fee.toFixed(6) : null,
        feePercent: split ? split.feePercent.toFixed(2) : null,
        netToMerchant: split ? split.net.toFixed(6) : null,
        merchantPayTo: merchant?.payTo ?? null,
        forwardTxHash,
        forwardStatus,
      };

      await put(receiptBlobPath(id), JSON.stringify(receipt), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
      });

      // Billing: renew/topup only — deposit fees are now taken at the tx level
      if (merchantSlug && route && route.action !== 'deposit') {
        await applyBillingAfterSettle(
          requestPath,
          merchantSlug,
          amountAtomic,
          depositBody
        );
      }

      if (merchant?.webhookUrl && canUseWebhooks(merchant)) {
        const webhookPayload = buildWebhookPayload(merchant, receipt, depositBody);
        await deliverMerchantWebhook(merchant, webhookPayload);
      }
    } catch (error) {
      console.error('settlement failed:', error instanceof Error ? error.message : 'unknown');
    }
  });

void ensureDefaultMerchants(PLATFORM_PAY_TO);

export const middleware = paymentProxy(
  {
    '/api/deposit': {
      accepts: [
        {
          scheme: 'exact',
          price: resolveDepositPrice,
          network: X402_NETWORK,
          payTo: PLATFORM_PAY_TO,
        },
      ],
      description:
        'Deposit USDC autonomously via deposit.now. Agent pays the declared amount on Base mainnet — no accounts or API keys.',
      mimeType: 'application/json',
      extensions: {
        ...depositDiscovery,
      },
    },
    '/api/merchants/:slug/deposit': {
      accepts: [
        {
          scheme: 'exact',
          price: resolveDepositPrice,
          network: X402_NETWORK,
          payTo: PLATFORM_PAY_TO,
        },
      ],
      description:
        'Merchant-scoped deposit. Agent pays the declared amount — platform splits fee and forwards net to merchant.',
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
    '/api/merchants/:slug/renew': {
      accepts: [
        {
          scheme: 'exact',
          price: '$49',
          network: X402_NETWORK,
          payTo: PLATFORM_PAY_TO,
        },
      ],
      description:
        'Renew Rail tier for 30 days. Pays 49 USDC to deposit.now — no invoices, no manual billing.',
      mimeType: 'application/json',
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
        return {
          contentType: 'application/json',
          body: {
            action: 'renew',
            monthlyFeeUsdc: TIER_BILLING.rail.monthlyFeeUsdc,
            renewDays: TIER_BILLING.rail.renewDays,
            tier: normalizeTier(merchant.tier),
            tierExpiresAt: merchant.tierExpiresAt ?? null,
          },
        };
      },
    },
    '/api/merchants/:slug/topup': {
      accepts: [
        {
          scheme: 'exact',
          price: resolveTopupPrice,
          network: X402_NETWORK,
          payTo: PLATFORM_PAY_TO,
        },
      ],
      description:
        'Top up prepaid USDC balance for automated settlement-fee debits. POST body: { "amount": "50" } (min 10 USDC).',
      mimeType: 'application/json',
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
        return {
          contentType: 'application/json',
          body: {
            action: 'topup',
            balanceUsdc: ((merchant.billingBalanceMicro ?? 0) / 1_000_000).toFixed(6),
            minUsdc: 10,
            hint: 'POST { "amount": "50" } then pay the quoted USDC via x402.',
          },
        };
      },
    },
  },
  server
);