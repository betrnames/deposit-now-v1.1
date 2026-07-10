import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { normalizeTier } from '@/lib/billing';
import {
  isValidEvmAddress,
  isValidMerchantSlug,
  listMerchants,
  upsertMerchant,
} from '@/lib/merchants';
import { X402_NETWORK } from '@/lib/x402';

const PUBLIC_CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const ADMIN_CORS = {
  'Access-Control-Allow-Origin': process.env.ADMIN_ALLOWED_ORIGIN ?? '',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Secret',
};

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.MERCHANT_ADMIN_SECRET;
  if (!secret) return false;
  const header =
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ??
    request.headers.get('x-admin-secret');
  if (!header) return false;
  const a = Buffer.from(header);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function GET() {
  const merchants = await listMerchants();
  return NextResponse.json(
    {
      merchants,
      count: merchants.length,
      x402Network: X402_NETWORK,
      docs: 'https://deposit.now/docs#merchants',
    },
    { headers: PUBLIC_CORS }
  );
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'unauthorized', message: 'Valid MERCHANT_ADMIN_SECRET required.' },
      { status: 401, headers: ADMIN_CORS }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'invalid_json' },
      { status: 400, headers: ADMIN_CORS }
    );
  }

  const slug = typeof body.slug === 'string' ? body.slug.toLowerCase().trim() : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const payTo = typeof body.payTo === 'string' ? body.payTo.trim() : '';

  if (!isValidMerchantSlug(slug)) {
    return NextResponse.json(
      { error: 'invalid_slug', message: 'Use lowercase letters, numbers, and hyphens.' },
      { status: 400, headers: ADMIN_CORS }
    );
  }
  if (!name) {
    return NextResponse.json({ error: 'name_required' }, { status: 400, headers: ADMIN_CORS });
  }
  if (!isValidEvmAddress(payTo)) {
    return NextResponse.json({ error: 'invalid_payTo' }, { status: 400, headers: ADMIN_CORS });
  }

  try {
    await upsertMerchant({
      slug,
      name,
      payTo,
      description: typeof body.description === 'string' ? body.description : undefined,
      webhookUrl: typeof body.webhookUrl === 'string' ? body.webhookUrl : undefined,
      webhookSecret: typeof body.webhookSecret === 'string' ? body.webhookSecret : undefined,
      tier: typeof body.tier === 'string' ? normalizeTier(body.tier) : undefined,
      active: body.active !== false,
    });
  } catch (error) {
    console.error('merchant upsert failed:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'merchant_save_failed' },
      { status: 500, headers: ADMIN_CORS }
    );
  }

  const merchants = await listMerchants();
  const created = merchants.find((m) => m.slug === slug);

  return NextResponse.json(
    { status: 'created', merchant: created },
    { status: 201, headers: ADMIN_CORS }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: { ...PUBLIC_CORS, ...ADMIN_CORS } });
}