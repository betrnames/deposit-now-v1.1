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
  DEPOSIT_MIN_USDC,
  calculateDepositSplit,
  clampDepositUsdc,
  formatUsdcPrice,
  isValidEvmAddress,
} from '@/lib/billing';
import { forwardWithRetry, logSettlement } from '@/lib/cdp';
import { receiptIdFromPayload, receiptBlobPath } from '@/lib/receipts';
import type { HTTPRequestContext } from '@x402/core/server';

export const PLATFORM_PAY_TO =
  process.env.CDP_PLATFORM_ADDRESS ?? '0x96da70311D3fDb8500B9AB0855E17F213dB0C9AA';

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
  input: {
    target: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    amount: '50.00',
    memo: 'Fund child trading agent',
  },
  inputSchema: {
    properties: {
      target: {
        type: 'string',
        description:
          'EVM address (0x…) to receive net USDC — parent wallet, sub-wallet, or child agent.',
      },
      amount: {
        type: 'string',
        description:
          'Net USDC to forward to target (min $0.01, max $100000). Agent pays amount + 1% platform fee via x402.',
      },
      memo: {
        type: 'string',
        description: 'Optional note (max 256 chars), e.g. "Fund child trading agent".',
      },
    },
    required: ['target', 'amount'],
  },
  output: {
    example: {
      status: 'success',
      target: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
      memo: 'Fund child trading agent',
      depositAmount: '50.000000',
      fee: '0.500000',
      feePercent: 1,
      grossPaid: '50.500000',
      paymentReceived: true,
      receiptId: 'a1b2c3d4e5f60718',
      receiptUrl: 'https://deposit.now/receipt/a1b2c3d4e5f60718',
    },
  },
});

export interface DepositBody {
  target: string | null;
  amount: string | null;
  memo: string | null;
}

/** getBody() is single-consume — cache per request context */
const depositBodyCache = new WeakMap<object, DepositBody>();

async function parseDepositBody(context: HTTPRequestContext): Promise<DepositBody> {
  const key = context as object;
  const cached = depositBodyCache.get(key);
  if (cached) return cached;

  let result: DepositBody = { target: null, amount: null, memo: null };
  try {
    if (context.adapter.getBody) {
      const body = (await context.adapter.getBody()) as {
        target?: string;
        amount?: string | number;
        memo?: string;
      } | undefined;
      const target = typeof body?.target === 'string' ? body.target.trim() : null;
      const amount =
        body?.amount !== undefined && body?.amount !== null ? String(body.amount) : null;
      const memo =
        typeof body?.memo === 'string' ? body.memo.slice(0, 256).trim() || null : null;
      result = { target, amount, memo };
    }
  } catch {
    // keep empty defaults
  }
  depositBodyCache.set(key, result);
  return result;
}

/** x402 price = net amount + 1% platform fee */
async function resolveDepositPrice(context: HTTPRequestContext): Promise<string> {
  try {
    const body = await parseDepositBody(context);
    const net = clampDepositUsdc(body.amount);
    if (net === null) return formatUsdcPrice(DEPOSIT_MIN_USDC * 1.01);
    const split = calculateDepositSplit(net);
    if (!split) return formatUsdcPrice(DEPOSIT_MIN_USDC * 1.01);
    return formatUsdcPrice(split.gross);
  } catch {
    return formatUsdcPrice(DEPOSIT_MIN_USDC * 1.01);
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

      const depositBody = transport?.request
        ? await parseDepositBody(transport.request)
        : { target: null, amount: null, memo: null };

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

      const net = clampDepositUsdc(depositBody.amount);
      const split = net !== null ? calculateDepositSplit(net) : null;
      const target = isValidEvmAddress(depositBody.target) ? depositBody.target : null;

      let forwardTxHash: string | null = null;
      let forwardStatus: 'settled' | 'forward_failed' | null = null;

      if (target && split && split.net > 0) {
        const fwd = await forwardWithRetry(target, split.net);
        forwardTxHash = fwd.txHash;
        forwardStatus = fwd.txHash ? 'settled' : 'forward_failed';

        await logSettlement({
          depositId: id,
          target,
          memo: depositBody.memo,
          grossAmount: split.gross.toFixed(6),
          fee: split.fee.toFixed(6),
          feePercent: split.feePercent.toFixed(2),
          netToTarget: split.net.toFixed(6),
          agentTxHash: result.transaction ?? null,
          forwardTxHash: fwd.txHash,
          status: fwd.txHash ? 'settled' : 'forward_failed',
          error: fwd.error ?? undefined,
          requiresManualReview: !fwd.txHash,
          timestamp: new Date().toISOString(),
        });
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
        target,
        memo: depositBody.memo,
        depositAmount: split ? split.net.toFixed(6) : depositBody.amount,
        grossAmount: split ? split.gross.toFixed(6) : null,
        fee: split ? split.fee.toFixed(6) : null,
        feePercent: split ? split.feePercent.toFixed(2) : null,
        netToTarget: split ? split.net.toFixed(6) : null,
        forwardTxHash,
        forwardStatus,
      };

      await put(receiptBlobPath(id), JSON.stringify(receipt), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
      });
    } catch (error) {
      console.error('settlement failed:', error instanceof Error ? error.message : 'unknown');
    }
  });

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
        'The Funding Layer for AI Agents. Programmable deposits via one x402 call — fund any wallet (including sub-wallets / child agents). Pay amount + 1% fee; net forwards to target.',
      mimeType: 'application/json',
      extensions: {
        ...depositDiscovery,
      },
      unpaidResponseBody: async (context) => {
        const body = await parseDepositBody(context);
        const net = clampDepositUsdc(body.amount);
        const split = net !== null ? calculateDepositSplit(net) : null;
        const targetOk = isValidEvmAddress(body.target);

        if (!targetOk || !split) {
          return {
            contentType: 'application/json',
            body: {
              error: 'invalid_request',
              message:
                'POST JSON { "target": "0x…", "amount": "50.00", "memo?": "Fund child agent" }. amount is net USDC to target; you pay amount + 1%.',
              feePercent: 1,
              minAmount: DEPOSIT_MIN_USDC,
              maxAmount: 100_000,
              docs: 'https://deposit.now/docs',
              llms: 'https://deposit.now/llms.txt',
            },
          };
        }

        return {
          contentType: 'application/json',
          body: {
            service: 'deposit.now',
            action: 'deposit',
            target: body.target,
            memo: body.memo,
            netToTarget: split.net.toFixed(6),
            fee: split.fee.toFixed(6),
            feePercent: split.feePercent,
            grossToPay: split.gross.toFixed(6),
            asset: 'USDC',
            network: X402_NETWORK === 'eip155:8453' ? 'base' : 'base-sepolia',
            hint: 'Pay grossToPay via x402, then retry with payment proof. Net is forwarded to target after settlement.',
          },
        };
      },
    },
  },
  server
);
