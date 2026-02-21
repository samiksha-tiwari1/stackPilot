import { callOllama } from "./ollama";

export async function assignerAgent(tasks: string) {
  const prompt = `
Assign every task to Dev.

Return JSON:

[
  { "title": "exact task text", "assignee": "Dev" }
]

Tasks:
${tasks}
`;

  return callOllama(prompt);
}