import { put, head } from '@vercel/blob';
import { createHash } from 'crypto';
import {
  calculateDepositSplit,
  clampDepositUsdc,
  isNonZeroEvmAddress,
} from '@/lib/billing';

export interface DepositIntent {
  target: string;
  amount: string;
  memo: string | null;
  net: number;
  fee: number;
  gross: number;
  createdAt: string;
}

function intentBlobPath(key: string) {
  return `deposit-intents/${key}.json`;
}

/** Deterministic key from deposit fields (same body → same intent). */
export function intentKeyFromFields(
  target: string,
  amount: string,
  memo: string | null
): string {
  return createHash('sha256')
    .update(`${target.toLowerCase()}|${amount}|${memo ?? ''}`)
    .digest('hex')
    .slice(0, 32);
}

export function buildIntent(
  target: string,
  amountRaw: string | number | null,
  memo: string | null
): DepositIntent | null {
  if (!isNonZeroEvmAddress(target)) return null;
  const net = clampDepositUsdc(amountRaw);
  if (net === null) return null;
  const split = calculateDepositSplit(net);
  if (!split) return null;
  return {
    target,
    amount: split.net.toFixed(6),
    memo,
    net: split.net,
    fee: split.fee,
    gross: split.gross,
    createdAt: new Date().toISOString(),
  };
}

/** Persist intent so settlement can recover target/amount if body is missing. */
export async function saveDepositIntent(intent: DepositIntent): Promise<string | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  const key = intentKeyFromFields(intent.target, intent.amount, intent.memo);
  const grossAtomic = String(Math.round(intent.gross * 1e6));
  const payload = JSON.stringify({ ...intent, key, grossAtomic });

  await put(intentBlobPath(key), payload, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });

  // Secondary index: gross paid (atomic) → latest intent key (concurrent same-size deposits may race)
  await put(`deposit-intents/by-gross/${grossAtomic}.json`, JSON.stringify({ key, ...intent }), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });

  return key;
}

export async function loadIntentByKey(key: string): Promise<DepositIntent | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN || !/^[a-f0-9]{16,32}$/.test(key)) return null;
  try {
    const blob = await head(intentBlobPath(key));
    const res = await fetch(blob.url, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as DepositIntent;
  } catch {
    return null;
  }
}

/** Fallback when settle body is empty: lookup by gross payment amount (atomic USDC). */
export async function loadIntentByGrossAtomic(
  amountAtomic: string
): Promise<DepositIntent | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN || !amountAtomic) return null;
  try {
    const blob = await head(`deposit-intents/by-gross/${amountAtomic}.json`);
    const res = await fetch(blob.url, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as DepositIntent;
  } catch {
    return null;
  }
}

export async function mergeReceipt(
  id: string,
  patch: Record<string, unknown>
): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  const path = `receipts/${id}.json`;
  let existing: Record<string, unknown> = {};
  try {
    const blob = await head(path);
    const res = await fetch(blob.url, { cache: 'no-store' });
    if (res.ok) existing = (await res.json()) as Record<string, unknown>;
  } catch {
    // new receipt
  }
  await put(path, JSON.stringify({ ...existing, ...patch, id }), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}
