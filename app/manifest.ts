import type { MetadataRoute } from 'next';
import { PRODUCT } from '@/lib/product-copy';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'deposit.now',
    short_name: 'deposit.now',
    description: PRODUCT.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
  };
}
