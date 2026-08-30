'use client';

import Link from 'next/link';
import { DepositLogo } from '@/components/DepositLogo';

const NAV = [{ href: '/docs', label: 'Docs' }] as const;

const navLinkClass =
  'text-sm font-medium text-muted-foreground hover:text-white transition-colors';

export function Header() {
  return (
    <nav className="w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center shrink-0" aria-label="deposit.now home">
            <DepositLogo size={36} className="text-white/85" />
          </Link>

          <div className="flex items-center gap-4 sm:gap-8">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClass}>
                {item.label}
              </Link>
            ))}
            <Link
              href="/docs#quickstart"
              className="bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-wider px-3 sm:px-4 h-9 rounded-lg inline-flex items-center"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
