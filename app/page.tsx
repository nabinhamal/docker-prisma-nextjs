import { Suspense } from "react";
import { SystemStatus } from "@/components/system-status";
import { PostsContainer } from "@/components/posts-container";
import { PostListSkeleton } from "@/components/post-list-skeleton";

export default async function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <SystemStatus />

      <main className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <header className="mb-16 flex flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold whitespace-nowrap text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            ✨ Prisma + Next.js Showcase
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Modern <span className="text-gradient">Content Engine</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
            A premium full-stack demonstration featuring Docker, Nginx, Prisma,
            and Next.js. Experience the synergy of high-performance tools in a
            beautiful interface.
          </p>
        </header>

        {/* Posts Section */}
        <Suspense fallback={<PostListSkeleton />}>
          <PostsContainer />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-slate-200 bg-white/50 py-12 dark:border-zinc-800 dark:bg-black/50">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Modern Prisma Showcase. Built with
          Next.js 16 and Tailwind CSS 4.
        </div>
      </footer>
    </div>
  );
}
