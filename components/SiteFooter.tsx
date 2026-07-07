import type { ReactNode } from 'react';
import { DepositLogo } from '@/components/DepositLogo';
import { ExternalLink, Github, Mail } from 'lucide-react';
import Link from 'next/link';


const linkClass =
  'text-muted-foreground hover:text-white transition-colors text-xs sm:text-sm py-1 inline-block leading-snug';
const socialClass =
  'text-muted-foreground hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5';
const desktopSocialClass =
  'text-muted-foreground hover:text-white transition-colors p-2 -m-2 rounded-lg hover:bg-white/5';

function FooterColumn({
  title,
  children,
  listClassName = 'space-y-2 sm:space-y-3',
}: {
  title: string;
  children: ReactNode;
  listClassName?: string;
}) {
  return (
    <div>
      <h3 className="text-white font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">
        {title}
      </h3>
      <ul className={listClassName}>{children}</ul>
    </div>
  );
}

function SocialIcons({ className = socialClass, iconClassName = 'h-4 w-4' }: { className?: string; iconClassName?: string }) {
  return (
    <>
      <a
        href="https://x.com/Deposit_Now"
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label="X / Twitter"
      >
        <svg className={iconClassName} fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <a
        href="https://github.com/DepositNow"
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label="GitHub"
      >
        <Github className={iconClassName} />
      </a>
      <a href="mailto:support@deposit.now" className={className} aria-label="Email">
        <Mail className={iconClassName} />
      </a>
    </>
  );
}

function FooterLinks() {
  return (
    <>
      <FooterColumn title="Product">
        <li>
          <Link href="/docs" className={linkClass}>
            <span className="md:hidden">API</span>
            <span className="hidden md:inline">API Documentation</span>
          </Link>
        </li>
        <li>
          <Link href="/ecosystem" className={linkClass}>
            Ecosystem
          </Link>
        </li>
        <li>
          <Link href="/litepaper" className={linkClass}>
            Litepaper
          </Link>
        </li>
        <li>
          <Link href="/pricing" className={linkClass}>
            Pricing
          </Link>
        </li>
      </FooterColumn>

      <FooterColumn title="Company">
        <li>
          <Link href="/about" className={linkClass}>
            About
          </Link>
        </li>
        <li>
          <a href="mailto:support@deposit.now" className={linkClass}>
            Contact
          </a>
        </li>
        <li>
          <a
            href="https://x402.org"
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkClass} inline-flex items-center gap-1`}
          >
            <span className="md:hidden">x402</span>
            <span className="hidden md:inline">x402 Standard</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        </li>
      </FooterColumn>

      <FooterColumn title="Legal">
        <li>
          <Link href="/privacy" className={linkClass}>
            Privacy
          </Link>
        </li>
        <li>
          <Link href="/disclosures" className={linkClass}>
            Disclosures
          </Link>
        </li>
        <li>
          <Link href="/terms" className={linkClass}>
            Terms
          </Link>
        </li>
      </FooterColumn>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/60 backdrop-blur py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile */}
        <div className="md:hidden mb-8 flex flex-col items-start text-left w-full">
          <div className="flex flex-col items-start gap-3 mb-6 w-full">
            <Link href="/" className="shrink-0" aria-label="deposit.now home">
              <DepositLogo size={40} />
            </Link>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              Programmable funding gateway for autonomous AI agents. Verifiable x402 deposits on
              Base mainnet — non-custodial USDC.
            </p>
          </div>

          <div className="mb-8 w-full">
            <a
              href="https://x402.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary transition-colors text-xs sm:text-sm font-bold uppercase tracking-wider"
            >
              Powered by x402
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="grid grid-cols-3 w-full gap-x-4 min-[375px]:gap-x-6 sm:gap-x-10 gap-y-2">
            <FooterLinks />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex md:items-start md:justify-between gap-10 lg:gap-16 mb-12">
          <div className="max-w-xs lg:max-w-sm shrink-0">
            <div className="flex flex-nowrap items-center justify-start gap-4 mb-4">
              <Link href="/" className="shrink-0" aria-label="deposit.now home">
                <DepositLogo size={40} />
              </Link>
              <div className="flex items-center gap-2">
                <SocialIcons className={desktopSocialClass} iconClassName="h-5 w-5" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4 max-w-sm">
              Programmable funding gateway for autonomous AI agents. Verifiable x402 deposits on
              Base mainnet — non-custodial USDC.
            </p>
            <a
              href="https://x402.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary transition-colors text-sm font-bold uppercase tracking-wider"
            >
              Powered by x402
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="flex flex-1 justify-end gap-10 lg:gap-14 xl:gap-20 min-w-0">
            <FooterLinks />
          </div>
        </div>

        {/* Mobile bottom */}
        <div className="md:hidden border-t border-border pt-6 flex flex-col items-start gap-3">
          <div className="flex items-center gap-1 -ml-2">
            <SocialIcons />
          </div>
          <p className="text-muted-foreground/70 text-xs sm:text-sm text-left">
            © 2026{' '}
            <a href="https://deposit.now" className="hover:text-foreground/80 transition-colors">
              deposit.now
            </a>{' '}
            · Built for the agentic future
          </p>
        </div>

        {/* Desktop bottom */}
        <div className="hidden md:block border-t border-border pt-8">
          <p className="text-muted-foreground/70 text-sm text-left">
            © 2026{' '}
            <a href="https://deposit.now" className="hover:text-foreground/80 transition-colors">
              deposit.now
            </a>{' '}
            · Built for the agentic future
          </p>
        </div>
      </div>
    </footer>
  );
}