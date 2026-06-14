import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [xpEvents, levelHistory] = await Promise.all([
    prisma.xpEvent.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.levelHistory.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  // Merge and sort by date
  const activities = [
    ...xpEvents.map((e) => ({
      id: e.id,
      type: "xp" as const,
      amount: e.amount,
      reason: e.reason,
      createdAt: e.createdAt.toISOString(),
    })),
    ...levelHistory.map((e) => ({
      id: e.id,
      type: "level_up" as const,
      fromLevel: e.fromLevel,
      toLevel: e.toLevel,
      totalXp: e.totalXp,
      createdAt: e.createdAt.toISOString(),
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
   .slice(0, 20);

  return NextResponse.json({ activities });
}
