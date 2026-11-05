import { NextResponse } from 'next/server';
import { discoveryManifest } from '@/lib/discovery';

export async function GET() {
  return NextResponse.json(discoveryManifest(), {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
