import { Header } from '@/components/Header';
import { SiteFooter } from '@/components/SiteFooter';
import Link from 'next/link';

interface ContentPageProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  jsonLd?: Record<string, unknown>;
}

export function ContentPage({ title, subtitle, children, jsonLd }: ContentPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-16">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-300">{title}</li>
          </ol>
        </nav>
        <h1 className="mt-6 text-3xl sm:text-4xl font-black text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg text-gray-400 leading-relaxed">{subtitle}</p>
        )}
        <article className="mt-10 space-y-6 text-gray-300 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_a]:text-blue-400 [&_a]:hover:underline [&_strong]:text-white [&_code]:text-blue-300 [&_code]:bg-white/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_table]:w-full [&_th]:text-left [&_th]:text-white [&_th]:pb-2 [&_td]:py-2 [&_tr]:border-b [&_tr]:border-white/5">
          {children}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}