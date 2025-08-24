import express from 'express';
import { ApplicantProfile } from '../models/Profile';
import Project from '../models/Project';
import azureOpenAI from '../services/azureOpenAI';
import Notification from '../models/Notification';

const router = express.Router();

const requireAuth = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Get skill coaching recommendations
router.get('/:userId/recommendations', requireAuth, async (req, res) => {
  try {
    const applicantProfile = await ApplicantProfile.findOne({ user_id: req.params.userId });
    
    if (!applicantProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Get market trends from active job postings
    const activeProjects = await Project.find({ status: 'active' });
    const skillDemand: { [key: string]: number } = {};
    
    activeProjects.forEach(project => {
      project.required_skills.forEach(skill => {
        skillDemand[skill.toLowerCase()] = (skillDemand[skill.toLowerCase()] || 0) + 1;
      });
      project.preferred_skills.forEach(skill => {
        skillDemand[skill.toLowerCase()] = (skillDemand[skill.toLowerCase()] || 0) + 0.5;
      });
    });

    const marketTrends = Object.entries(skillDemand)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([skill]) => skill);

    // Get AI recommendations
    const recommendations = await azureOpenAI.generateSkillRecommendations(
      applicantProfile,
      marketTrends
    );

    res.json(recommendations);
  } catch (error) {
    console.error('Coaching recommendations error:', error);
    res.status(500).json({ error: 'Failed to get coaching recommendations' });
  }
});

// Update skill level
router.put('/:userId/skills/:skillName', requireAuth, async (req, res) => {
  try {
    const { level } = req.body;
    const { userId, skillName } = req.params;

    if (level < 0 || level > 100) {
      return res.status(400).json({ error: 'Skill level must be between 0 and 100' });
    }

    const profile = await ApplicantProfile.findOne({ user_id: userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Update or add skill
    const skillIndex = profile.skills.findIndex(s => s.name.toLowerCase() === skillName.toLowerCase());
    
    if (skillIndex >= 0) {
      profile.skills[skillIndex].level = level;
    } else {
      profile.skills.push({
        name: skillName,
        level,
        verified: false
      });
    }

    // Recalculate profile score
    let profileScore = 0;
    if (profile.bio) profileScore += 15;
    if (profile.skills.length > 0) profileScore += 25;
    if (profile.work_experience.length > 0) profileScore += 20;
    if (profile.education.length > 0) profileScore += 15;
    if (profile.certifications.length > 0) profileScore += 10;
    if (profile.linkedin_url) profileScore += 10;
    if (profile.github_url || profile.portfolio_url) profileScore += 5;

    profile.profile_score = profileScore;
    profile.updated_at = new Date();

    await profile.save();

    // Create notification for skill improvement
    if (level >= 80) {
      await new Notification({
        user_id: userId,
        type: 'skill_recommendation',
        title: 'Skill Milestone Achieved!',
        message: `Congratulations! You've reached ${level}% proficiency in ${skillName}`,
        data: { skill: skillName, level }
      }).save();
    }

    res.json(profile);
  } catch (error) {
    console.error('Skill update error:', error);
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

// Get learning resources for a skill
router.get('/:userId/resources/:skillName', requireAuth, async (req, res) => {
  try {
    const { skillName } = req.params;
    
    // Mock learning resources - in production, this could integrate with learning platforms
    const resources = [
      {
        title: `${skillName} Fundamentals`,
        type: 'course',
        provider: 'Coursera',
        url: `https://coursera.org/search?query=${encodeURIComponent(skillName)}`,
        free: false,
        duration: '4-6 weeks',
        rating: 4.5
      },
      {
        title: `Learn ${skillName}`,
        type: 'tutorial',
        provider: 'freeCodeCamp',
        url: `https://freecodecamp.org`,
        free: true,
        duration: '2-3 weeks',
        rating: 4.7
      },
      {
        title: `${skillName} Certification`,
        type: 'certification',
        provider: 'Microsoft',
        url: `https://learn.microsoft.com`,
        free: false,
        duration: '1-2 months',
        rating: 4.6
      },
      {
        title: `${skillName} Documentation`,
        type: 'documentation',
        provider: 'Official Docs',
        url: '#',
        free: true,
        duration: 'Self-paced',
        rating: 4.8
      }
    ];

    res.json({ resources });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get learning resources' });
  }
});

// Get skill analytics
router.get('/:userId/analytics', requireAuth, async (req, res) => {
  try {
    const profile = await ApplicantProfile.findOne({ user_id: req.params.userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Calculate skill analytics
    const skillAnalytics = {
      totalSkills: profile.skills.length,
      averageLevel: profile.skills.length > 0 
        ? Math.round(profile.skills.reduce((sum, skill) => sum + skill.level, 0) / profile.skills.length)
        : 0,
      expertSkills: profile.skills.filter(s => s.level >= 80).length,
      improvingSkills: profile.skills.filter(s => s.level >= 50 && s.level < 80).length,
      beginnerSkills: profile.skills.filter(s => s.level < 50).length,
      profileCompleteness: profile.profile_score,
      strongestSkills: profile.skills
        .sort((a, b) => b.level - a.level)
        .slice(0, 5)
        .map(s => ({ name: s.name, level: s.level })),
      skillsToImprove: profile.skills
        .filter(s => s.level < 70)
        .sort((a, b) => a.level - b.level)
        .slice(0, 3)
        .map(s => ({ name: s.name, level: s.level, target: Math.min(100, s.level + 20) }))
    };

    res.json(skillAnalytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get skill analytics' });
  }
});

export default router;