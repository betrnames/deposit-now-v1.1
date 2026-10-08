import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

/**
 * GET /api/health — verifies Neon is reachable.
 * Returns 200 { ok: true } or 503 { ok: false, error }.
 * Use with an uptime monitor (Better Stack, UptimeRobot, cron) hitting this URL.
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { ok: false, error: 'DATABASE_URL not configured' },
      { status: 503 }
    );
  }
  try {
    const db = getDb();
    await db`SELECT 1`;
    return NextResponse.json({ ok: true, ts: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : 'database unreachable',
      },
      { status: 503 }
    );
  }
}
