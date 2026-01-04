'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { NodeExchangeIcon } from '@/components/icons';
import { ExternalLink, Github, Mail, Sun } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface EcosystemProject {
  name: string;
  description: string;
  link: string;
}

const ecosystemData = {
  clients: [
    { name: 'Axios & Fetch Clients', description: 'Reference TypeScript clients for x402 using both Axios and Fetch', link: 'https://github.com/coinbase/x402/tree/main/examples/typescript/clients' },
    { name: 'Bino', description: 'The autonomous AI agent framework. Consumes x402 paywalled services to collaborate', link: 'https://github.com/iotexproject/binoSwarm/tree/main/packages/plugin-swarm' },
    { name: 'Ekai Labs', description: 'Universal context layer for AI. Keep context portable, persistent and yours', link: 'https://ekailabs.xyz' },
    { name: 'Genbase', description: 'Next-gen AI video platform with x402', link: 'https://genbase.fun' },
    { name: 'Mogami Java Client SDK', description: 'Makes it easy to bring x402 payments into your Java application', link: 'https://mogami.tech/#clientSDK' },
    { name: 'Nuwa AI', description: 'User-friendly AI client that connects you to x402-compatible AI services', link: 'https://nuwa.dev/' },
    { name: 'Subnano', description: 'Micropayment content platform enabling creators to earn instantly', link: 'https://subnano.me/' },
    { name: 'thirdweb', description: 'Client side TypeScript SDK and HTTP API to pay for any x402 compatible endpoint', link: 'https://portal.thirdweb.com/payments/x402/client' },
    { name: 'AI Frens by Treasure', description: 'Launch x402-compatible AI character token and grow with community', link: 'https://aifrens.lol' },
    { name: 'Tweazy', description: 'Best way to read tweets onchain / Powered by x402, MCP & CDP Smart Wallets', link: 'https://github.com/aaronjmars/tweazy' }
  ],
  services: [
    { name: 'AEON', description: 'Omnichain settlement layer enabling AI agents to pay merchants across SEA, LATAM, Africa', link: 'https://aeon.xyz/AIPayment' },
    { name: 'AiMo Network', description: 'Permissionless API connecting humans, AI agents, and service providers without gatekeepers', link: 'https://aimo.network' },
    { name: 'AIsa', description: 'Resource marketplace aggregating LLMs and data APIs based on HTTP 402 standard', link: 'https://aisa.one' },
    { name: 'AurraCloud', description: 'AI agents hosting platform with MCP, smartWallets, OpenAI API compatibility and x402', link: 'https://aurracloud.com/x402' },
    { name: 'Cybercentry', description: 'AI-powered security endpoints structured around Compliance, Intelligence, Protection', link: 'https://cybercentry.gitbook.io/cybercentry/documents/x402-cybercentry' },
    { name: 'Elsa x402', description: 'DeFi API endpoints with x402 micropayments. Access portfolio data, token prices', link: 'https://x402.heyelsa.ai' },
    { name: 'Firecrawl', description: 'Web scraping API that allows you to turn websites into LLM-ready data', link: 'https://firecrawl.dev' },
    { name: 'Gloria AI', description: 'AI-powered provider of real-time, high-signal, customizable news data to AI agents', link: 'https://itsgloria.ai' },
    { name: 'Grove API', description: 'Unified API you can /fund using x402 to /tip anyone on the internet', link: 'https://grove.city/api' },
    { name: 'Heurist Deep Research', description: 'Web3 native AI research platform. Pay per-query for comprehensive reports', link: 'https://research.heurist.ai' },
    { name: 'Imagine', description: 'Coin it once, remix forever. Use API to generate media using templates', link: 'https://imagineclub.gitbook.io/docs/' },
    { name: 'Minifetch', description: 'Fetch rich, structured metadata from web pages with pay-as-you-go micropayments', link: 'https://minifetch.com' },
    { name: 'Neynar', description: 'Powering social data on Farcaster for agents and humans. Get cast info and more', link: 'https://neynar.com' },
    { name: 'Onchain', description: "x402's Intelligent Intermediary Layer for Aggregating Facilitators", link: 'https://onchain.fi' },
    { name: 'Otto AI Agent Swarm', description: 'AI-powered crypto intelligence. Real-time news, token analysis, market signals', link: 'https://docs.ottowallet.xyz/introduction/otto-ai-swarm' },
    { name: 'Pinata', description: 'Account-free IPFS uploads/retrievals using crypto payments powered by x402', link: 'https://402.pinata.cloud/' },
    { name: 'Proofivy', description: 'Attestation and x402 paywalled publishing via WordPress plugin or custom tools', link: 'https://proofivy.com' },
    { name: 'Questflow', description: 'Orchestration layer for multi-agent economy. Orchestrate agents autonomously on-chain', link: 'https://questflow.ai' },
    { name: 'QuickSilver', description: 'Bridge between physical systems and AI for real-world applications', link: 'https://data.iotex.ai' },
    { name: 'SerenAI x402 Gateway', description: 'Production gateway enabling AI agents to pay for database queries via x402', link: 'https://serendb.com' },
    { name: 'SLAMai', description: 'Definitive platform for smart money intelligence with APIs and MCP layer for agents', link: 'https://www.slamai.xyz/' },
    { name: 'Snack Money API', description: 'Micropayment platform for X, Farcaster, baseapp and verifiable identities', link: 'https://api.snack.money/docs' },
    { name: 'tip.md', description: 'Crypto tipping service enabling AI assistants to send cryptocurrency tips via chat', link: 'https://www.tip.md/documentation?tab=mcp-server' },
    { name: 'Zyte API', description: 'Unified Web Scraping API for unblocking, browser rendering and extraction', link: 'https://python-zyte-api.readthedocs.io/en/stable/use/x402.html' }
  ],
  infrastructure: [
    { name: '0x402.ai', description: 'Premier Cloud Infrastructure for x402. Become facilitator in seconds', link: 'https://0x402.ai' },
    { name: '1Shot API', description: 'General purpose facilitator to monetize n8n workflows with favorite ERC-20 token', link: 'https://docs.1shotapi.com/automation/n8n.html#monetize-n8n-workflows-with-x402' },
    { name: '402104', description: 'Generate expirable, paywalled links to private ANS-104 DataItems on Arweave', link: 'https://402.load.network' },
    { name: 'AltLayer', description: 'Provides x402 suite including gateway, facilitator, decentralized agent hosting', link: 'https://altlayer.io/' },
    { name: 'Cascade', description: 'Revenue distribution infrastructure for Solana and Base. Split payments', link: 'https://cascade.fyi' },
    { name: 'CodeNut', description: 'Web3 vibe-coding platform for building and deploying x402-enabled applications', link: 'https://www.codenut.ai/x402' },
    { name: 'DappLooker AI', description: 'Unified on-chain/market intelligence APIs with native x402 support', link: 'https://dapplooker.ai/' },
    { name: 'Daydreams Router', description: 'x402 enabled LLM inference for agents and applications', link: 'https://router.daydreams.systems' },
    { name: 'Faremeter', description: 'Lightweight OSS x402 framework powered by client-, middleware-, server-side plugins', link: 'https://faremeter.xyz' },
    { name: 'Fluora', description: 'MonetizedMCP marketplace enabling AI agents to autonomously find and purchase services', link: 'https://www.fluora.ai/' },
    { name: 'FluxA', description: 'Permissionless deferred payment rails for x402. Fast parallel stablecoin micropayments', link: 'https://fluxapay.xyz' },
    { name: 'Heurist Mesh', description: 'Library of composable crypto skills for AI agents. MCP and x402 support', link: 'https://mesh.heurist.ai/' },
    { name: 'Latinum Agentic Commerce', description: 'Open-source MCP wallet and facilitator for agents to pay x402 requests', link: 'https://latinum.ai' },
    { name: 'Locus', description: 'MCP-enabled wallet for controlling agent spending with auto-generated x402 endpoint tools', link: 'https://paywithlocus.com' },
    { name: 'MCP Server Example', description: 'Reference implementation MCP server and wallet to call x402 endpoints', link: 'https://github.com/coinbase/x402/tree/main/examples/typescript/mcp' },
    { name: 'MCPay', description: 'Build and monetize MCP servers', link: 'https://mcpay.tech' },
    { name: 'Meridian', description: 'Multi-chain facilitator with developer-first features', link: 'https://mrdn.finance' },
    { name: 'Meson x402', description: 'Chrome extension to connect EVM & Solana wallets, test x402 interfaces', link: 'https://chromewebstore.google.com/detail/meson-x402/ppdppbgbdlnnmompceomhadjminblalp' },
    { name: 'Mogami Java Server SDK', description: 'Turn any endpoint into pay-per-call API using x402 protocol', link: 'https://mogami.tech/#serverSDK' },
    { name: 'Node Servers', description: 'Reference x402 implementations in Node.js using Hono, Express, advanced examples', link: 'https://github.com/coinbase/x402/tree/main/examples/typescript/servers' },
    { name: 'PredictOS', description: 'Open-source framework for deploying AI agents for prediction markets', link: 'https://github.com/PredictionXBT/PredictOS/blob/main/docs/features/x402-integration.md' },
    { name: 'Proxy402', description: 'Turn your URLs into paid content. Set price, share link, collect payments instantly', link: 'https://proxy402.com/' },
    { name: 'x402-secure', description: 'Real-time risk control for AI-driven x402 payments with fraud prevention', link: 'https://x402-secure.t54.ai/' },
    { name: 'thirdweb', description: 'Server side TypeScript SDK and facilitator API supporting 170+ chains, 4000+ tokens', link: 'https://portal.thirdweb.com/payments/x402/facilitator' },
    { name: 'TokenMesa', description: 'Launch service-backed token based on x402 with auto token conversion', link: 'https://www.tokenmesa.com' },
    { name: 'X402 Kit', description: 'Fully modular Rust SDK for building complex x402 payment integrations', link: 'https://github.com/AIMOverse/x402-kit' },
    { name: 'x402 Market', description: 'Permissionless Launchpad for x402-Enabled Services by AWE Network', link: 'https://x402.world.fun' },
    { name: 'x402list.fun', description: 'Discover and analyze x402 services ecosystem. Search, compare pricing and metrics', link: 'https://x402list.fun' },
    { name: 'x402scan', description: 'Ecosystem explorer for x402 resources and analytics', link: 'https://x402scan.com' },
    { name: 'x402station', description: 'Leading x402 analytics platform with UI for monitoring services', link: 'https://x402station.com/' },
    { name: 'ZeroPay', description: 'Open crypto payment gateway for humans and AI agents', link: 'https://zpaynow.com' },
    { name: 'zkStash', description: 'Permissionless Shared Memory Layer for agents with native x402 payment support', link: 'https://zkstash.ai' }
  ],
  resources: [
    { name: 'Mogami Examples', description: 'Learn x402 in Java with real client, server, and hosted examples', link: 'https://mogami.tech/#examples' },
    { name: 'x402 Example Gallery', description: 'Collection of x402 examples including Next.js, Go Proxy, agent use-cases', link: 'https://github.com/coinbase/x402/tree/main/examples/typescript' }
  ],
  facilitators: [
    { name: 'CDP Facilitator', description: 'Best-in-class x402 facilitator. Fee-free USDC settlement on Base Mainnet', link: 'https://docs.cdp.coinbase.com/x402/docs/quickstart-sellers' },
    { name: 'Corbits', description: 'Production grade facilitator supporting multi-network, multi-token payment schemes', link: 'https://corbits.dev' },
    { name: 'Mogami Facilitator', description: 'Free, developer-focused, production-ready facilitator for x402 payments', link: 'https://facilitator.mogami.tech' },
    { name: 'OpenX402.ai Facilitator', description: 'First permissionless, gasless and omnichain x402 facilitator', link: 'https://openx402.ai' },
    { name: 'PayAI Facilitator', description: 'Accept x402 payments on all networks including Avalanche, Base, Polygon, Solana', link: 'https://facilitator.payai.network' },
    { name: 'Treasure Facilitator', description: 'x402 Facilitator on Base and Base Sepolia. Supports EIP-3009 tokens', link: 'https://x402.treasure.lol' },
    { name: 'WorldFun Facilitator', description: 'Fee-free EIP-3009 payments in USDC and ERC-20 tokens on Base', link: 'https://facilitator.world.fun' },
    { name: 'x402.org Facilitator', description: 'Default testnet facilitator for x402', link: 'https://x402.org' },
    { name: 'x402.rs Facilitator', description: 'Independent, open-source facilitator in Rust. Easy self-host or hosted', link: 'https://facilitator.x402.rs' }
  ]
};

const categories = [
  { id: 'clients', label: 'Client Integrations', count: ecosystemData.clients.length },
  { id: 'services', label: 'Services & APIs', count: ecosystemData.services.length },
  { id: 'infrastructure', label: 'Infrastructure & Tooling', count: ecosystemData.infrastructure.length },
  { id: 'resources', label: 'Learning & Resources', count: ecosystemData.resources.length },
  { id: 'facilitators', label: 'Facilitators', count: ecosystemData.facilitators.length }
];

export default function EcosystemPage() {
  const [activeSection, setActiveSection] = useState('clients');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <Header />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="flex gap-8">
          <aside className="w-56 flex-shrink-0 hidden md:block">
            <div className="sticky top-24 py-6">
              <h2 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-6 px-4">Categories</h2>
              <nav className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => scrollToSection(category.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors flex items-center justify-between group ${
                      activeSection === category.id
                        ? 'bg-blue-600/20 text-blue-400'
                        : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="text-sm font-medium">{category.label}</span>
                    <Badge
                      variant="secondary"
                      className={`${
                        activeSection === category.id
                          ? 'bg-blue-700 text-white'
                          : 'bg-slate-800 text-gray-400 group-hover:bg-slate-700'
                      }`}
                    >
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="max-w-4xl">
            <div className="mb-12">
              <h1 className="text-sm font-medium text-gray-400 mb-2">x402 ecosystem</h1>
              <h2 className="text-2xl font-bold text-white mb-4">
                Ecosystem Directory
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed">
                Discover innovative projects, tools, and applications built by our growing community of partners and developers.
              </p>
            </div>

            <div className="space-y-16">
              <section id="clients">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Client Integrations
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {ecosystemData.clients.map((project, index) => (
                    <Card
                      key={index}
                      className="bg-slate-900/50 border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-white group-hover:text-blue-400 transition-colors text-lg">
                            {project.name}
                          </CardTitle>
                          <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-colors flex-shrink-0 ml-2" />
                        </div>
                        <CardDescription className="text-gray-400 leading-relaxed text-sm">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                        >
                          <a href={project.link} target="_blank" rel="noopener noreferrer">
                            View Project
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              <section id="services">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Services & APIs
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {ecosystemData.services.map((project, index) => (
                    <Card
                      key={index}
                      className="bg-slate-900/50 border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-white group-hover:text-blue-400 transition-colors text-lg">
                            {project.name}
                          </CardTitle>
                          <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-colors flex-shrink-0 ml-2" />
                        </div>
                        <CardDescription className="text-gray-400 leading-relaxed text-sm">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                        >
                          <a href={project.link} target="_blank" rel="noopener noreferrer">
                            View Project
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              <section id="infrastructure">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Infrastructure & Tooling
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {ecosystemData.infrastructure.map((project, index) => (
                    <Card
                      key={index}
                      className="bg-slate-900/50 border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-white group-hover:text-blue-400 transition-colors text-lg">
                            {project.name}
                          </CardTitle>
                          <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-colors flex-shrink-0 ml-2" />
                        </div>
                        <CardDescription className="text-gray-400 leading-relaxed text-sm">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                        >
                          <a href={project.link} target="_blank" rel="noopener noreferrer">
                            View Project
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              <section id="resources">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Learning & Resources
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {ecosystemData.resources.map((project, index) => (
                    <Card
                      key={index}
                      className="bg-slate-900/50 border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-white group-hover:text-blue-400 transition-colors text-lg">
                            {project.name}
                          </CardTitle>
                          <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-colors flex-shrink-0 ml-2" />
                        </div>
                        <CardDescription className="text-gray-400 leading-relaxed text-sm">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                        >
                          <a href={project.link} target="_blank" rel="noopener noreferrer">
                            View Project
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              <section id="facilitators">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Facilitators
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {ecosystemData.facilitators.map((project, index) => (
                    <Card
                      key={index}
                      className="bg-slate-900/50 border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-white group-hover:text-blue-400 transition-colors text-lg">
                            {project.name}
                          </CardTitle>
                          <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-colors flex-shrink-0 ml-2" />
                        </div>
                        <CardDescription className="text-gray-400 leading-relaxed text-sm">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                        >
                          <a href={project.link} target="_blank" rel="noopener noreferrer">
                            View Project
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
            </div>
          </main>
        </div>
      </div>

      <footer className="border-t border-slate-800 bg-black/40 backdrop-blur py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <NodeExchangeIcon className="text-blue-500" size={32} />
                <span className="font-black tracking-tight text-xl">
                  <span className="text-white">Deposit</span>
                  <span className="text-blue-500">.</span>
                  <span className="text-white">now</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                The programmable funding gateway for autonomous agents. Scaling the machine-to-machine economy with instant x402 deposits.
              </p>
              <a href="https://x402.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors text-sm font-bold uppercase tracking-wider">
                Powered by x402 Protocol
                <ExternalLink className="h-3 w-3" />
              </a>
              <div className="text-gray-500 text-xs mt-2 uppercase tracking-wider">
                Deployment: bolt.new • Base Sepolia USDC
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Protocol</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/docs" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="/ecosystem" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Ecosystem
                  </a>
                </li>
                <li>
                  <a href="https://x402.org" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1">
                    x402 Standard
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Connect</h3>
              <div className="flex items-center gap-4">
                <a href="https://x.com/Deposit_Now" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="https://github.com/DepositNow" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="mailto:support@deposit.now" className="text-gray-400 hover:text-white transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">
              © 2026 Deposit.now. Built for the agentic future.
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms
              </a>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Sun className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
