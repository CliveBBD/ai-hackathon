import { AzureOpenAI } from "openai";

const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT || "",
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  deployment: "gpt-4o",
  apiVersion: "2024-04-01-preview"
});

export const callLLM = async (prompt: string): Promise<string> => {
  try {
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt }
      ],
      max_tokens: 4096,
      temperature: 1,
      top_p: 1,
      model: "gpt-4o"
    });
    
    return response.choices[0]?.message?.content || 'No response';
  } catch (error) {
    console.error('Azure OpenAI API error:', error);
    return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

export default client;
