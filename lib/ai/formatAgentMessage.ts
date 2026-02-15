/* ====================================================== */
/* TYPES */
/* ====================================================== */

export type AgentTask = {
  title: string;
  assignee?: string;
};

/* ====================================================== */
/* TYPE CHECK */
/* ====================================================== */

function isTask(value: unknown): value is AgentTask {
  return (
    typeof value === "object" &&
    value !== null &&
    "title" in value &&
    typeof (value as { title: unknown }).title === "string"
  );
}

/* ====================================================== */
/* RECURSIVE TASK EXTRACTOR */
/* ====================================================== */

function extractTasks(data: unknown): AgentTask[] {
  const tasks: AgentTask[] = [];

  if (Array.isArray(data)) {
    for (const item of data) {
      tasks.push(...extractTasks(item));
    }
  } else if (isTask(data)) {
    tasks.push(data);
  } else if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;

    for (const key of Object.keys(obj)) {
      tasks.push(...extractTasks(obj[key]));
    }
  }

  return tasks;
}

/* ====================================================== */
/* MAIN FORMATTER (EXPORT THIS) */
/* ====================================================== */

export function formatAgentMessage(message: string): string {
  try {
    const parsed: unknown = JSON.parse(message);

    const tasks = extractTasks(parsed);

    if (tasks.length > 0) {
      return tasks
        .map((task) =>
          task.assignee
            ? `• ${task.title} → ${task.assignee}`
            : `• ${task.title}`
        )
        .join("\n");
    }

    return message;
  } catch {
    // InsightAI plain text
    return message;
  }
}