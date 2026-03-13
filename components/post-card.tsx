import { UserPost } from "@/types/post";
import Link from "next/link";
import { useState } from "react";
import { PostForm } from "./post-form";
import { alert } from "@/hooks/use-alert";

interface PostCardProps {
  post: UserPost;
  onLike?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onEdit?: (
    postId: string,
    data: { title: string; content: string },
  ) => Promise<void>;
}

export function PostCard({ post, onLike, onDelete, onEdit }: PostCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (isEditing) {
    return (
      <PostForm
        initialData={{ id: post.id, title: post.title, content: post.content }}
        onSubmit={async (data) => {
          await onEdit?.(post.id, data);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <article className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl glass-card">
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-500 text-sm font-bold text-white shadow-lg">
            {getInitials(post.author.name)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              {post.author.name || "Anonymous"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-full px-2 py-1 text-xs font-bold text-muted-foreground transition-all hover:bg-indigo-500/10 hover:text-indigo-500 dark:hover:bg-indigo-500/20"
          >
            Edit
          </button>
          <button
            onClick={() => {
              alert({
                title: "Delete Post",
                message: "Are you sure you want to delete this post? This action cannot be undone.",
                confirmText: "Delete",
                onConfirm: () => onDelete?.(post.id),
              });
            }}
            className="rounded-full px-2 py-1 text-xs font-bold text-muted-foreground transition-all hover:bg-rose-500/10 hover:text-rose-500 dark:hover:bg-rose-500/20"
          >
            Del
          </button>
        </div>
      </div>

      <div className="relative space-y-2">
        <div className="flex items-center justify-between">
          <Link href={`/posts/${post.id}`} className="flex-1">
            <h3 className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-indigo-500">
              {post.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2">
            {post.published && (
              <span className="rounded-full bg-green-500/10 px-2 text-[10px] font-bold uppercase tracking-wider text-green-600 dark:bg-green-500/20 dark:text-green-400">
                Live
              </span>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                onLike?.(post.id);
              }}
              className="flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-1 text-[10px] font-bold text-rose-600 transition-all hover:bg-rose-500/20 active:scale-95 dark:bg-rose-500/20 dark:text-rose-400"
            >
              ❤️ {post.likes}
            </button>
          </div>
        </div>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground/80">
          {post.content}
        </p>
      </div>

      <div className="relative mt-auto pt-4 flex items-center justify-between border-t border-slate-200/50 dark:border-zinc-800/50">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
          ID: {post.id.slice(0, 8)}
        </div>
        <Link
          href={`/posts/${post.id}`}
          className="flex items-center gap-1 text-xs font-bold text-indigo-500 transition-all hover:gap-2"
        >
          Details
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
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
