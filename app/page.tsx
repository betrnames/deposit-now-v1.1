import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Coins, CheckCircle2, Sparkles } from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';
import { Header } from '@/components/Header';
import { WhyDepositNow } from '@/components/WhyDepositNow';
import { TerminalTitle } from '@/components/TerminalTitle';
import { honestPitch } from '@/lib/pricing';

export default function Home() {
  return (
    <div className="min-h-screen page-shell">
      <Header />

      <section className="relative overflow-hidden py-12 sm:py-40">
        <div className="absolute inset-0 opacity-25 hero-grid" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, transparent 0%, color-mix(in oklch, var(--background) 88%, transparent) 100%)',
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <Badge
              className="mb-6 sm:mb-12 px-4 py-2 bg-transparent border-primary/50 text-primary font-black uppercase"
              style={{ letterSpacing: '0.2em', fontSize: '10px' }}
              variant="outline"
            >
              <Zap className="h-3 w-3 mr-2" />
              x402 · Base mainnet
            </Badge>

            <TerminalTitle className="w-full text-[2.15rem] leading-[1.08] sm:text-7xl lg:text-8xl font-black tracking-tighter mb-4 sm:leading-[1.05] text-center">
              <span className="inline-flex flex-col items-start text-left align-top">
                <span className="block text-white mb-1 sm:mb-2">Open x402</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/90 to-accent">
                  funding rail
                </span>
              </span>
            </TerminalTitle>

            <p className="text-base sm:text-2xl text-primary font-medium mb-4 sm:mb-8 mt-4 sm:mt-8 max-w-md sm:max-w-none px-1">
              Pay amount + 1% · net to any EVM target
            </p>

            <p className="text-sm sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-1">
              {honestPitch}
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-4 mb-10 sm:mb-12 w-full max-w-xs sm:max-w-none">
              <a
                href="/docs"
                className="bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-wider px-8 h-12 rounded-xl inline-flex items-center justify-center"
              >
                Get started
              </a>
              <a
                href="/llms.txt"
                className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-black text-[10px] uppercase tracking-wider px-8 h-12 rounded-xl inline-flex items-center justify-center"
              >
                llms.txt
              </a>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-8 text-xs sm:text-sm text-muted-foreground/70 uppercase tracking-wider font-medium">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary shrink-0" />
                <span>Live on Base Mainnet</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground/70 shrink-0" />
                <span>1% platform fee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="Positioning statement"
        className="border-y border-primary/30 bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <blockquote className="text-center text-lg sm:text-2xl lg:text-3xl italic text-white/90 leading-snug tracking-tight">
            <span className="text-primary not-italic text-3xl sm:text-4xl lg:text-5xl leading-none align-top">
              &ldquo;
            </span>
            An open x402 funding rail — not a Coinbase Fund replacement. Protocol-shaped deposits
            to any target, with optional public receipts.
            <span className="text-primary not-italic text-3xl sm:text-4xl lg:text-5xl leading-none align-bottom">
              &rdquo;
            </span>
          </blockquote>
        </div>
      </section>

      <WhyDepositNow />

      <section className="py-20 bg-muted/40 border-t border-primary/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card/60 border-border/60 backdrop-blur rounded-3xl relative overflow-hidden">
              <div className="absolute top-4 right-6 text-[120px] font-bold text-white/5 leading-none select-none">
                01
              </div>
              <CardContent className="p-10 relative z-10">
                <h3 className="text-2xl font-bold mb-4 text-white">Call deposit</h3>
                <p className="text-muted-foreground mb-6">
                  Agent posts <code className="text-primary text-sm">target</code>,{' '}
                  <code className="text-primary text-sm">amount</code>, optional memo.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-white">Any EVM target address</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-white">You supply the wallet</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border/60 backdrop-blur rounded-3xl relative overflow-hidden">
              <div className="absolute top-4 right-6 text-[120px] font-bold text-white/5 leading-none select-none">
                02
              </div>
              <CardContent className="p-10 relative z-10">
                <h3 className="text-2xl font-bold mb-4 text-white">Pay x402</h3>
                <p className="text-muted-foreground mb-6">
                  HTTP 402 for amount + 1%. Agent pays USDC to the platform wallet via x402.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-white">No deposit.now API key</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-white">Standard x402 clients</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border/60 backdrop-blur rounded-3xl relative overflow-hidden">
              <div className="absolute top-4 right-6 text-[120px] font-bold text-white/5 leading-none select-none">
                03
              </div>
              <CardContent className="p-10 relative z-10">
                <h3 className="text-2xl font-bold mb-4 text-white">Forward + receipt</h3>
                <p className="text-muted-foreground mb-6">
                  After settlement, net is forwarded to target. Receipt is optional public proof —
                  check <code className="text-primary text-sm">forwardStatus</code>.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-white">Async forward (can fail)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-white">Basescan when hashes exist</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary/10 to-background/80 border-t border-primary/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-black mb-6 text-white leading-tight">
                Protocol-shaped
                <br />
                wallet funding
              </h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                Use Coinbase CDP Fund when you already live in their wallet stack. Use deposit.now
                when you want an open HTTP 402 deposit to any address you specify.
              </p>
              <div className="space-y-4">
                {[
                  'x402 exact scheme on Base',
                  'Target = any address you already have',
                  'Honest status: payment_received vs forward',
                ].map((label) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg text-white font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-card/80 border border-border/60 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02]">
                <div className="bg-muted/80 px-6 py-4 border-b border-border/60 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="p-8 font-mono text-sm">
                  <div className="mb-6">
                    <div className="text-primary text-xs mb-2">// REQUEST</div>
                    <div className="text-foreground/80">
                      <span className="text-purple-400">POST</span> /api/deposit
                    </div>
                    <div className="text-foreground/70 text-xs mt-3 leading-relaxed">
                      {`{ "target": "0x…", "amount": "50.00", "memo": "optional" }`}
                    </div>
                  </div>

                  <div className="mb-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground/70 text-xs">RECV</span>
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 font-mono text-xs">
                        402 Payment Required
                      </Badge>
                    </div>

                    <div className="bg-muted/40 border border-border/40 rounded-lg p-4 space-y-2">
                      <div className="text-primary text-xs mb-2">PAY AMOUNT + 1%</div>
                      <div className="text-foreground/80 text-xs leading-relaxed">
                        gross <span className="text-orange-400">50.50</span> USDC → platform · net{' '}
                        <span className="text-orange-400">50.00</span> → target (async)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground/70 text-xs">CONF</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono text-xs">
                      200 payment_received
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
