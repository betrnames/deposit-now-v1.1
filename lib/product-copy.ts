/**
 * Canonical product messaging for deposit.now.
 * Import from here for UI, metadata, discovery, and agent docs so the story stays consistent.
 * Fee math lives in lib/billing.ts — these strings must follow that function.
 */

export const PRODUCT = {
  name: 'deposit.now',
  /** Short product identity used in titles */
  productLine: 'Open x402 funding rail',
  /**
   * Default <title> — brand first so Google brand queries disambiguate from
   * banking "Deposit Now" / college deposit pages.
   */
  titleDefault: 'deposit.now — x402 Agent Funding Rail (USDC on Base + Solana)',
  titleTemplate: '%s | deposit.now',
  /** Docs page title (with template → "… | deposit.now") */
  docsTitle: 'API Docs — x402 Deposit Endpoint for AI Agents',

  /** Primary one-liner (homepage subhead, OG, Twitter) */
  tagline: 'Agents fund any wallet — or provision a managed child — via one HTTP call',

  /** Compact tagline without provision (footer, tight spaces) */
  taglineShort: 'Open x402 funding rail for agents · Base + Solana · 0.25% fee, $0.25 cap',

  /** Supporting line under hero */
  valueProps: 'Autonomous deposits · 0.25% fee ($0.25 cap) · Base + Solana · no API key needed',

  /** Meta / SEO description (~155 chars; brand + niche terms for ranking) */
  description:
    'deposit.now is the open x402 agent funding rail: POST /api/deposit to fund any Base or Solana wallet or provision a managed child. Pay 0.25% (min $0.001, max $0.25) USDC via HTTP 402. No API key.',

  /** Docs intro (plain text, no JSX) */
  intro:
    'deposit.now is an open x402 funding rail: POST /api/deposit with either a target address or provision:true + label, pay 0.25% (min $0.001, max $0.25) via x402 on Base or Solana, and the platform forwards net USDC after settlement on the same chain. Optional managed child wallets are platform-managed in CDP on Base (no key export in v1). Complements Coinbase CDP Fund/Send — does not replace it inside the CDP stack.',

  /** WebAPI / structured data */
  apiDescription:
    'Open x402 deposit API: POST target+amount or provision:true+label+amount; pay 0.25% USDC on Base or Solana (min $0.001, max $0.25); net forwarded on the same chain. Optional managed child wallets (CDP on Base, platform-managed). Optional public receipts. Complements Coinbase CDP Fund/Send.',

  feeNote:
    '0.25% platform fee, $0.001 minimum, $0.25 maximum — always under the $0.32 average x402 payment.',

  /** Short fee phrase for recipes, 402 bodies, and agent docs */
  feeGrossPhrase: 'amount + 0.25% (min $0.001, max $0.25)',

  feeShort: '0.25% · $0.001 min · $0.25 max',

  networkLabel: 'Base (eip155:8453) and Solana mainnet in production',

  modes: {
    fundExisting: {
      title: 'Fund existing wallet',
      body: '{ target, amount, memo? } — any Base EVM or Solana address you already control',
    },
    provisionChild: {
      title: 'Provision + fund child',
      body: '{ provision: true, label, amount, memo? } — managed CDP child wallet',
    },
  },

  managedChildren:
    'Managed children use CDP Server Wallets under deposit.now. Custody is platform_managed: v1 does not export private keys or offer a child spend API. For a child that signs under your own key, generate an address and pass target.',

  paymentReceivedHonesty:
    'HTTP 200 status payment_received means x402 payment was accepted — not that the target already holds funds. Check receiptUrl / forwardStatus (pending | settled | forward_failed | held).',

  cdpVsDeposit:
    'If agents already run on Coinbase Agentic or Server Wallets, CDP Fund/Send is usually the right tool inside that stack. Use deposit.now for an open x402 deposit to any target — or to provision a managed child — without a deposit.now API key.',

  noBrowserWallet:
    'deposit.now is an agent / API rail. You do not connect a browser wallet on this site to use the product.',

  faq: [
    {
      q: 'What is deposit.now?',
      a: 'deposit.now is an open x402 funding rail: agents pay 0.25% (min $0.001, max $0.25) over HTTP 402 on Base or Solana and net USDC is forwarded to a target they specify, or to a managed child wallet created with provision:true + label (Base). Complements Coinbase CDP Fund/Send; managed children are platform-managed in CDP with no key export in v1.',
    },
    {
      q: 'How does a deposit work?',
      a: 'POST /api/deposit with { target, amount } or { provision: true, label, amount }. Receive HTTP 402 for amount + 0.25% (min $0.001, max $0.25). Pay via x402 on the same chain as target (Base for 0x, Solana for base58). After settlement, the platform forwards net to target (or the provisioned child). Response status is payment_received; check receiptUrl for forwardStatus and explorer links when available.',
    },
    {
      q: 'Can I fund any wallet or create a child?',
      a: 'Yes. Pass target for any Base EVM or Solana address you already have, or provision:true with a stable label to create/resolve a managed CDP child on Base and fund it in the same call. Managed children are platform_managed (no private-key export in v1).',
    },
    {
      q: 'When should I use Coinbase Fund instead?',
      a: 'If your agents already use Coinbase Agentic or Server Wallets, CDP Fund/Send is usually the right tool. Use deposit.now for a protocol-shaped x402 deposit to any Base or Solana target — or managed child provision on Base — without a deposit.now API key.',
    },
  ] as const,

  keywords: [
    'deposit.now',
    'x402',
    'x402 deposit API',
    'x402 agent payments',
    'AI agent funding',
    'agent wallet funding',
    'HTTP 402 payment',
    'USDC Base',
    'USDC Solana',
    'Base mainnet USDC',
    'Solana USDC x402',
    'fund EVM wallet API',
    'fund Solana wallet API',
    'fund wallet x402',
    'child agent wallet',
    'provision agent wallet',
    'managed CDP wallet',
    'programmable deposits',
    'machine payments',
    'autonomous agent USDC',
    'Coinbase x402',
  ],

  ogImageAlt: 'deposit.now — Open x402 funding rail for AI agents (USDC on Base and Solana)',
} as const;

export type ProductCopy = typeof PRODUCT;
