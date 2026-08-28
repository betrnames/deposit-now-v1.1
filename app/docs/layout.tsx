import type { Metadata } from 'next';
import { PRODUCT } from '@/lib/product-copy';
import { SITE, openGraphImages, pageGraph, twitterImages } from '@/lib/seo';

export const metadata: Metadata = {
  title: PRODUCT.docsTitle,
  description: PRODUCT.description,
  keywords: [...PRODUCT.keywords],
  alternates: { canonical: `${SITE.base}/docs` },
  openGraph: {
    type: 'article',
    title: `${PRODUCT.docsTitle} | ${PRODUCT.name}`,
    description: PRODUCT.description,
    url: `${SITE.base}/docs`,
    siteName: PRODUCT.name,
    images: openGraphImages(PRODUCT.ogImageAlt),
  },
  twitter: {
    card: 'summary_large_image',
    site: SITE.twitter,
    creator: SITE.twitter,
    title: `${PRODUCT.docsTitle} | ${PRODUCT.name}`,
    description: PRODUCT.description,
    images: twitterImages(),
  },
  robots: { index: true, follow: true },
};

const docsJsonLd = pageGraph(
  {
    '@type': 'TechArticle',
    headline: PRODUCT.docsTitle,
    name: `${PRODUCT.name} API Documentation`,
    description: PRODUCT.description,
    url: `${SITE.base}/docs`,
    author: { '@type': 'Organization', name: PRODUCT.name, url: SITE.base },
    publisher: { '@type': 'Organization', name: PRODUCT.name, url: SITE.base },
    mainEntityOfPage: `${SITE.base}/docs`,
  },
  '/docs',
  'API Documentation'
);

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(docsJsonLd) }}
      />
      {children}
    </>
  );
}
