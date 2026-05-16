import { TransitTicket } from "../types/ticket";
import { computeStatus } from "./ticketStatus";

export function searchTickets(tickets: TransitTicket[], query: string): TransitTicket[] {
  const q = query.trim().toLowerCase();
  if (!q) return tickets;
  return tickets.filter((t) => {
    const status = computeStatus(t);
    const haystack = [
      t.operator,
      t.title,
      t.ticketType,
      t.mode,
      t.routeOrZone,
      t.origin,
      t.destination,
      t.notes,
      status,
      ...(t.tags || [])
    ]
      .join(" \u0000 ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
