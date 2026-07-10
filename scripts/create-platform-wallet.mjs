/**
 * One-time setup: create (or retrieve) the CDP Server Wallet v2
 * that becomes the deposit.now platform wallet.
 *
 * Usage: node scripts/create-platform-wallet.mjs
 * Requires: CDP_API_KEY_ID, CDP_API_KEY_SECRET in .env.local
 */
import fs from 'fs';
import { CdpClient } from '@coinbase/cdp-sdk';

function loadEnvFile(path) {
  if (!fs.existsSync(path)) return;
  for (const line of fs.readFileSync(path, 'utf8').split(/\r?\n/)) {
    if (!line || line.startsWith('#')) continue;
    const i = line.indexOf('=');
    if (i === -1) continue;
    const key = line.slice(0, i);
    let val = line.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvFile('.env.local');

if (!process.env.CDP_API_KEY_ID || !process.env.CDP_API_KEY_SECRET) {
  console.error('Missing CDP_API_KEY_ID / CDP_API_KEY_SECRET in .env.local');
  process.exit(1);
}

const cdp = new CdpClient({
  apiKeyId: process.env.CDP_API_KEY_ID,
  apiKeySecret: process.env.CDP_API_KEY_SECRET,
  walletSecret: process.env.CDP_WALLET_SECRET,
});

console.log('Creating/retrieving CDP platform wallet...\n');
const account = await cdp.evm.getOrCreateAccount({ name: 'deposit-now-platform' });

console.log('CDP Platform Wallet');
console.log('  Address:', account.address);
console.log('  Name:    deposit-now-platform');
console.log('');
console.log('Add to .env.local:');
console.log(`  CDP_PLATFORM_ADDRESS=${account.address}`);
console.log('');
console.log('Then redeploy. All deposits route through this wallet.');
console.log('Old Account 5 (0x3f7a25Dc...) is no longer in the settlement flow.');
