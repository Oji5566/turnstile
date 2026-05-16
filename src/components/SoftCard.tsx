import { HTMLAttributes, ReactNode } from "react";

export interface SoftCardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "default" | "muted" | "inset";
  children: ReactNode;
}

export function SoftCard({ tone = "default", className, children, ...rest }: SoftCardProps) {
  return (
    <div
      className={[
        "soft-card",
        tone === "muted" ? "soft-card--muted" : "",
        tone === "inset" ? "soft-card--inset" : "",
        className ?? ""
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}
