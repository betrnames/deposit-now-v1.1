import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation',
  description:
    'x402 deposit API for AI agents — fund any wallet with one call. amount + 1% fee, Base mainnet, sub-agent funding.',
  alternates: { canonical: 'https://deposit.now/docs' },
  openGraph: {
    title: 'API Documentation | deposit.now',
    description:
      'Programmable deposits via one x402 call — fund any wallet including child agents.',
    url: 'https://deposit.now/docs',
    siteName: 'deposit.now',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'API Documentation | deposit.now',
    description:
      'AI agent funding layer — POST /api/deposit, pay via x402, net forwards to target.',
  },
  robots: { index: true, follow: true },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
