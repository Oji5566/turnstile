import { ScanIcon, SettingsIcon, WalletIcon } from "./icons";

export type TabId = "wallet" | "scan" | "settings";

export interface BottomTabsProps {
  active: TabId;
  onChange: (id: TabId) => void;
}

const TABS: { id: TabId; label: string; Icon: typeof WalletIcon }[] = [
  { id: "wallet", label: "Wallet", Icon: WalletIcon },
  { id: "scan", label: "Scan", Icon: ScanIcon },
  { id: "settings", label: "Settings", Icon: SettingsIcon }
];

export function BottomTabs({ active, onChange }: BottomTabsProps) {
  return (
    <nav className="bottom-tabs" role="tablist" aria-label="Main navigation">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={active === id}
          className="tab-button"
          onClick={() => onChange(id)}
        >
          <Icon size={22} aria-hidden="true" />
          <span className="tab-label">{label}</span>
        </button>
      ))}
    </nav>
  );
}
