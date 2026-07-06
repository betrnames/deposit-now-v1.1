import { ArrowRight, CheckCircle2, GitCompare } from 'lucide-react';
import Link from 'next/link';
import { whyDepositNowPoints, whyDepositNowTagline } from '@/lib/pricing';
import { ComparisonTable } from '@/components/ComparisonTable';


export function WhyDepositNow({ showPricingLink = true }: { showPricingLink?: boolean }) {
  return (
    <section className="py-16 sm:py-24 bg-slate-950/60 border-t border-blue-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/5 px-4 py-2 text-blue-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
            <GitCompare className="h-3 w-3 shrink-0" />
            Why not a direct transfer?
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Why — 50% */}
          <div className="min-w-0">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-6">
              Why deposit.now instead of a direct on-chain transfer?
            </h2>

            <ul className="space-y-3 mb-8">
              {whyDepositNowPoints.map((point) => (
                <li key={point.title} className="flex items-start gap-3 text-sm sm:text-base text-gray-400">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{point.body}</span>
                </li>
              ))}
            </ul>

            {showPricingLink && (
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-wider px-5 h-10 rounded-xl transition-colors"
                >
                  Merchant pricing
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/litepaper"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Litepaper →
                </Link>
              </div>
            )}
          </div>

          {/* Compare — 50% */}
          <div className="min-w-0 lg:sticky lg:top-24">
            <p className="text-base sm:text-lg text-blue-400 font-medium mb-5 leading-relaxed">
              {whyDepositNowTagline}
            </p>
            <ComparisonTable compact browserChrome />
          </div>
        </div>
      </div>
    </section>
  );
}