/**
 * Request Base Sepolia ETH for gas via CDP Faucet API.
 * Loads CDP_API_KEY_ID / CDP_API_KEY_SECRET from .env.faucet.tmp (vercel env pull).
 */
import fs from 'fs';
import { CdpClient } from '@coinbase/cdp-sdk';
import { privateKeyToAccount } from 'viem/accounts';

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

loadEnvFile('.env.faucet.tmp');

const key = process.env.EVM_PRIVATE_KEY;
if (!key) {
  console.error('Set EVM_PRIVATE_KEY (test wallet private key).');
  process.exit(1);
}

if (!process.env.CDP_API_KEY_ID || !process.env.CDP_API_KEY_SECRET) {
  console.error('Missing CDP_API_KEY_ID / CDP_API_KEY_SECRET. Run: vercel env pull .env.faucet.tmp --environment=production');
  process.exit(1);
}

const address = privateKeyToAccount(key).address;
const cdp = new CdpClient();

console.log('Requesting Base Sepolia ETH for', address);
const resp = await cdp.evm.requestFaucet({
  address,
  network: 'base-sepolia',
  token: 'eth',
});

console.log('Faucet tx:', `https://sepolia.basescan.org/tx/${resp.transactionHash}`);