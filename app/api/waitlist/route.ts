import { NextRequest, NextResponse } from 'next/server';

const FORMSPREE_ENDPOINT = process.env.FORMSPREE_ENDPOINT ?? 'https://formspree.io/f/mwvdpgay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        site: 'deposit.now',
        form: 'subscribe',
      }),
    });

    if (!res.ok) {
      throw new Error(`Formspree responded ${res.status}`);
    }

    return NextResponse.json(
      { success: true, message: 'Successfully subscribed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscribe signup error:', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
