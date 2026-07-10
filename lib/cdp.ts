import { CdpClient } from '@coinbase/cdp-sdk';
import { put } from '@vercel/blob';
import { normalizeTier, TIER_BILLING, type MerchantTier } from '@/lib/billing';

let _cdp: CdpClient | null = null;

function getCdpClient(): CdpClient {
  if (!_cdp) {
    if (!process.env.CDP_API_KEY_ID || !process.env.CDP_API_KEY_SECRET) {
      throw new Error('CDP credentials required for settlement');
    }
    _cdp = new CdpClient({
      apiKeyId: process.env.CDP_API_KEY_ID,
      apiKeySecret: process.env.CDP_API_KEY_SECRET,
      walletSecret: process.env.CDP_WALLET_SECRET,
    });
  }
  return _cdp;
}

async function getPlatformAccount() {
  return getCdpClient().evm.getOrCreateAccount({ name: 'deposit-now-platform' });
}

export interface SettlementSplit {
  gross: number;
  fee: number;
  net: number;
  feePercent: number;
  bps: number;
}

export function calculateSplit(
  grossUsdc: string | null,
  tier: MerchantTier | undefined
): SettlementSplit | null {
  if (!grossUsdc) return null;
  const gross = parseFloat(grossUsdc);
  if (!Number.isFinite(gross) || gross <= 0) return null;
  const bps = TIER_BILLING[normalizeTier(tier)].settlementFeeBps;
  const feePercent = bps / 100;
  const fee = Math.round(((gross * bps) / 10_000) * 1e6) / 1e6;
  const net = Math.round((gross - fee) * 1e6) / 1e6;
  return { gross, fee, net, feePercent, bps };
}

async function forwardToMerchant(
  merchantPayTo: string,
  netUsdc: number
): Promise<string> {
  const account = await getPlatformAccount();
  const atomicAmount = BigInt(Math.round(netUsdc * 1e6));
  const result = await account.transfer({
    to: merchantPayTo as `0x${string}`,
    amount: atomicAmount,
    token: 'usdc',
    network: 'base',
  });
  return result.transactionHash;
}

const MAX_RETRIES = 3;
const RETRY_DELAYS = [2_000, 5_000, 10_000];

export async function forwardWithRetry(
  merchantPayTo: string,
  netUsdc: number
): Promise<{ txHash: string | null; error: string | null }> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const txHash = await forwardToMerchant(merchantPayTo, netUsdc);
      return { txHash, error: null };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown';
      console.error(`forward attempt ${attempt + 1}/${MAX_RETRIES} failed: ${msg}`);
      if (attempt < MAX_RETRIES - 1) {
        await new Promise((r) => setTimeout(r, RETRY_DELAYS[attempt]));
      } else {
        return { txHash: null, error: msg };
      }
    }
  }
  return { txHash: null, error: 'max retries exceeded' };
}

export interface SettlementLog {
  depositId: string;
  merchantSlug: string;
  grossAmount: string;
  fee: string;
  feePercent: string;
  netToMerchant: string;
  agentTxHash: string | null;
  merchantTxHash: string | null;
  status: 'settled' | 'forward_failed';
  error?: string;
  requiresManualReview?: boolean;
  timestamp: string;
}

export async function logSettlement(entry: SettlementLog): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  await put(`settlements/${entry.depositId}.json`, JSON.stringify(entry), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}
