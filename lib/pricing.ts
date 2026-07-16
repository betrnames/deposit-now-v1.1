export interface ComparisonRow {
  feature: string;
  direct: string;
  cdpFund: string;
  depositNow: string;
  highlight?: boolean;
}

/**
 * Honest three-way compare.
 * Coinbase CDP / Agentic Wallets already include Fund + Send — we do not claim exclusivity.
 */
export const comparisonRows: ComparisonRow[] = [
  {
    feature: 'Fund a wallet',
    direct: 'You craft the transfer',
    cdpFund: 'Yes — Fund / Send skills & APIs',
    depositNow: 'Yes — x402 pay, then forward to target',
    highlight: true,
  },
  {
    feature: 'Payer integration',
    direct: 'Wallet + chain code',
    cdpFund: 'CDP credentials / AgentKit stack',
    depositNow: 'Any x402 client (no deposit.now API key)',
    highlight: true,
  },
  {
    feature: 'Target wallet',
    direct: 'Any address you control sending to',
    cdpFund: 'Best inside CDP wallet stack',
    depositNow: 'Any EVM address you pass as target',
  },
  {
    feature: 'Public receipt page',
    direct: 'No (tx hash only)',
    cdpFund: 'Your own logs / explorer',
    depositNow: 'Optional public /receipt/{id} when storage is configured',
    highlight: true,
  },
  {
    feature: 'Protocol shape',
    direct: 'Raw on-chain',
    cdpFund: 'CDP + x402 in their product',
    depositNow: 'HTTP 402 + open API + llms.txt',
  },
  {
    feature: 'Fee model',
    direct: 'Gas only',
    cdpFund: 'CDP / product pricing',
    depositNow: '1% platform fee on net amount',
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
    name: 'x402 deposits',
    tagline: 'Pay-as-you-fund rail',
    monthly: '$0',
    fee: '1% per deposit',
    features: [
      'POST /api/deposit with target + amount',
      'Pay gross (amount + 1%) via x402',
      'Net forwarded to target after settlement',
      'Public receipt when Blob storage is configured',
      'No deposit.now account for paying agents',
    ],
    cta: 'Read the docs',
    ctaHref: '/docs',
    featured: true,
  },
];

export const agentRailNote =
  'deposit.now is an open x402 funding rail: declare a target address and net amount, pay amount + 1% over HTTP 402, and the platform forwards net USDC on Base. It does not replace Coinbase Fund/Send inside CDP — it is for payers that want a protocol-shaped deposit call to any EVM target.';

export const whyDepositNowPoints = [
  {
    title: 'Open x402 deposit call',
    body: 'Any agent with an x402 client can POST target + amount and pay over HTTP 402 — no deposit.now API key.',
  },
  {
    title: 'Any EVM target',
    body: 'Forward net funds to whatever address you pass — CDP wallets, EOAs, or another agent’s address. (Creating wallets is out of scope; pass a target you already have.)',
  },
  {
    title: 'Public receipts (when configured)',
    body: 'Settlements can write a public receipt with payer, target, fee, and Basescan links. Requires storage env; forward is async and can fail.',
  },
  {
    title: 'Simple fee',
    body: 'Flat 1% of the net amount, paid as part of the x402 gross. No merchant tiers.',
  },
  {
    title: 'Honest fit vs CDP Fund',
    body: 'If you already run fully on Coinbase Agentic / Server Wallets, use their Fund skill. Use deposit.now when you want an open x402 rail + receipt URL outside that stack.',
  },
];

export const whyDepositNowTagline =
  'deposit.now is an open x402 funding rail with optional public receipts — not a replacement for Coinbase wallet creation or CDP Fund.';

export const honestPitch =
  'An open x402 funding rail: pay amount + 1% over HTTP 402, net forwards to any EVM target, optional public receipt. Coinbase already funds wallets inside CDP; this is for protocol-shaped deposits without a deposit.now API key.';
