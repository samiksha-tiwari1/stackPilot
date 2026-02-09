import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getWorkspace } from "@/lib/getWorkspace";

export async function GET() {
  try {
    const workspaceId = await getWorkspace();
    const tasks = await prisma.task.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks);
  } catch (err) {
    console.error("TASK API ERROR:", err);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    const workspaceId = await getWorkspace();

    const task = await prisma.task.create({
      data: {
        title,
        status: "todo",
        workspaceId,
      },
    });

    return NextResponse.json(task);
  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}