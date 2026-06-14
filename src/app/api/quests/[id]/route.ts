import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { id } = await params;

  const quest = await prisma.quest.findUnique({
    where: { id },
  });

  if (!quest || quest.userId !== userId) {
    return NextResponse.json({ error: "Quest not found" }, { status: 404 });
  }

  await prisma.quest.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { id } = await params;

  const quest = await prisma.quest.findUnique({
    where: { id },
  });

  if (!quest || quest.userId !== userId) {
    return NextResponse.json({ error: "Quest not found" }, { status: 404 });
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
  if (body.xpReward !== undefined) {
    const parsedXp = Number(body.xpReward);
    if (!Number.isInteger(parsedXp) || parsedXp < 1 || parsedXp > 100) {
      return NextResponse.json({ error: "XP reward must be between 1 and 100" }, { status: 400 });
    }
    data.xpReward = parsedXp;
  }
  if (body.isDaily !== undefined) data.isDaily = Boolean(body.isDaily);

  const updated = await prisma.quest.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}
