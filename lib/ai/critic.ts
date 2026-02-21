import { callOllama } from "./ollama";

export async function criticAgent(tasks: string) {
  const prompt = `
You are a senior engineering reviewer.

Review the task list below.

Your job:
- Identify vague tasks
- Identify duplicates
- Identify missing technical specificity
- Suggest improvements

DO NOT rewrite tasks.
DO NOT return JSON.
Return short bullet point feedback only.

If tasks look solid, say:
"Tasks look well defined."

Tasks:
${tasks}
`;

  return callOllama(prompt);
}