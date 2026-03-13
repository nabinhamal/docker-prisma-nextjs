export function PostSkeleton() {
  return (
    <div className="relative flex flex-col gap-4 overflow-hidden rounded-2xl p-6 glass-card animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-zinc-800" />
          <div className="h-4 w-24 rounded bg-slate-200 dark:bg-zinc-800" />
        </div>
        <div className="h-4 w-16 rounded-full bg-slate-200 dark:bg-zinc-800" />
      </div>

      <div className="space-y-3">
        <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-zinc-800" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-slate-200 dark:bg-zinc-800" />
          <div className="h-4 w-full rounded bg-slate-200 dark:bg-zinc-800" />
          <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-zinc-800" />
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-slate-200/50 pt-4 dark:border-zinc-800/50">
        <div className="h-3 w-20 rounded bg-slate-200 dark:bg-zinc-800" />
        <div className="h-3 w-16 rounded bg-slate-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}
