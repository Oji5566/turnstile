import { useEffect } from "react";
import { TransitTicket } from "../types/ticket";
import { PillButton } from "./PillButton";
import { QrDisplay } from "./QrDisplay";
import { StatusBadge } from "./StatusBadge";
import { CloseIcon } from "./icons";
import { getTicketIcon } from "./icons/ticketIcons";
import { computeStatus } from "../utils/ticketStatus";
import { formatDate } from "../utils/formatTicket";

export interface PresentTicketViewProps {
  ticket: TransitTicket;
  onExit: () => void;
}

export function PresentTicketView({ ticket, onExit }: PresentTicketViewProps) {
  const status = computeStatus(ticket);
  const Icon = getTicketIcon(ticket.icon);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onExit]);

  return (
    <div className="present-mode" role="dialog" aria-modal="true" aria-label="Ticket presentation">
      <div className="exit">
        <PillButton variant="secondary" onClick={onExit} iconLeft={<CloseIcon size={18} />}>
          Exit
        </PillButton>
      </div>
      <div className="card">
        <div className="operator">{ticket.operator || "Ticket"}</div>
        <div className="title">{ticket.title || "Untitled ticket"}</div>
        <div className="badges">
          <StatusBadge status={status} />
          <span
            className="status-badge"
            style={{ background: ticket.color, color: "#fff", borderColor: "transparent" }}
          >
            <Icon size={14} aria-hidden="true" /> {ticket.mode}
          </span>
        </div>
        <div className="qr">
          <QrDisplay payload={ticket.qrPayload} size={420} ariaLabel="Ticket QR code for presentation" />
        </div>
        <div className="meta">
          {ticket.routeOrZone && <div>{ticket.routeOrZone}</div>}
          {ticket.validUntil && <div>Valid until {formatDate(ticket.validUntil)}</div>}
        </div>
      </div>
    </div>
  );
}
