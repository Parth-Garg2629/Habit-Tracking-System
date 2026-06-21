import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"] as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; nodeId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { id, nodeId } = await params;

  const roadmap = await prisma.roadmap.findUnique({
    where: { id },
  });

  if (!roadmap || roadmap.userId !== userId) {
    return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
  }

  const node = await prisma.roadmapNode.findUnique({
    where: { id: nodeId },
  });

  if (!node || node.roadmapId !== id) {
    return NextResponse.json({ error: "Node not found" }, { status: 404 });
  }

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    data.title = body.title.trim();
  }
  if (body.description !== undefined) data.description = body.description;
  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json(
        { error: "Status must be one of: NOT_STARTED, IN_PROGRESS, COMPLETED" },
        { status: 400 }
      );
    }
    data.status = body.status;
  }
  if (body.isSubtopic !== undefined) data.isSubtopic = Boolean(body.isSubtopic);
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder);

  const updated = await prisma.roadmapNode.update({
    where: { id: nodeId },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; nodeId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { id, nodeId } = await params;

  const roadmap = await prisma.roadmap.findUnique({
    where: { id },
  });

  if (!roadmap || roadmap.userId !== userId) {
    return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
  }

  const node = await prisma.roadmapNode.findUnique({
    where: { id: nodeId },
  });

  if (!node || node.roadmapId !== id) {
    return NextResponse.json({ error: "Node not found" }, { status: 404 });
  }

  // Recursively collect all descendant IDs since SQLite doesn't support
  // self-referencing cascade deletes reliably
  async function collectDescendantIds(parentId: string): Promise<string[]> {
    const children = await prisma.roadmapNode.findMany({
      where: { parentId },
      select: { id: true },
    });
    const ids: string[] = [];
    for (const child of children) {
      ids.push(child.id);
      const grandchildren = await collectDescendantIds(child.id);
      ids.push(...grandchildren);
    }
    return ids;
  }

  const descendantIds = await collectDescendantIds(nodeId);
  const allIdsToDelete = [nodeId, ...descendantIds];

  await prisma.roadmapNode.deleteMany({
    where: { id: { in: allIdsToDelete } },
  });

  return NextResponse.json({ success: true });
}
