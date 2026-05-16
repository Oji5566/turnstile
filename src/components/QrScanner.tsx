import { useCallback, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { PillButton } from "./PillButton";
import { CloseIcon } from "./icons";

export interface QrScannerProps {
  onDetected: (payload: string) => void;
  onCancel: () => void;
  onError: (message: string) => void;
}

export function QrScanner({ onDetected, onCancel, onError }: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const [status, setStatus] = useState<"starting" | "running" | "error">("starting");

  const stop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setStatus("error");
        onError("Camera is not available in this browser.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        video.setAttribute("playsinline", "true");
        await video.play();
        setStatus("running");
        scanLoop();
      } catch (err) {
        setStatus("error");
        const msg = err instanceof Error ? err.message : "Couldn’t start the camera.";
        onError(msg);
      }
    }

    function scanLoop() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      const tick = () => {
        if (cancelled) return;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          const w = video.videoWidth;
          const h = video.videoHeight;
          if (w > 0 && h > 0) {
            const target = 480;
            const scale = Math.min(1, target / Math.max(w, h));
            canvas.width = Math.floor(w * scale);
            canvas.height = Math.floor(h * scale);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert"
            });
            if (code && code.data) {
              onDetected(code.data);
              return;
            }
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }

    start();
    return () => {
      cancelled = true;
      stop();
    };
  }, [onDetected, onError, stop]);

  return (
    <div className="col col--gap-lg">
      <div className="scan-stage" aria-live="polite">
        <video ref={videoRef} muted playsInline />
        <canvas ref={canvasRef} hidden />
        <div className="scan-overlay">
          <div className="frame" />
        </div>
      </div>
      <p className="scan-help">
        {status === "starting"
          ? "Starting camera…"
          : status === "running"
          ? "Point your camera at the ticket’s QR code."
          : "Camera couldn’t start."}
      </p>
      <PillButton
        variant="secondary"
        block
        onClick={() => {
          stop();
          onCancel();
        }}
        iconLeft={<CloseIcon size={18} />}
      >
        Cancel scanning
      </PillButton>
    </div>
  );
}
