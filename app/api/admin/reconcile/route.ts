import { NextRequest, NextResponse } from 'next/server';
import { listFailedForwards } from '@/lib/reconciliation';

/**
 * GET /api/admin/reconcile
 * Lists failed platform→target forwards for manual resolution.
 * Protected by ADMIN_API_KEY (Bearer or x-admin-key header).
 */
export async function GET(request: NextRequest) {
  const expected = process.env.ADMIN_API_KEY;
  if (!expected) {
    return NextResponse.json(
      { error: 'admin_not_configured', message: 'ADMIN_API_KEY is not set.' },
      { status: 503 }
    );
  }

  const auth = request.headers.get('authorization');
  const headerKey = request.headers.get('x-admin-key');
  const bearer =
    auth?.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : null;
  const provided = bearer || headerKey;

  if (!provided || provided !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const statusParam = request.nextUrl.searchParams.get('status');
  const status =
    statusParam === 'all' || statusParam === 'resolved' || statusParam === 'pending_manual'
      ? statusParam
      : 'pending_manual';

  const limitRaw = request.nextUrl.searchParams.get('limit');
  const limit = Math.min(500, Math.max(1, Number(limitRaw) || 100));

  try {
    const items = await listFailedForwards({ status, limit });
    return NextResponse.json({
      status: 'ok',
      filter: status,
      count: items.length,
      items,
      note: 'Failed forwards after settlement + 3 retries. Funds may sit in platform CDP wallet — resolve manually.',
    });
  } catch (err) {
    console.error(
      'admin reconcile list failed:',
      err instanceof Error ? err.message : 'unknown'
    );
    return NextResponse.json(
      { error: 'list_failed', message: 'Could not load reconciliation queue.' },
      { status: 500 }
    );
  }
}
