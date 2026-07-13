'use client';

import Link from 'next/link';
import { DepositLogo } from '@/components/DepositLogo';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Header() {
  return (
    <nav className="w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="deposit.now home">
            <DepositLogo size={36} className="text-white/85" />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
