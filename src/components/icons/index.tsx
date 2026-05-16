import { baseProps, IconProps } from "./iconBase";

export function BusIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <rect x="4" y="4" width="16" height="14" rx="3" />
      <path d="M4 11h16" />
      <path d="M4 8h16" />
      <circle cx="8" cy="18" r="1.2" />
      <circle cx="16" cy="18" r="1.2" />
      <path d="M7 18v2" />
      <path d="M17 18v2" />
    </svg>
  );
}

export function TrainIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <rect x="5" y="3" width="14" height="14" rx="3" />
      <path d="M5 10h14" />
      <circle cx="9" cy="13.5" r="1" />
      <circle cx="15" cy="13.5" r="1" />
      <path d="M8 17l-2 3" />
      <path d="M16 17l2 3" />
    </svg>
  );
}

export function MetroIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <rect x="4" y="3" width="16" height="15" rx="4" />
      <path d="M4 11h16" />
      <circle cx="9" cy="14.5" r="1" />
      <circle cx="15" cy="14.5" r="1" />
      <path d="M9 6h6" />
      <path d="M7 18l-1 3" />
      <path d="M17 18l1 3" />
    </svg>
  );
}

export function HighSpeedRailIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <path d="M3 14c4-7 11-9 18-6l-2 3H5z" />
      <path d="M5 17h14" />
      <circle cx="9" cy="14.5" r="0.9" />
      <circle cx="15" cy="14.5" r="0.9" />
    </svg>
  );
}

export function FerryIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <path d="M3 17c1 1.5 2.5 1.5 4 0s2.5-1.5 4 0 2.5 1.5 4 0 2.5-1.5 4 0" />
      <path d="M4 14l1-3h14l1 3" />
      <path d="M9 11V8h6v3" />
      <path d="M12 8V4" />
    </svg>
  );
}

export function EntertainmentIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <path d="M4 8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v2a2 2 0 0 0 0 4v2a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-2a2 2 0 0 0 0-4z" />
      <path d="M12 6v2" />
      <path d="M12 11v2" />
      <path d="M12 16v2" />
    </svg>
  );
}

export function TicketIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z" />
      <path d="M14 6v12" strokeDasharray="2 2" />
    </svg>
  );
}

export function OtherIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function WalletIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <rect x="3" y="6" width="18" height="13" rx="3" />
      <path d="M3 10h18" />
      <circle cx="17" cy="14.5" r="1.2" />
    </svg>
  );
}

export function ScanIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <path d="M4 8V6a2 2 0 0 1 2-2h2" />
      <path d="M16 4h2a2 2 0 0 1 2 2v2" />
      <path d="M20 16v2a2 2 0 0 1-2 2h-2" />
      <path d="M8 20H6a2 2 0 0 1-2-2v-2" />
      <path d="M4 12h16" />
    </svg>
  );
}

export function SettingsIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  );
}

export function SearchIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function QrIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <path d="M14 14h3" />
      <path d="M14 17h2" />
      <path d="M19 14v3" />
      <path d="M17 19h4" />
      <path d="M14 21h2" />
      <path d="M19 19v2" />
    </svg>
  );
}

export function EditIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <path d="M4 20h4l10-10-4-4L4 16z" />
      <path d="M14 6l4 4" />
    </svg>
  );
}

export function DeleteIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <path d="M4 7h16" />
      <path d="M10 7V4h4v3" />
      <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

export function PinIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <path d="M12 3l3 4 4 1-3 3 1 5-5-2-5 2 1-5-3-3 4-1z" />
    </svg>
  );
}

export function ActiveIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  );
}

export function ExpiredIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function ChevronLeftIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <path d="M14 6l-6 6 6 6" />
    </svg>
  );
}

export function PlusIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function CloseIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

export function CheckIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

export function UploadIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <path d="M12 4v12" />
      <path d="M7 9l5-5 5 5" />
      <path d="M5 20h14" />
    </svg>
  );
}

export function ClipboardIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <rect x="6" y="4" width="12" height="17" rx="3" />
      <rect x="9" y="2" width="6" height="4" rx="1.5" />
      <path d="M9 11h6" />
      <path d="M9 15h6" />
    </svg>
  );
}

export function PresentIcon(p: IconProps) {
  return (
    <svg {...baseProps(p)}>
      {p.title && <title>{p.title}</title>}
      <rect x="3" y="5" width="18" height="12" rx="3" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  );
}
