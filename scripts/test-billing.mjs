#!/usr/bin/env node
/** Tiny check that fee = clamp(net * 25bps, $0.001, $0.25). Run: node --experimental-strip-types scripts/test-billing.mjs */

import {
  calculateDepositSplit,
  PLATFORM_FEE_BPS,
  PLATFORM_FEE_MAX_USDC,
  PLATFORM_FEE_MIN_USDC,
  PLATFORM_FEE_PERCENT,
} from '../lib/billing.ts';

const cases = [
  { net: 0.01, fee: 0.001, gross: 0.011 },
  { net: 0.32, fee: 0.001, gross: 0.321 },
  { net: 0.4, fee: 0.001, gross: 0.401 },
  { net: 50, fee: 0.125, gross: 50.125 },
  { net: 100, fee: 0.25, gross: 100.25 },
  { net: 1000, fee: 0.25, gross: 1000.25 },
];

let failed = 0;
if (PLATFORM_FEE_BPS !== 25 || PLATFORM_FEE_PERCENT !== 0.25) {
  console.error('bps/percent mismatch', PLATFORM_FEE_BPS, PLATFORM_FEE_PERCENT);
  failed++;
}
if (PLATFORM_FEE_MIN_USDC !== 0.001 || PLATFORM_FEE_MAX_USDC !== 0.25) {
  console.error('min/max mismatch');
  failed++;
}

for (const c of cases) {
  const split = calculateDepositSplit(c.net);
  if (!split || split.fee !== c.fee || split.gross !== c.gross) {
    console.error('FAIL', c, split);
    failed++;
  } else if (split.fee > 0.25) {
    console.error('fee over cap', split);
    failed++;
  } else {
    console.log('ok', c.net, '→ fee', split.fee, 'gross', split.gross);
  }
}

if (failed) {
  process.exit(1);
}
console.log('billing clamp ok');
