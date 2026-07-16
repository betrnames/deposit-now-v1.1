import { NextRequest, NextResponse } from 'next/server';
import {
  calculateDepositSplit,
  clampDepositUsdc,
  isValidEvmAddress,
} from '@/lib/billing';
import { buildIntent, mergeReceipt, saveDepositIntent } from '@/lib/deposit-intent';
import { receiptIdFromPaymentHeader } from '@/lib/receipts';
import { X402_NETWORK } from '@/lib/x402';

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
  return X402_NETWORK === 'eip155:8453' ? 'base' : 'base-sepolia';
}

export async function handleDepositGet(request: NextRequest) {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'deposit.now',
      description:
        'Open x402 funding rail. POST /api/deposit with { target, amount, memo? } — pay amount + 1% via x402; net is forwarded to target after settlement. Optional public receipts when storage is configured.',
      network: networkLabel(),
      x402Network: X402_NETWORK,
      feePercent: 1,
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

  try {
    const body = await request.json();
    if (typeof body.target === 'string') target = body.target.trim();
    if (body.amount !== undefined && body.amount !== null) amountRaw = body.amount;
    if (typeof body.memo === 'string') memo = body.memo.slice(0, 256).trim() || null;
  } catch {
    // empty body handled below
  }

  if (!isValidEvmAddress(target)) {
    return NextResponse.json(
      {
        error: 'invalid_target',
        message: 'target must be a valid EVM address (0x + 40 hex chars).',
      },
      { status: 400, headers: CORS_HEADERS }
    );
  }

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
  const intent = buildIntent(target, net, memo);
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
      });
    } catch {
      // best-effort
    }
  }

  return NextResponse.json(
    {
      status: 'payment_received',
      message: `Payment received for ${split.net.toFixed(6)} USDC net to ${target}. Forwarding is async after settlement — use receiptUrl for payer, target, fee, and Basescan links when available.`,
      target,
      memo,
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
