import { useCallback, useEffect, useMemo, useState } from "react";
import { buildSeedTickets } from "../data/seedTickets";
import {
  isDemoSeeded,
  loadTickets,
  saveTickets,
  setDemoSeeded,
  StorageError
} from "../storage/ticketsStorage";
import { TransitTicket } from "../types/ticket";
import { sanitizeTicket, cryptoRandomId } from "../utils/sanitize";
import { computeStatus } from "../utils/ticketStatus";

export interface UseTicketsResult {
  tickets: TransitTicket[];
  storageError: string | null;
  addTicket: (input: Partial<TransitTicket>) => TransitTicket;
  updateTicket: (id: string, patch: Partial<TransitTicket>) => void;
  deleteTicket: (id: string) => void;
  pinTicket: (id: string, pinned: boolean) => void;
  markExpired: (id: string) => void;
  incrementUseCount: (id: string) => void;
  importMany: (incoming: TransitTicket[], mode: "merge" | "replace") => number;
  clearExpired: () => number;
  clearAllTickets: () => void;
  restoreDemoData: () => void;
}

export function useTickets(): UseTicketsResult {
  const [tickets, setTickets] = useState<TransitTicket[]>(() => loadTickets());
  const [storageError, setStorageError] = useState<string | null>(null);

  // Seed demo data on first load if wallet is empty and not already seeded.
  useEffect(() => {
    if (!isDemoSeeded()) {
      const existing = loadTickets();
      if (existing.length === 0) {
        const seeded = buildSeedTickets();
        try {
          saveTickets(seeded);
          setDemoSeeded(true);
          setTickets(seeded);
        } catch (err) {
          handleErr(err);
        }
      } else {
        setDemoSeeded(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleErr = (err: unknown) => {
    if (err instanceof StorageError) setStorageError(err.message);
    else setStorageError("Couldn’t access local storage.");
  };

  const persist = useCallback((next: TransitTicket[]) => {
    setTickets(next);
    try {
      saveTickets(next);
      setStorageError(null);
    } catch (err) {
      handleErr(err);
    }
  }, []);

  const addTicket = useCallback(
    (input: Partial<TransitTicket>): TransitTicket => {
      const now = new Date().toISOString();
      const draft = sanitizeTicket(
        { ...input, id: input.id ?? cryptoRandomId(), createdAt: now, updatedAt: now, scannedAt: now },
        cryptoRandomId()
      )!;
      // Recompute status to fit current expiry
      draft.status = computeStatus(draft);
      const next = [draft, ...tickets];
      persist(next);
      return draft;
    },
    [tickets, persist]
  );

  const updateTicket = useCallback(
    (id: string, patch: Partial<TransitTicket>) => {
      const next = tickets.map((t) => {
        if (t.id !== id) return t;
        const merged = sanitizeTicket({ ...t, ...patch, id: t.id, updatedAt: new Date().toISOString() });
        if (!merged) return t;
        merged.status = patch.status ?? computeStatus(merged);
        return merged;
      });
      persist(next);
    },
    [tickets, persist]
  );

  const deleteTicket = useCallback(
    (id: string) => {
      persist(tickets.filter((t) => t.id !== id));
    },
    [tickets, persist]
  );

  const pinTicket = useCallback(
    (id: string, pinned: boolean) => {
      persist(
        tickets.map((t) =>
          t.id === id ? { ...t, pinned, updatedAt: new Date().toISOString() } : t
        )
      );
    },
    [tickets, persist]
  );

  const markExpired = useCallback(
    (id: string) => {
      persist(
        tickets.map((t) =>
          t.id === id ? { ...t, status: "Expired", updatedAt: new Date().toISOString() } : t
        )
      );
    },
    [tickets, persist]
  );

  const incrementUseCount = useCallback(
    (id: string) => {
      persist(
        tickets.map((t) =>
          t.id === id ? { ...t, useCount: (t.useCount || 0) + 1, updatedAt: new Date().toISOString() } : t
        )
      );
    },
    [tickets, persist]
  );

  const importMany = useCallback(
    (incoming: TransitTicket[], mode: "merge" | "replace"): number => {
      if (mode === "replace") {
        persist(incoming);
        return incoming.length;
      }
      const byId = new Map(tickets.map((t) => [t.id, t] as const));
      let added = 0;
      for (const t of incoming) {
        if (byId.has(t.id)) {
          byId.set(t.id, { ...byId.get(t.id)!, ...t, updatedAt: new Date().toISOString() });
        } else {
          byId.set(t.id, t);
          added++;
        }
      }
      persist(Array.from(byId.values()));
      return added > 0 ? added : incoming.length;
    },
    [tickets, persist]
  );

  const clearExpired = useCallback((): number => {
    const before = tickets.length;
    const next = tickets.filter((t) => computeStatus(t) !== "Expired");
    persist(next);
    return before - next.length;
  }, [tickets, persist]);

  const clearAllTickets = useCallback(() => {
    persist([]);
    setDemoSeeded(false);
  }, [persist]);

  const restoreDemoData = useCallback(() => {
    const seeded = buildSeedTickets();
    persist(seeded);
    setDemoSeeded(true);
  }, [persist]);

  return useMemo(
    () => ({
      tickets,
      storageError,
      addTicket,
      updateTicket,
      deleteTicket,
      pinTicket,
      markExpired,
      incrementUseCount,
      importMany,
      clearExpired,
      clearAllTickets,
      restoreDemoData
    }),
    [
      tickets,
      storageError,
      addTicket,
      updateTicket,
      deleteTicket,
      pinTicket,
      markExpired,
      incrementUseCount,
      importMany,
      clearExpired,
      clearAllTickets,
      restoreDemoData
    ]
  );
}
