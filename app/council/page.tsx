import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatAgentMessage } from "@/lib/ai/formatAgentMessage";

/* ===================================================== */
/* FETCH LATEST COUNCIL RUN */
/* ===================================================== */

async function getAgentLogs() {
  const workspace = await prisma.workspace.findFirst();

  if (!workspace) return [];

  // latest log = newest AI run
  const latestLog = await prisma.agentLog.findFirst({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "desc" },
  });

  if (!latestLog) return [];

  // group logs from same execution window (10 sec)
  const since = new Date(latestLog.createdAt.getTime() - 10000);

  return prisma.agentLog.findMany({
    where: {
      workspaceId: workspace.id,
      createdAt: {
        gte: since,
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

/* ===================================================== */
/* PAGE */
/* ===================================================== */

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