import type { Metadata } from 'next';
import { GuidePage } from '@/components/GuidePage';
import { pageGraph } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About',
  description:
    'deposit.now is a non-custodial x402 payment rail that lets AI agents trigger verifiable USDC deposits on Base mainnet.',
  alternates: { canonical: 'https://deposit.now/about' },
  openGraph: {
    title: 'About',
    description:
      'Non-custodial programmable deposit infrastructure for autonomous AI agents on Base mainnet.',
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
      'Programmable funding gateway for autonomous AI agents using the x402 HTTP payment protocol and USDC on Base mainnet.',
    mainEntity: {
      '@type': 'Organization',
      name: 'deposit.now',
      url: 'https://deposit.now',
    },
  },
  '/about',
  'About'
);

const nav = [
  { id: 'overview', label: 'Overview' },
  { id: 'what-we-are', label: 'What we are' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'business-model', label: 'Business model' },
  { id: 'contact', label: 'Contact' },
];

export default function AboutPage() {
  return (
    <GuidePage
      kicker="deposit.now"
      title="About"
      subtitle="Programmable, non-custodial deposit infrastructure for autonomous agents."
      nav={nav}
      jsonLd={jsonLd}
    >
      <p id="overview">
        <strong>deposit.now</strong> is a public x402 API that lets AI agents
        autonomously trigger deposits over HTTP. Agents pay a micropayment in USDC on Base mainnet;
        the facilitator settles on-chain; deposit.now returns a verifiable public receipt
        bound to the transaction.
      </p>

      <h2 id="what-we-are">What we are</h2>
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

      <h2 id="roadmap">What we are building toward</h2>
      <ol>
        <li>
          <strong>Receipts:</strong> Public, on-chain-verifiable deposit
          receipts after every settlement.
        </li>
        <li>
          <strong>Merchant endpoints:</strong> Per-merchant deposit routes
          at <code>/api/merchants/&#123;slug&#125;/deposit</code> with merchant payTo
          settlement, public catalog, and optional webhooks.
        </li>
        <li>
          <strong>Discovery flywheel:</strong> Bazaar extension,{' '}
          <code>/.well-known/x402</code> manifest, OpenAPI + llms.txt, and CDP Bazaar
          indexing after mainnet settlement.
        </li>
      </ol>

      <h2 id="business-model">Business model</h2>
      <p>
        We monetize at the <strong>merchant and volume layer</strong> — usage-based settlement
        fees, webhook automation, and referral revenue share — not by blocking agents with
        account gates. Agents pay 0.01 USDC per x402 call for the rail; merchants choose a{' '}
        <a href="/pricing">pricing tier</a> for endpoints, webhooks, and Bazaar discovery.
      </p>

      <h2 id="contact">Contact</h2>
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
    </GuidePage>
  );
}