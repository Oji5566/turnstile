import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from "react";

interface ToastItem {
  id: number;
  message: string;
}

interface ToastCtx {
  show: (message: string) => void;
}

const Ctx = createContext<ToastCtx | null>(null);

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const show = useCallback((message: string) => {
    const id = ++counter;
    setItems((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 2400);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="toast-container" role="status" aria-live="polite" aria-atomic="true">
        {items.map((t) => (
          <div key={t.id} className="toast">
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastCtx {
  const ctx = useContext(Ctx);
  if (!ctx) return { show: () => undefined };
  return ctx;
}
