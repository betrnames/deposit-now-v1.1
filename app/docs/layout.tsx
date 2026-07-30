import type { Metadata } from 'next';
import { PRODUCT } from '@/lib/product-copy';

export const metadata: Metadata = {
  title: 'API Documentation',
  description: PRODUCT.description,
  alternates: { canonical: 'https://deposit.now/docs' },
  openGraph: {
    title: `API Documentation | ${PRODUCT.name}`,
    description: PRODUCT.description,
    url: 'https://deposit.now/docs',
    siteName: PRODUCT.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `API Documentation | ${PRODUCT.name}`,
    description: `${PRODUCT.productLine} — fund any wallet or provision a managed child. payment_received vs forwardStatus explained.`,
  },
  robots: { index: true, follow: true },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
