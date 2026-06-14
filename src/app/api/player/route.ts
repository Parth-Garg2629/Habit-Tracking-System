import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateLevel, getLevelTier } from "@/lib/xp";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, xp: true, level: true, createdAt: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const levelData = calculateLevel(user.xp);
  const tier = getLevelTier(levelData.level);

  return NextResponse.json({
    ...user,
    level: levelData.level,
    currentLevelXp: levelData.currentLevelXp,
    xpForNextLevel: levelData.xpForNextLevel,
    progressPercent: levelData.progressPercent,
    totalXp: levelData.totalXp,
    tier,
  });
}
