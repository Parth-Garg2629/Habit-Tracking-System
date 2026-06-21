import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const body = await request.json();
  const { name } = body;

  if (name !== undefined && name !== null) {
    if (typeof name !== "string" || name.trim().length > 100) {
      return NextResponse.json({ error: "Name must be a string under 100 characters" }, { status: 400 });
    }
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: { name: typeof name === "string" ? name.trim() : name },
    select: { id: true, name: true, email: true, image: true },
  });

  return NextResponse.json(updated);
}
