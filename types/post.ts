import { Post, User } from "@/prisma/generated/prisma/client";

export type UserPost = Post & {
  author: User;
};
