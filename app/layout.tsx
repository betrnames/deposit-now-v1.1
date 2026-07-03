import './globals.css';
import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://deposit.now'),
  title: 'deposit.now - AI Agent Deposits via x402',
  description: 'The first public API for AI agents to autonomously deposit funds using x402 payment protocol. Instant stablecoin payments, no accounts required.',
  openGraph: {
    title: 'deposit.now - AI Agent Deposits via x402',
    description: 'Let AI agents deposit funds autonomously via x402 — no accounts, instant stablecoin payments',
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
    title: 'deposit.now - AI Agent Deposits via x402',
    description: 'The first public API for AI agents to autonomously deposit funds',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
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
