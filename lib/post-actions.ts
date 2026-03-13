"use server";

import prisma from "./prisma";
import { revalidatePath } from "next/cache";

export async function getPosts(skip: number = 0, take: number = 30) {
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

export async function toggleLike(postId: string) {
  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        likes: {
          increment: 1,
        },
      },
    });
    revalidatePath("/");
    return post;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw new Error("Failed to update like");
  }
}

export async function cleanupDuplicates() {
  try {
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
    return { deletedCount: idsToDelete.length };
  } catch (error) {
    console.error("Error cleaning up duplicates:", error);
    throw new Error("Failed to cleanup duplicates");
  }
}

export async function createPost(data: {
  title: string;
  content: string;
  authorId: string;
}) {
  try {
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
    return post;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
}

export async function updatePost(
  id: string,
  data: { title: string; content: string },
) {
  try {
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
    return post;
  } catch (error) {
    console.error("Error updating post:", error);
    throw new Error("Failed to update post");
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({
      where: { id },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Failed to delete post");
  }
}
