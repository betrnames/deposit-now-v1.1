import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      error: 'gone',
      message: 'Merchant top-up is retired. Platform fee is taken from each x402 payment (1%).',
      docs: 'https://deposit.now/pricing',
    },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      error: 'gone',
      message: 'Merchant top-up is retired. Platform fee is taken from each x402 payment (1%).',
      docs: 'https://deposit.now/pricing',
    },
    { status: 410 }
  );
}
