import { ButtonHTMLAttributes, ReactNode } from "react";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: "default" | "primary" | "ghost";
  children: ReactNode;
}

export function IconButton({
  label,
  variant = "default",
  className,
  children,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={[
        "icon-button",
        variant === "primary" ? "icon-button--primary" : "",
        variant === "ghost" ? "icon-button--ghost" : "",
        className ?? ""
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
