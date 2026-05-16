import { TransitTicket } from "../types/ticket";
import { getTicketIcon } from "./icons/ticketIcons";
import { PinIcon, QrIcon } from "./icons";
import { StatusBadge } from "./StatusBadge";
import { computeStatus } from "../utils/ticketStatus";
import { formatDate } from "../utils/formatTicket";

export interface TicketCardProps {
  ticket: TransitTicket;
  onOpen: (id: string) => void;
}

export function TicketCard({ ticket, onOpen }: TicketCardProps) {
  const status = computeStatus(ticket);
  const Icon = getTicketIcon(ticket.icon);
  const expired = status === "Expired" || status === "Archived";

  return (
    <button
      type="button"
      className={`ticket-card${expired ? " ticket-card--expired" : ""}`}
      onClick={() => onOpen(ticket.id)}
      aria-label={`Open ticket: ${ticket.operator || "ticket"} — ${ticket.title}`}
    >
      <div className="accent" style={{ background: ticket.color }} aria-hidden="true">
        <Icon size={28} />
      </div>
      <div className="body">
        <div className="row-top">
          <span className="operator">{ticket.operator || "—"}</span>
          {ticket.pinned && (
            <span className="pin-indicator" aria-label="Pinned">
              <PinIcon size={16} />
            </span>
          )}
        </div>
        <div className="title">{ticket.title || "Untitled ticket"}</div>
        <div className="meta">
          {ticket.routeOrZone || ticket.ticketType || ticket.mode}
          {ticket.validUntil ? ` · valid until ${formatDate(ticket.validUntil)}` : ""}
        </div>
        <div className="row-bottom">
          <StatusBadge status={status} />
          <span className="qr-mini" aria-hidden="true">
            <QrIcon size={20} />
          </span>
        </div>
      </div>
    </button>
  );
}
