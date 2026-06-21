import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { id } = await params;

  const roadmap = await prisma.roadmap.findUnique({
    where: { id },
  });

  if (!roadmap || roadmap.userId !== userId) {
    return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
  }

  const body = await request.json();
  const { parentId, title, description, isSubtopic } = body;

  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (parentId) {
    const parentNode = await prisma.roadmapNode.findUnique({
      where: { id: parentId },
    });

    if (!parentNode || parentNode.roadmapId !== id) {
      return NextResponse.json({ error: "Parent node not found" }, { status: 404 });
    }
  }

  const siblingCount = await prisma.roadmapNode.count({
    where: {
      roadmapId: id,
      parentId: parentId ?? null,
    },
  });

  const node = await prisma.roadmapNode.create({
    data: {
      roadmapId: id,
      parentId: parentId ?? null,
      title: title.trim(),
      description: description ?? null,
      isSubtopic: isSubtopic ?? false,
      sortOrder: siblingCount,
    },
  });

  return NextResponse.json(node, { status: 201 });
}
