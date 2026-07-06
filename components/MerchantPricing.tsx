import Link from 'next/link';
import { ArrowRight, Check, Coins, Minus, Zap } from 'lucide-react';
import { agentRailNote, pricingTiers, type PricingTier } from '@/lib/pricing';

function tierFeatures(tier: PricingTier): { text: string; muted?: boolean }[] {
  const items: { text: string; muted?: boolean }[] = [
    { text: tier.endpoints },
    { text: tier.settlementFee },
    { text: tier.agentRail, muted: true },
  ];

  if (tier.webhooks !== '—') {
    items.push({ text: tier.webhooks });
  } else {
    items.push({ text: 'No webhooks', muted: true });
  }

  items.push({ text: tier.automation });
  items.push({ text: tier.discovery });

  if (tier.revenueShare !== '—') {
    items.push({ text: tier.revenueShare });
  }

  return items;
}

function TierCard({ tier }: { tier: PricingTier }) {
  const features = tierFeatures(tier);

  return (
    <article
      id={tier.id}
      className={`relative flex flex-col rounded-2xl border h-full transition-colors scroll-mt-28 ${
        tier.featured
          ? 'border-blue-500/40 bg-gradient-to-br from-blue-950/50 via-slate-900/80 to-black/60 shadow-[0_0_32px_rgba(59,130,246,0.12)]'
          : 'border-white/10 bg-black/35 hover:border-white/20'
      }`}
    >
      {tier.featured && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
            <Zap className="h-2.5 w-2.5" />
            Popular
          </span>
        </div>
      )}

      <div className="p-5 sm:p-6 border-b border-white/5">
        <h3 className="text-xl font-black text-white">{tier.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{tier.tagline}</p>
        <p className="text-2xl sm:text-3xl font-black text-white mt-4 tracking-tight">
          {tier.monthly}
          {tier.monthly === '$49 / mo' && (
            <span className="text-sm font-medium text-gray-500 ml-1">+ usage</span>
          )}
        </p>
        <div
          className={`mt-3 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${
            tier.featured
              ? 'bg-blue-500/15 text-blue-300 border border-blue-500/25'
              : 'bg-white/5 text-gray-300 border border-white/10'
          }`}
        >
          <Coins className="h-3 w-3 shrink-0" />
          {tier.settlementFee}
        </div>
      </div>

      <ul className="p-5 sm:p-6 space-y-2.5 flex-1">
        {features.map((f) => (
          <li key={f.text} className="flex items-start gap-2 text-sm">
            {f.muted ? (
              <Minus className="h-3.5 w-3.5 text-gray-600 shrink-0 mt-0.5" />
            ) : (
              <Check
                className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${
                  tier.featured ? 'text-blue-400' : 'text-emerald-500'
                }`}
              />
            )}
            <span className={f.muted ? 'text-gray-500' : 'text-gray-300'}>{f.text}</span>
          </li>
        ))}
      </ul>

      <div className="p-5 sm:p-6 pt-0">
        <Link
          href={tier.ctaHref}
          className={`inline-flex w-full items-center justify-center gap-2 h-10 rounded-xl font-black text-[10px] uppercase tracking-wider transition-colors ${
            tier.featured
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-white/8 hover:bg-white/12 text-white border border-white/10'
          }`}
        >
          {tier.cta}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}

export function MerchantPricing() {
  return (
    <div>
      <div id="overview" className="mb-10 sm:mb-12 scroll-mt-28">
        <p className="text-gray-300 leading-relaxed mb-4">
          Merchants pay for <strong className="text-white">settlement volume</strong> and{' '}
          <strong className="text-white">automation</strong> — webhooks, retries, discovery —
          not per-agent account fees.
        </p>
        <p className="text-sm text-gray-500 leading-relaxed">{agentRailNote}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        {pricingTiers.map((tier) => (
          <TierCard key={tier.id} tier={tier} />
        ))}
      </div>

      <div
        id="revenue-share"
        className="mt-12 sm:mt-16 rounded-2xl border border-white/10 bg-black/30 p-6 sm:p-8 scroll-mt-28"
      >
        <h2 className="text-lg font-bold text-white mb-4">How revenue share works</h2>
        <ul className="space-y-3 text-sm text-gray-400">
          <li>
            <strong className="text-white">Settlement fee</strong> — a small % of each USDC deposit
            that settles to your <code className="text-blue-300">payTo</code> address. Non-custodial:
            funds never touch deposit.now wallets.
          </li>
          <li>
            <strong className="text-white">Agent rail</strong> — 0.01 USDC per x402 call, always paid
            by the agent. Keeps discovery open and avoids merchant-side friction.
          </li>
          <li>
            <strong className="text-white">Referral rev-share (Rail+)</strong> — when Bazaar or catalog
            discovery routes a new agent to your endpoint, deposit.now shares{' '}
            <span className="text-white">5% of the first settled deposit</span> back to you as a
            discovery credit on your monthly invoice.
          </li>
          <li>
            <strong className="text-white">Automation overage</strong> — Rail includes 10k webhook
            deliveries/month; Network tier is unlimited. Extra deliveries billed at $0.001 each.
          </li>
        </ul>
      </div>
    </div>
  );
}