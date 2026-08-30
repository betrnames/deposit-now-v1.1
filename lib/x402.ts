import { paymentProxy, x402ResourceServer } from '@x402/next';
import { ExactEvmScheme } from '@x402/evm/exact/server';
import { ExactSvmScheme } from '@x402/svm/exact/server';
import { HTTPFacilitatorClient } from '@x402/core/server';
import {
  declareDiscoveryExtension,
  bazaarResourceServerExtension,
} from '@x402/extensions/bazaar';
import { facilitator as cdpFacilitator } from '@coinbase/x402';
import {
  DEPOSIT_MIN_USDC,
  PLATFORM_FEE_PERCENT,
  calculateDepositSplit,
  clampDepositUsdc,
  fallbackGrossPrice,
  formatUsdcPrice,
} from '@/lib/billing';
import { forwardWithRetry, logSettlement, resolveSolanaPayTo } from '@/lib/cdp';
import {
  provisionChild,
  recordChildFunded,
  resolveDepositTargetMode,
  type ChildAgentInfo,
} from '@/lib/child-agents';
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
import {
  BASE_MAINNET,
  BASE_SEPOLIA,
  SOLANA_DEVNET,
  SOLANA_MAINNET,
  chainFromNetwork,
  detectTargetChain,
  networkLabelShort,
  usdcAssetForNetwork,
} from '@/lib/networks';
import type { HTTPRequestContext } from '@x402/core/server';

export const PLATFORM_PAY_TO =
  process.env.CDP_PLATFORM_ADDRESS ?? '0x96da70311D3fDb8500B9AB0855E17F213dB0C9AA';

const useMainnet =
  process.env.X402_NETWORK === 'mainnet' &&
  !!process.env.CDP_API_KEY_ID &&
  !!process.env.CDP_API_KEY_SECRET;

export const X402_NETWORK: `${string}:${string}` = useMainnet ? BASE_MAINNET : BASE_SEPOLIA;
export const SOLANA_NETWORK: `${string}:${string}` = useMainnet ? SOLANA_MAINNET : SOLANA_DEVNET;
export const SOLANA_ENABLED = useMainnet || !!process.env.CDP_PLATFORM_SOLANA_ADDRESS;

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
        description:
          'EVM address (Base) or Solana address receiving net USDC. Omit when provision: true (managed child wallet, Base only).',
      },
      amount: {
        type: 'string',
        description:
          'Net USDC to forward to target (min $0.01, max $100000). Agent pays amount + 0.25% (min $0.001, max $0.25) via x402 on Base or Solana.',
      },
      memo: {
        type: 'string',
        description: 'Optional note (max 256 chars).',
      },
      provision: {
        type: 'boolean',
        description:
          'If true, create/resolve a managed CDP child wallet and fund it. Requires label or Idempotency-Key. Do not send target.',
      },
      label: {
        type: 'string',
        description:
          'Stable child label for provision mode (e.g. trading-agent-1). Required with provision unless Idempotency-Key is set.',
      },
    },
    required: ['amount'],
  },
  output: {
    example: {
      status: 'payment_received',
      forwardStatus: 'settled',
      target: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
      depositAmount: '50.000000',
      fee: '0.125000',
      feePercent: 0.25,
      grossPaid: '50.125000',
      paymentReceived: true,
      provisioned: false,
      receiptId: 'a1b2c3d4e5f60718',
      receiptUrl: 'https://deposit.now/receipt/a1b2c3d4e5f60718',
    },
  },
});

export interface DepositBody {
  target: string | null;
  amount: string | null;
  memo: string | null;
  provision: boolean;
  label: string | null;
  /** Set after provision resolves; used for intent + settle */
  resolvedChild?: ChildAgentInfo | null;
}

/** getBody() is single-consume — cache per request context */
const depositBodyCache = new WeakMap<object, DepositBody>();

function readIdempotencyKey(context: HTTPRequestContext): string | null {
  try {
    const getHeader = (context.adapter as { getHeader?: (name: string) => string | null })
      .getHeader;
    if (typeof getHeader === 'function') {
      const raw =
        getHeader.call(context.adapter, 'idempotency-key') ??
        getHeader.call(context.adapter, 'Idempotency-Key');
      if (typeof raw === 'string' && raw.trim()) return raw.trim().slice(0, 128);
    }
  } catch {
    // ignore
  }
  return null;
}

function clientIpFromContext(context: HTTPRequestContext): string {
  try {
    const getHeader = (context.adapter as { getHeader?: (name: string) => string | null })
      .getHeader;
    if (typeof getHeader === 'function') {
      const xff = getHeader.call(context.adapter, 'x-forwarded-for');
      if (xff) return xff.split(',')[0]?.trim() || 'unknown';
      return getHeader.call(context.adapter, 'x-real-ip') ?? 'unknown';
    }
  } catch {
    // ignore
  }
  return 'unknown';
}

async function parseDepositBody(context: HTTPRequestContext): Promise<DepositBody> {
  const key = context as object;
  const cached = depositBodyCache.get(key);
  if (cached) return cached;

  let result: DepositBody = {
    target: null,
    amount: null,
    memo: null,
    provision: false,
    label: null,
    resolvedChild: null,
  };
  try {
    if (context.adapter.getBody) {
      const body = (await context.adapter.getBody()) as {
        target?: string;
        amount?: string | number;
        memo?: string;
        provision?: boolean;
        label?: string;
      } | undefined;
      const target = typeof body?.target === 'string' ? body.target.trim() : null;
      const amount =
        body?.amount !== undefined && body?.amount !== null ? String(body.amount) : null;
      const memo =
        typeof body?.memo === 'string' ? body.memo.slice(0, 256).trim() || null : null;
      const provision = body?.provision === true;
      const label = typeof body?.label === 'string' ? body.label.trim() || null : null;
      result = { target, amount, memo, provision, label, resolvedChild: null };
    }
  } catch {
    // keep empty defaults
  }
  depositBodyCache.set(key, result);
  return result;
}

function childIntentFields(child: ChildAgentInfo | null | undefined) {
  if (!child) return null;
  return {
    provisioned: true as const,
    childName: child.name,
    childAddress: child.address,
    childLabel: child.label,
  };
}

async function rememberIntentFromBody(body: DepositBody): Promise<void> {
  if (!body.target || !body.amount) return;
  const intent = buildIntent(
    body.target,
    body.amount,
    body.memo,
    childIntentFields(body.resolvedChild)
  );
  if (!intent) return;
  try {
    await saveDepositIntent(intent);
  } catch (err) {
    console.error('saveDepositIntent failed:', err instanceof Error ? err.message : 'unknown');
  }
}

/**
 * Resolve target for target-mode or provision-mode. Mutates body.target / resolvedChild.
 * Safe to call multiple times (uses cache fields on body).
 */
async function ensureResolvedTarget(
  body: DepositBody,
  context: HTTPRequestContext
): Promise<
  | { ok: true; target: string; child: ChildAgentInfo | null }
  | { ok: false; code: string; message: string; status: number; retryAfter?: number }
> {
  // After a successful provision on this request, body.target is filled server-side.
  // Reuse that before XOR checks so price + unpaid body don't false-flag ambiguous_target.
  if (body.resolvedChild && body.target) {
    return { ok: true, target: body.target, child: body.resolvedChild };
  }

  const mode = resolveDepositTargetMode({
    target: body.target,
    provision: body.provision,
  });

  if (mode.mode === 'error') {
    return { ok: false, code: mode.code, message: mode.message, status: 400 };
  }

  if (mode.mode === 'target') {
    const tv = validateDepositTarget(body.target, PLATFORM_PAY_TO);
    if (!tv.ok) {
      return { ok: false, code: tv.code ?? 'invalid_target', message: tv.message, status: 400 };
    }
    body.target = tv.address;
    return { ok: true, target: tv.address, child: null };
  }

  const provisioned = await provisionChild({
    label: body.label,
    idempotencyKey: readIdempotencyKey(context),
    rateLimitKey: clientIpFromContext(context),
  });

  if (!provisioned.ok) {
    return {
      ok: false,
      code: provisioned.code,
      message: provisioned.message,
      status: provisioned.status,
      retryAfter: provisioned.retryAfter,
    };
  }

  const tv = validateDepositTarget(provisioned.child.address, PLATFORM_PAY_TO);
  if (!tv.ok) {
    return {
      ok: false,
      code: 'provision_failed',
      message: 'Provisioned address failed validation.',
      status: 502,
    };
  }

  body.target = tv.address;
  body.resolvedChild = provisioned.child;
  // keep cache in sync
  return { ok: true, target: tv.address, child: provisioned.child };
}

/** x402 price = net + clamp(net × 0.25%, $0.001, $0.25) */
async function resolveDepositPrice(context: HTTPRequestContext): Promise<string> {
  try {
    const body = await parseDepositBody(context);
    // Resolve provision early so intent has a concrete target before pay
    const resolved = await ensureResolvedTarget(body, context);
    if (resolved.ok) {
      await rememberIntentFromBody(body);
    }
    const net = clampDepositUsdc(body.amount);
    if (net === null) return fallbackGrossPrice();
    const split = calculateDepositSplit(net);
    if (!split) return fallbackGrossPrice();
    return formatUsdcPrice(split.gross);
  } catch {
    return fallbackGrossPrice();
  }
}

async function resolveIntent(
  body: DepositBody,
  amountAtomic: string
): Promise<DepositIntent | null> {
  if (body.target && body.amount) {
    const fromBody = buildIntent(
      body.target,
      body.amount,
      body.memo,
      childIntentFields(body.resolvedChild)
    );
    if (fromBody) return fromBody;
  }
  return loadIntentByGrossAtomic(amountAtomic);
}

const server = new x402ResourceServer(facilitatorClient)
  .register(X402_NETWORK, new ExactEvmScheme())
  .register(SOLANA_NETWORK, new ExactSvmScheme())
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
        : {
            target: null,
            amount: null,
            memo: null,
            provision: false,
            label: null,
            resolvedChild: null,
          };

      // Re-resolve provision so settle has target even if intent blob is missing
      if (transport?.request && (depositBody.provision || depositBody.target)) {
        await ensureResolvedTarget(depositBody, transport.request);
      }

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
            feePercent: PLATFORM_FEE_PERCENT,
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
          const paidChain =
            chainFromNetwork(req.network ?? result.network ?? X402_NETWORK) ?? 'base';
          const destChain = detectTargetChain(target);
          if (destChain && destChain !== paidChain) {
            blocked = true;
            forwardStatus = 'held';
            holdReason = `CHAIN_MISMATCH: paid on ${paidChain}, target is ${destChain}`;
            try {
              await updateTransactionStatus(txnId, 'held', {
                guardrailFlags: ['CHAIN_MISMATCH'],
                errorMessage: holdReason,
              });
            } catch {
              // non-fatal
            }
            console.error(
              `payment-verify: deposit ${txnId} held — ${holdReason}`
            );
          }
        }

        if (!blocked) {
          const paidChain =
            chainFromNetwork(req.network ?? result.network ?? X402_NETWORK) ?? 'base';
          const fwd = await forwardWithRetry(target, split.net, paidChain);
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
            if (intent?.provisioned || depositBody.provision || depositBody.resolvedChild) {
              await recordChildFunded(target, agentWallet);
            }
          }

          if (hasBlob) {
            await logSettlement({
              depositId: id,
              target,
              memo: intent?.memo ?? null,
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
          feePercent: split ? split.feePercent.toFixed(2) : null,
          netToTarget: split ? split.net.toFixed(6) : null,
          forwardTxHash,
          forwardStatus,
          provisioned: !!(intent?.provisioned || depositBody.resolvedChild),
          childName: intent?.childName ?? depositBody.resolvedChild?.name ?? null,
          childLabel: intent?.childLabel ?? depositBody.resolvedChild?.label ?? null,
          childAddress:
            intent?.childAddress ??
            depositBody.resolvedChild?.address ??
            (intent?.provisioned ? intent?.target : null) ??
            null,
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
        ...(SOLANA_ENABLED
          ? [
              {
                scheme: 'exact' as const,
                price: resolveDepositPrice,
                network: SOLANA_NETWORK,
                payTo: resolveSolanaPayTo,
              },
            ]
          : []),
      ],
      description:
        'Open x402 funding rail: POST target+amount or provision:true+label+amount; pay 0.25% (min $0.001, max $0.25) via x402 on Base or Solana; net forwarded on the same chain. Optional managed child wallets (CDP, Base only). Optional public receipt when storage is configured.',
      mimeType: 'application/json',
      extensions: {
        ...depositDiscovery,
      },
      unpaidResponseBody: async (context) => {
        const body = await parseDepositBody(context);
        const net = clampDepositUsdc(body.amount);
        const split = net !== null ? calculateDepositSplit(net) : null;

        if (!split) {
          return {
            contentType: 'application/json',
            body: {
              error: 'invalid_request',
              code: 'invalid_amount',
              message:
                'POST JSON { "target": "0x… or Solana address", "amount": "50.00" } or { "provision": true, "label": "child-1", "amount": "50.00" }. amount is net USDC; you pay amount + 0.25% (min $0.001, max $0.25) on Base or Solana.',
              feePercent: PLATFORM_FEE_PERCENT,
              minAmount: DEPOSIT_MIN_USDC,
              maxAmount: 100_000,
              docs: 'https://deposit.now/docs',
              llms: 'https://deposit.now/llms.txt',
            },
          };
        }

        const resolved = await ensureResolvedTarget(body, context);
        if (!resolved.ok) {
          return {
            contentType: 'application/json',
            body: {
              error: 'invalid_request',
              code: resolved.code,
              message: resolved.message,
              ...(resolved.retryAfter != null ? { retryAfter: resolved.retryAfter } : {}),
              feePercent: PLATFORM_FEE_PERCENT,
              minAmount: DEPOSIT_MIN_USDC,
              maxAmount: 100_000,
              docs: 'https://deposit.now/docs',
              llms: 'https://deposit.now/llms.txt',
            },
          };
        }

        await rememberIntentFromBody(body);

        const destChain = detectTargetChain(resolved.target) ?? 'base';
        const payNetwork = destChain === 'solana' ? SOLANA_NETWORK : X402_NETWORK;

        return {
          contentType: 'application/json',
          body: {
            service: 'deposit.now',
            action: 'deposit',
            target: resolved.target,
            memo: body.memo,
            provisioned: !!resolved.child,
            ...(resolved.child ? { child: resolved.child } : {}),
            netToTarget: split.net.toFixed(6),
            fee: split.fee.toFixed(6),
            feePercent: split.feePercent,
            grossToPay: split.gross.toFixed(6),
            asset: 'USDC',
            assetAddress: usdcAssetForNetwork(payNetwork),
            network: networkLabelShort(payNetwork),
            x402Network: payNetwork,
            payOn: destChain,
            hint: resolved.child
              ? 'Managed child wallet provisioned on Base. Pay grossToPay via x402 on Base, then retry with the same body + payment proof. Keys are platform-managed in CDP (no export in v1).'
              : destChain === 'solana'
                ? 'Pay grossToPay via x402 on Solana, then retry with payment proof. Net is forwarded on Solana after settlement; check receiptUrl for forward status.'
                : 'Pay grossToPay via x402 on Base, then retry with payment proof. Net is forwarded after settlement; check receiptUrl for forward status.',
          },
        };
      },
    },
  },
  server
);
