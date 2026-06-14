import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const userId = session.user.id;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setUTCHours(0,0,0,0);
  
  const [xpEvents, questsCompleted, journalEntries] = await Promise.all([
    prisma.xpEvent.findMany({
      where: { userId, createdAt: { gte: sevenDaysAgo } },
      select: { amount: true, createdAt: true }
    }),
    prisma.questCompletion.count({
      where: { userId, completedAt: { gte: sevenDaysAgo } }
    }),
    prisma.aiAnalysis.count({
      where: { userId, createdAt: { gte: sevenDaysAgo } }
    })
  ]);
  
  const totalXpEarned = xpEvents.reduce((acc, event) => acc + event.amount, 0);
  
  // Group XP by day for the chart
  const xpByDay = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const amount = xpEvents
      .filter(e => e.createdAt.toISOString().split('T')[0] === dateStr)
      .reduce((sum, e) => sum + e.amount, 0);
    return { date: dateStr, amount };
  });

  return NextResponse.json({
    totalXpEarned,
    questsCompleted,
    journalEntries,
    xpByDay
  });
}
