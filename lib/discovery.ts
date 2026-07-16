import { PLATFORM_PAY_TO, X402_NETWORK } from '@/lib/x402';

export function discoveryManifest() {
  return {
    name: 'deposit.now',
    version: '3.0.0',
    description:
      'The Funding Layer for AI Agents. Programmable deposits via one x402 call — fund any wallet (including sub-wallets / child agents). No humans required for secondary/agent-to-agent flows.',
    network: X402_NETWORK,
    platformPayTo: PLATFORM_PAY_TO,
    feePercent: 1,
    feeNote: 'Agent pays amount + 1% platform fee; net amount is forwarded to target via CDP.',
    discovery: {
      openapi: 'https://deposit.now/openapi.json',
      llms: 'https://deposit.now/llms.txt',
      llmsFull: 'https://deposit.now/llms-full.txt',
      docs: 'https://deposit.now/docs',
      bazaar:
        'Indexed automatically by the CDP x402 Bazaar after the first successful mainnet settlement.',
      x402scan: 'https://www.x402scan.com',
      cdpSearch:
        'https://api.cdp.coinbase.com/platform/v2/x402/discovery/search?query=deposit+agent+funding',
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
        description:
          'Fund any wallet. Pay gross via x402 to deposit.now; net is forwarded on-chain to target.',
      },
    ],
  };
}
