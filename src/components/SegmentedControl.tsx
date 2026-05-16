import { KeyboardEvent, useRef } from "react";

export interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (next: T) => void;
  options: { value: T; label: string }[];
  ariaLabel?: string;
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  ariaLabel = "Segmented control"
}: SegmentedControlProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKey(e: KeyboardEvent<HTMLButtonElement>, idx: number) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = (idx + 1) % options.length;
      refs.current[next]?.focus();
      onChange(options[next].value);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = (idx - 1 + options.length) % options.length;
      refs.current[next]?.focus();
      onChange(options[next].value);
    }
  }

  return (
    <div role="tablist" aria-label={ariaLabel} className="segmented">
      {options.map((opt, idx) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            ref={(el) => (refs.current[idx] = el)}
            role="tab"
            type="button"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => handleKey(e, idx)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
