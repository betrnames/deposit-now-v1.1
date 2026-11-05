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
        // Block all API surfaces from crawlers; keep public pages allowed
        disallow: ['/api/', '/receipt/'],
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: ['/api/', '/receipt/'],
      })),
    ],
    sitemap: 'https://deposit.now/sitemap.xml',
    host: 'https://deposit.now',
  };
}
