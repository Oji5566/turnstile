import { SortKey, TransitTicket } from "../types/ticket";

export function sortTickets(tickets: TransitTicket[], key: SortKey): TransitTicket[] {
  const arr = [...tickets];
  switch (key) {
    case "expiry":
      arr.sort((a, b) => safeDate(a.validUntil) - safeDate(b.validUntil));
      break;
    case "recent":
      arr.sort((a, b) => safeDate(b.createdAt) - safeDate(a.createdAt));
      break;
    case "used":
      arr.sort((a, b) => (b.useCount || 0) - (a.useCount || 0));
      break;
    case "operator":
      arr.sort((a, b) => a.operator.localeCompare(b.operator, undefined, { sensitivity: "base" }));
      break;
    case "pinned":
      arr.sort((a, b) => Number(b.pinned) - Number(a.pinned));
      break;
  }
  return arr;
}

function safeDate(v: string): number {
  if (!v) return Number.POSITIVE_INFINITY;
  const t = Date.parse(v);
  return Number.isFinite(t) ? t : Number.POSITIVE_INFINITY;
}

export function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso.length === 10 ? iso + "T00:00:00" : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function formatDateTime(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
