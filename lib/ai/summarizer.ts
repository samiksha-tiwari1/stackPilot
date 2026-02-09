import { callOllama } from "./ollama";

export async function summarizerAgent(doc: string) {
  const prompt = `
Summarize this document into a short activity update.

${doc}
`;

  return callOllama(prompt);
}