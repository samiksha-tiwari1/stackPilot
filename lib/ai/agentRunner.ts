import { plannerAgent } from "./planner";
import { criticAgent } from "./critic";
import { assignerAgent } from "./assigner";
import { summarizerAgent } from "./summarizer";
import { cleanOutput } from "./cleanOutput";
import { prisma } from "@/lib/prisma";

export async function runAgents(
  plannerDoc: string,
  criticDoc: string,
  assignerDoc: string,
  insightDoc: string,
  workspaceId: string
) {
  // ---------- PLANNER ----------
  const plan = cleanOutput(await plannerAgent(plannerDoc));
  console.log("PLANNER OUTPUT:", plan);

  await prisma.agentLog.create({
    data: {
      agent: "Planner",
      message: plan,
      workspaceId,
    },
  });

  // ---------- CRITIC ----------
  const clean = cleanOutput(await criticAgent(criticDoc));
  console.log("CRITIC OUTPUT:", clean);

  await prisma.agentLog.create({
    data: {
      agent: "Critic",
      message: clean,
      workspaceId,
    },
  });

  // ---------- ASSIGNER ----------
  const assigned = cleanOutput(await assignerAgent(assignerDoc));
  console.log("ASSIGNER OUTPUT:", assigned);

  await prisma.agentLog.create({
    data: {
      agent: "Assigner",
      message: assigned,
      workspaceId,
    },
  });

  // ---------- INSIGHT ----------
  const summary = cleanOutput(await summarizerAgent(insightDoc));
  console.log("SUMMARY OUTPUT:", summary);

  await prisma.agentLog.create({
    data: {
      agent: "InsightAI",
      message: summary,
      workspaceId,
    },
  });

  return { assigned };
}