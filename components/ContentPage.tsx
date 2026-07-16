import { Header } from '@/components/Header';
import { SiteFooter } from '@/components/SiteFooter';
import { TerminalTitle } from '@/components/TerminalTitle';
import Link from 'next/link';

interface ContentPageProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  jsonLd?: Record<string, unknown>;
}

export function ContentPage({ title, subtitle, children, jsonLd }: ContentPageProps) {
  return (
    <div className="min-h-screen flex flex-col page-shell">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground/70">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground/80">{title}</li>
          </ol>
        </nav>
        <TerminalTitle className="mt-6 text-3xl sm:text-4xl font-black text-white tracking-tight">
          {title}
        </TerminalTitle>
        {subtitle && (
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{subtitle}</p>
        )}
        <article className="mt-10 space-y-6 text-foreground/80 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_a]:text-primary [&_a]:hover:underline [&_strong]:text-white [&_code]:text-primary/80 [&_code]:bg-white/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_table]:w-full [&_th]:text-left [&_th]:text-white [&_th]:pb-2 [&_td]:py-2 [&_tr]:border-b [&_tr]:border-white/5">
          {children}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}