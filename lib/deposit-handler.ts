import { NextRequest, NextResponse } from 'next/server';
import {
  PLATFORM_FEE_MAX_USDC,
  PLATFORM_FEE_MIN_USDC,
  PLATFORM_FEE_PERCENT,
  calculateDepositSplit,
  clampDepositUsdc,
} from '@/lib/billing';
import {
  provisionChild,
  resolveDepositTargetMode,
  type ChildAgentInfo,
} from '@/lib/child-agents';
import { buildIntent, mergeReceipt, saveDepositIntent } from '@/lib/deposit-intent';
import { validateDepositTarget } from '@/lib/payment-verification';
import { receiptIdFromPaymentHeader } from '@/lib/receipts';
import { PRODUCT } from '@/lib/product-copy';
import { PLATFORM_PAY_TO, SOLANA_NETWORK, X402_NETWORK } from '@/lib/x402';
import { networkLabelShort } from '@/lib/networks';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Payment, payment-signature',
};

function paymentHeader(request: NextRequest) {
  return (
    request.headers.get('payment-signature') ??
    request.headers.get('x-payment') ??
    request.headers.get('payment')
  );
}

function receiptFields(request: NextRequest) {
  const header = paymentHeader(request);
  const receiptId = header ? receiptIdFromPaymentHeader(header) : null;
  return receiptId
    ? {
        receiptId,
        receiptUrl: `https://deposit.now/receipt/${receiptId}`,
      }
    : {};
}

function networkLabel() {
  return networkLabelShort(X402_NETWORK);
}

export async function handleDepositGet(request: NextRequest) {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'deposit.now',
      description: PRODUCT.apiDescription,
      network: networkLabel(),
      x402Network: X402_NETWORK,
      networks: [
        { caip2: X402_NETWORK, label: networkLabelShort(X402_NETWORK), asset: 'USDC' },
        { caip2: SOLANA_NETWORK, label: networkLabelShort(SOLANA_NETWORK), asset: 'USDC' },
      ],
      payHint:
        'EVM 0x target → pay USDC on Base. Solana target → pay USDC on Solana. provision:true is Base only.',
      feePercent: PLATFORM_FEE_PERCENT,
      feeMinUsdc: PLATFORM_FEE_MIN_USDC,
      feeMaxUsdc: PLATFORM_FEE_MAX_USDC,
      docs: 'https://deposit.now/docs',
      llms: 'https://deposit.now/llms.txt',
      openapi: 'https://deposit.now/openapi.json',
      timestamp: new Date().toISOString(),
      ...receiptFields(request),
    },
    { status: 200, headers: CORS_HEADERS }
  );
}

/**
 * Runs after x402 payment verification succeeds.
 * Does not claim funds already arrived at target — forwarding is async in onAfterSettle.
 */
export async function handleDepositPost(request: NextRequest) {
  let target: string | null = null;
  let amountRaw: string | number | null = null;
  let memo: string | null = null;
  let provision = false;
  let label: string | null = null;

  try {
    const body = await request.json();
    if (typeof body.target === 'string') target = body.target.trim();
    if (body.amount !== undefined && body.amount !== null) amountRaw = body.amount;
    if (typeof body.memo === 'string') memo = body.memo.slice(0, 256).trim() || null;
    if (body.provision === true) provision = true;
    if (typeof body.label === 'string') label = body.label.trim() || null;
  } catch {
    // empty body handled below
  }

  const mode = resolveDepositTargetMode({ target, provision });
  let child: ChildAgentInfo | null = null;

  if (mode.mode === 'error') {
    return NextResponse.json(
      {
        error: 'invalid_request',
        code: mode.code,
        message: mode.message,
      },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  if (mode.mode === 'provision') {
    const provisioned = await provisionChild({
      label,
      idempotencyKey: request.headers.get('idempotency-key'),
      rateLimitKey:
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        request.headers.get('x-real-ip') ??
        'unknown',
    });
    if (!provisioned.ok) {
      return NextResponse.json(
        {
          error: 'provision_failed',
          code: provisioned.code,
          message: provisioned.message,
          ...(provisioned.retryAfter != null ? { retryAfter: provisioned.retryAfter } : {}),
        },
        {
          status: provisioned.status,
          headers: {
            ...CORS_HEADERS,
            ...(provisioned.retryAfter != null
              ? { 'Retry-After': String(provisioned.retryAfter) }
              : {}),
          },
        }
      );
    }
    child = provisioned.child;
    target = provisioned.child.address;
  }

  const targetCheck = validateDepositTarget(target, PLATFORM_PAY_TO);
  if (!targetCheck.ok) {
    return NextResponse.json(
      {
        error: 'invalid_target',
        code: targetCheck.code,
        message: targetCheck.message,
      },
      { status: 400, headers: CORS_HEADERS }
    );
  }
  target = targetCheck.address;

  const net = clampDepositUsdc(amountRaw);
  if (net === null) {
    return NextResponse.json(
      {
        error: 'invalid_amount',
        message: 'amount must be a USDC decimal between 0.01 and 100000 (net to target).',
      },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const split = calculateDepositSplit(net)!;
  const intent = buildIntent(
    target,
    net,
    memo,
    child
      ? {
          provisioned: true,
          childName: child.name,
          childAddress: child.address,
          childLabel: child.label,
        }
      : null
  );
  if (intent) {
    try {
      await saveDepositIntent(intent);
    } catch {
      // non-fatal
    }
  }

  const receipts = receiptFields(request);
  const receiptId = 'receiptId' in receipts ? (receipts.receiptId as string) : null;

  if (receiptId) {
    try {
      await mergeReceipt(receiptId, {
        target,
        memo,
        depositAmount: split.net.toFixed(6),
        grossAmount: split.gross.toFixed(6),
        fee: split.fee.toFixed(6),
        feePercent: split.feePercent.toFixed(2),
        netToTarget: split.net.toFixed(6),
        provisioned: !!child,
        childName: child?.name ?? null,
        childLabel: child?.label ?? null,
        childAddress: child?.address ?? null,
      });
    } catch {
      // best-effort
    }
  }

  return NextResponse.json(
    {
      status: 'payment_received',
      message: child
        ? `Payment received for ${split.net.toFixed(6)} USDC net to managed child ${child.address}. Forwarding is async — keys are platform-managed in CDP (no export in v1).`
        : `Payment received for ${split.net.toFixed(6)} USDC net to ${target}. Forwarding is async after settlement — use receiptUrl for payer, target, fee, and explorer links when available.`,
      target,
      memo,
      provisioned: !!child,
      ...(child ? { child } : {}),
      depositAmount: split.net.toFixed(6),
      fee: split.fee.toFixed(6),
      feePercent: split.feePercent,
      grossPaid: split.gross.toFixed(6),
      paymentReceived: true,
      forwardStatus: 'pending',
      network: networkLabel(),
      x402Network: X402_NETWORK,
      timestamp: new Date().toISOString(),
      transactionId: `txn_${Date.now()}_${crypto.randomUUID().slice(0, 12)}`,
      ...receipts,
    },
    { status: 200, headers: CORS_HEADERS }
  );
}

export function handleDepositOptions() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}
