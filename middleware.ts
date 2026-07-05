import { paymentProxy, x402ResourceServer } from '@x402/next';
import { ExactEvmScheme } from '@x402/evm/exact/server';
import { HTTPFacilitatorClient } from '@x402/core/server';
import { facilitator as cdpFacilitator } from '@coinbase/x402';

const PAY_TO = '0x3f7a25Dc7307F5662489686e5A457DAD4879F685';

// Mainnet requires CDP API keys (CDP_API_KEY_ID / CDP_API_KEY_SECRET) and
// X402_NETWORK=mainnet in the environment. Anything else runs Base Sepolia
// against the free x402.org facilitator.
const useMainnet =
  process.env.X402_NETWORK === 'mainnet' &&
  !!process.env.CDP_API_KEY_ID &&
  !!process.env.CDP_API_KEY_SECRET;

const NETWORK = useMainnet ? 'eip155:8453' : 'eip155:84532';

const facilitatorClient = new HTTPFacilitatorClient(
  useMainnet ? cdpFacilitator : { url: 'https://x402.org/facilitator' }
);

const server = new x402ResourceServer(facilitatorClient).register(
  NETWORK,
  new ExactEvmScheme()
);

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
    },
  },
  server
);

export const config = {
  matcher: ['/api/deposit'],
  runtime: 'nodejs',
};
