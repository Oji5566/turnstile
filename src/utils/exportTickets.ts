import { TransitTicket } from "../types/ticket";
import { computeStatus } from "./ticketStatus";
import { sanitizeTicket } from "./sanitize";

const SCHEMA = "turnstile.v1";

export interface ExportBundle {
  schema: typeof SCHEMA;
  exportedAt: string;
  tickets: TransitTicket[];
}

export function toExportBundle(tickets: TransitTicket[]): ExportBundle {
  return {
    schema: SCHEMA,
    exportedAt: new Date().toISOString(),
    tickets
  };
}

export function ticketsToJson(tickets: TransitTicket[]): string {
  return JSON.stringify(toExportBundle(tickets), null, 2);
}

export function ticketsFromJson(raw: string): TransitTicket[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("File is not valid JSON.");
  }
  let list: unknown[] = [];
  if (Array.isArray(parsed)) {
    list = parsed;
  } else if (parsed && typeof parsed === "object") {
    const obj = parsed as Record<string, unknown>;
    if (Array.isArray(obj.tickets)) list = obj.tickets as unknown[];
  }
  const tickets: TransitTicket[] = [];
  for (const item of list) {
    const t = sanitizeTicket(item);
    if (t) tickets.push(t);
  }
  return tickets;
}

export function ticketsToMarkdown(tickets: TransitTicket[]): string {
  if (tickets.length === 0) {
    return "# Turnstile Wallet\n\nNo tickets to export.\n";
  }
  return tickets.map(ticketToMarkdown).join("\n\n---\n\n");
}

export function ticketToMarkdown(t: TransitTicket): string {
  const status = computeStatus(t);
  const lines: string[] = [];
  const heading =
    t.operator && t.title ? `${t.operator} — ${t.title}` : t.title || t.operator || "Untitled ticket";
  lines.push(`# ${heading}`);
  lines.push("");
  lines.push(`Operator: ${t.operator || "—"}`);
  if (t.ticketType) lines.push(`Type: ${t.ticketType}`);
  if (t.mode) lines.push(`Mode: ${t.mode}`);
  if (t.routeOrZone) lines.push(`Route / Zone: ${t.routeOrZone}`);
  if (t.origin || t.destination) {
    lines.push(`Origin → Destination: ${t.origin || "—"} → ${t.destination || "—"}`);
  }
  lines.push(`Status: ${status}`);
  if (t.validFrom) lines.push(`Valid From: ${t.validFrom}`);
  if (t.validUntil) lines.push(`Valid Until: ${t.validUntil}`);
  if (t.notes) {
    lines.push("");
    lines.push("## Notes");
    lines.push("");
    lines.push(t.notes);
  }
  lines.push("");
  lines.push("## QR Payload");
  lines.push("");
  lines.push("Stored locally. Payload preserved exactly as saved.");
  if (t.qrPayload) {
    lines.push("");
    lines.push("```");
    lines.push(t.qrPayload);
    lines.push("```");
  }
  if (t.tags && t.tags.length > 0) {
    lines.push("");
    lines.push("## Tags");
    lines.push("");
    lines.push(t.tags.join(", "));
  }
  return lines.join("\n");
}

export function downloadTextFile(filename: string, contents: string, mime = "application/octet-stream") {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
