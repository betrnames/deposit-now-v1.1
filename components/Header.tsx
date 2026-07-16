'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ExternalLink } from 'lucide-react';
import { DepositLogo } from '@/components/DepositLogo';
import { ThemeToggle } from '@/components/ThemeToggle';

const NAV = [
  { href: '/docs', label: 'Docs' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
] as const;

const navLinkClass =
  'text-sm font-medium text-muted-foreground hover:text-white transition-colors';

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center shrink-0" aria-label="deposit.now home">
            <DepositLogo size={36} className="text-white/85" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClass}>
                {item.label}
              </Link>
            ))}
            <a
              href="https://x402dir.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${navLinkClass} inline-flex items-center gap-1`}
            >
              x402dir
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
            <Link
              href="/docs"
              className="bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-wider px-4 h-9 rounded-lg inline-flex items-center"
            >
              Get started
            </Link>
            <ThemeToggle />
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden mt-4 pt-4 border-t border-border/60 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-white hover:bg-muted/50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://x402dir.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-white hover:bg-muted/50 transition-colors inline-flex items-center gap-1.5"
            >
              x402dir.com
              <ExternalLink className="h-3.5 w-3.5 opacity-60" />
            </a>
            <Link
              href="/docs"
              onClick={() => setOpen(false)}
              className="mt-2 mx-3 mb-1 bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-wider h-10 rounded-lg inline-flex items-center justify-center"
            >
              Get started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
