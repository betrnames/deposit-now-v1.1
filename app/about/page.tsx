import type { Metadata } from 'next';
import { GuidePage } from '@/components/GuidePage';
import { pageGraph } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About',
  description:
    'deposit.now is the funding layer for AI agents — programmable x402 deposits to fund any wallet, including sub-wallets and child agents.',
  alternates: { canonical: 'https://deposit.now/about' },
  openGraph: {
    title: 'About | deposit.now',
    description:
      'The Funding Layer for AI Agents. Programmable deposits via one x402 call on Base.',
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
      'The Funding Layer for AI Agents — programmable deposits via x402 for agent-to-agent and sub-wallet funding.',
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
  { id: 'business-model', label: 'Business model' },
  { id: 'contact', label: 'Contact' },
];

export default function AboutPage() {
  return (
    <GuidePage
      kicker="deposit.now"
      title="About"
      subtitle="The Funding Layer for AI Agents."
      nav={nav}
      jsonLd={jsonLd}
    >
      <p id="overview">
        <strong>deposit.now</strong> is a public x402 deposit API. Agents fund any wallet —
        including sub-wallets and child agents — with one HTTP call. No humans required for
        secondary or agent-to-agent flows.
      </p>

      <h2 id="what-we-are">What we are</h2>
      <ul>
        <li>
          <strong>Funding layer, not a bank.</strong> Agents pay amount + 1% via x402; net USDC is
          forwarded on-chain to the declared target.
        </li>
        <li>
          <strong>Machine-native.</strong> No accounts or API keys for agents. HTTP 402 + x402
          clients handle payment.
        </li>
        <li>
          <strong>Verifiable.</strong> Every settled call can produce a public receipt with payer,
          target, fee, and Basescan links.
        </li>
        <li>
          <strong>CDP-secured platform wallet.</strong> Settlement uses Coinbase Agentic / Server
          Wallet credentials — not raw private keys in application config.
        </li>
      </ul>

      <h2 id="business-model">Business model</h2>
      <p>
        Flat <strong>1% platform fee</strong> on each deposit. No merchant tiers, no prepaid
        balances, no facilitator marketplace.
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
