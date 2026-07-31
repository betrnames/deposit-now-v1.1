import './globals.css';
import Script from 'next/script';
import type { Metadata } from 'next';
import { ThemeInit } from '@/components/ThemeInit';
import { PRODUCT } from '@/lib/product-copy';
import { SITE, siteJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.base),
  title: {
    default: PRODUCT.titleDefault,
    template: PRODUCT.titleTemplate,
  },
  description: PRODUCT.description,
  keywords: [...PRODUCT.keywords],
  applicationName: PRODUCT.name,
  authors: [{ name: PRODUCT.name, url: SITE.base }],
  creator: PRODUCT.name,
  publisher: PRODUCT.name,
  category: 'technology',
  classification: 'Agent payments, x402, USDC, Base',
  alternates: {
    canonical: SITE.base,
    types: {
      'application/llms.txt': `${SITE.base}/llms.txt`,
      'application/json': `${SITE.base}/openapi.json`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: PRODUCT.titleDefault,
    description: PRODUCT.description,
    url: SITE.base,
    siteName: PRODUCT.name,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: PRODUCT.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: SITE.twitter,
    creator: SITE.twitter,
    title: PRODUCT.titleDefault,
    description: PRODUCT.description,
    images: ['/og.png'],
  },
  icons: {
    icon: [{ url: '/icon', type: 'image/png', sizes: '32x32' }],
    apple: [{ url: '/apple-icon', type: 'image/png', sizes: '180x180' }],
    shortcut: ['/icon'],
  },
  other: {
    'theme-color': '#0f172a',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = siteJsonLd(PRODUCT);

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k='deposit-now-theme';var t=localStorage.getItem(k);var d=(t==='classic'||t==='cloudflare')?t:'cloudflare';document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme',d)}catch(e){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','cloudflare')}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeInit />
        {children}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-HQB6Y3W5ER" strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HQB6Y3W5ER');`}
        </Script>
      </body>
    </html>
  );
}

