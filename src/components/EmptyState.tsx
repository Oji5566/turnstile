import { ReactNode } from "react";
import { WalletIcon } from "./icons";

export interface EmptyStateProps {
  title: string;
  body?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

export function EmptyState({ title, body, icon, actions }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="icon" aria-hidden="true">
        {icon ?? <WalletIcon size={28} />}
      </div>
      <h3>{title}</h3>
      {body && <p>{body}</p>}
      {actions && <div className="actions">{actions}</div>}
    </div>
  );
}
