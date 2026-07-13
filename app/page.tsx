import { SiteFooter } from '@/components/SiteFooter';
import { Header } from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen page-shell flex flex-col">
      <Header />

      <section className="flex-1 flex items-center justify-center relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 opacity-15 hero-grid pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, transparent 0%, color-mix(in oklch, var(--background) 90%, transparent) 100%)',
          }}
        />

        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-10">
            Project Update
          </div>

          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-6">
            After months of building in the x402 ecosystem, we&rsquo;ve decided
            to close this chapter and focus on what&rsquo;s next. The
            facilitator dashboard, payment routing infrastructure, and
            everything we learned here will carry forward into future projects.
          </p>

          <p className="text-base text-muted-foreground/80 leading-relaxed mb-10">
            Thank you to every developer, agent builder, and early adopter who
            explored x402 payments with us. This isn&rsquo;t goodbye&mdash;it&rsquo;s
            a pivot.
          </p>

          <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-8 text-left max-w-md mx-auto">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Interested in this domain?
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              The <span className="text-white font-medium">deposit.now</span> domain
              is available. If you&rsquo;re building in payments, fintech, or
              web3 and want a premium .now domain, reach out.
            </p>
            <a
              href="mailto:support@deposit.now"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-wider px-6 h-10 rounded-lg transition-colors"
            >
              Contact Us
            </a>
            <p className="text-xs text-muted-foreground/60 mt-3">
              support@deposit.now
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
