import './globals.css';
import Script from 'next/script';
import type { Metadata } from 'next';
import { ThemeInit } from '@/components/ThemeInit';

export const metadata: Metadata = {
  metadataBase: new URL('https://deposit.now'),
  title: {
    default: 'deposit.now | Open x402 funding rail',
    template: '%s | deposit.now',
  },
  description:
    'Open x402 funding rail for agents: pay amount + 1% over HTTP 402, net forwards to any EVM target, optional public receipt. Complements — does not replace — Coinbase CDP Fund.',
  keywords: [
    'x402 deposit API',
    'AI agent funding',
    'HTTP 402',
    'USDC Base',
    'fund wallet x402',
    'programmable deposits',
    'machine payments',
    'deposit.now',
  ],
  alternates: { canonical: 'https://deposit.now' },
  openGraph: {
    title: 'deposit.now | Open x402 funding rail',
    description:
      'Pay amount + 1% via x402; net to any EVM target. Optional public receipts. Not a CDP Fund replacement.',
    url: 'https://deposit.now',
    siteName: 'deposit.now',
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
    title: 'deposit.now | Open x402 funding rail',
    description:
      'Pay amount + 1% via x402; net to any EVM target. Optional public receipts.',
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
        name: 'deposit.now x402 funding rail',
        description:
          'Open x402 deposit API: POST target + amount, pay amount + 1% USDC on Base, net forwarded to target. Optional public receipts when storage is configured. Complements Coinbase CDP Fund — does not replace it.',
        url: 'https://deposit.now/api/deposit',
        documentation: 'https://deposit.now/docs',
        provider: { '@type': 'Organization', name: 'deposit.now', url: 'https://deposit.now' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          description: '1% platform fee on net deposit amount via x402 exact scheme on Base mainnet.',
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
              text: 'deposit.now is an open x402 funding rail: agents pay amount + 1% over HTTP 402 and net USDC is forwarded to a target address they specify. It does not create wallets or replace Coinbase CDP Fund inside the CDP stack.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does a deposit work?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'POST /api/deposit with target and amount. Receive HTTP 402 for amount + 1%. Pay via x402. After settlement, the platform forwards net to target. Response status is payment_received; check receiptUrl for forwardStatus and Basescan links when available.',
            },
          },
          {
            '@type': 'Question',
            name: 'When should I use Coinbase Fund instead?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'If your agents already use Coinbase Agentic or Server Wallets, CDP Fund/Send is usually the right tool. Use deposit.now for a protocol-shaped x402 deposit to any EVM target without a deposit.now API key.',
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
