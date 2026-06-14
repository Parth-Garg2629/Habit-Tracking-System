import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create demo user
  const passwordHash = await hash("hunter123", 10);
  
  const user = await prisma.user.upsert({
    where: { email: "demo@thesystem.app" },
    update: {},
    create: {
      email: "demo@thesystem.app",
      name: "Hunter",
      passwordHash,
      level: 5,
      xp: 450,
    },
  });

  console.log(`Created demo user: ${user.email}`);

  // Create some initial skills
  const skills = [
    { name: "TypeScript", category: "language", xp: 120, level: 2 },
    { name: "React", category: "framework", xp: 350, level: 3 },
    { name: "System Design", category: "concept", xp: 50, level: 1 },
    { name: "Deep Work", category: "soft_skill", xp: 210, level: 3 },
  ];

  for (const skill of skills) {
    await prisma.skill.create({
      data: {
        ...skill,
        userId: user.id,
      },
    });
  }

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
