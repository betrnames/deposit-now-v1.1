import type { Metadata } from 'next';
import { GuidePage } from '@/components/GuidePage';
import { ComparisonTable } from '@/components/ComparisonTable';
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

const nav = [
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'Problem' },
  { id: 'solution', label: 'Solution' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'why-compare', label: 'vs direct transfer' },
  { id: 'economics', label: 'Economics' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'live-facts', label: 'Live facts' },
  { id: 'risk', label: 'Risk summary' },
];

export default function LitepaperPage() {
  return (
    <GuidePage
      kicker="Technical overview"
      title="Litepaper"
      subtitle="Programmable agent deposits over HTTP 402 — technical overview and roadmap."
      nav={nav}
      jsonLd={jsonLd}
    >
      <p id="overview">
        <strong>deposit.now</strong> is programmable funding infrastructure for autonomous
        AI agents. Agents call a single HTTP endpoint, receive{' '}
        <strong>402 Payment Required</strong>, pay in USDC on Base mainnet via the{' '}
        <strong>x402</strong> protocol, and receive a JSON response plus a{' '}
        <strong>verifiable public receipt</strong> linked to the settlement transaction.
      </p>

      <h2 id="problem">Problem</h2>
      <p>
        Agents need to move money without human checkout flows, OAuth, or custodial accounts.
        Traditional APIs assume identity-first billing. Agentic commerce needs{' '}
        <strong>payment-first authorization</strong> — prove payment in the same request that
        triggers an action.
      </p>

      <h2 id="solution">Solution</h2>
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

      <h2 id="architecture">Architecture</h2>
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

      <h2 id="why-compare">Why not a direct on-chain transfer?</h2>
      <p>
        Direct USDC transfers give agents a tx hash. deposit.now gives{' '}
        <strong>verifiable public receipts</strong>, <strong>merchant webhooks</strong> (
        <code>deposit.settled</code>), <strong>Bazaar discovery</strong>, and a{' '}
        <strong>standardized x402 client flow</strong> with retries and idempotency. Direct
        transfers are raw plumbing; deposit.now is the production rail for agent-to-merchant
        commerce.
      </p>
      <ComparisonTable compact />

      <h2 id="economics">Economics</h2>
      <p>Three distinct amounts exist in the protocol:</p>
      <ul>
        <li>
          <strong>Agent rail (real today):</strong> 0.01 USDC per call — the x402{' '}
          <code>price</code> in middleware. Paid by the agent, not the merchant. Covers
          facilitator settlement, receipt storage, and discovery indexing.
        </li>
        <li>
          <strong>Merchant settlement fee (usage-based):</strong> a small % of each deposit
          settled to the merchant&apos;s <code>payTo</code> address. Non-custodial — funds
          never touch deposit.now wallets. See{' '}
          <a href="/pricing">pricing tiers</a>.
        </li>
        <li>
          <strong>Deposit intent (metadata):</strong> JSON body <code>amount</code> /{' '}
          <code>account</code> describes the deposit to trigger on the merchant endpoint.
        </li>
      </ul>
      <p>
        <strong>Merchant tiers:</strong> Catalog (free, 0.30% settlement), Rail ($49/mo, 0.15% +
        webhooks), Network (custom volume rates). Rail+ includes{' '}
        <strong>5% referral rev-share</strong> on first deposits from Bazaar-routed agents.
        Full breakdown: <a href="/pricing">deposit.now/pricing</a>.
      </p>

      <h2 id="roadmap">Roadmap</h2>
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

      <h2 id="live-facts">Live facts (mainnet)</h2>
      <ul className="min-w-0">
        <li className="break-words">
          Endpoint:{' '}
          <code className="break-all">https://deposit.now/api/deposit</code>
        </li>
        <li>Network: Base mainnet (<code>eip155:8453</code>)</li>
        <li className="break-words">
          Asset: USDC
          <code className="block sm:inline sm:ml-1 mt-0.5 sm:mt-0 break-all">
            0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
          </code>
        </li>
        <li>Price: 10,000 atomic units (0.01 USDC)</li>
        <li>OpenAPI: <a href="/openapi.json">/openapi.json</a></li>
      </ul>

      <h2 id="risk">Risk summary</h2>
      <p>
        See full <a href="/disclosures">disclosures</a>. deposit.now is experimental
        infrastructure, not a money transmitter, bank, or investment product. On-chain
        payments are irreversible.
      </p>
    </GuidePage>
  );
}