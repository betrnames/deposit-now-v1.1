import { CdpClient } from '@coinbase/cdp-sdk';
import { put } from '@vercel/blob';

/**
 * Coinbase Developer Platform (CDP) Agentic / Server Wallet only.
 * Never store raw EVM private keys for the platform hot wallet.
 * Secrets: CDP_API_KEY_ID, CDP_API_KEY_SECRET, CDP_WALLET_SECRET (platform env).
 */

let _cdp: CdpClient | null = null;

function getCdpClient(): CdpClient {
  if (!_cdp) {
    if (!process.env.CDP_API_KEY_ID || !process.env.CDP_API_KEY_SECRET) {
      throw new Error('CDP credentials required for settlement forwarding');
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

async function forwardToTarget(target: string, netUsdc: number): Promise<string> {
  const account = await getPlatformAccount();
  const atomicAmount = BigInt(Math.round(netUsdc * 1e6));
  const result = await account.transfer({
    to: target as `0x${string}`,
    amount: atomicAmount,
    token: 'usdc',
    network: 'base',
  });
  return result.transactionHash;
}

const MAX_RETRIES = 3;
/** Exponential backoff: 2s, 4s, 8s between attempts */
const RETRY_DELAYS_MS = [2_000, 4_000, 8_000];

export async function forwardWithRetry(
  target: string,
  netUsdc: number
): Promise<{ txHash: string | null; error: string | null; attempts: number }> {
  let lastError = 'max retries exceeded';
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const txHash = await forwardToTarget(target, netUsdc);
      return { txHash, error: null, attempts: attempt + 1 };
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'unknown';
      console.error(`forward attempt ${attempt + 1}/${MAX_RETRIES} failed: ${lastError}`);
      if (attempt < MAX_RETRIES - 1) {
        await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt]));
      }
    }
  }
  return { txHash: null, error: lastError, attempts: MAX_RETRIES };
}

export interface SettlementLog {
  depositId: string;
  target: string;
  memo: string | null;
  grossAmount: string;
  fee: string;
  feePercent: string;
  netToTarget: string;
  agentTxHash: string | null;
  forwardTxHash: string | null;
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
