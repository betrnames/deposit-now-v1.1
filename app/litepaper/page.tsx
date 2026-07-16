import type { Metadata } from 'next';
import { GuidePage } from '@/components/GuidePage';
import { ComparisonTable } from '@/components/ComparisonTable';
import { pageGraph } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Litepaper',
  description:
    'Honest technical overview of deposit.now: open x402 funding rail vs direct transfer vs Coinbase CDP Fund.',
  alternates: { canonical: 'https://deposit.now/litepaper' },
  keywords: [
    'deposit.now litepaper',
    'x402 funding rail',
    'AI agent deposits',
    'CDP Fund comparison',
  ],
  openGraph: {
    title: 'Litepaper | deposit.now',
    description: 'Open x402 funding rail — scope, architecture, and comparison.',
    url: 'https://deposit.now/litepaper',
    siteName: 'deposit.now',
  },
  robots: { index: true, follow: true },
};

const jsonLd = pageGraph(
  {
    '@type': 'TechArticle',
    headline: 'deposit.now Litepaper — Open x402 funding rail',
    description:
      'Protocol-shaped USDC deposits via x402 with optional public receipts. Complements Coinbase CDP Fund.',
    author: { '@type': 'Organization', name: 'deposit.now' },
    publisher: { '@type': 'Organization', name: 'deposit.now' },
    url: 'https://deposit.now/litepaper',
    dateModified: '2026-07-16',
  },
  '/litepaper',
  'Litepaper'
);

const nav = [
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'Problem' },
  { id: 'solution', label: 'Solution' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'compare', label: 'Comparison' },
  { id: 'economics', label: 'Economics' },
  { id: 'limits', label: 'Limits' },
  { id: 'risk', label: 'Risk summary' },
];

export default function LitepaperPage() {
  return (
    <GuidePage
      kicker="Technical overview"
      title="Litepaper"
      subtitle="Open x402 funding rail — honest scope and architecture."
      nav={nav}
      jsonLd={jsonLd}
    >
      <p id="overview">
        <strong>deposit.now</strong> is programmable funding infrastructure shaped as HTTP 402. An
        agent declares a <strong>target</strong> address and net <strong>amount</strong>, pays amount
        + 1% via x402, and after settlement the platform forwards net USDC on Base. Optional public
        receipts document payer, target, fee, and explorer links when storage is configured.
      </p>

      <h2 id="problem">Problem</h2>
      <p>
        Agents that already hold USDC often need a simple, machine-readable way to deposit into a
        known address over HTTP — without integrating a full wallet platform. Raw transfers lack a
        standard 402 flow and productized receipts. CDP Fund solves funding inside Coinbase’s stack,
        not every open agent integration.
      </p>

      <h2 id="solution">Solution</h2>
      <ul>
        <li>
          <strong>One deposit call</strong> — <code>POST /api/deposit</code> with target, amount,
          optional memo.
        </li>
        <li>
          <strong>x402 exact scheme</strong> — gross = amount + 1%; facilitator verifies on-chain.
        </li>
        <li>
          <strong>Forward after settle</strong> — platform retains fee, forwards net (async; can
          fail).
        </li>
        <li>
          <strong>Optional receipts</strong> — public page when Blob storage is configured.
        </li>
      </ul>

      <h2 id="architecture">Architecture</h2>
      <ol>
        <li>
          Agent → <code>POST /api/deposit</code> → HTTP 402
        </li>
        <li>Agent pays gross via x402 → retry with payment proof</li>
        <li>Facilitator settles USDC to platform wallet</li>
        <li>
          Intent recovered from body and/or stored intent → forward net to target
        </li>
        <li>
          Response <code>payment_received</code> + receipt URL; poll receipt for{' '}
          <code>forwardStatus</code>
        </li>
      </ol>

      <h2 id="compare">Comparison</h2>
      <p>
        Coinbase already funds wallets (Fund/Send). deposit.now is a complementary open rail — not a
        replacement.
      </p>
      <div className="my-6">
        <ComparisonTable />
      </div>

      <h2 id="economics">Economics</h2>
      <ul>
        <li>
          <strong>Net amount:</strong> the <code>amount</code> field.
        </li>
        <li>
          <strong>Platform fee:</strong> flat 1% of net, paid as part of gross x402 payment.
        </li>
      </ul>

      <h2 id="limits">Limits (honest)</h2>
      <ul>
        <li>Does not create wallets or sub-accounts.</li>
        <li>HTTP 200 does not mean target already holds funds.</li>
        <li>Public receipts require server storage configuration.</li>
        <li>Forward can fail; operators should monitor CDP hot wallet health.</li>
      </ul>

      <h2 id="risk">Risk summary</h2>
      <p>
        See <a href="/disclosures">disclosures</a>. Experimental infrastructure, not a money
        transmitter or bank. On-chain payments are irreversible.
      </p>
    </GuidePage>
  );
}
