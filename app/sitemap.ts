import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://deposit.now';
  return [
    '',
    '/docs',
    '/pricing',
    '/about',
    '/litepaper',
    '/api/discovery',
    '/llms.txt',
    '/llms-full.txt',
    '/openapi.json',
    '/privacy',
    '/disclosures',
    '/terms',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : path === '/docs' || path === '/llms.txt' ? 0.9 : 0.7,
  }));
}
