/**
 * Lightweight helpers for handling stored QR payloads.
 * Turnstile does NOT validate, authenticate, or modify transit tickets.
 * It only preserves the text content of a QR exactly as scanned.
 */

const DEMO_PREFIX = "TST1:";

export function looksLikeDemoPayload(payload: string): boolean {
  return typeof payload === "string" && payload.startsWith(DEMO_PREFIX);
}

export function normalizePayload(raw: string): string {
  return (raw ?? "").toString().trim();
}

/** Returns true if the payload is non-empty after trimming. */
export function isUsablePayload(payload: string): boolean {
  return normalizePayload(payload).length > 0;
}

export function previewPayload(payload: string, max = 64): string {
  const p = normalizePayload(payload);
  if (p.length <= max) return p;
  return p.slice(0, max - 1) + "…";
}
