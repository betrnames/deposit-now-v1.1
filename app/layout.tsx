import './globals.css';
import Script from 'next/script';
import type { Metadata } from 'next';
import { ThemeInit } from '@/components/ThemeInit';

export const metadata: Metadata = {
  metadataBase: new URL('https://deposit.now'),
  title: {
    default: 'Deposit Now | x402 Payment Intelligence',
    template: '%s | Deposit Now',
  },
  description: 'Compare x402 facilitators by fee, chain, and token. deposit.now helps developers and AI agents route payments to the best facilitator.',
  keywords: [
    'x402',
    'x402 API',
    'x402 facilitator',
    'facilitator comparison',
    'payment routing',
    'facilitator dashboard',
    'AI agent payments',
    'agent deposits',
    'HTTP 402',
    'USDC micropayments',
    'Base',
    'machine payments',
    'agentic commerce',
    'autonomous agents',
  ],
  alternates: { canonical: 'https://deposit.now' },
  openGraph: {
    title: 'Deposit Now | x402 Payment Intelligence',
    description: 'Compare x402 facilitators by fee, chain, and token. Route payments to the best facilitator for every transaction.',
    url: 'https://deposit.now',
    siteName: 'Deposit Now',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deposit Now | x402 Payment Intelligence',
    description: 'Compare x402 facilitators by fee, chain, and token. Route payments to the best facilitator.',
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
        name: 'deposit.now x402 Payment Intelligence',
        description:
          'Compare x402 facilitators and route payments to the best facilitator by fee, chain, and token. Also supports autonomous USDC deposits via x402 on Base mainnet.',
        url: 'https://deposit.now/dashboard',
        documentation: 'https://deposit.now/docs',
        provider: { '@type': 'Organization', name: 'deposit.now', url: 'https://deposit.now' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          description: 'Free facilitator comparison dashboard. Deposit API: agent pays the declared amount (min $0.01) via x402 exact scheme on Base mainnet.',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is deposit.now?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'deposit.now is an x402 payment intelligence platform that helps developers and AI agents compare facilitators by fee, chain, and token support. It also provides a live x402 deposit API on Base mainnet.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does deposit.now help with x402?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'deposit.now indexes x402 facilitators and lets you compare them side by side — fees, supported chains, tokens, payment schemes, and production status. The dashboard helps you choose the right facilitator for your integration.',
            },
          },
          {
            '@type': 'Question',
            name: 'How many facilitators does deposit.now index?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'deposit.now indexes 20 x402 facilitators including CDP, Corbits, thirdweb, Mogami, OpenX402.ai, PayAI, Meridian, and more — covering multiple chains, tokens, and fee structures.',
            },
          },
        ],
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
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
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
