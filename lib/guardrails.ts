import { getDb } from '@/lib/db';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GuardrailResult {
  blocked: boolean;
  code: string | null;
  message: string | null;
  retryAfter: number | null;
  flags: string[];
}

export interface TransactionRecord {
  id: string;
  targetAddress: string;
  agentWallet: string;
  amountUsdc: number;
  feeUsdc: number;
  netUsdc: number;
  feeTier: string;
  status: string;
  agentTxHash: string | null;
  merchantTxHash: string | null;
  guardrailFlags: string[];
  errorMessage: string | null;
  retryCount: number;
}

// ---------------------------------------------------------------------------
// Constants (platform-wide defaults)
// ---------------------------------------------------------------------------

const DEFAULT_MAX_TRANSACTION_USDC = 100.0;

const DEFAULT_TARGET_VELOCITY = {
  maxTxnPerHour: 20,
  maxVolPerHour: 500.0,
  maxTxnPerDay: 100,
  maxVolPerDay: 2000.0,
};

const AGENT_VELOCITY = {
  maxTxnPerHour: 30,
  maxVolPerHour: 1000.0,
  maxUniqueTargetsPerHour: 10,
};

const RATE_LIMITS: Record<string, { limit: number; windowSeconds: number; keyType: 'agent_wallet' | 'ip' | 'api_key' }> = {
  'POST:/api/deposit': { limit: 30, windowSeconds: 60, keyType: 'agent_wallet' },
  'GET:/api/merchants': { limit: 60, windowSeconds: 60, keyType: 'ip' },
  'GET:/api/receipt': { limit: 120, windowSeconds: 60, keyType: 'ip' },
  'POST:/api/merchant': { limit: 5, windowSeconds: 3600, keyType: 'api_key' },
  '__default__': { limit: 100, windowSeconds: 60, keyType: 'ip' },
};

// ---------------------------------------------------------------------------
// Phase 1: Transaction logging
// ---------------------------------------------------------------------------

export async function logTransaction(txn: TransactionRecord): Promise<void> {
  const db = getDb();
  await db`
    INSERT INTO transactions (
      id, target_address, agent_wallet, amount_usdc, fee_usdc, net_usdc,
      fee_tier, status, agent_tx_hash, merchant_tx_hash, guardrail_flags,
      error_message, retry_count
    ) VALUES (
      ${txn.id}, ${txn.targetAddress}, ${txn.agentWallet},
      ${txn.amountUsdc}, ${txn.feeUsdc}, ${txn.netUsdc},
      ${txn.feeTier}, ${txn.status}, ${txn.agentTxHash},
      ${txn.merchantTxHash}, ${JSON.stringify(txn.guardrailFlags)},
      ${txn.errorMessage}, ${txn.retryCount}
    )
  `;
}

export async function updateTransactionStatus(
  id: string,
  status: string,
  patch?: { merchantTxHash?: string; errorMessage?: string; retryCount?: number; guardrailFlags?: string[] }
): Promise<void> {
  const db = getDb();
  const settledAt = (status === 'settled') ? new Date().toISOString() : null;
  await db`
    UPDATE transactions SET
      status = ${status},
      settled_at = ${settledAt},
      merchant_tx_hash = COALESCE(${patch?.merchantTxHash ?? null}, merchant_tx_hash),
      error_message = COALESCE(${patch?.errorMessage ?? null}, error_message),
      retry_count = COALESCE(${patch?.retryCount ?? null}, retry_count),
      guardrail_flags = COALESCE(${patch?.guardrailFlags ? JSON.stringify(patch.guardrailFlags) : null}::jsonb, guardrail_flags)
    WHERE id = ${id}
  `;
}

// ---------------------------------------------------------------------------
// Phase 2: Guardrail event logging
// ---------------------------------------------------------------------------

export async function logGuardrailEvent(event: {
  eventType: string;
  ruleName: string;
  targetAddress?: string | null;
  agentWallet?: string | null;
  depositId?: string | null;
  amountUsdc?: number | null;
  contextJson?: Record<string, unknown> | null;
  actionTaken: string;
}): Promise<void> {
  const db = getDb();
  await db`
    INSERT INTO guardrail_events (
      event_type, rule_name, target_address, agent_wallet,
      deposit_id, amount_usdc, context_json, action_taken
    ) VALUES (
      ${event.eventType}, ${event.ruleName},
      ${event.targetAddress ?? null}, ${event.agentWallet ?? null},
      ${event.depositId ?? null}, ${event.amountUsdc ?? null},
      ${event.contextJson ? JSON.stringify(event.contextJson) : null},
      ${event.actionTaken}
    )
  `;
}

// ---------------------------------------------------------------------------
// Phase 3: Transaction amount cap check
// ---------------------------------------------------------------------------

export async function checkAmountCap(
  targetAddress: string,
  amountUsdc: number,
  depositId: string
): Promise<GuardrailResult> {
  const db = getDb();
  const rows = await db`
    SELECT max_transaction_usdc FROM target_velocity_config
    WHERE target_address = ${targetAddress}
  `;
  const cap = rows.length > 0 ? Number(rows[0].max_transaction_usdc) : DEFAULT_MAX_TRANSACTION_USDC;

  if (amountUsdc > cap) {
    await logGuardrailEvent({
      eventType: 'AMOUNT_CAP',
      ruleName: 'AMOUNT_EXCEEDS_CAP',
      targetAddress,
      depositId,
      amountUsdc,
      contextJson: { cap, actual: amountUsdc },
      actionTaken: 'HELD',
    });
    return {
      blocked: true,
      code: 'AMOUNT_EXCEEDS_CAP',
      message: 'Transaction amount exceeds the configured cap. Contact support for higher limits.',
      retryAfter: null,
      flags: ['AMOUNT_EXCEEDS_CAP'],
    };
  }
  return { blocked: false, code: null, message: null, retryAfter: null, flags: [] };
}

// ---------------------------------------------------------------------------
// Phase 4: DB-backed rate limiting
// ---------------------------------------------------------------------------

function rateLimitConfigForEndpoint(method: string, pathname: string) {
  const key = `${method}:${pathname}`;
  if (RATE_LIMITS[key]) return RATE_LIMITS[key];
  if (pathname.startsWith('/api/receipt')) return RATE_LIMITS['GET:/api/receipt'];
  return RATE_LIMITS['__default__'];
}

export async function checkRateLimitDb(
  method: string,
  pathname: string,
  keyValue: string,
  depositId: string | null
): Promise<GuardrailResult> {
  const config = rateLimitConfigForEndpoint(method, pathname);
  const windowStart = Math.floor(Date.now() / 1000 / config.windowSeconds) * config.windowSeconds;
  const db = getDb();

  const rows = await db`
    INSERT INTO rate_limits (key, endpoint, window, count)
    VALUES (${keyValue}, ${pathname}, ${windowStart}, 1)
    ON CONFLICT (key, endpoint, window)
    DO UPDATE SET count = rate_limits.count + 1
    RETURNING count
  `;
  const count = rows[0].count;

  if (count > config.limit) {
    const now = Math.floor(Date.now() / 1000);
    const retryAfter = windowStart + config.windowSeconds - now;

    await logGuardrailEvent({
      eventType: 'RATE_LIMIT',
      ruleName: 'RATE_LIMIT_EXCEEDED',
      agentWallet: config.keyType === 'agent_wallet' ? keyValue : null,
      depositId,
      contextJson: { endpoint: pathname, limit: config.limit, count, windowSeconds: config.windowSeconds },
      actionTaken: 'BLOCKED',
    });

    return {
      blocked: true,
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Rate limit exceeded. Try again later.',
      retryAfter: Math.max(1, retryAfter),
      flags: ['RATE_LIMIT_EXCEEDED'],
    };
  }
  return { blocked: false, code: null, message: null, retryAfter: null, flags: [] };
}

export async function cleanupExpiredRateLimits(): Promise<void> {
  const db = getDb();
  const cutoff = Math.floor(Date.now() / 1000) - 7200;
  await db`DELETE FROM rate_limits WHERE window < ${cutoff}`;
}

// ---------------------------------------------------------------------------
// Phase 5: Per-target velocity controls
// ---------------------------------------------------------------------------

export async function checkTargetVelocity(
  targetAddress: string,
  amountUsdc: number,
  depositId: string
): Promise<GuardrailResult> {
  const db = getDb();
  const configRows = await db`
    SELECT max_txn_per_hour, max_vol_per_hour, max_txn_per_day, max_vol_per_day
    FROM target_velocity_config WHERE target_address = ${targetAddress}
  `;
  const cfg = configRows.length > 0
    ? {
        maxTxnPerHour: Number(configRows[0].max_txn_per_hour),
        maxVolPerHour: Number(configRows[0].max_vol_per_hour),
        maxTxnPerDay: Number(configRows[0].max_txn_per_day),
        maxVolPerDay: Number(configRows[0].max_vol_per_day),
      }
    : DEFAULT_TARGET_VELOCITY;

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 3600_000).toISOString();
  const oneDayAgo = new Date(now.getTime() - 86400_000).toISOString();

  const [hourly, daily] = await Promise.all([
    db`
      SELECT COUNT(*)::int as cnt, COALESCE(SUM(amount_usdc), 0)::numeric as vol
      FROM transactions
      WHERE target_address = ${targetAddress} AND created_at > ${oneHourAgo} AND status != 'failed'
    `,
    db`
      SELECT COUNT(*)::int as cnt, COALESCE(SUM(amount_usdc), 0)::numeric as vol
      FROM transactions
      WHERE target_address = ${targetAddress} AND created_at > ${oneDayAgo} AND status != 'failed'
    `,
  ]);

  const flags: string[] = [];

  if (Number(hourly[0].cnt) >= cfg.maxTxnPerHour) flags.push('HOURLY_TXN_LIMIT');
  if (Number(hourly[0].vol) + amountUsdc > cfg.maxVolPerHour) flags.push('HOURLY_VOL_LIMIT');
  if (Number(daily[0].cnt) >= cfg.maxTxnPerDay) flags.push('DAILY_TXN_LIMIT');
  if (Number(daily[0].vol) + amountUsdc > cfg.maxVolPerDay) flags.push('DAILY_VOL_LIMIT');

  if (flags.length > 0) {
    for (const flag of flags) {
      await logGuardrailEvent({
        eventType: 'VELOCITY_TARGET',
        ruleName: flag,
        targetAddress,
        depositId,
        amountUsdc,
        contextJson: {
          hourlyCnt: Number(hourly[0].cnt),
          hourlyVol: Number(hourly[0].vol),
          dailyCnt: Number(daily[0].cnt),
          dailyVol: Number(daily[0].vol),
          limits: cfg,
        },
        actionTaken: 'HELD',
      });
    }

    const retryAfter = flags.some(f => f.startsWith('DAILY_')) ? 3600 : 1800;
    return {
      blocked: true,
      code: flags[0],
      message: 'Velocity limit exceeded for this target. Try again later.',
      retryAfter,
      flags,
    };
  }
  return { blocked: false, code: null, message: null, retryAfter: null, flags: [] };
}

// ---------------------------------------------------------------------------
// Phase 6: Per-agent velocity controls
// ---------------------------------------------------------------------------

export async function checkAgentVelocity(
  agentWallet: string,
  amountUsdc: number,
  depositId: string
): Promise<GuardrailResult> {
  const db = getDb();
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 3600_000).toISOString();

  const [hourly, uniqueTargets] = await Promise.all([
    db`
      SELECT COUNT(*)::int as cnt, COALESCE(SUM(amount_usdc), 0)::numeric as vol
      FROM transactions
      WHERE agent_wallet = ${agentWallet} AND created_at > ${oneHourAgo} AND status != 'failed'
    `,
    db`
      SELECT COUNT(DISTINCT target_address)::int as cnt
      FROM transactions
      WHERE agent_wallet = ${agentWallet} AND created_at > ${oneHourAgo} AND status != 'failed'
    `,
  ]);

  const flags: string[] = [];

  if (Number(hourly[0].cnt) >= AGENT_VELOCITY.maxTxnPerHour) flags.push('AGENT_HOURLY_TXN_LIMIT');
  if (Number(hourly[0].vol) + amountUsdc > AGENT_VELOCITY.maxVolPerHour) flags.push('AGENT_HOURLY_VOL_LIMIT');
  if (Number(uniqueTargets[0].cnt) >= AGENT_VELOCITY.maxUniqueTargetsPerHour) flags.push('AGENT_TARGET_DIVERSITY_LIMIT');

  if (flags.length > 0) {
    for (const flag of flags) {
      await logGuardrailEvent({
        eventType: 'VELOCITY_AGENT',
        ruleName: flag,
        agentWallet,
        depositId,
        amountUsdc,
        contextJson: {
          hourlyCnt: Number(hourly[0].cnt),
          hourlyVol: Number(hourly[0].vol),
          uniqueTargets: Number(uniqueTargets[0].cnt),
          limits: AGENT_VELOCITY,
        },
        actionTaken: 'HELD',
      });
    }

    return {
      blocked: true,
      code: flags[0],
      message: 'Agent velocity limit exceeded. Try again later.',
      retryAfter: 1800,
      flags,
    };
  }
  return { blocked: false, code: null, message: null, retryAfter: null, flags: [] };
}

// ---------------------------------------------------------------------------
// Phase 7: Settlement failure logging
// ---------------------------------------------------------------------------

export async function logSettlementFailure(
  depositId: string,
  targetAddress: string,
  amountUsdc: number,
  error: string,
  retryCount: number
): Promise<void> {
  await logGuardrailEvent({
    eventType: 'SETTLEMENT_FAILURE',
    ruleName: retryCount >= 3 ? 'SETTLEMENT_EXHAUSTED' : 'SETTLEMENT_RETRY',
    targetAddress,
    depositId,
    amountUsdc,
    contextJson: { error, retryCount },
    actionTaken: retryCount >= 3 ? 'HELD' : 'WARNED',
  });
}

// ---------------------------------------------------------------------------
// Orchestrator: run all pre-forward guardrails in order
// ---------------------------------------------------------------------------

export interface GuardrailContext {
  depositId: string;
  targetAddress: string;
  agentWallet: string;
  amountUsdc: number;
  feeUsdc: number;
  netUsdc: number;
  method: string;
  pathname: string;
  rateLimitKey: string;
}

export async function runGuardrails(ctx: GuardrailContext): Promise<GuardrailResult> {
  const allFlags: string[] = [];

  // 1. Rate limiting (Phase 4)
  const rateResult = await checkRateLimitDb(ctx.method, ctx.pathname, ctx.rateLimitKey, ctx.depositId);
  if (rateResult.blocked) return rateResult;

  // 2. Amount cap (Phase 3)
  const capResult = await checkAmountCap(ctx.targetAddress, ctx.amountUsdc, ctx.depositId);
  if (capResult.blocked) {
    allFlags.push(...capResult.flags);
    return { ...capResult, flags: allFlags };
  }

  // 3. Per-target velocity (Phase 5)
  const targetResult = await checkTargetVelocity(ctx.targetAddress, ctx.amountUsdc, ctx.depositId);
  if (targetResult.blocked) {
    allFlags.push(...targetResult.flags);
    return { ...targetResult, flags: allFlags };
  }

  // 4. Per-agent velocity (Phase 6)
  const agentResult = await checkAgentVelocity(ctx.agentWallet, ctx.amountUsdc, ctx.depositId);
  if (agentResult.blocked) {
    allFlags.push(...agentResult.flags);
    return { ...agentResult, flags: allFlags };
  }

  return { blocked: false, code: null, message: null, retryAfter: null, flags: [] };
}

// ---------------------------------------------------------------------------
// Guardrail error response builder (matches spec contract)
// ---------------------------------------------------------------------------

export function guardrailErrorResponse(result: GuardrailResult, depositId: string) {
  const status = result.code === 'RATE_LIMIT_EXCEEDED' ? 429 : 402;
  const body: Record<string, unknown> = {
    error: 'GUARDRAIL_BLOCKED',
    code: result.code,
    message: result.message,
    depositId,
  };
  if (result.retryAfter !== null) {
    body.retryAfter = result.retryAfter;
  }
  return { status, body };
}
