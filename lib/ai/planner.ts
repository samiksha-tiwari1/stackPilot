import { callOllama } from "./ollama";

export async function plannerAgent(doc: string) {
  const prompt = `
You are a senior software project planner.

From the document, extract ONLY real, meaningful engineering tasks.

Rules:
- Tasks must be specific and actionable
- No generic words like "task", "project", "work"
- Each task must describe real work
- 5 to 8 tasks maximum

Return STRICT JSON:
[
  { "title": "specific task here" }
]

Document:
${doc}
`;

  return callOllama(prompt);
}