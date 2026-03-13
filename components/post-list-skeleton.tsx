import { PostSkeleton } from "./post-skeleton";

export function PostListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}
