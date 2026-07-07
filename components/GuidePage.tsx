'use client';

import { useState, type ReactNode } from 'react';
import { Header } from '@/components/Header';
import { SiteFooter } from '@/components/SiteFooter';
import { ChevronRight } from 'lucide-react';

export interface GuideNavItem {
  id: string;
  label: string;
}

interface GuidePageProps {
  kicker: string;
  title: string;
  subtitle?: string;
  sidebarLabel?: string;
  nav: GuideNavItem[];
  children: ReactNode;
  jsonLd?: Record<string, unknown>;
  /** Use full main column width (e.g. pricing tier grid). Default caps at max-w-4xl. */
  wideContent?: boolean;
}

const articleClassName =
  'space-y-6 min-w-0 text-gray-300 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:scroll-mt-28 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:min-w-0 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:min-w-0 [&_li]:min-w-0 [&_a]:text-blue-400 [&_a]:hover:underline [&_strong]:text-white [&_code]:text-blue-300 [&_code]:bg-white/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:break-all [&_code]:max-w-full [&_table]:w-full [&_th]:text-left [&_th]:text-white [&_th]:pb-2 [&_td]:py-2 [&_tr]:border-b [&_tr]:border-white/5';

export function GuidePage({
  kicker,
  title,
  subtitle,
  sidebarLabel = 'ON THIS PAGE',
  nav,
  children,
  jsonLd,
  wideContent = false,
}: GuidePageProps) {
  const [activeSection, setActiveSection] = useState(nav[0]?.id ?? '');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const navButtonClass = (id: string) =>
    `w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      activeSection === id
        ? 'bg-blue-600/20 text-blue-400'
        : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Header />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="flex gap-8">
          <aside className="w-56 flex-shrink-0 hidden md:block">
            <div className="sticky top-24 py-6">
              <h2 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-6 px-4">
                {sidebarLabel}
              </h2>
              <nav className="space-y-1">
                {nav.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`${navButtonClass(item.id)} ${
                      index === 0 ? 'flex items-center gap-2' : ''
                    }`}
                  >
                    {index === 0 && <ChevronRight className="h-4 w-4 shrink-0" />}
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className={wideContent ? 'min-w-0' : 'max-w-4xl'}>
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-400">{kicker}</p>
              </div>

              <div className="md:hidden mb-6">
                <div className="flex flex-wrap gap-2">
                  {nav.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        activeSection === item.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800/50 text-gray-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-12">
                <h1 className="text-2xl font-bold text-white mb-4">{title}</h1>
                {subtitle && (
                  <p className="text-xl text-gray-400 leading-relaxed">{subtitle}</p>
                )}
              </div>

              <article className={articleClassName}>{children}</article>
            </div>
          </main>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}