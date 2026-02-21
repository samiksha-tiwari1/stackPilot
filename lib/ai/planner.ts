import { callOllama } from "./ollama";

export async function plannerAgent(context: string) {
  const prompt = `
Extract concrete engineering tasks from the document.
Return each task as a bullet point.
Do not explain.

Context:
${context}
`;

  return callOllama(prompt);
}