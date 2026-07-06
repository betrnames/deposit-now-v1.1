import { NextResponse } from 'next/server';
import { getMerchant, isValidMerchantSlug, toPublicMerchant } from '@/lib/merchants';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug.toLowerCase();

  if (!isValidMerchantSlug(slug)) {
    return NextResponse.json({ error: 'invalid_slug' }, { status: 400, headers: CORS_HEADERS });
  }

  const merchant = await getMerchant(slug);
  if (!merchant?.active) {
    return NextResponse.json({ error: 'merchant_not_found' }, { status: 404, headers: CORS_HEADERS });
  }

  return NextResponse.json({ merchant: toPublicMerchant(merchant) }, { headers: CORS_HEADERS });
}