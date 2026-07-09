import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation',
  description:
    'x402 API documentation for deposit.now — dynamic deposit amounts, USDC on Base mainnet, agent quickstart, code examples, and merchant billing.',
  alternates: { canonical: 'https://deposit.now/docs' },
  openGraph: {
    title: 'API Documentation | Deposit Now',
    description:
      'x402 API documentation — agents deposit any amount of USDC autonomously on Base mainnet. No accounts, no API keys.',
    url: 'https://deposit.now/docs',
    siteName: 'Deposit Now',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'API Documentation | Deposit Now',
    description:
      'x402 API for autonomous USDC deposits on Base mainnet — dynamic pricing, merchant webhooks, and Bazaar discovery.',
  },
  robots: { index: true, follow: true },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
