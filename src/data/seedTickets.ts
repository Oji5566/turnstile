import { TransitTicket } from "../types/ticket";
import { addDays, todayDateString } from "../utils/ticketStatus";
import { cryptoRandomId } from "../utils/sanitize";

function makeSeed(
  partial: Omit<
    TransitTicket,
    | "id"
    | "status"
    | "pinned"
    | "archived"
    | "useCount"
    | "scannedAt"
    | "createdAt"
    | "updatedAt"
    | "tags"
    | "notes"
    | "validFrom"
  > & {
    pinned?: boolean;
    tags?: string[];
    notes?: string;
    validFrom?: string;
  }
): TransitTicket {
  const now = new Date().toISOString();
  return {
    id: cryptoRandomId(),
    operator: partial.operator,
    title: partial.title,
    ticketType: partial.ticketType,
    mode: partial.mode,
    icon: partial.icon,
    color: partial.color,
    routeOrZone: partial.routeOrZone,
    origin: partial.origin,
    destination: partial.destination,
    validFrom: partial.validFrom ?? todayDateString(),
    validUntil: partial.validUntil,
    status: "Active",
    qrPayload: partial.qrPayload,
    notes: partial.notes ?? "",
    tags: partial.tags ?? [],
    pinned: partial.pinned ?? false,
    archived: false,
    useCount: 0,
    scannedAt: now,
    createdAt: now,
    updatedAt: now
  };
}

export function buildSeedTickets(): TransitTicket[] {
  const today = todayDateString();
  return [
    makeSeed({
      operator: "CityRail",
      title: "7-Day Metro Pass",
      ticketType: "Weekly Pass",
      mode: "Metro",
      icon: "Metro",
      color: "#54bbe1",
      routeOrZone: "Zones 1–2",
      origin: "",
      destination: "",
      validUntil: addDays(today, 6),
      qrPayload: "TST1:cityrail-weekly-zones-1-2-demo",
      notes: "Demo ticket for local wallet testing.",
      tags: ["metro", "weekly", "cityrail"],
      pinned: true
    }),
    makeSeed({
      operator: "NorthBus",
      title: "Regional Day Rider",
      ticketType: "Day Pass",
      mode: "Bus",
      icon: "Bus",
      color: "#8FD6C7",
      routeOrZone: "All regional routes",
      origin: "",
      destination: "",
      validUntil: today,
      qrPayload: "TST1:northbus-day-rider-demo",
      tags: ["bus", "day"]
    }),
    makeSeed({
      operator: "Regional Transit",
      title: "Commuter Flex 10",
      ticketType: "10-Trip Bundle",
      mode: "Train",
      icon: "Train",
      color: "#A8CBB7",
      routeOrZone: "Commuter Line",
      origin: "Brookfield",
      destination: "Central",
      validUntil: addDays(today, 30),
      qrPayload: "TST1:regional-flex-10-demo",
      tags: ["train", "commute"]
    }),
    makeSeed({
      operator: "Airport Express",
      title: "Return Ticket",
      ticketType: "Return",
      mode: "Train",
      icon: "HighSpeedRail",
      color: "#54bbe1",
      routeOrZone: "City ↔ Airport",
      origin: "Central",
      destination: "Airport Terminal 1",
      validUntil: addDays(today, 14),
      qrPayload: "TST1:airport-express-return-demo",
      tags: ["airport", "return"]
    }),
    makeSeed({
      operator: "Harbor Ferry",
      title: "Weekend Pass",
      ticketType: "Weekend Pass",
      mode: "Ferry",
      icon: "Ferry",
      color: "#F2D6BE",
      routeOrZone: "Inner Harbor",
      origin: "",
      destination: "",
      validUntil: addDays(today, 2),
      qrPayload: "TST1:harbor-ferry-weekend-demo",
      tags: ["ferry", "weekend"]
    }),
    makeSeed({
      operator: "OldTown Tram",
      title: "Day Ticket",
      ticketType: "Day Pass",
      mode: "Tram",
      icon: "Other",
      color: "#D9A08F",
      routeOrZone: "Heritage Loop",
      origin: "",
      destination: "",
      validUntil: addDays(today, -3),
      qrPayload: "TST1:oldtown-tram-day-demo",
      tags: ["tram", "heritage"]
    }),
    makeSeed({
      operator: "Metro Loop",
      title: "Single Ride",
      ticketType: "Single",
      mode: "Metro",
      icon: "Metro",
      color: "#6C7880",
      routeOrZone: "Inner Loop",
      origin: "",
      destination: "",
      validUntil: addDays(today, 1),
      qrPayload: "TST1:metro-loop-single-demo",
      tags: ["metro", "single"]
    }),
    makeSeed({
      operator: "Concert Shuttle",
      title: "Event QR",
      ticketType: "Event Shuttle",
      mode: "Shuttle",
      icon: "Entertainment",
      color: "#8FD6C7",
      routeOrZone: "Stadium Express",
      origin: "Downtown",
      destination: "Stadium",
      validUntil: addDays(today, 21),
      qrPayload: "TST1:concert-shuttle-event-demo",
      tags: ["event", "shuttle"]
    })
  ];
}
