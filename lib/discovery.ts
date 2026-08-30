import { PRODUCT } from '@/lib/product-copy';
import {
  PLATFORM_FEE_MAX_USDC,
  PLATFORM_FEE_MIN_USDC,
  PLATFORM_FEE_PERCENT,
} from '@/lib/billing';
import { PLATFORM_PAY_TO, SOLANA_NETWORK, X402_NETWORK } from '@/lib/x402';

export function discoveryManifest() {
  return {
    name: PRODUCT.name,
    version: '3.4.0',
    description: PRODUCT.apiDescription,
    tagline: PRODUCT.tagline,
    network: X402_NETWORK,
    networks: [
      { caip2: X402_NETWORK, label: 'base', asset: 'USDC' },
      { caip2: SOLANA_NETWORK, label: 'solana', asset: 'USDC' },
    ],
    platformPayTo: PLATFORM_PAY_TO,
    feePercent: PLATFORM_FEE_PERCENT,
    feeMinUsdc: PLATFORM_FEE_MIN_USDC,
    feeMaxUsdc: PLATFORM_FEE_MAX_USDC,
    feeNote: PRODUCT.feeNote,
    honestPitch: PRODUCT.cdpVsDeposit,
    managedChildren: PRODUCT.managedChildren,
    paymentNote: PRODUCT.paymentReceivedHonesty,
    discovery: {
      openapi: 'https://deposit.now/openapi.json',
      llms: 'https://deposit.now/llms.txt',
      llmsFull: 'https://deposit.now/llms-full.txt',
      docs: 'https://deposit.now/docs',
      bazaar:
        'Indexed automatically by the CDP x402 Bazaar after the first successful mainnet settlement.',
      x402scan: 'https://www.x402scan.com',
    },
    endpoints: [
      {
        type: 'platform',
        method: 'POST',
        url: 'https://deposit.now/api/deposit',
        body: {
          target: '0x… Base or Solana address receiving net USDC (omit when provision: true)',
          amount: 'net USDC decimal string (min 0.01)',
          memo: 'optional string',
          provision: 'optional boolean — create/resolve managed child wallet',
          label: 'required with provision unless Idempotency-Key header (stable child id)',
        },
        price: `dynamic — ${PRODUCT.feeGrossPhrase}`,
        responseNote: PRODUCT.paymentReceivedHonesty,
      },
    ],
  };
}
