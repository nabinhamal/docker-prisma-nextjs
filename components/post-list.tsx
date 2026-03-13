import { UserPost } from "@/types/post";
import { PostCard } from "./post-card";

interface PostListProps {
  posts: UserPost[];
  onLike?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onEdit?: (postId: string, data: { title: string; content: string }) => Promise<void>;
}

export function PostList({ posts, onLike, onDelete, onEdit }: PostListProps) {
  if (posts.length === 0) {
    // ... (unchanged)
    return (
      <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 py-32 text-center dark:border-zinc-800">
        <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-zinc-900">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-400 dark:text-zinc-600"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M8 7h6" />
            <path d="M8 11h8" />
          </svg>
        </div>
        <h3 className="text-xl font-bold">No posts found</h3>
        <p className="mt-2 text-muted-foreground">
          Try seeding the database with dummy data.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard 
          key={post.id} 
          post={post} 
          onLike={onLike} 
          onDelete={onDelete}
          onEdit={onEdit} 
        />
      ))}
    </div>
  );
}
