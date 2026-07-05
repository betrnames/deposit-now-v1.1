/**
 * End-to-end testnet payment against deposit.now (or local dev).
 * Requires: EVM_PRIVATE_KEY for a wallet funded with Base Sepolia USDC.
 * Optional: DEPOSIT_API_URL (default https://deposit.now/api/deposit)
 */
import { x402Client } from '@x402/core/client';
import { wrapFetchWithPayment } from '@x402/fetch';
import { ExactEvmScheme } from '@x402/evm/exact/client';
import { privateKeyToAccount } from 'viem/accounts';

const apiUrl = process.env.DEPOSIT_API_URL ?? 'https://deposit.now/api/deposit';
const key = process.env.EVM_PRIVATE_KEY;
if (!key) {
  console.error('Set EVM_PRIVATE_KEY to a funded Base Sepolia wallet.');
  process.exit(1);
}

const signer = privateKeyToAccount(key);
const client = new x402Client();
client.register('eip155:*', new ExactEvmScheme(signer));
const fetchWithPayment = wrapFetchWithPayment(fetch, client);

console.log(`POST ${apiUrl}`);
const res = await fetchWithPayment(apiUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount: '100.00', account: 'agent-wallet-test' }),
});

const body = await res.json();
console.log('Status:', res.status);
console.log(JSON.stringify(body, null, 2));

let receiptUrl = body.receiptUrl;
if (!receiptUrl) {
  const payResp = res.headers.get('payment-response');
  if (payResp) {
    const settled = JSON.parse(Buffer.from(payResp, 'base64').toString());
    console.warn('receiptUrl missing from body; settlement tx:', settled.transaction);
    console.warn('Check blob receipts or redeploy route.ts payment-signature fix.');
  }
  console.error('No receiptUrl in response.');
  process.exit(1);
}

console.log('\nPolling receipt page for settlement (up to 60s)...');
for (let i = 0; i < 30; i++) {
  const page = await fetch(receiptUrl, { cache: 'no-store' });
  const html = await page.text();
  if (html.includes('Deposit settled')) {
    console.log('Receipt live:', receiptUrl);
    process.exit(0);
  }
  await new Promise((r) => setTimeout(r, 2000));
}

console.log('Payment succeeded but receipt not visible yet — refresh:', receiptUrl);
process.exit(0);