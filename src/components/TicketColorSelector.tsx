import { TICKET_COLORS } from "../types/ticket";
import { CheckIcon } from "./icons";

export interface TicketColorSelectorProps {
  value: string;
  onChange: (v: string) => void;
}

export function TicketColorSelector({ value, onChange }: TicketColorSelectorProps) {
  return (
    <div className="color-swatches" role="radiogroup" aria-label="Ticket accent color">
      {TICKET_COLORS.map((c) => {
        const selected = c.value === value;
        return (
          <button
            key={c.value}
            type="button"
            className="swatch"
            aria-pressed={selected}
            aria-label={c.name}
            title={c.name}
            style={{ background: c.value }}
            onClick={() => onChange(c.value)}
          >
            {selected && <CheckIcon size={18} title={`${c.name} selected`} />}
          </button>
        );
      })}
    </div>
  );
}
