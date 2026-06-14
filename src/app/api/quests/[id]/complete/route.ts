import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { getNextUtcReset, getUtcDay } from "@/lib/daily-reset";
import { prisma } from "@/lib/prisma";
import { calculateLevel } from "@/lib/xp";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { id } = await params;
  const completionDate = getUtcDay();

  const quest = await prisma.quest.findUnique({
    where: { id },
  });

  if (!quest || quest.userId !== userId) {
    return NextResponse.json({ error: "Quest not found" }, { status: 404 });
  }

  if (!quest.isDaily) {
    return NextResponse.json({ error: "Only daily quests can be completed here" }, { status: 400 });
  }

  try {
    const [completion, , updatedUser] = await prisma.$transaction([
      prisma.questCompletion.create({
        data: {
          questId: id,
          userId,
          completionDate,
          xpAwarded: quest.xpReward,
        },
      }),
      prisma.xpEvent.create({
        data: {
          userId,
          amount: quest.xpReward,
          reason: `Completed quest: ${quest.title}`,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: quest.xpReward } },
      }),
    ]);

    const newLevelData = calculateLevel(updatedUser.xp);
    const levelUp =
      newLevelData.level > updatedUser.level
        ? { from: updatedUser.level, to: newLevelData.level }
        : null;

    if (levelUp) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { level: newLevelData.level },
        }),
        prisma.levelHistory.create({
          data: {
            userId,
            fromLevel: updatedUser.level,
            toLevel: newLevelData.level,
            totalXp: updatedUser.xp,
          },
        }),
        prisma.xpEvent.create({
          data: {
            userId,
            amount: 0,
            reason: `Level up! ${updatedUser.level} -> ${newLevelData.level}`,
          },
        }),
      ]);
    }

    return NextResponse.json({
      ...quest,
      completedToday: true,
      xpAwarded: completion.xpAwarded,
      levelUp,
      resetAt: getNextUtcReset().toISOString(),
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Quest already completed today" },
        { status: 409 }
      );
    }

    throw error;
  }
}
