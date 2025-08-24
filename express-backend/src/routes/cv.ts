import { Router } from "express";
import multer from "multer";
import { extractCVData } from "../services/cvService";
import { uploadToBlob } from "../services/storageService";
import Profile from "../models/profile.model";
import { isAuthenticated } from "../middleware/auth.middleware";

const cvRouter = Router();
cvRouter.use(isAuthenticated)

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    cb(null, allowed.includes(file.mimetype));
  }
});

cvRouter.post("/upload", upload.any() as any, async (req: any, res: any) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No CV file uploaded" });
    }

    const cvFile = req.files[0];
    console.log('File received:', cvFile.originalname, 'Size:', cvFile.size);
    
    const fileUrl = await uploadToBlob(cvFile.buffer, cvFile.originalname);
    
    const extractedData = await extractCVData(cvFile);
    
    const profileUpdate = {
      full_name: extractedData.full_name,
      bio: extractedData.bio,
      linkedin_url: extractedData.linkedin_url,
      github_url: extractedData.github_url,
      location: extractedData.location,
      skills: extractedData.skills?.map(skill => ({ name: skill, level: 80, verified: false })) || [],
      work_experience: extractedData.work_experience || [],
      education: extractedData.education || []
    };
    
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    const updatedProfile = await Profile.findOneAndUpdate(
      { user_id: userId },
      { ...profileUpdate, role: 'applicant' },
      { new: true, upsert: true }
    );

    res.setHeader("Content-Type", "application/json");
    res.json({ id: updatedProfile._id, ...extractedData, fileUrl });
  } catch (err) {
    console.error('CV processing error:', err);
    res.status(500).json({ error: "CV processing failed" });
  }
});

export default cvRouter;