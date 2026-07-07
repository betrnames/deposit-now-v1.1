/**
 * Daily deposit monitor — lists new settled receipts from Vercel Blob
 * and confirms production is advertising Base mainnet.
 *
 * Usage (from project root):
 *   npm run watch:deposits
 *
 * Requires BLOB_READ_WRITE_TOKEN in .env.local (vercel env pull / link).
 */
import fs from 'fs';
import { list } from '@vercel/blob';

function explorerTxUrl(network, txHash) {
  if (!txHash) return null;
  if (network === 'eip155:8453') return `https://basescan.org/tx/${txHash}`;
  if (network === 'eip155:84532') return `https://sepolia.basescan.org/tx/${txHash}`;
  return null;
}

function networkLabel(network) {
  if (network === 'eip155:8453') return 'Base mainnet';
  if (network === 'eip155:84532') return 'Base Sepolia (testnet)';
  return network ?? 'unknown';
}

const STATE_PATH = '.deposit-watch-state.json';
const PRODUCTION_DEPOSIT = 'https://deposit.now/api/deposit';

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

const showAll = process.argv.includes('--all');
const reset = process.argv.includes('--reset');

if (reset && fs.existsSync(STATE_PATH)) {
  fs.unlinkSync(STATE_PATH);
  console.log('Cleared watch state.');
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('Missing BLOB_READ_WRITE_TOKEN in .env.local');
  console.error('Run: vercel env pull .env.local  (or link project and pull development env)');
  process.exit(1);
}

async function probeProduction() {
  const res = await fetch(PRODUCTION_DEPOSIT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: '100.00', account: 'watch-probe' }),
  });
  const pr = res.headers.get('payment-required') || res.headers.get('Payment-Required');
  const decoded = pr ? JSON.parse(Buffer.from(pr, 'base64').toString()) : null;
  const accept = decoded?.accepts?.[0];
  return {
    status: res.status,
    network: accept?.network ?? null,
    asset: accept?.asset ?? null,
    amount: accept?.amount ?? null,
    payTo: accept?.payTo ?? null,
  };
}

async function listAllReceiptBlobs() {
  const blobs = [];
  let cursor;
  do {
    const page = await list({
      prefix: 'receipts/',
      limit: 1000,
      cursor,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return blobs;
}

async function loadReceiptFromBlob(pathname) {
  const match = await list({ prefix: pathname, limit: 1, token: process.env.BLOB_READ_WRITE_TOKEN });
  const item = match.blobs[0];
  if (!item) return null;
  const raw = await fetch(item.downloadUrl, { cache: 'no-store' });
  if (!raw.ok) return null;
  return JSON.parse(await raw.text());
}

function loadState() {
  if (!fs.existsSync(STATE_PATH)) return { seenIds: [], lastChecked: null };
  return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
}

function saveState(seenIds) {
  fs.writeFileSync(
    STATE_PATH,
    JSON.stringify({ seenIds, lastChecked: new Date().toISOString() }, null, 2)
  );
}

function formatReceipt(r) {
  const net = networkLabel(r.network);
  const isMainnet = r.network === 'eip155:8453';
  const tx = explorerTxUrl(r.network, r.txHash);
  const lines = [
    `${isMainnet ? '[MAINNET]' : '[testnet]'} ${r.id}`,
    `  settled:  ${r.settledAt}`,
    `  payer:    ${r.payer ?? '—'}`,
    `  paid:     ${r.amountUsdc ?? '?'} USDC on ${net}`,
    `  intent:   ${r.depositAmount ?? '—'} → account ${r.account ?? '—'}`,
    `  receipt:  https://deposit.now/receipt/${r.id}`,
  ];
  if (tx) lines.push(`  tx:       ${tx}`);
  return lines.join('\n');
}

console.log(`deposit.now watch — ${new Date().toLocaleString()}\n`);

const prod = await probeProduction();
const mainnetLive = prod.network === 'eip155:8453';
console.log('Production API');
console.log(`  ${PRODUCTION_DEPOSIT} → HTTP ${prod.status}`);
console.log(`  network: ${prod.network ?? 'unknown'} ${mainnetLive ? '(mainnet live)' : '(NOT mainnet — check CDP keys)'}`);
console.log(`  price:   ${prod.amount ? Number(prod.amount) / 1e6 : '?'} USDC`);
console.log(`  payTo:   ${prod.payTo ?? '—'}\n`);

const blobs = await listAllReceiptBlobs();
const receipts = [];
for (const blob of blobs) {
  if (!blob.pathname.endsWith('.json')) continue;
  const receipt = await loadReceiptFromBlob(blob.pathname);
  if (receipt) receipts.push(receipt);
}

receipts.sort((a, b) => String(b.settledAt).localeCompare(String(a.settledAt)));

const mainnet = receipts.filter((r) => r.network === 'eip155:8453');
const testnet = receipts.filter((r) => r.network === 'eip155:84532');

console.log('Receipts in Blob store');
console.log(`  total:    ${receipts.length}`);
console.log(`  mainnet:  ${mainnet.length}`);
console.log(`  testnet:  ${testnet.length}\n`);

const state = loadState();
const seen = new Set(state.seenIds);
const currentIds = receipts.map((r) => r.id);
const newReceipts = receipts.filter((r) => !seen.has(r.id));
const newMainnet = newReceipts.filter((r) => r.network === 'eip155:8453');

if (state.seenIds.length === 0 && !showAll) {
  saveState(currentIds);
  console.log('First run — baseline saved. Run again later to see new deposits only.');
  if (mainnet.length > 0) {
    console.log('\nExisting mainnet receipts:');
    for (const r of mainnet.slice(0, 10)) console.log(formatReceipt(r) + '\n');
  } else {
    console.log('\nNo mainnet settlements yet. Waiting for an agent with Base USDC.');
  }
  process.exit(0);
}

if (newReceipts.length === 0) {
  console.log('No new deposits since last check.');
  if (mainnet.length === 0) {
    console.log('Still waiting for first mainnet payment.');
  }
} else {
  console.log(`${newReceipts.length} new deposit(s) since last check:`);
  if (newMainnet.length > 0) {
    console.log(`  ${newMainnet.length} on MAINNET\n`);
  }
  for (const r of newReceipts) {
    console.log(formatReceipt(r) + '\n');
  }
}

if (showAll && receipts.length > 0) {
  console.log('--- all receipts (newest first) ---\n');
  for (const r of receipts) console.log(formatReceipt(r) + '\n');
}

saveState(currentIds);

if (newMainnet.length > 0) {
  console.log('Mainnet activity detected.');
  process.exit(0);
}