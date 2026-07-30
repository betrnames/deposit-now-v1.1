import { PRODUCT } from '@/lib/product-copy';
import { PLATFORM_PAY_TO, X402_NETWORK } from '@/lib/x402';

export function discoveryManifest() {
  return {
    name: PRODUCT.name,
    version: '3.2.0',
    description: PRODUCT.apiDescription,
    tagline: PRODUCT.tagline,
    network: X402_NETWORK,
    platformPayTo: PLATFORM_PAY_TO,
    feePercent: 1,
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
          target: '0x… EVM address receiving net USDC (omit when provision: true)',
          amount: 'net USDC decimal string (min 0.01)',
          memo: 'optional string',
          provision: 'optional boolean — create/resolve managed child wallet',
          label: 'required with provision unless Idempotency-Key header (stable child id)',
        },
        price: 'dynamic — amount + 1% platform fee',
        responseNote: PRODUCT.paymentReceivedHonesty,
      },
    ],
  };
}
