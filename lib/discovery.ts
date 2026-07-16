import { PLATFORM_PAY_TO, X402_NETWORK } from '@/lib/x402';

export function discoveryManifest() {
  return {
    name: 'deposit.now',
    version: '3.1.0',
    description:
      'Open x402 funding rail: pay amount + 1% over HTTP 402, net forwards to any EVM target. Optional public receipts. Complements Coinbase CDP Fund — does not create wallets or replace CDP Fund/Send.',
    network: X402_NETWORK,
    platformPayTo: PLATFORM_PAY_TO,
    feePercent: 1,
    feeNote: 'Agent pays amount + 1% platform fee; net is forwarded to target after settlement (async; can fail).',
    honestPitch:
      'Use CDP Fund inside Coinbase agent wallets. Use deposit.now for a protocol-shaped deposit to any target without a deposit.now API key.',
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
          target: '0x… EVM address receiving net USDC',
          amount: 'net USDC decimal string (min 0.01)',
          memo: 'optional string',
        },
        price: 'dynamic — amount + 1% platform fee',
        responseNote:
          'status payment_received does not mean funds already arrived at target; check receipt forwardStatus.',
      },
    ],
  };
}
