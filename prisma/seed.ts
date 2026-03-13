import { PrismaPg } from "@prisma/adapter-pg";
import { faker } from "@faker-js/faker";
import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
  adapter,
});

export async function main() {
  console.log("Cleaning up database...");
  await prisma.post.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding 500 users with profiles and posts...");

  for (let i = 0; i < 500; i++) {
    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        profile: {
          create: {
            bio: faker.lorem.sentence(),
          },
        },
        posts: {
          create: Array.from({
            length: faker.number.int({ min: 1, max: 3 }),
          }).map(() => ({
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraphs(1),
            published: faker.datatype.boolean(),
          })),
        },
      },
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
