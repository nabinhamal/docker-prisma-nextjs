"use client";

import { useAlert } from "@/hooks/use-alert";

export function AlertModal() {
  const { alertState, closeAlert } = useAlert();

  if (!alertState) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={closeAlert}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white/70 p-6 shadow-2xl ring-1 ring-white/20 backdrop-blur-2xl animate-in zoom-in-95 fade-in duration-300 dark:bg-zinc-900/70">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              {alertState.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {alertState.message}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                alertState.onCancel?.();
                closeAlert();
              }}
              className="flex-1 rounded-2xl bg-slate-100 py-3 text-sm font-bold text-slate-600 transition-all hover:bg-slate-200 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10"
            >
              {alertState.cancelText || "Cancel"}
            </button>
            <button
              onClick={() => {
                alertState.onConfirm();
                closeAlert();
              }}
              className="flex-1 rounded-2xl bg-indigo-500 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-indigo-600 active:scale-95"
            >
              {alertState.confirmText || "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
