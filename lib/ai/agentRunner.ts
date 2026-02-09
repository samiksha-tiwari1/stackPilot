import { plannerAgent } from "./planner";
import { criticAgent } from "./critic";
import { assignerAgent } from "./assigner";
import { summarizerAgent } from "./summarizer";
import { prisma } from "@/lib/prisma";

export async function runAgents(doc: string) {
  const workspaceId = "demo-workspace";

  const plan = await plannerAgent(doc);
  await prisma.agentLog.create({
    data: {
      agent: "Planner",
      message: "Extracted tasks from document",
      workspaceId,
    },
  });

  const clean = await criticAgent(plan);
  await prisma.agentLog.create({
    data: {
      agent: "Critic",
      message: "Cleaned and refined tasks",
      workspaceId,
    },
  });

  const assigned = await assignerAgent(clean);
  await prisma.agentLog.create({
    data: {
      agent: "Assigner",
      message: "Assigned tasks to team members",
      workspaceId,
    },
  });

  const summary = await summarizerAgent(doc);
  await prisma.agentLog.create({
    data: {
      agent: "InsightAI",
      message: summary,
      workspaceId,
    },
  });

  return { assigned };
}