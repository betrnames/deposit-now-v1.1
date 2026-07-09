'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { SiteFooter } from '@/components/SiteFooter';

import { ChevronRight, Copy, CheckCircle2, Terminal } from 'lucide-react';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen page-shell">
      <Header />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <aside className="w-56 flex-shrink-0 hidden md:block">
            <div className="sticky top-24 py-6">
              <h2 className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-6 px-4">
                DOCUMENTATION
              </h2>
              <nav className="space-y-1">
                <button
                  onClick={() => scrollToSection('introduction')}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeSection === 'introduction'
                      ? 'bg-primary/20 text-primary'
                      : 'text-muted-foreground hover:text-white hover:bg-muted/50'
                  }`}
                >
                  <ChevronRight className="h-4 w-4" />
                  Introduction
                </button>
                <button
                  onClick={() => scrollToSection('quickstart')}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeSection === 'quickstart'
                      ? 'bg-primary/20 text-primary rounded-lg'
                      : 'text-muted-foreground hover:text-white hover:bg-muted/50 rounded-lg'
                  }`}
                >
                  Quickstart
                </button>
                <button
                  onClick={() => scrollToSection('authentication')}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeSection === 'authentication'
                      ? 'bg-primary/20 text-primary rounded-lg'
                      : 'text-muted-foreground hover:text-white hover:bg-muted/50 rounded-lg'
                  }`}
                >
                  Authentication
                </button>
                <button
                  onClick={() => scrollToSection('endpoints')}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeSection === 'endpoints'
                      ? 'bg-primary/20 text-primary rounded-lg'
                      : 'text-muted-foreground hover:text-white hover:bg-muted/50 rounded-lg'
                  }`}
                >
                  Endpoints
                </button>
                <button
                  onClick={() => scrollToSection('examples')}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeSection === 'examples'
                      ? 'bg-primary/20 text-primary rounded-lg'
                      : 'text-muted-foreground hover:text-white hover:bg-muted/50 rounded-lg'
                  }`}
                >
                  Code Examples
                </button>
                <button
                  onClick={() => scrollToSection('billing')}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeSection === 'billing'
                      ? 'bg-primary/20 text-primary rounded-lg'
                      : 'text-muted-foreground hover:text-white hover:bg-muted/50 rounded-lg'
                  }`}
                >
                  Billing
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-sm font-medium text-muted-foreground">x402 documentation</h1>
            </div>

            {/* Mobile Navigation Pills */}
            <div className="md:hidden mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => scrollToSection('introduction')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeSection === 'introduction'
                      ? 'bg-primary text-white'
                      : 'bg-muted/50 text-muted-foreground hover:text-white hover:bg-muted'
                  }`}
                >
                  Introduction
                </button>
                <button
                  onClick={() => scrollToSection('authentication')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeSection === 'authentication'
                      ? 'bg-primary text-white'
                      : 'bg-muted/50 text-muted-foreground hover:text-white hover:bg-muted'
                  }`}
                >
                  Authentication
                </button>
                <button
                  onClick={() => scrollToSection('endpoints')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeSection === 'endpoints'
                      ? 'bg-primary text-white'
                      : 'bg-muted/50 text-muted-foreground hover:text-white hover:bg-muted'
                  }`}
                >
                  Endpoints
                </button>
                <button
                  onClick={() => scrollToSection('examples')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeSection === 'examples'
                      ? 'bg-primary text-white'
                      : 'bg-muted/50 text-muted-foreground hover:text-white hover:bg-muted'
                  }`}
                >
                  Examples
                </button>
                <button
                  onClick={() => scrollToSection('billing')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeSection === 'billing'
                      ? 'bg-primary text-white'
                      : 'bg-muted/50 text-muted-foreground hover:text-white hover:bg-muted'
                  }`}
                >
                  Billing
                </button>
              </div>
            </div>

            {/* Overview Section */}
            <div className="space-y-12 mb-16">
              <div id="introduction" className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold text-white">Overview</h2>
                </div>
                <p className="text-muted-foreground">
                  When an agent calls <code className="text-primary">POST /api/deposit</code>, it pays 0.01 USDC via x402 to access the endpoint. The <code className="text-primary">amount</code> field declares the deposit value to be recorded on the merchant&apos;s ledger, and the platform generates a verifiable receipt and fires a webhook to the merchant.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="border border-border/60 rounded-lg p-4 bg-background">
                    <div className="text-sm text-muted-foreground/70 mb-1">Base URL</div>
                    <div className="font-mono text-sm text-white">https://deposit.now</div>
                  </div>
                  <div className="border border-border/60 rounded-lg p-4 bg-background">
                    <div className="text-sm text-muted-foreground/70 mb-1">Price per call</div>
                    <div className="font-mono text-sm text-white">0.01 USDC</div>
                  </div>
                  <div className="border border-border/60 rounded-lg p-4 bg-background">
                    <div className="text-sm text-muted-foreground/70 mb-1">Network</div>
                    <div className="font-mono text-sm text-white">Base mainnet</div>
                  </div>
                </div>

                {/* 5-Minute Quickstart */}
                <div id="quickstart" className="mt-8 border border-primary/30 rounded-lg p-6 bg-primary/5">
                  <h3 className="text-lg font-bold text-white mb-2">5-minute quickstart</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Copy-paste this into a Node.js file. You need a Base wallet with USDC — that&apos;s it.
                  </p>
                  <pre className="bg-background rounded-lg p-4 overflow-x-auto border border-border/60 text-sm">
                    <code>
                      <span className="text-yellow-300">import</span> <span className="text-white">{'{'} wrapFetchWithPayment {'}'}</span> <span className="text-yellow-300">from</span> <span className="text-orange-400">&apos;@x402/fetch&apos;</span><span className="text-white">;</span>{'\n'}
                      <span className="text-yellow-300">import</span> <span className="text-white">{'{'} x402Client {'}'}</span> <span className="text-yellow-300">from</span> <span className="text-orange-400">&apos;@x402/core/client&apos;</span><span className="text-white">;</span>{'\n'}
                      <span className="text-yellow-300">import</span> <span className="text-white">{'{'} ExactEvmScheme {'}'}</span> <span className="text-yellow-300">from</span> <span className="text-orange-400">&apos;@x402/evm/exact/client&apos;</span><span className="text-white">;</span>{'\n'}
                      <span className="text-yellow-300">import</span> <span className="text-white">{'{'} privateKeyToAccount {'}'}</span> <span className="text-yellow-300">from</span> <span className="text-orange-400">&apos;viem/accounts&apos;</span><span className="text-white">;</span>{'\n\n'}
                      <span className="text-yellow-300">const</span> <span className="text-white">signer</span> <span className="text-yellow-300">=</span> <span className="text-green-400">privateKeyToAccount</span><span className="text-white">(process.env.EVM_PRIVATE_KEY);</span>{'\n'}
                      <span className="text-yellow-300">const</span> <span className="text-white">client</span> <span className="text-yellow-300">=</span> <span className="text-yellow-300">new</span> <span className="text-green-400">x402Client</span><span className="text-white">();</span>{'\n'}
                      <span className="text-white">client.</span><span className="text-green-400">register</span><span className="text-white">(</span><span className="text-orange-400">&apos;eip155:*&apos;</span><span className="text-white">,</span> <span className="text-yellow-300">new</span> <span className="text-green-400">ExactEvmScheme</span><span className="text-white">(signer));</span>{'\n'}
                      <span className="text-yellow-300">const</span> <span className="text-white">fetchWithPayment</span> <span className="text-yellow-300">=</span> <span className="text-green-400">wrapFetchWithPayment</span><span className="text-white">(fetch, client);</span>{'\n\n'}
                      <span className="text-yellow-300">const</span> <span className="text-white">res</span> <span className="text-yellow-300">=</span> <span className="text-yellow-300">await</span> <span className="text-green-400">fetchWithPayment</span><span className="text-white">(</span><span className="text-orange-400">&apos;https://deposit.now/api/deposit&apos;</span><span className="text-white">,</span> <span className="text-white">{'{'}</span>{'\n'}
                      {'  '}<span className="text-green-400">method</span><span className="text-white">:</span> <span className="text-orange-400">&apos;POST&apos;</span><span className="text-white">,</span>{'\n'}
                      {'  '}<span className="text-green-400">headers</span><span className="text-white">:</span> <span className="text-white">{'{'}</span> <span className="text-orange-400">&apos;Content-Type&apos;</span><span className="text-white">:</span> <span className="text-orange-400">&apos;application/json&apos;</span> <span className="text-white">{'}'}</span><span className="text-white">,</span>{'\n'}
                      {'  '}<span className="text-green-400">body</span><span className="text-white">:</span> <span className="text-white">JSON.</span><span className="text-green-400">stringify</span><span className="text-white">(</span><span className="text-white">{'{'}</span> <span className="text-green-400">amount</span><span className="text-white">:</span> <span className="text-orange-400">&apos;100.00&apos;</span><span className="text-white">,</span> <span className="text-green-400">account</span><span className="text-white">:</span> <span className="text-orange-400">&apos;agent-wallet-123&apos;</span> <span className="text-white">{'}'}</span><span className="text-white">)</span>{'\n'}
                      <span className="text-white">{'}'}</span><span className="text-white">);</span>{'\n\n'}
                      <span className="text-yellow-300">const</span> <span className="text-white">receipt</span> <span className="text-yellow-300">=</span> <span className="text-yellow-300">await</span> <span className="text-white">res.</span><span className="text-green-400">json</span><span className="text-white">();</span>{'\n'}
                      <span className="text-white">console.</span><span className="text-green-400">log</span><span className="text-white">(</span><span className="text-orange-400">&apos;Receipt:&apos;</span><span className="text-white">,</span> <span className="text-white">receipt);</span>
                    </code>
                  </pre>
                </div>
              </div>

              {/* Authentication Section */}
              <div id="authentication" className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Terminal className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-white">Authentication</h2>
                </div>
                <p className="text-muted-foreground">
                  The API uses x402 payment protocol for authentication. No API keys or accounts required.
                  The payment itself serves as both authentication and authorization.
                </p>
                <div className="bg-background rounded-lg p-4 space-y-2 border border-border/60">
                  <div className="font-semibold text-white">x402 Requirements:</div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Payment amount: 10000 atomic units (0.01 USDC)</li>
                    <li className="break-words">
                      Currency: USDC (
                      <code className="break-all">
                        0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
                      </code>
                      )
                    </li>
                    <li>Network: Base mainnet (eip155:8453)</li>
                    <li>Facilitator: Coinbase Developer Platform (CDP) x402 facilitator</li>
                  </ul>
                </div>
              </div>

              {/* Endpoints Section */}
              <div id="endpoints" className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Terminal className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-white">Endpoints</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-white border-white/20">POST</Badge>
                      <code className="text-sm text-primary">/api/deposit</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Trigger a deposit for an AI agent account. Requires x402 payment.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-semibold mb-2 text-white">Request Body</div>
                        <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm border border-border/60">
                          <code>
                            <span className="text-yellow-400">{'{'}</span>{'\n'}
                            {'  '}<span className="text-green-400">"amount"</span><span className="text-white">:</span> <span className="text-orange-400">"100.00"</span><span className="text-white">,</span>{'\n'}
                            {'  '}<span className="text-green-400">"account"</span><span className="text-white">:</span> <span className="text-orange-400">"agent-wallet-123"</span>{'\n'}
                            <span className="text-yellow-400">{'}'}</span>
                          </code>
                        </pre>
                      </div>

                      <div>
                        <div className="text-sm font-semibold mb-2 text-white">Success Response (200)</div>
                        <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm border border-border/60">
                          <code>
                            <span className="text-yellow-400">{'{'}</span>{'\n'}
                            {'  '}<span className="text-green-400">"status"</span><span className="text-white">:</span> <span className="text-orange-400">"success"</span><span className="text-white">,</span>{'\n'}
                            {'  '}<span className="text-green-400">"depositAmount"</span><span className="text-white">:</span> <span className="text-orange-400">"100.00"</span><span className="text-white">,</span>{'\n'}
                            {'  '}<span className="text-green-400">"account"</span><span className="text-white">:</span> <span className="text-orange-400">"agent-wallet-123"</span><span className="text-white">,</span>{'\n'}
                            {'  '}<span className="text-green-400">"message"</span><span className="text-white">:</span> <span className="text-orange-400">"Deposit of 100.00 triggered for agent account: agent-wallet-123"</span><span className="text-white">,</span>{'\n'}
                            {'  '}<span className="text-green-400">"timestamp"</span><span className="text-white">:</span> <span className="text-orange-400">"2025-12-30T12:00:00.000Z"</span><span className="text-white">,</span>{'\n'}
                            {'  '}<span className="text-green-400">"network"</span><span className="text-white">:</span> <span className="text-orange-400">"eip155:8453"</span><span className="text-white">,</span>{'\n'}
                            {'  '}<span className="text-green-400">"paymentReceived"</span><span className="text-white">:</span> <span className="text-yellow-300">true</span><span className="text-white">,</span>{'\n'}
                            {'  '}<span className="text-green-400">"transactionId"</span><span className="text-white">:</span> <span className="text-orange-400">"txn_1735563600000_abc123xyz"</span><span className="text-white">,</span>{'\n'}
                            {'  '}<span className="text-green-400">"receiptId"</span><span className="text-white">:</span> <span className="text-orange-400">"a1b2c3d4e5f60718"</span><span className="text-white">,</span>{'\n'}
                            {'  '}<span className="text-green-400">"receiptUrl"</span><span className="text-white">:</span> <span className="text-orange-400">"https://deposit.now/receipt/a1b2c3d4e5f60718"</span>{'\n'}
                            <span className="text-yellow-400">{'}'}</span>
                          </code>
                        </pre>
                      </div>

                      <div>
                        <div className="text-sm font-semibold mb-2 text-white">Payment Required Response (402)</div>
                        <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm border border-border/60">
                          <code>
                            <span className="text-yellow-300">HTTP/1.1 402 Payment Required</span>{'\n'}
                            <span className="text-green-400">Payment-Required:</span> <span className="text-white">&lt;base64 of the JSON below&gt;</span>{'\n\n'}
                            <span className="text-yellow-400">{'{'}</span>{'\n'}
                            {'  '}<span className="text-green-400">"x402Version"</span><span className="text-white">:</span> <span className="text-white">2</span><span className="text-white">,</span>{'\n'}
                            {'  '}<span className="text-green-400">"error"</span><span className="text-white">:</span> <span className="text-orange-400">"Payment required"</span><span className="text-white">,</span>{'\n'}
                            {'  '}<span className="text-green-400">"accepts"</span><span className="text-white">:</span> <span className="text-yellow-400">[{'{'}</span>{'\n'}
                            {'    '}<span className="text-green-400">"scheme"</span><span className="text-white">:</span> <span className="text-orange-400">"exact"</span><span className="text-white">,</span>{'\n'}
                            {'    '}<span className="text-green-400">"network"</span><span className="text-white">:</span> <span className="text-orange-400">"eip155:8453"</span><span className="text-white">,</span>{'\n'}
                            {'    '}<span className="text-green-400">"payTo"</span><span className="text-white">:</span> <span className="text-orange-400">"0x3f7a...F685"</span><span className="text-white">,</span>{'\n'}
                            {'    '}<span className="text-green-400">"asset"</span><span className="text-white">:</span> <span className="text-orange-400">"USDC"</span><span className="text-white">,</span>{'\n'}
                            {'    '}<span className="text-green-400">"maxAmountRequired"</span><span className="text-white">:</span> <span className="text-orange-400">"10000"</span>{'\n'}
                            {'  '}<span className="text-yellow-400">{'}'}]</span>{'\n'}
                            <span className="text-yellow-400">{'}'}</span>{'\n\n'}
                            <span className="text-muted-foreground/70"># Retry the request with a signed X-Payment header —</span>{'\n'}
                            <span className="text-muted-foreground/70"># the x402 client SDKs handle this automatically.</span>
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-white border-white/20">GET</Badge>
                      <code className="text-sm text-primary">/api/deposit</code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Get deposit information. Also protected by x402 payment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Code Examples Section */}
              <div id="examples" className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Terminal className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-white">Code Examples</h2>
                </div>
                <Tabs defaultValue="javascript">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                  </TabsList>

                  <TabsContent value="javascript" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Install the x402 client</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard('npm install @x402/fetch @x402/core @x402/evm viem', 0)}
                        >
                          {copiedIndex === 0 ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm border border-border/60">
                        <code><span className="text-yellow-300">npm</span> <span className="text-green-400">install</span> <span className="text-white">@x402/fetch @x402/core @x402/evm viem</span></code>
                      </pre>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Make a payment-protected request</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              `import { wrapFetchWithPayment } from '@x402/fetch';
import { x402Client } from '@x402/core/client';
import { ExactEvmScheme } from '@x402/evm/exact/client';
import { privateKeyToAccount } from 'viem/accounts';

const signer = privateKeyToAccount(process.env.EVM_PRIVATE_KEY);
const client = new x402Client();
client.register('eip155:*', new ExactEvmScheme(signer));
const fetchWithPayment = wrapFetchWithPayment(fetch, client);

const response = await fetchWithPayment('https://deposit.now/api/deposit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount: '100.00', account: 'agent-wallet-123' })
});

const result = await response.json();
console.log('Deposit status:', result.status);
console.log('Transaction ID:', result.transactionId);`,
                              1
                            )
                          }
                        >
                          {copiedIndex === 1 ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm border border-border/60">
                        <code>
                          <span className="text-yellow-300">import</span> <span className="text-white">{'{'} wrapFetchWithPayment {'}'}</span> <span className="text-yellow-300">from</span> <span className="text-orange-400">'@x402/fetch'</span><span className="text-white">;</span>{'\n'}
                          <span className="text-yellow-300">import</span> <span className="text-white">{'{'} x402Client {'}'}</span> <span className="text-yellow-300">from</span> <span className="text-orange-400">'@x402/core/client'</span><span className="text-white">;</span>{'\n'}
                          <span className="text-yellow-300">import</span> <span className="text-white">{'{'} ExactEvmScheme {'}'}</span> <span className="text-yellow-300">from</span> <span className="text-orange-400">'@x402/evm/exact/client'</span><span className="text-white">;</span>{'\n'}
                          <span className="text-yellow-300">import</span> <span className="text-white">{'{'} privateKeyToAccount {'}'}</span> <span className="text-yellow-300">from</span> <span className="text-orange-400">'viem/accounts'</span><span className="text-white">;</span>{'\n\n'}
                          <span className="text-yellow-300">const</span> <span className="text-white">signer</span> <span className="text-yellow-300">=</span> <span className="text-green-400">privateKeyToAccount</span><span className="text-white">(process.env.EVM_PRIVATE_KEY);</span>{'\n'}
                          <span className="text-yellow-300">const</span> <span className="text-white">client</span> <span className="text-yellow-300">=</span> <span className="text-yellow-300">new</span> <span className="text-green-400">x402Client</span><span className="text-white">();</span>{'\n'}
                          <span className="text-white">client.</span><span className="text-green-400">register</span><span className="text-white">(</span><span className="text-orange-400">'eip155:*'</span><span className="text-white">,</span> <span className="text-yellow-300">new</span> <span className="text-green-400">ExactEvmScheme</span><span className="text-white">(signer));</span>{'\n'}
                          <span className="text-yellow-300">const</span> <span className="text-white">fetchWithPayment</span> <span className="text-yellow-300">=</span> <span className="text-green-400">wrapFetchWithPayment</span><span className="text-white">(fetch, client);</span>{'\n\n'}
                          <span className="text-yellow-300">const</span> <span className="text-white">response</span> <span className="text-yellow-300">=</span> <span className="text-yellow-300">await</span> <span className="text-green-400">fetchWithPayment</span><span className="text-white">(</span><span className="text-orange-400">'https://deposit.now/api/deposit'</span><span className="text-white">,</span> <span className="text-white">{'{'}</span>{'\n'}
                          {'  '}<span className="text-green-400">method</span><span className="text-white">:</span> <span className="text-orange-400">'POST'</span><span className="text-white">,</span>{'\n'}
                          {'  '}<span className="text-green-400">headers</span><span className="text-white">:</span> <span className="text-white">{'{'}</span> <span className="text-orange-400">'Content-Type'</span><span className="text-white">:</span> <span className="text-orange-400">'application/json'</span> <span className="text-white">{'}'}</span><span className="text-white">,</span>{'\n'}
                          {'  '}<span className="text-green-400">body</span><span className="text-white">:</span> <span className="text-white">JSON.</span><span className="text-green-400">stringify</span><span className="text-white">(</span><span className="text-white">{'{'}</span> <span className="text-green-400">amount</span><span className="text-white">:</span> <span className="text-orange-400">'100.00'</span><span className="text-white">,</span> <span className="text-green-400">account</span><span className="text-white">:</span> <span className="text-orange-400">'agent-wallet-123'</span> <span className="text-white">{'}'}</span><span className="text-white">)</span>{'\n'}
                          <span className="text-white">{'}'}</span><span className="text-white">);</span>{'\n\n'}
                          <span className="text-yellow-300">const</span> <span className="text-white">result</span> <span className="text-yellow-300">=</span> <span className="text-yellow-300">await</span> <span className="text-white">response.</span><span className="text-green-400">json</span><span className="text-white">();</span>{'\n'}
                          <span className="text-white">console.</span><span className="text-green-400">log</span><span className="text-white">(</span><span className="text-orange-400">'Deposit status:'</span><span className="text-white">,</span> <span className="text-white">result.status);</span>{'\n'}
                          <span className="text-white">console.</span><span className="text-green-400">log</span><span className="text-white">(</span><span className="text-orange-400">'Transaction ID:'</span><span className="text-white">,</span> <span className="text-white">result.transactionId);</span>
                        </code>
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="python" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Install the x402 client</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard('pip install "x402[httpx]" eth-account', 2)}
                        >
                          {copiedIndex === 2 ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm border border-border/60">
                        <code><span className="text-yellow-300">pip</span> <span className="text-green-400">install</span> <span className="text-white">"x402[httpx]" eth-account</span></code>
                      </pre>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Make a payment-protected request</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              `import asyncio, os
from eth_account import Account
from x402 import x402Client
from x402.http.clients import x402HttpxClient
from x402.mechanisms.evm import EthAccountSigner
from x402.mechanisms.evm.exact.register import register_exact_evm_client

async def main():
    client = x402Client()
    account = Account.from_key(os.getenv("EVM_PRIVATE_KEY"))
    register_exact_evm_client(client, EthAccountSigner(account))

    async with x402HttpxClient(client) as http:
        response = await http.post(
            "https://deposit.now/api/deposit",
            json={"amount": "100.00", "account": "agent-wallet-123"},
        )
        print(await response.aread())

asyncio.run(main())`,
                              3
                            )
                          }
                        >
                          {copiedIndex === 3 ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm border border-border/60">
                        <code>
                          <span className="text-yellow-300">import</span> <span className="text-white">asyncio, os</span>{'\n'}
                          <span className="text-yellow-300">from</span> <span className="text-white">eth_account</span> <span className="text-yellow-300">import</span> <span className="text-green-400">Account</span>{'\n'}
                          <span className="text-yellow-300">from</span> <span className="text-white">x402</span> <span className="text-yellow-300">import</span> <span className="text-green-400">x402Client</span>{'\n'}
                          <span className="text-yellow-300">from</span> <span className="text-white">x402.http.clients</span> <span className="text-yellow-300">import</span> <span className="text-green-400">x402HttpxClient</span>{'\n'}
                          <span className="text-yellow-300">from</span> <span className="text-white">x402.mechanisms.evm</span> <span className="text-yellow-300">import</span> <span className="text-green-400">EthAccountSigner</span>{'\n'}
                          <span className="text-yellow-300">from</span> <span className="text-white">x402.mechanisms.evm.exact.register</span> <span className="text-yellow-300">import</span> <span className="text-green-400">register_exact_evm_client</span>{'\n\n'}
                          <span className="text-yellow-300">async def</span> <span className="text-green-400">main</span><span className="text-white">():</span>{'\n'}
                          {'    '}<span className="text-white">client</span> <span className="text-yellow-300">=</span> <span className="text-green-400">x402Client</span><span className="text-white">()</span>{'\n'}
                          {'    '}<span className="text-white">account</span> <span className="text-yellow-300">=</span> <span className="text-white">Account.</span><span className="text-green-400">from_key</span><span className="text-white">(os.</span><span className="text-green-400">getenv</span><span className="text-white">(</span><span className="text-orange-400">"EVM_PRIVATE_KEY"</span><span className="text-white">))</span>{'\n'}
                          {'    '}<span className="text-green-400">register_exact_evm_client</span><span className="text-white">(client, </span><span className="text-green-400">EthAccountSigner</span><span className="text-white">(account))</span>{'\n\n'}
                          {'    '}<span className="text-yellow-300">async with</span> <span className="text-green-400">x402HttpxClient</span><span className="text-white">(client)</span> <span className="text-yellow-300">as</span> <span className="text-white">http:</span>{'\n'}
                          {'        '}<span className="text-white">response</span> <span className="text-yellow-300">=</span> <span className="text-yellow-300">await</span> <span className="text-white">http.</span><span className="text-green-400">post</span><span className="text-white">(</span>{'\n'}
                          {'            '}<span className="text-orange-400">"https://deposit.now/api/deposit"</span><span className="text-white">,</span>{'\n'}
                          {'            '}<span className="text-white">json</span><span className="text-yellow-300">=</span><span className="text-white">{'{'}</span><span className="text-orange-400">"amount"</span><span className="text-white">:</span> <span className="text-orange-400">"100.00"</span><span className="text-white">,</span> <span className="text-orange-400">"account"</span><span className="text-white">:</span> <span className="text-orange-400">"agent-wallet-123"</span><span className="text-white">{'}'}</span><span className="text-white">,</span>{'\n'}
                          {'        '}<span className="text-white">)</span>{'\n'}
                          {'        '}<span className="text-green-400">print</span><span className="text-white">(</span><span className="text-yellow-300">await</span> <span className="text-white">response.</span><span className="text-green-400">aread</span><span className="text-white">())</span>{'\n\n'}
                          <span className="text-white">asyncio.</span><span className="text-green-400">run</span><span className="text-white">(</span><span className="text-green-400">main</span><span className="text-white">())</span>
                        </code>
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="curl" className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        First request returns 402 with payment details
                      </p>
                      <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm border border-border/60">
                        <code>
                          <span className="text-yellow-300">curl</span> <span className="text-green-400">-i -X</span> <span className="text-white">POST</span> <span className="text-orange-400">https://deposit.now/api/deposit</span> <span className="text-white">\</span>{'\n'}
                          {'  '}<span className="text-green-400">-H</span> <span className="text-orange-400">"Content-Type: application/json"</span> <span className="text-white">\</span>{'\n'}
                          {'  '}<span className="text-green-400">-d</span> <span className="text-orange-400">'{`{`}"amount": "100.00", "account": "agent-wallet-123"{`}`}'</span>{'\n\n'}
                          <span className="text-muted-foreground/70"># Response: HTTP 402 Payment Required with a Payment-Required</span>{'\n'}
                          <span className="text-muted-foreground/70"># header listing accepted payment methods (scheme, network, payTo)</span>
                        </code>
                      </pre>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        The retry carries an X-Payment header — a signed payment payload
                        (EIP-712), not a plain string. Generate it with an x402 SDK
                        (JavaScript or Python above); it cannot be hand-written in curl.
                      </p>
                      <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm border border-border/60">
                        <code>
                          <span className="text-yellow-300">curl</span> <span className="text-green-400">-X</span> <span className="text-white">POST</span> <span className="text-orange-400">https://deposit.now/api/deposit</span> <span className="text-white">\</span>{'\n'}
                          {'  '}<span className="text-green-400">-H</span> <span className="text-orange-400">"Content-Type: application/json"</span> <span className="text-white">\</span>{'\n'}
                          {'  '}<span className="text-green-400">-H</span> <span className="text-orange-400">"X-Payment: &lt;base64 signed payment payload from SDK&gt;"</span> <span className="text-white">\</span>{'\n'}
                          {'  '}<span className="text-green-400">-d</span> <span className="text-orange-400">'{`{`}"amount": "100.00", "account": "agent-wallet-123"{`}`}'</span>{'\n\n'}
                          <span className="text-muted-foreground/70"># Response: HTTP 200 OK with deposit confirmation +</span>{'\n'}
                          <span className="text-muted-foreground/70"># X-Payment-Response header containing the settlement receipt</span>
                        </code>
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Merchants Section */}
              <div id="merchants" className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Terminal className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-white">Merchant endpoints</h2>
                </div>
                <p className="text-sm text-muted-foreground bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 mb-4">
                  Merchant endpoints are rolling out to early partners. Request access at{' '}
                  <a href="mailto:support@deposit.now" className="text-primary hover:underline">support@deposit.now</a>.
                </p>
                <p className="text-muted-foreground">
                  Merchant-scoped routes let agents fund a specific business or integration. The
                  0.01 USDC x402 fee still applies, but settlement lands on the merchant&apos;s{' '}
                  <code className="text-primary">payTo</code> address instead of the platform wallet.
                  After settlement, deposit.now writes a public receipt and optionally POSTs a{' '}
                  <code className="text-primary">deposit.settled</code> webhook.
                </p>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-white border-white/20">GET</Badge>
                      <code className="text-sm text-primary">/api/merchants</code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Public catalog of active merchants with deposit URLs and payTo addresses.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-white border-white/20">POST</Badge>
                      <code className="text-sm text-primary">/api/merchants/&#123;slug&#125;/deposit</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Same x402 flow as the platform endpoint. Example slug:{' '}
                      <code className="text-primary">deposit-now</code>.
                    </p>
                    <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm border border-border/60">
                      <code>
                        <span className="text-yellow-300">POST</span>{' '}
                        <span className="text-orange-400">https://deposit.now/api/merchants/acme-corp/deposit</span>
                        {'\n'}
                        <span className="text-white">{'{'}</span>{'\n'}
                        {'  '}<span className="text-green-400">&quot;amount&quot;</span>
                        <span className="text-white">: </span>
                        <span className="text-orange-400">&quot;250.00&quot;</span>
                        <span className="text-white">,</span>{'\n'}
                        {'  '}<span className="text-green-400">&quot;account&quot;</span>
                        <span className="text-white">: </span>
                        <span className="text-orange-400">&quot;agent-wallet-123&quot;</span>
                        {'\n'}
                        <span className="text-white">{'}'}</span>
                      </code>
                    </pre>
                  </div>
                </div>
                <div className="bg-background rounded-lg p-4 border border-border/60 text-sm text-muted-foreground">
                  <div className="font-semibold text-white mb-2">Discovery</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      Manifest:{' '}
                      <a href="/.well-known/x402" className="text-primary hover:underline">
                        /.well-known/x402
                      </a>
                    </li>
                    <li>Bazaar indexing via CDP facilitator after first mainnet settlement</li>
                    <li>OpenAPI + llms.txt for agent crawlers</li>
                  </ul>
                </div>
              </div>

              <div id="billing" className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Terminal className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-white">Merchant billing (on-chain)</h2>
                </div>
                <p className="text-muted-foreground">
                  Merchant charges are collected via x402 USDC on Base — no invoices or card billing.
                  Settlement fees debit from a prepaid balance; Rail tier renews with a fixed 49 USDC
                  payment to the platform wallet.
                </p>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-white border-white/20">GET</Badge>
                      <code className="text-sm text-primary">/api/merchants/&#123;slug&#125;</code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Returns merchant details plus a <code className="text-primary">billing</code>{' '}
                      object: tier, prepaid balance, renew/topup URLs, and settlement fee bps.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-white border-white/20">POST</Badge>
                      <code className="text-sm text-primary">/api/merchants/&#123;slug&#125;/renew</code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Pay 49 USDC via x402 to extend Rail webhooks and automation for 30 days.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-white border-white/20">POST</Badge>
                      <code className="text-sm text-primary">/api/merchants/&#123;slug&#125;/topup</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Top up prepaid USDC for settlement-fee debits. Minimum 10 USDC.
                    </p>
                    <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm border border-border/60">
                      <code>
                        <span className="text-yellow-300">POST</span>{' '}
                        <span className="text-orange-400">https://deposit.now/api/merchants/acme-corp/topup</span>
                        {'\n'}
                        <span className="text-white">{'{'}</span>{'\n'}
                        {'  '}<span className="text-green-400">&quot;amount&quot;</span>
                        <span className="text-white">: </span>
                        <span className="text-orange-400">&quot;50&quot;</span>
                        {'\n'}
                        <span className="text-white">{'}'}</span>
                      </code>
                    </pre>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground/70">
                  After each settled deposit, the tier settlement fee (e.g. 0.15% on Rail) debits
                  automatically from your prepaid balance. Agent rail fees (0.01 USDC/call) still
                  settle to your <code className="text-primary">payTo</code> address.
                </p>
              </div>

              {/* FAQ Section */}
              <div id="faq" className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Terminal className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-white">FAQ</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2 text-white">What is deposit.now?</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      deposit.now is a public x402 API that lets AI agents autonomously
                      deposit funds. Agents pay 0.01 USDC per call over HTTP — no accounts, API
                      keys, or human sign-up required.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-white">How does an AI agent pay the deposit.now API?</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The agent calls POST https://deposit.now/api/deposit and receives HTTP 402
                      with signed payment requirements (x402 v2, exact scheme, USDC on Base mainnet). An
                      x402 client SDK such as @x402/fetch for JavaScript or x402[httpx] for Python
                      signs the payment and retries automatically; the facilitator verifies and
                      settles it on-chain.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-white">What does the deposit.now API cost?</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      0.01 USDC per call, settled on Base mainnet via the x402 payment protocol. There are
                      no subscriptions, accounts, or minimums.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Handling Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Terminal className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-white">Error Handling</h2>
                </div>
                <div className="space-y-4">
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <div className="font-semibold mb-1 text-white">402 Payment Required</div>
                    <p className="text-sm text-muted-foreground">
                      No payment provided or payment invalid. Decode the Payment-Required header (base64 JSON) for the payment requirements.
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <div className="font-semibold mb-1 text-white">400 Bad Request</div>
                    <p className="text-sm text-muted-foreground">
                      Invalid request body or parameters.
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <div className="font-semibold mb-1 text-white">500 Internal Server Error</div>
                    <p className="text-sm text-muted-foreground">
                      Server error processing the request. Retry with exponential backoff.
                    </p>
                  </div>
                </div>
              </div>

            </div>
            </div>
          </main>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
