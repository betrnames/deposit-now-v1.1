import { paymentProxy, x402ResourceServer } from '@x402/next';
import { ExactEvmScheme } from '@x402/evm/exact/server';
import { HTTPFacilitatorClient } from '@x402/core/server';
import {
  declareDiscoveryExtension,
  bazaarResourceServerExtension,
} from '@x402/extensions/bazaar';
import { facilitator as cdpFacilitator } from '@coinbase/x402';
import {
  DEPOSIT_MIN_USDC,
  calculateDepositSplit,
  clampDepositUsdc,
  formatUsdcPrice,
} from '@/lib/billing';
import { forwardWithRetry, logSettlement } from '@/lib/cdp';
import {
  buildIntent,
  loadIntentByGrossAtomic,
  mergeReceipt,
  saveDepositIntent,
  type DepositIntent,
} from '@/lib/deposit-intent';
import {
  runGuardrails,
  logTransaction,
  updateTransactionStatus,
  logSettlementFailure,
} from '@/lib/guardrails';
import {
  validateDepositTarget,
  runPaymentVerification,
  extractPaymentIdentity,
} from '@/lib/payment-verification';
import { enqueueFailedForward } from '@/lib/reconciliation';
import { receiptIdFromPayload } from '@/lib/receipts';
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
    memo: 'Optional note',
  },
  inputSchema: {
    properties: {
      target: {
        type: 'string',
        description: 'EVM address (0x…) that should receive net USDC after settlement.',
      },
      amount: {
        type: 'string',
        description:
          'Net USDC to forward to target (min $0.01, max $100000). Agent pays amount + 1% platform fee via x402.',
      },
      memo: {
        type: 'string',
        description: 'Optional note (max 256 chars).',
      },
    },
    required: ['target', 'amount'],
  },
  output: {
    example: {
      status: 'payment_received',
      forwardStatus: 'settled',
      target: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
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

async function rememberIntentFromBody(body: DepositBody): Promise<void> {
  if (!body.target || !body.amount) return;
  const intent = buildIntent(body.target, body.amount, body.memo);
  if (!intent) return;
  try {
    await saveDepositIntent(intent);
  } catch (err) {
    console.error('saveDepositIntent failed:', err instanceof Error ? err.message : 'unknown');
  }
}

/** x402 price = net amount + 1% platform fee */
async function resolveDepositPrice(context: HTTPRequestContext): Promise<string> {
  try {
    const body = await parseDepositBody(context);
    await rememberIntentFromBody(body);
    const net = clampDepositUsdc(body.amount);
    if (net === null) return formatUsdcPrice(DEPOSIT_MIN_USDC * 1.01);
    const split = calculateDepositSplit(net);
    if (!split) return formatUsdcPrice(DEPOSIT_MIN_USDC * 1.01);
    return formatUsdcPrice(split.gross);
  } catch {
    return formatUsdcPrice(DEPOSIT_MIN_USDC * 1.01);
  }
}

async function resolveIntent(
  body: DepositBody,
  amountAtomic: string
): Promise<DepositIntent | null> {
  if (body.target && body.amount) {
    const fromBody = buildIntent(body.target, body.amount, body.memo);
    if (fromBody) return fromBody;
  }
  return loadIntentByGrossAtomic(amountAtomic);
}

const server = new x402ResourceServer(facilitatorClient)
  .register(X402_NETWORK, new ExactEvmScheme())
  .registerExtension(bazaarResourceServerExtension)
  .onAfterSettle(async (ctx) => {
    try {
      // Payment verification + forward run even without Blob.
      // Receipts/intents still require BLOB_READ_WRITE_TOKEN.
      const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

      const id = receiptIdFromPayload(ctx.paymentPayload);
      if (!id) {
        console.error('settlement: could not derive deposit/receipt id from payment payload');
        return;
      }

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

      const identity = extractPaymentIdentity(ctx.paymentPayload);
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

      const intent = await resolveIntent(depositBody, amountAtomic);
      let target = intent?.target ?? null;
      const split = intent
        ? {
            net: intent.net,
            fee: intent.fee,
            gross: intent.gross,
            feePercent: 1,
          }
        : null;

      let forwardTxHash: string | null = null;
      let forwardStatus: 'settled' | 'forward_failed' | 'pending' | 'held' | null = null;
      let holdReason: string | null = null;
      const agentWallet =
        result.payer ?? identity.from ?? 'unknown';

      // Re-validate target before any forward (zero / platform self-deposit)
      if (target) {
        const tv = validateDepositTarget(target, PLATFORM_PAY_TO);
        if (!tv.ok) {
          console.error(
            `payment-verify: invalid target ${target} — ${tv.code}: ${tv.message}`
          );
          forwardStatus = 'held';
          holdReason = `TARGET_INVALID: ${tv.code}`;
          target = null;
        }
      }

      if (target && split && split.net > 0) {
        const txnId = id;

        // Log the transaction as pending before checks
        try {
          await logTransaction({
            id: txnId,
            targetAddress: target,
            agentWallet,
            amountUsdc: split.gross,
            feeUsdc: split.fee,
            netUsdc: split.net,
            feeTier: 'catalog',
            status: 'pending',
            agentTxHash: result.transaction ?? null,
            merchantTxHash: null,
            guardrailFlags: [],
            errorMessage: null,
            retryCount: 0,
          });
        } catch (dbErr) {
          console.error(
            'guardrails: transaction log failed:',
            dbErr instanceof Error ? dbErr.message : 'unknown'
          );
        }

        // --- Payment verification (post-facilitator, pre-forward) ---
        // 1) token contract  2) amount match  3) nonce replay
        let blocked = false;
        const blockFlags: string[] = [];

        try {
          const payVerify = await runPaymentVerification({
            asset: req.asset ?? null,
            network: req.network ?? result.network ?? X402_NETWORK,
            requirementsAmountAtomic: amountAtomic || null,
            authorizationValue: identity.authorizationValue,
            nonce: identity.nonce,
            signature: identity.signature,
            quotedGrossUsdc: split.gross,
            depositId: txnId,
            agentWallet,
          });

          if (!payVerify.ok) {
            blocked = true;
            blockFlags.push(...payVerify.flags);
            forwardStatus = 'held';
            holdReason = `PAYMENT_VERIFY: ${payVerify.code}`;
            try {
              await updateTransactionStatus(txnId, 'held', {
                guardrailFlags: payVerify.flags,
                errorMessage: holdReason,
              });
            } catch {
              // non-fatal
            }
            console.error(
              `payment-verify: deposit ${txnId} held — ${payVerify.code}: ${payVerify.message}`
            );
          }
        } catch (verifyErr) {
          // Fail-closed for payment verification errors
          blocked = true;
          forwardStatus = 'held';
          holdReason = 'PAYMENT_VERIFY_ERROR';
          blockFlags.push('PAYMENT_VERIFY_ERROR');
          console.error(
            'payment-verify: check failed (fail-closed):',
            verifyErr instanceof Error ? verifyErr.message : 'unknown'
          );
          try {
            await updateTransactionStatus(txnId, 'held', {
              guardrailFlags: blockFlags,
              errorMessage: holdReason,
            });
          } catch {
            // non-fatal
          }
        }

        // --- Existing velocity / rate / amount-cap guardrails ---
        if (!blocked) {
          try {
            const guardrailResult = await runGuardrails({
              depositId: txnId,
              targetAddress: target,
              agentWallet,
              amountUsdc: split.gross,
              feeUsdc: split.fee,
              netUsdc: split.net,
              method: 'POST',
              pathname: '/api/deposit',
              rateLimitKey: agentWallet,
            });

            if (guardrailResult.blocked) {
              blocked = true;
              forwardStatus = 'held';
              holdReason = `GUARDRAIL_BLOCKED: ${guardrailResult.code}`;
              try {
                await updateTransactionStatus(txnId, 'held', {
                  guardrailFlags: guardrailResult.flags,
                  errorMessage: holdReason,
                });
              } catch {
                // non-fatal
              }
              console.error(
                `guardrails: deposit ${txnId} held — ${guardrailResult.code}: ${guardrailResult.flags.join(', ')}`
              );
            }
          } catch (guardErr) {
            console.error(
              'guardrails: check failed, proceeding with forward:',
              guardErr instanceof Error ? guardErr.message : 'unknown'
            );
          }
        }

        if (!blocked) {
          const fwd = await forwardWithRetry(target, split.net);
          forwardTxHash = fwd.txHash;
          forwardStatus = fwd.txHash ? 'settled' : 'forward_failed';

          if (!fwd.txHash && fwd.error) {
            try {
              await logSettlementFailure(txnId, target, split.gross, fwd.error, fwd.attempts);
              await updateTransactionStatus(txnId, 'held', {
                errorMessage: fwd.error,
                retryCount: fwd.attempts,
              });
            } catch {
              // non-fatal
            }

            // Reconciliation queue for manual resolution
            try {
              await enqueueFailedForward({
                depositId: txnId,
                target,
                netUsdc: split.net,
                grossUsdc: split.gross,
                agentTxHash: result.transaction ?? null,
                error: fwd.error,
                retryCount: fwd.attempts,
                memo: intent?.memo ?? null,
              });
            } catch (qErr) {
              console.error(
                'reconcile enqueue failed:',
                qErr instanceof Error ? qErr.message : 'unknown'
              );
            }
          } else if (fwd.txHash) {
            try {
              await updateTransactionStatus(txnId, 'settled', {
                merchantTxHash: fwd.txHash,
              });
            } catch {
              // non-fatal
            }
          }

          if (hasBlob) {
            await logSettlement({
              depositId: id,
              target,
              memo: intent?.memo ?? null,
              grossAmount: split.gross.toFixed(6),
              fee: split.fee.toFixed(6),
              feePercent: '1.00',
              netToTarget: split.net.toFixed(6),
              agentTxHash: result.transaction ?? null,
              forwardTxHash: fwd.txHash,
              status: fwd.txHash ? 'settled' : 'forward_failed',
              error: fwd.error ?? undefined,
              requiresManualReview: !fwd.txHash,
              timestamp: new Date().toISOString(),
            });
          }
        }
      } else if (!target && !holdReason) {
        forwardStatus = 'pending';
        console.error('settlement: missing target intent — payment recorded, no forward');
      } else if (!target && holdReason) {
        forwardStatus = 'held';
      }

      if (hasBlob) {
        await mergeReceipt(id, {
          payer: result.payer ?? identity.from ?? null,
          amountAtomic: amountAtomic || null,
          amountUsdc,
          asset: req.asset ?? null,
          network: req.network ?? result.network ?? null,
          payTo: req.payTo ?? null,
          txHash: result.transaction ?? null,
          resource,
          settledAt: new Date().toISOString(),
          target: intent?.target ?? depositBody.target,
          memo: intent?.memo ?? depositBody.memo,
          depositAmount: split ? split.net.toFixed(6) : depositBody.amount,
          grossAmount: split ? split.gross.toFixed(6) : amountUsdc,
          fee: split ? split.fee.toFixed(6) : null,
          feePercent: split ? '1.00' : null,
          netToTarget: split ? split.net.toFixed(6) : null,
          forwardTxHash,
          forwardStatus,
          note:
            forwardStatus === 'pending'
              ? 'Payment settled to platform; target missing from request — forward not attempted.'
              : forwardStatus === 'forward_failed'
                ? 'Payment settled; forward to target failed after retries — see reconciliation queue.'
                : forwardStatus === 'held'
                  ? holdReason
                    ? `Payment settled to platform; forward held — ${holdReason}. Manual review required.`
                    : 'Payment settled to platform; forward held by guardrail — manual review required.'
                  : null,
        });
      }
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
        'Open x402 funding rail: POST target + amount, pay amount + 1% via x402, net forwarded to target on Base. Optional public receipt when storage is configured.',
      mimeType: 'application/json',
      extensions: {
        ...depositDiscovery,
      },
      unpaidResponseBody: async (context) => {
        const body = await parseDepositBody(context);
        const net = clampDepositUsdc(body.amount);
        const split = net !== null ? calculateDepositSplit(net) : null;
        const targetCheck = validateDepositTarget(body.target, PLATFORM_PAY_TO);

        // Target validation before 402 body is useful to the client
        // (format, zero address, platform self-deposit loop)
        if (!targetCheck.ok || !split) {
          return {
            contentType: 'application/json',
            body: {
              error: 'invalid_request',
              code: !targetCheck.ok ? targetCheck.code : 'invalid_amount',
              message: !targetCheck.ok
                ? targetCheck.message
                : 'POST JSON { "target": "0x…", "amount": "50.00", "memo?": "…" }. amount is net USDC to target; you pay amount + 1%.',
              feePercent: 1,
              minAmount: DEPOSIT_MIN_USDC,
              maxAmount: 100_000,
              docs: 'https://deposit.now/docs',
              llms: 'https://deposit.now/llms.txt',
            },
          };
        }

        // Only remember intents for valid targets
        await rememberIntentFromBody(body);

        return {
          contentType: 'application/json',
          body: {
            service: 'deposit.now',
            action: 'deposit',
            target: targetCheck.address,
            memo: body.memo,
            netToTarget: split.net.toFixed(6),
            fee: split.fee.toFixed(6),
            feePercent: split.feePercent,
            grossToPay: split.gross.toFixed(6),
            asset: 'USDC',
            assetAddress:
              X402_NETWORK === 'eip155:8453'
                ? '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
                : '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
            network: X402_NETWORK === 'eip155:8453' ? 'base' : 'base-sepolia',
            hint: 'Pay grossToPay via x402, then retry with payment proof. Net is forwarded after settlement; check receiptUrl for forward status.',
          },
        };
      },
    },
  },
  server
);
