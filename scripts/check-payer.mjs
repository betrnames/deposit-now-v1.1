/**
 * Preflight: confirm payer wallet has Base mainnet ETH (gas) + USDC.
 * Requires EVM_PRIVATE_KEY in environment.
 */
import { createPublicClient, formatUnits, http } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const key = process.env.EVM_PRIVATE_KEY;
if (!key) {
  console.error('Set EVM_PRIVATE_KEY first (terminal only, not chat).');
  process.exit(1);
}

const account = privateKeyToAccount(key);
const client = createPublicClient({ chain: base, transport: http() });

const [eth, usdc] = await Promise.all([
  client.getBalance({ address: account.address }),
  client.readContract({
    address: USDC,
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'balanceOf',
    args: [account.address],
  }),
]);

console.log('Payer address:', account.address);
console.log('ETH (gas):    ', formatUnits(eth, 18));
console.log('USDC:         ', formatUnits(usdc, 6));
console.log('Need:          ≥0.01 USDC + a little ETH for gas');

if (usdc < 10_000n) process.exit(1);