import { processCV } from './documentService';

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

export const extractCVData = async (file: Express.Multer.File): Promise<CVData> => {
  return await processCV(file.buffer);
};