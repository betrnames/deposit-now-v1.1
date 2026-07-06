import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';
import { pageGraph } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How deposit.now handles data: waitlist emails, public on-chain receipt data, analytics, and third-party infrastructure. Non-custodial — we do not hold funds or wallet keys.',
  alternates: { canonical: 'https://deposit.now/privacy' },
  openGraph: {
    title: 'Privacy Policy',
    url: 'https://deposit.now/privacy',
    siteName: 'Deposit Now',
  },
  robots: { index: true, follow: true },
};

const jsonLd = pageGraph(
  {
    '@type': 'WebPage',
    name: 'deposit.now Privacy Policy',
    url: 'https://deposit.now/privacy',
    description: 'Privacy practices for deposit.now x402 API and website.',
  },
  '/privacy',
  'Privacy Policy'
);

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      subtitle="Last updated: July 5, 2026"
      jsonLd={jsonLd}
    >
      <p>
        deposit.now (&quot;we,&quot; &quot;us&quot;) operates this site and API. This policy
        explains what information we collect when you use{' '}
        <a href="https://deposit.now">deposit.now</a> and our x402 API.
      </p>

      <h2>What we do not collect</h2>
      <ul>
        <li>We do not custody funds or store user wallet private keys.</li>
        <li>We do not require accounts, passwords, or KYC for API access.</li>
        <li>We do not receive your full payment signing keys — agents sign locally.</li>
      </ul>

      <h2>Information we may collect</h2>
      <h3>Waitlist and contact</h3>
      <p>
        If you submit your email on our website or contact us, we store that address to
        respond or send product updates. You can request deletion via{' '}
        <a href="mailto:support@deposit.now">support@deposit.now</a>.
      </p>

      <h3>On-chain and receipt data (public)</h3>
      <p>
        When the x402 facilitator settles a payment, we may persist a{' '}
        <strong>public receipt</strong> including payer address, pay-to address, amount,
        network, transaction hash, and timestamp. Receipts are intentionally public at{' '}
        <code>/receipt/&lt;id&gt;</code> for verification. Blockchain data is already public
        on Basescan.
      </p>

      <h3>API request metadata</h3>
      <p>
        Our host (Vercel) and facilitators may log IP addresses, timestamps, and request
        headers for security and operations. We do not sell this data.
      </p>

      <h3>Analytics</h3>
      <p>
        We use Google Analytics (GA4) on the marketing site to understand traffic. You may
        use browser extensions or settings to limit tracking.
      </p>

      <h2>Third-party services</h2>
      <ul>
        <li>
          <strong>Vercel</strong> — hosting, serverless functions, blob storage for receipts
        </li>
        <li>
          <strong>Coinbase Developer Platform (CDP)</strong> — x402 facilitator on Base
          mainnet
        </li>
        <li>
          <strong>Google Analytics</strong> — website analytics
        </li>
      </ul>

      <h2>Data retention</h2>
      <p>
        Waitlist emails are kept until you unsubscribe or request deletion. Public receipts
        persist until we remove them for abuse or legal compliance. On-chain transactions
        cannot be deleted.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on your jurisdiction, you may request access, correction, or deletion of
        personal data we control (e.g. email). Contact{' '}
        <a href="mailto:support@deposit.now">support@deposit.now</a>.
      </p>

      <h2>Children</h2>
      <p>deposit.now is not directed at children under 13.</p>

      <h2>Changes</h2>
      <p>
        We may update this policy. Material changes will be reflected on this page with an
        updated date.
      </p>
    </ContentPage>
  );
}