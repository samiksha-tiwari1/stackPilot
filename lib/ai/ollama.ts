export async function callOllama(prompt: string) {
  try {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen2:1.5b",
        prompt,
        stream: false,
      }),
    });

    if (!res.ok) {
      throw new Error("Ollama HTTP error");
    }

    const data = await res.json();

    if (!data.response) {
      throw new Error("No response from Ollama");
    }

    return data.response;
  } catch (err) {
    console.error("Ollama failed:", err);
    return "[]"; // never break agents chain
  }
}