import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

interface Entry {
  count: number;
  resetAt: number;
}

/** In-memory fallback when DATABASE_URL is missing (dev only). */
const store = new Map<string, Entry>();
const WINDOW_MS = 60_000;
const DEFAULT_MAX = 60;
const DEPOSIT_MAX = 30;
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

function limitForRoute(method: string, path: string): number {
  const key = `${method.toUpperCase()}${path}`;
  if (key === 'POST/api/deposit' || path === '/api/deposit' || path === '/api/deposit/') return DEPOSIT_MAX;
  if (path === '/api/waitlist') return WAITLIST_MAX;
  if (path.startsWith('/api/merchants')) return 10;
  return DEFAULT_MAX;
}

function windowStart(nowMs: number): number {
  return Math.floor(nowMs / WINDOW_MS) * WINDOW_MS;
}

/**
 * Durable sliding-window rate limit backed by Neon.
 * Falls back to in-memory Map when DATABASE_URL is unset (local dev).
 * On Vercel each instance has its own Map, so the DB path is required in prod.
 */
export async function checkRateLimit(request: NextRequest): Promise<NextResponse | null> {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';
  const path = request.nextUrl.pathname;
  const limit = limitForRoute(request.method, path);
  const key = `${ip}${path}`;
  const now = Date.now();
  const win = windowStart(now);

  if (process.env.DATABASE_URL) {
    try {
      const db = getDb();
      const rows = await db`
        INSERT INTO rate_limits (key, endpoint, "window", count)
        VALUES (${key}, ${path}, ${win}, 1)
        ON CONFLICT (key, endpoint, "window")
        DO UPDATE SET count = rate_limits.count + 1
        RETURNING count
      `;
      const count = Number(rows[0].count);
      if (count > limit) {
        const retryAfter = Math.max(1, Math.ceil((win + WINDOW_MS - now) / 1000));
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
    } catch (err) {
      console.error('[rate-limit] DB check failed, falling back to memory:', err);
    }
  }

  // In-memory fallback (dev / DB outage)
  let entry = store.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    store.set(key, entry);
  }
  entry.count++;
  if (entry.count > limit) {
    const retryAfter = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
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
