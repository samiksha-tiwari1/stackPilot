import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const ws = await prisma.workspace.create({
    data: {
      id: "demo-workspace",
      name: "StackPilot AI",
    },
  });

  return NextResponse.json(ws);
}