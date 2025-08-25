import { Router } from "express";
import multer from "multer";
import { extractCVData } from "../services/cvService";
import { uploadToBlob } from "../services/storageService";
import { ApplicantProfile } from "../models/Profile";
import User from "../models/User";

const cvRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const isAllowed = allowed.includes(file.mimetype);
    cb(null, isAllowed);
  }
});

cvRouter.post("/upload", upload.any() as any, async (req: any, res: any) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No CV file uploaded" });
    }

    const cvFile = req.files[0];
    const fileUrl = await uploadToBlob(cvFile.buffer, cvFile.originalname);
    const extractedData = await extractCVData(cvFile);
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    
    const safeExtractedData = {
      bio: extractedData?.bio || 'Professional seeking new opportunities',
      location: extractedData?.location || 'South Africa',
      skills: extractedData?.skills || ['Communication', 'Problem Solving', 'Teamwork'],
      work_experience: extractedData?.work_experience || [],
      education: extractedData?.education || [],
      linkedin_url: extractedData?.linkedin_url,
      github_url: extractedData?.github_url
    };
    
    let profileScore = 0;
    if (safeExtractedData.bio) profileScore += 15;
    if (safeExtractedData.skills && safeExtractedData.skills.length > 0) profileScore += 25;
    if (safeExtractedData.work_experience && safeExtractedData.work_experience.length > 0) profileScore += 20;
    if (safeExtractedData.education && safeExtractedData.education.length > 0) profileScore += 15;
    if (safeExtractedData.linkedin_url) profileScore += 10;
    if (safeExtractedData.github_url) profileScore += 5;
    
    const profileUpdate = {
      user_id: userId,
      bio: safeExtractedData.bio,
      linkedin_url: safeExtractedData.linkedin_url,
      github_url: safeExtractedData.github_url,
      location: safeExtractedData.location,
      skills: safeExtractedData.skills.map(skill => ({ name: skill, level: 80, verified: false })),
      work_experience: safeExtractedData.work_experience,
      education: safeExtractedData.education,
      certifications: [],
      experience_level: 'entry' as const,
      preferred_salary: { min: 0, max: 0, currency: 'ZAR' },
      availability: 'negotiable' as const,
      remote_preference: 'flexible' as const,
      profile_score: profileScore,
      updated_at: new Date()
    };
    
    await User.findByIdAndUpdate(userId, { 
      role: 'applicant',
      profile_completed: profileScore >= 70,
      updated_at: new Date()
    });
    
    const updatedProfile = await ApplicantProfile.findOneAndUpdate(
      { user_id: userId },
      profileUpdate,
      { new: true, upsert: true }
    );

    const response = { id: updatedProfile._id, ...extractedData, fileUrl };
    res.json(response);
  } catch (err) {
    console.error('CV processing error:', err);
    res.status(500).json({ error: "CV processing failed", details: err });
  }
});

export default cvRouter;