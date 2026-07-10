import { createHmac } from 'crypto';
import { resolve as dnsResolve } from 'dns/promises';
import type { Merchant } from '@/lib/merchants';
import type { DepositReceipt } from '@/lib/receipts';

const PRIVATE_IP_RE =
  /^(127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.|0\.|::1$|fc|fd|fe80)/;

async function isPrivateUrl(urlString: string): Promise<boolean> {
  try {
    const parsed = new URL(urlString);
    const hostname = parsed.hostname.replace(/^\[|\]$/g, '');

    if (
      hostname === 'localhost' ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      PRIVATE_IP_RE.test(hostname)
    ) {
      return true;
    }

    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return true;
    }

    const addresses = await dnsResolve(hostname).catch(() => [hostname]);
    return addresses.some((addr) => PRIVATE_IP_RE.test(addr));
  } catch {
    return true;
  }
}

export interface WebhookDepositPayload {
  event: 'deposit.settled';
  merchant: {
    slug: string;
    name: string;
    payTo: string;
  };
  deposit: {
    amount: string | null;
    account: string | null;
  };
  receipt: {
    id: string;
    url: string;
    payer: string | null;
    amountUsdc: string | null;
    txHash: string | null;
    network: string | null;
    settledAt: string;
  };
  grossAmount: string | null;
  fee: string | null;
  feePercent: string | null;
  netAmount: string | null;
  currency: string;
  transactions: {
    agentToPlatform: string | null;
    platformToMerchant: string | null;
  };
  timestamp: string;
}

export function buildWebhookPayload(
  merchant: Merchant,
  receipt: DepositReceipt,
  deposit: { amount: string | null; account: string | null }
): WebhookDepositPayload {
  return {
    event: 'deposit.settled',
    merchant: {
      slug: merchant.slug,
      name: merchant.name,
      payTo: merchant.payTo,
    },
    deposit,
    receipt: {
      id: receipt.id,
      url: `https://deposit.now/receipt/${receipt.id}`,
      payer: receipt.payer,
      amountUsdc: receipt.amountUsdc,
      txHash: receipt.txHash,
      network: receipt.network,
      settledAt: receipt.settledAt,
    },
    grossAmount: receipt.grossAmount ?? receipt.amountUsdc ?? null,
    fee: receipt.fee ?? null,
    feePercent: receipt.feePercent ?? null,
    netAmount: receipt.netToMerchant ?? null,
    currency: 'USDC',
    transactions: {
      agentToPlatform: receipt.txHash ?? null,
      platformToMerchant: receipt.forwardTxHash ?? null,
    },
    timestamp: new Date().toISOString(),
  };
}

function signPayload(secret: string, body: string): string {
  return createHmac('sha256', secret).update(body).digest('hex');
}

export async function deliverMerchantWebhook(
  merchant: Merchant,
  payload: WebhookDepositPayload
): Promise<boolean> {
  if (!merchant.webhookUrl) return false;

  if (await isPrivateUrl(merchant.webhookUrl)) {
    console.error(`webhook blocked for ${merchant.slug}: URL resolves to private address`);
    return false;
  }

  const body = JSON.stringify(payload);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'deposit.now-webhooks/1.0',
    'X-Deposit-Now-Event': payload.event,
  };

  if (merchant.webhookSecret) {
    headers['X-Deposit-Now-Signature'] = signPayload(merchant.webhookSecret, body);
  }

  try {
    const res = await fetch(merchant.webhookUrl, {
      method: 'POST',
      headers,
      body,
      redirect: 'error',
      signal: AbortSignal.timeout(10_000),
    });
    return res.ok;
  } catch (error) {
    console.error(`webhook delivery failed for ${merchant.slug}:`, error instanceof Error ? error.message : 'unknown');
    return false;
  }
}