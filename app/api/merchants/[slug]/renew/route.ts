import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      error: 'gone',
      message: 'Merchant billing is retired. Platform fee is a flat 1% on each deposit.',
      docs: 'https://deposit.now/pricing',
    },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      error: 'gone',
      message: 'Merchant billing is retired. Platform fee is a flat 1% on each deposit.',
      docs: 'https://deposit.now/pricing',
    },
    { status: 410 }
  );
}
