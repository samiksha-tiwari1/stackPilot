import { callOllama } from "./ollama";

export async function assignerAgent(tasks: string) {
  const prompt = `
You are a tech lead.

Assign each task to "Dev".

Return STRICT JSON:
[
  { "title": "task", "assignee": "Dev" }
]

Tasks:
${tasks}
`;

  return callOllama(prompt);
}