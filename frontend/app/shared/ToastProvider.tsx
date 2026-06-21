"use client";

import { createContext, useContext, useState } from "react";

type ToastType = "ok" | "err" | "inf";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (
    message: string,
    type: ToastType = "inf"
  ) => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  };

  const icons = {
    ok: "✓",
    err: "✕",
    inf: "i",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed bottom-5 right-5 z-9999 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              flex items-center gap-3
              min-w-[320px]
              rounded-xl
              border
              bg-white
              px-4 py-3
              shadow-xl
              animate-in slide-in-from-right duration-300
              ${
                toast.type === "ok"
                  ? "border-green-200"
                  : toast.type === "err"
                    ? "border-red-200"
                    : "border-blue-200"
              }
            `}
          >
            <div
              className={`
                flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold
                ${
                  toast.type === "ok"
                    ? "bg-green-100 text-green-700"
                    : toast.type === "err"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                }
              `}
            >
              {icons[toast.type]}
            </div>

            <span className="text-sm text-black">
              {toast.message}
            </span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}