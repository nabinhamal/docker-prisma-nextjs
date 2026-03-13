"use client";

import { useToast, ToastType } from "@/hooks/use-toast";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none items-end max-sm:left-4 max-sm:right-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto w-full max-w-xs flex items-center justify-between gap-4 p-4 rounded-2xl shadow-2xl backdrop-blur-xl border animate-in slide-in-from-top-2 fade-in duration-300
            ${
              toast.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                : toast.type === "error"
                ? "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
                : "bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400"
            }
          `}
        >
          <p className="text-sm font-bold tracking-tight">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-current opacity-50 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
