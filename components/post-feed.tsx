"use client";
import {
  useState,
  useTransition,
  useEffect,
  useEffectEvent,
  useOptimistic,
} from "react";
import { UserPost } from "@/types/post";
import { PostList } from "./post-list";
import { PostForm } from "./post-form";
import {
  getPosts,
  toggleLike,
  cleanupDuplicates,
  createPost,
  updatePost,
  deletePost,
} from "@/lib/post-actions";
import { toast } from "@/hooks/use-toast";

interface PostFeedProps {
  initialPosts: UserPost[];
}

type FeedAction =
  | { type: "like"; postId: string }
  | { type: "cleanup" }
  | { type: "create"; post: UserPost }
  | { type: "update"; post: UserPost }
  | { type: "delete"; postId: string };

export function PostFeed({ initialPosts }: PostFeedProps) {
  const [allPosts, setAllPosts] = useState(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);
  const [isPending, startTransition] = useTransition();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length === 30);

  // Optimistic UI
  const [optimisticPosts, addOptimisticUpdate] = useOptimistic(
    filteredPosts,
    (state, action: FeedAction) => {
      switch (action.type) {
        case "like":
          return state.map((post) =>
            post.id === action.postId
              ? { ...post, likes: post.likes + 1 }
              : post,
          );
        case "cleanup":
          const seen = new Set<string>();
          return state.filter((post) => {
            const key = `${post.title.trim()}|${post.content.trim()}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        case "create":
          return [action.post, ...state];
        case "update":
          return state.map((p) => (p.id === action.post.id ? action.post : p));
        case "delete":
          return state.filter((p) => p.id !== action.postId);
        default:
          return state;
      }
    },
  );

  const handleCreate = async (data: { title: string; content: string }) => {
    const tempId = Math.random().toString();
    const tempPost: UserPost = {
      id: tempId,
      ...data,
      published: true,
      authorId: "temp-author",
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: { id: "temp-author", name: "You", email: "" },
    };

    startTransition(async () => {
      addOptimisticUpdate({ type: "create", post: tempPost });
      try {
        const realPost = await createPost({
          ...data,
          authorId: initialPosts[0]?.authorId || "cmmobm0f0003cbdo4beu74v1h",
        });
        setAllPosts((current) => [realPost, ...current]);
        setShowCreateForm(false);
        toast.success("Post created successfully!");
      } catch (error) {
        toast.error("Failed to create post");
      }
    });
  };

  const handleEdit = async (
    id: string,
    data: { title: string; content: string },
  ) => {
    startTransition(async () => {
      const postToEdit = allPosts.find((p) => p.id === id);
      if (postToEdit) {
        addOptimisticUpdate({
          type: "update",
          post: { ...postToEdit, ...data },
        });
      }
      try {
        const updated = await updatePost(id, data);
        setAllPosts((current) =>
          current.map((p) => (p.id === id ? updated : p)),
        );
        toast.success("Post updated!");
      } catch (error) {
        toast.error("Failed to update post");
      }
    });
  };

  const handleDelete = async (postId: string) => {
    startTransition(async () => {
      addOptimisticUpdate({ type: "delete", postId });
      try {
        await deletePost(postId);
        setAllPosts((current) => current.filter((p) => p.id !== postId));
        toast.success("Post deleted");
      } catch (error) {
        toast.error("Failed to delete post");
      }
    });
  };

  const onFilter = useEffectEvent((query: string, currentPosts: UserPost[]) => {
    startTransition(() => {
      const filtered = currentPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query),
      );
      setFilteredPosts(filtered);
    });
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleLike = async (postId: string) => {
    startTransition(async () => {
      addOptimisticUpdate({ type: "like", postId });
      try {
        await toggleLike(postId);
        setAllPosts((current) =>
          current.map((p) =>
            p.id === postId ? { ...p, likes: p.likes + 1 } : p,
          ),
        );
      } catch (error) {
        toast.error("Failed to like post");
      }
    });
  };

  const handleCleanup = async () => {
    startTransition(async () => {
      setIsCleaning(true);
      addOptimisticUpdate({ type: "cleanup" });
      try {
        const result = await cleanupDuplicates();
        setAllPosts((current) => {
          const seen = new Set<string>();
          return current.filter((post) => {
            const key = `${post.title.trim()}|${post.content.trim()}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        });
        toast.success(`Removed ${result.deletedCount} duplicates!`);
      } catch (error) {
        toast.error("Cleanup failed");
      } finally {
        setIsCleaning(false);
      }
    });
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const nextPosts = await getPosts(allPosts.length, 30);
      if (nextPosts.length < 30) setHasMore(false);
      setAllPosts((current) => {
        const existingIds = new Set(current.map((p) => p.id));
        const uniqueNextPosts = nextPosts.filter((p) => !existingIds.has(p.id));
        return [...current, ...uniqueNextPosts];
      });
    } catch (error) {
      toast.error("Failed to load more posts");
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilter(searchQuery.toLowerCase(), allPosts);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, allPosts]);

  return (
    <div className="space-y-8">
      {/* Search and Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <span className={`text-sm ${isPending ? "animate-spin" : ""}`}>
              🔍
            </span>
          </div>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-2xl border-0 bg-white/50 py-4 pl-12 pr-4 text-sm font-medium shadow-sm ring-1 ring-inset ring-slate-200 transition-all focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:bg-black/50 dark:ring-zinc-800 dark:focus:bg-black"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCleanup}
            disabled={isCleaning}
            className="flex items-center gap-2 rounded-2xl bg-amber-500/10 px-6 py-4 text-sm font-bold text-amber-600 transition-all hover:bg-amber-500/20 active:scale-95 disabled:opacity-50 dark:bg-amber-500/20 dark:text-amber-400"
          >
            ✨
            {isCleaning ? "Cleaning..." : "Clean"}
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 rounded-2xl bg-indigo-500 px-6 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-indigo-600 active:scale-95"
          >
            ＋ New Post
          </button>
        </div>
      </div>

      {showCreateForm && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <PostForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      <div
        className={`transition-opacity duration-300 ${isPending ? "opacity-50" : "opacity-100"}`}
      >
        <PostList
          posts={optimisticPosts}
          onLike={handleLike}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

      {hasMore && (
        <div className="flex justify-center pt-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="rounded-full bg-slate-200 dark:bg-zinc-800 px-8 py-3 text-sm font-bold text-foreground shadow-sm transition-all hover:bg-slate-300 dark:hover:bg-zinc-700 disabled:opacity-50"
          >
            {isLoadingMore ? "Loading..." : "Load More Posts"}
          </button>
        </div>
      )}
    </div>
  );
}
