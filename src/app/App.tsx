import { useEffect, useMemo, useState } from "react";
import { BottomTabs, TabId } from "../components/BottomTabs";
import { OnboardingFlow } from "../components/OnboardingFlow";
import { PresentTicketView } from "../components/PresentTicketView";
import { SettingsScreen } from "../components/SettingsScreen";
import { ScanScreen } from "../components/ScanScreen";
import { TicketDetail } from "../components/TicketDetail";
import { WalletScreen } from "../components/WalletScreen";
import { ToastProvider, useToast } from "../components/Toast";
import { useTickets } from "../hooks/useTickets";
import {
  isOnboardingComplete,
  loadSettings,
  saveSettings
} from "../storage/ticketsStorage";
import { AppSettings } from "../types/ticket";

type View =
  | { kind: "tabs" }
  | { kind: "detail"; id: string }
  | { kind: "present"; id: string };

function AppInner() {
  const toast = useToast();
  const [onboarded, setOnboarded] = useState<boolean>(() => isOnboardingComplete());
  const [tab, setTab] = useState<TabId>("wallet");
  const [view, setView] = useState<View>({ kind: "tabs" });
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

  const {
    tickets,
    storageError,
    addTicket,
    updateTicket,
    deleteTicket,
    incrementUseCount,
    importMany,
    clearExpired,
    clearAllTickets,
    restoreDemoData
  } = useTickets();

  useEffect(() => {
    try {
      saveSettings(settings);
    } catch {
      /* ignore */
    }
  }, [settings]);

  useEffect(() => {
    applyTheme(settings.appearance);
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq || settings.appearance !== "system") return;
    const handler = () => applyTheme("system");
    try {
      mq.addEventListener?.("change", handler);
    } catch {
      // older browsers
      mq.addListener?.(handler);
    }
    return () => {
      try {
        mq.removeEventListener?.("change", handler);
      } catch {
        mq.removeListener?.(handler);
      }
    };
  }, [settings.appearance]);

  const activeTicket = useMemo(() => {
    if (view.kind === "tabs") return null;
    return tickets.find((t) => t.id === view.id) ?? null;
  }, [view, tickets]);

  if (!onboarded) {
    return <OnboardingFlow onDone={() => setOnboarded(true)} />;
  }

  if (view.kind === "present" && activeTicket) {
    return (
      <PresentTicketView
        ticket={activeTicket}
        onExit={() => setView({ kind: "detail", id: activeTicket.id })}
      />
    );
  }

  return (
    <div className="app-shell">
      <div className="mobile-frame">
        <main className="app-content" id="main">
          {storageError && (
            <div className="banner banner--danger" role="alert" style={{ marginBottom: 14 }}>
              {storageError}
            </div>
          )}

          {view.kind === "detail" && activeTicket && (
            <TicketDetail
              ticket={activeTicket}
              onBack={() => setView({ kind: "tabs" })}
              onUpdate={(id, patch) => {
                updateTicket(id, patch);
                if (patch.status === "Expired") toast.show("Marked as expired.");
              }}
              onDelete={(id) => {
                deleteTicket(id);
                toast.show("Ticket deleted.");
              }}
              onPresent={(id) => setView({ kind: "present", id })}
              onIncrementUseCount={incrementUseCount}
            />
          )}

          {view.kind === "detail" && !activeTicket && (
            <div className="empty-state">
              <h3>Ticket not found.</h3>
              <button type="button" className="pill-button pill-button--primary" onClick={() => setView({ kind: "tabs" })}>
                Back to wallet
              </button>
            </div>
          )}

          {view.kind === "tabs" && tab === "wallet" && (
            <WalletScreen
              tickets={tickets}
              defaultSort={settings.defaultSort}
              onOpenTicket={(id) => setView({ kind: "detail", id })}
              onGoScan={() => setTab("scan")}
            />
          )}

          {view.kind === "tabs" && tab === "scan" && (
            <ScanScreen
              onAdd={(values) => addTicket({ ...values })}
              onSaved={(t) => {
                toast.show("Saved to Wallet.");
                setView({ kind: "detail", id: t.id });
              }}
            />
          )}

          {view.kind === "tabs" && tab === "settings" && (
            <SettingsScreen
              tickets={tickets}
              settings={settings}
              onSettingsChange={setSettings}
              onImport={importMany}
              onClearExpired={clearExpired}
              onClearAll={clearAllTickets}
              onRestoreDemo={restoreDemoData}
              onToast={(m) => toast.show(m)}
            />
          )}
        </main>
        {view.kind === "tabs" && <BottomTabs active={tab} onChange={setTab} />}
      </div>
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}

function applyTheme(mode: AppSettings["appearance"]) {
  const root = document.documentElement;
  if (mode === "system") {
    root.removeAttribute("data-theme");
    return;
  }
  root.setAttribute("data-theme", mode);
}
