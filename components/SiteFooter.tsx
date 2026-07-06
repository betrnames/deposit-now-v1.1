import type { ReactNode } from 'react';
import { DepositLogo } from '@/components/DepositLogo';
import { ExternalLink, Github, Mail } from 'lucide-react';
import Link from 'next/link';

const linkClass =
  'text-gray-400 hover:text-white transition-colors text-xs sm:text-sm py-1 inline-block leading-snug';
const socialClass =
  'text-gray-400 hover:text-white transition-colors p-2 -m-2 rounded-lg hover:bg-white/5';

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

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-black/40 backdrop-blur py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 sm:gap-8 md:gap-10 mb-8 sm:mb-12">
          <div className="col-span-3 md:col-span-1">
            <div className="flex flex-nowrap items-center justify-start gap-3 sm:gap-4 mb-4">
              <Link href="/" className="shrink-0" aria-label="deposit.now home">
                <DepositLogo size={40} />
              </Link>
              <div className="flex items-center gap-1 sm:gap-2">
                <a
                  href="https://x.com/Deposit_Now"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialClass}
                  aria-label="X / Twitter"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
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
                  <Github className="h-5 w-5" />
                </a>
                <a href="mailto:support@deposit.now" className={socialClass} aria-label="Email">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 max-w-sm">
              Programmable funding gateway for autonomous AI agents. Verifiable x402 deposits on
              Base — non-custodial USDC.
            </p>
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

        <div className="border-t border-slate-800 pt-6 sm:pt-8">
          <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left leading-relaxed">
            © 2026{' '}
            <a href="https://deposit.now" className="hover:text-gray-300 transition-colors">
              deposit.now
            </a>
            <span className="hidden sm:inline"> · Built for the agentic future</span>
            <span className="block sm:hidden mt-1 text-gray-600">Built for the agentic future</span>
          </p>
        </div>
      </div>
    </footer>
  );
}