import { processCV } from './documentService';

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

export const extractCVData = async (file: Express.Multer.File): Promise<CVData> => {
  return await processCV(file.buffer);
};