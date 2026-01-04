'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, Coins, CheckCircle2, Code, Sparkles, Bolt, ExternalLink, Github, Mail, Sun } from 'lucide-react';
import { NodeExchangeIcon } from '@/components/icons';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      setShowStickyCta(window.scrollY > 800);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-900/95' : 'bg-slate-900/0'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className={`border rounded-2xl transition-all duration-300 backdrop-blur-md ${
            isScrolled ? 'bg-slate-900/60 border-blue-500/20' : 'bg-slate-900/40 border-blue-500/10'
          }`}>
            <div className="flex justify-center sm:justify-between items-center h-14 sm:h-16 px-3 sm:px-6 relative">
              <div className="flex items-center gap-2 sm:gap-3">
                <NodeExchangeIcon className="text-blue-500 w-12 h-12 sm:w-12 sm:h-12" />
                <span className="text-lg sm:text-lg font-black tracking-tight">
                  <span className="text-white">Deposit</span>
                  <span className="text-blue-500">.</span>
                  <span className="text-white">now</span>
                </span>
              </div>
              <div className="flex items-center gap-3 sm:gap-8 absolute right-3 sm:relative sm:right-0">
                <a href="/docs" className="text-sm font-medium text-white hover:text-blue-400 transition-colors hidden sm:inline">
                  API
                </a>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-wider px-6 h-10 rounded-lg hidden sm:flex">
                  GET STARTED
                </Button>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="sm:hidden w-12 h-12 flex items-center justify-center"
                  aria-label="Toggle menu"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <line x1="6" y1="8" x2="16" y2="8" className={`transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></line>
                    <line x1="4" y1="12" x2="20" y2="12"></line>
                    <line x1="8" y1="16" x2="14" y2="16" className={`transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 sm:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}></div>

      <div className={`fixed top-0 right-0 h-full w-64 bg-slate-900/95 backdrop-blur-xl border-l border-blue-500/20 z-50 transform transition-transform duration-300 ease-out sm:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center"
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-6">
            <a href="/docs" className="text-lg font-medium text-white hover:text-blue-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              API
            </a>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-wider px-6 h-10 rounded-lg w-full">
              GET STARTED
            </Button>
          </nav>
        </div>
      </div>

      <section className="relative overflow-hidden py-16 sm:py-40">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at center, transparent 0%, rgba(15, 23, 42, 0.8) 100%)`
          }}></div>
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 sm:mb-12 px-4 py-2 bg-transparent border-blue-500/50 text-blue-400 font-black uppercase" style={{ letterSpacing: '0.3em', fontSize: '10px' }} variant="outline">
              <Zap className="h-3 w-3 mr-2" />
              x402 Protocol Standard
            </Badge>

            <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-4 leading-[1.05]">
              <div className="text-white mb-2">The Funding Layer</div>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-purple-600">
                for AI Agents
              </div>
            </h1>

            <p className="text-lg sm:text-2xl text-blue-400 font-medium mb-4 sm:mb-8 mt-4 sm:mt-8">
              Enable machines to manage capital autonomously.
            </p>

            <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed">
              Deposit.now uses HTTP 402 Payment Required status to allow AI agents<br className="hidden sm:block" />
              to fund wallets instantly via micro-stablecoins — no humans in the loop.
            </p>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12">
                <div className="flex border border-blue-400/30 rounded-2xl p-2 gap-2">
                  <Input
                    type="email"
                    placeholder="enter email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-slate-900/60 border-0 text-white placeholder:text-gray-400 h-12 text-base px-4 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-wider px-8 h-12 rounded-md"
                  >
                    {isSubmitting ? 'Joining...' : 'Join the Waitlist'}
                  </Button>
                </div>
                {error && <p className="text-sm text-red-400 mt-3 text-left">{error}</p>}
              </form>
            ) : (
              <div className="max-w-2xl mx-auto mb-12">
                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="pt-6 text-center">
                    <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-green-500 font-medium">You're on the list!</p>
                    <p className="text-sm text-gray-400 mt-1">
                      We'll notify you when beta launches
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex justify-center items-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-medium py-4 sm:py-0">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                <span>Early Access Open</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Coins className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                <span>Base Sepolia USDC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-950/50 border-t border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-black/40 border-white/10 backdrop-blur rounded-3xl relative overflow-hidden">
              <div className="absolute top-4 right-6 text-[120px] font-bold text-white/5 leading-none select-none">01</div>
              <CardContent className="p-10 relative z-10">
                <h3 className="text-2xl font-bold mb-4 text-white">Trigger Deposit</h3>
                <p className="text-gray-400 mb-6">
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

            <Card className="bg-black/40 border-white/10 backdrop-blur rounded-3xl relative overflow-hidden">
              <div className="absolute top-4 right-6 text-[120px] font-bold text-white/5 leading-none select-none">02</div>
              <CardContent className="p-10 relative z-10">
                <h3 className="text-2xl font-bold mb-4 text-white">Handle x402</h3>
                <p className="text-gray-400 mb-6">
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

            <Card className="bg-black/40 border-white/10 backdrop-blur rounded-3xl relative overflow-hidden">
              <div className="absolute top-4 right-6 text-[120px] font-bold text-white/5 leading-none select-none">03</div>
              <CardContent className="p-10 relative z-10">
                <h3 className="text-2xl font-bold mb-4 text-white">Atomic Funding</h3>
                <p className="text-gray-400 mb-6">
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

      <section className="py-20 bg-gradient-to-br from-blue-950/30 to-slate-900/30 border-t border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-black mb-6 text-white leading-tight">
                Built for<br />Autonomous<br />Agents
              </h2>
              <p className="text-lg text-gray-400 mb-10 leading-relaxed">
                Stop building brittle API-key based funding systems. Use the native protocol of the agentic economy.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg text-white font-medium">Programmatic Settlements</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg text-white font-medium">Micro-USDC Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg text-white font-medium">No Authentication Friction</span>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-[1.02]">
                <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700/50 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="p-8 font-mono text-sm">
                  <div className="mb-6">
                    <div className="text-blue-400 text-xs mb-2">// REQUEST</div>
                    <div className="text-gray-300">
                      <span className="text-purple-400">GET</span> /api/fund/init
                    </div>
                  </div>

                  <div className="mb-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-xs">RECV</span>
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 font-mono text-xs">
                        402 Payment Required
                      </Badge>
                    </div>

                    <div className="bg-slate-950/50 border border-slate-700/30 rounded-lg p-4 space-y-2">
                      <div className="text-blue-400 text-xs mb-2">CHALLENGE_DETAILS</div>
                      <div className="text-gray-300 text-xs leading-relaxed">
                        <span className="text-emerald-400">WWW-Authenticate:</span> x402 address=<span className="text-orange-400">"0x742d..."</span>, amount=<span className="text-orange-400">"0.01"</span>, asset=<span className="text-orange-400">"USDC"</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-xs">CONF</span>
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

      {showStickyCta && !isSubmitted && (
        <div className="fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 animate-in slide-in-from-bottom md:hidden">
          <div className="bg-slate-900/95 backdrop-blur-xl border-t border-blue-500/30 shadow-2xl">
            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
              <form onSubmit={handleSubmit} className="flex gap-0">
                <Input
                  type="email"
                  placeholder="enter email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-slate-800/60 border-blue-400/30 text-white placeholder:text-gray-400 h-14 text-base px-4 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-none border-r-0"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-wider px-8 h-14 rounded-none whitespace-nowrap"
                >
                  {isSubmitting ? 'Joining...' : 'Join the Waitlist'}
                </Button>
              </form>
              {error && <p className="text-sm text-red-400 mt-2 px-4">{error}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
