/**
 * Canonical product messaging for deposit.now.
 * Import from here for UI, metadata, discovery, and agent docs so the story stays consistent.
 */

export const PRODUCT = {
  name: 'deposit.now',
  /** Short product identity used in titles */
  productLine: 'Open x402 funding rail',
  titleDefault: 'deposit.now | Open x402 funding rail',
  titleTemplate: '%s | deposit.now',

  /** Primary one-liner (homepage subhead, OG, Twitter) */
  tagline: 'Agents fund any wallet — or provision a managed child — via one HTTP call',

  /** Compact tagline without provision (footer, tight spaces) */
  taglineShort: 'Open x402 funding rail for agents · amount + 1%',

  /** Supporting line under hero */
  valueProps: 'Autonomous deposits · amount + 1% · no humans · no API key needed',

  /** Meta / SEO description */
  description:
    'Open x402 funding rail for agents: fund any EVM wallet or provision a managed child via one HTTP call. Pay amount + 1% over HTTP 402; net forwards after settlement. No deposit.now API key.',

  /** Docs intro (plain text, no JSX) */
  intro:
    'deposit.now is an open x402 funding rail: POST /api/deposit with either a target address or provision:true + label, pay amount + 1% via x402, and the platform forwards net USDC after settlement. Optional managed child wallets are platform-managed in CDP (no key export in v1). Complements Coinbase CDP Fund/Send — does not replace it inside the CDP stack.',

  /** WebAPI / structured data */
  apiDescription:
    'Open x402 deposit API: POST target+amount or provision:true+label+amount; pay amount + 1% USDC on Base; net forwarded after settlement. Optional managed child wallets (CDP, platform-managed). Optional public receipts. Complements Coinbase CDP Fund/Send.',

  feeNote: '1% platform fee on net deposit amount via x402 exact scheme on Base mainnet.',

  networkLabel: 'Base mainnet (eip155:8453) in production',

  modes: {
    fundExisting: {
      title: 'Fund existing wallet',
      body: '{ target, amount, memo? } — any EVM address you already control',
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
      a: 'deposit.now is an open x402 funding rail: agents pay amount + 1% over HTTP 402 and net USDC is forwarded to a target they specify, or to a managed child wallet created with provision:true + label. Complements Coinbase CDP Fund/Send; managed children are platform-managed in CDP with no key export in v1.',
    },
    {
      q: 'How does a deposit work?',
      a: 'POST /api/deposit with { target, amount } or { provision: true, label, amount }. Receive HTTP 402 for amount + 1%. Pay via x402. After settlement, the platform forwards net to target (or the provisioned child). Response status is payment_received; check receiptUrl for forwardStatus and Basescan links when available.',
    },
    {
      q: 'Can I fund any wallet or create a child?',
      a: 'Yes. Pass target for any EVM address you already have, or provision:true with a stable label to create/resolve a managed CDP child and fund it in the same call. Managed children are platform_managed (no private-key export in v1).',
    },
    {
      q: 'When should I use Coinbase Fund instead?',
      a: 'If your agents already use Coinbase Agentic or Server Wallets, CDP Fund/Send is usually the right tool. Use deposit.now for a protocol-shaped x402 deposit to any EVM target — or managed child provision — without a deposit.now API key.',
    },
  ] as const,

  keywords: [
    'x402 deposit API',
    'AI agent funding',
    'HTTP 402',
    'USDC Base',
    'fund wallet x402',
    'child agent wallet',
    'provision agent wallet',
    'programmable deposits',
    'machine payments',
    'deposit.now',
  ],

  ogImageAlt: 'deposit.now — Open x402 funding rail for agents',
} as const;

export type ProductCopy = typeof PRODUCT;
