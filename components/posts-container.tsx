import { getPosts } from "@/lib/post-actions";
import { PostFeed } from "./post-feed";

export async function PostsContainer() {
  const posts = await getPosts(0, 30);
  return <PostFeed initialPosts={posts} />;
}
