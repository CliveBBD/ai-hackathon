import { extractDocumentText, callLLM } from './llmClient';

interface CVData {
  full_name?: string;
  bio?: string;
  linkedin_url?: string;
  github_url?: string;
  location?: string;
  skills?: string[];
  work_experience?: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    field: string;
    year: number;
  }>;
}

export const processCV = async (fileBuffer: Buffer): Promise<CVData> => {
  try {
    const extractedText = await extractDocumentText(fileBuffer);
    const prompt = `Extract CV information from this text and return ONLY valid JSON:

${extractedText}

Return ONLY this JSON structure:
{
  "full_name": "extracted full name",
  "bio": "professional summary or about section",
  "linkedin_url": "linkedin profile URL if found",
  "github_url": "github profile URL if found",
  "location": "city, country or location",
  "skills": ["skill1", "skill2", "skill3"],
  "work_experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "duration": "Start - End dates",
      "description": "Job responsibilities and achievements"
    }
  ],
  "education": [
    {
      "institution": "University/School Name",
      "degree": "Degree Type",
      "field": "Field of Study",
      "year": 2023
    }
  ]
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