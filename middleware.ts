import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { middleware as x402Middleware } from '@/lib/x402';

const X402_PATTERN = /^\/api\/merchants\/[a-z0-9][a-z0-9-]*\/(deposit|renew|topup)\/?$/;

function isX402Route(pathname: string): boolean {
  return pathname === '/api/deposit' || X402_PATTERN.test(pathname);
}

export async function middleware(request: NextRequest) {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  if (isX402Route(request.nextUrl.pathname)) {
    return x402Middleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
  runtime: 'nodejs',
};
