import { useEffect, useState } from "react";
import { TransitTicket } from "../types/ticket";
import { PillButton } from "./PillButton";
import { IconButton } from "./IconButton";
import { QrDisplay } from "./QrDisplay";
import { StatusBadge } from "./StatusBadge";
import { ChevronLeftIcon, DeleteIcon, EditIcon, ExpiredIcon, PinIcon, PresentIcon } from "./icons";
import { getTicketIcon } from "./icons/ticketIcons";
import { computeStatus } from "../utils/ticketStatus";
import { formatDate, formatDateTime } from "../utils/formatTicket";
import { TicketForm, TicketFormValues } from "./TicketForm";
import { ConfirmDialog } from "./ConfirmDialog";
import { previewPayload } from "../utils/qrPayload";

export interface TicketDetailProps {
  ticket: TransitTicket;
  onBack: () => void;
  onUpdate: (id: string, patch: Partial<TransitTicket>) => void;
  onDelete: (id: string) => void;
  onPresent: (id: string) => void;
  onIncrementUseCount: (id: string) => void;
}

export function TicketDetail({
  ticket,
  onBack,
  onUpdate,
  onDelete,
  onPresent,
  onIncrementUseCount
}: TicketDetailProps) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    // Increment use count on open (once per mount per ticket id)
    onIncrementUseCount(ticket.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket.id]);

  const status = computeStatus(ticket);
  const Icon = getTicketIcon(ticket.icon);

  if (editing) {
    return (
      <div className="col col--gap-lg">
        <div className="detail-header">
          <IconButton label="Back" onClick={() => setEditing(false)}>
            <ChevronLeftIcon size={22} />
          </IconButton>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Edit ticket</h1>
          <span style={{ width: 44 }} />
        </div>
        <TicketForm
          initial={ticket}
          submitLabel="Save changes"
          onSubmit={(values: TicketFormValues) => {
            onUpdate(ticket.id, values);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="col col--gap-lg">
      <div className="detail-header">
        <IconButton label="Back to wallet" onClick={onBack}>
          <ChevronLeftIcon size={22} />
        </IconButton>
        <span className="muted" style={{ fontSize: 13, fontWeight: 600 }}>
          Ticket
        </span>
        <IconButton label="Edit ticket" onClick={() => setEditing(true)}>
          <EditIcon size={20} />
        </IconButton>
      </div>

      <div className="detail-hero" style={{ background: ticket.color }}>
        <div className="row row--between">
          <span className="operator">{ticket.operator || "Untitled operator"}</span>
          <Icon size={28} aria-hidden="true" />
        </div>
        <h1>{ticket.title || "Untitled ticket"}</h1>
        <div className="muted" style={{ color: "rgba(255,255,255,0.9)" }}>
          {ticket.routeOrZone || ticket.ticketType || ticket.mode}
        </div>
        <div className="meta">
          <StatusBadge status={status} />
          {ticket.pinned && (
            <span className="status-badge" style={{ background: "rgba(255,255,255,0.18)", color: "#fff" }}>
              <PinIcon size={12} /> Pinned
            </span>
          )}
        </div>
      </div>

      <div className="qr-display">
        <QrDisplay payload={ticket.qrPayload} ariaLabel={`QR code for ${ticket.title || "ticket"}`} />
        <p className="qr-caption">
          Stored locally. QR payload preserved exactly as saved. Follow your operator’s ticket rules.
        </p>
      </div>

      <div className="detail-actions">
        <PillButton
          variant="primary"
          block
          iconLeft={<PresentIcon size={18} />}
          onClick={() => onPresent(ticket.id)}
        >
          Present Ticket
        </PillButton>
        <PillButton variant="secondary" onClick={() => setEditing(true)} iconLeft={<EditIcon size={18} />}>
          Edit
        </PillButton>
        <PillButton
          variant="soft"
          onClick={() => onUpdate(ticket.id, { pinned: !ticket.pinned })}
          iconLeft={<PinIcon size={18} />}
        >
          {ticket.pinned ? "Unpin" : "Pin"}
        </PillButton>
        <PillButton
          variant="secondary"
          onClick={() => onUpdate(ticket.id, { status: "Expired" })}
          iconLeft={<ExpiredIcon size={18} />}
        >
          Mark expired
        </PillButton>
        <PillButton
          variant="danger"
          onClick={() => setConfirmDelete(true)}
          iconLeft={<DeleteIcon size={18} />}
        >
          Delete
        </PillButton>
      </div>

      <section>
        <dl>
          <DetailRow label="Operator" value={ticket.operator} />
          <DetailRow label="Ticket type" value={ticket.ticketType} />
          <DetailRow label="Mode" value={ticket.mode} />
          <DetailRow label="Route / Zone" value={ticket.routeOrZone} />
          <DetailRow label="Origin → Destination" value={originDestination(ticket)} />
          <DetailRow label="Valid from" value={ticket.validFrom ? formatDate(ticket.validFrom) : ""} />
          <DetailRow
            label="Valid until"
            value={ticket.validUntil ? formatDate(ticket.validUntil) : ""}
          />
          <DetailRow label="Saved" value={formatDateTime(ticket.scannedAt || ticket.createdAt)} />
          <DetailRow label="Times opened" value={String(ticket.useCount || 0)} />
          {ticket.notes && <DetailRow label="Notes" value={ticket.notes} />}
          {ticket.tags && ticket.tags.length > 0 && (
            <DetailRow label="Tags" value={ticket.tags.join(", ")} />
          )}
          <DetailRow label="QR payload" value={previewPayload(ticket.qrPayload, 120)} mono />
        </dl>
      </section>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this ticket?"
        body="This removes the ticket from your local wallet. You can re-add it by scanning again."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          setConfirmDelete(false);
          onDelete(ticket.id);
          onBack();
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}

function originDestination(t: TransitTicket): string {
  if (!t.origin && !t.destination) return "";
  return `${t.origin || "—"} → ${t.destination || "—"}`;
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  if (!value) return null;
  return (
    <div className="detail-section">
      <dt>{label}</dt>
      <dd className={mono ? "kbd" : ""}>{value}</dd>
    </div>
  );
}
