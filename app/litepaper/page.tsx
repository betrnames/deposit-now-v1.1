import type { Metadata } from 'next';
import { GuidePage } from '@/components/GuidePage';
import { ComparisonTable } from '@/components/ComparisonTable';
import { pageGraph } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Litepaper',
  description:
    'Technical overview of deposit.now: the funding layer for AI agents — x402 programmable deposits, 1% fee, Base mainnet, parent-to-child funding.',
  alternates: { canonical: 'https://deposit.now/litepaper' },
  keywords: [
    'deposit.now litepaper',
    'AI agent funding',
    'x402 deposit API',
    'agent-to-agent transfers',
    'USDC Base',
  ],
  openGraph: {
    title: 'Litepaper | deposit.now',
    description: 'The Funding Layer for AI Agents — technical overview.',
    url: 'https://deposit.now/litepaper',
    siteName: 'deposit.now',
  },
  robots: { index: true, follow: true },
};

const jsonLd = pageGraph(
  {
    '@type': 'TechArticle',
    headline: 'deposit.now Litepaper — Funding Layer for AI Agents',
    description:
      'Programmable deposits via x402 for AI agents: fund any wallet including sub-wallets and child agents.',
    author: { '@type': 'Organization', name: 'deposit.now' },
    publisher: { '@type': 'Organization', name: 'deposit.now' },
    url: 'https://deposit.now/litepaper',
    dateModified: '2026-07-15',
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
  { id: 'live-facts', label: 'Live facts' },
  { id: 'risk', label: 'Risk summary' },
];

export default function LitepaperPage() {
  return (
    <GuidePage
      kicker="Technical overview"
      title="Litepaper"
      subtitle="The Funding Layer for AI Agents — programmable deposits over HTTP 402."
      nav={nav}
      jsonLd={jsonLd}
    >
      <p id="overview">
        <strong>deposit.now</strong> is programmable funding infrastructure for autonomous AI
        agents. Agents call a single HTTP endpoint with a <strong>target wallet</strong> and net
        amount, receive <strong>402 Payment Required</strong> for amount + 1%, pay USDC on Base via{' '}
        <strong>x402</strong>, and receive a JSON response plus a{' '}
        <strong>verifiable public receipt</strong>. Net funds are forwarded to the target —
        including sub-wallets and child agents. No humans required for secondary flows.
      </p>

      <h2 id="problem">Problem</h2>
      <p>
        Multi-agent systems need to fund sub-agents and wallets without human checkout, OAuth, or
        merchant onboarding. Direct transfers lack receipts, standardized 402 flow, and a thin
        funding abstraction agents can call programmatically.
      </p>

      <h2 id="solution">Solution</h2>
      <ul>
        <li>
          <strong>One deposit call</strong> — <code>POST /api/deposit</code> with{' '}
          <code>target</code>, <code>amount</code>, optional <code>memo</code>.
        </li>
        <li>
          <strong>x402 v2 exact scheme</strong> — agent pays gross (amount + 1%) in USDC; facilitator
          verifies on-chain before success.
        </li>
        <li>
          <strong>CDP forward</strong> — platform retains fee, forwards net to target via Coinbase
          Agentic / Server Wallet.
        </li>
        <li>
          <strong>Deterministic receipts</strong> — public proof with payment and forward txs.
        </li>
      </ul>

      <h2 id="architecture">Architecture</h2>
      <ol>
        <li>
          Agent → <code>POST /api/deposit</code> → HTTP 402 + <code>Payment-Required</code>
        </li>
        <li>Agent SDK signs payment for gross amount → retry with payment header</li>
        <li>x402 facilitator (CDP on mainnet) settles USDC to platform wallet</li>
        <li>
          <code>onAfterSettle</code> → fee kept · net forwarded to <code>target</code>
        </li>
        <li>
          Success + <code>receiptId</code> · public page at <code>/receipt/&lt;id&gt;</code>
        </li>
      </ol>

      <h2 id="why-compare">Why not a direct on-chain transfer?</h2>
      <p>
        Direct transfers give a tx hash. deposit.now adds a standardized x402 client path,
        verifiable receipts, amount+fee accounting, and a single agent-facing API for parent → child
        funding.
      </p>
      <div className="my-6">
        <ComparisonTable compact />
      </div>

      <h2 id="economics">Economics</h2>
      <ul>
        <li>
          <strong>Net amount (to target):</strong> the <code>amount</code> field.
        </li>
        <li>
          <strong>Platform fee:</strong> flat <strong>1%</strong> of net, paid by the agent as part of
          gross x402 payment.
        </li>
        <li>
          No merchant tiers, renewals, or prepaid balances. See{' '}
          <a href="/pricing">pricing</a>.
        </li>
      </ul>

      <h2 id="live-facts">Live facts (mainnet)</h2>
      <ul className="min-w-0">
        <li className="break-words">
          Endpoint: <code className="break-all">https://deposit.now/api/deposit</code>
        </li>
        <li>Network: Base mainnet (<code>eip155:8453</code>)</li>
        <li>Asset: USDC</li>
        <li>Price: dynamic — amount + 1%</li>
        <li>
          OpenAPI: <a href="/openapi.json">/openapi.json</a>
        </li>
        <li>
          Agents: <a href="/llms.txt">/llms.txt</a>
        </li>
      </ul>

      <h2 id="risk">Risk summary</h2>
      <p>
        See full <a href="/disclosures">disclosures</a>. deposit.now is experimental
        infrastructure, not a money transmitter, bank, or investment product. On-chain payments are
        irreversible. Platform forwarding depends on CDP wallet health and on-chain conditions.
      </p>
    </GuidePage>
  );
}
