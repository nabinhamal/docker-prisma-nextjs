"use client";

import { useState, useTransition } from "react";
import { toast } from "@/hooks/use-toast";

interface PostFormProps {
  initialData?: { id: string; title: string; content: string };
  onSubmit: (data: { title: string; content: string }) => Promise<void>;
  onCancel?: () => void;
}

export function PostForm({ initialData, onSubmit, onCancel }: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    startTransition(async () => {
      try {
        await onSubmit({ title, content });
        if (!initialData) {
          setTitle("");
          setContent("");
        }
      } catch (error) {
        // Error is handled by caller or toast
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl bg-white/50 p-6 shadow-sm ring-1 ring-slate-200 dark:bg-black/50 dark:ring-zinc-800"
    >
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-lg font-bold text-foreground">
          {initialData ? "Edit Post" : "Create New Post"}
        </h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-900"
          >
            ✕
          </button>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-semibold text-foreground">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title..."
          className="block w-full rounded-xl border-0 bg-white/50 py-3 px-4 text-sm ring-1 ring-inset ring-slate-200 transition-all focus:ring-2 focus:ring-indigo-500 dark:bg-black/50 dark:ring-zinc-800"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-semibold text-foreground">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={4}
          className="block w-full rounded-xl border-0 bg-white/50 py-3 px-4 text-sm ring-1 ring-inset ring-slate-200 transition-all focus:ring-2 focus:ring-indigo-500 dark:bg-black/50 dark:ring-zinc-800"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition-all hover:bg-slate-100 dark:hover:bg-zinc-900"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-2 text-sm font-bold text-white shadow-lg transition-all hover:bg-indigo-600 disabled:opacity-50"
        >
          {isPending ? (
            "..."
          ) : initialData ? (
            "Update Post"
          ) : (
            "＋ Create Post"
          )}
        </button>
      </div>
    </form>
  );
}
