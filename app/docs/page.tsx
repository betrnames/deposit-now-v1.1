'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { NodeExchangeIcon } from '@/components/icons';
import { ExternalLink, Github, Mail, Sun, ChevronRight, Copy, CheckCircle2, Terminal } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <Header />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <aside className="w-56 flex-shrink-0 hidden md:block">
            <div className="sticky top-24 py-6">
              <h2 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-6 px-4">
                DOCUMENTATION
              </h2>
              <nav className="space-y-1">
                <button
                  onClick={() => scrollToSection('introduction')}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeSection === 'introduction'
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <ChevronRight className="h-4 w-4" />
                  Introduction
                </button>
                <button
                  onClick={() => scrollToSection('authentication')}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeSection === 'authentication'
                      ? 'bg-blue-600/20 text-blue-400 rounded-lg'
                      : 'text-gray-400 hover:text-white hover:bg-slate-800/50 rounded-lg'
                  }`}
                >
                  Authentication
                </button>
                <button
                  onClick={() => scrollToSection('endpoints')}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeSection === 'endpoints'
                      ? 'bg-blue-600/20 text-blue-400 rounded-lg'
                      : 'text-gray-400 hover:text-white hover:bg-slate-800/50 rounded-lg'
                  }`}
                >
                  Endpoints
                </button>
                <button
                  onClick={() => scrollToSection('examples')}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeSection === 'examples'
                      ? 'bg-blue-600/20 text-blue-400 rounded-lg'
                      : 'text-gray-400 hover:text-white hover:bg-slate-800/50 rounded-lg'
                  }`}
                >
                  Code Examples
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-sm font-medium text-gray-400">x402 documentation</h1>
            </div>

            {/* Mobile Navigation Pills */}
            <div className="md:hidden mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => scrollToSection('introduction')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeSection === 'introduction'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800/50 text-gray-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Introduction
                </button>
                <button
                  onClick={() => scrollToSection('authentication')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeSection === 'authentication'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800/50 text-gray-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Authentication
                </button>
                <button
                  onClick={() => scrollToSection('endpoints')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeSection === 'endpoints'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800/50 text-gray-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Endpoints
                </button>
                <button
                  onClick={() => scrollToSection('examples')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeSection === 'examples'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800/50 text-gray-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Examples
                </button>
              </div>
            </div>

            {/* Overview Section */}
            <div className="space-y-12 mb-16">
              <div id="introduction" className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold text-white">Overview</h2>
                </div>
                <p className="text-gray-400">
                  The deposit.now API enables AI agents to trigger deposits autonomously using the x402 payment protocol.
                  Each API call requires a micropayment of 0.01 USDC on Base Sepolia testnet.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="border border-white/10 rounded-lg p-4 bg-slate-950">
                    <div className="text-sm text-gray-500 mb-1">Base URL</div>
                    <div className="font-mono text-sm text-white">https://deposit.now</div>
                  </div>
                  <div className="border border-white/10 rounded-lg p-4 bg-slate-950">
                    <div className="text-sm text-gray-500 mb-1">Price per call</div>
                    <div className="font-mono text-sm text-white">0.01 USDC</div>
                  </div>
                  <div className="border border-white/10 rounded-lg p-4 bg-slate-950">
                    <div className="text-sm text-gray-500 mb-1">Network</div>
                    <div className="font-mono text-sm text-white">Base Sepolia</div>
                  </div>
                </div>
              </div>

              {/* Authentication Section */}
              <div id="authentication" className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Terminal className="h-6 w-6 text-blue-400" />
                  <h2 className="text-2xl font-bold text-white">Authentication</h2>
                </div>
                <p className="text-gray-400">
                  The API uses x402 payment protocol for authentication. No API keys or accounts required.
                  The payment itself serves as both authentication and authorization.
                </p>
                <div className="bg-slate-950 rounded-lg p-4 space-y-2 border border-white/10">
                  <div className="font-semibold text-white">x402 Requirements:</div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
                    <li>Payment amount: 10000 atomic units (0.01 USDC)</li>
                    <li>Currency: USDC</li>
                    <li>Network: base-sepolia</li>
                    <li>Facilitator: https://x402.org/facilitator</li>
                  </ul>
                </div>
              </div>

              {/* Endpoints Section */}
              <div id="endpoints" className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Terminal className="h-6 w-6 text-blue-400" />
                  <h2 className="text-2xl font-bold text-white">Endpoints</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-white border-white/20">POST</Badge>
                      <code className="text-sm text-blue-400">/api/deposit</code>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      Trigger a deposit for an AI agent account. Requires x402 payment.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-semibold mb-2 text-white">Request Body</div>
                        <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-sm border border-white/10">
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
                        <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-sm border border-white/10">
                          <code>
                            <span className="text-yellow-400">{'{'}</span>{'\n'}
                            {'  '}<span className="text-green-400">"status"</span><span className="text-white">:</span> <span className="text-orange-400">"success"</span><span className="text-white">,</span>{'\n'}
                            {'  '}<span className="text-green-400">"depositAmount"</span><span className="text-white">:</span> <span className="text-orange-400">"100.00"</span><span className="text-white">,</span>{'\n'}
                            {'  '}<span className="text-green-400">"account"</span><span className="text-white">:</span> <span className="text-orange-400">"agent-wallet-123"</span><span className="text-white">,</span>{'\n'}
                            {'  '}<span className="text-green-400">"message"</span><span className="text-white">:</span> <span className="text-orange-400">"Deposit of 100.00 triggered for agent account: agent-wallet-123"</span><span className="text-white">,</span>{'\n'}
                            {'  '}<span className="text-green-400">"timestamp"</span><span className="text-white">:</span> <span className="text-orange-400">"2025-12-30T12:00:00.000Z"</span><span className="text-white">,</span>{'\n'}
                            {'  '}<span className="text-green-400">"network"</span><span className="text-white">:</span> <span className="text-orange-400">"base-sepolia"</span><span className="text-white">,</span>{'\n'}
                            {'  '}<span className="text-green-400">"paymentReceived"</span><span className="text-white">:</span> <span className="text-yellow-300">true</span><span className="text-white">,</span>{'\n'}
                            {'  '}<span className="text-green-400">"transactionId"</span><span className="text-white">:</span> <span className="text-orange-400">"txn_1735563600000_abc123xyz"</span>{'\n'}
                            <span className="text-yellow-400">{'}'}</span>
                          </code>
                        </pre>
                      </div>

                      <div>
                        <div className="text-sm font-semibold mb-2 text-white">Payment Required Response (402)</div>
                        <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-sm border border-white/10">
                          <code>
                            <span className="text-yellow-300">HTTP/1.1 402 Payment Required</span>{'\n'}
                            <span className="text-green-400">Accept-Payment:</span> <span className="text-white">x402 1.0 amount=10000 currency=USDC network=base-sepolia</span>{'\n\n'}
                            <span className="text-yellow-400">{'{'}</span>{'\n'}
                            {'  '}<span className="text-green-400">"error"</span><span className="text-white">:</span> <span className="text-orange-400">"Payment Required"</span><span className="text-white">,</span>{'\n'}
                            {'  '}<span className="text-green-400">"message"</span><span className="text-white">:</span> <span className="text-orange-400">"This endpoint requires x402 payment"</span><span className="text-white">,</span>{'\n'}
                            {'  '}<span className="text-green-400">"price"</span><span className="text-white">:</span> <span className="text-orange-400">"0.01 USDC"</span><span className="text-white">,</span>{'\n'}
                            {'  '}<span className="text-green-400">"network"</span><span className="text-white">:</span> <span className="text-orange-400">"Base Sepolia"</span>{'\n'}
                            <span className="text-yellow-400">{'}'}</span>
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-white border-white/20">GET</Badge>
                      <code className="text-sm text-blue-400">/api/deposit</code>
                    </div>
                    <p className="text-sm text-gray-400">
                      Get deposit information. Also protected by x402 payment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Code Examples Section */}
              <div id="examples" className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Terminal className="h-6 w-6 text-blue-400" />
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
                        <p className="text-sm text-gray-400">Install the x402 client</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard('npm install @x402/fetch', 0)}
                        >
                          {copiedIndex === 0 ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-sm border border-white/10">
                        <code><span className="text-yellow-300">npm</span> <span className="text-green-400">install</span> <span className="text-white">@x402/fetch</span></code>
                      </pre>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">Make a payment-protected request</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              `import { fetch402 } from '@x402/fetch';

const response = await fetch402('https://deposit.now/api/deposit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: '100.00',
    account: 'agent-wallet-123'
  })
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
                      <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-sm border border-white/10">
                        <code>
                          <span className="text-yellow-300">import</span> <span className="text-white">{'{'}</span> <span className="text-green-400">fetch402</span> <span className="text-white">{'}'}</span> <span className="text-yellow-300">from</span> <span className="text-orange-400">'@x402/fetch'</span><span className="text-white">;</span>{'\n\n'}
                          <span className="text-yellow-300">const</span> <span className="text-white">response</span> <span className="text-yellow-300">=</span> <span className="text-yellow-300">await</span> <span className="text-green-400">fetch402</span><span className="text-white">(</span><span className="text-orange-400">'https://deposit.now/api/deposit'</span><span className="text-white">,</span> <span className="text-white">{'{'}</span>{'\n'}
                          {'  '}<span className="text-green-400">method</span><span className="text-white">:</span> <span className="text-orange-400">'POST'</span><span className="text-white">,</span>{'\n'}
                          {'  '}<span className="text-green-400">headers</span><span className="text-white">:</span> <span className="text-white">{'{'}</span>{'\n'}
                          {'    '}<span className="text-orange-400">'Content-Type'</span><span className="text-white">:</span> <span className="text-orange-400">'application/json'</span><span className="text-white">,</span>{'\n'}
                          {'  '}<span className="text-white">{'}'}</span><span className="text-white">,</span>{'\n'}
                          {'  '}<span className="text-green-400">body</span><span className="text-white">:</span> <span className="text-white">JSON.</span><span className="text-green-400">stringify</span><span className="text-white">(</span><span className="text-white">{'{'}</span>{'\n'}
                          {'    '}<span className="text-green-400">amount</span><span className="text-white">:</span> <span className="text-orange-400">'100.00'</span><span className="text-white">,</span>{'\n'}
                          {'    '}<span className="text-green-400">account</span><span className="text-white">:</span> <span className="text-orange-400">'agent-wallet-123'</span>{'\n'}
                          {'  '}<span className="text-white">{'}'}</span><span className="text-white">)</span>{'\n'}
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
                        <p className="text-sm text-gray-400">Install the x402 client</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard('pip install x402-client', 2)}
                        >
                          {copiedIndex === 2 ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-sm border border-white/10">
                        <code><span className="text-yellow-300">pip</span> <span className="text-green-400">install</span> <span className="text-white">x402-client</span></code>
                      </pre>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">Make a payment-protected request</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              `from x402 import Client

client = Client()

response = client.post(
    'https://deposit.now/api/deposit',
    json={
        'amount': '100.00',
        'account': 'agent-wallet-123'
    }
)

result = response.json()
print(f"Deposit status: {result['status']}")
print(f"Transaction ID: {result['transactionId']}")`,
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
                      <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-sm border border-white/10">
                        <code>
                          <span className="text-yellow-300">from</span> <span className="text-white">x402</span> <span className="text-yellow-300">import</span> <span className="text-green-400">Client</span>{'\n\n'}
                          <span className="text-white">client</span> <span className="text-yellow-300">=</span> <span className="text-green-400">Client</span><span className="text-white">()</span>{'\n\n'}
                          <span className="text-white">response</span> <span className="text-yellow-300">=</span> <span className="text-white">client.</span><span className="text-green-400">post</span><span className="text-white">(</span>{'\n'}
                          {'    '}<span className="text-orange-400">'https://deposit.now/api/deposit'</span><span className="text-white">,</span>{'\n'}
                          {'    '}<span className="text-white">json</span><span className="text-yellow-300">=</span><span className="text-white">{'{'}</span>{'\n'}
                          {'        '}<span className="text-orange-400">'amount'</span><span className="text-white">:</span> <span className="text-orange-400">'100.00'</span><span className="text-white">,</span>{'\n'}
                          {'        '}<span className="text-orange-400">'account'</span><span className="text-white">:</span> <span className="text-orange-400">'agent-wallet-123'</span>{'\n'}
                          {'    '}<span className="text-white">{'}'}</span>{'\n'}
                          <span className="text-white">)</span>{'\n\n'}
                          <span className="text-white">result</span> <span className="text-yellow-300">=</span> <span className="text-white">response.</span><span className="text-green-400">json</span><span className="text-white">()</span>{'\n'}
                          <span className="text-green-400">print</span><span className="text-white">(</span><span className="text-orange-400">f"Deposit status: </span><span className="text-yellow-300">{'{'}</span><span className="text-white">result</span><span className="text-white">['status']</span><span className="text-yellow-300">{'}'}</span><span className="text-orange-400">"</span><span className="text-white">)</span>{'\n'}
                          <span className="text-green-400">print</span><span className="text-white">(</span><span className="text-orange-400">f"Transaction ID: </span><span className="text-yellow-300">{'{'}</span><span className="text-white">result</span><span className="text-white">['transactionId']</span><span className="text-yellow-300">{'}'}</span><span className="text-orange-400">"</span><span className="text-white">)</span>
                        </code>
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="curl" className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">
                        First request returns 402 with payment details
                      </p>
                      <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-sm border border-white/10">
                        <code>
                          <span className="text-yellow-300">curl</span> <span className="text-green-400">-X</span> <span className="text-white">POST</span> <span className="text-orange-400">https://deposit.now/api/deposit</span> <span className="text-white">\</span>{'\n'}
                          {'  '}<span className="text-green-400">-H</span> <span className="text-orange-400">"Content-Type: application/json"</span> <span className="text-white">\</span>{'\n'}
                          {'  '}<span className="text-green-400">-d</span> <span className="text-orange-400">'{`{`}"amount": "100.00", "account": "agent-wallet-123"{`}`}'</span>{'\n\n'}
                          <span className="text-gray-500"># Response: HTTP 402 Payment Required</span>{'\n'}
                          <span className="text-gray-500"># Accept-Payment: x402 1.0 amount=10000 currency=USDC network=base-sepolia</span>
                        </code>
                      </pre>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">
                        After payment, include proof headers
                      </p>
                      <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-sm border border-white/10">
                        <code>
                          <span className="text-yellow-300">curl</span> <span className="text-green-400">-X</span> <span className="text-white">POST</span> <span className="text-orange-400">https://deposit.now/api/deposit</span> <span className="text-white">\</span>{'\n'}
                          {'  '}<span className="text-green-400">-H</span> <span className="text-orange-400">"Content-Type: application/json"</span> <span className="text-white">\</span>{'\n'}
                          {'  '}<span className="text-green-400">-H</span> <span className="text-orange-400">"X-Payment-Proof: &lt;proof&gt;"</span> <span className="text-white">\</span>{'\n'}
                          {'  '}<span className="text-green-400">-H</span> <span className="text-orange-400">"X-Payment-Tx: &lt;transaction-hash&gt;"</span> <span className="text-white">\</span>{'\n'}
                          {'  '}<span className="text-green-400">-d</span> <span className="text-orange-400">'{`{`}"amount": "100.00", "account": "agent-wallet-123"{`}`}'</span>{'\n\n'}
                          <span className="text-gray-500"># Response: HTTP 200 OK with deposit confirmation</span>
                        </code>
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Error Handling Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Terminal className="h-6 w-6 text-blue-400" />
                  <h2 className="text-2xl font-bold text-white">Error Handling</h2>
                </div>
                <div className="space-y-4">
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <div className="font-semibold mb-1 text-white">402 Payment Required</div>
                    <p className="text-sm text-gray-400">
                      No payment provided or payment invalid. Check the Accept-Payment header for payment requirements.
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <div className="font-semibold mb-1 text-white">400 Bad Request</div>
                    <p className="text-sm text-gray-400">
                      Invalid request body or parameters.
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <div className="font-semibold mb-1 text-white">500 Internal Server Error</div>
                    <p className="text-sm text-gray-400">
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

      {/* Footer */}
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
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                        Network Status
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
