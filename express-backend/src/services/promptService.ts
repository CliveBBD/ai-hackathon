import { getContextFromMCP } from "./mcpClient";
import { callLLM } from "./llmClient";

export const generatePrompt = async (action: string) => {
  const context = await getContextFromMCP();
  const prompt = `The user performed action: ${action}.
Here is the context:\n${context}`;

  const llmResponse = await callLLM(prompt);

  return { prompt, response: llmResponse };
}
