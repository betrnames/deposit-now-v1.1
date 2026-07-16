export interface ComparisonRow {
  feature: string;
  direct: string;
  depositNow: string;
  highlight?: boolean;
}

export const comparisonRows: ComparisonRow[] = [
  {
    feature: 'Verifiable receipt',
    direct: 'Manual tx hash',
    depositNow: 'Automatic public receipt',
    highlight: true,
  },
  {
    feature: 'Sub-agent funding',
    direct: 'Custom multi-sig / scripts',
    depositNow: 'One POST with any target address',
    highlight: true,
  },
  {
    feature: 'Agent SDK integration',
    direct: 'Custom code',
    depositNow: 'One-line x402 client',
  },
  {
    feature: 'Human in the loop',
    direct: 'Often required',
    depositNow: 'No humans for agent-to-agent',
    highlight: true,
  },
  {
    feature: 'Reliability / retries',
    direct: 'You build it',
    depositNow: 'Built-in settlement + forward retry',
  },
];

export interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  monthly: string;
  fee: string;
  features: string[];
  cta: string;
  ctaHref: string;
  featured?: boolean;
}

export const pricingTiers: PricingTier[] = [
  {
    id: 'agent',
    name: 'Agent deposits',
    tagline: 'Pay as you fund',
    monthly: '$0',
    fee: '1% per deposit',
    features: [
      'POST /api/deposit — any target wallet',
      'Parent → child / sub-agent funding',
      'x402 exact scheme on Base',
      'Public verifiable receipts',
      'No accounts or API keys for agents',
    ],
    cta: 'Read the docs',
    ctaHref: '/docs',
    featured: true,
  },
];

export const agentRailNote =
  'Agents declare a net amount and target wallet. They pay amount + 1% via x402 to deposit.now; the platform retains the fee and forwards net USDC to target via Coinbase CDP.';

export const whyDepositNowPoints = [
  {
    title: 'Fund any wallet',
    body: 'Parent agents fund child agents, sub-wallets, or any EVM address with one x402 call.',
  },
  {
    title: 'No humans required',
    body: 'Secondary / agent-to-agent flows settle programmatically — no accounts, no dashboards.',
  },
  {
    title: 'Verifiable receipts',
    body: 'Every deposit gets a public receipt with payment + forward transaction proof.',
  },
  {
    title: 'Simple fee',
    body: 'Flat 1% platform fee. No merchant tiers, no prepaid balances, no renewals.',
  },
  {
    title: 'CDP-secured hot wallet',
    body: 'Platform settlement uses Coinbase Agentic Wallet (CDP) — no raw private keys in app config.',
  },
];

export const whyDepositNowTagline =
  'Direct transfers are raw plumbing. deposit.now is the programmable funding layer for AI agents.';
