'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DepositLogo } from '@/components/DepositLogo';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleSubscribeSubmit = async (e: React.FormEvent) => {
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
        setError(data.error || 'Failed to subscribe');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const navShell = isScrolled
    ? 'bg-card/80 border-primary/25'
    : 'bg-background/40 border-primary/15';

  const navBg = isScrolled ? 'bg-background/95' : 'bg-transparent';

  const linkClass = 'text-sm font-medium text-white hover:text-primary transition-colors';

  const getStartedClass =
    'bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-wider px-3 h-9 rounded-lg inline-flex items-center shrink-0';

  const subscribeForm = (compact: boolean) =>
    isSubmitted ? (
      <span className="text-sm text-green-400 font-medium whitespace-nowrap">Subscribed</span>
    ) : (
      <form
        onSubmit={handleSubscribeSubmit}
        className={`flex items-center gap-2 ${compact ? 'w-full' : ''}`}
      >
        <Input
          type="email"
          placeholder="enter email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`bg-muted/60 border-primary/30 text-white placeholder:text-muted-foreground h-10 text-sm focus-visible:ring-ring ${
            compact ? 'flex-1' : 'w-36 lg:w-44'
          }`}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-wider px-4 lg:px-5 h-10 rounded-lg whitespace-nowrap shrink-0"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
    );

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className={`border rounded-2xl transition-all duration-300 backdrop-blur-md ${navShell}`}>
            {/* Mobile: equal columns keep logo visually centered */}
            <div className="grid grid-cols-3 items-center h-14 sm:h-16 px-3 sm:px-6 md:hidden">
              <div className="flex justify-start">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="w-10 h-10 flex items-center justify-center shrink-0"
                  aria-label="Toggle menu"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-white"
                  >
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="6" x2="20" y2="6" className={isMobileMenuOpen ? 'opacity-0' : ''} />
                    <line x1="4" y1="18" x2="20" y2="18" className={isMobileMenuOpen ? 'opacity-0' : ''} />
                  </svg>
                </button>
              </div>
              <div className="flex justify-center">
                <Link href="/" className="flex items-center" aria-label="deposit.now home">
                  <DepositLogo size={40} className="text-white/85" />
                </Link>
              </div>
              <div className="flex justify-end items-center gap-2">
                <ThemeToggle />
                <Link href="/docs" className={getStartedClass}>
                  Get started
                </Link>
              </div>
            </div>

            {/* Desktop */}
            <div className="hidden md:flex items-center justify-between h-14 sm:h-16 px-3 sm:px-6">
              <div className="flex items-center gap-6 lg:gap-8 min-w-0">
                <Link href="/" className="flex items-center shrink-0" aria-label="deposit.now home">
                  <DepositLogo size={40} className="text-white/85" />
                </Link>
                <div className="flex items-center gap-6">
                  <Link href="/about" className={linkClass}>
                    About
                  </Link>
                  <Link href="/ecosystem" className={linkClass}>
                    x402 Directory
                  </Link>
                  <Link href="/docs" className={linkClass}>
                    API
                  </Link>
                  <Link href="/pricing" className={linkClass}>
                    Pricing
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <ThemeToggle />
                {subscribeForm(false)}
              </div>
            </div>
            {error && (
              <p className="px-6 pb-3 text-xs text-red-400 hidden md:block">{error}</p>
            )}
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-background/98 backdrop-blur-xl z-[60] md:hidden">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-6 border-b border-primary/25">
              <Link
                href="/"
                className="flex items-center"
                aria-label="deposit.now home"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <DepositLogo size={40} className="text-white/85" />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-12 h-12 flex items-center justify-center text-white"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col p-6 space-y-1 flex-1">
              {[
                ['About', '/about'],
                ['Litepaper', '/litepaper'],
                ['x402 Directory', '/ecosystem'],
                ['API Documentation', '/docs'],
                ['Pricing', '/pricing'],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="text-lg font-semibold text-white py-4 border-b border-primary/15"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="pt-6">
                {subscribeForm(true)}
                {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}