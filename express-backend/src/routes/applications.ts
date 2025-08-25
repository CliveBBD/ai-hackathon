import express from 'express';
import mongoose from 'mongoose';
import Application from '../models/Application';
import Project from '../models/Project';
import { ApplicantProfile } from '../models/Profile';
import azureOpenAI from '../services/azureOpenAI';
import Notification from '../models/Notification';

const router = express.Router();

const requireAuth = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Get applicant's applications
router.get('/applicant/:applicantId', requireAuth, async (req, res) => {
  try {
    const applications = await Application.find({ applicant_id: req.params.applicantId })
      .populate({
        path: 'project_id',
        select: 'title company location salary_range status'
      })
      .sort({ created_at: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Apply to project
router.post('/', requireAuth, async (req, res) => {
  try {
    const user = req.user as any;
    const { project_id, cover_letter } = req.body;

    if (user.role !== 'applicant') {
      return res.status(403).json({ error: 'Only applicants can apply to projects' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      applicant_id: user._id,
      project_id
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'Already applied to this project' });
    }

    // Get project and applicant profile for AI matching
    const project = await Project.findById(project_id);
    const applicantProfile = await ApplicantProfile.findOne({ user_id: user._id });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!applicantProfile) {
      return res.status(400).json({ error: 'Please complete your profile first' });
    }

    // Calculate AI match score and insights
    const matchResult = await azureOpenAI.calculateMatchScore(applicantProfile, project);

    const application = new Application({
      applicant_id: user._id,
      project_id,
      cover_letter,
      match_score: matchResult.score,
      ai_insights: matchResult.insights,
      created_at: new Date()
    });

    await application.save();

    // Update project application count
    await Project.findByIdAndUpdate(project_id, {
      $inc: { applications_count: 1 }
    });

    // Create notification for recruiter
    await new Notification({
      user_id: project.recruiter_id,
      type: 'new_match',
      title: 'New Application',
      message: `${user.full_name} applied to ${project.title} with ${matchResult.score}% match`,
      data: { applicationId: application._id, projectId: project_id, matchScore: matchResult.score }
    }).save();

    res.status(201).json(application);
  } catch (error) {
    console.error('Application error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Get dashboard statistics for applicant
router.get('/stats/:applicantId', requireAuth, async (req, res) => {
  try {
    const applicantId = req.params.applicantId;
    
    // Get applications
    const applications = await Application.find({ applicant_id: applicantId });
    const totalApplications = applications.length;
    
    // Calculate interviews (interviewed or shortlisted)
    const interviews = applications.filter(app => 
      app.status === 'interviewed' || app.status === 'shortlisted'
    ).length;
    
    // Get profile for profile score
    const profile = await ApplicantProfile.findOne({ user_id: applicantId });
    const profileScore = profile?.profile_score || 0;
    
    // Calculate average skill level
    const avgSkillLevel = profile?.skills && profile.skills.length > 0 
      ? Math.round(profile.skills.reduce((sum, s) => sum + s.level, 0) / profile.skills.length)
      : 0;
    
    // Calculate weekly/monthly changes (simplified - in real app would compare with historical data)
    const weeklyApplications = 0; // Would calculate from date ranges
    const monthlyProfileIncrease = 0; // Would calculate from historical data
    
    res.json({
      applications: totalApplications,
      interviews,
      profileScore,
      skillsProgress: avgSkillLevel,
      weeklyApplications,
      monthlyProfileIncrease,
      scheduledInterviews: applications.filter(app => app.interview_scheduled).length
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// Get job recommendations for applicant
router.get('/recommendations/:applicantId', requireAuth, async (req, res) => {
  try {
    const applicantProfile = await ApplicantProfile.findOne({ user_id: req.params.applicantId });
    
    if (!applicantProfile) {
      return res.status(404).json({ error: 'Applicant profile not found' });
    }

    // Get active projects
    const activeProjects = await Project.find({ status: 'active' }).limit(20);

    // Get AI recommendations
    const recommendations = await azureOpenAI.generateJobRecommendations(
      applicantProfile,
      activeProjects
    );

    // Enrich with project details - filter out invalid ObjectIds
    const enrichedRecommendations = [];
    for (const rec of recommendations.recommendations) {
      try {
        // Check if project_id is a valid ObjectId
        if (rec.project_id && mongoose.Types.ObjectId.isValid(rec.project_id)) {
          const project = await Project.findById(rec.project_id);
          if (project) {
            enrichedRecommendations.push({
              ...rec,
              project
            });
          }
        } else {
          console.warn('Invalid ObjectId for project:', rec.project_id);
        }
      } catch (projectError) {
        console.warn('Failed to fetch project:', rec.project_id, projectError);
      }
    }

    res.json({ recommendations: enrichedRecommendations });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// Update application status (for recruiters)
router.put('/:applicationId/status', requireAuth, async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const user = req.user as any;

    const application = await Application.findById(req.params.applicationId)
      .populate('project_id');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const project = application.project_id as any;
    
    // Check if user is the recruiter for this project
    if (project.recruiter_id.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.applicationId,
      { 
        status,
        interview_feedback: feedback,
        updated_at: new Date()
      },
      { new: true }
    );

    // Create notification for applicant
    await new Notification({
      user_id: application.applicant_id,
      type: 'application_status',
      title: 'Application Status Update',
      message: `Your application for ${project.title} has been ${status}`,
      data: { applicationId: application._id, status }
    }).save();

    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

export default router;