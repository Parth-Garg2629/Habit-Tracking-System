import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { analyzeWithGemini } from "@/lib/gemini";
import { z } from "zod";

const analyzeBodySchema = z.object({
  content: z.string().min(10, "Content must be at least 10 characters").max(5000, "Content must be under 5000 characters"),
  duration: z.number().min(1).max(720).nullable().optional(),
});

// POST — Submit content for AI analysis
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  let body;
  try {
    body = analyzeBodySchema.parse(await request.json());
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Fetch user's existing skills for context
  const existingSkills = await prisma.skill.findMany({
    where: { userId },
    select: { name: true },
  });
  const skillNames = existingSkills.map((s) => s.name);

  try {
    const analysis = await analyzeWithGemini(body.content, body.duration ?? null, skillNames);

    // Store the analysis in the database
    const saved = await prisma.aiAnalysis.create({
      data: {
        userId,
        logContent: body.content,
        detectedSkills: JSON.stringify(analysis.detectedSkills),
        totalXpSuggested: analysis.totalXpSuggested,
        summary: analysis.summary,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      id: saved.id,
      ...analysis,
    });
  } catch (err) {
    console.error("Gemini analysis error:", err);
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
