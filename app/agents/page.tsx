import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

/* ---------- Types ---------- */
type AgentTask = {
  title: string;
  assignee?: string;
};

/* ---------- Type Guard ---------- */
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

/* ---------- Smart Formatter ---------- */
function formatMessage(message: string): string {
  try {
    const parsed: unknown = JSON.parse(message);

    // CASE 1 → direct array
    if (isAgentTaskArray(parsed)) {
      return parsed
        .map((t) =>
          t.assignee
            ? `• ${t.title} → ${t.assignee}`
            : `• ${t.title}`
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
            .map((t) =>
              t.assignee
                ? `• ${t.title} → ${t.assignee}`
                : `• ${t.title}`
            )
            .join("\n");
        }
      }
    }

    return message;
  } catch {
    // InsightAI plain text
    return message;
  }
}

/* ---------- Fetch Logs ---------- */
async function getLogs() {
  const workspace = await prisma.workspace.findFirst();

  if (!workspace) return [];

  return prisma.agentLog.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

/* ---------- Page ---------- */
export default async function AgentsPage() {
  const logs = await getLogs();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Actions</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          {logs.length === 0 ? (
            <p className="text-muted-foreground">
              No AI actions yet.
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

                <p className="whitespace-pre-line leading-relaxed">
                  {formatMessage(log.message)}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}