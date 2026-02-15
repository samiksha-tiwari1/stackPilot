import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ---------- Types ----------
type AgentTask = {
  title: string;
  assignee?: string;
};

// ---------- Type Guard ----------
function isAgentTaskArray(data: unknown): data is AgentTask[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "title" in item &&
        typeof (item as { title: unknown }).title === "string"
    )
  );
}

// ---------- Smart Formatter ----------
function formatMessage(message: string): string {
  try {
    const parsed: unknown = JSON.parse(message);

    // CASE 1 → direct array
    if (isAgentTaskArray(parsed)) {
      return parsed
        .map((item) =>
          item.assignee
            ? `• ${item.title} → ${item.assignee}`
            : `• ${item.title}`
        )
        .join("\n");
    }

    // CASE 2 → object containing arrays
    if (typeof parsed === "object" && parsed !== null) {
      const obj = parsed as Record<string, unknown>;

      for (const key in obj) {
        const value = obj[key];

        if (isAgentTaskArray(value)) {
          return value
            .map((item) =>
              item.assignee
                ? `• ${item.title} → ${item.assignee}`
                : `• ${item.title}`
            )
            .join("\n");
        }
      }
    }

    return message;
  } catch {
    // InsightAI stays clean
    return message;
  }
}

// ---------- Helper ----------
async function getWorkspace() {
  const workspace = await prisma.workspace.findFirst();
  return workspace?.id;
}

// ---------- API ----------
export async function GET() {
  try {
    const workspaceId = await getWorkspace();

    if (!workspaceId) {
      return NextResponse.json({
        tasksCreated: 0,
        aiActions: 0,
        pending: 0,
        standup: "No workspace found.",
      });
    }

    // ---------- TASKS ----------
    const tasks = await prisma.task.findMany({
      where: { workspaceId },
    });

    const tasksCreated = tasks.length;

    const pending = tasks.filter(
      (task) => task.status !== "done"
    ).length;

    // ---------- AGENT LOGS ----------
    const logs = await prisma.agentLog.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: 4,
    });

    const aiActions = await prisma.agentLog.count({
      where: { workspaceId },
    });

    // ---------- CLEAN STANDUP ----------
    const standup =
      logs.length === 0
        ? "No AI activity yet."
        : logs
            .map(
              (log) =>
                `${log.agent}:\n${formatMessage(log.message)}`
            )
            .join("\n\n");

    return NextResponse.json({
      tasksCreated,
      aiActions,
      pending,
      standup,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return NextResponse.json({
      tasksCreated: 0,
      aiActions: 0,
      pending: 0,
      standup: "Failed to load dashboard.",
    });
  }
}