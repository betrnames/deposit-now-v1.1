import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      error: 'gone',
      message:
        'Merchant endpoints are retired. Fund any wallet via POST /api/deposit { target, amount, memo? }.',
      docs: 'https://deposit.now/docs',
    },
    { status: 410 }
  );
}
