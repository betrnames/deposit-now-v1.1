import { NextRequest } from 'next/server';
import {
  handleDepositGet,
  handleDepositOptions,
  handleDepositPost,
} from '@/lib/deposit-handler';

export async function GET(request: NextRequest) {
  return handleDepositGet(request);
}

export async function POST(request: NextRequest) {
  return handleDepositPost(request);
}

export async function OPTIONS() {
  return handleDepositOptions();
}