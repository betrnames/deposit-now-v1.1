export { middleware } from '@/lib/x402';

export const config = {
  matcher: ['/api/deposit', '/api/merchants/:slug/deposit'],
  runtime: 'nodejs',
};