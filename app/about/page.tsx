import type { Metadata } from 'next';
import { GuidePage } from '@/components/GuidePage';
import { pageGraph } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About',
  description:
    'deposit.now is an open x402 funding rail — pay amount + 1%, net to any EVM target. Complements Coinbase CDP Fund.',
  alternates: { canonical: 'https://deposit.now/about' },
  openGraph: {
    title: 'About | deposit.now',
    description: 'Open x402 funding rail for agents. Honest scope: not a CDP Fund replacement.',
    url: 'https://deposit.now/about',
    siteName: 'deposit.now',
  },
  robots: { index: true, follow: true },
};

const jsonLd = pageGraph(
  {
    '@type': 'AboutPage',
    name: 'About deposit.now',
    url: 'https://deposit.now/about',
    description:
      'Open x402 funding rail: protocol-shaped deposits to any EVM target with optional public receipts.',
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
  { id: 'what-we-are-not', label: 'What we are not' },
  { id: 'business-model', label: 'Business model' },
  { id: 'contact', label: 'Contact' },
];

export default function AboutPage() {
  return (
    <GuidePage
      kicker="deposit.now"
      title="About"
      subtitle="Open x402 funding rail — honest scope."
      nav={nav}
      jsonLd={jsonLd}
    >
      <p id="overview">
        <strong>deposit.now</strong> is a public x402 deposit API. Agents pay amount + 1% over HTTP
        402; after settlement, net USDC is forwarded to a target address they specify. Optional
        public receipts when storage is configured.
      </p>

      <h2 id="what-we-are">What we are</h2>
      <ul>
        <li>
          <strong>An open funding rail.</strong> Protocol-shaped deposits for agents that can already
          pay with x402.
        </li>
        <li>
          <strong>Target-agnostic.</strong> Any EVM address you pass — we do not create the wallet.
        </li>
        <li>
          <strong>Verifiable when configured.</strong> Receipts can include payer, target, fee, and
          Basescan links. Forward is a separate async step.
        </li>
      </ul>

      <h2 id="what-we-are-not">What we are not</h2>
      <ul>
        <li>
          <strong>Not a Coinbase Fund replacement.</strong> CDP Agentic / Server Wallets already fund
          and send. Use those inside that stack.
        </li>
        <li>
          <strong>Not a wallet factory.</strong> No sub-wallet or child-agent provisioning product.
        </li>
        <li>
          <strong>Not instant delivery guarantees.</strong> HTTP 200 means payment received, not
          that the target already holds net funds.
        </li>
      </ul>

      <h2 id="business-model">Business model</h2>
      <p>
        Flat <strong>1% platform fee</strong> on each net deposit. No merchant tiers.
      </p>

      <h2 id="contact">Contact</h2>
      <p>
        Email{' '}
        <a href="mailto:support@deposit.now">support@deposit.now</a> or follow{' '}
        <a href="https://x.com/Deposit_Now" target="_blank" rel="noopener noreferrer">
          @Deposit_Now
        </a>
        .
      </p>
    </GuidePage>
  );
}
