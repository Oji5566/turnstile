import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { AppSettings, SortKey, TransitTicket } from "../types/ticket";
import { PillButton } from "./PillButton";
import { SoftCard } from "./SoftCard";
import { ConfirmDialog } from "./ConfirmDialog";
import { SectionHeader } from "./SectionHeader";
import { storageUsage } from "../storage/ticketsStorage";
import {
  downloadTextFile,
  ticketsFromJson,
  ticketsToJson,
  ticketsToMarkdown
} from "../utils/exportTickets";

const APP_VERSION = "1.0.0";

export interface SettingsScreenProps {
  tickets: TransitTicket[];
  settings: AppSettings;
  onSettingsChange: (next: AppSettings) => void;
  onImport: (incoming: TransitTicket[], mode: "merge" | "replace") => number;
  onClearExpired: () => number;
  onClearAll: () => void;
  onRestoreDemo: () => void;
  onToast: (msg: string) => void;
}

const SORT_LABELS: Record<SortKey, string> = {
  expiry: "By expiry",
  recent: "Recently added",
  used: "Recently used",
  operator: "Operator A–Z",
  pinned: "Pinned first"
};

export function SettingsScreen({
  tickets,
  settings,
  onSettingsChange,
  onImport,
  onClearExpired,
  onClearAll,
  onRestoreDemo,
  onToast
}: SettingsScreenProps) {
  const importInputRef = useRef<HTMLInputElement>(null);
  const [confirmClearExpired, setConfirmClearExpired] = useState(false);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [confirmRestoreDemo, setConfirmRestoreDemo] = useState(false);

  const usage = useMemo(() => storageUsage(), [tickets]);

  useEffect(() => {
    applyTheme(settings.appearance);
  }, [settings.appearance]);

  function handleExportJson() {
    downloadTextFile(`turnstile-wallet-${todaySlug()}.json`, ticketsToJson(tickets), "application/json");
    onToast("Wallet exported as JSON.");
  }

  function handleExportMarkdown() {
    downloadTextFile(
      `turnstile-wallet-${todaySlug()}.md`,
      ticketsToMarkdown(tickets),
      "text/markdown"
    );
    onToast("Wallet exported as Markdown.");
  }

  function handleImportClick() {
    importInputRef.current?.click();
  }

  async function handleImportFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const incoming = ticketsFromJson(text);
      if (incoming.length === 0) {
        onToast("No tickets found in that file.");
        return;
      }
      const replace = window.confirm(
        `Found ${incoming.length} ticket(s).\n\nOK = Replace your wallet.\nCancel = Merge with your wallet.`
      );
      const added = onImport(incoming, replace ? "replace" : "merge");
      onToast(replace ? `Imported ${added} ticket(s) (replaced).` : `Imported ${added} ticket(s).`);
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Import failed.");
    }
  }

  return (
    <div className="col col--gap-lg">
      <header>
        <h1 className="app-title">Settings</h1>
        <p className="app-tagline">Backups, appearance, storage, and app info.</p>
      </header>

      <section className="settings-group">
        <SectionHeader title="Data" />
        <SoftCard>
          <div className="col" style={{ gap: 10 }}>
            <PillButton variant="primary" block onClick={handleExportJson}>
              Backup wallet (JSON)
            </PillButton>
            <PillButton variant="secondary" block onClick={handleImportClick}>
              Import wallet
            </PillButton>
            <input
              ref={importInputRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={handleImportFile}
              aria-label="Import wallet JSON"
            />
            <PillButton variant="secondary" block onClick={handleExportMarkdown}>
              Export Markdown
            </PillButton>
            <PillButton variant="soft" block onClick={() => setConfirmRestoreDemo(true)}>
              Restore demo data
            </PillButton>
          </div>
        </SoftCard>
      </section>

      <section className="settings-group">
        <SectionHeader title="Wallet" />
        <SoftCard>
          <div className="col" style={{ gap: 12 }}>
            <div>
              <label className="field-label" htmlFor="default-sort">
                Default sorting
              </label>
              <select
                id="default-sort"
                className="select-input"
                value={settings.defaultSort}
                onChange={(e) =>
                  onSettingsChange({ ...settings, defaultSort: e.target.value as SortKey })
                }
              >
                {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                  <option key={k} value={k}>
                    {SORT_LABELS[k]}
                  </option>
                ))}
              </select>
            </div>
            <PillButton variant="secondary" block onClick={() => setConfirmClearExpired(true)}>
              Clear expired tickets
            </PillButton>
            <PillButton variant="danger" block onClick={() => setConfirmClearAll(true)}>
              Clear all tickets
            </PillButton>
          </div>
        </SoftCard>
      </section>

      <section className="settings-group">
        <SectionHeader title="App" />
        <SoftCard>
          <div className="col" style={{ gap: 12 }}>
            <div>
              <label className="field-label" htmlFor="appearance">
                Appearance
              </label>
              <select
                id="appearance"
                className="select-input"
                value={settings.appearance}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    appearance: e.target.value as AppSettings["appearance"]
                  })
                }
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div className="list-row">
              <div>
                <div className="label">Local storage</div>
                <div className="sub">
                  {usage.available
                    ? `Available. ~${formatBytes(usage.used)} used by Turnstile.`
                    : "Unavailable in this browser."}
                </div>
              </div>
            </div>
            <SoftCard tone="muted">
              <strong>Install Turnstile</strong>
              <p className="muted" style={{ marginTop: 6, fontSize: 13 }}>
                On iPhone/iPad: open in Safari, tap the Share icon, then “Add to Home Screen.”
                <br />
                On Android Chrome: open the menu and tap “Install app” or “Add to Home screen.”
                <br />
                On Desktop Chrome/Edge: click the install icon in the address bar.
              </p>
            </SoftCard>
          </div>
        </SoftCard>
      </section>

      <section className="settings-group">
        <SectionHeader title="Deployment" />
        <SoftCard tone="muted">
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--color-text-muted)" }}>
            <li>App version: {APP_VERSION}</li>
            <li>Static PWA build</li>
            <li>GitHub Pages ready (repo subpath supported)</li>
            <li>Offline after first load</li>
            <li>Local-only storage</li>
            <li>No backend dependency</li>
          </ul>
        </SoftCard>
      </section>

      <section className="settings-group">
        <SectionHeader title="Privacy" />
        <SoftCard tone="muted">
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--color-text-muted)" }}>
            <li>No account</li>
            <li>No cloud sync</li>
            <li>No backend</li>
          </ul>
          <p className="muted" style={{ marginTop: 10, fontSize: 13 }}>
            Turnstile stores ticket information locally for personal organization. It does not validate,
            modify, extend, or authenticate transit tickets. Always follow your transit operator’s rules.
          </p>
        </SoftCard>
      </section>

      <section className="settings-group">
        <SectionHeader title="About" />
        <SoftCard>
          <strong>Turnstile</strong>
          <p className="muted" style={{ marginTop: 6 }}>
            A simple, reliable holder for your paper transit tickets.
          </p>
          <p className="soft" style={{ marginTop: 6, fontSize: 13 }}>MVP version</p>
        </SoftCard>
      </section>

      <section className="settings-group">
        <SectionHeader title="Open-source acknowledgements" />
        <SoftCard tone="muted">
          <p className="muted" style={{ margin: 0, fontSize: 13 }}>
            Turnstile is built with these open-source packages. All are bundled locally with the app and are
            not loaded from a CDN at runtime.
          </p>
          <ul style={{ marginTop: 10, paddingLeft: 18, color: "var(--color-text-muted)", fontSize: 13 }}>
            <li>
              <strong>React</strong> — UI framework · MIT · reactjs.org
            </li>
            <li>
              <strong>React DOM</strong> — DOM renderer for React · MIT
            </li>
            <li>
              <strong>TypeScript</strong> — typed JavaScript · Apache-2.0
            </li>
            <li>
              <strong>Vite</strong> — build tool and dev server · MIT
            </li>
            <li>
              <strong>@vitejs/plugin-react</strong> — Vite React integration · MIT
            </li>
            <li>
              <strong>jsQR</strong> — QR decoding from images and camera frames · Apache-2.0
            </li>
            <li>
              <strong>qrcode</strong> — QR generation for the ticket display · MIT
            </li>
          </ul>
        </SoftCard>
      </section>

      <ConfirmDialog
        open={confirmClearExpired}
        title="Clear all expired tickets?"
        body="This removes every expired ticket from your local wallet. Current tickets stay safe."
        confirmLabel="Clear expired"
        destructive
        onCancel={() => setConfirmClearExpired(false)}
        onConfirm={() => {
          setConfirmClearExpired(false);
          const removed = onClearExpired();
          onToast(removed > 0 ? `Cleared ${removed} expired ticket(s).` : "No expired tickets to clear.");
        }}
      />

      <ConfirmDialog
        open={confirmClearAll}
        title="Clear your entire wallet?"
        body="This permanently removes every ticket stored in this browser. You can restore demo data afterwards."
        confirmLabel="Clear everything"
        destructive
        onCancel={() => setConfirmClearAll(false)}
        onConfirm={() => {
          setConfirmClearAll(false);
          onClearAll();
          onToast("Wallet cleared.");
        }}
      />

      <ConfirmDialog
        open={confirmRestoreDemo}
        title="Restore demo tickets?"
        body="Your current tickets will be replaced with the original Turnstile demo set."
        confirmLabel="Restore demo"
        onCancel={() => setConfirmRestoreDemo(false)}
        onConfirm={() => {
          setConfirmRestoreDemo(false);
          onRestoreDemo();
          onToast("Demo tickets restored.");
        }}
      />
    </div>
  );
}

function todaySlug(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function applyTheme(mode: AppSettings["appearance"]) {
  const root = document.documentElement;
  if (mode === "system") {
    root.removeAttribute("data-theme");
    return;
  }
  root.setAttribute("data-theme", mode);
}
