/**
 * Chain + asset identifiers for the x402 rail.
 * Target address format picks the chain: 0x… → Base, base58 → Solana.
 * provision:true stays Base (CDP EVM child wallets).
 */

import { isValidEvmAddress } from '@/lib/billing';

export type RailChain = 'base' | 'solana';

export const BASE_MAINNET = 'eip155:8453';
export const BASE_SEPOLIA = 'eip155:84532';
export const SOLANA_MAINNET = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp';
export const SOLANA_DEVNET = 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1';

export const BASE_MAINNET_USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
export const BASE_SEPOLIA_USDC = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
/** Circle USDC mint on Solana mainnet */
export const SOLANA_MAINNET_USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
export const SOLANA_DEVNET_USDC = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';

const SOLANA_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export function isValidSolanaAddress(value: unknown): value is string {
  return typeof value === 'string' && SOLANA_RE.test(value);
}

export function detectTargetChain(target: string | null | undefined): RailChain | null {
  if (!target) return null;
  if (isValidEvmAddress(target)) return 'base';
  if (isValidSolanaAddress(target)) return 'solana';
  return null;
}

export function chainFromNetwork(network: string | null | undefined): RailChain | null {
  const n = (network ?? '').toLowerCase();
  if (!n) return null;
  if (n.startsWith('solana:') || n === 'solana' || n.includes('solana-devnet')) return 'solana';
  if (n.startsWith('eip155:') || n.includes('base')) return 'base';
  return null;
}

export function usdcAssetForNetwork(network: string | null | undefined): string {
  const n = (network ?? '').toLowerCase();
  if (n === SOLANA_DEVNET || n.includes('etwtrab') || n.includes('devnet')) {
    return SOLANA_DEVNET_USDC;
  }
  if (n.startsWith('solana:') || n === 'solana') return SOLANA_MAINNET_USDC;
  if (
    n === BASE_SEPOLIA ||
    n === 'base-sepolia' ||
    n.includes('84532') ||
    n.includes('sepolia')
  ) {
    return BASE_SEPOLIA_USDC;
  }
  return BASE_MAINNET_USDC;
}

export function networkLabelShort(network: string | null | undefined): string {
  const chain = chainFromNetwork(network);
  if (chain === 'solana') {
    return (network ?? '').includes('EtWTRAB') || (network ?? '').includes('devnet')
      ? 'solana-devnet'
      : 'solana';
  }
  if ((network ?? '').includes('84532') || (network ?? '').includes('sepolia')) {
    return 'base-sepolia';
  }
  return 'base';
}

let solanaPayToCache: string | null = process.env.CDP_PLATFORM_SOLANA_ADDRESS?.trim() || null;

export function getSolanaPayToCache(): string | null {
  return solanaPayToCache;
}

export function setSolanaPayToCache(address: string): void {
  if (isValidSolanaAddress(address)) solanaPayToCache = address;
}
