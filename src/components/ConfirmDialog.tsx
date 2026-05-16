import { ReactNode, useEffect, useRef } from "react";
import { PillButton } from "./PillButton";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    // focus first focusable
    setTimeout(() => {
      const focusable = dialogRef.current?.querySelector<HTMLButtonElement>(
        "button, [tabindex]:not([tabindex='-1'])"
      );
      focusable?.focus();
    }, 10);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="dialog-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="dialog" ref={dialogRef}>
        <h2 id="dialog-title">{title}</h2>
        {body && <p>{body}</p>}
        <div className="actions">
          <PillButton variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </PillButton>
          <PillButton variant={destructive ? "danger" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </PillButton>
        </div>
      </div>
    </div>
  );
}
