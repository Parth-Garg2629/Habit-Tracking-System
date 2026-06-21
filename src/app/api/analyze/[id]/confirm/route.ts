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

  const analysis = await prisma.aiAnalysis.findUnique({ where: { id } });

  if (!analysis || analysis.userId !== userId) {
    return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
  }

  if (analysis.status !== "PENDING") {
    return NextResponse.json({ error: "Analysis already processed" }, { status: 400 });
  }

  const detectedSkills = JSON.parse(analysis.detectedSkills as string) as DetectedSkill[];
  const totalXp = analysis.totalXpSuggested;

  // Build transaction operations
  const operations = [];

  // 1. Update or create skills
  for (const skill of detectedSkills) {
    if (skill.confidence < 0.3) continue; // Skip low-confidence detections

    const existingSkill = await prisma.skill.findFirst({
      where: {
        userId,
        name: skill.name,
      },
    });

    if (existingSkill) {
      operations.push(
        prisma.skill.update({
          where: { id: existingSkill.id },
          data: { xp: { increment: skill.xpSuggested } },
        })
      );
    } else {
      operations.push(
        prisma.skill.create({
          data: {
            userId,
            name: skill.name,
            category: skill.category,
            xp: skill.xpSuggested,
          },
        })
      );
    }
  }

  // 2. Award XP to user
  operations.push(
    prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: totalXp } },
    })
  );

  // 3. Create XP event
  operations.push(
    prisma.xpEvent.create({
      data: {
        userId,
        amount: totalXp,
        reason: `AI-analyzed learning: ${analysis.summary.slice(0, 80)}`,
      },
    })
  );

  // 4. Mark analysis as confirmed
  operations.push(
    prisma.aiAnalysis.update({
      where: { id },
      data: { status: "CONFIRMED", confirmedAt: new Date() },
    })
  );

  await prisma.$transaction(operations);

  // Check for level-up
  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true, level: true },
  });

  let levelUp = null;
  if (updatedUser) {
    const newLevelData = calculateLevel(updatedUser.xp);
    if (newLevelData.level > updatedUser.level) {
      levelUp = { from: updatedUser.level, to: newLevelData.level };
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
            reason: `Level up! ${updatedUser.level} → ${newLevelData.level}`,
          },
        }),
      ]);
    }
  }

  return NextResponse.json({
    confirmed: true,
    xpAwarded: totalXp,
    skillsUpdated: detectedSkills.filter((s) => s.confidence >= 0.3).length,
    levelUp,
  });
}
