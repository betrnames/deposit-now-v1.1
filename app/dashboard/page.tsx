import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { SiteFooter } from '@/components/SiteFooter';
import { DashboardContent } from '@/components/DashboardContent';
import { pageGraph } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Facilitator Dashboard',
  description:
    'Compare x402 facilitators by fee, chain, token support, and status. Find the best facilitator for your x402 payment integration.',
  alternates: { canonical: 'https://deposit.now/dashboard' },
  keywords: [
    'x402 facilitator',
    'facilitator comparison',
    'x402 fees',
    'payment routing',
    'Base',
    'USDC',
    'agent payments',
  ],
  openGraph: {
    title: 'Facilitator Dashboard',
    description:
      'Compare x402 facilitators side by side — fees, chains, tokens, and status in one view.',
    url: 'https://deposit.now/dashboard',
    siteName: 'Deposit Now',
  },
  robots: { index: true, follow: true },
};

const jsonLd = pageGraph(
  {
    '@type': 'CollectionPage',
    name: 'x402 Facilitator Dashboard',
    description:
      'Interactive comparison of x402 facilitators — filter by fee, chain, token, and production status.',
    url: 'https://deposit.now/dashboard',
  },
  '/dashboard',
  'Facilitator Dashboard'
);

export default function DashboardPage() {
  return (
    <div className="min-h-screen page-shell">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h1 className="text-sm font-medium text-muted-foreground mb-2">
            deposit.now
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Facilitator Dashboard
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Compare every x402 facilitator side by side. Filter by fee
            structure, supported chains, tokens, and production status to find
            the right fit for your integration.
          </p>
        </div>

        <DashboardContent />

        <div className="mt-12 rounded-xl border border-border/60 bg-muted/20 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white mb-1">
              Looking for clients, services, and tooling?
            </p>
            <p className="text-sm text-muted-foreground">
              The full x402 Directory lists 100+ projects across the
              ecosystem.
            </p>
          </div>
          <Link
            href="/ecosystem"
            className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary font-bold text-xs uppercase tracking-wider px-5 h-9 rounded-lg transition-colors shrink-0"
          >
            x402 Directory
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteFooter />
    </div>
  );
}
