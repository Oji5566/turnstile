import { useMemo, useState } from "react";
import { EmptyState } from "../components/EmptyState";
import { SearchField } from "../components/SearchField";
import { SectionHeader } from "../components/SectionHeader";
import { SegmentedControl } from "../components/SegmentedControl";
import { TicketCard } from "../components/TicketCard";
import { PillButton } from "../components/PillButton";
import { PlusIcon, ScanIcon, WalletIcon } from "../components/icons";
import { SortKey, TransitTicket } from "../types/ticket";
import { searchTickets } from "../utils/searchTickets";
import { sortTickets } from "../utils/formatTicket";
import { isCurrent, isExpired } from "../utils/ticketStatus";

export type WalletSegment = "current" | "expired";

export interface WalletScreenProps {
  tickets: TransitTicket[];
  defaultSort: SortKey;
  onOpenTicket: (id: string) => void;
  onGoScan: () => void;
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "expiry", label: "By expiry" },
  { value: "recent", label: "Recently added" },
  { value: "used", label: "Recently used" },
  { value: "operator", label: "Operator A–Z" },
  { value: "pinned", label: "Pinned first" }
];

export function WalletScreen({ tickets, defaultSort, onOpenTicket, onGoScan }: WalletScreenProps) {
  const [segment, setSegment] = useState<WalletSegment>("current");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>(defaultSort);

  const filtered = useMemo(() => {
    const searched = searchTickets(tickets, query);
    return searched.filter((t) => (segment === "current" ? isCurrent(t) : isExpired(t) || t.archived));
  }, [tickets, query, segment]);

  const sorted = useMemo(() => sortTickets(filtered, sortKey), [filtered, sortKey]);

  const pinned = sorted.filter((t) => t.pinned);
  const unpinned = sorted.filter((t) => !t.pinned);

  const isSearching = query.trim().length > 0;
  const walletIsEmpty = tickets.length === 0;

  return (
    <div className="col col--gap-lg">
      <header>
        <h1 className="app-title">Turnstile</h1>
        <p className="app-tagline">A simple, reliable holder for your paper transit tickets.</p>
      </header>

      <SearchField
        placeholder="Search operator, route, zone..."
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
      />

      <SegmentedControl<WalletSegment>
        value={segment}
        onChange={setSegment}
        options={[
          { value: "current", label: "Current" },
          { value: "expired", label: "Expired" }
        ]}
        ariaLabel="Filter tickets by status"
      />

      <div className="row row--between" style={{ marginTop: 4 }}>
        <label className="muted" style={{ fontSize: 13, fontWeight: 600 }}>
          Sort
        </label>
        <select
          className="select-input"
          style={{ width: "auto", minHeight: 40, padding: "8px 14px", borderRadius: 999 }}
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          aria-label="Sort tickets"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {walletIsEmpty ? (
        <EmptyState
          icon={<WalletIcon size={28} />}
          title="No tickets saved yet."
          body="Scan a paper ticket or paste a QR payload to keep it safely in your local wallet."
          actions={
            <>
              <PillButton variant="primary" onClick={onGoScan} iconLeft={<ScanIcon size={18} />}>
                Scan Ticket
              </PillButton>
              <PillButton variant="secondary" onClick={onGoScan}>
                Paste Payload
              </PillButton>
            </>
          }
        />
      ) : sorted.length === 0 ? (
        isSearching ? (
          <EmptyState
            title="No tickets found."
            body="Try another operator, route, zone, or ticket name."
            actions={
              <PillButton variant="primary" onClick={onGoScan} iconLeft={<PlusIcon size={18} />}>
                Add Ticket
              </PillButton>
            }
          />
        ) : segment === "current" ? (
          <EmptyState
            title="No current tickets."
            body="Active and upcoming tickets will appear here when you save them."
            actions={
              <PillButton variant="primary" onClick={onGoScan} iconLeft={<PlusIcon size={18} />}>
                Add Ticket
              </PillButton>
            }
          />
        ) : (
          <EmptyState
            title="No expired tickets."
            body="Past tickets will appear here quietly for records, reimbursements, or travel history."
          />
        )
      ) : (
        <div className="col col--gap-lg">
          {pinned.length > 0 && (
            <section>
              <SectionHeader title="Pinned" meta={`${pinned.length} pinned`} />
              <div className="col">
                {pinned.map((t) => (
                  <TicketCard key={t.id} ticket={t} onOpen={onOpenTicket} />
                ))}
              </div>
            </section>
          )}
          <section>
            <SectionHeader
              title={segment === "current" ? "Current tickets" : "Expired tickets"}
              meta={`${unpinned.length} shown`}
            />
            <div className="col">
              {unpinned.map((t) => (
                <TicketCard key={t.id} ticket={t} onOpen={onOpenTicket} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
