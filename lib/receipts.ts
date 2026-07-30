import { createHash } from 'crypto';

export interface DepositReceipt {
  id: string;
  payer: string | null;
  amountAtomic: string | null;
  amountUsdc: string | null;
  asset: string | null;
  network: string | null;
  payTo: string | null;
  txHash: string | null;
  resource: string;
  settledAt: string;
  /** Destination wallet that receives net funds */
  target?: string | null;
  /** Optional agent memo (e.g. fund child trading agent) */
  memo?: string | null;
  /** Net USDC intended for target */
  depositAmount?: string | null;
  grossAmount?: string | null;
  fee?: string | null;
  feePercent?: string | null;
  netToTarget?: string | null;
  forwardTxHash?: string | null;
  forwardStatus?: 'settled' | 'forward_failed' | 'pending' | 'held' | null;
  note?: string | null;
  /** Managed child wallet fields when provisioned */
  provisioned?: boolean | null;
  childName?: string | null;
  childLabel?: string | null;
  childAddress?: string | null;
}

// Receipt id is derived from the payment signature/nonce so the route handler
// and onAfterSettle independently compute the same id with no shared state.
export function receiptIdFromPayload(payload: unknown): string | null {
  const p = payload as {
    payload?: { signature?: string; authorization?: { nonce?: string } };
  } | null;
  const unique = p?.payload?.signature ?? p?.payload?.authorization?.nonce;
  if (!unique) return null;
  return createHash('sha256').update(String(unique)).digest('hex').slice(0, 32);
}

export function receiptIdFromPaymentHeader(header: string): string | null {
  try {
    const decoded = JSON.parse(Buffer.from(header, 'base64').toString('utf8'));
    return receiptIdFromPayload(decoded);
  } catch {
    return null;
  }
}

export const receiptBlobPath = (id: string) => `receipts/${id}.json`;

export const isValidReceiptId = (id: string) => /^[a-f0-9]{16,32}$/.test(id);

export function explorerTxUrl(network: string | null, txHash: string | null): string | null {
  if (!txHash) return null;
  if (network === 'eip155:8453') return `https://basescan.org/tx/${txHash}`;
  if (network === 'eip155:84532') return `https://sepolia.basescan.org/tx/${txHash}`;
  return null;
}

export function networkLabel(network: string | null): string {
  if (network === 'eip155:8453') return 'Base';
  if (network === 'eip155:84532') return 'Base Sepolia (testnet)';
  return network ?? 'unknown';
}
