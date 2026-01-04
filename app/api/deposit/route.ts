import { NextRequest, NextResponse } from 'next/server';

const PAYMENT_REQUIRED_PRICE = 10000;
const PAYMENT_WALLET = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1';
const FACILITATOR_URL = 'https://x402.org/facilitator';

async function verifyPayment(request: NextRequest): Promise<boolean> {
  const paymentProof = request.headers.get('x-payment-proof');
  const paymentTx = request.headers.get('x-payment-tx');

  if (paymentProof && paymentTx) {
    return true;
  }

  return false;
}

export async function GET(request: NextRequest) {
  const hasPaid = await verifyPayment(request);

  if (!hasPaid) {
    return new NextResponse(
      JSON.stringify({
        error: 'Payment Required',
        message: 'This endpoint requires x402 payment',
        price: '0.01 USDC',
        network: 'Base Sepolia',
      }),
      {
        status: 402,
        headers: {
          'Content-Type': 'application/json',
          'Accept-Payment': `x402 1.0 amount=${PAYMENT_REQUIRED_PRICE} currency=USDC network=base-sepolia payto=${PAYMENT_WALLET} facilitator=${FACILITATOR_URL}`,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Accept-Payment, X-Payment-Proof, X-Payment-Tx',
        },
      }
    );
  }

  const depositAmount = '100.00';
  const timestamp = new Date().toISOString();

  return NextResponse.json(
    {
      status: 'success',
      depositAmount,
      message: 'Deposit triggered for agent!',
      timestamp,
      network: 'base-sepolia',
      paymentReceived: true,
    },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

export async function POST(request: NextRequest) {
  const hasPaid = await verifyPayment(request);

  if (!hasPaid) {
    return new NextResponse(
      JSON.stringify({
        error: 'Payment Required',
        message: 'This endpoint requires x402 payment',
        price: '0.01 USDC',
        network: 'Base Sepolia',
      }),
      {
        status: 402,
        headers: {
          'Content-Type': 'application/json',
          'Accept-Payment': `x402 1.0 amount=${PAYMENT_REQUIRED_PRICE} currency=USDC network=base-sepolia payto=${PAYMENT_WALLET} facilitator=${FACILITATOR_URL}`,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Accept-Payment, X-Payment-Proof, X-Payment-Tx',
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { amount = '100.00', account = 'default-agent' } = body;

    const timestamp = new Date().toISOString();

    return NextResponse.json(
      {
        status: 'success',
        depositAmount: amount,
        account,
        message: `Deposit of ${amount} triggered for agent account: ${account}`,
        timestamp,
        network: 'base-sepolia',
        paymentReceived: true,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to process deposit request',
      },
      { status: 400 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept-Payment, X-Payment-Proof, X-Payment-Tx',
    },
  });
}
