/**
 * fetch wrapper that always applies AbortSignal.timeout.
 * Use for every outbound HTTP call (Formspree, Google Sheets, Twilio, CDP).
 * Default 10s — long enough for Sheets, short enough to fail fast.
 */
export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<Response> {
  const { timeoutMs = 10_000, signal, ...rest } = init;
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const combined = signal
    ? AbortSignal.any([signal, timeoutSignal])
    : timeoutSignal;
  return fetch(input, { ...rest, signal: combined });
}
