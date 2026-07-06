import { NextResponse } from 'next/server';
import { discoveryManifest } from '@/lib/discovery';

export async function GET() {
  return NextResponse.json(discoveryManifest(), {
    headers: {
      'Cache-Control': 'public, max-age=300',
      'Access-Control-Allow-Origin': '*',
    },
  });
}