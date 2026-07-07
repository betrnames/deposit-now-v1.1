import { CheckCircle2, GitCompare } from 'lucide-react';
import Link from 'next/link';
import { whyDepositNowPoints, whyDepositNowTagline } from '@/lib/pricing';
import { ComparisonTable } from '@/components/ComparisonTable';


export function WhyDepositNow({ showPricingLink = true }: { showPricingLink?: boolean }) {
  return (
    <section className="pt-16 pb-24 sm:pt-24 sm:pb-32 bg-muted/50 border-t border-primary/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-4 py-2 text-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
            <GitCompare className="h-3 w-3 shrink-0" />
            Why not a direct transfer?
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Compare — left on desktop */}
          <div className="min-w-0 lg:sticky lg:top-24 order-2 lg:order-1">
            <ComparisonTable compact browserChrome />
          </div>

          {/* Why — right on desktop */}
          <div className="min-w-0 order-1 lg:order-2">
            <p className="text-base sm:text-lg text-primary font-medium mb-6 leading-relaxed">
              {whyDepositNowTagline}
            </p>

            <ul className="space-y-3 mb-8">
              {whyDepositNowPoints.map((point) => (
                <li key={point.title} className="flex items-start gap-3 text-sm sm:text-base text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{point.body}</span>
                </li>
              ))}
            </ul>

            {showPricingLink && (
              <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 w-full">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center w-full sm:flex-1 bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-wider px-8 h-12 rounded-xl transition-colors"
                >
                  Merchant pricing
                </Link>
                <Link
                  href="/litepaper"
                  className="inline-flex items-center justify-center w-full sm:flex-1 border border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary hover:text-primary/80 font-black text-[10px] uppercase tracking-wider px-8 h-12 rounded-xl transition-colors"
                >
                  Litepaper
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}