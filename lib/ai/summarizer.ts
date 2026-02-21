import { callOllama } from "./ollama";

export async function summarizerAgent(tasks: string) {
  const prompt = `
Summarize these tasks in 2-3 sentences.

Do not invent anything.

If empty, return:
No activity.

Tasks:
${tasks}
`;

  return callOllama(prompt);
}