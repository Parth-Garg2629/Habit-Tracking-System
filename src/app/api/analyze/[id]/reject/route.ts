import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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

  await prisma.aiAnalysis.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  return NextResponse.json({ rejected: true });
}
