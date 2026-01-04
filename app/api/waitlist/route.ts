import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.https://azstkskrlasysunveplz.supabase.co,
  process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6c3Rrc2tybGFzeXN1bnZlcGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1Mzc1NzksImV4cCI6MjA4MzExMzU3OX0.EJYF2VMa-xnvo-Ss7k_GOLjV5K5g85VAALWJ6DDHgvk
);

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

    const { data, error } = await supabase
      .from('waitlist')
      .insert([{ email }])
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json(
      { success: true, message: 'Successfully joined waitlist' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Waitlist signup error:', error);
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    );
  }
}
