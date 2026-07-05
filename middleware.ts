import { paymentProxy, x402ResourceServer } from '@x402/next';
import { ExactEvmScheme } from '@x402/evm/exact/server';
import { HTTPFacilitatorClient } from '@x402/core/server';
import {
  declareDiscoveryExtension,
  bazaarResourceServerExtension,
} from '@x402/extensions/bazaar';
import { facilitator as cdpFacilitator } from '@coinbase/x402';

const PAY_TO = '0x3f7a25Dc7307F5662489686e5A457DAD4879F685';

// Mainnet requires CDP API keys (CDP_API_KEY_ID / CDP_API_KEY_SECRET) and
// X402_NETWORK=mainnet in the environment. Anything else runs Base Sepolia
// against the free x402.org facilitator. The Bazaar discovery extension is
// declared either way; the CDP facilitator indexes the endpoint automatically
// after its first settled mainnet payment.
const useMainnet =
  process.env.X402_NETWORK === 'mainnet' &&
  !!process.env.CDP_API_KEY_ID &&
  !!process.env.CDP_API_KEY_SECRET;

const NETWORK = useMainnet ? 'eip155:8453' : 'eip155:84532';

const facilitatorClient = new HTTPFacilitatorClient(
  useMainnet ? cdpFacilitator : { url: 'https://x402.org/facilitator' }
);

const server = new x402ResourceServer(facilitatorClient)
  .register(NETWORK, new ExactEvmScheme())
  .registerExtension(bazaarResourceServerExtension);

export const middleware = paymentProxy(
  {
    '/api/deposit': {
      accepts: [
        {
          scheme: 'exact',
          price: '$0.01',
          network: NETWORK,
          payTo: PAY_TO,
        },
      ],
      description:
        'Trigger an autonomous agent deposit via deposit.now. Pays 0.01 USDC per call.',
      mimeType: 'application/json',
      extensions: {
        ...declareDiscoveryExtension({
          bodyType: 'json',
          input: { amount: '100.00', account: 'agent-wallet-123' },
          inputSchema: {
            properties: {
              amount: {
                type: 'string',
                description: 'Deposit amount to trigger, as a decimal string',
              },
              account: {
                type: 'string',
                description: 'Agent account identifier receiving the deposit',
              },
            },
            required: [],
          },
          output: {
            example: {
              status: 'success',
              depositAmount: '100.00',
              account: 'agent-wallet-123',
              message:
                'Deposit of 100.00 triggered for agent account: agent-wallet-123',
              timestamp: '2026-07-04T00:00:00.000Z',
              paymentReceived: true,
              transactionId: 'txn_1751587200000_x7k2m9p4q',
            },
          },
        }),
      },
    },
  },
  server
);

export const config = {
  matcher: ['/api/deposit'],
  runtime: 'nodejs',
};
