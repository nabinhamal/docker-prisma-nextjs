import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PostDetailProps {
  id: string;
}

export async function PostDetail({ id }: PostDetailProps) {
  // Simulate slow loading
  // await new Promise((resolve) => setTimeout(resolve, 1500));

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
    },
  });

  if (!post) {
    notFound();
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <article className="glass-card relative overflow-hidden rounded-3xl p-8 sm:p-12">
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-purple-500/5" />

      <header className="relative mb-12">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-500 text-lg font-bold text-white shadow-xl">
              {getInitials(post.author.name)}
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-foreground">
                {post.author.name || "Anonymous"}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                Author
              </span>
            </div>
          </div>

          {post.published && (
            <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-600 dark:bg-green-500/20 dark:text-green-400">
              Published
            </span>
          )}
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          {post.title}
        </h1>
        
        <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-zinc-700" />
          <div className="flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            ID: {post.id.slice(0, 8)}
          </div>
        </div>
      </header>

      <div className="relative prose prose-slate max-w-none dark:prose-invert">
        <p className="whitespace-pre-wrap text-lg leading-relaxed text-foreground/90">
          {post.content}
        </p>
      </div>

      <footer className="relative mt-16 border-t border-slate-200/50 pt-8 dark:border-zinc-800/50">
        <div className="rounded-2xl bg-indigo-500/5 p-6 dark:bg-indigo-500/10">
          <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-500">
            About the author
          </h4>
          <p className="mt-2 text-sm text-muted-foreground">
            This post was written by {post.author.name || "Anonymous"}. 
            The platform uses Prisma for high-performance database access 
            and Next.js for a seamless user experience.
          </p>
        </div>
      </footer>
    </article>
  );
}
