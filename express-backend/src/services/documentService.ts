import { extractDocumentText, callLLM } from './llmClient';

interface CVData {
  name?: string;
  email?: string;
  phone?: string;
  about?: string;
  github?: string;
  profile?: string;
  skills?: string[];
  experience?: string[];
  education?: string[];
}

export const processCV = async (fileBuffer: Buffer): Promise<CVData> => {
  try {
    const extractedText = await extractDocumentText(fileBuffer);
    
    const prompt = `Extract CV information from this text and return ONLY valid JSON:

${extractedText}

Return ONLY this JSON structure:
{
  "name": "extracted name",
  "email": "extracted email", 
  "phone": "extracted phone",
  "about": "summary or about section",
  "github": "github link if found",
  "profile": "linkedin or portfolio link if found",
  "skills": ["skill1", "skill2"],
  "experience": ["job1", "job2"],
  "education": ["degree1", "degree2"]
}

No explanations, just JSON.`;

    const llmResponse = await callLLM(prompt);
    const cleanResponse = llmResponse.replace(/```json\n?|```\n?/g, '').trim();
    
    try {
      const parsedData = JSON.parse(cleanResponse);
      return parsedData;
    } catch (parseError) {
      throw new Error('Failed to parse CV data');
    }
  } catch (error) {
    throw new Error('Failed to process CV');
  }
};