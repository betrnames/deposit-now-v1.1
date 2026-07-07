import { NextRequest } from 'next/server';
import {
  handleBillingGet,
  handleBillingOptions,
  handleBillingPost,
} from '@/lib/billing-handler';

export async function GET(request: NextRequest) {
  return handleBillingGet(request);
}

export async function POST(request: NextRequest) {
  return handleBillingPost(request);
}

export async function OPTIONS() {
  return handleBillingOptions();
}