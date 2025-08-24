import { Router } from "express";
import { generatePrompt } from "../services/promptService";
import { isAuthenticated } from "../middleware/auth.middleware";

const promptsRouter = Router();
promptsRouter.use(isAuthenticated);

promptsRouter.post("/", async (req, res) => {
  try {
    const { action } = req.body;
    const result = await generatePrompt(action);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Prompt generation failed" });
  }
});

export default promptsRouter;
