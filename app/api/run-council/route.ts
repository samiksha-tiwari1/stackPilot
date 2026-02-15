import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runAgents } from "@/lib/ai/agentRunner";

function tasksToDoc(
  tasks: { title: string; assignee: string | null }[]
) {
  return tasks
    .map(
      (t) =>
        `- ${t.title}${t.assignee ? ` (assigned to ${t.assignee})` : ""}`
    )
    .join("\n");
}

export async function POST() {
  try {
    const workspace = await prisma.workspace.findFirst();

    if (!workspace) {
      return NextResponse.json(
        { error: "No workspace" },
        { status: 404 }
      );
    }

    // -------- PLANNER (TODO only) --------
    const plannerTasks = await prisma.task.findMany({
      where: {
        workspaceId: workspace.id,
        status: "todo",
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // -------- CRITIC (IN_PROGRESS only) --------
    const criticTasks = await prisma.task.findMany({
      where: {
        workspaceId: workspace.id,
        status: "in_progress",
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // -------- ASSIGNER (ALL TASKS) --------
    const assignerTasks = await prisma.task.findMany({
      where: {
        workspaceId: workspace.id,
      },
      orderBy: { createdAt: "desc" },
    });

    // -------- INSIGHT (ALL TASKS) --------
    const insightTasks = assignerTasks;

    // build role docs
    const plannerDoc = tasksToDoc(plannerTasks);
    const criticDoc = tasksToDoc(criticTasks);
    const assignerDoc = tasksToDoc(assignerTasks);
    const insightDoc = tasksToDoc(insightTasks);

    // run agents with separate contexts
    await runAgents(
      plannerDoc,
      criticDoc,
      assignerDoc,
      insightDoc,
      workspace.id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}