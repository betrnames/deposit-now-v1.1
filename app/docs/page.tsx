'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { SiteFooter } from '@/components/SiteFooter';
import { TerminalTitle } from '@/components/TerminalTitle';
import { ChevronRight, Copy, CheckCircle2 } from 'lucide-react';

const SECTIONS = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'who-needs-what', label: 'Who needs what' },
  { id: 'quickstart', label: 'Quickstart' },
  { id: 'flow', label: 'Flow' },
  { id: 'endpoints', label: 'Endpoints' },
  { id: 'examples', label: 'Code examples' },
  { id: 'security', label: 'Security' },
  { id: 'faq', label: 'FAQ' },
] as const;

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
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const jsExample = `import { wrapFetchWithPayment } from '@x402/fetch';
import { x402Client } from '@x402/core/client';
import { ExactEvmScheme } from '@x402/evm/exact/client';
import { privateKeyToAccount } from 'viem/accounts';

const signer = privateKeyToAccount(process.env.EVM_PRIVATE_KEY); // payer agent only
const client = new x402Client();
client.register('eip155:*', new ExactEvmScheme(signer));
const fetchWithPayment = wrapFetchWithPayment(fetch, client);

const res = await fetchWithPayment('https://deposit.now/api/deposit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    target: '0xChildOrSubWalletAddress',
    amount: '50.00',
    memo: 'Fund child trading agent',
  }),
});
console.log(await res.json());`;

  const curlExample = `curl -i -X POST https://deposit.now/api/deposit \\
  -H 'Content-Type: application/json' \\
  -d '{"target":"0x...","amount":"50.00","memo":"Fund child trading agent"}'
# → HTTP 402 + Payment-Required header (pay amount + 1%)`;

  const jsHighlighted = (
    <>
      <span className="text-yellow-300">import</span>{' '}
      <span className="text-white">{'{ wrapFetchWithPayment }'}</span>{' '}
      <span className="text-yellow-300">from</span>{' '}
      <span className="text-orange-400">&apos;@x402/fetch&apos;</span>
      <span className="text-white">;</span>
      {'\n'}
      <span className="text-yellow-300">import</span>{' '}
      <span className="text-white">{'{ x402Client }'}</span>{' '}
      <span className="text-yellow-300">from</span>{' '}
      <span className="text-orange-400">&apos;@x402/core/client&apos;</span>
      <span className="text-white">;</span>
      {'\n'}
      <span className="text-yellow-300">import</span>{' '}
      <span className="text-white">{'{ ExactEvmScheme }'}</span>{' '}
      <span className="text-yellow-300">from</span>{' '}
      <span className="text-orange-400">&apos;@x402/evm/exact/client&apos;</span>
      <span className="text-white">;</span>
      {'\n'}
      <span className="text-yellow-300">import</span>{' '}
      <span className="text-white">{'{ privateKeyToAccount }'}</span>{' '}
      <span className="text-yellow-300">from</span>{' '}
      <span className="text-orange-400">&apos;viem/accounts&apos;</span>
      <span className="text-white">;</span>
      {'\n\n'}
      <span className="text-yellow-300">const</span> <span className="text-white">signer</span>{' '}
      <span className="text-yellow-300">=</span>{' '}
      <span className="text-green-400">privateKeyToAccount</span>
      <span className="text-white">(process.env.EVM_PRIVATE_KEY);</span>{' '}
      <span className="text-muted-foreground/70">// payer agent only</span>
      {'\n'}
      <span className="text-yellow-300">const</span> <span className="text-white">client</span>{' '}
      <span className="text-yellow-300">=</span> <span className="text-yellow-300">new</span>{' '}
      <span className="text-green-400">x402Client</span>
      <span className="text-white">();</span>
      {'\n'}
      <span className="text-white">client.</span>
      <span className="text-green-400">register</span>
      <span className="text-white">(</span>
      <span className="text-orange-400">&apos;eip155:*&apos;</span>
      <span className="text-white">,</span> <span className="text-yellow-300">new</span>{' '}
      <span className="text-green-400">ExactEvmScheme</span>
      <span className="text-white">(signer));</span>
      {'\n'}
      <span className="text-yellow-300">const</span> <span className="text-white">fetchWithPayment</span>{' '}
      <span className="text-yellow-300">=</span>{' '}
      <span className="text-green-400">wrapFetchWithPayment</span>
      <span className="text-white">(fetch, client);</span>
      {'\n\n'}
      <span className="text-yellow-300">const</span> <span className="text-white">res</span>{' '}
      <span className="text-yellow-300">=</span> <span className="text-yellow-300">await</span>{' '}
      <span className="text-green-400">fetchWithPayment</span>
      <span className="text-white">(</span>
      <span className="text-orange-400">&apos;https://deposit.now/api/deposit&apos;</span>
      <span className="text-white">, {'{'}</span>
      {'\n'}
      {'  '}
      <span className="text-green-400">method</span>
      <span className="text-white">:</span>{' '}
      <span className="text-orange-400">&apos;POST&apos;</span>
      <span className="text-white">,</span>
      {'\n'}
      {'  '}
      <span className="text-green-400">headers</span>
      <span className="text-white">: {'{ '}</span>
      <span className="text-orange-400">&apos;Content-Type&apos;</span>
      <span className="text-white">:</span>{' '}
      <span className="text-orange-400">&apos;application/json&apos;</span>
      <span className="text-white">{' }'}</span>
      <span className="text-white">,</span>
      {'\n'}
      {'  '}
      <span className="text-green-400">body</span>
      <span className="text-white">:</span> <span className="text-white">JSON.</span>
      <span className="text-green-400">stringify</span>
      <span className="text-white">({'{'}{'\n'}</span>
      {'    '}
      <span className="text-green-400">target</span>
      <span className="text-white">:</span>{' '}
      <span className="text-orange-400">&apos;0xChildOrSubWalletAddress&apos;</span>
      <span className="text-white">,</span>
      {'\n'}
      {'    '}
      <span className="text-green-400">amount</span>
      <span className="text-white">:</span>{' '}
      <span className="text-orange-400">&apos;50.00&apos;</span>
      <span className="text-white">,</span>
      {'\n'}
      {'    '}
      <span className="text-green-400">memo</span>
      <span className="text-white">:</span>{' '}
      <span className="text-orange-400">&apos;Fund child trading agent&apos;</span>
      <span className="text-white">,</span>
      {'\n'}
      {'  '}
      <span className="text-white">{'})'}</span>
      <span className="text-white">,</span>
      {'\n'}
      <span className="text-white">{'});'}</span>
      {'\n'}
      <span className="text-white">console.</span>
      <span className="text-green-400">log</span>
      <span className="text-white">(</span>
      <span className="text-yellow-300">await</span> <span className="text-white">res.</span>
      <span className="text-green-400">json</span>
      <span className="text-white">());</span>
    </>
  );

  const curlHighlighted = (
    <>
      <span className="text-green-400">curl</span> <span className="text-yellow-300">-i</span>{' '}
      <span className="text-yellow-300">-X</span> <span className="text-orange-400">POST</span>{' '}
      <span className="text-white">https://deposit.now/api/deposit</span> <span className="text-white">\</span>
      {'\n'}
      {'  '}
      <span className="text-yellow-300">-H</span>{' '}
      <span className="text-orange-400">&apos;Content-Type: application/json&apos;</span>{' '}
      <span className="text-white">\</span>
      {'\n'}
      {'  '}
      <span className="text-yellow-300">-d</span>{' '}
      <span className="text-orange-400">
        &apos;{`{"target":"0x...","amount":"50.00","memo":"Fund child trading agent"}`}&apos;
      </span>
      {'\n'}
      <span className="text-muted-foreground/70">
        # → HTTP 402 + Payment-Required header (pay amount + 1%)
      </span>
    </>
  );

  return (
    <div className="min-h-screen page-shell">
      <Header />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="flex gap-8">
          <aside className="w-56 flex-shrink-0 hidden md:block">
            <div className="sticky top-24 py-6">
              <h2 className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-6 px-4">
                Documentation
              </h2>
              <nav className="space-y-1">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      activeSection === s.id
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted-foreground hover:text-white hover:bg-muted/50'
                    }`}
                  >
                    <ChevronRight className="h-4 w-4" />
                    {s.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="max-w-4xl space-y-16">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2 font-mono">
                  <span className="text-primary/80" aria-hidden="true">
                    &gt;_
                  </span>{' '}
                  deposit.now documentation
                </p>
                <TerminalTitle className="text-3xl font-black text-white tracking-tight">
                  Open x402 funding rail
                </TerminalTitle>
              </div>

              <section id="introduction" className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Introduction</h2>
                <div className="border border-primary/30 rounded-lg p-5 bg-primary/5">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-white">deposit.now</strong> is an open{' '}
                    <strong className="text-white">x402 funding rail</strong>: call{' '}
                    <code className="text-primary">POST /api/deposit</code> with a target address
                    and net amount, pay <strong className="text-white">amount + 1%</strong> via
                    x402, and the platform forwards net USDC after settlement. It does{' '}
                    <strong className="text-white">not</strong> create wallets and does{' '}
                    <strong className="text-white">not</strong> replace Coinbase CDP Fund/Send
                    inside Agentic or Server Wallets.
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    Network: Base mainnet (eip155:8453) in production
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    Fee: flat 1% of net · response status is <code className="text-primary">payment_received</code> (forward is async)
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    Machine contracts:{' '}
                    <a href="/llms.txt" className="text-primary hover:underline">
                      llms.txt
                    </a>
                    ,{' '}
                    <a href="/openapi.json" className="text-primary hover:underline">
                      openapi.json
                    </a>
                  </li>
                </ul>
              </section>

              <section id="who-needs-what" className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Who needs what</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  deposit.now is an agent / API rail. You do not connect a browser wallet on this
                  site to use the product. Credentials differ by role:
                </p>
                <div className="overflow-x-auto rounded-xl border border-border/60">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/30">
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Who
                        </th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Needs
                        </th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Does not need
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-white/5">
                        <td className="px-4 py-3 text-white font-medium align-top">Paying agent</td>
                        <td className="px-4 py-3 align-top">
                          Any x402 client (e.g. <code className="text-primary">@x402/fetch</code> +
                          viem), a wallet/signer, and USDC on Base
                        </td>
                        <td className="px-4 py-3 align-top">
                          deposit.now API key, site account, browser &quot;Connect wallet&quot;, or
                          Coinbase AgentKit (optional only)
                        </td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="px-4 py-3 text-white font-medium align-top">Target wallet</td>
                        <td className="px-4 py-3 align-top">
                          An EVM address you already have (EOA, agent wallet, CDP wallet, etc.)
                        </td>
                        <td className="px-4 py-3 align-top">
                          To be created by deposit.now — we do not mint sub-wallets
                        </td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="px-4 py-3 text-white font-medium align-top">
                          deposit.now platform
                        </td>
                        <td className="px-4 py-3 align-top">
                          CDP credentials + storage on the server (for receive + forward + optional
                          receipts)
                        </td>
                        <td className="px-4 py-3 align-top">
                          Your payer private keys — never send those to deposit.now
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-white font-medium align-top">
                          Humans on the website
                        </td>
                        <td className="px-4 py-3 align-top">Docs, OpenAPI, llms.txt</td>
                        <td className="px-4 py-3 align-top">
                          Wallet connect to call the API (agents call it in code)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-white">Coinbase AgentKit / Agentic Wallet:</strong> not
                    required for payers. Use them if you already run on CDP. Any x402-capable wallet
                    works.
                  </p>
                  <p>
                    <strong className="text-white">CDP Fund / Send:</strong> great inside Coinbase&apos;s
                    stack. deposit.now is the open HTTP 402 deposit call when you want any{' '}
                    <code className="text-primary">target</code> + optional public receipt without a
                    deposit.now API key.
                  </p>
                  <p>
                    <strong className="text-white">Auth model:</strong> payment is auth. Unpaid
                    requests get HTTP 402; paid requests include the x402 payment proof — not{' '}
                    <code className="text-primary">Authorization: Bearer …</code>.
                  </p>
                </div>
              </section>

              <section id="quickstart" className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Quickstart</h2>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Install an x402 client (e.g. @x402/fetch + viem for JS).</li>
                  <li>
                    POST JSON: <code className="text-primary">{`{ target, amount, memo? }`}</code>
                  </li>
                  <li>Handle 402 — pay gross (amount + 1%) in USDC.</li>
                  <li>Retry with payment proof; read receiptId / receiptUrl from the 200 body.</li>
                </ol>
              </section>

              <section id="flow" className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Bare-bones flow</h2>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li>
                    <strong className="text-white">1.</strong> Agent calls{' '}
                    <code className="text-primary">POST /api/deposit</code> with{' '}
                    <code className="text-primary">
                      {`{ target: "0x…", amount: "50.00", memo?: "…" }`}
                    </code>
                  </li>
                  <li>
                    <strong className="text-white">2.</strong> Server returns 402 + x402 payment
                    request for amount + 1% fee.
                  </li>
                  <li>
                    <strong className="text-white">3.</strong> Agent pays full gross via x402 to the
                    platform Coinbase Agentic (CDP) wallet.
                  </li>
                  <li>
                    <strong className="text-white">4.</strong> Backend confirms settlement → keeps
                    fee → forwards net to <code className="text-primary">target</code> via CDP.
                  </li>
                  <li>
                    <strong className="text-white">5.</strong> Returns{' '}
                    <code className="text-primary">payment_received</code> +{' '}
                    <code className="text-primary">receiptUrl</code>. Check the receipt for{' '}
                    <code className="text-primary">forwardStatus</code> and Basescan links — 200
                    does not mean the target already holds funds.
                  </li>
                </ol>
              </section>

              <section id="endpoints" className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Endpoints</h2>
                <Card className="bg-card/60 border-border/60">
                  <CardContent className="p-6 space-y-4 text-sm">
                    <div>
                      <code className="text-primary font-mono">POST /api/deposit</code>
                      <p className="text-muted-foreground mt-2">
                        Body: <code className="text-white">target</code> (required EVM address),{' '}
                        <code className="text-white">amount</code> (required net USDC 0.01–100000),{' '}
                        <code className="text-white">memo</code> (optional, max 256 chars).
                      </p>
                    </div>
                    <div>
                      <code className="text-primary font-mono">GET /api/deposit</code>
                      <p className="text-muted-foreground mt-2">
                        Service metadata (also x402-protected when paid probes are used).
                      </p>
                    </div>
                    <div>
                      <code className="text-primary font-mono">GET /api/discovery</code> ·{' '}
                      <code className="text-primary font-mono">GET /.well-known/x402</code>
                      <p className="text-muted-foreground mt-2">Machine-readable discovery manifest.</p>
                    </div>
                    <div>
                      <code className="text-primary font-mono">GET /receipt/:id</code>
                      <p className="text-muted-foreground mt-2">Public verifiable receipt page.</p>
                    </div>
                  </CardContent>
                </Card>
              </section>

              <section id="examples" className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Code examples</h2>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-white">JavaScript (@x402/fetch)</h3>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(jsExample, 0)}
                      className="text-xs text-muted-foreground hover:text-white flex items-center gap-1"
                    >
                      {copiedIndex === 0 ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      Copy
                    </button>
                  </div>
                  <pre className="bg-muted/50 border border-border/60 rounded-xl p-4 text-xs overflow-x-auto leading-relaxed font-mono">
                    <code>{jsHighlighted}</code>
                  </pre>
                  <p className="text-xs text-muted-foreground mt-2">
                    <code className="text-primary">EVM_PRIVATE_KEY</code> is only for the{' '}
                    <em>paying</em> agent client — never for the deposit.now server.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-white">curl (probe 402)</h3>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(curlExample, 1)}
                      className="text-xs text-muted-foreground hover:text-white flex items-center gap-1"
                    >
                      {copiedIndex === 1 ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      Copy
                    </button>
                  </div>
                  <pre className="bg-muted/50 border border-border/60 rounded-xl p-4 text-xs overflow-x-auto leading-relaxed font-mono">
                    <code>{curlHighlighted}</code>
                  </pre>
                </div>
              </section>

              <section id="security" className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Security</h2>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li>Platform hot wallet via Coinbase CDP / Agentic Wallet only — no raw platform private keys in app code.</li>
                  <li>Strict validation: EVM address + amount caps (0.01–100000 USDC).</li>
                  <li>Rate limiting on /api/* (stricter on deposit).</li>
                  <li>x402 facilitator verifies payment on-chain before success response.</li>
                  <li>Forward to target only after settlement; retries + settlement logs on failure.</li>
                </ul>
              </section>

              <section id="faq" className="space-y-4">
                <h2 className="text-2xl font-bold text-white">FAQ</h2>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <div>
                    <p className="text-white font-semibold mb-1">Can I fund any wallet?</p>
                    <p>
                      You can set <code className="text-primary">target</code> to any EVM address you
                      already have (including another agent’s wallet). deposit.now does not create
                      wallets. Net forward is async after settlement.
                    </p>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">
                      Why not just use Coinbase Fund?
                    </p>
                    <p>
                      If you already run on Coinbase Agentic / Server Wallets, CDP Fund/Send is
                      usually better. deposit.now is for an open x402 deposit call to any target
                      without a deposit.now API key.
                    </p>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">
                      Do I need AgentKit or a connect-wallet button?
                    </p>
                    <p>
                      No. Payers use any x402 client and their own wallet/signer. AgentKit is
                      optional. This site does not require browser wallet connect — agents call the
                      API in code. See{' '}
                      <button
                        type="button"
                        onClick={() => scrollToSection('who-needs-what')}
                        className="text-primary hover:underline"
                      >
                        Who needs what
                      </button>
                      .
                    </p>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">
                      Does 200 mean the target is funded?
                    </p>
                    <p>
                      No. <code className="text-primary">payment_received</code> means the x402
                      payment was accepted. Check <code className="text-primary">receiptUrl</code>{' '}
                      for <code className="text-primary">forwardStatus</code> and tx links.
                    </p>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Where is the machine-readable guide?</p>
                    <p>
                      <a href="/llms.txt" className="text-primary hover:underline">
                        /llms.txt
                      </a>{' '}
                      and{' '}
                      <a href="/llms-full.txt" className="text-primary hover:underline">
                        /llms-full.txt
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
