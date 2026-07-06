import type { Metadata } from 'next';
import { GuidePage } from '@/components/GuidePage';
import { pageGraph } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms for using deposit.now website and x402 API: acceptable use, as-is service, payment finality, limitation of liability, and governing law.',
  alternates: { canonical: 'https://deposit.now/terms' },
  openGraph: {
    title: 'Terms of Service',
    url: 'https://deposit.now/terms',
    siteName: 'Deposit Now',
  },
  robots: { index: true, follow: true },
};

const jsonLd = pageGraph(
  {
    '@type': 'WebPage',
    name: 'deposit.now Terms of Service',
    url: 'https://deposit.now/terms',
  },
  '/terms',
  'Terms of Service'
);

const nav = [
  { id: 'overview', label: 'Overview' },
  { id: 'service', label: 'Service description' },
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'payments', label: 'Payments' },
  { id: 'acceptable-use', label: 'Acceptable use' },
  { id: 'ip', label: 'Intellectual property' },
  { id: 'warranties', label: 'Warranties' },
  { id: 'liability', label: 'Liability' },
  { id: 'indemnity', label: 'Indemnity' },
  { id: 'termination', label: 'Termination' },
  { id: 'governing-law', label: 'Governing law' },
  { id: 'contact', label: 'Contact' },
];

export default function TermsPage() {
  return (
    <GuidePage
      kicker="Legal"
      title="Terms of Service"
      subtitle="Last updated: July 5, 2026"
      nav={nav}
      jsonLd={jsonLd}
    >
      <p id="overview">
        By accessing deposit.now or calling our API, you agree to these terms. If you do not
        agree, do not use the service.
      </p>

      <h2 id="service">Service description</h2>
      <p>
        deposit.now provides an HTTP API that requires x402 micropayments in USDC on Base.
        We provide receipts and documentation; we do not custody funds. See{' '}
        <a href="/disclosures">disclosures</a> for risk details.
      </p>

      <h2 id="eligibility">Eligibility</h2>
      <p>
        You must be able to form a binding contract in your jurisdiction. You may not use the
        service for illegal activity, sanctions evasion, fraud, or abuse.
      </p>

      <h2 id="payments">Payments</h2>
      <ul>
        <li>API access requires payment per the HTTP 402 requirements we return.</li>
        <li>On-chain settlements are processed by third-party facilitators, not deposit.now.</li>
        <li>Payments are final once confirmed on-chain.</li>
        <li>We may change pricing or networks with reasonable notice via docs or the API.</li>
      </ul>

      <h2 id="acceptable-use">Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Attack, overload, or scrape the service beyond normal agent use</li>
        <li>Impersonate merchants or misrepresent settlement destinations</li>
        <li>Use the API to launder funds or violate applicable law</li>
        <li>Attempt to bypass x402 payment requirements</li>
      </ul>

      <h2 id="ip">Intellectual property</h2>
      <p>
        deposit.now branding, site content, and documentation are protected unless
        otherwise noted. API clients may integrate per our{' '}
        <a href="/docs">documentation</a> and OpenAPI contract.
      </p>

      <h2 id="warranties">Disclaimer of warranties</h2>
      <p>
        THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
        NON-INFRINGEMENT.
      </p>

      <h2 id="liability">Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, DEPOSIT.NOW SHALL NOT BE LIABLE
        FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR LOSS OF
        FUNDS, DATA, OR PROFITS, ARISING FROM USE OF THE SERVICE OR ON-CHAIN SETTLEMENTS.
        OUR AGGREGATE LIABILITY SHALL NOT EXCEED THE GREATER OF USD $100 OR THE AMOUNT YOU
        PAID TO ACCESS THE API IN THE PRIOR 12 MONTHS.
      </p>

      <h2 id="indemnity">Indemnity</h2>
      <p>
        You agree to indemnify deposit.now against claims arising from your misuse of the
        service or violation of these terms.
      </p>

      <h2 id="termination">Termination</h2>
      <p>
        We may suspend or terminate access for abuse or legal compliance. On-chain
        settlements already completed remain governed by blockchain rules.
      </p>

      <h2 id="governing-law">Governing law</h2>
      <p>
        These terms are governed by the laws of the State of Wyoming, USA, without regard to
        conflict-of-law principles, except where prohibited.
      </p>

      <h2 id="contact">Contact</h2>
      <p>
        <a href="mailto:support@deposit.now">support@deposit.now</a>
      </p>
    </GuidePage>
  );
}