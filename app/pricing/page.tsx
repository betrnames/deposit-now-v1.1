import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { SiteFooter } from '@/components/SiteFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { agentRailNote, pricingTiers } from '@/lib/pricing';
import { pageGraph } from '@/lib/seo';
import { CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Simple pricing for AI agent funding: 1% platform fee per programmable x402 deposit. No tiers, no accounts.',
  alternates: { canonical: 'https://deposit.now/pricing' },
  keywords: [
    'deposit.now pricing',
    'x402 deposit fee',
    'AI agent funding cost',
    'agent-to-agent transfer fee',
  ],
  openGraph: {
    title: 'Pricing | deposit.now',
    description: 'Flat 1% on each agent deposit. Pay amount + fee via x402; net goes to target.',
    url: 'https://deposit.now/pricing',
    siteName: 'deposit.now',
  },
  robots: { index: true, follow: true },
};

const jsonLd = pageGraph(
  {
    '@type': 'WebPage',
    name: 'deposit.now Pricing',
    description: 'Flat 1% platform fee for programmable AI agent deposits via x402.',
    url: 'https://deposit.now/pricing',
  },
  '/pricing',
  'Pricing'
);

export default function PricingPage() {
  const tier = pricingTiers[0];

  return (
    <div className="min-h-screen page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <p className="text-primary text-xs font-black uppercase tracking-[0.2em] mb-4">Pricing</p>
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
          One fee. Any wallet.
        </h1>
        <p className="text-lg text-muted-foreground mb-12 leading-relaxed">{agentRailNote}</p>

        <Card className="bg-card/60 border-primary/40 rounded-3xl mb-10">
          <CardHeader>
            <CardTitle className="text-2xl text-white">{tier.name}</CardTitle>
            <p className="text-muted-foreground">{tier.tagline}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-6 items-end">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Monthly
                </div>
                <div className="text-3xl font-black text-white">{tier.monthly}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Per deposit
                </div>
                <div className="text-3xl font-black text-primary">{tier.fee}</div>
              </div>
            </div>
            <ul className="space-y-3">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-wider px-8 h-12 rounded-xl"
            >
              {tier.cta}
            </Link>
          </CardContent>
        </Card>

        <div className="rounded-2xl border border-border/60 bg-muted/30 p-6 text-sm text-muted-foreground leading-relaxed">
          <p className="font-semibold text-white mb-2">Example</p>
          <p>
            Fund a child agent with <strong className="text-white">$50.00</strong> net → agent pays{' '}
            <strong className="text-white">$50.50</strong> via x402 → platform keeps{' '}
            <strong className="text-white">$0.50</strong> → target receives{' '}
            <strong className="text-white">$50.00</strong> USDC on Base.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
