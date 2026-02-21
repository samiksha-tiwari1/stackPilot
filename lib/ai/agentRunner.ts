import { plannerAgent } from "./planner";
import { summarizerAgent } from "./summarizer";
import { criticAgent } from "./critic";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

/* ===================================================== */
/* Helpers                                               */
/* ===================================================== */

function parseBullets(text: string) {
  return text
    .split("\n")
    .map(line => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean)
    .map(title => ({ title }));
}

function removeDuplicates(tasks: { title: string }[]) {
  const seen = new Set<string>();
  return tasks.filter(t => {
    if (seen.has(t.title)) return false;
    seen.add(t.title);
    return true;
  });
}

function removeVagueTasks(tasks: { title: string }[]) {
  const vagueWords = ["improve", "better", "enhance", "handle errors properly"];

  return tasks.filter(t =>
    !vagueWords.some(word =>
      t.title.toLowerCase().includes(word)
    )
  );
}

function assignTasks(tasks: { title: string }[]) {
  return tasks.map(t => ({
    ...t,
    assignee: "Dev"
  }));
}

/* ===================================================== */
/* runAgents                                             */
/* ===================================================== */

export async function runAgents(
  context: string,
  workspaceId: string
) {
  const runId = randomUUID();

  /* ----------------------------
     1. PLANNER (AI)
  ---------------------------- */

  const plannerRaw = await plannerAgent(context);

  await prisma.agentLog.create({
    data: {
      agent: "Planner",
      message: plannerRaw,
      workspaceId,
      runId,
    },
  });

  /* ----------------------------
     2. System Cleaning (JS)
  ---------------------------- */

  const parsedTasks = parseBullets(plannerRaw);
  const uniqueTasks = removeDuplicates(parsedTasks);
  const filteredTasks = removeVagueTasks(uniqueTasks);
  const assignedTasks = assignTasks(filteredTasks);

  const assignedText = assignedTasks
    .map(t => `• ${t.title} → ${t.assignee}`)
    .join("\n");

  await prisma.agentLog.create({
    data: {
      agent: "Assigner",
      message: assignedText,
      workspaceId,
      runId,
    },
  });

  /* ----------------------------
     3. CRITIC (AI Commentary Only)
  ---------------------------- */

  const criticRaw = await criticAgent(assignedText);

  await prisma.agentLog.create({
    data: {
      agent: "Critic",
      message: criticRaw,
      workspaceId,
      runId,
    },
  });

  /* ----------------------------
     4. INSIGHT (AI Summary)
  ---------------------------- */

  const summaryRaw = await summarizerAgent(assignedText);

  await prisma.agentLog.create({
    data: {
      agent: "InsightAI",
      message: summaryRaw,
      workspaceId,
      runId,
    },
  });

  return {
    runId,
    finalTasks: assignedTasks,
  };
}