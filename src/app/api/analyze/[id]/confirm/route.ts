import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateLevel } from "@/lib/xp";

interface DetectedSkill {
  name: string;
  category: string;
  confidence: number;
  xpSuggested: number;
  reasoning: string;
}

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

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("User not found");

      const analysis = await tx.aiAnalysis.findUnique({ where: { id } });
      if (!analysis || analysis.userId !== userId) throw new Error("Analysis not found");
      if (analysis.status !== "PENDING") throw new Error("Analysis already processed");

      const detectedSkills = JSON.parse(analysis.detectedSkills as string) as DetectedSkill[];
      const totalXp = analysis.totalXpSuggested;
      let skillsUpdated = 0;

      for (const skill of detectedSkills) {
        if (skill.confidence < 0.3) continue;
        skillsUpdated++;

        const existingSkill = await tx.skill.findFirst({
          where: { userId, name: skill.name },
        });

        if (existingSkill) {
          await tx.skill.update({
            where: { id: existingSkill.id },
            data: { xp: { increment: skill.xpSuggested } },
          });
        } else {
          await tx.skill.create({
            data: {
              userId,
              name: skill.name,
              category: skill.category,
              xp: skill.xpSuggested,
            },
          });
        }
      }

      const newXp = user.xp + totalXp;
      const newLevelData = calculateLevel(newXp);
      const isLevelUp = newLevelData.level > user.level;

      await tx.user.update({
        where: { id: userId },
        data: { xp: newXp, ...(isLevelUp && { level: newLevelData.level }) },
      });

      await tx.xpEvent.create({
        data: {
          userId,
          amount: totalXp,
          reason: `AI-analyzed learning: ${analysis.summary.slice(0, 80)}`,
        },
      });

      await tx.aiAnalysis.update({
        where: { id },
        data: { status: "CONFIRMED", confirmedAt: new Date() },
      });

      if (isLevelUp) {
        await tx.levelHistory.create({
          data: {
            userId,
            fromLevel: user.level,
            toLevel: newLevelData.level,
            totalXp: newXp,
          },
        });
        await tx.xpEvent.create({
          data: {
            userId,
            amount: 0,
            reason: `Level up! ${user.level} -> ${newLevelData.level}`,
          },
        });
      }

      return {
        confirmed: true,
        xpAwarded: totalXp,
        skillsUpdated,
        levelUp: isLevelUp ? { from: user.level, to: newLevelData.level } : null,
      };
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Failed to confirm analysis" }, 
      { status: err.message === "User not found" || err.message === "Analysis not found" ? 404 : 400 }
    );
  }
}
