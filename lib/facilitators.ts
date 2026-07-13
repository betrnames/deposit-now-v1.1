export interface Facilitator {
  slug: string;
  name: string;
  description: string;
  link: string;
  fees: 'Free' | 'Low' | 'Variable' | 'Unknown';
  feeDetail: string;
  chains: string[];
  tokens: string[];
  schemes: string[];
  status: 'production' | 'testnet' | 'beta';
  openSource: boolean;
  selfHostable: boolean;
}

export const facilitators: Facilitator[] = [
  {
    slug: 'cdp-facilitator',
    name: 'CDP Facilitator',
    description:
      'Best-in-class x402 facilitator by Coinbase. Fee-free USDC settlement on Base Mainnet.',
    link: 'https://docs.cdp.coinbase.com/x402/docs/quickstart-sellers',
    fees: 'Free',
    feeDetail: 'Fee-free USDC settlement',
    chains: ['Base'],
    tokens: ['USDC'],
    schemes: ['exact'],
    status: 'production',
    openSource: false,
    selfHostable: false,
  },
  {
    slug: 'corbits',
    name: 'Corbits',
    description:
      'Production grade facilitator supporting multi-network, multi-token payment schemes.',
    link: 'https://corbits.dev',
    fees: 'Variable',
    feeDetail: 'Variable fees per network',
    chains: ['Multi-network'],
    tokens: ['Multi-token'],
    schemes: ['exact'],
    status: 'production',
    openSource: false,
    selfHostable: false,
  },
  {
    slug: 'mogami-facilitator',
    name: 'Mogami Facilitator',
    description:
      'Free, developer-focused, production-ready facilitator for x402 payments.',
    link: 'https://facilitator.mogami.tech',
    fees: 'Free',
    feeDetail: 'Free for all transactions',
    chains: ['Multi-network'],
    tokens: ['USDC'],
    schemes: ['exact'],
    status: 'production',
    openSource: false,
    selfHostable: false,
  },
  {
    slug: 'openx402-ai',
    name: 'OpenX402.ai Facilitator',
    description:
      'First permissionless, gasless and omnichain x402 facilitator.',
    link: 'https://openx402.ai',
    fees: 'Free',
    feeDetail: 'Gasless, permissionless',
    chains: ['Omnichain'],
    tokens: ['USDC'],
    schemes: ['exact'],
    status: 'production',
    openSource: false,
    selfHostable: false,
  },
  {
    slug: 'payai-facilitator',
    name: 'PayAI Facilitator',
    description:
      'Accept x402 payments on all networks including Avalanche, Base, Polygon, Solana.',
    link: 'https://facilitator.payai.network',
    fees: 'Variable',
    feeDetail: 'Variable fees, multi-chain',
    chains: ['Avalanche', 'Base', 'Polygon', 'Solana'],
    tokens: ['USDC'],
    schemes: ['exact'],
    status: 'production',
    openSource: false,
    selfHostable: false,
  },
  {
    slug: 'treasure-facilitator',
    name: 'Treasure Facilitator',
    description:
      'x402 Facilitator on Base and Base Sepolia. Supports EIP-3009 tokens.',
    link: 'https://x402.treasure.lol',
    fees: 'Variable',
    feeDetail: 'Standard fees, EIP-3009 support',
    chains: ['Base', 'Base Sepolia'],
    tokens: ['USDC'],
    schemes: ['exact', 'EIP-3009'],
    status: 'production',
    openSource: false,
    selfHostable: false,
  },
  {
    slug: 'worldfun-facilitator',
    name: 'WorldFun Facilitator',
    description:
      'Fee-free EIP-3009 payments in USDC and ERC-20 tokens on Base.',
    link: 'https://facilitator.world.fun',
    fees: 'Free',
    feeDetail: 'Fee-free EIP-3009 payments',
    chains: ['Base'],
    tokens: ['USDC', 'ERC-20'],
    schemes: ['EIP-3009'],
    status: 'production',
    openSource: false,
    selfHostable: false,
  },
  {
    slug: 'x402-org',
    name: 'x402.org Facilitator',
    description: 'Default testnet facilitator for x402.',
    link: 'https://x402.org',
    fees: 'Free',
    feeDetail: 'Free testnet facilitator',
    chains: ['Base Sepolia'],
    tokens: ['USDC'],
    schemes: ['exact'],
    status: 'testnet',
    openSource: false,
    selfHostable: false,
  },
  {
    slug: 'x402-rs',
    name: 'x402.rs Facilitator',
    description:
      'Independent, open-source facilitator in Rust. Easy self-host or hosted.',
    link: 'https://facilitator.x402.rs',
    fees: 'Variable',
    feeDetail: 'Self-host or hosted, variable fees',
    chains: ['Multi-network'],
    tokens: ['USDC'],
    schemes: ['exact'],
    status: 'production',
    openSource: true,
    selfHostable: true,
  },
  {
    slug: '0x402-ai',
    name: '0x402.ai',
    description:
      'Premier cloud infrastructure for x402. Become a facilitator in seconds.',
    link: 'https://0x402.ai',
    fees: 'Variable',
    feeDetail: 'Cloud-hosted facilitator',
    chains: ['Multi-network'],
    tokens: ['USDC'],
    schemes: ['exact'],
    status: 'production',
    openSource: false,
    selfHostable: false,
  },
  {
    slug: '1shot-api',
    name: '1Shot API',
    description:
      'General purpose facilitator to monetize n8n workflows with favorite ERC-20 token.',
    link: 'https://docs.1shotapi.com/automation/n8n.html#monetize-n8n-workflows-with-x402',
    fees: 'Variable',
    feeDetail: 'ERC-20 token support',
    chains: ['Multi-network'],
    tokens: ['ERC-20'],
    schemes: ['exact'],
    status: 'production',
    openSource: false,
    selfHostable: false,
  },
  {
    slug: 'altlayer',
    name: 'AltLayer',
    description:
      'x402 suite including gateway, facilitator, and decentralized agent hosting.',
    link: 'https://altlayer.io/',
    fees: 'Variable',
    feeDetail: 'Suite pricing',
    chains: ['Multi-network'],
    tokens: ['USDC'],
    schemes: ['exact'],
    status: 'production',
    openSource: false,
    selfHostable: false,
  },
  {
    slug: 'latinum',
    name: 'Latinum',
    description:
      'Open-source MCP wallet and facilitator for agents to pay x402 requests.',
    link: 'https://latinum.ai',
    fees: 'Free',
    feeDetail: 'Open-source, free',
    chains: ['Multi-network'],
    tokens: ['USDC'],
    schemes: ['exact'],
    status: 'production',
    openSource: true,
    selfHostable: true,
  },
  {
    slug: 'meridian',
    name: 'Meridian',
    description:
      'Multi-chain facilitator with developer-first features.',
    link: 'https://mrdn.finance',
    fees: 'Variable',
    feeDetail: 'Multi-chain fees',
    chains: ['Multi-network'],
    tokens: ['USDC'],
    schemes: ['exact'],
    status: 'production',
    openSource: false,
    selfHostable: false,
  },
  {
    slug: 'thirdweb',
    name: 'thirdweb',
    description:
      'Server-side TypeScript SDK and facilitator API supporting 170+ chains, 4000+ tokens.',
    link: 'https://portal.thirdweb.com/payments/x402/facilitator',
    fees: 'Variable',
    feeDetail: '170+ chains, 4000+ tokens',
    chains: ['Multi-network'],
    tokens: ['Multi-token'],
    schemes: ['exact'],
    status: 'production',
    openSource: false,
    selfHostable: false,
  },
  {
    slug: 'faremeter',
    name: 'Faremeter',
    description:
      'Lightweight OSS x402 framework powered by client-, middleware-, server-side plugins.',
    link: 'https://faremeter.xyz',
    fees: 'Free',
    feeDetail: 'Open-source framework',
    chains: ['Multi-network'],
    tokens: ['USDC'],
    schemes: ['exact'],
    status: 'production',
    openSource: true,
    selfHostable: true,
  },
  {
    slug: 'mogami-java',
    name: 'Mogami Java SDK',
    description:
      'Turn any endpoint into a pay-per-call API using x402 protocol. Java server SDK.',
    link: 'https://mogami.tech/#serverSDK',
    fees: 'Free',
    feeDetail: 'Free Java SDK',
    chains: ['Multi-network'],
    tokens: ['USDC'],
    schemes: ['exact'],
    status: 'production',
    openSource: false,
    selfHostable: true,
  },
  {
    slug: 'onchain-fi',
    name: 'Onchain',
    description:
      "x402's Intelligent Intermediary Layer for aggregating facilitators.",
    link: 'https://onchain.fi',
    fees: 'Variable',
    feeDetail: 'Facilitator aggregation',
    chains: ['Multi-network'],
    tokens: ['USDC'],
    schemes: ['exact'],
    status: 'production',
    openSource: false,
    selfHostable: false,
  },
  {
    slug: 'zeropay',
    name: 'ZeroPay',
    description:
      'Open crypto payment gateway for humans and AI agents.',
    link: 'https://zpaynow.com',
    fees: 'Variable',
    feeDetail: 'Crypto payment gateway',
    chains: ['Multi-network'],
    tokens: ['Multi-token'],
    schemes: ['exact'],
    status: 'production',
    openSource: false,
    selfHostable: false,
  },
];

export interface FacilitatorFilters {
  search: string;
  chain: string;
  fee: string;
  status: string;
}

export const defaultFilters: FacilitatorFilters = {
  search: '',
  chain: 'all',
  fee: 'all',
  status: 'all',
};

export function getAllChains(): string[] {
  const chains = new Set<string>();
  for (const f of facilitators) {
    for (const c of f.chains) chains.add(c);
  }
  return Array.from(chains).sort();
}

export function getAllTokens(): string[] {
  const tokens = new Set<string>();
  for (const f of facilitators) {
    for (const t of f.tokens) tokens.add(t);
  }
  return Array.from(tokens).sort();
}

export function filterFacilitators(filters: FacilitatorFilters): Facilitator[] {
  return facilitators.filter((f) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matches =
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.chains.some((c) => c.toLowerCase().includes(q)) ||
        f.tokens.some((t) => t.toLowerCase().includes(q));
      if (!matches) return false;
    }

    if (filters.chain !== 'all') {
      if (filters.chain === 'multi-chain') {
        const isMulti =
          f.chains.length > 1 ||
          f.chains.some((c) =>
            ['Multi-network', 'Omnichain'].includes(c)
          );
        if (!isMulti) return false;
      } else if (!f.chains.some((c) => c.toLowerCase() === filters.chain.toLowerCase())) {
        return false;
      }
    }

    if (filters.fee !== 'all' && f.fees.toLowerCase() !== filters.fee.toLowerCase()) {
      return false;
    }

    if (filters.status !== 'all' && f.status !== filters.status) {
      return false;
    }

    return true;
  });
}
