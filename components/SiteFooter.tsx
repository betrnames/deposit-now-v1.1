import type { ReactNode } from 'react';
import { DepositLogo } from '@/components/DepositLogo';
import { ExternalLink, Github, Mail } from 'lucide-react';
import Link from 'next/link';

const linkClass =
  'text-gray-400 hover:text-white transition-colors text-xs sm:text-sm py-1 inline-block leading-snug';
const socialClass =
  'text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5';

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
    <div className="text-left sm:text-center min-w-[5.5rem] sm:min-w-[7rem] flex flex-col items-start sm:items-center">
      <h3 className="text-white font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">
        {title}
      </h3>
      <ul className={`${listClassName} flex flex-col items-start sm:items-center`}>{children}</ul>
    </div>
  );
}

function SocialIcons() {
  return (
    <>
      <a
        href="https://x.com/Deposit_Now"
        target="_blank"
        rel="noopener noreferrer"
        className={socialClass}
        aria-label="X / Twitter"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <a
        href="https://github.com/DepositNow"
        target="_blank"
        rel="noopener noreferrer"
        className={socialClass}
        aria-label="GitHub"
      >
        <Github className="h-4 w-4" />
      </a>
      <a href="mailto:support@deposit.now" className={socialClass} aria-label="Email">
        <Mail className="h-4 w-4" />
      </a>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-black/40 backdrop-blur py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-12 flex flex-col items-start sm:items-center text-left sm:text-center w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 max-w-2xl sm:mx-auto w-full">
            <Link href="/" className="shrink-0" aria-label="deposit.now home">
              <DepositLogo size={40} />
            </Link>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed sm:max-w-md">
              Programmable funding gateway for autonomous AI agents. Verifiable x402 deposits on
              Base — non-custodial USDC.
            </p>
          </div>

          <div className="flex justify-start sm:justify-center mb-8 sm:mb-10 w-full">
            <a
              href="https://x402.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors text-xs sm:text-sm font-bold uppercase tracking-wider"
            >
              Powered by x402
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="flex flex-wrap justify-start sm:justify-center items-start gap-6 sm:gap-10 md:gap-16 w-full">
            <FooterColumn title="Product">
              <li>
                <Link href="/docs" className={linkClass}>
                  <span className="sm:hidden">API</span>
                  <span className="hidden sm:inline">API Documentation</span>
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
                  <span className="sm:hidden">x402</span>
                  <span className="hidden sm:inline">x402 Standard</span>
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
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 sm:pt-8 flex flex-col items-start gap-3">
          <div className="flex items-center gap-1 -ml-2">
            <SocialIcons />
          </div>
          <p className="text-gray-500 text-xs sm:text-sm text-left">
            © 2026{' '}
            <a href="https://deposit.now" className="hover:text-gray-300 transition-colors">
              deposit.now
            </a>{' '}
            · Built for the agentic future
          </p>
        </div>
      </div>
    </footer>
  );
}