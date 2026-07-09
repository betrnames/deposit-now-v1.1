import Link from 'next/link';
import { Check, Coins, Minus, Zap } from 'lucide-react';
import {
  agentRailNote,
  billingAutomationRows,
  pricingTiers,
  type PricingTier,
} from '@/lib/pricing';

function BillingBadge({ mode }: { mode: 'automated' | 'manual' | 'free' }) {
  const badgeClass =
    'inline-flex shrink-0 items-center whitespace-nowrap rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border';

  if (mode === 'free') {
    return (
      <span
        className={`${badgeClass} bg-emerald-500/10 text-emerald-400 border-emerald-500/20`}
      >
        Free
      </span>
    );
  }
  if (mode === 'automated') {
    return (
      <span className={`${badgeClass} bg-primary/10 text-primary/80 border-primary/25`}>
        Onchain
      </span>
    );
  }
  return (
    <span className={`${badgeClass} bg-amber-500/10 text-amber-300 border-amber-500/20`}>
      Custom
    </span>
  );
}

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
          ? 'border-primary/40 bg-gradient-to-br from-primary/10 via-card/80 to-black/60 shadow-[0_0_32px_color-mix(in_oklch,var(--primary)_30%,transparent)]'
          : 'border-border/60 bg-black/35 hover:border-white/20'
      }`}
    >
      {tier.featured && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 bg-primary text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
            <Zap className="h-2.5 w-2.5" />
            Popular
          </span>
        </div>
      )}

      <div className="p-5 sm:p-6 border-b border-white/5">
        <h3 className="text-xl font-black text-white">{tier.name}</h3>
        <p className="text-xs text-muted-foreground/70 mt-0.5">{tier.tagline}</p>
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {tier.monthly}
          </p>
          <BillingBadge mode={tier.monthlyBilling} />
        </div>
        <div
          className={`mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 max-w-full rounded-lg px-2.5 py-1 text-xs font-semibold ${
            tier.featured
              ? 'bg-primary/15 text-primary/80 border border-primary/25'
              : 'bg-white/5 text-foreground/80 border border-border/60'
          }`}
        >
          <Coins className="h-3 w-3 shrink-0" />
          <span className="min-w-0">{tier.settlementFee}</span>
          <BillingBadge mode={tier.settlementBilling} />
        </div>
      </div>

      <ul className="p-5 sm:p-6 space-y-2.5 flex-1">
        {features.map((f) => (
          <li key={f.text} className="flex items-start gap-2 text-sm">
            {f.muted ? (
              <Minus className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0 mt-0.5" />
            ) : (
              <Check
                className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${
                  tier.featured ? 'text-primary' : 'text-emerald-500'
                }`}
              />
            )}
            <span className={f.muted ? 'text-muted-foreground/70' : 'text-foreground/80'}>{f.text}</span>
          </li>
        ))}
      </ul>

      <div className="p-5 sm:p-6 pt-0">
        <Link
          href={tier.ctaHref}
          className={`inline-flex w-full items-center justify-center h-10 rounded-xl font-black text-[10px] uppercase tracking-wider transition-colors no-underline hover:no-underline ${
            tier.featured
              ? 'bg-primary hover:bg-primary/90 !text-primary-foreground'
              : 'bg-secondary hover:bg-secondary/80 !text-secondary-foreground border border-border'
          }`}
        >
          {tier.cta}
        </Link>
      </div>
    </article>
  );
}

export function MerchantPricing() {
  return (
    <div>
      <div id="overview" className="mb-10 sm:mb-12 scroll-mt-28">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Merchants pay for <strong className="text-white">settlement volume</strong> and{' '}
          <strong className="text-white">automation</strong> — webhooks, retries, discovery —
          not per-agent account fees. Everything billable runs{' '}
          <strong className="text-white">on-chain via x402</strong>; we do not send invoices.
        </p>
        <p className="text-sm text-muted-foreground/70 leading-relaxed">{agentRailNote}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        {pricingTiers.map((tier) => (
          <TierCard key={tier.id} tier={tier} />
        ))}
      </div>

      <div
        id="billing-automation"
        className="mt-12 sm:mt-16 rounded-2xl border border-border/60 bg-black/30 overflow-hidden scroll-mt-28"
      >
        <div className="p-5 sm:p-6 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">Automated vs manual billing</h2>
          <p className="text-sm text-muted-foreground/70 mt-1">
            On-chain badges mean USDC collected automatically through x402. Custom setup is only
            for Network volume deals.
          </p>
        </div>

        <div className="md:hidden divide-y divide-white/5 pb-5 sm:pb-6">
          {billingAutomationRows.map((row) => (
            <div key={row.charge} className="px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-white">{row.charge}</p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">{row.whoPays}</p>
                </div>
                <BillingBadge mode={row.mode} />
              </div>
              <p className="text-sm text-muted-foreground mt-2 break-words">{row.howCollected}</p>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto pb-5 sm:pb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-[10px] uppercase tracking-wider text-muted-foreground/70">
                <th className="px-5 sm:px-6 py-3 font-bold align-middle">Charge</th>
                <th className="px-5 sm:px-6 py-3 font-bold align-middle">Who pays</th>
                <th className="px-5 sm:px-6 py-3 font-bold align-middle">How it works</th>
                <th className="px-5 sm:px-6 py-3 font-bold align-middle w-[5.5rem] min-w-[5.5rem]">
                  Mode
                </th>
              </tr>
            </thead>
            <tbody>
              {billingAutomationRows.map((row) => (
                <tr key={row.charge} className="border-b border-white/5 last:border-0">
                  <td className="px-5 sm:px-6 py-4 align-middle font-semibold text-white">
                    {row.charge}
                  </td>
                  <td className="px-5 sm:px-6 py-4 align-middle text-muted-foreground">{row.whoPays}</td>
                  <td className="px-5 sm:px-6 py-4 align-middle text-muted-foreground">
                    {row.howCollected}
                  </td>
                  <td className="px-5 sm:px-6 py-4 align-middle w-[5.5rem] min-w-[5.5rem]">
                    <BillingBadge mode={row.mode} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 sm:px-6 pt-7 pb-8 sm:pt-8 sm:pb-10 bg-white/[0.02] border-t border-white/5 space-y-4">
          <p className="text-xs text-muted-foreground/70">Rail merchants renew and top up via x402:</p>
          <ul className="text-[11px] sm:text-xs font-mono space-y-2.5 text-primary/80/90 pb-1">
            <li className="break-all">
              <span className="text-muted-foreground/70 font-sans">Renew </span>
              POST /api/merchants/&#123;slug&#125;/renew
              <span className="text-muted-foreground/70 font-sans"> (49 USDC)</span>
            </li>
            <li className="break-all">
              <span className="text-muted-foreground/70 font-sans">Top up </span>
              POST /api/merchants/&#123;slug&#125;/topup
            </li>
            <li className="break-all">
              <span className="text-muted-foreground/70 font-sans">Balance </span>
              GET /api/merchants/&#123;slug&#125;
            </li>
          </ul>
        </div>
      </div>

      <div
        id="revenue-share"
        className="mt-12 sm:mt-16 rounded-2xl border border-border/60 bg-black/30 p-6 sm:p-8 scroll-mt-28"
      >
        <h2 className="text-lg font-bold text-white mb-4">How charges settle</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li>
            <strong className="text-white">Settlement fee</strong> — a small % of each declared
            deposit volume, debited from your prepaid USDC balance after every settled deposit.
            Top up anytime via the x402 top-up endpoint. Non-custodial: deposit funds still settle
            directly to your merchant wallet.
          </li>
          <li>
            <strong className="text-white">Deposit settlement</strong> — agents pay the full deposit
            amount via x402. USDC settles directly to your merchant wallet on-chain. No
            per-call platform toll.
          </li>
          <li>
            <strong className="text-white">Rail renewal</strong> — pay 49 USDC through the renew
            endpoint to extend webhooks and automation for 30 days. No invoices, no card on file.
          </li>
          <li>
            <strong className="text-white">Referral rev-share (Rail+)</strong> — when Bazaar or catalog
            discovery routes a new agent to your endpoint, deposit.now credits{' '}
            <span className="text-white">5% of the first settled deposit</span> back to your prepaid
            balance automatically.
          </li>
          <li>
            <strong className="text-white">Webhook overage</strong> — Rail includes 10k webhook
            deliveries/month; Network tier is unlimited. Extra deliveries debited at $0.001 each from
            prepaid balance.
          </li>
        </ul>
      </div>
    </div>
  );
}