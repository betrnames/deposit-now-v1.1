import type { Metadata } from 'next';
import { GuidePage } from '@/components/GuidePage';
import { MerchantPricing } from '@/components/MerchantPricing';
import { pageGraph } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Merchant pricing for deposit.now: usage-based settlement fees, webhook automation, Bazaar discovery, and referral revenue share.',
  alternates: { canonical: 'https://deposit.now/pricing' },
  keywords: [
    'deposit.now pricing',
    'x402 merchant fees',
    'agent payment rail',
    'webhook automation',
    'revenue share',
  ],
  openGraph: {
    title: 'Pricing',
    description: 'Usage-based merchant tiers with settlement fees, automation, and rev-share.',
    url: 'https://deposit.now/pricing',
    siteName: 'Deposit Now',
  },
  robots: { index: true, follow: true },
};

const jsonLd = pageGraph(
  {
    '@type': 'WebPage',
    name: 'deposit.now Merchant Pricing',
    description:
      'Catalog, Rail, and Network tiers for merchant deposit endpoints with usage-based settlement fees and automation.',
    url: 'https://deposit.now/pricing',
  },
  '/pricing',
  'Pricing'
);

const nav = [
  { id: 'overview', label: 'Overview' },
  { id: 'catalog', label: 'Catalog' },
  { id: 'rail', label: 'Rail' },
  { id: 'network', label: 'Network' },
  { id: 'billing-automation', label: 'Billing' },
  { id: 'revenue-share', label: 'Charges' },
];

export default function PricingPage() {
  return (
    <GuidePage
      kicker="Merchants"
      title="Merchant Pricing"
      subtitle="On-chain USDC billing via x402 — no invoices. Agents pay the rail; merchants top up and renew automatically."
      nav={nav}
      jsonLd={jsonLd}
      wideContent
    >
      <MerchantPricing />
    </GuidePage>
  );
}