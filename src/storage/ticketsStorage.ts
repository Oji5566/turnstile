import { AppSettings, TransitTicket } from "../types/ticket";
import { sanitizeTicket } from "../utils/sanitize";

export const STORAGE_KEYS = {
  tickets: "turnstile:tickets",
  settings: "turnstile:settings",
  onboarding: "turnstile:onboardingComplete",
  seeded: "turnstile:demoDataSeeded"
} as const;

export const DEFAULT_SETTINGS: AppSettings = {
  defaultSort: "expiry",
  appearance: "system"
};

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }
}

function safeStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    const s = window.localStorage;
    const testKey = "__turnstile_test__";
    s.setItem(testKey, "1");
    s.removeItem(testKey);
    return s;
  } catch {
    return null;
  }
}

function readJSON<T>(key: string, fallback: T): T {
  const s = safeStorage();
  if (!s) return fallback;
  try {
    const raw = s.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): void {
  const s = safeStorage();
  if (!s) throw new StorageError("Local storage is unavailable in this browser.");
  try {
    s.setItem(key, JSON.stringify(value));
  } catch (err) {
    if (err instanceof DOMException && (err.name === "QuotaExceededError" || err.code === 22)) {
      throw new StorageError("Local storage is full. Free space and try again.");
    }
    throw new StorageError("Couldn’t save to local storage.");
  }
}

export function isStorageAvailable(): boolean {
  return !!safeStorage();
}

/* ------------------------- Tickets ------------------------- */

export function loadTickets(): TransitTicket[] {
  const raw = readJSON<unknown>(STORAGE_KEYS.tickets, []);
  if (!Array.isArray(raw)) return [];
  const out: TransitTicket[] = [];
  for (const item of raw) {
    const t = sanitizeTicket(item);
    if (t) out.push(t);
  }
  return out;
}

export function saveTickets(tickets: TransitTicket[]): void {
  writeJSON(STORAGE_KEYS.tickets, tickets);
}

/* ------------------------- Settings ------------------------- */

export function loadSettings(): AppSettings {
  const raw = readJSON<Partial<AppSettings>>(STORAGE_KEYS.settings, {});
  return {
    defaultSort:
      raw.defaultSort && ["expiry", "recent", "used", "operator", "pinned"].includes(raw.defaultSort)
        ? raw.defaultSort
        : DEFAULT_SETTINGS.defaultSort,
    appearance:
      raw.appearance && ["system", "light", "dark"].includes(raw.appearance)
        ? raw.appearance
        : DEFAULT_SETTINGS.appearance
  };
}

export function saveSettings(settings: AppSettings): void {
  writeJSON(STORAGE_KEYS.settings, settings);
}

/* ------------------------- Onboarding ------------------------- */

export function isOnboardingComplete(): boolean {
  const s = safeStorage();
  if (!s) return false;
  return s.getItem(STORAGE_KEYS.onboarding) === "true";
}

export function setOnboardingComplete(value: boolean): void {
  const s = safeStorage();
  if (!s) return;
  try {
    if (value) s.setItem(STORAGE_KEYS.onboarding, "true");
    else s.removeItem(STORAGE_KEYS.onboarding);
  } catch {
    /* ignore */
  }
}

/* ------------------------- Demo seed flag ------------------------- */

export function isDemoSeeded(): boolean {
  const s = safeStorage();
  if (!s) return false;
  return s.getItem(STORAGE_KEYS.seeded) === "true";
}

export function setDemoSeeded(value: boolean): void {
  const s = safeStorage();
  if (!s) return;
  try {
    if (value) s.setItem(STORAGE_KEYS.seeded, "true");
    else s.removeItem(STORAGE_KEYS.seeded);
  } catch {
    /* ignore */
  }
}

/* ------------------------- Whole-wallet ops ------------------------- */

export function clearAll(): void {
  const s = safeStorage();
  if (!s) return;
  s.removeItem(STORAGE_KEYS.tickets);
  s.removeItem(STORAGE_KEYS.seeded);
}

export function storageUsage(): { used: number; available: boolean } {
  if (!isStorageAvailable()) return { used: 0, available: false };
  try {
    const tickets = window.localStorage.getItem(STORAGE_KEYS.tickets) ?? "";
    const settings = window.localStorage.getItem(STORAGE_KEYS.settings) ?? "";
    return { used: tickets.length + settings.length, available: true };
  } catch {
    return { used: 0, available: false };
  }
}
