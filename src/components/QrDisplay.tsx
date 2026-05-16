import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

export interface QrDisplayProps {
  payload: string;
  size?: number;
  ariaLabel?: string;
}

export function QrDisplay({ payload, size = 320, ariaLabel = "QR code" }: QrDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    if (!canvasRef.current || !payload) return;
    QRCode.toCanvas(canvasRef.current, payload, {
      width: size,
      margin: 1,
      color: { dark: "#111111", light: "#ffffff" },
      errorCorrectionLevel: "M"
    })
      .then(() => {
        /* drawn */
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Couldn’t draw QR.");
      });
    return () => {
      cancelled = true;
    };
  }, [payload, size]);

  if (!payload) {
    return (
      <div className="qr-placeholder" role="img" aria-label="No QR payload">
        No QR payload stored.
      </div>
    );
  }
  if (error) {
    return (
      <div className="qr-placeholder" role="img" aria-label="QR unavailable">
        Couldn’t render QR. Payload still saved.
      </div>
    );
  }
  return <canvas ref={canvasRef} role="img" aria-label={ariaLabel} />;
}
