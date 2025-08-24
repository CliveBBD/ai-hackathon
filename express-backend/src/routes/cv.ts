import { Router } from "express";
import multer from "multer";
import { extractCVData } from "../services/cvService";
import { uploadToBlob } from "../services/storageService";
import { CV } from "../models/CV";

const cvRouter = Router();

const requireAuth = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    cb(null, allowed.includes(file.mimetype));
  }
});

cvRouter.post("/upload", requireAuth, upload.any() as any, async (req: any, res: any) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No CV file uploaded" });
    }

    const cvFile = req.files[0];
    
    const fileUrl = await uploadToBlob(cvFile.buffer, cvFile.originalname);
    const extractedData = await extractCVData(cvFile);
    
    const cvDocument = new CV({
      ...extractedData,
      fileUrl
    });
    
    const savedCV = await cvDocument.save();

    res.setHeader("Content-Type", "application/json");
    res.json({ id: savedCV._id, ...extractedData, fileUrl });
  } catch (err) {
    res.status(500).json({ error: "CV processing failed" });
  }
});

export default cvRouter;