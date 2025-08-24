import { Router } from "express";
import Profile from "../models/profile.model";
import User from "../models/user.model";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = Router();
router.use(isAuthenticated);

// Get user profile
router.get("/:userId", async (req, res) => {
  try {
    const profile = await Profile.findOne({ user_id: req.params.userId });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Create user profile
router.post("/", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }


    const { role, full_name, company } = req.body;
    const userId = (req.user as any)._id;
    
    const existingProfile = await Profile.findOne({ user_id: userId });
    if (existingProfile) {
      return res.status(400).json({ error: "Profile already exists" });
    }

    // Update user with full name
    await User.findByIdAndUpdate(userId, { name: full_name });

    const profile = new Profile({
      user_id: userId,
      role,
      full_name,
      company
    });

    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Failed to create profile" });
  }
});

export default router;