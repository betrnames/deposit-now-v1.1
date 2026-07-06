import { NextRequest, NextResponse } from 'next/server';
import { getMerchant, merchantSlugFromPath } from '@/lib/merchants';
import { receiptIdFromPaymentHeader } from '@/lib/receipts';
import { X402_NETWORK } from '@/lib/x402';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Payment, payment-signature',
};

function receiptFields(request: NextRequest) {
  const header =
    request.headers.get('payment-signature') ??
    request.headers.get('x-payment') ??
    request.headers.get('payment');
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
  const merchantSlug = merchantSlugFromPath(request.nextUrl.pathname);
  const merchant = merchantSlug ? await getMerchant(merchantSlug) : null;

  return NextResponse.json(
    {
      status: 'success',
      message: merchant
        ? `Deposit triggered for merchant ${merchant.name}`
        : 'Deposit triggered for agent!',
      depositAmount: '100.00',
      network: networkLabel(),
      x402Network: X402_NETWORK,
      timestamp: new Date().toISOString(),
      paymentReceived: true,
      ...(merchant
        ? {
            merchantSlug: merchant.slug,
            merchantName: merchant.name,
            payTo: merchant.payTo,
          }
        : {}),
      ...receiptFields(request),
    },
    { status: 200, headers: CORS_HEADERS }
  );
}

export async function handleDepositPost(request: NextRequest) {
  const merchantSlug = merchantSlugFromPath(request.nextUrl.pathname);
  const merchant = merchantSlug ? await getMerchant(merchantSlug) : null;

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
      message: merchant
        ? `Deposit of ${amount} triggered for ${merchant.name} account: ${account}`
        : `Deposit of ${amount} triggered for agent account: ${account}`,
      timestamp: new Date().toISOString(),
      network: networkLabel(),
      x402Network: X402_NETWORK,
      paymentReceived: true,
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      ...(merchant
        ? {
            merchantSlug: merchant.slug,
            merchantName: merchant.name,
            payTo: merchant.payTo,
          }
        : {}),
      ...receiptFields(request),
    },
    { status: 200, headers: CORS_HEADERS }
  );
}

export function handleDepositOptions() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}