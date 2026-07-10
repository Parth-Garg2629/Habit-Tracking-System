import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create demo user (Player)
  const passwordHash = await hash("hunter123", 10);
  
  const user = await prisma.user.upsert({
    where: { email: "demo@thesystem.app" },
    update: {},
    create: {
      email: "demo@thesystem.app",
      name: "Sung Jin-Woo",
      passwordHash,
      level: 1,
      xp: 0,
    },
  });

  console.log(`Created new Player: ${user.name} (${user.email})`);

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
