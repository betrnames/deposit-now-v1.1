/** Deposit amount caps and platform fee (1%). */

export const DEPOSIT_MIN_USDC = 0.01;
export const DEPOSIT_MAX_USDC = 100_000;

/** Platform fee: 1% of the requested net deposit (100 bps). */
export const PLATFORM_FEE_BPS = 100;

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

export function isValidEvmAddress(value: unknown): value is string {
  return typeof value === 'string' && ADDRESS_RE.test(value);
}

export function clampDepositUsdc(amount: unknown): number | null {
  if (amount === undefined || amount === null) return null;
  const raw = typeof amount === 'number' ? amount : parseFloat(String(amount).trim());
  if (!Number.isFinite(raw) || raw < DEPOSIT_MIN_USDC) return null;
  const clamped = Math.min(DEPOSIT_MAX_USDC, Math.max(DEPOSIT_MIN_USDC, raw));
  return Math.round(clamped * 1e6) / 1e6;
}

export interface DepositSplit {
  /** Net USDC forwarded to target wallet */
  net: number;
  /** Platform fee USDC (1%) */
  fee: number;
  /** Total USDC the agent pays via x402 (net + fee) */
  gross: number;
  feePercent: number;
  bps: number;
}

/**
 * `amount` is the intended net funding for the target wallet.
 * Agent pays gross = amount + 1% fee.
 */
export function calculateDepositSplit(amountUsdc: number): DepositSplit | null {
  if (!Number.isFinite(amountUsdc) || amountUsdc < DEPOSIT_MIN_USDC) return null;
  const net = Math.round(amountUsdc * 1e6) / 1e6;
  const fee = Math.round(((net * PLATFORM_FEE_BPS) / 10_000) * 1e6) / 1e6;
  const gross = Math.round((net + fee) * 1e6) / 1e6;
  return {
    net,
    fee,
    gross,
    feePercent: PLATFORM_FEE_BPS / 100,
    bps: PLATFORM_FEE_BPS,
  };
}

export function formatUsdcPrice(usdc: number): string {
  // x402 accepts `$` + decimal string; always emit 2–6 fractional digits
  const rounded = Math.round(usdc * 1e6) / 1e6;
  let s = rounded.toFixed(6);
  s = s.replace(/0+$/, '').replace(/\.$/, '');
  if (!s.includes('.')) s = `${s}.00`;
  else if (s.split('.')[1].length === 1) s = `${s}0`;
  return `$${s}`;
}
