'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Coins, CheckCircle2, Sparkles } from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';
import { Header } from '@/components/Header';
import { WhyDepositNow } from '@/components/WhyDepositNow';


export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setEmail('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to join waitlist');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen page-shell">
      <Header />

      <section className="relative overflow-hidden py-16 sm:py-40">
        <div className="absolute inset-0 opacity-25 hero-grid" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, transparent 0%, color-mix(in oklch, var(--background) 88%, transparent) 100%)',
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 sm:mb-12 px-4 py-2 bg-transparent border-primary/50 text-primary font-black uppercase" style={{ letterSpacing: '0.3em', fontSize: '10px' }} variant="outline">
              <Zap className="h-3 w-3 mr-2" />
              x402 Protocol Standard
            </Badge>

            <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-4 leading-[1.05]">
              <div className="text-white mb-2">The Funding Layer</div>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/90 to-accent">
                for AI Agents
              </div>
            </h1>

            <p className="text-lg sm:text-2xl text-primary font-medium mb-4 sm:mb-8 mt-4 sm:mt-8">
              Enable machines to manage capital autonomously.
            </p>

            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed">
              deposit.now is the first public x402 API that lets AI agents deposit funds
              autonomously — 0.01 USDC per call on Base mainnet, paid over HTTP 402.
              No accounts, no API keys, no humans in the loop.
            </p>

            {!isSubmitted ? (
              <form id="waitlist" onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2">
                  <Input
                    type="email"
                    placeholder="enter email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/45 h-12 text-base px-4 rounded-xl backdrop-blur-sm focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:border-white/35"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-wider px-8 h-12 rounded-xl shrink-0"
                  >
                    {isSubmitting ? 'Joining...' : 'Join the Waitlist'}
                  </Button>
                </div>
                {error && <p className="text-sm text-red-400 mt-3 text-center sm:text-left">{error}</p>}
              </form>
            ) : (
              <div className="max-w-2xl mx-auto mb-12">
                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="pt-6 text-center">
                    <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-green-500 font-medium">You're on the list!</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      We'll notify you when beta launches
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex justify-center items-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground/70 uppercase tracking-wider font-medium py-4 sm:py-0">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                <span>Live on Base Mainnet</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Coins className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground/70" />
                <span>0.01 USDC per call</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhyDepositNow />

      <section className="py-20 bg-muted/40 border-t border-primary/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card/60 border-border/60 backdrop-blur rounded-3xl relative overflow-hidden">
              <div className="absolute top-4 right-6 text-[120px] font-bold text-white/5 leading-none select-none">01</div>
              <CardContent className="p-10 relative z-10">
                <h3 className="text-2xl font-bold mb-4 text-white">Trigger Deposit</h3>
                <p className="text-muted-foreground mb-6">
                  Agents call the gateway to fund a target wallet or pay for a specialized resource.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-white">Non-custodial flow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-white">Low-latency edge validation</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border/60 backdrop-blur rounded-3xl relative overflow-hidden">
              <div className="absolute top-4 right-6 text-[120px] font-bold text-white/5 leading-none select-none">02</div>
              <CardContent className="p-10 relative z-10">
                <h3 className="text-2xl font-bold mb-4 text-white">Handle x402</h3>
                <p className="text-muted-foreground mb-6">
                  The API returns 402 with settlement coordinates. Agents sign and pay USDC instantly.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-white">Machine-readable headers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-white">Deterministic pricing</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border/60 backdrop-blur rounded-3xl relative overflow-hidden">
              <div className="absolute top-4 right-6 text-[120px] font-bold text-white/5 leading-none select-none">03</div>
              <CardContent className="p-10 relative z-10">
                <h3 className="text-2xl font-bold mb-4 text-white">Atomic Funding</h3>
                <p className="text-muted-foreground mb-6">
                  Payment is verified on-chain. Funding is executed or resource is unlocked instantly.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-white">&lt; 2s settlement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-white">High reliability</span>
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
                Built for<br />Autonomous<br />Agents
              </h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                Stop building brittle API-key based funding systems. Use the native protocol of the agentic economy.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg text-white font-medium">Programmatic Settlements</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg text-white font-medium">Micro-USDC Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg text-white font-medium">No Authentication Friction</span>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-card/80 border border-border/60 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02]">
                <div className="bg-muted/80 px-6 py-4 border-b border-border/60 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="p-8 font-mono text-sm">
                  <div className="mb-6">
                    <div className="text-primary text-xs mb-2">// REQUEST</div>
                    <div className="text-foreground/80">
                      <span className="text-purple-400">GET</span> /api/fund/init
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
                      <div className="text-primary text-xs mb-2">CHALLENGE_DETAILS</div>
                      <div className="text-foreground/80 text-xs leading-relaxed">
                        <span className="text-emerald-400">WWW-Authenticate:</span> x402 address=<span className="text-orange-400">"0x742d..."</span>, amount=<span className="text-orange-400">"0.01"</span>, asset=<span className="text-orange-400">"USDC"</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground/70 text-xs">CONF</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono text-xs">
                      200 Success
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
