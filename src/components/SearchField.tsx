import { InputHTMLAttributes } from "react";
import { SearchIcon } from "./icons";

export interface SearchFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function SearchField({ label = "Search", className, ...rest }: SearchFieldProps) {
  return (
    <div className={`search-field ${className ?? ""}`}>
      <span className="search-icon" aria-hidden="true">
        <SearchIcon size={18} />
      </span>
      <input type="search" className="text-input" aria-label={label} {...rest} />
    </div>
  );
}
