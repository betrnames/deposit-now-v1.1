import { DepositLogo } from '@/components/DepositLogo';
import { Github, Mail } from 'lucide-react';
import Link from 'next/link';

const linkClass =
  'text-muted-foreground hover:text-white transition-colors text-sm';

const iconClass =
  'text-muted-foreground hover:text-white transition-colors p-1';

function XIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/60 backdrop-blur py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4 min-w-0">
            <Link href="/" className="shrink-0" aria-label="deposit.now home">
              <DepositLogo size={32} />
            </Link>
            <p className="text-muted-foreground text-xs sm:text-sm leading-snug">
              Open x402 funding rail for agents · amount + 1%
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/docs" className={linkClass}>
              Docs
            </Link>
            <a href="/llms.txt" className={linkClass}>
              llms.txt
            </a>
            <a
              href="https://x402dir.com"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              x402dir.com
            </a>
            <a
              href="https://x.com/Deposit_Now"
              target="_blank"
              rel="noopener noreferrer"
              className={iconClass}
              aria-label="deposit.now on X"
              title="@Deposit_Now"
            >
              <XIcon />
            </a>
            <a
              href="https://github.com/betrnames/deposit-now-v1.1"
              target="_blank"
              rel="noopener noreferrer"
              className={iconClass}
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a href="mailto:support@deposit.now" className={iconClass} aria-label="Email">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <p className="mt-6 pt-6 border-t border-border text-muted-foreground/70 text-xs">
          © 2026 deposit.now
        </p>
      </div>
    </footer>
  );
}
