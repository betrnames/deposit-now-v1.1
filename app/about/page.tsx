import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';
import { pageGraph } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About',
  description:
    'deposit.now is a non-custodial x402 payment rail that lets AI agents trigger verifiable USDC deposits on Base.',
  alternates: { canonical: 'https://deposit.now/about' },
  openGraph: {
    title: 'About',
    description:
      'Non-custodial programmable deposit infrastructure for autonomous AI agents on Base.',
    url: 'https://deposit.now/about',
    siteName: 'Deposit Now',
  },
  robots: { index: true, follow: true },
};

const jsonLd = pageGraph(
  {
    '@type': 'AboutPage',
    name: 'About deposit.now',
    url: 'https://deposit.now/about',
    description:
      'Programmable funding gateway for autonomous AI agents using the x402 HTTP payment protocol and USDC on Base.',
    mainEntity: {
      '@type': 'Organization',
      name: 'deposit.now',
      url: 'https://deposit.now',
    },
  },
  '/about',
  'About'
);

export default function AboutPage() {
  return (
    <ContentPage
      title="About"
      subtitle="Programmable, non-custodial deposit infrastructure for autonomous agents."
      jsonLd={jsonLd}
    >
      <p>
        <strong>deposit.now</strong> is the first public x402 API that lets AI agents
        autonomously trigger deposits over HTTP. Agents pay a micropayment in USDC on Base;
        the facilitator settles on-chain; deposit.now returns a verifiable public receipt
        bound to the transaction.
      </p>

      <h2>What we are</h2>
      <ul>
        <li>
          <strong>Payment rail, not a bank.</strong> We do not custody user or merchant
          funds. USDC settles directly to declared on-chain addresses.
        </li>
        <li>
          <strong>Machine-native.</strong> No accounts, passwords, or API keys. HTTP 402 +
          x402 client SDKs handle authentication and payment.
        </li>
        <li>
          <strong>Verifiable.</strong> Every settled call can produce a public receipt with
          payer, amount, pay-to address, and a Basescan transaction link.
        </li>
      </ul>

      <h2>What we are building toward</h2>
      <ol>
        <li>
          <strong>Phase 1 — Receipts (live):</strong> Public, on-chain-verifiable deposit
          receipts after every settlement.
        </li>
        <li>
          <strong>Phase 2 — Merchant endpoints:</strong> Per-merchant deposit routes so
          agents fund real accounts, not just a generic signal.
        </li>
        <li>
          <strong>Phase 3 — Discovery flywheel:</strong> x402 Bazaar + x402scan listings,
          OpenAPI contract, and agent marketplace distribution.
        </li>
      </ol>

      <h2>Business model</h2>
      <p>
        We monetize at the <strong>merchant and volume layer</strong> (settlement fees,
        lead routing, platform integrations), not by blocking agents with high per-call
        tolls. The API micropayment covers discovery and receipt infrastructure.
      </p>

      <h2>Contact</h2>
      <ul>
        <li>
          <a href="mailto:support@deposit.now">support@deposit.now</a>
        </li>
        <li>
          API docs: <a href="/docs">deposit.now/docs</a>
        </li>
        <li>
          Technical spec: <a href="/litepaper">litepaper</a>
        </li>
      </ul>
    </ContentPage>
  );
}