import { SVGProps } from "react";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  size?: number;
  title?: string;
}

export function baseProps({ size = 24, title, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    role: title ? ("img" as const) : ("presentation" as const),
    "aria-hidden": title ? undefined : true,
    "aria-label": title,
    ...rest
  };
}
