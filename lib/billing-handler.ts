import { NextRequest, NextResponse } from 'next/server';
import { getMerchant, merchantRouteFromPath } from '@/lib/merchants';
import { receiptIdFromPaymentHeader } from '@/lib/receipts';
import { TIER_BILLING, toBillingPublic } from '@/lib/billing';
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

async function resolveMerchant(request: NextRequest) {
  const route = merchantRouteFromPath(request.nextUrl.pathname);
  if (!route || route.action === 'deposit') return null;
  const merchant = await getMerchant(route.slug);
  if (!merchant?.active) return null;
  return { merchant, action: route.action };
}

export async function handleBillingGet(request: NextRequest) {
  const resolved = await resolveMerchant(request);
  if (!resolved) {
    return NextResponse.json(
      { error: 'merchant_not_found' },
      { status: 404, headers: CORS_HEADERS }
    );
  }

  const { merchant, action } = resolved;
  const billing = toBillingPublic(merchant);

  if (action === 'renew') {
    return NextResponse.json(
      {
        status: 'success',
        action: 'renew',
        merchantSlug: merchant.slug,
        tier: billing.tier,
        monthlyFeeUsdc: TIER_BILLING.rail.monthlyFeeUsdc,
        renewDays: TIER_BILLING.rail.renewDays,
        tierExpiresAt: billing.tierExpiresAt,
        message: `Rail tier renewed for ${merchant.name}`,
        network: networkLabel(),
        x402Network: X402_NETWORK,
        paymentReceived: true,
        timestamp: new Date().toISOString(),
        ...receiptFields(request),
      },
      { status: 200, headers: CORS_HEADERS }
    );
  }

  return NextResponse.json(
    {
      status: 'success',
      action: 'topup',
      merchantSlug: merchant.slug,
      balanceUsdc: billing.balanceUsdc,
      message: `Billing balance topped up for ${merchant.name}`,
      network: networkLabel(),
      x402Network: X402_NETWORK,
      paymentReceived: true,
      timestamp: new Date().toISOString(),
      ...receiptFields(request),
    },
    { status: 200, headers: CORS_HEADERS }
  );
}

export async function handleBillingPost(request: NextRequest) {
  const resolved = await resolveMerchant(request);
  if (!resolved) {
    return NextResponse.json(
      { error: 'merchant_not_found' },
      { status: 404, headers: CORS_HEADERS }
    );
  }

  const { merchant, action } = resolved;
  const billing = toBillingPublic(merchant);

  let amount: string | null = null;
  try {
    const body = await request.json();
    if (typeof body.amount === 'string' || typeof body.amount === 'number') {
      amount = String(body.amount);
    }
  } catch {
    // empty body is fine for renew
  }

  if (action === 'renew') {
    return NextResponse.json(
      {
        status: 'success',
        action: 'renew',
        merchantSlug: merchant.slug,
        tier: 'rail',
        monthlyFeeUsdc: TIER_BILLING.rail.monthlyFeeUsdc,
        renewDays: TIER_BILLING.rail.renewDays,
        tierExpiresAt: billing.tierExpiresAt,
        message: `Rail tier renewed for ${merchant.name}`,
        timestamp: new Date().toISOString(),
        network: networkLabel(),
        x402Network: X402_NETWORK,
        paymentReceived: true,
        ...receiptFields(request),
      },
      { status: 200, headers: CORS_HEADERS }
    );
  }

  return NextResponse.json(
    {
      status: 'success',
      action: 'topup',
      merchantSlug: merchant.slug,
      topupAmount: amount,
      balanceUsdc: billing.balanceUsdc,
      message: amount
        ? `Topped up ${amount} USDC for ${merchant.name}`
        : `Billing balance topped up for ${merchant.name}`,
      timestamp: new Date().toISOString(),
      network: networkLabel(),
      x402Network: X402_NETWORK,
      paymentReceived: true,
      ...receiptFields(request),
    },
    { status: 200, headers: CORS_HEADERS }
  );
}

export function handleBillingOptions() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}