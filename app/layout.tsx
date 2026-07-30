import './globals.css';
import Script from 'next/script';
import type { Metadata } from 'next';
import { ThemeInit } from '@/components/ThemeInit';
import { PRODUCT } from '@/lib/product-copy';

export const metadata: Metadata = {
  metadataBase: new URL('https://deposit.now'),
  title: {
    default: PRODUCT.titleDefault,
    template: PRODUCT.titleTemplate,
  },
  description: PRODUCT.description,
  keywords: [...PRODUCT.keywords],
  alternates: { canonical: 'https://deposit.now' },
  openGraph: {
    title: PRODUCT.titleDefault,
    description: `${PRODUCT.tagline} Amount + 1% · no humans · no API key needed.`,
    url: 'https://deposit.now',
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
    site: '@Deposit_Now',
    creator: '@Deposit_Now',
    title: PRODUCT.titleDefault,
    description: `${PRODUCT.tagline} Amount + 1% · no API key needed.`,
    images: ['/og.png'],
  },
  icons: {
    icon: [{ url: '/icon', type: 'image/png', sizes: '32x32' }],
    apple: [{ url: '/apple-icon', type: 'image/png', sizes: '180x180' }],
    shortcut: ['/icon'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebAPI',
        name: `${PRODUCT.name} ${PRODUCT.productLine}`,
        description: PRODUCT.apiDescription,
        url: 'https://deposit.now/api/deposit',
        documentation: 'https://deposit.now/docs',
        provider: { '@type': 'Organization', name: PRODUCT.name, url: 'https://deposit.now' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          description: PRODUCT.feeNote,
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: PRODUCT.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
    ],
  };

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
