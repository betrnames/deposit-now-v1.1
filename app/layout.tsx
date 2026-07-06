import './globals.css';
import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://deposit.now'),
  title: {
    default: 'Deposit Now | The Funding Layer for AI Agents',
    template: '%s | Deposit Now',
  },
  description: 'The first public API for AI agents to autonomously deposit funds using x402 payment protocol on Base mainnet. Instant USDC micropayments, no accounts required.',
  keywords: [
    'x402',
    'x402 API',
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
    title: 'Deposit Now | The Funding Layer for AI Agents',
    description: 'Let AI agents deposit funds autonomously via x402 on Base mainnet — no accounts, instant USDC payments',
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
    title: 'Deposit Now | The Funding Layer for AI Agents',
    description: 'The first public API for AI agents to autonomously deposit funds',
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
        name: 'deposit.now x402 Deposit API',
        description:
          'Public x402 API for AI agents to autonomously deposit funds. 0.01 USDC per call, paid over HTTP via the x402 protocol on Base mainnet (eip155:8453). No accounts or API keys required.',
        url: 'https://deposit.now/api/deposit',
        documentation: 'https://deposit.now/docs',
        provider: { '@type': 'Organization', name: 'deposit.now', url: 'https://deposit.now' },
        offers: {
          '@type': 'Offer',
          price: '0.01',
          priceCurrency: 'USD',
          description: '0.01 USDC per API call via x402 exact scheme on Base mainnet',
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
              text: 'deposit.now is the first public x402 API that lets AI agents autonomously deposit funds. Agents pay 0.01 USDC per call over HTTP — no accounts, API keys, or human sign-up required.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does an AI agent pay the deposit.now API?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The agent calls POST https://deposit.now/api/deposit and receives HTTP 402 with signed payment requirements (x402 v2, exact scheme, USDC on Base mainnet). An x402 client SDK such as @x402/fetch for JavaScript or x402[httpx] for Python signs the payment and retries automatically; the CDP facilitator verifies and settles it on-chain.',
            },
          },
          {
            '@type': 'Question',
            name: 'What does the deposit.now API cost?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '0.01 USDC per call, settled on Base mainnet via the x402 payment protocol. There are no subscriptions, accounts, or minimums.',
            },
          },
        ],
      },
    ],
  };

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
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
