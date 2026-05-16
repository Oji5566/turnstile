import { ReactNode } from "react";

export function SectionHeader({ title, meta }: { title: string; meta?: ReactNode }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {meta && <div className="section-meta">{meta}</div>}
    </div>
  );
}
