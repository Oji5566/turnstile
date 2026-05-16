import { addDays, todayDateString } from "../utils/ticketStatus";

export interface DateQuickOptionsProps {
  value: string;
  onChange: (date: string) => void;
}

export function DateQuickOptions({ value, onChange }: DateQuickOptionsProps) {
  const today = todayDateString();
  const opts: { label: string; value: string }[] = [
    { label: "Today", value: today },
    { label: "In 7 days", value: addDays(today, 7) },
    { label: "In 30 days", value: addDays(today, 30) }
  ];
  return (
    <div className="col" style={{ gap: 10 }}>
      <div className="quick-options" role="group" aria-label="Quick expiry options">
        {opts.map((o) => (
          <button
            key={o.label}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
      <input
        type="date"
        className="text-input"
        value={value}
        aria-label="Custom valid-until date"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
