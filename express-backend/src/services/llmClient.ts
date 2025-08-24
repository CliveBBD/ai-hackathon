import { AzureOpenAI } from "openai";
import DocumentIntelligence, { getLongRunningPoller } from "@azure-rest/ai-document-intelligence";
import { AzureKeyCredential } from "@azure/core-auth";

const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  deployment: "gpt-4o",
  apiVersion: "2024-04-01-preview"
});

const docClient = DocumentIntelligence(
  process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT!,
  new AzureKeyCredential(
    process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY!
  )
);

export const extractDocumentText = async (fileBuffer: Buffer): Promise<string> => {
  try {
    const base64Source = fileBuffer.toString('base64');
    
    const initialResponse = await docClient
      .path("/documentModels/{modelId}:analyze", "prebuilt-read")
      .post({
        contentType: "application/json",
        body: {
          base64Source,
        },
      });

    const poller = getLongRunningPoller(docClient, initialResponse);
    const result = await poller.pollUntilDone();
    
    return (result.body as any).analyzeResult?.content || '';
  } catch (error) {
    console.error('Document Intelligence error:', error);
    throw new Error('Document text extraction failed');
  }
};

export const callLLM = async (prompt: string): Promise<string> => {
  try {
    const response = await client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.1,
      model: "gpt-4o"
    });
    
    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Azure OpenAI error:', error);
    throw new Error('Azure OpenAI API call failed');
  }
}

export default client;
