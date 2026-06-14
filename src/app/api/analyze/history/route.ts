import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const analyses = await prisma.aiAnalysis.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({
    analyses: analyses.map((a) => ({
      id: a.id,
      logContent: a.logContent,
      detectedSkills: a.detectedSkills,
      totalXpSuggested: a.totalXpSuggested,
      summary: a.summary,
      status: a.status,
      confirmedAt: a.confirmedAt?.toISOString() ?? null,
      createdAt: a.createdAt.toISOString(),
    })),
  });
}
