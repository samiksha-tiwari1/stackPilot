import { callOllama } from "./ollama";

export async function criticAgent(tasks: string) {
  const prompt = `
You are a strict reviewer.

Remove vague or duplicate tasks.

If a task is generic, delete it.

Return STRICT JSON in same format:
[
  { "title": "refined task" }
]

Tasks:
${tasks}
`;

  return callOllama(prompt);
}