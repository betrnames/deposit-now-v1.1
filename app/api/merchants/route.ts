import { NextResponse } from 'next/server';

const GONE = {
  error: 'gone',
  message:
    'Merchant registration and merchant-scoped deposits are retired. Use POST /api/deposit with { target, amount, memo? } to fund any wallet.',
  docs: 'https://deposit.now/docs',
  deposit: 'https://deposit.now/api/deposit',
};

export async function GET() {
  return NextResponse.json(GONE, { status: 410 });
}

export async function POST() {
  return NextResponse.json(GONE, { status: 410 });
}
