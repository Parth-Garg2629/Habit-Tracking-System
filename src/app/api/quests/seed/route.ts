import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getDefaultQuests } from "@/lib/seed-quests";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const existingCount = await prisma.quest.count({
    where: { userId },
  });

  if (existingCount > 0) {
    return NextResponse.json(
      { error: "User already has quests" },
      { status: 400 }
    );
  }

  const defaults = getDefaultQuests();

  const quests = await prisma.$transaction(
    defaults.map((q) =>
      prisma.quest.create({
        data: {
          userId,
          title: q.title,
          description: q.description,
          xpReward: q.xpReward,
          isDaily: q.isDaily,
        },
      })
    )
  );

  return NextResponse.json(quests, { status: 201 });
}
