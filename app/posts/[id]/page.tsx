import { Suspense } from "react";
import Link from "next/link";
import { SystemStatus } from "@/components/system-status";
import { PostDetail } from "@/components/post-detail";
import { PostDetailSkeleton } from "@/components/post-detail-skeleton";

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-background font-sans">
      <SystemStatus />

      <main className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-indigo-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to feed
        </Link>

        <Suspense fallback={<PostDetailSkeleton />}>
          <PostDetail id={id} />
        </Suspense>
      </main>
    </div>
  );
}
