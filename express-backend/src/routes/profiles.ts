import express from 'express';
import { ApplicantProfile, RecruiterProfile } from '../models/Profile';
import User from '../models/User';
import { isAuthenticated } from '../middleware/auth.middleware';
import Profile from "../models/profile.model";

const router = express.Router();
router.use(isAuthenticated);

// Create profile (general endpoint)
router.post('/', async (req, res) => {
  try {
    const { role, ...profileData } = req.body;
    
    if (!role || !['recruiter', 'applicant'].includes(role)) {
      return res.status(400).json({ error: 'Valid role is required' });
    }

    const user = req.user as any;
    
    // Update user role first
    await User.findByIdAndUpdate(user._id, { 
      role,
      updated_at: new Date()
    });

    let profile;
    
    if (role === 'applicant') {
      // Create applicant profile
      let profileScore = 0;
      if (profileData.bio) profileScore += 15;
      if (profileData.skills?.length > 0) profileScore += 25;
      if (profileData.work_experience?.length > 0) profileScore += 20;
      if (profileData.education?.length > 0) profileScore += 15;
      if (profileData.certifications?.length > 0) profileScore += 10;
      if (profileData.linkedin_url) profileScore += 10;
      if (profileData.github_url || profileData.portfolio_url) profileScore += 5;

      const applicantData = {
        ...profileData,
        profile_score: profileScore,
        user_id: user._id,
        experience_level: profileData.experience_level || 'entry',
        location: profileData.location || 'Not specified',
        preferred_salary: {
          min: profileData.preferred_salary?.min || 0,
          max: profileData.preferred_salary?.max || 0
        },
        updated_at: new Date()
      };

      profile = await ApplicantProfile.findOne({ user_id: user._id });
      if (profile) {
        profile = await ApplicantProfile.findOneAndUpdate(
          { user_id: user._id },
          applicantData,
          { new: true }
        );
      } else {
        profile = new ApplicantProfile(applicantData);
        await profile.save();
      }

      await User.findByIdAndUpdate(user._id, { 
        profile_completed: profileScore >= 70
      });
    } else {
      // Create recruiter profile
      const recruiterData = {
        ...profileData,
        user_id: user._id,
        years_experience: profileData.years_experience || 0,
        industry: profileData.industry || 'Not specified',
        company_size: profileData.company_size || 'Not specified',
        location: profileData.location || 'Not specified',
        position: profileData.position || 'Not specified',
        updated_at: new Date()
      };

      profile = await RecruiterProfile.findOne({ user_id: user._id });
      if (profile) {
        profile = await RecruiterProfile.findOneAndUpdate(
          { user_id: user._id },
          recruiterData,
          { new: true }
        );
      } else {
        profile = new RecruiterProfile(recruiterData);
        await profile.save();
      }

      await User.findByIdAndUpdate(user._id, { 
        profile_completed: true
      });
    }

    res.json(profile);
  } catch (error) {
    console.error('Profile creation error:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let profile = null;
    if (user.role === 'applicant') {
      // Check the profiles collection first (where CV upload stores data)
      const oldProfile = await Profile.findOne({ user_id: user._id, role: 'applicant' });
      
      if (oldProfile) {
        // Transform to match frontend expectations
        profile = {
          _id: oldProfile._id,
          user_id: oldProfile.user_id,
          bio: oldProfile.bio || '',
          location: oldProfile.location || 'Not specified',
          linkedin_url: oldProfile.linkedin_url,
          github_url: oldProfile.github_url,
          skills: oldProfile.skills || [],
          work_experience: oldProfile.work_experience || [],
          education: oldProfile.education || [],
          certifications: oldProfile.certifications || [],
          experience_level: 'entry',
          preferred_salary: {
            min: oldProfile.salary_expectation?.min || 0,
            max: oldProfile.salary_expectation?.max || 0,
            currency: oldProfile.salary_expectation?.currency || 'ZAR'
          },
          availability: oldProfile.availability || 'negotiable',
          remote_preference: 'flexible',
          profile_score: oldProfile.profile_score || 0,
          created_at: oldProfile.created_at,
          updated_at: oldProfile.updated_at
        };
      } else {
        // Fallback to ApplicantProfile collection
        profile = await ApplicantProfile.findOne({ user_id: user._id });
      }
    } else if (user.role === 'recruiter') {
      profile = await RecruiterProfile.findOne({ user_id: user._id });
    }

    res.json({ user, profile });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Create/Update applicant profile
router.post('/applicant', async (req, res) => {
  try {
    const user = req.user as any;
    
    // Calculate profile score based on completeness
    const profileData = req.body;
    let profileScore = 0;
    
    if (profileData.bio) profileScore += 15;
    if (profileData.skills?.length > 0) profileScore += 25;
    if (profileData.work_experience?.length > 0) profileScore += 20;
    if (profileData.education?.length > 0) profileScore += 15;
    if (profileData.certifications?.length > 0) profileScore += 10;
    if (profileData.linkedin_url) profileScore += 10;
    if (profileData.github_url || profileData.portfolio_url) profileScore += 5;

    profileData.profile_score = profileScore;
    profileData.user_id = user._id;
    profileData.updated_at = new Date();

    let profile = await ApplicantProfile.findOne({ user_id: user._id });
    
    if (profile) {
      profile = await ApplicantProfile.findOneAndUpdate(
        { user_id: user._id },
        profileData,
        { new: true }
      );
    } else {
      profile = new ApplicantProfile(profileData);
      await profile.save();
    }

    // Update user profile completion status
    await User.findByIdAndUpdate(user._id, { 
      profile_completed: profileScore >= 70,
      updated_at: new Date()
    });

    res.json(profile);
  } catch (error) {
    console.error('Profile creation error:', error);
    res.status(500).json({ error: 'Failed to create/update profile' });
  }
});

// Create/Update recruiter profile
router.post('/recruiter', async (req, res) => {
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

    // Update user profile completion status
    await User.findByIdAndUpdate(userId, { 
      profile_completed: true,
      updated_at: new Date()
    });
    res.send("Successfully updated user");
  } catch (error) {
    console.error('Recruiter profile error:', error);
    res.status(500).json({ error: 'Failed to create/update recruiter profile' });
  }
});

// Update user role
router.put('/role', async (req, res) => {
  try {
    const user = req.user as any;
    const { role } = req.body;

    if (!['recruiter', 'applicant'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    await User.findByIdAndUpdate(user._id, { 
      role,
      profile_completed: false, // Reset profile completion when changing roles
      updated_at: new Date()
    });

    res.json({ message: 'Role updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update role' });
  }
});

export default router;