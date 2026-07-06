import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';
import { pageGraph } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Litepaper',
  description:
    'Technical and economic overview of deposit.now: x402 micropayments, verifiable receipts, non-custodial USDC settlement on Base mainnet, and the three-phase roadmap for agentic commerce.',
  alternates: { canonical: 'https://deposit.now/litepaper' },
  keywords: [
    'deposit.now litepaper',
    'x402 whitepaper',
    'AI agent deposits',
    'agentic commerce',
    'USDC Base',
    'HTTP 402 payments',
  ],
  openGraph: {
    title: 'Litepaper',
    description: 'x402 agent deposits, verifiable receipts, and roadmap.',
    url: 'https://deposit.now/litepaper',
    siteName: 'Deposit Now',
  },
  robots: { index: true, follow: true },
};

const jsonLd = pageGraph(
  {
    '@type': 'TechArticle',
    headline: 'deposit.now Litepaper — Programmable Agent Deposits via x402',
    description:
      'Non-custodial deposit infrastructure for AI agents using x402, USDC on Base mainnet, and public on-chain receipts.',
    author: { '@type': 'Organization', name: 'deposit.now' },
    publisher: { '@type': 'Organization', name: 'deposit.now' },
    url: 'https://deposit.now/litepaper',
    dateModified: '2026-07-05',
  },
  '/litepaper',
  'Litepaper'
);

export default function LitepaperPage() {
  return (
    <ContentPage
      title="Litepaper"
      subtitle="Programmable agent deposits over HTTP 402 — technical overview and roadmap."
      jsonLd={jsonLd}
    >
      <p>
        <strong>deposit.now</strong> is programmable funding infrastructure for autonomous
        AI agents. Agents call a single HTTP endpoint, receive{' '}
        <strong>402 Payment Required</strong>, pay in USDC on Base mainnet via the{' '}
        <strong>x402</strong> protocol, and receive a JSON response plus a{' '}
        <strong>verifiable public receipt</strong> linked to the settlement transaction.
      </p>

      <h2>Problem</h2>
      <p>
        Agents need to move money without human checkout flows, OAuth, or custodial accounts.
        Traditional APIs assume identity-first billing. Agentic commerce needs{' '}
        <strong>payment-first authorization</strong> — prove payment in the same request that
        triggers an action.
      </p>

      <h2>Solution</h2>
      <ul>
        <li>
          <strong>x402 v2 exact scheme</strong> — USDC micropayment per API call, facilitator
          verifies and settles before the handler runs.
        </li>
        <li>
          <strong>Non-custodial settlement</strong> — funds land on-chain at a declared{' '}
          <code>payTo</code> address; deposit.now never holds balances.
        </li>
        <li>
          <strong>Deterministic receipts</strong> — receipt ID derived from the payment
          signature; written to public storage after settlement with Basescan proof.
        </li>
        <li>
          <strong>Bazaar discovery extension</strong> — machine-readable input/output schemas
          in the 402 payload for agent marketplaces.
        </li>
      </ul>

      <h2>Architecture</h2>
      <ol>
        <li>Agent → <code>POST /api/deposit</code> → HTTP 402 + <code>Payment-Required</code></li>
        <li>Agent SDK signs payment → retry with <code>payment-signature</code> header</li>
        <li>x402 facilitator (CDP on mainnet) settles USDC on Base</li>
        <li>Route handler returns success + <code>receiptId</code> / <code>receiptUrl</code></li>
        <li>
          <code>onAfterSettle</code> hook persists receipt JSON →{' '}
          <code>/receipt/&lt;id&gt;</code>
        </li>
      </ol>

      <h2>Economics</h2>
      <p>Two distinct amounts exist in the protocol:</p>
      <ul>
        <li>
          <strong>API fee (real):</strong> 0.01 USDC per call — the x402 <code>price</code>{' '}
          in middleware. This is what agents pay to use the rail today.
        </li>
        <li>
          <strong>Deposit intent (metadata today, settlement tomorrow):</strong> JSON body{' '}
          <code>amount</code> / <code>account</code> describes the deposit to trigger. Phase 2
          routes this to merchant-specific settlement.
        </li>
      </ul>
      <p>
        Long-term revenue: <strong>merchant integration fees</strong>, volume-based settlement
        share, and <strong>lead routing</strong> — not high per-call tolls that block
        autonomous discovery.
      </p>

      <h2>Roadmap</h2>
      <table>
        <thead>
          <tr>
            <th>Phase</th>
            <th>Status</th>
            <th>Deliverable</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Live</td>
            <td>Verifiable deposit receipts (Vercel Blob + public receipt pages)</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Live</td>
            <td>Merchant-scoped deposit endpoints, catalog API, webhooks</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Live</td>
            <td>Bazaar extension, /.well-known/x402 manifest, OpenAPI + llms.txt</td>
          </tr>
        </tbody>
      </table>

      <h2>Live facts (mainnet)</h2>
      <ul>
        <li>Endpoint: <code>https://deposit.now/api/deposit</code></li>
        <li>Network: Base mainnet (<code>eip155:8453</code>)</li>
        <li>Asset: USDC <code>0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913</code></li>
        <li>Price: 10,000 atomic units (0.01 USDC)</li>
        <li>OpenAPI: <a href="/openapi.json">/openapi.json</a></li>
      </ul>

      <h2>Risk summary</h2>
      <p>
        See full <a href="/disclosures">disclosures</a>. deposit.now is experimental
        infrastructure, not a money transmitter, bank, or investment product. On-chain
        payments are irreversible.
      </p>
    </ContentPage>
  );
}