import { TicketStatus, TransitTicket } from "../types/ticket";

const DAY = 24 * 60 * 60 * 1000;

export function todayDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return todayFromDate(d);
}

function todayFromDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}

/** Compute live status from validUntil, respecting archive flag and existing archive status. */
export function computeStatus(ticket: TransitTicket): TicketStatus {
  if (ticket.archived || ticket.status === "Archived") return "Archived";
  if (!ticket.validUntil) return ticket.status === "Expired" ? "Expired" : "Active";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const until = new Date(ticket.validUntil + "T23:59:59");

  const diffMs = until.getTime() - today.getTime();

  if (diffMs < 0) return "Expired";
  if (diffMs < DAY) return "Today";
  if (diffMs <= 2 * DAY) return "Expiring Soon";
  return "Active";
}

export function isExpired(ticket: TransitTicket): boolean {
  return computeStatus(ticket) === "Expired";
}

export function isCurrent(ticket: TransitTicket): boolean {
  const s = computeStatus(ticket);
  return s === "Active" || s === "Today" || s === "Expiring Soon";
}

export function statusTone(status: TicketStatus): "primary" | "success" | "warning" | "danger" | "muted" {
  switch (status) {
    case "Active":
      return "success";
    case "Today":
      return "primary";
    case "Expiring Soon":
      return "warning";
    case "Expired":
      return "danger";
    case "Archived":
    default:
      return "muted";
  }
}
