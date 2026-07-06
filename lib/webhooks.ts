import { createHmac } from 'crypto';
import type { Merchant } from '@/lib/merchants';
import type { DepositReceipt } from '@/lib/receipts';

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
      signal: AbortSignal.timeout(10_000),
    });
    return res.ok;
  } catch (error) {
    console.error(`webhook delivery failed for ${merchant.slug}:`, error);
    return false;
  }
}