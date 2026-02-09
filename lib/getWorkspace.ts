import { prisma } from "@/lib/prisma";

export async function getWorkspace(): Promise<string> {
  let ws = await prisma.workspace.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!ws) {
    ws = await prisma.workspace.create({
      data: { name: "StackPilot AI" },
    });
  }

  return ws.id;   // MUST be string
}