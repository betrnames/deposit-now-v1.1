import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { middleware as x402Middleware } from '@/lib/x402';

function isX402Route(pathname: string): boolean {
  return pathname === '/api/deposit' || pathname === '/api/deposit/';
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
