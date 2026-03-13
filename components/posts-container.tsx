import prisma from "@/lib/prisma";
import { PostFeed } from "./post-feed";

export async function PostsContainer() {
  // Simulate slow loading to see the skeleton
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  const posts = await prisma.post.findMany({
    take: 30,
    skip: 30,
    include: {
      author: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <PostFeed initialPosts={posts} />;
}
