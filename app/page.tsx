import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Coins, CheckCircle2, Sparkles } from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';
import { Header } from '@/components/Header';
import { PRODUCT } from '@/lib/product-copy';
import { SITE, openGraphImages } from '@/lib/seo';

export const metadata: Metadata = {
  title: { absolute: PRODUCT.titleDefault },
  description: PRODUCT.description,
  alternates: { canonical: SITE.base },
  // Next.js replaces parent openGraph when a page sets it — include images or
  // LinkedIn gets title/description with no preview image.
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: PRODUCT.titleDefault,
    description: PRODUCT.description,
    url: SITE.base,
    siteName: PRODUCT.name,
    images: openGraphImages(PRODUCT.ogImageAlt),
  },
};

export default function Home() {
  return (
    <div className="min-h-screen page-shell">
      <Header />

      <section className="relative overflow-hidden py-12 sm:py-20 lg:py-24">
        <div className="absolute inset-0 opacity-25 hero-grid" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, transparent 0%, color-mix(in oklch, var(--background) 88%, transparent) 100%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left: message */}
            <div className="text-left flex flex-col items-start min-w-0">
              <Badge
                className="mb-5 sm:mb-6 px-4 py-2 bg-transparent border-primary/50 text-primary font-black uppercase"
                style={{ letterSpacing: '0.2em', fontSize: '10px' }}
                variant="outline"
              >
                <Zap className="h-3 w-3 mr-2" />
                x402 · Base mainnet
              </Badge>

              <h1 className="font-mono text-[2.15rem] leading-[1.08] sm:text-6xl lg:text-7xl font-black tracking-tighter mb-4 sm:leading-[1.05] text-left">
                <span className="block text-white mb-1 sm:mb-2">{PRODUCT.name}</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/90 to-accent">
                  x402 funding rail
                </span>
              </h1>

              <p className="text-lg sm:text-2xl text-primary font-medium mb-2 sm:mb-3">
                {PRODUCT.tagline}
              </p>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-md leading-relaxed">
                {PRODUCT.valueProps} USDC on Base · open x402 agent payments.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 sm:mb-8 w-full sm:w-auto">
                <a
                  href="/docs#quickstart"
                  className="bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-wider px-8 h-12 rounded-xl inline-flex items-center justify-center"
                >
                  Get started
                </a>
                <a
                  href="/llms.txt"
                  className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-black text-[10px] uppercase tracking-wider px-8 h-12 rounded-xl inline-flex items-center justify-center"
                >
                  llms.txt
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-muted-foreground/70 uppercase tracking-wider font-medium">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Live on Base Mainnet</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                  <span>0.25% fee · $0.25 cap</span>
                </div>
              </div>
            </div>

            {/* Right: 30s recipe */}
            <div className="min-w-0 w-full">
              <pre className="font-mono text-[11px] sm:text-sm leading-relaxed text-foreground/90 bg-card/80 border border-border/60 rounded-2xl px-4 py-4 sm:px-5 sm:py-5 overflow-x-auto shadow-lg shadow-primary/5 transition-all duration-300 hover:border-primary/45 hover:shadow-[0_0_32px_color-mix(in_oklch,var(--primary)_28%,transparent),0_0_64px_color-mix(in_oklch,var(--primary)_12%,transparent)]">
                <span className="text-purple-400">POST</span>
                {' /api/deposit\n'}
                <span className="text-muted-foreground">
                  {`// fund existing`}
                </span>
                {'\n'}
                <span className="text-muted-foreground">
                  {`{ "target": "0x…", "amount": "50.00" }`}
                </span>
                {'\n'}
                <span className="text-muted-foreground">
                  {`// or provision + fund child`}
                </span>
                {'\n'}
                <span className="text-muted-foreground">
                  {`{ "provision": true, "label": "child-1", "amount": "50.00" }`}
                </span>
                {'\n'}
                <span className="text-muted-foreground/80">
                  → 402 pay 0.25% (max $0.25) → net to target / child
                </span>
                {'\n\n'}
                <span className="text-muted-foreground/70">
                  curl -i -X POST https://deposit.now/api/deposit \
                </span>
                {'\n'}
                <span className="text-muted-foreground/70">
                  {"  -H 'Content-Type: application/json' \\"}
                </span>
                {'\n'}
                <span className="text-muted-foreground/70">
                  {`  -d '{"provision":true,"label":"child-1","amount":"50.00"}'`}
                </span>
              </pre>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-muted/40 border-t border-primary/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card/60 border-border/60 backdrop-blur rounded-3xl relative overflow-hidden">
              <div className="absolute top-4 right-6 text-[120px] font-bold text-white/5 leading-none select-none">
                01
              </div>
              <CardContent className="p-10 relative z-10">
                <h3 className="text-2xl font-bold mb-4 text-white">Call deposit</h3>
                <p className="text-muted-foreground mb-6">
                  Agent posts net <code className="text-primary text-sm">amount</code> plus either{' '}
                  <code className="text-primary text-sm">target</code> or{' '}
                  <code className="text-primary text-sm">provision</code> +{' '}
                  <code className="text-primary text-sm">label</code>.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-white">Any EVM target address</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-white">
                      Or provision a managed child
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border/60 backdrop-blur rounded-3xl relative overflow-hidden">
              <div className="absolute top-4 right-6 text-[120px] font-bold text-white/5 leading-none select-none">
                02
              </div>
              <CardContent className="p-10 relative z-10">
                <h3 className="text-2xl font-bold mb-4 text-white">Pay x402</h3>
                <p className="text-muted-foreground mb-6">
                  HTTP 402 for amount + 0.25% (min $0.001, max $0.25). Agent pays USDC to the platform wallet via x402.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-white">No API key needed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-white">Standard x402 clients</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border/60 backdrop-blur rounded-3xl relative overflow-hidden">
              <div className="absolute top-4 right-6 text-[120px] font-bold text-white/5 leading-none select-none">
                03
              </div>
              <CardContent className="p-10 relative z-10">
                <h3 className="text-2xl font-bold mb-4 text-white">Forward + receipt</h3>
                <p className="text-muted-foreground mb-6">
                  After settlement, net is forwarded to target (or provisioned child). Check{' '}
                  <code className="text-primary text-sm">forwardStatus</code> — 200 is not delivery.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-white">Async forward (can fail)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-white">Basescan when hashes exist</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
