import { useState } from "react";
import { PillButton } from "../components/PillButton";
import { QrIcon, ScanIcon, TicketIcon, WalletIcon } from "../components/icons";
import { setOnboardingComplete } from "../storage/ticketsStorage";

const SCREENS = [
  {
    title: "Your paper tickets, safely preserved.",
    body: "Save QR-based paper transit tickets in one simple local wallet so you can find them when you need them.",
    Icon: WalletIcon
  },
  {
    title: "Scan once. Find later.",
    body: "Capture a ticket QR code, add operator and route details, then keep it organized by status and expiry.",
    Icon: ScanIcon
  },
  {
    title: "Ready before boarding.",
    body: "Open a saved ticket to show a large, clean QR code with the ticket details you need at the gate or onboard.",
    Icon: QrIcon
  },
  {
    title: "Private by default.",
    body: "For this MVP, your wallet is stored locally in this browser. There is no account, backend, or cloud sync.",
    Icon: TicketIcon
  }
];

export function OnboardingFlow({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const current = SCREENS[index];
  const isLast = index === SCREENS.length - 1;
  const Icon = current.Icon;

  function complete() {
    setOnboardingComplete(true);
    onDone();
  }

  return (
    <div className="app-shell">
      <div className="mobile-frame">
        <div className="onboarding">
          <div className="progress" aria-hidden="true">
            {SCREENS.map((_, i) => (
              <span key={i} className={i <= index ? "active" : ""} />
            ))}
          </div>
          <div className="hero">
            <div className="hero-icon">
              <Icon size={64} />
            </div>
            <h1>{current.title}</h1>
            <p>{current.body}</p>
          </div>
          <div className="actions">
            <PillButton
              variant="primary"
              block
              onClick={() => {
                if (isLast) complete();
                else setIndex((i) => i + 1);
              }}
            >
              {isLast ? "Start using Turnstile" : "Continue"}
            </PillButton>
            <PillButton variant="ghost" block onClick={complete}>
              Skip intro
            </PillButton>
          </div>
        </div>
      </div>
    </div>
  );
}
