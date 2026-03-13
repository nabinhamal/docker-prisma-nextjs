import { safeAction } from "./safe-action";
import prisma from "./prisma";
import { revalidatePath, cacheTag, updateTag } from "next/cache";

export async function getPosts(skip: number = 0, take: number = 30) {
  "use cache";
  cacheTag("posts");

  try {
    const posts = await prisma.post.findMany({
      skip,
      take,
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export const toggleLike = safeAction(async (postId: string) => {
  const post = await prisma.post.update({
    where: { id: postId },
    data: {
      likes: {
        increment: 1,
      },
    },
  });
  revalidatePath("/");
  updateTag("posts");
  return post;
});

export const cleanupDuplicates = safeAction(async () => {
  const posts = await prisma.post.findMany({
    select: { id: true, title: true, content: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const seen = new Set<string>();
  const idsToDelete: string[] = [];

  for (const post of posts) {
    const key = `${post.title.trim()}|${post.content.trim()}`;
    if (seen.has(key)) {
      idsToDelete.push(post.id);
    } else {
      seen.add(key);
    }
  }

  if (idsToDelete.length > 0) {
    await prisma.post.deleteMany({
      where: {
        id: { in: idsToDelete },
      },
    });
  }

  revalidatePath("/");
  updateTag("posts");
  return { deletedCount: idsToDelete.length };
});

export const createPost = safeAction(
  async (data: { title: string; content: string; authorId: string }) => {
    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        authorId: data.authorId,
        published: true,
      },
      include: {
        author: true,
      },
    });
    revalidatePath("/");
    updateTag("posts");
    return post;
  },
);

export const updatePost = safeAction(
  async (id: string, data: { title: string; content: string }) => {
    const post = await prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
      },
      include: {
        author: true,
      },
    });
    revalidatePath("/");
    updateTag("posts");
    return post;
  },
);

export const deletePost = safeAction(async (id: string) => {
  await prisma.post.delete({
    where: { id },
  });
  revalidatePath("/");
  updateTag("posts");
  return { success: true };
});
