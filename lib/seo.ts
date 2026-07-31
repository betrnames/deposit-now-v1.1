/**
 * Site SEO helpers — sitemap paths, structured data, shared brand URLs.
 * Keep in sync with live routes only (no dead URLs).
 */

const BASE = 'https://deposit.now';

export const SITE = {
  base: BASE,
  name: 'deposit.now',
  twitter: '@Deposit_Now',
  twitterUrl: 'https://x.com/Deposit_Now',
  githubUrl: 'https://github.com/betrnames/deposit-now-v1.1',
  email: 'support@deposit.now',
  sameAs: [
    'https://x.com/Deposit_Now',
    'https://github.com/betrnames/deposit-now-v1.1',
  ],
} as const;

/** Indexable public URLs for sitemap.xml (must return 200). */
export const SITEMAP_PATHS: {
  path: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}[] = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/docs', changeFrequency: 'weekly', priority: 0.95 },
  { path: '/llms.txt', changeFrequency: 'weekly', priority: 0.85 },
  { path: '/llms-full.txt', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/openapi.json', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/api/discovery', changeFrequency: 'weekly', priority: 0.75 },
];

export function absoluteUrl(path = ''): string {
  if (!path || path === '/') return BASE;
  return path.startsWith('http') ? path : `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

export function breadcrumbJsonLd(path: string, title: string) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'deposit.now',
        item: BASE,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: title,
        item: absoluteUrl(path),
      },
    ],
  };
}

export function pageGraph(
  pageJsonLd: Record<string, unknown>,
  path: string,
  title: string
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [pageJsonLd, breadcrumbJsonLd(path, title)],
  };
}

export type ProductSeoFields = {
  name: string;
  productLine: string;
  titleDefault: string;
  description: string;
  tagline: string;
  apiDescription: string;
  feeNote: string;
  faq: readonly { q: string; a: string }[];
};

/** Root JSON-LD graph for homepage / sitewide identity. */
export function siteJsonLd(product: ProductSeoFields) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BASE}/#organization`,
        name: product.name,
        url: BASE,
        email: SITE.email,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE}/logo.png`,
        },
        sameAs: [...SITE.sameAs],
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE}/#website`,
        name: product.name,
        alternateName: [
          'deposit.now x402',
          'deposit now agent funding',
          product.productLine,
        ],
        url: BASE,
        description: product.description,
        publisher: { '@id': `${BASE}/#organization` },
        inLanguage: 'en-US',
      },
      {
        '@type': 'WebAPI',
        '@id': `${BASE}/#api`,
        name: `${product.name} ${product.productLine}`,
        description: product.apiDescription,
        url: `${BASE}/api/deposit`,
        documentation: `${BASE}/docs`,
        provider: { '@id': `${BASE}/#organization` },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          description: product.feeNote,
        },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${BASE}/#app`,
        name: product.name,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web, API',
        description: product.description,
        url: BASE,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          description: product.feeNote,
        },
        provider: { '@id': `${BASE}/#organization` },
      },
      {
        '@type': 'FAQPage',
        '@id': `${BASE}/#faq`,
        mainEntity: product.faq.map((item) => ({
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
}
