import { Router } from "express";
import multer from "multer";
import { extractCVData } from "../services/cvService";

const cvRouter = Router();

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
    const extractedData = await extractCVData(cvFile);

    res.setHeader("Content-Type", "application/json");
    res.json(extractedData);
  } catch (err) {
    res.status(500).json({ error: "CV processing failed" });
  }
});

export default cvRouter;