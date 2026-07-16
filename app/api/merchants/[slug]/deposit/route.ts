import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      error: 'gone',
      message:
        'Merchant deposit routes are retired. Use POST /api/deposit with target wallet address.',
      docs: 'https://deposit.now/docs',
    },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      error: 'gone',
      message:
        'Merchant deposit routes are retired. Use POST /api/deposit with target wallet address.',
      docs: 'https://deposit.now/docs',
    },
    { status: 410 }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Payment, payment-signature',
    },
  });
}
