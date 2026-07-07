export { middleware } from '@/lib/x402';

export const config = {
  matcher: [
    '/api/deposit',
    '/api/merchants/:slug/deposit',
    '/api/merchants/:slug/renew',
    '/api/merchants/:slug/topup',
  ],
  runtime: 'nodejs',
};