import { FormEvent, useState } from "react";
import {
  DEFAULT_COLOR,
  DEFAULT_ICON,
  TicketIcon,
  TRANSIT_MODES,
  TransitMode,
  TransitTicket
} from "../types/ticket";
import { PillButton } from "./PillButton";
import { TicketColorSelector } from "./TicketColorSelector";
import { TicketIconSelector } from "./TicketIconSelector";
import { DateQuickOptions } from "./DateQuickOptions";
import { todayDateString } from "../utils/ticketStatus";

export interface TicketFormValues {
  operator: string;
  title: string;
  ticketType: string;
  mode: TransitMode;
  icon: TicketIcon;
  color: string;
  routeOrZone: string;
  origin: string;
  destination: string;
  validFrom: string;
  validUntil: string;
  notes: string;
  tags: string[];
}

function defaultsFor(partial?: Partial<TransitTicket>): TicketFormValues {
  return {
    operator: partial?.operator ?? "",
    title: partial?.title ?? "",
    ticketType: partial?.ticketType ?? "",
    mode: (partial?.mode as TransitMode) ?? "Other",
    icon: (partial?.icon as TicketIcon) ?? DEFAULT_ICON,
    color: partial?.color ?? DEFAULT_COLOR,
    routeOrZone: partial?.routeOrZone ?? "",
    origin: partial?.origin ?? "",
    destination: partial?.destination ?? "",
    validFrom: partial?.validFrom ?? todayDateString(),
    validUntil: partial?.validUntil ?? "",
    notes: partial?.notes ?? "",
    tags: partial?.tags ?? []
  };
}

export interface TicketFormProps {
  initial?: Partial<TransitTicket>;
  submitLabel?: string;
  onSubmit: (values: TicketFormValues) => void;
  onCancel?: () => void;
  payloadPreview?: string;
}

export function TicketForm({
  initial,
  submitLabel = "Save ticket",
  onSubmit,
  onCancel,
  payloadPreview
}: TicketFormProps) {
  const [values, setValues] = useState<TicketFormValues>(() => defaultsFor(initial));
  const [tagDraft, setTagDraft] = useState("");

  function set<K extends keyof TicketFormValues>(key: K, value: TicketFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handle(e: FormEvent) {
    e.preventDefault();
    const cleanedTags = [...new Set(values.tags.map((t) => t.trim()).filter(Boolean))];
    onSubmit({ ...values, tags: cleanedTags });
  }

  function addTagFromDraft() {
    const t = tagDraft.trim();
    if (!t) return;
    setValues((v) => ({ ...v, tags: [...v.tags, t] }));
    setTagDraft("");
  }

  return (
    <form className="form-stack" onSubmit={handle}>
      {payloadPreview && (
        <div className="banner banner--info" role="status">
          QR payload captured. It will be stored locally as text.
        </div>
      )}

      <div>
        <label className="field-label" htmlFor="f-operator">
          Operator
        </label>
        <input
          id="f-operator"
          className="text-input"
          value={values.operator}
          onChange={(e) => set("operator", e.target.value)}
          placeholder="e.g. CityRail"
        />
      </div>

      <div>
        <label className="field-label" htmlFor="f-title">
          Ticket name
        </label>
        <input
          id="f-title"
          className="text-input"
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="e.g. 7-Day Metro Pass"
          required
        />
      </div>

      <div className="form-row">
        <div>
          <label className="field-label" htmlFor="f-type">
            Ticket type
          </label>
          <input
            id="f-type"
            className="text-input"
            value={values.ticketType}
            onChange={(e) => set("ticketType", e.target.value)}
            placeholder="Weekly, Day, Single…"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="f-mode">
            Transit mode
          </label>
          <select
            id="f-mode"
            className="select-input"
            value={values.mode}
            onChange={(e) => set("mode", e.target.value as TransitMode)}
          >
            {TRANSIT_MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="field-label">Ticket icon</label>
        <TicketIconSelector value={values.icon} onChange={(v) => set("icon", v)} />
      </div>

      <div>
        <label className="field-label">Ticket accent color</label>
        <TicketColorSelector value={values.color} onChange={(v) => set("color", v)} />
      </div>

      <div>
        <label className="field-label" htmlFor="f-route">
          Route or zone
        </label>
        <input
          id="f-route"
          className="text-input"
          value={values.routeOrZone}
          onChange={(e) => set("routeOrZone", e.target.value)}
          placeholder="Zones 1–2, Line A, …"
        />
      </div>

      <div className="form-row">
        <div>
          <label className="field-label" htmlFor="f-origin">
            Origin
          </label>
          <input
            id="f-origin"
            className="text-input"
            value={values.origin}
            onChange={(e) => set("origin", e.target.value)}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="f-destination">
            Destination
          </label>
          <input
            id="f-destination"
            className="text-input"
            value={values.destination}
            onChange={(e) => set("destination", e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label className="field-label" htmlFor="f-valid-from">
            Valid from
          </label>
          <input
            id="f-valid-from"
            type="date"
            className="text-input"
            value={values.validFrom}
            onChange={(e) => set("validFrom", e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">Valid until</label>
          <DateQuickOptions value={values.validUntil} onChange={(v) => set("validUntil", v)} />
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="f-notes">
          Notes
        </label>
        <textarea
          id="f-notes"
          className="textarea-input"
          value={values.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Anything you want to remember about this ticket…"
        />
      </div>

      <div>
        <label className="field-label" htmlFor="f-tags">
          Tags
        </label>
        <div className="row" style={{ gap: 8 }}>
          <input
            id="f-tags"
            className="text-input"
            value={tagDraft}
            onChange={(e) => setTagDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTagFromDraft();
              }
            }}
            placeholder="Add a tag and press Enter"
          />
          <PillButton variant="soft" onClick={addTagFromDraft}>
            Add
          </PillButton>
        </div>
        {values.tags.length > 0 && (
          <div className="tag-list" style={{ marginTop: 8 }}>
            {values.tags.map((t, idx) => (
              <button
                key={t + idx}
                type="button"
                className="tag-chip"
                onClick={() => setValues((v) => ({ ...v, tags: v.tags.filter((_, i) => i !== idx) }))}
                aria-label={`Remove tag ${t}`}
              >
                {t} ×
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="row" style={{ gap: 10, marginTop: 8 }}>
        {onCancel && (
          <PillButton variant="secondary" block onClick={onCancel} type="button">
            Cancel
          </PillButton>
        )}
        <PillButton variant="primary" block type="submit">
          {submitLabel}
        </PillButton>
      </div>
    </form>
  );
}
