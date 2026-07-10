import { NextRequest, NextResponse } from 'next/server';

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();
const WINDOW_MS = 60_000;
const DEFAULT_MAX = 60;
const ADMIN_MAX = 5;
const WAITLIST_MAX = 10;

if (typeof setInterval !== 'undefined') {
  const timer = setInterval(() => {
    const now = Date.now();
    store.forEach((entry, key) => {
      if (entry.resetAt <= now) store.delete(key);
    });
  }, 30_000);
  timer.unref?.();
}

function limitForRoute(pathname: string, method: string): number {
  if (pathname === '/api/merchants' && method === 'POST') return ADMIN_MAX;
  if (pathname === '/api/waitlist') return WAITLIST_MAX;
  return DEFAULT_MAX;
}

export function checkRateLimit(request: NextRequest): NextResponse | null {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';
  const pathname = request.nextUrl.pathname;
  const limit = limitForRoute(pathname, request.method);
  const key = `${ip}:${pathname}`;
  const now = Date.now();

  let entry = store.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    store.set(key, entry);
  }

  entry.count++;

  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { error: 'rate_limit_exceeded', retryAfter },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  return null;
}
