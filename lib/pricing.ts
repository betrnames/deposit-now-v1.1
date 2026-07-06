export interface ComparisonRow {
  feature: string;
  direct: string;
  depositNow: string;
  highlight?: boolean;
}

export const comparisonRows: ComparisonRow[] = [
  {
    feature: 'Verifiable Receipt',
    direct: 'Manual tx hash',
    depositNow: 'Automatic public receipt',
    highlight: true,
  },
  {
    feature: 'Merchant Webhooks',
    direct: 'None',
    depositNow: 'Automatic deposit.settled',
    highlight: true,
  },
  {
    feature: 'Merchant Discovery',
    direct: 'Hardcoded addresses',
    depositNow: 'Public catalog + Bazaar',
    highlight: true,
  },
  {
    feature: 'Agent SDK Integration',
    direct: 'Custom code',
    depositNow: 'One-line x402 client',
  },
  {
    feature: 'Reliability / Retries',
    direct: 'You build it',
    depositNow: 'Built-in + idempotency',
  },
];

export interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  monthly: string;
  settlementFee: string;
  agentRail: string;
  endpoints: string;
  webhooks: string;
  automation: string;
  discovery: string;
  revenueShare: string;
  cta: string;
  ctaHref: string;
  featured?: boolean;
}

export const agentRailNote =
  'Agents pay 0.01 USDC per x402 call on every deposit — covers facilitator settlement, receipt storage, and discovery indexing. Merchants never block agent access with account gates.';

export const pricingTiers: PricingTier[] = [
  {
    id: 'catalog',
    name: 'Catalog',
    tagline: 'List once, get discovered',
    monthly: '$0',
    settlementFee: '0.30% per settled deposit',
    agentRail: '0.01 USDC / call (agent-paid)',
    endpoints: '1 merchant endpoint',
    webhooks: '—',
    automation: 'Public receipt pages only',
    discovery: 'Merchant catalog + OpenAPI',
    revenueShare: '—',
    cta: 'Join waitlist',
    ctaHref: '/#waitlist',
  },
  {
    id: 'rail',
    name: 'Rail',
    tagline: 'Production webhooks + automation',
    monthly: '$49 / mo',
    settlementFee: '0.15% per settled deposit',
    agentRail: '0.01 USDC / call (agent-paid)',
    endpoints: 'Up to 5 endpoints',
    webhooks: 'deposit.settled — 10k deliveries / mo included',
    automation: 'Retries, idempotency keys, HMAC signing',
    discovery: 'Bazaar extension + priority catalog',
    revenueShare: '5% on referred agent first deposit',
    cta: 'Get started',
    ctaHref: 'mailto:support@deposit.now?subject=deposit.now%20Rail%20tier',
    featured: true,
  },
  {
    id: 'network',
    name: 'Network',
    tagline: 'Volume rails at scale',
    monthly: 'Custom',
    settlementFee: '0.05–0.10% at volume',
    agentRail: '0.01 USDC / call (agent-paid)',
    endpoints: 'Unlimited endpoints',
    webhooks: 'Unlimited + custom payloads',
    automation: 'Dedicated retry policy, MCP priority, SLA',
    discovery: 'Co-marketed Bazaar placement + lead routing',
    revenueShare: 'Custom rev-share on agent referrals',
    cta: 'Talk to us',
    ctaHref: 'mailto:support@deposit.now?subject=deposit.now%20Network%20tier',
  },
];

export const whyDepositNowPoints = [
  {
    title: 'Verifiable receipts',
    body: 'Agents get instant verifiable receipts + public proof — not just a tx hash.',
  },
  {
    title: 'Merchant webhooks',
    body: 'Merchants get automatic webhooks to trigger real business logic (credit account, ship order, unlock service).',
  },
  {
    title: 'Bazaar discovery',
    body: 'Full Bazaar discovery — agents can find merchants without hardcoding addresses.',
  },
  {
    title: 'Machine-first flow',
    body: 'Standardized, machine-first flow with error handling, retries, and MCP tools.',
  },
  {
    title: 'Non-custodial + atomic',
    body: 'Non-custodial + atomic — pay → deposit → webhook in one reliable flow.',
  },
];

export const whyDepositNowTagline =
  'Direct transfers are raw plumbing. deposit.now is the production rail for agent-to-merchant commerce.';