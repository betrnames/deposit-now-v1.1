import { NextRequest, NextResponse } from 'next/server';
import {
  handleDepositGet,
  handleDepositOptions,
  handleDepositPost,
} from '@/lib/deposit-handler';
import { checkRateLimitDb } from '@/lib/guardrails';

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}

export async function GET(request: NextRequest) {
  try {
    const rl = await checkRateLimitDb('GET', '/api/deposit', clientIp(request), null);
    if (rl.blocked) {
      return NextResponse.json(
        { error: 'GUARDRAIL_BLOCKED', code: rl.code, message: rl.message, retryAfter: rl.retryAfter },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter ?? 60) } }
      );
    }
  } catch {
    // DB unavailable — fall through to handler
  }
  return handleDepositGet(request);
}

export async function POST(request: NextRequest) {
  try {
    const rl = await checkRateLimitDb('POST', '/api/deposit', clientIp(request), null);
    if (rl.blocked) {
      return NextResponse.json(
        { error: 'GUARDRAIL_BLOCKED', code: rl.code, message: rl.message, retryAfter: rl.retryAfter },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter ?? 60) } }
      );
    }
  } catch {
    // DB unavailable — fall through to handler
  }
  return handleDepositPost(request);
}

export async function OPTIONS() {
  return handleDepositOptions();
}