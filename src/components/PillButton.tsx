import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "soft" | "danger";

export interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  block?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export function PillButton({
  variant = "primary",
  block,
  iconLeft,
  iconRight,
  className,
  children,
  type = "button",
  ...rest
}: PillButtonProps) {
  return (
    <button
      type={type}
      className={[
        "pill-button",
        `pill-button--${variant}`,
        block ? "pill-button--block" : "",
        className ?? ""
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </button>
  );
}
