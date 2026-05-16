export type TicketIcon =
  | "Bus"
  | "Train"
  | "Metro"
  | "HighSpeedRail"
  | "Ferry"
  | "Entertainment"
  | "Other";

export type TicketStatus =
  | "Active"
  | "Today"
  | "Expiring Soon"
  | "Expired"
  | "Archived";

export type TransitMode =
  | "Bus"
  | "Train"
  | "Metro"
  | "HighSpeedRail"
  | "Ferry"
  | "Tram"
  | "Shuttle"
  | "Other";

export interface TransitTicket {
  id: string;
  operator: string;
  title: string;
  ticketType: string;
  mode: TransitMode;
  icon: TicketIcon;
  color: string;
  routeOrZone: string;
  origin: string;
  destination: string;
  validFrom: string; // ISO date (yyyy-mm-dd)
  validUntil: string; // ISO date (yyyy-mm-dd)
  status: TicketStatus;
  qrPayload: string;
  notes: string;
  tags: string[];
  pinned: boolean;
  archived: boolean;
  useCount: number;
  scannedAt: string; // ISO datetime
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface AppSettings {
  defaultSort: SortKey;
  appearance: "system" | "light" | "dark";
}

export type SortKey =
  | "expiry"
  | "recent"
  | "used"
  | "operator"
  | "pinned";

export const ALLOWED_ICONS: TicketIcon[] = [
  "Bus",
  "Train",
  "Metro",
  "HighSpeedRail",
  "Ferry",
  "Entertainment",
  "Other"
];

export interface TicketColor {
  name: string;
  value: string;
}

export const TICKET_COLORS: TicketColor[] = [
  { name: "Turnstile Blue", value: "#54bbe1" },
  { name: "Seafoam", value: "#8FD6C7" },
  { name: "Sage", value: "#A8CBB7" },
  { name: "Sand", value: "#F2D6BE" },
  { name: "Clay", value: "#D9A08F" },
  { name: "Graphite", value: "#6C7880" }
];

export const ALLOWED_COLORS = TICKET_COLORS.map((c) => c.value);

export const DEFAULT_COLOR = "#54bbe1";
export const DEFAULT_ICON: TicketIcon = "Other";

export const TRANSIT_MODES: TransitMode[] = [
  "Bus",
  "Train",
  "Metro",
  "HighSpeedRail",
  "Ferry",
  "Tram",
  "Shuttle",
  "Other"
];
