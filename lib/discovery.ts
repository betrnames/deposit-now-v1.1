import { PLATFORM_PAY_TO, X402_NETWORK } from '@/lib/x402';

export function discoveryManifest() {
  return {
    name: 'deposit.now',
    version: '2.0.0',
    description:
      'Programmable x402 deposit rail for AI agents — platform and merchant-scoped endpoints on Base mainnet.',
    network: X402_NETWORK,
    platformPayTo: PLATFORM_PAY_TO,
    discovery: {
      openapi: 'https://deposit.now/openapi.json',
      llms: 'https://deposit.now/llms.txt',
      docs: 'https://deposit.now/docs',
      merchantCatalog: 'https://deposit.now/api/merchants',
      bazaar:
        'Indexed automatically by the CDP x402 Bazaar after the first successful mainnet settlement.',
      x402scan: 'https://www.x402scan.com',
      cdpSearch:
        'https://api.cdp.coinbase.com/platform/v2/x402/discovery/search?query=deposit+agent+funding',
    },
    endpoints: [
      {
        type: 'platform',
        url: 'https://deposit.now/api/deposit',
        price: '0.01 USDC',
        description: 'Default platform deposit — settles to deposit.now payTo.',
      },
      {
        type: 'merchant',
        url: 'https://deposit.now/api/merchants/{slug}/deposit',
        price: '0.01 USDC',
        description:
          'Merchant-scoped deposit — USDC settles to merchant payTo. List slugs at /api/merchants.',
      },
    ],
  };
}