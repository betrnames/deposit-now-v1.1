/**
 * Managed child agent wallets via CDP Server Wallets.
 * v1: provision address + fund via deposit; keys remain platform-managed in CDP.
 * No private-key export. Spend/claim APIs are future work.
 */

import { createHash, randomUUID } from 'crypto';
import { createChildCdpAccount, isCdpProvisioningAvailable } from '@/lib/cdp';
import { getDb } from '@/lib/db';

export const CHILD_CDP_NAME_PREFIX = 'dn-child-';
/** CDP account names: keep short and DNS-safe. */
const MAX_LABEL_LEN = 36;
const MAX_CDP_NAME_LEN = 64;

export type ProvisionErrorCode =
  | 'ambiguous_target'
  | 'missing_target'
  | 'invalid_label'
  | 'missing_provision_identity'
  | 'provision_unavailable'
  | 'provision_failed'
  | 'provision_rate_limited';

export interface ChildAgentInfo {
  name: string;
  address: string;
  label: string | null;
  custody: 'cdp_server_wallet';
  control: 'platform_managed';
}

export interface ProvisionResult {
  ok: true;
  child: ChildAgentInfo;
  created: boolean;
}

export interface ProvisionFailure {
  ok: false;
  code: ProvisionErrorCode;
  message: string;
  status: number;
  retryAfter?: number;
}

/** Sanitize user label for CDP account name suffix. */
export function sanitizeChildLabel(raw: unknown): string | null {
  if (raw === undefined || raw === null || raw === '') return null;
  if (typeof raw !== 'string') return null;
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  if (!cleaned || cleaned.length > MAX_LABEL_LEN) return null;
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(cleaned) && cleaned.length > 1) {
    // single char alnum is ok
    if (!(cleaned.length === 1 && /[a-z0-9]/.test(cleaned))) return null;
  }
  return cleaned;
}

export function isValidLabelInput(raw: unknown): boolean {
  if (raw === undefined || raw === null || raw === '') return true; // optional until provision requires identity
  return sanitizeChildLabel(raw) !== null;
}

function shortHash(input: string, len = 16): string {
  return createHash('sha256').update(input).digest('hex').slice(0, len);
}

/**
 * Build a stable CDP account name from client-provided identity.
 * Must be deterministic so unpaid→paid retries resolve the same wallet.
 */
export function buildChildCdpName(opts: {
  label?: string | null;
  idempotencyKey?: string | null;
}): { name: string; label: string | null } | { error: ProvisionErrorCode; message: string } {
  const label = opts.label ? sanitizeChildLabel(opts.label) : null;
  if (opts.label && !label) {
    return {
      error: 'invalid_label',
      message:
        'label must be 1–36 chars: lowercase letters, digits, hyphens (e.g. trading-agent-1).',
    };
  }

  const idem =
    typeof opts.idempotencyKey === 'string' && opts.idempotencyKey.trim()
      ? opts.idempotencyKey.trim().slice(0, 128)
      : null;

  if (!label && !idem) {
    return {
      error: 'missing_provision_identity',
      message:
        'provision: true requires a stable "label" and/or Idempotency-Key header so retries resolve the same child wallet.',
    };
  }

  const identity = idem
    ? `idem:${idem}`
    : `label:${label}`;
  const hash = shortHash(identity, 20);
  const suffix = label ? `${label}-${hash.slice(0, 10)}` : hash;
  let name = `${CHILD_CDP_NAME_PREFIX}${suffix}`;
  if (name.length > MAX_CDP_NAME_LEN) {
    name = `${CHILD_CDP_NAME_PREFIX}${hash}`;
  }
  return { name, label };
}

export function childPublicInfo(
  name: string,
  address: string,
  label: string | null
): ChildAgentInfo {
  return {
    name,
    address,
    label,
    custody: 'cdp_server_wallet',
    control: 'platform_managed',
  };
}

async function upsertChildAgentRow(row: {
  cdpName: string;
  address: string;
  label: string | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    const db = getDb();
    const id = randomUUID();
    await db`
      INSERT INTO child_agents (id, cdp_name, address, label, metadata)
      VALUES (
        ${id},
        ${row.cdpName},
        ${row.address.toLowerCase()},
        ${row.label},
        ${JSON.stringify(row.metadata ?? {})}::jsonb
      )
      ON CONFLICT (cdp_name) DO UPDATE SET
        address = EXCLUDED.address,
        label = COALESCE(EXCLUDED.label, child_agents.label)
    `;
  } catch (err) {
    // DB optional for provision path — CDP wallet still exists
    console.error(
      'child_agents upsert failed:',
      err instanceof Error ? err.message : 'unknown'
    );
  }
}

/** Mark parent + last funded after successful settlement forward. */
export async function recordChildFunded(
  address: string,
  parentWallet: string | null
): Promise<void> {
  try {
    const db = getDb();
    await db`
      UPDATE child_agents
      SET
        last_funded_at = NOW(),
        parent_wallet = COALESCE(${parentWallet?.toLowerCase() ?? null}, parent_wallet)
      WHERE address = ${address.toLowerCase()}
    `;
  } catch (err) {
    console.error(
      'child_agents recordChildFunded failed:',
      err instanceof Error ? err.message : 'unknown'
    );
  }
}

/** Tighter provision rate limit: 5 / hour per key (IP or idempotency). */
export async function checkProvisionRateLimit(
  keyValue: string
): Promise<{ blocked: boolean; retryAfter?: number }> {
  try {
    const db = getDb();
    const windowSeconds = 3600;
    const limit = 5;
    const windowStart = Math.floor(Date.now() / 1000 / windowSeconds) * windowSeconds;
    const endpoint = 'POST:/api/deposit:provision';
    const rows = await db`
      INSERT INTO rate_limits (key, endpoint, "window", count)
      VALUES (${keyValue}, ${endpoint}, ${windowStart}, 1)
      ON CONFLICT (key, endpoint, "window")
      DO UPDATE SET count = rate_limits.count + 1
      RETURNING count
    `;
    const count = Number(rows[0]?.count ?? 0);
    if (count > limit) {
      const now = Math.floor(Date.now() / 1000);
      return { blocked: true, retryAfter: Math.max(1, windowStart + windowSeconds - now) };
    }
    return { blocked: false };
  } catch {
    // DB down — allow provision (CDP still enforces project limits)
    return { blocked: false };
  }
}

/**
 * Resolve or create a managed child wallet.
 * Idempotent for the same label / Idempotency-Key.
 */
export async function provisionChild(opts: {
  label?: string | null;
  idempotencyKey?: string | null;
  rateLimitKey?: string | null;
}): Promise<ProvisionResult | ProvisionFailure> {
  if (!isCdpProvisioningAvailable()) {
    return {
      ok: false,
      code: 'provision_unavailable',
      message:
        'Child provisioning requires CDP Server Wallet credentials on the server (CDP_API_KEY_ID, CDP_API_KEY_SECRET, CDP_WALLET_SECRET).',
      status: 503,
    };
  }

  const named = buildChildCdpName({
    label: opts.label,
    idempotencyKey: opts.idempotencyKey,
  });
  if ('error' in named) {
    return {
      ok: false,
      code: named.error,
      message: named.message,
      status: 400,
    };
  }

  const rlKey = opts.rateLimitKey ?? opts.idempotencyKey ?? named.name;
  const rl = await checkProvisionRateLimit(rlKey);
  if (rl.blocked) {
    return {
      ok: false,
      code: 'provision_rate_limited',
      message: 'Child provisioning rate limit exceeded. Try again later.',
      status: 429,
      retryAfter: rl.retryAfter,
    };
  }

  try {
    const account = await createChildCdpAccount(named.name);
    await upsertChildAgentRow({
      cdpName: named.name,
      address: account.address,
      label: named.label,
      metadata: { source: 'provision' },
    });
    return {
      ok: true,
      child: childPublicInfo(named.name, account.address, named.label),
      created: true,
    };
  } catch (err) {
    console.error(
      'provisionChild failed:',
      err instanceof Error ? err.message : 'unknown'
    );
    return {
      ok: false,
      code: 'provision_failed',
      message: 'Failed to provision child agent wallet. Retry later.',
      status: 502,
    };
  }
}

/**
 * XOR validation: exactly one of target address mode or provision mode.
 */
export function resolveDepositTargetMode(body: {
  target: string | null;
  provision: boolean;
}): { mode: 'target' } | { mode: 'provision' } | { mode: 'error'; code: ProvisionErrorCode; message: string } {
  const hasTarget = !!(body.target && body.target.trim());
  if (hasTarget && body.provision) {
    return {
      mode: 'error',
      code: 'ambiguous_target',
      message: 'Provide either target (existing address) or provision: true, not both.',
    };
  }
  if (!hasTarget && !body.provision) {
    return {
      mode: 'error',
      code: 'missing_target',
      message:
        'POST JSON with target (0x…) or provision: true plus label (or Idempotency-Key), and amount.',
    };
  }
  if (body.provision) return { mode: 'provision' };
  return { mode: 'target' };
}
