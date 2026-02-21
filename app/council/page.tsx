export const dynamic = "force-dynamic";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatAgentMessage } from "@/lib/ai/formatAgentMessage";

/*
  Fetch the latest AI council execution using runId.

  Instead of guessing by timestamps,
  we fetch the newest log with a non-null runId
  and then fetch all logs that share that runId.
*/

async function getAgentLogs() {
  const workspace = await prisma.workspace.findFirst();

  if (!workspace) return [];

  // Get the most recent log that has a runId
  const latestLog = await prisma.agentLog.findFirst({
    where: {
      workspaceId: workspace.id,
      runId: { not: null },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!latestLog || !latestLog.runId) return [];

  // Fetch all logs belonging to the same execution
  return prisma.agentLog.findMany({
    where: {
      workspaceId: workspace.id,
      runId: latestLog.runId,
    },
    orderBy: { createdAt: "asc" },
  });
}

export default async function CouncilPage() {
  const logs = await getAgentLogs();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agent Council</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          {logs.length === 0 ? (
            <p className="text-muted-foreground">
              No agent activity yet.
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="border rounded-lg p-4 bg-muted/40"
              >
                <p className="font-semibold mb-2 text-base">
                  {log.agent}
                </p>

                <p className="whitespace-pre-line leading-relaxed text-sm">
                  {formatAgentMessage(log.message)}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}