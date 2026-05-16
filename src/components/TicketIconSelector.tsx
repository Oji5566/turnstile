import { TicketIcon } from "../types/ticket";
import { TICKET_ICONS } from "./icons/ticketIcons";

export interface TicketIconSelectorProps {
  value: TicketIcon;
  onChange: (v: TicketIcon) => void;
}

export function TicketIconSelector({ value, onChange }: TicketIconSelectorProps) {
  return (
    <div className="icon-grid" role="radiogroup" aria-label="Ticket icon">
      {TICKET_ICONS.map(({ value: v, label, Component }) => {
        const selected = v === value;
        return (
          <button
            key={v}
            type="button"
            className="icon-choice"
            aria-pressed={selected}
            aria-label={label}
            onClick={() => onChange(v)}
          >
            <Component size={22} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
