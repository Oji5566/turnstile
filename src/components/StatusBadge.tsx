import { TicketStatus } from "../types/ticket";
import { statusTone } from "../utils/ticketStatus";

export function StatusBadge({ status }: { status: TicketStatus }) {
  const tone = statusTone(status);
  return <span className={`status-badge status-badge--${tone}`}>{status}</span>;
}
