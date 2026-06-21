import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const roadmaps = await prisma.roadmap.findMany({
    where: { userId },
    include: {
      _count: {
        select: { nodes: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const roadmapsWithCount = roadmaps.map((roadmap) => ({
    ...roadmap,
    nodeCount: roadmap._count.nodes,
    _count: undefined,
  }));

  return NextResponse.json({ roadmaps: roadmapsWithCount });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const body = await request.json();
  const { title, description } = body;

  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const roadmap = await prisma.roadmap.create({
    data: {
      userId,
      title: title.trim(),
      description: description ?? null,
    },
  });

  return NextResponse.json(roadmap, { status: 201 });
}
