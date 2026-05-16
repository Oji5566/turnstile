import { ChangeEvent, useCallback, useRef, useState } from "react";
import jsQR from "jsqr";
import { PillButton } from "./PillButton";
import { SoftCard } from "./SoftCard";
import { QrScanner } from "./QrScanner";
import { TicketForm, TicketFormValues } from "./TicketForm";
import { ClipboardIcon, ScanIcon, UploadIcon } from "./icons";
import { TransitTicket } from "../types/ticket";
import { normalizePayload, previewPayload } from "../utils/qrPayload";

type Stage =
  | { kind: "idle" }
  | { kind: "scanning" }
  | { kind: "paste" }
  | { kind: "cameraError"; message: string }
  | { kind: "unsupported"; message: string }
  | { kind: "form"; payload: string };

export interface ScanScreenProps {
  onSaved: (ticket: TransitTicket) => void;
  onAdd: (values: TicketFormValues & { qrPayload: string }) => TransitTicket;
}

export function ScanScreen({ onSaved, onAdd }: ScanScreenProps) {
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const [pasteValue, setPasteValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [savedFlag, setSavedFlag] = useState<TransitTicket | null>(null);

  const handleDetected = useCallback((data: string) => {
    const payload = normalizePayload(data);
    if (!payload) {
      setStage({ kind: "unsupported", message: "That QR code didn’t contain any readable text." });
      return;
    }
    setStage({ kind: "form", payload });
  }, []);

  const handleFile = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so the same file can be re-picked later
    e.target.value = "";
    try {
      const img = await fileToImage(file);
      const canvas = document.createElement("canvas");
      const maxSide = 1024;
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      canvas.width = Math.max(1, Math.floor(img.width * scale));
      canvas.height = Math.max(1, Math.floor(img.height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Couldn’t read image.");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      // image is intentionally discarded after this point
      if (!code || !code.data) {
        setStage({
          kind: "unsupported",
          message: "Couldn’t find a QR code in that image. Try another photo or paste the payload."
        });
        return;
      }
      handleDetected(code.data);
    } catch (err) {
      setStage({
        kind: "unsupported",
        message: err instanceof Error ? err.message : "Couldn’t read that image."
      });
    }
  }, [handleDetected]);

  function submitForm(values: TicketFormValues) {
    if (stage.kind !== "form") return;
    const saved = onAdd({ ...values, qrPayload: stage.payload });
    setSavedFlag(saved);
    onSaved(saved);
    setStage({ kind: "idle" });
  }

  if (savedFlag) {
    return (
      <div className="col col--gap-lg">
        <header>
          <h1 className="app-title">Saved to Wallet.</h1>
          <p className="app-tagline">Your ticket is stored locally in this browser.</p>
        </header>
        <SoftCard>
          <div className="col" style={{ alignItems: "center", textAlign: "center", gap: 16 }}>
            <div className="hero-icon" aria-hidden="true">
              <ScanIcon size={32} />
            </div>
            <div>
              <strong>{savedFlag.operator || "Ticket"} — {savedFlag.title || "Untitled"}</strong>
              <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                {previewPayload(savedFlag.qrPayload)}
              </div>
            </div>
            <div className="row" style={{ gap: 10, width: "100%" }}>
              <PillButton variant="secondary" block onClick={() => setSavedFlag(null)}>
                Add Another
              </PillButton>
              <PillButton variant="primary" block onClick={() => onSaved(savedFlag)}>
                View Ticket
              </PillButton>
            </div>
          </div>
        </SoftCard>
      </div>
    );
  }

  return (
    <div className="col col--gap-lg">
      <header>
        <h1 className="app-title">Scan a ticket</h1>
        <p className="app-tagline">
          Capture a QR code from your paper ticket. Turnstile stores only the payload text — no images leave this device.
        </p>
      </header>

      {stage.kind === "idle" && (
        <SoftCard>
          <div className="col" style={{ gap: 12 }}>
            <PillButton
              variant="primary"
              block
              iconLeft={<ScanIcon size={18} />}
              onClick={() => setStage({ kind: "scanning" })}
            >
              Scan QR with camera
            </PillButton>
            <PillButton
              variant="secondary"
              block
              iconLeft={<UploadIcon size={18} />}
              onClick={() => fileInputRef.current?.click()}
            >
              Upload ticket photo
            </PillButton>
            <PillButton
              variant="ghost"
              block
              iconLeft={<ClipboardIcon size={18} />}
              onClick={() => setStage({ kind: "paste" })}
            >
              Paste QR payload manually
            </PillButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFile}
              aria-label="Upload ticket image"
            />
            <p className="muted" style={{ fontSize: 13 }}>
              Turnstile does not validate, modify, extend, or authenticate transit tickets. Always follow your transit operator’s rules.
            </p>
          </div>
        </SoftCard>
      )}

      {stage.kind === "scanning" && (
        <SoftCard>
          <QrScanner
            onDetected={handleDetected}
            onCancel={() => setStage({ kind: "idle" })}
            onError={(message) => setStage({ kind: "cameraError", message })}
          />
        </SoftCard>
      )}

      {stage.kind === "cameraError" && (
        <SoftCard>
          <div className="col" style={{ gap: 10 }}>
            <h2 style={{ margin: 0 }}>Camera is not available.</h2>
            <p className="muted">
              {stage.message ||
                "You can still add a ticket by uploading an image or pasting a QR payload manually."}
            </p>
            <PillButton variant="primary" block onClick={() => setStage({ kind: "paste" })}>
              Paste Payload
            </PillButton>
            <PillButton variant="secondary" block onClick={() => fileInputRef.current?.click()}>
              Upload Image
            </PillButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFile}
              aria-label="Upload ticket image"
            />
            <PillButton variant="ghost" block onClick={() => setStage({ kind: "idle" })}>
              Back
            </PillButton>
          </div>
        </SoftCard>
      )}

      {stage.kind === "unsupported" && (
        <SoftCard>
          <div className="col" style={{ gap: 10 }}>
            <h2 style={{ margin: 0 }}>That QR couldn’t be used.</h2>
            <p className="muted">{stage.message}</p>
            <PillButton variant="primary" block onClick={() => setStage({ kind: "scanning" })}>
              Try scanning again
            </PillButton>
            <PillButton variant="secondary" block onClick={() => setStage({ kind: "paste" })}>
              Paste Payload
            </PillButton>
            <PillButton variant="ghost" block onClick={() => setStage({ kind: "idle" })}>
              Back
            </PillButton>
          </div>
        </SoftCard>
      )}

      {stage.kind === "paste" && (
        <SoftCard>
          <div className="col" style={{ gap: 12 }}>
            <label className="field-label" htmlFor="paste-payload">
              QR payload
            </label>
            <textarea
              id="paste-payload"
              className="textarea-input"
              value={pasteValue}
              onChange={(e) => setPasteValue(e.target.value)}
              placeholder="Paste the QR payload text here"
            />
            <PillButton
              variant="primary"
              block
              disabled={!normalizePayload(pasteValue)}
              onClick={() => {
                const payload = normalizePayload(pasteValue);
                if (!payload) return;
                setStage({ kind: "form", payload });
                setPasteValue("");
              }}
            >
              Use this payload
            </PillButton>
            <PillButton variant="ghost" block onClick={() => setStage({ kind: "idle" })}>
              Back
            </PillButton>
          </div>
        </SoftCard>
      )}

      {stage.kind === "form" && (
        <SoftCard>
          <div className="col col--gap-lg">
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Ticket details</h2>
              <p className="muted" style={{ fontSize: 13, marginTop: 6 }}>
                Captured payload: <code className="kbd">{previewPayload(stage.payload, 56)}</code>
              </p>
            </div>
            <TicketForm
              payloadPreview={stage.payload}
              submitLabel="Save to Wallet"
              onSubmit={submitForm}
              onCancel={() => setStage({ kind: "idle" })}
            />
          </div>
        </SoftCard>
      )}
    </div>
  );
}

function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Couldn’t open that image."));
    };
    img.src = url;
  });
}
