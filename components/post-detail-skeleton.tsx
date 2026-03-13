"use client";

export function PostDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-12 inline-flex items-center gap-2 text-sm font-semibold text-slate-200 dark:text-zinc-800">
        <div className="h-4 w-4 rounded-full bg-slate-200 dark:bg-zinc-800" />
        <div className="h-4 w-20 rounded bg-slate-200 dark:bg-zinc-800" />
      </div>

      <div className="glass-card relative overflow-hidden rounded-3xl p-8 sm:p-12">
        <div className="relative mb-12">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-zinc-800" />
              <div className="flex flex-col gap-2">
                <div className="h-4 w-24 rounded bg-slate-200 dark:bg-zinc-800" />
                <div className="h-3 w-12 rounded bg-slate-200 dark:bg-zinc-800" />
              </div>
            </div>
            <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-zinc-800" />
          </div>

          <div className="h-12 w-3/4 rounded bg-slate-200 dark:bg-zinc-800 sm:h-14" />

          <div className="mt-6 flex items-center gap-4">
            <div className="h-4 w-32 rounded bg-slate-200 dark:bg-zinc-800" />
            <div className="h-1 w-1 rounded-full bg-slate-200 dark:bg-zinc-800" />
            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-zinc-800" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-4 w-full rounded bg-slate-200 dark:bg-zinc-800" />
          <div className="h-4 w-full rounded bg-slate-200 dark:bg-zinc-800" />
          <div className="h-4 w-full rounded bg-slate-200 dark:bg-zinc-800" />
          <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-zinc-800" />
        </div>

        <div className="mt-16 border-t border-slate-200/50 pt-8 dark:border-zinc-800/50">
          <div className="h-24 w-full rounded-2xl bg-slate-100 dark:bg-zinc-900" />
        </div>
      </div>
    </div>
  );
}
