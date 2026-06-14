import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getNextUtcReset, getUtcDay } from "@/lib/daily-reset";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const completionDate = getUtcDay();

  const quests = await prisma.quest.findMany({
    where: {
      userId,
      isDaily: true,
    },
    include: {
      completions: {
        where: {
          userId,
          completionDate,
        },
      },
      skill: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const questsWithStatus = quests.map((quest) => ({
    ...quest,
    completedToday: quest.completions.length > 0,
  }));

  const completedToday = quests.filter(
    (q) => q.isDaily && q.completions.length > 0
  ).length;

  const totalDaily = quests.filter((q) => q.isDaily).length;

  return NextResponse.json({
    quests: questsWithStatus,
    completedToday,
    totalDaily,
    progressPercent: totalDaily > 0 ? Math.round((completedToday / totalDaily) * 100) : 0,
    resetAt: getNextUtcReset().toISOString(),
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const body = await request.json();
  const { title, description, xpReward = 10, skillId } = body;

  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const parsedXp = Number(xpReward);
  if (!Number.isInteger(parsedXp) || parsedXp < 1 || parsedXp > 100) {
    return NextResponse.json({ error: "XP reward must be between 1 and 100" }, { status: 400 });
  }

  const quest = await prisma.quest.create({
    data: {
      userId,
      title: title.trim(),
      description: description ?? null,
      xpReward: parsedXp,
      isDaily: true,
      skillId: skillId ?? null,
    },
  });

  return NextResponse.json(quest, { status: 201 });
}
