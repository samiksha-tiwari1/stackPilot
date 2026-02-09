import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const logs = await prisma.agentLog.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(logs);
}