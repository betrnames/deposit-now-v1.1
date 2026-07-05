import { NextRequest, NextResponse } from 'next/server';
import { receiptIdFromPaymentHeader } from '@/lib/receipts';

// Payment is enforced by the x402 middleware (see middleware.ts).
// If a request reaches this handler, the payment has been verified; the
// middleware settles it after this handler returns success and then writes
// the public deposit receipt (see onAfterSettle in middleware.ts).

function receiptFields(request: NextRequest) {
  const header =
    request.headers.get('x-payment') ?? request.headers.get('payment');
  const receiptId = header ? receiptIdFromPaymentHeader(header) : null;
  return receiptId
    ? {
        receiptId,
        receiptUrl: `https://deposit.now/receipt/${receiptId}`,
      }
    : {};
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Payment',
};

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      status: 'success',
      message: 'Deposit triggered for agent!',
      depositAmount: '100.00',
      network: request.headers.get('x-deposit-network') ?? 'base',
      timestamp: new Date().toISOString(),
      paymentReceived: true,
      ...receiptFields(request),
    },
    { status: 200, headers: CORS_HEADERS }
  );
}

export async function POST(request: NextRequest) {
  let amount = '100.00';
  let account = 'default-agent';
  try {
    const body = await request.json();
    if (typeof body.amount === 'string' || typeof body.amount === 'number') {
      amount = String(body.amount);
    }
    if (typeof body.account === 'string') {
      account = body.account;
    }
  } catch {
    // empty body is fine — defaults apply
  }

  return NextResponse.json(
    {
      status: 'success',
      depositAmount: amount,
      account,
      message: `Deposit of ${amount} triggered for agent account: ${account}`,
      timestamp: new Date().toISOString(),
      paymentReceived: true,
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      ...receiptFields(request),
    },
    { status: 200, headers: CORS_HEADERS }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}
