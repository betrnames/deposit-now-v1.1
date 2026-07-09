import type { Merchant } from '@/lib/merchants';

export type MerchantTier = 'catalog' | 'rail' | 'network';

export interface TierBillingConfig {
  id: MerchantTier;
  monthlyFeeUsdc: number | null;
  settlementFeeBps: number;
  renewDays: number;
}

export const TIER_BILLING: Record<MerchantTier, TierBillingConfig> = {
  catalog: {
    id: 'catalog',
    monthlyFeeUsdc: 0,
    settlementFeeBps: 30,
    renewDays: 0,
  },
  rail: {
    id: 'rail',
    monthlyFeeUsdc: 49,
    settlementFeeBps: 15,
    renewDays: 30,
  },
  network: {
    id: 'network',
    monthlyFeeUsdc: null,
    settlementFeeBps: 10,
    renewDays: 30,
  },
};

export const DEPOSIT_MIN_USDC = 0.01;
export const DEPOSIT_MAX_USDC = 100_000;

export const TOPUP_MIN_USDC = 10;
export const TOPUP_MAX_USDC = 10_000;

export function normalizeTier(tier: string | undefined): MerchantTier {
  if (tier === 'rail' || tier === 'network') return tier;
  return 'catalog';
}

export function isTierActive(merchant: Merchant): boolean {
  const tier = normalizeTier(merchant.tier);
  if (tier === 'catalog' || tier === 'network') return true;
  if (!merchant.tierExpiresAt) return false;
  return new Date(merchant.tierExpiresAt) > new Date();
}

export function canUseWebhooks(merchant: Merchant): boolean {
  const tier = normalizeTier(merchant.tier);
  if (tier === 'catalog') return false;
  if (tier === 'network') return true;
  return isTierActive(merchant);
}

export function settlementFeeMicro(
  depositAmount: string | null,
  tier: MerchantTier | undefined
): number {
  const bps = TIER_BILLING[normalizeTier(tier)].settlementFeeBps;
  if (!depositAmount) return 0;
  const amount = parseFloat(depositAmount);
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.ceil((amount * 1_000_000 * bps) / 10_000);
}

export function microToUsdc(micro: number): string {
  return (micro / 1_000_000).toFixed(6);
}

export function usdcToMicro(usdc: number): number {
  return Math.round(usdc * 1_000_000);
}

export function extendTierExpiry(current: string | undefined, days: number): string {
  const base = current && new Date(current) > new Date() ? new Date(current) : new Date();
  base.setUTCDate(base.getUTCDate() + days);
  return base.toISOString();
}

export function clampDepositUsdc(amount: unknown): number | null {
  if (amount === undefined || amount === null) return null;
  const parsed = typeof amount === 'number' ? amount : parseFloat(String(amount));
  if (!Number.isFinite(parsed) || parsed < DEPOSIT_MIN_USDC) return null;
  return Math.min(DEPOSIT_MAX_USDC, Math.max(DEPOSIT_MIN_USDC, parsed));
}

export function clampTopupUsdc(amount: unknown): number {
  const parsed = typeof amount === 'number' ? amount : parseFloat(String(amount ?? TOPUP_MIN_USDC));
  if (!Number.isFinite(parsed)) return TOPUP_MIN_USDC;
  return Math.min(TOPUP_MAX_USDC, Math.max(TOPUP_MIN_USDC, parsed));
}

export interface MerchantBillingPublic {
  tier: MerchantTier;
  tierActive: boolean;
  tierExpiresAt: string | null;
  balanceUsdc: string;
  settlementFeeBps: number;
  renewUrl: string;
  topupUrl: string;
  monthlyFeeUsdc: number | null;
}

export function toBillingPublic(merchant: Merchant): MerchantBillingPublic {
  const tier = normalizeTier(merchant.tier);
  const config = TIER_BILLING[tier];
  return {
    tier,
    tierActive: isTierActive(merchant),
    tierExpiresAt: merchant.tierExpiresAt ?? null,
    balanceUsdc: microToUsdc(merchant.billingBalanceMicro ?? 0),
    settlementFeeBps: config.settlementFeeBps,
    monthlyFeeUsdc: config.monthlyFeeUsdc,
    renewUrl: `https://deposit.now/api/merchants/${merchant.slug}/renew`,
    topupUrl: `https://deposit.now/api/merchants/${merchant.slug}/topup`,
  };
}