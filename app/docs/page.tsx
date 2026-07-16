'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { SiteFooter } from '@/components/SiteFooter';
import { ChevronRight, Copy, CheckCircle2 } from 'lucide-react';

const SECTIONS = [
  { id: 'introduction', label: 'Introduction' },
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
                <h1 className="text-sm font-medium text-muted-foreground mb-2">
                  deposit.now documentation
                </h1>
                <p className="text-3xl font-black text-white tracking-tight">
                  The Funding Layer for AI Agents
                </p>
              </div>

              <section id="introduction" className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Introduction</h2>
                <div className="border border-primary/30 rounded-lg p-5 bg-primary/5">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-white">deposit.now</strong> is a programmable deposit
                    API. Agents call <code className="text-primary">POST /api/deposit</code> with a
                    target wallet and net amount, pay <strong className="text-white">amount + 1%</strong>{' '}
                    via x402, and the platform forwards net USDC to the target — including
                    sub-wallets and child agents. No humans required for secondary / agent-to-agent
                    flows.
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    Network: Base mainnet (eip155:8453) in production
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    Fee: flat 1% of net deposit
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
                    <strong className="text-white">5.</strong> Returns success receipt (also at{' '}
                    <code className="text-primary">/receipt/&lt;id&gt;</code>).
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
                  <pre className="bg-muted/50 border border-border/60 rounded-xl p-4 text-xs text-foreground/90 overflow-x-auto leading-relaxed">
                    {jsExample}
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
                  <pre className="bg-muted/50 border border-border/60 rounded-xl p-4 text-xs text-foreground/90 overflow-x-auto leading-relaxed">
                    {curlExample}
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
                    <p className="text-white font-semibold mb-1">Can I fund a child agent?</p>
                    <p>
                      Yes. Set <code className="text-primary">target</code> to the child / sub-wallet
                      address. Parent pays; child receives net USDC.
                    </p>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Are merchant endpoints still live?</p>
                    <p>
                      No. Merchant registration, renew/topup, and facilitator dashboards are retired.
                      Use the single deposit API.
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
