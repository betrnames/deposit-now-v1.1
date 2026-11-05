import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

/**
 * Only /api/deposit hits this middleware. Non-POST methods skip the heavy
 * x402/crypto stack entirely (lazy import below runs for POST only).
 */
export async function middleware(request: NextRequest) {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  if (request.method !== 'POST') {
    return NextResponse.next();
  }

  // Dynamic import so GET/HEAD/OPTIONS and cold paths never load lib/x402
  // (@x402/next, EVM+Solana schemes, CDP facilitator, etc.).
  const { middleware: x402Middleware } = await import('@/lib/x402');
  return x402Middleware(request);
}

export const config = {
  matcher: ['/api/deposit', '/api/deposit/'],
  runtime: 'nodejs',
};
