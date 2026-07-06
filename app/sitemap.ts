import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://deposit.now';
  return [
    '',
    '/docs',
    '/ecosystem',
    '/api/discovery',
    '/api/merchants',

    '/about',
    '/pricing',
    '/litepaper',
    '/privacy',
    '/disclosures',
    '/terms',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));
}
