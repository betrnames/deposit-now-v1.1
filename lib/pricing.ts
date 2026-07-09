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
  monthlyBilling: 'automated' | 'free' | 'manual';
  settlementFee: string;
  settlementBilling: 'automated' | 'free';
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

export interface BillingAutomationRow {
  charge: string;
  whoPays: string;
  howCollected: string;
  mode: 'automated' | 'manual';
}

export const billingAutomationRows: BillingAutomationRow[] = [
  {
    charge: 'Deposit',
    whoPays: 'Agent',
    howCollected: 'Agent pays the full deposit amount via x402 — USDC settles directly to your merchant wallet',
    mode: 'automated',
  },
  {
    charge: 'Settlement fee',
    whoPays: 'Merchant',
    howCollected:
      'Debited from prepaid USDC balance after each settled deposit — top up via the top-up endpoint',
    mode: 'automated',
  },
  {
    charge: 'Rail monthly',
    whoPays: 'Merchant',
    howCollected: '49 USDC via x402 renew endpoint — extends Rail tier 30 days per payment',
    mode: 'automated',
  },
  {
    charge: 'Network tier',
    whoPays: 'Merchant',
    howCollected: 'Custom terms — one-time onboarding call, then on-chain renew + top-up',
    mode: 'manual',
  },
];

export const agentRailNote =
  'Agents pay the declared deposit amount via x402 — USDC settles directly to the merchant wallet on-chain. Merchants pay a settlement fee from their prepaid balance. No per-call platform toll, no invoices.';

export const pricingTiers: PricingTier[] = [
  {
    id: 'catalog',
    name: 'Catalog',
    tagline: 'List once, get discovered',
    monthly: '$0',
    monthlyBilling: 'free',
    settlementFee: '0.30% per settled deposit',
    settlementBilling: 'automated',
    agentRail: 'Agent pays deposit amount via x402',
    endpoints: '1 merchant endpoint',
    webhooks: '—',
    automation: 'Public receipt pages only',
    discovery: 'Merchant catalog + OpenAPI',
    revenueShare: '—',
    cta: 'Get started',
    ctaHref: '/docs',
  },
  {
    id: 'rail',
    name: 'Rail',
    tagline: 'Production webhooks + automation',
    monthly: '$49 / mo',
    monthlyBilling: 'automated',
    settlementFee: '0.15% per settled deposit',
    settlementBilling: 'automated',
    agentRail: 'Agent pays deposit amount via x402',
    endpoints: 'Up to 5 endpoints',
    webhooks: 'deposit.settled — 10k deliveries / mo included',
    automation: 'Retries, idempotency keys, HMAC signing',
    discovery: 'Bazaar extension + priority catalog',
    revenueShare: '5% on referred agent first deposit',
    cta: 'View billing API',
    ctaHref: '/docs#billing',
    featured: true,
  },
  {
    id: 'network',
    name: 'Network',
    tagline: 'Volume rails at scale',
    monthly: 'Custom',
    monthlyBilling: 'manual',
    settlementFee: '0.05–0.10% at volume',
    settlementBilling: 'automated',
    agentRail: 'Agent pays deposit amount via x402',
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