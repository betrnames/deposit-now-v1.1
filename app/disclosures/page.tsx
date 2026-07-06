import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';
import { pageGraph } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Disclosures',
  description:
    'Important disclosures for deposit.now: not a bank or money transmitter, non-custodial USDC on Base, irreversible on-chain payments, experimental x402 API, and no investment advice.',
  alternates: { canonical: 'https://deposit.now/disclosures' },
  openGraph: {
    title: 'Disclosures',
    url: 'https://deposit.now/disclosures',
    siteName: 'Deposit Now',
  },
  robots: { index: true, follow: true },
};

const jsonLd = pageGraph(
  {
    '@type': 'WebPage',
    name: 'deposit.now Disclosures',
    url: 'https://deposit.now/disclosures',
    description:
      'Risk and regulatory disclosures for deposit.now x402 payment infrastructure.',
  },
  '/disclosures',
  'Disclosures'
);

export default function DisclosuresPage() {
  return (
    <ContentPage
      title="Disclosures"
      subtitle="Please read before using the API or integrating deposit.now."
      jsonLd={jsonLd}
    >
      <p>
        deposit.now provides <strong>programmable HTTP payment infrastructure</strong> for
        autonomous software agents. It is <strong>not</strong> a bank, broker-dealer, money
        transmitter, investment adviser, or custodian.
      </p>

      <h2>Non-custodial</h2>
      <p>
        We do not hold customer funds. USDC settlements occur on Base via the x402
        facilitator and are sent directly to on-chain addresses declared in the payment
        requirements. We cannot reverse, freeze, or recover on-chain transfers.
      </p>

      <h2>Cryptocurrency and stablecoin risk</h2>
      <ul>
        <li>
          <strong>USDC</strong> is a stablecoin subject to issuer, smart-contract, and
          regulatory risk. Depegs, blacklists, and network outages can affect settlement.
        </li>
        <li>
          <strong>Base</strong> is an L2 network. Bridge, sequencer, and contract risks apply.
        </li>
        <li>
          <strong>Irreversibility:</strong> confirmed on-chain payments cannot be undone by
          deposit.now.
        </li>
        <li>
          <strong>Volatility:</strong> while USDC is designed to track USD, it is not legal
          tender.
        </li>
      </ul>

      <h2>API fee vs deposit amount</h2>
      <p>
        The x402 micropayment (currently <strong>0.01 USDC per call</strong>) is the fee to
        access the API. The JSON fields <code>amount</code> and <code>account</code> in the
        request body describe deposit <em>intent</em> and may not represent a separate
        on-chain transfer unless explicitly documented for a merchant endpoint. Read the{' '}
        <a href="/litepaper">litepaper</a> for the economic model.
      </p>

      <h2>Experimental software</h2>
      <p>
        The x402 protocol, facilitators, and deposit.now are early-stage. Downtime, breaking
        changes, facilitator errors, and settlement delays are possible. Use at your own
        risk in production systems.
      </p>

      <h2>No financial or legal advice</h2>
      <p>
        Nothing on this site constitutes financial, tax, or legal advice. Consult qualified
        professionals before using crypto payment rails in regulated industries.
      </p>

      <h2>Public receipts</h2>
      <p>
        Settled payments may produce <strong>public receipts</strong> with wallet addresses
        and transaction hashes. Do not use the API if you cannot accept public on-chain
        attribution.
      </p>

      <h2>Geographic restrictions</h2>
      <p>
        You are responsible for compliance with laws in your jurisdiction. We may restrict
        access where required by law.
      </p>

      <h2>Forward-looking statements</h2>
      <p>
        Roadmap items (merchant endpoints, marketplace listings, pricing changes) are plans,
        not guarantees. See <a href="/about">about</a> for current status.
      </p>

      <h2>Contact</h2>
      <p>
        Questions: <a href="mailto:support@deposit.now">support@deposit.now</a>
      </p>
    </ContentPage>
  );
}