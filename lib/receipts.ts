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
}

// The receipt id is derived deterministically from the payment's unique
// signature/nonce, so the route handler (which sees the X-Payment request
// header) and the onAfterSettle hook (which sees the decoded payload)
// independently compute the same id with no shared state.
export function receiptIdFromPayload(payload: unknown): string | null {
  const p = payload as {
    payload?: { signature?: string; authorization?: { nonce?: string } };
  } | null;
  const unique = p?.payload?.signature ?? p?.payload?.authorization?.nonce;
  if (!unique) return null;
  return createHash('sha256').update(String(unique)).digest('hex').slice(0, 16);
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

export const isValidReceiptId = (id: string) => /^[a-f0-9]{16}$/.test(id);

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
