import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getWorkspace } from "@/lib/getWorkspace";

export async function GET() {
  const workspaceId = await getWorkspace();

  const docs = await prisma.doc.findMany({
    where: {
      workspaceId: workspaceId,   // ← EXPLICIT
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(docs);
}

export async function POST(req: Request) {
  const { title, content } = await req.json();
  const workspaceId = await getWorkspace();

  const doc = await prisma.doc.create({
    data: {
      title,
      content,
      workspaceId: workspaceId,   // ← EXPLICIT
    },
  });

  return NextResponse.json(doc);
}