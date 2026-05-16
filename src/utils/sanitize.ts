import {
  ALLOWED_COLORS,
  ALLOWED_ICONS,
  DEFAULT_COLOR,
  DEFAULT_ICON,
  TransitMode,
  TRANSIT_MODES,
  TicketIcon,
  TicketStatus,
  TransitTicket
} from "../types/ticket";

const ALLOWED_STATUSES: TicketStatus[] = [
  "Active",
  "Today",
  "Expiring Soon",
  "Expired",
  "Archived"
];

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string");
}

function asBoolean(v: unknown, fallback = false): boolean {
  return typeof v === "boolean" ? v : fallback;
}

function asNumber(v: unknown, fallback = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function asIcon(v: unknown): TicketIcon {
  return typeof v === "string" && (ALLOWED_ICONS as string[]).includes(v)
    ? (v as TicketIcon)
    : DEFAULT_ICON;
}

function asColor(v: unknown): string {
  return typeof v === "string" && ALLOWED_COLORS.includes(v) ? v : DEFAULT_COLOR;
}

function asMode(v: unknown): TransitMode {
  return typeof v === "string" && (TRANSIT_MODES as string[]).includes(v)
    ? (v as TransitMode)
    : "Other";
}

function asStatus(v: unknown): TicketStatus {
  return typeof v === "string" && (ALLOWED_STATUSES as string[]).includes(v)
    ? (v as TicketStatus)
    : "Active";
}

/** Coerce arbitrary input (e.g. imported JSON) to a valid ticket. */
export function sanitizeTicket(input: unknown, fallbackId?: string): TransitTicket | null {
  if (!input || typeof input !== "object") return null;
  const r = input as Record<string, unknown>;
  const now = new Date().toISOString();
  const id = asString(r.id) || fallbackId || cryptoRandomId();
  return {
    id,
    operator: asString(r.operator),
    title: asString(r.title),
    ticketType: asString(r.ticketType),
    mode: asMode(r.mode),
    icon: asIcon(r.icon),
    color: asColor(r.color),
    routeOrZone: asString(r.routeOrZone),
    origin: asString(r.origin),
    destination: asString(r.destination),
    validFrom: asString(r.validFrom),
    validUntil: asString(r.validUntil),
    status: asStatus(r.status),
    qrPayload: asString(r.qrPayload),
    notes: asString(r.notes),
    tags: asStringArray(r.tags),
    pinned: asBoolean(r.pinned),
    archived: asBoolean(r.archived),
    useCount: asNumber(r.useCount),
    scannedAt: asString(r.scannedAt, now),
    createdAt: asString(r.createdAt, now),
    updatedAt: asString(r.updatedAt, now)
  };
}

export function cryptoRandomId(): string {
  try {
    const c = (globalThis as { crypto?: Crypto }).crypto;
    if (c && typeof c.randomUUID === "function") return c.randomUUID();
    if (c && typeof c.getRandomValues === "function") {
      const arr = new Uint8Array(16);
      c.getRandomValues(arr);
      return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
    }
  } catch {
    /* fallthrough */
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
