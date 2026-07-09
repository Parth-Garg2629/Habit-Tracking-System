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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newXp = user.xp + quest.xpReward;
    const newLevelData = calculateLevel(newXp);
    const isLevelUp = newLevelData.level > user.level;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tx: any[] = [
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
        data: { 
          xp: newXp,
          ...(isLevelUp && { level: newLevelData.level })
        },
      }),
    ];

    if (isLevelUp) {
      tx.push(
        prisma.levelHistory.create({
          data: {
            userId,
            fromLevel: user.level,
            toLevel: newLevelData.level,
            totalXp: newXp,
          },
        })
      );
      tx.push(
        prisma.xpEvent.create({
          data: {
            userId,
            amount: 0,
            reason: `Level up! ${user.level} -> ${newLevelData.level}`,
          },
        })
      );
    }

    const [completion] = await prisma.$transaction(tx);

    return NextResponse.json({
      ...quest,
      completedToday: true,
      xpAwarded: completion.xpAwarded,
      levelUp: isLevelUp ? { from: user.level, to: newLevelData.level } : null,
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
