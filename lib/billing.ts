/** Deposit amount caps and platform fee (0.25%, min $0.001, max $0.25). */

export const DEPOSIT_MIN_USDC = 0.01;
export const DEPOSIT_MAX_USDC = 100_000;

/** Platform fee: 0.25% of the requested net deposit (25 bps). */
export const PLATFORM_FEE_BPS = 25;
/** Dust floor so tiny deposits still cover bookkeeping. */
export const PLATFORM_FEE_MIN_USDC = 0.001;
/**
 * Hard cap so every fee stays under the ~$0.32 average x402 payment.
 * 0.25% of $100 = $0.25; larger nets still pay $0.25.
 */
export const PLATFORM_FEE_MAX_USDC = 0.25;
/** Advertised percent (25 bps → 0.25). */
export const PLATFORM_FEE_PERCENT = PLATFORM_FEE_BPS / 100;

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export function isValidEvmAddress(value: unknown): value is string {
  return typeof value === 'string' && ADDRESS_RE.test(value);
}

/** True for 0x + 40 hex that is not the zero address. */
export function isNonZeroEvmAddress(value: unknown): value is string {
  return isValidEvmAddress(value) && value.toLowerCase() !== ZERO_ADDRESS;
}

export function roundUsdc(amount: number): number {
  return Math.round(amount * 1e6) / 1e6;
}

export function clampDepositUsdc(amount: unknown): number | null {
  if (amount === undefined || amount === null) return null;
  const raw = typeof amount === 'number' ? amount : parseFloat(String(amount).trim());
  if (!Number.isFinite(raw) || raw < DEPOSIT_MIN_USDC) return null;
  const clamped = Math.min(DEPOSIT_MAX_USDC, Math.max(DEPOSIT_MIN_USDC, raw));
  return roundUsdc(clamped);
}

export interface DepositSplit {
  /** Net USDC forwarded to target wallet */
  net: number;
  /** Platform fee USDC after min/max clamp */
  fee: number;
  /** Total USDC the agent pays via x402 (net + fee) */
  gross: number;
  /** Advertised fee percent (0.25), not the effective rate after clamp */
  feePercent: number;
  bps: number;
}

/**
 * `amount` is the intended net funding for the target wallet.
 * Agent pays gross = net + clamp(net * bps / 10000, min, max).
 *
 * Examples (fee always ≤ $0.25, under the ~$0.32 average x402 payment):
 *  $0.01  → fee $0.001  (min)  gross $0.011
 *  $0.32  → fee $0.001  (min)  gross $0.321
 *  $50    → fee $0.125         gross $50.125
 *  $100   → fee $0.25   (max)  gross $100.25
 *  $1000  → fee $0.25   (max)  gross $1000.25
 */
export function calculateDepositSplit(amountUsdc: number): DepositSplit | null {
  if (!Number.isFinite(amountUsdc) || amountUsdc < DEPOSIT_MIN_USDC) return null;
  const net = roundUsdc(amountUsdc);
  const raw = (net * PLATFORM_FEE_BPS) / 10_000;
  const fee = roundUsdc(
    Math.min(PLATFORM_FEE_MAX_USDC, Math.max(PLATFORM_FEE_MIN_USDC, raw))
  );
  const gross = roundUsdc(net + fee);
  return {
    net,
    fee,
    gross,
    feePercent: PLATFORM_FEE_PERCENT,
    bps: PLATFORM_FEE_BPS,
  };
}

/** x402 fallback price when amount is missing/invalid — min net + clamped fee. */
export function fallbackGrossPrice(): string {
  const split = calculateDepositSplit(DEPOSIT_MIN_USDC);
  return formatUsdcPrice(split ? split.gross : DEPOSIT_MIN_USDC + PLATFORM_FEE_MIN_USDC);
}

export function formatUsdcPrice(usdc: number): string {
  // x402 accepts `$` + decimal string; always emit 2–6 fractional digits
  const rounded = roundUsdc(usdc);
  let s = rounded.toFixed(6);
  s = s.replace(/0+$/, '').replace(/\.$/, '');
  if (!s.includes('.')) s = `${s}.00`;
  else if (s.split('.')[1].length === 1) s = `${s}0`;
  return `$${s}`;
}
