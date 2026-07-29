/**
 * Server-side payment verification guardrails.
 * Run AFTER CDP facilitator settle succeeds, BEFORE platform→target forward.
 * Does not replace x402/CDP verification — layers integrity checks on top.
 */

import { put, head } from '@vercel/blob';
import { isValidEvmAddress } from '@/lib/billing';
import { getDb } from '@/lib/db';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Base mainnet USDC (Circle) */
export const BASE_MAINNET_USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

/** Base Sepolia USDC (testnet only) */
export const BASE_SEPOLIA_USDC = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export interface PaymentVerifyResult {
  ok: boolean;
  code: string | null;
  message: string | null;
  flags: string[];
}

export interface SettlementPaymentShape {
  /** Payment requirements asset (token contract) */
  asset?: string | null;
  /** Atomic USDC amount from requirements (micro-units string) */
  requirementsAmountAtomic?: string | null;
  /** Network CAIP-2 or label */
  network?: string | null;
  /** EIP-3009 authorization value (atomic) if present */
  authorizationValue?: string | null;
  /** EIP-3009 / payload nonce */
  nonce?: string | null;
  /** Signature fallback unique id when nonce missing */
  signature?: string | null;
  depositId: string;
  agentWallet?: string | null;
}

// ---------------------------------------------------------------------------
// Target validation (pre-402 + pre-forward)
// ---------------------------------------------------------------------------

export type TargetValidationCode =
  | 'invalid_format'
  | 'zero_address'
  | 'platform_self_deposit'
  | null;

export function validateDepositTarget(
  target: unknown,
  platformPayTo: string
): { ok: true; address: string } | { ok: false; code: TargetValidationCode; message: string } {
  if (!isValidEvmAddress(target)) {
    return {
      ok: false,
      code: 'invalid_format',
      message: 'target must be a valid EVM address (0x + 40 hex chars).',
    };
  }

  const address = target as string;
  if (address.toLowerCase() === ZERO_ADDRESS.toLowerCase()) {
    return {
      ok: false,
      code: 'zero_address',
      message: 'target cannot be the zero address.',
    };
  }

  if (address.toLowerCase() === platformPayTo.toLowerCase()) {
    return {
      ok: false,
      code: 'platform_self_deposit',
      message: 'target cannot be the platform wallet (self-deposit loop blocked).',
    };
  }

  return { ok: true, address };
}

// ---------------------------------------------------------------------------
// 1. Token contract verification
// ---------------------------------------------------------------------------

function expectedUsdcForNetwork(network: string | null | undefined): string {
  const n = (network ?? '').toLowerCase();
  if (
    n === 'eip155:84532' ||
    n === 'base-sepolia' ||
    n.includes('84532') ||
    n.includes('sepolia')
  ) {
    return BASE_SEPOLIA_USDC;
  }
  // Production default: Base mainnet USDC
  return BASE_MAINNET_USDC;
}

export function verifyTokenContract(
  asset: string | null | undefined,
  network: string | null | undefined
): PaymentVerifyResult {
  const expected = expectedUsdcForNetwork(network);
  if (!asset || typeof asset !== 'string') {
    console.error(
      `[payment-verify] TOKEN_MISSING: no asset on settlement (expected ${expected})`
    );
    return {
      ok: false,
      code: 'TOKEN_MISSING',
      message: 'Settlement missing token asset; forward blocked.',
      flags: ['TOKEN_MISSING'],
    };
  }

  if (asset.toLowerCase() !== expected.toLowerCase()) {
    console.error(
      `[payment-verify] TOKEN_MISMATCH: asset=${asset} expected=${expected} network=${network ?? 'unknown'}`
    );
    return {
      ok: false,
      code: 'TOKEN_MISMATCH',
      message: 'Settled token is not the expected USDC contract; forward blocked.',
      flags: ['TOKEN_MISMATCH'],
    };
  }

  return { ok: true, code: null, message: null, flags: [] };
}

// ---------------------------------------------------------------------------
// 2. Amount match verification (settled == quoted gross exactly)
// ---------------------------------------------------------------------------

/** Convert decimal USDC to atomic micro-units string (6 decimals). */
export function usdcToAtomic(usdc: number): string {
  return String(Math.round(usdc * 1e6));
}

export function verifyAmountMatch(
  quotedGrossUsdc: number,
  requirementsAmountAtomic: string | null | undefined,
  authorizationValue?: string | null
): PaymentVerifyResult {
  const quotedAtomic = usdcToAtomic(quotedGrossUsdc);

  if (!requirementsAmountAtomic) {
    console.error(
      `[payment-verify] AMOUNT_MISSING: quotedAtomic=${quotedAtomic} no requirements amount`
    );
    return {
      ok: false,
      code: 'AMOUNT_MISSING',
      message: 'Settlement missing amount; forward blocked.',
      flags: ['AMOUNT_MISSING'],
    };
  }

  // Normalize leading zeros / numeric equality
  let settled: bigint;
  let quoted: bigint;
  try {
    settled = BigInt(requirementsAmountAtomic);
    quoted = BigInt(quotedAtomic);
  } catch {
    console.error(
      `[payment-verify] AMOUNT_PARSE_ERROR: settled=${requirementsAmountAtomic} quoted=${quotedAtomic}`
    );
    return {
      ok: false,
      code: 'AMOUNT_PARSE_ERROR',
      message: 'Could not parse settlement amount; forward blocked.',
      flags: ['AMOUNT_PARSE_ERROR'],
    };
  }

  if (settled !== quoted) {
    console.error(
      `[payment-verify] AMOUNT_MISMATCH: settledAtomic=${settled} quotedAtomic=${quoted} quotedGross=${quotedGrossUsdc}`
    );
    return {
      ok: false,
      code: 'AMOUNT_MISMATCH',
      message: 'Settled amount does not match quoted 402 amount; forward blocked.',
      flags: ['AMOUNT_MISMATCH'],
    };
  }

  if (authorizationValue != null && authorizationValue !== '') {
    try {
      const auth = BigInt(authorizationValue);
      if (auth !== quoted) {
        console.error(
          `[payment-verify] AUTH_AMOUNT_MISMATCH: authValue=${auth} quotedAtomic=${quoted}`
        );
        return {
          ok: false,
          code: 'AUTH_AMOUNT_MISMATCH',
          message: 'Authorization value does not match quoted amount; forward blocked.',
          flags: ['AUTH_AMOUNT_MISMATCH'],
        };
      }
    } catch {
      console.error(
        `[payment-verify] AUTH_AMOUNT_PARSE_ERROR: authorizationValue=${authorizationValue}`
      );
      return {
        ok: false,
        code: 'AUTH_AMOUNT_PARSE_ERROR',
        message: 'Could not parse authorization amount; forward blocked.',
        flags: ['AUTH_AMOUNT_PARSE_ERROR'],
      };
    }
  }

  return { ok: true, code: null, message: null, flags: [] };
}

// ---------------------------------------------------------------------------
// 3. Nonce replay protection
// ---------------------------------------------------------------------------

function nonceBlobPath(nonceKey: string) {
  return `payment-nonces/${nonceKey}.json`;
}

function normalizeNonceKey(nonce: string): string {
  // Blob path safety: hex/alphanumeric only
  const cleaned = nonce.replace(/[^a-fA-F0-9x]/g, '').slice(0, 128);
  return cleaned || 'empty';
}

/**
 * Atomically claim a payment nonce. Returns ok:false if already used.
 * Prefer Neon unique constraint; fall back to Vercel Blob.
 * Fail-closed if no durable store is configured.
 */
export async function claimPaymentNonce(opts: {
  nonce: string | null | undefined;
  signature?: string | null;
  depositId: string;
  agentWallet?: string | null;
}): Promise<PaymentVerifyResult> {
  const raw = opts.nonce || opts.signature;
  if (!raw) {
    console.error('[payment-verify] NONCE_MISSING: no nonce or signature on payment payload');
    return {
      ok: false,
      code: 'NONCE_MISSING',
      message: 'Payment nonce missing; forward blocked.',
      flags: ['NONCE_MISSING'],
    };
  }

  const nonceKey = normalizeNonceKey(String(raw));

  // Neon (preferred — unique constraint)
  if (process.env.DATABASE_URL) {
    try {
      const db = getDb();
      const rows = await db`
        INSERT INTO payment_nonces (nonce, deposit_id, agent_wallet)
        VALUES (${nonceKey}, ${opts.depositId}, ${opts.agentWallet ?? null})
        ON CONFLICT (nonce) DO NOTHING
        RETURNING nonce
      `;
      if (!rows.length) {
        console.error(
          `[payment-verify] NONCE_REPLAY: nonce=${nonceKey} depositId=${opts.depositId}`
        );
        return {
          ok: false,
          code: 'NONCE_REPLAY',
          message: 'Payment nonce already used; forward blocked.',
          flags: ['NONCE_REPLAY'],
        };
      }
      return { ok: true, code: null, message: null, flags: [] };
    } catch (err) {
      console.error(
        '[payment-verify] nonce DB claim failed:',
        err instanceof Error ? err.message : 'unknown'
      );
      // fall through to blob
    }
  }

  // Vercel Blob fallback
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const path = nonceBlobPath(nonceKey);
    try {
      await head(path);
      // exists → replay
      console.error(
        `[payment-verify] NONCE_REPLAY (blob): nonce=${nonceKey} depositId=${opts.depositId}`
      );
      return {
        ok: false,
        code: 'NONCE_REPLAY',
        message: 'Payment nonce already used; forward blocked.',
        flags: ['NONCE_REPLAY'],
      };
    } catch {
      // not found — claim
    }

    try {
      await put(
        path,
        JSON.stringify({
          nonce: nonceKey,
          depositId: opts.depositId,
          agentWallet: opts.agentWallet ?? null,
          claimedAt: new Date().toISOString(),
        }),
        {
          access: 'public',
          addRandomSuffix: false,
          allowOverwrite: false,
          contentType: 'application/json',
        }
      );
      return { ok: true, code: null, message: null, flags: [] };
    } catch (err) {
      // Concurrent put or overwrite denied → treat as replay
      console.error(
        `[payment-verify] NONCE_REPLAY (blob put race): nonce=${nonceKey}`,
        err instanceof Error ? err.message : 'unknown'
      );
      return {
        ok: false,
        code: 'NONCE_REPLAY',
        message: 'Payment nonce already used; forward blocked.',
        flags: ['NONCE_REPLAY'],
      };
    }
  }

  // Fail-closed: no durable store
  console.error(
    '[payment-verify] NONCE_STORE_UNAVAILABLE: set DATABASE_URL or BLOB_READ_WRITE_TOKEN'
  );
  return {
    ok: false,
    code: 'NONCE_STORE_UNAVAILABLE',
    message: 'Nonce store unavailable; forward blocked.',
    flags: ['NONCE_STORE_UNAVAILABLE'],
  };
}

// ---------------------------------------------------------------------------
// Orchestrator: all payment verification checks
// ---------------------------------------------------------------------------

export async function runPaymentVerification(opts: {
  asset?: string | null;
  network?: string | null;
  requirementsAmountAtomic?: string | null;
  authorizationValue?: string | null;
  nonce?: string | null;
  signature?: string | null;
  quotedGrossUsdc: number;
  depositId: string;
  agentWallet?: string | null;
}): Promise<PaymentVerifyResult> {
  const flags: string[] = [];

  // 1. Token
  const token = verifyTokenContract(opts.asset, opts.network);
  if (!token.ok) return token;

  // 2. Amount
  const amount = verifyAmountMatch(
    opts.quotedGrossUsdc,
    opts.requirementsAmountAtomic,
    opts.authorizationValue
  );
  if (!amount.ok) return amount;

  // 3. Nonce (must be last among pre-forward claims so we only burn nonce when amount/token ok)
  const nonce = await claimPaymentNonce({
    nonce: opts.nonce,
    signature: opts.signature,
    depositId: opts.depositId,
    agentWallet: opts.agentWallet,
  });
  if (!nonce.ok) return nonce;

  return { ok: true, code: null, message: null, flags };
}

/** Extract nonce / auth value / signature from x402 payment payload. */
export function extractPaymentIdentity(paymentPayload: unknown): {
  nonce: string | null;
  signature: string | null;
  authorizationValue: string | null;
  from: string | null;
} {
  const p = paymentPayload as {
    payload?: {
      signature?: string;
      authorization?: {
        nonce?: string | number | bigint;
        value?: string | number | bigint;
        from?: string;
      };
    };
  } | null;

  const auth = p?.payload?.authorization;
  const nonce =
    auth?.nonce !== undefined && auth?.nonce !== null ? String(auth.nonce) : null;
  const authorizationValue =
    auth?.value !== undefined && auth?.value !== null ? String(auth.value) : null;
  const signature = p?.payload?.signature ? String(p.payload.signature) : null;
  const from = auth?.from ? String(auth.from) : null;

  return { nonce, signature, authorizationValue, from };
}
