import './globals.css';
import Script from 'next/script';
import type { Metadata } from 'next';
import { ThemeInit } from '@/components/ThemeInit';

export const metadata: Metadata = {
  metadataBase: new URL('https://deposit.now'),
  title: {
    default: 'deposit.now | The Funding Layer for AI Agents',
    template: '%s | deposit.now',
  },
  description:
    'The Funding Layer for AI Agents. Programmable deposits via one x402 call — fund any wallet (including sub-wallets / child agents). No humans required for agent-to-agent flows.',
  keywords: [
    'AI agent funding',
    'x402 deposit API',
    'agent-to-agent transfers',
    'programmable deposits',
    'sub-agent funding',
    'child agent wallet',
    'HTTP 402',
    'USDC',
    'Base',
    'machine payments',
    'agentic commerce',
    'autonomous agents',
    'deposit.now',
  ],
  alternates: { canonical: 'https://deposit.now' },
  openGraph: {
    title: 'deposit.now | The Funding Layer for AI Agents',
    description:
      'Programmable deposits via one x402 call — fund any wallet, including sub-wallets and child agents.',
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
    title: 'deposit.now | The Funding Layer for AI Agents',
    description:
      'Programmable deposits via one x402 call — fund any wallet, including sub-wallets and child agents.',
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
        name: 'deposit.now — Funding Layer for AI Agents',
        description:
          'Programmable USDC deposits via x402. Fund any wallet (including sub-wallets / child agents) with one POST. Agent pays amount + 1%; net is forwarded on Base.',
        url: 'https://deposit.now/api/deposit',
        documentation: 'https://deposit.now/docs',
        provider: { '@type': 'Organization', name: 'deposit.now', url: 'https://deposit.now' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          description:
            '1% platform fee on each deposit. Agent pays amount + fee via x402 exact scheme on Base mainnet.',
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
              text: 'deposit.now is the funding layer for AI agents: a programmable deposit API using x402 so agents can fund any wallet — including sub-wallets and child agents — without humans in secondary flows.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do agent-to-agent deposits work?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'POST /api/deposit with target (EVM address), amount (net USDC), and optional memo. The API returns HTTP 402 for amount + 1%. After payment settles to the platform CDP wallet, net USDC is forwarded to target.',
            },
          },
          {
            '@type': 'Question',
            name: 'What does it cost?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A flat 1% platform fee on the net deposit amount. No merchant tiers, accounts, or API keys required for agents.',
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
