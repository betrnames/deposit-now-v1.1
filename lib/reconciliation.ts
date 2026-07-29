/**
 * Failed-forward reconciliation queue.
 * Used when platform→target transfer fails after settlement (post-retry).
 */

import { put, head, list } from '@vercel/blob';
import { getDb } from '@/lib/db';

export interface FailedForward {
  id: string;
  depositId: string;
  target: string;
  netUsdc: number;
  grossUsdc: number;
  agentTxHash: string | null;
  error: string;
  retryCount: number;
  status: 'pending_manual' | 'resolved';
  createdAt: string;
  memo?: string | null;
}

function failedBlobPath(id: string) {
  return `failed-forwards/${id}.json`;
}

/**
 * Persist a failed forward for manual reconciliation.
 * Prefer Neon; fall back to Vercel Blob.
 */
export async function enqueueFailedForward(entry: {
  depositId: string;
  target: string;
  netUsdc: number;
  grossUsdc: number;
  agentTxHash: string | null;
  error: string;
  retryCount: number;
  memo?: string | null;
}): Promise<FailedForward> {
  const record: FailedForward = {
    id: entry.depositId,
    depositId: entry.depositId,
    target: entry.target,
    netUsdc: entry.netUsdc,
    grossUsdc: entry.grossUsdc,
    agentTxHash: entry.agentTxHash,
    error: entry.error,
    retryCount: entry.retryCount,
    status: 'pending_manual',
    createdAt: new Date().toISOString(),
    memo: entry.memo ?? null,
  };

  console.error(
    `[reconcile] FAILED_FORWARD depositId=${record.depositId} target=${record.target} ` +
      `net=${record.netUsdc} gross=${record.grossUsdc} agentTx=${record.agentTxHash ?? 'none'} ` +
      `retries=${record.retryCount} error=${record.error}`
  );

  if (process.env.DATABASE_URL) {
    try {
      const db = getDb();
      await db`
        INSERT INTO failed_forwards (
          id, deposit_id, target_address, net_usdc, gross_usdc,
          agent_tx_hash, error_message, retry_count, status, memo
        ) VALUES (
          ${record.id}, ${record.depositId}, ${record.target},
          ${record.netUsdc}, ${record.grossUsdc},
          ${record.agentTxHash}, ${record.error}, ${record.retryCount},
          ${record.status}, ${record.memo ?? null}
        )
        ON CONFLICT (id) DO UPDATE SET
          error_message = EXCLUDED.error_message,
          retry_count = EXCLUDED.retry_count,
          status = EXCLUDED.status,
          agent_tx_hash = COALESCE(EXCLUDED.agent_tx_hash, failed_forwards.agent_tx_hash)
      `;
      return record;
    } catch (err) {
      console.error(
        '[reconcile] DB enqueue failed, trying blob:',
        err instanceof Error ? err.message : 'unknown'
      );
    }
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put(failedBlobPath(record.id), JSON.stringify(record), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
    });
  }

  return record;
}

export async function listFailedForwards(opts?: {
  status?: 'pending_manual' | 'resolved' | 'all';
  limit?: number;
}): Promise<FailedForward[]> {
  const status = opts?.status ?? 'pending_manual';
  const limit = opts?.limit ?? 100;

  if (process.env.DATABASE_URL) {
    try {
      const db = getDb();
      if (status === 'all') {
        const rows = await db`
          SELECT id, deposit_id, target_address, net_usdc, gross_usdc,
                 agent_tx_hash, error_message, retry_count, status, memo, created_at
          FROM failed_forwards
          ORDER BY created_at DESC
          LIMIT ${limit}
        `;
        return rows.map(rowToFailedForward);
      }
      const rows = await db`
        SELECT id, deposit_id, target_address, net_usdc, gross_usdc,
               agent_tx_hash, error_message, retry_count, status, memo, created_at
        FROM failed_forwards
        WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
      return rows.map(rowToFailedForward);
    } catch (err) {
      console.error(
        '[reconcile] DB list failed, trying blob:',
        err instanceof Error ? err.message : 'unknown'
      );
    }
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];

  const out: FailedForward[] = [];
  try {
    const result = await list({ prefix: 'failed-forwards/', limit: 1000 });
    for (const blob of result.blobs) {
      try {
        const res = await fetch(blob.url, { cache: 'no-store' });
        if (!res.ok) continue;
        const item = (await res.json()) as FailedForward;
        if (status !== 'all' && item.status !== status) continue;
        out.push(item);
      } catch {
        // skip bad blob
      }
    }
  } catch {
    return [];
  }

  out.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return out.slice(0, limit);
}

function rowToFailedForward(row: Record<string, unknown>): FailedForward {
  return {
    id: String(row.id),
    depositId: String(row.deposit_id ?? row.id),
    target: String(row.target_address),
    netUsdc: Number(row.net_usdc),
    grossUsdc: Number(row.gross_usdc),
    agentTxHash: row.agent_tx_hash != null ? String(row.agent_tx_hash) : null,
    error: String(row.error_message ?? ''),
    retryCount: Number(row.retry_count ?? 0),
    status: (row.status as FailedForward['status']) ?? 'pending_manual',
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at ?? new Date().toISOString()),
    memo: row.memo != null ? String(row.memo) : null,
  };
}

/** Optional: load one failed forward by deposit id (blob path). */
export async function getFailedForward(depositId: string): Promise<FailedForward | null> {
  if (process.env.DATABASE_URL) {
    try {
      const db = getDb();
      const rows = await db`
        SELECT id, deposit_id, target_address, net_usdc, gross_usdc,
               agent_tx_hash, error_message, retry_count, status, memo, created_at
        FROM failed_forwards WHERE id = ${depositId} LIMIT 1
      `;
      if (rows.length) return rowToFailedForward(rows[0] as Record<string, unknown>);
    } catch {
      // fall through
    }
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const blob = await head(failedBlobPath(depositId));
    const res = await fetch(blob.url, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as FailedForward;
  } catch {
    return null;
  }
}
