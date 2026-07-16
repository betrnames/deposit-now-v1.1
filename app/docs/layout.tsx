import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation',
  description:
    'Open x402 funding rail docs — POST target + amount, pay amount + 1%, async forward, honest payment_received status.',
  alternates: { canonical: 'https://deposit.now/docs' },
  openGraph: {
    title: 'API Documentation | deposit.now',
    description:
      'x402 deposit API: pay amount + 1%, net to any EVM target. Complements Coinbase CDP Fund.',
    url: 'https://deposit.now/docs',
    siteName: 'deposit.now',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'API Documentation | deposit.now',
    description: 'Open x402 funding rail — payment_received vs forwardStatus explained.',
  },
  robots: { index: true, follow: true },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
