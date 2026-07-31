import type { MetadataRoute } from 'next';

const AI_CRAWLERS = [
  'GPTBot',
  'ClaudeBot',
  'Claude-Web',
  'PerplexityBot',
  'Google-Extended',
  'CCBot',
  'Anthropic-AI',
  'Bytespider',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Private/utility — receipts are noindex; admin is secret; deposit is a payment API not a content page
        disallow: ['/api/admin/', '/api/deposit', '/receipt/'],
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: ['/api/admin/', '/api/deposit', '/receipt/'],
      })),
    ],
    sitemap: 'https://deposit.now/sitemap.xml',
    host: 'https://deposit.now',
  };
}
