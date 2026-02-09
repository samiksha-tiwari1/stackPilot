import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks);
  } catch (err) {
    console.error("TASK API ERROR:", err);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  const { title } = await req.json();

  const task = await prisma.task.create({
    data: {
      title,
      status: "todo",
      workspaceId: "demo-workspace",
    },
  });

  return NextResponse.json(task);
}